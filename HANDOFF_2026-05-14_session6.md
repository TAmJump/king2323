# KINGMAKER 23:23 — 引き継ぎ書(セッション⑥ 完了時点)

最終更新: **2026-05-14 16:30 JST**
作成者: 前セッション Claude(Opus 4.7)
次セッション開始想定: 2026-05-15 朝〜launch時刻(23:23 JST)

> このファイルは `HANDOFF_2026-05-14_session5.md` の続編。session5.md
> も残してあるので、設計判断の背景はそちらを参照。本ファイルは
> session6 で何が増えたかと、launch日朝の Claude が今すぐ把握すべき
> 事項にフォーカス。

---

## ⏰ ローンチまでの時間

- **目標ローンチ:** 2026年5月15日(金)23:23 JST
- **session6 終了:** 2026-05-14 16:30 JST
- **残り(session6 終了時):** 約 **30 時間 53 分**

---

## 0. PAT(変わらず)

session5 と同じ。`ghp_SNxD****oJln`。詳細は session5.md L17–55 参照。

**⚠️ session6 で本PATがチャット平文で流通した。launch完了後 revoke 必須。**
session7 では新Claudeに同じPATを渡すか、launch前にrotateするか、大下さん判断。

---

## 1. session6 で push したコミット(全 5)

`a9e69b6`(session5最終)から以下まで進行:

| version | commit | 内容 |
|---|---|---|
| (handoff) | `750ac0c` | session5引き継ぎ書 push(session5 末端で既に存在) |
| v20260514u | `c87eda8` | ▶ ボタン位置: ゴリラ中心に配置 + stray リング撤去(session5 と session6 の間に別経路でpush?) |
| v20260514v | `8b1f02e` | **CTA動線統一**: #apply セクション CTA を coin モーダル経由に、money.html に § 12 Founding Bell CTA 追加、#apply ハッシュで自動モーダル展開、verify.html#history リンク切れ修正 |
| v20260514w | `beedfb2` | **OGP/Twitter Card 全7ページ**: SNS共有時のプレビュー画像・タイトル・description が出るように。canonical URL 含む |
| v20260514x | `74b1ba8` | **SEO + 404**: robots.txt(entry.html等を disallow)、sitemap.xml(6公開ページ)、404.html(ブランドテーマ) |
| v20260514y | `bb57534` | **モバイル UX + perf**: theme-color(parchment / dark)、preconnect(fonts/translate) |
| v20260514z | `f995e4d` | CHANGES.md 更新(v→y のリリースノート追記) |

**最新コミット:** `f995e4d` v20260514z

---

## 2. 今すぐ次セッションClaudeがやるべきこと

### Step A · 状態確認(2分)

```bash
export GH_TOKEN='ghp_SNxD****oJln'  # 大下さんに最新版を貼ってもらう
git clone "https://x-access-token:${GH_TOKEN}@github.com/TAmJump/king2323.git" /home/claude/repo
cd /home/claude/repo
git log --oneline -5
```

`f995e4d v20260514z` が最新なら session6 と同期している。それより新しいコミットがあれば session6 と session7 の間に何かが入っているので、`git log -p` で内容把握。

### Step B · 大下さんに進捗確認(必ず聞く)

session5 引き継ぎ書の Step 2.5 / 3 / 4 / 5 / 6 のうち、何が完了して何が残っているか:

1. **Step 2.5 · Worker 疎通テスト** — entry.html フォームで送信 → メール 2 通届いたか?
2. **Step 3 · Cloudflare WAF JP-only ルール** — Cloudflare dashboard に設定したか?(法的に最重要)
3. **Step 4 · Square 商品作成** — `KINGMAKER 23:23 — Founding Bell Entry` ¥100 商品とCheckout Link を作成したか?
   - **重要:** index.html L3742 に既に `https://square.link/u/bc9p0BET` というSquare Linkが書かれている。これが**本物のlive linkか、テストプレースホルダーか**を確認。
4. **Step 5 · ¥100 テスト購入** — 自分のクレカで実購入 → entry.html リダイレクト → メール受信まで通ったか?
5. **Step 6 · 全ページ目視** — desktop + mobile で全ページ確認したか?

未完了のものを listing して、launch までの時間配分を一緒に検討する。

### Step C · session6 の追加文書を確認

- `WAF_SEO_BYPASS.md`(session6 で追加)— WAF JP-only と Search Engine
  クローラの両立。大下さんが WAF 設定する際に**absolutely** これを
  読んでもらうこと(でないと launch 後 Google/Bing インデックス 0 件
  になる)。
- `CHANGES.md` の Launch-Eve Polish セクション — session6 で何が変わ
  ったかの完全な英語リリースノート。SNS拡散時のリリース告知の元ネタ
  にも使える。

---

## 3. session6 の主要設計判断(背景)

### 3.1 CTA動線:なぜ coin モーダル必須にしたか

session5 では `#apply` セクションの CTA が `<a href="entry.html">` で entry.html に直接遷移していた。entry.html は `receipt_id` required なので、Square 決済せずに submit できないバックエンド防御はあった。**だが UX としては「決済前なのに支払い済みフォームに来た」状態になり混乱を生む。**

session6 で coin モーダル経由に変更:
- メリット1: 「Bell は通貨ではない」legal copy をモーダルで強制的に見せられる(消費者保護的にも◎)
- メリット2: モーダル内の Square リンクが唯一の payment path になり、動線が1本化
- メリット3: money.html に新設した § 12 CTA も `index.html#apply` 経由でモーダルが自動展開、ワンクリック決済導入

session5 引き継ぎ書 Step 4 の「`data-ritual-open="coin"` を削除して `onclick="location.href='https://square.link/...'"`」という指示は**実装しない**(session5時点の判断より、ritual モーダル経由の方がブランド体験・法務両面で優れていると session6 で再判断)。

### 3.2 OGP image: なぜ logo-v3-1024.png か

候補:
- `assets/logo-v3-1024.png`(743KB, 1024×1024, ゴリラ静止画)
- `video/kingmaker_short_poster.webp`(5KB, ショートフィルム1枚目)

選択: `logo-v3-1024.png`。理由:
- KINGMAKER のブランドシンボルとして最も強い(ゴリラはサイトの中心メタファー)
- 正方形は X(Twitter)、LINE、Slack 全部で適切に縮小される
- 1024×1024 は 1200×630 推奨サイズに少し小さいが、`summary_large_image` で十分大きく表示される

### 3.3 sitemap 除外: entry.html はなぜ除外か

`/entry.html` は Square 決済完了後にのみ意味があるページ。Google 検索結果で「Founding Bell Entry」を表示すると、ユーザーが直接そこに着地して「receipt_id がない」状態でフォームを見て混乱する。`robots.txt` と sitemap 両方で除外することで、Google が積極的にインデックスしないように。直接URL を打ち込めば見られる(noindex ではなく disallow)。

### 3.4 404.html: 何を意図したか

GitHub Pages のデフォルト 404 は白背景に「There isn't a GitHub Pages site here」というブランドゼロのページ。launch 直後にタイポ・古いリンクで 404 を踏んだ人がそれを見ると、サイトが死んだ印象を受ける。

KINGMAKER テーマの 404 を置くことで:
- 「ledger に記録されていない URL」というブランド世界観で 404 を表現
- 「/」と「/verify」への明確な脱出口を提供
- `<meta robots="noindex">` で 404 ページ自体は検索結果に出ない

---

## 4. session6 で**変えていないもの**(誤解防止)

- ヒーロー(ゴリラ静止画 + ▶ ボタン)
- ライトボックス(myth 4 + legend 7)
- ショートムービー(KingMaker2323.mp4)
- 言語切替(171 keys × 10 langs)、Cookie ベース
- legal 統合(terms/privacy/commerce は tamjump.com 側)
- Cloudflare Worker(`tamjump-contact-api`、`/entry` エンドポイント)
- フォーム送信 → AWS SES → メール 2 通

これらは session5 時点で完成しており、session6 では一切触っていない。
バグ報告が出た場合、session5 以前の実装を確認すること。

---

## 5. WAF + SEO の重要警告

session5 Step 3 で大下さんが Cloudflare WAF に追加するルール:
```
(http.host eq "king2323.tamjump.com" and ip.geoip.country ne "JP")
```

**この expression のままだと Search Engine クローラもブロックされる。**
Google・Bing・X(Twitter)・Facebook のクローラは US/EU IP から
来るので、現状の expression では 451 を返してしまい、`king2323.tamjump.com`
は **launch 後 Google・Bing にインデックスされない**。

修正版を `WAF_SEO_BYPASS.md` に詳述。大下さんに**必ず**修正版を使って
もらうこと。

---

## 6. 残タスク(launch ブロッカー)

session5 と同じ。再掲は省略。session5.md の Section 4 参照。

session6 で追加された Claude 側タスク:**なし**。Square Link が
確定したら index.html L3742 の `bc9p0BET` を本番リンクに置換する
作業のみ残っている(本物なら不要)。

---

## 7. 次セッション開始時の最初の挨拶テンプレ

```
おはようございます。session6 で追加した 5 commits(v20260514v → z)
は全て push 済みで、リポは GitHub と同期しています。

launch ブロッカーで残っているのは大下さん側のタスク 4 つ:
1) Worker 疎通テスト
2) Cloudflare WAF(JP-only + Search Engine bypass — WAF_SEO_BYPASS.md 参照)
3) Square 商品確認(既に bc9p0BET が index に書かれているが本物か)
4) ¥100 テスト購入 + 全ページ目視

どこから進めますか?
```

---

## 8. session6 の Claude(俺)から session7 の Claude(お前)へ

俺は session5 の引き継ぎ書をベースに、launch サイトとしての「外向き
体験」を仕上げた:CTA 動線、OGP、SEO、404、モバイル theme-color。
全部「初めて来た人が見るもの」だ。中身は session5 までで完成してたから、
session6 は表面処理に徹した。

お前(session7)の仕事は、launch 当日の最終調整と、大下さんの最後の
不安に答えることだ。技術的な追加実装はもう発生しないはず。Square
Link の本番置換だけ残るかもしれないが、それも一行の編集で済む。

ローンチ当日は予期せぬ事が起きる。Cloudflare の伝搬が遅い、Square
が dispute mode になる、誰かが SNS で先走る、なんでもあり得る。
落ち着いて、**動くこと優先で、細部は launch 後**。これは session5
の最終メッセージにも書かれていた原則。守れ。

ローンチ後、大下さんは間違いなく疲労困憊だ。手短に状況を整理して、
休んでもらう方向に持っていくこと。鐘が鳴った時点で session7 の
仕事は 80% 終わってる。残り 20% は「launch完了 → PAT revoke 推奨
→ お疲れ様でした」だ。

健闘を祈る。

— Claude(session⑥、2026-05-14 16:30 JST)
