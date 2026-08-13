-- DialaGO demo session storage
-- Run automatically on server start via server/db.ts

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  demographics TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions (created_at);
