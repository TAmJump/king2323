/* ============================================================
   KINGMAKER 23:23 — Google Translate adapter (robust)
   ============================================================ */

(function () {
  'use strict';

  let comboReady = false;
  let pendingLang = null;

  // 1. Google's callback (must exist on window before script loads)
  window.googleTranslateElementInit = function () {
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ja,en,ko,hi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
      console.log('[i18n] Google Translate initialized');

      // Wait for the <select> Google injects, then unblock
      const waitForCombo = () => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          comboReady = true;
          console.log('[i18n] Combo ready, options:', combo.options.length);
          if (pendingLang) {
            applyLang(pendingLang);
            pendingLang = null;
          }
        } else {
          setTimeout(waitForCombo, 100);
        }
      };
      waitForCombo();
    } catch (e) {
      console.error('[i18n] init error:', e);
    }
  };

  // 2. Load element.js (https for cross-origin compatibility)
  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  s.onerror = () => console.error('[i18n] Failed to load Google Translate script');
  document.head.appendChild(s);

  // 3. Apply language by driving the hidden combo
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

  // 4. Wire buttons
  function wireButtons() {
    const btns = document.querySelectorAll('.lang-btn');
    console.log('[i18n] Wiring', btns.length, 'buttons');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyLang(btn.dataset.lang);
      });
    });

    // Restore previous selection from cookie
    const m = document.cookie.match(/googtrans=\/[a-z]+\/([a-z\-]+)/);
    if (m && m[1] !== 'en') {
      setTimeout(() => applyLang(m[1].split('-')[0]), 1200);
    } else {
      document.querySelector('.lang-btn[data-lang="en"]')?.classList.add('active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButtons);
  } else {
    wireButtons();
  }
})();
