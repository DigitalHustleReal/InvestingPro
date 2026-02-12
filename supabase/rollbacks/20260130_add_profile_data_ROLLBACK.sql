-- Rollback: 20260130_add_profile_data.sql
-- Drop profile_data column from users table

ALTER TABLE public.users DROP COLUMN IF EXISTS profile_data;
