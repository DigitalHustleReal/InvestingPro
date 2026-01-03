/**
 * COMPREHENSIVE ARTICLE LIFECYCLE DEBUGGER
 * 
 * Tests every layer of the CMS → Public View pipeline:
 * 1. Database Connection
 * 2. Direct Supabase Query (Anonymous)
 * 3. RPC Function Call
 * 4. ArticleService Layer
 * 5. API Layer
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env from .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('='.repeat(60));
console.log('🔍 COMPREHENSIVE ARTICLE LIFECYCLE DEBUGGER');
console.log('='.repeat(60));
console.log();

async function runDiagnostics() {
    // ============================================
    // LAYER 1: Environment Variables
    // ============================================
    console.log('📋 LAYER 1: Environment Variables');
    console.log('-'.repeat(40));
    console.log(`  SUPABASE_URL: ${supabaseUrl ? '✅ Set (' + supabaseUrl.substring(0, 30) + '...)' : '❌ MISSING'}`);
    console.log(`  ANON_KEY: ${supabaseAnonKey ? '✅ Set (' + supabaseAnonKey.substring(0, 20) + '...)' : '❌ MISSING'}`);
    console.log(`  SERVICE_KEY: ${supabaseServiceKey ? '✅ Set' : '⚠️ Not set (optional)'}`);
    console.log();

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ CRITICAL: Missing environment variables. Cannot proceed.');
        return;
    }

    // ============================================
    // LAYER 2: Anonymous Client - Direct Query
    // ============================================
    console.log('📋 LAYER 2: Anonymous Client - Direct Query');
    console.log('-'.repeat(40));
    
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test 2a: Simple count
    const { count: totalCount, error: countError } = await anonClient
        .from('articles')
        .select('*', { count: 'exact', head: true });
    
    if (countError) {
        console.log(`  ❌ Count Query FAILED: ${countError.message}`);
        console.log(`     Code: ${countError.code}`);
        console.log(`     Details: ${JSON.stringify(countError.details)}`);
    } else {
        console.log(`  📊 Total articles (anon can see): ${totalCount}`);
    }
    
    // Test 2b: Select with status filter
    const { data: publishedData, error: publishedError } = await anonClient
        .from('articles')
        .select('id, title, status, submission_status')
        .eq('status', 'published')
        .limit(5);
    
    if (publishedError) {
        console.log(`  ❌ Published Query FAILED: ${publishedError.message}`);
    } else {
        console.log(`  📊 Published articles (first 5): ${publishedData?.length || 0}`);
        if (publishedData && publishedData.length > 0) {
            publishedData.forEach((a, i) => {
                console.log(`     ${i+1}. "${a.title?.substring(0, 40)}..." | status=${a.status} | submission_status=${a.submission_status}`);
            });
        }
    }
    
    // Test 2c: Select ALL (no filter)
    const { data: allData, error: allError } = await anonClient
        .from('articles')
        .select('id, title, status')
        .limit(5);
    
    if (allError) {
        console.log(`  ❌ All Articles Query FAILED: ${allError.message}`);
    } else {
        console.log(`  📊 All articles (no filter, first 5): ${allData?.length || 0}`);
        if (allData && allData.length > 0) {
            allData.forEach((a, i) => {
                console.log(`     ${i+1}. "${a.title?.substring(0, 40)}..." | status=${a.status}`);
            });
        }
    }
    console.log();

    // ============================================
    // LAYER 3: RPC Function Test
    // ============================================
    console.log('📋 LAYER 3: RPC Function (search_articles)');
    console.log('-'.repeat(40));
    
    const { data: rpcData, error: rpcError } = await anonClient.rpc('search_articles', {
        search_query: '',
        search_limit: 5
    });
    
    if (rpcError) {
        console.log(`  ❌ RPC FAILED: ${rpcError.message}`);
        console.log(`     Code: ${rpcError.code}`);
    } else {
        console.log(`  📊 RPC returned: ${rpcData?.length || 0} articles`);
        if (rpcData && rpcData.length > 0) {
            rpcData.forEach((a: any, i: number) => {
                console.log(`     ${i+1}. "${a.title?.substring(0, 40)}..." | category=${a.category}`);
            });
        }
    }
    console.log();

    // ============================================
    // LAYER 4: Service Role Client (if available)
    // ============================================
    if (supabaseServiceKey) {
        console.log('📋 LAYER 4: Service Role Client (Admin)');
        console.log('-'.repeat(40));
        
        const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
        
        const { data: adminData, error: adminError } = await serviceClient
            .from('articles')
            .select('id, title, status, submission_status')
            .limit(5);
        
        if (adminError) {
            console.log(`  ❌ Admin Query FAILED: ${adminError.message}`);
        } else {
            console.log(`  📊 Admin can see: ${adminData?.length || 0} articles`);
            if (adminData && adminData.length > 0) {
                adminData.forEach((a, i) => {
                    console.log(`     ${i+1}. "${a.title?.substring(0, 40)}..." | status=${a.status} | submission_status=${a.submission_status}`);
                });
            }
        }
        
        // Check total in DB
        const { count: adminCount } = await serviceClient
            .from('articles')
            .select('*', { count: 'exact', head: true });
        console.log(`  📊 Total articles in DB (admin view): ${adminCount}`);
        
        // Check status distribution
        const { data: statusDist } = await serviceClient
            .from('articles')
            .select('status')
            .limit(1000);
        
        if (statusDist) {
            const statusCounts: Record<string, number> = {};
            statusDist.forEach((a: any) => {
                statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
            });
            console.log(`  📊 Status Distribution: ${JSON.stringify(statusCounts)}`);
        }
        
        // Check submission_status distribution
        const { data: subStatusDist } = await serviceClient
            .from('articles')
            .select('submission_status')
            .limit(1000);
        
        if (subStatusDist) {
            const subStatusCounts: Record<string, number> = {};
            subStatusDist.forEach((a: any) => {
                const key = a.submission_status ?? 'NULL';
                subStatusCounts[key] = (subStatusCounts[key] || 0) + 1;
            });
            console.log(`  📊 Submission Status Distribution: ${JSON.stringify(subStatusCounts)}`);
        }
        console.log();
    } else {
        console.log('📋 LAYER 4: Service Role Client');
        console.log('-'.repeat(40));
        console.log('  ⚠️ Skipped (SUPABASE_SERVICE_ROLE_KEY not set)');
        console.log();
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('='.repeat(60));
    console.log('📊 DIAGNOSIS SUMMARY');
    console.log('='.repeat(60));
    
    const anonCanSee = (allData?.length || 0) > 0;
    const rpcWorks = (rpcData?.length || 0) > 0;
    
    if (anonCanSee) {
        console.log('✅ Anonymous users CAN see articles via direct query.');
        console.log('   → The issue is likely in the FRONTEND code.');
    } else if (rpcWorks) {
        console.log('⚠️ Anonymous direct query returns EMPTY, but RPC works.');
        console.log('   → RLS policies are blocking direct SELECT but RPC bypasses them.');
        console.log('   → SOLUTION: Use RPC fallback OR fix RLS policies.');
    } else {
        console.log('❌ Both direct query and RPC return EMPTY for anonymous.');
        console.log('   → RLS policies are completely blocking anonymous access.');
        console.log('   → SOLUTION: Run the policy fix SQL in Supabase.');
    }
    
    console.log();
    console.log('='.repeat(60));
}

runDiagnostics().catch(console.error);
