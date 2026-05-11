/* ============================================================
   KINGMAKER 23:23 — Google Translate adapter
   - Loads Google's element.js (hidden widget)
   - Our visible JA/EN/KO/HI buttons trigger Google's combo
   - Hides Google's default banner/UI
   - Persists chosen language via cookie (Google's mechanism)
   ============================================================ */

(function () {
  'use strict';

  // ---- 1. Inject the Google Translate <script> ----
  // The function name MUST match the callback param.
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',                       // source lang = English
      includedLanguages: 'ja,en,ko,hi',         // available targets
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');
  };

  const s = document.createElement('script');
  s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.head.appendChild(s);

  // ---- 2. Wire our visible JA/EN/KO/HI buttons to Google's hidden combo ----
  function triggerTranslate(lang) {
    // Find Google's <select> element (it gets injected into #google_translate_element)
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) {
      // Not ready yet — retry shortly
      setTimeout(() => triggerTranslate(lang), 200);
      return;
    }
    combo.value = lang;
    combo.dispatchEvent(new Event('change'));

    // Update visible active state on our buttons
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => triggerTranslate(btn.dataset.lang));
    });

    // ---- 3. Auto-restore last language from Google's cookie ----
    // Google writes "googtrans" cookie as "/en/ja" form
    const m = document.cookie.match(/googtrans=\/[a-z]+\/([a-z]+)/);
    if (m && m[1] !== 'en') {
      // Apply after Google loads
      setTimeout(() => triggerTranslate(m[1]), 800);
    } else {
      document.querySelector('.lang-btn[data-lang="en"]')?.classList.add('active');
    }
  });
})();
