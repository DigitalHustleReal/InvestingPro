import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';

/**
 * Article Generator using Google Gemini 2.5 Flash
 * Usage: npx tsx scripts/generate-article-gemini.ts "Article Topic"
 */

// Load environment variables from .env.local
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

async function generateArticle(topic: string) {
    console.log('📝 Generating Article with Google Gemini 2.5 Flash...\n');
    console.log(`📌 Topic: "${topic}"\n`);

    // Load .env.local
    loadEnvFile();

    // Check if API key exists
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GOOGLE_GEMINI_API_KEY not found in .env.local');
        console.log('\n💡 Run this first:');
        console.log('   npx tsx scripts/setup-gemini-key.ts');
        process.exit(1);
    }

    // Set as environment variable for the SDK
    process.env.GEMINI_API_KEY = apiKey;

    try {
        // Initialize Gemini client
        const ai = new GoogleGenAI({});

        console.log('🤖 Generating content with Gemini 2.5 Flash...\n');

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

        const articleContent = response.text;
        
        console.log('✅ Article Generated Successfully!\n');
        console.log('📊 Content Stats:');
        console.log(`   Words: ~${articleContent.split(/\s+/).length}`);
        console.log(`   Characters: ${articleContent.length}\n`);

        // Save to file
        const outputDir = path.join(process.cwd(), 'generated-articles');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filename = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}.html`;
        const filepath = path.join(outputDir, filename);
        
        fs.writeFileSync(filepath, articleContent, 'utf-8');
        
        console.log('💾 Article Saved:');
        console.log(`   ${filepath}\n`);

        // Show preview
        console.log('👀 Preview (first 500 characters):');
        console.log('─'.repeat(60));
        console.log(articleContent.substring(0, 500) + '...');
        console.log('─'.repeat(60));
        
        console.log('\n🎉 Done! Article ready for review and publishing.');
        console.log('\n📚 Next Steps:');
        console.log('   1. Review the generated article in:', filepath);
        console.log('   2. Edit and refine as needed');
        console.log('   3. Use scripts/insert-article-from-file.ts to add to database');
        
        return articleContent;

    } catch (error: any) {
        console.error('\n❌ Generation Failed!\n');
        console.error('Error:', error.message);
        
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('401')) {
            console.log('\n💡 Your API key may be invalid.');
            console.log('   Get a new key: https://aistudio.google.com/app/apikey');
        } else if (error.message?.includes('SAFETY')) {
            console.log('\n⚠️  Content was blocked by safety filters.');
            console.log('   Try rephrasing your topic.');
        } else if (error.message?.includes('QUOTA')) {
            console.log('\n📊 Quota exceeded.');
            console.log('   Free tier: 60 requests/minute');
            console.log('   Wait a minute and try again.');
        }
        
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
    console.log('📝 Article Generator - Google Gemini 2.5 Flash\n');
    console.log('Usage:');
    console.log('  npx tsx scripts/generate-article-gemini.ts "Your Article Topic"\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/generate-article-gemini.ts "Best Mutual Funds for 2026"');
    console.log('  npx tsx scripts/generate-article-gemini.ts "Tax Saving Investment Options"');
    console.log('  npx tsx scripts/generate-article-gemini.ts "SIP vs Lumpsum Investment"\n');
    console.log('💰 Cost: FREE (Google Gemini API)');
    console.log('⚡ Speed: ~10-20 seconds per article\n');
    process.exit(1);
}

// Generate the article
generateArticle(topic).catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
