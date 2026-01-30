-- Migration to add profile_data column to users table
-- This JSONB column will store user onboarding preferences, goals, and other personalization settings.

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb;

-- Update RLS if needed (assuming users can update their own data)
-- If RLS is already set up to let users update their own row, this column is automatically covered.

-- Example of how to query this data:
-- SELECT id, full_name, profile_data->>'income' FROM public.users WHERE profile_data->>'onboarded' = 'true';
