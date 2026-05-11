/* ============================================================
   KINGMAKER 23:23 — Google Translate (cookie-driven approach)

   The InlineLayout.SIMPLE widget no longer exposes a <select>
   to programmatically drive. Instead, set Google's "googtrans"
   cookie directly and reload — Google reads the cookie on load
   and translates the entire page.

   Cookie format: googtrans=/{srcLang}/{tgtLang}
   ============================================================ */

(function () {
  'use strict';

  // Google Translate init: needed so Google's translation engine
  // reads the cookie on page load and actually does the work.
  window.googleTranslateElementInit = function () {
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ja,en,ko,hi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
      console.log('[i18n] Google Translate engine initialized');
    } catch (e) {
      console.error('[i18n] init error:', e);
    }
  };

  // Load Google Translate
  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  s.onerror = () => console.error('[i18n] Failed to load Google Translate script');
  document.head.appendChild(s);

  // Set googtrans cookie for current domain + parent domain (.tamjump.com)
  function setGoogTransCookie(lang) {
    const host = window.location.hostname;
    // Get parent domain (e.g., "king2323.tamjump.com" → ".tamjump.com")
    const parts = host.split('.');
    const parentDomain = parts.length > 1 ? '.' + parts.slice(-2).join('.') : host;

    const value = lang === 'en' ? '' : `/auto/${lang}`;
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    const expiresStr = expires.toUTCString();

    // Set on current host
    document.cookie = `googtrans=${value};path=/;expires=${expiresStr}`;
    // Set on parent domain (so it works across subdomains)
    document.cookie = `googtrans=${value};domain=${parentDomain};path=/;expires=${expiresStr}`;

    console.log('[i18n] Cookie set:', value, 'for', parentDomain);
  }

  // Update button active state visually
  function updateButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  // Apply language: set cookie, reload
  function applyLang(lang) {
    console.log('[i18n] Applying:', lang);
    setGoogTransCookie(lang);
    updateButtons(lang);
    // Brief delay so the cookie is written, then reload
    setTimeout(() => window.location.reload(), 100);
  }

  // Read current language from cookie
  function getCurrentLang() {
    const m = document.cookie.match(/googtrans=\/[a-z]+\/([a-z\-]+)/);
    return m ? m[1].split('-')[0] : 'en';
  }

  // Initialize on DOM ready
  function init() {
    const btns = document.querySelectorAll('.lang-btn');
    console.log('[i18n] Wiring', btns.length, 'buttons');

    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        applyLang(btn.dataset.lang);
      });
    });

    // Mark current language as active
    const current = getCurrentLang();
    console.log('[i18n] Current lang:', current);
    updateButtons(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
