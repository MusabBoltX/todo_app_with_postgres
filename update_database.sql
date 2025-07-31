-- Add reset token columns to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;

-- Add index for reset token
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token); 