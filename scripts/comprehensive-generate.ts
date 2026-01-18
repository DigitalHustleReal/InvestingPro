import * as path from 'path';
import * as fs from 'fs';

/**
 * COMPREHENSIVE END-TO-END CONTENT AUTOMATION
 * 
 * This script uses the FULL article-generator.ts pipeline with all 10 steps:
 * 0. Duplicate Detection
 * 1. SERP Research
 * 2. AI Generation (Dynamic Prompts)
 * 3. Metadata Extraction
 * 4. Classification
 * 5. Image Generation
 * 6. Quality Verification
 * 7. Plagiarism Check
 * 8. SEO & Schema
 * 9. Database Publishing
 * 10. Workflow Triggers
 * 
 * Usage: npx tsx scripts/comprehensive-generate.ts "Article Topic"
 */

// Load environment variables
function loadEnvFile() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                const value = valueParts.join('=').trim();
                if (key && value) {
                    process.env[key] = value;
                }
            }
        }
    }
}

async function comprehensiveGenerate(topic: string) {
    console.log('🚀 COMPREHENSIVE END-TO-END CONTENT AUTOMATION\n');
    console.log(`📌 Topic: "${topic}"\n`);
    console.log('═'.repeat(70));
    console.log('This uses the FULL 10-step pipeline:');
    console.log('  0️⃣  Duplicate Detection');
    console.log('  1️⃣  SERP Research & Competitor Analysis');
    console.log('  2️⃣  AI Generation (Dynamic Prompts)');
    console.log('  3️⃣  Metadata Extraction');
    console.log('  4️⃣  Classification (Category, Tags)');
    console.log('  5️⃣  Image Generation (Stock + AI)');
    console.log('  6️⃣  Quality Verification (Auto-retry)');
    console.log('  7️⃣  Plagiarism Check (Auto-retry)');
    console.log('  8️⃣  SEO & Schema Markup');
    console.log('  9️⃣  Database Publishing');
    console.log('  🔟 Workflow Triggers');
    console.log('═'.repeat(70));
    console.log('');

    // Load environment
    loadEnvFile();

    try {
        // Import the comprehensive generator
        const { generateArticleCore } = await import('../lib/automation/article-generator.js');
        
        // Run the full pipeline
        const result = await generateArticleCore(topic, (msg: string) => {
            console.log(msg);
        });

        if (result.success && result.article) {
            console.log('\n' + '═'.repeat(70));
            console.log('🎉 ARTICLE PUBLISHED SUCCESSFULLY!');
            console.log('═'.repeat(70));
            
            console.log('\n📊 Article Details:');
            console.log(`   ID: ${result.article.id || 'N/A'}`);
            console.log(`   Title: ${result.article.title}`);
            console.log(`   Slug: ${result.article.slug}`);
            console.log(`   Category: ${result.article.category}`);
            console.log(`   Status: ${result.article.status}`);
            console.log(`   Read Time: ${result.article.read_time} min`);
            
            console.log('\n📈 Quality Metrics:');
            console.log(`   Quality Score: ${result.article.quality_score}/100`);
            console.log(`   Uniqueness: ${result.article.uniqueness_score}%`);
            console.log(`   SEO Score: ${result.article.seo_score}/100`);
            console.log(`   Readability: ${result.article.readability_score}`);
            console.log(`   Verified Quality: ${result.article.is_verified_quality ? '✅ Yes' : '❌ No'}`);
            console.log(`   Plagiarism Checked: ${result.article.is_plagiarism_checked ? '✅ Yes' : '❌ No'}`);
            
            if (result.article.difficulty_score) {
                console.log(`   Keyword Difficulty: ${result.article.difficulty_score}/100`);
            }
            
            console.log('\n🖼️  Featured Image:');
            console.log(`   URL: ${result.article.featured_image || 'N/A'}`);
            console.log(`   Alt Text: ${result.article.image_alt_text || 'N/A'}`);
            
            console.log('\n🔗 View Your Article:');
            if (result.url) {
                console.log(`   ${result.url}`);
            } else {
                console.log(`   http://localhost:3000/articles/${result.article.slug}`);
            }
            
            console.log('\n⏱️  Generation Time:');
            console.log(`   ${result.duration || 'N/A'}`);
            
            console.log('\n✨ Your Article Includes:');
            console.log('   ✅ SERP-researched content (beats competitors)');
            console.log('   ✅ Quality-verified (auto-retried if needed)');
            console.log('   ✅ Plagiarism-checked (auto-retried if needed)');
            console.log('   ✅ SEO-optimized with schema markup');
            console.log('   ✅ Professional featured image');
            console.log('   ✅ Auto-classified (category, tags)');
            console.log('   ✅ Workflow triggers activated');
            
            console.log('\n🎯 Next Steps:');
            console.log('   1. View the article in your browser');
            console.log('   2. Review quality metrics in admin panel');
            console.log('   3. Generate more articles:');
            console.log('      npx tsx scripts/comprehensive-generate.ts "Your Topic"');
            
        } else {
            console.error('\n❌ Generation failed:', result.error || 'Unknown error');
            process.exit(1);
        }

    } catch (error: any) {
        console.error('\n💥 Error:', error.message);
        
        if (error.stack) {
            console.log('\n🔍 Stack trace:');
            console.log(error.stack.split('\n').slice(0, 10).join('\n'));
        }
        
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Check your API keys in .env.local');
        console.log('   2. Verify Supabase connection');
        console.log('   3. Check database schema has all required columns');
        console.log('   4. Review error message above');
        
        process.exit(1);
    }
}

// Get topic from command line
const topic = process.argv[2];

if (!topic) {
    console.log('🚀 COMPREHENSIVE END-TO-END CONTENT AUTOMATION\n');
    console.log('Usage:');
    console.log('  npx tsx scripts/comprehensive-generate.ts "Your Article Topic"\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/comprehensive-generate.ts "Best Credit Cards for Travel 2026"');
    console.log('  npx tsx scripts/comprehensive-generate.ts "Tax Saving Investment Options"');
    console.log('  npx tsx scripts/comprehensive-generate.ts "Complete Guide to Index Funds"\n');
    console.log('Features (Full 10-Step Pipeline):');
    console.log('  ✅ Duplicate detection (prevents wasted API calls)');
    console.log('  ✅ SERP research (beats competitors)');
    console.log('  ✅ AI generation with dynamic prompts');
    console.log('  ✅ Quality verification (auto-retry if fails)');
    console.log('  ✅ Plagiarism check (auto-retry if fails)');
    console.log('  ✅ SEO optimization with schema markup');
    console.log('  ✅ Image generation (stock + AI fallback)');
    console.log('  ✅ Auto-classification (category, tags)');
    console.log('  ✅ Database publishing with quality metrics');
    console.log('  ✅ Workflow triggers (distribution, indexing)\n');
    console.log('Quality Gates:');
    console.log('  • Quality Score: ≥60/100 (Google-aligned)');
    console.log('  • Plagiarism: ≤30% similarity');
    console.log('  • Auto-retry: Max 3 attempts');
    console.log('  • Status: "published" if passed, "draft" if failed\n');
    process.exit(1);
}

// Run the comprehensive automation
comprehensiveGenerate(topic).catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
