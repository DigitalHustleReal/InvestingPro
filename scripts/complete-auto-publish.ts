import { GoogleGenAI } from "@google/genai";
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import slugify from 'slugify';
import * as fs from 'fs';
import * as path from 'path';

/**
 * COMPLETE AUTO-PUBLISH SYSTEM
 * 
 * One command to:
 * 1. Generate article with AI (with failover)
 * 2. Extract SEO metadata
 * 3. Calculate read time
 * 4. Detect category
 * 5. Validate content
 * 6. Insert into database
 * 7. Return published URL
 * 
 * Usage: npx tsx scripts/complete-auto-publish.ts "Article Topic"
 */

// Load environment
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

loadEnvFile();

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Article prompt
function getArticlePrompt(topic: string): string {
    return `Write a comprehensive, SEO-optimized article about "${topic}" for an Indian financial education platform called InvestingPro.

IMPORTANT: Generate ONLY the article content HTML, without <!DOCTYPE>, <html>, <head>, <body>, or <style> tags.

Requirements:
- Title: Create an engaging, SEO-friendly title (use <h1> tag)
- Length: 1500-2000 words
- Structure: Include H2 and H3 headings
- Content: Introduction, Key Takeaways, Main sections, Pro Tips, Conclusion
- Style: Professional, Indian context (₹ for currency)
- Format: Use <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <table>
- Special divs: <div class="key-takeaways">, <div class="pro-tip">, <div class="warning-box">

Generate ONLY clean HTML content now:`;
}

// AI Generation with failover
async function generateWithAI(topic: string): Promise<string> {
    const providers = [
        { name: 'Gemini', fn: async () => {
            const ai = new GoogleGenAI({});
            process.env.GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: getArticlePrompt(topic),
            });
            return response.text;
        }},
        { name: 'Groq', fn: async () => {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: getArticlePrompt(topic) }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 4000,
            });
            return completion.choices[0]?.message?.content || '';
        }},
        { name: 'Mistral', fn: async () => {
            const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
            const response = await client.chat.complete({
                model: 'mistral-small-latest',
                messages: [{ role: 'user', content: getArticlePrompt(topic) }],
            });
            return response.choices?.[0]?.message?.content || '';
        }},
        { name: 'OpenAI', fn: async () => {
            const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await client.chat.completions.create({
                messages: [{ role: 'user', content: getArticlePrompt(topic) }],
                model: 'gpt-4o-mini',
                temperature: 0.7,
                max_tokens: 4000,
            });
            return completion.choices[0]?.message?.content || '';
        }},
    ];

    for (const provider of providers) {
        try {
            console.log(`🔵 Trying ${provider.name}...`);
            const content = await provider.fn();
            console.log(`✅ SUCCESS with ${provider.name}!`);
            return content;
        } catch (error: any) {
            console.log(`❌ ${provider.name} failed: ${error.message}`);
        }
    }

    throw new Error('All AI providers failed');
}

// Extract SEO metadata
function extractSEOMetadata(html: string) {
    const $ = cheerio.load(html);
    
    const h1 = $('h1').first().text().trim();
    const firstPara = $('p').first().text().trim();
    
    return {
        title: h1 || 'Untitled Article',
        metaTitle: h1.substring(0, 60) || 'Untitled',
        metaDescription: firstPara.substring(0, 160) || 'Financial education article',
        slug: slugify(h1, { lower: true, strict: true }) || 'article',
    };
}

// Calculate read time
function calculateReadTime(html: string): number {
    const $ = cheerio.load(html);
    const text = $.text();
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200); // 200 words per minute
}

// Detect category
// Detect category and tags
function detectClassification(title: string, content: string): { category: string; tags: string[] } {
    const text = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];
    
    // Default to 'investing-basics' (Valid DB Category)
    // Valid DB Categories: 'mutual-funds', 'stocks', 'insurance', 'loans', 'credit-cards', 'tax-planning', 'retirement', 'investing-basics'
    let category = 'investing-basics';

    // Map keywords to Valid DB Categories
    if (text.includes('mutual fund') || text.includes('sip') || text.includes('nav')) {
        category = 'mutual-funds';
        tags.push('investing');
    } else if (text.includes('stock') || text.includes('ipo') || text.includes('share market') || text.includes('equity')) {
        category = 'stocks';
        tags.push('investing');
    } else if (text.includes('credit card') || text.includes('cashback') || text.includes('rewards')) {
        category = 'credit-cards';
        tags.push('banking');
    } else if (text.includes('loan') || text.includes('emi') || text.includes('borrow')) {
        category = 'loans';
        tags.push('banking');
    } else if (text.includes('insurance') || text.includes('policy') || text.includes('term plan')) {
        category = 'insurance';
        tags.push('insurance');
    } else if (text.includes('tax') || text.includes('80c') || text.includes('itr')) {
        category = 'tax-planning';
        tags.push('tax');
    } else if (text.includes('retire') || text.includes('pension') || text.includes('nps') || text.includes('ppf')) {
        category = 'retirement';
        tags.push('retirement');
    }

    // Add general tags
    if (text.includes('guide')) tags.push('guide');
    if (text.includes('2026')) tags.push('2026');
    if (text.includes('money')) tags.push('personal-finance');

    return { category, tags };
}

// Validate content
function validateContent(html: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const $ = cheerio.load(html);
    
    // Check H1
    if ($('h1').length === 0) errors.push('Missing H1 tag');
    if ($('h1').length > 1) errors.push('Multiple H1 tags');
    
    // Check word count
    const words = $.text().split(/\s+/).length;
    if (words < 1000) errors.push(`Too short: ${words} words (minimum 1000)`);
    
    // Check paragraphs
    if ($('p').length < 5) errors.push('Too few paragraphs');
    
    return {
        valid: errors.length === 0,
        errors
    };
}

// Main function
async function completeAutoPublish(topic: string) {
    console.log('🚀 COMPLETE AUTO-PUBLISH SYSTEM\n');
    console.log(`📌 Topic: "${topic}"\n`);
    console.log('─'.repeat(60));

    const startTime = Date.now();

    try {
        // Step 1: Generate article
        console.log('\n1️⃣ Generating article with AI...');
        const html = await generateWithAI(topic);
        console.log(`   ✅ Generated ${html.length} characters`);

        // Step 2: Extract metadata
        console.log('\n2️⃣ Extracting SEO metadata...');
        const metadata = extractSEOMetadata(html);
        console.log(`   ✅ Title: ${metadata.title}`);
        console.log(`   ✅ Slug: ${metadata.slug}`);

        // Step 3: Calculate read time
        console.log('\n3️⃣ Calculating read time...');
        const readTime = calculateReadTime(html);
        console.log(`   ✅ Read time: ${readTime} minutes`);

        // Step 4: Detect classification
        console.log('\n4️⃣ Detecting classification...');
        const { category, tags } = detectClassification(metadata.title, html);
        console.log(`   ✅ Category: ${category}`);
        console.log(`   ✅ Tags: ${tags.join(', ')}`);

        // Step 5: Generate Featured Image (FREE)
        console.log('\n5️⃣ Generating featured image (Pollinations.ai)...');
        // Clean title for prompt: remove special chars, take first 6 words
        const imagePrompt = `professional cinematic photo of ${metadata.title.replace(/[^a-zA-Z0-9 ]/g, '')}, financial context, 8k, highly detailed, realistic`;
        const encodedPrompt = encodeURIComponent(imagePrompt);
        // Add random seed to prevent caching
        const randomSeed = Math.floor(Math.random() * 10000);
        const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1280&height=720&seed=${randomSeed}&model=flux`;
        console.log(`   ✅ Image URL generated`);

        // Step 6: Validate content
        console.log('\n6️⃣ Validating content...');
        const validation = validateContent(html);
        if (!validation.valid) {
            console.log(`   ❌ Validation failed:`);
            validation.errors.forEach(err => console.log(`      - ${err}`));
            throw new Error('Content validation failed');
        }
        console.log(`   ✅ Content validated`);

        // Step 7: Insert into database
        console.log('\n7️⃣ Publishing to database (articles table)...');
        
        // Generate markdown from HTML (simple conversion for now)
        // In a real scenario, we might want to generate Markdown first then HTML, 
        // but since our AI generates HTML directly, we'll store specific fields.
        
        const now = new Date().toISOString();
        const today = now.split('T')[0];

        const { data: article, error } = await supabase
            .from('articles')
            .insert({
                title: metadata.title,
                slug: metadata.slug,
                excerpt: metadata.metaDescription,
                
                // Content fields
                body_html: html,
                body_markdown: html, // Fallback since we generated HTML
                content: html,       // Legacy field
                
                // Metadata
                meta_title: metadata.metaTitle,
                meta_description: metadata.metaDescription, // Supabase column might be meta_description or seo_description - trying both in schema usually implies check DB, but ArticleService uses seo_description. Let's send both or check service.
                // ArticleService maps seo_description to DB field. Let's assume DB has 'seo_description' or 'meta_description'.
                // Looking at ArticleService: normalized uses "seo_description || data.meta_description".
                // Let's use 'seo_description' as primary if possible, but let's look at the insert block in ArticleService line 357. 
                // It uses: seo_description: metadata.seo_description
                // So let's use seo_description.
                seo_title: metadata.metaTitle,
                seo_description: metadata.metaDescription,

                category: category,
                tags: tags,
                read_time: readTime,
                featured_image: imageUrl, // Saved to DB
                
                // Status fields
                status: 'published',
                published_at: now,
                published_date: today,
                
                // AI flags
                ai_generated: true,
                
                // Author (System)
                author_id: '00000000-0000-0000-0000-000000000000', 
                author_name: 'AI Editor',
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        console.log(`   ✅ Published to database`);

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        // Success summary
        console.log('\n' + '═'.repeat(60));
        console.log('🎉 ARTICLE PUBLISHED SUCCESSFULLY!');
        console.log('═'.repeat(60));
        console.log(`\n📊 Summary:`);
        console.log(`   Title: ${metadata.title}`);
        console.log(`   Slug: ${metadata.slug}`);
        console.log(`   Category: ${category}`);
        console.log(`   Read Time: ${readTime} min`);
        console.log(`   Word Count: ~${Math.round(html.split(/\s+/).length)}`);
        console.log(`   Total Time: ${duration}s`);
        console.log(`\n📍 URL: https://investingpro.in/blog/${metadata.slug}`);
        console.log(`\n💾 Database ID: ${article.id}`);
        console.log(`\n💰 Cost: $0.00 (FREE)`);

        return article;

    } catch (error: any) {
        console.error('\n💥 ERROR:', error.message);
        process.exit(1);
    }
}

// Get topic from command line
const topic = process.argv[2];

if (!topic) {
    console.log('🚀 COMPLETE AUTO-PUBLISH SYSTEM\n');
    console.log('Generates article and publishes to database in one command!\n');
    console.log('Usage:');
    console.log('  npx tsx scripts/complete-auto-publish.ts "Your Article Topic"\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/complete-auto-publish.ts "Best Mutual Funds for 2026"');
    console.log('  npx tsx scripts/complete-auto-publish.ts "Tax Saving Investment Options"\n');
    console.log('Features:');
    console.log('  ✅ AI generation with automatic failover');
    console.log('  ✅ SEO metadata extraction');
    console.log('  ✅ Read time calculation');
    console.log('  ✅ Category auto-detection');
    console.log('  ✅ Content validation');
    console.log('  ✅ Database publishing');
    console.log('  ✅ URL generation\n');
    process.exit(1);
}

// Run
completeAutoPublish(topic).catch(console.error);
