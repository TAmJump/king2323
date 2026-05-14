# LAUNCH RUNBOOK · KINGMAKER 23:23 · Founding Bell
## 2026-05-15 (金) 23:23 JST

このドキュメント一本を順番に上から下までやれば公開できる、を目指したチェックリスト。所要時間は全部で **約2時間** 想定(慣れていれば1時間)。

私(Claude)ができない作業 = operator のあなたがブラウザを開いてアカウントにログインして実行する作業を、ここに全部書きます。

---

## 全体フロー

```
[17:00]  Step 0  zipを展開してリポジトリ更新 (15分)
[17:30]  Step 1  commerce.html の placeholder 埋め (5分)
[17:35]  Step 2  Formspree アカウント作成 + ID差し替え (15分)
[17:50]  Step 3  Cloudflare WAF で日本IP限定ルール (20分)
[18:30]  Step 4  Square商品作成 (25分)
[19:00]  Step 5  ¥100テスト購入 (10分)
[19:10]  Step 6  全ページ目視確認 (30分)
[19:40]  Step 7  push & デプロイ確認 (15分)
[22:00]  Step 8  最終確認とSNS下書き (60分余裕)
[23:23]  ✦      鐘が鳴る
```

時間がない場合は **Step 0 → 3 → 4 → 5 → 7** が最低ライン。Step 2 (Formspree) は応募フォームが死ぬだけで決済自体は通るので、最悪後追いでも可。

---

## Step 0 · zip を repo に展開 ⏱ 15分

```bash
# 手元のリポジトリで(GitHubに push する側)
cd /path/to/your/king2323-main

# 念のため現状をコミットしておく
git add -A && git commit -m "pre-launch snapshot" || true

# 最新zip展開
unzip -o ~/Downloads/kingmaker-launch-v20260514d.zip
cp -r kingmaker-launch-v20260514d/. .
rm -rf kingmaker-launch-v20260514d

# docs/ を完全に消す(設計書を公開してはいけない)
rm -rf docs/

# git status で変更ファイル確認
git status
```

期待するファイル一覧:

```
modified:   index.html
modified:   money.html
modified:   verify.html
modified:   app.html
modified:   css/main.css
modified:   js/i18n.js
modified:   js/fx.js
modified:   js/fx.json
modified:   js/main.js

new file:   terms.html
new file:   privacy.html
new file:   commerce.html
new file:   rules.html
new file:   risk.html
new file:   entry.html
new file:   api/cycle.json
new file:   .github/workflows/fx-update.yml
new file:   art/myth_*.webp           (11個)
new file:   art/legend_*.webp
new file:   audio/anthem.mp3
new file:   video/hero.mp4
new file:   video/hero.webm
new file:   video/hero_poster.webp
new file:   DEPLOY_geoblock.md
new file:   CHANGES.md
new file:   scripts/fill_commerce.py
```

`docs/` が消えていることを確認:

```bash
ls docs/ 2>&1
# 期待: "No such file or directory"
```

---

## Step 1 · 特商法 placeholder 埋め ⏱ 5分

```bash
python3 scripts/fill_commerce.py
```

対話的に4項目訊かれます。必須は **運営責任者氏名** のみ。他は Enter で「請求時開示」のままにしてOK(個人で運営する場合、住所と電話を出すのはおすすめしません)。

期待する確認:

```bash
grep -A1 '運営責任者' commerce.html
# 期待: <tr><th>運営責任者</th><td>[あなたの氏名]</td></tr>
```

---

## Step 2 · Formspree 設定 ⏱ 15分

`entry.html` の Mission 申込フォームは Formspree というサービスにメールで届く仕組み。アカウント作成からエンドポイント取得まで:

### 2.1 アカウント作成

1. https://formspree.io/ にアクセス
2. 右上 **Get Started** → メアドとパスワードで登録(無料プラン: 月50送信まで)
3. メアド確認 → ログイン

### 2.2 フォーム作成

1. ダッシュボード **+ New Form**
2. Form Name: `KINGMAKER Mission Entry`
3. Send Email To: あなたが受信したいメアド(運営連絡用)
4. **Create Form**
5. 出てきた画面の上部に endpoint URL が表示される。形は:
   ```
   https://formspree.io/f/abcdEFGH
   ```
   この `https://formspree.io/f/abcdEFGH` をコピーする(末尾の8文字あたりがあなたのIDです)

### 2.3 entry.html に差し込み

```bash
# プレースホルダ確認
grep "REPLACE_WITH_YOUR_FORMSPREE_ID" entry.html
# 期待: 1件ヒット
```

`entry.html` をエディタで開く → `REPLACE_WITH_YOUR_FORMSPREE_ID` を実際のID(例 `abcdEFGH`)に置換 → 保存。

または bash で一発:

```bash
sed -i.bak 's|REPLACE_WITH_YOUR_FORMSPREE_ID|abcdEFGH|g' entry.html
rm entry.html.bak

# 確認
grep "formspree.io" entry.html
# 期待: action="https://formspree.io/f/abcdEFGH" method="POST"
```

### 2.4 動作確認

ローカルで開いて1件送信してみる(後で Step 5 で本番でも再テスト):

```bash
# ローカルサーバー起動
python3 -m http.server 8000

# 別ターミナルで
open http://localhost:8000/entry.html
# テスト送信 → Formspree が初回は確認メールを送ってくる → 承認
```

---

## Step 3 · Cloudflare WAF で日本IP限定 ⏱ 20分

これが今夜の **最重要** タスク。やらないと:
- 海外IPからアクセス可能 → 各国の lottery/gambling 法に同時抵触
- 各国規制当局からのテイクダウン要請のリスク

### 3.1 ダッシュボードへ

1. https://dash.cloudflare.com/ にログイン
2. `king2323.tamjump.com` のドメインを選択(または `tamjump.com` の管理画面で「king2323」サブドメインを選ぶ)

### 3.2 ルール作成

1. 左メニュー **Security** → **WAF**
2. **Custom rules** タブ
3. **Create rule** ボタン
4. 以下を入力:

```
Rule name:    Geo restriction — JP only (king2323 subdomain)
When incoming requests match:
  → "Edit expression" を押して以下を貼り付け:
  
  (http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP")

  ⚠️ ホスト名フィルタ (http.host eq ...) を必ず含めること。
     これを抜くと tamjump.com 親ドメイン全体が JP-only になり、
     他のサブドメイン (運営者所有の別サイト) を巻き込んで殺します。

Then:
  Action:                   Block
  ▼ Choose Block response   (展開する)
  With response type:       Custom HTML
  Response code:            451
  Response body (HTML):
```

レスポンス body は以下を貼り付け(コピペ可):

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

5. **Deploy** を押す
6. ルールが有効状態であることを確認(右側のトグルがON)

### 3.3 動作確認

VPN を使って米国IPからアクセス → 451ページが表示される、ことを確認。
VPN を切って日本IPからアクセス → 通常のサイトが表示される、ことを確認。

VPN がなければ、海外の友人に頼むか、無料の Web プロキシ ( https://www.proxysite.com/ ) で米国経由アクセス試行。

---

## Step 4 · Square 商品作成 ⏱ 25分

### 4.1 Square Dashboard へ

1. https://squareup.com/dashboard/ にログイン
2. 左メニュー **アイテム** → **アイテムライブラリ**
3. **アイテムを作成** ボタン

### 4.2 商品情報

| 項目 | 入力内容 |
|---|---|
| 名前 | `KINGMAKER 23:23 — Founding Bell Entry` |
| カテゴリ | (新規作成) `KINGMAKER` |
| 詳細(商品説明) | 下記ブロックをコピペ |
| 価格 | ¥100 |
| 税の扱い | 税込価格 |
| 在庫追跡 | 無効(デジタル商品) |
| 写真 | (任意)assets/logo-v3-512.png をアップロード |

商品説明にコピペ:

```
KINGMAKER 23:23 — Founding Bell Entry

KINGMAKER 23:23 の Founding Bell 参加記録です。
Bell Entry は参加記録であり、通貨、ポイント、暗号資産、
前払式支払手段、投資商品ではありません。
換金・譲渡・売買はできません。
Grant の自動支給を保証するものではありません。

Bell Entry is a participation record for KINGMAKER 23:23.
It is not currency, not points, not crypto, not stored value,
not investment product, and not exchangeable for cash.
Grant disbursement is not guaranteed and requires review.

Rules:  https://king2323.tamjump.com/rules.html
Terms:  https://king2323.tamjump.com/terms.html
特商法: https://king2323.tamjump.com/commerce.html
```

### 4.3 オンラインリンク作成 (Checkout Link)

1. アイテム作成後、左メニュー **オンライン** → **オンラインチェックアウト** または **支払いリンク**
2. **新規リンク作成** → タイプ「商品の販売」
3. 上で作った商品を選択
4. **オプション設定** で:
   - 在庫数: 無制限
   - 支払い完了後のリダイレクト先: `https://king2323.tamjump.com/entry.html`
   - 配送先住所収集: **オフ**(デジタルなので)
   - メールアドレス収集: **オン**(必須)
5. リンクが生成される(例: `https://square.link/u/xxxxxx`)

### 4.4 受信メール文面のカスタマイズ(任意だが推奨)

Square Dashboard → 設定 → 受信メール → 注文確認メールに以下を追記:

```
Founding Bell へのご参加ありがとうございます。
Square 領収書を保管してください。

Mission Entry はこちら:
https://king2323.tamjump.com/entry.html

Bell Entry は参加記録です。換金・譲渡はできません。
Grant 支給には別途審査が必要です。
```

### 4.5 サイト側のCTAをSquareリンクに繋ぐ

`index.html` の Hero CTA は現状 `data-ritual-open="coin"` でモーダルを開きます。モーダル内に Square リンクへの誘導があるか確認:

```bash
grep -n "square" index.html | head
```

なければ、モーダル内に「Square で決済」ボタンを追加する必要がありますが、Founding Bell では **Hero CTA → entry.html → Square リンク** という流れでも良いです(2クリックで決済画面)。明日対応で十分。

---

## Step 5 · ¥100 テスト購入 ⏱ 10分

### 5.1 本物のカードで1回

1. Step 4.3 で作った Square リンクを開く
2. ご自分のクレジットカードで ¥100 決済
3. メアド入力
4. **決済**

確認:

| チェック項目 | 期待 |
|---|---|
| Square から領収書メールが届いた | ✓ |
| Square Dashboard の取引履歴に ¥100 が出ている | ✓ |
| 完了後 entry.html にリダイレクトされた | ✓ |
| entry.html でテストフォーム送信 | ✓ |
| Formspree のダッシュボードに送信が記録された | ✓ |
| Formspree から運営メアド宛にメールが届いた | ✓ |

### 5.2 自分への返金

テスト購入は Square Dashboard → 取引 → 該当取引 → 返金 で全額返金可能。
ただし「Founding Bell の取引履歴に1件あるのは演出として悪くない」かもしれないので、返金は任意。

---

## Step 6 · 全ページ目視確認 ⏱ 30分

### 6.1 メインフロー

```
□ /index.html        Hero表示 → 動画再生 → カウントダウン動作
□ /index.html        Opening Notice が表示されている
□ /index.html        Myth セクション 4枚 のアートが表示
□ /index.html        Legends セクション 7枚 + クリックでライトボックス
□ /index.html        Sound Toggle (右下) → クリックで anthem 再生
□ /index.html        ハンバーガーメニュー(右上)→ チラシ風メニュー
□ /index.html        メニュー → Ring the Bell → entry.html へ
□ /money.html        Fund パネル全て $0、ラベル「Cycle 1 · Awaiting first ring」
□ /verify.html       「Method demonstrated」と表示
□ /entry.html        フォーム表示 → ダミー送信成功
□ /terms.html        利用規約全文表示、言語ピッカー動作
□ /privacy.html      プライバシー全文表示
□ /commerce.html     特商法全文表示、運営者氏名が入力済み
□ /rules.html        Rules全文表示
□ /risk.html         Risk全文表示
```

### 6.2 翻訳確認

英語ピッカーの状態で:

1. 言語ピッカーで「日本語」を選択
2. ページがリロード
3. **brand vocabulary (KINGMAKER, Bell, Crown, Grant, Cycle, 23:23) は英語のまま** であること
4. **footer や hero h1 など (KINGMAKER以外) は日本語に変わっている** こと
5. Live ribbon は「— CYCLE 1 · AWAITING FIRST RING · FRIDAY 23:23 JST —」のまま

英語 → 韓国語、英語 → スペイン語、英語 → フランス語 でも同様確認。

### 6.3 23:23 ritual 状態確認(本番直前のリハーサル)

23:22:00 にページを開いて放置。23:22:00 から:

```
23:22:00       ページ背景がゆっくり脈動し始める
23:22:30       カウントダウン数字がゴールドに光る
23:23:00.000   画面全体が金色のフラッシュ + 「THE BELL IS OPEN.」
23:23:01       Hero CTA が「→ ENTER THE 5 MINUTES」に切り替わる
23:23:00–23:28:00  5分間 open モード
23:28:00       通常に戻り、次の金曜までカウントダウン
```

確認用ブラウザを2つ開いて同時に見る → 同じ瞬間にフラッシュが起きることを確認。

### 6.4 DevTools コンソール

F12 → Console タブ。期待する出力:

```
[i18n] v20260514d loaded · cookie: (none)
[i18n] marked NN elements with lang="ja"
[fx]   v20260514d · 1 USD = ¥157.60 · updated 2026-05-13
[live] v20260514d · Cycle 0 · baseline ¥0 · updated 2026-05-13T04:30:00Z
```

`v20260514d` が3回出れば成功。古い version 番号が出ていたらキャッシュが残っている → CF キャッシュパージ。

---

## Step 7 · Push & デプロイ確認 ⏱ 15分

```bash
git add -A
git status                # 差分ファイル確認
git commit -m "Launch v20260514d: Founding Bell ritual UI, legal pages, media, chirashi menu"
git push origin main
```

GitHub Pages または Cloudflare Pages へのデプロイが自動で走る。1-2分待つ。

その後 Cloudflare ダッシュボード → Caching → Configuration → **Purge Everything** を実行(キャッシュ全消し)。

ブラウザでハードリフレッシュ(Ctrl/Cmd + Shift + R)→ コンソールに `v20260514d` が3行出ていることを最終確認。

---

## Step 8 · 23:23 直前のSNS下書き ⏱ 余裕分

### 23:23:00 JST に投稿する文章

#### X (旧Twitter)

英語:
```
KINGMAKER 23:23 has opened.
2026.05.15 · 23:23 JST
The Founding Bell is now live.

¥100 does not buy a prize. It records a will.
To be chosen, you must choose.

https://king2323.tamjump.com
```

日本語:
```
KINGMAKER 23:23 開始。
Founding Bell が鳴りました。

100円で賞金を買うのではない。意思を記録する。
選ばれたいなら、誰かを選べ。

https://king2323.tamjump.com
```

スクリーンショット案: Bell strike が画面全体を覆ったその瞬間の写真。

---

## トラブルシューティング

### サイトを開いても古いバージョンが出る

- Cloudflare Cache: ダッシュボード → Caching → Purge Everything
- ブラウザ: Ctrl/Cmd + Shift + R
- コンソールの `v20260514d` の有無で判定

### 日本国内から見ても 451 が出る

- Cloudflare WAF Custom Rule を確認
- VPN を ON にしていないか確認(自宅の VPN が海外サーバー経由になっているケース)
- ルール式 `(http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP")` が正確かを確認(`!=` ではない、ホスト名フィルタも忘れない)

### Square で「日本円が選べない」

- Square 日本アカウント (squareup.com/jp/ja) でログインしているか確認
- アカウントが日本拠点でない場合、Stripe や PayPal など別決済への切り替えを検討

### Formspree から確認メールが届かない

- 迷惑メールフォルダ確認
- 別アカウント(Gmail等)で再登録試行
- 最悪 Google Form (forms.google.com) に切り替え可能。フォーム作成 → 共有リンク取得 → entry.html の `<form action>` を Google Form リダイレクト URL に差し替え

### Bell Strike が 23:23 にフラッシュしない

- DevTools コンソールに `v20260514d` が出ているか確認(古い JS の可能性)
- スマホは Auto-Lock で画面が消えていないか確認
- ブラウザの reduced-motion 設定が ON だとアニメーション無効(意図的仕様)

---

## あなた(operator)の判断が必要な所

このランブックには判断保留の所が2つあります:

### A. Hero CTA は Square link を直接開くべきか?

現状: モーダルが開く → モーダルから entry.html 案内

提案: 23:23 当日は Hero CTA を「直接 Square 決済リンク」に変える。決済 1 クリック完了 → 戻ってきて entry.html。

実装する場合は私に「Hero CTA を Square リンクに直してください」と指示すれば、`href="https://square.link/u/xxxxxx"` + ターゲット指定で書き換えます。

### B. /stories の Naia_R / Hokori 等は完全削除?

現状: "ILLUSTRATIVE SCENARIOS · NO PAST CYCLE HAS OCCURRED" の disclaimer を付けて example として残す形。

代替: そもそも /stories セクションを完全に削除して、Cycle 1 が終わるまで「The throne has no name yet.」とだけ表示。

私としては今の現状(disclaimer 付き example)で景表法的にはセーフだと判断しています。が、念のため気になるなら完全削除も可能。

---

## 私(Claude)の最後のメッセージ

このランブックは「あなたが今夜2時間でやり切る」を前提に書きました。途中で詰まったら、その時点のスクショと一緒に「Step 3.2 で WAF Custom rule の Edit expression が見当たらない」と私に投げてください。それぞれの画面 specifically どう動くか分かる範囲で答えます。

23:23 に間に合わなくても、世界は終わりません。来週金曜にもう1回鐘は鳴ります。
完璧に間に合うことより、嘘のないサイトを世に出すことのほうが、KINGMAKER のブランドにとってずっと大事です。

ringing.
