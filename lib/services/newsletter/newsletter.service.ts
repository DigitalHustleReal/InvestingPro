/**
 * Newsletter Service
 * Business logic for newsletter subscriptions
 */
import { SupabaseNewsletterRepository, type NewsletterRepository } from './newsletter.repository';
import { logger } from '@/lib/logger';

export interface NewsletterService {
    subscribe(email: string, source?: string, name?: string, interests?: string[], frequency?: string): Promise<any>;
    unsubscribe(email: string): Promise<void>;
    isSubscribed(email: string): Promise<boolean>;
    getSubscription(email: string): Promise<any | null>;
    verify(token: string): Promise<any>;
    getSubscriberCount(): Promise<number>;
}

export class NewsletterServiceImpl implements NewsletterService {
    private repository: NewsletterRepository;

    constructor(repository?: NewsletterRepository) {
        this.repository = repository || new SupabaseNewsletterRepository();
    }

    async subscribe(email: string, source?: string, name?: string, interests?: string[], frequency?: string): Promise<any> {
        try {
            // Use existing newsletter service which has full implementation
            const { newsletterService: existingService } = await import('@/lib/engagement/newsletter-service');
            return await existingService.subscribe({
                email,
                name,
                interests,
                frequency: frequency as 'daily' | 'weekly' | 'monthly' | undefined
            });
        } catch (error) {
            logger.error('Newsletter service subscribe error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async verify(token: string): Promise<any> {
        try {
            // Use existing newsletter service
            const { newsletterService: existingService } = await import('@/lib/engagement/newsletter-service');
            return await existingService.verify(token);
        } catch (error) {
            logger.error('Newsletter service verify error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getSubscriberCount(): Promise<number> {
        try {
            // Use existing newsletter service
            const { newsletterService: existingService } = await import('@/lib/engagement/newsletter-service');
            return await existingService.getSubscriberCount();
        } catch (error) {
            logger.error('Newsletter service getSubscriberCount error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async unsubscribe(email: string): Promise<void> {
        try {
            await this.repository.delete(email);
        } catch (error) {
            logger.error('Newsletter service unsubscribe error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async isSubscribed(email: string): Promise<boolean> {
        try {
            return await this.repository.exists(email);
        } catch (error) {
            logger.error('Newsletter service isSubscribed error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getSubscription(email: string): Promise<any | null> {
        try {
            return await this.repository.findByEmail(email);
        } catch (error) {
            logger.error('Newsletter service getSubscription error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}

// Export singleton instance
export const newsletterService = new NewsletterServiceImpl();
