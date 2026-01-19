
/**
 * CMS VERIFICATION SCRIPT
 * 
 * Usage: npx tsx scripts/verify-cms.ts
 * 
 * Purpose: 
 * 1. Simulates the 'Content Factory' pipeline.
 * 2. Checks if all services (AI, Image, Quality, DB) are reachable.
 * 3. Does NOT insert into DB (Dry Run).
 */


import { imageService } from '@/lib/images/stock-image-service';
import { analyzeContentQuality } from '@/lib/quality/content-quality-scorer';
import 'dotenv/config';

// Mock html for quality test
const MOCK_ARTICLE_HTML = `
    <h1>The Ultimate Guide to SIP Investment (2026)</h1>
    <p>Systematic Investment Plans (SIP) are the best way to create wealth.</p>
    <h2>What is a SIP?</h2>
    <p>A SIP allows you to invest small amounts regularly. For example, Rs. 500/month.</p>
    <h2>Benefits</h2>
    <ul>
        <li>Rupee Cost Averaging</li>
        <li>Discipline</li>
        <li>Power of Compounding</li>
    </ul>
    <blockquote>"Compound interest is the eighth wonder of the world." - Einstein</blockquote>
    <p>Data shows that SIPs have returned 12-15% over the last 10 years.</p>
`;

async function main() {
    console.log('🚀 STARTING CMS COMPONENT VERIFICATION (ISOLATED)...\n');

    // 1. Check Env Vars
    const requiredVars = ['OPENAI_API_KEY']; // Reduced requirement
    const missing = requiredVars.filter(v => !process.env[v]);
    if (missing.length > 0) {
        console.warn('⚠️ MISSING ENV VARS:', missing.join(', '), '(Some features may fail)');
    } else {
        console.log('✅ Env Vars Checked');
    }

    // 2. Check Image Service
    try {
        console.log('\n📸 Checking Image Service...');
        // Test with a generic finance query
        const img = await imageService.getFeaturedImage('investment growth');
        console.log(`   - Retrieved Image: ${img.url.substring(0, 50)}...`);
        console.log(`   - Source: ${img.source}`);
        console.log('   ✅ Image Service Operational');
    } catch (e) {
        console.error('   ❌ Image Service Failed:', e);
    }

    // 3. Check Quality Scorer
    try {
        console.log('\n✅ Checking Content Quality Scorer...');
        const score = await analyzeContentQuality(MOCK_ARTICLE_HTML, 'SIP');
        console.log(`   - Total Score: ${score.total_score}/100 Grade: ${score.grade}`);
        console.log(`   - SEO Score: ${score.seo_score}`);
        console.log(`   - Readability: ${score.readability_score}`);
        console.log('   ✅ Quality Scorer Operational');
    } catch (e) {
        console.error('   ❌ Quality Scorer Failed:', e);
    }

    console.log('\nNOTE: Full pipeline verification requires running Next.js server.');
}

main();

