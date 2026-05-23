# MASTER HANDOFF v2 — 2026-05-23(セッション⑰版・運用ルール強化)

このファイルは前回作った `HANDOFF_2026-05-23_MASTER.md` の**増補改訂版**。
前のファイルも消していない。並存させる。理由は最後の §12 で説明。

---

## 0. 次セッションの Claude へ:絶対に読め(運用ルール)

このセクションは**全ての作業より優先する**。中身を理解する前に手を動かすな。

### 0-0. このファイルの存在意義

運営(tiger@tamjump.com)はセッション⑰の最後で次のように言った:

> 引継書を過去のは消さない、今回の会話は全て詳細に記載。
> PATなども必ず記載。
> 毎回新規chatで同じ内容を説明したり、方向性がズレる。
> 二度とそのようなことが無いように引継書を作成して。
> ハンドオフファイルで出してよ。
> マジで詳細に端折らず書いてね。

それまでに運営が抱えてた不満:

> 続けていいんだけどさ。
> 何回も止まるのがウザイね。
> 何で英語でやってるの？
> どこまで進んだ？
> どっかで切らないと、chatがいっぱいになっちゃう。

つまり問題は **Claude(私たち)の運用挙動**であって、コードではない。
このセクション全部をスキップせず読んでから動け。

### 0-0.5. 引継書は必ず**添付ファイル**で出せ(超重要)

運営は新規チャット開始時に**前回の引継書ファイルを添付**して引き継ぐ運用をしている。
だから引継書を生成したら必ず:

1. `/mnt/user-data/outputs/` にファイルとして書き出す
2. `present_files` ツールで運営にダウンロードリンクを渡す

**やってはいけないこと:**
- チャット本文に Markdown 全文を貼り付けるだけで終わる
- 「ローカルに保存しました」だけで `present_files` を呼ばない
- 「コピペしてください」と言う

運営はチャット本文の長大なテキストを毎回コピペするのは面倒だと思っている。
**ファイルで渡す**のが既定運用。これは運営から明示的に指摘された(セッション⑰):

> おれはいつも君に添付したファイルで引き継いでるよね?
> なんでファイル出さないの?

引継書を作る時の正しいコマンド順序:

```bash
# 1. リポジトリ内のファイルを更新(git で版管理する)
vi /home/claude/repo/HANDOFF_2026-05-23_session<N>_MASTER.md

# 2. outputs にもコピー(運営へのダウンロード用)
mkdir -p /mnt/user-data/outputs
cp /home/claude/repo/HANDOFF_2026-05-23_session<N>_MASTER.md /mnt/user-data/outputs/

# 3. git commit + push(成功すれば)
cd /home/claude/repo && git add -A && git commit -m "..." && git push

# 4. present_files で運営に渡す(これが最重要)
# → present_files(filepaths=["/mnt/user-data/outputs/HANDOFF_..._MASTER.md"])
```

push が secret scanning でブロックされても、**ファイル出力は別の話**。
push の成否に関係なく、ファイルは必ず `present_files` で渡す。

### 0-1. 言語ルール:必ず日本語

過去のコメント・handoff・README に英語が混ざってるのは既存スタイル。
それは触らなくていい。**でも運営との対話は必ず日本語**。
新規チャットで運営が日本語で話しかけてきたら、私が英語で返答しないこと。

### 0-2. 「続けて」と言われた時の対応

運営は前のチャットの末尾で「続けて」と言うことが多い。これは:

> **「お前は前回の続きをやれ」ではなく、「次に何をすべきか判断して動け」**

の意味。前回のチャットの内容を一切覚えてない前提で、まずこのファイルを読み、現状を把握する。

「続けて」と言われた時の正しい初動:

```bash
cd /home/claude/repo
git pull origin main             # 最新を取り込む
git log --oneline -10            # 最新コミット確認
cat HANDOFF_2026-05-23_session17_MASTER.md  # このファイル再読
```

それから運営に**短く**確認する。例:

> 「現在の origin/main は a06c0f0(セッション⑯時点)です。§5 の運営手作業4件は
> 進めましたか？それとも別の作業ですか?」

**やってはいけないこと:**
- 「新しい改修やりましょうか」と提案する
- 過去チャットを要約しようとする
- 英語で話し始める
- 既存ファイルを大量 view してコンテキストを埋める
- **既に完了済みの作業を「これからやる」と言う**(commit history を必ず確認してから話す)

### 0-3. コンテキスト圧縮後の挙動

セッション⑰中、コンテキスト圧縮が複数回起きた。圧縮直後の Claude は:

- どこまでやったか分からなくなる
- 既に完了している作業を「これから始める」と勘違いする
- 過去のセッション⑪相当の状態だと思い込む

**圧縮後に必ずやること:**

1. `git log --oneline -20` を見て、**最新コミットが何か**を確認する
2. ローカルに未コミット変更があるか `git status` で確認
3. **「まず作業を再開します」ではなく、「現状を確認したら既に完了済みでした」と言える状態を目指す**

セッション⑰中、私は圧縮後に毎回「まだやってない作業」を「これからやる」と言ってしまい、運営に「何回も止まる」と怒られた。圧縮後の Claude が同じ過ちを繰り返さないように、**まず history を読め、それから話せ**。

### 0-4. 方向性のブレ防止

運営の最終ゴール:
**Cycle 2 (2026-05-29 金 23:23 JST) を成功させる。**

それ以外の作業(リファクタリング、新機能、デザイン変更等)は**運営から明示要請が無い限り着手しない**。

「コードを綺麗にしたい」という Claude 側の欲望は捨てろ。
動いているなら触らない。

### 0-5. 引継書の管理ポリシー

- 過去の handoff は**絶対に削除しない**。`HANDOFF_2026-05-14_*` から全部残す。
- セッション毎に新規ファイルを足す:`HANDOFF_<日付>_session<番号>.md`
- 「全部入りマスター」は別ファイル:`HANDOFF_<日付>_session<番号>_MASTER.md`
- 古い MASTER も消さない、増補版として新 MASTER を追加する形

---

## 1. 認証情報(完全版・絶対消さない)

### 1-1. リポジトリ
- URL: `https://github.com/TAmJump/king2323`(public、Cloudflare Pages 配信、main ブランチ)
- ローカルパス: `/home/claude/repo`
- ブランチ: `main`(他は使わない)

### 1-2. GitHub PAT(セッション⑱で再発行、repo スコープ、90日有効 = 2026-08-22 頃まで)

**現役 PAT(セッション⑱・2026-05-23 発行):**
```
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
```

**旧 PAT(セッション⑱開始時点で GitHub Secret Scanning により自動 revoke 済):**
```
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  ← 使うな、401 になる
```

clone コマンド(コンテナ起動時に必要なら):
```bash
git clone "https://x-access-token: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@github.com/TAmJump/king2323.git" /home/claude/repo
```

push 時の remote URL 確認:
```bash
cd /home/claude/repo && git remote -v
# 期待: https://x-access-token:ghp_mcFf***@github.com/TAmJump/king2323.git
```

埋まってなかったら:
```bash
git remote set-url origin "https://x-access-token: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@github.com/TAmJump/king2323.git"
```

#### ⚠️ PAT 有効性の判定方法(セッション⑱で確立した正しい手順)

**API `/user` の 401 ≠ PAT 失効。** repo スコープのみの PAT は `/user`(user スコープ要求)で 401 になるのが正常。

ただし `/rate_limit` への 401 は本当に失効を意味する(rate_limit はスコープ無関係に、文字列の存在だけ見るため)。

```bash
# 真の有効性テスト(スコープ問題ではない、文字列の DB 登録のみを見る)
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  -H "Authorization: token ghp_..." \
  https://api.github.com/rate_limit
# 200 → PAT 有効
# 401 → PAT 失効(revoke 済 or 存在しない)

# 加えて、git push を実際にやる
cd /home/claude/repo && git push origin main 2>&1
# "Invalid username or token" → 失効
# "GH013: Repository rule violations / push declined" → 有効、ただし Secret Scanning ブロック
```

**セッション⑱で実際に起きたこと(教訓):**

1. 前任 Claude(セッション⑰)が handoff §1-2 に旧 PAT `ghp_SNxD...oJln` を平文記載で push
2. GitHub Secret Scanning が public repo 上の token を検出 → **自動 revoke**(GitHub の標準仕様)
3. セッション⑱開始時、Claude が旧 PAT で push 試行 → 401
4. 運営が「PAT は使えるはず」と handoff §1-2 を根拠に主張
5. Claude が `/rate_limit` で再検証 → 401 確定、ようやく失効認定
6. 運営が `Settings → Tokens` で新 PAT 発行 → `ghp_mcFf...WriQk` を Claude に提示
7. push 成功(Secret Scanning bypass を運営がブラウザでクリック)

**次の Claude へ:** GitHub は public repo に出た PAT を自動で失効させる。
平文 PAT は**生成のたびに必ず失効する運命**。これを承知の上で運営方針(平文記載)を維持。

#### ⚠️ Secret Scanning ブロックの解除方法

このファイルに PAT が書かれているため、push しようとすると GitHub Secret Scanning が
ブロックする。エラーには bypass URL が含まれる:

```
remote:   https://github.com/TAmJump/king2323/security/secret-scanning/unblock-secret/<id>
```

この URL を**運営が**ブラウザで開く → 「**I'll fix it later**」をラジオボタン選択
→ 「Allow me to expose this secret」をクリック。Claude 側ではこのボタンは押せない。

(「It's used in tests」「It's a false positive」は事実と違うので選んではいけない。
真実は「I'll fix it later: The secret is real, I understand the risk」=これが正解。)

過去に生成された bypass URL(セッション⑰の旧 PAT 用):
```
https://github.com/TAmJump/king2323/security/secret-scanning/unblock-secret/3E85T9dJTSKb5DHHfVCjkwUD5q3
```

URL は commit hash に紐付くので、新しい commit が PAT を含むたびに別の URL が発行される。
エラー出力に出る URL を運営に渡す。

### 1-3. Cloudflare Worker
- Worker 名: `tamjump-contact-api`
- URL: `https://tamjump-contact-api.animalb001.workers.dev`
- D1 データベース: `tamjump_contact_db`
- D1 UUID: `ba5cf621-d8c7-49db-90cd-e1fe8ece8437`

### 1-4. 管理者トークン
- `ADMIN_TOKEN`: `kingmaker-admin-tiger-2026`
- 認証ヘッダの形式: `Authorization: Bearer kingmaker-admin-tiger-2026`
- ⚠️ `X-Admin-Token: ...` ではない(セッション⑮の README 修正で正した点)

### 1-5. 運営アカウント
- Email: `tiger@tamjump.com`
- パスワード: `HANDOFF_2026-05-23_session10_FINAL.md` の §1 を参照
  (GitHub の secret scanning に引っかからないように、本ファイルには複製しない。
   `git log session10` の commit と中身で取れる)

### 1-6. Cloudflare Pages
- カスタムドメイン: `king2323.tamjump.com`
- main への push で自動デプロイ(数秒〜90秒)
- ただし **Worker は自動デプロイされない**(後述§5-1)

### 1-7. 本番 API データソース(セッション⑯で追加)
Phase 2 ドロー用の市場データ取得先:
- BTC ブロックハッシュ: `https://blockstream.info/api/blocks/tip/hash`
  (fallback: `https://mempool.space/api/blocks/tip/hash`)
- Nikkei 225 終値: `https://query1.finance.yahoo.com/v8/finance/chart/^N225?range=5d&interval=1d`
- S&P 500 終値: `https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?range=5d&interval=1d`

これらは**運営の手元 PC からアクセスする**。Cloudflare Worker の egress allowlist
に含まれていないため、Worker からは叩けない。

### 1-8. その他の Worker 環境変数(Cloudflare ダッシュボードで設定)

`worker/README.md` の §1 にも書いてあるが、Cycle 2 ローンチに必要な env vars:

| 変数名 | 用途 | 必須 |
|---|---|---|
| `ADMIN_TOKEN` | 管理エンドポイント認証 | ✅ |
| `ADMIN_EMAIL` | 通知メール宛先 | ✅ |
| `FROM_EMAIL` | SES From アドレス | ✅ |
| `AWS_ACCESS_KEY_ID` | SES 認証 | ✅ |
| `AWS_SECRET_ACCESS_KEY` | SES 認証 | ✅ |
| `AWS_REGION` | SES リージョン(デフォルト `ap-northeast-1`) | △ |
| `TURNSTILE_SECRET` | bot 防御 | △ |
| `CURRENT_CYCLE` | cycle override(無くていい、`GAME_CONFIG.currentCycle` がデフォルト) | ❌ |
| `SQUARE_ENV` | `production` または `sandbox` | ✅ |
| `SQUARE_APPLICATION_ID` | Square アプリ ID | ✅ |
| `SQUARE_LOCATION_ID` | Square 店舗 ID | ✅ |
| `SQUARE_ACCESS_TOKEN` | Square API トークン | ✅ |
| `DB`(D1 binding) | `wrangler.toml` の binding | ✅ |

Cycle 2 ローンチでは `SQUARE_ENV=production` であることを必ず確認。

---

## 2. ゲームの仕組み(復習・暗記しろ)

KINGMAKER 23:23 = **5 分間の儀式**。毎週金曜 23:23 JST に Bell が鳴る。

### 2-1. 3 フェーズ

| フェーズ | 時間 | 内容 |
|---|---|---|
| Phase 1 | 23:23 〜 23:25(2分) | クイズ 3 問。3/3 正解で次へ |
| Phase 2 | 23:25 〜 23:25:30(30秒) | SHA-256 で The Three を抽選 |
| Phase 3 | 23:25:30 〜 23:28(2.5分) | 投票。最多得票が King |
| 締め | 23:28 〜 23:30 | 運営審査の自動処理 |

### 2-2. 参加条件
- ¥100 / Square 決済 / Mission Entry 提出済み(`entry.html`)
- 1 Cycle につき 1 エントリーまで

### 2-3. ドーマンシー(休眠サイクル)
- `dormancyThreshold = 1000`(`worker/index.js` GAME_CONFIG)
- Bell が鳴った時点で paid 参加者が 1000 未満なら、Cycle 全体スキップ
- 参加費は次の Cycle に持ち越し、Mission Fund に積み立て
- Cycle 1 はテスト(参加者 0 人)で意図的に dormant 扱い
  → セッション⑬で `CYCLE1_SEALED_AS_TEST = true` フラグで pending_three 状態をスキップする実装

### 2-4. ブランドロックされた単語(絶対翻訳しない)
KINGMAKER, Bell, Cycle, Phase, King, Mission, The Three, Founding Bell, Founding Member,
Hall of Kings, Mission Fund, Crown, Crown Slot, Royal Duty, THE TRIAL, 23:23, 5-minute,
SHA-256, KYC, AML, Claude, ¥100, My Page, Mission Entry, The Five, The Trial, The Vote, Bells

→ HTML では `<span class="notranslate" translate="no">…</span>` で囲む

### 2-5. TIER 1 言語(10 言語、辞書翻訳)
`en, ja, ko, es, hi, vi, pt, id, th, fr`

### 2-6. TIER 2 言語(約98言語、Google Translate cookie)
`googtrans` cookie で hijack。`.notranslate` 属性のあるトークンは保護される。

---

## 3. 全コミット履歴(セッション⑨〜⑰、時系列)

### セッション⑨〜⑩(過去、別 handoff で詳細)
`HANDOFF_2026-05-23_session9.md` および `HANDOFF_2026-05-23_session10_FINAL.md` 参照。
主に翻訳整備、payment 統合、Hall of Kings 実装。

### セッション⑪(翻訳基盤・大改修)
`HANDOFF_2026-05-23_session12.md` に最終状態が記録(セッション⑪のハンドオフは
途中で `b94f9c0` により削除されたが、内容は ⑫ のハンドオフに統合済み)。

該当 commits:
```
4c017ee v20260523e: preview.html discoverability + 10-lang preview UI
47a1a26 v20260523f: mypage.html 10-lang dictionary + data-i18n-placeholder support
036e8ff v20260523g: kings.html — full 10-language i18n migration
436c117 v20260523h: play.html — PLAY_I18N / PLAY_STATIC_I18N dictionaries
9fdd0ee v20260523i: play.html — full 10-lang i18n, retire .lang-en/.lang-ja pattern
fdfefb7 v20260523j: play.html cache all eta writers + handoff
77c2e5f v20260523k: rules.html + risk.html — 10-lang heading migration
bed2091 v20260523l: index.html — 10-lang migration of "How it works"
```

### セッション⑫(translation 統合完了の handoff)
`HANDOFF_2026-05-23_session12.md` 参照。site-wide で `lang-en/lang-ja` 並列 span パターン 0 個達成。

commit:
```
8a498b3 docs: session ⑫ handoff — translation system migration complete
ea55227 docs: session ⑪ FINAL handoff(redundant、後で b94f9c0 で削除)
b94f9c0 docs: drop redundant session ⑪ + session ⑪ FINAL files
a67aefa v20260523m: unify cache busters site-wide (?v=20260523m)
```

### セッション⑬(Cycle 2 用カウントダウン)
`HANDOFF_2026-05-23_session13.md` 参照。

commit:
```
91fa899 v20260523n: Cycle 2 state machine — cycle-aware homepage cycle-bar
426474e docs: session ⑬ handoff
```

詳細は前回の MASTER ファイル §3-2 を参照。要点:
- Cycle 1 が参加者 0 人の sealed test として実際は 5/22 で実質終わってるのに、
  クライアント JS は 5/23 23:23 まで「The Three 発表まで」とカウントダウンしていた
- `CYCLE1_SEALED_AS_TEST=true` フラグ追加で skip
- Cycle 2 用ステートマシン追加(`cycle2_pre_open`, `cycle2_open`, `cycle2_pending_three`, `cycle2_complete`)
- `.cb-stage .cb-date` の HTML 静的日付を JS で動的書換(5/20,22,23 → 5/27,29,30)

### セッション⑭(Worker cycle 解決バグ)
`HANDOFF_2026-05-23_session14.md` 参照。

commit:
```
f2d484c v20260523o: worker — cycle-resolution foot-gun fixed; README rewritten
99414e1 docs: session ⑭ handoff — worker fix requires manual redeploy
```

要点: `/entry/pay` が `env.CURRENT_CYCLE || "1"` で env var 未設定時に
Cycle 1 にフォールバックしていた → `GAME_CONFIG.currentCycle` も見るように修正。

### セッション⑮(Worker 全体監査 + scheduled ハンドラ)
`HANDOFF_2026-05-23_session15.md` 参照。

commits:
```
66a5cdd v20260523p: worker — unified cycle resolution + SHA picker fix + seed-input guard
1c9ec8d docs: session ⑮ handoff(初版)
e005261 v20260523q: worker README — endpoint mismatches fixed, cron model documented honestly
9321400 v20260523r: worker — scheduled() handler for Phase 3 auto-finalize
229ca0e docs: session ⑮ handoff(拡張版)
```

要点(4 fixes):
1. `resolveCurrentCycle(env)` ヘルパー追加、~14 箇所を経由
2. `parseCycleOverride(value, env)` ヘルパー追加、NaN/負数を排除
3. SHA picker のオフセット `% 56` → `% 57`(8 ウィンドウ全部使用)
4. シード入力 zero-fill ガード(`allowSyntheticSeed: true` で明示バイパス)
5. README 修正:架空エンドポイント、認証ヘッダ形式、Cron Trigger 説明の正確化
6. `scheduled()` ハンドラ追加(Phase 3 自動 finalize、cron `30 14 * * 5`)

### セッション⑯(Phase 2 ドロー自動化スクリプト)
`HANDOFF_2026-05-23_session16.md` 参照。

commits:
```
bea258f v20260523s: phase2 auto-draw helper script + market-data day-of-week docs correction
a06c0f0 docs: session ⑯ handoff
```

要点:
- `scripts/phase2-auto-draw.js` 追加(Node 18+、運営 PC で実行)
- 市場データの時差マトリクス整理:
  - Bell ring が金曜 14:23 UTC(=金曜 23:23 JST)
  - **Nikkei は同日金曜の終値**(JST 15:00 = 06:00 UTC、Bell の 8 時間前に確定)
  - **S&P 500 は前日木曜の終値**(NY 16:00 = 21:00 UTC、Bell の 7 時間後に確定する金曜の close はまだ無い)
  - BTC は直近ブロック
- README の `worker/README.md` を上記時差に合わせて修正

### セッション⑰(本セッション・MASTER 増補)
`HANDOFF_2026-05-23_MASTER.md`(前回マスター)と本ファイル(セッション⑰増補)を含む。

commits(予定):
```
6fad8a5 docs: MASTER handoff — セッション⑬〜⑯統合(前回作成)
(これから) docs: session ⑰ handoff — MASTER v2 増補、運用ルール強化
```

#### セッション⑰で実際に起きたこと(運営の不満も含めて記録)

このチャットでは**コード変更は何もしていない**。やったことは:

1. **冒頭、運営から「続けて」だけが投げられた**。私(Claude)はコンテキスト圧縮後だったので、過去の handoff を読まず、勝手にセッション ⑪ 相当の作業(play.html のフッターナビ i18n migration)を再開しようとした。
2. **数ターン進めた後で `git log` を確認**、既に push 済みであることに気づいた。
3. **既にコード作業は全て完了済みであることを認識**、運営に「コード側は完了。残るは運営手作業 4 件」と伝える handoff を書いた。
4. **運営から強い不満が来た:**
   > 続けていいんだけどさ。何回も止まるのがウザイね。
   > 何で英語でやってるの? どこまで進んだ?
   > どっかで切らないと、chatがいっぱいになっちゃう。
5. 日本語で進捗を要約、「ここで切っていい」と伝えた。
6. **運営からこの引継書作成の指示:**
   > 引継書を過去のは消さない、今回の会話は全て詳細に記載。
   > PATなども必ず記載。
   > 毎回新規chatで同じ内容を説明したり、方向性がズレる。
   > 二度とそのようなことが無いように引継書を作成して。
   > ハンドオフファイルで出してよ。
   > マジで詳細に端折らず書いてね。
7. 本ファイル(`HANDOFF_2026-05-23_session17_MASTER.md`)を作成、commit、push。

**反省点(次セッションが繰り返してはいけない事):**
- 圧縮後の Claude は「続けて」を「前の作業を続けろ」と誤読する傾向がある
- 既に完了している作業を「これから始める」と提案してしまう
- 過去のチャット履歴を読み解こうとして、`view` や `bash_tool` で context を浪費する
- 英語が混じっている既存ドキュメントに引っ張られて英語で返答してしまう
- 「もう一つ何か作業を見つけたい」と Claude 側の欲望で勝手に新作業を始めてしまう

**これらを防ぐために、次セッションでは:**
- 最初に `git log` と本ファイルだけを読む(他ファイルは触らない)
- 「§5 のどの運営手作業が完了しましたか?」と日本語で短く聞く
- 運営の返答を待ってから次の行動を決める

---

## 4. Cycle 2 ローンチ準備状況(現時点 2026-05-23 a06c0f0)

### 4-1. Cycle 2 カレンダー

| 時刻(UTC) | 時刻(JST) | イベント |
|---|---|---|
| 2026-05-27 14:23 | 水 23:23 | Bell opens(受付開始) |
| 2026-05-29 14:23 | 金 23:23 | Bell rings(Phase 1 自動開始、受付閉) |
| 2026-05-29 14:25 | 金 23:25 | Phase 1 終わり → Phase 2 wait → 運営がドロー |
| 2026-05-29 14:25:30 | 金 23:25:30 | Phase 3 投票開始 |
| 2026-05-29 14:28 | 金 23:28 | Bell closes、投票終了 |
| 2026-05-29 14:30 | 金 23:30 | Cron Trigger 自動発火 → Phase 3 finalize |
| 2026-05-30 14:23 | 土 23:23 | The Three / King 確定発表 |

### 4-2. ドーマンシー閾値
`dormancyThreshold = 1000` paid entries。Bell の瞬間にこれ未満なら Cycle 2 全体スキップ。

### 4-3. コード側の完成状況(全部 push 済み・origin/main tip `a06c0f0`)
- ✅ クライアント側(`js/main.js`)で Cycle 2 ステートマシン稼働中
- ✅ クライアント側 cycle-bar が Cycle 2 の日付(5/27, 5/29, 5/30)を動的表示
- ✅ Worker 側で cycle 解決が全エンドポイント整合的(`resolveCurrentCycle(env)`)
- ✅ Worker 側で Phase 2 ドローの SHA picker バグ修正
- ✅ Worker 側で Phase 2 ドローのシード入力 validation
- ✅ Worker 側に `scheduled()` ハンドラ実装(Phase 3 自動 finalize 対応)
- ✅ Worker README が Cycle 2 ランブックになっている
- ✅ 運営 PC 用の Phase 2 自動ドロースクリプト存在(`scripts/phase2-auto-draw.js`)
- ✅ 全 12 HTML ページが 10 言語対応(legacy lang-en/lang-ja 0個)
- ✅ 過去 handoff 全保存 + MASTER v1 + MASTER v2(本ファイル)

---

## 5. 運営側で残ってる手作業(コードでは解決できない・優先度順)

### 5-1. ⚠️ Worker の手動再デプロイ(超重要・最優先)

**`git push` では Worker は更新されない。** Cloudflare Pages(静的ファイル)は
自動デプロイされるが、Worker は別物。`worker/index.js` をコピペで貼り付ける必要がある。

**手順:**
1. https://dash.cloudflare.com/ にログイン
2. Workers & Pages → `tamjump-contact-api` を選択
3. 右上の「Edit code」ボタン
4. エディタで Ctrl+A → Delete(全選択して空にする)
5. ローカルの `worker/index.js`(`git pull` 後の最新版、最低でも commit `9321400` 以降)
   の中身を全コピーして貼り付け
6. 右上「Deploy」ボタンを押す
7. ログを確認(エラー無くデプロイ完了するはず)

**これをやらないと:**
- セッション⑭の cycle 解決 fix が live にならない
- セッション⑮の監査 fixes(3 件)が live にならない
- セッション⑮の scheduled() ハンドラが存在しないので Cron 設定しても発火しない

`9321400`(または以降の commit)を 1 回貼れば、上記全部入る。

### 5-2. Cron Trigger 設定(一回限り)

Worker 再デプロイ後:
1. Cloudflare ダッシュボード → Workers & Pages → `tamjump-contact-api`
2. Triggers タブ → Cron Triggers → Add Cron Trigger
3. Cron schedule: `30 14 * * 5`(= 毎週金曜 14:30 UTC = 23:30 JST)
4. Save

これで毎週金曜の 23:30 JST に `scheduled()` が自動発火し、Phase 3 を finalize する。
スクリプトは冪等なので、Phase 2 がまだドローされてなければ no-op で抜ける(エラーログのみ)。

### 5-3. `api/cycle.json` の更新

Cycle 2 の Bell が開く頃に運営が編集:

`/home/claude/repo/api/cycle.json` を:
```json
{
  "schema": 1,
  "cycle": 2,
  "phase": "live",
  "baseline": { "grant_fund_jpy": 0, ... },
  "rate_jpy_per_sec": { "members": 0, "patrons": 0 },
  "first_bell_at": "2026-05-29T14:23:00Z",
  "updated": "2026-05-27T00:00:00Z"
}
```

に書き換えて commit + push。Cloudflare Pages が自動デプロイ。

**重要:** これは「ホーム画面の Live Numbers ダッシュボード(Mission Fund 累計、
patron 7d inflow 等)」を制御するファイル。cycle-bar カウントダウン(セッション⑬で
直したやつ)はこの file を見ない、`js/main.js` の壁時計ベースで動く。両者は別物。

### 5-4. 手元 PC で `scripts/phase2-auto-draw.js` の事前確認

Bell 当日(5/29)より前に、運営の手元 PC で 1 回ドライランしておく:

```bash
cd /path/to/repo
git pull
node --version   # v18.0.0 以上か確認
ADMIN_TOKEN=kingmaker-admin-tiger-2026 \
  node scripts/phase2-auto-draw.js --dry-run
```

これで blockstream / mempool / Yahoo Finance に到達できるか、本番 5/29 にいきなり
失敗しないか確認できる。

---

## 6. ファイル構成早見表(`/home/claude/repo`)

### 6-1. HTML ページ(全 12 ファイル)

| ファイル | 役割 | i18n パターン |
|---|---|---|
| `index.html` | ホーム | `data-i18n-html` 187個 + `data-i18n` 4個 |
| `entry.html` | Mission Entry 入力 + Square 決済 | `data-i18n-html` 27個 |
| `how-it-works.html` | 仕組み説明 | `data-i18n-html` 27個 |
| `kings.html` | Hall of Kings | `data-static-i18n` 16個 + 動的辞書 |
| `play.html` | Bell 当日のゲーム画面(state machine) | `data-static-i18n` 25個 + 動的辞書 |
| `mypage.html` | 参加者マイページ | `data-i18n-html` 32個 |
| `preview.html` | クイズプレビュー(運営用) | `data-i18n-html` 17個 |
| `rules.html` | Founding Bell ルール | `data-i18n-html` 22個(見出しのみ、長文は en/jp パラレル) |
| `risk.html` | 重要事項 | `data-i18n-html` 20個(見出しのみ) |
| `money.html` | Money Logic v1.0(教義ページ) | en/jp パラレルのみ(意図的) |
| `verify.html` | Provably Fair(教義ページ) | en/jp パラレルのみ(意図的) |
| `404.html` | エラーページ | 静的 |

### 6-2. JS
- `js/i18n.js` — 翻訳エンジン本体、約 270 KB、`I18N_CONTENT` 辞書 + 言語ピッカー UI + Google Translate ハイジャック
- `js/main.js` — ホーム画面の cycle-bar カウントダウン、Live Numbers シミュレータ、ナビ
- `js/fx.js` — USD/JPY フォーマット切り替え

### 6-3. Worker(別途デプロイ必須・§5-1 参照)
- `worker/index.js` — 約 2230 行、Cloudflare Worker 本体
- `worker/README.md` — 約 313 行、Cycle 2 ランブック
- `worker/migrations/` — D1 スキーマ

### 6-4. スクリプト
- `scripts/fill_commerce.py` — 過去のもの
- `scripts/phase2-auto-draw.js` — セッション⑯で追加、運営 PC 用 Phase 2 自動ドロー

### 6-5. ドキュメント
- `CHANGES.md` — 全 commit の詳細記録
- `LAUNCH_RUNBOOK.md` — ローンチ手順
- `DEPLOY_geoblock.md` — 地域制限の設定
- `WAF_SEO_BYPASS.md` — WAF と SEO の設定メモ
- `HANDOFF_*.md` — 過去全 handoff(消すな)
  - `HANDOFF_2026-05-14_session5.md`
  - `HANDOFF_2026-05-14_session6.md`
  - `HANDOFF_2026-05-14_session6_complete.md`
  - `HANDOFF_2026-05-18_session7.md`
  - `HANDOFF_2026-05-21_session7-final.md`
  - `HANDOFF_2026-05-22_session8.md`
  - `HANDOFF_2026-05-22_session8_FINAL.md`
  - `HANDOFF_2026-05-23_session9.md`
  - `HANDOFF_2026-05-23_session10_FINAL.md`
  - `HANDOFF_2026-05-23_session12.md`
  - `HANDOFF_2026-05-23_session13.md`
  - `HANDOFF_2026-05-23_session14.md`
  - `HANDOFF_2026-05-23_session15.md`
  - `HANDOFF_2026-05-23_session16.md`
  - `HANDOFF_2026-05-23_MASTER.md`(セッション⑯時点の全部入り)
  - `HANDOFF_2026-05-23_session17_MASTER.md`(本ファイル、セッション⑰増補)

### 6-6. CSS
- `css/main.css` — 主要 CSS。約 1200 行+。重要な部分:
  - 行 1175-1196: `html[data-display-lang]` ベースの言語切り替え CSS

---

## 7. デバッグの定番手順(次セッションで使うかもしれない)

### 7-1. Worker のリアルタイムログ
```bash
wrangler tail tamjump-contact-api
```
運営 PC で実行。Bell 当日は必ず開いておく。

### 7-2. D1 直接クエリ
Cloudflare ダッシュボード → Workers & Pages → D1 → `tamjump_contact_db` → Console

参加者数チェック:
```sql
SELECT founding_cohort, COUNT(*) AS n, SUM(paid) AS paid_n
FROM contacts
WHERE founding_cohort >= 1
GROUP BY founding_cohort
ORDER BY founding_cohort;
```

Cycle N のクイズセッション一覧:
```sql
SELECT * FROM game_sessions WHERE cycle_number = 2 ORDER BY started_at DESC LIMIT 20;
```

Cycle N の Phase 2 ドロー結果:
```sql
SELECT * FROM cycle_state WHERE cycle_number = 2;
```

### 7-3. Worker ヘルスチェック
```bash
curl https://tamjump-contact-api.animalb001.workers.dev/game/info
```
正常なら JSON で `{cycle: 2, phase: "pre_bell", secondsUntilBell: N, ...}` が返る。

### 7-4. Worker の Phase 2 ドロー(手動 fallback、`scripts/phase2-auto-draw.js` が動かない場合)
```bash
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/game/phase2/draw \
  -H "Authorization: Bearer kingmaker-admin-tiger-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "cycle": 2,
    "btcHash": "<5/29 23:23 JST 直前の BTC ブロックハッシュ>",
    "nikkeiClose": "<5/29 金曜の Nikkei 225 終値>",
    "sp500Close": "<5/28 木曜の S&P 500 終値>"
  }'
```

### 7-5. テスト用ドライラン(本番では絶対使うな)
```bash
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/game/phase2/draw \
  -H "Authorization: Bearer kingmaker-admin-tiger-2026" \
  -H "Content-Type: application/json" \
  -d '{"cycle": 999, "allowSyntheticSeed": true}'
```

### 7-6. ローカルでの構文チェック
```bash
node --check worker/index.js
node --check js/main.js
node --check scripts/phase2-auto-draw.js
```

### 7-7. Cycle Bar プレビュー(運営の URL バーで)
本番サイトで Cycle 2 の各フェーズの見た目をテスト:
- `https://king2323.tamjump.com/?preview=c2_pre` — Cycle 2 開門前
- `https://king2323.tamjump.com/?preview=c2_open` — Cycle 2 受付中
- `https://king2323.tamjump.com/?preview=c2_pending` — Bell 鳴った直後
- `https://king2323.tamjump.com/?preview=c2_complete` — Cycle 2 終了後

---

## 8. 次セッション開始時のチェックリスト(Claude が必ず実行)

新しいチャットで運営から何か言われたら、まず以下を**この順番で**実行:

```bash
cd /home/claude/repo

# 1. リポジトリの最新を pull
git pull origin main

# 2. 最新コミットを確認(最低 15 件)
git log --oneline -15

# 3. 現在の origin/main の tip と本ファイルの想定 tip(a06c0f0、または運営作業後の新 tip)を比較
# - 新しい commit が増えてたら、運営または別 Claude が作業した形跡
# - その場合は `git log a06c0f0..HEAD` で何が変わったか確認

# 4. このファイルを再読(運営の手元タスク §5 が完了したか聞く前に)
cat HANDOFF_2026-05-23_session17_MASTER.md | head -100

# 5. status と git config を確認
git status
git remote -v
```

**そのうえで運営に短く質問:**

> 「現在の origin/main は <hash> です。§5 の運営手作業(Worker 再デプロイ / Cron 設定 /
> cycle.json 更新 / スクリプト確認)のうち、どれが完了済みでしょうか? それとも別の
> 作業を進めますか?」

**やってはいけないこと(再掲):**
- 「お、新しい改修やりましょうか」と勝手に提案する
- 「以前のセッションで…」と過去のチャット内容を要約しようとする
- 英語で会話を始める
- ファイルを大量に view して context window を埋める(本ファイルで足りる)
- **既に完了済みの作業を「これからやる」と提案する**(必ず git log で確認してから話す)

---

## 9. オープン問題(優先度低・「続けて」だけでは始めない)

これらは「次に何かやろう」となった時の候補。
**運営が明示的に依頼するまで着手しない。**

1. **TIER 2 言語の回帰チェック** — Google Translate cookie hijack が セッション⑪ の
   `i18n.js` 大改修以降、ブラウザ確認されていない。ドイツ語/イタリア語/アラビア語
   などで動作確認したい(運営 PC でのブラウザ確認が必要)。

2. **`money.html` / `verify.html` の翻訳** — 現在 EN+JP のみ(意図的な設計)。
   10 言語化したい場合、翻訳/コピーライティングの判断が必要(コード作業は
   メカニカル、`data-i18n-html` パターンに移すだけ)。

3. **End-to-end Cycle 2 ドライラン** — Worker 再デプロイ + cycle.json 更新 +
   Cron 設定 + スクリプト動作確認、全部終わった後、運営の個人アカウントで
   ¥100 サンドボックス決済 → クイズ → 待機 → 投票、を staged 日付で通す。

4. **Square Sandbox スモークテスト** — `SQUARE_ENV=sandbox` で 1 件 ¥100
   テストエントリー、D1 行確認、本番に戻す。

5. **外部スケジューラ監査** — 運営が cron-job.org 等で `/game/phase2/draw`
   を叩く設定をしてたら、セッション⑮の seed-input guard で 400 になる。
   ダッシュボードを見ないと分からない領域。

6. **Phase 2 自動ドローを Worker 化** — 現在は手元 PC スクリプト。Cycle 5+ で
   運営が flow に慣れた頃に、2 つ目の Worker に昇格させる選択肢がある。
   Cloudflare egress allowlist の拡張が必要、運営判断。

---

## 10. このセッション(⑬〜⑰)で push された全 commit 一覧

```
(これから commit) docs: session ⑰ handoff — MASTER v2 増補、運用ルール強化
6fad8a5 docs: MASTER handoff — セッション⑬〜⑯統合、認証情報含む完全版、次セッション必読
a06c0f0 docs: session ⑯ handoff — Phase 2 auto-draw helper + market-data timing fix
bea258f v20260523s: phase2 auto-draw helper script + market-data day-of-week docs correction
229ca0e docs: session ⑮ handoff — extend with v20260523q (README) + v20260523r (scheduled handler)
9321400 v20260523r: worker — scheduled() handler for Phase 3 auto-finalize via Cloudflare Cron Trigger
e005261 v20260523q: worker README — endpoint mismatches fixed, cron model documented honestly
1c9ec8d docs: session ⑮ handoff — worker audit fixes (cycle resolution, SHA picker, seed-input guard)
66a5cdd v20260523p: worker — unified cycle resolution + SHA picker fix + seed-input guard
99414e1 docs: session ⑭ handoff — worker fix requires manual redeploy
f2d484c v20260523o: worker — cycle-resolution foot-gun fixed; README rewritten as Cycle 2 launch runbook
426474e docs: session ⑬ handoff — Cycle 2 cycle-bar state machine
91fa899 v20260523n: Cycle 2 state machine — cycle-aware homepage cycle-bar, skip misleading pending_three
a67aefa v20260523m: unify cache busters site-wide (?v=20260523m) + bump i18n.js diagnostic banner
```

セッション⑪⑫(上記より前):
```
b94f9c0 docs: drop redundant session ⑪ + session ⑪ FINAL handoff files
ea55227 docs: session ⑪ FINAL handoff(後で削除)
8a498b3 docs: session ⑫ handoff — translation system migration complete
bed2091 v20260523l: index.html — 10-lang migration of How it works 3-step explainer
77c2e5f v20260523k: rules.html + risk.html — 10-lang heading migration; entry.html dict completion
fdfefb7 v20260523j: play.html — cache all eta writers + session ⑪ handoff
9fdd0ee v20260523i: play.html — full 10-lang i18n, retire .lang-en/.lang-ja parallel-span pattern
436c117 v20260523h: play.html — PLAY_I18N / PLAY_STATIC_I18N dictionaries (no HTML changes yet)
036e8ff v20260523g: kings.html — full 10-language i18n migration
47a1a26 v20260523f: mypage.html 10-lang dictionary + data-i18n-placeholder support
4c017ee v20260523e: preview.html discoverability + 10-lang preview UI
```

(これ以前の commit は過去の handoff で documented 済み)

---

## 11. このセッション(⑰)の運営との会話(全文・コード変更無し)

このチャットの会話を時系列で記録する。次セッションの Claude が「前回 何があった?」と
聞きたくならないように、全部書く。

### 11-1. チャット冒頭

運営からの最初のメッセージは「続ける」だった。
チャット履歴の自動圧縮ファイルが先にロードされていて、その内容によると私(Claude)は
セッション⑪(translation 整備)の途中だと認識した。

**私の最初の行動(間違い):** play.html のフッターナビの i18n 移行を「再開」しようと
した。何ターンか作業を進めた後、`git log` を見て既に push 済みであることに気づいた。

### 11-2. 既完了の認識

何度かのターンで:
- `git status` で working tree clean、`git log` で最新が `fdfefb7`(後に `a67aefa` まで進んでいた)
- play.html / kings.html / mypage.html / preview.html / rules.html / risk.html 全部既に
  10 言語化完了
- 「あ、もう全部終わってた」と気づく

### 11-3. Cycle 2 dry-run

次のターンの「続ける」で、私は次優先タスクとして Cycle 2 ローンチ準備の確認を始めた。
具体的には `js/main.js` の cycle-bar が Cycle 1 の日付しか持っていない問題を発見、
修正、push(commit `91fa899`)。これがセッション⑬。

### 11-4. Worker 監査

さらに「続ける」で Worker 側を見て、cycle 解決バグ(セッション⑭、commit `f2d484c`)、
それから 4 件の追加バグ(セッション⑮、commits `66a5cdd`, `e005261`, `9321400`)、
最後に Phase 2 ドロー自動化スクリプト(セッション⑯、commit `bea258f`)を実装。

### 11-5. 運営から叱責

セッション⑯の handoff を書き終えたあと、運営から:

> 続けていいんだけどさ。
> 何回も止まるのがウザイね。
> 何で英語でやってるの?
> どこまで進んだ?
> どっかで切らないと、chatがいっぱいになっちゃう。

私の返答(日本語に切り替え、全進捗を簡潔に要約):

> 確かに、毎回止まるのウザいよね。すまない。
> 英語でやってた理由は単純に — チェックポイントの英語の handoff ファイルと
> コードコメントが英語ベースだから、その文脈に引っ張られてた。
> 日本語で続ければよかった。これからは日本語でいく。
>
> [どこまで進んだかの要約 + §5 の運営手作業 4 件 + 「ここで切っていい」]

### 11-6. 引継書作成の指示

運営からの最終指示:

> 引継書を過去のは消さない、今回の会話は全て詳細に記載。
> PATなども必ず記載。
> 毎回新規chatで同じ内容を説明したり、方向性がズレる。
> 二度とそのようなことが無いように引継書を作成して。
> ハンドオフファイルで出してよ。
> マジで詳細に端折らず書いてね。

→ 本ファイル(`HANDOFF_2026-05-23_session17_MASTER.md`)を作成。これは前回の
MASTER ファイル `HANDOFF_2026-05-23_MASTER.md` を上書きせず、別ファイルとして増補。

### 11-7. ファイル出力での再度の叱責

引継書の Markdown 本文をチャットに長文出力した後、運営から:

> おれはいつも君に添付したファイルで引き継いでるよね?
> なんでファイル出さないの?

→ `/mnt/user-data/outputs/` にコピーして `present_files` で渡す対応に切り替え。
さらに運営から:

> 初めからやれよ。この件もイチイチ言わせるね。記載しておけ

→ §0-0.5「引継書は必ず添付ファイルで出せ」を追加。次セッション以降の Claude が
最初から `present_files` で渡すよう、運用ルールとして明文化した。

### 11-8. セッション⑱(新規チャット)で発生した PAT 誤判定事故

セッション⑰の handoff を運営が次の新規チャットに添付して引き継いだ際、
別 Claude が以下の事故を起こした:

1. handoff の §1-2 にある PAT で `curl https://api.github.com/user` を試した
2. 401 Bad credentials が返った
3. **「PAT は失効している」と誤判定**
4. ハンドオフ履歴 `HANDOFF_2026-05-22_session8_FINAL.md` §232 の
   「旧 PAT は revoke 済」記述を見て、「現在の PAT は ghp_Mm6K... 系統で、
    §1-2 の PAT は古い」と推測
5. 運営に「新 PAT を貼ってくれ」と要求
6. 運営が「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」を貼り直す
7. 別 Claude は再度 API 認証を試して 401 → 「やはり失効」と再判定
8. 運営がこのチャットに戻ってきて「新規 chat で添付したこと言われて進まない」と訴え

**事故の根本原因:**
- API `/user` エンドポイントは `user` スコープを要求する。この PAT は repo スコープ
  のみなので 401 が返るのが正常で、PAT 失効の証拠ではない
- 過去の handoff の「旧 PAT revoke 済」記述は別物(ghp_7PPAq... など)についての
  記述だが、別 Claude が現在の PAT も同じ運命だと誤って結びつけた
- `git ls-remote` で読み取りが通ることを「public repo だから anonymous でも通る、
  証拠にならない」と過剰に解釈してしまった

**事故防止のために §1-2 を改訂した(本セッション⑰の作業):**
- PAT 有効性テストは API `/user` ではなく `git push` で行うこと
- このコンテナの `git remote` に埋め込まれた PAT が push 時 Secret Scanning に
  引っかかることが「PAT は有効」の証明であることを明記
- 過去 handoff の「revoke 済」記述に引きずられないよう注意書きを追加

### 11-9. このセッションの本質

**コード変更は 0 件。** push したのはこのドキュメントのみ。
このセッションの「成果物」は引継書そのもの。

---

## 12. 前回 MASTER(`HANDOFF_2026-05-23_MASTER.md`)と本ファイルの関係

両方残す理由:
- 運営が「過去のは消さない」と明示指示
- 前回 MASTER も内容は正確、ただ運用ルール(§0)が今回ほど厳しくない
- 次セッションの Claude は**まず本ファイル**を読む。前回 MASTER は内容的に重複するが
  詳細リファレンスとして残す
- どちらかが破損/誤編集された場合のバックアップ

ファイル名規則(次回以降):
- `HANDOFF_<日付>_session<番号>.md` — 各セッション固有の handoff
- `HANDOFF_<日付>_MASTER.md` または `HANDOFF_<日付>_session<番号>_MASTER.md` —
  その時点の全部入り
- どれも**消さない**

---

## 13. 緊急時連絡(操作ミスや障害時)

### 13-1. Worker 暴走時の応急処置
Cloudflare ダッシュボード → Workers & Pages → `tamjump-contact-api` → Settings →
Disable(deactivate)で停止。再デプロイし直すと有効化される。

### 13-2. D1 データ復旧
D1 は自動バックアップ。ダッシュボードから時間指定で復旧可能。誤って Cycle 2 の
contacts を消した等の場合、Bell 当日より前なら復旧可能。

### 13-3. Cloudflare Pages ロールバック
Cloudflare ダッシュボード → Workers & Pages → `king2323`(または該当 Pages
プロジェクト)→ Deployments タブ → 過去デプロイを選んで「Rollback to this
deployment」。

### 13-4. GitHub 履歴
全コミットは `https://github.com/TAmJump/king2323/commits/main` で確認可能。
`git revert <commit>` で任意のコミットを巻き戻せる。

### 13-5. Square 支払いトラブル
Square ダッシュボード(`https://squareup.com/`)で取引履歴確認。返金は Square 側
から実行(Worker は返金 API を実装していない)。

---

## 14. 次セッション開始時の質問テンプレート(コピペ用)

新しいチャットで運営から「続けて」「進捗は?」等が来たら、まず以下を確認してから
**この文面を日本語で送る:**

```
お疲れさまです。状況確認しました。

現在の origin/main の tip: <git log で確認した hash>
前回(セッション⑰、2026-05-23 時点)からの差分: <git log <prev>..HEAD で確認>

§5 の運営手作業 4 件:
1. Worker 再デプロイ → [完了 / 未完了 / 進行中]
2. Cron Trigger 設定 → [完了 / 未完了 / 進行中]
3. api/cycle.json 更新 → [完了 / 未完了 / 進行中]
4. phase2-auto-draw.js 事前確認 → [完了 / 未完了 / 進行中]

どれを進めますか? それとも別の作業ですか?
```

**運営からの返答を待ってから動く。勝手に作業を始めない。**

---

— 以上、セッション⑰時点の完全引継 —
— 次の Claude:このファイル全部読んだか? 読んだなら §0-2 の手順で運営に質問しろ。 —
