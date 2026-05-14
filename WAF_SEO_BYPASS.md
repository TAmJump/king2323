# WAF JP-Only + Search Engine Bypass

**作成:** 2026-05-14(session⑥ Claude)
**対象:** 大下さん(Cloudflare ダッシュボードで WAF を設定する人)
**緊急度:** 高(これを読まずに session5 の expression を使うと launch 後 Google にインデックスされない)

---

## 何が問題か

`HANDOFF_2026-05-14_session5.md` の Step 3(Cloudflare WAF)で示されている expression:

```
(http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP")
```

これを `Block` アクションでデプロイすると:
- **国内IP のユーザー** → 通常通り閲覧 ✓
- **海外IP のユーザー** → 451 ページ ✓(これは意図通り、法的に必要)
- **Google/Bing/Twitter/Facebook のクローラ** → 451 ページ ✗(意図せず)

クローラはほぼ全て US/EU データセンターから来る。`king2323.tamjump.com` を WAF で完全に JP-only にすると、**launch 後 Google・Bing は永遠にインデックスを作れない**。検索流入はゼロ。

X(Twitter)に URL を貼っても、Twitter のクローラが metadata を取得できないので、せっかく session6 で追加した OGP も活かせず、URL がプレーンに展開される(画像・タイトル・description が表示されない)。

---

## 修正版 expression

```
(http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP" and not cf.client.bot)
```

追加した部分:`and not cf.client.bot`

- `cf.client.bot` は Cloudflare が verified した「known good bot」だけを true にするフラグ
- Googlebot、Bingbot、Twitterbot、facebookexternalhit、LinkedInBot、Slackbot、Discordbot 等を **Cloudflare が IP レンジ + reverse DNS で検証済み** のもののみ対象
- 偽装した bot(User-Agent だけ Googlebot と名乗る攻撃者)は `cf.client.bot` で true にならないので、勝手にバイパスされない

---

## デプロイ後の挙動マトリクス

| アクセス元 | host | bot? | 結果 |
|---|---|---|---|
| 国内 Mac | king2323.tamjump.com | no | ✓ 通常表示 |
| 海外スマホ(個人) | king2323.tamjump.com | no | ✗ 451 ページ |
| Googlebot(US IP) | king2323.tamjump.com | yes | ✓ 通過(インデックス可能) |
| Twitterbot(US IP) | king2323.tamjump.com | yes | ✓ 通過(OGP 取得可能) |
| 海外 IP 偽装Googlebot UA | king2323.tamjump.com | no | ✗ 451 ページ(偽装は弾く) |
| 親ドメイン tamjump.com | tamjump.com | -    | ✓ 一切影響なし |

---

## 「海外IP でも検索結果からのクリックで来てしまうのでは?」

その通り。だがそれは設計上想定範囲。

1. 海外検索ユーザーが Google で `KINGMAKER 23:23` を検索 → ヒットする
2. クリック → 451 ページ表示(「This is currently only available in Japan」)
3. 海外ユーザーは「日本限定なのね」と理解して離脱

この導線は、海外ユーザーに「日本でこういうことをやっている」という認知を与えつつ、**実際の参加はブロックする**ので、法務的に問題ない。むしろ、海外プレスや関係者が internal で読めるので、認知拡大には有利。

**逆にやってはいけないのは、Googlebot をブロックして「インデックス自体ができない」状態にすること。** これだと国内ユーザーも検索で辿り着けなくなる(`site:king2323.tamjump.com` が 0 件になる)。

---

## デプロイ手順(`HANDOFF_2026-05-14_session5.md` Step 3 の差し替え)

session5.md の手順をベースに、**expression と Response body だけ** 以下に差し替え:

### Expression(「Edit expression」モード)

```
(http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP" and not cf.client.bot)
```

⚠️ `http.host eq "king2323.tamjump.com"` を必ず含める。抜くと
tamjump.com 親ドメイン全体が JP-only になり、コーポレートサイトを
殺します(session5.md の同じ警告)。

### Response body(英語と日本語の両方を表示する版に強化)

`HANDOFF_2026-05-14_session5.md` の Response body は英語のみ。session6
時点で気付いたが、海外ユーザーが 451 を踏んだ時に「日本語と英語の
両方で説明があった方が、関係者向けにも親切」だと判断。下記に差し替え:

```html
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>451 — Unavailable in your region</title>
<style>
body { font-family: Georgia, 'Noto Serif JP', serif; background:#0f0e0c; color:#d4c8a8;
       display:flex; align-items:center; justify-content:center;
       min-height:100vh; margin:0; padding:32px; line-height:1.7; }
.box { max-width:580px; text-align:center; }
h1 { font-size:64px; margin:0 0 4px; color:#d4af37; letter-spacing:0.02em; font-weight:400; }
.sub { font-family:monospace; font-size:11px; letter-spacing:0.3em;
       color:#988868; margin-bottom:40px; text-transform:uppercase; }
p { font-size:14px; color:#b8a888; margin:0 0 14px; }
p.jp { font-family:'Noto Serif JP', serif; font-size:13px; color:#988868; }
em { color:#d4af37; font-style:italic; }
.meta { margin-top:40px; font-family:monospace; font-size:10px;
        letter-spacing:0.25em; color:#5a5240; text-transform:uppercase; }
</style></head><body>
<div class="box">
<h1>451</h1>
<div class="sub">— Unavailable For Legal Reasons —</div>
<p>KINGMAKER 23:23 is currently only available within Japan.</p>
<p class="jp">現在、KINGMAKER 23:23 は日本国内のみで提供しています。</p>
<p style="margin-top:28px;">The platform is operating in compliance with Japanese law. Operation in other jurisdictions requires per-country legal review, which has not yet been completed.</p>
<p class="jp">他国法令への適合審査は未完了のため、当該地域からのご利用はお受けしておりません。</p>
<p style="margin-top:28px;"><em>We are not accepting registrations or payments from this region.</em></p>
<div class="meta">23:23 · the bell rings every Friday · operated by TAmJ</div>
</div></body></html>
```

---

## デプロイ後の動作確認(必須)

1. **国内 IP で動作確認**(自宅・オフィス):`king2323.tamjump.com` 普通に開ける ✓
2. **VPN で米国経由**(NordVPN や proxysite.com): 451 ページ表示 ✓
3. **Google Search Console** に king2323.tamjump.com を property 登録:
   - sitemap.xml を送信
   - URL 検査ツールで `https://king2323.tamjump.com/` を fetch
   - **「Live URL is on Google」** で 200 OK が返ればクローラ bypass 成功
   - 「Couldn't fetch」が出たら `cf.client.bot` の expression が動いてない → 要再確認
4. **Twitter Card Validator**(https://cards-dev.twitter.com/validator):
   - `https://king2323.tamjump.com/` を入力
   - 画像・タイトル・description が表示されればOK
   - 「Unable to render Card」なら facebookexternalhit 等の bot bypass が効いてない

---

## launch 時刻(5/15 23:23 JST)の作業順序

1. **WAF を最後にデプロイする**(launch の 30 分前くらいまでは無防備でいい、site 単体だと負荷は来ない)
2. WAF 有効化後、上記 #1 #2 で動作確認
3. ある程度伝搬を待ってから(15-30分)、SNS で URL 拡散開始
4. クローラ bypass が効いているか不明な場合は、SNS 拡散より前に Twitter Card Validator で確認すること

伝搬中に「国内なのに 451」が出る可能性もある(Cloudflare キャッシュ)
ので、launch から数時間は監視しておく。

---

## launch 後の確認(数日後)

- Google Search Console で「カバレッジ」レポート確認
  - インデックス済み: index, money, verify, app, rules, risk(計 6 ページ)
  - entry.html は robots.txt で disallow しているので未インデックスでOK
- `site:king2323.tamjump.com` で検索 → 6 件出ればOK
- 出ない場合は WAF の bot bypass が効いていない or sitemap が読まれていない

---

— session6 Claude より、大下さん宛
