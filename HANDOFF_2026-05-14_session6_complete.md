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

### 22-2. PAT(`ghp_SNxD****REDACTED_FOR_PUSH_PROTECTION****oJln`)が漏洩済み

セッション⑥でチャット平文に貼られた。launch 完了後に revoke 必須。
2026-05-20 まで有効期限あり。

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

1. **PATを使ってリポを再 clone**
   ```bash
   export GH_TOKEN='<新セッションで貼り直し or rotate 後の新PAT>'
   cd /home/claude
   git clone "https://x-access-token:${GH_TOKEN}@github.com/TAmJump/king2323.git" repo
   cd repo
   git log --oneline -10
   # 最新が 7c12e7a v20260514ae なら同期OK
   # それより新しいコミットがあれば内容把握
   ```

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
