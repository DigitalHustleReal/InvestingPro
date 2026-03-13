-- ============================================================================
-- FIX: Remove prevent_hard_delete_articles trigger
-- Date: 2026-03-11
-- Problem: The 20260114_soft_delete.sql migration created a BEFORE DELETE
--          trigger that intercepts ALL DELETE operations on the articles table
--          and converts them to soft-deletes, making it impossible to
--          permanently delete articles (e.g., "Empty Trash").
-- Fix: Drop the trigger. Soft-delete logic is now handled at the API layer
--      (DELETE /api/admin/articles/[id] soft-deletes by default,
--       DELETE /api/admin/articles/[id]?permanent=true hard-deletes).
-- ============================================================================

-- Drop the blocking trigger
DROP TRIGGER IF EXISTS prevent_hard_delete_articles ON public.articles;

-- Drop the trigger function (no longer needed — API layer handles this)
DROP FUNCTION IF EXISTS soft_delete_article();

-- Verify the trigger is gone (optional sanity check — does not fail if missing)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'prevent_hard_delete_articles'
    ) THEN
        RAISE NOTICE 'OK: prevent_hard_delete_articles trigger has been removed.';
    ELSE
        RAISE WARNING 'prevent_hard_delete_articles trigger still exists!';
    END IF;
END $$;
