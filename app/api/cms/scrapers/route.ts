import { NextRequest, NextResponse } from 'next/server';
import { ScraperAgent } from '@/lib/agents/scraper-agent';
import { logger } from '@/lib/logger';

const scraperAgent = new ScraperAgent();

/**
 * Scraper Management API
 */

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const scraperId = searchParams.get('scraperId');
        const action = searchParams.get('action') || 'list';
        
        if (action === 'list') {
            const scrapers = await scraperAgent.getAllScrapers();
            return NextResponse.json({ success: true, scrapers });
        }
        
        if (action === 'runs' && scraperId) {
            const runs = await scraperAgent.getScraperRuns(scraperId);
            return NextResponse.json({ success: true, runs });
        }
        
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        
    } catch (error: any) {
        logger.error('Scraper API error', error);
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
        
        if (action === 'register') {
            const scraperId = await scraperAgent.registerScraper(body.config);
            return NextResponse.json({ success: true, scraperId });
        }
        
        if (action === 'execute') {
            const result = await scraperAgent.executeScraper(body.scraperId, body.options);
            return NextResponse.json({ success: true, result });
        }
        
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        
    } catch (error: any) {
        logger.error('Scraper API error', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
