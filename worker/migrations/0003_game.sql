-- KINGMAKER v3 schema additions: 5-minute game (2026-05-23)
-- Run with: wrangler d1 execute tamjump_contact_db --file=worker/migrations/0003_game.sql --remote
-- Idempotent: every CREATE uses IF NOT EXISTS.

-- ─────────────────────────────────────────────────────────────
-- 1. quiz_questions — question pool, seeded by operator (Phase 1)
-- ─────────────────────────────────────────────────────────────
-- One row = one question, in one language.
-- For multi-language: the SAME logical question is duplicated per language
-- with the same `group_id`. /game/quiz/start picks 3 distinct group_ids,
-- then resolves to the row matching the participant's language.
-- difficulty: 1=easy / 2=medium / 3=hard. Used by /game/quiz/start to
-- balance question selection (e.g. 1 easy + 1 medium + 1 hard).
-- active: 0/1 — operator can retire questions without deleting history.
CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,                -- groups same question across languages
  language TEXT NOT NULL DEFAULT 'ja',      -- 'ja' / 'en' (Cycle 2 starts with these 2)
  category TEXT,                            -- e.g. '23-enigma', 'ethics', 'kings', 'pattern'
  difficulty INTEGER NOT NULL DEFAULT 2,    -- 1 / 2 / 3
  question TEXT NOT NULL,
  choices_json TEXT NOT NULL,               -- JSON array of strings, e.g. ["A","B","C","D"]
  correct_index INTEGER NOT NULL,           -- 0-based index into choices_json
  explanation TEXT,                         -- optional one-line rationale (shown post-answer)
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (group_id, language)
);
CREATE INDEX IF NOT EXISTS idx_q_active ON quiz_questions(active, language);
CREATE INDEX IF NOT EXISTS idx_q_group ON quiz_questions(group_id);

-- ─────────────────────────────────────────────────────────────
-- 2. game_sessions — one row per (participant × cycle) when they enter play.html
-- ─────────────────────────────────────────────────────────────
-- Created on /game/quiz/start. Tracks their 3 assigned questions and progress.
-- assigned_q_json: JSON array of 3 group_ids (locked at session start).
-- phase: 'quiz' / 'phase2_wait' / 'phase2_done' / 'voting' / 'finalized'
-- quiz_passed: 0/1 — set after 3rd answer; 1 means "advances to Phase 2 pool".
CREATE TABLE IF NOT EXISTS game_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cycle_number INTEGER NOT NULL,
  contact_ticket TEXT NOT NULL,             -- ref contacts.ticket_number
  email TEXT NOT NULL,                      -- denormalized for fast lookup
  language TEXT NOT NULL DEFAULT 'ja',
  assigned_q_json TEXT NOT NULL,            -- JSON: [group_id, group_id, group_id]
  current_index INTEGER NOT NULL DEFAULT 0, -- 0/1/2 = which of the 3 questions is next
  correct_count INTEGER NOT NULL DEFAULT 0,
  phase TEXT NOT NULL DEFAULT 'quiz',
  quiz_passed INTEGER,                      -- NULL until quiz completes
  started_at TEXT NOT NULL,
  quiz_done_at TEXT,
  vote_done_at TEXT,
  UNIQUE (cycle_number, contact_ticket)
);
CREATE INDEX IF NOT EXISTS idx_gs_cycle ON game_sessions(cycle_number);
CREATE INDEX IF NOT EXISTS idx_gs_email ON game_sessions(email);
CREATE INDEX IF NOT EXISTS idx_gs_passed ON game_sessions(cycle_number, quiz_passed);

-- ─────────────────────────────────────────────────────────────
-- 3. quiz_attempts — every answer recorded, for audit + future analytics
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cycle_number INTEGER NOT NULL,
  session_id INTEGER NOT NULL,              -- ref game_sessions.id
  contact_ticket TEXT NOT NULL,
  question_id INTEGER NOT NULL,             -- ref quiz_questions.id
  group_id INTEGER NOT NULL,
  chosen_index INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  answered_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_qa_session ON quiz_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_qa_cycle ON quiz_attempts(cycle_number);

-- ─────────────────────────────────────────────────────────────
-- 4. votes — Phase 3 voting (one vote per participant per cycle)
-- ─────────────────────────────────────────────────────────────
-- voted_for_king_id refs kings.id (the 3 candidates inserted by /game/phase2/draw).
-- A participant can change their vote within Phase 3; the latest row wins
-- (UNIQUE keeps history clean by INSERT OR REPLACE).
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cycle_number INTEGER NOT NULL,
  voter_contact_ticket TEXT NOT NULL,
  voted_for_king_id INTEGER NOT NULL,
  voted_at TEXT NOT NULL,
  UNIQUE (cycle_number, voter_contact_ticket)
);
CREATE INDEX IF NOT EXISTS idx_votes_cycle ON votes(cycle_number);
CREATE INDEX IF NOT EXISTS idx_votes_king ON votes(voted_for_king_id);

-- ─────────────────────────────────────────────────────────────
-- 5. cycle_state — singleton-ish: tracks where each Cycle's game is in lifecycle
-- ─────────────────────────────────────────────────────────────
-- One row per cycle_number. Updated by /game/phase2/draw and /game/phase3/finalize.
-- phase2_seed: the public verification seed string used for SHA-256 draw.
-- phase2_hash: the resulting SHA-256 hash (shown on verify.html).
CREATE TABLE IF NOT EXISTS cycle_state (
  cycle_number INTEGER PRIMARY KEY,
  bell_rings_at TEXT NOT NULL,              -- ISO timestamp of Bell ring (T+0:00)
  phase2_drawn_at TEXT,                     -- ISO timestamp Phase 2 draw was run
  phase2_seed TEXT,                         -- e.g. 'btc:0000...|nikkei:38123|sp500:5123.45|n:42'
  phase2_hash TEXT,                         -- SHA-256 hex of seed
  phase2_winner_king_ids TEXT,              -- JSON array [king_id, king_id, king_id]
  finalized_at TEXT,                        -- ISO timestamp Phase 3 finalize was run
  final_king_id INTEGER,                    -- the winning king
  participant_count INTEGER,                -- total paid entries for this cycle
  passed_count INTEGER,                     -- count of quiz_passed=1
  vote_count INTEGER                        -- total votes cast in Phase 3
);

-- ─────────────────────────────────────────────────────────────
-- 6. SEED: initial 30 quiz questions (ja + en) — 60 rows total
-- ─────────────────────────────────────────────────────────────
-- group_id 1..30. category covers 5 themes per spec § 2-3.
-- These are the bootstrap pool for Cycle 2+. Operator can edit/add later.
-- INSERT OR IGNORE: re-running this migration won't duplicate rows.

-- Group 1: 23-enigma / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(1, 'ja', '23-enigma', 1, 'KINGMAKER の鐘が鳴る時刻は?',                                                            '["22:23","23:23","00:23","23:32"]', 1, '23:23 JST 金曜の子の刻直前。'),
(1, 'en', '23-enigma', 1, 'At what time does the KINGMAKER Bell ring?',                                              '["22:23","23:23","00:23","23:32"]', 1, '23:23 JST, just before the Hour of the Rat.');

-- Group 2: 23-enigma / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(2, 'ja', '23-enigma', 1, 'KINGMAKER の Mission Entry 料金は?',                                                    '["¥23","¥100","¥230","¥2,323"]', 1, '¥100 で 1 Bell。儀式の最小単位。'),
(2, 'en', '23-enigma', 1, 'How much does one KINGMAKER Mission Entry cost?',                                         '["¥23","¥100","¥230","¥2,323"]', 1, '¥100 for one Bell. The minimum ritual unit.');

-- Group 3: kings / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(3, 'ja', 'kings', 2, '「The Three」とは何を指す?',                                                                '["3 人の運営者","Phase 2 で選ばれた 3 人","過去の 3 King","3 つの欲望"]', 1, 'Phase 2 の SHA-256 抽出で機械が選ぶ 3 人。'),
(3, 'en', 'kings', 2, 'What does "The Three" refer to?',                                                             '["Three operators","Three chosen in Phase 2","Three past Kings","Three desires"]', 1, 'The three selected by SHA-256 draw in Phase 2.');

-- Group 4: ethics / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(4, 'ja', 'ethics', 2, 'Mission Fund から欲望が叶わなかった King はどうなる?',                                    '["返金される","資格を失う","次 Cycle に繰越","欲望が公開される"]', 2, '資金不足は awaiting_fund 状態で次 Cycle に繰越される。'),
(4, 'en', 'ethics', 2, 'What happens to a King whose desire could not be funded?',                                   '["Refunded","Loses status","Carried to next Cycle","Desire is published"]', 2, 'Insufficient funds = awaiting_fund, carries forward.');

-- Group 5: pattern / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(5, 'ja', 'pattern', 1, '次の数列の次の数は: 2, 3, 5, 8, 13, ?',                                                  '["18","20","21","24"]', 2, 'フィボナッチ: 8+13=21。'),
(5, 'en', 'pattern', 1, 'Next number in the sequence: 2, 3, 5, 8, 13, ?',                                            '["18","20","21","24"]', 2, 'Fibonacci: 8+13=21.');

-- Group 6: pattern / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(6, 'ja', 'pattern', 1, '次の数列の次の数は: 1, 4, 9, 16, 25, ?',                                                  '["30","32","36","49"]', 2, '平方数: 6^2=36。'),
(6, 'en', 'pattern', 1, 'Next number in the sequence: 1, 4, 9, 16, 25, ?',                                           '["30","32","36","49"]', 2, 'Perfect squares: 6^2=36.');

-- Group 7: 23-enigma / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(7, 'ja', '23-enigma', 2, 'KINGMAKER の Bell が鳴ってから King 確定までの時間は?',                                '["5 秒","5 分","23 分","60 分"]', 1, '23:23:00 〜 23:28:00 の 5 分間で全フェーズが完結。'),
(7, 'en', '23-enigma', 2, 'How long after the Bell rings is the King decided?',                                      '["5 seconds","5 minutes","23 minutes","60 minutes"]', 1, '23:23:00 to 23:28:00, the full 5-minute ritual.');

-- Group 8: ethics / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(8, 'ja', 'ethics', 2, 'Phase 3 で「あなたが叶えたい欲望」を投票するとき、あなたが選ぶのは?',                    '["自分の欲望","他人の欲望のうち一つ","ランダム","運営の指示"]', 1, 'The Three が公開した 3 つの欲望から 1 つ。'),
(8, 'en', 'ethics', 2, 'In Phase 3 voting, you choose:',                                                             '["Your own desire","One of others'' desires","Randomly","As operator instructs"]', 1, 'One of the three desires revealed by The Three.');

-- Group 9: kings / hard
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(9, 'ja', 'kings', 3, 'Founding Member バッジが永久に残る Cycle は?',                                              '["1 のみ","1〜3","1〜10","全て"]', 1, 'Cycle ≤ 3 の参加者は Founding Member 永久バッジ。'),
(9, 'en', 'kings', 3, 'Founding Member badge is permanent for which Cycles?',                                        '["Only 1","1 through 3","1 through 10","All"]', 1, 'Cycles ≤ 3 grant the permanent Founding Member badge.');

-- Group 10: pattern / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(10, 'ja', 'pattern', 2, '次の数列の次の数は: 2, 4, 8, 16, 32, ?',                                                 '["48","56","60","64"]', 3, '2 の累乗: 2^6=64。'),
(10, 'en', 'pattern', 2, 'Next number in the sequence: 2, 4, 8, 16, 32, ?',                                          '["48","56","60","64"]', 3, 'Powers of 2: 2^6=64.');

-- Group 11: kings / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(11, 'ja', 'kings', 1, 'KINGMAKER で King になると何が起きる?',                                                   '["賞金が即支給","Mission Fund から欲望が叶う","名前だけ刻まれる","運営側に雇用"]', 1, 'Hall of Kings 記録 + Mission Fund から段階的に欲望が叶う。'),
(11, 'en', 'kings', 1, 'What happens when you become a King in KINGMAKER?',                                          '["Instant prize","Desire is funded from Mission Fund","Just name engraved","Hired by operator"]', 1, 'Hall of Kings record + staged funding from Mission Fund.');

-- Group 12: ethics / hard
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(12, 'ja', 'ethics', 3, 'KINGMAKER で Bell を失う条件は?',                                                         '["クイズ不正解","King に選ばれなかった","欲望を取り下げた","Bell は失われない"]', 3, 'Bell は永久。失うのは「今 Cycle の King 候補資格」だけ。'),
(12, 'en', 'ethics', 3, 'When do you lose your Bell?',                                                               '["Wrong quiz answer","Not chosen as King","Withdrew desire","Bell is never lost"]', 3, 'The Bell is eternal. You only lose this Cycle''s candidacy.');

-- Group 13: 23-enigma / hard
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(13, 'ja', '23-enigma', 3, '23 時 23 分は、東洋の伝統的時刻法で何の刻に最も近い?',                                  '["亥の刻","子の刻","丑の刻","寅の刻"]', 1, '23:00〜01:00 が子の刻。23:23 はその直前の境目。'),
(13, 'en', '23-enigma', 3, '23:23 falls closest to which traditional Eastern hour?',                                 '["Hour of the Boar","Hour of the Rat","Hour of the Ox","Hour of the Tiger"]', 1, 'Hour of the Rat: 23:00–01:00. 23:23 sits at its threshold.');

-- Group 14: pattern / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(14, 'ja', 'pattern', 2, '次の数列の次の数は: 1, 1, 2, 3, 5, 8, ?',                                                '["11","12","13","14"]', 2, 'フィボナッチ: 5+8=13。'),
(14, 'en', 'pattern', 2, 'Next number in the sequence: 1, 1, 2, 3, 5, 8, ?',                                         '["11","12","13","14"]', 2, 'Fibonacci: 5+8=13.');

-- Group 15: kings / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(15, 'ja', 'kings', 2, 'Mission Fund はどこから集まる?',                                                          '["運営の出資","参加者の Bell Entry 料","政府補助金","クラウドファンディング"]', 1, '全 ¥100 Bell の合計が Mission Fund になる。'),
(15, 'en', 'kings', 2, 'Where does the Mission Fund come from?',                                                    '["Operator capital","Participant Bell Entry fees","Government grant","Crowdfunding"]', 1, 'The sum of all ¥100 Bells becomes the Mission Fund.');

-- Group 16: ethics / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(16, 'ja', 'ethics', 2, '「The Three」を選ぶ仕組みで運営者は介入できるか?',                                       '["できる","できない (SHA-256 抽出)","抽選券方式","投票で決まる"]', 1, 'BTC ハッシュ + 日経 + S&P + 通過者数で機械的に決定。'),
(16, 'en', 'ethics', 2, 'Can the operator intervene in selecting The Three?',                                       '["Yes","No (SHA-256 draw)","Lottery tickets","Decided by vote"]', 1, 'Deterministic: BTC hash + Nikkei + S&P + passer count.');

-- Group 17: pattern / hard
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(17, 'ja', 'pattern', 3, '次のローマ数字を順に並べたとき欠けているのは: I, II, III, ?, V',                          '["IIII","IV","VI","X"]', 1, 'IV(4)。'),
(17, 'en', 'pattern', 3, 'Which Roman numeral is missing: I, II, III, ?, V',                                         '["IIII","IV","VI","X"]', 1, 'IV (4).');

-- Group 18: 23-enigma / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(18, 'ja', '23-enigma', 2, '「23」という数に関連する有名な現象は?',                                              '["ハーシャドの定理","23 エニグマ (シンクロニシティ)","ペテルブルクのパラドックス","モンティ・ホール問題"]', 1, '23 エニグマ: ロバート・アントン・ウィルソンが広めた偶然の認知。'),
(18, 'en', '23-enigma', 2, 'Which phenomenon is famously tied to the number 23?',                                    '["Harshad''s theorem","The 23 Enigma","St. Petersburg paradox","Monty Hall problem"]', 1, 'The 23 Enigma — Robert Anton Wilson''s synchronicity meme.');

-- Group 19: kings / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(19, 'ja', 'kings', 1, 'Hall of Kings に記録されるのは?',                                                          '["全エントリー者","King のみ","運営者","Founding Member 全員"]', 1, 'King として確定した参加者のみ永続記録。'),
(19, 'en', 'kings', 1, 'Who gets recorded in the Hall of Kings?',                                                   '["All entrants","Only Kings","Operator","All Founding Members"]', 1, 'Only confirmed Kings, recorded permanently.');

-- Group 20: ethics / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(20, 'ja', 'ethics', 1, 'KINGMAKER で 1 Cycle に投票できる回数は?',                                                '["0 回","1 回","3 回","無制限"]', 1, '1 人 1 票、変更可能だが投票数は 1。'),
(20, 'en', 'ethics', 1, 'How many votes per participant per Cycle?',                                                 '["0","1","3","Unlimited"]', 1, 'One vote per person (changeable until close).');

-- Group 21: pattern / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(21, 'ja', 'pattern', 2, '23 は素数か?',                                                                          '["はい","いいえ","条件付き","定義不能"]', 0, '23 は 1 と自身以外で割れない素数。'),
(21, 'en', 'pattern', 2, 'Is 23 a prime number?',                                                                    '["Yes","No","Conditional","Undefined"]', 0, '23 has no divisors other than 1 and itself.');

-- Group 22: 23-enigma / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(22, 'ja', '23-enigma', 1, 'KINGMAKER のサイトドメインに含まれる数字は?',                                          '["23","123","2323","1023"]', 2, 'king2323.tamjump.com — 「23」を 2 つ並べた。'),
(22, 'en', '23-enigma', 1, 'Which number appears in the KINGMAKER site domain?',                                     '["23","123","2323","1023"]', 2, 'king2323.tamjump.com — the "23" doubled.');

-- Group 23: kings / hard
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(23, 'ja', 'kings', 3, 'King の Mission が叶ったあとに行うことは?',                                                '["何もしない","証拠 (proof_url) を公開","賞金を返却","新しい King を立てる"]', 1, 'grant_status を granted に更新し proof_url を公開する。'),
(23, 'en', 'kings', 3, 'After a King''s Mission is fulfilled, what happens?',                                        '["Nothing","Publish proof_url","Return prize","Appoint new King"]', 1, 'grant_status flips to granted, proof_url is published.');

-- Group 24: ethics / hard
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(24, 'ja', 'ethics', 3, 'KINGMAKER に「ログイン」が無いのはなぜ?',                                                '["技術的限界","儀式性のため","セキュリティ問題","コスト削減"]', 1, '会員制ではなく儀式。誰でも来週また鐘を鳴らせる。'),
(24, 'en', 'ethics', 3, 'Why does KINGMAKER lack a traditional login?',                                              '["Technical limit","To preserve ritual","Security issue","Cost cutting"]', 1, 'It is a ritual, not membership. Anyone can ring next week.');

-- Group 25: pattern / hard
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(25, 'ja', 'pattern', 3, '23 を 2 進法で表すと?',                                                                  '["10101","10111","11001","11101"]', 1, '16+4+2+1=23, つまり 10111。'),
(25, 'en', 'pattern', 3, '23 in binary is:',                                                                         '["10101","10111","11001","11101"]', 1, '16+4+2+1=23, i.e. 10111.');

-- Group 26: 23-enigma / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(26, 'ja', '23-enigma', 2, 'KINGMAKER の Cycle は何日周期で繰り返される(想定)?',                                  '["毎日","1 週間","1 ヶ月","不定"]', 1, '金曜 23:23 ごとに鳴る、おおむね 1 週間。'),
(26, 'en', '23-enigma', 2, 'How often does the KINGMAKER Cycle repeat (planned)?',                                  '["Daily","Weekly","Monthly","Irregular"]', 1, 'Every Friday 23:23 — roughly weekly.');

-- Group 27: kings / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(27, 'ja', 'kings', 2, 'King の Mission が「他者を害するもの」だった場合は?',                                      '["そのまま実行","運営審査で却下","参加者投票で却下","SHA で再抽選"]', 1, '23:28 後の運営審査(KYC + AML + 法令確認)で却下。'),
(27, 'en', 'kings', 2, 'If a King''s Mission would harm others, what happens?',                                     '["Executed as is","Rejected by operator review","Rejected by re-vote","Re-drawn by SHA"]', 1, 'Post-23:28 review (KYC + AML + legal) rejects it.');

-- Group 28: ethics / medium
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(28, 'ja', 'ethics', 2, 'Phase 3 投票で同票だった場合は?',                                                         '["全員 King","SHA-256 再抽選","運営が選ぶ","Cycle 無効"]', 1, 'デフォルトでは SHA-256 再抽選(検証可能)。'),
(28, 'en', 'ethics', 2, 'In Phase 3, if votes tie, what happens?',                                                  '["All become King","SHA-256 redraw","Operator decides","Cycle voided"]', 1, 'Default: SHA-256 redraw (verifiable).');

-- Group 29: pattern / easy
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(29, 'ja', 'pattern', 1, '次の文字列の次の文字は: A, C, E, G, ?',                                                  '["H","I","J","K"]', 1, '奇数番アルファベット: I。'),
(29, 'en', 'pattern', 1, 'Next letter in the sequence: A, C, E, G, ?',                                              '["H","I","J","K"]', 1, 'Odd-indexed letters: I.');

-- Group 30: 23-enigma / hard
INSERT OR IGNORE INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
(30, 'ja', '23-enigma', 3, '23:23 が金曜である理由は?',                                                            '["週の境界","King の語源","運営の好み","週末を儀式で開く"]', 3, '週末を儀式の鐘で開く — 金曜 23:23 はその境界線。'),
(30, 'en', '23-enigma', 3, 'Why is 23:23 on a Friday?',                                                              '["Week boundary","Etymology of King","Operator preference","To open weekend with ritual"]', 3, 'To open the weekend with the ritual of the Bell.');
