import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export interface SEOServiceIntegration {
    id?: string;
    service_type: 'google_search_console' | 'google_trends' | 'ahrefs' | 'semrush' | 'moz';
    service_name: string;
    config: Record<string, any>;
    status?: 'active' | 'paused' | 'error' | 'expired';
    last_sync_at?: Date;
    sync_frequency?: 'hourly' | 'daily' | 'weekly';
}

/**
 * SEO Service Manager
 * 
 * Manages integrations with various SEO services
 */
export class SEOServiceManager {
    /**
     * Create or update SEO service integration
     */
    async saveIntegration(integration: SEOServiceIntegration): Promise<string> {
        const supabase = await createClient();

        try {
            // Check if integration exists
            const { data: existing } = await supabase
                .from('seo_service_integrations')
                .select('id')
                .eq('service_type', integration.service_type)
                .single();

            let result;
            if (existing) {
                // Update existing
                const { data, error } = await supabase
                    .from('seo_service_integrations')
                    .update({
                        service_name: integration.service_name,
                        config: integration.config,
                        status: integration.status || 'active',
                        sync_frequency: integration.sync_frequency || 'daily',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id)
                    .select('id')
                    .single();

                if (error) throw error;
                result = data.id;
            } else {
                // Create new
                const { data, error } = await supabase
                    .from('seo_service_integrations')
                    .insert({
                        service_type: integration.service_type,
                        service_name: integration.service_name,
                        config: integration.config,
                        status: integration.status || 'active',
                        sync_frequency: integration.sync_frequency || 'daily'
                    })
                    .select('id')
                    .single();

                if (error) throw error;
                result = data.id;
            }

            return result;
        } catch (error) {
            logger.error("Error saving SEO service integration", error instanceof Error ? error : new Error(String(error)), { integration });
            throw error;
        }
    }

    /**
     * Get all integrations
     */
    async getIntegrations(): Promise<SEOServiceIntegration[]> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('seo_service_integrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching SEO service integrations", error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    /**
     * Get single integration
     */
    async getIntegration(serviceType: string): Promise<SEOServiceIntegration | null> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('seo_service_integrations')
                .select('*')
                .eq('service_type', serviceType)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data || null;
        } catch (error) {
            logger.error("Error fetching SEO service integration", error instanceof Error ? error : new Error(String(error)), { serviceType });
            return null;
        }
    }

    /**
     * Delete integration
     */
    async deleteIntegration(integrationId: string): Promise<void> {
        const supabase = await createClient();

        try {
            const { error } = await supabase
                .from('seo_service_integrations')
                .delete()
                .eq('id', integrationId);

            if (error) throw error;
        } catch (error) {
            logger.error("Error deleting SEO service integration", error instanceof Error ? error : new Error(String(error)), { integrationId });
            throw error;
        }
    }

    /**
     * Update integration status
     */
    async updateIntegrationStatus(integrationId: string, status: 'active' | 'paused' | 'error' | 'expired'): Promise<void> {
        const supabase = await createClient();

        try {
            const { error } = await supabase
                .from('seo_service_integrations')
                .update({
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', integrationId);

            if (error) throw error;
        } catch (error) {
            logger.error("Error updating integration status", error instanceof Error ? error : new Error(String(error)), { integrationId, status });
            throw error;
        }
    }
}

export const seoServiceManager = new SEOServiceManager();

