# HANDOFF · KINGMAKER · session ⑨ → ⑩

**作成:** 2026-05-23 (土) JST · session ⑨ Claude
**前提:** session ⑧ FINAL の MASTER ファイル (operator がローカル保持) を読み込んでこのセッションを開始
**今セッションの作業:** ゲームコア (THE FIVE = Phase 1-3) を完全実装 + Cycle 1 密封手順を確定

---

## § 1. 今セッションでやったこと(短く)

operator 厳命「全部完成まで進めて」を受けて自律実装モードで進行。

1. ✅ D1 migration **0003_game.sql** 新規作成
   - 5 テーブル: `quiz_questions`, `quiz_attempts`, `game_sessions`, `votes`, `cycle_state`
   - 30 問のクイズ問題 × ja/en の 2 言語 = 60 行 INSERT(easy/medium/hard 各 10 群)
2. ✅ D1 migration **0004_cycle1_seal.sql** 新規作成(Cycle 1 を試走 King として密封する SQL)
3. ✅ `worker/index.js` に **8 個の新ルート + 関数群** を追加(約 600 行)
   - `/game/bell-status` · `/game/quiz/start` · `/game/quiz/answer` · `/game/quiz/result`
   - `/game/phase2/draw` · `/game/phase2/result` · `/game/vote` · `/game/vote/results` · `/game/phase3/finalize`
4. ✅ `play.html` 新規作成(約 1,076 行、5 分間ゲームの中核 UI)
   - 7 状態 (pre_bell / quiz / quiz_result / phase2 / vote / post / gate) の状態機械
   - per-question タイマー (35 秒) + 全体カウントダウン
   - Bell SFX (`<audio>` + localStorage ミュート保存 + 同 Cycle 多重再生防止)
5. ✅ `index.html` 更新
   - ヒーロー直下に Bell 中だけ表示する `→ Enter the 5 Minutes` リンク
   - ナビバーに Bell 中だけ表示する `▸ Enter the 5 Min` ボタン
   - 末尾に bell-status ポーラー(30 秒ごとに /game/bell-status を叩いて表示切替)
6. ✅ `assets/sounds/README.md` 作成(operator が音源を入れる場所の案内)
7. ✅ `docs/OPERATOR_v3_GAME.md` 作成(明日のステップバイステップ手順)
8. ✅ `sitemap.xml` の lastmod を 2026-05-23 に更新
9. ✅ `HANDOFF_2026-05-23_session9.md` (本ファイル) 作成

---

## § 2. GAME_SPEC § 7 の 8 つの判断 — 暫定デフォルトで実装

operator 不在で実装したため、以下のデフォルトを採用。
`worker/index.js` の `GAME_CONFIG` を 1 行直すだけで全部変更可能。

| # | 質問 | 採用デフォルト | 変えたい場合 |
|---|---|---|---|
| Q1 | Phase 3 投票権 | A) 全参加者 (落選者も投票可) | `voteRightsAll: false` で通過者のみ |
| Q2 | 5 分の時間配分 | Phase1 120秒 + Phase2 30秒 + Phase3 150秒 | `GAME_CONFIG.phase*DurationSec` |
| Q3 | 同票時 | A) SHA-256 再抽選 | `tieBreakMode` を `"operator"` or `"multi-king"` |
| Q4 | 問題ソース | A) 運営側で 30 問 (シード済) | quiz_questions に INSERT 追加 |
| Q5 | 言語 | B) ja + en 2 言語 | `allowedLanguages` 配列拡張 + DB に翻訳追加 |
| Q6 | Cycle 2 | A) 5/29 (金) 23:23 JST | `bellRingsAtIso` を変更 |
| Q7 | 難易度 | 1 easy + 1 medium + 1 hard | クイズ抽出ロジック (handleGameQuizStart) |
| Q8 | 投票 UI | A) Mission 文のみ (匿名) | play.html の renderCandidate 関数 |

session ⑩ の最初に operator に「デフォルトのままで OK か?」を聞くこと。

---

## § 3. operator が 5/23 にやる作業 (詳細は docs/OPERATOR_v3_GAME.md)

### 必須 (合計 ~15 分)

1. **D1 マイグレーション 0003 を実行**(60 INSERT + 5 CREATE TABLE)
   - Cloudflare D1 Console で 0003_game.sql の中身を実行
2. **Worker 再デプロイ**(新 8 ルート反映)
   - Cloudflare Workers → `tamjump-contact-api` → Edit code に index.js 全コピペ → Save and Deploy
3. **Cycle 1 後処理**(試走 King として密封)
   - 0004_cycle1_seal.sql の中身を実際の Mission データで書き換えて実行

### 任意

4. **Square Production 化**(本物カードで Cycle 2 のテストをしたい場合)
5. **音源を `assets/sounds/bell_2323.mp3` に push**(無くても play.html は動く)

---

## § 4. ファイル変更まとめ

```
新規:
  worker/migrations/0003_game.sql       268 行 (5 table + 60 seed)
  worker/migrations/0004_cycle1_seal.sql 99 行 (Cycle 1 密封用 SQL)
  play.html                           1,076 行 (5 分ゲーム UI)
  assets/sounds/README.md              30 行 (音源プレースホルダ)
  docs/OPERATOR_v3_GAME.md            ~180 行 (5/23 手順)
  HANDOFF_2026-05-23_session9.md      (本ファイル)

更新:
  worker/index.js   1,422 → 2,018 行 (+596 行、ゲーム関数 9 + ルート 8 追加)
  index.html        ヒーローリンク + ナビボタン + bell-status ポーラー追加
  sitemap.xml       lastmod を 2026-05-23 に
```

---

## § 5. session ⑩ Claude への引き継ぎ

### 必須コンテキスト

- session ⑧ MASTER ファイル(`HANDOFF_2026-05-22_session8_MASTER__1_.md`)が依然 operator がローカル保持
- 全 credentials (PAT, ADMIN_TOKEN, Square sandbox 認証など) はそのファイルの § 1
- 本ファイル(session ⑨ → ⑩)は GitHub repo の root に push されている → 直接読み込み可能

### 最初にすること

1. operator に "Cycle 1 密封と Cycle 2 ゲーム実装、お疲れさまでした" と挨拶
2. operator に確認: 「デフォルト判断 (§ 2 の 8 問) で進めて OK ですか?変更点ありますか?」
3. operator が 5/23 の手順 (§ 3) のうちどこまで完了したか確認
4. 未完了の手順があれば一緒にやる

### 推測しないこと(operator 厳命)

- ❌ 1 ターン 1 質問。複数質問はしない。
- ❌ "完成までやって" と言われていない限り、勝手に作業を進めない。
- ✅ 過去のやり取りは絶対に消さない。本 handoff も含めて全部 repo に残す。

### 重要な技術的注意

1. **`/game/quiz/start` は冪等**
   - 同じ session_id (cycle × ticket) があれば返すだけ。INSERT は最初の 1 回のみ。
2. **`/game/phase2/draw` も冪等**
   - 既に `cycle_state.phase2_winner_king_ids` があれば既存値を返すだけ。
3. **`/game/phase2/draw` と `/game/phase3/finalize` は手動トリガー**
   - ADMIN_TOKEN が必要。Cron が組まれていない(将来追加すべき)。
   - 23:25 ごろに operator が手で叩く運用、または curl で叩く小スクリプトを用意する。
4. **Bell SFX**
   - `assets/sounds/bell_2323.mp3` が無い場合は console.warn のみで進行。UI は壊れない。
5. **`paid=1 AND founding_cohort=currentCycle`** の二段ガード
   - 過去 Cycle の参加者は新 Cycle で entry し直す必要がある(Bell は永続だが、毎回 ¥100 のリングが必要)。
   - operator はこれを「正しい挙動」と認識している(Bell 思想)。

---

## § 6. 既知の未実装 / 後回し

1. ⏳ **Cron による自動トリガー** — Phase 2 / Phase 3 finalize の自動化
   - 現状: operator が手動 curl
   - 将来: Cloudflare Cron Trigger を Worker に追加
2. ⏳ **9 言語化** — 現在 ja + en のみ
3. ⏳ **問題プール拡張** — 現在 30 問。Cycle 5 までには 100 問必要
4. ⏳ **Phase 2 の現実シード** — 現状は operator が btcHash / nikkei / sp500 を手で渡す
   - 将来: Worker 内で外部 API 呼び出し
5. ⏳ **Mission Fund 累計表示** — kings.html / verify.html に総額表示
6. ⏳ **KYC + AML フロー** — Grant 配賦時の本人確認
7. ⏳ **音源** — operator が後日作成

---

## § 7. 今夜やるべき次の一手

operator がこのリポを clone or pull すれば、すべて反映されている。
**最低限の 5/23 動作確認:**

```bash
# 1. Bell status が新形式で返るか確認
curl -s https://tamjump-contact-api.animalb001.workers.dev/game/bell-status | python3 -m json.tool

# 2. Cycle 2 用に operator が entry し直す (paid=1, founding_cohort=2 を作る)
# → entry.html から本人テスト

# 3. 5/29 (金) 23:23 に本番 Cycle 2 開門
```

---

— session ⑨ Claude · 2026-05-23 (土) JST
