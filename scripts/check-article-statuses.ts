import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkStatuses() {
    console.log('--- CHECKING ARTICLE STATUSES ---');
    
    const { data, error } = await supabase
        .from('articles')
        .select('status');
        
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    const counts: Record<string, number> = {};
    data.forEach(row => {
        const s = row.status || 'null';
        counts[s] = (counts[s] || 0) + 1;
    });
    
    console.log('Article Status Counts:', counts);
    
    // Check RPC match
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_admin_dashboard_stats');
    if (rpcError) console.error('RPC Error:', rpcError);
    else console.log('RPC Stats:', rpcData);
}

checkStatuses();
