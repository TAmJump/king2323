/* ============================================================
   KINGMAKER 23:23 — Google Translate adapter (v3 - MutationObserver)
   ============================================================ */

(function () {
  'use strict';

  let comboReady = false;
  let pendingLang = null;

  // 1. Google's callback
  window.googleTranslateElementInit = function () {
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ja,en,ko,hi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
      console.log('[i18n] TranslateElement constructor called');
    } catch (e) {
      console.error('[i18n] init error:', e);
    }
  };

  // 2. Load element.js
  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  s.onerror = () => console.error('[i18n] Failed to load Google Translate script');
  document.head.appendChild(s);

  // 3. Watch for combo via MutationObserver (more reliable than polling)
  function setupComboWatch() {
    const target = document.getElementById('google_translate_element');
    if (!target) {
      console.error('[i18n] #google_translate_element not found in DOM');
      return;
    }

    const checkCombo = () => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo && !comboReady) {
        comboReady = true;
        console.log('[i18n] ✓ Combo ready, options:', combo.options.length);
        if (pendingLang) {
          applyLang(pendingLang);
          pendingLang = null;
        }
      }
    };

    // Initial check (in case it's already there)
    checkCombo();

    // Watch for DOM changes in the container
    const observer = new MutationObserver(() => checkCombo());
    observer.observe(target, { childList: true, subtree: true });

    // Safety timeout: 15s
    setTimeout(() => {
      if (!comboReady) {
        console.error('[i18n] ✗ Combo never ready after 15s');
        console.error('[i18n] Container HTML:', target.innerHTML || '(empty)');
        console.error('[i18n] typeof google.translate:', typeof google?.translate);
      }
    }, 15000);
  }

  // 4. Apply language
  function applyLang(lang) {
    if (!comboReady) {
      pendingLang = lang;
      console.log('[i18n] Queuing (not ready):', lang);
      return;
    }
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) {
      console.error('[i18n] Combo disappeared');
      return;
    }
    combo.value = lang;
    combo.dispatchEvent(new Event('change'));
    console.log('[i18n] Applied:', lang);
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  // 5. Wire buttons
  function init() {
    const btns = document.querySelectorAll('.lang-btn');
    console.log('[i18n] Wiring', btns.length, 'buttons');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyLang(btn.dataset.lang);
      });
    });

    setupComboWatch();

    // Restore from cookie
    const m = document.cookie.match(/googtrans=\/[a-z]+\/([a-z\-]+)/);
    if (m && m[1] !== 'en') {
      setTimeout(() => applyLang(m[1].split('-')[0]), 1500);
    } else {
      document.querySelector('.lang-btn[data-lang="en"]')?.classList.add('active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
