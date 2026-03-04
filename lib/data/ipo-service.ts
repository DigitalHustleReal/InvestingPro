import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface IPOData {
    id: string;
    companyName: string;
    issuePrice?: number;
    lotSize?: number;
    gmp?: number; // Grey Market Premium
    estimatedListingPrice?: number;
    subscriptionQIB?: number;
    subscriptionNII?: number;
    subscriptionRetail?: number;
    openDate?: Date;
    closeDate?: Date;
    listingDate?: Date;
    issueSizeCr?: number;
    priceBand?: string;
    dataSource: string;
    lastUpdated: Date;
}

export interface IPOSubscriptionData {
    overall: number;
    qib: number;
    nii: number;
    retail: number;
}

export class IPODataService {
    private supabase = createClient();
    private cacheValidityHours = 1; // Refresh every hour

    /**
     * Get IPO data - tries cache first, then fetches if stale
     */
    async getIPOData(forceRefresh: boolean = false): Promise<IPOData[]> {
        try {
            // Check cache first
            if (!forceRefresh) {
                const cachedData = await this.getCachedData();
                if (cachedData && cachedData.length > 0) {
                    return cachedData;
                }
            }

            // Cache is stale or forced refresh, fetch new data
            await this.refreshCache();
            return await this.getCachedData();
        } catch (error) {
            logger.error('Error fetching IPO data:', error);
            // Return mock data as fallback
            return this.getMockData();
        }
    }

    /**
     * Get cached IPO data from Supabase
     */
    private async getCachedData(): Promise<IPOData[]> {
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - this.cacheValidityHours);

        const { data, error } = await this.supabase
            .from('ipo_data_cache')
            .select('*')
            .gte('last_updated', oneHourAgo.toISOString())
            .order('listing_date', { ascending: false })
            .limit(20);

        if (error) {
            logger.error('Error fetching cached IPO data:', error);
            return [];
        }

        return (data || []).map(this.transformFromDB);
    }

    /**
     * Refresh cache by fetching new data from external source
     */
    async refreshCache(): Promise<void> {
        const startTime = Date.now();
        let status: 'success' | 'partial' | 'failed' = 'failed';
        let recordsUpdated = 0;
        let errorMessage: string | null = null;

        try {
            // Try to fetch from external API/scraper
            const newData = await this.fetchFromExternalSource();
            
            if (newData.length > 0) {
                // Upsert data to Supabase
                const { data, error } = await this.supabase
                    .from('ipo_data_cache')
                    .upsert(
                        newData.map(this.transformToDB),
                        { onConflict: 'company_name' }
                    );

                if (error) {
                    throw error;
                }

                recordsUpdated = newData.length;
                status = 'success';
            } else {
                status = 'partial';
                errorMessage = 'No data returned from external source';
            }
        } catch (error) {
            status = 'failed';
            errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error refreshing IPO cache:', error);
        } finally {
            // Log the sync attempt
            await this.logSync(status, recordsUpdated, errorMessage, Date.now() - startTime);
        }
    }

    /**
     * Fetch IPO data from external source (placeholder for future implementation)
     * In production, this would scrape/call an API like Chittorgarh or Investorgain
     */
    private async fetchFromExternalSource(): Promise<Partial<IPOData>[]> {
        // TODO: Implement web scraping or API integration
        // For now, return enhanced mock data
        
        return [
            {
                companyName: 'TechCorp India Ltd',
                issuePrice: 125,
                lotSize: 120,
                gmp: 45,
                estimatedListingPrice: 170,
                subscriptionQIB: 42.5,
                subscriptionNII: 18.3,
                subscriptionRetail: 9.7,
                openDate: new Date('2026-01-06'),
                closeDate: new Date('2026-01-08'),
                listingDate: new Date('2026-01-12'),
                issueSizeCr: 2500,
                priceBand: '₹120-₹125',
                dataSource: 'mock',
                lastUpdated: new Date()
            },
            {
                companyName: 'Green Energy Solutions',
                issuePrice: 280,
                lotSize: 50,
                gmp: 120,
                estimatedListingPrice: 400,
                subscriptionQIB: 85.2,
                subscriptionNII: 52.6,
                subscriptionRetail: 31.4,
                openDate: new Date('2026-01-10'),
                closeDate: new Date('2026-01-13'),
                listingDate: new Date('2026-01-18'),
                issueSizeCr: 3200,
                priceBand: '₹270-₹280',
                dataSource: 'mock',
                lastUpdated: new Date()
            },
            {
                companyName: 'FinTech Innovations Pvt Ltd',
                issuePrice: 95,
                lotSize: 150,
                gmp: 28,
                estimatedListingPrice: 123,
                subscriptionQIB: 12.8,
                subscriptionNII: 6.5,
                subscriptionRetail: 4.2,
                openDate: new Date('2026-01-15'),
                closeDate: new Date('2026-01-17'),
                listingDate: new Date('2026-01-22'),
                issueSizeCr: 1800,
                priceBand: '₹90-₹95',
                dataSource: 'mock',
                lastUpdated: new Date()
            }
        ];
    }

    /**
     * Transform database row to IPOData interface
     */
    private transformFromDB(row: any): IPOData {
        return {
            id: row.id,
            companyName: row.company_name,
            issuePrice: row.issue_price,
            lotSize: row.lot_size,
            gmp: row.gmp,
            estimatedListingPrice: row.estimated_listing_price,
            subscriptionQIB: row.subscription_qib,
            subscriptionNII: row.subscription_nii,
            subscriptionRetail: row.subscription_retail,
            openDate: row.open_date ? new Date(row.open_date) : undefined,
            closeDate: row.close_date ? new Date(row.close_date) : undefined,
            listingDate: row.listing_date ? new Date(row.listing_date) : undefined,
            issueSizeCr: row.issue_size_cr,
            priceBand: row.price_band,
            dataSource: row.data_source,
            lastUpdated: new Date(row.last_updated)
        };
    }

    /**
     * Transform IPOData to database row
     */
    private transformToDB(data: Partial<IPOData>): any {
        return {
            company_name: data.companyName,
            issue_price: data.issuePrice,
            lot_size: data.lotSize,
            gmp: data.gmp,
            estimated_listing_price: data.estimatedListingPrice,
            subscription_qib: data.subscriptionQIB,
            subscription_nii: data.subscriptionNII,
            subscription_retail: data.subscriptionRetail,
            open_date: data.openDate?.toISOString().split('T')[0],
            close_date: data.closeDate?.toISOString().split('T')[0],
            listing_date: data.listingDate?.toISOString().split('T')[0],
            issue_size_cr: data.issueSizeCr,
            price_band: data.priceBand,
            data_source: data.dataSource,
            last_updated: new Date().toISOString()
        };
    }

    /**
     * Log sync attempt to database
     */
    private async logSync(
        status: 'success' | 'partial' | 'failed',
        recordsUpdated: number,
        errorMessage: string | null,
        durationMs: number
    ): Promise<void> {
        try {
            await this.supabase
                .from('data_sync_log')
                .insert({
                    data_type: 'ipo',
                    sync_status: status,
                    records_updated: recordsUpdated,
                    error_message: errorMessage,
                    sync_duration_ms: durationMs,
                    triggered_by: 'manual' // or 'cron' when automated
                });
        } catch (error) {
            logger.error('Error logging sync:', error);
        }
    }

    /**
     * Fallback mock data (used when cache and external source both fail)
     */
    private getMockData(): IPOData[] {
        return [
            {
                id: '1',
                companyName: 'TechCorp India Ltd (Sample)',
                issuePrice: 125,
                lotSize: 120,
                gmp: 45,
                estimatedListingPrice: 170,
                subscriptionQIB: 42.5,
                subscriptionNII: 18.3,
                subscriptionRetail: 9.7,
                openDate: new Date('2026-01-06'),
                closeDate: new Date('2026-01-08'),
                listingDate: new Date('2026-01-12'),
                issueSizeCr: 2500,
                priceBand: '₹120-₹125',
                dataSource: 'fallback_mock',
                lastUpdated: new Date()
            },
            {
                id: '2',
                companyName: 'Green Energy Solutions (Sample)',
                issuePrice: 280,
                lotSize: 50,
                gmp: 120,
                estimatedListingPrice: 400,
                subscriptionQIB: 85.2,
                subscriptionNII: 52.6,
                subscriptionRetail: 31.4,
                openDate: new Date('2026-01-10'),
                closeDate: new Date('2026-01-13'),
                listingDate: new Date('2026-01-18'),
                issueSizeCr: 3200,
                priceBand: '₹270-₹280',
                dataSource: 'fallback_mock',
                lastUpdated: new Date()
            }
        ];
    }

    /**
     * Calculate subscription metrics
     */
    getSubscriptionData(ipo: IPOData): IPOSubscriptionData {
        const qib = ipo.subscriptionQIB || 0;
        const nii = ipo.subscriptionNII || 0;
        const retail = ipo.subscriptionRetail || 0;
        
        // Weighted overall (QIB: 50%, NII: 35%, Retail: 15%)
        const overall = (qib * 0.5) + (nii * 0.35) + (retail * 0.15);

        return {
            overall: Math.round(overall * 100) / 100,
            qib: Math.round(qib * 100) / 100,
            nii: Math.round(nii * 100) / 100,
            retail: Math.round(retail * 100) / 100
        };
    }

    /**
     * Check if IPO is currently open for subscription
     */
    isIPOOpen(ipo: IPOData): boolean {
        if (!ipo.openDate || !ipo.closeDate) return false;
        
        const now = new Date();
        return now >= ipo.openDate && now <= ipo.closeDate;
    }

    /**
     * Check if IPO is upcoming
     */
    isIPOUpcoming(ipo: IPOData): boolean {
        if (!ipo.openDate) return false;
        return new Date() < ipo.openDate;
    }

    /**
     * Check if IPO is closed
     */
    isIPOClosed(ipo: IPOData): boolean {
        if (!ipo.closeDate) return false;
        return new Date() > ipo.closeDate;
    }
}

// Singleton instance
export const ipoDataService = new IPODataService();
