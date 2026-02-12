import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

async function auditContent() {
    console.log('📚 InvestingPro Content Audit starting...\n');

    try {
        // 1. Overall Volume
        const { count: articleCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
        const { count: glossaryCount } = await supabase.from('glossary').select('*', { count: 'exact', head: true });
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

        console.log('📈 VOLUME STATS:');
        console.log(`- Articles: ${articleCount}`);
        console.log(`- Glossary Terms: ${glossaryCount}`);
        console.log(`- Products: ${productCount}`);

        // 2. Status Distribution
        const { data: statusStats } = await supabase.from('articles').select('status');
        const statusCounts = statusStats?.reduce((acc: any, i: any) => {
            acc[i.status] = (acc[i.status] || 0) + 1;
            return acc;
        }, {});
        console.log('\n📊 STATUS DISTRIBUTION:', statusCounts);

        // 3. Quality Score Analysis
        const { data: qualityData } = await supabase
            .from('articles')
            .select('quality_score, title, content')
            .order('updated_at', { ascending: false });

        if (qualityData && qualityData.length > 0) {
            const scores = qualityData.map(d => d.quality_score).filter(s => s !== null);
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            
            console.log('\n🌟 QUALITY SCORE ANALYSIS:');
            console.log(`- Average Score: ${avgScore.toFixed(2)} / 100`);
            
            const bins = {
                '90+ (Excellent)': 0,
                '70-89 (Good)': 0,
                '40-69 (Needs Work)': 0,
                '<40 (Critical/Failover)': 0
            };

            qualityData.forEach(d => {
                const s = d.quality_score;
                if (s >= 90) bins['90+ (Excellent)']++;
                else if (s >= 70) bins['70-89 (Good)']++;
                else if (s >= 40) bins['40-69 (Needs Work)']++;
                else bins['<40 (Critical/Failover)']++;
            });

            console.log('\n📊 QUALITY BINS:');
            Object.entries(bins).forEach(([bin, count]) => {
                console.log(`  - ${bin}: ${count}`);
            });
        }

        // 4. Failover Detection
        const failoverMarker = "Failover Mode";
        const { count: failoverCount } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .ilike('content', `%${failoverMarker}%`);

        console.log(`\n🚨 CRITICAL FAILURES:`);
        console.log(`- Articles containing "Failover Mode" marker: ${failoverCount}`);

        // 5. Sample Recent Content...
        const { data: samples } = await supabase
            .from('articles')
            .select('title, category, content, quality_score, updated_at')
            .order('updated_at', { ascending: false })
            .limit(3);

        console.log('\n🔍 CONTENT SAMPLES (Recent):');
        samples?.forEach(s => {
            const wordCount = s.content?.split(/\s+/).length || 0;
            console.log(`- Title: "${s.title}"`);
            console.log(`  Category: ${s.category} | Words: ${wordCount} | Score: ${s.quality_score}`);
            console.log(`  Snippet: ${s.content?.substring(0, 150)}...`);
            console.log('  ---');
        });

    } catch (error: any) {
        console.error('❌ Audit Failed:', error.message);
    }
}

auditContent();
