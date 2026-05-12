/* ============================================================
   KINGMAKER 23:23 — Google Translate (cookie-driven, 108 languages)
   ============================================================ */

(function () {
  'use strict';

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
  function setGoogTransCookie(lang) {
    const host = window.location.hostname;
    const parts = host.split('.');
    const parentDomain = parts.length > 1 ? '.' + parts.slice(-2).join('.') : host;
    const value = lang === 'en' ? '' : `/auto/${lang}`;
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    const expiresStr = expires.toUTCString();
    document.cookie = `googtrans=${value};path=/;expires=${expiresStr}`;
    document.cookie = `googtrans=${value};domain=${parentDomain};path=/;expires=${expiresStr}`;
  }

  function getCurrentLang() {
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

  function init() {
    document.querySelectorAll('.lang-picker').forEach(buildDropdown);
    applyMenuTranslations(getCurrentLang());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

