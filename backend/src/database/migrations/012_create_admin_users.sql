BEGIN;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id                BIGSERIAL PRIMARY KEY,
  username          TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  full_name         TEXT,
  email             TEXT,
  role              TEXT NOT NULL DEFAULT 'admin',
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  last_login        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

COMMIT;



