/**
 * Tenant Configuration System
 * Per-tenant settings, feature flags, and configuration management
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import type { Tenant, TenantSettings, TenantFeatureFlags } from './tenant-context';

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// =============================================================================
// TYPES
// =============================================================================

export interface TenantPlanLimits {
  maxUsers: number;
  maxArticles: number;
  maxStorageGb: number;
  maxAiRequestsPerDay: number;
  features: string[];
}

export interface TenantConfig {
  tenant: Tenant;
  settings: TenantSettings;
  features: TenantFeatureFlags;
  limits: TenantPlanLimits;
  branding: TenantBranding;
}

export interface TenantBranding {
  logo: string | null;
  favicon: string | null;
  primaryColor: string;
  secondaryColor: string;
  customCss: string | null;
}

export interface SettingDefinition {
  key: string;
  defaultValue: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  description: string;
  sensitive: boolean;
  planRequired?: string[];
}

export interface FeatureDefinition {
  key: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  planRequired: string[];
  dependencies?: string[];
}

// =============================================================================
// PLAN CONFIGURATION
// =============================================================================

export const PLAN_LIMITS: Record<string, TenantPlanLimits> = {
  starter: {
    maxUsers: 3,
    maxArticles: 50,
    maxStorageGb: 2,
    maxAiRequestsPerDay: 100,
    features: ['basic_analytics', 'single_author'],
  },
  growth: {
    maxUsers: 10,
    maxArticles: 500,
    maxStorageGb: 10,
    maxAiRequestsPerDay: 500,
    features: [
      'basic_analytics',
      'advanced_analytics',
      'multi_author',
      'ai_content_generation',
      'scheduled_publishing',
    ],
  },
  enterprise: {
    maxUsers: 50,
    maxArticles: 5000,
    maxStorageGb: 100,
    maxAiRequestsPerDay: 2000,
    features: [
      'basic_analytics',
      'advanced_analytics',
      'multi_author',
      'ai_content_generation',
      'scheduled_publishing',
      'ab_testing',
      'revenue_predictions',
      'api_access',
      'custom_domain',
      'white_label',
      'priority_support',
    ],
  },
  unlimited: {
    maxUsers: -1, // Unlimited
    maxArticles: -1,
    maxStorageGb: -1,
    maxAiRequestsPerDay: -1,
    features: ['*'], // All features
  },
};

// =============================================================================
// SETTING DEFINITIONS
// =============================================================================

export const SETTING_DEFINITIONS: SettingDefinition[] = [
  // General Settings
  {
    key: 'site_name',
    defaultValue: 'My Finance Site',
    type: 'string',
    category: 'general',
    description: 'Site name displayed in header and SEO',
    sensitive: false,
  },
  {
    key: 'site_tagline',
    defaultValue: '',
    type: 'string',
    category: 'general',
    description: 'Site tagline or description',
    sensitive: false,
  },
  {
    key: 'default_language',
    defaultValue: 'en',
    type: 'string',
    category: 'general',
    description: 'Default content language',
    sensitive: false,
  },
  {
    key: 'timezone',
    defaultValue: 'UTC',
    type: 'string',
    category: 'general',
    description: 'Default timezone for dates',
    sensitive: false,
  },
  {
    key: 'currency',
    defaultValue: 'INR',
    type: 'string',
    category: 'general',
    description: 'Default currency for financial content',
    sensitive: false,
  },

  // Feature Settings
  {
    key: 'analytics_enabled',
    defaultValue: true,
    type: 'boolean',
    category: 'features',
    description: 'Enable analytics tracking',
    sensitive: false,
  },
  {
    key: 'ai_model',
    defaultValue: 'gpt-4',
    type: 'string',
    category: 'features',
    description: 'AI model for content generation',
    sensitive: false,
    planRequired: ['growth', 'enterprise', 'unlimited'],
  },
  {
    key: 'enable_comments',
    defaultValue: false,
    type: 'boolean',
    category: 'features',
    description: 'Enable article comments',
    sensitive: false,
  },
  {
    key: 'moderation_level',
    defaultValue: 'manual',
    type: 'string',
    category: 'features',
    description: 'Content moderation: auto, manual, or off',
    sensitive: false,
  },

  // SEO Settings
  {
    key: 'default_meta_title_suffix',
    defaultValue: '',
    type: 'string',
    category: 'seo',
    description: 'Suffix appended to all page titles',
    sensitive: false,
  },
  {
    key: 'google_analytics_id',
    defaultValue: '',
    type: 'string',
    category: 'seo',
    description: 'Google Analytics tracking ID',
    sensitive: true,
  },
  {
    key: 'google_search_console_id',
    defaultValue: '',
    type: 'string',
    category: 'seo',
    description: 'Google Search Console verification ID',
    sensitive: true,
  },

  // Monetization Settings
  {
    key: 'adsense_client_id',
    defaultValue: '',
    type: 'string',
    category: 'monetization',
    description: 'Google AdSense client ID',
    sensitive: true,
  },
  {
    key: 'affiliate_disclosure',
    defaultValue: 'This post may contain affiliate links.',
    type: 'string',
    category: 'monetization',
    description: 'Affiliate disclosure text',
    sensitive: false,
  },

  // Limits (overrides for plan limits)
  {
    key: 'max_ai_requests_override',
    defaultValue: null,
    type: 'number',
    category: 'limits',
    description: 'Override daily AI request limit',
    sensitive: false,
    planRequired: ['enterprise', 'unlimited'],
  },
];

// =============================================================================
// FEATURE DEFINITIONS
// =============================================================================

export const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  {
    key: 'ai_content_generation',
    name: 'AI Content Generation',
    description: 'Generate articles using AI',
    defaultEnabled: false,
    planRequired: ['growth', 'enterprise', 'unlimited'],
  },
  {
    key: 'revenue_predictions',
    name: 'Revenue Predictions',
    description: 'AI-powered revenue predictions for articles',
    defaultEnabled: false,
    planRequired: ['enterprise', 'unlimited'],
  },
  {
    key: 'multi_author',
    name: 'Multiple Authors',
    description: 'Support for multiple content authors',
    defaultEnabled: false,
    planRequired: ['growth', 'enterprise', 'unlimited'],
  },
  {
    key: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Detailed analytics and reporting',
    defaultEnabled: false,
    planRequired: ['growth', 'enterprise', 'unlimited'],
  },
  {
    key: 'ab_testing',
    name: 'A/B Testing',
    description: 'Test different content variations',
    defaultEnabled: false,
    planRequired: ['enterprise', 'unlimited'],
  },
  {
    key: 'api_access',
    name: 'API Access',
    description: 'Programmatic API access',
    defaultEnabled: false,
    planRequired: ['enterprise', 'unlimited'],
  },
  {
    key: 'white_label',
    name: 'White Label',
    description: 'Remove InvestingPro branding',
    defaultEnabled: false,
    planRequired: ['enterprise', 'unlimited'],
  },
  {
    key: 'custom_domain',
    name: 'Custom Domain',
    description: 'Use your own domain',
    defaultEnabled: false,
    planRequired: ['enterprise', 'unlimited'],
  },
  {
    key: 'scheduled_publishing',
    name: 'Scheduled Publishing',
    description: 'Schedule articles for future publication',
    defaultEnabled: true,
    planRequired: ['growth', 'enterprise', 'unlimited'],
  },
  {
    key: 'bulk_operations',
    name: 'Bulk Operations',
    description: 'Bulk edit and manage content',
    defaultEnabled: false,
    planRequired: ['growth', 'enterprise', 'unlimited'],
  },
];

// =============================================================================
// CONFIG MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Get full tenant configuration
 */
export async function getTenantConfig(tenantId: string): Promise<TenantConfig | null> {
  try {
    // Get tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (tenantError || !tenant) {
      logger.error('Tenant not found', tenantError as Error, { tenantId });
      return null;
    }

    // Get settings
    const { data: settingsData } = await supabase
      .from('tenant_settings')
      .select('key, value')
      .eq('tenant_id', tenantId);

    const settings: TenantSettings = {};
    for (const row of settingsData || []) {
      settings[row.key] = row.value;
    }

    // Get features
    const { data: featuresData } = await supabase
      .from('tenant_feature_flags')
      .select('feature_key, enabled')
      .eq('tenant_id', tenantId);

    const features: TenantFeatureFlags = {};
    for (const row of featuresData || []) {
      features[row.feature_key] = row.enabled;
    }

    // Get plan limits
    const limits = PLAN_LIMITS[tenant.plan] || PLAN_LIMITS.starter;

    // Build branding
    const branding: TenantBranding = {
      logo: tenant.logo_url,
      favicon: tenant.favicon_url,
      primaryColor: tenant.primary_color,
      secondaryColor: tenant.secondary_color,
      customCss: tenant.metadata?.customCss || null,
    };

    return {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        displayName: tenant.display_name,
        logoUrl: tenant.logo_url,
        primaryColor: tenant.primary_color,
        secondaryColor: tenant.secondary_color,
        customDomain: tenant.custom_domain,
        plan: tenant.plan,
        status: tenant.status,
        metadata: tenant.metadata || {},
      },
      settings,
      features,
      limits,
      branding,
    };
  } catch (error) {
    logger.error('Error getting tenant config', error as Error, { tenantId });
    return null;
  }
}

/**
 * Update tenant setting
 */
export async function updateTenantSetting(
  tenantId: string,
  key: string,
  value: any
): Promise<boolean> {
  try {
    const definition = SETTING_DEFINITIONS.find(d => d.key === key);
    
    if (!definition) {
      logger.warn('Unknown setting key', { key });
      return false;
    }

    // Check plan requirement
    if (definition.planRequired) {
      const { data: tenant } = await supabase
        .from('tenants')
        .select('plan')
        .eq('id', tenantId)
        .single();

      if (tenant && !definition.planRequired.includes(tenant.plan) && tenant.plan !== 'unlimited') {
        logger.warn('Setting not available for plan', { key, plan: tenant.plan });
        return false;
      }
    }

    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: tenantId,
        key,
        value,
        category: definition.category,
        description: definition.description,
        is_sensitive: definition.sensitive,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,key',
      });

    if (error) {
      logger.error('Error updating setting', error as Error, { tenantId, key });
      return false;
    }

    logger.info('Tenant setting updated', { tenantId, key });
    return true;
  } catch (error) {
    logger.error('Error in updateTenantSetting', error as Error, { tenantId, key });
    return false;
  }
}

/**
 * Update tenant feature flag
 */
export async function updateFeatureFlag(
  tenantId: string,
  featureKey: string,
  enabled: boolean
): Promise<boolean> {
  try {
    const definition = FEATURE_DEFINITIONS.find(f => f.key === featureKey);
    
    if (!definition) {
      logger.warn('Unknown feature key', { featureKey });
      return false;
    }

    // Check plan requirement
    const { data: tenant } = await supabase
      .from('tenants')
      .select('plan')
      .eq('id', tenantId)
      .single();

    if (tenant && !definition.planRequired.includes(tenant.plan) && tenant.plan !== 'unlimited') {
      logger.warn('Feature not available for plan', { featureKey, plan: tenant.plan });
      return false;
    }

    const { error } = await supabase
      .from('tenant_feature_flags')
      .upsert({
        tenant_id: tenantId,
        feature_key: featureKey,
        enabled,
        description: definition.description,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,feature_key',
      });

    if (error) {
      logger.error('Error updating feature flag', error as Error, { tenantId, featureKey });
      return false;
    }

    logger.info('Feature flag updated', { tenantId, featureKey, enabled });
    return true;
  } catch (error) {
    logger.error('Error in updateFeatureFlag', error as Error, { tenantId, featureKey });
    return false;
  }
}

/**
 * Check if feature is available for tenant's plan
 */
export function isFeatureAvailableForPlan(
  featureKey: string,
  plan: string
): boolean {
  if (plan === 'unlimited') return true;

  const definition = FEATURE_DEFINITIONS.find(f => f.key === featureKey);
  if (!definition) return false;

  return definition.planRequired.includes(plan);
}

/**
 * Get available features for a plan
 */
export function getAvailableFeaturesForPlan(plan: string): FeatureDefinition[] {
  if (plan === 'unlimited') return FEATURE_DEFINITIONS;

  return FEATURE_DEFINITIONS.filter(f => f.planRequired.includes(plan));
}

/**
 * Initialize default settings for a new tenant
 */
export async function initializeTenantSettings(tenantId: string): Promise<void> {
  try {
    const settingsToInsert = SETTING_DEFINITIONS
      .filter(d => !d.planRequired || d.planRequired.length === 0)
      .map(d => ({
        tenant_id: tenantId,
        key: d.key,
        value: d.defaultValue,
        category: d.category,
        description: d.description,
        is_sensitive: d.sensitive,
      }));

    if (settingsToInsert.length > 0) {
      await supabase
        .from('tenant_settings')
        .upsert(settingsToInsert, { onConflict: 'tenant_id,key', ignoreDuplicates: true });
    }

    logger.info('Tenant settings initialized', { tenantId, count: settingsToInsert.length });
  } catch (error) {
    logger.error('Error initializing tenant settings', error as Error, { tenantId });
  }
}

/**
 * Initialize default feature flags for a new tenant
 */
export async function initializeTenantFeatures(
  tenantId: string,
  plan: string
): Promise<void> {
  try {
    const availableFeatures = getAvailableFeaturesForPlan(plan);
    
    const flagsToInsert = availableFeatures.map(f => ({
      tenant_id: tenantId,
      feature_key: f.key,
      enabled: f.defaultEnabled,
      description: f.description,
    }));

    if (flagsToInsert.length > 0) {
      await supabase
        .from('tenant_feature_flags')
        .upsert(flagsToInsert, { onConflict: 'tenant_id,feature_key', ignoreDuplicates: true });
    }

    logger.info('Tenant features initialized', { tenantId, count: flagsToInsert.length });
  } catch (error) {
    logger.error('Error initializing tenant features', error as Error, { tenantId });
  }
}

/**
 * Get tenant's effective limits (plan limits with overrides)
 */
export async function getTenantLimits(tenantId: string): Promise<TenantPlanLimits> {
  try {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('plan, max_users, max_articles, max_storage_gb')
      .eq('id', tenantId)
      .single();

    if (!tenant) {
      return PLAN_LIMITS.starter;
    }

    const planLimits = PLAN_LIMITS[tenant.plan] || PLAN_LIMITS.starter;

    // Apply tenant-specific overrides
    return {
      maxUsers: tenant.max_users || planLimits.maxUsers,
      maxArticles: tenant.max_articles || planLimits.maxArticles,
      maxStorageGb: tenant.max_storage_gb || planLimits.maxStorageGb,
      maxAiRequestsPerDay: planLimits.maxAiRequestsPerDay,
      features: planLimits.features,
    };
  } catch (error) {
    logger.error('Error getting tenant limits', error as Error, { tenantId });
    return PLAN_LIMITS.starter;
  }
}

/**
 * Check if tenant is within usage limits
 */
export async function checkTenantLimits(
  tenantId: string,
  resource: 'users' | 'articles' | 'storage' | 'ai_requests',
  currentUsage: number
): Promise<{ withinLimit: boolean; limit: number; usage: number }> {
  const limits = await getTenantLimits(tenantId);
  
  let limit: number;
  switch (resource) {
    case 'users':
      limit = limits.maxUsers;
      break;
    case 'articles':
      limit = limits.maxArticles;
      break;
    case 'storage':
      limit = limits.maxStorageGb;
      break;
    case 'ai_requests':
      limit = limits.maxAiRequestsPerDay;
      break;
    default:
      limit = -1;
  }

  // -1 means unlimited
  const withinLimit = limit === -1 || currentUsage < limit;

  return { withinLimit, limit, usage: currentUsage };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  PLAN_LIMITS,
  SETTING_DEFINITIONS,
  FEATURE_DEFINITIONS,
  getTenantConfig,
  updateTenantSetting,
  updateFeatureFlag,
  isFeatureAvailableForPlan,
  getAvailableFeaturesForPlan,
  initializeTenantSettings,
  initializeTenantFeatures,
  getTenantLimits,
  checkTenantLimits,
};
