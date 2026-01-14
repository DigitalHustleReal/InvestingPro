/**
 * Affiliate Service
 * Business logic for affiliate tracking
 */
import { SupabaseAffiliateRepository, type AffiliateRepository, type AffiliateClick } from './affiliate.repository';
import { logger } from '@/lib/logger';

export interface AffiliateService {
    trackClick(data: AffiliateClick): Promise<any>;
    getClicks(userId?: string, productId?: string): Promise<any[]>;
    getStats(userId?: string, productId?: string): Promise<any>;
}

export class AffiliateServiceImpl implements AffiliateService {
    private repository: AffiliateRepository;

    constructor(repository?: AffiliateRepository) {
        this.repository = repository || new SupabaseAffiliateRepository();
    }

    async trackClick(data: AffiliateClick): Promise<any> {
        try {
            return await this.repository.trackClick(data);
        } catch (error) {
            logger.error('Affiliate service trackClick error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getClicks(userId?: string, productId?: string): Promise<any[]> {
        try {
            return await this.repository.getClicks(userId, productId);
        } catch (error) {
            logger.error('Affiliate service getClicks error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    async getStats(userId?: string, productId?: string): Promise<any> {
        try {
            return await this.repository.getStats(userId, productId);
        } catch (error) {
            logger.error('Affiliate service getStats error', error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
}

// Export singleton instance
export const affiliateService = new AffiliateServiceImpl();
