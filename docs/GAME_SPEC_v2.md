# KINGMAKER 23:23 — Cycle 2+ ゲーム仕様書 (v2)

**作成:** 2026-05-22 (金) 23:18 JST · session ⑧ Claude
**発議:** operator 2026-05-22 Cycle 1 進行中の指示

> 5分間のゲームは?
> ランダムでクイズ出題、3問正解した人だけ次のステージ。
> 次のステージはランダムで機械が3人選ぶ。
> 最後は参加者全員が3人の欲望から1人を選んで、一番多かった欲望の人がking。
> 明日、本番用にして、全ての機能を完成させる。
> 金曜日の23:23に鐘が鳴るようにもしたい。金の音は後で作る。

これは **session ⑤ 時代から「THE TRIAL」「King 確定メカニズム」と曖昧に呼ばれていたゲームの完全仕様化**。operator の上記発言が**正典**。

---

# § 1. 全体タイムライン(Cycle 2 以降の正式版)

```
T-???                    Day0:    Cycle 開門 (Bell opens)
                                  Mission Entry 受付開始 (¥100 / 1 Mission)
                                  期間: 46 時間想定(operator 確認待ち、Cycle 1 と同じか)
T+0:00:00                Fri:     Bell rings @ 23:23 JST
                                  ╔═══════════════════════════════════╗
                                  ║  5分間のゲーム開始(THE FIVE)     ║
                                  ╚═══════════════════════════════════╝
                                  ├─ Phase 1: クイズ (3 問突破 → 通過)
                                  ├─ Phase 2: SHA-256 抽出 (機械的に 3 人選定)
                                  └─ Phase 3: 全参加者投票 (3 人の Mission から 1 つ選ぶ)
T+0:05:00                Fri:     Bell closes @ 23:28 JST
                                  King 確定
T+0:05:01 〜 翌 23:23    Sat:     運営審査(KYC + AML + 法令確認 + Mission Fund 残高確認)
T+1:00:00                Sat:     The Three 公開 + King 公開 (23:23 JST 翌日)
                                  Hall of Kings に永続記録
```

**5 分間** = 23:23:00 〜 23:28:00 JST。この 5 分でゲーム全フェーズが完結する。

---

# § 2. Phase 1: クイズ(THE TRIAL)

## 2-1. ルール

- Bell rings の瞬間、Mission Entry 済みの全参加者に **3 問のクイズ**が同時に出題される
- **ランダム出題**: 問題プールから当該 Cycle 用に毎回ランダム抽選
- **3 問正解した人だけ Phase 2 (抽選プール) に進める**
- 失敗してもエントリー料 ¥100 は失わない(Bell は残る、儀式)
- **失うのは「今 Cycle の King 候補資格」だけ**

## 2-2. 制限時間

- **5 分間のうち、Phase 1 に最大 2 分**(operator 検討事項)
- 1 問あたり ~30-40 秒
- タイムアウト = 不正解扱い

## 2-3. 問題プール設計(運営側)

問題は **ブランド世界観に合うジャンル**:

| カテゴリ | 例 |
|---|---|
| 23 と 23 のエニグマ | 23 という数字が登場する事象 |
| 王と歴史 | 各国の王朝・象徴 |
| 道徳ジレンマ | 「あなたなら誰を救うか」型 |
| パターン認識 | 数列・図形 |
| 倫理的判断 | Mission Fund 配分の優先順位 |

**機密性**: 問題は Cycle 開門の **直前**に Worker 経由で動的配信。事前にプール全体は見えない設計。

## 2-4. 技術設計

- **新テーブル**: `quiz_questions` (id, category, question, choices_json, correct_index, difficulty, language)
- **新テーブル**: `quiz_attempts` (id, cycle_number, contact_ticket, question_id, chosen_index, is_correct, answered_at)
- **新ルート**: `GET /game/quiz/start?token=<session>` — 当該 Cycle 用のセッションを発行、3 問返す
- **新ルート**: `POST /game/quiz/answer` — 解答送信、即時判定
- **新ルート**: `GET /game/quiz/result` — 3 問全部回答後、Phase 2 進出資格を返す

## 2-5. UX

- Bell が鳴った瞬間 → `entry.html` で決済済みの人だけ「Enter the 5 Minutes」ボタンがアクティブに
- クリック → 全画面モード(rules 説明スキップ、いきなり Q1)
- 1 問ずつ、選択肢は最大 4 つ、タップ即送信
- 3 問終了直後に通過/敗退判定 → 通過なら Phase 2 待機画面、敗退なら「Bell は残る、また来週」画面

---

# § 3. Phase 2: SHA-256 抽出(機械が 3 人選ぶ)

## 3-1. ルール

- Phase 1 通過者の集合から **機械が 3 人をランダム選定**
- ランダムシード: **Bell rings 時刻の Bitcoin block hash + Nikkei 225 終値 + S&P 500 終値 + 通過者総数**
- SHA-256 でハッシュ化、それを 3 つの数値に分割、通過者リストの index に modulo
- **operator/Claude を含む誰も介入できない**(検証可能)

## 3-2. 検証可能性

- 公開シード(4 要素)+ SHA-256 ハッシュ結果を `verify.html` で公開
- 誰でも同じハッシュを計算して、正しい 3 人が選ばれたことを検証できる
- 既存の `verify.html` のロジックを Phase 2 抽出に転用

## 3-3. 技術設計

- **新ルート**: `POST /game/phase2/draw` — 運営トリガー(自動 cron も可)、SHA-256 抽出を実行
- **更新テーブル**: `kings` を「The Three(3 人)」記録に使い、最終 King 確定後に `rank=1` を更新
- 既存 `verify.html` の HISTORY 配列に Cycle 2 以降のデータを動的追加

## 3-4. UX

- Phase 1 通過者の画面: 「Phase 2 抽出中…」のアニメーション(SHA-256 ハッシュ計算が回る視覚効果)
- 30 秒程度のショー
- 終了後、選ばれた 3 人の Mission が全画面に表示される(本人の Mission 名 + Mission 内容 + 国 + ハンドル名)

---

# § 4. Phase 3: 全参加者投票(欲望の選定)

## 4-1. ルール

- **Phase 1 通過/敗退に関わらず、Cycle 参加者全員が投票可能**(operator 確認要 — 通過者だけにするのか)
- 3 人の Mission(=「欲望」)から **1 つを選ぶ**
- **一番多かった Mission の人 = King**
- 同票時: SHA-256 再抽選 or 運営判定(operator 検討事項)

## 4-2. 制限時間

- **5 分間のうち、Phase 3 に約 1-2 分**(残り時間配分は operator 検討)

## 4-3. 技術設計

- **新テーブル**: `votes` (id, cycle_number, voter_contact_ticket, voted_for_king_id, voted_at)
- **新ルート**: `POST /game/vote` — 投票送信
- **新ルート**: `GET /game/vote/results` — リアルタイム集計(Bell closes の瞬間まで返さない or 投票後即時)
- **新ルート**: `POST /game/phase3/finalize` — 5 分終了時に集計確定、King を `kings.rank=1` に昇格

## 4-4. UX

- 3 人の Mission カードを並べた選択画面
- 「あなたが叶えたい欲望はどれか」
- タップで投票(1 人 1 票、変更不可)
- 投票後に「結果は 23:28 JST に発表」画面 → カウントダウン
- 23:28:00 JST → King 名 + Mission が flash で発表 → Hall of Kings に永続記録

---

# § 5. 金曜 23:23 の鐘の音(Bell SFX)

## 5-1. 仕様

- **金曜日 23:23 JST ちょうど**に音が鳴る
- operator が音源を作成・準備(後日)
- 音源 → `assets/sounds/bell_2323.mp3` or `.ogg`(両方推奨)

## 5-2. 技術設計

- `index.html` に Web Audio API or `<audio>` タグでプリロード
- `js/main.js` の cycle phase timer が `open` → `pending_three` に切り替わる瞬間にトリガー
- ブラウザ自動再生ポリシー対応: ユーザー操作後にのみ音声準備状態に
- ミュートトグル必須(右下に「🔔 Sound: ON/OFF」ボタン)
- localStorage で `bell_sfx_enabled` を保存(デフォルト ON)

## 5-3. 多重再生防止

- `localStorage.bell_last_played_cycle` で Cycle 番号を記録、同一 Cycle で 1 回のみ再生

---

# § 6. 実装優先順位(明日 5/23 着手)

## 6-1. Phase A: 翌日(5/23) 23:23 までに(残り 24 時間)

operator の指示「明日、本番用にして、全ての機能を完成させる」より:

1. **Square Production 化** (5 分)
   - Square Developer の Production タブから 3 値取得
   - Cloudflare で 4 secrets 更新
   - 動作確認

2. **Cycle 1 The Three 手動選定 + Hall of Kings 投稿** (30 分)
   - 5/22 23:23 で受付終了済の D1 から参加者確認
   - 手動で kings テーブルに INSERT(SQL 提示済 → docs/OPERATOR_v2_SETUP.md)
   - 23:23 23:23 JST に The Three 公開

3. **Game core (Phase 1-3) コーディング** (8-12 時間)
   - D1 schema: `quiz_questions`, `quiz_attempts`, `votes`
   - Worker routes: `/game/quiz/start`, `/game/quiz/answer`, `/game/quiz/result`, `/game/phase2/draw`, `/game/vote`, `/game/vote/results`, `/game/phase3/finalize`
   - 新ページ: `play.html` (5 分間ゲームの中核画面)
   - 既存 `entry.html` から `play.html` への遷移ロジック
   - クイズ問題シード(初期 30 問程度、9 言語化)

4. **Bell SFX 実装** (1 時間、音源は後日)
   - audio element + auto-trigger + mute toggle + localStorage

## 6-2. Phase B: Cycle 2 開門前(5/27 23:23 想定)

5. **9 言語 i18n を v2 ページに反映**(entry / mypage / kings / play)
6. **Mission Fund 残高表示** (Hall of Kings に「現在の累計プール」表示)
7. **クイズ問題プール拡張** (50-100 問、運営確認済)
8. **本人確認 (KYC) フロー設計** (Grant 配賦時)

---

# § 7. operator 確認事項(明日朝までに answer)

これらは Claude が決め打ちで進められない設計判断:

| # | 質問 | 候補 |
|---|---|---|
| Q1 | Phase 3 投票権は誰? | A) 全参加者 / B) Phase 1 通過者のみ / C) 通過 + 落選両方ともだが落選者は 1 票の重み 0.5 |
| Q2 | 5 分間の時間配分 | A) Q1 2分 + Q2 30秒 + Q3 2.5分 / B) Q1 90秒 + Q2 60秒 + Q3 90秒 + 余白 / C) operator が決める |
| Q3 | 投票が同票だった場合 | A) SHA-256 再抽選 / B) 運営判定 / C) 全員 King(複数 King 制) |
| Q4 | クイズ問題のソース | A) 運営側で 100 問書く / B) Wikipedia API でランダム / C) AI 生成 |
| Q5 | クイズ言語 | A) 9 言語必須 / B) ja/en 2 言語からスタート / C) ja のみ |
| Q6 | Cycle 2 開門日 | A) 5/27 23:23 / B) 6/1 23:23 / C) 別 |
| Q7 | クイズ難易度 | A) 簡単めで通過率 50%+ / B) 難しめで通過率 20-30% / C) Cycle ごとに変える |
| Q8 | 投票 UI で「3 人の名前」も見せるか | A) Mission 文だけ(匿名) / B) ハンドル名 + Mission / C) 全部見せる |

---

# § 8. データフロー全体図(Cycle N)

```
┌─────────────────────────────────────────────────────────────────┐
│  Cycle 開門時刻(N 日前 23:23)                                  │
│   └→ entry.html: ¥100 + Mission 投稿                            │
│      └→ contacts テーブル INSERT(paid=1, founding_cohort=N)     │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Mission 受付期間(46 時間想定)
┌─────────────────────────────────────────────────────────────────┐
│  Bell rings @ 23:23 JST(金曜)                                  │
│   ├ 5 分間ゲーム開始                                            │
│   ├ play.html がアクティブ化                                    │
│   └ 鐘の音 (assets/sounds/bell_2323.mp3) 再生                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1: クイズ 3 問(0:00 〜 2:00)                           │
│   ├ Worker /game/quiz/start で問題配信                          │
│   ├ Worker /game/quiz/answer で 3 回解答                        │
│   └ quiz_attempts テーブル INSERT                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓ 通過者リスト確定
┌─────────────────────────────────────────────────────────────────┐
│  Phase 2: SHA-256 抽出(2:00 〜 3:00)                          │
│   ├ Worker /game/phase2/draw                                    │
│   ├ Seed: btc + nikkei + sp500 + 通過者総数                     │
│   ├ SHA-256 → 3 つの index → 通過者リストから 3 人              │
│   └ kings テーブル INSERT(rank=1,2,3 仮、後で King 確定)       │
└─────────────────────────────────────────────────────────────────┘
                              ↓ 3 人発表
┌─────────────────────────────────────────────────────────────────┐
│  Phase 3: 投票(3:00 〜 5:00)                                  │
│   ├ Worker /game/vote で全参加者から 1 票                       │
│   ├ votes テーブル INSERT                                       │
│   └ 5:00 で投票締切                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Bell closes @ 23:28 JST
┌─────────────────────────────────────────────────────────────────┐
│  King 確定                                                       │
│   ├ Worker /game/phase3/finalize                                │
│   ├ 最多得票の Mission → kings.rank=1, grant_status='awaiting_fund'│
│   └ verify.html + kings.html に即時反映                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ 翌日 23:23 まで運営審査
┌─────────────────────────────────────────────────────────────────┐
│  翌 Sat 23:23 JST: The Three 公開                               │
│   ├ KYC + AML + Mission 適合性確認                              │
│   └ Hall of Kings に永続記録(状態: awaiting_fund)              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Cycle が進むごとに Mission Fund 蓄積
┌─────────────────────────────────────────────────────────────────┐
│  Mission Fund 配賦                                              │
│   ├ 累計プール十分なら → grant_status='in_progress' → 'granted' │
│   └ 不足なら継続 'awaiting_fund' → 後の Cycle で繰越            │
└─────────────────────────────────────────────────────────────────┘
```

---

# § 9. 守るべきブランド原則(変更不可)

- ✓ 23:23 という時刻、子の刻、九つ
- ✓ Bell, Cycle, Mission, Grant, Founding Bell, Mission Fund, The Three, Hall of Kings, Founding Member
- ✓ Bell は失われない、失うのは資格だけ(参加費 ¥100 は Bell の権利取得)
- ✓ 「ごちゃ混ぜにしないで」(CarePass コード持ち込み禁止)
- ✓ ログイン無しの儀式性(マジックリンク + 任意パスワード)
- ✓ 機械的選定(SHA-256、人間介入不可)
- ✓ Founding Member バッジ(Cycle ≤ 3 永久)

---

— Claude session ⑧, 2026-05-22 (金) 23:30 JST
