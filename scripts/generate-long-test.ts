/**
 * Generate Long-Form Test Article (3000 Words) - ROBUST VERSION
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';


// Static import removed to allow dotenv to load first
// import { generateArticleContent } from '../lib/workers/articleGenerator';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateLongFormArticle() {
    console.log('🚀 Starting Long-Form Article Generation (3000 words)...\n');
    console.log('Topic: "Comprehensive Guide to Choosing the Best Mutual Funds in 2026"');
    console.log('Status: Generating... (this may take 1-2 minutes)\n');
    
    // Get valid author ID (Strictly from authors table)
    let authorId;
    
    // 1. Try to find existing System AI author
    const { data: existingAuthor } = await supabase
        .from('authors')
        .select('id')
        .eq('slug', 'system-ai')
        .single();
        
    if (existingAuthor) {
        authorId = existingAuthor.id;
    } else {
        // 2. Create system author if not found
         const { data: newAuthor, error: createError } = await supabase.from('authors').insert({
            name: 'System AI',
            slug: 'system-ai',
            email: 'ai@investingpro.in',
            avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai',
            bio: 'AI Content Generator'
         }).select().single();
         
         if (createError) {
             console.warn('Failed to create system author:', createError.message);
             // 3. Fallback to ANY author
             const { data: anyAuthor } = await supabase.from('authors').select('id').limit(1).single();
             authorId = anyAuthor?.id;
         } else {
             authorId = newAuthor?.id;
         }
    }

    // 4. If absolutely everything failed
    if (!authorId) {
        console.error('❌ CRITICAL: Could not find or create any Author in "authors" table.');
        console.error('   Foreign Key violation is inevitable.');
        process.exit(1); 
    }
    
    // If still no author, fail gracefully (or try random UUID if you want to test constraint)
    if (!authorId) {
        console.warn('⚠️ No valid Author ID found. Save might fail.');
        authorId = '00000000-0000-0000-0000-000000000000';
    }

    try {
        // Dynamic import to ensure env vars are loaded
        const { generateArticleContent } = await import('../lib/workers/articleGenerator');
        
        const result = await generateArticleContent({
            topic: 'Comprehensive Guide to Choosing the Best Mutual Funds in 2026',
            category: 'mutual-funds',
            targetKeywords: ['best mutual funds 2026', 'mutual fund selection', 'SIP investment', 'equity funds', 'debt funds'],
            targetAudience: 'intermediate investors',
            contentLength: 'comprehensive',
            // wordCount: 3000, // Commented out to test Dynamic SERP-based sizing
            prompt: `
            Generate a massive, ultimate guide (3000+ words) on "How to Choose the Best Mutual Funds in 2026".
            
            Structure:
            1. Detailed Introduction (Current market landscape)
            2. Understanding Mutual Fund Categories (Equity, Debt, Hybrid, Solution-oriented)
            3. Key Parameters to Analyze (Alpha, Beta, Sharpe Ratio, Expense Ratio, Exit Load)
            4. Step-by-Step Selection Process (Goal alignment, Risk profiling)
            5. Top Mutual Fund Categories for 2026 (Sectoral outlook)
            6. Direct vs Regular Plans (Detailed comparison with tables)
            7. Taxation of Mutual Funds (New vs Old rules)
            8. Common Mistakes to Avoid
            9. Expert Tips for Portfolio Balancing
            10. Conclusion and FAQ
            
            Requirements:
            - Deep detailed paragraphs (no shallow lists)
            - Multiple comparison tables
            - Calculation examples (SIP returns)
            - Strict financial accuracy
            - Professional tone
            `
        });
        
        console.log('✅ Generation Complete!\n');
        console.log('📄 Article Details:');
        console.log(`   Title: ${result.title}`);
        console.log(`   Word Count: ${result.word_count} (Target: 3000)`);
        console.log(`   Keywords: ${result.keywords.length} (with LSI)`);
        console.log(`   Featured Image: ${result.featured_image ? 'Generated ✅' : 'Skipped ❌'}`);
        
        console.log('\n📊 Quality Metrics:');
        if (result.quality_score !== undefined) {
             console.log(`   Quality Score: ${result.quality_score}/100`);
             if (result.quality_metrics) {
                 console.log(`   Depth: ${result.quality_metrics.depth}`);
                 console.log(`   Readability: ${result.quality_metrics.readability}`);
             }
        }
        
        if (result.fact_check_result) {
            console.log(`   Fact Check: ${result.fact_check_result.passed ? '✅ Passed' : '❌ Issues Found'}`);
        }
        
        // --- 1. Save to File Backup ---
        const backupFile = 'article-output.md';
        const fileContent = `
# ${result.title}
*Quality Score: ${result.quality_score}/100*
*Keywords: ${result.keywords.join(', ')}*

![Featured Image](${result.featured_image || ''})

${result.body_markdown}
        `;
        fs.writeFileSync(backupFile, fileContent);
        console.log(`\n💾 Saved markdown backup to: ${backupFile}`);

        // --- 2. Save to Database ---
        console.log('\n💾 Saving to database...');
        
        // Try Full Insert
        try {
            const { data, error } = await supabase
                .from('articles')
                .insert({
                    title: result.title,
                    slug: result.slug,
                    content: result.body_html,
                    excerpt: result.excerpt,
                    meta_title: result.seo_title,
                    meta_description: result.meta_description,
                    keywords: result.keywords,
                    category: result.category,
                    featured_image: result.featured_image,
                    status: 'draft',
                    author_id: authorId,
                    published_at: new Date().toISOString(),
                    // Quality columns
                    quality_score: result.quality_score,
                    quality_metrics: result.quality_metrics,
                    readability_metrics: result.readability_metrics,
                    fact_check_result: result.fact_check_result
                })
                .select()
                .single();

            if (error) throw error;
            console.log(`✅ Saved article ID: ${data.id}`);
            console.log(`🔗 Link: http://localhost:3000/articles/${data.slug}`);

        } catch (dbError: any) {
            console.warn(`⚠️ Full save failed (${dbError.message}). Retrying with minimal schema...`);
            
            // Fallback: Store quality data in 'ai_metadata'
            const { data, error } = await supabase
                .from('articles')
                .insert({
                    title: result.title,
                    slug: result.slug,
                    content: result.body_html,
                    excerpt: result.excerpt,
                    meta_title: result.seo_title,
                    meta_description: result.meta_description,
                    keywords: result.keywords,
                    category: result.category,
                    featured_image: result.featured_image,
                    status: 'draft',
                    author_id: authorId,
                    published_at: new Date().toISOString(),
                    // Store quality data in ai_metadata
                    ai_metadata: {
                        ...result.ai_metadata,
                        quality_score: result.quality_score,
                        quality_metrics: result.quality_metrics,
                        readability_metrics: result.readability_metrics,
                        fact_check_result: result.fact_check_result,
                        fallback_save: true
                    }
                })
                .select()
                .single();
                
            if (error) {
                console.error('❌ Minimal save also failed:', error.message);
            } else {
                console.log(`✅ Saved (Minimal Schema) article ID: ${data.id}`);
                console.log(`🔗 Link: http://localhost:3000/articles/${data.slug}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Generation failed:', error);
    }
}

generateLongFormArticle();
