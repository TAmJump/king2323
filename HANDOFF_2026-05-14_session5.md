# KINGMAKER 23:23 — 引き継ぎ書(セッション⑤ 完了時点)

最終更新: **2026-05-14 16:00 JST**
作成者: 前セッション Claude(Opus 4.7)
次セッション開始想定: 2026-05-14 夕方〜夜、または 2026-05-15 朝

---

## ⏰ ローンチまでの時間

- **目標ローンチ:** 2026年5月15日(金)23:23 JST
- **現在時刻:** 2026-05-14 16:00 JST
- **残り:** 約 **31 時間 23 分**

---

## 0. 最重要 ── PAT(GitHub Personal Access Token)

新セッションで GitHub に push する際に必須:

```
ghp_SNxD****REDACTED_SEE_CHAT_LOG****oJln
```

⚠️ **PAT の生値はこのファイルに含めていません**(GitHub の Push Protection ルールが検知してブロックするため、リポジトリに平文で残せない)。

**生値の取得方法:**

新セッション開始時、大下さんに以下のいずれかでフル PAT を渡してもらう:
- 前 chat の冒頭メッセージ(セッション⑤の初期、大下さんが「ghp_SNxD…」と直接貼り付けた)を引用
- Bitwarden 等のパスワードマネージャから取り出し
- GitHub から regenerate(ただし他サイトのスクリプトが死ぬので最終手段)

伏字 `ghp_SNxD****oJln`(前 8 文字 + 後 4 文字)が一致すれば正しい値。

**詳細:**
- 名前: `Claude`
- スコープ: `repo, workflow`
- 有効期限: **2026-05-20(Wed)** — ローンチから 5 日後まで有効
- 大下さんが個人所有する全 GitHub リポジトリへの書き込み可能(他サイトとも連携してるので慎重に扱う)

**使い方(俺の bash_tool 内で):**

```bash
export GH_TOKEN='ghp_SNxD****REDACTED_SEE_CHAT_LOG****oJln'
git clone "https://x-access-token:${GH_TOKEN}@github.com/TAmJump/king2323.git" repo
cd repo
# 編集
git add -A
git commit -m "..."
git push origin main
```

⚠️ **セキュリティ:** ローンチ作業が全て終わったら、このチャットは削除推奨。または GitHub で revoke(ただし他サイトのスクリプトに影響あるので無闇に revoke しない)。

---

## 1. 関係する GitHub リポジトリ

| リポジトリ | URL | 内容 | 最新コミット(本セッション終了時) |
|---|---|---|---|
| **TAmJump/king2323** | https://github.com/TAmJump/king2323 | KINGMAKER 23:23 メインサイト | `a9e69b6` v20260514t |
| **TAmJump/TAmj** | https://github.com/TAmJump/TAmj | tamjump.com コーポレートサイト | `657351d`(Founding Bell 補足追記) |

**他に大下さん所有のリポジトリ複数あり**(さかえケアサービス scsgo.co.jp 含む)。
**PAT は全リポに書き込み権限ある**ので、勝手にいじらない。king2323 と TAmj のみ操作対象。

---

## 2. デプロイ先・URL

### 公開サイト
| サイト | URL | リポ | ホスティング |
|---|---|---|---|
| メイン | https://king2323.tamjump.com | TAmJump/king2323 | GitHub Pages |
| コーポレート | https://tamjump.com | TAmJump/TAmj | GitHub Pages |

### Cloudflare Worker(共用バックエンド)
| 項目 | 値 |
|---|---|
| Worker 名 | `tamjump-contact-api` |
| URL | `https://tamjump-contact-api.animalb001.workers.dev` |
| 用途 | POST `/contact`(tamjump/scsgo)+ POST **`/entry`** (kingmaker) |
| ソース | `king2323/worker/index.js`(本セッションで追加) |
| Deploy 状態 | **デプロイ済み**(大下さんが本セッション中に Cloudflare ダッシュボードで反映) |
| 環境変数 | `ADMIN_EMAIL`, `FROM_EMAIL`, `AWS_*`, `ADMIN_TOKEN` ← 既存運用のものを流用、追加不要 |
| D1 DB | binding 名 `DB`、テーブル `contacts`、project='kingmaker' で識別 |

⚠️ **疎通テスト未実施** — 大下さんが entry.html フォームで何か送って動くか確認するタスクが残ってる(下記 Step 2.5)。

---

## 3. このセッションで完了した作業 全リスト(時系列)

### 3.1 push 一覧(king2323 リポ)

| version | commit | 内容 |
|---|---|---|
| v20260514e | `c7e5981` | デスクトップ生成 zip を反映(launch-ready 初版、10 HTML + 11 art + 動画/音声 一式)|
| v20260514f | `5e8edd2` | bilingual 切替バグ修正(`data-display-lang` CSS ルール追加で legal/entry ページの JA/EN 切替が機能するように)|
| v20260514g | `b0f6826` | privacy.html の `<ul>` を JA/EN ペア化 + LAUNCH_RUNBOOK の WAF 式バグ修正(`http.host eq ...` 必須化)|
| v20260514h | `05e339d` | 各 legal/entry ページ末尾に統一フッター挿入(legal ページ間の遷移をフッターから可能に)+ commerce.html の h1 を bilingual 化 |
| v20260514i | `cb8d43d` | **重要:** terms.html / privacy.html / commerce.html を king2323 から削除、tamjump.com 側の同等ページにリンク統合。事業者単位で legal を 1 セットに |
| (RUNBOOK) | `2315061` | LAUNCH_RUNBOOK の Step 1(fill_commerce.py)を DEPRECATED マーク |
| v20260514j | `5769a78` | entry.html を **Formspree → Cloudflare Workers (`/entry`)** に切り替え。JavaScript fetch ベースに完全書き換え、成功画面+エラー画面の UI 追加 |
| (worker) | `1a14aa5` | `worker/` ディレクトリ追加:Worker のソース `index.js` + デプロイ手順 `README.md` |
| v20260514k | `ea627b0` | **ショートムービー機能**: ユーザー添付の `KingMaker2323.mp4` (193MB → 12MB圧縮)を全画面モーダルで再生。ゴリラフレームクリックで起動、anthem.mp3 は自動 mute |
| v20260514l | `7a56f0f` | art/ 11 枚を episodeDM の新ビジュアルに差し替え(同テーマ、見た目刷新) |
| v20260514m | `10c2b50` | **ヒーロー再設計**: ゴリラ動画を画面いっぱい中央配置 (Stage 1) + テキスト/CTA は下スクロール (Stage 2) |
| v20260514n | `5581ca4` | ヒーロー CSS specificity 修正(inline `.hero` が grid のままで配置壊れてた) |
| v20260514n2 | `b90f778` | `<header class="hero hero-v2">` → `<header class="hero-v2">`、inline CSS から完全切断 |
| v20260514o | `3f7497a` | ゴリラを **動画ループ → 静止画**(`logo-v3-1024.png`)に変更。サイズ縮小(55vmin / 540px / max-height 65vh)で切れ防止 |
| v20260514p | `cb30d51` | **ライトボックス追加**:myth 4 + legend 7 = 11 ポスターがクリック拡大可能に。←→ で連続閲覧 |
| v20260514q | `c061c6c` | ポスターを **白背景 6 / 黒背景 5** の交互配置に差し替え(episodeDM の `_light` バリアント活用) |
| v20260514r | `0e22074` | ゴリラの ▶ ボタンを「ホバー時のみ表示」→「**常時表示**」に変更 |
| v20260514s | `6608106` | 「絶対に禁止(Absolutely Forbidden)」セクションのフォントを大きく(11px→13px / 12px→15-16px)。日本語自動翻訳でも読みやすく |
| v20260514t | `a9e69b6` | **▶ ボタンが表示されないバグ修正**: 擬似要素 `::before`/`::after` が inline の gorilla-frame リング定義と衝突してたので、real DOM 要素(`<div class="gorilla-play-button">`)に変更 |

### 3.2 push 一覧(TAmj corp リポ)

| commit | 内容 |
|---|---|
| `657351d` | tamjump.com/commerce.html に「Founding Bell(king2323)に関する補足」セクション追加(商品名・価格 ¥100・性質・提供開始・地域・関連ページ) |

### 3.3 設計判断のポイント

**legal 集約:**
- 当初 king2323 内に terms/privacy/commerce/rules/risk の 5 ページがあったが、大下さんから「事業者(タムジ株式会社)は 1 つだから legal もコーポレート側に統合しろ」との指示
- 結果:king2323 には **rules / risk / entry の 3 ページのみ** 残す(KingMaker 固有の内容)
- terms / privacy / commerce / cookie / disclaimer / security は **tamjump.com に集約**
- king2323 の legal-footer / index.html footer / chirashi nav / entry.html の同意リンク全て tamjump.com の絶対 URL に書き換え済

**フォーム送信先(Worker 統一):**
- 当初 Formspree を予定していたが、大下さんから「他サイトと同じにしろ」との指示
- tamjump.com の contact.html は `tamjump-contact-api` Worker(AWS SES経由)を使っていたので、これを拡張
- `/entry` エンドポイント新設、`PROJECT_CONFIG.kingmaker` 追加、既存 `/contact`(tamjump/scsgo)には一切影響なし

**ヒーロー再設計:**
- 当初は左にテキスト/右にゴリラ動画の 2 カラム
- 大下さんから「ゴリラを画面いっぱいに、文章は下スクロールで」との指示
- 2 ステージ構造:Stage 1 = 100vh ゴリラ静止画(クリックで MV)、Stage 2 = テキスト/CTA/カウントダウン

**ポスター刷新:**
- 当初 art/ にあった 11 枚は v20260514e 同梱の暗いトーン
- 大下さんから episodeDM zip(エピソード DM 用 11 枚 + light バリアント)を支給
- 「同じ内容のはダメ」「白背景も半々で」との指示
- 結果:同テーマだが完全新ビジュアル、白 6 / 黒 5 で交互配置

**短編 MV(KingMaker2323.mp4):**
- 大下さん支給 193MB / 1080p / 2:43 / 音声付き
- 圧縮:mp4 720p 12MB / webm 540p 11MB / poster.webp 5KB
- ゴリラクリックでフルスクリーンモーダル再生、ESC/× で閉じる
- anthem.mp3(別の BGM)は MV 再生中だけ自動 mute、閉じたら再開

---

## 4. **残タスク(launch ブロッカー)** ── 次セッション最優先

### Step 2.5 · Worker 疎通テスト ⏱ 5分
**担当:** 大下さん(ブラウザ操作)

1. https://king2323.tamjump.com/entry.html を開く
2. Ctrl+Shift+R でハードリフレッシュ
3. テストデータを入力:
   - Email: 受信できる本物のメアド(Gmail 等)
   - Receipt ID: `SANITY-TEST-001`
   - Mission name: `Pre-launch sanity test`
   - Country: `Japan`
   - Summary: `これは launch 前の疎通テストです`
   - 同意チェック ✓
4. Submit ボタン
5. 期待動作:
   - フォームが消えて「Mission Entry Received」表示
   - 受付番号 `KM-20260514-NNNN` 表示
   - `info@tamjump.com` に運営宛通知メール届く
   - 入力メアドに自動返信メール届く
6. NG の場合は次セッション Claude に「entry のテストでエラーが出た」とエラー文を伝える

### Step 3 · Cloudflare WAF 設定(JP-only ブロック)⏱ 20分 ← **法的に最重要**
**担当:** 大下さん

これが無いと **海外からの参加が法的問題に**(日本のみで運営、各国法務未対応)。

1. https://dash.cloudflare.com/ にログイン
2. **`tamjump.com`** をクリック
3. 左メニュー **Security** → **WAF** → **Custom rules** タブ
4. **Create rule** ボタン

| 項目 | 値 |
|---|---|
| Rule name | `Geo restriction — JP only (king2323)` |

**Expression(「Edit expression」モードでコピペ):**
```
(http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP")
```

⚠️ **`http.host eq "king2323.tamjump.com"` を必ず含める。** 抜くと tamjump.com 親ドメイン全体が JP-only になり、コーポレートサイトや他サブドメインを巻き込んで殺します。

| 項目 | 値 |
|---|---|
| Action | `Block` |
| Choose Block response | (展開) |
| With response type | `Custom HTML` |
| Response code | `451` |
| Response body | ↓ コピペ |

```html
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>451 — Unavailable</title>
<style>
body { font-family: Georgia, serif; background:#0f0e0c; color:#d4c8a8;
       display:flex; align-items:center; justify-content:center;
       min-height:100vh; margin:0; padding:32px; line-height:1.6; }
.box { max-width:560px; text-align:center; }
h1 { font-size:48px; margin-bottom:8px; color:#d4af37; letter-spacing:0.02em; }
.sub { font-family:monospace; font-size:11px; letter-spacing:0.3em;
       color:#988868; margin-bottom:36px; text-transform:uppercase; }
p { font-size:14px; color:#b8a888; }
em { color:#d4af37; font-style:italic; }
</style></head><body>
<div class="box">
<h1>451</h1>
<div class="sub">— Unavailable For Legal Reasons —</div>
<p>KINGMAKER 23:23 is currently only available within Japan.</p>
<p>The platform is operating in compliance with Japanese law. Operation in
other jurisdictions requires per-country legal review, which has not yet
been completed.</p>
<p><em>We are not accepting registrations or payments from this region.</em></p>
</div></body></html>
```

5. **Deploy** ボタン
6. ルール一覧でトグルが ON 確認

**動作確認(後でOK):**
- 国内IP → 普通に開ける
- VPN米国経由 / https://www.proxysite.com/ → 451 ページ表示

### Step 4 · Square 商品作成 ⏱ 25分
**担当:** 大下さん

1. Square Dashboard にログイン
2. アイテム作成:
   - 商品名: `KINGMAKER 23:23 — Founding Bell Entry`
   - 価格: ¥100
   - 商品説明:
     ```
     Bell Entry は参加記録です。通貨・暗号資産・前払式支払手段・有価証券・
     投資商品ではなく、換金・譲渡・売買はできません。Grant 支給は本人確認・
     Mission 確認・AML 審査・法令適合性審査・Grant Fund 残高確認を経た場合
     に限り、運営者の判断により行われます。自動支給はしません。
     ```
3. **Checkout Link** 作成(または「リンクから決済」)
4. **Post-purchase URL** を `https://king2323.tamjump.com/entry.html` に設定
   → 決済完了後にエントリーフォームへ自動誘導
5. リンク URL を取得して、index.html / money.html の CTA ボタンに反映

⚠️ CTA ボタン側の URL 書き換えは Claude 側でやるので、Square リンク取れたら次セッションで Claude に渡す。

### Step 5 · ¥100 テスト購入 ⏱ 10分
**担当:** 大下さん

1. 自分のクレカで実際に ¥100 払って導線確認
   - index.html の CTA ボタン → Square 決済画面 → 完了 → entry.html リダイレクト
   - entry.html でフォーム送信 → 受付番号表示 → メール 2 通(運営+自動返信)
2. 全部 OK なら、Square Dashboard で **取引を Refund** して ¥100 戻す(あるいは自分用テスト記録として残す)

### Step 6 · 全ページ目視確認 ⏱ 30分
**担当:** 大下さん

- https://king2323.tamjump.com/(index)
- https://king2323.tamjump.com/money.html
- https://king2323.tamjump.com/verify.html
- https://king2323.tamjump.com/app.html
- https://king2323.tamjump.com/rules.html
- https://king2323.tamjump.com/risk.html
- https://king2323.tamjump.com/entry.html
- https://tamjump.com/commerce.html(Founding Bell 補足が表示されてるか)

各ページで:
- 日本語/英語ピッカー切替が機能
- リンクがすべて生きてる(404 無し)
- 画像が全部表示
- レイアウト崩れ無し
- モバイル表示も確認

---

## 5. 現在のサイト構造(2026-05-14 16:00 時点)

### king2323.tamjump.com(KINGMAKER メイン)

**HTML(7 ページ):**
- `index.html` — トップ。ヒーロー(全画面ゴリラ静止画+▶)、My Section、Legend Section、Manifesto、CTA、ライトボックス、ショートムービーモーダル
- `money.html` — Coin 解説
- `verify.html` — Bell Entry 検証ページ
- `app.html` — アプリページ
- `rules.html` — Founding Bell Rules(KingMaker 固有)
- `risk.html` — Important Notices(KingMaker 固有)
- `entry.html` — Mission Entry 申込フォーム(Workers API)

**削除済み(tamjump.com に統合):**
- ~~terms.html~~ → https://tamjump.com/terms.html
- ~~privacy.html~~ → https://tamjump.com/privacy.html
- ~~commerce.html~~ → https://tamjump.com/commerce.html

**JS:**
- `js/main.js` — メインロジック
- `js/i18n.js` — 多言語切替(171 keys × 10 langs)
- `js/fx.js` + `fx.json` — USD 為替表示

**CSS:**
- `css/main.css` — 全スタイル(約 1700 行、本セッションで多数追加)

**メディア:**
- `art/` — myth 4 + legend 7 = 11 ポスター(白 6 + 黒 5、各 WebP 30-86KB)
- `audio/anthem.mp3` — BGM
- `video/hero.mp4` / `hero.webm` / `hero_poster.webp` — (旧)ループ動画(現在は静止画使用なので非アクティブ、ファイルは保持)
- `video/kingmaker_short.mp4` / `kingmaker_short.webm` / `kingmaker_short_poster.webp` — 2:43 ショートムービー
- `assets/logo-v3-1024.png` — ヒーロー静止画ゴリラ

**その他:**
- `api/cycle.json` — Cycle 0 baseline data
- `scripts/fill_commerce.py` — DEPRECATED(commerce.html削除済のため使わない)
- `.github/workflows/fx-update.yml` — fx 自動更新 cron
- `worker/index.js` — Cloudflare Worker のソース(version control 用、デプロイは別)
- `worker/README.md` — Worker デプロイ手順
- `CHANGES.md` / `DEPLOY_geoblock.md` / `LAUNCH_RUNBOOK.md`

### tamjump.com(コーポレート)

KingMaker 関連の変更:
- `commerce.html` の表の下に「Founding Bell(king2323.tamjump.com)に関する補足」セクション追加

---

## 6. CTA ボタンの Square URL 差し込み(Step 4 完了後の作業)

Square Checkout Link が取れたら、次セッション Claude が以下を実行:

```bash
# index.html / money.html の CTA ボタン(data-cta="founding")の href / onclick を
# Square リンクに置換
```

該当箇所:
```html
<button type="button" class="btn btn-primary km-cta" data-ritual-open="coin" data-cta="founding">
```
↑ これは現状「coin リチュアルモーダルを開く」ボタン。**ローンチ時はこれを Square 決済リンクへの遷移に変更する必要あり**。

`data-ritual-open="coin"` を削除して `onclick="location.href='https://square.link/...'"`(または `<a href>`に変える)。次セッションで対応。

---

## 7. 環境メモ(Claude 側で再現する場合)

### bash_tool での GitHub 操作テンプレ

```bash
# 初期セットアップ(最初の1回)
export GH_TOKEN='ghp_SNxD****REDACTED_SEE_CHAT_LOG****oJln'
git config --global user.email "info@tamjump.com"
git config --global user.name "TAmJ"
git config --global init.defaultBranch main

# king2323 clone
cd /home/claude
git clone "https://x-access-token:${GH_TOKEN}@github.com/TAmJump/king2323.git" repo
cd repo

# 編集後のコミット & push
git add -A
git commit -m "vYYYYMMDDx: summary"
git push origin main
```

### tamjump.com corp リポも触る場合
```bash
git clone "https://x-access-token:${GH_TOKEN}@github.com/TAmJump/TAmj.git" corp
```

### Worker のソース更新時のフロー
1. `/home/claude/repo/worker/index.js` を編集
2. king2323 リポに push
3. **大下さんが Cloudflare ダッシュボードに手動コピペ → Deploy**
   - `https://dash.cloudflare.com/` → Workers & Pages → `tamjump-contact-api` → Edit code
   - エディタ全削除(Ctrl+A → Del)
   - 新コードを raw URL からコピペ:`https://raw.githubusercontent.com/TAmJump/king2323/main/worker/index.js`
   - Deploy

⚠️ Claude は Worker を直接 Deploy できない(wrangler CLI 入ってない、Cloudflare API 接続不可)。**必ず大下さんに手動デプロイしてもらう必要あり**。

### bash_tool の制限
- 外部 URL への curl は **`Host not in allowlist`** で失敗する(npmjs / pypi / github.com 等しか allow されてない)
- 疎通テストは **必ず大下さんがブラウザで実施**

---

## 8. ブランドガイド・トーンの引き継ぎ

**カラー:**
- `--gold: #B8862D`(deeper gold for white-bg readability)
- `--ash: #5C5240`
- `--dust: #8C8270`
- `--line: #C9BC9A`(warm beige line)
- `--paper`(背景白)
- `--crimson`(禁止セクション用の深紅)

**フォント:**
- `--f-display: 'Cinzel', 'Noto Serif JP', serif`
- `--f-mono: 'JetBrains Mono', 'Courier New', monospace`
- `--f-jp` / `--f-editorial` 等

**Brand Lock の概念:**
- ブランド固有名(KINGMAKER, Bell, 23:23 等)は **言語切替で訳さない** ことが原則
- `class="notranslate" translate="no"` または `class="brand-lock"` でマーク
- 「金額表示」も brand lock(¥100 → 機械翻訳で別通貨に化けないように)

**Bell Entry の法的言い回し(変えるな):**
- 「Bell Entry は参加記録です。通貨・暗号資産・前払式支払手段・有価証券・投資商品ではなく、換金・譲渡・売買はできません」
- これがあちこちに散らばってる(rules.html / risk.html / entry.html / Worker のメール文面 / commerce.html / index.html の Forbidden セクション 等)

**i18n:**
- メイン 4 ページ(index/money/verify/app)は **辞書ベース完全翻訳**(171 keys × 10 langs)
- legal/entry ページは **CSS の `data-display-lang` ベース**で JA/EN のみ切替(他 8 言語は `<main notranslate>` でブロック)
- 言語ピッカー UI は全ページ共通

---

## 9. 既知の課題・改善余地(launch 後対応推奨)

| 項目 | 状況 | 優先度 |
|---|---|---|
| TIER 2 の 8 言語(es/hi/ko/vi/pt/id/th/fr)で legal/entry ページが英語表示のまま | Founding Bell は日本のみなので影響なし | 低 |
| `video/hero.mp4` 等の旧ファイルが残ったまま | ファイルサイズ少なめなのでホットスポットではない | 低 |
| `scripts/fill_commerce.py` が deprecated だが残ってる | 害なし、削除しても良い | 低 |
| Worker は `tamjump-contact-api.animalb001.workers.dev` というデフォルト URL のまま | カスタムドメイン `api.tamjump.com` 計画あり(別作業) | 中 |
| `entry.html` のフォーム placeholder は CSS で切替できない | JS 追加で対応可、launch 後 | 低 |
| `assets/` には未使用ロゴが多数 | 整理可能、害なし | 低 |
| Cloudflare R2 / bunny.net 等 CDN への動画オフロード | バズったら必要、現状 GitHub Pages 帯域で OK | 低 |

---

## 10. 次セッション開始時の Claude へ

**最初にやること:**

1. **必ず PAT を環境変数にセット:**
   ```bash
   export GH_TOKEN='ghp_SNxD****REDACTED_SEE_CHAT_LOG****oJln'
   ```

2. **king2323 を clone:**
   ```bash
   git clone "https://x-access-token:${GH_TOKEN}@github.com/TAmJump/king2323.git" /home/claude/repo
   ```

3. **最新コミット確認:**
   ```bash
   cd /home/claude/repo && git log --oneline -5
   ```
   `a9e69b6` v20260514t が最新であれば前セッションから変更なし。
   それより新しいコミットがあれば誰か(別の Claude セッション or 大下さん手動)が更新済み。

4. **大下さんに進捗確認:**
   - 「Worker 疎通テスト(Step 2.5)は実施しましたか?」
   - 「Cloudflare WAF(Step 3)は設定しましたか?」
   - 「Square 商品作成(Step 4)は進んでますか?」

5. **Square Checkout Link を貰えれば** → index.html / money.html の CTA ボタンを Square リンクに書き換えて push(これがローンチ最後の Claude タスク)

---

## 11. ファイル一覧(本セッション終了時 king2323 リポの状態)

```
.github/workflows/fx-update.yml
.gitignore
.nojekyll
CHANGES.md
CNAME
DEPLOY_geoblock.md
LAUNCH_RUNBOOK.md
README.md
api/cycle.json
app.html
art/legend_01_mirror.webp  ← 白(新ビジュアル)
art/legend_02_phone.webp   ← 黒(新ビジュアル)
art/legend_03_gods.webp    ← 白
art/legend_04_gun.webp     ← 黒
art/legend_05_unborn.webp  ← 白
art/legend_06_prayer.webp  ← 黒
art/legend_07_dontlook.webp ← 白
art/myth_01_edge.webp      ← 白
art/myth_02_code.webp      ← 黒
art/myth_03_enigma.webp    ← 白
art/myth_04_minutes.webp   ← 黒
assets/logo-{1024,512,256,128}.png
assets/logo-t-{1024,512,256,128}.png
assets/logo-v3-{1024,512,256,128}.png ← v3-1024.png をヒーローで使用
audio/anthem.mp3
css/main.css                ← v20260514t 含む全スタイル
entry.html                  ← Workers API 連携、JS fetch ベース
gorillaarm.png
index.html                  ← ヒーロー2段構成、ライトボックス、ショートムービーモーダル
js/fx.js
js/fx.json
js/i18n.js
js/main.js
kingmaker2323.png
money.html
risk.html                   ← legal-footer 付き
rules.html                  ← legal-footer 付き
scripts/fill_commerce.py    ← DEPRECATED
verify.html
video/hero.mp4              ← 旧ループ動画(未使用、保持)
video/hero.webm             ← 同上
video/hero_poster.webp      ← 同上
video/kingmaker_short.mp4   ← 新ショートムービー(2:43、音声付)
video/kingmaker_short.webm  ← 同上 webm 版
video/kingmaker_short_poster.webp ← ポスターフレーム
worker/index.js             ← Cloudflare Worker ソース(version control 用)
worker/README.md            ← デプロイ手順
```

---

## 12. 大下さん本人の情報(コンタクト用)

- 会社:タムジ株式会社
- 代表取締役:大下 甚
- メール:info@tamjump.com
- 所在地:〒103-0004 東京都中央区東日本橋3-3-17 Re-Know4B
- ローカル PC:Windows、OneDrive 配下作業、コードエディタ未指定

---

## 13. 終了時挨拶

ここまで頑張ってきたけど、ローンチまであと **31 時間**。
大下さんもラスト一直線で疲れてるはず。次セッションは Step 2.5 (Worker 疎通) と Step 3 (WAF) の進捗確認から始めて、進んでなければまずそこを片付けてから Square Step 4 に行ってください。

UI は何度も触られたけど、もう細部より **動くこと** 優先。CTA → Square → entry.html → DB → メール、この導線が抜けると ¥100 受け取れません。

健闘を祈る。

— Claude(セッション⑤、2026-05-14 16:00 JST)
