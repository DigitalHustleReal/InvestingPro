-- Week 1 Task 2: User Roles & Admin Authentication
-- Migration: 20260116_user_roles.sql
-- Purpose: Create user roles table for admin authentication

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add indexes for performance (IF NOT EXISTS to prevent errors on re-run)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own role
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Only admins can insert roles
DROP POLICY IF EXISTS "Only admins can insert roles" ON user_roles;
CREATE POLICY "Only admins can insert roles"
  ON user_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policy: Only admins can update roles
DROP POLICY IF EXISTS "Only admins can update roles" ON user_roles;
CREATE POLICY "Only admins can update roles"
  ON user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policy: Only admins can delete roles
DROP POLICY IF EXISTS "Only admins can delete roles" ON user_roles;
CREATE POLICY "Only admins can delete roles"
  ON user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS user_roles_updated_at ON user_roles;
CREATE TRIGGER user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_roles_updated_at();

-- ============================================
-- IMPORTANT: Create First Admin User
-- ============================================
-- Replace 'your-email@example.com' with your actual email
-- This user will become the first admin

INSERT INTO user_roles (user_id, role)
SELECT 
  id, 
  'admin'
FROM auth.users
WHERE email = 'your-email@example.com'  -- ⚠️ CHANGE THIS!
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the admin user was created:
-- SELECT u.email, ur.role, ur.created_at
-- FROM auth.users u
-- JOIN user_roles ur ON u.id = ur.user_id
-- WHERE ur.role = 'admin';

COMMENT ON TABLE user_roles IS 'User roles for authorization (admin, editor, viewer)';
COMMENT ON COLUMN user_roles.user_id IS 'Reference to auth.users table';
COMMENT ON COLUMN user_roles.role IS 'User role: admin (full access), editor (content only), viewer (read-only)';
