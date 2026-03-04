import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Define types for better type safety
export interface RevenueMetrics {
    totalRevenue: {
        current: number;
        previous: number;
        growth: number;
    };
    revenueByCategory: {
        creditCards: number;
        mutualFunds: number;
        insurance: number;
        others: number;
    };
    conversionRates: {
        overall: number;
        creditCards: number;
        mutualFunds: number;
    };
    trends: {
        daily: Array<{ date: string; revenue: number }>;
        weekly: Array<{ week: string; revenue: number }>;
        monthly: Array<{ month: string; revenue: number }>;
    };
}

export class RevenueService {
    private supabase;

    constructor(supabaseClient: any) {
        this.supabase = supabaseClient;
    }

    async getDashboardMetrics(startDate?: string, endDate?: string): Promise<RevenueMetrics> {
        try {
            const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
            const end = endDate || new Date().toISOString();

            // Use the optimized RPC to get all metrics in one go
            const { data, error } = await this.supabase.rpc('get_revenue_dashboard_metrics', {
                p_start_date: start,
                p_end_date: end
            });

            if (error) {
                logger.error('RevenueService: RPC error', error);
                throw error;
            }

            // Return the data directly as it matches the interface
            return data as RevenueMetrics;
        } catch (error) {
            logger.error('RevenueService: Failed to get dashboard metrics', error);
            // Fallback to empty structure if RPC fails (prevent page crash)
            return {
                totalRevenue: { current: 0, previous: 0, growth: 0 },
                revenueByCategory: { creditCards: 0, mutualFunds: 0, insurance: 0, others: 0 },
                conversionRates: { overall: 0, creditCards: 0, mutualFunds: 0 },
                trends: { daily: [], weekly: [], monthly: [] }
            };
        }
    }
}
