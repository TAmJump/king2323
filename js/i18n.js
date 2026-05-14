/* ============================================================
   KINGMAKER 23:23 — Google Translate (cookie-driven, 108 languages)
   Version: v20260514d  (printed to console at load for debugging)
   ============================================================ */

(function () {
  'use strict';

  // Diagnostic banner so the operator can verify in DevTools console
  // that the current build is being served (not an old cached copy).
  // If a user reports a translation bug, ask them to share the console
  // output — if this line is missing or shows an older version, they
  // are hitting a stale cache (CF / browser disk).
  console.log('%c[i18n] v20260514d loaded · cookie:', 'color:#b8862d;font-weight:bold',
              document.cookie || '(none)');

  // Full Google Translate language list (108 languages).
  // First 10 entries = TIER 1 priority (per TAmJ translation design):
  //   English, Japanese, Spanish, Hindi, Korean, Vietnamese,
  //   Portuguese, Indonesian, Thai, French.
  // These cover US, Japan, India, Korea, Vietnam, Mexico, Brazil,
  // Southeast Asia. The dropdown UI surfaces them at top with a
  // visual separator before the rest.
  // [code, English name, Native name]
  const LANGS = [
    // === TIER 1 (10 priority languages) ===
    ['en',    'English',     'English'],
    ['ja',    'Japanese',    '日本語'],
    ['es',    'Spanish',     'Español'],
    ['hi',    'Hindi',       'हिन्दी'],
    ['ko',    'Korean',      '한국어'],
    ['vi',    'Vietnamese',  'Tiếng Việt'],
    ['pt',    'Portuguese',  'Português'],
    ['id',    'Indonesian',  'Bahasa Indonesia'],
    ['th',    'Thai',        'ไทย'],
    ['fr',    'French',      'Français'],
    // === TIER 2 (the rest, alphabetical by English name) ===
    ['zh-CN', 'Chinese (Simplified)', '简体中文'],
    ['zh-TW', 'Chinese (Traditional)', '繁體中文'],
    ['de',    'German',      'Deutsch'],
    ['it',    'Italian',     'Italiano'],
    ['ru',    'Russian',     'Русский'],
    ['ar',    'Arabic',      'العربية'],
    ['tr', 'Turkish', 'Türkçe'],
    ['nl', 'Dutch', 'Nederlands'],
    ['pl', 'Polish', 'Polski'],
    ['sv', 'Swedish', 'Svenska'],
    ['da', 'Danish', 'Dansk'],
    ['no', 'Norwegian', 'Norsk'],
    ['fi', 'Finnish', 'Suomi'],
    ['cs', 'Czech', 'Čeština'],
    ['el', 'Greek', 'Ελληνικά'],
    ['he', 'Hebrew', 'עברית'],
    ['hu', 'Hungarian', 'Magyar'],
    ['ro', 'Romanian', 'Română'],
    ['uk', 'Ukrainian', 'Українська'],
    ['bg', 'Bulgarian', 'Български'],
    ['hr', 'Croatian', 'Hrvatski'],
    ['sk', 'Slovak', 'Slovenčina'],
    ['sl', 'Slovenian', 'Slovenščina'],
    ['lt', 'Lithuanian', 'Lietuvių'],
    ['lv', 'Latvian', 'Latviešu'],
    ['et', 'Estonian', 'Eesti'],
    ['fa', 'Persian', 'فارسی'],
    ['ur', 'Urdu', 'اردو'],
    ['bn', 'Bengali', 'বাংলা'],
    ['ta', 'Tamil', 'தமிழ்'],
    ['te', 'Telugu', 'తెలుగు'],
    ['ml', 'Malayalam', 'മലയാളം'],
    ['mr', 'Marathi', 'मराठी'],
    ['gu', 'Gujarati', 'ગુજરાતી'],
    ['kn', 'Kannada', 'ಕನ್ನಡ'],
    ['pa', 'Punjabi', 'ਪੰਜਾਬੀ'],
    ['si', 'Sinhala', 'සිංහල'],
    ['ne', 'Nepali', 'नेपाली'],
    ['my', 'Burmese', 'မြန်မာ'],
    ['km', 'Khmer', 'ខ្មែរ'],
    ['lo', 'Lao', 'ລາວ'],
    ['mn', 'Mongolian', 'Монгол'],
    ['ms', 'Malay', 'Bahasa Melayu'],
    ['tl', 'Filipino', 'Filipino'],
    ['sw', 'Swahili', 'Kiswahili'],
    ['af', 'Afrikaans', 'Afrikaans'],
    ['sq', 'Albanian', 'Shqip'],
    ['am', 'Amharic', 'አማርኛ'],
    ['hy', 'Armenian', 'Հայերեն'],
    ['az', 'Azerbaijani', 'Azərbaycan'],
    ['eu', 'Basque', 'Euskara'],
    ['be', 'Belarusian', 'Беларуская'],
    ['bs', 'Bosnian', 'Bosanski'],
    ['ca', 'Catalan', 'Català'],
    ['ceb', 'Cebuano', 'Cebuano'],
    ['ny', 'Chichewa', 'Chichewa'],
    ['co', 'Corsican', 'Corsu'],
    ['eo', 'Esperanto', 'Esperanto'],
    ['fy', 'Frisian', 'Frysk'],
    ['gl', 'Galician', 'Galego'],
    ['ka', 'Georgian', 'ქართული'],
    ['ht', 'Haitian Creole', 'Kreyòl'],
    ['ha', 'Hausa', 'Hausa'],
    ['haw', 'Hawaiian', 'ʻŌlelo Hawaiʻi'],
    ['hmn', 'Hmong', 'Hmong'],
    ['is', 'Icelandic', 'Íslenska'],
    ['ig', 'Igbo', 'Igbo'],
    ['ga', 'Irish', 'Gaeilge'],
    ['jw', 'Javanese', 'Basa Jawa'],
    ['kk', 'Kazakh', 'Қазақ'],
    ['ku', 'Kurdish', 'Kurdî'],
    ['ky', 'Kyrgyz', 'Кыргызча'],
    ['la', 'Latin', 'Latina'],
    ['lb', 'Luxembourgish', 'Lëtzebuergesch'],
    ['mk', 'Macedonian', 'Македонски'],
    ['mg', 'Malagasy', 'Malagasy'],
    ['mt', 'Maltese', 'Malti'],
    ['mi', 'Maori', 'Māori'],
    ['ps', 'Pashto', 'پښتو'],
    ['sm', 'Samoan', 'Gagana Samoa'],
    ['gd', 'Scots Gaelic', 'Gàidhlig'],
    ['sr', 'Serbian', 'Српски'],
    ['st', 'Sesotho', 'Sesotho'],
    ['sn', 'Shona', 'Shona'],
    ['sd', 'Sindhi', 'سنڌي'],
    ['so', 'Somali', 'Soomaali'],
    ['su', 'Sundanese', 'Basa Sunda'],
    ['tg', 'Tajik', 'Тоҷикӣ'],
    ['tt', 'Tatar', 'Татар'],
    ['ug', 'Uyghur', 'ئۇيغۇرچە'],
    ['uz', 'Uzbek', 'Oʻzbek'],
    ['cy', 'Welsh', 'Cymraeg'],
    ['xh', 'Xhosa', 'isiXhosa'],
    ['yi', 'Yiddish', 'ייִדיש'],
    ['yo', 'Yoruba', 'Yorùbá'],
    ['zu', 'Zulu', 'isiZulu']
  ];

  // ---- Google Translate engine init ----
  window.googleTranslateElementInit = function () {
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: LANGS.map(l => l[0]).join(','),
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    } catch (e) {
      console.error('[i18n] init error:', e);
    }
  };

  const s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  s.onerror = () => console.error('[i18n] Failed to load Google Translate script');
  document.head.appendChild(s);

  // ---- Cookie management ----
  //
  // ARCHITECTURE (after multiple iterations — this is the correct one):
  //
  // The page is authored BILINGUALLY by design (per v1.1 "Weight of the
  // Crown"): English headlines / brand-eyebrows / titles alongside
  // Japanese subtitles and paragraphs.  Neither language is canonical;
  // both coexist intentionally.
  //
  // Therefore the cookie format must be /auto/<target>, NOT /ja/<target>
  // or /en/<target>.  /auto/ tells Google Translate to detect the source
  // language PER TEXT NODE (and per lang attribute), so:
  //
  //   target = ja  →  EN elements get translated to JA; JA elements stay
  //   target = en  →  JA elements get translated to EN; EN elements stay
  //   target = ko  →  both EN and JA elements get translated to KO
  //   target = any →  result is uniform in target language
  //
  // For Google's auto-detection to be reliable, JP-text elements should
  // carry lang="ja" explicitly.  This is done by markJpElements() at
  // page load — it adds lang="ja" to .jp and *-jp classes (the
  // existing markup convention for Japanese subtitles).
  //
  // The cookie is set for EVERY picker selection including 'en' — there
  // is NO "clear cookie" case in normal user flow.  Default lang is 'en'
  // (matches <html lang="en">; the page header / brand chrome is English).
  function setGoogTransCookie(lang) {
    const host = window.location.hostname;
    const parts = host.split('.');
    const parentDomain = parts.length > 1 ? '.' + parts.slice(-2).join('.') : host;

    // Cookie hygiene: explicitly DELETE any stale googtrans cookies on
    // all path/domain combinations we might have written previously.
    // Without this, the browser ends up with duplicate googtrans cookies
    // (e.g. googtrans=; googtrans=/ja/en) which confuses the widget.
    const epoch = 'Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `googtrans=; path=/; expires=${epoch}`;
    document.cookie = `googtrans=; path=/; domain=${parentDomain}; expires=${epoch}`;
    document.cookie = `googtrans=; path=/; domain=${host}; expires=${epoch}`;
    document.cookie = `googtrans=; path=/; domain=.${host}; expires=${epoch}`;

    if (!lang) return;

    // Set the new cookie for /auto/<target>. /auto/ engages per-element
    // source detection. Both path-only and parent-domain cookies are
    // written so the widget reads it regardless of subdomain context.
    const value = `/auto/${lang}`;
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    const expiresStr = expires.toUTCString();
    document.cookie = `googtrans=${value}; path=/; expires=${expiresStr}`;
    document.cookie = `googtrans=${value}; path=/; domain=${parentDomain}; expires=${expiresStr}`;
  }

  function getCurrentLang() {
    // Cookie format: /<src-or-auto>/<target>. Capture target.
    // No cookie = default language = 'en' (matches <html lang="en">).
    const m = document.cookie.match(/googtrans=\/[a-z\-]+\/([a-z\-A-Z]+)/);
    return m ? m[1] : 'en';
  }

  // ---- localStorage persistence + browser language auto-detect ----
  // Per TAmJ translation design §4:
  //   1. Browser language is read on first visit
  //   2. If supported (in LANGS), auto-set picker to that language
  //   3. Otherwise default to English
  //   4. User's explicit picker choice is saved to localStorage,
  //      and always wins over browser-language autodetect on reload.
  const LS_KEY = 'kingmaker.lang';

  function persistLang(lang) {
    try { localStorage.setItem(LS_KEY, lang); } catch (e) {}
  }
  function readPersistedLang() {
    try { return localStorage.getItem(LS_KEY); } catch (e) { return null; }
  }
  function detectBrowserLang() {
    // navigator.language returns e.g. 'ja', 'en-US', 'zh-CN'.
    // We try exact match first, then primary subtag.
    const codes = LANGS.map(l => l[0]);
    const langs = (navigator.languages && navigator.languages.length)
                  ? navigator.languages : [navigator.language || 'en'];
    for (const l of langs) {
      if (codes.includes(l)) return l;
      const primary = l.split('-')[0];
      if (codes.includes(primary)) return primary;
    }
    return 'en';
  }

  function applyLang(lang) {
    persistLang(lang);
    setGoogTransCookie(lang);
    setTimeout(() => window.location.reload(), 100);
  }

  // On first-ever page load, sync cookie with persisted/browser
  // language. If user has visited before, persisted choice wins.
  // Otherwise, auto-detect from navigator.language.
  function bootstrapLang() {
    const fromCookie = getCurrentLang();
    const persisted = readPersistedLang();

    // Case A: explicit cookie present (user picked something this
    // session or recently). Sync persisted to match cookie so
    // localStorage stays current.
    if (document.cookie.includes('googtrans=/')) {
      persistLang(fromCookie);
      return fromCookie;
    }

    // Case B: cookie cleared but persisted exists → re-apply.
    if (persisted && LANGS.some(l => l[0] === persisted)) {
      if (persisted !== 'en') {
        setGoogTransCookie(persisted);
        // Reload so Google Translate widget picks up the cookie.
        setTimeout(() => window.location.reload(), 50);
        return persisted;
      }
      return 'en';
    }

    // Case C: first-ever visit. Detect browser language.
    const detected = detectBrowserLang();
    if (detected && detected !== 'en') {
      persistLang(detected);
      setGoogTransCookie(detected);
      setTimeout(() => window.location.reload(), 50);
      return detected;
    }
    persistLang('en');
    return 'en';
  }

  // ---- Dropdown UI builder ----
  function buildDropdown(picker) {
    if (picker.dataset.built === '1') return;
    picker.dataset.built = '1';

    const current = getCurrentLang();
    const currentLang = LANGS.find(l => l[0] === current) || LANGS[0];

    // Clear old content
    picker.innerHTML = '';
    picker.classList.add('lang-picker-v2');

    // Trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'lang-trigger notranslate';
    trigger.setAttribute('translate', 'no');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<span class="lang-trigger-label">${currentLang[2]}</span><span class="lang-trigger-arrow">▾</span>`;
    picker.appendChild(trigger);

    // Panel (hidden by default)
    const panel = document.createElement('div');
    panel.className = 'lang-panel notranslate';
    panel.setAttribute('translate', 'no');
    panel.setAttribute('role', 'listbox');
    panel.innerHTML = `
      <div class="lang-panel-head">
        <input type="text" class="lang-search" placeholder="Search language… / 言語を検索…" aria-label="Search language" autocomplete="off" />
        <button type="button" class="lang-panel-close" aria-label="Close">✕</button>
      </div>
      <div class="lang-panel-list"></div>
    `;
    document.body.appendChild(panel);

    const listEl = panel.querySelector('.lang-panel-list');
    const searchEl = panel.querySelector('.lang-search');
    const closeEl = panel.querySelector('.lang-panel-close');

    function renderList(filter) {
      const q = (filter || '').toLowerCase().trim();
      listEl.innerHTML = '';
      let count = 0;
      const TIER1_COUNT = 10;  // First 10 in LANGS are TAmJ priority
      let separatorShown = false;
      LANGS.forEach(([code, name, native], idx) => {
        const hit = !q || code.toLowerCase().includes(q) ||
                    name.toLowerCase().includes(q) ||
                    native.toLowerCase().includes(q);
        if (!hit) return;
        // Insert a visual separator between TIER 1 and the rest, but
        // only when not filtering (filter shows a flat list).
        if (!q && idx === TIER1_COUNT && !separatorShown) {
          const sep = document.createElement('div');
          sep.className = 'lang-tier-separator notranslate';
          sep.setAttribute('translate', 'no');
          sep.textContent = '— More languages —';
          listEl.appendChild(sep);
          separatorShown = true;
        }
        count++;
        const opt = document.createElement('button');
        opt.type = 'button';
        opt.className = 'lang-opt notranslate';
        opt.setAttribute('translate', 'no');
        opt.setAttribute('role', 'option');
        opt.dataset.lang = code;
        if (code === current) opt.classList.add('is-current');
        opt.innerHTML = `<span class="lang-opt-native">${native}</span><span class="lang-opt-code">${code.toUpperCase()}</span>`;
        opt.addEventListener('click', () => applyLang(code));
        listEl.appendChild(opt);
      });
      if (!count) {
        listEl.innerHTML = '<div class="lang-empty">No match.</div>';
      }
    }

    function openPanel() {
      panel.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('lang-panel-open');
      renderList('');
      setTimeout(() => searchEl.focus(), 60);
    }
    function closePanel() {
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('lang-panel-open');
      searchEl.value = '';
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    closeEl.addEventListener('click', closePanel);
    searchEl.addEventListener('input', () => renderList(searchEl.value));
    panel.addEventListener('click', (e) => { if (e.target === panel) closePanel(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });
  }

  // ---- Init ----

  // ============================================================
  // BRAND LOCK (never translated, in any language, ever)
  // ============================================================
  // Per TAmJ translation design:
  //   "翻訳していい部分" / "Never Translate" lists.
  //
  // The page already uses class="notranslate" translate="no" on
  // brand-locked elements. This helper applies the same protection
  // to elements that match a list of brand-vocabulary classes —
  // safety net so future additions of brand elements don't need
  // to remember the notranslate/translate=no boilerplate.
  //
  // Brand-locked content:
  //   - "KINGMAKER 23:23" / "KINGMAKER" wordmark
  //   - "THE BELL" / "THE TRIAL" / "THE THREE" / "THE KING"
  //   - "GRANT" / "CROWN"
  //   - Brand copy: "No Bell. No Crown." / "To be chosen, you must choose."
  //   - Hard numerics: 23:23, 100, 5 Minutes
  //   - Price: "¥100 / $0.69" composite (.price-fixed)
  //   - Hero h1 (already has notranslate)
  //   - Countdown digits
  //   - Language picker UI elements (already protected)
  //
  // Selectors marked here are ALL guaranteed never to be translated
  // by Google Translate (via .notranslate class + translate="no"
  // attribute), AND never to be touched by our bilingual swap or
  // data-i18n-html dictionary (those check for .brand-lock and skip).
  function markBrandLock() {
    // CSS class marker. Add to any element that should be brand-locked.
    document.querySelectorAll('.brand-lock').forEach(el => {
      el.classList.add('notranslate');
      el.setAttribute('translate', 'no');
    });
  }

  // ============================================================
  // LEGAL DISCLAIMER (for Legal pages: Terms, Privacy, etc.)
  // ============================================================
  // Per TAmJ translation design §7. Available globally for any
  // Legal page in tamjump.com to render at the top of localized
  // legal content. Site uses bilingual official model:
  //   English + Japanese = official governing text
  //   Other languages    = reference translations only
  window.KINGMAKER_LEGAL_DISCLAIMER = {
    en: 'English and Japanese are the official governing texts. ' +
        'Other languages are reference translations.',
    ja: '英語版および日本語版を正式本文とし、他言語版は参考訳として提供されます。',
    // Reference translations for the disclaimer itself in TIER 1 languages
    es: 'Los textos oficiales son inglés y japonés. Otros idiomas son traducciones de referencia.',
    hi: 'अंग्रेज़ी और जापानी आधिकारिक पाठ हैं। अन्य भाषाएँ केवल संदर्भ अनुवाद हैं।',
    ko: '영어와 일본어가 공식 본문입니다. 다른 언어는 참고 번역입니다.',
    vi: 'Tiếng Anh và tiếng Nhật là văn bản chính thức. Các ngôn ngữ khác là bản dịch tham khảo.',
    pt: 'Os textos oficiais são em inglês e japonês. Outros idiomas são traduções de referência.',
    id: 'Bahasa Inggris dan Jepang adalah teks resmi. Bahasa lain hanya terjemahan referensi.',
    th: 'ภาษาอังกฤษและภาษาญี่ปุ่นเป็นข้อความทางการ ภาษาอื่นๆ เป็นคำแปลอ้างอิงเท่านั้น',
    fr: 'Les textes officiels sont en anglais et japonais. Les autres langues sont des traductions de référence.'
  };


  // Brand vocabulary (Bell, Bell Nature, Crown Slot, Royal Duty, THE TRIAL, 23:23)
  // is marked translate="no" in the HTML and is NEVER translated.
  // Languages not in this table fall back to English (the original markup).
  // To adjust wording, edit values here — no other code change needed.
  const MENU_TRANSLATIONS = {
    'menu.money':    { ja:'Money(資金論)', ko:'자금론', 'zh-CN':'资金论', 'zh-TW':'資金論', hi:'धन का तर्क', es:'Lógica del Dinero', fr:"Logique de l'Argent", de:'Geldlogik', pt:'Lógica do Dinheiro', ru:'Логика денег', ar:'منطق المال', id:'Logika Uang', vi:'Lý luận tiền tệ', th:'ตรรกะของเงิน', tr:'Para Mantığı' },
    'menu.verify':   { ja:'検証', ko:'검증', 'zh-CN':'验证', 'zh-TW':'驗證', hi:'सत्यापन', es:'Verificar', fr:'Vérifier', de:'Überprüfen', pt:'Verificar', ru:'Проверить', ar:'تحقق', id:'Verifikasi', vi:'Xác minh', th:'ตรวจสอบ', tr:'Doğrula' },
    'menu.doctrine': { ja:'教義', ko:'교의', 'zh-CN':'教义', 'zh-TW':'教義', hi:'सिद्धांत', es:'Doctrina', fr:'Doctrine', de:'Doktrin', pt:'Doutrina', ru:'Доктрина', ar:'عقيدة', id:'Doktrin', vi:'Học thuyết', th:'หลักคำสอน', tr:'Doktrin' },
    'menu.stories':  { ja:'物語', ko:'이야기', 'zh-CN':'故事', 'zh-TW':'故事', hi:'कहानियाँ', es:'Historias', fr:'Histoires', de:'Geschichten', pt:'Histórias', ru:'Истории', ar:'قصص', id:'Cerita', vi:'Câu chuyện', th:'เรื่องราว', tr:'Hikayeler' },
    'menu.begin':    { ja:'始める', ko:'시작', 'zh-CN':'开始', 'zh-TW':'開始', hi:'शुरू करें', es:'Comenzar', fr:'Commencer', de:'Beginnen', pt:'Começar', ru:'Начать', ar:'ابدأ', id:'Mulai', vi:'Bắt đầu', th:'เริ่ม', tr:'Başla' }
  };

  function applyMenuTranslations(lang) {
    // English (or any language not in the dictionary) → keep original markup.
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const dict = MENU_TRANSLATIONS[key];
      if (!dict) return;
      // Reset to original first (for back-to-EN switching)
      if (!el.dataset.i18nOriginal) el.dataset.i18nOriginal = el.textContent;
      const translated = dict[lang];
      el.textContent = translated || el.dataset.i18nOriginal;
    });
  }

  // Mark every Japanese-text element with lang="ja" so Google Translate's
  // per-element auto-detection (cookie /auto/<target>) routes them
  // through ja → target translation regardless of surrounding markup.
  // The page uses these existing classes to denote Japanese text:
  //   .jp                 (most JP subtitles in modals + page sections)
  //   .edge-headline-jp   (the why-edge section JP subtitle)
  //   .rule-q-jp          (rule Q&A JP subtitle)
  //   .purpose-jp         (manifesto purpose JP subtitle)
  // Idempotent: respects pre-existing lang attribute if author set one.
  function markJpElements() {
    const sel = '.jp, .edge-headline-jp, .rule-q-jp, .purpose-jp, [class*="-jp"]';
    let count = 0;
    document.querySelectorAll(sel).forEach(el => {
      if (!el.hasAttribute('lang')) {
        el.setAttribute('lang', 'ja');
        count++;
      }
    });
    console.log('[i18n] marked', count, 'elements with lang="ja"');
  }

  // ============================================================
  // BILINGUAL PAIR SWAP (uses existing markup, no new translations)
  // ============================================================
  // The page is authored with bilingual pairs: an English element
  // followed by a JP-class sibling carrying the Japanese version.
  // CSS hides the JP siblings on the visible page (always).
  //
  // applyBilingualSwap copies the JP sibling's innerHTML into the
  // EN element when picker is JA, and restores the original EN
  // innerHTML otherwise. Uses existing markup — no new JP writing
  // needed for these elements.
  const BILINGUAL_PAIRS = [
    // [English-element selector, Japanese-element selector]
    ['.edge-headline',  '.edge-headline-jp'],
    ['.rule-q',         '.rule-q-jp'],
    // money.html: chapter titles, lede, world-statement
    ['.lede',                '.lede-jp'],
    ['.chapter-title',       '.chapter-title-jp'],
    ['.world-statement-en',  '.world-statement-jp'],
    // verify.html: step descriptions
    // (Note: .verify-statement is notranslate by design — both EN and JP
    //  statements are shown under JA picker via CSS, intentional bilingual close.)
    ['.step',                '.step-jp'],
    // Add more as discovered.
  ];

  function applyBilingualSwap(lang) {
    BILINGUAL_PAIRS.forEach(([enSel, jpSel]) => {
      document.querySelectorAll(enSel).forEach(enEl => {
        // Find the JP counterpart: next sibling, or any sibling in
        // the same parent container.
        let jpEl = null;
        if (enEl.nextElementSibling && enEl.nextElementSibling.matches(jpSel)) {
          jpEl = enEl.nextElementSibling;
        }
        if (!jpEl && enEl.parentElement) {
          jpEl = enEl.parentElement.querySelector(jpSel);
        }
        if (!jpEl) return;
        if (!enEl.dataset.originalEn) enEl.dataset.originalEn = enEl.innerHTML;
        if (!jpEl.dataset.originalJp) jpEl.dataset.originalJp = jpEl.innerHTML;
        enEl.innerHTML = (lang === 'ja') ? jpEl.dataset.originalJp : enEl.dataset.originalEn;
      });
    });
  }

  // ============================================================
  // DETERMINISTIC TRANSLATIONS (Google-free)
  // ============================================================
  // For every translatable element on the page that carries
  // data-i18n-html="key", look up I18N_CONTENT[key][lang] and swap
  // its innerHTML. Original markup is cached as data-i18n-original
  // for clean restoration on language switch back to a non-mapped
  // language.
  //
  // Covers: JP and EN explicitly. Other languages fall back to the
  // original markup (English) and rely on Google Translate to do
  // EN → target. JP and EN are guaranteed to render correctly
  // regardless of Google's availability.
  //
  // TO ADD A NEW TRANSLATION: just add an entry below. No HTML edits
  // needed beyond the one-time data-i18n-html attribute on the element.
  const I18N_CONTENT = {

    // --- HERO TICKER (one-line ritual phrases) ---
    // The ticker repeats these in a marquee; we translate each phrase once.
    'ticker.bell_open': {
      ja: 'Bellが開いている。',
      ko: 'Bell이 열려 있다.',
      es: 'La Bell está abierta.',
      hi: 'Bell खुला है।',
      vi: 'Bell đang mở.',
      pt: 'A Bell está aberta.',
      id: 'Bell terbuka.',
      th: 'Bell เปิดอยู่',
      fr: 'La Bell est ouverte.',
    },
    'ticker.bell_window': {
      ja: '金曜 23:23 ─ 23:28 · 5分間',
      ko: 'Friday 23:23 — 23:28 · 5분',
      es: 'Friday 23:23 — 23:28 · 5 minutos',
      hi: 'Friday 23:23 — 23:28 · 5 मिनट',
      vi: 'Friday 23:23 — 23:28 · 5 phút',
      pt: 'Friday 23:23 — 23:28 · 5 minutos',
      id: 'Friday 23:23 — 23:28 · 5 menit',
      th: 'Friday 23:23 — 23:28 · 5 นาที',
      fr: 'Friday 23:23 — 23:28 · 5 minutes',
    },
    'ticker.choose': {
      ja: '選ばれる前に、選べ。',
      ko: '선택받기 전에, 선택하라.',
      es: 'Elige antes de ser elegido.',
      hi: 'चुने जाने से पहले, चुनो।',
      vi: 'Hãy chọn trước khi được chọn.',
      pt: 'Escolha antes de ser escolhido.',
      id: 'Pilihlah sebelum kau dipilih.',
      th: 'จงเลือกก่อนถูกเลือก',
      fr: 'Choisis avant d\'être choisi.',
    },
    'ticker.bell_right': {
      ja: 'Bellは資格。換金されない。',
      ko: 'Bell은 자격. 환금되지 않는다.',
      es: 'Bell es un Derecho. Nunca dinero.',
      hi: 'Bell अधिकार है। कभी नकद नहीं।',
      vi: 'Bell là Quyền. Không bao giờ là tiền mặt.',
      pt: 'Bell é um Direito. Nunca dinheiro.',
      id: 'Bell adalah Hak. Bukan uang tunai.',
      th: 'Bell คือสิทธิ์ ไม่ใช่เงินสด',
      fr: 'Bell est un Droit. Jamais de l\'argent.',
    },
    'ticker.never_lose': {
      ja: 'Bellは失われない。',
      ko: 'Bell은 잃지 않는다.',
      es: 'Nunca pierdes tu Bell.',
      hi: 'अपना Bell कभी मत खोओ।',
      vi: 'Bạn không bao giờ mất Bell.',
      pt: 'Você nunca perde sua Bell.',
      id: 'Bell-mu tak pernah hilang.',
      th: 'คุณจะไม่สูญเสีย Bell',
      fr: 'Tu ne perds jamais ta Bell.',
    },
    'ticker.three_trials': {
      ja: '3つの試練。一つの王冠。',
      ko: '3개의 시련. 하나의 Crown.',
      es: '3 pruebas. Una Crown.',
      hi: '3 परीक्षाएँ। एक Crown।',
      vi: '3 thử thách. Một Crown.',
      pt: '3 provas. Uma Crown.',
      id: '3 ujian. Satu Crown.',
      th: '3 บททดสอบ หนึ่ง Crown',
      fr: '3 épreuves. Une Crown.',
    },
    'ticker.grant_not_prize': {
      ja: 'Grantは賞金ではない。',
      ko: 'Grant는 상금이 아니다.',
      es: 'Grant no es un premio.',
      hi: 'Grant पुरस्कार नहीं है।',
      vi: 'Grant không phải giải thưởng.',
      pt: 'Grant não é um prêmio.',
      id: 'Grant bukan hadiah.',
      th: 'Grant ไม่ใช่รางวัล',
      fr: 'Grant n\'est pas un prix.',
    },
    'ticker.questions_world': {
      ja: '問題は、世界によって明かされる。',
      ko: '질문은 세계에 의해 밝혀진다.',
      es: 'Las preguntas las revela el mundo.',
      hi: 'सवाल दुनिया से प्रकट होते हैं।',
      vi: 'Câu hỏi được thế giới hé lộ.',
      pt: 'Perguntas reveladas pelo mundo.',
      id: 'Pertanyaan diungkap oleh dunia.',
      th: 'คำถามถูกเปิดเผยโดยโลก',
      fr: 'Les questions révélées par le monde.',
    },

    // --- WHY 23:23 (THE EDGE) — user's screenshot section ---
    'why.eyebrow': {
      ja: '第0章 · その時刻',
      ko: '제0장 · 그 시각',
      es: 'Capítulo 0 · La hora',
      hi: 'अध्याय 0 · वह घड़ी',
      vi: 'Chương 0 · Khoảnh khắc đó',
      pt: 'Capítulo 0 · A hora',
      id: 'Bab 0 · Saat itu',
      th: 'บทที่ 0 · ชั่วโมงนั้น',
      fr: 'Chapitre 0 · L\'heure',
    },
    'why.headline': {
      ja: '23:23は、<span class="gold-italic">昨日の自分</span>と、<br/>'
        + '<span class="gold-italic">王になる自分</span>の境界。',
      ko: '23:23은, <span class="gold-italic">어제의 너</span>와,<br/><span class="gold-italic">왕이 되는 너</span>의 경계.',
      es: '23:23 es el <span class="gold-italic">tú de ayer</span><br/>y el <span class="gold-italic">tú que será King</span>.',
      hi: '23:23 है <span class="gold-italic">कल का तुम</span><br/>और <span class="gold-italic">King बनता हुआ तुम</span> की सीमा।',
      vi: '23:23 là ranh giới giữa <span class="gold-italic">bạn của hôm qua</span><br/>và <span class="gold-italic">bạn sẽ trở thành King</span>.',
      pt: '23:23 é a <span class="gold-italic">borda entre quem você foi ontem</span><br/>e o <span class="gold-italic">King que você se torna</span>.',
      id: '23:23 adalah batas antara <span class="gold-italic">dirimu kemarin</span><br/>dan <span class="gold-italic">dirimu yang menjadi King</span>.',
      th: '23:23 คือเส้นแบ่งระหว่าง <span class="gold-italic">คุณเมื่อวาน</span><br/>กับ <span class="gold-italic">คุณที่จะเป็น King</span>',
      fr: '23:23 est la frontière entre <span class="gold-italic">toi d\'hier</span><br/>et <span class="gold-italic">le King que tu deviens</span>.',
    },
    // The existing .edge-headline-jp element is already Japanese.
    // We translate it to English here for EN/other pickers.
    'why.subtitle_jp': {
      en: 'The edge between who you were yesterday, and the king you become.',
      ko: '어제의 너와, 왕이 되는 너의 경계.',
      es: 'La frontera entre quien fuiste ayer y el King que serás.',
      hi: 'कल जो थे और जो King बनोगे — उनकी सीमा।',
      vi: 'Ranh giới giữa bạn của hôm qua, và King mà bạn sẽ trở thành.',
      pt: 'A borda entre quem você foi ontem e o King que você se torna.',
      id: 'Batas antara dirimu kemarin, dan King yang akan kaujadi.',
      th: 'เส้นแบ่งระหว่างคุณเมื่อวาน กับ King ที่คุณจะเป็น',
      fr: 'La frontière entre celui que tu étais hier, et le King que tu deviens.',
    },
    'why.text_1': {
      ja: '一日の最後の時刻。世界はもうすぐ眠る。もうすぐ終わる。<em>もうすぐ</em>。',
      ko: '하루의 마지막 시각. 세계는 곧 잠든다. 곧 끝난다. <em>곧</em>.',
      es: 'La última hora del día. El mundo está a punto de dormir. A punto de acabar. <em>A punto</em>.',
      hi: 'दिन की आखिरी घड़ी। दुनिया अब सोने जा रही है। अब खत्म होने जा रही है। <em>अब</em>।',
      vi: 'Giờ cuối cùng của ngày. Thế giới sắp ngủ. Sắp kết thúc. <em>Sắp</em>.',
      pt: 'A última hora do dia. O mundo está prestes a dormir. Prestes a acabar. <em>Prestes</em>.',
      id: 'Jam terakhir hari ini. Dunia hampir tidur. Hampir berakhir. <em>Hampir</em>.',
      th: 'ชั่วโมงสุดท้ายของวัน โลกกำลังจะหลับ กำลังจะจบ <em>กำลังจะ</em>',
      fr: 'La dernière heure du jour. Le monde va dormir. Va finir. <em>Va</em>.',
    },
    'why.text_2': {
      ja: '真夜中が閉じる、その一分前。明日に選ばれる前に、私たちが選ぶ一分。',
      ko: '자정이 닫히는, 그 1분 전. 내일에 선택받기 전에, 우리가 선택하는 1분.',
      es: 'Un minuto antes de que se cierre la medianoche. El minuto en que elegimos, antes de que el mañana nos elija.',
      hi: 'आधी रात बंद होने से ठीक एक मिनट पहले। कल हमें चुने, उससे पहले हम चुनें।',
      vi: 'Một phút trước khi nửa đêm khép lại. Phút chúng ta chọn, trước khi ngày mai chọn ta.',
      pt: 'Um minuto antes da meia-noite se fechar. O minuto em que nós escolhemos, antes que o amanhã nos escolha.',
      id: 'Satu menit sebelum tengah malam menutup. Satu menit ketika kita memilih, sebelum besok memilih kita.',
      th: 'หนึ่งนาทีก่อนเที่ยงคืนปิดลง นาทีที่เราเลือก ก่อนวันพรุ่งนี้จะเลือกเรา',
      fr: 'Une minute avant que minuit ne se referme. La minute où nous choisissons, avant que demain ne nous choisisse.',
    },
    'why.foot': {
      ja: '他の時刻はない。他の分はない。<span class="gold">23:23, JST</span> ─ 週に二度、世界が脈打つ。',
      ko: '다른 시각은 없다. 다른 분은 없다. <span class="gold">23:23, JST</span> — 일주일에 두 번, 세계가 고동친다.',
      es: 'No hay otra hora. No hay otro minuto. <span class="gold">23:23, JST</span> — dos veces por semana, el mundo late.',
      hi: 'और कोई घड़ी नहीं। और कोई मिनट नहीं। <span class="gold">23:23, JST</span> — हफ्ते में दो बार, दुनिया धड़कती है।',
      vi: 'Không có giờ nào khác. Không có phút nào khác. <span class="gold">23:23, JST</span> — hai lần mỗi tuần, thế giới đập nhịp.',
      pt: 'Não há outra hora. Não há outro minuto. <span class="gold">23:23, JST</span> — duas vezes por semana, o mundo pulsa.',
      id: 'Tak ada jam lain. Tak ada menit lain. <span class="gold">23:23, JST</span> — dua kali seminggu, dunia berdenyut.',
      th: 'ไม่มีชั่วโมงอื่น ไม่มีนาทีอื่น <span class="gold">23:23, JST</span> — สัปดาห์ละสองครั้ง โลกเต้นเป็นจังหวะ',
      fr: 'Pas d\'autre heure. Pas d\'autre minute. <span class="gold">23:23, JST</span> — deux fois par semaine, le monde bat.',
    },

    // --- BELL RITUAL (Two Bells / One Week) ---
    'bell.eyebrow': {
      ja: '第I章 · 儀式',
      ko: '제I장 · 의식',
      es: 'Capítulo I · El ritual',
      hi: 'अध्याय I · अनुष्ठान',
      vi: 'Chương I · Nghi thức',
      pt: 'Capítulo I · O ritual',
      id: 'Bab I · Ritual',
      th: 'บทที่ I · พิธีกรรม',
      fr: 'Chapitre I · Le rituel',
    },
    'bell.headline': {
      ja: '二つのBell。<br/>一つの週。',
      ko: '두 개의 Bell.<br/>하나의 주.',
      es: 'Dos Bells.<br/>Una semana.',
      hi: 'दो Bell।<br/>एक हफ्ता।',
      vi: 'Hai Bell.<br/>Một tuần.',
      pt: 'Duas Bells.<br/>Uma semana.',
      id: 'Dua Bell.<br/>Satu pekan.',
      th: 'สอง Bell<br/>หนึ่งสัปดาห์',
      fr: 'Deux Bells.<br/>Une semaine.',
    },
    'bell.lede': {
      ja: '世界は、週に二度立ち止まる。最初のBellで、選択が始まる。'
        + '二度目で、世界は選び終えている。途中は、ない。',
      ko: '세계는 일주일에 두 번 멈춘다. 첫 Bell에서 선택이 시작된다. 두 번째에서 세계는 선택을 마쳤다. 중간은 없다.',
      es: 'El mundo se detiene dos veces por semana. En la primera Bell, la elección comienza. En la segunda, el mundo ya ha elegido. Sin punto medio.',
      hi: 'दुनिया हफ्ते में दो बार रुकती है। पहली Bell पर चुनाव शुरू होता है। दूसरी पर, दुनिया चुन चुकी होती है। बीच में कुछ नहीं।',
      vi: 'Thế giới dừng lại hai lần mỗi tuần. Bell đầu tiên, sự lựa chọn bắt đầu. Lần thứ hai, thế giới đã chọn xong. Không có khoảng giữa.',
      pt: 'O mundo pausa duas vezes por semana. Na primeira Bell, a escolha começa. Na segunda, o mundo já escolheu. Não há meio-termo.',
      id: 'Dunia berhenti dua kali sepekan. Pada Bell pertama, pilihan dimulai. Pada yang kedua, dunia telah memilih. Tak ada antara.',
      th: 'โลกหยุดสองครั้งต่อสัปดาห์ ที่ Bell แรก การเลือกเริ่มต้น ที่ครั้งที่สอง โลกได้เลือกเสร็จแล้ว ไม่มีระหว่างกลาง',
      fr: 'Le monde s\'arrête deux fois par semaine. À la première Bell, le choix commence. À la seconde, le monde a choisi. Pas d\'entre-deux.',
    },
    'bell.friday_msg': {
      ja: 'Bellが開く。',
      ko: 'Bell이 열린다.',
      es: 'La Bell se abre.',
      hi: 'Bell खुलती है।',
      vi: 'Bell mở ra.',
      pt: 'A Bell se abre.',
      id: 'Bell terbuka.',
      th: 'Bell เปิดออก',
      fr: 'La Bell s\'ouvre.',
    },
    'bell.friday_sub': {
      ja: '5分間。3人の名前。一つの選択。',
      ko: '5분. 3개의 이름. 하나의 선택.',
      es: '5 minutos. 3 nombres. Una elección.',
      hi: '5 मिनट। 3 नाम। एक चुनाव।',
      vi: '5 phút. 3 cái tên. Một lựa chọn.',
      pt: '5 minutos. 3 nomes. Uma escolha.',
      id: '5 menit. 3 nama. Satu pilihan.',
      th: '5 นาที 3 ชื่อ หนึ่งทางเลือก',
      fr: '5 minutes. 3 noms. Un choix.',
    },
    'bell.monday_msg': {
      ja: '世界は選び終えた。',
      ko: '세계는 선택을 마쳤다.',
      es: 'El mundo ha elegido.',
      hi: 'दुनिया चुन चुकी है।',
      vi: 'Thế giới đã chọn xong.',
      pt: 'O mundo escolheu.',
      id: 'Dunia telah memilih.',
      th: 'โลกได้เลือกเสร็จแล้ว',
      fr: 'Le monde a choisi.',
    },
    'bell.monday_sub': {
      ja: '一人の王。二つの王冠。他は、来週へ。',
      ko: '한 명의 King. 두 개의 Crown. 나머지는 다음 주로.',
      es: 'Un King. Dos Crowns. Los demás, a la próxima semana.',
      hi: 'एक King। दो Crown। बाकी अगले हफ्ते।',
      vi: 'Một King. Hai Crown. Còn lại — tuần sau.',
      pt: 'Um King. Duas Crowns. Os outros, semana que vem.',
      id: 'Satu King. Dua Crown. Sisanya, pekan depan.',
      th: 'หนึ่ง King สอง Crown ที่เหลือ สัปดาห์หน้า',
      fr: 'Un King. Deux Crowns. Le reste, à la semaine prochaine.',
    },

    // --- STORIES (past kings) ---
    'stories.eyebrow': {
      ja: '第VIII章 · 物語',
      ko: '제VIII장 · 이야기',
      es: 'Capítulo VIII · Historias',
      hi: 'अध्याय VIII · कथाएँ',
      vi: 'Chương VIII · Câu chuyện',
      pt: 'Capítulo VIII · Histórias',
      id: 'Bab VIII · Kisah',
      th: 'บทที่ VIII · เรื่องราว',
      fr: 'Chapitre VIII · Histoires',
    },
    'stories.headline': {
      ja: 'これまでの<em>王</em>たち。',
      ko: '지나간 <em>King</em>들.',
      es: 'Los <em>Kings</em> que vinieron antes.',
      hi: 'अब तक के <em>King</em>।',
      vi: 'Những <em>King</em> đã qua.',
      pt: 'Os <em>Kings</em> que vieram antes.',
      id: '<em>King</em> yang telah berlalu.',
      th: 'บรรดา <em>King</em> ที่ผ่านมา',
      fr: 'Les <em>Kings</em> d\'avant.',
    },
    'stories.lede': {
      ja: '月曜の23:23ごとに、玉座は移る。これまで玉座に就いた者たち。',
      ko: 'Monday 23:23마다, 왕좌가 옮겨진다. 지금까지 왕좌에 오른 사람들.',
      es: 'Cada Monday 23:23 el trono cambia. Aquellos que lo han ocupado.',
      hi: 'हर Monday 23:23 पर सिंहासन बदलता है। वे जो अब तक उस पर बैठे।',
      vi: 'Mỗi Monday 23:23, ngai vàng đổi chủ. Những người đã ngồi đó.',
      pt: 'A cada Monday 23:23, o trono muda. Aqueles que ocuparam o trono.',
      id: 'Setiap Monday 23:23, takhta berpindah. Mereka yang pernah duduk di sana.',
      th: 'ทุก Monday 23:23 บัลลังก์เปลี่ยนมือ ผู้ที่เคยขึ้นนั่ง',
      fr: 'Chaque Monday 23:23, le trône change. Ceux qui s\'y sont assis.',
    },

    // --- RULES / EDGE FAQ section (image 2 — 12 Q&A cards) ---
    // The .rule-q (English question) auto-swaps with adjacent .rule-q-jp
    // via applyBilingualSwap. Only the .rule-a answers need explicit
    // JP translation since they have no JP sibling in the markup.
    'rules.eyebrow': {
      ja: '第VI章 · エッジ・ルール',
      ko: '제VI장 · 엣지 룰',
      es: 'Capítulo VI · Reglas del Borde',
      hi: 'अध्याय VI · एज नियम',
      vi: 'Chương VI · Luật giới hạn',
      pt: 'Capítulo VI · Regras de Borda',
      id: 'Bab VI · Aturan Tepi',
      th: 'บทที่ VI · กฎที่ขอบ',
      fr: 'Chapitre VI · Règles du Bord',
    },
    'rules.headline': {
      ja: '誰もが訊く<br/>問い。',
      ko: '모두가 묻는<br/>질문.',
      es: 'Las preguntas<br/>que todos hacen.',
      hi: 'हर कोई पूछता है<br/>ये सवाल।',
      vi: 'Câu hỏi<br/>ai cũng hỏi.',
      pt: 'As perguntas<br/>que todos fazem.',
      id: 'Pertanyaan<br/>yang semua tanyakan.',
      th: 'คำถาม<br/>ที่ทุกคนถาม',
      fr: 'Les questions<br/>que tous posent.',
    },
    'rules.lede': {
      ja: '答えのない儀式は、法たり得ない。12の境界事例 ─ 起きる前に、公の場で答える。',
      ko: '답 없는 의식은 법이 될 수 없다. 12개의 경계 사례 — 일어나기 전에, 공개적으로 답한다.',
      es: 'Un ritual sin respuestas no puede ser ley. 12 casos límite — respondidos en público, antes de que ocurran.',
      hi: 'जिस अनुष्ठान का जवाब न हो, वह कानून नहीं बन सकता। 12 सीमा-स्थितियाँ — सार्वजनिक रूप से, होने से पहले उत्तर।',
      vi: 'Một nghi thức không có câu trả lời không thể thành luật. 12 trường hợp giới hạn — trả lời công khai, trước khi xảy ra.',
      pt: 'Um ritual sem respostas não pode ser lei. 12 casos limite — respondidos em público, antes que aconteçam.',
      id: 'Ritual tanpa jawaban tak bisa jadi hukum. 12 kasus tepi — dijawab di depan publik, sebelum terjadi.',
      th: 'พิธีกรรมที่ไม่มีคำตอบไม่อาจเป็นกฎ 12 กรณีขอบเขต — ตอบในที่สาธารณะ ก่อนที่จะเกิดขึ้น',
      fr: 'Un rituel sans réponses ne peut être loi. 12 cas limites — répondus en public, avant qu\'ils n\'arrivent.',
    },

    'rules.a01': {

      ja: '<strong>回答 · 同点処理</strong>先着順ではない。応募者プールが最大の国の支持率で同点を解決し、ライブ公開Seedで再ハッシュ。人手の編集なし。私的サイコロなし。',

      ko: '<strong>답 · 동점 처리</strong>선착순이 아니다. 신청자 풀이 가장 큰 국가의 지지율로 동점을 해소하고, 공개 Seed로 다시 해시. 사람 손은 닿지 않는다. 사적인 주사위는 없다.',

      es: '<strong>Respuesta · Empates</strong>No es por orden de llegada. El empate se resuelve por la tasa de apoyo del país con el mayor número de solicitantes, y luego se vuelve a hashear con el Seed público. Sin edición humana. Sin dados privados.',

      hi: '<strong>उत्तर · टाई</strong>पहले आओ-पहले पाओ नहीं। टाई का निपटारा सबसे बड़े आवेदक पूल वाले देश की समर्थन दर से, और सार्वजनिक Seed से री-हैश। कोई हस्तक्षेप नहीं। कोई निजी पासा नहीं।',

      vi: '<strong>Trả lời · Hòa</strong>Không phải đến trước phục vụ trước. Hòa được giải bằng tỷ lệ ủng hộ của quốc gia có pool ứng viên lớn nhất, sau đó hash lại bằng Seed công khai. Không có chỉnh sửa tay. Không có xúc xắc riêng.',

      pt: '<strong>Resposta · Empates</strong>Não é por ordem de chegada. O empate é resolvido pela taxa de apoio do país com mais candidatos, e depois re-hashed com a Seed pública. Sem edição humana. Sem dados privados.',

      id: '<strong>Jawaban · Seri</strong>Bukan siapa cepat dia dapat. Seri diselesaikan dengan rasio dukungan negara dengan jumlah pelamar terbanyak, lalu di-hash ulang dengan Seed publik. Tanpa campur tangan manusia. Tanpa dadu pribadi.',

      th: '<strong>คำตอบ · เสมอ</strong>ไม่ใช่มาก่อนได้ก่อน เสมอจะถูกตัดสินด้วยอัตราสนับสนุนของประเทศที่มีผู้สมัครมากที่สุด แล้ว re-hash ด้วย Seed สาธารณะ ไม่มีการแก้ไขโดยมนุษย์ ไม่มีลูกเต๋าส่วนตัว',

      fr: '<strong>Réponse · Égalités</strong>Pas premier arrivé, premier servi. L\'égalité est résolue par le taux de soutien du pays au plus grand pool de candidats, puis re-hashée avec le Seed public. Aucune édition humaine. Aucun dé privé.',

    },
    'rules.a02': {
      ja: '<strong>回答 · 永続</strong>Bellは失効しない。プラットフォームは最も小さな声 ─ 最初の100円しか払えない人 ─ を守る。その声は残り続ける。',
      ko: '<strong>답 · 영속</strong>Bell은 소멸하지 않는다. 플랫폼은 가장 작은 목소리 — 첫 100엔밖에 낼 수 없는 사람 — 를 지킨다. 그 목소리는 계속 남는다.',
      es: '<strong>Respuesta · Permanencia</strong>Las Bell no caducan. La plataforma protege la voz más pequeña — quien sólo puede pagar los primeros 100 yenes. Esa voz permanece.',
      hi: '<strong>उत्तर · स्थायित्व</strong>Bell समाप्त नहीं होती। प्लेटफ़ॉर्म सबसे छोटी आवाज़ — जो केवल पहले ¥100 दे सकता है — को बचाता है। वह आवाज़ बनी रहती है।',
      vi: '<strong>Trả lời · Vĩnh viễn</strong>Bell không hết hạn. Nền tảng bảo vệ tiếng nói nhỏ nhất — người chỉ có thể trả ¥100 đầu tiên. Tiếng nói đó còn mãi.',
      pt: '<strong>Resposta · Permanência</strong>A Bell não expira. A plataforma protege a menor voz — quem só pode pagar os primeiros ¥100. Essa voz permanece.',
      id: '<strong>Jawaban · Keabadian</strong>Bell tidak kedaluwarsa. Platform melindungi suara terkecil — yang hanya bisa membayar ¥100 pertama. Suara itu tetap ada.',
      th: '<strong>คำตอบ · ความถาวร</strong>Bell ไม่หมดอายุ แพลตฟอร์มปกป้องเสียงที่เล็กที่สุด — คนที่จ่ายได้เพียง ¥100 ครั้งแรก เสียงนั้นยังคงอยู่',
      fr: '<strong>Réponse · Permanence</strong>Les Bell n\'expirent pas. La plateforme protège la plus petite voix — celle qui ne peut payer que les premiers ¥100. Cette voix demeure.',
    },
    'rules.a03': {
      ja: '<strong>回答 · 消滅</strong>Bellは声であり、残高ではない。自発的な離脱時、残りのBellは消滅する。払戻なし、譲渡なし。声は沈黙する。',
      ko: '<strong>답 · 소멸</strong>Bell은 목소리이지 잔고가 아니다. 자발적으로 떠날 때, 남은 Bell은 사라진다. 환불 없음, 양도 없음. 목소리는 침묵한다.',
      es: '<strong>Respuesta · Extinción</strong>La Bell es voz, no saldo. Al irse voluntariamente, las Bells restantes se extinguen. Sin reembolso, sin transferencia. La voz calla.',
      hi: '<strong>उत्तर · विलोप</strong>Bell आवाज़ है, बैलेंस नहीं। स्वैच्छिक रूप से छोड़ने पर बची Bell मिट जाती है। कोई वापसी नहीं, कोई हस्तांतरण नहीं। आवाज़ खामोश हो जाती है।',
      vi: '<strong>Trả lời · Tan biến</strong>Bell là tiếng nói, không phải số dư. Khi tự nguyện rời đi, Bell còn lại biến mất. Không hoàn tiền, không chuyển nhượng. Tiếng nói im lặng.',
      pt: '<strong>Resposta · Extinção</strong>Bell é voz, não saldo. Ao sair voluntariamente, as Bells restantes desaparecem. Sem reembolso, sem transferência. A voz silencia.',
      id: '<strong>Jawaban · Lenyap</strong>Bell adalah suara, bukan saldo. Saat keluar sukarela, Bell tersisa lenyap. Tak ada refund, tak ada transfer. Suara itu sunyi.',
      th: '<strong>คำตอบ · สลาย</strong>Bell คือเสียง ไม่ใช่ยอดเงิน เมื่อออกโดยสมัครใจ Bell ที่เหลือสลายไป ไม่มีคืนเงิน ไม่มีโอน เสียงนั้นเงียบ',
      fr: '<strong>Réponse · Extinction</strong>Bell est une voix, pas un solde. Au départ volontaire, les Bells restantes s\'éteignent. Pas de remboursement, pas de transfert. La voix se tait.',
    },
    'rules.a04': {
      ja: '<strong>回答 · 遺言の王</strong>事前に指定された家族または遺産執行人が候補資格を継承する。Missionは生き続ける。肉体が消えたから玉座が消える、ということはない。',
      ko: '<strong>답 · 유언의 King</strong>사전에 지정된 가족 또는 유언 집행인이 후보 자격을 승계한다. Mission은 계속 살아간다. 육체가 사라졌다고 해서 왕좌가 사라지는 것은 아니다.',
      es: '<strong>Respuesta · King póstumo</strong>El familiar o ejecutor designado previamente hereda la candidatura. La Mission sigue viva. El trono no desaparece porque desaparece el cuerpo.',
      hi: '<strong>उत्तर · वसीयत का King</strong>पहले से नामांकित परिवार-सदस्य या निष्पादक उम्मीदवारी विरासत में लेता है। Mission जीवित रहती है। शरीर मिट गया, तो सिंहासन नहीं मिटता।',
      vi: '<strong>Trả lời · King di chúc</strong>Người thân hoặc người thi hành di chúc được chỉ định trước sẽ kế thừa ứng cử. Mission vẫn sống. Ngai vàng không mất vì thân xác đã mất.',
      pt: '<strong>Resposta · King póstumo</strong>O familiar ou executor designado previamente herda a candidatura. A Mission continua viva. O trono não morre só porque o corpo morre.',
      id: '<strong>Jawaban · King wasiat</strong>Anggota keluarga atau pelaksana yang ditunjuk sebelumnya mewarisi pencalonan. Mission tetap hidup. Takhta tak hilang hanya karena tubuh hilang.',
      th: '<strong>คำตอบ · King พินัยกรรม</strong>สมาชิกครอบครัวหรือผู้จัดการมรดกที่ระบุไว้ล่วงหน้าจะรับสิทธิ์ผู้สมัครต่อ Mission ยังคงดำรงอยู่ บัลลังก์ไม่หายไปเพราะร่างหายไป',
      fr: '<strong>Réponse · King testamentaire</strong>Le membre de la famille ou l\'exécuteur désigné à l\'avance hérite de la candidature. La Mission continue. Le trône ne s\'éteint pas parce que le corps s\'éteint.',
    },
    'rules.a05': {
      ja: '<strong>回答 · 王の負担</strong>Kingは居住国での自己申告に責任を負う。運営はその40%に対する売上税を支払う。国際送金手数料はGrantから差し引かれる。',
      ko: '<strong>답 · King의 부담</strong>King은 거주국에서의 자진 신고 책임을 진다. 운영은 그 40%에 대한 매출세를 낸다. 국제 송금 수수료는 Grant에서 차감된다.',
      es: '<strong>Respuesta · Carga del King</strong>El King declara por su cuenta en su país de residencia. La operadora paga el impuesto sobre ventas correspondiente al 40%. Las comisiones de transferencia internacional se restan del Grant.',
      hi: '<strong>उत्तर · King का बोझ</strong>King अपने निवास देश में स्व-घोषणा करता है। ऑपरेटर 40% पर बिक्री-कर देता है। अंतरराष्ट्रीय हस्तांतरण शुल्क Grant से कटता है।',
      vi: '<strong>Trả lời · Gánh nặng của King</strong>King tự khai báo tại quốc gia cư trú. Đơn vị vận hành chịu thuế bán hàng cho phần 40% đó. Phí chuyển tiền quốc tế trừ vào Grant.',
      pt: '<strong>Resposta · Ônus do King</strong>O King declara por conta própria no país de residência. A operadora paga o imposto sobre vendas dos 40%. Taxas de transferência internacional saem do Grant.',
      id: '<strong>Jawaban · Beban King</strong>King melapor sendiri di negara tempat tinggal. Operator membayar pajak penjualan 40%-nya. Biaya transfer internasional dipotong dari Grant.',
      th: '<strong>คำตอบ · ภาระของ King</strong>King รับผิดชอบการแจ้งภาษีในประเทศที่อยู่อาศัยเอง ผู้ดำเนินการจ่ายภาษีการขาย 40% นั้น ค่าธรรมเนียมโอนระหว่างประเทศหักจาก Grant',
      fr: '<strong>Réponse · Charge du King</strong>Le King déclare lui-même dans son pays de résidence. L\'opérateur paie la TVA sur les 40%. Les frais de transfert international sont déduits du Grant.',
    },
    'rules.a06': {
      ja: '<strong>回答 · デバイス指紋</strong>SMS認証 + 暗号デバイス指紋 + 行動シグナル。同じ世帯、同じオフィス、同じVPN ─ すべて、投票が数えられる前に再認証のフラグが立つ。',
      ko: '<strong>답 · 디바이스 지문</strong>SMS 인증 + 암호화 디바이스 지문 + 행동 신호. 같은 가구, 같은 사무실, 같은 VPN — 모두 투표가 집계되기 전에 재인증 플래그가 붙는다.',
      es: '<strong>Respuesta · Huella de dispositivo</strong>Verificación SMS + huella de dispositivo cifrada + señales de comportamiento. Mismo hogar, misma oficina, misma VPN — todos quedan marcados para reverificación antes de contar el voto.',
      hi: '<strong>उत्तर · डिवाइस फ़िंगरप्रिंट</strong>SMS पुष्टि + एन्क्रिप्टेड डिवाइस फ़िंगरप्रिंट + व्यवहार संकेत। एक ही घर, एक ही दफ़्तर, एक ही VPN — सभी को मतगणना से पहले पुनः सत्यापन के लिए चिह्नित।',
      vi: '<strong>Trả lời · Vân tay thiết bị</strong>Xác minh SMS + vân tay thiết bị mã hóa + tín hiệu hành vi. Cùng hộ, cùng văn phòng, cùng VPN — đều được gắn cờ tái xác minh trước khi đếm phiếu.',
      pt: '<strong>Resposta · Impressão digital de dispositivo</strong>Verificação SMS + fingerprint criptografado + sinais comportamentais. Mesma residência, mesmo escritório, mesma VPN — todos marcados para re-verificação antes da contagem.',
      id: '<strong>Jawaban · Sidik perangkat</strong>Verifikasi SMS + fingerprint perangkat terenkripsi + sinyal perilaku. Rumah sama, kantor sama, VPN sama — semuanya ditandai untuk re-verifikasi sebelum suara dihitung.',
      th: '<strong>คำตอบ · ลายนิ้วมืออุปกรณ์</strong>การยืนยัน SMS + ลายนิ้วมืออุปกรณ์เข้ารหัส + สัญญาณพฤติกรรม ครัวเรือนเดียวกัน สำนักงานเดียวกัน VPN เดียวกัน — ติดธงรอตรวจซ้ำก่อนนับคะแนน',
      fr: '<strong>Réponse · Empreinte d\'appareil</strong>Vérification SMS + empreinte d\'appareil chiffrée + signaux comportementaux. Même foyer, même bureau, même VPN — tous signalés pour revérification avant le décompte.',
    },
    'rules.a07': {
      ja: '<strong>回答 · Bell上限 + 異常検知</strong>Bellごとの投票数にIPあたり上限。クラスターパターン、地理的外れ値、タイミングのスパイクに対する統計的異常検知。フラグ付き Bell は人手監査まで保留。',
      ko: '<strong>답 · Bell 상한 + 이상 탐지</strong>Bell별 투표 수에 IP당 상한. 클러스터 패턴, 지리적 이상치, 타이밍 스파이크에 대한 통계적 이상 탐지. 플래그된 Bell은 사람 감사 전까지 보류.',
      es: '<strong>Respuesta · Tope por Bell + detección de anomalías</strong>Límite de votos por IP por Bell. Detección estadística de patrones agrupados, outliers geográficos y picos temporales. Las Bells marcadas se retienen hasta auditoría humana.',
      hi: '<strong>उत्तर · Bell-कैप + विसंगति-पहचान</strong>हर Bell, हर IP पर वोट-सीमा। क्लस्टर-पैटर्न, भौगोलिक आउटलायर, टाइमिंग-स्पाइक की सांख्यिकीय पहचान। चिह्नित Bell मानव-ऑडिट तक रोक दी जाती है।',
      vi: '<strong>Trả lời · Giới hạn Bell + phát hiện bất thường</strong>Giới hạn số phiếu mỗi IP cho mỗi Bell. Phát hiện thống kê các mẫu cụm, ngoại lệ địa lý, đột biến thời gian. Bell bị gắn cờ giữ lại cho đến khi kiểm toán thủ công.',
      pt: '<strong>Resposta · Teto por Bell + detecção de anomalias</strong>Limite de votos por IP por Bell. Detecção estatística de padrões agrupados, outliers geográficos e picos de tempo. Bells marcadas ficam retidas até auditoria humana.',
      id: '<strong>Jawaban · Batas Bell + deteksi anomali</strong>Batas suara per IP per Bell. Deteksi statistik untuk pola gugus, outlier geografis, lonjakan waktu. Bell yang ditandai ditahan sampai audit manusia.',
      th: '<strong>คำตอบ · เพดาน Bell + ตรวจจับความผิดปกติ</strong>จำกัดจำนวนคะแนนต่อ IP ต่อ Bell ตรวจจับทางสถิติสำหรับรูปแบบกลุ่ม ภูมิศาสตร์ผิดปกติ จังหวะเวลาผิดปกติ Bell ที่ถูกติดธงจะถูกระงับจนกว่าการตรวจสอบโดยมนุษย์',
      fr: '<strong>Réponse · Plafond Bell + détection d\'anomalies</strong>Plafond de votes par IP par Bell. Détection statistique des motifs de grappes, des valeurs géographiques aberrantes et des pics temporels. Les Bells signalées sont retenues jusqu\'à l\'audit humain.',
    },
    'rules.a08': {
      ja: '<strong>回答 · エスクロー</strong>Grant Fund は法的に分離されたエスクロー口座にあり、第三者の受託者が管理する。運営の死亡・病気・破産は、そこにある一円にも触れることができない。',
      ko: '<strong>답 · 에스크로</strong>Grant Fund는 법적으로 분리된 에스크로 계좌에 있고, 제3자 수탁자가 관리한다. 운영자의 사망·질병·파산은 거기에 있는 1엔에도 손댈 수 없다.',
      es: '<strong>Respuesta · Custodia</strong>El Grant Fund vive en una cuenta de custodia jurídicamente separada, gestionada por un fiduciario externo. Muerte, enfermedad o quiebra del operador no pueden tocar ni un yen.',
      hi: '<strong>उत्तर · एस्क्रो</strong>Grant Fund कानूनी रूप से अलग एस्क्रो खाते में है, स्वतंत्र न्यासी द्वारा संचालित। ऑपरेटर की मृत्यु, बीमारी, दिवालिया वहाँ के एक भी येन को छू नहीं सकती।',
      vi: '<strong>Trả lời · Ký quỹ</strong>Grant Fund nằm trong tài khoản ký quỹ tách biệt về mặt pháp lý, do bên thứ ba tín thác quản lý. Tử vong, bệnh tật, phá sản của nhà vận hành không chạm được một yen nào ở đó.',
      pt: '<strong>Resposta · Custódia</strong>O Grant Fund fica em conta de custódia juridicamente separada, gerida por fiduciário terceiro. Morte, doença ou falência do operador não tocam nem um iene.',
      id: '<strong>Jawaban · Escrow</strong>Grant Fund berada di rekening escrow yang dipisahkan secara hukum, dikelola oleh trustee pihak ketiga. Kematian, sakit, atau pailit operator tak menyentuh satu yen pun.',
      th: '<strong>คำตอบ · เอสโครว์</strong>Grant Fund อยู่ในบัญชีเอสโครว์ที่แยกตามกฎหมาย บริหารโดยทรัสตีบุคคลที่สาม การเสียชีวิต เจ็บป่วย ล้มละลายของผู้ดำเนินการแตะเงินที่นั่นไม่ได้',
      fr: '<strong>Réponse · Séquestre</strong>Le Grant Fund est dans un compte séquestre légalement séparé, géré par un fiduciaire tiers. La mort, la maladie, la faillite de l\'opérateur ne peuvent toucher un seul yen.',
    },
    'rules.a09': {
      ja: '<strong>回答 · 週次レスキュー切符</strong>4週間の投票履歴が確認できる参加者に、月一の無料応募を許可。儀式は、払える人だけのものではない。',
      ko: '<strong>답 · 주간 구제 티켓</strong>4주 투표 이력이 확인되는 참가자에게 월 1회 무료 응모 허용. 의식은 지불할 수 있는 사람만의 것이 아니다.',
      es: '<strong>Respuesta · Ticket de rescate semanal</strong>Quien tenga cuatro semanas de historial de votación confirmado obtiene una participación gratuita mensual. El ritual no es solo de quienes pueden pagar.',
      hi: '<strong>उत्तर · साप्ताहिक रेस्क्यू टिकट</strong>जिनके पास 4 हफ़्ते का सत्यापन-योग्य मतदान-इतिहास है, उन्हें महीने में एक मुफ्त आवेदन। यह अनुष्ठान सिर्फ़ अमीरों के लिए नहीं है।',
      vi: '<strong>Trả lời · Vé cứu trợ tuần</strong>Người tham gia có 4 tuần lịch sử bỏ phiếu được xác minh được hưởng một lần ứng tuyển miễn phí mỗi tháng. Nghi thức không chỉ dành cho người chi trả được.',
      pt: '<strong>Resposta · Ticket de resgate semanal</strong>Quem tiver 4 semanas de histórico de votação verificável recebe uma candidatura gratuita por mês. O ritual não é só para quem pode pagar.',
      id: '<strong>Jawaban · Tiket penyelamat mingguan</strong>Peserta dengan 4 pekan riwayat suara terverifikasi mendapat satu aplikasi gratis per bulan. Ritual bukan hanya milik yang mampu bayar.',
      th: '<strong>คำตอบ · ตั๋วช่วยเหลือรายสัปดาห์</strong>ผู้เข้าร่วมที่มีประวัติการลงคะแนน 4 สัปดาห์ที่ตรวจสอบได้ ได้สิทธิ์สมัครฟรีเดือนละครั้ง พิธีกรรมไม่ใช่ของผู้จ่ายได้เท่านั้น',
      fr: '<strong>Réponse · Ticket de secours hebdomadaire</strong>Les participants avec 4 semaines d\'historique de vote vérifiable obtiennent une candidature gratuite par mois. Le rituel n\'est pas réservé à ceux qui peuvent payer.',
    },
    'rules.a10': {
      ja: '<strong>回答 · AI OCR + 人手監査</strong>すべての領収書はOCRで改ざんチェックされ、ベンダー記録と照合された後、人手の監査員がレビュー。虚偽報告はGrant剥奪と永久利用停止。',
      ko: '<strong>답 · AI OCR + 사람 감사</strong>모든 영수증은 OCR로 변조 검사 후 벤더 기록과 대조, 그 후 사람 감사관이 검토. 허위 보고는 Grant 박탈 + 영구 이용 정지.',
      es: '<strong>Respuesta · OCR con IA + auditoría humana</strong>Todo recibo pasa por OCR antimanipulación, se contrasta con los registros del proveedor y luego es revisado por un auditor humano. Falsedad = revocación del Grant + suspensión permanente.',
      hi: '<strong>उत्तर · AI OCR + मानव-ऑडिट</strong>हर रसीद OCR से छेड़छाड़-जाँच होती है, विक्रेता-रिकॉर्ड से मिलाई जाती है, फिर मानव-ऑडिटर देखता है। झूठी रिपोर्टिंग = Grant जब्त + स्थायी प्रतिबंध।',
      vi: '<strong>Trả lời · OCR AI + kiểm toán thủ công</strong>Mọi biên lai qua OCR chống chỉnh sửa, đối chiếu với hồ sơ nhà cung cấp, rồi kiểm toán viên duyệt. Báo cáo sai = thu hồi Grant + cấm vĩnh viễn.',
      pt: '<strong>Resposta · OCR com IA + auditoria humana</strong>Todo recibo passa por OCR antiadulteração, é cruzado com registros do fornecedor e revisado por auditor humano. Falso relato = revogação do Grant + suspensão permanente.',
      id: '<strong>Jawaban · AI OCR + audit manusia</strong>Setiap kuitansi diperiksa anti-manipulasi via OCR, dicocokkan dengan catatan vendor, lalu ditinjau auditor manusia. Laporan palsu = pencabutan Grant + larangan permanen.',
      th: '<strong>คำตอบ · AI OCR + ตรวจสอบโดยมนุษย์</strong>ใบเสร็จทุกใบผ่าน OCR ตรวจการแก้ไข ตรวจสอบกับบันทึกผู้ขาย แล้วผู้ตรวจสอบบุคคลพิจารณา รายงานเท็จ = ยึด Grant + ห้ามถาวร',
      fr: '<strong>Réponse · OCR par IA + audit humain</strong>Tout reçu passe par OCR anti-falsification, est rapproché des registres du fournisseur, puis revu par un auditeur humain. Fausse déclaration = retrait du Grant + bannissement permanent.',
    },
    'rules.a11': {
      ja: '<strong>回答 · ロールオーバー</strong>Grantは Fund に戻る。Pool は次サイクルに向けて大きくなる。何もシステムから出ない。何も失われない。Bellはまた鳴る。',
      ko: '<strong>답 · 롤오버</strong>Grant는 Fund로 돌아간다. Pool은 다음 사이클을 향해 커진다. 시스템에서 나가는 것은 없다. 잃는 것도 없다. Bell은 또 울린다.',
      es: '<strong>Respuesta · Rollover</strong>El Grant vuelve al Fund. El Pool crece para el próximo ciclo. Nada sale del sistema. Nada se pierde. La Bell vuelve a sonar.',
      hi: '<strong>उत्तर · रोलओवर</strong>Grant फिर Fund में लौटता है। अगले चक्र के लिए Pool बढ़ता है। सिस्टम से कुछ बाहर नहीं जाता। कुछ खोता नहीं। Bell फिर बजती है।',
      vi: '<strong>Trả lời · Chuyển tiếp</strong>Grant quay lại Fund. Pool lớn lên cho chu kỳ kế tiếp. Không gì rời khỏi hệ thống. Không gì mất đi. Bell sẽ lại vang.',
      pt: '<strong>Resposta · Rollover</strong>O Grant volta ao Fund. O Pool cresce para o próximo ciclo. Nada sai do sistema. Nada se perde. A Bell volta a tocar.',
      id: '<strong>Jawaban · Rollover</strong>Grant kembali ke Fund. Pool tumbuh untuk siklus berikutnya. Tak ada yang keluar dari sistem. Tak ada yang hilang. Bell akan berdentang lagi.',
      th: '<strong>คำตอบ · โรลโอเวอร์</strong>Grant กลับสู่ Fund Pool ขยายไปสู่รอบถัดไป ไม่มีอะไรออกจากระบบ ไม่มีอะไรสูญหาย Bell จะดังอีกครั้ง',
      fr: '<strong>Réponse · Report</strong>Le Grant retourne au Fund. Le Pool grandit pour le cycle suivant. Rien ne quitte le système. Rien ne se perd. La Bell sonne à nouveau.',
    },
    'rules.a12': {
      ja: '<strong>回答 · 境界</strong>23:23 は、終わる日と、まだ始まっていない日との境界。あなただった人と、あなたがなる人との境界。真夜中は閉じる。23:23 は選ぶ。',
      ko: '<strong>답 · 경계</strong>23:23은 끝나는 날과 아직 시작되지 않은 날의 경계. 너였던 자와 네가 될 자의 경계. 자정은 닫힌다. 23:23은 선택한다.',
      es: '<strong>Respuesta · El borde</strong>23:23 es la frontera entre el día que termina y el que aún no comienza. Entre quien fuiste y quien serás. La medianoche cierra. 23:23 elige.',
      hi: '<strong>उत्तर · सीमा</strong>23:23 बीतते दिन और अभी न शुरू हुए दिन की सीमा है। तुम जो थे और तुम जो बनोगे की सीमा। आधी रात बंद करती है। 23:23 चुनता है।',
      vi: '<strong>Trả lời · Ranh giới</strong>23:23 là ranh giới giữa ngày kết thúc và ngày chưa bắt đầu. Giữa người bạn đã là và người bạn sẽ trở thành. Nửa đêm đóng lại. 23:23 chọn.',
      pt: '<strong>Resposta · A borda</strong>23:23 é a fronteira entre o dia que termina e o que ainda não começou. Entre quem você foi e quem você se torna. A meia-noite fecha. 23:23 escolhe.',
      id: '<strong>Jawaban · Tepi</strong>23:23 adalah batas antara hari yang berakhir dan yang belum bermula. Antara yang dulu kamu dan yang akan kamu jadi. Tengah malam menutup. 23:23 memilih.',
      th: '<strong>คำตอบ · เส้นแบ่ง</strong>23:23 คือเส้นแบ่งระหว่างวันที่สิ้นสุดและวันที่ยังไม่เริ่ม ระหว่างคุณเดิมและคุณที่จะเป็น เที่ยงคืนปิด 23:23 เลือก',
      fr: '<strong>Réponse · La bordure</strong>23:23 est la frontière entre le jour qui finit et celui qui n\'a pas commencé. Entre celui que tu étais et celui que tu deviens. Minuit se referme. 23:23 choisit.',
    },

    // --- COUNTDOWN LABELS ---
    'countdown.label': {
      ja: '─ 次のBellまで ─',
      ko: '— 다음 Bell까지 —',
      es: '— Hasta la próxima Bell —',
      hi: '— अगली Bell तक —',
      vi: '— Đến Bell tiếp theo —',
      pt: '— Até a próxima Bell —',
      id: '— Hingga Bell berikut —',
      th: '— ถึง Bell ครั้งถัดไป —',
      fr: '— Jusqu\'à la prochaine Bell —',
    },
    'countdown.days': {
      ja: '日',
      ko: '일',
      es: 'días',
      hi: 'दिन',
      vi: 'ngày',
      pt: 'dias',
      id: 'hari',
      th: 'วัน',
      fr: 'jours',
    },
    'countdown.hrs': {
      ja: '時間',
      ko: '시간',
      es: 'horas',
      hi: 'घंटे',
      vi: 'giờ',
      pt: 'horas',
      id: 'jam',
      th: 'ชั่วโมง',
      fr: 'heures',
    },
    'countdown.min': {
      ja: '分',
      ko: '분',
      es: 'min',
      hi: 'मिनट',
      vi: 'phút',
      pt: 'min',
      id: 'menit',
      th: 'นาที',
      fr: 'min',
    },
    'countdown.sec': {
      ja: '秒',
      ko: '초',
      es: 'seg',
      hi: 'सेकंड',
      vi: 'giây',
      pt: 'seg',
      id: 'detik',
      th: 'วินาที',
      fr: 'sec',
    },

    // --- RITUAL MODAL: ritual-why (Why 23:23?) ---
    'ritual.why.title': {
      ja: 'なぜ<em>23:23</em>なのか?',
      ko: '왜 <em>23:23</em>인가?',
      es: '¿Por qué <em>23:23</em>?',
      hi: '<em>23:23</em> ही क्यों?',
      vi: 'Vì sao <em>23:23</em>?',
      pt: 'Por que <em>23:23</em>?',
      id: 'Mengapa <em>23:23</em>?',
      th: 'ทำไมต้อง <em>23:23</em>?',
      fr: 'Pourquoi <em>23:23</em> ?',
    },
    'ritual.why.subtitle': {
      en: 'The hour the king is replaced.',
      ko: '왕이 교체되는 시각.',
      es: 'La hora en que se reemplaza al King.',
      hi: 'जब King बदलता है, वही घड़ी।',
      vi: 'Giờ mà King được thay thế.',
      pt: 'A hora em que o King é substituído.',
      id: 'Saat King digantikan.',
      th: 'ชั่วโมงที่ King ถูกแทนที่',
      fr: 'L\'heure où le King est remplacé.',
    },
    'ritual.why.accent': {
      ja: '23時23分。<em>一日の終わり、王が交代する刻。</em>',
      en: '23:23. <em>The edge of the day. The hour the king is replaced.</em>',
      ko: '23시 23분. <em>하루의 끝, 왕이 교체되는 시각.</em>',
      es: '23:23. <em>El borde del día. La hora en que se reemplaza al King.</em>',
      hi: '23:23 — <em>दिन का अंत, King के बदलने की घड़ी।</em>',
      vi: '23:23. <em>Mép của ngày. Giờ King được thay thế.</em>',
      pt: '23:23. <em>A borda do dia. A hora em que o King é substituído.</em>',
      id: '23:23. <em>Tepi hari. Saat King digantikan.</em>',
      th: '23:23 <em>ขอบของวัน ชั่วโมงที่ King ถูกแทนที่</em>',
      fr: '23:23. <em>Le bord du jour. L\'heure où le King est remplacé.</em>',
    },
    'ritual.why.p1': {
      en: '23:23 is the threshold — the minute just before a day ends, when '
        + 'everyone in the world is thinking "time to sleep." That '
        + '<strong>edge moment</strong>. KINGMAKER\'s Bell opens only at '
        + 'this hour. Five minutes a week. No more.',
      ko: '23:23은 임계점 — 하루가 끝나기 직전, 세상 모두가 "잘 시간"이라고 생각하는 그 1분. 그 <strong>경계의 순간</strong>. KINGMAKER의 Bell은 이 시각에만 열린다. 주에 5분. 그뿐이다.',
      es: '23:23 es el umbral — el minuto justo antes de que el día termine, cuando todos en el mundo piensan "es hora de dormir". Ese <strong>momento del borde</strong>. La Bell de KINGMAKER se abre solo en esta hora. Cinco minutos por semana. Nada más.',
      hi: '23:23 दहलीज़ है — दिन ख़त्म होने से ठीक पहले का मिनट, जब दुनिया भर में लोग सोचते हैं "अब सोने का वक्त है"। वही <strong>सीमा-क्षण</strong>। KINGMAKER की Bell केवल इसी घड़ी पर खुलती है। हफ्ते में पाँच मिनट। बस।',
      vi: '23:23 là ngưỡng — phút trước khi ngày kết thúc, khi cả thế giới nghĩ "đến giờ ngủ rồi". <strong>Khoảnh khắc ranh giới</strong> đó. Bell của KINGMAKER chỉ mở vào giờ này. Năm phút mỗi tuần. Không hơn.',
      pt: '23:23 é o limiar — o minuto antes do dia acabar, quando todos no mundo pensam "hora de dormir". Esse <strong>momento de borda</strong>. A Bell de KINGMAKER se abre só nessa hora. Cinco minutos por semana. Nada mais.',
      id: '23:23 adalah ambang — menit tepat sebelum hari berakhir, ketika semua orang di dunia berpikir "waktunya tidur". <strong>Saat-tepi</strong> itu. Bell KINGMAKER hanya terbuka di jam ini. Lima menit seminggu. Tak lebih.',
      th: '23:23 คือธรณีประตู — นาทีก่อนวันจะสิ้นสุด เมื่อทุกคนในโลกคิดว่า "ถึงเวลานอน" นั่นคือ<strong>ห้วงเวลาขอบ</strong>นั้น Bell ของ KINGMAKER เปิดเพียงชั่วโมงนี้ ห้านาทีต่อสัปดาห์ ไม่มีอีก',
      fr: '23:23 est le seuil — la minute juste avant la fin du jour, quand tout le monde pense "il est temps de dormir". Ce <strong>moment de bordure</strong>. La Bell de KINGMAKER ne s\'ouvre qu\'à cette heure. Cinq minutes par semaine. Pas plus.',
    },
    'ritual.why.p2': {
      en: 'The Bell opens at <strong>23:23 JST on Friday</strong> and closes '
        + 'at <strong>23:23 JST on Monday</strong>. Each country observes '
        + 'it at the same instant — synchronized to the same point on the '
        + 'globe\'s clock.',
      ko: 'Bell은 <strong>Friday 23:23 JST</strong>에 열려, <strong>Monday 23:23 JST</strong>에 닫힌다. 모든 나라가 동일한 순간에 — 지구 시계의 동일 지점에 — 동기화되어 이를 맞이한다.',
      es: 'La Bell se abre el <strong>Friday 23:23 JST</strong> y se cierra el <strong>Monday 23:23 JST</strong>. Cada país lo observa en el mismo instante — sincronizado al mismo punto del reloj global.',
      hi: 'Bell <strong>Friday 23:23 JST</strong> को खुलती है और <strong>Monday 23:23 JST</strong> को बंद होती है। हर देश इसे ठीक उसी पल देखता है — ग्लोबल घड़ी के एक ही बिंदु पर सिंक।',
      vi: 'Bell mở vào <strong>Friday 23:23 JST</strong> và đóng vào <strong>Monday 23:23 JST</strong>. Mỗi quốc gia quan sát cùng một khoảnh khắc — đồng bộ với cùng một điểm trên đồng hồ địa cầu.',
      pt: 'A Bell se abre na <strong>Friday 23:23 JST</strong> e se fecha na <strong>Monday 23:23 JST</strong>. Cada país a observa no mesmo instante — sincronizado ao mesmo ponto do relógio global.',
      id: 'Bell terbuka pada <strong>Friday 23:23 JST</strong> dan tertutup pada <strong>Monday 23:23 JST</strong>. Setiap negara mengamatinya pada saat yang sama — disinkronkan ke titik yang sama pada jam dunia.',
      th: 'Bell เปิดที่ <strong>Friday 23:23 JST</strong> และปิดที่ <strong>Monday 23:23 JST</strong> ทุกประเทศสังเกตในวินาทีเดียวกัน — ซิงค์ที่จุดเดียวกันบนนาฬิกาโลก',
      fr: 'La Bell s\'ouvre le <strong>Friday 23:23 JST</strong> et se ferme le <strong>Monday 23:23 JST</strong>. Chaque pays l\'observe au même instant — synchronisé au même point sur l\'horloge du globe.',
    },
    'ritual.why.p3': {
      en: 'The hour itself doesn\'t carry meaning. '
        + '<strong>The ritual gives the hour its meaning</strong>.',
      ko: '시각 자체가 의미를 지니는 것은 아니다. <strong>의식이 시각에 의미를 부여한다.</strong>',
      es: 'La hora misma no tiene significado. <strong>El ritual le da significado a la hora.</strong>',
      hi: 'घड़ी अपने आप अर्थ नहीं रखती। <strong>अनुष्ठान घड़ी को अर्थ देता है।</strong>',
      vi: 'Bản thân giờ không mang ý nghĩa. <strong>Nghi thức trao ý nghĩa cho giờ.</strong>',
      pt: 'A hora em si não carrega significado. <strong>O ritual dá significado à hora.</strong>',
      id: 'Jam itu sendiri tak bermakna. <strong>Ritual yang memberi makna pada jam.</strong>',
      th: 'ชั่วโมงนั้นเองไม่มีความหมาย <strong>พิธีกรรมต่างหากที่ให้ความหมายแก่ชั่วโมง</strong>',
      fr: 'L\'heure elle-même ne porte pas de sens. <strong>Le rituel donne son sens à l\'heure.</strong>',
    },

    // --- RITUAL MODAL: ritual-coin (The Offering, ¥100 = 100 Bell) ---
    'ritual.coin.subtitle': {
      ja: '¥100 = 100 Bell。一生残る、参加資格。',
      en: '¥100 = 100 Bell. A participation right that lives forever.',
      ko: '¥100 = 100 Bell. 평생 남는 참가 자격.',
      es: '¥100 = 100 Bell. Un derecho de participación que vive para siempre.',
      hi: '¥100 = 100 Bell। हमेशा रहने वाला भागीदारी अधिकार।',
      vi: '¥100 = 100 Bell. Quyền tham gia tồn tại mãi mãi.',
      pt: '¥100 = 100 Bell. Um direito de participação que dura para sempre.',
      id: '¥100 = 100 Bell. Hak partisipasi yang abadi.',
      th: '¥100 = 100 Bell สิทธิ์เข้าร่วมที่อยู่ตลอดไป',
      fr: '¥100 = 100 Bell. Un droit de participation qui dure pour toujours.',
    },
    'ritual.coin.p1': {
      ja: '¥100を捧げると、<strong>100 Bell</strong>がKINGMAKERに刻まれる。Bellは<strong>参加資格</strong>。法定通貨でも、暗号資産でも、前払式支払手段でもない。換金されず、譲渡されず、価値として測られない。',
      en: 'When you offer ¥100, <strong>100 Bell</strong> is etched into KINGMAKER. Bell is a <strong>Participation Right</strong>. Not legal tender, not crypto, not a prepaid instrument. It is not cashable, not transferable, not measurable as value.',
      ko: '¥100을 바치면 <strong>100 Bell</strong>이 KINGMAKER에 새겨진다. Bell은 <strong>참가 자격</strong>. 법정통화도, 암호자산도, 선불 결제수단도 아니다. 환금되지 않고, 양도되지 않으며, 가치로 측정되지 않는다.',
      es: 'Cuando ofreces ¥100, <strong>100 Bell</strong> queda grabado en KINGMAKER. Bell es un <strong>Derecho de Participación</strong>. No es moneda de curso legal, ni cripto, ni instrumento prepagado. No se canjea, no se transfiere, no se mide como valor.',
      hi: 'जब आप ¥100 अर्पित करते हैं, KINGMAKER में <strong>100 Bell</strong> उत्कीर्ण हो जाते हैं। Bell एक <strong>भागीदारी अधिकार</strong> है। न क़ानूनी मुद्रा, न क्रिप्टो, न प्रीपेड साधन। नकद नहीं होता, हस्तांतरित नहीं होता, मूल्य से नहीं तौला जाता।',
      vi: 'Khi bạn dâng ¥100, <strong>100 Bell</strong> được khắc vào KINGMAKER. Bell là <strong>Quyền tham gia</strong>. Không phải tiền pháp định, không phải tiền mã hóa, không phải phương tiện thanh toán trả trước. Không quy đổi tiền, không chuyển nhượng, không đo bằng giá trị.',
      pt: 'Quando você oferece ¥100, <strong>100 Bell</strong> é gravado em KINGMAKER. Bell é um <strong>Direito de Participação</strong>. Não é moeda legal, não é cripto, não é instrumento pré-pago. Não se converte em dinheiro, não se transfere, não se mede como valor.',
      id: 'Saat kau menyerahkan ¥100, <strong>100 Bell</strong> terukir di KINGMAKER. Bell adalah <strong>Hak Partisipasi</strong>. Bukan mata uang sah, bukan kripto, bukan alat bayar prabayar. Tak ditukar uang, tak dialihkan, tak diukur sebagai nilai.',
      th: 'เมื่อคุณถวาย ¥100 <strong>100 Bell</strong> ถูกสลักไว้ใน KINGMAKER Bell คือ<strong>สิทธิ์เข้าร่วม</strong> ไม่ใช่เงินตามกฎหมาย ไม่ใช่คริปโต ไม่ใช่เครื่องมือชำระเงินจ่ายล่วงหน้า แปลงเป็นเงินไม่ได้ โอนไม่ได้ วัดเป็นมูลค่าไม่ได้',
      fr: 'Quand tu offres ¥100, <strong>100 Bell</strong> est gravé dans KINGMAKER. Bell est un <strong>Droit de Participation</strong>. Pas une monnaie légale, pas une crypto, pas un instrument prépayé. Pas convertible en argent, pas transférable, pas mesurable comme valeur.',
    },
    'ritual.coin.p2': {
      ja: '毎週 THE TRIAL に挑むには、<strong>10 Bell</strong> を鳴らす。3つのラウンドを通過すれば<strong>Kingの候補資格</strong>が解錠される。一つ間違えると、<strong>Bell は減らない</strong> ─ "今週のチャンス" だけを失う。来週、また鳴らせ。',
      en: 'To enter THE TRIAL each week, you ring <strong>10 Bell</strong>. Pass all three rounds and your <strong>King candidacy</strong> is unlocked. Get one wrong and <strong>Bell does not decrease</strong> — you only lose "this week\'s chance." Ring again next week.',
      ko: '매주 THE TRIAL에 도전하려면 <strong>10 Bell</strong>을 울려라. 세 라운드를 통과하면 <strong>King 후보 자격</strong>이 열린다. 하나를 틀리면 <strong>Bell은 줄지 않는다</strong> — "이번 주의 기회"만 잃을 뿐. 다음 주에 다시 울려라.',
      es: 'Para entrar a THE TRIAL cada semana, haces sonar <strong>10 Bell</strong>. Si pasas las tres rondas, se desbloquea la <strong>candidatura a King</strong>. Si fallas una, <strong>Bell no disminuye</strong> — solo pierdes "la oportunidad de esta semana". Vuelve a sonar la próxima.',
      hi: 'हर हफ्ते THE TRIAL में जाने के लिए <strong>10 Bell</strong> बजाओ। तीनों राउंड पास करो, और <strong>King की उम्मीदवारी</strong> खुलती है। एक भी ग़लत, और <strong>Bell घटती नहीं</strong> — सिर्फ़ "इस हफ़्ते का मौक़ा" जाता है। अगले हफ़्ते फिर बजाओ।',
      vi: 'Mỗi tuần để vào THE TRIAL, bạn rung <strong>10 Bell</strong>. Vượt qua cả ba vòng, <strong>tư cách ứng viên King</strong> được mở. Sai một câu, <strong>Bell không giảm</strong> — bạn chỉ mất "cơ hội tuần này". Tuần sau hãy rung lại.',
      pt: 'Para entrar no THE TRIAL toda semana, você toca <strong>10 Bell</strong>. Passa as três rodadas, e a <strong>candidatura a King</strong> é desbloqueada. Erra uma, e <strong>Bell não diminui</strong> — você só perde "a chance desta semana". Toque de novo na próxima.',
      id: 'Setiap pekan untuk masuk THE TRIAL, kau bunyikan <strong>10 Bell</strong>. Lolos tiga ronde, <strong>kandidasi King</strong> terbuka. Salah satu, <strong>Bell tidak berkurang</strong> — kau hanya kehilangan "kesempatan pekan ini". Pekan depan, bunyikan lagi.',
      th: 'ทุกสัปดาห์เพื่อเข้า THE TRIAL คุณสั่น <strong>10 Bell</strong> ผ่านครบสามรอบ <strong>สิทธิ์ผู้สมัคร King</strong> จะถูกปลดล็อก ผิดข้อเดียว <strong>Bell ไม่ลด</strong> — คุณเสียเพียง "โอกาสสัปดาห์นี้" สัปดาห์หน้าก็สั่นใหม่',
      fr: 'Chaque semaine pour entrer dans THE TRIAL, tu fais sonner <strong>10 Bell</strong>. Passe les trois rondes, et la <strong>candidature King</strong> est déverrouillée. Une erreur, et <strong>Bell ne diminue pas</strong> — tu perds juste "la chance de cette semaine". Sonne à nouveau la semaine prochaine.',
    },
    'ritual.coin.li1': {
      ja: '<strong>Bell = 参加資格。</strong>換金されず、譲渡されず、資産価値はない。',
      en: '<strong>Bell = Participation Right.</strong> Not cashable, not transferable, no asset value.',
      ko: '<strong>Bell = 참가 자격.</strong> 환금 불가, 양도 불가, 자산 가치 없음.',
      es: '<strong>Bell = Derecho de Participación.</strong> No canjeable, no transferible, sin valor de activo.',
      hi: '<strong>Bell = भागीदारी अधिकार।</strong> नकद नहीं, हस्तांतरित नहीं, कोई परिसंपत्ति-मूल्य नहीं।',
      vi: '<strong>Bell = Quyền tham gia.</strong> Không quy đổi, không chuyển nhượng, không có giá trị tài sản.',
      pt: '<strong>Bell = Direito de Participação.</strong> Não conversível, não transferível, sem valor de ativo.',
      id: '<strong>Bell = Hak Partisipasi.</strong> Tak ditukar uang, tak dialihkan, tanpa nilai aset.',
      th: '<strong>Bell = สิทธิ์เข้าร่วม</strong> แปลงเป็นเงินไม่ได้ โอนไม่ได้ ไม่มีมูลค่าทรัพย์สิน',
      fr: '<strong>Bell = Droit de Participation.</strong> Non convertible, non transférable, sans valeur d\'actif.',
    },
    'ritual.coin.li2': {
      ja: '毎週、THE TRIALで10 Bellを鳴らす(Bellは鳴っても残る)。',
      en: 'Each week, ring 10 Bell at THE TRIAL (Bell rings but stays with you).',
      ko: '매주 THE TRIAL에서 10 Bell을 울린다(Bell은 울려도 남는다).',
      es: 'Cada semana, suenas 10 Bell en THE TRIAL (la Bell suena pero queda contigo).',
      hi: 'हर हफ्ते THE TRIAL में 10 Bell बजाओ (Bell बजती है पर साथ रहती है)।',
      vi: 'Mỗi tuần, rung 10 Bell tại THE TRIAL (Bell vang nhưng vẫn ở lại với bạn).',
      pt: 'Toda semana, você toca 10 Bell no THE TRIAL (a Bell soa mas permanece com você).',
      id: 'Setiap pekan, kau bunyikan 10 Bell di THE TRIAL (Bell berbunyi tetapi tetap bersamamu).',
      th: 'ทุกสัปดาห์ สั่น 10 Bell ที่ THE TRIAL (Bell ดังแต่ยังอยู่กับคุณ)',
      fr: 'Chaque semaine, tu fais sonner 10 Bell à THE TRIAL (la Bell sonne mais reste avec toi).',
    },
    'ritual.coin.li3': {
      ja: '失敗してもBellは消費されない。<strong>今週のKing候補資格</strong>のみを失う。',
      en: 'Failure does not consume Bell. You only lose <strong>this week\'s King candidacy</strong>.',
      ko: '실패해도 Bell은 소모되지 않는다. <strong>이번 주 King 후보 자격</strong>만 잃을 뿐.',
      es: 'El fracaso no consume Bell. Solo pierdes <strong>la candidatura a King de esta semana</strong>.',
      hi: 'विफलता Bell को नहीं खाती। केवल <strong>इस हफ्ते की King-उम्मीदवारी</strong> जाती है।',
      vi: 'Thất bại không tiêu Bell. Bạn chỉ mất <strong>tư cách ứng viên King tuần này</strong>.',
      pt: 'Falhar não consome Bell. Você só perde <strong>a candidatura a King desta semana</strong>.',
      id: 'Gagal tak menghabiskan Bell. Kau hanya kehilangan <strong>kandidasi King pekan ini</strong>.',
      th: 'ความล้มเหลวไม่บริโภค Bell คุณเสียเพียง <strong>สิทธิ์ผู้สมัคร King สัปดาห์นี้</strong>',
      fr: 'L\'échec ne consomme pas Bell. Tu perds seulement <strong>la candidature King de cette semaine</strong>.',
    },
    'ritual.coin.li4': {
      ja: '3ラウンド全通過 → 候補資格解錠 → CROWN SLOTへ進む。',
      en: 'Pass all three rounds → Qualification Unlocked → proceed to CROWN SLOT.',
      ko: '3라운드 모두 통과 → 후보 자격 해제 → CROWN SLOT으로 진행.',
      es: 'Pasa las tres rondas → Candidatura desbloqueada → al CROWN SLOT.',
      hi: 'तीनों राउंड पास → योग्यता खुली → CROWN SLOT की ओर।',
      vi: 'Qua cả ba vòng → Tư cách mở khóa → tiến tới CROWN SLOT.',
      pt: 'Passe as três rodadas → Candidatura desbloqueada → siga ao CROWN SLOT.',
      id: 'Lolos tiga ronde → Kandidasi terbuka → lanjut ke CROWN SLOT.',
      th: 'ผ่านครบสามรอบ → ปลดล็อกสิทธิ์ → ไปที่ CROWN SLOT',
      fr: 'Passe les trois rondes → Candidature déverrouillée → direction CROWN SLOT.',
    },
    'ritual.coin.li5': {
      ja: '未使用Bellの有効期限:取得から12か月。決済はSquareを通じて。',
      en: 'Unused Bell expiry: 12 months from acquisition. Payments via Square.',
      ko: '미사용 Bell의 유효기간: 취득 후 12개월. 결제는 Square를 통해.',
      es: 'Caducidad de Bell sin usar: 12 meses desde la adquisición. Pagos vía Square.',
      hi: 'अप्रयुक्त Bell की समाप्ति: अधिग्रहण से 12 महीने। भुगतान Square द्वारा।',
      vi: 'Bell chưa dùng hết hạn: 12 tháng kể từ khi nhận. Thanh toán qua Square.',
      pt: 'Validade da Bell não usada: 12 meses a partir da aquisição. Pagamentos via Square.',
      id: 'Bell yang tak terpakai berlaku 12 bulan sejak diperoleh. Pembayaran via Square.',
      th: 'Bell ที่ไม่ได้ใช้หมดอายุ 12 เดือนนับจากได้รับ ชำระเงินผ่าน Square',
      fr: 'Expiration des Bell non utilisées : 12 mois après acquisition. Paiements via Square.',
    },
    'ritual.coin.accent2': {
      ja: '¥100は<em>永遠に</em>生きる。',
      en: '¥100 lives <em>forever</em>.',
      ko: '¥100은 <em>영원히</em> 산다.',
      es: '¥100 vive <em>para siempre</em>.',
      hi: '¥100 <em>हमेशा के लिए</em> जीवित रहता है।',
      vi: '¥100 sống <em>mãi mãi</em>.',
      pt: '¥100 vive <em>para sempre</em>.',
      id: '¥100 hidup <em>selamanya</em>.',
      th: '¥100 อยู่ <em>ตลอดไป</em>',
      fr: '¥100 vit <em>pour toujours</em>.',
    },
    'ritual.coin.cta': {
      ja: '⌘ Squareへ進む · ¥100を捧げる',
      en: '⌘ Proceed to Square · Offer ¥100',
      ko: '⌘ Square로 진행 · ¥100 바치기',
      es: '⌘ Ir a Square · Ofrecer ¥100',
      hi: '⌘ Square पर जाएँ · ¥100 अर्पित करें',
      vi: '⌘ Tới Square · Dâng ¥100',
      pt: '⌘ Ir ao Square · Ofereça ¥100',
      id: '⌘ Lanjut ke Square · Persembahkan ¥100',
      th: '⌘ ไปที่ Square · ถวาย ¥100',
      fr: '⌘ Aller à Square · Offrir ¥100',
    },
    'ritual.coin.note': {
      ja: '— Webhook連携テスト中 · サンドボックス環境 —',
      en: '— Webhook integration in test · Sandbox environment —',
      ko: '— 웹훅 연동 테스트 중 · 샌드박스 환경 —',
      es: '— Integración de Webhook en pruebas · Entorno sandbox —',
      hi: '— Webhook एकीकरण परीक्षण में · सैंडबॉक्स वातावरण —',
      vi: '— Tích hợp Webhook đang thử nghiệm · Môi trường sandbox —',
      pt: '— Integração de Webhook em teste · Ambiente sandbox —',
      id: '— Integrasi Webhook dalam pengujian · Lingkungan sandbox —',
      th: '— กำลังทดสอบการเชื่อมต่อ Webhook · สภาพแวดล้อม sandbox —',
      fr: '— Intégration Webhook en test · Environnement sandbox —',
    },

    // --- RITUAL MODAL: ritual-bell (THE BELL — qualification not money) ---
    'ritual.bell.subtitle': {
      ja: 'Bellは資格。お金ではない。',
      en: 'Bell is a Right. Never cash.',
      ko: 'Bell은 자격. 돈이 아니다.',
      es: 'Bell es un Derecho. Nunca dinero.',
      hi: 'Bell अधिकार है। नकद नहीं।',
      vi: 'Bell là Quyền. Không phải tiền.',
      pt: 'Bell é um Direito. Nunca dinheiro.',
      id: 'Bell adalah Hak. Bukan uang.',
      th: 'Bell คือสิทธิ์ ไม่ใช่เงิน',
      fr: 'Bell est un Droit. Jamais de l\'argent.',
    },
    'ritual.bell.accent_jp': {
      ja: 'Bellは決して失われない。失われるのは「今週のチャンス」だけ。',
      en: 'You never lose your Bell. You only lose this week\'s chance.',
      ko: 'Bell은 절대 잃지 않는다. 잃는 것은 "이번 주의 기회"뿐.',
      es: 'Nunca pierdes tu Bell. Solo pierdes "la oportunidad de esta semana".',
      hi: 'अपनी Bell कभी नहीं खोते। केवल "इस हफ़्ते का मौक़ा" जाता है।',
      vi: 'Bạn không bao giờ mất Bell. Bạn chỉ mất "cơ hội tuần này".',
      pt: 'Você nunca perde sua Bell. Só perde "a chance desta semana".',
      id: 'Bell-mu tak pernah hilang. Yang hilang hanyalah "kesempatan pekan ini".',
      th: 'คุณไม่เคยสูญ Bell คุณเสียเพียง "โอกาสสัปดาห์นี้"',
      fr: 'Tu ne perds jamais ta Bell. Tu perds seulement "la chance de cette semaine".',
    },
    'ritual.bell.is1': {
      ja: 'KINGMAKER内部の<strong>参加資格</strong>。',
      en: 'A <strong>Participation Right</strong> inside KINGMAKER.',
      ko: 'KINGMAKER 내부의 <strong>참가 자격</strong>.',
      es: 'Un <strong>Derecho de Participación</strong> dentro de KINGMAKER.',
      hi: 'KINGMAKER के अंदर का <strong>भागीदारी अधिकार</strong>।',
      vi: 'Một <strong>Quyền tham gia</strong> bên trong KINGMAKER.',
      pt: 'Um <strong>Direito de Participação</strong> dentro de KINGMAKER.',
      id: '<strong>Hak Partisipasi</strong> di dalam KINGMAKER.',
      th: '<strong>สิทธิ์เข้าร่วม</strong>ภายใน KINGMAKER',
      fr: 'Un <strong>Droit de Participation</strong> à l\'intérieur de KINGMAKER.',
    },
    'ritual.bell.is2': {
      ja: '毎週 THE TRIAL に入る権利の単位。',
      en: 'The unit of right to enter THE TRIAL each week.',
      ko: '매주 THE TRIAL에 들어가는 권리의 단위.',
      es: 'La unidad del derecho a entrar a THE TRIAL cada semana.',
      hi: 'हर हफ्ते THE TRIAL में जाने का अधिकार-इकाई।',
      vi: 'Đơn vị quyền vào THE TRIAL mỗi tuần.',
      pt: 'A unidade do direito de entrar no THE TRIAL toda semana.',
      id: 'Unit hak untuk masuk THE TRIAL setiap pekan.',
      th: 'หน่วยสิทธิ์เพื่อเข้า THE TRIAL ทุกสัปดาห์',
      fr: 'L\'unité du droit d\'entrer dans THE TRIAL chaque semaine.',
    },
    'ritual.bell.is3': {
      ja: 'Kingの候補資格を解錠する鍵。',
      en: 'The key that unlocks King candidacy.',
      ko: 'King 후보 자격을 푸는 열쇠.',
      es: 'La llave que desbloquea la candidatura a King.',
      hi: 'King-उम्मीदवारी को खोलने वाली चाबी।',
      vi: 'Chìa khóa mở khóa tư cách ứng viên King.',
      pt: 'A chave que desbloqueia a candidatura a King.',
      id: 'Kunci yang membuka kandidasi King.',
      th: 'กุญแจที่ปลดล็อกสิทธิ์ผู้สมัคร King',
      fr: 'La clé qui déverrouille la candidature King.',
    },
    'ritual.bell.is4': {
      ja: '儀式のための「鳴らす道具」 — 金銭価値はない。',
      en: 'A "ringing instrument" for the ritual — no monetary value.',
      ko: '의식을 위한 "울리는 도구" — 금전적 가치는 없다.',
      es: 'Un "instrumento de toque" para el ritual — sin valor monetario.',
      hi: 'अनुष्ठान के लिए "बजाने का साधन" — कोई पैसे का मूल्य नहीं।',
      vi: 'Một "công cụ rung" cho nghi thức — không có giá trị tiền tệ.',
      pt: 'Um "instrumento de toque" para o ritual — sem valor monetário.',
      id: 'Sebuah "alat berbunyi" untuk ritual — tanpa nilai uang.',
      th: '"เครื่องมือสั่น" สำหรับพิธีกรรม — ไม่มีมูลค่าทางการเงิน',
      fr: 'Un "instrument à faire sonner" pour le rituel — sans valeur monétaire.',
    },
    'ritual.bell.isnot1': {
      ja: '法定通貨ではない。',
      en: 'Not legal tender.',
      ko: '법정 통화가 아니다.',
      es: 'No es moneda de curso legal.',
      hi: 'क़ानूनी मुद्रा नहीं।',
      vi: 'Không phải tiền pháp định.',
      pt: 'Não é moeda de curso legal.',
      id: 'Bukan mata uang sah.',
      th: 'ไม่ใช่เงินตามกฎหมาย',
      fr: 'Pas une monnaie légale.',
    },
    'ritual.bell.isnot2': {
      ja: '暗号資産ではない(資金決済法 §2-14)。',
      en: 'Not crypto-currency (Payment Services Act §2-14).',
      ko: '암호자산이 아니다(자금결제법 §2-14).',
      es: 'No es cripto-moneda (Ley de Servicios de Pago §2-14).',
      hi: 'क्रिप्टो-करेंसी नहीं (Payment Services Act §2-14)।',
      vi: 'Không phải tiền mã hóa (Luật Dịch vụ Thanh toán §2-14).',
      pt: 'Não é criptomoeda (Lei de Serviços de Pagamento §2-14).',
      id: 'Bukan mata uang kripto (UU Layanan Pembayaran §2-14).',
      th: 'ไม่ใช่สกุลเงินดิจิทัล (กฎหมายบริการชำระเงิน §2-14)',
      fr: 'Pas une cryptomonnaie (Loi sur les services de paiement §2-14).',
    },
    'ritual.bell.isnot3': {
      ja: '前払式支払手段ではない(資金決済法 §3)。',
      en: 'Not a prepaid payment instrument (Payment Services Act §3).',
      ko: '선불 결제수단이 아니다(자금결제법 §3).',
      es: 'No es instrumento de pago prepagado (Ley de Servicios de Pago §3).',
      hi: 'प्रीपेड पेमेंट इन्स्ट्रूमेंट नहीं (Payment Services Act §3)।',
      vi: 'Không phải phương tiện thanh toán trả trước (Luật Dịch vụ Thanh toán §3).',
      pt: 'Não é instrumento de pagamento pré-pago (Lei de Serviços de Pagamento §3).',
      id: 'Bukan alat pembayaran prabayar (UU Layanan Pembayaran §3).',
      th: 'ไม่ใช่เครื่องมือชำระเงินจ่ายล่วงหน้า (กฎหมายบริการชำระเงิน §3)',
      fr: 'Pas un instrument de paiement prépayé (Loi sur les services de paiement §3).',
    },
    'ritual.bell.isnot4': {
      ja: '有価証券・投資商品ではない(金商法)。',
      en: 'Not a security or investment product (FIEA).',
      ko: '유가증권·투자상품이 아니다(금융상품거래법).',
      es: 'No es valor ni producto de inversión (FIEA).',
      hi: 'प्रतिभूति या निवेश-उत्पाद नहीं (FIEA)।',
      vi: 'Không phải chứng khoán hay sản phẩm đầu tư (FIEA).',
      pt: 'Não é título nem produto de investimento (FIEA).',
      id: 'Bukan sekuritas atau produk investasi (FIEA).',
      th: 'ไม่ใช่หลักทรัพย์หรือผลิตภัณฑ์ลงทุน (FIEA)',
      fr: 'Pas un titre ni un produit d\'investissement (FIEA).',
    },
    'ritual.bell.isnot5': {
      ja: 'ポイント・マイル・リワードではない。',
      en: 'Not points, miles, or rewards.',
      ko: '포인트·마일·리워드가 아니다.',
      es: 'No son puntos, millas ni recompensas.',
      hi: 'पॉइंट, माइल या रिवॉर्ड नहीं।',
      vi: 'Không phải điểm, dặm hay phần thưởng.',
      pt: 'Não são pontos, milhas nem recompensas.',
      id: 'Bukan poin, mil, atau hadiah.',
      th: 'ไม่ใช่คะแนน ไมล์ หรือรางวัล',
      fr: 'Pas des points, miles ou récompenses.',
    },
    'ritual.bell.flow_p': {
      ja: '<strong>Walletは存在しない。</strong>残高は溜められず、返金はできない。毎週、参加の瞬間に限り、Square Card-on-Fileを通じて¥100を捧げてBellを鳴らす。',
      en: '<strong>There is no Wallet.</strong> You cannot accumulate a balance and cannot get a refund. Each week, only at the moment of participation, you offer ¥100 via Square Card-on-File to ring the Bell.',
      ko: '<strong>Wallet은 존재하지 않는다.</strong> 잔고는 모을 수 없고, 환불도 안 된다. 매주 참가의 순간에만 Square Card-on-File을 통해 ¥100을 바쳐 Bell을 울린다.',
      es: '<strong>No hay Wallet.</strong> No puedes acumular saldo ni recibir reembolso. Cada semana, solo en el instante de la participación, ofreces ¥100 vía Square Card-on-File para hacer sonar la Bell.',
      hi: '<strong>Wallet नहीं है।</strong> बैलेंस जमा नहीं कर सकते, रिफ़ंड नहीं ले सकते। हर हफ्ते, भाग लेने के क्षण में ही, Square Card-on-File से ¥100 अर्पित करके Bell बजती है।',
      vi: '<strong>Không có Wallet.</strong> Bạn không thể tích lũy số dư và không thể hoàn tiền. Mỗi tuần, chỉ ở khoảnh khắc tham gia, bạn dâng ¥100 qua Square Card-on-File để rung Bell.',
      pt: '<strong>Não há Wallet.</strong> Você não acumula saldo nem recebe reembolso. Toda semana, só no instante da participação, você oferece ¥100 via Square Card-on-File para tocar a Bell.',
      id: '<strong>Tak ada Wallet.</strong> Kau tak bisa menumpuk saldo dan tak bisa minta refund. Setiap pekan, hanya pada saat partisipasi, kau menyerahkan ¥100 via Square Card-on-File untuk membunyikan Bell.',
      th: '<strong>ไม่มี Wallet</strong> คุณสะสมยอดไม่ได้ และขอคืนเงินไม่ได้ ทุกสัปดาห์ เฉพาะในวินาทีเข้าร่วม คุณถวาย ¥100 ผ่าน Square Card-on-File เพื่อสั่น Bell',
      fr: '<strong>Il n\'y a pas de Wallet.</strong> Tu ne peux pas accumuler de solde ni obtenir de remboursement. Chaque semaine, seulement à l\'instant de participation, tu offres ¥100 via Square Card-on-File pour faire sonner la Bell.',
    },
    'ritual.bell.flow_head': {
      ja: '— Bellはこう鳴る —',
      en: '— How the Bell rings —',
      ko: '— Bell은 이렇게 울린다 —',
      es: '— Cómo suena la Bell —',
      hi: '— Bell ऐसे बजती है —',
      vi: '— Bell vang lên thế nào —',
      pt: '— Como a Bell soa —',
      id: '— Bagaimana Bell berbunyi —',
      th: '— Bell ดังอย่างไร —',
      fr: '— Comment la Bell sonne —',
    },
    'ritual.bell.flow_li1': {
      ja: 'Friday 23:23 → 通知 <em>"Bell が呼んでいる。"</em>',
      en: 'Friday 23:23 → notification <em>"The Bell is calling."</em>',
      ko: 'Friday 23:23 → 알림 <em>"Bell이 부르고 있다."</em>',
      es: 'Friday 23:23 → notificación <em>"La Bell está llamando."</em>',
      hi: 'Friday 23:23 → सूचना <em>"Bell बुला रही है।"</em>',
      vi: 'Friday 23:23 → thông báo <em>"Bell đang gọi."</em>',
      pt: 'Friday 23:23 → notificação <em>"A Bell está chamando."</em>',
      id: 'Friday 23:23 → notifikasi <em>"Bell sedang memanggil."</em>',
      th: 'Friday 23:23 → การแจ้งเตือน <em>"Bell กำลังเรียก"</em>',
      fr: 'Friday 23:23 → notification <em>"La Bell appelle."</em>',
    },
    'ritual.bell.flow_li2': {
      ja: '<strong>ENTER THE BELL</strong>をタップ → Squareが¥100を請求 → THE TRIALが始まる。',
      en: 'Tap <strong>ENTER THE BELL</strong> → Square charges ¥100 → THE TRIAL begins.',
      ko: '<strong>ENTER THE BELL</strong>을 탭 → Square가 ¥100을 청구 → THE TRIAL이 시작.',
      es: 'Toca <strong>ENTER THE BELL</strong> → Square cobra ¥100 → comienza THE TRIAL.',
      hi: '<strong>ENTER THE BELL</strong> टैप → Square ¥100 चार्ज करता है → THE TRIAL शुरू।',
      vi: 'Chạm <strong>ENTER THE BELL</strong> → Square tính phí ¥100 → THE TRIAL bắt đầu.',
      pt: 'Toque <strong>ENTER THE BELL</strong> → Square cobra ¥100 → THE TRIAL começa.',
      id: 'Ketuk <strong>ENTER THE BELL</strong> → Square menagih ¥100 → THE TRIAL dimulai.',
      th: 'แตะ <strong>ENTER THE BELL</strong> → Square เรียกเก็บ ¥100 → THE TRIAL เริ่ม',
      fr: 'Touche <strong>ENTER THE BELL</strong> → Square prélève ¥100 → THE TRIAL commence.',
    },
    'ritual.bell.flow_li3': {
      ja: 'スキップした週:完全な静寂 — 自動課金なし、残高保持なし。',
      en: 'Weeks you skip: complete stillness — no auto-charge, no balance held.',
      ko: '건너뛴 주: 완전한 침묵 — 자동 결제 없음, 잔고 유지 없음.',
      es: 'Semanas que saltas: silencio total — sin cargo automático, sin saldo retenido.',
      hi: 'जिन हफ़्तों आप छोड़ते हैं: पूर्ण नीरवता — कोई ऑटो-चार्ज नहीं, कोई बैलेंस होल्ड नहीं।',
      vi: 'Tuần bạn bỏ qua: hoàn toàn tĩnh lặng — không tự động tính phí, không giữ số dư.',
      pt: 'Semanas que você pula: silêncio total — sem cobrança automática, sem saldo retido.',
      id: 'Pekan yang kau lewati: keheningan penuh — tanpa biaya otomatis, tanpa saldo tertahan.',
      th: 'สัปดาห์ที่คุณข้าม: ความเงียบสมบูรณ์ — ไม่มีเรียกเก็บอัตโนมัติ ไม่มียอดค้าง',
      fr: 'Les semaines que tu sautes : silence total — pas de prélèvement auto, pas de solde retenu.',
    },
    'ritual.bell.flow_li4': {
      ja: '失敗してもBellは消費されない。来週、また鳴らせる。',
      en: 'Failure does not consume Bell. Next week, you can ring again.',
      ko: '실패해도 Bell은 소모되지 않는다. 다음 주에 다시 울릴 수 있다.',
      es: 'El fracaso no consume Bell. La próxima semana, puedes sonarla de nuevo.',
      hi: 'विफलता Bell को नहीं खाती। अगले हफ्ते, फिर बजा सकते हैं।',
      vi: 'Thất bại không tiêu Bell. Tuần sau, bạn có thể rung lại.',
      pt: 'Falhar não consome Bell. Na próxima semana, você pode tocá-la de novo.',
      id: 'Gagal tak menghabiskan Bell. Pekan depan, kau bisa membunyikannya lagi.',
      th: 'ความล้มเหลวไม่บริโภค Bell สัปดาห์หน้าคุณสั่นได้อีก',
      fr: 'L\'échec ne consomme pas Bell. La semaine prochaine, tu peux la faire sonner à nouveau.',
    },
    'ritual.bell.closing': {
      ja: 'これは「賭け金」ではない。これは「鐘を鳴らす行為」だ。',
      en: 'This is not "stake money." This is "the act of ringing the bell."',
      ko: '이것은 "판돈"이 아니다. 이것은 "종을 울리는 행위"다.',
      es: 'Esto no es "apuesta". Esto es "el acto de tocar la campana".',
      hi: 'यह "दांव" नहीं है। यह "घंटी बजाने का कर्म" है।',
      vi: 'Đây không phải "tiền đặt cược". Đây là "hành động rung chuông".',
      pt: 'Isto não é "aposta". Isto é "o ato de tocar o sino".',
      id: 'Ini bukan "uang taruhan". Ini adalah "tindakan membunyikan bel".',
      th: 'นี่ไม่ใช่ "เงินเดิมพัน" นี่คือ "การสั่นกระดิ่ง"',
      fr: 'Ce n\'est pas "une mise". C\'est "l\'acte de faire sonner la cloche".',
    },
    'ritual.bell.cta': {
      ja: '⌘ THE TRIALとは何か、を見る',
      en: '⌘ See what THE TRIAL is',
      ko: '⌘ THE TRIAL이란 무엇인가, 보러 가기',
      es: '⌘ Ver qué es THE TRIAL',
      hi: '⌘ देखें THE TRIAL क्या है',
      vi: '⌘ Xem THE TRIAL là gì',
      pt: '⌘ Ver o que é THE TRIAL',
      id: '⌘ Lihat apa itu THE TRIAL',
      th: '⌘ ดูว่า THE TRIAL คืออะไร',
      fr: '⌘ Voir ce qu\'est THE TRIAL',
    },

    // --- RITUAL MODAL: ritual-three (CROWN SLOT) ---
    'ritual.three.subtitle': {
      ja: '最終の儀式。世界の指が、同じ数字で止まる瞬間。',
      en: 'The final ritual. The moment the world\'s fingers stop on the same number.',
      ko: '최후의 의식. 세계의 손가락이 같은 숫자에서 멈추는 순간.',
      es: 'El ritual final. El instante en que los dedos del mundo se detienen en el mismo número.',
      hi: 'अंतिम अनुष्ठान। वह क्षण जब दुनिया की उँगलियाँ एक ही अंक पर रुकती हैं।',
      vi: 'Nghi thức cuối cùng. Khoảnh khắc những ngón tay của thế giới dừng lại trên cùng một con số.',
      pt: 'O ritual final. O instante em que os dedos do mundo param no mesmo número.',
      id: 'Ritual terakhir. Saat jari-jari dunia berhenti pada angka yang sama.',
      th: 'พิธีกรรมสุดท้าย วินาทีที่นิ้วของโลกหยุดที่ตัวเลขเดียวกัน',
      fr: 'Le rituel final. L\'instant où les doigts du monde s\'arrêtent sur le même chiffre.',
    },
    'ritual.three.p1': {
      ja: 'Round 1とRound 2を生き残った者だけが、Round 3に立つ権利を得る ─ <strong>CROWN SLOT</strong>。00〜99のスロットが画面で回る。あなたは一度タップして止める。',
      en: 'Only those who survived Round 1 and Round 2 earn the right to stand in Round 3 — <strong>CROWN SLOT</strong>. A slot of 00–99 spins on screen. You tap once to stop it.',
      ko: 'Round 1과 Round 2를 살아남은 자만이 Round 3 — <strong>CROWN SLOT</strong>에 설 권리를 얻는다. 00〜99의 슬롯이 화면에서 돈다. 당신은 한 번 탭으로 멈춘다.',
      es: 'Solo quienes sobreviven a la Round 1 y Round 2 ganan el derecho a estar en la Round 3 — <strong>CROWN SLOT</strong>. Un slot de 00–99 gira en pantalla. Tocas una vez para detenerlo.',
      hi: 'Round 1 और Round 2 जो जिए, वही Round 3 — <strong>CROWN SLOT</strong> — में खड़े होने का अधिकार पाते हैं। स्क्रीन पर 00–99 का स्लॉट घूमता है। आप एक बार टैप करके रोकते हैं।',
      vi: 'Chỉ những ai sống sót qua Round 1 và Round 2 mới giành được quyền đứng trong Round 3 — <strong>CROWN SLOT</strong>. Một ô 00–99 quay trên màn hình. Bạn chạm một lần để dừng nó.',
      pt: 'Só quem sobrevive à Round 1 e Round 2 ganha o direito de estar na Round 3 — <strong>CROWN SLOT</strong>. Um slot de 00–99 gira na tela. Você toca uma vez para parar.',
      id: 'Hanya yang lolos dari Round 1 dan Round 2 yang mendapat hak berdiri di Round 3 — <strong>CROWN SLOT</strong>. Sebuah slot 00–99 berputar di layar. Kau sentuh sekali untuk menghentikannya.',
      th: 'มีเพียงผู้รอดจาก Round 1 และ Round 2 ที่ได้สิทธิ์ยืนใน Round 3 — <strong>CROWN SLOT</strong> สล็อต 00–99 หมุนบนหน้าจอ คุณแตะหนึ่งครั้งเพื่อหยุด',
      fr: 'Seuls ceux qui survivent à la Round 1 et à la Round 2 gagnent le droit de se tenir dans la Round 3 — <strong>CROWN SLOT</strong>. Un slot de 00–99 tourne à l\'écran. Tu touches une fois pour l\'arrêter.',
    },
    'ritual.three.p2': {
      ja: '世界中の指が同じ瞬間にスロットを止める。最も多くの人が止めた数字が、その週の<strong>Crown Number</strong>となる。',
      en: 'Every finger in the world stops the slot at the same instant. The number most people stopped on becomes that week\'s <strong>Crown Number</strong>.',
      ko: '전 세계의 손가락이 같은 순간에 슬롯을 멈춘다. 가장 많은 사람이 멈춘 숫자가 그 주의 <strong>Crown Number</strong>가 된다.',
      es: 'Cada dedo del mundo detiene el slot en el mismo instante. El número en el que más personas se detienen se convierte en el <strong>Crown Number</strong> de esa semana.',
      hi: 'दुनिया भर की उँगलियाँ एक ही पल में स्लॉट रोकती हैं। जिस अंक पर सबसे ज़्यादा लोग रुकते हैं, वह उस हफ़्ते का <strong>Crown Number</strong> बनता है।',
      vi: 'Mỗi ngón tay trên thế giới dừng slot cùng lúc. Con số nhiều người dừng nhất trở thành <strong>Crown Number</strong> của tuần đó.',
      pt: 'Cada dedo do mundo para o slot no mesmo instante. O número em que mais pessoas param torna-se o <strong>Crown Number</strong> daquela semana.',
      id: 'Setiap jari di dunia menghentikan slot pada saat yang sama. Angka yang dihentikan paling banyak orang menjadi <strong>Crown Number</strong> pekan itu.',
      th: 'นิ้วทุกนิ้วทั่วโลกหยุดสล็อตในวินาทีเดียวกัน ตัวเลขที่คนหยุดมากที่สุดกลายเป็น <strong>Crown Number</strong> ของสัปดาห์นั้น',
      fr: 'Chaque doigt du monde arrête le slot au même instant. Le nombre sur lequel le plus de gens s\'arrêtent devient le <strong>Crown Number</strong> de la semaine.',
    },
    'ritual.three.p3': {
      ja: 'その数字に着地した応募者の中から、公開Seed(BTC · 日経 · S&P · 応募者数のSHA-256)によって<strong>Kingが決定される</strong>。これは選抜ではなく、<strong>世界の合意 + 公開数式</strong>による確定だ。',
      en: 'From the applicants who landed on that number, the <strong>King is determined</strong> by a public Seed (SHA-256 of BTC · Nikkei · S&P · applicant count). This is not a selection — it is determination by <strong>world consensus + public formula</strong>.',
      ko: '그 숫자에 착지한 응모자 중에서, 공개 Seed (BTC · Nikkei · S&P · 응모자 수의 SHA-256)로 <strong>King이 결정된다</strong>. 이것은 선발이 아니라 <strong>세계의 합의 + 공개 수식</strong>에 의한 확정이다.',
      es: 'De los aspirantes que cayeron en ese número, el <strong>King se determina</strong> por una Seed pública (SHA-256 de BTC · Nikkei · S&P · número de aspirantes). No es una selección — es determinación por <strong>consenso mundial + fórmula pública</strong>.',
      hi: 'जो आवेदक उस अंक पर उतरे, उनमें से <strong>King का निर्धारण</strong> सार्वजनिक Seed (BTC · Nikkei · S&P · आवेदक-संख्या का SHA-256) से होता है। यह चयन नहीं — यह <strong>विश्व-सहमति + सार्वजनिक सूत्र</strong> द्वारा निश्चय है।',
      vi: 'Trong số người dự thi rơi đúng con số đó, <strong>King được xác định</strong> bằng Seed công khai (SHA-256 của BTC · Nikkei · S&P · số người dự thi). Đây không phải sự lựa chọn — đây là sự xác định bằng <strong>đồng thuận thế giới + công thức công khai</strong>.',
      pt: 'Dos candidatos que pousaram nesse número, o <strong>King é determinado</strong> por uma Seed pública (SHA-256 de BTC · Nikkei · S&P · número de candidatos). Não é seleção — é determinação por <strong>consenso mundial + fórmula pública</strong>.',
      id: 'Dari pelamar yang mendarat di angka itu, <strong>King ditentukan</strong> oleh Seed publik (SHA-256 dari BTC · Nikkei · S&P · jumlah pelamar). Ini bukan seleksi — ini penentuan oleh <strong>konsensus dunia + rumus publik</strong>.',
      th: 'จากผู้สมัครที่ลงจอดบนเลขนั้น <strong>King ถูกกำหนด</strong>ด้วย Seed สาธารณะ (SHA-256 ของ BTC · Nikkei · S&P · จำนวนผู้สมัคร) นี่ไม่ใช่การคัดเลือก — แต่เป็นการกำหนดด้วย<strong>ฉันทามติของโลก + สูตรสาธารณะ</strong>',
      fr: 'Parmi les candidats arrivés sur ce nombre, le <strong>King est déterminé</strong> par un Seed public (SHA-256 de BTC · Nikkei · S&P · nombre de candidats). Ce n\'est pas une sélection — c\'est une détermination par <strong>consensus mondial + formule publique</strong>.',
    },
    'ritual.three.closing': {
      ja: '一億人が捧げても、<br/><em>立つのは生き残った者だけ</em>。<br/>立った者の中から、ただ<em>一人</em>が王となる。',
      en: 'Even if a hundred million offer, <br/><em>only the survivors stand</em>.<br/>And of those who stand, only <em>one</em> becomes King.',
      ko: '일억이 바쳐도,<br/><em>서는 것은 살아남은 자뿐</em>.<br/>선 자 중에서, 오직 <em>한 명</em>이 왕이 된다.',
      es: 'Aunque cien millones ofrezcan,<br/><em>solo los que sobreviven se levantan</em>.<br/>Y de los que se levantan, solo <em>uno</em> se convierte en King.',
      hi: 'चाहे करोड़ों अर्पित करें,<br/><em>केवल जो जिए, वही खड़े होते हैं</em>।<br/>उनमें से केवल <em>एक</em> King बनता है।',
      vi: 'Dù trăm triệu dâng hiến,<br/><em>chỉ những người sống sót mới đứng</em>.<br/>Trong số ấy, chỉ <em>một người</em> trở thành King.',
      pt: 'Mesmo que cem milhões ofereçam,<br/><em>só os sobreviventes ficam de pé</em>.<br/>E dentre eles, só <em>um</em> se torna King.',
      id: 'Sekalipun seratus juta menyerahkan,<br/><em>hanya yang lolos yang berdiri</em>.<br/>Dari yang berdiri, hanya <em>satu</em> menjadi King.',
      th: 'แม้ร้อยล้านจะถวาย<br/><em>มีเพียงผู้รอดที่ยืน</em><br/>และในบรรดาผู้ยืน มีเพียง <em>หนึ่ง</em> เป็น King',
      fr: 'Même si cent millions offrent,<br/><em>seuls les survivants se tiennent</em>.<br/>Et parmi eux, un <em>seul</em> devient King.',
    },

    // --- RITUAL MODAL: ritual-money (Money flow, Grant Fund 60/30/10) ---
    'ritual.money.subtitle': {
      ja: '¥100の流れと、Grant Fund。',
      en: 'The flow of ¥100, and the Grant Fund.',
      ko: '¥100의 흐름과 Grant Fund.',
      es: 'El flujo del ¥100 y el Grant Fund.',
      hi: '¥100 का प्रवाह, और Grant Fund।',
      vi: 'Dòng chảy của ¥100, và Grant Fund.',
      pt: 'O fluxo de ¥100 e o Grant Fund.',
      id: 'Aliran ¥100, dan Grant Fund.',
      th: 'การไหลของ ¥100 และ Grant Fund',
      fr: 'Le flux de ¥100, et le Grant Fund.',
    },
    'ritual.money.accent1': {
      ja: '¥100のうち、<em>¥60はGrant Fundへ</em>。',
      en: 'Of every ¥100, <em>¥60 goes to the Grant Fund</em>.',
      ko: '¥100 중 <em>¥60은 Grant Fund로</em>.',
      es: 'De cada ¥100, <em>¥60 va al Grant Fund</em>.',
      hi: 'हर ¥100 में से <em>¥60 Grant Fund में</em>।',
      vi: 'Trên mỗi ¥100, <em>¥60 vào Grant Fund</em>.',
      pt: 'De cada ¥100, <em>¥60 vai para o Grant Fund</em>.',
      id: 'Dari setiap ¥100, <em>¥60 ke Grant Fund</em>.',
      th: 'จากทุก ¥100 <em>¥60 ไปที่ Grant Fund</em>',
      fr: 'Sur chaque ¥100, <em>¥60 va au Grant Fund</em>.',
    },
    'ritual.money.p1': {
      ja: '各¥100の支払は分割される。<strong>60% = Grant Fund</strong>(公的助成プール)、<strong>30% = 運営</strong>、<strong>10% = 決済処理</strong>。ファンド残高は常時 <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code> で公開。',
      en: 'Each ¥100 payment is split. <strong>60% = Grant Fund</strong> (the public grant pool), <strong>30% = operations</strong>, <strong>10% = payment processing</strong>. Fund balance is published at all times at <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>.',
      ko: '각 ¥100 결제는 분할된다. <strong>60% = Grant Fund</strong>(공적 보조 풀), <strong>30% = 운영</strong>, <strong>10% = 결제 처리</strong>. 펀드 잔고는 항상 <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>에 공개.',
      es: 'Cada pago de ¥100 se divide. <strong>60% = Grant Fund</strong> (la bolsa pública de subvención), <strong>30% = operaciones</strong>, <strong>10% = procesamiento de pago</strong>. El saldo del fondo se publica en todo momento en <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>.',
      hi: 'हर ¥100 भुगतान बँटता है। <strong>60% = Grant Fund</strong> (सार्वजनिक अनुदान पूल), <strong>30% = संचालन</strong>, <strong>10% = भुगतान प्रसंस्करण</strong>। फ़ंड बैलेंस सदा <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code> पर सार्वजनिक।',
      vi: 'Mỗi khoản thanh toán ¥100 được chia. <strong>60% = Grant Fund</strong> (quỹ trợ cấp công), <strong>30% = vận hành</strong>, <strong>10% = xử lý thanh toán</strong>. Số dư quỹ luôn được công bố tại <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>.',
      pt: 'Cada pagamento de ¥100 é dividido. <strong>60% = Grant Fund</strong> (fundo público de subvenção), <strong>30% = operações</strong>, <strong>10% = processamento de pagamento</strong>. O saldo é publicado a todo momento em <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>.',
      id: 'Setiap pembayaran ¥100 dibagi. <strong>60% = Grant Fund</strong> (kolam hibah publik), <strong>30% = operasi</strong>, <strong>10% = pemrosesan pembayaran</strong>. Saldo dana selalu dipublikasikan di <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>.',
      th: 'การชำระเงิน ¥100 ทุกครั้งถูกแบ่ง <strong>60% = Grant Fund</strong> (กองทุนช่วยเหลือสาธารณะ) <strong>30% = ดำเนินการ</strong> <strong>10% = การประมวลผลการชำระเงิน</strong> ยอดกองทุนเผยแพร่ตลอดเวลาที่ <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>',
      fr: 'Chaque paiement de ¥100 est partagé. <strong>60% = Grant Fund</strong> (la cagnotte publique), <strong>30% = opérations</strong>, <strong>10% = traitement du paiement</strong>. Le solde du fonds est publié à tout moment sur <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>.',
    },
    'ritual.money.accent2_jp': {
      ja: 'Bellは資格を解錠するだけ。資格を得たMissionが、Fundから助成を受け得る。',
      en: 'Bell only unlocks qualification. A qualified Mission may receive a grant from the Fund.',
      ko: 'Bell은 자격을 풀 뿐. 자격을 얻은 Mission이 Fund에서 보조를 받을 수 있다.',
      es: 'Bell solo desbloquea la calificación. Una Mission calificada puede recibir una subvención del Fund.',
      hi: 'Bell केवल योग्यता खोलती है। योग्य Mission Fund से अनुदान पा सकती है।',
      vi: 'Bell chỉ mở khóa tư cách. Một Mission đủ tư cách có thể nhận trợ cấp từ Fund.',
      pt: 'Bell apenas desbloqueia a qualificação. Uma Mission qualificada pode receber subvenção do Fund.',
      id: 'Bell hanya membuka kualifikasi. Mission yang lolos boleh menerima hibah dari Fund.',
      th: 'Bell ปลดล็อกเพียงคุณสมบัติ Mission ที่ผ่านเกณฑ์อาจได้รับเงินสนับสนุนจาก Fund',
      fr: 'Bell ne fait que déverrouiller la qualification. Une Mission qualifiée peut recevoir une subvention du Fund.',
    },
    'ritual.money.p2': {
      ja: 'Grantは<strong>賞金ではない</strong>。THE TRIALを生き残りCROWN SLOTで確定した者は、まず<strong>KYC・AML・Mission Truth審査</strong>を受ける。すべての審査を通過したMissionにだけ、Grant Fundから<strong>助成金</strong>が支払われる。',
      en: 'Grant is <strong>not a prize</strong>. Those who survive THE TRIAL and are determined at CROWN SLOT first undergo <strong>KYC, AML, and Mission Truth review</strong>. Only Missions that pass all checks receive a <strong>grant</strong> from the Grant Fund.',
      ko: 'Grant는 <strong>상금이 아니다</strong>. THE TRIAL을 살아남고 CROWN SLOT에서 확정된 자는 먼저 <strong>KYC, AML, Mission Truth 심사</strong>를 받는다. 모든 심사를 통과한 Mission에게만 Grant Fund에서 <strong>보조금</strong>이 지급된다.',
      es: 'Grant <strong>no es un premio</strong>. Los que sobreviven a THE TRIAL y se determinan en CROWN SLOT pasan primero por <strong>KYC, AML y revisión de Mission Truth</strong>. Solo las Missions que pasan todas las verificaciones reciben una <strong>subvención</strong> del Grant Fund.',
      hi: 'Grant <strong>पुरस्कार नहीं</strong> है। THE TRIAL जो जीते और CROWN SLOT में निर्धारित हुए, उन्हें पहले <strong>KYC, AML और Mission Truth समीक्षा</strong> देनी होती है। केवल वही Missions, जो हर जाँच पास करें, Grant Fund से <strong>अनुदान</strong> पाती हैं।',
      vi: 'Grant <strong>không phải giải thưởng</strong>. Người sống sót qua THE TRIAL và được xác định ở CROWN SLOT trước tiên trải qua <strong>KYC, AML và xét duyệt Mission Truth</strong>. Chỉ những Mission qua mọi xét duyệt mới nhận <strong>trợ cấp</strong> từ Grant Fund.',
      pt: 'Grant <strong>não é prêmio</strong>. Quem sobrevive ao THE TRIAL e é determinado no CROWN SLOT passa primeiro por <strong>KYC, AML e revisão de Mission Truth</strong>. Só as Missions que passam em todas as verificações recebem uma <strong>subvenção</strong> do Grant Fund.',
      id: 'Grant <strong>bukan hadiah</strong>. Mereka yang lolos THE TRIAL dan ditentukan di CROWN SLOT terlebih dahulu menjalani <strong>KYC, AML, dan peninjauan Mission Truth</strong>. Hanya Mission yang lolos semua pemeriksaan yang menerima <strong>hibah</strong> dari Grant Fund.',
      th: 'Grant <strong>ไม่ใช่รางวัล</strong> ผู้รอด THE TRIAL และถูกกำหนดที่ CROWN SLOT จะผ่าน <strong>KYC, AML และตรวจสอบ Mission Truth</strong>ก่อน เฉพาะ Mission ที่ผ่านทุกการตรวจสอบจึงได้รับ<strong>เงินช่วยเหลือ</strong>จาก Grant Fund',
      fr: 'Grant <strong>n\'est pas un prix</strong>. Ceux qui survivent à THE TRIAL et sont déterminés au CROWN SLOT subissent d\'abord <strong>KYC, AML et l\'examen de Mission Truth</strong>. Seules les Missions qui passent toutes les vérifications reçoivent une <strong>subvention</strong> du Grant Fund.',
    },
    'ritual.money.li1': {
      ja: 'Bellは決してお金にならない。',
      en: 'Bell never becomes cash.',
      ko: 'Bell은 결코 돈이 되지 않는다.',
      es: 'Bell nunca se vuelve dinero.',
      hi: 'Bell कभी पैसा नहीं बनती।',
      vi: 'Bell không bao giờ trở thành tiền.',
      pt: 'Bell nunca vira dinheiro.',
      id: 'Bell tak pernah menjadi uang.',
      th: 'Bell ไม่เคยกลายเป็นเงิน',
      fr: 'Bell ne devient jamais de l\'argent.',
    },
    'ritual.money.li2': {
      ja: 'Bellは資格の解錠だけ。',
      en: 'Bell only unlocks qualification.',
      ko: 'Bell은 자격의 해제일 뿐.',
      es: 'Bell solo desbloquea la calificación.',
      hi: 'Bell केवल योग्यता खोलती है।',
      vi: 'Bell chỉ mở khóa tư cách.',
      pt: 'Bell só desbloqueia a qualificação.',
      id: 'Bell hanya membuka kualifikasi.',
      th: 'Bell แค่ปลดล็อกคุณสมบัติ',
      fr: 'Bell ne fait que déverrouiller la qualification.',
    },
    'ritual.money.li3': {
      ja: '失敗者のBellは決して他のユーザーに移らない。',
      en: 'Failed applicants\' Bell is never transferred to other users.',
      ko: '실패자의 Bell은 결코 다른 사용자에게 옮겨지지 않는다.',
      es: 'La Bell de los aspirantes fallidos nunca se transfiere a otros usuarios.',
      hi: 'विफल आवेदकों की Bell कभी अन्य उपयोगकर्ताओं को नहीं जाती।',
      vi: 'Bell của ứng viên trượt không bao giờ chuyển sang người dùng khác.',
      pt: 'A Bell de candidatos falhos nunca é transferida a outros usuários.',
      id: 'Bell pelamar yang gagal tak pernah dialihkan ke pengguna lain.',
      th: 'Bell ของผู้สมัครที่ล้มเหลวจะไม่ถูกโอนไปยังผู้ใช้รายอื่น',
      fr: 'La Bell des candidats échoués n\'est jamais transférée à d\'autres utilisateurs.',
    },
    'ritual.money.li4': {
      ja: 'Grantは審査・証明済みの「助成金」 — 配当でも当選金でもない。',
      en: 'Grant is a reviewed-and-proven "grant" — never a dividend or winnings.',
      ko: 'Grant는 심사·증명을 거친 "보조금" — 배당도 당첨금도 아니다.',
      es: 'Grant es una "subvención" revisada y probada — nunca dividendo ni premio.',
      hi: 'Grant जाँच और प्रमाण के बाद का "अनुदान" — न डिविडेंड, न जीत-धन।',
      vi: 'Grant là "trợ cấp" đã được xét duyệt và chứng minh — không phải cổ tức hay tiền thưởng.',
      pt: 'Grant é uma "subvenção" revisada e comprovada — nunca dividendo ou prêmio.',
      id: 'Grant adalah "hibah" yang ditinjau dan dibuktikan — bukan dividen atau hadiah.',
      th: 'Grant คือ "เงินช่วยเหลือ" ที่ผ่านการตรวจสอบและพิสูจน์ — ไม่ใช่ปันผลหรือเงินรางวัล',
      fr: 'Grant est une "subvention" examinée et prouvée — jamais un dividende ou des gains.',
    },
    'ritual.money.li5': {
      ja: 'Mission完了の証明が提出されなければ、Grantは取り消され、次順位の候補者が引き継ぐ。',
      en: 'If proof of Mission completion is not submitted, Grant is revoked and inherited by the next-ranked candidate.',
      ko: 'Mission 완료 증명이 제출되지 않으면 Grant는 취소되고 다음 순위 후보자가 승계한다.',
      es: 'Si no se entrega la prueba de cumplimiento de la Mission, el Grant se revoca y lo hereda el siguiente candidato.',
      hi: 'Mission पूर्ण होने का प्रमाण न मिलने पर Grant रद्द हो जाता है और अगले रैंक का उम्मीदवार उसे विरासत में लेता है।',
      vi: 'Nếu không nộp được bằng chứng hoàn thành Mission, Grant bị thu hồi và người kế tiếp sẽ kế thừa.',
      pt: 'Se a prova de cumprimento da Mission não for entregue, o Grant é revogado e o próximo candidato herda.',
      id: 'Jika bukti penyelesaian Mission tidak diserahkan, Grant dicabut dan kandidat berikutnya mewarisinya.',
      th: 'หากไม่ส่งหลักฐานการทำ Mission สำเร็จ Grant จะถูกเพิกถอนและผู้สมัครลำดับถัดไปรับช่วงต่อ',
      fr: 'Si la preuve d\'accomplissement de la Mission n\'est pas soumise, le Grant est révoqué et le candidat suivant en hérite.',
    },
    'ritual.money.cta': {
      ja: '⌘ Money Logicを読む',
      en: '⌘ Read the Money Logic',
      ko: '⌘ Money Logic 읽기',
      es: '⌘ Leer la Lógica del Dinero',
      hi: '⌘ Money Logic पढ़ें',
      vi: '⌘ Đọc Money Logic',
      pt: '⌘ Ler a Money Logic',
      id: '⌘ Baca Money Logic',
      th: '⌘ อ่าน Money Logic',
      fr: '⌘ Lire la Money Logic',
    },

    // --- RITUAL MODAL: ritual-duty (Royal Duty — The Crown has weight) ---
    'ritual.duty.subtitle': {
      ja: '王冠には、重さがある。',
      en: 'The Crown has weight.',
      ko: 'Crown에는 무게가 있다.',
      es: 'La Crown tiene peso.',
      hi: 'Crown का वज़न होता है।',
      vi: 'Crown có sức nặng.',
      pt: 'A Crown tem peso.',
      id: 'Crown punya bobot.',
      th: 'Crown มีน้ำหนัก',
      fr: 'La Crown a un poids.',
    },
    'ritual.duty.p1': {
      ja: 'Kingになることは終わりではない。<strong>30日以内にMission完了の証明</strong>を提出する。Missionが負債返済なら、完済記録。店を開くなら、開業登録 + 店舗写真。旅なら、目的地からの写真。',
      en: 'Becoming King is not the end. You submit <strong>proof of Mission completion within 30 days</strong>. If Mission was debt repayment: completion record. Opening a shop: business registration + store photos. A journey: photos from the destination.',
      ko: 'King이 되는 것은 끝이 아니다. <strong>30일 이내에 Mission 완료 증명</strong>을 제출한다. Mission이 부채 상환이라면 완납 기록. 가게를 열었다면 사업자 등록 + 매장 사진. 여행이라면 목적지에서의 사진.',
      es: 'Ser King no es el final. Entregas la <strong>prueba de cumplimiento de la Mission dentro de 30 días</strong>. Si tu Mission era saldar deuda: el comprobante de finiquito. Abrir una tienda: registro mercantil + fotos del local. Un viaje: fotos desde el destino.',
      hi: 'King बनना अंत नहीं है। <strong>30 दिनों के भीतर Mission पूरा होने का प्रमाण</strong> देना है। यदि Mission क़र्ज़ चुकाना है: चुकाने का रिकॉर्ड। दुकान खोलना: व्यवसाय पंजीकरण + दुकान की तस्वीरें। यात्रा: गंतव्य से तस्वीरें।',
      vi: 'Trở thành King không phải là kết thúc. Bạn nộp <strong>bằng chứng hoàn thành Mission trong vòng 30 ngày</strong>. Nếu Mission là trả nợ: hồ sơ tất toán. Mở cửa hàng: giấy đăng ký kinh doanh + ảnh cửa hàng. Một chuyến đi: ảnh từ điểm đến.',
      pt: 'Tornar-se King não é o fim. Você entrega <strong>a prova de cumprimento da Mission em 30 dias</strong>. Se a Mission era quitar dívida: comprovante de quitação. Abrir uma loja: registro do negócio + fotos. Uma jornada: fotos do destino.',
      id: 'Menjadi King bukanlah akhir. Kau menyerahkan <strong>bukti penyelesaian Mission dalam 30 hari</strong>. Jika Mission-mu adalah melunasi utang: catatan pelunasan. Membuka toko: pendaftaran usaha + foto toko. Sebuah perjalanan: foto dari tujuan.',
      th: 'การเป็น King ไม่ใช่จุดสิ้นสุด คุณส่ง<strong>หลักฐานการทำ Mission สำเร็จภายใน 30 วัน</strong> ถ้า Mission คือชำระหนี้: บันทึกการชำระเสร็จ เปิดร้าน: การจดทะเบียนกิจการ + ภาพร้าน การเดินทาง: ภาพจากจุดหมาย',
      fr: 'Devenir King n\'est pas la fin. Tu soumets <strong>la preuve d\'accomplissement de la Mission dans les 30 jours</strong>. Si la Mission était de rembourser une dette : preuve de remboursement. Ouvrir une boutique : enregistrement + photos du lieu. Un voyage : photos depuis la destination.',
    },
    'ritual.duty.p2': {
      ja: '私たちは人を晒さない。<strong>結果を晒す。</strong>証明が提出されなければ、王冠は取り消され、次順位の候補者に引き継がれる。',
      en: 'We do not expose the person. <strong>We expose the result.</strong> If proof is not submitted, the Crown is revoked and inherited by the next-ranked candidate.',
      ko: '우리는 사람을 노출하지 않는다. <strong>결과를 노출한다.</strong> 증명이 제출되지 않으면 Crown은 취소되고 다음 순위의 후보자에게 승계된다.',
      es: 'No exponemos a la persona. <strong>Exponemos el resultado.</strong> Si no se entrega la prueba, la Crown se revoca y la hereda el siguiente candidato.',
      hi: 'हम व्यक्ति को नहीं दिखाते। <strong>हम परिणाम दिखाते हैं।</strong> यदि प्रमाण न मिले, Crown रद्द हो जाती है और अगले रैंक का उम्मीदवार उसे पाता है।',
      vi: 'Chúng tôi không phơi bày con người. <strong>Chúng tôi phơi bày kết quả.</strong> Nếu không nộp bằng chứng, Crown bị thu hồi và chuyển cho ứng viên kế tiếp.',
      pt: 'Não expomos a pessoa. <strong>Expomos o resultado.</strong> Se a prova não for entregue, a Crown é revogada e herdada pelo candidato seguinte.',
      id: 'Kami tidak memajang pribadinya. <strong>Kami memajang hasilnya.</strong> Jika bukti tak diserahkan, Crown dicabut dan diwariskan ke kandidat berikutnya.',
      th: 'เราไม่เปิดเผยตัวบุคคล <strong>เราเปิดเผยผลลัพธ์</strong> หากไม่ส่งหลักฐาน Crown ถูกเพิกถอนและส่งต่อให้ผู้สมัครลำดับถัดไป',
      fr: 'Nous n\'exposons pas la personne. <strong>Nous exposons le résultat.</strong> Si la preuve n\'est pas soumise, la Crown est révoquée et héritée par le candidat suivant.',
    },
    'ritual.duty.li1': {
      ja: 'Mission Truth Agreementへの署名(応募時必須)。',
      en: 'Signature on the Mission Truth Agreement (required at application).',
      ko: 'Mission Truth Agreement에 서명(응모 시 필수).',
      es: 'Firma del Mission Truth Agreement (obligatorio al postular).',
      hi: 'Mission Truth Agreement पर हस्ताक्षर (आवेदन के समय अनिवार्य)।',
      vi: 'Ký Mission Truth Agreement (bắt buộc khi ứng tuyển).',
      pt: 'Assinatura do Mission Truth Agreement (obrigatório na inscrição).',
      id: 'Tanda tangan Mission Truth Agreement (wajib saat mendaftar).',
      th: 'ลงนามใน Mission Truth Agreement (จำเป็นเมื่อสมัคร)',
      fr: 'Signature du Mission Truth Agreement (obligatoire à la candidature).',
    },
    'ritual.duty.li2': {
      ja: 'Grant受領から30日以内に証明を提出。',
      en: 'Submit Proof within 30 days of receiving the Grant.',
      ko: 'Grant 수령 후 30일 이내에 증명 제출.',
      es: 'Entregar la Prueba dentro de 30 días tras recibir el Grant.',
      hi: 'Grant मिलने के 30 दिनों के भीतर प्रमाण देना।',
      vi: 'Nộp Bằng chứng trong 30 ngày sau khi nhận Grant.',
      pt: 'Entregar a Prova em 30 dias após receber o Grant.',
      id: 'Serahkan Bukti dalam 30 hari sejak menerima Grant.',
      th: 'ส่งหลักฐานภายใน 30 วันหลังจากรับ Grant',
      fr: 'Soumettre la Preuve dans les 30 jours après réception du Grant.',
    },
    'ritual.duty.li3': {
      ja: '提出内容の真偽が問われた場合、調査を受け入れる。',
      en: 'Accept investigation if the truth of the submission is questioned.',
      ko: '제출 내용의 진위가 문제 될 경우, 조사를 받아들인다.',
      es: 'Aceptar investigación si se cuestiona la veracidad de lo entregado.',
      hi: 'यदि प्रस्तुति की सच्चाई पर सवाल हो, जाँच स्वीकार करें।',
      vi: 'Chấp nhận điều tra nếu tính trung thực của hồ sơ bị đặt câu hỏi.',
      pt: 'Aceitar investigação se a veracidade da submissão for questionada.',
      id: 'Menerima penyelidikan jika kebenaran kiriman diragukan.',
      th: 'ยอมรับการสอบสวนหากความถูกต้องของเอกสารถูกตั้งคำถาม',
      fr: 'Accepter l\'enquête si la véracité de la soumission est mise en question.',
    },
    'ritual.duty.li4': {
      ja: '虚偽が判明した場合、返還義務 + 永久利用停止。',
      en: 'Obligation to return + permanent ban if falsehood is discovered.',
      ko: '허위가 밝혀진 경우, 반환 의무 + 영구 이용 정지.',
      es: 'Obligación de devolución + suspensión permanente si se descubre falsedad.',
      hi: 'झूठ साबित होने पर वापसी का दायित्व + स्थायी प्रतिबंध।',
      vi: 'Nghĩa vụ hoàn trả + cấm vĩnh viễn nếu phát hiện gian dối.',
      pt: 'Obrigação de devolução + suspensão permanente se a falsidade for descoberta.',
      id: 'Kewajiban mengembalikan + larangan permanen jika kepalsuan ditemukan.',
      th: 'มีภาระคืน + ห้ามใช้งานถาวรหากพบการเท็จ',
      fr: 'Obligation de restitution + bannissement permanent en cas de fausseté découverte.',
    },

    // --- RITUAL MODAL: ritual-verify (Not trusted. Verified.) ---
    'ritual.verify.subtitle': {
      ja: '信じるな。検証しろ。',
      en: 'Don\'t trust. Verify.',
      ko: '믿지 마라. 검증하라.',
      es: 'No confíes. Verifica.',
      hi: 'भरोसा मत करो। सत्यापित करो।',
      vi: 'Đừng tin. Hãy xác minh.',
      pt: 'Não confie. Verifique.',
      id: 'Jangan percaya. Verifikasi.',
      th: 'อย่าเชื่อ จงตรวจสอบ',
      fr: 'Ne fais pas confiance. Vérifie.',
    },
    'ritual.verify.p1': {
      ja: 'King決定もCROWN SLOTの最終選抜も — すべて<strong>公開数式 + 公開Seed</strong>から導かれる。誰でも自分のブラウザでSHA-256を再計算でき、<strong>運営の結果と一致することを確認</strong>できる。',
      en: 'King determination, CROWN SLOT final pick — everything is derived from <strong>public formulas + public Seed</strong>. Anyone, in their own browser, can re-compute SHA-256 and <strong>confirm it matches the operator\'s result</strong>.',
      ko: 'King 결정도 CROWN SLOT의 최종 선정도 — 모두 <strong>공개 수식 + 공개 Seed</strong>에서 도출된다. 누구나 자신의 브라우저에서 SHA-256을 재계산하여 <strong>운영의 결과와 일치하는지 확인</strong>할 수 있다.',
      es: 'La determinación del King y la selección final en CROWN SLOT — todo deriva de <strong>fórmula pública + Seed pública</strong>. Cualquiera, en su propio navegador, puede recomputar SHA-256 y <strong>confirmar que coincide con el resultado del operador</strong>.',
      hi: 'King निर्धारण और CROWN SLOT में अंतिम चयन — सब कुछ <strong>सार्वजनिक सूत्र + सार्वजनिक Seed</strong> से निकाला जाता है। कोई भी अपने ब्राउज़र में SHA-256 दोबारा गिन सकता है और <strong>परिणाम संचालक से मिलने की पुष्टि</strong> कर सकता है।',
      vi: 'Việc xác định King và lựa chọn cuối ở CROWN SLOT — tất cả đều suy ra từ <strong>công thức công khai + Seed công khai</strong>. Bất kỳ ai, trên trình duyệt của mình, có thể tính lại SHA-256 và <strong>xác nhận khớp với kết quả của nhà vận hành</strong>.',
      pt: 'A determinação do King e a escolha final no CROWN SLOT — tudo deriva de <strong>fórmula pública + Seed pública</strong>. Qualquer um, no próprio navegador, pode recomputar SHA-256 e <strong>confirmar que bate com o resultado do operador</strong>.',
      id: 'Penentuan King maupun pemilihan akhir di CROWN SLOT — semuanya diturunkan dari <strong>rumus publik + Seed publik</strong>. Siapa pun, di peramban masing-masing, bisa menghitung ulang SHA-256 dan <strong>memastikan hasilnya cocok dengan operator</strong>.',
      th: 'การกำหนด King และการเลือกขั้นสุดท้ายที่ CROWN SLOT — ทุกอย่างมาจาก <strong>สูตรสาธารณะ + Seed สาธารณะ</strong> ใครก็ตามในเบราว์เซอร์ของตน สามารถคำนวณ SHA-256 ใหม่ และ <strong>ยืนยันว่าตรงกับผลของผู้ดำเนินการ</strong>ได้',
      fr: 'La détermination du King et le choix final au CROWN SLOT — tout découle d\'une <strong>formule publique + Seed publique</strong>. N\'importe qui, dans son navigateur, peut recalculer SHA-256 et <strong>confirmer que cela correspond au résultat de l\'opérateur</strong>.',
    },
    'ritual.verify.accent2': {
      ja: '運営は<em>問題を知らない</em>。',
      en: 'The operator <em>does not know the questions</em> either.',
      ko: '운영은 <em>문제를 모른다</em>.',
      es: 'El operador <em>tampoco conoce las preguntas</em>.',
      hi: 'संचालक भी <em>सवाल नहीं जानता</em>।',
      vi: 'Nhà vận hành <em>cũng không biết câu hỏi</em>.',
      pt: 'O operador <em>também não sabe as perguntas</em>.',
      id: 'Operator <em>juga tak tahu pertanyaan</em>.',
      th: 'ผู้ดำเนินการ <em>ก็ไม่รู้คำถามด้วย</em>',
      fr: 'L\'opérateur <em>ne connaît pas non plus les questions</em>.',
    },
    'ritual.verify.p2': {
      ja: 'KINGMAKERの誰一人 — 運営も技術者も — 事前にTHE TRIALの問題を知らない。<strong>10万問のQuestion Bank</strong>は公開され、毎週Seed(BTC・日経・S&P・応募者数・秒)がSHA-256を通って機械的に3問のIDを抽出する。',
      en: 'No one at KINGMAKER — not operator, not engineer — knows the THE TRIAL questions in advance. A <strong>100,000-question Question Bank</strong> is public, and each week the Seed (BTC · Nikkei · S&P · applicant count · seconds) runs through SHA-256 to mechanically pick the 3 question IDs.',
      ko: 'KINGMAKER의 누구도 — 운영도 기술자도 — 사전에 THE TRIAL의 문제를 알지 못한다. <strong>10만 문항의 Question Bank</strong>가 공개되며, 매주 Seed (BTC, Nikkei, S&P, 응모자 수, 초)가 SHA-256을 통해 기계적으로 3개의 문제 ID를 추출한다.',
      es: 'En KINGMAKER nadie — ni operador, ni ingeniero — conoce las preguntas de THE TRIAL por adelantado. Un <strong>Banco de Preguntas de 100 000 preguntas</strong> es público, y cada semana la Seed (BTC · Nikkei · S&P · número de aspirantes · segundos) corre por SHA-256 para escoger mecánicamente los 3 IDs de pregunta.',
      hi: 'KINGMAKER में कोई भी — न संचालक, न इंजीनियर — पहले से THE TRIAL के सवाल नहीं जानता। एक <strong>1 लाख-सवालों का Question Bank</strong> सार्वजनिक है, और हर हफ्ते Seed (BTC · Nikkei · S&P · आवेदक-संख्या · सेकंड) SHA-256 से होकर मशीनी रूप से 3 सवाल-IDs चुनती है।',
      vi: 'Không ai trong KINGMAKER — không nhà vận hành, không kỹ sư — biết trước câu hỏi THE TRIAL. Một <strong>Ngân hàng Câu hỏi 100.000 câu</strong> được công khai, và mỗi tuần Seed (BTC · Nikkei · S&P · số ứng viên · giây) chạy qua SHA-256 để chọn cơ học 3 ID câu hỏi.',
      pt: 'Ninguém em KINGMAKER — nem operador, nem engenheiro — conhece as perguntas do THE TRIAL com antecedência. Um <strong>Banco de Perguntas de 100.000 perguntas</strong> é público, e a cada semana a Seed (BTC · Nikkei · S&P · número de candidatos · segundos) passa por SHA-256 para escolher mecanicamente os 3 IDs.',
      id: 'Tak seorang pun di KINGMAKER — bukan operator, bukan insinyur — tahu pertanyaan THE TRIAL sebelumnya. Sebuah <strong>Question Bank 100.000 soal</strong> bersifat publik, dan setiap pekan Seed (BTC · Nikkei · S&P · jumlah pelamar · detik) dijalankan lewat SHA-256 untuk memilih 3 ID soal secara mekanis.',
      th: 'ไม่มีใครใน KINGMAKER — ทั้งผู้ดำเนินการและวิศวกร — รู้คำถาม THE TRIAL ล่วงหน้า <strong>Question Bank 100,000 ข้อ</strong>เปิดเผยต่อสาธารณะ และทุกสัปดาห์ Seed (BTC · Nikkei · S&P · จำนวนผู้สมัคร · วินาที) ผ่าน SHA-256 เพื่อเลือก 3 ID คำถามด้วยกลไก',
      fr: 'Personne chez KINGMAKER — ni opérateur, ni ingénieur — ne connaît à l\'avance les questions de THE TRIAL. Une <strong>Banque de Questions de 100 000 questions</strong> est publique, et chaque semaine la Seed (BTC · Nikkei · S&P · nombre de candidats · secondes) passe par SHA-256 pour choisir mécaniquement les 3 IDs de questions.',
    },
    'ritual.verify.tagline_jp': {
      ja: '問題は創られない。問題は世界によって明かされる。',
      en: 'Questions are not created. They are revealed by the world.',
      ko: '문제는 창조되지 않는다. 문제는 세계에 의해 밝혀진다.',
      es: 'Las preguntas no se crean. Las revela el mundo.',
      hi: 'सवाल बनाए नहीं जाते। दुनिया उन्हें प्रकट करती है।',
      vi: 'Câu hỏi không được tạo ra. Chúng được thế giới hé lộ.',
      pt: 'As perguntas não são criadas. Elas são reveladas pelo mundo.',
      id: 'Pertanyaan tidak diciptakan. Mereka diungkap oleh dunia.',
      th: 'คำถามไม่ได้ถูกสร้าง คำถามถูกเปิดเผยโดยโลก',
      fr: 'Les questions ne sont pas créées. Elles sont révélées par le monde.',
    },

    // --- RITUAL MODAL: ritual-doctrine (The 5 Laws) ---
    'ritual.doctrine.subtitle': {
      ja: '五つの法。',
      en: 'The Five Laws.',
      ko: '다섯 가지 법.',
      es: 'Las Cinco Leyes.',
      hi: 'पाँच नियम।',
      vi: 'Năm điều luật.',
      pt: 'As Cinco Leis.',
      id: 'Lima Hukum.',
      th: 'ห้ากฎ',
      fr: 'Les Cinq Lois.',
    },
    'ritual.doctrine.l1': {
      ja: '<strong>I.</strong> Bellは資格であり、お金ではない。',
      en: '<strong>I.</strong> Bell is a Right, never cash.',
      ko: '<strong>I.</strong> Bell은 자격이며, 돈이 아니다.',
      es: '<strong>I.</strong> Bell es un Derecho, nunca dinero.',
      hi: '<strong>I.</strong> Bell अधिकार है, नकद नहीं।',
      vi: '<strong>I.</strong> Bell là Quyền, không phải tiền mặt.',
      pt: '<strong>I.</strong> Bell é um Direito, nunca dinheiro.',
      id: '<strong>I.</strong> Bell adalah Hak, bukan uang tunai.',
      th: '<strong>I.</strong> Bell คือสิทธิ์ ไม่ใช่เงินสด',
      fr: '<strong>I.</strong> Bell est un Droit, jamais de l\'argent.',
    },
    'ritual.doctrine.l2': {
      ja: '<strong>II.</strong> Bellは決して失わない。失うのは「今週のチャンス」だけ。',
      en: '<strong>II.</strong> You never lose your Bell. You only lose this week\'s chance.',
      ko: '<strong>II.</strong> Bell은 결코 잃지 않는다. 잃는 것은 "이번 주의 기회"뿐.',
      es: '<strong>II.</strong> Nunca pierdes tu Bell. Solo pierdes "la oportunidad de esta semana".',
      hi: '<strong>II.</strong> अपनी Bell कभी नहीं खोते। केवल "इस हफ़्ते का मौक़ा" जाता है।',
      vi: '<strong>II.</strong> Bạn không bao giờ mất Bell. Chỉ mất "cơ hội tuần này".',
      pt: '<strong>II.</strong> Você nunca perde sua Bell. Só perde "a chance desta semana".',
      id: '<strong>II.</strong> Bell-mu tak pernah hilang. Yang hilang hanya "kesempatan pekan ini".',
      th: '<strong>II.</strong> คุณไม่เคยสูญ Bell คุณเสียเพียง "โอกาสสัปดาห์นี้"',
      fr: '<strong>II.</strong> Tu ne perds jamais ta Bell. Tu perds seulement "la chance de cette semaine".',
    },
    'ritual.doctrine.l3': {
      ja: '<strong>III.</strong> Grantは賞金ではない — 審査と証明を経た助成金。',
      en: '<strong>III.</strong> Grant is not a prize — it is a grant after review and proof.',
      ko: '<strong>III.</strong> Grant는 상금이 아니다 — 심사와 증명을 거친 보조금.',
      es: '<strong>III.</strong> Grant no es premio — es subvención tras revisión y prueba.',
      hi: '<strong>III.</strong> Grant पुरस्कार नहीं — जाँच और प्रमाण के बाद का अनुदान।',
      vi: '<strong>III.</strong> Grant không phải giải thưởng — là trợ cấp sau xét duyệt và chứng minh.',
      pt: '<strong>III.</strong> Grant não é prêmio — é subvenção após revisão e prova.',
      id: '<strong>III.</strong> Grant bukan hadiah — hibah setelah tinjauan dan pembuktian.',
      th: '<strong>III.</strong> Grant ไม่ใช่รางวัล — เป็นเงินช่วยเหลือหลังการตรวจสอบและพิสูจน์',
      fr: '<strong>III.</strong> Grant n\'est pas un prix — c\'est une subvention après examen et preuve.',
    },
    'ritual.doctrine.l4': {
      ja: '<strong>IV.</strong> 王冠には重さがある。',
      en: '<strong>IV.</strong> The Crown has weight.',
      ko: '<strong>IV.</strong> Crown에는 무게가 있다.',
      es: '<strong>IV.</strong> La Crown tiene peso.',
      hi: '<strong>IV.</strong> Crown का वज़न होता है।',
      vi: '<strong>IV.</strong> Crown có sức nặng.',
      pt: '<strong>IV.</strong> A Crown tem peso.',
      id: '<strong>IV.</strong> Crown punya bobot.',
      th: '<strong>IV.</strong> Crown มีน้ำหนัก',
      fr: '<strong>IV.</strong> La Crown a un poids.',
    },
    'ritual.doctrine.l5': {
      ja: '<strong>V.</strong> 人ではなく、結果を晒す。',
      en: '<strong>V.</strong> Expose the result, not the person.',
      ko: '<strong>V.</strong> 사람이 아니라, 결과를 노출한다.',
      es: '<strong>V.</strong> Expón el resultado, no a la persona.',
      hi: '<strong>V.</strong> व्यक्ति को नहीं, परिणाम को दिखाओ।',
      vi: '<strong>V.</strong> Phơi bày kết quả, không phải con người.',
      pt: '<strong>V.</strong> Exponha o resultado, não a pessoa.',
      id: '<strong>V.</strong> Pajang hasilnya, bukan pribadinya.',
      th: '<strong>V.</strong> เปิดเผยผลลัพธ์ ไม่ใช่ตัวบุคคล',
      fr: '<strong>V.</strong> Expose le résultat, pas la personne.',
    },

    // --- RITUAL MODAL: ritual-trial (5 minutes, 3 trials, one Crown) ---
    'ritual.trial.subtitle': {
      ja: '3ラウンド。10万問。世界が選ぶ。',
      en: 'The world\'s 5-minute simultaneous ritual.',
      ko: '3 라운드. 10만 문항. 세계가 선택한다.',
      es: '3 rondas. 100 000 preguntas. El mundo elige.',
      hi: '3 राउंड। 1 लाख सवाल। दुनिया चुनती है।',
      vi: '3 vòng. 100.000 câu hỏi. Thế giới chọn.',
      pt: '3 rondas. 100 000 perguntas. O mundo escolhe.',
      id: '3 ronde. 100.000 soal. Dunia memilih.',
      th: '3 รอบ 100,000 ข้อ โลกเป็นผู้เลือก',
      fr: '3 rondes. 100 000 questions. Le monde choisit.',
    },
    'ritual.trial.p1': {
      ja: '1億人が応募しても、5分で全てのMissionを読める者はいない。だからKINGMAKERは誰にも選ばせない。<strong>世界が同じ瞬間、同じ問題の前に立つ。</strong>それがTHE TRIALだ。',
      en: 'Even if 100 million apply, no one can read every Mission in five minutes. So KINGMAKER does not let anyone choose. <strong>The whole world stands on the same problem at the same instant.</strong> That is THE TRIAL.',
      ko: '1억 명이 응모해도, 5분 안에 모든 Mission을 읽을 자는 없다. 그래서 KINGMAKER는 누구에게도 선택을 시키지 않는다. <strong>세계가 같은 순간 같은 문제 앞에 선다.</strong> 그것이 THE TRIAL이다.',
      es: 'Aunque 100 millones postulen, nadie puede leer cada Mission en cinco minutos. Por eso KINGMAKER no deja elegir a nadie. <strong>El mundo entero se enfrenta al mismo problema en el mismo instante.</strong> Eso es THE TRIAL.',
      hi: 'चाहे 10 करोड़ आवेदन करें, 5 मिनट में हर Mission पढ़ना किसी से नहीं हो सकता। इसलिए KINGMAKER किसी को चुनने नहीं देता। <strong>पूरी दुनिया एक ही पल एक ही सवाल के सामने खड़ी होती है।</strong> यही THE TRIAL है।',
      vi: 'Dù 100 triệu người ứng tuyển, không ai có thể đọc hết mọi Mission trong 5 phút. Vì vậy KINGMAKER không cho ai chọn. <strong>Cả thế giới đứng trước cùng một bài toán vào cùng một khoảnh khắc.</strong> Đó là THE TRIAL.',
      pt: 'Mesmo que 100 milhões se candidatem, ninguém consegue ler cada Mission em cinco minutos. Por isso KINGMAKER não deixa ninguém escolher. <strong>O mundo inteiro enfrenta o mesmo problema no mesmo instante.</strong> Isso é THE TRIAL.',
      id: 'Sekalipun 100 juta melamar, tak ada yang bisa membaca setiap Mission dalam 5 menit. Maka KINGMAKER tak membiarkan siapa pun memilih. <strong>Seluruh dunia berdiri di hadapan masalah yang sama pada saat yang sama.</strong> Itulah THE TRIAL.',
      th: 'แม้ร้อยล้านคนสมัคร ไม่มีใครอ่าน Mission ทั้งหมดได้ในห้านาที KINGMAKER จึงไม่ให้ใครเลือก <strong>ทั้งโลกยืนต่อหน้าโจทย์เดียวกันในวินาทีเดียวกัน</strong> นั่นคือ THE TRIAL',
      fr: 'Même si 100 millions postulent, personne ne peut lire chaque Mission en cinq minutes. Donc KINGMAKER ne laisse personne choisir. <strong>Le monde entier se tient devant le même problème au même instant.</strong> C\'est cela THE TRIAL.',
    },
    'ritual.trial.r1': {
      ja: 'Math · Memory · Logic.<br/>例: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · 順列 · 比率。<br/>10〜20秒。選択式。正解 → 次へ。',
      en: 'Math · Memory · Logic.<br/>Example: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · permutations · ratios.<br/>10–20 seconds. Multiple choice. Correct → next.',
      ko: 'Math · Memory · Logic.<br/>예: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · 순열 · 비율.<br/>10〜20초. 객관식. 정답 → 다음.',
      es: 'Math · Memory · Logic.<br/>Ejemplo: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · permutaciones · razones.<br/>10–20 segundos. Opción múltiple. Correcto → siguiente.',
      hi: 'Math · Memory · Logic.<br/>उदाहरण: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · क्रमचय · अनुपात।<br/>10–20 सेकंड। बहुविकल्प। सही → आगे।',
      vi: 'Math · Memory · Logic.<br/>Ví dụ: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · hoán vị · tỷ lệ.<br/>10–20 giây. Trắc nghiệm. Đúng → tiếp theo.',
      pt: 'Math · Memory · Logic.<br/>Exemplo: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · permutações · razões.<br/>10–20 segundos. Múltipla escolha. Correto → próximo.',
      id: 'Math · Memory · Logic.<br/>Contoh: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · permutasi · rasio.<br/>10–20 detik. Pilihan ganda. Benar → lanjut.',
      th: 'Math · Memory · Logic.<br/>ตัวอย่าง: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · การเรียงสับเปลี่ยน · อัตราส่วน<br/>10–20 วินาที แบบเลือกตอบ ถูก → ถัดไป',
      fr: 'Math · Memory · Logic.<br/>Exemple : <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · permutations · ratios.<br/>10–20 secondes. QCM. Correct → suivant.',
    },
    'ritual.trial.r2': {
      ja: '世界文化 · 旗 · 通貨 · 元素 · 略語の正式名称。<br/>例: 「KTX とは何の略?」「メキシコの首都は?」「NASA とは何の略?」<br/>— 日本語話者にも英語話者にも有利不利はない。',
      en: 'World culture · flags · currencies · elements · official names behind acronyms.<br/>Example: "What does KTX stand for?" "What\'s the capital of Mexico?" "What does NASA stand for?"<br/>— No advantage to Japanese speakers, no advantage to English speakers.',
      ko: '세계 문화 · 국기 · 통화 · 원소 · 약어의 정식 명칭.<br/>예: "KTX는 무엇의 약자?" "멕시코의 수도는?" "NASA는 무엇의 약자?"<br/>— 일본어 화자에게도 영어 화자에게도 유불리는 없다.',
      es: 'Cultura mundial · banderas · monedas · elementos · siglas y sus nombres oficiales.<br/>Ejemplo: «¿Qué significa KTX?» «¿Capital de México?» «¿Qué significa NASA?»<br/>— Sin ventaja para hablantes de japonés ni de inglés.',
      hi: 'विश्व-संस्कृति · झंडे · मुद्राएँ · तत्व · संक्षेपों के पूरे नाम।<br/>उदाहरण: "KTX का पूरा रूप?" "मेक्सिको की राजधानी?" "NASA का पूरा रूप?"<br/>— जापानी या अंग्रेज़ी बोलने वालों को कोई बढ़त नहीं।',
      vi: 'Văn hóa thế giới · cờ · tiền tệ · nguyên tố · tên đầy đủ của viết tắt.<br/>Ví dụ: "KTX viết tắt của gì?" "Thủ đô Mexico?" "NASA viết tắt của gì?"<br/>— Không lợi thế cho người nói tiếng Nhật hay tiếng Anh.',
      pt: 'Cultura mundial · bandeiras · moedas · elementos · siglas e seus nomes oficiais.<br/>Exemplo: "O que significa KTX?" "Capital do México?" "O que significa NASA?"<br/>— Sem vantagem para falantes de japonês ou inglês.',
      id: 'Budaya dunia · bendera · mata uang · unsur · nama resmi di balik singkatan.<br/>Contoh: "Kepanjangan KTX?" "Ibu kota Meksiko?" "Kepanjangan NASA?"<br/>— Tak ada keuntungan bagi penutur Jepang maupun Inggris.',
      th: 'วัฒนธรรมโลก · ธง · สกุลเงิน · ธาตุ · ชื่อเต็มของตัวย่อ<br/>ตัวอย่าง: "KTX ย่อมาจากอะไร?" "เมืองหลวงเม็กซิโก?" "NASA ย่อมาจากอะไร?"<br/>— ไม่มีข้อได้เปรียบสำหรับผู้พูดภาษาญี่ปุ่นหรืออังกฤษ',
      fr: 'Culture mondiale · drapeaux · monnaies · éléments · noms officiels derrière les acronymes.<br/>Exemple : « Que signifie KTX ? » « Capitale du Mexique ? » « Que signifie NASA ? »<br/>— Aucun avantage pour les locuteurs japonais ou anglais.',
    },
    'ritual.trial.r3': {
      ja: '00から99のスロット。あなたは<strong>一度タップして止める</strong>。世界中の指が止めた数字のうち、最も多かった値が<strong>Crown Number</strong>となる。その数字に着地した応募者の中から、公開SeedによってKingが確定する。',
      en: 'A slot from 00 to 99. You <strong>tap once</strong> to stop it. Among the numbers the world\'s fingers landed on, the most-frequent value becomes the <strong>Crown Number</strong>. From applicants who hit that number, the King is determined by public Seed.',
      ko: '00에서 99의 슬롯. 당신은 <strong>한 번 탭으로 멈춘다</strong>. 전 세계의 손가락이 멈춘 숫자 중 가장 많았던 값이 <strong>Crown Number</strong>가 된다. 그 숫자에 착지한 응모자 중에서 공개 Seed로 King이 확정된다.',
      es: 'Un slot del 00 al 99. Tú <strong>tocas una vez</strong> para detenerlo. Entre los números en que los dedos del mundo se detuvieron, el más frecuente se convierte en el <strong>Crown Number</strong>. De los aspirantes que cayeron en ese número, el King se determina por Seed pública.',
      hi: '00 से 99 का स्लॉट। आप <strong>एक बार टैप करके</strong> रोकते हैं। दुनिया भर की उँगलियों ने जो अंक रोके, उनमें सबसे अधिक बार आया अंक <strong>Crown Number</strong> बनता है। उस अंक पर उतरे आवेदकों में से सार्वजनिक Seed द्वारा King निर्धारित होता है।',
      vi: 'Một slot từ 00 đến 99. Bạn <strong>chạm một lần</strong> để dừng. Trong số những con số mà ngón tay thế giới dừng lại, giá trị xuất hiện nhiều nhất trở thành <strong>Crown Number</strong>. Trong số ứng viên rơi vào con số đó, King được xác định bằng Seed công khai.',
      pt: 'Um slot de 00 a 99. Você <strong>toca uma vez</strong> para parar. Entre os números em que os dedos do mundo pararam, o mais frequente vira o <strong>Crown Number</strong>. Dos candidatos que pousaram nesse número, o King é determinado por Seed pública.',
      id: 'Slot 00 sampai 99. Kau <strong>sentuh sekali</strong> untuk menghentikan. Di antara angka tempat jari-jari dunia berhenti, nilai yang paling sering menjadi <strong>Crown Number</strong>. Dari pelamar yang mendarat di angka itu, King ditentukan oleh Seed publik.',
      th: 'สล็อตจาก 00 ถึง 99 คุณ <strong>แตะหนึ่งครั้ง</strong> เพื่อหยุด ในบรรดาตัวเลขที่นิ้วของโลกหยุด ตัวที่บ่อยที่สุดกลายเป็น <strong>Crown Number</strong> จากผู้สมัครที่ลงจอดบนเลขนั้น King ถูกกำหนดด้วย Seed สาธารณะ',
      fr: 'Un slot de 00 à 99. Tu <strong>touches une fois</strong> pour l\'arrêter. Parmi les nombres sur lesquels les doigts du monde se sont arrêtés, le plus fréquent devient le <strong>Crown Number</strong>. Parmi les candidats arrivés sur ce nombre, le King est déterminé par Seed publique.',
    },
    'ritual.trial.rule_jp': {
      ja: 'Bellは決して失われない。失われるのは「今週のチャンス」だけ。',
      en: 'You never lose your Bell. You only lose this week\'s chance.',
      ko: 'Bell은 결코 잃지 않는다. 잃는 것은 "이번 주의 기회"뿐.',
      es: 'Nunca pierdes tu Bell. Solo pierdes "la oportunidad de esta semana".',
      hi: 'अपनी Bell कभी नहीं खोते। केवल "इस हफ़्ते का मौक़ा" जाता है।',
      vi: 'Bạn không bao giờ mất Bell. Chỉ mất "cơ hội tuần này".',
      pt: 'Você nunca perde sua Bell. Só perde "a chance desta semana".',
      id: 'Bell-mu tak pernah hilang. Yang hilang hanya "kesempatan pekan ini".',
      th: 'คุณไม่เคยสูญ Bell คุณเสียเพียง "โอกาสสัปดาห์นี้"',
      fr: 'Tu ne perds jamais ta Bell. Tu perds seulement "la chance de cette semaine".',
    },
    'ritual.trial.p2': {
      ja: '10 Bellを鳴らして入る。失敗してもBellは減らない。来週、また鳴らせる。3ラウンドすべてを通過した者が<strong>Qualification Unlocked</strong>のステータスを得て、CROWN SLOTへ進む。',
      en: 'Ring 10 Bell to enter. If you fail, Bell does not decrease. You can ring again next week. Those who pass all three rounds earn <strong>Qualification Unlocked</strong> status and proceed to CROWN SLOT.',
      ko: '10 Bell을 울려 들어간다. 실패해도 Bell은 줄지 않는다. 다음 주에 또 울릴 수 있다. 3 라운드를 모두 통과한 자가 <strong>Qualification Unlocked</strong> 상태를 얻고 CROWN SLOT으로 진행한다.',
      es: 'Toca 10 Bell para entrar. Si fallas, Bell no disminuye. Puedes sonar de nuevo la próxima semana. Quienes pasan las tres rondas obtienen el estatus <strong>Qualification Unlocked</strong> y avanzan al CROWN SLOT.',
      hi: 'अंदर जाने के लिए 10 Bell बजाओ। विफल हुए तो Bell घटती नहीं। अगले हफ्ते फिर बजा सकते हो। तीनों राउंड पास करने वालों को <strong>Qualification Unlocked</strong> स्थिति मिलती है और वे CROWN SLOT तक जाते हैं।',
      vi: 'Rung 10 Bell để vào. Nếu thất bại, Bell không giảm. Bạn có thể rung lại tuần sau. Người vượt qua cả ba vòng đạt trạng thái <strong>Qualification Unlocked</strong> và tiến đến CROWN SLOT.',
      pt: 'Toque 10 Bell para entrar. Se falhar, Bell não diminui. Pode tocar de novo na próxima semana. Quem passa nas três rondas ganha o status <strong>Qualification Unlocked</strong> e segue ao CROWN SLOT.',
      id: 'Bunyikan 10 Bell untuk masuk. Bila gagal, Bell tak berkurang. Pekan depan kau bisa bunyikan lagi. Mereka yang lolos tiga ronde meraih status <strong>Qualification Unlocked</strong> dan menuju CROWN SLOT.',
      th: 'สั่น 10 Bell เพื่อเข้า หากล้มเหลว Bell ไม่ลด สัปดาห์หน้าสั่นได้อีก ผู้ผ่านสามรอบจะได้สถานะ <strong>Qualification Unlocked</strong> และไปสู่ CROWN SLOT',
      fr: 'Fais sonner 10 Bell pour entrer. Si tu échoues, Bell ne diminue pas. Tu peux sonner à nouveau la semaine prochaine. Ceux qui passent les trois rondes obtiennent le statut <strong>Qualification Unlocked</strong> et avancent vers le CROWN SLOT.',
    },
    'ritual.trial.li1': {
      ja: 'Question Bank:10万問。運営も事前に内容を知らない。',
      en: 'Question Bank: 100,000 questions. Even the operator does not know the contents in advance.',
      ko: 'Question Bank: 10만 문항. 운영도 사전에 내용을 모른다.',
      es: 'Banco de Preguntas: 100 000 preguntas. Ni el operador conoce el contenido por adelantado.',
      hi: 'Question Bank: 1 लाख सवाल। संचालक भी पहले से सामग्री नहीं जानता।',
      vi: 'Ngân hàng Câu hỏi: 100.000 câu. Ngay cả nhà vận hành cũng không biết nội dung trước.',
      pt: 'Banco de Perguntas: 100 000 perguntas. Nem o operador conhece o conteúdo antes.',
      id: 'Question Bank: 100.000 soal. Bahkan operator tak tahu isinya sebelumnya.',
      th: 'Question Bank: 100,000 ข้อ แม้ผู้ดำเนินการก็ไม่รู้เนื้อหาล่วงหน้า',
      fr: 'Banque de Questions : 100 000 questions. Même l\'opérateur ne connaît pas le contenu à l\'avance.',
    },
    'ritual.trial.li2': {
      ja: '問題ID:毎週のSeedからSHA-256を通って機械的に決まる。',
      en: 'Question IDs: mechanically derived from each week\'s Seed via SHA-256.',
      ko: '문제 ID: 매주의 Seed에서 SHA-256을 통해 기계적으로 결정.',
      es: 'IDs de preguntas: mecánicamente derivados de la Seed semanal vía SHA-256.',
      hi: 'सवाल-IDs: हर हफ़्ते की Seed से SHA-256 के ज़रिए मशीनी रूप से तय।',
      vi: 'ID câu hỏi: được suy ra cơ học từ Seed mỗi tuần qua SHA-256.',
      pt: 'IDs das perguntas: derivados mecanicamente da Seed semanal via SHA-256.',
      id: 'ID soal: diturunkan secara mekanis dari Seed mingguan lewat SHA-256.',
      th: 'ID คำถาม: ถูกเลือกเชิงกลไกจาก Seed รายสัปดาห์ผ่าน SHA-256',
      fr: 'IDs des questions : dérivés mécaniquement du Seed hebdomadaire via SHA-256.',
    },
    'ritual.trial.li3': {
      ja: 'ジャンルは毎週ローテーション:Math / Memory / Logic / Language / Culture / Science。',
      en: 'Genre rotates weekly: Math / Memory / Logic / Language / Culture / Science.',
      ko: '장르는 매주 로테이션: Math / Memory / Logic / Language / Culture / Science.',
      es: 'El género rota semanalmente: Math / Memory / Logic / Language / Culture / Science.',
      hi: 'श्रेणी हर हफ़्ते बदलती है: Math / Memory / Logic / Language / Culture / Science।',
      vi: 'Thể loại xoay hàng tuần: Math / Memory / Logic / Language / Culture / Science.',
      pt: 'O gênero gira semanalmente: Math / Memory / Logic / Language / Culture / Science.',
      id: 'Genre berotasi mingguan: Math / Memory / Logic / Language / Culture / Science.',
      th: 'หมวดหมู่หมุนเวียนรายสัปดาห์: Math / Memory / Logic / Language / Culture / Science',
      fr: 'Le genre tourne chaque semaine : Math / Memory / Logic / Language / Culture / Science.',
    },
    'ritual.trial.li4': {
      ja: '同じ問題の再登場:数週〜数ヶ月のクールダウンを設計。',
      en: 'Repeat of the same question: designed cooldown of weeks-to-months.',
      ko: '같은 문제 재등장: 수 주에서 수 개월의 쿨다운을 설계.',
      es: 'Repetición de la misma pregunta: enfriamiento diseñado de semanas a meses.',
      hi: 'एक ही सवाल फिर: कुछ हफ्तों से कुछ महीनों का कूलडाउन डिज़ाइन।',
      vi: 'Lặp lại cùng câu hỏi: thời gian chờ thiết kế từ vài tuần đến vài tháng.',
      pt: 'Repetição da mesma pergunta: cooldown projetado de semanas a meses.',
      id: 'Pengulangan soal yang sama: cooldown dirancang berminggu sampai berbulan-bulan.',
      th: 'การถามคำถามเดิมซ้ำ: คูลดาวน์ที่ออกแบบไว้ตั้งแต่หลายสัปดาห์ถึงหลายเดือน',
      fr: 'Répétition d\'une même question : refroidissement conçu de quelques semaines à plusieurs mois.',
    },
    'ritual.trial.standing': {
      ja: '3ラウンドすべて通過するごとに、あなたの<strong>Standing</strong>に刻印される。連勝はタイトルとして記録される。タイトルに金銭価値はないが、世界の中での「立ち位置」を示す。',
      en: 'Each time you pass all three rounds, a mark is etched on your <strong>Standing</strong>. Streaks are recorded as titles. The titles have no monetary value — but they show your "standing" in the world.',
      ko: '3 라운드를 모두 통과할 때마다 당신의 <strong>Standing</strong>에 새겨진다. 연승은 칭호로 기록된다. 칭호에 금전적 가치는 없지만, 세계 속 "위치"를 보여준다.',
      es: 'Cada vez que pasas las tres rondas, queda una marca grabada en tu <strong>Standing</strong>. Las rachas se registran como títulos. Los títulos no tienen valor monetario — pero muestran tu "posición" en el mundo.',
      hi: 'जब-जब आप तीनों राउंड पास करते हैं, आपके <strong>Standing</strong> पर निशान उत्कीर्ण होता है। लगातार जीत-लय शीर्षक के रूप में दर्ज होती है। शीर्षकों का कोई पैसा-मूल्य नहीं — पर वे दुनिया में आपकी "जगह" दिखाते हैं।',
      vi: 'Mỗi lần bạn vượt qua cả ba vòng, một dấu được khắc lên <strong>Standing</strong> của bạn. Chuỗi thắng được ghi lại như danh hiệu. Danh hiệu không có giá trị tiền tệ — nhưng cho thấy "vị thế" của bạn trên thế giới.',
      pt: 'Cada vez que você passa nas três rondas, uma marca é gravada no seu <strong>Standing</strong>. Sequências são registradas como títulos. Os títulos não têm valor monetário — mas mostram sua "posição" no mundo.',
      id: 'Setiap kali kau lolos tiga ronde, sebuah tanda terukir pada <strong>Standing</strong>-mu. Beruntun dicatat sebagai gelar. Gelar tidak punya nilai uang — tetapi memperlihatkan "kedudukan"-mu di dunia.',
      th: 'ทุกครั้งที่คุณผ่านทั้งสามรอบ เครื่องหมายจะถูกสลักไว้ที่ <strong>Standing</strong> ของคุณ ชัยชนะติดต่อกันถูกบันทึกเป็นตำแหน่ง ตำแหน่งไม่มีมูลค่าทางการเงิน — แต่แสดง "สถานะ" ของคุณในโลก',
      fr: 'Chaque fois que tu passes les trois rondes, une marque est gravée sur ton <strong>Standing</strong>. Les séries sont enregistrées comme titres. Les titres n\'ont pas de valeur monétaire — mais ils montrent ta "position" dans le monde.',
    },
    'ritual.trial.cta': {
      ja: '⌘ 問題はどう選ばれるか',
      en: '⌘ How questions are chosen',
      ko: '⌘ 문제는 어떻게 선택되는가',
      es: '⌘ Cómo se eligen las preguntas',
      hi: '⌘ सवाल कैसे चुने जाते हैं',
      vi: '⌘ Câu hỏi được chọn như thế nào',
      pt: '⌘ Como as perguntas são escolhidas',
      id: '⌘ Bagaimana soal dipilih',
      th: '⌘ คำถามถูกเลือกอย่างไร',
      fr: '⌘ Comment les questions sont choisies',
    },

    // --- RITUAL MODAL: ritual-resonance (Bell never becomes cash) ---
    'ritual.resonance.subtitle': {
      ja: 'Bellは参加資格。お金ではない。',
      en: 'Bell is a Participation Right, not money.',
      ko: 'Bell은 참가 자격. 돈이 아니다.',
      es: 'Bell es un Derecho de Participación, no dinero.',
      hi: 'Bell भागीदारी अधिकार है, पैसा नहीं।',
      vi: 'Bell là Quyền tham gia, không phải tiền.',
      pt: 'Bell é um Direito de Participação, não dinheiro.',
      id: 'Bell adalah Hak Partisipasi, bukan uang.',
      th: 'Bell คือสิทธิ์เข้าร่วม ไม่ใช่เงิน',
      fr: 'Bell est un Droit de Participation, pas de l\'argent.',
    },
    'ritual.resonance.accent_jp': {
      ja: 'Bellは資格を解錠する。それ以上の何物でもない。',
      en: 'Bell unlocks qualification. Nothing more.',
      ko: 'Bell은 자격을 풀 뿐. 그 이상은 아무것도 아니다.',
      es: 'Bell desbloquea la calificación. Nada más.',
      hi: 'Bell केवल योग्यता खोलती है। और कुछ नहीं।',
      vi: 'Bell mở khóa tư cách. Không gì hơn.',
      pt: 'Bell desbloqueia a qualificação. Nada além.',
      id: 'Bell membuka kualifikasi. Tak lebih.',
      th: 'Bell ปลดล็อกคุณสมบัติ ไม่มีอื่นใด',
      fr: 'Bell déverrouille la qualification. Rien de plus.',
    },
    'ritual.resonance.p1': {
      ja: 'KINGMAKERは<strong>賭博ではない</strong>。投資商品でもなく、抽選でもない。あなたがここに¥100を捧げて受け取るのは、<strong>5分間の世界同時儀式に立つ権利</strong>。資産ではなく、譲渡もできず、現金として返ってくることは決してない。',
      en: 'KINGMAKER is <strong>not gambling</strong>. Not an investment product. Not a raffle. When you offer ¥100 here, you receive <strong>the right to stand in a 5-minute world-simultaneous ritual</strong>. It is not an asset, cannot be transferred, and never returns as cash.',
      ko: 'KINGMAKER는 <strong>도박이 아니다</strong>. 투자 상품도, 추첨도 아니다. 당신이 여기에 ¥100을 바치고 받는 것은 <strong>5분간 세계 동시 의식에 설 권리</strong>. 자산이 아니며, 양도도 불가능하고, 현금으로 돌아오는 일은 결코 없다.',
      es: 'KINGMAKER <strong>no es apuesta</strong>. No es producto de inversión. No es sorteo. Cuando ofreces ¥100 aquí, recibes <strong>el derecho a estar en un ritual mundial simultáneo de 5 minutos</strong>. No es un activo, no se transfiere y nunca vuelve como dinero.',
      hi: 'KINGMAKER <strong>जुआ नहीं</strong> है। निवेश उत्पाद नहीं, लॉटरी नहीं। यहाँ ¥100 देकर आपको मिलता है <strong>5-मिनट के विश्व-समकालिक अनुष्ठान में खड़े होने का अधिकार</strong>। यह संपत्ति नहीं, हस्तांतरित नहीं हो सकती, और कभी नकद के रूप में नहीं लौटती।',
      vi: 'KINGMAKER <strong>không phải cờ bạc</strong>. Không phải sản phẩm đầu tư. Không phải xổ số. Khi bạn dâng ¥100 ở đây, bạn nhận <strong>quyền đứng trong nghi thức 5 phút đồng thời toàn cầu</strong>. Không phải tài sản, không thể chuyển nhượng, và không bao giờ trở lại dưới dạng tiền mặt.',
      pt: 'KINGMAKER <strong>não é jogo de azar</strong>. Não é produto de investimento. Não é sorteio. Quando você oferece ¥100 aqui, recebe <strong>o direito de estar num ritual mundial simultâneo de 5 minutos</strong>. Não é ativo, não pode ser transferido, e nunca retorna como dinheiro.',
      id: 'KINGMAKER <strong>bukan judi</strong>. Bukan produk investasi. Bukan undian. Saat kau menyerahkan ¥100 di sini, kau menerima <strong>hak berdiri dalam ritual 5 menit serentak dunia</strong>. Bukan aset, tak dapat dialihkan, dan tak pernah kembali sebagai uang tunai.',
      th: 'KINGMAKER <strong>ไม่ใช่การพนัน</strong> ไม่ใช่ผลิตภัณฑ์ลงทุน ไม่ใช่จับฉลาก เมื่อคุณถวาย ¥100 ที่นี่ คุณได้รับ <strong>สิทธิ์ยืนในพิธีกรรมพร้อมกันทั่วโลก 5 นาที</strong> ไม่ใช่ทรัพย์สิน โอนไม่ได้ และไม่กลับเป็นเงินสด',
      fr: 'KINGMAKER <strong>n\'est pas un pari</strong>. Pas un produit d\'investissement. Pas une loterie. Quand tu offres ¥100 ici, tu reçois <strong>le droit de te tenir dans un rituel simultané mondial de 5 minutes</strong>. Ce n\'est pas un actif, ce n\'est pas transférable, et cela ne revient jamais en argent.',
    },
    'ritual.resonance.f1': {
      ja: '1. <strong>¥100を捧げる</strong>。',
      en: '1. You <strong>offer ¥100</strong>.',
      ko: '1. <strong>¥100을 바친다</strong>.',
      es: '1. <strong>Ofreces ¥100</strong>.',
      hi: '1. <strong>आप ¥100 अर्पित करते हैं</strong>।',
      vi: '1. Bạn <strong>dâng ¥100</strong>.',
      pt: '1. Você <strong>oferece ¥100</strong>.',
      id: '1. Kau <strong>menyerahkan ¥100</strong>.',
      th: '1. คุณ<strong>ถวาย ¥100</strong>',
      fr: '1. Tu <strong>offres ¥100</strong>.',
    },
    'ritual.resonance.f2': {
      ja: '2. <strong>100 Bell</strong>が刻まれる。参加資格。',
      en: '2. <strong>100 Bell</strong> is etched in. Participation right.',
      ko: '2. <strong>100 Bell</strong>이 새겨진다. 참가 자격.',
      es: '2. <strong>100 Bell</strong> queda grabado. Derecho de Participación.',
      hi: '2. <strong>100 Bell</strong> उत्कीर्ण होती है। भागीदारी अधिकार।',
      vi: '2. <strong>100 Bell</strong> được khắc vào. Quyền tham gia.',
      pt: '2. <strong>100 Bell</strong> é gravado. Direito de Participação.',
      id: '2. <strong>100 Bell</strong> terukir. Hak Partisipasi.',
      th: '2. <strong>100 Bell</strong> ถูกสลัก สิทธิ์เข้าร่วม',
      fr: '2. <strong>100 Bell</strong> est gravé. Droit de Participation.',
    },
    'ritual.resonance.f3': {
      ja: '3. 毎週、10 Bellを鳴らしてTHE TRIALに入る。',
      en: '3. Each week, ring 10 Bell to enter THE TRIAL.',
      ko: '3. 매주 10 Bell을 울리고 THE TRIAL에 들어간다.',
      es: '3. Cada semana, suenas 10 Bell para entrar a THE TRIAL.',
      hi: '3. हर हफ्ते THE TRIAL में जाने के लिए 10 Bell बजाओ।',
      vi: '3. Mỗi tuần, rung 10 Bell để vào THE TRIAL.',
      pt: '3. Toda semana, toque 10 Bell para entrar no THE TRIAL.',
      id: '3. Setiap pekan, bunyikan 10 Bell untuk masuk THE TRIAL.',
      th: '3. ทุกสัปดาห์ สั่น 10 Bell เพื่อเข้า THE TRIAL',
      fr: '3. Chaque semaine, fais sonner 10 Bell pour entrer dans THE TRIAL.',
    },
    'ritual.resonance.f4': {
      ja: '4. 失敗してもBellは<strong>減らない</strong>。<strong>来週、また鳴らせ</strong>。',
      en: '4. Failure does not <strong>decrease</strong> Bell. <strong>Next week, ring again</strong>.',
      ko: '4. 실패해도 Bell은 <strong>줄지 않는다</strong>. <strong>다음 주에 또 울려라</strong>.',
      es: '4. El fracaso no <strong>disminuye</strong> Bell. <strong>La próxima semana, suénala otra vez</strong>.',
      hi: '4. विफलता से Bell <strong>घटती नहीं</strong>। <strong>अगले हफ्ते फिर बजाओ</strong>।',
      vi: '4. Thất bại không <strong>giảm</strong> Bell. <strong>Tuần sau, hãy rung lại</strong>.',
      pt: '4. Falhar não <strong>diminui</strong> Bell. <strong>Na próxima semana, toque de novo</strong>.',
      id: '4. Gagal tak <strong>mengurangi</strong> Bell. <strong>Pekan depan, bunyikan lagi</strong>.',
      th: '4. ความล้มเหลวไม่<strong>ลด</strong> Bell <strong>สัปดาห์หน้าสั่นใหม่</strong>',
      fr: '4. L\'échec ne <strong>diminue</strong> pas Bell. <strong>La semaine prochaine, sonne à nouveau</strong>.',
    },
    'ritual.resonance.f5': {
      ja: '5. 3ラウンド通過 → 候補資格解錠。',
      en: '5. Pass 3 rounds → Qualification Unlocked.',
      ko: '5. 3 라운드 통과 → 후보 자격 해제.',
      es: '5. Pasa las 3 rondas → Candidatura desbloqueada.',
      hi: '5. 3 राउंड पास → योग्यता खुली।',
      vi: '5. Qua 3 vòng → Tư cách mở khóa.',
      pt: '5. Passe as 3 rondas → Candidatura desbloqueada.',
      id: '5. Lolos 3 ronde → Kandidasi terbuka.',
      th: '5. ผ่าน 3 รอบ → ปลดล็อกสิทธิ์',
      fr: '5. Passe 3 rondes → Candidature déverrouillée.',
    },
    'ritual.resonance.f6': {
      ja: '6. CROWN SLOT → King確定。',
      en: '6. CROWN SLOT → King determined.',
      ko: '6. CROWN SLOT → King 확정.',
      es: '6. CROWN SLOT → King determinado.',
      hi: '6. CROWN SLOT → King निर्धारित।',
      vi: '6. CROWN SLOT → King được xác định.',
      pt: '6. CROWN SLOT → King determinado.',
      id: '6. CROWN SLOT → King ditentukan.',
      th: '6. CROWN SLOT → กำหนด King',
      fr: '6. CROWN SLOT → King déterminé.',
    },
    'ritual.resonance.f7': {
      ja: '7. Kingは<strong>KYC、AML、Mission Truth</strong>の審査を受ける。',
      en: '7. King undergoes <strong>KYC, AML, Mission Truth</strong> review.',
      ko: '7. King은 <strong>KYC, AML, Mission Truth</strong> 심사를 받는다.',
      es: '7. El King pasa por la revisión de <strong>KYC, AML, Mission Truth</strong>.',
      hi: '7. King <strong>KYC, AML, Mission Truth</strong> समीक्षा से गुज़रता है।',
      vi: '7. King trải qua xét duyệt <strong>KYC, AML, Mission Truth</strong>.',
      pt: '7. O King passa por revisão de <strong>KYC, AML, Mission Truth</strong>.',
      id: '7. King menjalani tinjauan <strong>KYC, AML, Mission Truth</strong>.',
      th: '7. King ผ่านการตรวจสอบ <strong>KYC, AML, Mission Truth</strong>',
      fr: '7. Le King subit l\'examen <strong>KYC, AML, Mission Truth</strong>.',
    },
    'ritual.resonance.f8': {
      ja: '8. 審査通過のMissionに対し、運営はGrant Fundから<strong>助成金</strong>を支払う。',
      en: '8. For passing Missions, operator pays a <strong>grant from the Grant Fund</strong>.',
      ko: '8. 심사를 통과한 Mission에 대해 운영은 Grant Fund에서 <strong>보조금</strong>을 지급한다.',
      es: '8. Para Missions que pasen, la operadora paga una <strong>subvención del Grant Fund</strong>.',
      hi: '8. पास हुए Missions के लिए, संचालक Grant Fund से <strong>अनुदान</strong> देते हैं।',
      vi: '8. Đối với Mission qua xét duyệt, nhà vận hành trả <strong>trợ cấp từ Grant Fund</strong>.',
      pt: '8. Para Missions aprovadas, a operadora paga uma <strong>subvenção do Grant Fund</strong>.',
      id: '8. Untuk Mission yang lolos, operator membayar <strong>hibah dari Grant Fund</strong>.',
      th: '8. สำหรับ Mission ที่ผ่าน ผู้ดำเนินการจ่าย <strong>เงินช่วยเหลือจาก Grant Fund</strong>',
      fr: '8. Pour les Missions qui passent, l\'opérateur verse une <strong>subvention du Grant Fund</strong>.',
    },
    'ritual.resonance.f9': {
      ja: '9. 30日以内に<strong>Royal Proof</strong>を提出。',
      en: '9. Submit <strong>Royal Proof</strong> within 30 days.',
      ko: '9. 30일 이내에 <strong>Royal Proof</strong> 제출.',
      es: '9. Entrega <strong>Royal Proof</strong> en 30 días.',
      hi: '9. 30 दिनों के भीतर <strong>Royal Proof</strong> दें।',
      vi: '9. Nộp <strong>Royal Proof</strong> trong vòng 30 ngày.',
      pt: '9. Entregue <strong>Royal Proof</strong> em 30 dias.',
      id: '9. Serahkan <strong>Royal Proof</strong> dalam 30 hari.',
      th: '9. ส่ง <strong>Royal Proof</strong> ภายใน 30 วัน',
      fr: '9. Soumets <strong>Royal Proof</strong> dans les 30 jours.',
    },
    'ritual.resonance.not1': {
      ja: '法定通貨ではない。',
      en: 'Not legal tender.',
      ko: '법정 통화가 아니다.',
      es: 'No es moneda de curso legal.',
      hi: 'क़ानूनी मुद्रा नहीं।',
      vi: 'Không phải tiền pháp định.',
      pt: 'Não é moeda legal.',
      id: 'Bukan mata uang sah.',
      th: 'ไม่ใช่เงินตามกฎหมาย',
      fr: 'Pas une monnaie légale.',
    },
    'ritual.resonance.not2': {
      ja: '暗号資産ではない。',
      en: 'Not crypto.',
      ko: '암호자산이 아니다.',
      es: 'No es cripto.',
      hi: 'क्रिप्टो नहीं।',
      vi: 'Không phải tiền mã hóa.',
      pt: 'Não é cripto.',
      id: 'Bukan kripto.',
      th: 'ไม่ใช่คริปโต',
      fr: 'Pas une crypto.',
    },
    'ritual.resonance.not3': {
      ja: '前払式支払手段ではない(資金決済法 §3)。',
      en: 'Not a prepaid payment instrument (Payment Services Act §3).',
      ko: '선불 결제수단이 아니다(자금결제법 §3).',
      es: 'No es instrumento de pago prepagado (Ley de Servicios de Pago §3).',
      hi: 'प्रीपेड पेमेंट इन्स्ट्रूमेंट नहीं (Payment Services Act §3)।',
      vi: 'Không phải phương tiện thanh toán trả trước (Luật Dịch vụ Thanh toán §3).',
      pt: 'Não é instrumento de pagamento pré-pago (Lei de Serviços de Pagamento §3).',
      id: 'Bukan alat bayar prabayar (UU Layanan Pembayaran §3).',
      th: 'ไม่ใช่เครื่องมือชำระเงินล่วงหน้า (กฎหมายบริการชำระเงิน §3)',
      fr: 'Pas un instrument de paiement prépayé (Loi sur les services de paiement §3).',
    },
    'ritual.resonance.not4': {
      ja: '有価証券・投資商品ではない(金商法)。',
      en: 'Not a security or investment (FIEA).',
      ko: '유가증권·투자상품이 아니다(금융상품거래법).',
      es: 'No es valor ni inversión (FIEA).',
      hi: 'प्रतिभूति या निवेश नहीं (FIEA)।',
      vi: 'Không phải chứng khoán hay đầu tư (FIEA).',
      pt: 'Não é título nem investimento (FIEA).',
      id: 'Bukan sekuritas atau investasi (FIEA).',
      th: 'ไม่ใช่หลักทรัพย์หรือการลงทุน (FIEA)',
      fr: 'Pas un titre ni un investissement (FIEA).',
    },
    'ritual.resonance.not5': {
      ja: 'ポイント・マイル・リワードではない。',
      en: 'Not points, miles, or rewards.',
      ko: '포인트·마일·리워드가 아니다.',
      es: 'No son puntos, millas ni recompensas.',
      hi: 'पॉइंट, माइल या रिवॉर्ड नहीं।',
      vi: 'Không phải điểm, dặm hay phần thưởng.',
      pt: 'Não são pontos, milhas nem recompensas.',
      id: 'Bukan poin, mil, atau hadiah.',
      th: 'ไม่ใช่คะแนน ไมล์ หรือรางวัล',
      fr: 'Pas des points, miles ou récompenses.',
    },
    'ritual.resonance.not6': {
      ja: '配当でも当選金でも賞金でもない。',
      en: 'Not winnings, dividends, or prize money.',
      ko: '배당도 당첨금도 상금도 아니다.',
      es: 'No es dividendo, premio ni gan­ancia.',
      hi: 'न डिविडेंड, न लॉटरी का पैसा, न पुरस्कार।',
      vi: 'Không phải cổ tức, tiền trúng hay tiền thưởng.',
      pt: 'Não é dividendo, prêmio nem ganho.',
      id: 'Bukan dividen, hadiah, atau pampasan.',
      th: 'ไม่ใช่ปันผล รางวัล หรือเงินรางวัล',
      fr: 'Ni dividende, ni gains, ni prix.',
    },
    'ritual.resonance.not7': {
      ja: '他のユーザーに譲渡することはできない。',
      en: 'Not transferable to other users.',
      ko: '다른 사용자에게 양도할 수 없다.',
      es: 'No es transferible a otros usuarios.',
      hi: 'अन्य उपयोगकर्ताओं को हस्तांतरित नहीं।',
      vi: 'Không thể chuyển nhượng cho người dùng khác.',
      pt: 'Não transferível para outros usuários.',
      id: 'Tak dapat dialihkan ke pengguna lain.',
      th: 'โอนให้ผู้ใช้คนอื่นไม่ได้',
      fr: 'Non transférable à d\'autres utilisateurs.',
    },
    'ritual.resonance.is1': {
      ja: 'KINGMAKER内部の参加資格。',
      en: 'A Participation Right inside KINGMAKER.',
      ko: 'KINGMAKER 내부의 참가 자격.',
      es: 'Un Derecho de Participación dentro de KINGMAKER.',
      hi: 'KINGMAKER के अंदर का भागीदारी अधिकार।',
      vi: 'Một Quyền tham gia bên trong KINGMAKER.',
      pt: 'Um Direito de Participação dentro de KINGMAKER.',
      id: 'Hak Partisipasi di dalam KINGMAKER.',
      th: 'สิทธิ์เข้าร่วมภายใน KINGMAKER',
      fr: 'Un Droit de Participation à l\'intérieur de KINGMAKER.',
    },
    'ritual.resonance.is2': {
      ja: '毎週 THE TRIAL に入る権利の単位。',
      en: 'The unit of right to enter THE TRIAL each week.',
      ko: '매주 THE TRIAL에 들어가는 권리의 단위.',
      es: 'La unidad del derecho a entrar a THE TRIAL cada semana.',
      hi: 'हर हफ्ते THE TRIAL में जाने का अधिकार-इकाई।',
      vi: 'Đơn vị quyền vào THE TRIAL mỗi tuần.',
      pt: 'A unidade do direito de entrar no THE TRIAL toda semana.',
      id: 'Unit hak masuk THE TRIAL setiap pekan.',
      th: 'หน่วยสิทธิ์เข้า THE TRIAL ทุกสัปดาห์',
      fr: 'L\'unité du droit d\'entrer dans THE TRIAL chaque semaine.',
    },
    'ritual.resonance.is3': {
      ja: 'Missionの応募者にとっては:<strong>Kingの候補資格を解錠する鍵</strong>。',
      en: 'For Mission applicants: <strong>the key to unlock King candidacy</strong>.',
      ko: 'Mission 응모자에게는: <strong>King 후보 자격을 푸는 열쇠</strong>.',
      es: 'Para aspirantes a Mission: <strong>la llave que desbloquea la candidatura a King</strong>.',
      hi: 'Mission आवेदकों के लिए: <strong>King-उम्मीदवारी खोलने वाली चाबी</strong>।',
      vi: 'Đối với người dự Mission: <strong>chìa khóa mở khóa tư cách ứng viên King</strong>.',
      pt: 'Para candidatos à Mission: <strong>a chave que desbloqueia a candidatura a King</strong>.',
      id: 'Bagi pelamar Mission: <strong>kunci membuka kandidasi King</strong>.',
      th: 'สำหรับผู้สมัคร Mission: <strong>กุญแจที่ปลดล็อกสิทธิ์ผู้สมัคร King</strong>',
      fr: 'Pour les candidats à la Mission : <strong>la clé qui déverrouille la candidature King</strong>.',
    },
    'ritual.resonance.is4': {
      ja: '儀式のために必要な「鳴らす道具」 — 金銭価値はない。',
      en: 'A "ringing instrument" needed for the ritual — no monetary value.',
      ko: '의식을 위해 필요한 "울리는 도구" — 금전적 가치는 없다.',
      es: 'Un "instrumento de toque" necesario para el ritual — sin valor monetario.',
      hi: 'अनुष्ठान के लिए ज़रूरी "बजाने का साधन" — कोई पैसा-मूल्य नहीं।',
      vi: 'Một "công cụ rung" cần thiết cho nghi thức — không có giá trị tiền tệ.',
      pt: 'Um "instrumento de toque" necessário para o ritual — sem valor monetário.',
      id: '"Alat berbunyi" yang dibutuhkan untuk ritual — tanpa nilai uang.',
      th: '"เครื่องมือสั่น" ที่จำเป็นสำหรับพิธีกรรม — ไม่มีมูลค่าทางการเงิน',
      fr: 'Un "instrument à faire sonner" nécessaire au rituel — sans valeur monétaire.',
    },

    // --- RITUAL MODAL: ritual-stories (Past Kings, Standing) ---
    'ritual.stories.subtitle': {
      ja: 'Cycle 1はまだ鳴っていない。だからこれは、過去ではなく予兆。',
      en: 'Cycle 1 has not yet rung. So this is not memory — it is foreshadow.',
      ko: 'Cycle 1은 아직 울리지 않았다. 그러므로 이는 기억이 아니라 예감.',
      es: 'El Cycle 1 aún no ha sonado. Esto no es memoria — es presagio.',
      hi: 'Cycle 1 अभी नहीं बजा। यह स्मृति नहीं — यह संकेत है।',
      vi: 'Cycle 1 chưa rung. Đây không phải ký ức — đây là điềm báo.',
      pt: 'O Cycle 1 ainda não tocou. Isto não é memória — é presságio.',
      id: 'Cycle 1 belum berbunyi. Ini bukan ingatan — ini pertanda.',
      th: 'Cycle 1 ยังไม่ดัง นี่จึงไม่ใช่ความทรงจำ — เป็นลางบอก',
      fr: 'Le Cycle 1 n\'a pas encore sonné. Ceci n\'est pas un souvenir — c\'est un présage.',
    },
    'ritual.stories.p1': {
      ja: '王はまだ誰でもない。Cycle 1が終わったとき、最初の名前がここに刻まれる。Mission、Grant、Royal Proof、Standing。すべて公開、すべて検証可能、すべて永続。<strong>偽の過去は持たない。</strong>',
      en: 'No King exists yet. When Cycle 1 ends, the first name will be etched here. Mission, Grant, Royal Proof, Standing — all public, all verifiable, all permanent. <strong>We do not carry a false past.</strong>',
      ko: '아직 King은 존재하지 않는다. Cycle 1이 끝났을 때, 첫 이름이 여기 새겨진다. Mission, Grant, Royal Proof, Standing — 모두 공개, 모두 검증 가능, 모두 영구. <strong>거짓 과거는 짊어지지 않는다.</strong>',
      es: 'Todavía no existe ningún King. Cuando termine el Cycle 1, el primer nombre será grabado aquí. Mission, Grant, Royal Proof, Standing — todo público, todo verificable, todo permanente. <strong>No llevamos un pasado falso.</strong>',
      hi: 'अभी कोई King नहीं है। जब Cycle 1 समाप्त होगा, पहला नाम यहाँ उत्कीर्ण होगा। Mission, Grant, Royal Proof, Standing — सब सार्वजनिक, सब सत्यापन योग्य, सब स्थायी। <strong>हम झूठा अतीत नहीं रखते।</strong>',
      vi: 'Chưa có King nào. Khi Cycle 1 kết thúc, tên đầu tiên sẽ được khắc ở đây. Mission, Grant, Royal Proof, Standing — tất cả công khai, tất cả có thể kiểm chứng, tất cả vĩnh viễn. <strong>Chúng tôi không mang một quá khứ giả.</strong>',
      pt: 'Ainda não existe nenhum King. Quando o Cycle 1 terminar, o primeiro nome será gravado aqui. Mission, Grant, Royal Proof, Standing — tudo público, tudo verificável, tudo permanente. <strong>Não carregamos um passado falso.</strong>',
      id: 'Belum ada King. Saat Cycle 1 selesai, nama pertama akan terukir di sini. Mission, Grant, Royal Proof, Standing — semua publik, semua dapat diverifikasi, semua permanen. <strong>Kami tidak membawa masa lalu palsu.</strong>',
      th: 'ยังไม่มี King เมื่อ Cycle 1 จบลง ชื่อแรกจะถูกสลักไว้ที่นี่ Mission, Grant, Royal Proof, Standing — ทั้งหมดสาธารณะ ตรวจสอบได้ และคงอยู่ <strong>เราไม่แบกอดีตปลอม</strong>',
      fr: 'Aucun King n\'existe encore. Quand le Cycle 1 prendra fin, le premier nom sera gravé ici. Mission, Grant, Royal Proof, Standing — tout public, tout vérifiable, tout permanent. <strong>Nous ne portons pas de faux passé.</strong>',
    },
    'ritual.stories.p2': {
      ja: 'Missionが達成されなければCrownは剥奪、Grantは返還、次点が承継する。これは未来の事実。今は、ただ最初の金曜23:23を待つだけ。',
      en: 'If a Mission is not delivered, the Crown is revoked, the Grant is returned, the next-ranked inherits. This is a future fact. For now, we only wait for the first Friday 23:23.',
      ko: 'Mission이 이행되지 않으면 Crown은 박탈, Grant은 반환, 차순위가 승계한다. 이것은 미래의 사실. 지금은 단지 첫 금요일 23:23을 기다릴 뿐.',
      es: 'Si una Mission no se cumple, la Crown se revoca, el Grant se devuelve, el siguiente hereda. Este es un hecho del futuro. Por ahora, sólo esperamos el primer viernes 23:23.',
      hi: 'यदि Mission पूरा नहीं हुआ, Crown रद्द होगा, Grant वापस होगा, अगला उत्तराधिकारी बनेगा। यह भविष्य का तथ्य है। अभी, हम केवल पहले शुक्रवार 23:23 की प्रतीक्षा करते हैं।',
      vi: 'Nếu Mission không được thực hiện, Crown bị thu hồi, Grant được trả lại, người xếp kế tiếp kế thừa. Đây là sự thật của tương lai. Hiện tại, chúng tôi chỉ chờ thứ Sáu 23:23 đầu tiên.',
      pt: 'Se uma Mission não for cumprida, a Crown é revogada, o Grant é devolvido, o seguinte herda. Isto é um fato do futuro. Por agora, apenas aguardamos a primeira sexta-feira 23:23.',
      id: 'Jika Mission tak terwujud, Crown dicabut, Grant dikembalikan, peringkat berikutnya mewarisi. Ini fakta masa depan. Untuk kini, kami hanya menunggu Jumat 23:23 yang pertama.',
      th: 'หาก Mission ไม่สำเร็จ Crown ถูกเพิกถอน Grant ถูกคืน ลำดับถัดไปสืบทอด นี่คือข้อเท็จจริงในอนาคต ขณะนี้เราเพียงรอวันศุกร์ 23:23 แรก',
      fr: 'Si une Mission n\'est pas livrée, la Crown est révoquée, le Grant est rendu, le suivant hérite. Voilà un fait du futur. Pour l\'instant, nous attendons seulement le premier vendredi 23:23.',
    },
    'ritual.stories.note': {
      ja: 'Cycle 1以降のすべての記録は /verify で公開される。それ以前は、公開する記録がない。',
      en: 'All records from Cycle 1 onward will be published at /verify. Before that, there are no records to publish.',
      ko: 'Cycle 1 이후의 모든 기록은 /verify에 공개된다. 그 이전에는 공개할 기록이 없다.',
      es: 'Todos los registros desde el Cycle 1 se publicarán en /verify. Antes de eso, no hay registros que publicar.',
      hi: 'Cycle 1 के बाद के सभी रिकॉर्ड /verify पर प्रकाशित होंगे। उससे पहले, प्रकाशित करने को कोई रिकॉर्ड नहीं।',
      vi: 'Mọi hồ sơ từ Cycle 1 trở đi sẽ được công bố tại /verify. Trước đó, không có hồ sơ để công bố.',
      pt: 'Todos os registros a partir do Cycle 1 serão publicados em /verify. Antes disso, não há registros a publicar.',
      id: 'Semua catatan sejak Cycle 1 akan dipublikasikan di /verify. Sebelumnya, tak ada catatan untuk dipublikasikan.',
      th: 'บันทึกทุกอย่างตั้งแต่ Cycle 1 จะเผยแพร่ที่ /verify ก่อนหน้านั้น ไม่มีบันทึกให้เผยแพร่',
      fr: 'Tous les registres à partir du Cycle 1 seront publiés sur /verify. Avant cela, il n\'y a aucun registre à publier.',
    },
    'ritual.stories.standing': {
      ja: 'THE TRIALを生き残った週が積み重なるごとに、あなたの<strong>Standing</strong>にタイトルが刻まれていく。<strong>金銭価値はない。</strong>世界の中での「立ち位置」のみ。それ以上のものではない。',
      en: 'As your weeks of surviving THE TRIAL accumulate, titles are etched onto your <strong>Standing</strong>. <strong>No monetary value.</strong> Only your "position" in the world. Nothing more.',
      ko: 'THE TRIAL을 살아남은 주가 쌓일 때마다, 당신의 <strong>Standing</strong>에 칭호가 새겨진다. <strong>금전적 가치는 없다.</strong> 세계 속 "위치"만. 그 이상은 아니다.',
      es: 'A medida que se acumulan tus semanas sobreviviendo a THE TRIAL, los títulos se graban en tu <strong>Standing</strong>. <strong>Sin valor monetario.</strong> Solo tu "posición" en el mundo. Nada más.',
      hi: 'जैसे-जैसे THE TRIAL जीने वाले हफ्ते जुड़ते जाते हैं, आपकी <strong>Standing</strong> पर शीर्षक उत्कीर्ण होते जाते हैं। <strong>कोई पैसा-मूल्य नहीं।</strong> केवल दुनिया में आपकी "जगह"। और कुछ नहीं।',
      vi: 'Khi các tuần vượt qua THE TRIAL của bạn tích lũy, các danh hiệu được khắc lên <strong>Standing</strong>. <strong>Không có giá trị tiền tệ.</strong> Chỉ là "vị thế" của bạn trên thế giới. Không hơn.',
      pt: 'À medida que se acumulam suas semanas sobrevivendo ao THE TRIAL, títulos são gravados em seu <strong>Standing</strong>. <strong>Sem valor monetário.</strong> Apenas sua "posição" no mundo. Nada mais.',
      id: 'Seiring bertambahnya pekanmu lolos THE TRIAL, gelar terukir di <strong>Standing</strong>-mu. <strong>Tanpa nilai uang.</strong> Hanya "kedudukan"-mu di dunia. Tak lebih.',
      th: 'เมื่อสัปดาห์ที่คุณรอด THE TRIAL สะสมขึ้น ตำแหน่งถูกสลักลงบน <strong>Standing</strong> ของคุณ <strong>ไม่มีมูลค่าทางการเงิน</strong> มีเพียง "สถานะ" ของคุณในโลก ไม่มีอื่น',
      fr: 'À mesure que s\'accumulent tes semaines de survie à THE TRIAL, des titres sont gravés sur ton <strong>Standing</strong>. <strong>Sans valeur monétaire.</strong> Seulement ta "position" dans le monde. Rien de plus.',
    },
    'ritual.stories.titles_jp': {
      ja: 'タイトルは売れない。譲渡できない。換金できない。\nただ世界の記憶に残るだけだ。',
      en: 'Titles cannot be sold. Cannot be transferred. Cannot be cashed.\nThey simply remain in the memory of the world.',
      ko: '칭호는 팔 수 없다. 양도할 수 없다. 환금할 수 없다.\n다만 세계의 기억에 남을 뿐.',
      es: 'Los títulos no se venden. No se transfieren. No se canjean.\nSolo permanecen en la memoria del mundo.',
      hi: 'शीर्षक न बेचे जा सकते, न हस्तांतरित, न नकद हो सकते।\nवे केवल दुनिया की स्मृति में रहते हैं।',
      vi: 'Danh hiệu không bán được. Không chuyển nhượng được. Không quy đổi được.\nChúng chỉ đơn giản còn lại trong ký ức của thế giới.',
      pt: 'Títulos não se vendem. Não se transferem. Não se convertem em dinheiro.\nSó permanecem na memória do mundo.',
      id: 'Gelar tak dijual. Tak dipindah. Tak dicairkan.\nMereka hanya tinggal dalam ingatan dunia.',
      th: 'ตำแหน่งขายไม่ได้ โอนไม่ได้ แปลงเป็นเงินไม่ได้\nเพียงคงอยู่ในความทรงจำของโลก',
      fr: 'Les titres ne se vendent pas. Ne se transfèrent pas. Ne se monnaient pas.\nIls restent simplement dans la mémoire du monde.',
    },
    'ritual.stories.cta': {
      ja: '⌘ 過去のサイクルを見る',
      en: '⌘ See past cycles',
      ko: '⌘ 과거 사이클 보기',
      es: '⌘ Ver ciclos pasados',
      hi: '⌘ पिछले चक्र देखें',
      vi: '⌘ Xem các chu kỳ qua',
      pt: '⌘ Ver ciclos passados',
      id: '⌘ Lihat siklus lampau',
      th: '⌘ ดูรอบที่ผ่านมา',
      fr: '⌘ Voir les cycles passés',
    },

    // --- FOOTER (added v1.3) ---
    'footer.tagline': {
      ja: '全員が王になれるわけではない。<br/>だが、全員が王を作れる。',
      en: 'Not everyone can be King.<br/>But everyone can make one.',
      ko: '모두가 King이 될 수는 없다.<br/>하지만 모두가 한 사람을 King으로 만들 수는 있다.',
      es: 'No todos pueden ser King.<br/>Pero todos pueden hacer a uno.',
      hi: 'हर कोई King नहीं बन सकता।<br/>लेकिन हर कोई एक को King बना सकता है।',
      vi: 'Không phải ai cũng có thể là King.<br/>Nhưng ai cũng có thể tạo nên một King.',
      pt: 'Nem todos podem ser King.<br/>Mas todos podem fazer um.',
      id: 'Tak semua bisa jadi King.<br/>Tapi semua bisa menjadikan seseorang King.',
      th: 'ไม่ใช่ทุกคนที่จะเป็น King ได้<br/>แต่ทุกคนสามารถสร้าง King หนึ่งคนได้',
      fr: 'Tout le monde ne peut pas être King.<br/>Mais tout le monde peut en faire un.',
    },
    'footer.h_ritual': {
      ja: '儀式',
      en: 'Ritual',
      ko: '의식',
      es: 'Ritual',
      hi: 'अनुष्ठान',
      vi: 'Nghi thức',
      pt: 'Ritual',
      id: 'Ritual',
      th: 'พิธีกรรม',
      fr: 'Rituel',
    },
    'footer.h_money': {
      ja: 'お金の話',
      en: 'The Money',
      ko: '돈에 관하여',
      es: 'El Dinero',
      hi: 'पैसा',
      vi: 'Về Tiền',
      pt: 'O Dinheiro',
      id: 'Soal Uang',
      th: 'เรื่องเงิน',
      fr: 'L\'Argent',
    },
    'footer.h_takepart': {
      ja: '参加する',
      en: 'Take Part',
      ko: '참가하기',
      es: 'Participar',
      hi: 'भाग लें',
      vi: 'Tham gia',
      pt: 'Participe',
      id: 'Ikut Serta',
      th: 'เข้าร่วม',
      fr: 'Participer',
    },
    'footer.legal_h': {
      ja: '法務 · 運営者',
      en: 'Legal · Operator',
      ko: '법무 · 운영자',
      es: 'Legal · Operador',
      hi: 'कानूनी · संचालक',
      vi: 'Pháp lý · Đơn vị vận hành',
      pt: 'Legal · Operador',
      id: 'Legal · Operator',
      th: 'กฎหมาย · ผู้ดำเนินการ',
      fr: 'Légal · Opérateur',
    },
    'footer.terms': {
      ja: '利用規約',
      en: 'Terms',
      ko: '이용약관',
      es: 'Términos',
      hi: 'शर्तें',
      vi: 'Điều khoản',
      pt: 'Termos',
      id: 'Syarat',
      th: 'ข้อกำหนด',
      fr: 'Conditions',
    },
    'footer.privacy': {
      ja: 'プライバシー',
      en: 'Privacy',
      ko: '개인정보',
      es: 'Privacidad',
      hi: 'गोपनीयता',
      vi: 'Riêng tư',
      pt: 'Privacidade',
      id: 'Privasi',
      th: 'ความเป็นส่วนตัว',
      fr: 'Confidentialité',
    },
    'footer.commerce': {
      ja: '特定商取引法表記',
      en: 'Commercial Transactions Notice (JP)',
      ko: '특정 상거래법 표기 (JP)',
      es: 'Aviso de Transacciones Comerciales (JP)',
      hi: 'व्यावसायिक लेन-देन सूचना (JP)',
      vi: 'Thông báo Giao dịch Thương mại (JP)',
      pt: 'Aviso de Transações Comerciais (JP)',
      id: 'Pemberitahuan Transaksi Komersial (JP)',
      th: 'ประกาศการทำธุรกรรมเชิงพาณิชย์ (JP)',
      fr: 'Avis de Transactions Commerciales (JP)',
    },
    'footer.operator': {
      ja: '運営 · TAmJ ↗',
      en: 'Operator · TAmJ ↗',
      ko: '운영자 · TAmJ ↗',
      es: 'Operador · TAmJ ↗',
      hi: 'संचालक · TAmJ ↗',
      vi: 'Đơn vị vận hành · TAmJ ↗',
      pt: 'Operador · TAmJ ↗',
      id: 'Operator · TAmJ ↗',
      th: 'ผู้ดำเนินการ · TAmJ ↗',
      fr: 'Opérateur · TAmJ ↗',
    },
    'footer.apply': {
      ja: '応募',
      en: 'Apply',
      ko: '응모',
      es: 'Postular',
      hi: 'आवेदन',
      vi: 'Ứng tuyển',
      pt: 'Inscrever-se',
      id: 'Daftar',
      th: 'สมัคร',
      fr: 'Postuler',
    },
    'footer.open_app': {
      ja: 'アプリを開く',
      en: 'Open App',
      ko: '앱 열기',
      es: 'Abrir la App',
      hi: 'ऐप खोलें',
      vi: 'Mở App',
      pt: 'Abrir App',
      id: 'Buka App',
      th: 'เปิดแอป',
      fr: 'Ouvrir l\'App',
    },
    'footer.edge_rules': {
      ja: 'エッジ・ルール',
      en: 'Edge Rules',
      ko: '엣지 룰',
      es: 'Reglas del Borde',
      hi: 'एज नियम',
      vi: 'Luật giới hạn',
      pt: 'Regras de Borda',
      id: 'Aturan Tepi',
      th: 'กฎที่ขอบ',
      fr: 'Règles du Bord',
    },
    'footer.copy': {
      ja: '© 2026 · KINGMAKER 23:23 · TAmJ 運営 · 東京、日本',
      en: '© 2026 · KINGMAKER 23:23 · Operated by TAmJ · Tokyo, Japan',
      ko: '© 2026 · KINGMAKER 23:23 · TAmJ 운영 · 도쿄, 일본',
      es: '© 2026 · KINGMAKER 23:23 · Operado por TAmJ · Tokio, Japón',
      hi: '© 2026 · KINGMAKER 23:23 · TAmJ द्वारा संचालित · टोक्यो, जापान',
      vi: '© 2026 · KINGMAKER 23:23 · Vận hành bởi TAmJ · Tokyo, Nhật Bản',
      pt: '© 2026 · KINGMAKER 23:23 · Operado por TAmJ · Tóquio, Japão',
      id: '© 2026 · KINGMAKER 23:23 · Dioperasikan oleh TAmJ · Tokyo, Jepang',
      th: '© 2026 · KINGMAKER 23:23 · ดำเนินการโดย TAmJ · โตเกียว ญี่ปุ่น',
      fr: '© 2026 · KINGMAKER 23:23 · Exploité par TAmJ · Tokyo, Japon',
    },
    'footer.disclaimer': {
      ja: '宝くじではない · 投資ではない · 賭けではない · Bellは資格、お金ではない',
      en: 'Not a lottery · Not an investment · Not a wager · Bell is a Right, never cash',
      ko: '복권이 아님 · 투자가 아님 · 도박이 아님 · Bell은 자격, 돈이 아님',
      es: 'No es lotería · No es inversión · No es apuesta · Bell es un Derecho, nunca dinero',
      hi: 'लॉटरी नहीं · निवेश नहीं · दांव नहीं · Bell अधिकार है, नकद नहीं',
      vi: 'Không phải xổ số · Không phải đầu tư · Không phải cá cược · Bell là Quyền, không phải tiền',
      pt: 'Não é loteria · Não é investimento · Não é aposta · Bell é Direito, nunca dinheiro',
      id: 'Bukan lotere · Bukan investasi · Bukan taruhan · Bell adalah Hak, bukan uang',
      th: 'ไม่ใช่ลอตเตอรี่ · ไม่ใช่การลงทุน · ไม่ใช่การพนัน · Bell คือสิทธิ์ ไม่ใช่เงิน',
      fr: 'Pas une loterie · Pas un investissement · Pas un pari · Bell est un Droit, jamais de l\'argent',
    },
  
  };

  function applyContentTranslations(lang) {
    // Set the global display-lang attribute. CSS uses this to hide
    // .jp / *-jp / [lang="ja"] elements when the picker is not JA.
    // Single source of truth for display-language CSS rules.
    document.documentElement.setAttribute('data-display-lang', lang);

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const entry = I18N_CONTENT[key];
      if (!entry) return;
      // Cache the very first rendered HTML so we can restore on lang switch.
      if (!el.dataset.i18nOriginal) el.dataset.i18nOriginal = el.innerHTML;
      const translated = entry[lang];
      el.innerHTML = (translated !== undefined) ? translated : el.dataset.i18nOriginal;
    });
  }

  // Expose for ritual modal: when a modal opens, freshly-cloned data-i18n-html
  // elements need translation re-applied (they're new DOM).
  window.__i18nApply = function(lang) {
    applyBilingualSwap(lang);
    applyContentTranslations(lang);
  };

  function init() {
    // Step 1: Bootstrap language (cookie / localStorage / browser detect).
    // If this fires a reload (because we just set a cookie), the rest
    // of init() will re-run on the fresh page load with the cookie set.
    bootstrapLang();

    // Step 2: Brand lock protection — must run BEFORE other passes so
    // they can check `.brand-lock` and skip those elements.
    markBrandLock();

    // Step 3: Mark JP-text elements with lang="ja" attr (helps Google
    // Translate's per-element auto-detection for non-EN-non-JA targets).
    markJpElements();

    // Step 4: Build dropdowns + apply menu & content translations.
    document.querySelectorAll('.lang-picker').forEach(buildDropdown);
    const lang = getCurrentLang();
    applyMenuTranslations(lang);
    applyBilingualSwap(lang);
    applyContentTranslations(lang);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

