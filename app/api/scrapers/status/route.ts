import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not found');
  }
  
  return createClient(url, key);
}

// Define all available scrapers
const SCRAPERS = [
  {
    id: 'credit-cards',
    name: 'Credit Cards Scraper',
    description: 'Scrapes credit card data from HDFC, SBI, ICICI, Axis',
    sources: ['HDFC', 'SBI', 'ICICI', 'Axis', 'BankBazaar'],
    scriptPath: 'scripts/scrapers/credit-card-scraper.ts'
  },
  {
    id: 'mutual-funds',
    name: 'Mutual Funds Scraper',
    description: 'Scrapes mutual fund data from AMFI',
    sources: ['AMFI'],
    scriptPath: 'scripts/scrapers/mutual-fund-scraper.ts'
  },
  {
    id: 'loans',
    name: 'Loan Products Scraper',
    description: 'Scrapes personal, home, car, education loans',
    sources: ['HDFC', 'SBI', 'ICICI', 'Bajaj Finserv'],
    scriptPath: 'scripts/scrapers/loan-scraper.ts'
  },
  {
    id: 'insurance',
    name: 'Insurance Products Scraper',
    description: 'Scrapes life, health, car, home insurance',
    sources: ['LIC', 'HDFC Life', 'Star Health', 'PolicyBazaar'],
    scriptPath: 'scripts/scrapers/insurance-scraper.ts'
  },
  {
    id: 'interest-rates',
    name: 'Interest Rates Scraper',
    description: 'Scrapes FD and savings account rates',
    sources: ['HDFC', 'SBI', 'ICICI', 'Axis', 'RBI'],
    scriptPath: 'scripts/scrapers/interest-rates-scraper.ts'
  },
  {
    id: 'trending-topics',
    name: 'Trending Topics Scraper',
    description: 'Scrapes trending financial topics from news sources',
    sources: ['Economic Times', 'Moneycontrol', 'Google Trends'],
    scriptPath: 'lib/scraper/ghost_scraper.ts'
  },
  {
    id: 'product-data',
    name: 'Product Data Scraper',
    description: 'Scrapes product information and pricing',
    sources: ['Various'],
    scriptPath: 'lib/scraper/product-data-scraper.ts'
  }
];

/**
 * GET /api/scrapers/status
 * Returns the status of all scrapers
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // Get scraper status from database
    const { data: scraperRuns, error } = await supabase
      .from('scraper_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching scraper status:', error);
    }

    // Group by scraper_id to get latest status
    const statusMap = new Map();
    
    if (scraperRuns) {
      for (const run of scraperRuns) {
        if (!statusMap.has(run.scraper_id)) {
          statusMap.set(run.scraper_id, run);
        }
      }
    }

    // Build response with scraper definitions and latest status
    const scrapersWithStatus = SCRAPERS.map(scraper => {
      const latestRun = statusMap.get(scraper.id);
      
      return {
        ...scraper,
        status: latestRun?.status || 'idle',
        lastRun: latestRun?.started_at || null,
        itemsScraped: latestRun?.items_scraped || 0,
        errors: latestRun?.errors || [],
        duration: latestRun?.completed_at && latestRun?.started_at
          ? new Date(latestRun.completed_at).getTime() - new Date(latestRun.started_at).getTime()
          : null
      };
    });

    return NextResponse.json({
      success: true,
      scrapers: scrapersWithStatus,
      totalScrapers: SCRAPERS.length,
      activeScrapers: scrapersWithStatus.filter(s => s.status === 'running').length
    });

  } catch (error) {
    console.error('Error in GET /api/scrapers/status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scraper status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scrapers/trigger
 * Triggers one or all scrapers
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scraperId, triggerAll } = body;

    const supabase = getSupabaseClient();
    
    // Determine which scrapers to trigger
    const scrapersToTrigger = triggerAll 
      ? SCRAPERS 
      : SCRAPERS.filter(s => s.id === scraperId);

    if (scrapersToTrigger.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid scraper ID' },
        { status: 400 }
      );
    }

    const results = [];

    for (const scraper of scrapersToTrigger) {
      try {
        // Log scraper start
        const { data: run, error: insertError } = await supabase
          .from('scraper_runs')
          .insert({
            scraper_id: scraper.id,
            scraper_name: scraper.name,
            status: 'running',
            started_at: new Date().toISOString(),
            items_scraped: 0,
            errors: []
          })
          .select()
          .single();

        if (insertError) {
          console.error(`Error logging scraper start for ${scraper.id}:`, insertError);
          results.push({
            scraperId: scraper.id,
            success: false,
            error: insertError.message
          });
          continue;
        }

        // Trigger the actual scraper (async, don't wait)
        triggerScraperAsync(scraper, run.id, supabase).catch(err => {
          console.error(`Error running scraper ${scraper.id}:`, err);
        });

        results.push({
          scraperId: scraper.id,
          scraperName: scraper.name,
          success: true,
          runId: run.id,
          message: 'Scraper triggered successfully'
        });

      } catch (error) {
        console.error(`Error triggering scraper ${scraper.id}:`, error);
        results.push({
          scraperId: scraper.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Triggered ${results.filter(r => r.success).length} scraper(s)`
    });

  } catch (error) {
    console.error('Error in POST /api/scrapers/trigger:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger scrapers' },
      { status: 500 }
    );
  }
}

/**
 * Trigger scraper asynchronously
 */
async function triggerScraperAsync(scraper: any, runId: string, supabase: any) {
  const startTime = Date.now();
  let itemsScraped = 0;
  const errors: string[] = [];

  try {
    // Import and run the scraper based on ID
    switch (scraper.id) {
      case 'credit-cards':
        const { scrapeAllCreditCards } = await import('@/scripts/scrapers/credit-card-scraper');
        const creditCards = await scrapeAllCreditCards();
        itemsScraped = creditCards.length;
        break;

      case 'mutual-funds':
        const { scrapeAllMutualFunds } = await import('@/scripts/scrapers/mutual-fund-scraper');
        const mutualFunds = await scrapeAllMutualFunds();
        itemsScraped = mutualFunds.length;
        break;

      case 'loans':
        const { scrapeAllLoans } = await import('@/scripts/scrapers/loan-scraper');
        const loans = await scrapeAllLoans();
        itemsScraped = loans.length;
        break;

      case 'insurance':
        const { scrapeAllInsurance } = await import('@/scripts/scrapers/insurance-scraper');
        const insurance = await scrapeAllInsurance();
        itemsScraped = insurance.length;
        break;

      case 'interest-rates':
        const { scrapeAllInterestRates } = await import('@/scripts/scrapers/interest-rates-scraper');
        const rates = await scrapeAllInterestRates();
        itemsScraped = rates.fdRates.length + rates.savingsRates.length;
        break;

      case 'trending-topics':
        const { GhostScraper } = await import('@/lib/scraper/ghost_scraper');
        const topics = await GhostScraper.scanTrends();
        itemsScraped = topics.length;
        break;

      case 'product-data':
        errors.push('Product data scraper not yet implemented');
        break;

      default:
        errors.push(`Unknown scraper: ${scraper.id}`);
    }

    // Update scraper run status
    await supabase
      .from('scraper_runs')
      .update({
        status: errors.length > 0 ? 'failed' : 'completed',
        completed_at: new Date().toISOString(),
        items_scraped: itemsScraped,
        errors,
        duration_ms: Date.now() - startTime
      })
      .eq('id', runId);

  } catch (error) {
    console.error(`Error in scraper ${scraper.id}:`, error);
    
    // Update with error status
    await supabase
      .from('scraper_runs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        items_scraped: itemsScraped,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration_ms: Date.now() - startTime
      })
      .eq('id', runId);
  }
}
