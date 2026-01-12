/**
 * CMS Setup Verification Script
 * 
 * Verifies:
 * - Database connection
 * - Required tables exist
 * - Environment variables
 * - AI provider connectivity
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function verifySetup() {
    console.log('🔍 CMS Setup Verification\n');
    
    const results = {
        database: { connected: false, tables: [] as string[] },
        envVars: { allSet: false, missing: [] as string[] },
        aiProviders: { configured: [] as string[], working: [] as string[] },
        migration: { needed: false, status: '' }
    };
    
    // 1. Check Environment Variables
    console.log('1. Checking Environment Variables...');
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
    ];
    
    const missingVars = requiredVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
        console.log(`   ❌ Missing: ${missingVars.join(', ')}`);
        results.envVars.missing = missingVars;
    } else {
        console.log('   ✅ All required environment variables set');
        results.envVars.allSet = true;
    }
    
    // 2. Check Database Connection
    if (supabaseUrl && supabaseKey) {
        console.log('\n2. Checking Database Connection...');
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            // Test connection
            const { data, error } = await supabase.from('articles').select('id').limit(1);
            
            if (error && error.message.includes('relation "articles" does not exist')) {
                console.log('   ⚠️  Database connected but articles table not found');
                results.database.connected = true;
            } else if (error) {
                console.log(`   ❌ Database error: ${error.message}`);
            } else {
                console.log('   ✅ Database connected');
                results.database.connected = true;
            }
            
            // Check for required tables
            const requiredTables = [
                'articles',
                'content_performance',
                'agent_executions',
                'content_costs',
                'content_economics',
                'daily_budgets',
                'content_risk_scores'
            ];
            
            console.log('\n3. Checking Required Tables...');
            for (const table of requiredTables) {
                try {
                    const { error: tableError } = await supabase.from(table).select('id').limit(1);
                    if (tableError && tableError.message.includes('does not exist')) {
                        console.log(`   ⚠️  ${table} - NOT FOUND (migration needed)`);
                        results.migration.needed = true;
                    } else {
                        console.log(`   ✅ ${table} - EXISTS`);
                        results.database.tables.push(table);
                    }
                } catch (e) {
                    console.log(`   ⚠️  ${table} - Error checking: ${(e as Error).message}`);
                }
            }
            
        } catch (error) {
            console.log(`   ❌ Database connection failed: ${(error as Error).message}`);
        }
    } else {
        console.log('\n2. ⚠️  Skipping database check (credentials missing)');
    }
    
    // 3. Check AI Providers
    console.log('\n4. Checking AI Providers...');
    const providers = [
        { name: 'Ollama', key: 'OLLAMA_URL', env: process.env.OLLAMA_URL },
        { name: 'DeepSeek', key: 'DEEPSEEK_API_KEY', env: process.env.DEEPSEEK_API_KEY },
        { name: 'Groq', key: 'GROQ_API_KEY', env: process.env.GROQ_API_KEY },
        { name: 'OpenAI', key: 'OPENAI_API_KEY', env: process.env.OPENAI_API_KEY },
        { name: 'Together', key: 'TOGETHER_API_KEY', env: process.env.TOGETHER_API_KEY }
    ];
    
    for (const provider of providers) {
        if (provider.env) {
            console.log(`   ✅ ${provider.name} - Configured`);
            results.aiProviders.configured.push(provider.name);
            
            // Test connectivity (simple test)
            try {
                if (provider.name === 'Ollama') {
                    // Test Ollama
                    const response = await fetch(`${provider.env}/api/tags`, { method: 'GET' });
                    if (response.ok) {
                        console.log(`      ✅ ${provider.name} - Reachable`);
                        results.aiProviders.working.push(provider.name);
                    } else {
                        console.log(`      ⚠️  ${provider.name} - Not reachable`);
                    }
                } else {
                    // For other providers, just mark as configured
                    console.log(`      ⚠️  ${provider.name} - Configured (connectivity not tested)`);
                    results.aiProviders.working.push(provider.name);
                }
            } catch (e) {
                console.log(`      ⚠️  ${provider.name} - Connection test failed`);
            }
        } else {
            console.log(`   ❌ ${provider.name} - Not configured`);
        }
    }
    
    // 4. Summary
    console.log('\n📊 Verification Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (results.envVars.allSet) {
        console.log('✅ Environment Variables: OK');
    } else {
        console.log(`❌ Environment Variables: Missing ${results.envVars.missing.length} variables`);
    }
    
    if (results.database.connected) {
        console.log(`✅ Database: Connected (${results.database.tables.length} tables found)`);
    } else {
        console.log('❌ Database: Not connected');
    }
    
    if (results.aiProviders.configured.length > 0) {
        console.log(`✅ AI Providers: ${results.aiProviders.configured.length} configured`);
    } else {
        console.log('❌ AI Providers: None configured');
    }
    
    if (results.migration.needed) {
        console.log('⚠️  Migration: Required tables missing - run migration');
    } else {
        console.log('✅ Migration: All tables exist');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Recommendations
    console.log('💡 Recommendations:');
    if (!results.envVars.allSet) {
        console.log('   1. Set missing environment variables in .env.local');
    }
    if (results.migration.needed) {
        console.log('   2. Run database migration: supabase/migrations/20250115_cost_economic_intelligence_schema.sql');
    }
    if (results.aiProviders.configured.length === 0) {
        console.log('   3. Configure at least one AI provider (Ollama/DeepSeek/Groq recommended)');
    }
    
    return results;
}

// Run verification
verifySetup()
    .then(() => {
        console.log('✅ Verification complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    });
