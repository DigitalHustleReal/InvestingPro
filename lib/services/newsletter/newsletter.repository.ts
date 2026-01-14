/**
 * Newsletter Repository
 * Abstracts database access for newsletter subscriptions
 */
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface NewsletterRepository {
    findByEmail(email: string): Promise<any | null>;
    create(email: string, source?: string): Promise<any>;
    delete(email: string): Promise<void>;
    exists(email: string): Promise<boolean>;
}

export class SupabaseNewsletterRepository implements NewsletterRepository {
    private async getClient(): Promise<SupabaseClient> {
        return await createClient();
    }

    async findByEmail(email: string): Promise<any | null> {
        const supabase = await this.getClient();

        try {
            const { data, error } = await supabase
                .from('newsletter_subscriptions')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('Newsletter repository findByEmail error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async create(email: string, source?: string): Promise<any> {
        const supabase = await this.getClient();

        try {
            const { data, error } = await supabase
                .from('newsletter_subscriptions')
                .insert({
                    email,
                    source: source || 'website',
                    subscribed_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('Newsletter repository create error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async delete(email: string): Promise<void> {
        const supabase = await this.getClient();

        try {
            const { error } = await supabase
                .from('newsletter_subscriptions')
                .delete()
                .eq('email', email);

            if (error) {
                throw error;
            }
        } catch (error) {
            logger.error('Newsletter repository delete error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async exists(email: string): Promise<boolean> {
        const supabase = await this.getClient();

        try {
            const { data, error } = await supabase
                .from('newsletter_subscriptions')
                .select('id')
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return false; // Not found
                }
                throw error;
            }

            return !!data;
        } catch (error) {
            logger.error('Newsletter repository exists error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}
