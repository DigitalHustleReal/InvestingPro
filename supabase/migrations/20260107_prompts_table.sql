-- =============================================
-- AI PROMPTS MANAGEMENT TABLE
-- Purpose: Centralized storage for AI prompts
-- Enables: A/B testing, versioning, analytics
-- =============================================

-- Create prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identification
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    
    -- Categorization
    category TEXT NOT NULL DEFAULT 'general',
    -- Categories: 'article_generation', 'product_generation', 'seo', 'glossary', 'summary', 'general'
    
    -- The prompt itself
    system_prompt TEXT,
    user_prompt_template TEXT NOT NULL,
    -- Template variables use {{variable_name}} syntax
    
    -- Model settings
    preferred_model TEXT DEFAULT 'groq',
    -- Options: 'groq', 'mistral', 'openai', 'anthropic', 'gemini'
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 4096,
    
    -- Output settings
    output_format TEXT DEFAULT 'text',
    -- Options: 'text', 'json', 'markdown'
    json_schema JSONB,
    -- Optional: JSON schema for structured output validation
    
    -- Versioning
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    parent_prompt_id UUID REFERENCES public.prompts(id),
    
    -- Performance tracking
    usage_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    avg_latency_ms INTEGER,
    last_used_at TIMESTAMPTZ,
    
    -- Metadata
    tags TEXT[],
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON public.prompts(slug);
CREATE INDEX IF NOT EXISTS idx_prompts_is_active ON public.prompts(is_active);

-- RLS Policies
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "prompts_read_policy" ON public.prompts
    FOR SELECT
    USING (true);

-- Allow full access to admin users
CREATE POLICY "prompts_admin_policy" ON public.prompts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prompts_updated_at_trigger
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_prompts_updated_at();

-- =============================================
-- SEED DEFAULT PROMPTS
-- =============================================

INSERT INTO public.prompts (name, slug, category, description, user_prompt_template, output_format, json_schema, tags)
VALUES
-- Article Generation Prompt
(
    'Article Generator',
    'article-generator',
    'article_generation',
    'Generates SEO-optimized articles on financial topics',
    'Write a comprehensive SEO-optimized article about: {{topic}}

Target keywords: {{keywords}}

Requirements:
- 1500+ words
- Include key takeaways box
- Include FAQ section (5 questions)
- Use Indian context and examples
- Include internal linking suggestions
- Professional but accessible tone

Return as JSON with structure:
{
  "title": "SEO title (60 chars max)",
  "meta_description": "Meta description (155 chars max)",
  "content": "Full markdown article",
  "headings": ["H2 headings array"],
  "key_takeaways": ["3-5 takeaways"],
  "faq": [{"q": "Question?", "a": "Answer"}],
  "internal_links": [{"anchor": "text", "suggested_url": "/path"}]
}',
    'json',
    '{"type": "object", "required": ["title", "meta_description", "content"]}',
    ARRAY['seo', 'content', 'ai-generated']
),

-- Product Data Generation Prompt
(
    'Product Generator',
    'product-generator',
    'product_generation',
    'Generates realistic product data for financial products',
    'Generate realistic 2026 financial product data for "{{product_name}}" in India.
Category: {{category}}

Return ONLY valid JSON:
{
  "name": "Official Product Name",
  "provider_name": "Company Name",
  "description": "2-sentence value proposition",
  "rating": 4.5,
  "features": {
    "key1": "value1",
    "key2": "value2"
  },
  "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "official_link": "https://example.com"
}

Use real market data. Be specific and accurate for Indian market.',
    'json',
    '{"type": "object", "required": ["name", "provider_name", "description"]}',
    ARRAY['product', 'ai-generated']
),

-- Glossary Term Prompt
(
    'Glossary Generator',
    'glossary-generator',
    'glossary',
    'Generates financial glossary term definitions',
    'Define the financial term: "{{term}}"

Requirements:
- Simple definition (1-2 sentences)
- Detailed explanation (2-3 paragraphs)
- Indian context example
- Related terms

Return as JSON:
{
  "term": "Term Name",
  "simple_definition": "One line definition",
  "detailed_explanation": "Full markdown explanation",
  "example": "Real-world Indian example",
  "related_terms": ["term1", "term2", "term3"]
}',
    'json',
    '{"type": "object", "required": ["term", "simple_definition", "detailed_explanation"]}',
    ARRAY['glossary', 'education', 'ai-generated']
),

-- SEO Meta Generator
(
    'SEO Meta Generator',
    'seo-meta-generator',
    'seo',
    'Generates SEO meta tags for pages',
    'Generate SEO metadata for a page about: {{topic}}

Page type: {{page_type}}
Target keyword: {{keyword}}

Return as JSON:
{
  "title": "SEO title (50-60 chars)",
  "meta_description": "Compelling description (150-155 chars)",
  "og_title": "Social share title",
  "og_description": "Social share description",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}',
    'json',
    '{"type": "object", "required": ["title", "meta_description"]}',
    ARRAY['seo', 'meta', 'ai-generated']
)

ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to get active prompt by slug
CREATE OR REPLACE FUNCTION get_prompt(prompt_slug TEXT)
RETURNS TABLE (
    id UUID,
    user_prompt_template TEXT,
    system_prompt TEXT,
    preferred_model TEXT,
    temperature DECIMAL,
    max_tokens INTEGER,
    output_format TEXT,
    json_schema JSONB
) AS $$
BEGIN
    -- Update usage count
    UPDATE public.prompts
    SET usage_count = usage_count + 1,
        last_used_at = NOW()
    WHERE slug = prompt_slug AND is_active = true;
    
    -- Return prompt
    RETURN QUERY
    SELECT 
        p.id,
        p.user_prompt_template,
        p.system_prompt,
        p.preferred_model,
        p.temperature,
        p.max_tokens,
        p.output_format,
        p.json_schema
    FROM public.prompts p
    WHERE p.slug = prompt_slug AND p.is_active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to record prompt success
CREATE OR REPLACE FUNCTION record_prompt_success(prompt_id UUID, latency_ms INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.prompts
    SET success_count = success_count + 1,
        avg_latency_ms = CASE
            WHEN avg_latency_ms IS NULL THEN latency_ms
            ELSE (avg_latency_ms + latency_ms) / 2
        END
    WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;
