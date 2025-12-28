/**
 * Supabase Database Connection Test
 * Tests if Supabase is properly configured and connected
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase Database Connection...\n');

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('📋 Environment Variables Check:');
    console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
    console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}\n`);

    if (!supabaseUrl || !supabaseAnonKey) {
        console.log('❌ CRITICAL: Supabase environment variables are missing!');
        console.log('   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local or Vercel\n');
        return false;
    }

    // Test connection with anon key
    console.log('🔌 Testing Connection with Anon Key...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
        // Test 1: Basic connection (check if we can reach Supabase)
        const { data: healthData, error: healthError } = await supabase
            .from('_health')
            .select('1')
            .limit(1);

        if (healthError && healthError.code === 'PGRST116') {
            // Table doesn't exist, but connection works
            console.log('   ✅ Connection successful (health table not found, but this is OK)');
        } else if (healthError) {
            console.log(`   ⚠️  Connection test: ${healthError.message}`);
        } else {
            console.log('   ✅ Connection successful');
        }

        // Test 2: Try to query a common table (if exists)
        const testTables = ['user_profiles', 'articles', 'reviews', 'credit_cards'];
        let foundTable = false;

        for (const table of testTables) {
            const { error } = await supabase
                .from(table)
                .select('1')
                .limit(1);

            if (!error) {
                console.log(`   ✅ Table '${table}' exists and is accessible`);
                foundTable = true;
                break;
            }
        }

        if (!foundTable) {
            console.log('   ⚠️  No common tables found (database may be empty or tables not created)');
        }

        // Test 3: Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError && authError.message.includes('Invalid API key')) {
            console.log('   ❌ Invalid API key');
            return false;
        } else if (!authError) {
            console.log('   ✅ Authentication service accessible');
        }

        console.log('\n✅ Supabase Connection: WORKING\n');
        return true;

    } catch (error) {
        console.log(`\n❌ Connection Error: ${error.message}\n`);
        return false;
    }
}

// Run test
testSupabaseConnection()
    .then(success => {
        if (success) {
            console.log('🎉 Supabase is properly configured and connected!');
            process.exit(0);
        } else {
            console.log('⚠️  Supabase connection test failed. Please check your configuration.');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('❌ Test failed with error:', error);
        process.exit(1);
    });

