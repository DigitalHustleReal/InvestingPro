import { NextRequest, NextResponse } from 'next/server';
import { BudgetGovernorAgent } from '@/lib/agents/budget-governor-agent';
import { logger } from '@/lib/logger';

const budgetAgent = new BudgetGovernorAgent();

/**
 * Budget Management API
 */

export async function GET() {
    try {
        const status = await budgetAgent.getBudgetStatus();
        return NextResponse.json({ success: true, budget: status });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const action = body.action;
        
        if (action === 'set') {
            await budgetAgent.setDailyBudget({
                maxTokensPerDay: body.maxTokensPerDay,
                maxImagesPerDay: body.maxImagesPerDay,
                maxCostPerDay: body.maxCostPerDay
            });
            return NextResponse.json({ success: true, message: 'Budget set' });
        }
        
        if (action === 'pause') {
            await budgetAgent.pauseBudget(body.pause);
            return NextResponse.json({ success: true, message: `Budget ${body.pause ? 'paused' : 'resumed'}` });
        }
        
        if (action === 'check') {
            const status = await budgetAgent.checkBudget(
                body.estimatedTokens,
                body.estimatedImages,
                body.estimatedCost
            );
            return NextResponse.json({ success: true, status });
        }
        
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        
    } catch (error: any) {
        logger.error('Budget API error', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
