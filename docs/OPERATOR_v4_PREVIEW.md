# OPERATOR · session ⑪ — Quiz Preview & Translation Cleanup

**作成:** 2026-05-23 (土) session ⑪ 後半
**目的:** session ⑩ で push 済み(コミット `861c2b1`)の quiz preview 機能と、session ⑪ で英語マスター化した翻訳を、本番に反映させる手順。

---

## ✅ session ⑩ で push 済み(まだ live 反映されていない作業)

| # | 何 | 状態 |
|---|---|---|
| 1 | `worker/migrations/0005_quiz_english_first.sql`(30 問を英語マスターに書き直し) | **D1 で未実行** |
| 2 | `worker/index.js` に `/quiz/pool` ルート追加 | **Worker 未再デプロイ** |
| 3 | `preview.html` 新規作成 | git push 済み → Pages 反映済み |

## ✅ session ⑪ で push する作業(本コミット)

| # | 何 |
|---|---|
| 4 | `play.html` 英語マスター化(全 8 ステート + 全 JS 動的テキスト) |
| 5 | `kings.html` 英語マスター化(Hall + Mission Fund バナー + JS 動的テキスト) |
| 6 | `preview.html` に lang picker と i18n.js 追加 |

---

## 🚀 operator が今すぐやるべき 3 ステップ

### Step 1. D1 で migration 0005a + 0005b を実行(クイズ問題を英語マスターに書き換え)

**重要:** D1 Console は 1 度に 1 文しか実行できないので、0005 は **0005a (DELETE)** と **0005b (INSERT)** に分割した。**両方順番に実行**しないとテーブルが空のままになる。

1. https://dash.cloudflare.com/?to=/:account/workers/d1 を開く
2. `tamjump_contact_db` (UUID: `ba5cf621-d8c7-49db-90cd-e1fe8ece8437`) を開く
3. Console タブを開く
4. **別タブで** このURLを開く:
   `https://raw.githubusercontent.com/TAmJump/king2323/main/worker/migrations/0005a_quiz_delete.sql`
5. 中身を**全選択コピー**して D1 Console に貼る
6. **Execute** をクリック(古い 60 行が削除される)
7. **次に別タブで** このURLを開く:
   `https://raw.githubusercontent.com/TAmJump/king2323/main/worker/migrations/0005b_quiz_insert.sql`
8. 中身を**全選択コピー**して D1 Console に貼る
9. **Execute** をクリック(英語マスター 60 行が挿入される)
10. 確認: `SELECT COUNT(*) FROM quiz_questions;` で **60** が返れば成功
11. 確認: `SELECT question FROM quiz_questions WHERE group_id = 1 AND language = 'en';` で
    `What time does the KINGMAKER Bell ring?` が返れば成功

**もし `SELECT COUNT(*)` が 0 だった場合(session ⑪ で見つけた問題)**:
- これは Step 1 の DELETE は走ったが INSERT が失敗した状態
- Step 7-9 を再度実行して INSERT を完了させる

**もし `SELECT COUNT(*)` が 60 と返るが質問内容が違う場合**:
- 古い 0003f の seed のまま、Step 1-9 を順に実行する

### Step 2. Worker を再デプロイ(`/quiz/pool` ルートを live に)

1. https://dash.cloudflare.com/?to=/:account/workers-and-pages を開く
2. `tamjump-contact-api` を開く
3. **Edit code** → **Deploy** をクリック
4. 確認: `curl https://tamjump-contact-api.animalb001.workers.dev/quiz/pool` で
   `{"ok":true,"count":60,"questions":[...]}` が返れば成功

### Step 3. preview.html を開いてクイズを目視確認

1. https://king2323.tamjump.com/preview.html を開く
2. 上部の **Pool stats** に `60 total · 10 easy · 10 medium · 10 hard` 等が出ているか確認
3. ▸ New Quiz ボタンを何度か押して、問題が変わるか確認
4. **Language: 日本語** に切り替えて、問題が ja で表示されるか確認
5. **Difficulty mix: 3 hard** にして、ハード問題が出るか確認
6. 答えてみて、フィードバックが出るか、explanation が表示されるか確認

---

## 🌐 翻訳整理の結果(session ⑪)

### 完了

- **play.html**: ヘッダ、ヒーロー、Phase 1/2/3、結果画面、dormant、gate、フッター全部
  - 英語が source of truth、日本語は `.lang-ja` クラスで並列
  - 言語切替で全体一括変更
  - JS の動的テキスト(`updateCountdownStrip`, `showQuizResult`, 投票ボタン、エラー alert 等)も
    `currentLang()` ヘルパで言語分岐
- **kings.html**: Hall, Mission Fund バナー, regret block, footer 全部
  - JS の `kingCard`, `render`, error メッセージも言語分岐
- **preview.html**: lang picker と i18n.js を head に追加(機能拡張)

### 未着手(次セッション)

- **mypage.html** — magic link ログイン画面、参加者向け
- **entry.html** — Mission Entry フォーム(既に `data-i18n-html` キー 26 個ある、整理だけ必要)
- **verify.html** — Receipt 検証
- **how-it-works.html** — 仕組み説明(既に `data-i18n-html` 26 個ある)
- **money.html** — 既に英語マスター化されている、軽くチェックだけ
- **risk.html / rules.html** — 既に `data-i18n-html` 5 個ある、軽い整理
- **404.html** — 英語のみで OK
- **index.html** — 既にハイブリッド設計(`.jp` クラス + `data-i18n-html` 180 個)、軽い整理

---

## 📐 翻訳設計の規約(覚書)

session ⑪ で確定した規約:

1. **英語が source of truth**:HTML の本文は英語で書く。
2. **日本語は `.lang-ja` で並列**:同じ要素の中で `<span class="lang-en">...</span><span class="lang-ja">...</span>` のように並べる。
3. **ブランド語は `notranslate`**:`<span class="notranslate" translate="no">KINGMAKER</span>` で固定。Google Translate も主動的翻訳も対象外にする。
4. **ブランド語リスト**(絶対に翻訳しない):
   - KINGMAKER, KINGMAKER 23:23
   - Bell, Bells, Bell Entry, Founding Bell
   - Cycle (Cycle 1, Cycle 2, ...)
   - Phase 1, Phase 2, Phase 3
   - The Trial, The Three, The Vote, The Five
   - Mission, Mission Fund, Mission Entry
   - King, Hall of Kings, Founding Member, Founding Cohort
   - Crown, Grant
   - My Page, Receipt
   - SHA-256, KYC, AML
   - 23:23, 23:23 JST, 子の刻
   - タムジ株式会社, TAmJ
   - Claude
5. **JS 動的テキストの規約**:
   - `function isJa() { return document.documentElement.getAttribute('data-display-lang') === 'ja'; }` を全ページに置く
   - `isJa() ? '日本語' : 'English'` で分岐
   - `currentLang()` も使う(`'en'` / `'ja'` 等)
6. **i18n.js が language picker を管理**:
   - `<html data-display-lang="en">` を更新
   - CSS の `html[data-display-lang="ja"] .lang-en { display: none; }` + `html:not([data-display-lang="ja"]) .lang-ja { display: none; }` で表示を切り替え
   - 言語ピッカーで切り替えるとページがリロードする(`window.location.reload()`)

---

## 🛡️ Cycle 2 (5/29 金 23:23 JST) までに

- [ ] Step 1, 2, 3 を実行
- [ ] preview.html で 30 問プールが正常か目視確認
- [ ] play.html / kings.html を ja / en 両方の言語ピッカーで切り替えて、両方ともちゃんと表示されるか確認
- [ ] Square Production credentials を取得し、Worker の secrets に追加
- [ ] 音源 `assets/sounds/bell_2323.mp3` を operator が配置
- [ ] 23:23 当日の Cron / 手動トリガー(`/game/phase2/draw` と `/game/phase3/finalize`)を operator がスケジューリング

---

— Claude session ⑪, 2026-05-23 (土)
