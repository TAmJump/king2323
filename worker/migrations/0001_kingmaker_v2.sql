-- KINGMAKER v2 schema additions (2026-05-22)
-- Run with: wrangler d1 execute <DB-name> --file=worker/migrations/0001_kingmaker_v2.sql --remote
-- Idempotent: every statement is "IF NOT EXISTS" or column-add (which already
-- ignores duplicates in SQLite if the column exists — we add a fallback noop).

-- ─────────────────────────────────────────────────────────────
-- 1. contacts table: add founding_cohort + paid + square_payment_id columns
-- ─────────────────────────────────────────────────────────────
-- founding_cohort: integer cycle number that participant first entered (1, 2, 3...)
--   - Used to identify "Founding 100" (cycle <= 3) for permanent badge.
-- paid: 0 / 1 — whether Square charged ¥100 successfully
--   - Legacy rows (pre-2026-05-22) have paid=NULL → treated as unknown.
-- square_payment_id: text — Square payment object ID returned by CreatePayment
--   - Lets us trace back to the Square dashboard receipt.

ALTER TABLE contacts ADD COLUMN founding_cohort INTEGER;
ALTER TABLE contacts ADD COLUMN paid INTEGER DEFAULT 0;
ALTER TABLE contacts ADD COLUMN square_payment_id TEXT;

-- ─────────────────────────────────────────────────────────────
-- 2. kings: permanent Hall of Kings
-- ─────────────────────────────────────────────────────────────
-- Every Cycle, after the Bell rings + review, the operator records 1–3 Kings here.
-- This table is PUBLIC-readable (via /kings/list) but only operator writes.
-- Grant_status flow: 'awaiting_fund' → 'in_progress' → 'granted'
--   - awaiting_fund: King chosen but Mission Fund insufficient
--   - in_progress: funds reserved, work underway
--   - granted: Mission completed, proof published
CREATE TABLE IF NOT EXISTS kings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cycle_number INTEGER NOT NULL,
  rank INTEGER NOT NULL,                 -- 1, 2, or 3 (The Three within a cycle)
  mission_name TEXT NOT NULL,
  country TEXT,
  mission_summary TEXT,
  display_handle TEXT,                   -- short pseudo-name shown publicly (e.g. "Naia_R")
  contact_ticket TEXT,                   -- FK-ish ref to contacts.ticket_number (so we can find the email later)
  grant_amount_jpy INTEGER DEFAULT 0,    -- amount finalized for this King (¥)
  grant_status TEXT DEFAULT 'awaiting_fund', -- awaiting_fund / in_progress / granted
  proof_url TEXT,                        -- after Mission completed
  participant_count INTEGER,             -- snapshot of how many people entered that cycle (for "scarcity" framing)
  chosen_at TEXT NOT NULL,               -- ISO timestamp Bell rang
  granted_at TEXT,                       -- ISO timestamp grant_status = granted
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_kings_cycle ON kings(cycle_number);
CREATE INDEX IF NOT EXISTS idx_kings_status ON kings(grant_status);

-- ─────────────────────────────────────────────────────────────
-- 3. magic_tokens: passwordless login for mypage.html
-- ─────────────────────────────────────────────────────────────
-- KINGMAKER deliberately has no password. Instead: enter email →
-- one-time-link arrives via SES → click → mypage shows your full history.
-- Tokens expire in 30 minutes and are single-use (consumed_at set on use).
CREATE TABLE IF NOT EXISTS magic_tokens (
  token TEXT PRIMARY KEY,                -- 64-char random hex
  email TEXT NOT NULL,
  created_at TEXT NOT NULL,              -- ISO timestamp
  expires_at TEXT NOT NULL,              -- ISO timestamp, +30min
  consumed_at TEXT,                      -- ISO timestamp once used (NULL = unused)
  ip TEXT
);
CREATE INDEX IF NOT EXISTS idx_magic_email ON magic_tokens(email);
CREATE INDEX IF NOT EXISTS idx_magic_expires ON magic_tokens(expires_at);
