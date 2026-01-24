-- =====================================================
-- MULTI-TENANT SCHEMA: Tenants and Tenant Settings
-- =====================================================
-- Enables multi-tenant architecture with subdomain/header detection
-- Run this migration to enable tenant isolation

-- Tenants Table
-- Stores tenant/organization information
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identification
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,  -- Used for subdomain: {slug}.investingpro.in
    display_name VARCHAR(255),
    
    -- Branding
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#6366F1',  -- Hex color
    secondary_color VARCHAR(7) DEFAULT '#8B5CF6',
    
    -- Domain Configuration
    custom_domain VARCHAR(255) UNIQUE,  -- e.g., finance.company.com
    allowed_origins TEXT[],  -- CORS allowed origins
    
    -- Plan & Limits
    plan VARCHAR(50) DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'enterprise', 'unlimited')),
    max_users INTEGER DEFAULT 5,
    max_articles INTEGER DEFAULT 100,
    max_storage_gb INTEGER DEFAULT 5,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'cancelled')),
    trial_ends_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Audit
    created_by UUID,
    updated_by UUID
);

-- Tenant Settings Table
-- Per-tenant configuration and feature flags
CREATE TABLE IF NOT EXISTS tenant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Setting identification
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    
    -- Categorization
    category VARCHAR(100) DEFAULT 'general',  -- general, features, integrations, billing, etc.
    
    -- Metadata
    description TEXT,
    is_sensitive BOOLEAN DEFAULT false,  -- If true, value should be encrypted
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique key per tenant
    UNIQUE(tenant_id, key)
);

-- Tenant Users Junction Table
-- Links users to tenants with roles
CREATE TABLE IF NOT EXISTS tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,  -- References auth.users or user_profiles
    
    -- Role within tenant
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'member', 'viewer')),
    
    -- Permissions (for granular control)
    permissions JSONB DEFAULT '{}',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
    invited_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure user belongs to tenant only once
    UNIQUE(tenant_id, user_id)
);

-- Tenant Feature Flags Table
-- Feature flags specific to tenants
CREATE TABLE IF NOT EXISTS tenant_feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Feature identification
    feature_key VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT false,
    
    -- Rollout configuration
    rollout_percentage INTEGER DEFAULT 100 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    
    -- Conditions for enabling
    conditions JSONB DEFAULT '{}',  -- e.g., {"plan": ["enterprise"], "users_min": 10}
    
    -- Metadata
    description TEXT,
    expires_at TIMESTAMPTZ,  -- Auto-disable after this date
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique feature per tenant
    UNIQUE(tenant_id, feature_key)
);

-- Tenant API Keys Table
-- API keys for programmatic access
CREATE TABLE IF NOT EXISTS tenant_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Key identification
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,  -- Store hashed key
    key_prefix VARCHAR(10) NOT NULL,  -- First 8 chars for identification (e.g., "ip_live_x")
    
    -- Permissions
    scopes TEXT[] DEFAULT ARRAY['read'],  -- read, write, admin
    
    -- Rate limiting
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_day INTEGER DEFAULT 10000,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Tenants indexes
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_custom_domain ON tenants(custom_domain) WHERE custom_domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_plan ON tenants(plan);

-- Tenant settings indexes
CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant ON tenant_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_settings_key ON tenant_settings(tenant_id, key);
CREATE INDEX IF NOT EXISTS idx_tenant_settings_category ON tenant_settings(tenant_id, category);

-- Tenant users indexes
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_role ON tenant_users(tenant_id, role);

-- Feature flags indexes
CREATE INDEX IF NOT EXISTS idx_tenant_features_tenant ON tenant_feature_flags(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_features_key ON tenant_feature_flags(tenant_id, feature_key);
CREATE INDEX IF NOT EXISTS idx_tenant_features_enabled ON tenant_feature_flags(tenant_id, enabled);

-- API keys indexes
CREATE INDEX IF NOT EXISTS idx_tenant_api_keys_tenant ON tenant_api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_api_keys_prefix ON tenant_api_keys(key_prefix);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to get tenant by subdomain or custom domain
CREATE OR REPLACE FUNCTION get_tenant_by_domain(domain_input TEXT)
RETURNS TABLE (
    tenant_id UUID,
    tenant_slug VARCHAR,
    tenant_name VARCHAR,
    tenant_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.slug,
        t.name,
        t.status
    FROM tenants t
    WHERE 
        t.custom_domain = domain_input
        OR t.slug = split_part(domain_input, '.', 1)
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get tenant settings as JSON object
CREATE OR REPLACE FUNCTION get_tenant_settings_json(p_tenant_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB := '{}';
BEGIN
    SELECT jsonb_object_agg(key, value)
    INTO result
    FROM tenant_settings
    WHERE tenant_id = p_tenant_id
    AND is_sensitive = false;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to check if feature is enabled for tenant
CREATE OR REPLACE FUNCTION is_feature_enabled(
    p_tenant_id UUID,
    p_feature_key VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    feature_record RECORD;
BEGIN
    SELECT enabled, rollout_percentage, expires_at
    INTO feature_record
    FROM tenant_feature_flags
    WHERE tenant_id = p_tenant_id
    AND feature_key = p_feature_key;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check if expired
    IF feature_record.expires_at IS NOT NULL AND feature_record.expires_at < NOW() THEN
        RETURN false;
    END IF;
    
    -- Check if enabled and rollout
    IF feature_record.enabled AND feature_record.rollout_percentage = 100 THEN
        RETURN true;
    END IF;
    
    -- For partial rollout, use random selection (in production, use consistent hashing)
    IF feature_record.enabled AND feature_record.rollout_percentage > 0 THEN
        RETURN random() * 100 < feature_record.rollout_percentage;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function to update tenant timestamps
CREATE OR REPLACE FUNCTION update_tenant_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp triggers
CREATE TRIGGER update_tenants_timestamp
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_tenant_timestamp();

CREATE TRIGGER update_tenant_settings_timestamp
    BEFORE UPDATE ON tenant_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_tenant_timestamp();

CREATE TRIGGER update_tenant_users_timestamp
    BEFORE UPDATE ON tenant_users
    FOR EACH ROW
    EXECUTE FUNCTION update_tenant_timestamp();

CREATE TRIGGER update_tenant_feature_flags_timestamp
    BEFORE UPDATE ON tenant_feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_tenant_timestamp();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_api_keys ENABLE ROW LEVEL SECURITY;

-- Policies for tenants table
CREATE POLICY "Users can view their own tenants" ON tenants
    FOR SELECT
    USING (
        id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update their tenants" ON tenants
    FOR UPDATE
    USING (
        id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- Policies for tenant_settings
CREATE POLICY "Users can view tenant settings" ON tenant_settings
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage tenant settings" ON tenant_settings
    FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- Policies for tenant_users
CREATE POLICY "Users can view tenant members" ON tenant_users
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage tenant users" ON tenant_users
    FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- Policies for feature flags
CREATE POLICY "Users can view feature flags" ON tenant_feature_flags
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid()
        )
    );

-- Policies for API keys
CREATE POLICY "Admins can manage API keys" ON tenant_api_keys
    FOR ALL
    USING (
        tenant_id IN (
            SELECT tenant_id FROM tenant_users 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- =====================================================
-- SEED DATA (Development)
-- =====================================================

-- Insert default/primary tenant
INSERT INTO tenants (name, slug, display_name, plan, status)
VALUES (
    'InvestingPro',
    'main',
    'InvestingPro - Personal Finance Platform',
    'unlimited',
    'active'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert default feature flags for main tenant
INSERT INTO tenant_feature_flags (tenant_id, feature_key, enabled, description)
SELECT 
    t.id,
    f.feature_key,
    f.enabled,
    f.description
FROM tenants t
CROSS JOIN (
    VALUES 
        ('ai_content_generation', true, 'AI-powered content generation'),
        ('revenue_predictions', true, 'Revenue prediction engine'),
        ('multi_author', true, 'Multiple author support'),
        ('advanced_analytics', true, 'Advanced analytics dashboard'),
        ('ab_testing', true, 'A/B testing capabilities'),
        ('api_access', true, 'API access for integrations'),
        ('white_label', false, 'White label branding'),
        ('custom_domain', false, 'Custom domain support')
) AS f(feature_key, enabled, description)
WHERE t.slug = 'main'
ON CONFLICT (tenant_id, feature_key) DO NOTHING;

-- Insert default settings for main tenant
INSERT INTO tenant_settings (tenant_id, key, value, category, description)
SELECT 
    t.id,
    s.key,
    s.value,
    s.category,
    s.description
FROM tenants t
CROSS JOIN (
    VALUES 
        ('site_name', '"InvestingPro"'::jsonb, 'general', 'Site name displayed in header'),
        ('site_tagline', '"Your Guide to Smart Investing"'::jsonb, 'general', 'Site tagline'),
        ('default_language', '"en"'::jsonb, 'general', 'Default language code'),
        ('timezone', '"Asia/Kolkata"'::jsonb, 'general', 'Default timezone'),
        ('currency', '"INR"'::jsonb, 'general', 'Default currency'),
        ('analytics_enabled', 'true'::jsonb, 'features', 'Enable analytics tracking'),
        ('ai_model', '"gpt-4"'::jsonb, 'features', 'Default AI model for content'),
        ('max_ai_requests_per_day', '1000'::jsonb, 'limits', 'Daily AI request limit'),
        ('enable_comments', 'true'::jsonb, 'features', 'Enable article comments'),
        ('moderation_level', '"auto"'::jsonb, 'features', 'Content moderation level')
) AS s(key, value, category, description)
WHERE t.slug = 'main'
ON CONFLICT (tenant_id, key) DO NOTHING;
