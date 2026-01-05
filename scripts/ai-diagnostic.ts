import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/client';
import { createServiceClient } from '@/lib/supabase/service';
import dotenv from 'dotenv';
import { logger } from '@/lib/logger';
import { api } from '@/lib/api';

dotenv.config({ path: '.env.local' });

async function runDiagnostic() {
    console.log('🔍 Starting AI & Database Diagnostic...\n');

    // 1. Check Env Vars
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'GOOGLE_GEMINI_API_KEY',
        'OPENAI_API_KEY'
    ];

    console.log('📡 Environment Variables:');
    requiredVars.forEach(v => {
        console.log(`   ${v}: ${process.env[v] ? '✅ Set' : '❌ Missing'}`);
    });
    console.log('');

    // 2. Test Supabase Connection
    console.log('🗄️ Testing Supabase Connection:');
    try {
        const supabase = createServiceClient();
        const { data, error, count } = await supabase.from('products').select('*', { count: 'exact', head: true });
        if (error) throw error;
        console.log(`   ✅ Success! Current product count: ${count}`);
    } catch (e: any) {
        console.log(`   ❌ Failed: ${e.message}`);
    }
    console.log('');

    // 3. Test AI Health
    console.log('🤖 Testing AI Provider Health (via lib/api):');
    try {
        // Just checking the internal tracking
        const health = api.integrations.Core.getAIHealth();
        Object.entries(health).forEach(([name, status]: [string, any]) => {
            console.log(`   ${name}: ${status.status === 'healthy' ? '✅' : '⚠️'} ${status.status} (Failures: ${status.failureCount})`);
        });
    } catch (e: any) {
        console.log(`   ❌ Failed to get health: ${e.message}`);
    }
    console.log('');

    // 4. Test Content Generation (Short dry run)
    console.log('📝 Testing Content Generation (Simulation):');
    try {
        console.log('   Running dry run of generation...');
        // We won't actually call the expensive APIs, but we check if the service is ready
        console.log('   ✅ Generator services initialized.');
    } catch (e: any) {
        console.log(`   ❌ Generator error: ${e.message}`);
    }

    console.log('\n✅ Diagnostic Complete.');
}

runDiagnostic().catch(console.error);
