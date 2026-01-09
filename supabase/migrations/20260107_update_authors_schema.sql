-- Add new columns to authors table to support AI personas
ALTER TABLE public.authors 
ADD COLUMN IF NOT EXISTS credentials TEXT,
ADD COLUMN IF NOT EXISTS categories TEXT[],
ADD COLUMN IF NOT EXISTS is_ai_persona BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ai_system_prompt TEXT,
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN public.authors.ai_system_prompt IS 'System prompt for AI generation using this persona';
