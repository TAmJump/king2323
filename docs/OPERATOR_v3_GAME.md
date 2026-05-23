# OPERATOR · 2026-05-23 (土) 手順書 — v3 Game Launch

**目的:** Cycle 1 を密封 + ゲームコードをデプロイ + Square Production 化(任意)
**所要時間:** 約 30 分 (デプロイ + 確認のみ)

---

## 全体の流れ

```
A. D1 マイグレーション (ゲーム用テーブル + 30 問の問題シード)   …  3 分
B. Worker 再デプロイ (新 8 ルート: /game/*)                     …  3 分
C. Cycle 1 後処理 (D1 で Cycle 1 を試走 King として密封)       …  5 分
D. 動作確認 (https://king2323.tamjump.com/play.html)           …  3 分
E. Square Production 化 (本番カードでテストしたい場合のみ)     …  5 分
F. Cycle 2 設定 (29 (金) 23:23 に向けて事前準備)               …  2 分
```

---

## A. D1 マイグレーション (新規 5 テーブル + 30 問シード)

### 手順

1. Cloudflare Dashboard を開く
   → `Workers & Pages` → `D1` → `tamjump_contact_db` → `Console`

2. 下記の URL の SQL を全コピー、Console に貼り付け、`Execute` をクリック

   https://raw.githubusercontent.com/TAmJump/king2323/main/worker/migrations/0003_game.sql

   (中身は 5 テーブル + 30 問 × 2 言語 = 60 行の INSERT。一括実行 OK)

3. 確認クエリ

   ```sql
   SELECT COUNT(*) FROM quiz_questions WHERE active = 1;
   -- → 60 が返れば成功
   ```

---

## B. Worker 再デプロイ

### 手順

1. Cloudflare Dashboard → `Workers & Pages` → `tamjump-contact-api` → `Edit code`

2. 下記の URL の中身を全コピー、Worker エディタの内容を全削除して貼り付け

   https://raw.githubusercontent.com/TAmJump/king2323/main/worker/index.js

3. 右上の `Save and Deploy` をクリック

4. (デプロイ後) 確認

   ブラウザで開く:
   https://tamjump-contact-api.animalb001.workers.dev/game/bell-status

   下記のような JSON が返れば成功:
   ```json
   {
     "ok": true,
     "bellRingsAtIso": "2026-05-29T14:23:00Z",
     "cycle": 2,
     "phase": "pre_bell",
     "secondsUntilBell": ...
   }
   ```

---

## C. Cycle 1 後処理 (試走 King として密封)

### 手順

1. D1 Console を開く

2. まず Cycle 1 参加者を確認:

   ```sql
   SELECT ticket_number, email, mission_name, country, mission_summary, handle_name
   FROM contacts
   WHERE founding_cohort = 1 AND paid = 1
   ORDER BY created_at DESC;
   ```

3. 結果に `KM-20260522-0001` (operator 自身) が出てくることを確認

4. 下記 URL を開いて中身をコピー、必要な箇所を **operator 自身の値**で書き換え:

   https://raw.githubusercontent.com/TAmJump/king2323/main/worker/migrations/0004_cycle1_seal.sql

   書き換える箇所(STEP 2 の INSERT):
   - `mission_name` → 実際の Mission 名
   - `country` → 実際の国コード
   - `mission_summary` → 実際の Mission 内容
   - `display_handle` → 公開ハンドル名

5. Console で実行

6. 確認:
   - https://king2323.tamjump.com/kings.html を開いて、Cycle 1 の King が表示されることを確認

---

## D. 動作確認

### Cycle 2 (今は pre_bell) の動作

1. https://king2323.tamjump.com/ を開く
   - ヒーロー下に `→ Enter the 5 Minutes` リンクは **見えない**(まだ Bell 鳴ってないので正しい)
   - カウントダウンは 5/29 (金) 23:23 までを表示

2. https://king2323.tamjump.com/play.html を開く
   - "Awaiting the Bell" 画面が出て、5/29 までの残り時間を表示

3. https://king2323.tamjump.com/entry.html を開く
   - Mission Entry はそのまま動く(Cycle 2 用)

---

## E. Square Production 化 (任意)

明日朝に Cycle 2 開門前にやるか、Cycle 2 後で OK。

### 手順

1. https://developer.squareup.com/apps を開く
2. `KINGMAKER 23:23` アプリ → `Credentials` タブ
3. 上部のトグルで **Sandbox** → **Production** に切り替え
4. 3 つの値をコピー:
   - Production Application ID (`sq0idp-...`)
   - Production Access Token (`EAAA...` 長い)
   - 左メニューの `Locations` から Production の Location ID

5. Cloudflare → Workers → `tamjump-contact-api` → `Settings` → `Variables and Secrets`
   - `SQUARE_ACCESS_TOKEN` を Production 値に置換
   - `SQUARE_APPLICATION_ID` を Production 値に置換
   - `SQUARE_LOCATION_ID` を Production 値に置換
   - `SQUARE_ENV` を `production` に変更
6. Worker は **再デプロイ不要** (env 変数のみの変更は即時反映)

7. 本物のクレジットカードで ¥100 entry を 1 回テスト → 成功確認

---

## F. Cycle 2 設定確認

worker/index.js の冒頭 (約 1500 行目) `GAME_CONFIG` を確認:

```javascript
var GAME_CONFIG = {
  currentCycle: 2,
  bellRingsAtIso: "2026-05-29T14:23:00Z",   // 2026-05-29 (Fri) 23:23 JST
  ...
};
```

**Cycle 2 が 5/29 23:23 に開く設定**になっている。
変更したい場合はこの 2 行を編集 → 再デプロイ。

---

## 重要事項

### GAME_SPEC § 7 の 8 つの判断 (現在のデフォルト)

| # | 判断 | 現在の値 | 変えたい場合 |
|---|---|---|---|
| Q1 投票権 | 全参加者 (落選者も投票可) | `voteRightsAll: true` | `false` に変更で通過者のみ |
| Q2 時間配分 | Phase1=120秒 / Phase2=30秒 / Phase3=150秒 | 同上 | `GAME_CONFIG` で調整 |
| Q3 同票 | SHA-256 再抽選 | `tieBreakMode: "sha-redraw"` | `"operator"` または `"multi-king"` |
| Q4 問題ソース | 運営側 30 問 (DB に seed 済) | quiz_questions テーブル | INSERT で追加可能 |
| Q5 言語 | ja + en | `allowedLanguages: ["ja","en"]` | 配列に追加 + DB に翻訳 INSERT |
| Q6 Cycle 2 | 5/29 (金) 23:23 | `bellRingsAtIso` | 別日時に変更可 |
| Q7 難易度 | 1 easy + 1 medium + 1 hard | コード内ロジック | quiz_questions.difficulty を見直し |
| Q8 投票 UI | Mission 文のみ (匿名) | play.html で handle を非表示 | play.html を編集 |

判断が変わった場合は session ⑩ Claude に伝えて修正してもらえば OK。

---

## トラブルシュート

### `/game/bell-status` が 500 を返す

- `cycle_state` テーブルが無い → A をやり直す

### play.html で "ログインしてください" が出る

- Cycle 2 にまだ entry してない可能性。
- まず https://king2323.tamjump.com/entry.html で Cycle 2 用に entry → そのアドレスでログイン
- `founding_cohort` が `currentCycle` と一致しているかを D1 で確認:
  ```sql
  SELECT email, founding_cohort, paid FROM contacts WHERE email = 'tiger@tamjump.com';
  ```

### クイズが「参加できません」を返す

- D1 で contacts の paid と founding_cohort を確認(上のクエリ)
- `paid != 1` または `founding_cohort != 2` なら entry が完了してない

---

— session ⑨ Claude · 2026-05-23 (土)
