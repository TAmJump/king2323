/* ============================================================
   KINGMAKER 23:23 — Google Translate (cookie-driven, 108 languages)
   Version: v20260512i  (printed to console at load for debugging)
   ============================================================ */

(function () {
  'use strict';

  // Diagnostic banner so the operator can verify in DevTools console
  // that the current build is being served (not an old cached copy).
  // If a user reports a translation bug, ask them to share the console
  // output — if this line is missing or shows an older version, they
  // are hitting a stale cache (CF / browser disk).
  console.log('%c[i18n] v20260512i loaded · cookie:', 'color:#b8862d;font-weight:bold',
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
    'ticker.bell_open':    { ja: 'Bellが開いている。' },
    'ticker.bell_window':  { ja: '金曜 23:23 ─ 23:28 · 5分間' },
    'ticker.choose':       { ja: '選ばれる前に、選べ。' },
    'ticker.bell_right':   { ja: 'Bellは資格。換金されない。' },
    'ticker.never_lose':   { ja: 'Bellは失われない。' },
    'ticker.three_trials': { ja: '3つの試練。一つの王冠。' },
    'ticker.grant_not_prize': { ja: 'Grantは賞金ではない。' },
    'ticker.questions_world': { ja: '問題は、世界によって明かされる。' },

    // --- WHY 23:23 (THE EDGE) — user's screenshot section ---
    'why.eyebrow':         { ja: '第0章 · その時刻' },
    'why.headline':        {
      ja: '23:23は、<span class="gold-italic">昨日の自分</span>と、<br/>'
        + '<span class="gold-italic">王になる自分</span>の境界。'
    },
    // The existing .edge-headline-jp element is already Japanese.
    // We translate it to English here for EN/other pickers.
    'why.subtitle_jp':     {
      en: 'The edge between who you were yesterday, and the king you become.'
    },
    'why.text_1':          {
      ja: '一日の最後の時刻。世界はもうすぐ眠る。もうすぐ終わる。<em>もうすぐ</em>。'
    },
    'why.text_2':          {
      ja: '真夜中が閉じる、その一分前。明日に選ばれる前に、私たちが選ぶ一分。'
    },
    'why.foot':            {
      ja: '他の時刻はない。他の分はない。<span class="gold">23:23, JST</span> ─ 週に二度、世界が脈打つ。'
    },

    // --- BELL RITUAL (Two Bells / One Week) ---
    'bell.eyebrow':        { ja: '第I章 · 儀式' },
    'bell.headline':       { ja: '二つのBell。<br/>一つの週。' },
    'bell.lede':           {
      ja: '世界は、週に二度立ち止まる。最初のBellで、選択が始まる。'
        + '二度目で、世界は選び終えている。途中は、ない。'
    },
    'bell.friday_msg':     { ja: 'Bellが開く。' },
    'bell.friday_sub':     { ja: '5分間。3人の名前。一つの選択。' },
    'bell.monday_msg':     { ja: '世界は選び終えた。' },
    'bell.monday_sub':     { ja: '一人の王。二つの王冠。他は、来週へ。' },

    // --- STORIES (past kings) ---
    'stories.eyebrow':     { ja: '第VIII章 · 物語' },
    'stories.headline':    { ja: 'これまでの<em>王</em>たち。' },
    'stories.lede':        { ja: '月曜の23:23ごとに、玉座は移る。これまで玉座に就いた者たち。' },

    // --- RULES / EDGE FAQ section (image 2 — 12 Q&A cards) ---
    // The .rule-q (English question) auto-swaps with adjacent .rule-q-jp
    // via applyBilingualSwap. Only the .rule-a answers need explicit
    // JP translation since they have no JP sibling in the markup.
    'rules.eyebrow':       { ja: '第VI章 · エッジ・ルール' },
    'rules.headline':      { ja: '誰もが訊く<br/>問い。' },
    'rules.lede':           { ja: '答えのない儀式は、法たり得ない。12の境界事例 ─ 起きる前に、公の場で答える。' },

    'rules.a01':  { ja: '<strong>回答 · 同点処理</strong>先着順ではない。応募者プールが最大の国の支持率で同点を解決し、ライブ公開Seedで再ハッシュ。人手の編集なし。私的サイコロなし。' },
    'rules.a02':  { ja: '<strong>回答 · 永続</strong>Bellは失効しない。プラットフォームは最も小さな声 ─ 最初の100円しか払えない人 ─ を守る。その声は残り続ける。' },
    'rules.a03':  { ja: '<strong>回答 · 消滅</strong>Bellは声であり、残高ではない。自発的な離脱時、残りのBellは消滅する。払戻なし、譲渡なし。声は沈黙する。' },
    'rules.a04':  { ja: '<strong>回答 · 遺言の王</strong>事前に指定された家族または遺産執行人が候補資格を継承する。Missionは生き続ける。肉体が消えたから玉座が消える、ということはない。' },
    'rules.a05':  { ja: '<strong>回答 · 王の負担</strong>Kingは居住国での自己申告に責任を負う。運営はその40%に対する売上税を支払う。国際送金手数料はGrantから差し引かれる。' },
    'rules.a06':  { ja: '<strong>回答 · デバイス指紋</strong>SMS認証 + 暗号デバイス指紋 + 行動シグナル。同じ世帯、同じオフィス、同じVPN ─ すべて、投票が数えられる前に再認証のフラグが立つ。' },
    'rules.a07':  { ja: '<strong>回答 · Bell上限 + 異常検知</strong>Bellごとの投票数にIPあたり上限。クラスターパターン、地理的外れ値、タイミングのスパイクに対する統計的異常検知。フラグ付き Bell は人手監査まで保留。' },
    'rules.a08':  { ja: '<strong>回答 · エスクロー</strong>Grant Fund は法的に分離されたエスクロー口座にあり、第三者の受託者が管理する。運営の死亡・病気・破産は、そこにある一円にも触れることができない。' },
    'rules.a09':  { ja: '<strong>回答 · 週次レスキュー切符</strong>4週間の投票履歴が確認できる参加者に、月一の無料応募を許可。儀式は、払える人だけのものではない。' },
    'rules.a10': { ja: '<strong>回答 · AI OCR + 人手監査</strong>すべての領収書はOCRで改ざんチェックされ、ベンダー記録と照合された後、人手の監査員がレビュー。虚偽報告はGrant剥奪と永久利用停止。' },
    'rules.a11': { ja: '<strong>回答 · ロールオーバー</strong>Grantは Fund に戻る。Pool は次サイクルに向けて大きくなる。何もシステムから出ない。何も失われない。Bellはまた鳴る。' },
    'rules.a12': { ja: '<strong>回答 · 境界</strong>23:23 は、終わる日と、まだ始まっていない日との境界。あなただった人と、あなたがなる人との境界。真夜中は閉じる。23:23 は選ぶ。' },

    // --- COUNTDOWN LABELS ---
    'countdown.label':     { ja: '─ 次のBellまで ─' },
    'countdown.days':      { ja: '日' },
    'countdown.hrs':       { ja: '時間' },
    'countdown.min':       { ja: '分' },
    'countdown.sec':       { ja: '秒' },

    // --- RITUAL MODAL: ritual-why (Why 23:23?) ---
    'ritual.why.title':    { ja: 'なぜ<em>23:23</em>なのか?' },
    'ritual.why.subtitle': { en: 'The hour the king is replaced.' },
    'ritual.why.accent':   {
      ja: '23時23分。<em>一日の終わり、王が交代する刻。</em>',
      en: '23:23. <em>The edge of the day. The hour the king is replaced.</em>'
    },
    'ritual.why.p1':       {
      en: '23:23 is the threshold — the minute just before a day ends, when '
        + 'everyone in the world is thinking "time to sleep." That '
        + '<strong>edge moment</strong>. KINGMAKER\'s Bell opens only at '
        + 'this hour. Five minutes a week. No more.'
    },
    'ritual.why.p2':       {
      en: 'The Bell opens at <strong>23:23 JST on Friday</strong> and closes '
        + 'at <strong>23:23 JST on Monday</strong>. Each country observes '
        + 'it at the same instant — synchronized to the same point on the '
        + 'globe\'s clock.'
    },
    'ritual.why.p3':       {
      en: 'The hour itself doesn\'t carry meaning. '
        + '<strong>The ritual gives the hour its meaning</strong>.'
    },

    // --- RITUAL MODAL: ritual-coin (The Offering, ¥100 = 100 Bell) ---
    'ritual.coin.subtitle': { en: '¥100 = 100 Bell. A participation right that lives forever.' },
    'ritual.coin.p1':       { en: 'When you offer ¥100, <strong>100 Bell</strong> is etched into KINGMAKER. Bell is a <strong>Participation Right</strong>. Not legal tender, not crypto, not a prepaid instrument. It is not cashable, not transferable, not measurable as value.' },
    'ritual.coin.p2':       { en: 'To enter THE TRIAL each week, you ring <strong>10 Bell</strong>. Pass all three rounds and your <strong>King candidacy</strong> is unlocked. Get one wrong and <strong>Bell does not decrease</strong> — you only lose "this week\'s chance." Ring again next week.' },
    'ritual.coin.li1':      { en: '<strong>Bell = Participation Right.</strong> Not cashable, not transferable, no asset value.' },
    'ritual.coin.li2':      { en: 'Each week, ring 10 Bell at THE TRIAL (Bell rings but stays with you).' },
    'ritual.coin.li3':      { en: 'Failure does not consume Bell. You only lose <strong>this week\'s King candidacy</strong>.' },
    'ritual.coin.li4':      { en: 'Pass all three rounds → Qualification Unlocked → proceed to CROWN SLOT.' },
    'ritual.coin.li5':      { en: 'Unused Bell expiry: 12 months from acquisition. Payments via Square.' },
    'ritual.coin.accent2':  { en: '¥100 lives <em>forever</em>.' },
    'ritual.coin.cta':      { en: '⌘ Proceed to Square · Offer ¥100' },
    'ritual.coin.note':     { en: '— Webhook integration in test · Sandbox environment —' },

    // --- RITUAL MODAL: ritual-bell (THE BELL — qualification not money) ---
    'ritual.bell.subtitle': { en: 'Bell is a Right. Never cash.' },
    'ritual.bell.accent_jp': { en: 'You never lose your Bell. You only lose this week\'s chance.' },
    'ritual.bell.is1':      { en: 'A <strong>Participation Right</strong> inside KINGMAKER.' },
    'ritual.bell.is2':      { en: 'The unit of right to enter THE TRIAL each week.' },
    'ritual.bell.is3':      { en: 'The key that unlocks King candidacy.' },
    'ritual.bell.is4':      { en: 'A "ringing instrument" for the ritual — no monetary value.' },
    'ritual.bell.isnot1':   { en: 'Not legal tender.' },
    'ritual.bell.isnot2':   { en: 'Not crypto-currency (Payment Services Act §2-14).' },
    'ritual.bell.isnot3':   { en: 'Not a prepaid payment instrument (Payment Services Act §3).' },
    'ritual.bell.isnot4':   { en: 'Not a security or investment product (FIEA).' },
    'ritual.bell.isnot5':   { en: 'Not points, miles, or rewards.' },
    'ritual.bell.flow_p':   { en: '<strong>There is no Wallet.</strong> You cannot accumulate a balance and cannot get a refund. Each week, only at the moment of participation, you offer ¥100 via Square Card-on-File to ring the Bell.' },
    'ritual.bell.flow_head': { en: '— How the Bell rings —' },
    'ritual.bell.flow_li1': { en: 'Friday 23:23 → notification <em>"The Bell is calling."</em>' },
    'ritual.bell.flow_li2': { en: 'Tap <strong>ENTER THE BELL</strong> → Square charges ¥100 → THE TRIAL begins.' },
    'ritual.bell.flow_li3': { en: 'Weeks you skip: complete stillness — no auto-charge, no balance held.' },
    'ritual.bell.flow_li4': { en: 'Failure does not consume Bell. Next week, you can ring again.' },
    'ritual.bell.closing':  { en: 'This is not "stake money." This is "the act of ringing the bell."' },
    'ritual.bell.cta':      { en: '⌘ See what THE TRIAL is' },

    // --- RITUAL MODAL: ritual-three (CROWN SLOT) ---
    'ritual.three.subtitle': { en: 'The final ritual. The moment the world\'s fingers stop on the same number.' },
    'ritual.three.p1':       { en: 'Only those who survived Round 1 and Round 2 earn the right to stand in Round 3 — <strong>CROWN SLOT</strong>. A slot of 00–99 spins on screen. You tap once to stop it.' },
    'ritual.three.p2':       { en: 'Every finger in the world stops the slot at the same instant. The number most people stopped on becomes that week\'s <strong>Crown Number</strong>.' },
    'ritual.three.p3':       { en: 'From the applicants who landed on that number, the <strong>King is determined</strong> by a public Seed (SHA-256 of BTC · Nikkei · S&P · applicant count). This is not a selection — it is determination by <strong>world consensus + public formula</strong>.' },
    'ritual.three.closing':  { en: 'Even if a hundred million offer, <br/><em>only the survivors stand</em>.<br/>And of those who stand, only <em>one</em> becomes King.' },

    // --- RITUAL MODAL: ritual-money (Money flow, Grant Fund 60/30/10) ---
    'ritual.money.subtitle':    { en: 'The flow of ¥100, and the Grant Fund.' },
    'ritual.money.accent1':     { en: 'Of every ¥100, <em>¥60 goes to the Grant Fund</em>.' },
    'ritual.money.p1':          { en: 'Each ¥100 payment is split. <strong>60% = Grant Fund</strong> (the public grant pool), <strong>30% = operations</strong>, <strong>10% = payment processing</strong>. Fund balance is published at all times at <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">/fund</code>.' },
    'ritual.money.accent2_jp':  { en: 'Bell only unlocks qualification. A qualified Mission may receive a grant from the Fund.' },
    'ritual.money.p2':          { en: 'Grant is <strong>not a prize</strong>. Those who survive THE TRIAL and are determined at CROWN SLOT first undergo <strong>KYC, AML, and Mission Truth review</strong>. Only Missions that pass all checks receive a <strong>grant</strong> from the Grant Fund.' },
    'ritual.money.li1':         { en: 'Bell never becomes cash.' },
    'ritual.money.li2':         { en: 'Bell only unlocks qualification.' },
    'ritual.money.li3':         { en: 'Failed applicants\' Bell is never transferred to other users.' },
    'ritual.money.li4':         { en: 'Grant is a reviewed-and-proven "grant" — never a dividend or winnings.' },
    'ritual.money.li5':         { en: 'If proof of Mission completion is not submitted, Grant is revoked and inherited by the next-ranked candidate.' },
    'ritual.money.cta':         { en: '⌘ Read the Money Logic' },

    // --- RITUAL MODAL: ritual-duty (Royal Duty — The Crown has weight) ---
    'ritual.duty.subtitle': { en: 'The Crown has weight.' },
    'ritual.duty.p1':       { en: 'Becoming King is not the end. You submit <strong>proof of Mission completion within 30 days</strong>. If Mission was debt repayment: completion record. Opening a shop: business registration + store photos. A journey: photos from the destination.' },
    'ritual.duty.p2':       { en: 'We do not expose the person. <strong>We expose the result.</strong> If proof is not submitted, the Crown is revoked and inherited by the next-ranked candidate.' },
    'ritual.duty.li1':      { en: 'Signature on the Mission Truth Agreement (required at application).' },
    'ritual.duty.li2':      { en: 'Submit Proof within 30 days of receiving the Grant.' },
    'ritual.duty.li3':      { en: 'Accept investigation if the truth of the submission is questioned.' },
    'ritual.duty.li4':      { en: 'Obligation to return + permanent ban if falsehood is discovered.' },

    // --- RITUAL MODAL: ritual-verify (Not trusted. Verified.) ---
    'ritual.verify.subtitle': { en: 'Don\'t trust. Verify.' },
    'ritual.verify.p1':       { en: 'King determination, CROWN SLOT final pick — everything is derived from <strong>public formulas + public Seed</strong>. Anyone, in their own browser, can re-compute SHA-256 and <strong>confirm it matches the operator\'s result</strong>.' },
    'ritual.verify.accent2':  { en: 'The operator <em>does not know the questions</em> either.' },
    'ritual.verify.p2':       { en: 'No one at KINGMAKER — not operator, not engineer — knows the THE TRIAL questions in advance. A <strong>100,000-question Question Bank</strong> is public, and each week the Seed (BTC · Nikkei · S&P · applicant count · seconds) runs through SHA-256 to mechanically pick the 3 question IDs.' },
    'ritual.verify.tagline_jp': { en: 'Questions are not created. They are revealed by the world.' },

    // --- RITUAL MODAL: ritual-doctrine (The 5 Laws) ---
    'ritual.doctrine.subtitle': { en: 'The Five Laws.' },
    'ritual.doctrine.l1': { en: '<strong>I.</strong> Bell is a Right, never cash.' },
    'ritual.doctrine.l2': { en: '<strong>II.</strong> You never lose your Bell. You only lose this week\'s chance.' },
    'ritual.doctrine.l3': { en: '<strong>III.</strong> Grant is not a prize — it is a grant after review and proof.' },
    'ritual.doctrine.l4': { en: '<strong>IV.</strong> The Crown has weight.' },
    'ritual.doctrine.l5': { en: '<strong>V.</strong> Expose the result, not the person.' },

    // --- RITUAL MODAL: ritual-trial (5 minutes, 3 trials, one Crown) ---
    'ritual.trial.subtitle': { en: 'The world\'s 5-minute simultaneous ritual.' },
    'ritual.trial.p1':       { en: 'Even if 100 million apply, no one can read every Mission in five minutes. So KINGMAKER does not let anyone choose. <strong>The whole world stands on the same problem at the same instant.</strong> That is THE TRIAL.' },
    'ritual.trial.r1':       { en: 'Math · Memory · Logic.<br/>Example: <code style="background:rgba(184,134,45,0.12); padding:2px 6px; font-family:var(--f-mono);">17 + 28 − 6 × 2</code> · permutations · ratios.<br/>10–20 seconds. Multiple choice. Correct → next.' },
    'ritual.trial.r2':       { en: 'World culture · flags · currencies · elements · official names behind acronyms.<br/>Example: "What does KTX stand for?" "What\'s the capital of Mexico?" "What does NASA stand for?"<br/>— No advantage to Japanese speakers, no advantage to English speakers.' },
    'ritual.trial.r3':       { en: 'A slot from 00 to 99. You <strong>tap once</strong> to stop it. Among the numbers the world\'s fingers landed on, the most-frequent value becomes the <strong>Crown Number</strong>. From applicants who hit that number, the King is determined by public Seed.' },
    'ritual.trial.rule_jp':  { en: 'You never lose your Bell. You only lose this week\'s chance.' },
    'ritual.trial.p2':       { en: 'Ring 10 Bell to enter. If you fail, Bell does not decrease. You can ring again next week. Those who pass all three rounds earn <strong>Qualification Unlocked</strong> status and proceed to CROWN SLOT.' },
    'ritual.trial.li1':      { en: 'Question Bank: 100,000 questions. Even the operator does not know the contents in advance.' },
    'ritual.trial.li2':      { en: 'Question IDs: mechanically derived from each week\'s Seed via SHA-256.' },
    'ritual.trial.li3':      { en: 'Genre rotates weekly: Math / Memory / Logic / Language / Culture / Science.' },
    'ritual.trial.li4':      { en: 'Repeat of the same question: designed cooldown of weeks-to-months.' },
    'ritual.trial.standing': { en: 'Each time you pass all three rounds, a mark is etched on your <strong>Standing</strong>. Streaks are recorded as titles. The titles have no monetary value — but they show your "standing" in the world.' },
    'ritual.trial.cta':      { en: '⌘ How questions are chosen' },

    // --- RITUAL MODAL: ritual-resonance (Bell never becomes cash) ---
    'ritual.resonance.subtitle':    { en: 'Bell is a Participation Right, not money.' },
    'ritual.resonance.accent_jp':   { en: 'Bell unlocks qualification. Nothing more.' },
    'ritual.resonance.p1':          { en: 'KINGMAKER is <strong>not gambling</strong>. Not an investment product. Not a raffle. When you offer ¥100 here, you receive <strong>the right to stand in a 5-minute world-simultaneous ritual</strong>. It is not an asset, cannot be transferred, and never returns as cash.' },
    'ritual.resonance.f1':          { en: '1. You <strong>offer ¥100</strong>.' },
    'ritual.resonance.f2':          { en: '2. <strong>100 Bell</strong> is etched in. Participation right.' },
    'ritual.resonance.f3':          { en: '3. Each week, ring 10 Bell to enter THE TRIAL.' },
    'ritual.resonance.f4':          { en: '4. Failure does not <strong>decrease</strong> Bell. <strong>Next week, ring again</strong>.' },
    'ritual.resonance.f5':          { en: '5. Pass 3 rounds → Qualification Unlocked.' },
    'ritual.resonance.f6':          { en: '6. CROWN SLOT → King determined.' },
    'ritual.resonance.f7':          { en: '7. King undergoes <strong>KYC, AML, Mission Truth</strong> review.' },
    'ritual.resonance.f8':          { en: '8. For passing Missions, operator pays a <strong>grant from the Grant Fund</strong>.' },
    'ritual.resonance.f9':          { en: '9. Submit <strong>Royal Proof</strong> within 30 days.' },
    'ritual.resonance.not1':        { en: 'Not legal tender.' },
    'ritual.resonance.not2':        { en: 'Not crypto.' },
    'ritual.resonance.not3':        { en: 'Not a prepaid payment instrument (Payment Services Act §3).' },
    'ritual.resonance.not4':        { en: 'Not a security or investment (FIEA).' },
    'ritual.resonance.not5':        { en: 'Not points, miles, or rewards.' },
    'ritual.resonance.not6':        { en: 'Not winnings, dividends, or prize money.' },
    'ritual.resonance.not7':        { en: 'Not transferable to other users.' },
    'ritual.resonance.is1':         { en: 'A Participation Right inside KINGMAKER.' },
    'ritual.resonance.is2':         { en: 'The unit of right to enter THE TRIAL each week.' },
    'ritual.resonance.is3':         { en: 'For Mission applicants: <strong>the key to unlock King candidacy</strong>.' },
    'ritual.resonance.is4':         { en: 'A "ringing instrument" needed for the ritual — no monetary value.' },

    // --- RITUAL MODAL: ritual-stories (Past Kings, Standing) ---
    'ritual.stories.subtitle':  { en: 'Past Kings the world has determined, and their Standing.' },
    'ritual.stories.p1':        { en: 'The King determined at Cycle 46 was a 38-year-old man whose Mission was paying off debt. Grant ¥1.2M. 30 days later, proof of full repayment was submitted, and his Standing became <strong>Verified</strong>.' },
    'ritual.stories.p2':        { en: 'At Cycle 45, proof for the Mission was not submitted. The Crown was revoked and inherited by the next-ranked applicant.' },
    'ritual.stories.note':      { en: 'Records of all past cycles are published at /verify.' },
    'ritual.stories.standing':  { en: 'As your weeks of surviving THE TRIAL accumulate, titles are etched onto your <strong>Standing</strong>. <strong>No monetary value.</strong> Only your "position" in the world. Nothing more.' },
    'ritual.stories.titles_jp': { en: 'Titles cannot be sold. Cannot be transferred. Cannot be cashed.\nThey simply remain in the memory of the world.' },
    'ritual.stories.cta':       { en: '⌘ See past cycles' },
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

