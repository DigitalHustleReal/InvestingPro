import { GoogleGenAI } from "@google/genai";
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * AUTOMATED: Generate Article with AI + Insert into Database
 * Usage: npx tsx scripts/auto-generate-and-publish.ts "Article Topic"
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

// Extract title from HTML
function extractTitle(htmlContent: string): string {
    const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/);
    if (h1Match) {
        return h1Match[1].replace(/<[^>]+>/g, '').trim();
    }
    return 'Untitled Article';
}

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}

// Extract excerpt from content
function generateExcerpt(htmlContent: string): string {
    // Get first paragraph
    const pMatch = htmlContent.match(/<p>(.*?)<\/p>/);
    if (pMatch) {
        const text = pMatch[1].replace(/<[^>]+>/g, '').trim();
        return text.substring(0, 200) + (text.length > 200 ? '...' : '');
    }
    return '';
}

// Calculate reading time
function calculateReadingTime(htmlContent: string): number {
    const text = htmlContent.replace(/<[^>]+>/g, '');
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / 200); // 200 words per minute
}

async function autoGenerateAndPublish(topic: string) {
    console.log('🚀 AUTOMATED ARTICLE GENERATION & PUBLISHING\n');
    console.log(`📌 Topic: "${topic}"\n`);
    console.log('─'.repeat(60));

    // Load environment
    loadEnvFile();

    // Check API key
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!geminiKey) {
        console.error('\n❌ GOOGLE_GEMINI_API_KEY not found in .env.local');
        console.log('   Run: npx tsx scripts/setup-gemini-key.ts');
        process.exit(1);
    }

    // Set environment variable for SDK
    process.env.GEMINI_API_KEY = geminiKey;

    try {
        // STEP 1: Generate Article with AI
        console.log('\n📝 STEP 1: Generating article with Google Gemini...');
        
        const ai = new GoogleGenAI({});

        const prompt = `Write a comprehensive, SEO-optimized article about "${topic}" for an Indian financial education platform called InvestingPro.

IMPORTANT: Generate ONLY the article content HTML, without <!DOCTYPE>, <html>, <head>, <body>, or <style> tags. Just the content that goes inside the article body.

Requirements:
- Title: Create an engaging, SEO-friendly title (use <h1> tag)
- Length: 1500-2000 words
- Structure: Include H2 and H3 headings for proper hierarchy
- Content Sections:
  * Introduction paragraph (engaging hook)
  * Key Takeaways section with 3-5 bullet points (use <div class="key-takeaways">)
  * Main content with detailed explanations (3-4 major sections with H2 headings)
  * Pro Tips: 2-3 practical tips in highlighted boxes (use <div class="pro-tip">)
  * Common Mistakes to Avoid section
  * Conclusion with actionable steps
- Style: Professional yet accessible, use Indian context and examples (₹ for currency)
- SEO: Include relevant keywords naturally, optimize for search intent
- Format: Use proper HTML tags:
  * <h1> for main title (only ONE h1)
  * <h2> for main sections
  * <h3> for subsections
  * <p> for paragraphs
  * <ul> and <li> for lists
  * <strong> for emphasis
  * <table> for data comparisons (with <thead>, <tbody>, <tr>, <th>, <td>)
  * <div class="key-takeaways"> for key points section
  * <div class="pro-tip"> for tip boxes
  * <div class="warning-box"> for warnings/cautions

CRITICAL: Do NOT include:
- <!DOCTYPE html>
- <html> tags
- <head> section
- <meta> tags
- <style> tags
- <body> tags
- Any CSS styling

Generate ONLY the clean article content HTML now:`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const bodyHtml = response.text;
        
        console.log('   ✅ Article generated successfully!');
        console.log(`   📊 Length: ${bodyHtml.length} characters`);
        console.log(`   📝 Words: ~${bodyHtml.split(/\s+/).length}`);

        // STEP 2: Extract Metadata
        console.log('\n🔍 STEP 2: Extracting metadata...');
        
        const title = extractTitle(bodyHtml);
        const slug = generateSlug(title);
        const excerpt = generateExcerpt(bodyHtml);
        const readTime = calculateReadingTime(bodyHtml);

        console.log(`   Title: ${title}`);
        console.log(`   Slug: ${slug}`);
        console.log(`   Reading Time: ${readTime} min`);

        // STEP 3: Save to File (backup)
        console.log('\n💾 STEP 3: Saving backup file...');
        
        const outputDir = path.join(process.cwd(), 'generated-articles');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filename = `${slug}-${Date.now()}.html`;
        const filepath = path.join(outputDir, filename);
        fs.writeFileSync(filepath, bodyHtml, 'utf-8');
        
        console.log(`   ✅ Saved: ${filename}`);

        // STEP 4: Insert into Database
        console.log('\n🗄️  STEP 4: Inserting into database...');
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('   ❌ Supabase credentials not found');
            console.log('   💡 Article saved to file, but not published');
            process.exit(1);
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const articleData = {
            title,
            slug,
            excerpt,
            category: 'mutual-funds', // You can make this dynamic
            status: 'published',
            meta_title: title,
            meta_description: excerpt,
            read_time: readTime,
            content: title, // Required field
            body_html: bodyHtml,
        };

        const { data, error } = await supabase
            .from('blog_posts')
            .insert([articleData])
            .select()
            .single();

        if (error) {
            console.error('   ❌ Database error:', error.message);
            console.log('\n   💡 Article saved to file:', filepath);
            console.log('   You can insert it manually later');
            process.exit(1);
        }

        // STEP 5: Success!
        console.log('   ✅ Article published successfully!');
        
        console.log('\n' + '═'.repeat(60));
        console.log('🎉 ARTICLE PUBLISHED SUCCESSFULLY!');
        console.log('═'.repeat(60));
        
        console.log('\n📊 Article Details:');
        console.log(`   ID: ${data.id}`);
        console.log(`   Title: ${data.title}`);
        console.log(`   Slug: ${data.slug}`);
        console.log(`   Reading Time: ${data.read_time} min`);
        console.log(`   Status: ${data.status}`);
        
        console.log('\n🔗 View Your Article:');
        console.log(`   http://localhost:3000/articles/${data.slug}`);
        
        console.log('\n✨ Your Article Now Has:');
        console.log('   ✅ Professional formatting');
        console.log('   ✅ Draggable Table of Contents');
        console.log('   ✅ All visual components styled');
        console.log('   ✅ SEO optimization');
        console.log('   ✅ Responsive design');
        console.log('   ✅ Mobile-friendly TOC');
        
        console.log('\n💾 Backup File:');
        console.log(`   ${filepath}`);
        
        console.log('\n🎯 Next Steps:');
        console.log('   1. View the article in your browser');
        console.log('   2. Review the content and formatting');
        console.log('   3. Generate more articles with:');
        console.log('      npx tsx scripts/auto-generate-and-publish.ts "Your Topic"');
        
        return data;

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        
        if (error.stack) {
            console.log('\n🔍 Stack trace:');
            console.log(error.stack.split('\n').slice(0, 5).join('\n'));
        }
        
        process.exit(1);
    }
}

// Get topic from command line
const topic = process.argv[2];

if (!topic) {
    console.log('🚀 AUTOMATED ARTICLE GENERATION & PUBLISHING\n');
    console.log('Usage:');
    console.log('  npx tsx scripts/auto-generate-and-publish.ts "Your Article Topic"\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/auto-generate-and-publish.ts "Best Mutual Funds for 2026"');
    console.log('  npx tsx scripts/auto-generate-and-publish.ts "Tax Saving Investment Options"');
    console.log('  npx tsx scripts/auto-generate-and-publish.ts "Complete Guide to Index Funds"\n');
    console.log('Features:');
    console.log('  ✅ AI-powered content generation (Google Gemini)');
    console.log('  ✅ Automatic database insertion');
    console.log('  ✅ Professional formatting with TOC');
    console.log('  ✅ SEO optimization');
    console.log('  ✅ Backup file creation');
    console.log('  ✅ FREE (Google Gemini API)\n');
    process.exit(1);
}

// Run the automation
autoGenerateAndPublish(topic).catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
