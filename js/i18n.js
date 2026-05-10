/* ============================================================
   KINGMAKER 23:23 — i18n
   Languages: ja / en / ko / hi
   Strategy: data-i18n attribute on translatable element.
   Element's existing innerHTML is the EN fallback.
   ============================================================ */

(function () {
  'use strict';

  const I18N = {
    ja: {
      // Nav
      'nav.bell':       '23:23',
      'nav.bell2':      '鐘',
      'nav.money':      '資金',
      'nav.three':      '三人',
      'nav.duty':       '義務',
      'nav.doctrine':   '教義',
      'nav.stories':    '物語',
      'nav.begin':      'はじめる',

      // Hero
      'hero.eyebrow':   'グローバル儀式支援プラットフォーム · v1.0',
      'hero.h1':        '誰もが王に<br/>なれる<br/>わけじゃない。<br/>でも、<br/>誰かを王に<br/>することは<br/>できる。',
      'hero.tag':       '選ばれるためには、選ぶ側に立つしかない。',
      'hero.tag2':      'Not everyone can be king. But everyone can make one.',
      'hero.cta1':      '100 Coinを受け取る · ¥100',
      'hero.cta2':      'なぜ 23:23 ?',
      'hero.bellopens': '— 鐘が開くまで —',
      'hero.days':      '日',
      'hero.hrs':       '時',
      'hero.min':       '分',
      'hero.sec':       '秒',

      // Why 23:23
      'why.chapter':    '第0章 · 時刻',
      'why.h2':         '23:23 は、<em>過去の自分</em><br/>と<em>未来の自分</em>の境界。',
      'why.jp':         '23:23は、昨日の自分と、王になる自分の境界。',

      // Bell
      'bell.chapter':   '第I章 · 儀式',
      'bell.h2':        '二つの鐘。<br/>一つの週。',

      // Money intro
      'money.chapter':  '第II章 · 経済',
      'money.h2':       '一律 ¥100。<br/>あとは、世界が決める。',

      // Money summary
      'money2.chapter': '第II-B章 · 資金',
      'money2.h2':      'Coinはお金にならない。<br/>Coinは <em>声</em> になる。<br/>声がKingを生む。',

      // Doctrine
      'doctrine.chapter': '第III章 · 法',
      'doctrine.h2':      '法。',

      // Three
      'three.chapter':  '第IV章 · 申請者',
      'three.h2':       '世界に三人だけが<br/>選ばれる。',

      // Tier
      'tier.chapter':   '第IV-B章 · 結果',
      'tier.h2':        '三人が現れ、<br/>三人とも称えられる。',

      // Duty
      'duty.chapter':   '第IV-C章 · 魂',
      'duty.h2':        '王は、<em>次の王</em><br/>を作る。',

      // Stories
      'stories.chapter': '第V章 · 玉座',
      'stories.h2':      '玉座には<br/>名があった。',

      // Edge rules
      'rules.chapter':   '第VI章 · 境界',
      'rules.h2':        '誰もが問う、<br/>その問い。',

      // Never
      'never.label':     '— 絶対禁止 —',
      'never.note':      'KINGMAKER 23:23 は贈与の儀式。これらは含まない。',

      // Manifesto
      'manifesto.chapter': '第VII章 · 宣言',
      'manifesto.h2':      '誰もが王に<br/>なれるわけじゃない。<br/>でも、誰かを王に<br/>することはできる。',

      // Final
      'final.eyebrow':  '最後の問い',
      'final.h2':       '今週を <em>歴史</em> に<br/>するのは、<br/>あなた?',
      'final.until':    '— 金曜 23:23 まで —',
      'final.cta1':     '応募する',
      'final.cta2':     'アプリを開く',

      // Footer columns
      'foot.tag':       '誰もが王になれるわけじゃない。<br/>でも、誰かを王にすることはできる。',
      'foot.col1':      '儀式',
      'foot.col2':      '資金',
      'foot.col3':      '参加',
    },

    en: {
      // (default = innerHTML in HTML, no override needed)
      'nav.bell':       '23:23',
      'nav.bell2':      'Bell',
      'nav.money':      'Money',
      'nav.three':      'The Three',
      'nav.duty':       'Royal Duty',
      'nav.doctrine':   'Doctrine',
      'nav.stories':    'Stories',
      'nav.begin':      'Begin',
    },

    ko: {
      'nav.bell':       '23:23',
      'nav.bell2':      '벨',
      'nav.money':      '자금',
      'nav.three':      '세 사람',
      'nav.duty':       '의무',
      'nav.doctrine':   '교리',
      'nav.stories':    '이야기',
      'nav.begin':      '시작',

      'hero.eyebrow':   '글로벌 의식 지원 플랫폼 · v1.0',
      'hero.h1':        '모두가 왕이<br/>될 수는 없다.<br/>하지만 누구나<br/>왕을 만들 수 있다.',
      'hero.tag':       '선택받기 위해서는, 선택하는 쪽이 되어야 한다.',
      'hero.tag2':      'Not everyone can be king. But everyone can make one.',
      'hero.cta1':      '100 Coin 받기 · ¥100',
      'hero.cta2':      '왜 23:23 ?',
      'hero.bellopens': '— 벨이 열리기까지 —',
      'hero.days':      '일',
      'hero.hrs':       '시',
      'hero.min':       '분',
      'hero.sec':       '초',

      'why.chapter':    '제0장 · 시각',
      'why.h2':         '23:23은, <em>어제의 나</em><br/>와 <em>왕이 될 나</em>의 경계.',
      'why.jp':         '23:23은, 어제의 나와 왕이 될 나의 경계.',

      'bell.chapter':   '제I장 · 의식',
      'bell.h2':        '두 개의 벨.<br/>한 주.',

      'money.chapter':  '제II장 · 경제',
      'money.h2':       '일률 ¥100.<br/>나머지는 세계가 결정한다.',

      'money2.chapter': '제II-B장 · 자금',
      'money2.h2':      'Coin은 돈이 되지 않는다.<br/>Coin은 <em>목소리</em>가 된다.<br/>목소리가 King을 만든다.',

      'doctrine.chapter': '제III장 · 법',
      'doctrine.h2':      '법.',

      'three.chapter':  '제IV장 · 신청자',
      'three.h2':       '세계에서 단 세 명이<br/>선택된다.',

      'tier.chapter':   '제IV-B장 · 결과',
      'tier.h2':        '세 사람이 나타나,<br/>세 사람 모두 칭송받는다.',

      'duty.chapter':   '제IV-C장 · 영혼',
      'duty.h2':        '왕은, <em>다음 왕</em><br/>을 만든다.',

      'stories.chapter': '제V장 · 옥좌',
      'stories.h2':      '옥좌에는<br/>이름이 있었다.',

      'rules.chapter':   '제VI장 · 경계',
      'rules.h2':        '모두가 묻는<br/>그 질문.',

      'never.label':     '— 절대 금지 —',
      'never.note':      'KINGMAKER 23:23은 증여의 의식. 이것들을 포함하지 않는다.',

      'manifesto.chapter': '제VII장 · 선언',
      'manifesto.h2':      '모두가 왕이<br/>될 수는 없다.<br/>하지만 누구나<br/>왕을 만들 수 있다.',

      'final.eyebrow':  '마지막 질문',
      'final.h2':       '이번 주를 <em>역사</em>로<br/>만드는 건<br/>당신?',
      'final.until':    '— 금요일 23:23까지 —',
      'final.cta1':     '신청하기',
      'final.cta2':     '앱 열기',

      'foot.tag':       '모두가 왕이 될 수는 없다.<br/>하지만 누구나 왕을 만들 수 있다.',
      'foot.col1':      '의식',
      'foot.col2':      '자금',
      'foot.col3':      '참가',
    },

    hi: {
      'nav.bell':       '23:23',
      'nav.bell2':      'घंटी',
      'nav.money':      'धन',
      'nav.three':      'तीनों',
      'nav.duty':       'कर्तव्य',
      'nav.doctrine':   'सिद्धांत',
      'nav.stories':    'कहानियाँ',
      'nav.begin':      'शुरू',

      'hero.eyebrow':   'वैश्विक अनुष्ठान मंच · v1.0',
      'hero.h1':        'हर कोई<br/>राजा नहीं<br/>बन सकता।<br/>पर हर कोई<br/>एक राजा<br/>बना सकता है।',
      'hero.tag':       'चुने जाने के लिए, चुनने वाले बनो।',
      'hero.tag2':      'Not everyone can be king. But everyone can make one.',
      'hero.cta1':      '100 Coin लें · ¥100',
      'hero.cta2':      'क्यों 23:23 ?',
      'hero.bellopens': '— घंटी खुलने तक —',
      'hero.days':      'दिन',
      'hero.hrs':       'घंटे',
      'hero.min':       'मिनट',
      'hero.sec':       'सेकंड',

      'why.chapter':    'अध्याय 0 · समय',
      'why.h2':         '23:23 है, <em>कल का तुम</em><br/>और <em>राजा बनने वाले तुम</em> की सीमा।',
      'why.jp':         '23:23 कल और भविष्य के बीच की रेखा है।',

      'bell.chapter':   'अध्याय I · अनुष्ठान',
      'bell.h2':        'दो घंटियाँ।<br/>एक हफ़्ता।',

      'money.chapter':  'अध्याय II · अर्थ',
      'money.h2':       'सब के लिए ¥100।<br/>बाकी, दुनिया तय करेगी।',

      'money2.chapter': 'अध्याय II-B · निधि',
      'money2.h2':      'Coin नकद नहीं बनता।<br/>Coin <em>आवाज़</em> बनता है।<br/>आवाज़ें King बनाती हैं।',

      'doctrine.chapter': 'अध्याय III · नियम',
      'doctrine.h2':      'नियम।',

      'three.chapter':  'अध्याय IV · आवेदक',
      'three.h2':       'सिर्फ़ तीन नाम<br/>दुनिया पार करते हैं।',

      'tier.chapter':   'अध्याय IV-B · परिणाम',
      'tier.h2':        'तीन प्रकट होते हैं,<br/>तीनों सम्मानित होते हैं।',

      'duty.chapter':   'अध्याय IV-C · आत्मा',
      'duty.h2':        'राजा, <em>अगला राजा</em><br/>बनाता है।',

      'stories.chapter': 'अध्याय V · सिंहासन',
      'stories.h2':      'सिंहासन के<br/>नाम रहे हैं।',

      'rules.chapter':   'अध्याय VI · सीमा',
      'rules.h2':        'जो सवाल<br/>सब पूछते हैं।',

      'never.label':     '— पूर्णतः निषिद्ध —',
      'never.note':      'KINGMAKER 23:23 दान का अनुष्ठान है। ये कुछ भी नहीं है।',

      'manifesto.chapter': 'अध्याय VII · घोषणा',
      'manifesto.h2':      'हर कोई<br/>राजा नहीं बन सकता।<br/>पर हर कोई<br/>एक राजा बना सकता है।',

      'final.eyebrow':  'अंतिम सवाल',
      'final.h2':       'इस हफ़्ते को <em>इतिहास</em><br/>बनाने वाला<br/>क्या तुम हो ?',
      'final.until':    '— शुक्रवार 23:23 तक —',
      'final.cta1':     'मिशन के लिए आवेदन',
      'final.cta2':     'ऐप खोलें',

      'foot.tag':       'हर कोई राजा नहीं बन सकता।<br/>पर हर कोई एक राजा बना सकता है।',
      'foot.col1':      'अनुष्ठान',
      'foot.col2':      'धन',
      'foot.col3':      'भाग लें',
    }
  };

  // Apply language: replace innerHTML for elements with [data-i18n="key"]
  function applyLang(lang) {
    const dict = I18N[lang] || I18N.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      } else if (lang === 'en' && el.dataset.i18nEn) {
        // English fallback from data-i18n-en if provided
        el.innerHTML = el.dataset.i18nEn;
      }
      // else: keep current text (already in English from HTML)
    });

    document.documentElement.lang = lang;

    // Update active button highlight
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    // Persist
    try { localStorage.setItem('km.lang', lang); } catch(e) {}
  }

  // Detect initial language: localStorage > browser > en
  function initLang() {
    let saved = null;
    try { saved = localStorage.getItem('km.lang'); } catch(e) {}
    if (saved && I18N[saved]) return saved;
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('ko')) return 'ko';
    if (nav.startsWith('hi')) return 'hi';
    return 'en';
  }

  // Wire up language buttons
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
    applyLang(initLang());
  });
})();
