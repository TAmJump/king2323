# LAUNCH RUNBOOK · KINGMAKER 23:23 · Founding Bell

**作成:** 2026-05-18 (月) by Claude session ⑦
**版:** session 7 / supersedes the session-5 version in `docs/archived/`
**対象:** 大下さん(operator)— ブラウザを開いてアカウントを叩く作業

---

## ⏱ Launch スケジュール(三段階・確定)

| 段階 | 日時 (JST) | 何が起きる |
|---|---|---|
| **Bell opens** | **2026-05-20 (水) 23:23** | サイトの受付が開く。¥100 Bell Entry の受付開始 |
| **Bell rings** | **2026-05-22 (金) 23:23** | 受付終了。Public Seed 確定 → The Three 抽出 |
| **The Three** | **2026-05-23 (土) 23:23** | 公開発表(verify.html 更新、SNS、個別通知) |

セッション 5 時点の「5/15 単独 launch」は **廃止**。3 段階に分割されたのは session 6 (Mission Fund モデル採用時)。**この日付は絶対に単独で言わない** — 必ず三点セットで扱う(SNS文も同じ)。

---

## 0. ローンチ前の現在地(2026-05-18 時点)

Claude 側の作業は基本完了。最新コミット `b28374e` (v20260514an = ヒーローの ▶ を 1.5倍ルビー宝石化)が main に反映済み。

残ってる operator タスクは **11項目**(下記)。優先順位順。

---

## 1. ローンチ前ブロッカー 11項目(operator 作業)

| # | タスク | 所要 | 期限 | このランブックでの場所 |
|---|---|---|---|---|
| 1 | Worker 再デプロイ(累積 2 変更) | 5分 | 5/19 まで | §2 |
| 2 | Cloudflare キャッシュ Purge | 1分 | 各CSS更新後+5/19夜 | §3 |
| 3 | スケジュール変更の目視確認 | 5分 | 5/19 まで | §4 |
| 4 | Cloudflare WAF 設定(準備のみ・本デプロイは 5/20 22:00 以降) | 25分 | 5/19 まで準備 | §5 |
| 5 | Square Link 動作確認(`bc9p0BET` 実開) | 2分 | 5/18 中 | §6 |
| 6 | ¥100 テスト購入(動線一気通し) | 10分 | 5/19 まで | §7 |
| 7 | 全ページ目視(desktop) | 15分 | 5/19 まで | §8 |
| 8 | 全ページ目視(mobile) | 15分 | 5/19 まで | §9 |
| 9 | Twitter Card Validator で OGP 確認 | 5分 | 5/19 まで | §10 |
| 10 | Google Search Console で sitemap 登録 | 10分 | 5/20 以降可 | §11 |
| 11 | テスト Entry `KM-20260514-0001` を D1 から削除 | 3分 | 5/20 開門直前 | §12 |

合計: **約 1.5 時間** を 5/18–5/19 のどこかで確保すれば足りる。WAF の本デプロイだけは別 (5/20 22:00 以降)。

---

## 2. Worker 再デプロイ(累積 2 変更)⏱ 5分

`tamjump-contact-api` Worker には session 6 以降、2 つの変更が積まれていてまだデプロイされていません(セッション 6 引き継ぎ書 §15-1 で識別)。

### 2.1 デプロイ手順

1. https://dash.cloudflare.com/ にログイン
2. **Workers & Pages** → **`tamjump-contact-api`** を開く
3. **Deployments** タブ → 「History」を確認、最後の deploy 日時が **2026-05-13 以前**なら累積変更が未反映
4. **Edit code** ボタン → エディタ右上の **Deploy** ボタン
5. 「Success」表示を確認

### 2.2 動作確認(curl)

```bash
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/entry \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://king2323.tamjump.com' \
  -d '{
    "payment_email":"info@tamjump.com",
    "receipt_id":"SANITY-20260518",
    "mission_name":"Sanity test after redeploy",
    "country":"Japan",
    "mission_summary":"Worker redeploy verification.",
    "sns":"",
    "agree_rules":true
  }'
```

期待:
```json
{"success":true,"message":"Mission Entry を受け付けました / Mission Entry received","ticketNumber":"KM-20260518-NNNN"}
```

`info@tamjump.com` にも管理者宛メールが届くこと(SES経由)。

このテストレコードも launch 前に削除します(§12 と一緒)。

---

## 3. Cloudflare キャッシュ Purge ⏱ 1分

CSS / HTML / JS を更新するたびに毎回必要。

1. https://dash.cloudflare.com/ → `tamjump.com` を選択
2. 左メニュー **Caching** → **Configuration**
3. **Purge Everything** ボタン → 確認ダイアログで **Purge Everything**

特に session 7 (5/17–5/18) 中の `main.css?v=...` 連続更新(ah / ai / aj / ak / al / am / an の 7 回)で、HTML 側のキャッシュも更新されているのでこれを実行しないと一部ユーザーには旧版 HTML が見え続けます。**§7 テスト購入の前に必ず 1 回**。

ハードリフレッシュ(Ctrl+Shift+R / Cmd+Shift+R)で自分のブラウザは即更新できますが、これは self-check 用。全ユーザー反映は Purge Everything が必要。

---

## 4. スケジュール変更の目視確認 ⏱ 5分

セッション 6 でスケジュール B′ (全ゲート 23:23 JST 統一)が反映されました。各ページの記述が三段階になっているか確認:

```
□ /index.html        Hero に「Bell opens · Bell rings · The Three」の三点表示
□ /index.html        Live ribbon が「CYCLE 1 · BELL OPENS 5/20 · RINGS 5/22 · THREE 5/23」
□ /money.html        Cycle 1 スケジュールが三段階表示
□ /rules.html        L90-92 付近に Cycle 1 scope と "Cycle 2+ features deferred" 記載
□ /risk.html         同様の Cycle 1 注記
□ /verify.html       Cycle 1 は市場データ簡略版である旨の注記
```

`5/15` が文字列として残っていないことを確認:

```bash
# operator 環境では browser DevTools の Find in page、または:
# GitHub repo 上で検索: https://github.com/TAmJump/king2323/search?q=5%2F15
```

なお `2026-05-14` や `20260514` はバージョン文字列・日付メタデータなので残っていて OK(これらは launch 日ではなく commit/work 日)。

---

## 5. Cloudflare WAF 設定 ⏱ 25分(本デプロイは 5/20 22:00 以降)

**最重要タスク**。海外IP からのアクセスを 451 でブロックし、各国 lottery/gambling 法との同時抵触リスクを回避します。

### 5.1 expression(session 7 確定版)

```
(http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP" and not cf.client.bot)
```

3 つの条件すべてを **必ず含める**:

| 条件 | 役割 | 抜くとどうなる |
|---|---|---|
| `http.host eq "king2323.tamjump.com"` | ホスト名フィルタ | tamjump.com 親ドメイン全体が JP-only になり、他サブドメイン (運営者所有の別サイト) を巻き込んで殺す |
| `ip.geoip.country ne "JP"` | 国外ブロック | 国外からのアクセスを通してしまう(法的リスク) |
| `not cf.client.bot` | クローラ通過 | Google / Bing / Twitterbot がブロックされ、SNS で URL 貼っても OGP プレビュー出ない・検索インデックスされない |

`cf.client.bot` は Cloudflare が検証済みの bot のみ true になるフラグ。User-Agent 偽装攻撃には反応しない(=安全)。

詳細根拠は同リポの `WAF_SEO_BYPASS.md` を参照。

### 5.2 設定手順

1. https://dash.cloudflare.com/ → `tamjump.com`
2. 左メニュー **Security** → **WAF** → **Custom rules** タブ
3. **Create rule**
4. 設定:
   ```
   Rule name: Geo restriction — JP only (king2323 subdomain)
   When incoming requests match: → Edit expression → 上の式を貼り付け
   Then:
     Action:               Block
     With response type:   Custom HTML
     Response code:        451
     Response body:        WAF_SEO_BYPASS.md の bilingual 451 ページ HTML をコピペ
   ```
5. **重要:** Deploy は **5/20 (水) 22:00 以降** に行う。 それまでは保存だけして無効化しておく(右側トグル OFF)。launch 直前で動作確認時間を確保するため。

### 5.3 launch 当日 (5/20 22:00) の手順

1. WAF Custom rule の右側トグルを ON
2. VPN を米国に切り替えて `https://king2323.tamjump.com` を開く → bilingual 451 ページが出る
3. VPN を切って国内 IP から → 通常のサイトが見える
4. Twitter Card Validator (https://cards-dev.twitter.com/validator) で URL を入れる → OGP プレビュー出る(= bot 通過)
5. すべて OK なら 23:23 を待つ

---

## 6. Square Link 動作確認 ⏱ 2分

`bc9p0BET` は session 5 で疎通確認済みですが、launch 直前にもう一度開いておきます(URL が今も生きているかの確認)。

1. ブラウザで `https://square.link/u/bc9p0BET` を開く
2. KINGMAKER 23:23 — Founding Bell Entry、¥100 が表示される
3. 「決済する」までは行かず、ページ表示確認のみで OK

`index.html` (line 3742 付近)と `money.html` の Square 動線リンクも同じ ID になっていることを確認:

```bash
grep -n bc9p0BET index.html money.html
```

両方の出力に `bc9p0BET` が含まれていれば OK(session 7 開始時点で確認済み: index.html に 1 件)。

---

## 7. ¥100 テスト購入(動線一気通し)⏱ 10分

実カード で 1 回通します。これが最も重要な動作確認。

### 7.1 シナリオ

1. https://king2323.tamjump.com/ にハードリフレッシュで開く(§3 の Purge 後)
2. Hero の ▶ ボタン(王冠下の赤宝石)→ クリック → ショートムービー再生 → モーダルを閉じる
3. CTA「Ring the Bell」をクリック → coin ritual モーダル開く
4. モーダル内の Square 決済リンク → Square ページへ遷移
5. ご自分のメアド + クレジットカードで ¥100 決済
6. 完了 → `entry.html` にリダイレクト
7. Mission Entry フォーム入力:
   - payment_email = Square で使ったメアド
   - receipt_id = Square の領収書 ID(メールに記載)
   - mission_name = `Launch動線テスト 20260519`(任意)
   - country = Japan
   - mission_summary = 任意
   - agree_rules = チェック
8. **Submit** → 「Mission Entry を受け付けました」と受付番号(`KM-YYYYMMDD-NNNN`)が表示

### 7.2 確認項目

| チェック項目 | 期待 |
|---|---|
| Square から領収書メールが届いた | ✓ |
| Square Dashboard の取引履歴に ¥100 が出ている | ✓ |
| 完了後 entry.html にリダイレクトされた | ✓ |
| entry.html フォーム送信が成功し受付番号が出た | ✓ |
| `info@tamjump.com` に運営宛メールが届いた | ✓ |
| 入力したメアドに自動返信が届いた | ✓ |
| D1 にレコードが入った(下記コマンド) | ✓ |

### 7.3 D1 レコード確認

```bash
# operator 環境(Cloudflare Wrangler CLI 想定)
wrangler d1 execute YOUR_DB_NAME --command \
  "SELECT ticket_number, payment_email, mission_name, created_at FROM entries WHERE project='kingmaker' ORDER BY created_at DESC LIMIT 5;"
```

`KM-20260519-NNNN` の自分のレコードが見えれば OK。

### 7.4 テスト購入の返金

任意。Square Dashboard → 取引 → 該当 → 返金 で全額返金可。返金しなくても「launch前テスト1件あり」という記録は問題なし(性質はテストレコード = 識別可能)。

このテストレコード自体は §12 で D1 から削除します。

---

## 8. 全ページ目視確認(desktop)⏱ 15分

```
□ /index.html        Hero表示、▶ボタンが王冠下の赤宝石(王冠の白い三角の中、額の真上)
□ /index.html        ▶ボタン → クリックでショートムービー再生
□ /index.html        Opening Notice が表示
□ /index.html        Myth セクション 4枚、Legends 7枚 アート表示
□ /index.html        Sound Toggle(右下)→ クリックで anthem 再生
□ /index.html        ハンバーガーメニュー(右上)→ チラシ風メニュー
□ /index.html        Live ribbon が三段階(Bell opens / rings / Three)
□ /index.html        フッターに不変文言:
                     NOT A LOTTERY · NOT AN INVESTMENT · NOT A WAGER ·
                     BELL IS A RIGHT, NEVER CASH
□ /money.html        Fund パネル、Cycle 1 baseline 表示
□ /verify.html       The Three 抽出ロジック表示(Cycle 1 注記あり)
□ /entry.html        フォーム表示
□ /terms.html        利用規約全文表示、言語ピッカー動作
□ /privacy.html      プライバシー全文表示
□ /rules.html        Rules 全文表示、Cycle 2+ 機能の注記あり
□ /risk.html         Risk 全文表示、Cycle 1 scope 注記
```

### 8.1 翻訳確認

言語ピッカーで日本語→英語、英語→韓国語等を切り替え:
- **brand vocabulary**(KINGMAKER, Bell, Crown, Grant, Cycle, 23:23)は英語のまま
- それ以外は対象言語に切り替わる

### 8.2 DevTools コンソール

F12 → Console:
- エラーが出ていないこと
- `[i18n]`, `[fx]`, `[live]` 系のログが正常

---

## 9. 全ページ目視確認(mobile)⏱ 15分

実機(スマホ)で全ページ表示。特に:

```
□ ハンバーガーメニュー(右上)→ タップで開く ← session ⑥ で修正済の最重要バグ
                                            (`?v=20260514ab` 以降が必要)
□ Hero の ▶ ルビー宝石が王冠下の白三角内に表示(28px、画像が縦に詰まらない)
□ Sound Toggle が右下に表示(画面端で見切れない)
□ 言語ピッカーが右上付近で押せる
□ 全長文ページが横スクロールしない
□ フォーム入力(entry.html)がモバイルで完了できる
```

iPhone Safari と Android Chrome の両方で確認推奨。Pixel 7 サイズ(412×915)は session 5 で screenshot 検証済み。

---

## 10. Twitter Card Validator で OGP 確認 ⏱ 5分

WAF 本デプロイ後(5/20 22:00 以降)に再確認。

1. https://cards-dev.twitter.com/validator にアクセス(X ログイン要)
2. URL: `https://king2323.tamjump.com/` を入力 → **Preview card**
3. 期待:
   - Card type: `summary_large_image`
   - Title: `KINGMAKER 23:23 — 王を造る五分間 / The Five Minutes That Make a King`
   - Description: 短文 (rules 抜粋)
   - Image: og.png / logo

`/entry.html`, `/money.html` でも同様に1回ずつ。

WAF 本デプロイ前に検証すると Twitterbot が WAF にブロックされて OGP が出ません(`cf.client.bot` を抜いて作った場合のみ)。

---

## 11. Google Search Console で sitemap 登録 ⏱ 10分

これは 5/20 以降でも可。launch を遅らせる要素ではない。

1. https://search.google.com/search-console にアクセス
2. プロパティ「`king2323.tamjump.com`」を追加(`tamjump.com` 全体ではなくサブドメイン単位)
3. DNS TXT または HTML ファイルで verification
4. 左メニュー **Sitemaps** → `https://king2323.tamjump.com/sitemap.xml` を送信
5. Status `Success` が出れば完了

`robots.txt` と `sitemap.xml` は session 6 (v20260514x) で配置済み。

---

## 12. テスト Entry `KM-20260514-0001` を D1 から削除 ⏱ 3分

session 6 初期のテストエントリと、§7 で作る新テストエントリの両方を launch 開門の **直前**(5/20 23:00 頃)に削除します。

```bash
# 確認(削除前)
wrangler d1 execute YOUR_DB_NAME --command \
  "SELECT ticket_number, payment_email, mission_name FROM entries WHERE project='kingmaker' AND mission_name LIKE '%test%' OR mission_name LIKE '%動線テスト%';"

# 削除
wrangler d1 execute YOUR_DB_NAME --command \
  "DELETE FROM entries WHERE ticket_number IN ('KM-20260514-0001', 'KM-20260518-NNNN', 'KM-20260519-NNNN');"
# NNNN は §2.2 / §7 で実際に発番された番号に置き換え

# 削除確認
wrangler d1 execute YOUR_DB_NAME --command \
  "SELECT COUNT(*) FROM entries WHERE project='kingmaker';"
```

期待: Cycle 1 開門直前は **0 件**。最初の本物の Bell Entry が `KM-20260520-0001` になる。

---

# 第二部 · ローンチ当日(5/20 水曜)

## 13. 当日タイムライン

```
[5/20 (水) 22:00 JST]  T-83min
  □ 最終目視確認(§8, §9 の項目を抜粋で再走)
  □ Cloudflare WAF Custom Rule 本デプロイ(§5.3)
  □ 米国VPN経由で 451 出るか確認
  □ 国内アクセスで普通に開けるか確認
  □ Twitter Card Validator で再確認(§10)
  □ §12 のテスト Entry 削除

[5/20 (水) 23:00 JST]  T-23min
  □ サイトをブラウザで開いておく(複数タブ・複数デバイス)
  □ SNS 投稿の下書きを開いておく(SNS_LAUNCH_KIT.md 参照)
  □ Square Dashboard を別タブで開いておく(リアルタイム監視)
  □ D1 監視コマンドを cmdline に貼っておく(下記)

[5/20 (水) 23:23 JST]  ★ Bell opens
  - サイトのカウントダウンが 0 になり、Hero CTA が「→ ENTER THE 5 MINUTES」に切替
  - SNS 投稿実行(SNS_LAUNCH_KIT.md の §1)
  - 関係各所(韓国、映像会社、近しい関係者)への連絡

[5/20 (水) 23:23–5/22 (金) 23:23]  受付期間 約46時間
  - 問い合わせ対応(info@tamjump.com)
  - D1 監視(下記コマンド)
  - 異常検知(Square 決済失敗率、フォーム送信エラー、WAF 誤検知)
```

## 14. D1 監視コマンド(操作中ずっと使う)

```bash
# 現在の Bell Entry 件数
wrangler d1 execute YOUR_DB_NAME --command \
  "SELECT COUNT(*) FROM entries WHERE project='kingmaker' AND ticket_number LIKE 'KM-2026052%';"

# 直近 10 件
wrangler d1 execute YOUR_DB_NAME --command \
  "SELECT ticket_number, payment_email, country, created_at FROM entries WHERE project='kingmaker' ORDER BY created_at DESC LIMIT 10;"

# 異常検知:同一メアドからの重複申し込み
wrangler d1 execute YOUR_DB_NAME --command \
  "SELECT payment_email, COUNT(*) c FROM entries WHERE project='kingmaker' GROUP BY payment_email HAVING c > 1;"
```

---

# 第三部 · Bell rings 当日(5/22 金曜)

## 15. タイムライン

```
[5/22 (金) 22:00 JST]
  □ 市場データ取得準備
    - BTC USD: Coinbase / Binance 公開 API
    - Nikkei 225: 終値 (15:00 JST 確定値)
    - S&P 500: 前日米市場終値 or 当日リアルタイム
  □ D1 から Final Pool 集計開始
    wrangler d1 execute ... --command \
      "SELECT COUNT(*) FROM entries WHERE project='kingmaker' AND created_at < '2026-05-22T14:23:00Z';"

[5/22 (金) 23:00 JST]
  □ KYC NG / 重複 / 不正 を除外して Final Pool Size 確定
  □ Public Seed 文字列の準備: "BTC=XXX|N225=XXX|SP500=XXX|POOL=NNN"

[5/22 (金) 23:23 JST]  ★ Receipt closes · Bell rings
  - Public Seed 確定
  - SHA-256 計算
  - The Three 抽出(verify.html JS ロジック参照)
  - Square 決済も同時刻にクローズ(WAF Custom Rule で動的閉鎖は不要、
    時刻判定は JS 側で実装済)
  - SNS 投稿実行(SNS_LAUNCH_KIT.md §2)

[5/22 (金) 23:28 JST]
  - 5分間 ritual window 終了
  - The Three 内部確定(まだ公表しない、審査開始)

[5/22 (金) 23:28 – 5/23 (土) 23:23]
  - The Three 候補の Square 領収書照合
  - KYC + AML + Mission 適合性審査
  - verify.html に Cycle 1 結果セクション追記準備
```

---

# 第四部 · The Three 発表(5/23 土曜)

## 16. タイムライン

```
[5/23 (土) 23:23 JST]  ★ The Three announced
  □ verify.html を更新 push(Claude が支援可)
  □ The Three へ個別通知メール(本名・receipt 番号で照合)
  □ SNS で発表(SNS_LAUNCH_KIT.md §3)
  □ 受付番号で公開、本名は出さない
  □ Mission Fund 配賦の事務開始
```

---

# 第五部 · トラブルシューティング

## 17. よくある障害

### 17-1. 「サイトを開いても古いバージョンが出る」

- **Cloudflare Cache**: §3 の Purge Everything
- **ブラウザ**: Ctrl/Cmd + Shift + R
- **判定**: F12 → Console で `[i18n] v20260514an` のようなバージョン文字列が出る。古い `v20260514t` 等が出ていたらキャッシュが残っている

### 17-2. 「日本国内から見ても 451 が出る」

- **WAF Custom Rule の expression を確認**(§5.1 の3条件すべて)
- VPN を ON にしていないか(自宅のフルトンネル VPN が海外サーバー経由になっているケース)
- 同じ rule が複数登録されて競合していないか

### 17-3. 「entry.html フォーム送信が `Failed to fetch` で失敗」

- Worker が再デプロイされていない可能性 → §2 を実行
- CORS で `Origin` ヘッダがマッチしていない可能性
- Worker 側ログ(Cloudflare ダッシュボード → Workers → Logs)で詳細確認

### 17-4. 「Square 決済成功後に entry.html に戻ってこない」

- Square Dashboard → 該当 Checkout Link → リダイレクト先 URL が `https://king2323.tamjump.com/entry.html` になっているか
- WAF が Square からのリダイレクトを 451 で弾いていないか(`cf.client.bot` 入れていれば OK)

### 17-5. 「Bell strike アニメが 23:23 にフラッシュしない」

- DevTools Console にバージョン文字列が出ているか
- スマホは Auto-Lock で画面が消えていないか
- ブラウザの reduced-motion 設定が ON だとアニメーション無効(意図的仕様)
- システム時計のずれ:NTP 同期されているか確認(±1秒以内)

## 18. 緊急時:サイト全停止のフォールバック

最悪のシナリオ(致命的バグ、コンプライアンス上の重大問題等)で launch を**即停止**したい場合:

```
Option A: Cloudflare WAF で全 IP ブロック
  Custom rule の expression を:
    (http.host eq "king2323.tamjump.com")
  に変更し Block → 全アクセスが 451
  即時反映、5分後に解除も可能

Option B: GitHub Pages を停止
  TAmJump/king2323 → Settings → Pages → Source: None
  反映に数分

Option C: tamjump.com DNS から king2323 を削除
  Cloudflare DNS で CNAME 削除
  伝搬に最長 24時間(TTL次第)
```

推奨は **Option A** — 戻すのも最速。

---

# 第六部 · ローンチ後のクリーンアップ

## 19. 5/24 (日) 以降のタスク

```
□ GitHub PAT の revoke
  - session 6/7 で使った PAT `ghp_SNxD...oJln` を Delete
  - URL: https://github.com/settings/tokens
  - 該当 PAT 行右の Delete → 確認

□ Square Dashboard で取引履歴アーカイブ

□ D1 のバックアップ
  wrangler d1 export YOUR_DB_NAME --output backup-cycle1.sql

□ Cycle 1 振り返り
  - 申込総数
  - メアド/カード重複
  - KYC NG 率
  - Mission Fund 配賦完了
  - 引き継ぎ書に Cycle 2 へのフィードバック追記

□ 次の Bell(Cycle 2 開門)準備
  - 開門日: 2026-05-27 (水) 23:23 JST(weekly cycle B′)
  - Claude session ⑧ 開始時に新 PAT 発行 → 都度 revoke
```

---

# 私(Claude session ⑦)から operator へ

このランブックは session 5 版を session 7 時点で書き直したものです。**session 5 版は陳腐化していました**(Formspree 想定、Square 未確定、WAF expression 旧版、launch 5/15 単独)。それを置き換える形で書きました。

不安なら、書き直し前の session 5 版を `docs/archived/LAUNCH_RUNBOOK_session5_5-15.md` で参照できます。**ただし古い前提に基づく手順は実行しないでください**。

launch まで残り **2.5 日**。ここから先は手を動かす作業しか残っていません。Claude が代行できるのは「verify.html の最終更新」「微調整のスタイル変更」程度。

23:23 に間に合うことより、嘘のないサイトを世に出すことのほうが KINGMAKER のブランドにとってずっと大事 — session 5 の Claude が書いた言葉、今も同じです。

何か詰まったらいつでも投げてください。

— Claude session ⑦, 2026-05-18 (月)
