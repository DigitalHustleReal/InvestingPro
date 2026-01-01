
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface Notification {
    id: string;
    user_id: string;
    type: 'new_article' | 'price_alert' | 'update' | 'promotion' | 'system';
    title: string;
    message: string;
    link?: string;
    image?: string;
    is_read: boolean;
    created_at: string;
}

export interface NotificationPreferences {
    email_new_articles: boolean;
    email_weekly_digest: boolean;
    email_price_alerts: boolean;
    push_enabled: boolean;
    push_new_articles: boolean;
    push_price_alerts: boolean;
}

class NotificationService {
    private supabase = createClient();

    /**
     * Create a notification for a user
     */
    async createNotification(data: {
        userId: string;
        type: Notification['type'];
        title: string;
        message: string;
        link?: string;
        image?: string;
    }): Promise<boolean> {
        try {
            const { error } = await this.supabase
                .from('notifications')
                .insert({
                    user_id: data.userId,
                    type: data.type,
                    title: data.title,
                    message: data.message,
                    link: data.link,
                    image: data.image,
                    is_read: false
                });

            if (error) throw error;
            return true;

        } catch (error) {
            logger.error('Failed to create notification', error as Error);
            return false;
        }
    }

    /**
     * Create notifications for all subscribers (e.g., new article)
     */
    async notifyAllSubscribers(data: {
        type: Notification['type'];
        title: string;
        message: string;
        link?: string;
        image?: string;
        interests?: string[];
    }): Promise<number> {
        try {
            // Get verified newsletter subscribers
            let query = this.supabase
                .from('newsletter_subscribers')
                .select('email')
                .eq('status', 'verified');

            // Filter by interests if provided
            if (data.interests && data.interests.length > 0) {
                query = query.contains('interests', data.interests);
            }

            const { data: subscribers } = await query;

            if (!subscribers || subscribers.length === 0) {
                return 0;
            }

            // For in-app notifications, we'd also notify registered users
            // This is a simplified version

            logger.info(`Would notify ${subscribers.length} subscribers`, { type: data.type });
            return subscribers.length;

        } catch (error) {
            logger.error('Failed to notify subscribers', error as Error);
            return 0;
        }
    }

    /**
     * Get user's notifications
     */
    async getUserNotifications(userId: string, options?: {
        unreadOnly?: boolean;
        limit?: number;
    }): Promise<Notification[]> {
        try {
            let query = this.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (options?.unreadOnly) {
                query = query.eq('is_read', false);
            }

            if (options?.limit) {
                query = query.limit(options.limit);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];

        } catch (error) {
            logger.error('Failed to get notifications', error as Error);
            return [];
        }
    }

    /**
     * Get unread count
     */
    async getUnreadCount(userId: string): Promise<number> {
        try {
            const { count, error } = await this.supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) throw error;
            return count || 0;

        } catch {
            return 0;
        }
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string, userId: string): Promise<boolean> {
        try {
            const { error } = await this.supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId)
                .eq('user_id', userId);

            if (error) throw error;
            return true;

        } catch (error) {
            logger.error('Failed to mark notification as read', error as Error);
            return false;
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId: string): Promise<boolean> {
        try {
            const { error } = await this.supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) throw error;
            return true;

        } catch (error) {
            logger.error('Failed to mark all notifications as read', error as Error);
            return false;
        }
    }

    /**
     * Delete old notifications
     */
    async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const { data, error } = await this.supabase
                .from('notifications')
                .delete()
                .lt('created_at', cutoffDate.toISOString())
                .eq('is_read', true)
                .select('id');

            if (error) throw error;
            return data?.length || 0;

        } catch (error) {
            logger.error('Failed to cleanup notifications', error as Error);
            return 0;
        }
    }

    /**
     * Get/Update user notification preferences
     */
    async getPreferences(userId: string): Promise<NotificationPreferences> {
        try {
            const { data, error } = await this.supabase
                .from('user_preferences')
                .select('notification_settings')
                .eq('user_id', userId)
                .single();

            if (error || !data) {
                return this.getDefaultPreferences();
            }

            return { ...this.getDefaultPreferences(), ...data.notification_settings };

        } catch {
            return this.getDefaultPreferences();
        }
    }

    async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<boolean> {
        try {
            const current = await this.getPreferences(userId);
            const updated = { ...current, ...preferences };

            const { error } = await this.supabase
                .from('user_preferences')
                .upsert({
                    user_id: userId,
                    notification_settings: updated,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return true;

        } catch (error) {
            logger.error('Failed to update notification preferences', error as Error);
            return false;
        }
    }

    private getDefaultPreferences(): NotificationPreferences {
        return {
            email_new_articles: true,
            email_weekly_digest: true,
            email_price_alerts: true,
            push_enabled: false,
            push_new_articles: false,
            push_price_alerts: false
        };
    }
}

export const notificationService = new NotificationService();
