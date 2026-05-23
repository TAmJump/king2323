-- ──────────────────────────────────────────────────────────────────
-- KINGMAKER · Cycle 1 後処理 SQL  (2026-05-23)
-- ──────────────────────────────────────────────────────────────────
-- 目的: Cycle 1 (founding_cohort=1) の paid=1 参加者を Hall of Kings に
--       「試走 King」として 1 件記録する。
--
-- 背景: Cycle 1 は operator (tiger@tamjump.com) 自身による 1 件のみ paid=1
--       (KM-20260522-0001)。事実上 Cycle 1 = 試走として扱う。
--
-- ──────────────────────────────────────────────────────────────────
-- 実行方法
-- ──────────────────────────────────────────────────────────────────
-- 1. Cloudflare D1 Console を開く
--    https://dash.cloudflare.com → Workers & Pages → D1 → tamjump_contact_db → Console
-- 2. 下記 SQL を 1 つずつ実行(各クエリをハイライト → Execute)
-- 3. STEP 1 で出てきた値を STEP 2 の INSERT に手動コピー
--    (Mission 名・国・要約など、operator 自身の entry 内容を使う)
--
-- ──────────────────────────────────────────────────────────────────
-- STEP 1: Cycle 1 参加者を確認
-- ──────────────────────────────────────────────────────────────────
-- SELECT
--   ticket_number,
--   email,
--   mission_name,
--   country,
--   mission_summary,
--   handle_name,
--   created_at,
--   paid,
--   founding_cohort,
--   square_payment_id
-- FROM contacts
-- WHERE founding_cohort = 1
-- ORDER BY created_at DESC;

-- ──────────────────────────────────────────────────────────────────
-- STEP 2: 試走 King として記録(必要に応じて値を編集)
-- ──────────────────────────────────────────────────────────────────
-- ※下記 INSERT の値は STEP 1 の結果から手動でコピーすること。
--   特に mission_name / country / mission_summary / display_handle /
--   contact_ticket は実際の参加者データで上書きする。

INSERT INTO kings (
  cycle_number,
  rank,
  mission_name,
  country,
  mission_summary,
  display_handle,
  contact_ticket,
  grant_amount_jpy,
  grant_status,
  participant_count,
  chosen_at,
  notes
) VALUES (
  1,                                       -- cycle 1
  1,                                       -- rank 1 (the sole "King")
  'Pre-launch sanity test',                -- operator's mission name (確認・差し替え)
  'JP',                                    -- country (確認・差し替え)
  'Cycle 1 は試走として実施。本番化前の動作確認。本人 (operator) が単独で参加。', -- 差し替え可
  'TAmJ',                                  -- display handle (確認・差し替え)
  'KM-20260522-0001',                      -- contact_ticket (STEP 1 の値で上書き)
  0,                                       -- grant amount: ¥0(試走のため資金プール無し)
  'granted',                               -- すぐ granted に(資金不要のため)
  1,                                       -- participant_count: 1
  '2026-05-22T14:23:00Z',                  -- Bell rang at 2026-05-22 23:23 JST
  'Cycle 1 was the test cycle. Operator was the sole paid participant. No funds were collected because this was a sanity-test run; Cycle 2 is the first real ringing.'
);

-- ──────────────────────────────────────────────────────────────────
-- STEP 3: cycle_state にも Cycle 1 を記録(任意・後で verify.html 用)
-- ──────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO cycle_state (
  cycle_number,
  bell_rings_at,
  phase2_drawn_at,
  phase2_seed,
  phase2_hash,
  phase2_winner_king_ids,
  finalized_at,
  final_king_id,
  participant_count,
  passed_count,
  vote_count
) VALUES (
  1,
  '2026-05-22T14:23:00Z',
  '2026-05-22T14:23:00Z',
  'cycle:1|test-run|n:1',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '[1]',                                   -- the kings.id of the row inserted above (確認・差し替え)
  '2026-05-22T14:28:00Z',
  1,                                       -- final_king_id (= kings.id above)
  1, 1, 0
);

-- ──────────────────────────────────────────────────────────────────
-- STEP 4: 確認クエリ
-- ──────────────────────────────────────────────────────────────────
-- SELECT * FROM kings WHERE cycle_number = 1;
-- SELECT * FROM cycle_state WHERE cycle_number = 1;
