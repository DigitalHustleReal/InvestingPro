import { createClient } from '@supabase/supabase-js';
import { RevenueService } from '../lib/services/revenue-service';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyRevenue() {
    console.log('--- VERIFYING REVENUE DASHBOARD ---');
    const service = new RevenueService(supabase);
    
    const startTime = Date.now();
    const metrics = await service.getDashboardMetrics();
    const duration = Date.now() - startTime;
    
    console.log(`Call took ${duration}ms`);
    console.log('Metrics:', JSON.stringify(metrics, null, 2).substring(0, 500) + '...');
    
    if (duration > 1000) {
        console.warn('⚠️  WARNING: Call took > 1s, optimization might not be effective?');
    } else {
        console.log('✅ Performance looks good (< 1s)');
    }
}

verifyRevenue();
