# KINGMAKER 23:23 — 完全引き継ぎ書(セッション⑥ 終了時点)

**最終更新**: 2026-05-14(セッション⑥終了時刻)
**作成者**: セッション⑥ Claude (Opus 4.7)
**前任**: セッション①〜⑤(`HANDOFF_2026-05-14_session5.md` 参照)
**次セッション開始想定**: 2026-05-15 朝〜
**ローンチ目標**: 2026-05-22 (金) 23:23 JST(変更後)

---

## ⚠️ この引き継ぎ書を読む方への警告

セッション⑥前任Claudeは、最初の引き継ぎ書で **THE TRIAL(クイズ)機能 / King 選出メカニズム / Mission 報告ループ** などの**重要な未実装機能を完全に省略**してしまった。大下さん(以下「運営者」)から「ゲーム構成がごっそり抜けている」と指摘を受け、この完全版を作成した。

**読み手は次のことを理解すべき**:
1. 現在のサイト(king2323.tamjump.com)は **Cycle 1(Founding Bell)用の最小実装**である
2. サイト上には **完成版KINGMAKER の全仕様**が言語化されているが、**機能としては Mission Entry フォーム + Square 決済 + メール通知しか動いていない**
3. THE TRIAL、Standing、Crown Slot、Royal Proof、自動 King 選出 — すべて Cycle 2 以降に実装が必要
4. **法務的にはこの「未実装」は問題ない** — `rules.html` L90-92 と `risk.html` で「予定機能・段階的公開」をカバー済み

ローンチブロッカーと将来実装を**絶対に混同しないこと**。それがこの引き継ぎ書の存在理由。

---

# 第Ⅰ部 · 現状把握

## 1. リポジトリと最新状態

| 項目 | 値 |
|---|---|
| Repo | `TAmJump/king2323`(GitHub) |
| Hosting | GitHub Pages(`CNAME` = `king2323.tamjump.com`) |
| DNS | Cloudflare(`tamjump.com` ゾーン下のサブドメイン) |
| 最新コミット | `7c12e7a` v20260514ae (Schedule Option B′) |
| Worker | `tamjump-contact-api`(Cloudflare Workers、共用) |
| 決済 | Square Checkout Link: `https://square.link/u/bc9p0BET`(¥100、本物確認済み) |
| DB | Cloudflare D1(Worker内、`contacts` テーブル) |

## 2. セッション⑥で push した全 14 コミット

順に列挙する。**v20260514ab(クリティカルバグ修正)は最重要**:

| version | commit | 説明 | 重要度 |
|---|---|---|---|
| v20260514v | `8b1f02e` | #apply CTA → coin ritual モーダル経由に統一、money.html § 12 CTA 追加、verify#history リンク切れ修正 | ◯ |
| v20260514w | `beedfb2` | OGP + Twitter Card meta tags 全7ページに付与 | ◯ |
| v20260514x | `74b1ba8` | robots.txt + sitemap.xml + ブランドテーマ 404.html | ◯ |
| v20260514y | `bb57534` | mobile theme-color(#F8F4EB / #1A1612)+ preconnect | ◯ |
| v20260514z | `f995e4d` | CHANGES.md に launch-eve バッチ追記 | ◯ |
| v20260514aa | `26db9a1` | session6 handoff + WAF_SEO_BYPASS.md 作成 | ◯ |
| **v20260514ab** | **`646274d`** | **🚨 クリティカル: ハンバーガーメニュー / live counter / scroll-reveal 死亡を修正** | **★★★** |
| v20260514ac | `4086a3f` | スケジュール変更 → 5/22 23:23 ring(中間版) | ◯ |
| v20260514ad | `38406b6` | **Mission Fund モデル全面反映**(用語改定の核心) | ★★ |
| v20260514ae | `7c12e7a` | スケジュール最終版 Option B′(全23:23 + 子の刻 + 九つ) | ★★ |

### 2-1. v20260514ab が最重要である理由(絶対に把握すべき)

`js/main.js` の Line 161 にあった `.nav-menu a` の href を `document.querySelector` に渡す処理が、`https://tamjump.com/terms.html` のような絶対URL href で **SyntaxError** を投げて、IIFE全体が停止していた。

その結果、**v20260514i(legal統合)以降10日間、以下の全機能が死んでいた**:
- ハンバーガーメニュー(クリックしても開かない)
- /fund ライブカウンタの更新
- スクロール時のフェードイン演出
- ナビバーのアクティブハイライト

修正内容:
```javascript
// 修正前(バグ)
const sections = Array.from(navLinks)
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

// 修正後(安全)
const sections = Array.from(navLinks)
  .map(a => a.getAttribute('href'))
  .filter(href => href && href.length > 1 && href.charAt(0) === '#')
  .map(href => {
    try { return document.querySelector(href); }
    catch (_) { return null; }
  })
  .filter(Boolean);
```

**次セッションでJS関連の問題が報告されたら、まずこの修正が生きているか確認**(`js/main.js` を `?v=20260514ab` 以降のキャッシュバスターで配信しているか)。

## 3. 確定スケジュール(Option B′ + 子の刻 + 九つ)

```
[毎週サイクル — JST/KST (UTC+9) 固定]

水曜 23:23 JST    Bell 開門     · Mission Entry 受付開始
金曜 23:23 JST    ┌─ Bell 閉幕(受付締切と同瞬間)
                  └─ Bell rings · 5分間ウィンドウ開始
金曜 23:28 JST    Bell 閉まる   · Public Seed 確定 · The Three 導出
土曜 23:23 JST    The Three     · /verify で公開
日・月・火        休息日(3日間)

[Founding Bell (Cycle 1) 絶対日時]

2026-05-20 (水) 23:23 JST   Bell opens
2026-05-22 (金) 23:23 JST   Receipt closes · Bell rings ★ LAUNCH MOMENT
2026-05-22 (金) 23:28 JST   Bell closes · Seed finalized
2026-05-23 (土) 23:23 JST   The Three announced
```

**設計思想**:
- 全ての関門が `23:23` に揃う(ブランド美学の完成)
- `23:23` は古代日本の**子の刻(ね の こく)**ど真ん中
- 子の刻は寺鐘が**九つ(ここのつ)** 鳴らされる時刻 — 世界が止まり、新しい日が始まる
- この物語層は `rules.html` Schedule セクションと `index.html` ヒーロー説明文に織り込み済み

---

# 第Ⅱ部 · 設計書(KINGMAKER完成版の全仕様)

**これは「サイトに書いてあるが、Cycle 1 では機能していない」項目を含む完全仕様である。**

## 4. KINGMAKER 全体フロー(設計上の完成形)

```
① 参加者が ¥100 で Bell を購入(Square 決済)
    → Mission Entry フォームに記入(欲望/Missionを書く)
    → 100 Bell が刻まれる(参加資格)
    ✓ Cycle 1 で稼働中

② 毎週金曜 23:23 JST、Bell が鳴る
    → 世界中の参加者が同時に儀式へ
    ✓ Cycle 1 で象徴的に稼働(実機能なし)

③ THE TRIAL(5分間の世界同時試練)
    Round 1 — THE MIND: 算数/記憶/論理 4択 (10〜20秒/問)
    Round 2 — THE INSTINCT: 世界文化/国旗/通貨/略語 4択
    Round 3 — THE CROWN SLOT: 00〜99 のスロットを1回だけタップ
    ✗ Cycle 1 で未実装(法務カバーあり)

④ 段階的に絞られる
    各ラウンドで失格 = 今週の資格を失う(Bellは減らない、来週またできる)
    ✗ Cycle 1 で未実装

⑤ 最後に The Three(3人)が残る
    Crown Slot で同じ数字を選んだ参加者の中から、
    公開 Seed (SHA-256) で機械的に3人が決まる
    ✓ verify.html に計算ロジックは存在(現状は過去 Cycle のサンプル表示)
    △ Cycle 1 では市場データから直接 The Three を導出する簡略版

⑥ 3人が Mission(欲望)を公開
    The Three それぞれが自分の Mission の詳細を公開
    ✗ Cycle 1 で未実装

⑦ 世界が支持を表明
    「Voices create Kings」 — Coin保有者が支持を表明
    最も多くの Coin = voices を集めた者が King に
    ✗ Cycle 1 で未実装(メカニズム未定義)
    NOTE: launch時点では「曖昧表現」のまま運用(セッション⑥で確認済み)

⑧ King(=Mission Holder)確定
    KYC + AML + Mission Truth 審査
    通過後、運営が Mission Fund で Mission を制作・実行
    ⚠️ 用語注意:「King に Grant を渡す」ではなく、
       「King の Mission を Mission Fund で制作・実行する」

⑨ King は Mission を実行・報告
    Royal Proof:30日以内に証拠提出
    What was gained / lost / left behind を報告
    ✗ Cycle 1 で未実装(オフラインで運営対応)

⑩ Royal Duty(王の義務)
    King は翌週、10 Coin を無料で他者に配る
    実行しないと crown 剥奪、Mission Fund 返還
    ✗ Cycle 1 で未実装
    
⑪ Mission Report がストーリーとなり、次の Cycle の動機になる
    報告内容が verify.html や stories セクションに蓄積
    ✗ Cycle 1 で未実装
```

## 5. 用語辞書(セッション⑥ Mission Fund モデル後)

**外向き資料(韓国・映像会社)で「賞金・抽選・賭博」連想を避けるため、用語と動詞が改定された。** 詳細は v20260514ad commit message 参照。

| 用語 | 意味 | 用法ノート |
|---|---|---|
| **Bell** | 参加資格の単位。¥100 = 100 Bell | 通貨でも crypto でもない、譲渡不可 |
| **Coin** | サイクル中に King 候補を支持するための投票単位(Bell とは別) | "voice" として機能 |
| **Mission** | 参加者が登録する「やりたいこと/欲望」 | 文章で提出 |
| **Mission Holder** | King の機能的呼称 | 韓国向け資料で前面に出す |
| **King** | ブランド核。Cycle ごとに1人 | サイト上で残す |
| **The Three** | 最後の3人 | 市場データ式 or TRIAL 式で導出 |
| **Candidate** | 参加者 / 応募者 | "winner" を避ける中立語 |
| **Mission Fund** | Mission を制作・実行する公開予算(主用語) | "Fund executes the Mission" |
| **Grant Fund** | escrow 名義としては残す | 法務用語、ユーザー向けには "Mission Fund" |
| **Grant** | "is not a prize" として残す(否定形は強い盾) | 動詞として使わない |
| **Mission Tier** | Bronze / Silver / Gold / Royal | Mission Fund 配分額の段位 |
| **Royal Duty** | King が次週 10 Coin を配る義務 | 実行しないと crown 剥奪 |
| **Royal Proof** | King が Mission 実行30日以内に提出する証拠 | 未実装 |
| **Standing** | 参加者が TRIAL 突破で蓄積する記録 | 未実装 |
| **Streak / Crown Flame / Eternal / Oracle** | Standing 称号(3/10/52/100 weeks) | 未実装 |
| **Public Seed** | The Three 導出の元データ | BTC/Nikkei/S&P 終値 \| Final Pool size |

### 5-1. 動詞の置換ルール(韓国向け資料・サイトとも)

| ❌ 危ない | ✅ 安全 |
|---|---|
| Kings receive Grants | Mission Holders direct Mission Funds |
| Grant is paid | Mission Fund is allocated |
| Grant disbursement | Mission Fund allocation / Mission execution |
| 助成金を支給する | Mission Fund で Mission を制作・実行する |
| 当選者 | selected / finalist / chosen by story mechanics |
| 落選 | eliminated / not advanced |
| 賞金 | grant / production support / mission fund |
| 応募者 | participants / candidates |

### 5-2. 守るべき不変項(これは絶対に変えない)

サイト全フッターに表示している:
```
NOT A LOTTERY · NOT AN INVESTMENT · NOT A WAGER · BELL IS A RIGHT, NEVER CASH
```

これは法務の最終盾。launch 以降も絶対に削らない・変えない。

## 6. The Three の選出メカニズム(verify.html 完全仕様)

`verify.html` には「**The Three are not chosen by us. They are derived.**」と宣言してあり、計算ロジックが完全公開されている。

### 6-1. 6 ステップの選定フロー

```
[Step 1] Eligible Pool
   Bell window 中(水23:23〜金23:23)に Mission Entry を提出した全員

[Step 2] Excluded
   除外条件: KYC incomplete / Fraud flagged / Previous cycle unpaid /
            Multiple accounts / Region restricted
   
[Step 3] Final Pool
   Eligible − Excluded = 有効候補者数(例:172人)

[Step 4] Public Seed(金曜 23:23 JST 確定 = Bell が鳴った瞬間)
   "BTC_USD | Nikkei_225 | S&P_500 | Final_Pool_size"
   例: "108224|38441|5221|172"
   注: 23:23 JST に上記市場が closed である必要あり
       BTC は24/365、Nikkei は15:00 JST(closed)、S&P は米市場時間(対応必要)

[Step 5] SHA-256 Hash
   Seed を SHA-256 でハッシュ化 → 256bit hex
   
[Step 6] Derive The Three
   256bit を 3 つの 64bit スライスに分割
   各スライスを Final_Pool_size で剰余(mod)
   → 候補者 #N が3人決まる
```

### 6-2. Founding Bell(Cycle 1)では簡略運用

Cycle 1 では THE TRIAL がない。Pool は小さい想定(数十〜数百人)。
The Three の導出は **TRIAL を経由せず、直接市場データ Seed で抽出**する。

verify.html L460-575 にロジック説明、L572〜 に history-table がある。
Cycle 1 完了後、運営が verify.html に Cycle 1 の結果セクションを追記する必要あり。

### 6-3. King 確定メカニズムは現在「曖昧表現」

The Three から1人を King に絞るメカニズムは**サイト上で明示されていない**。
セッション⑥での運営者との会話で決まったこと:
- Cycle 1 では曖昧のまま運用(オフライン運営判断)
- Cycle 2 以降に具体メカニズムを設計する
- ドラマ的余白として保持(映像会社向けには有利)

将来の設計候補:
- Coin 投票(voices)による最多得票方式
- 別途 community vote
- 運営判断 + 公開審査

---

# 第Ⅲ部 · サイト機能マップ(現状動いているもの)

## 7. ページ一覧と現状

| ファイル | URL | 役割 | 状態 |
|---|---|---|---|
| `index.html` | `/` | メインランディングページ | ✓ 動作 |
| `money.html` | `/money.html` | Money Logic 完全説明 | ✓ 動作 |
| `verify.html` | `/verify.html` | 検証ロジック・公開台帳 | ✓ 動作(Cycle 1 結果は launch 後追加) |
| `app.html` | `/app.html` | "もしマイページがあったら" プロトタイプ | ✓ 動作(本機能は未実装) |
| `entry.html` | `/entry.html` | Mission Entry フォーム | ✓ 動作確認済み(KM-20260514-0001) |
| `rules.html` | `/rules.html` | Founding Bell Rules | ✓ 動作(スケジュール最新版) |
| `risk.html` | `/risk.html` | Important Notices(リスク開示) | ✓ 動作 |
| `404.html` | `/404.html` | ブランドテーマ 404 | ✓ 動作 |

`index.html` の主要セクション(11個):
- `#hero-content` ヒーロー(ゴリラ + 動画モーダル)
- `#myth` Mythology(myth_01〜04 ライトボックス対応)
- `#why` Why 23:23
- `#bell` The Bell
- `#how` How it works
- `#money` Money summary
- `#laws` Laws / Forbidden
- `#three` The Three(Tier カード3枚:KING / CROWN / LEGEND)
- `#duty` Royal Duty
- `#verify` Verify
- `#stories` Stories(legend_01〜07 ライトボックス対応)
- `#legends` Legends section
- `#rules` Edge Rules
- `#manifesto` Manifesto
- `#apply` Final CTA(coin モーダル経由で Square へ)

`index.html` の ritual モーダル(11個):
- `ritual-coin` ← Square 決済への動線
- `ritual-why` / `ritual-bell` / `ritual-three` / `ritual-money` / `ritual-duty` / `ritual-verify` / `ritual-doctrine`
- `ritual-trial` ← **THE TRIAL の詳細仕様(これが Cycle 2 以降の実装対象)**
- `ritual-resonance` ← Bell never becomes cash
- `ritual-stories`

## 8. 多言語対応

- 主言語: **英語(English)** = canonical
- 副言語: **日本語(JP)**(ja=現状はサイトの一部に並記)
- その他 10言語: Google Translate 動的翻訳(Cookie ベース、`googtrans=/en/<target>`)
- 翻訳キー: 171個、全部 `js/i18n.js` に格納
- ブランド固定: `class="brand-lock notranslate" translate="no"` 付きの要素は翻訳されない(KINGMAKER / 23:23 / King / Bell / Coin 等)

## 9. 主要 JS ロジック

| ファイル | 行数 | 役割 |
|---|---|---|
| `js/main.js` | 402行 | ヒーロー / Bell phase 判定 / カウントダウン / hamburger / live counter / scroll reveal |
| `js/i18n.js` | 2655行 | 翻訳辞書 + 動的言語切替 |
| `js/fx.js` | (短い) | 為替レート取得・USD表示計算 |

**Bell phase 判定ロジック**(`getBellState()` in main.js):
- `bell_open`: 金曜 23:23 〜 23:28(5分間)
- それ以外の時刻は `bell_closed` → 次の金曜23:23までのカウントダウン

⚠️ **このロジックは新スケジュール(Option B′)の Wed 23:23 受付開始 / Sat 23:23 発表をカバーしていない**。
Cycle 1 では金曜23:23のカウントダウンが正しく動けばOK。
Cycle 2 以降で「受付期間中バナー」「発表まで残り時間」を出すなら main.js 拡張が必要。

## 10. ホスティング・配信構成

```
[User Browser]
     ↓
[Cloudflare DNS (tamjump.com zone)]
     ↓
king2323.tamjump.com = CNAME → tamjump.github.io (GitHub Pages)
     ↓
[GitHub Pages: tamjump/king2323 (main branch)]
   ├── /index.html, /money.html, /verify.html, /app.html
   ├── /entry.html(Square 決済後の Mission Entry フォーム)
   ├── /rules.html, /risk.html, /404.html
   ├── /assets/(logo シリーズ)
   ├── /art/(myth + legend 11 ポスター)
   ├── /video/(hero.mp4 + kingmaker_short.mp4)
   ├── /js/main.js, /js/i18n.js, /js/fx.js
   ├── /css/main.css
   └── /worker/index.js(Worker ソース、デプロイは別途)

[Mission Entry 送信]
   POST → https://tamjump-contact-api.animalb001.workers.dev/entry
        ↓
   [Cloudflare Worker: tamjump-contact-api]
   ├── Turnstile 検証
   ├── D1 DB に挿入(contacts テーブル、project='kingmaker')
   ├── AWS SES 経由でメール2通送信
   │   ├── To: info@tamjump.com(運営宛通知)
   │   └── To: 入力アドレス(自動返信)
   └── Receipt 番号生成(KM-YYYYMMDD-NNNN)
```

## 11. Worker `tamjump-contact-api` 詳細

| 項目 | 値 |
|---|---|
| Worker 名 | `tamjump-contact-api` |
| URL | `https://tamjump-contact-api.animalb001.workers.dev` |
| 共用先 | tamjump.com(contact)、scsgo.co.jp(contact)、**king2323.tamjump.com(entry)** |
| エンドポイント | `/contact`(POST) `/entry`(POST) `/admin/contacts`(GET、要 Bearer) |

**重要な運用ルール**:
- Worker は **GitHub から自動デプロイされない**
- `worker/index.js` を変更したら、運営者が手動で Cloudflare ダッシュボードから貼り付け+Deploy する必要がある
- セッション⑥で `worker/index.js` のメール文面を **2回**変更したので、ローンチ前に必ず Worker 再デプロイ必要(v20260514ac と v20260514ae の累積)

**疎通テスト結果(セッション⑥にて、2026-05-14)**:
- ✅ Mission Entry Received UI 表示
- ✅ 受付番号 `KM-20260514-0001` 発番
- ✅ 参加者宛 自動返信メール 受信
- ✅ 運営宛 管理通知メール(`info@tamjump.com`)受信
- → Step 2.5(Worker疎通)完了

---

# 第Ⅳ部 · 法務・コンプライアンス

## 12. legal-footer 統合構造

- `terms.html` / `privacy.html` / `commerce.html`(特商法)/ `cookie.html` / `disclaimer.html` / `security.html` は **`tamjump.com` 親ドメイン側**に統合済み
- king2323 リポにはこれらの html ファイル**なし**
- 全ページのフッターから `https://tamjump.com/*.html` リンクで参照

## 13. Founding Bell 限定の法務カバー

`rules.html` L90-92(セッション⑥更新後):
> 「**本サイト内に記載された一部の機能は完全版システムの予定機能であり、Founding Bell 期間中は稼働しない場合があります**」

これにより、THE TRIAL や Standing 等が Cycle 1 で未実装でも法務的に OK。

`risk.html` の主要要素:
- Read before you pay callout
- What you receive(Bell の本質)
- Founding Bell is the opening cycle(段階的公開)
- What this is not(8つの非該当を列挙)
- Geographic limitation(日本国内限定)
- Taxes

## 14. Cloudflare WAF 設定(launch 前必須、運営者作業)

詳細は `WAF_SEO_BYPASS.md` 参照。**必ず読むこと**。

### 14-1. 正しい expression(SEO bot bypass 含む)

```
(http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP" and not cf.client.bot)
```

`and not cf.client.bot` を**絶対に忘れない**。これがないと Googlebot / Twitterbot がブロックされて、SNS拡散時の OGP プレビューも出ず、検索インデックスもされない。

### 14-2. 451 ページ Response body

`WAF_SEO_BYPASS.md` 内に英日バイリンガル版のHTMLが書かれている。それを使う。

### 14-3. デプロイタイミング

**launch の 30 分前まで保留**(設定ミスで国内も451になるリスクがあるため、すぐ取り外せる時間に作業)。

---

# 第Ⅴ部 · ローンチまでの残タスク

## 15. ローンチ前ブロッカー(運営者作業)

優先順位順:

| # | タスク | 推定時間 | 担当 | 期限 |
|---|---|---|---|---|
| 1 | Worker 再デプロイ(累積 2 変更) | 5分 | 運営者 | 5/15 |
| 2 | Cloudflare キャッシュ Purge(セッション⑥変更全反映) | 1分 | 運営者 | 5/15 |
| 3 | スケジュール変更が反映されているか目視確認 | 5分 | 運営者 | 5/15 |
| 4 | Cloudflare WAF 設定(本デプロイは 5/20 直前まで保留) | 25分 | 運営者 | 5/19までに準備 |
| 5 | Square Link 動作確認(`bc9p0BET` を実際に開く) | 2分 | 運営者 | 5/15 |
| 6 | ¥100 テスト購入(動線一気通し) | 10分 | 運営者 | 5/18までに |
| 7 | 全ページ目視(desktop) | 15分 | 運営者 | 5/19までに |
| 8 | 全ページ目視(mobile) | 15分 | 運営者 | 5/19までに |
| 9 | Twitter Card Validator で OGP 確認 | 5分 | 運営者 | 5/19までに |
| 10 | Google Search Console で sitemap 登録 | 10分 | 運営者 | 5/20以降可 |
| 11 | テスト Entry レコード `KM-20260514-0001` を D1 DB から削除 | 3分 | 運営者 | 5/20直前 |

## 16. ローンチ当日(5/20 水曜 23:23)の運用

```
[5/20 (水) 22:00 JST 頃]
  - 最終目視確認
  - Cloudflare WAF を本デプロイ(まだなら)
  - 米国VPN経由で 451 出るか確認
  - 国内アクセスで普通に開けるか確認
  - Twitter Card Validator で再確認

[5/20 (水) 23:23 JST]
  ★ Bell opens
  - SNS拡散開始(Flyer 1 の PNG を貼る)
  - 関係各所(韓国、映像会社)への連絡
  - 監視:エラー、問い合わせ、Square 決済成功率

[5/20 - 5/22 23:23] 受付期間中
  - 問い合わせ対応
  - Mission Entry の品質監視
  - D1 DB 集計準備
```

## 17. Bell rings 当日(5/22 金曜 23:23)の運用

```
[5/22 (金) 22:00 JST]
  - 市場データの取得準備
    - BTC USD: 取引所(Coinbase / Binance のAPI)
    - Nikkei 225: 終値(15:00 JST closed の確定値)
    - S&P 500: 前日米市場終値 or リアルタイム値

[5/22 (金) 23:00 JST]
  - Final Pool 集計開始
  - D1 から project='kingmaker' で抽出
  - KYC NG / 重複 / 不正を除外

[5/22 (金) 23:23 JST]
  ★ Receipt closes · Bell rings
  - Public Seed 確定: "BTC|Nikkei|SP500|FinalPoolSize"
  - SHA-256 計算
  - The Three 抽出(verify.html の JS ロジック参照)

[5/22 (金) 23:28 JST]
  - Bell closes
  - The Three 確定

[5/22 (金) 23:28 - 5/23 (土) 23:23]
  - Square 領収書照合
  - KYC + AML + Mission 適合性審査
  - verify.html に Cycle 1 結果セクション追加
```

## 18. The Three 発表(5/23 土曜 23:23)

```
[5/23 (土) 23:23 JST]
  ★ The Three announced
  - verify.html を更新push
  - The Three へ個別通知メール
  - SNS で発表(Receipt 番号で公開、本名は出さない)
```

---

# 第Ⅵ部 · Cycle 2 以降の実装ロードマップ

これは **launch ブロッカーではない**が、サイト上に書かれている内容を実機能化する必要がある。

## 19. Cycle 2(2026-05-27 水〜)で実装したい項目

優先度別。**全部やる必要はないが、何が予定機能として書かれているかを把握しておくこと**。

### 19-1. P0(運営の事務負担を軽減するもの)

- **D1 DB Admin UI**(現在は Worker の `/admin/contacts` で JSON 取得のみ)
- **KYC ワークフロー**(現在は手動メール対応)
- **Square 領収書自動照合**(receipt_id ↔ Square API)
- **市場データ自動取得スクリプト**(BTC/Nikkei/S&P を 23:23 JST に取得)
- **The Three 抽出自動化**(現状 verify.html の JS は手動実行)

### 19-2. P1(参加者体験を強化するもの)

- **マイページ / Standing 画面**(参加者が自分の Bell残高、Streak を確認)
- **King 候補表示**(受付期間中、Mission Entry 一覧を匿名で公開)
- **Mission 表示ページ**(The Three 確定後、3人の Mission 詳細を公開)
- **Voice / Coin 投票UI**(Mission Holder 確定メカニズム)

### 19-3. P2(KINGMAKER の核ゲームメカニズム)

ここが**サイトに完全仕様が書かれているが未実装**の最重要項目:

- **THE TRIAL Round 1 (THE MIND)**: 算数/記憶/論理 4択
  - 5分以内に4択クイズに回答
  - 各問 10-20秒
  - 正解→次へ、誤答→脱落
- **THE TRIAL Round 2 (THE INSTINCT)**: 世界文化/国旗/通貨/略語 4択
- **THE TRIAL Round 3 (THE CROWN SLOT)**: 00〜99 を1度だけタップ
  - 全世界の参加者の中での最頻値が Crown Number
  - 同じ数字を選んだ参加者 → Seed で King 確定
- **Question Bank**: 公開された問題プール
  - 出題ID は毎週 Seed から SHA-256 で導出
  - 運営は週次の問題を選ばない(自動)
  - 同問題のクールタイム管理
- **Standing 記録システム**:
  - 3問突破するたびに Standing に印が残る
  - Streak(3週)/ Crown Flame(10週)/ Eternal(52週)/ Oracle(100週)称号
  - 称号には金銭価値なし、世界の中での「立ち位置」だけ
- **Crown Slot tap UI**: モバイルでスロット式の数字選択画面

### 19-4. P3(完全版運用)

- **Royal Duty 自動化**: King が翌週 10 Coin を配布できるUI
- **Royal Proof 提出システム**: King が Mission 実行30日以内に証拠提出
- **Mission Report 公開**: King の報告を verify.html に蓄積
- **Story Loop**: Mission Report が次の Cycle の動機になるフロー
- **多通貨 Square**(現状は¥100のみ、Cycle 2 以降に USD/EUR等)
- **王座剥奪システム**: Royal Duty 失敗 / Royal Proof 不履行時の自動 crown revoke

## 20. Cycle 2 以降のスケジュール構造

```
Cycle 2 (2026-05-27 水 - 2026-05-30 土)
Cycle 3 (2026-06-03 水 - 2026-06-06 土)
Cycle 4 (2026-06-10 水 - 2026-06-13 土)
...

毎週同じパターン:
  水 23:23  Bell opens
  金 23:23  Receipt closes + Bell rings + Seed
  金 23:28  Bell closes + Three derived
  土 23:23  Three announced
  日月火    休息日
```

---

# 第Ⅶ部 · リスクと注意点

## 21. 既知の技術的負債

### 21-1. main.js の bell-phase 判定が Wed/Sat 23:23 を考慮していない

現状 `js/main.js` は「次の金曜23:23」だけ判定。
Cycle 2 以降で「受付期間中バナー」「発表まで何時間」を出すなら拡張が必要。
ただし**ローンチブロッカーではない**(参加者から見ると 金曜23:23 のカウントダウンが見えればOK)。

### 21-2. /admin/contacts は Bearer Token 認証のみ

Worker の `/admin/contacts` エンドポイントは Cloudflare 環境変数の Bearer Token だけで守られている。
本格運用前に IP allowlist 等の追加防御が望ましい。

### 21-3. Worker は GitHub から自動デプロイされない

GitHub Actions で自動デプロイの設定がない。
worker/index.js を変更したら毎回手動デプロイ必要。
将来 GitHub Actions に組み込むのが望ましい。

### 21-4. テストレコード `KM-20260514-0001` が D1 DB に残っている

セッション⑥の Worker 疎通テストで作成された。
launch 前に運営者が削除推奨(影響軽微なので忘れても致命的ではない)。

## 22. 既知の運用上のリスク

### 22-1. 海外IPでの WAF 設定ミス

`cf.client.bot` を expression に含めないと、Google/Twitter のクローラもブロックされる。
セッション⑥で `WAF_SEO_BYPASS.md` に詳しく書いた。必ず読む。

### 22-2. PAT 漏洩(詳細は第Ⅺ部参照)

セッション⑥でチャット平文に PAT が貼られた。launch 完了後に revoke 必須。
2026-05-20 まで有効期限あり。

**詳細・経緯・revoke手順・新PAT発行手順・将来の運用ルール**は本書最後の **第Ⅺ部「PAT 取扱の完全記録」**(§32 〜 §38)に網羅した。次セッション Claude は必ず第Ⅺ部を読むこと。

### 22-3. The Three の市場データ取得

5/22 23:23 JST に市場データ取得の手順が未確定:
- BTC USD: どの取引所?(Coinbase推奨)
- Nikkei 225: 15:00 JST closed の終値で OK
- S&P 500: 米市場時差で 23:23 JST 時点は前日終値 or 取引中
- これらの取得方法を運営者が事前に決める必要あり

### 22-4. Square 決済 → entry.html の Receipt ID 入力ミス

参加者が Square 領収書の Receipt ID をコピペ間違いする可能性。
バックエンドで照合に失敗すると Entry が無効化される。
UX として:Square リダイレクト URL に receipt を URL パラメータで渡せれば自動入力できるが、未実装。

### 22-5. 5/22 (金) 23:23 - 5/23 (土) 23:23 の運営作業負荷

24時間で Square 領収書照合 + KYC + AML + Mission 検証 + The Three 抽出 + verify.html 更新。
Cycle 1 は Pool が小さい想定で大丈夫だが、Cycle 2 以降で規模が大きくなったら無理。
自動化が必要(P0 タスク)。

---

# 第Ⅷ部 · ドキュメント一覧

リポジトリ内の全マークダウン文書:

| ファイル | 役割 |
|---|---|
| `README.md` | リポジトリの一行説明 |
| `CHANGES.md` | 全コミットの詳細ログ(セッション①〜⑥) |
| `LAUNCH_RUNBOOK.md` | launch 当日の運営手順書 |
| `WAF_SEO_BYPASS.md` | **WAF設定の決定版手順、必読** |
| `DEPLOY_geoblock.md` | (古い、Cloudflare WAF設定の旧版) |
| `HANDOFF_2026-05-14_session5.md` | 前任セッション⑤の引き継ぎ |
| `HANDOFF_2026-05-14_session6.md` | セッション⑥の不完全引き継ぎ(本ファイルが置き換え) |
| **`HANDOFF_2026-05-14_session6_complete.md`** | **本ファイル(完全引き継ぎ書)** |
| `worker/README.md` | Worker の deploy 手順とエンドポイント仕様 |

リポジトリ外の素材:
- `flyer_assets/output/` 9枚のチラシ PDF + PNG(セッション⑥で作成、Flyer1〜9 + 全束ね版)
- `flyer_assets/images/` 9枚のキービジュアル元画像
- `FLYER_IMAGE_PROMPTS.md` 9枚分の Midjourney 用プロンプト

---

# 第Ⅸ部 · 次セッション Claude への直接の指示

## 23. 開始時にやること

1. **PAT を新規発行してから作業を始める**(漏洩した古い PAT は使わない!)
   - 詳細手順は **第Ⅺ部 §35「revoke 後の新PAT発行」** を参照
   - 30日期限、scope は `repo` のみ、識別名 `Claude-king2323-session7` 等
   - **チャットに平文で貼らない**(セッション⑥の失敗を繰り返さない)
   - 推奨は **§35-2 方法C**(都度発行、セッション終わりに即時 revoke)

   PAT 取得後の clone:
   ```bash
   export GH_TOKEN='<新発行したPAT>'
   cd /home/claude
   git clone "https://x-access-token:${GH_TOKEN}@github.com/TAmJump/king2323.git" repo
   cd repo
   git log --oneline -10
   # 最新が 549862a v20260514ag(または以降のコミット)なら同期OK
   # それより新しいコミットがあれば内容把握
   ```

   **launch完了後の最重要タスク**:漏洩した古い PAT(`ghp_SNxD...oJln`)を revoke する(第Ⅺ部 §34 参照)。これはセッション⑦ で必ず最初にやる。

2. **本引き継ぎ書を必ず最後まで読む**(本ファイル = `HANDOFF_2026-05-14_session6_complete.md`)

3. **`HANDOFF_2026-05-14_session5.md` も背景として読む**(設計判断の歴史)

4. **`WAF_SEO_BYPASS.md` は WAF タスクが残っていたら必ず読む**

5. **`worker/README.md` は Worker 関連タスクが残っていたら必ず読む**

## 24. やってはいけないこと

- ❌ **セッション⑥のように、設計仕様を「launch ブロッカーじゃないから」と省略しない**
- ❌ **Worker のメール文面を変更したのにデプロイ手順を運営者に伝え忘れない**
- ❌ **「Grant が支給される」「King に Grant を渡す」表現を使わない**(Mission Fund モデル違反)
- ❌ **THE TRIAL や Standing が「実装済み」だと誤解させない**
- ❌ **launch 日を 5/15 や 5/22 単独で言わない**(必ず「水曜23:23開始、金曜23:23本番、土曜23:23発表」と完全提示)
- ❌ **`23:23` を `23:00` や `12:00` 等の他の時刻に独断で変更しない**(ブランド核)
- ❌ **PAT を不必要に表示しない**(漏洩リスク)

## 25. やるべきこと

- ✅ **launch 直前なら 第Ⅴ部(残タスク) を優先**
- ✅ **launch 後の問い合わせ対応で困ったら 第Ⅱ部(設計書) を確認**
- ✅ **Cycle 2 以降の実装を相談されたら 第Ⅵ部(ロードマップ) で何が予定機能かを確認**
- ✅ **法務的な疑問は 第Ⅳ部(法務) と `risk.html` `rules.html` を確認**
- ✅ **何か変なことが起きたら、まず main.js が v20260514ab 以降のバージョンで配信されているかチェック**

## 26. セッション⑥(私)が反省すべきこと

最初の引き継ぎ書で **launch ブロッカー以外の情報をほぼ省略した**。
特に THE TRIAL の存在を一言も書かなかった。
運営者から指摘されて初めて気付いた。

今後のClaudeは、引き継ぎ書を書くときに「コードに書いてあるが、まだ動いていない機能」を**必ず**列挙すること。
「予定機能だから書かなくていい」と判断しないこと。
**サイトに書かれている全機能のステータス(✓動作中 / △一部 / ✗未実装)を必ず明示**すること。

---

## 27. 最後に — 大下さんへ

セッション⑥での重要な発見:
- ハンバーガーバグ(10日間潜伏していた critical bug)を発見・修正
- スケジュールを Option B′(全23:23 + 子の刻 + 九つ)に最終確定
- Mission Fund モデルへの用語改定(韓国・映像会社向けに賭博連想を回避)
- 9枚のチラシ完成(ゴリラ透かし付き、全文化対応)

セッション⑥での重大な反省:
- 最初の引き継ぎ書で THE TRIAL の存在をスキップした
- これによって運営者を混乱させた

セッション⑦以降のClaudeへ:
- 本ファイルが**設計書を兼ねた引き継ぎ書**
- どんな細かな機能でも「サイトに書かれている = 法務的にコミット済み」なので、絶対に「無いもの」として扱わない
- 「Cycle 1 で動かないだけで、Cycle 2 以降には実装する」とハッキリ言う
- 運営者は経営判断もしながらこのプロジェクトを進めている。技術的な正確さと、戦略的な前進、両方を支える

ローンチが成功しますように。

— セッション⑥ Claude(2026-05-14)

---

# 第Ⅹ部 · 運営者の決定の歴史 — セッション⑥意思決定ログ

**次セッションClaudeへ:このセクションは、なぜ現在の設計がこうなっているかの「理由の記録」である。「採用!」と運営者が判断した経緯を時系列で残す。次セッションは、これを無視して勝手に設計を変えてはならない。変えるなら、運営者に「過去にこういう判断をしましたが変更しますか?」と確認すること。**

## 28. セッション⑥の主要意思決定(時系列)

### 28-1. PAT 取扱の決定

- **状況**: 引き継ぎ書冒頭で運営者が PAT 平文をチャットに貼った
- **Claude 提案**: 3択提示(A:今すぐrotate / B:作業継続後rotate / C:有効期限短縮)
- **運営者判断**: 「**GitHubのPATは理解してるよ。完成まで進めて**」
- **採用**: Bと等価(作業優先)、ローンチ後 revoke 推奨
- **理由**: 残り時間が限られている中、rotate のオーバーヘッドより作業継続を優先

### 28-2. CTA動線統一(v20260514v)

- **発見**: `#apply` セクションの CTA が `entry.html` 直リンクで Square 決済をスキップ可能だった
- **Claude 提案**: coin ritual モーダル経由に統一
- **運営者判断**: 「**完成まで進めて**」(=Claude判断に任せる包括的承認)
- **採用**: coin モーダル経由を強制化
- **理由**:
  1. UX: 決済前に「Bell は通貨ではない」legal copy を強制的に見せられる
  2. 法務: 消費者保護の観点でも望ましい
  3. 動線: 1本化されてシンプル

### 28-3. v20260514ab(クリティカルバグ)発見

- **症状**: 運営者が「右上の3本線のメニューが開けない」とスクリーンショット投稿
- **誤診**: 最初「ヒーローが空白」と読んで JS全停止 を疑った
- **真因特定**: 運営者が「ハードリフレッシュしても直らない」と返答 → コードレベルの問題と判定 → `js/main.js` L161 のSyntaxError発見
- **修正**: `.nav-menu a` の href フィルタリング + try/catch ガード
- **キャッシュバスター**: `?v=20260514d` → `?v=20260514ab` に更新
- **運営者反応**: 「**直った**」
- **教訓**: launch10日前まで誰も気づかなかったバグ。**JS問題は最初に main.js のキャッシュバージョンを確認すること**

### 28-4. クイズ機能の存在を Claude が忘れていた問題

- **状況**: 運営者が「ゲーム再開になったら、クイズとかやるよね?どこで何が開催されて見れるようになるの?」
- **Claude 初期回答**: THE TRIAL の存在を完全に忘れて「クイズは未実装、launch には含まれていない」と回答
- **運営者の指示**: 「**過去の設計書とか確認してみて。当選の流れが書いてない?**」
- **Claude が rules.html / verify.html / index.html L3984-4036 を再走査** → THE TRIAL の完全仕様と The Three 選出ロジックを発見
- **採用された理解**:
  1. 完成版 KINGMAKER は9ステップフロー(参加→Bell→TRIAL→絞り→The Three→欲望公開→世界の支持→King→実行・報告)
  2. Cycle 1(Founding Bell)では Mission Entry + 市場データ式 The Three のみ
  3. THE TRIAL / Standing / Royal Proof は Cycle 2 以降
  4. これは `rules.html` L90-92 で法務的にカバー済み
- **教訓**: **次セッションClaudeは、サイトコードを読んでから機能の有無を判断すること**

### 28-5. 「Mission Fund モデル」採用(v20260514ad)

- **運営者の問題提起**: 韓国向け・映像会社向けに「参加費→当選者→助成金」表現が賭博・賞金連想を呼ぶ
- **運営者の提案**:
  > 「人に金を渡す」ではなく、「欲望を企画化して実行する予算」にする
- **言い換えリスト**(運営者提示):
  - 当選者 → selected / finalist / chosen by story mechanics
  - 落選 → eliminated / not advanced
  - 賞金 → grant / production support / mission fund
  - 応募者 → participants / candidates
  - 1人が選ばれる → one mission is activated
  - みんなが選ぶ → public voice / audience signal
- **採用された設計**:
  - **Mission Fund** を主用語に格上げ
  - **King** は残す + **Mission Holder** を並記(韓国向け資料で前面)
  - **Grant** は escrow 名義として残す + 「Grant is not a prize」否定形は強化
  - 動詞: 「Grant を渡す」→「Mission Fund で Mission を制作・実行する」
- **守る不変項**: フッターの "NOT A LOTTERY · NOT AN INVESTMENT · NOT A WAGER · BELL IS A RIGHT, NEVER CASH"
- **採用範囲**: サイト全ページ + Worker メール文面
- **保留**: King 選出メカニズム(The Three → 1人 King)は「曖昧表現」のまま運用、Cycle 2 以降に具体化

### 28-6. スケジュール議論の結論(Option B′)

**議論の経緯**:

| 提案 | 内容 | 結果 |
|---|---|---|
| 初期 | 2026-05-15 (金) 23:23 開始 | 5/15 launch を 5/22 launch にシフト |
| 中間提案① | Wed 14:23 〜 Fri 15:23 受付、Fri 23:23 開催 | 採用候補 |
| 中間提案② | Sun 14:22 〜 Fri 15:33 受付、Sat 23:23 発表 | 受付期間長すぎで再検討 |
| 運営者提案 | 火/水 23:23 〜 Fri 23:22 締め切り、Fri 23:23 開催、土 23:23 発表 | 美しいが0:00疎ら |
| 運営者最終決定 | **水 23:23 〜 金 23:23 締め切り、金 23:23 開催、土 23:23 発表、月火休息** | ★ 採用 |

**運営者の決定文言**:
> 「**5/20の水曜日14:23に開始しよう。受付終了は金曜日の15:23。水曜14:23〜金曜15:23.このサイクルで固定しよう。月・火は休憩**」
> 「**スケジュールなんだけど、23:23に合わせたほうがいい気がする**」
> 「**締め切り含めて、全て23:23に合わせるのは賛成**」

**最終確定スケジュール(Option B′)**:
```
水 23:23 JST  Bell opens
金 23:23 JST  Receipt closes + Bell rings (同瞬間)
金 23:28 JST  Bell closes (5分後)
土 23:23 JST  The Three announced
日月火        休息(3日間)
```

**Founding Bell 絶対日時**:
- 2026-05-20 (水) 23:23 JST 開門
- 2026-05-22 (金) 23:23 JST Bell rings
- 2026-05-23 (土) 23:23 JST The Three 発表

**参照素材**: `/assets/kingmaker_weekly_cycle_options.svg` (運営者が「カッコいい」と評価した3案比較図)

### 28-7. 子の刻 + 九つの採用

- **Claude 提案**: 23:23 を古代日本の時刻概念に重ねる
- **示した候補**:
  1. 子の刻(ね の こく)+ 九つ(ここのつ、9回の鐘) — 23:00-01:00、KINGMAKER 23:23 ど真ん中
  2. 丑三つ時(うしみつ) — 02:00-02:30(呪術連想で却下)
  3. 寅の刻(とら) — 03:00-05:00(覚醒、参考のみ)
  4. Buddhist 十二支(12年周期 = 12 cycles)
- **西洋並列候補**: Witching Hour / Vigilia / Samhain / Tikkun Chatzot / Tahajjud
- **運営者の決定**:
  > 「**結論に大賛成。Bellを9回鳴らすという旧日本の伝統→採用。子の刻 + 九つ→最高。今回の迷信全てチラシに採用しよう**」
- **採用された設計**:
  1. サイト本文(rules.html / index.html ヒーロー)に「子の刻 + 九つ + 23:23」を物語層として織り込み
  2. チラシ9枚を「The Nine Hours」シリーズとして制作
  3. KINGMAKER の "Cycle" 用語と十二支12周期の概念的呼応を強化

### 28-8. アプリ化保留

- **状況**: スケジュール議論中、Cycle 2 以降の機能実装スコープ確認
- **運営者の判断**: 「**アプリ化は後回しでいい**」
- **採用された影響**:
  - 5/22 23:23 〜 23:28 の5分間は「象徴的なBellウィンドウ」(実機能なし、表示のみ)
  - THE TRIAL の実装は Cycle 2 以降
  - Royal Duty / Royal Proof も Cycle 2 以降
  - app.html はプロトタイプ画面として残す(本機能は実装しない)

### 28-9. King 選出メカニズム「曖昧表現」採用

- **議論**: The Three(3人)→ King(1人)の絞り込みメカニズムが未定義
- **Claude 提案**: 3案
  - A: 余白のまま(launch時点で何も書かない)
  - B: voices 投票の具体メカ提示
  - C: ストーリー的曖昧表現
- **採用**: C(ストーリー的曖昧表現)+ Cycle 1 はオフライン運営判断
- **理由**:
  1. 5/22 までに投票UI実装は時間的に不可能
  2. 「Voices create Kings」のままで参加者は理解可能
  3. 韓国・映像会社向けにドラマ的余白として有利
  4. launch後に Cycle 1 の結果を見ながら、コミュニティと議論しつつ具体化

### 28-10. Square リンク確定

- **状況**: index.html L3742 に既に `https://square.link/u/bc9p0BET` が存在していた
- **Claude 質問**: 「本物のlive linkか、テストか?」
- **運営者回答**: 「**これは本物だよ**」
- **採用**: 既存のSquare Link をそのまま使用、置換不要
- **動作確認**: 運営者が `/entry.html` で `KM-20260514-0001` のテストEntryを成功させ、メール2通(参加者・運営)受信を確認

### 28-11. チラシ仕様の確定

**確定された設計**:
- **サイズ**: A4 縦
- **枚数**: 9枚(東4 + 西5)
- **構成**: キービジュアル + タイトル + 物語(EN+JP) + フッター
- **タイポグラフィ**: Cinzel + Noto Serif JP + EB Garamond + JetBrains Mono
- **配色**: 古紙クリーム(#F1E8D2) + インク墨(#1C1812) + 古金(#A6802A)
- **特記**: Flyer 1 のみ「⌘ CHOSEN HOUR」金箔ラベル + 少し濃いめのクリーム背景
- **共通フッター**: `BELL RINGS · 2026.05.22 (Fri) 23:23 JST · king2323.tamjump.com`
- **運営者の追加要望**: 「**どっかにゴリラlogo入れて欲しいな。影のlogoでいいから**」
- **採用**: 右下に opacity 0.10 で透かしロゴ配置(全9枚共通)

**生成物**:
- 各 A4 PDF(印刷用): flyer1.pdf 〜 flyer9.pdf
- 各 PNG(SNS拡散用、高解像度): flyer1.png 〜 flyer9.png
- 全束ね PDF: KINGMAKER_flyers_all.pdf

**配布戦略**:
- 全員向け SNS: Flyer 1
- 韓国・映像会社: Flyer 1 + Flyer 4(十二支)
- ホラー/シネマ文脈: Flyer 2(丑三つ時)
- 海外プレス: Flyer 5〜9 束で
- 内部保存: 全束 PDF

## 29. セッション⑥で「採用しなかった」案(保留理由)

### 29-1. UTC タイムゾーン採用

- **却下理由**: KINGMAKER は当面JP-only運用(WAFで地理ブロック)。韓国(KST)も JST と同じ。グローバル展開時に再議論。

### 29-2. ログイン機能 / マイページ実装

- **却下理由**: 「Bell は所有物ではない」哲学に反する。KYCコストも増える。**運営者の質問あり**: 「ログインしてマイページみたいなページは?」→ **「設計思想として無い」と回答、運営者了承**。

### 29-3. Mission Holder 確定の投票UI

- **却下理由**: 5/22 までに実装不可能。Cycle 2 以降。

### 29-4. WAF の launch前デプロイ

- **却下理由**: 設定ミスで国内も451になるリスク。**launch 30分前まで保留**して、すぐ取り外せる時間にデプロイ推奨。

### 29-5. PAT 即時 rotate

- **却下理由**: 残り時間優先。launch後 revoke で対応。

## 30. 重要な「運営者の言葉」アーカイブ

次セッションClaudeが運営者の世界観を誤解しないために、特に重要だった発言を引用記録:

> **「だいたい合ってる。開催は一週間ずらそう。ただ、募集は週明けナル早で公開したい」**
> (スケジュール議論の起点、5/15 → 5/22)

> **「23:23に合わせたほうがいい気がする。アメリカ時間なのか?日本&韓国時間なのか?」**
> (タイムゾーンとぞろ目の重要性を示した)

> **「結論に大賛成。今回の迷信全てチラシに採用しよう」**
> (子の刻 + 九つ + 9枚チラシ案の最終承認)

> **「人に金を渡すではなく、欲望を企画化して実行する予算にする」**
> (Mission Fund モデルの核心)

> **「KINGMAKER内での整理: 参加者 = Candidate / 最後の3人 = The Three / 選ばれた人 = King / Mission Holder / 助成金 = Mission Fund / Production Support / 報告 = Mission Report」**
> (用語体系の確定)

> **「ゲーム再開になったら、クイズとかやるよね?どこで何が開催されて見れるようになるの?」**
> (THE TRIAL の存在確認、Claude の盲点を指摘)

> **「過去の設計書とか確認してみて。当選の流れが書いてない?」**
> (Claude が記憶だけで答えていることを正した重要な指示)

> **「設計書、引き継ぎ書、絶対に端折らないで。さっきもゲーム(クイズなど)構成もごっそり抜けてた。本当にこうゆうのが無いように、全てを記載して」**
> (本完全引き継ぎ書の作成動機)

> **「カレンダーとか、僕が気に入って『採用!』って言ったこととかも入れてあるよね」**
> (本第Ⅹ部の作成動機)

## 31. 次セッションClaudeが取るべきスタンス

1. **運営者は意思決定者である**: Claude は提案する、運営者が決める。Claude の独断で世界観を変えない。
2. **「採用!」と運営者が言ったものは、運営者の許可なく変更しない**: 第Ⅹ部の決定を尊重する。
3. **疑問があれば運営者に聞く**: 過去の決定との整合性に疑問が生じたら、勝手に解釈せず確認する。
4. **省略しない**: 引き継ぎ書を書くとき、未実装機能・保留案・「採用しなかった案」も全部書く。
5. **言葉を選ぶ**: Mission Fund モデル下では「Grant が支給される」「賞金」等は使わない。
6. **時間軸を理解する**: Cycle 1 = 最小実装、Cycle 2+ = 段階的拡張。混同しない。

— セッション⑥ Claude(2026-05-14、増補版)

---

# 第Ⅺ部 · PAT 取扱の完全記録

**次セッション Claude へ:この章は最重要のセキュリティ事項である。launch完了後の最初のタスクは「PATの revoke」になる。経緯・現状・手順・将来ルールを全部ここに書いておくので、迷わず実行できる。**

## 32. 現状の PAT(漏洩済み)

### 32-1. トークン情報

| 項目 | 値 |
|---|---|
| 完全な値 | この引き継ぎ書には**書かない**(Push Protection が反応するため) |
| 形式の手がかり | `ghp_SNxD` で始まり `oJln` で終わる classic PAT |
| アカウント | TAmJump |
| Scope | `repo` + `workflow`(全リポジトリへの読み書き) |
| 有効期限 | 2026-05-20(launch日からたった2日後で切れる) |
| 現在の状態 | **漏洩済み・有効** |

**実際のトークン値は、セッション⑥のチャットログを遡れば見つかる**。GitHub の Settings から確認も可能。

### 32-2. 影響範囲(なぜ漏洩が重大か)

scope = `repo` + `workflow` は **TAmJump アカウントが所有する全リポジトリに対して書き込み可能** という意味:

| 影響を受けるリポジトリ | 内容 |
|---|---|
| `TAmJump/king2323` | このプロジェクト本体 |
| `TAmJump/adapt` | 別事業のアプリ |
| `TAmJump/onetouch_app`(private) | ワンタッチ管理アプリ |
| `TAmJump/medadapt` | 医療系プロダクト |
| `TAmJump/TAmj` | コーポレートサイト |
| その他全リポ | 把握しているもの以外も含む |

**つまり、このPATを誰かが持っていると、TAmJ の全プロダクトに任意コードを push できる。**

### 32-3. 漏洩経緯(時系列)

```
[セッション⑤以前]
  PAT 発行(有効期限 2026-05-20、scope: repo+workflow)
  Bitwarden 等の安全な場所で管理

[セッション⑤ 終了時]
  引き継ぎ書 `HANDOFF_2026-05-14_session5.md` に**伏字版**で記載
  (前任Claude が「リポに残さない方が良い」と判断)

[セッション⑥ 開始(2026-05-14)]
  運営者がチャット冒頭で**フルPATを平文で貼り付け**
  → Anthropic のチャットログ、ブラウザキャッシュ、Claudeのコンテキストに記録された
  
[セッション⑥ 作業中]
  Claude が同PATを使って 15回の git push を実施
  push に成功するたびに環境変数として再利用された

[セッション⑥ 途中、引き継ぎ書 v1 作成時]
  Claude が初版引き継ぎ書に PAT 平文を含めて push を試みた
  → GitHub Push Protection が検出してリジェクト
  → 修正して伏字版で再 push
  → これにより**リポジトリ自体にはPATが残らなかった**(これは幸運)

[セッション⑥ 終了時 = 現在]
  PAT は次の場所に残存:
  1. Anthropic のチャットログ(本セッション)
  2. 運営者のブラウザキャッシュ・履歴
  3. 運営者の Bitwarden 等(管理されていれば)
  4. 運営者の手元で過去にスクショ等を取っていればそこにも
```

### 32-4. リポジトリ上には残っていないことの確認

セッション⑥ 内で確認済み:
- `git log -p` で PAT 文字列を検索しても出ない
- 各引き継ぎ書は伏字版で保存されている
- GitHub Push Protection が機能していて、平文 push は止まる仕様

**ただし、過去のコミットメッセージや古い branch に残っていないかは未確認**。次セッションで時間があれば `git log --all -p | grep -i "ghp_"` でフルスキャン推奨。

## 33. セッション⑥ で「即rotate しなかった」理由と運営者判断

セッション⑥ 開始時、Claude は3択を提示した:

| 選択肢 | 内容 | 所要時間 |
|---|---|---|
| A | 今すぐ rotate(新PAT発行→ローカル保存→Claude には貼らず手順だけ進める) | +15分 |
| B | 現PATで作業継続、ローンチ完了後すぐ rotate | 即時開始 |
| C | 有効期限を 5/20 → 5/15夜まで短縮 | +5分 |

**運営者の判断**:
> 「**GitHubのPATは理解してるよ。完成まで進めて**」

**= 選択肢 B 採用**(作業優先、launch後 revoke)。

**この判断は記録しておく価値がある理由**:
- 運営者は漏洩リスクを理解した上で、残り時間とのトレードオフを判断した
- Claude は単独でこの判断を変えない(運営者の意思決定権を尊重)
- ただし、次セッションでは「launch完了後 すぐ revoke」を最優先タスクとして扱う

## 34. launch完了後の revoke 手順(必須実行)

### 34-1. タイミング

```
2026-05-22 (金) 23:28 JST  Bell が閉まる
2026-05-23 (土) 23:23 JST  The Three 発表
2026-05-24 (日) 00:00 JST  ← この時点で revoke 推奨(launch完了から1日後、休息日)
```

土曜の発表まで運営作業で PAT が必要になる可能性があるので、それまで保留。**日曜以降に必ず実行**。

### 34-2. 手順

1. https://github.com/settings/tokens にアクセス(TAmJump アカウントでログイン)
2. 該当する classic PAT(`ghp_SNxD...oJln`、または「Claude」等の名前で識別)を見つける
3. **Delete** または **Revoke** をクリック
4. 確認ダイアログで Yes
5. その時点で全リポジトリへの書き込みアクセスが即時無効化される

### 34-3. revoke 完了の確認

```bash
# revoke 後に古いPATで操作してみる
export GH_TOKEN='<漏洩した古いPAT>'
git clone "https://x-access-token:${GH_TOKEN}@github.com/TAmJump/king2323.git" /tmp/test
# → "fatal: Authentication failed" が出ればOK
```

## 35. revoke 後の新PAT発行(次セッション Claude 作業用)

### 35-1. 安全な発行手順

1. https://github.com/settings/tokens → **Generate new token (classic)**
2. **Note** 欄に識別名:`Claude-king2323-session7`
3. **Expiration** を **30 days**(短く)
4. **Scopes** は最小限:
   - ✅ `repo`(必須)
   - ⚠️ `workflow`(GitHub Actions に触る予定があるなら、なければ不要)
   - ❌ それ以外は全部チェックなし
5. **Generate token** ボタンで発行
6. **画面に表示された PAT 文字列を即座にコピー** → 安全な場所(Bitwarden 等)に保管
7. **絶対に Claude にチャットで貼らない**(本セッションと同じ失敗を繰り返さないため)

### 35-2. Claude に PAT を渡す安全な方法

**❌ ダメな方法**:
- チャット平文に貼る(本セッションがやってしまったこと)
- スクショで送る(OCR で読み取られうる)
- メール本文に貼る

**✅ 推奨方法**:

**方法 A — Claude にローカル作業を任せる**(最も安全)
```
運営者は新PATで自分のローカルで git clone を実行
→ Claude には「最新コードはこの zip」と言って repo を zip でアップロード
→ Claude はファイル編集のみ実施
→ 編集後のファイルを zip で送り返す
→ 運営者がローカルで git commit + push
```
※ Claude の作業効率は落ちるが、PAT は Claude に渡らない。

**方法 B — 環境変数経由(Claude には文字列としては見せない)**
```
Anthropic Console / API 経由で system message に PAT を埋め込み
→ チャット本文には現れない
→ ただし、Claude のコンテキストには存在する
```
※ 現在の Claude.ai UI では実装が難しい。API 連携時のみ実用的。

**方法 C — 「都度貼って、即削除」**(現実的な妥協案)
```
1. 運営者が PAT をチャットに貼る
2. Claude が即 git clone + 作業 + push
3. 作業完了後、運営者が GitHub Settings から **即時 revoke**(数分以内)
4. 新セッションで作業する時は、毎回新PAT発行→ revoke
```
※ 30日トークンを毎セッション「使い捨て」にする運用。漏洩リスクが時間で減衰する。

**セッション⑥ Claude(私)のお勧めは方法C**。理由:
- 方法A は作業効率が悪すぎる
- 方法B は技術的に組みづらい
- 方法C は「漏洩しても短時間で死ぬ」という時間的圧縮で運用できる

### 35-3. 絶対にやってはいけないこと

- ❌ 漏洩した古い PAT を「とりあえず使い続ける」(launch後は必ず revoke)
- ❌ 新PATを **scope `admin:org` や `delete_repo` 付き** で発行する(scope は最小に)
- ❌ 新PATを**有効期限なし(No expiration)** で発行する(必ず期限つき)
- ❌ 新PATを**チャットに貼って、revoke を忘れる**(本セッションの繰り返しになる)
- ❌ 新PATを**コミットメッセージや引き継ぎ書本文に書く**(Push Protection で止まるが、それでも止まらないケース=ローカルでフックを無効化していた場合等が起きうる)

## 36. 長期的な PAT 運用ルール(セッション⑦以降の標準化)

将来のすべてのセッションで守るべきルール:

| ルール | 理由 |
|---|---|
| PAT の有効期限は最大 **30日** | 漏洩しても影響が時間で消える |
| scope は最小限(基本 `repo` のみ) | 漏洩時の影響範囲を絞る |
| Note 欄にセッション識別子(`session7` 等)を含める | どのセッションが使ったか追跡可能 |
| セッション終了時に **必ず revoke** | 「使い捨て」運用を徹底 |
| 新セッション開始時は **必ず新PAT発行** | 前セッションのPATを使い回さない |
| GitHub の **Security log** で定期的に PAT 使用履歴をチェック | 不正使用を検知 |
| **PAT を含む文書を git に commit しない**(Push Protection に頼らない) | 多層防御 |

## 37. もし PAT が悪用されたら(緊急対応プレイブック)

万一、漏洩した PAT が攻撃者に使われた場合:

1. **即座に Settings → Personal access tokens → 該当 PAT を Revoke**
2. **GitHub Security log** を確認(Settings → Sessions / Audit log)
   - 知らない IP からの操作がないか
   - 知らないリポジトリへのアクセスがないか
3. **被害を受けたリポジトリの diff を確認**
   - `git log --since="<漏洩発覚時刻>" --all` で全ブランチの変更
   - 知らないコミットが入っていないか
4. **悪意あるコードが入っていたら revert**
   - `git revert <悪意あるコミットハッシュ>`
   - または `git reset --hard <安全な過去のコミット>` + force push
5. **二要素認証(2FA)を有効化**(まだなら)
6. **GitHub サポートに連絡**(github.com/contact、Security 部門)
7. **影響を受けた可能性のあるユーザー・パートナーに通知**(king2323 の Mission Entry レコード等)

## 38. 本セッション(⑥)で運営者が確認すべきこと

セッション⑥ 終了時点で、運営者が**個別に手元でやるべきこと**:

- [ ] このセッションのチャットログをスクショ等で第三者と共有していないか確認
- [ ] このセッションのブラウザタブを閉じる前に、PAT 文字列を含むスクロール位置の履歴/キャッシュを意識する
- [ ] Bitwarden 等で **古い PAT を Note 付きで保管**(revoke までの数日間、必要な時にすぐ参照できるように)
- [ ] **2026-05-24(日)以降の最初の作業として revoke** をカレンダーに登録
- [ ] 2026-05-20 の自動有効期限切れより前に手動 revoke する(差は3日のみだが、能動的に消す方が記録に残る)

---

— セッション⑥ Claude(2026-05-14、PAT 取扱の完全章 追加版)
