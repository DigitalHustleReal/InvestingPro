-- AI Provider Health Tracking Table
-- Ensures circuit breakers are shared across instances and survive restarts

CREATE TABLE IF NOT EXISTS public.ai_provider_health (
    provider_name TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'healthy', -- 'healthy', 'degraded', 'failing'
    last_error TEXT,
    last_failure_time TIMESTAMP WITH TIME ZONE,
    failure_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pre-populate with providers
INSERT INTO public.ai_provider_health (provider_name) VALUES
    ('gemini'),
    ('openai'),
    ('groq'),
    ('mistral')
ON CONFLICT (provider_name) DO NOTHING;

-- RLS
ALTER TABLE public.ai_provider_health ENABLE ROW LEVEL SECURITY;

-- Public can read (for health dashboards)
CREATE POLICY "Public can view AI health" ON public.ai_provider_health
    FOR SELECT USING (true);

-- Authenticated/Service role can update
CREATE POLICY "Service role can update AI health" ON public.ai_provider_health
    FOR ALL USING (true); -- In practice, restrict to service role
