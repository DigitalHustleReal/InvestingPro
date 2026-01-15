/**
 * Axiom API Client
 * Helper for querying Axiom logs for alert evaluation
 */

import { logger } from '../logger';

export interface AxiomQueryResult {
    matches: Array<Record<string, any>>;
    buckets?: Array<Record<string, any>>;
}

export class AxiomClient {
    private apiKey: string;
    private dataset: string;
    private baseUrl = 'https://api.axiom.co/v1';

    constructor(apiKey?: string, dataset?: string) {
        this.apiKey = apiKey || process.env.AXIOM_API_KEY || '';
        this.dataset = dataset || process.env.AXIOM_DATASET || '';

        if (!this.apiKey || !this.dataset) {
            logger.warn('Axiom API key or dataset not configured. Alert evaluation may not work.');
        }
    }

    /**
     * Execute Axiom query
     */
    async query(query: string, startTime: Date, endTime: Date): Promise<AxiomQueryResult> {
        if (!this.apiKey || !this.dataset) {
            return { matches: [] };
        }

        try {
            const response = await fetch(`${this.baseUrl}/datasets/${this.dataset}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apl: query,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Axiom API error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            return {
                matches: data.matches || [],
                buckets: data.buckets,
            };
        } catch (error) {
            logger.error('Failed to query Axiom', error as Error, {
                query,
                dataset: this.dataset,
            });
            return { matches: [] };
        }
    }

    /**
     * Get error rate in time window
     */
    async getErrorRate(windowMinutes: number): Promise<{ errorCount: number; totalCount: number; rate: number }> {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - windowMinutes * 60 * 1000);

        // Query for total logs
        const totalQuery = `['level'] = 'info' OR ['level'] = 'warn' OR ['level'] = 'error' OR ['level'] = 'debug'`;
        const totalResult = await this.query(totalQuery, startTime, endTime);
        const totalCount = totalResult.matches.length;

        // Query for error logs
        const errorQuery = `['level'] = 'error'`;
        const errorResult = await this.query(errorQuery, startTime, endTime);
        const errorCount = errorResult.matches.length;

        const rate = totalCount > 0 ? (errorCount / totalCount) * 100 : 0;

        return { errorCount, totalCount, rate };
    }

    /**
     * Get p95 latency for API requests
     */
    async getP95Latency(windowMinutes: number): Promise<number> {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - windowMinutes * 60 * 1000);

        // Query for API requests with duration metrics
        const query = `['message'] LIKE 'API%' AND ['metrics.duration'] != null`;
        const result = await this.query(query, startTime, endTime);

        if (result.matches.length === 0) {
            return 0;
        }

        // Extract durations and calculate p95
        const durations = result.matches
            .map(m => m['metrics.duration'] || m.metrics?.duration || 0)
            .filter(d => d > 0)
            .sort((a, b) => a - b);

        if (durations.length === 0) {
            return 0;
        }

        const p95Index = Math.floor(durations.length * 0.95);
        return durations[p95Index] || 0;
    }

    /**
     * Get AI provider failure rate
     */
    async getAIFailureRate(windowMinutes: number): Promise<{ failureCount: number; totalCount: number; rate: number }> {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - windowMinutes * 60 * 1000);

        // Query for AI provider calls
        const totalQuery = `['message'] LIKE '%AI%' OR ['message'] LIKE '%OpenAI%' OR ['message'] LIKE '%Groq%' OR ['message'] LIKE '%Mistral%'`;
        const totalResult = await this.query(totalQuery, startTime, endTime);
        const totalCount = totalResult.matches.length;

        // Query for AI provider errors
        const errorQuery = `(['message'] LIKE '%AI%' OR ['message'] LIKE '%OpenAI%' OR ['message'] LIKE '%Groq%' OR ['message'] LIKE '%Mistral%') AND ['level'] = 'error'`;
        const errorResult = await this.query(errorQuery, startTime, endTime);
        const failureCount = errorResult.matches.length;

        const rate = totalCount > 0 ? (failureCount / totalCount) * 100 : 0;

        return { failureCount, totalCount, rate };
    }
}

// Singleton instance
let axiomClientInstance: AxiomClient | null = null;

export function getAxiomClient(): AxiomClient {
    if (!axiomClientInstance) {
        axiomClientInstance = new AxiomClient();
    }
    return axiomClientInstance;
}
