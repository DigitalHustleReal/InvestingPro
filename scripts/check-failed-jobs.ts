import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFailedJobs() {
    console.log('--- CHECKING FAILED JOBS ---');

    const { data: failedJobs, error } = await supabase
        .from('job_status')
        .select('*')
        .eq('status', 'failed')
        .order('updated_at', { ascending: false })
        .limit(10);
    
    if (error) {
        console.error('Error fetching failed jobs:', error.message);
        return;
    }

    if (!failedJobs || failedJobs.length === 0) {
        console.log('No failed jobs found in job_status table.');
    } else {
        console.log(`Found ${failedJobs.length} failed jobs:`);
        failedJobs.forEach(job => {
            console.log(`\nJob ID: ${job.job_id}`);
            console.log(`Type: ${job.job_type}`);
            console.log(`Error: ${job.error}`);
            console.log(`Updated At: ${job.updated_at}`);
            console.log(`Metadata: ${JSON.stringify(job.metadata)}`);
        });
    }

    console.log('\n--- SCAN COMPLETE ---');
}

checkFailedJobs().catch(console.error);
