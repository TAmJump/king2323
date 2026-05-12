/* ============================================================
   KINGMAKER 23:23 — Google Translate (cookie-driven, 108 languages)
   Version: v20260512f  (printed to console at load for debugging)
   ============================================================ */

(function () {
  'use strict';

  // Diagnostic banner so the operator can verify in DevTools console
  // that the current build is being served (not an old cached copy).
  // If a user reports a translation bug, ask them to share the console
  // output — if this line is missing or shows an older version, they
  // are hitting a stale cache (CF / browser disk).
  console.log('%c[i18n] v20260512f loaded · cookie:', 'color:#b8862d;font-weight:bold',
              document.cookie || '(none)');

  // Full Google Translate language list (108 languages)
  // [code, English name, Native name]
  const LANGS = [
    ['en', 'English', 'English'],
    ['ja', 'Japanese', '日本語'],
    ['ko', 'Korean', '한국어'],
    ['zh-CN', 'Chinese (Simplified)', '简体中文'],
    ['zh-TW', 'Chinese (Traditional)', '繁體中文'],
    ['hi', 'Hindi', 'हिन्दी'],
    ['es', 'Spanish', 'Español'],
    ['fr', 'French', 'Français'],
    ['de', 'German', 'Deutsch'],
    ['it', 'Italian', 'Italiano'],
    ['pt', 'Portuguese', 'Português'],
    ['ru', 'Russian', 'Русский'],
    ['ar', 'Arabic', 'العربية'],
    ['id', 'Indonesian', 'Bahasa Indonesia'],
    ['vi', 'Vietnamese', 'Tiếng Việt'],
    ['th', 'Thai', 'ไทย'],
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

  function applyLang(lang) {
    setGoogTransCookie(lang);
    setTimeout(() => window.location.reload(), 100);
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
      LANGS.forEach(([code, name, native]) => {
        const hit = !q || code.toLowerCase().includes(q) ||
                    name.toLowerCase().includes(q) ||
                    native.toLowerCase().includes(q);
        if (!hit) return;
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

  // Menu translation dictionary — general vocabulary only.
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
    }
  };

  function applyContentTranslations(lang) {
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
  window.__i18nApply = applyContentTranslations;

  function init() {
    markJpElements();
    document.querySelectorAll('.lang-picker').forEach(buildDropdown);
    applyMenuTranslations(getCurrentLang());
    applyContentTranslations(getCurrentLang());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

