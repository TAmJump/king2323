-- KINGMAKER · 0005a · DELETE all existing question rows (group_id 1..30).
-- Pair with 0005b which immediately re-INSERTs the English-first 60 rows.
-- D1 Console runs one statement at a time, so we split DELETE and INSERT.

DELETE FROM quiz_questions WHERE group_id BETWEEN 1 AND 30;
