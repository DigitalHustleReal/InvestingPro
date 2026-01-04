-- Batch Content Generation Schema

-- DROP tables to ensure fresh schema
DROP TABLE IF EXISTS batch_items CASCADE;
DROP TABLE IF EXISTS content_batches CASCADE;

-- Batches table to track groups of content generation
CREATE TABLE IF NOT EXISTS content_batches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'paused')),
    total_items INTEGER DEFAULT 0,
    completed_items INTEGER DEFAULT 0,
    failed_items INTEGER DEFAULT 0,
    config JSONB DEFAULT '{}'::jsonb, -- Stores settings like category, author, tone, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Batch items table for individual article generation tasks
CREATE TABLE IF NOT EXISTS batch_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_id UUID REFERENCES content_batches(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL, -- The main topic/keyword for generation
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL, -- Link to generated article
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_batch_items_batch_id ON batch_items(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_items_status ON batch_items(status);
CREATE INDEX IF NOT EXISTS idx_content_batches_status ON content_batches(status);

-- Enable RLS
ALTER TABLE content_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_items ENABLE ROW LEVEL SECURITY;

-- Policies (Allow authenticated users full access for now)
CREATE POLICY "Authenticated users can manage batches" ON content_batches
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage batch items" ON batch_items
    FOR ALL USING (auth.role() = 'authenticated');
