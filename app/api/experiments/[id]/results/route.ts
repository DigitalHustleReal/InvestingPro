import { NextRequest, NextResponse } from 'next/server';
import type { ExperimentResult } from '@/lib/ab-testing/experiment-manager';

/**
 * Experiment Results API
 * 
 * GET /api/experiments/[id]/results - Get experiment results
 */

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const experimentId = params.id;

        // Mock results (replace with database query)
        const results: ExperimentResult[] = [
            {
                experimentId,
                variant: 'control',
                participants: 1250,
                conversions: 125,
                conversionRate: 0.10,
                confidence: 0,
                isWinner: false
            },
            {
                experimentId,
                variant: 'red',
                participants: 1280,
                conversions: 154,
                conversionRate: 0.12,
                confidence: 96.5,
                isWinner: true
            }
        ];

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch results' },
            { status: 500 }
        );
    }
}
