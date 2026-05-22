-- KINGMAKER v2 — password auth additions (2026-05-22)
-- Run with: wrangler d1 execute <DB> --file=worker/migrations/0002_mypage_auth.sql --remote

-- ─────────────────────────────────────────────────────────────
-- mypage_users: email + password (PBKDF2-SHA256)
-- ─────────────────────────────────────────────────────────────
-- Created the first time a user clicks "Set a password" on mypage.
-- Returning users log in with email+password directly (no email round-trip).
-- Password forgotten? Re-use the existing magic-link flow to reset.

CREATE TABLE IF NOT EXISTS mypage_users (
  email TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,           -- pbkdf2$<iter>$<salt_hex>$<hash_hex>
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- ─────────────────────────────────────────────────────────────
-- mypage_sessions: server-side session storage (cookie-based)
-- ─────────────────────────────────────────────────────────────
-- 30-day rolling sessions. Cookie name: km_session.
-- HttpOnly + Secure + SameSite=None so it works across the API subdomain.

CREATE TABLE IF NOT EXISTS mypage_sessions (
  session_id TEXT PRIMARY KEY,           -- 64-char random hex
  email TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  ip TEXT
);
CREATE INDEX IF NOT EXISTS idx_sess_email ON mypage_sessions(email);
CREATE INDEX IF NOT EXISTS idx_sess_expires ON mypage_sessions(expires_at);
