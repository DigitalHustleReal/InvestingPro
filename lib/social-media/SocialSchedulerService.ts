import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export interface SocialSchedulerIntegration {
    id?: string;
    scheduler_type: 'buffer' | 'hootsuite' | 'later' | 'sprout_social' | 'native';
    scheduler_name: string;
    config: Record<string, any>;
    status?: 'active' | 'paused' | 'error';
}

export interface SocialMediaAccount {
    id?: string;
    scheduler_id: string;
    platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'pinterest' | 'youtube';
    account_name: string;
    account_id: string;
    account_handle?: string;
    is_active?: boolean;
}

/**
 * Social Media Scheduler Service
 * 
 * Manages social media scheduler integrations (Buffer, etc.)
 */
export class SocialSchedulerService {
    /**
     * Create or update scheduler integration
     */
    async saveScheduler(scheduler: SocialSchedulerIntegration): Promise<string> {
        const supabase = await createClient();

        try {
            // Check if scheduler exists
            const { data: existing } = await supabase
                .from('social_scheduler_integrations')
                .select('id')
                .eq('scheduler_type', scheduler.scheduler_type)
                .single();

            let result;
            if (existing) {
                // Update existing
                const { data, error } = await supabase
                    .from('social_scheduler_integrations')
                    .update({
                        scheduler_name: scheduler.scheduler_name,
                        config: scheduler.config,
                        status: scheduler.status || 'active',
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
                    .from('social_scheduler_integrations')
                    .insert({
                        scheduler_type: scheduler.scheduler_type,
                        scheduler_name: scheduler.scheduler_name,
                        config: scheduler.config,
                        status: scheduler.status || 'active'
                    })
                    .select('id')
                    .single();

                if (error) throw error;
                result = data.id;
            }

            return result;
        } catch (error) {
            logger.error("Error saving social scheduler integration", error instanceof Error ? error : new Error(String(error)), { scheduler });
            throw error;
        }
    }

    /**
     * Get all schedulers
     */
    async getSchedulers(): Promise<SocialSchedulerIntegration[]> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('social_scheduler_integrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching social schedulers", error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    /**
     * Get social media accounts for scheduler
     */
    async getAccounts(schedulerId: string): Promise<SocialMediaAccount[]> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('social_media_accounts')
                .select('*')
                .eq('scheduler_id', schedulerId)
                .eq('is_active', true)
                .order('platform');

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error("Error fetching social media accounts", error instanceof Error ? error : new Error(String(error)), { schedulerId });
            throw error;
        }
    }

    /**
     * Save social media account
     */
    async saveAccount(account: SocialMediaAccount): Promise<string> {
        const supabase = await createClient();

        try {
            const { data, error } = await supabase
                .from('social_media_accounts')
                .insert({
                    scheduler_id: account.scheduler_id,
                    platform: account.platform,
                    account_name: account.account_name,
                    account_id: account.account_id,
                    account_handle: account.account_handle,
                    is_active: account.is_active !== false
                })
                .select('id')
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            logger.error("Error saving social media account", error instanceof Error ? error : new Error(String(error)), { account });
            throw error;
        }
    }

    /**
     * Delete scheduler
     */
    async deleteScheduler(schedulerId: string): Promise<void> {
        const supabase = await createClient();

        try {
            const { error } = await supabase
                .from('social_scheduler_integrations')
                .delete()
                .eq('id', schedulerId);

            if (error) throw error;
        } catch (error) {
            logger.error("Error deleting social scheduler", error instanceof Error ? error : new Error(String(error)), { schedulerId });
            throw error;
        }
    }
}

export const socialSchedulerService = new SocialSchedulerService();

