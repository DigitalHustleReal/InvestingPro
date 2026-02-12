import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRevenueTables() {
    console.log('--- REVENUE TABLES DIAGNOSTIC ---');

    // 1. Check affiliate_clicks
    const { count: clicksCount, error: clicksError } = await supabase
        .from('affiliate_clicks')
        .select('*', { count: 'exact', head: true });
    
    if (clicksError) console.error('Error fetching affiliate_clicks:', clicksError);
    else console.log(`affiliate_clicks count: ${clicksCount}`);

    // 2. Check daily_budgets
    const { data: budgets, error: budgetError } = await supabase
        .from('daily_budgets')
        .select('*')
        .limit(5);

    if (budgetError) console.error('Error fetching daily_budgets:', budgetError);
    else {
        console.log(`daily_budgets count: ${budgets?.length}`);
        if (budgets && budgets.length > 0) console.log('Sample budget:', budgets[0]);
    }

    // 3. Check agent_executions (for HealthMonitor timeout)
    const { count: execCount, error: execError } = await supabase
        .from('agent_executions')
        .select('*', { count: 'exact', head: true });

    if (execError) console.error('Error fetching agent_executions:', execError);
    else console.log(`agent_executions count: ${execCount}`);

    // 4. Check scraper_runs (for Scrapers timeout)
    const { count: runsCount, error: runsError } = await supabase
        .from('pipeline_runs') // Assuming scrapers use pipeline_runs based on earlier findings
        .select('*', { count: 'exact', head: true });

    if (runsError) console.error('Error fetching pipeline_runs:', runsError);
    else console.log(`pipeline_runs count: ${runsCount}`);
}

checkRevenueTables();
