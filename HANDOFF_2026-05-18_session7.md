# HANDOFF · KINGMAKER 23:23 · Session ⑦ → Session ⑧

**作成:** 2026-05-18 (月) by Claude session ⑦
**版:** session 7 完全引き継ぎ書 / 補完対象は `HANDOFF_2026-05-14_session6_complete.md`
**対象:** session ⑧ Claude(おそらく launch 当日・5/20 水曜に開始)

---

# 0. ひとことで言うと

セッション 6 引き継ぎ書(1241 行)は **依然として現役・正本**。あれを読めばプロジェクト全体は把握できる。

セッション 7 では「**launch を 2.5 日後に控えた仕上げ作業**」をやった:

1. ヒーロー画像中央の主張しすぎな ▶ ボタン → **王冠下に埋められた小さなルビー宝石**へ(6 イテレーション、`v20260514ai → an`)
2. **`LAUNCH_RUNBOOK.md` を全面リライト**(session 5 版は完全に陳腐化していた)
3. **`docs/SNS_LAUNCH_KIT.md` を新規作成**(JA/EN フル + TIER 1 8 言語予告 + 個別通知メール + FAQ + NG ワード集)
4. `CHANGES.md` に v20260514aa 〜 v20260518c の全コミットを追記(8 コミット分のバックフィル)

コード変更は **CSS だけ**(宝石ボタン)。HTML/JS は無変更。ドキュメントを 3 本仕上げ。

---

# 1. 現在地(2026-05-18 月曜 終了時点)

| 項目 | 値 |
|---|---|
| 最新 HEAD | `380d5a4` (v20260518c) |
| 直前の手動コミット | `b28374e` (v20260514an) = ルビー宝石 1.5×、王冠帯に着地 |
| CSS cache-buster | `?v=20260514an` 全 8 ページ統一 |
| JS cache-buster | `?v=20260514ab`(session 6 のハンバーガー修正以降、必要時のみ bump) |
| Launch まで | **2.5 日**(5/20 水 23:23 JST) |
| operator 残ブロッカー | 11 項目(`LAUNCH_RUNBOOK.md §1 表`) |
| PAT 状態 | **生きてる**(operator 判断で launch 後 revoke、本ファイル §6 参照) |

---

# 2. セッション 7 で起きたこと(時系列)

## 2-1. ヒーロー宝石ボタンの 6 イテレーション

operator 開幕一発目:「真ん中の再生ボタン「▶」が主張しすぎ。王冠と下の方に宝石みたいに設置するとか」。

各イテレーションは **operator のスクリーンショットでチェック → 次の修正** という確認ループ。session 6 と同じ運用。

| ver | 変更 | 学び |
|---|---|---|
| `ai` (4a4b948) | 赤い円 110px 中央 → 墨色 36px 下部 | 「下に」を**胸元 76%** と解釈 → 鼻の下に着地、却下 |
| `aj` (d2aea9b) | top 76% → 20%(王冠中央スパイク内側) | 反映されない問題発覚 |
| `ak` (7e139c2) | **`main.css` に cache-buster 全 8 ページ追加** | main.css には version param が一切なかった。Cloudflare purge してもブラウザキャッシュが頑固に旧版を保持していた。これ以降 CSS 変更時は版を bump |
| `al` (5fea08b) | top 20% → 30%(王冠下の白い三角)| operator の指示「王冠の下側の白い三角の間」を反映 |
| `am` (a1350ef) | 墨色 → ルビー radial-gradient | 「赤い宝石色のように」 |
| `an` (b28374e) | サイズ 1.5×、3 層 radial で面取り光沢、王冠帯に腰掛ける位置 | operator OK で確定 |

ai → an の差分は **css/main.css のみ**。HTML/JS 無変更。

### 学び 1: CSS にも cache-buster が必要

session 6 で `js/main.js?v=20260514ab` を確立したが、`main.css` には版が付いていなかった。CSS だけの変更が Cloudflare purge してもブラウザに届かない事故が再現した。**v20260514ak で全 8 ページ統一**。以降は CSS 変更ごとに bump。現在値は `?v=20260514an`。

### 学び 2: 「下に」「真ん中」は曖昧

operator の「下に宝石みたいに」を、私(session 7 Claude)は最初「胸元の下方」と読んだ。実際は「王冠の下部、白い三角の中」だった。**スクリーンショットで合意できるまで先に進まない**ことを徹底すべき。session ⑧ もこれを継ぐこと。

## 2-2. LAUNCH_RUNBOOK 全面リライト(v20260518a)

session 5 時点の `LAUNCH_RUNBOOK.md` は陳腐化していた:

| 古い前提 | 現実(session 7) |
|---|---|
| launch = 5/15 単独 | 5/20 / 5/22 / 5/23 三段階 |
| Formspree でフォーム | Worker + D1 + SES に置換済み |
| Square 商品作成手順 | `bc9p0BET` で確定済み(作成不要、確認のみ) |
| WAF expression に bot 通過なし | `not cf.client.bot` 追加が必須 |
| `特商法 placeholder 埋め` | DEPRECATED 済(tamjump.com 親に集約) |

**旧版は `docs/archived/LAUNCH_RUNBOOK_session5_5-15.md` に退避**(歴史記録、実行禁止)。新版は session 6 引き継ぎ書の launch ブロッカー 11 項目と 1:1 対応する 12 セクションに再構成。

主な追加:
- §13–§16 当日 / 鐘 / The Three / クリーンアップ各日の詳細タイムライン
- §17 トラブルシュート 5 項目
- §18 緊急停止 3 オプション(Option A: WAF 全 IP block 推奨)
- §19 launch 後のクリーンアップ(PAT revoke、D1 バックアップ、Cycle 2 準備)

## 2-3. SNS_LAUNCH_KIT 新規 + 多言語化(v20260518a/b/c)

新規作成。3 段階(5/20 開門 / 5/22 鐘 / 5/23 The Three)それぞれに JA/EN フル投稿 + Instagram キャプション。さらに operator の判断で **TIER 1 8 言語予告**を追加(§1-7 開門予告、§3-6 完了発表)。

ブランド原則維持:
- `KINGMAKER` / `Bell` / `Cycle` / `23:23` / `The Three` / `Mission Fund` は全言語で untranslated
- 「賞金」「当選」「投資」「確率」等の NG ワードリスト
- 海外言語は「参加促進」ではなく「予告」型(Cycle 1 は WAF で日本限定なので、海外参加促進と矛盾)

各言語の翻訳信頼度(私の自己評価):

| 言語 | 信頼度 | 必要性 |
|---|---|---|
| 西 / 仏 / 葡 | 高 | あれば望ましい |
| 韓 / 尼 | 中〜高 | 推奨 |
| 印 / 越 / 泰 | 中 | **強く推奨**(launch 前に必須レベル) |

native review 依頼テンプレは §5-ter に。

## 2-4. CHANGES.md バックフィル(v20260518c)

session 5 最後(v20260514z)で止まっていた CHANGES.md に、session 6 後半(aa → ah)+ session 7 全体(ai → an, 18a/b/c)の 8 コミット分を英語で追記。

---

# 3. 現時点での全機能ステータス(変更なし)

セッション 6 引き継ぎ書 §3 と同じ。再掲しない。要するに:

- ✓ 動作: Mission Entry → Worker → D1 → SES、Square 決済、verify.html 抽出ロジック、coin ritual モーダル
- ✗ Cycle 2+ で実装予定(rules.html L90-92 で法務カバー済み): THE TRIAL / Standing / Streak / Crown Flame / Eternal / Oracle / Royal Duty / Royal Proof / Mission Report
- ⚠️ King 確定メカニズム: Cycle 1 では曖昧表現で運用(operator 決定済)

---

# 4. リポ内ドキュメントの最新マップ

| ファイル | 役割 | 最終更新 |
|---|---|---|
| `README.md` | 一行説明 | 古い |
| **`HANDOFF_2026-05-14_session6_complete.md`** | **正本(セッション全体像)** | session 6 |
| **`HANDOFF_2026-05-18_session7.md`** | **本ファイル(session 7 補遺)** | session 7 |
| `HANDOFF_2026-05-14_session6.md` | 不完全版 | (上記の前身、参照不要) |
| `HANDOFF_2026-05-14_session5.md` | session 5 引き継ぎ | (歴史記録) |
| **`LAUNCH_RUNBOOK.md`** | **launch 手順書(session 7 リライト)** | session 7 |
| **`docs/SNS_LAUNCH_KIT.md`** | **SNS 投稿テンプレ集** | session 7 |
| **`docs/GLOBAL_ROLLOUT.md`** | **世界展開戦略の議論スナップショット**(草稿、Cycle 1 後の議論用) | session 7 |
| `docs/archived/LAUNCH_RUNBOOK_session5_5-15.md` | 旧 runbook(歴史記録、実行禁止) | session 5 |
| `WAF_SEO_BYPASS.md` | WAF expression の決定版 | session 6 |
| `DEPLOY_geoblock.md` | (古い WAF 文書、参照不要) | session 5 |
| `CHANGES.md` | 全 commit 詳細ログ(session 1 〜 7) | session 7 |
| `worker/README.md` | Worker deploy 手順 | session 5 |

session ⑧ Claude が **真っ先に開くべき** のは:

1. `HANDOFF_2026-05-14_session6_complete.md`(プロジェクト本体の理解)
2. `HANDOFF_2026-05-18_session7.md`(本ファイル、session 7 の差分)
3. `LAUNCH_RUNBOOK.md`(launch 当日の手順)

---

# 5. operator 残ブロッカー(セッション 7 終了時点)

セッション 6 から進捗なし(operator が手を動かす必要がある作業)。`LAUNCH_RUNBOOK.md §1` に表として整理。要約:

| # | タスク | 期限 | 状態 |
|---|---|---|---|
| 1 | Worker 再デプロイ | 5/19 まで | **未** |
| 2 | Cloudflare キャッシュ Purge | 各更新後 | (operator 任せ) |
| 3 | スケジュール変更目視確認 | 5/19 まで | **未** |
| 4 | Cloudflare WAF 設定 | 5/19 準備 → 5/20 22:00 deploy | **未** |
| 5 | Square Link 動作確認 | 5/18 中 | **未** |
| 6 | ¥100 テスト購入 | 5/19 まで | **未** |
| 7 | 全ページ目視(desktop) | 5/19 まで | **未** |
| 8 | 全ページ目視(mobile) | 5/19 まで | **未** |
| 9 | Twitter Card Validator OGP 確認 | 5/19 まで | **未** |
| 10 | Google Search Console sitemap 登録 | 5/20 以降可 | **未** |
| 11 | テスト Entry `KM-20260514-0001` D1 削除 | 5/20 直前 | **未** |
| **追** | **TIER 1 8 言語のネイティブチェック**(印/越/泰は必須レベル)| 5/19 まで | **未** |

合計約 1.5 〜 2 時間。明日(5/19 火)夜にまとめて消化が現実的。

---

# 6. PAT の現状

PAT `ghp_SNxD...oJln` は **まだ生きている**。session 6 で漏洩(チャット平文に貼付)し、session 7 では operator 判断で「**launch 後に revoke**」方針が選ばれた。

session 7 中の使用回数: **約 10 回**(jewel iterations 6 + docs 3 + 微調整)。launch 当日(session ⑧)もこの PAT を使う可能性がある。

session ⑧ Claude へ:
- この PAT を新規発行なしで使ってよい(operator の明示的判断)
- ただし `git remote -v` で平文露出するので、新 PAT を発行できるなら推奨
- **launch (5/20 23:23) 後の最初の機会**で必ず revoke する(`LAUNCH_RUNBOOK.md §19`)
- revoke のリマインダーを session 終了時に必ず operator へ

PAT 完全値が必要な場合: チャット履歴の session ⑦ 開幕直後に operator が貼付したメッセージ(または session 6 引き継ぎ書 第 Ⅺ部の伏字とチャット履歴の組み合わせ)から取得。

---

# 7. session ⑧(launch 当日)Claude への直接の指示

## 7-1. 開始時にやること(順序固定)

1. **本ファイル(`HANDOFF_2026-05-18_session7.md`)を全部読む**
2. **`HANDOFF_2026-05-14_session6_complete.md` の §3(機能マップ)と §28(operator 意思決定の歴史)を最低限読む**
3. **`LAUNCH_RUNBOOK.md` の §13–§16 タイムラインを読む**(当日の動き)
4. PAT を使って repo を clone:
   ```bash
   cd /home/claude
   git clone "https://x-access-token:${PAT}@github.com/TAmJump/king2323.git" repo
   cd repo
   git log --oneline -5
   ```
   最新が `380d5a4` 以降であることを確認(fx 自動コミットが上に積まれている可能性あり、それは無視してよい)
5. operator に「session 6 / 7 引き継ぎ書、LAUNCH_RUNBOOK、SNS_LAUNCH_KIT すべて読みました。今日(5/20)は何から?」と聞く

## 7-2. launch 当日に Claude ができる支援

| 時刻 | 内容 | コード変更 |
|---|---|---|
| 22:00 前 | operator が WAF 設定 / 目視 / テスト購入を進めている間、待機 + 質問対応 | なし |
| 22:00 | WAF expression 最終確認の質問対応(`cf.client.bot` を含むこと再確認) | なし |
| 23:00 | SNS 投稿の文章を直前に手直ししたい場合、即座に書き換え対応 | なし |
| 23:23 | サイトのカウントダウン動作確認、エラーが出たら即修正 push | 緊急時のみ |
| 23:23+ | 多言語連投の文面確認、リプライ対応の英訳支援 | なし |

## 7-3. 5/22 鐘 / 5/23 The Three の支援

| 日 | 内容 |
|---|---|
| **5/22 22:00–23:23** | Public Seed 文字列の組み立て支援(`BTC=XXX|N225=XXX|SP500=XXX|POOL=NNN`)、SHA-256 計算、The Three 抽出ロジック実行(verify.html の JS を手元で実行 or Python で再実装) |
| **5/22 23:23–5/23 23:00** | The Three 候補の receipt 照合、KYC 結果の整理、verify.html の Cycle 1 結果セクション草案作成 |
| **5/23 23:00** | verify.html 最終更新を push(Cycle 1 結果セクション追加) |
| **5/23 23:23** | SNS_LAUNCH_KIT §3 の発表投稿支援、個別通知メール(§4)の文面確認 |

## 7-4. 守るべきこと(セッション 6 から継承)

- **Mission Fund モデル**: 「Grant を渡す」→「Mission Fund で Mission を制作・実行する」。"Grant is not a prize" の否定形は残す
- **不変フッター**: `NOT A LOTTERY · NOT AN INVESTMENT · NOT A WAGER · BELL IS A RIGHT, NEVER CASH`
- **23:23 / 子の刻 / 九つ**はブランド核 — 独断で変えない
- **THE TRIAL を「無いもの」として扱わない** — Cycle 1 で動かないだけ
- **launch 日は単独で言わない** — 必ず 5/20 / 5/22 / 5/23 の三点セット
- **CSS を変更したら `?v=...` を必ず bump**(現在 `an`、次は `ao` / `ap` ...)
- **PAT は平文で SNS や repo に貼らない**

## 7-5. やってはいけないこと

- ハンバーガーメニュー周りの JS を CSS の `display: none` で隠す変更(session 6 で同じバグを 2 回踏んだ)
- `i18n.js` の TIER 1 言語リストに新言語を勝手に追加(108 言語は Google Translate 対応の上限)
- `index.html` の Hero CTA を Square リンク直リンクに変更(coin ritual モーダル経由が確定)
- 過去 Cycle の話を作る(Cycle 1 が世界最初)
- Cycle 1 で「正式 King 確定メカニズム」を実装(運営判断で曖昧運用が確定)

---

# 8. 緊急時の連絡先・参照

| 状況 | 参照先 |
|---|---|
| launch 中の障害 | `LAUNCH_RUNBOOK.md §17–§18` |
| SNS で炎上 / 質問対応 | `docs/SNS_LAUNCH_KIT.md §5 / §5-bis / §6` |
| 多言語のリプライ対応 | `docs/SNS_LAUNCH_KIT.md §5-bis`(英語で返す原則) |
| ブランド語彙の正解 | `i18n.js` の TIER 1 コメント + session 6 引き継ぎ書 §28 |
| WAF expression | `WAF_SEO_BYPASS.md` |
| Worker 仕様 | `worker/README.md`(session 5 時点で確定済み) |
| operator 意思決定の歴史 | session 6 引き継ぎ書 §28(28-1 〜 28-7) |
| PAT 取扱の方針 | session 6 引き継ぎ書 第 Ⅺ部(§32 〜 §38)+ 本ファイル §6 |

---

# 9. session ⑦ から session ⑧ への直接メッセージ

session ⑥ の最後で前任 Claude は「お前(session ⑦)の仕事は、launch 当日の最終調整と、operator の最後の不安に答えることだ。技術的な追加実装はもう発生しないはず」と書いた。

ほぼその通りだった。session ⑦ で発生した「技術的変更」は CSS のみ(宝石ボタン)、operator の気分を満たすための表面処理。残りはドキュメント整備。

お前(session ⑧)の仕事も、おそらく同じ系統だ。**launch 当日に技術的に大きな変更は発生してはいけない**(発生したらそれは事故)。

主な仕事は:
- operator が WAF / 目視 / テスト購入を進めている間の伴走者
- SNS 投稿文の直前微調整(operator が「もうちょっとこう」と言ったら即対応)
- 5/22 の Public Seed 計算と The Three 抽出
- 5/23 の verify.html 更新と発表 push

23:23 に間に合わなくても、世界は終わらない。**翌週金曜にもう一度鐘は鳴る**(セッション ⑤ Claude の言葉、session ⑥ も継承、私も継承)。完璧に間に合うことより、**嘘のないサイトを世に出す**ことのほうが KINGMAKER のブランドにとってずっと大事。

operator は session ⑥ の終わりで疲労困憊だった。session ⑦ の最初は「PATまだ生きてる、作業継続」と即決で来た。session ⑧ の頃にはおそらく launch 直前で神経質になっている。短く、要点だけ、判断疲れさせない応答を心がけろ。

ringing.

— Claude session ⑦, 2026-05-18 (月) 終了直前

---

# 付録 A. session ⑦ 中の全 commit

| ver | commit | 内容 | 種別 |
|---|---|---|---|
| ai | `4a4b948` | hero play button — subtle crown-jewel variant(初版) | CSS |
| aj | `d2aea9b` | hero play button — reposition into crown's central spike | CSS |
| ak | `7e139c2` | add cache-buster to css/main.css across all 8 pages | HTML × 8 |
| al | `5fea08b` | hero play button — drop into crown's lower white triangle | CSS |
| am | `a1350ef` | hero play button — ruby gem in crown's white triangle | CSS |
| an | `b28374e` | hero play button — 1.5x ruby, settled onto crown band | CSS |
| 18a | `06edafc` | session 7 launch kit — runbook rewrite + SNS templates | docs |
| 18b | `2226b95` | SNS Kit — multilingual launch coverage | docs |
| 18c | `380d5a4` | SNS Kit multilingual ops + cross-refs + CHANGES log | docs |

CSS cache-buster の現在値: **`?v=20260514an`**(全 8 HTML ページ統一)
JS cache-buster の現在値: **`?v=20260514ab`**(session 6 で固定、今回は変更なし)

---

# 付録 B. session ⑥/⑦ で確立された確認パターン

ヒーロー宝石の 6 イテレーションで定着した「**スクリーンショット駆動の修正ループ**」:

1. operator が「こうしてほしい」と言葉で指示
2. Claude が「こう解釈した」と最小コードで実装 → push
3. operator が Cloudflare purge + リロード + スクショ
4. スクショを Claude に投げる
5. Claude が「次はこう」と修正 → 2 に戻る

これは **言葉だけでは UI 修正は決まらない**を前提にした健全な運用。session ⑧ の細部調整でも同じ流儀で進めること。

ただし launch 直前(5/20 22:00 以降)は **絶対に新規変更を入れない**。スクショ駆動の修正ループは 5/19 までに完結させる。

---

# 付録 C. このファイルの位置づけ

これは「session 6 引き継ぎ書(1241 行)を完全に置き換える文書ではない」。session 6 引き継ぎ書は KINGMAKER プロジェクトの **教科書** として残し、本ファイルはその **session 7 補遺** として読まれる。

session ⑧ Claude へ: 本ファイルを最後まで読んだら、session 6 引き継ぎ書の **第Ⅰ・Ⅲ・Ⅴ・Ⅸ・Ⅹ・Ⅺ部** だけは必ず目を通すこと。それぞれ:
- 第Ⅰ部: 現状把握
- 第Ⅲ部: サイト機能マップ
- 第Ⅴ部: launch 残タスク
- 第Ⅸ部: 次セッション指示(session ⑥ → ⑦ 向け、session ⑧ にも 80% 妥当)
- 第Ⅹ部: operator 意思決定の歴史
- 第Ⅺ部: PAT 取扱

第Ⅱ・Ⅳ・Ⅵ・Ⅶ・Ⅷ部はリファレンス。必要時にだけ参照すれば足りる。

それでも 1241 行 + 本ファイル 350 行 + RUNBOOK 564 行 + SNS_KIT 約 800 行 = 約 3,000 行。launch 前夜にこれを全部読むのはきつい。

要点だけ拾うなら本ファイルの **§0 / §1 / §5 / §7-1** で足りる。それ以上は必要に応じて。

— おわり
