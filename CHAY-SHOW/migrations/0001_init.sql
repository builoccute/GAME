CREATE TABLE IF NOT EXISTS player_saves (
  player_id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS leaderboard (
  player_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT 'Người chơi',
  level INTEGER NOT NULL DEFAULT 1,
  money INTEGER NOT NULL DEFAULT 0,
  careers_played INTEGER NOT NULL DEFAULT 0,
  reputation INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rank
ON leaderboard(level DESC, money DESC, reputation DESC);
