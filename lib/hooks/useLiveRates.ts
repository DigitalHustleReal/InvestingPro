"use client";

import { useQuery } from "@tanstack/react-query";

interface LiveRate {
    id: string;
    rate_type: string;
    provider: string;
    rate_value: number;
    rate_unit: string;
    min_amount?: number;
    max_amount?: number;
    tenure_months?: number;
    tenure_years?: number;
    source_url?: string;
    scraped_at: string;
}

interface InflationData {
    year: number;
    month: number;
    inflation_rate: number;
    source: string;
}

interface LiveRatesResponse {
    success: boolean;
    rates: LiveRate[];
    inflation: InflationData | null;
    timestamp: string;
}

/**
 * Hook to fetch live financial rates
 */
export function useLiveRates(rateType?: string) {
    return useQuery<LiveRatesResponse>({
        queryKey: ['liveRates', rateType],
        queryFn: async () => {
            const url = rateType 
                ? `/api/rates/live?type=${rateType}`
                : '/api/rates/live';
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch live rates');
            }
            return response.json();
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchInterval: 1000 * 60 * 60, // Refetch every hour
    });
}

/**
 * Get average rate for a specific type
 */
export function useAverageRate(rateType: string) {
    const { data, isLoading } = useLiveRates(rateType);
    
    if (isLoading || !data?.rates || data.rates.length === 0) {
        return { rate: null, isLoading };
    }
    
    const rates = data.rates.map(r => r.rate_value);
    const average = rates.reduce((a, b) => a + b, 0) / rates.length;
    
    return { rate: average, isLoading };
}

/**
 * Get latest inflation rate
 */
export function useInflationRate() {
    const { data, isLoading } = useLiveRates('inflation');
    
    return {
        inflationRate: data?.inflation?.inflation_rate || null,
        isLoading
    };
}

