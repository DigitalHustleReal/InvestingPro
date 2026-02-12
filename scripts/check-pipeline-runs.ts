import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkPipelineRuns() {
    console.log('--- PIPELINE RUNS STATUS ---');
    
    // Get recent runs, ordered by most recent first
    const { data, error } = await supabase
        .from('pipeline_runs')
        .select('id, pipeline_type, status, triggered_at, started_at, completed_at, error_message, params')
        .order('triggered_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching pipeline_runs:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No pipeline runs found in the table.');
        return;
    }

    console.log(`Found ${data.length} recent runs:\n`);
    
    for (const run of data) {
        console.log(`ID: ${run.id}`);
        console.log(`  Type:    ${run.pipeline_type}`);
        console.log(`  Status:  ${run.status}`);
        console.log(`  Trigger: ${run.triggered_at}`);
        if (run.started_at) console.log(`  Started: ${run.started_at}`);
        if (run.completed_at) console.log(`  Done:    ${run.completed_at}`);
        if (run.error_message) console.log(`  ERROR:   ${run.error_message}`);
        if (run.params) console.log(`  Params:  ${JSON.stringify(run.params).substring(0, 100)}`);
        console.log('');
    }
}

checkPipelineRuns();
