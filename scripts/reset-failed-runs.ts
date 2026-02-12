import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function resetFailedRuns() {
    console.log('--- RESETTING FAILED PIPELINE RUNS ---');

    // 1. Show current failed runs
    const { data: failedRuns, error: fetchError } = await supabase
        .from('pipeline_runs')
        .select('id, pipeline_type, status, error_message, triggered_at')
        .eq('status', 'failed')
        .order('triggered_at', { ascending: false });

    if (fetchError) {
        console.error('Error fetching failed runs:', fetchError);
        return;
    }

    if (!failedRuns || failedRuns.length === 0) {
        console.log('No failed runs found.');
        return;
    }

    console.log(`Found ${failedRuns.length} failed runs:\n`);
    for (const run of failedRuns) {
        console.log(`  ${run.id} | ${run.pipeline_type} | ${run.error_message?.substring(0, 80)}`);
    }

    // 2. Reset all failed runs to 'pending'
    const { data: updated, error: updateError } = await supabase
        .from('pipeline_runs')
        .update({
            status: 'pending',
            error_message: null,
            started_at: null,
            completed_at: null
        })
        .eq('status', 'failed')
        .select('id');

    if (updateError) {
        console.error('Error resetting runs:', updateError);
        return;
    }

    console.log(`\n✅ Reset ${updated?.length || 0} failed runs to 'pending'.`);
    console.log('They will be picked up on the next worker invocation.');
}

resetFailedRuns();
