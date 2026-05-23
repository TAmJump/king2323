-- KINGMAKER · 60 quiz questions rewritten English-first (2026-05-23, session ⑩)
-- This REPLACES the content of the 30 group_ids 1..30 seeded in 0003f.
-- Strategy:
--   1. DELETE all existing rows (clean slate within group_ids 1..30).
--   2. Re-INSERT with English as canonical, Japanese as faithful translation.
-- English is now natural-English, not Japanese-direct-translation.
-- Japanese is natural-Japanese, not English-direct-translation.
-- Both convey the same meaning. Same correct_index for both.
--
-- Categories: 23-enigma · kings · ethics · pattern
-- Difficulty: 1=easy / 2=medium / 3=hard, ~10 of each across 30 groups.

DELETE FROM quiz_questions WHERE group_id BETWEEN 1 AND 30;

INSERT INTO quiz_questions (group_id, language, category, difficulty, question, choices_json, correct_index, explanation) VALUES
-- ─── Group 1 · 23-enigma · easy ───
(1, 'en', '23-enigma', 1, 'What time does the KINGMAKER Bell ring?', '["22:23","23:23","00:23","23:32"]', 1, 'The Bell rings at 23:23 JST every Friday, just before the Hour of the Rat.'),
(1, 'ja', '23-enigma', 1, 'KINGMAKER の鐘が鳴る時刻はいつ?', '["22:23","23:23","00:23","23:32"]', 1, '毎週金曜の 23:23 JST、子の刻に入る直前に鐘が鳴る。'),

-- ─── Group 2 · 23-enigma · easy ───
(2, 'en', '23-enigma', 1, 'How much is one Mission Entry?', '["¥23","¥100","¥230","¥2,323"]', 1, 'One Bell costs ¥100. It is the minimum unit of the ritual.'),
(2, 'ja', '23-enigma', 1, 'Mission Entry 1 回の料金は?', '["¥23","¥100","¥230","¥2,323"]', 1, 'Bell 1 回は ¥100。儀式の最小単位。'),

-- ─── Group 3 · kings · medium ───
(3, 'en', 'kings', 2, 'What is "The Three"?', '["The three operators","The three chosen in Phase 2","The three past Kings","The three desires"]', 1, 'The Three are selected by SHA-256 draw in Phase 2 of the 5-minute game.'),
(3, 'ja', 'kings', 2, '「The Three」とは何か?', '["3 人の運営者","Phase 2 で選ばれた 3 人","過去の 3 人の King","3 つの欲望"]', 1, 'Phase 2 の SHA-256 抽選で選ばれる 3 人のこと。'),

-- ─── Group 4 · ethics · medium ───
(4, 'en', 'ethics', 2, 'What happens if a King''s desire cannot be funded?', '["Refunded","They lose King status","Carried to next Cycle","The desire is published"]', 2, 'The King keeps status "awaiting_fund" and carries forward to the next Cycle until the Mission Fund is sufficient.'),
(4, 'ja', 'ethics', 2, 'King の欲望が資金不足で叶わない場合は?', '["返金される","King の資格を失う","次の Cycle に繰り越す","欲望が公開される"]', 2, 'King の地位はそのまま、状態は awaiting_fund となり、Mission Fund が満ちるまで Cycle をまたいで持ち越される。'),

-- ─── Group 5 · pattern · easy ───
(5, 'en', 'pattern', 1, 'What is the next number? 2, 3, 5, 8, 13, ?', '["18","20","21","24"]', 2, 'Fibonacci: each number is the sum of the previous two. 8 + 13 = 21.'),
(5, 'ja', 'pattern', 1, '次の数列の次の数は? 2, 3, 5, 8, 13, ?', '["18","20","21","24"]', 2, 'フィボナッチ数列: 前の 2 つを足す。8 + 13 = 21。'),

-- ─── Group 6 · pattern · easy ───
(6, 'en', 'pattern', 1, 'What is the next number? 1, 4, 9, 16, 25, ?', '["30","32","36","49"]', 2, 'Perfect squares: 6² = 36.'),
(6, 'ja', 'pattern', 1, '次の数列の次の数は? 1, 4, 9, 16, 25, ?', '["30","32","36","49"]', 2, '平方数: 6² = 36。'),

-- ─── Group 7 · 23-enigma · medium ───
(7, 'en', '23-enigma', 2, 'How long does the 5-minute game last, from Bell ring to King decision?', '["5 seconds","5 minutes","23 minutes","60 minutes"]', 1, 'From 23:23:00 to 23:28:00 JST. All three phases unfold in this five-minute window.'),
(7, 'ja', '23-enigma', 2, '鐘が鳴ってから King が決まるまでの時間は?', '["5 秒","5 分","23 分","60 分"]', 1, '23:23:00 から 23:28:00 まで。この 5 分間で全フェーズが完結する。'),

-- ─── Group 8 · ethics · medium ───
(8, 'en', 'ethics', 2, 'In the Phase 3 vote, what do you choose?', '["Your own desire","One of three others'' desires","Randomly","As the operator instructs"]', 1, 'You vote for one of the three desires revealed by The Three.'),
(8, 'ja', 'ethics', 2, 'Phase 3 の投票で、あなたが選ぶのは?', '["自分の欲望","他者 3 人の欲望のうち 1 つ","ランダム","運営の指示に従う"]', 1, 'The Three が公開した 3 つの欲望から、1 つを選んで投票する。'),

-- ─── Group 9 · kings · hard ───
(9, 'en', 'kings', 3, 'Until which Cycle does the Founding Member badge remain permanent?', '["Cycle 1 only","Cycles 1 through 3","Cycles 1 through 10","All Cycles"]', 1, 'Participants in Cycles 1, 2, or 3 receive the permanent Founding Member badge.'),
(9, 'ja', 'kings', 3, 'Founding Member バッジが永久に残るのは Cycle いくつまで?', '["Cycle 1 のみ","Cycle 1 から 3","Cycle 1 から 10","全ての Cycle"]', 1, 'Cycle 1〜3 の参加者には Founding Member バッジが永久に付与される。'),

-- ─── Group 10 · pattern · medium ───
(10, 'en', 'pattern', 2, 'What is the next number? 2, 4, 8, 16, 32, ?', '["48","56","60","64"]', 3, 'Powers of 2: 2⁶ = 64.'),
(10, 'ja', 'pattern', 2, '次の数列の次の数は? 2, 4, 8, 16, 32, ?', '["48","56","60","64"]', 3, '2 の累乗: 2⁶ = 64。'),

-- ─── Group 11 · kings · easy ───
(11, 'en', 'kings', 1, 'What happens when you become a King in KINGMAKER?', '["Instant cash prize","Your desire is funded from the Mission Fund","Only your name is engraved","You are hired by the operator"]', 1, 'You are recorded in the Hall of Kings, and your Mission is staged-funded from the Mission Fund.'),
(11, 'ja', 'kings', 1, 'KINGMAKER で King になると何が起きる?', '["即時に賞金が支払われる","Mission Fund から欲望が叶えられる","名前だけが刻まれる","運営に雇用される"]', 1, 'Hall of Kings に記録され、Mission Fund から段階的に Mission が叶えられる。'),

-- ─── Group 12 · ethics · hard ───
(12, 'en', 'ethics', 3, 'When do you lose your Bell?', '["When you answer the quiz wrong","When you are not chosen as King","When you withdraw your desire","Never — the Bell is permanent"]', 3, 'The Bell itself is eternal. You only lose this Cycle''s candidacy for King.'),
(12, 'ja', 'ethics', 3, 'Bell を失う条件は?', '["クイズに不正解したとき","King に選ばれなかったとき","欲望を取り下げたとき","失わない - Bell は永続"]', 3, 'Bell そのものは永続。失うのは「今 Cycle の King 候補資格」だけ。'),

-- ─── Group 13 · 23-enigma · hard ───
(13, 'en', '23-enigma', 3, '23:23 falls closest to which traditional East Asian "hour of the night"?', '["Hour of the Boar","Hour of the Rat","Hour of the Ox","Hour of the Tiger"]', 1, 'The Hour of the Rat runs from 23:00 to 01:00. 23:23 sits at its threshold.'),
(13, 'ja', '23-enigma', 3, '23:23 は東アジアの伝統的な十二時辰でどの刻に最も近い?', '["亥の刻","子の刻","丑の刻","寅の刻"]', 1, '子の刻は 23:00〜01:00。23:23 はその境界にある。'),

-- ─── Group 14 · pattern · medium ───
(14, 'en', 'pattern', 2, 'What is the next number? 1, 1, 2, 3, 5, 8, ?', '["11","12","13","14"]', 2, 'Fibonacci: 5 + 8 = 13.'),
(14, 'ja', 'pattern', 2, '次の数列の次の数は? 1, 1, 2, 3, 5, 8, ?', '["11","12","13","14"]', 2, 'フィボナッチ: 5 + 8 = 13。'),

-- ─── Group 15 · kings · medium ───
(15, 'en', 'kings', 2, 'Where does the Mission Fund come from?', '["The operator''s capital","Participants'' Bell Entry fees","Government grants","Crowdfunding"]', 1, 'The sum of every ¥100 Bell becomes the Mission Fund.'),
(15, 'ja', 'kings', 2, 'Mission Fund はどこから集まる?', '["運営の出資","参加者の Bell Entry 料","政府補助金","クラウドファンディング"]', 1, '全 ¥100 Bell の合計が Mission Fund を構成する。'),

-- ─── Group 16 · ethics · medium ───
(16, 'en', 'ethics', 2, 'Can the operator influence who becomes one of The Three?', '["Yes, freely","No — it is a SHA-256 draw","Through a lottery ticket system","Through a vote"]', 1, 'The Three are chosen deterministically by SHA-256 hashing the BTC block hash, Nikkei 225, S&P 500, and passer count.'),
(16, 'ja', 'ethics', 2, 'The Three を選ぶときに運営は介入できるか?', '["できる","できない - SHA-256 抽選","抽選券方式","投票で決まる"]', 1, 'BTC のブロックハッシュ + 日経 225 + S&P 500 + 通過者数を SHA-256 で計算し、確定的に決まる。'),

-- ─── Group 17 · pattern · hard ───
(17, 'en', 'pattern', 3, 'Which Roman numeral is missing? I, II, III, ?, V', '["IIII","IV","VI","X"]', 1, 'IV represents the number 4.'),
(17, 'ja', 'pattern', 3, '欠けているローマ数字は? I, II, III, ?, V', '["IIII","IV","VI","X"]', 1, 'IV は 4 を表す。'),

-- ─── Group 18 · 23-enigma · medium ───
(18, 'en', '23-enigma', 2, 'Which phenomenon is famously associated with the number 23?', '["Harshad''s theorem","The 23 Enigma","The St. Petersburg paradox","The Monty Hall problem"]', 1, 'The 23 Enigma is the belief that the number 23 appears in unusually significant coincidences, popularized by Robert Anton Wilson.'),
(18, 'ja', '23-enigma', 2, '数字「23」にまつわる有名な現象は?', '["ハルシャッドの定理","23 エニグマ","ペテルブルクのパラドックス","モンティ・ホール問題"]', 1, '23 エニグマ: 23 という数字が偶然の一致に頻出するという考え方。ロバート・アントン・ウィルソンが広めた。'),

-- ─── Group 19 · kings · easy ───
(19, 'en', 'kings', 1, 'Who gets recorded in the Hall of Kings?', '["Every entrant","Only confirmed Kings","Only operators","All Founding Members"]', 1, 'Only those who have been confirmed as Kings receive a permanent record.'),
(19, 'ja', 'kings', 1, 'Hall of Kings に記録されるのは誰?', '["全エントリー者","King と確定した人のみ","運営者のみ","全 Founding Member"]', 1, 'King として確定した参加者だけが永続的に記録される。'),

-- ─── Group 20 · ethics · easy ───
(20, 'en', 'ethics', 1, 'How many times can you vote in one Cycle?', '["0 times","1 time","3 times","Unlimited"]', 1, 'One vote per person. You can change your vote until Phase 3 closes, but it still counts as one.'),
(20, 'ja', 'ethics', 1, '1 Cycle で投票できる回数は?', '["0 回","1 回","3 回","無制限"]', 1, '1 人 1 票。Phase 3 が閉じるまで変更可能だが、票としては 1 つ。'),

-- ─── Group 21 · pattern · medium ───
(21, 'en', 'pattern', 2, 'Is 23 a prime number?', '["Yes","No","Conditionally","Undefined"]', 0, '23 has no divisors other than 1 and itself.'),
(21, 'ja', 'pattern', 2, '23 は素数か?', '["はい","いいえ","条件付き","定義不能"]', 0, '23 は 1 と自身以外で割り切れない。'),

-- ─── Group 22 · 23-enigma · easy ───
(22, 'en', '23-enigma', 1, 'Which number appears in the KINGMAKER website domain?', '["23","123","2323","1023"]', 2, 'The domain is king2323.tamjump.com — "23" doubled.'),
(22, 'ja', '23-enigma', 1, 'KINGMAKER のドメインに含まれる数字は?', '["23","123","2323","1023"]', 2, 'king2323.tamjump.com - 23 を 2 つ並べた数字。'),

-- ─── Group 23 · kings · hard ───
(23, 'en', 'kings', 3, 'After a King''s Mission is fulfilled, what comes next?', '["Nothing","Proof of fulfilment is published","The prize money is returned","A new King is appointed"]', 1, 'grant_status flips to "granted", and a proof_url is published to the Hall of Kings.'),
(23, 'ja', 'kings', 3, 'King の Mission が叶えられた後、次に何が起きる?', '["何もしない","達成の証拠 (proof_url) が公開される","賞金が返却される","新しい King が任命される"]', 1, 'grant_status が "granted" になり、proof_url が Hall of Kings に公開される。'),

-- ─── Group 24 · ethics · hard ───
(24, 'en', 'ethics', 3, 'Why does KINGMAKER have no traditional login?', '["Technical limitation","To preserve the ritual nature","Security concern","Cost reduction"]', 1, 'KINGMAKER is a ritual, not a membership. Anyone can ring the Bell again next week without identity persistence.'),
(24, 'ja', 'ethics', 3, 'KINGMAKER に伝統的なログインが無いのはなぜ?', '["技術的制限","儀式性を保つため","セキュリティ問題","コスト削減"]', 1, 'KINGMAKER は会員制ではなく儀式。来週もまた誰もが鐘を鳴らせる。'),

-- ─── Group 25 · pattern · hard ───
(25, 'en', 'pattern', 3, 'What is 23 in binary?', '["10101","10111","11001","11101"]', 1, '16 + 4 + 2 + 1 = 23, which is 10111 in binary.'),
(25, 'ja', 'pattern', 3, '23 を 2 進数で表すと?', '["10101","10111","11001","11101"]', 1, '16 + 4 + 2 + 1 = 23、2 進数で 10111。'),

-- ─── Group 26 · 23-enigma · medium ───
(26, 'en', '23-enigma', 2, 'How often does the KINGMAKER Cycle repeat?', '["Daily","Weekly","Monthly","Irregularly"]', 1, 'The Bell rings every Friday at 23:23 JST — roughly weekly.'),
(26, 'ja', '23-enigma', 2, 'KINGMAKER の Cycle はどの頻度で繰り返される?', '["毎日","毎週","毎月","不定期"]', 1, '毎週金曜の 23:23 JST に鐘が鳴る - おおむね 1 週間周期。'),

-- ─── Group 27 · kings · medium ───
(27, 'en', 'kings', 2, 'What happens if a King''s Mission would harm others?', '["It is executed as written","It is rejected during operator review","It is rejected by a re-vote","It is re-drawn by SHA"]', 1, 'After 23:28, operator review (KYC + AML + legal compliance) can reject the Mission.'),
(27, 'ja', 'kings', 2, 'King の Mission が他者を害する内容だった場合は?', '["そのまま実行される","運営審査で却下される","参加者の再投票で却下される","SHA で再抽選される"]', 1, '23:28 以降の運営審査 (KYC + AML + 法令確認) で却下される。'),

-- ─── Group 28 · ethics · medium ───
(28, 'en', 'ethics', 2, 'What happens if the Phase 3 vote is tied?', '["Everyone becomes King","SHA-256 redraw","The operator decides","The Cycle is voided"]', 1, 'By default, a SHA-256 redraw resolves the tie deterministically and verifiably.'),
(28, 'ja', 'ethics', 2, 'Phase 3 の投票が同票だった場合は?', '["全員が King になる","SHA-256 で再抽選","運営が決める","Cycle が無効になる"]', 1, 'デフォルトでは SHA-256 で再抽選し、確定的かつ検証可能な形で同票を解決する。'),

-- ─── Group 29 · pattern · easy ───
(29, 'en', 'pattern', 1, 'What is the next letter? A, C, E, G, ?', '["H","I","J","K"]', 1, 'Every other letter of the alphabet. The next is I.'),
(29, 'ja', 'pattern', 1, '次の文字は何? A, C, E, G, ?', '["H","I","J","K"]', 1, 'アルファベットを 1 つ飛ばし。次は I。'),

-- ─── Group 30 · 23-enigma · hard ───
(30, 'en', '23-enigma', 3, 'Why does the Bell ring at 23:23 on a Friday?', '["It marks a weekly boundary","It is the etymology of King","Operator preference","To open the weekend with a ritual"]', 3, 'The ritual opens the weekend. Friday 23:23 is the threshold where the workweek ends.'),
(30, 'ja', '23-enigma', 3, '鐘が金曜の 23:23 に鳴る理由は?', '["週の境界","King の語源","運営の好み","週末を儀式で開くため"]', 3, '儀式で週末を開く - 金曜 23:23 は仕事週の境界線。');
