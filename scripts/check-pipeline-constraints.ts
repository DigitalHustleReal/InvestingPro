import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkConstraints() {
    // 1. Check the actual constraint
    const { data: constraints, error: cError } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT conname, pg_get_constraintdef(oid) as definition FROM pg_constraint WHERE conrelid = 'public.pipeline_runs'::regclass"
    });
    
    if (cError) {
        console.error('Error:', cError);
        return;
    }
    
    console.log('--- PIPELINE_RUNS CONSTRAINTS ---');
    for (const c of constraints as any[]) {
        console.log(`${c.conname}: ${c.definition}`);
    }

    // 2. Show current statuses in the table
    const { data: statuses } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT status, count(*) as cnt FROM pipeline_runs GROUP BY status"
    });
    console.log('\n--- STATUS DISTRIBUTION ---');
    console.log(JSON.stringify(statuses, null, 2));

    // 3. Show failed runs
    const { data: failedRuns } = await supabase
        .from('pipeline_runs')
        .select('id, pipeline_type, status, error_message, triggered_at')
        .eq('status', 'failed')
        .order('triggered_at', { ascending: false })
        .limit(5);
    
    console.log('\n--- FAILED RUNS ---');
    if (failedRuns && failedRuns.length > 0) {
        for (const r of failedRuns) {
            console.log(`${r.id} | ${r.pipeline_type} | ${r.error_message?.substring(0, 80)}`);
        }
    } else {
        console.log('No failed runs.');
    }
}

checkConstraints();
