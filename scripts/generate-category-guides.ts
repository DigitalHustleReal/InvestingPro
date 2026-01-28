
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import type { ResearchBrief } from '@/lib/research/serp-analyzer';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Configuration
const DRY_RUN = process.env.DRY_RUN === 'true';

async function main() {
    // Dynamic imports to ensure env vars are loaded first
    const { NAVIGATION_CATEGORIES } = await import('@/lib/navigation/categories');
    const { generateArticleCore } = await import('@/lib/automation/article-generator');


    async function generateArticle(topic: string, categorySlug: string, type: any, subSlug: string | undefined, brief: ResearchBrief) {
        if (DRY_RUN) {
            console.log(`     [DRY RUN] Would generate: "${topic}" (Cat: ${categorySlug}, Sub: ${subSlug})`);
            return;
        }

        // Call the core generator
        // Note: generateArticleCore handles its own DB inserts and logging
        // We pass our logging function to prefix output
        await generateArticleCore(
            topic,
            (msg) => console.log(`     ${msg}`),
            { dryRun: false } // We already handled script-level DRY_RUN
        );
    }

    console.log('🚀 Starting Category Guide Generation...');
    if (DRY_RUN) console.log('🛑 DRY RUN MODE ENABLED - No DB writes, no API calls (simulated)');

    const failed: string[] = [];
    const success: string[] = [];
    let processed = 0;

    // Filter categories if needed (e.g., via CLI args), for now do all
    const categoriesToProcess = NAVIGATION_CATEGORIES;

    for (const category of categoriesToProcess) {
        // 1. Generate Main Category Guide
        const categoryTopic = `The Ultimate Evergreen Guide to ${category.name}`;
        
        console.log(`\n📂 Processing Category: ${category.name}`);
        console.log(`   📄 Topic: ${categoryTopic}`);

        try {
            // Create a custom brief to enforce Evergreen content
            const evergreenBrief: ResearchBrief = {
                keywords: [...category.keywords, 'guide', 'basics', 'fundamental'],
                recommended_word_count: 2500, // High quality, deep guide
                content_gaps: [
                    'Timeless fundamental principles',
                    'Strategic decision making advice',
                    'Long-term perspective avoiding dated trends'
                ],
                key_statistics: [], // Let AI find relevant stats or skip specific dated ones
                unique_angle: 'A timeless, fundamental guide that remains relevant for years. Focus on core principles over temporary trends.',
                avg_word_count: 2000,
                competitor_urls: [],
                top_results: []
            };

            await generateArticle(categoryTopic, category.slug, 'ultimate', undefined, evergreenBrief);
            success.push(categoryTopic);
        } catch (error: any) {
            console.error(`❌ Failed Category Guide: ${category.name}`, error.message);
            failed.push(categoryTopic);
        }
        processed++;

        // 2. Generate Subcategory Guides
        const subcategories = category.subcategories;
        for (const sub of subcategories) {
            const subTopic = `The Complete Guide to ${sub.name}: Everything You Need to Know`;
            console.log(`   👉 Subcategory: ${sub.name}`);
            console.log(`      📄 Topic: ${subTopic}`);

            try {
                 const evergreenSubBrief: ResearchBrief = {
                    keywords: [...sub.keywords, 'guide', 'strategies', 'how to'],
                    recommended_word_count: 2000,
                    content_gaps: [
                        'Detailed step-by-step processes',
                        'Pros and cons analysis',
                        'Selection criteria'
                    ],
                    key_statistics: [],
                    unique_angle: 'Comprehensive operational guide focusing on clarity and utility.',
                    avg_word_count: 1500,
                    competitor_urls: [],
                    top_results: []
                };

                await generateArticle(subTopic, category.slug, 'ultimate', sub.slug, evergreenSubBrief);
                success.push(subTopic);
            } catch (error: any) {
                console.error(`❌ Failed Subcategory Guide: ${sub.name}`, error.message);
                failed.push(subTopic);
            }
            processed++;
            
            // Wait between subcategories to be polite
            if (!DRY_RUN) await new Promise(r => setTimeout(r, 5000)); 
        }

        // Wait between categories
        if (!DRY_RUN) await new Promise(r => setTimeout(r, 10000));
    }

    console.log(`\n🎉 Processed ${processed} items.`);
    console.log(`✅ Success: ${success.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    if (failed.length > 0) {
        console.log('Failed Items:', failed);
    }
}

main().catch(err => console.error("Fatal Error:", err));
