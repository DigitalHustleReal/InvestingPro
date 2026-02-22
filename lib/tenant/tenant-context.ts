/**
 * Tenant Context System
 * Provides tenant identification, context management, and React hooks
 */

import { createContext, useContext, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { headers as getHeaders } from 'next/headers';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

// =============================================================================
// TYPES
// =============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  displayName: string | null;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  customDomain: string | null;
  plan: 'starter' | 'growth' | 'enterprise' | 'unlimited';
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  metadata: Record<string, any>;
}

export interface TenantSettings {
  [key: string]: any;
}

export interface TenantFeatureFlags {
  [key: string]: boolean;
}

export interface TenantContext {
  tenant: Tenant | null;
  settings: TenantSettings;
  features: TenantFeatureFlags;
  isLoading: boolean;
  error: Error | null;
}

export interface TenantUser {
  userId: string;
  tenantId: string;
  role: 'owner' | 'admin' | 'editor' | 'member' | 'viewer';
  permissions: Record<string, boolean>;
}

// =============================================================================
// TENANT IDENTIFICATION
// =============================================================================

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Extract tenant identifier from request
 * Priority: Header > Subdomain > Default
 */
export function extractTenantIdentifier(request: Request): {
  identifier: string | null;
  source: 'header' | 'subdomain' | 'domain' | 'default';
} {
  const url = new URL(request.url);
  const hostname = url.hostname;

  // 1. Check for explicit tenant header (useful for API calls)
  const tenantHeader = request.headers.get('x-tenant-id') 
    || request.headers.get('x-tenant-slug');
  
  if (tenantHeader) {
    return { identifier: tenantHeader, source: 'header' };
  }

  // 2. Check for subdomain (e.g., acme.investingpro.in)
  const baseDomains = [
    'investingpro.in',
    'investingpro.com',
    'localhost',
    '127.0.0.1',
  ];

  for (const baseDomain of baseDomains) {
    if (hostname.endsWith(baseDomain) && hostname !== baseDomain) {
      // Extract subdomain
      const subdomain = hostname.replace(`.${baseDomain}`, '').split('.')[0];
      
      // Skip common subdomains that aren't tenants
      if (!['www', 'api', 'admin', 'app', 'staging', 'dev'].includes(subdomain)) {
        return { identifier: subdomain, source: 'subdomain' };
      }
    }
  }

  // 3. Check if it's a custom domain
  if (!baseDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
    return { identifier: hostname, source: 'domain' };
  }

  // 4. Default to main tenant
  return { identifier: 'main', source: 'default' };
}

/**
 * Resolve tenant from identifier
 */
export async function resolveTenant(
  identifier: string,
  source: 'header' | 'subdomain' | 'domain' | 'default'
): Promise<Tenant | null> {
  try {
    let query = supabase
      .from('tenants')
      .select('*')
      .eq('status', 'active');

    // Build query based on identifier source
    if (source === 'domain') {
      query = query.eq('custom_domain', identifier);
    } else {
      // Could be slug or ID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
      if (isUUID) {
        query = query.eq('id', identifier);
      } else {
        query = query.eq('slug', identifier);
      }
    }

    const { data, error } = await query.single();

    if (error || !data) {
      logger.warn('Tenant not found', { identifier, source, error });
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      displayName: data.display_name,
      logoUrl: data.logo_url,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      customDomain: data.custom_domain,
      plan: data.plan,
      status: data.status,
      metadata: data.metadata || {},
    };
  } catch (error) {
    logger.error('Error resolving tenant', error as Error, { identifier });
    return null;
  }
}

/**
 * Get tenant settings
 */
export async function getTenantSettings(tenantId: string): Promise<TenantSettings> {
  try {
    const { data, error } = await supabase
      .from('tenant_settings')
      .select('key, value')
      .eq('tenant_id', tenantId)
      .eq('is_sensitive', false);

    if (error) {
      logger.error('Error fetching tenant settings', error as Error, { tenantId });
      return {};
    }

    const settings: TenantSettings = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    return settings;
  } catch (error) {
    logger.error('Error in getTenantSettings', error as Error, { tenantId });
    return {};
  }
}

/**
 * Get tenant feature flags
 */
export async function getTenantFeatureFlags(tenantId: string): Promise<TenantFeatureFlags> {
  try {
    const { data, error } = await supabase
      .from('tenant_feature_flags')
      .select('feature_key, enabled, expires_at')
      .eq('tenant_id', tenantId);

    if (error) {
      logger.error('Error fetching feature flags', error as Error, { tenantId });
      return {};
    }

    const flags: TenantFeatureFlags = {};
    const now = new Date();

    for (const row of data || []) {
      // Check if feature has expired
      if (row.expires_at && new Date(row.expires_at) < now) {
        flags[row.feature_key] = false;
      } else {
        flags[row.feature_key] = row.enabled;
      }
    }

    return flags;
  } catch (error) {
    logger.error('Error in getTenantFeatureFlags', error as Error, { tenantId });
    return {};
  }
}

/**
 * Get full tenant context (tenant + settings + features)
 */
export async function getTenantContext(request: Request): Promise<TenantContext> {
  const { identifier, source } = extractTenantIdentifier(request);
  
  if (!identifier) {
    return {
      tenant: null,
      settings: {},
      features: {},
      isLoading: false,
      error: new Error('No tenant identifier found'),
    };
  }

  const tenant = await resolveTenant(identifier, source);
  
  if (!tenant) {
    return {
      tenant: null,
      settings: {},
      features: {},
      isLoading: false,
      error: new Error(`Tenant not found: ${identifier}`),
    };
  }

  const [settings, features] = await Promise.all([
    getTenantSettings(tenant.id),
    getTenantFeatureFlags(tenant.id),
  ]);

  return {
    tenant,
    settings,
    features,
    isLoading: false,
    error: null,
  };
}

// =============================================================================
// SERVER-SIDE HELPERS
// =============================================================================

/**
 * Get current tenant from server component/API route
 * Uses Next.js headers() to access request headers
 */
export async function getCurrentTenant(): Promise<Tenant | null> {
  try {
    let headersList;
    try {
      headersList = await getHeaders();
    } catch (e) {
      // Outside of request context (e.g., build time)
      return resolveTenant('main', 'default');
    }
    
    // Check for tenant header set by middleware
    const tenantId = headersList.get('x-tenant-id');
    const tenantSlug = headersList.get('x-tenant-slug');
    
    if (tenantId) {
      return resolveTenant(tenantId, 'header');
    }
    
    if (tenantSlug) {
      return resolveTenant(tenantSlug, 'header');
    }

    // Fallback to default tenant
    return resolveTenant('main', 'default');
  } catch (error) {
    logger.error('Error getting current tenant', error as Error);
    return null;
  }
}

/**
 * Get current tenant's settings from server component
 */
export async function getCurrentTenantSettings(): Promise<TenantSettings> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  return getTenantSettings(tenant.id);
}

/**
 * Get current tenant's feature flags from server component
 */
export async function getCurrentTenantFeatures(): Promise<TenantFeatureFlags> {
  const tenant = await getCurrentTenant();
  if (!tenant) return {};
  return getTenantFeatureFlags(tenant.id);
}

/**
 * Check if a feature is enabled for current tenant
 */
export async function isFeatureEnabled(featureKey: string): Promise<boolean> {
  const features = await getCurrentTenantFeatures();
  return features[featureKey] === true;
}

// =============================================================================
// TENANT USER MANAGEMENT
// =============================================================================

/**
 * Get user's tenant membership
 */
export async function getUserTenantMembership(
  userId: string,
  tenantId?: string
): Promise<TenantUser | null> {
  try {
    let query = supabase
      .from('tenant_users')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return null;
    }

    return {
      userId: data.user_id,
      tenantId: data.tenant_id,
      role: data.role,
      permissions: data.permissions || {},
    };
  } catch (error) {
    logger.error('Error getting user tenant membership', error as Error, { userId });
    return null;
  }
}

/**
 * Get all tenants for a user
 */
export async function getUserTenants(userId: string): Promise<Tenant[]> {
  try {
    const { data, error } = await supabase
      .from('tenant_users')
      .select(`
        tenant_id,
        tenants (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      logger.error('Error fetching user tenants', error as Error, { userId });
      return [];
    }

    return (data || [])
      .filter((row: any) => row.tenants)
      .map((row: any) => ({
        id: row.tenants.id,
        name: row.tenants.name,
        slug: row.tenants.slug,
        displayName: row.tenants.display_name,
        logoUrl: row.tenants.logo_url,
        primaryColor: row.tenants.primary_color,
        secondaryColor: row.tenants.secondary_color,
        customDomain: row.tenants.custom_domain,
        plan: row.tenants.plan,
        status: row.tenants.status,
        metadata: row.tenants.metadata || {},
      }));
  } catch (error) {
    logger.error('Error in getUserTenants', error as Error, { userId });
    return [];
  }
}

/**
 * Check if user has permission in tenant
 */
export async function hasPermission(
  userId: string,
  tenantId: string,
  permission: string
): Promise<boolean> {
  const membership = await getUserTenantMembership(userId, tenantId);
  
  if (!membership) return false;

  // Owners and admins have all permissions
  if (['owner', 'admin'].includes(membership.role)) {
    return true;
  }

  // Check specific permission
  return membership.permissions[permission] === true;
}

// =============================================================================
// REACT CONTEXT (for client components)
// =============================================================================

const TenantReactContext = createContext<TenantContext>({
  tenant: null,
  settings: {},
  features: {},
  isLoading: true,
  error: null,
});

/**
 * Hook to access tenant context in client components
 */
export function useTenant() {
  const context = useContext(TenantReactContext);
  
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
}

/**
 * Hook to check if a feature is enabled
 */
export function useFeature(featureKey: string): boolean {
  const { features } = useTenant();
  return features[featureKey] === true;
}

/**
 * Hook to get a tenant setting
 */
export function useTenantSetting<T = any>(key: string, defaultValue?: T): T {
  const { settings } = useTenant();
  return settings[key] ?? defaultValue;
}

// Export context for provider
export { TenantReactContext };

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  extractTenantIdentifier,
  resolveTenant,
  getTenantSettings,
  getTenantFeatureFlags,
  getTenantContext,
  getCurrentTenant,
  getCurrentTenantSettings,
  getCurrentTenantFeatures,
  isFeatureEnabled,
  getUserTenantMembership,
  getUserTenants,
  hasPermission,
  useTenant,
  useFeature,
  useTenantSetting,
};
