import { Mistral } from '@mistralai/mistralai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Article Generator using Mistral AI
 * Usage: npx tsx scripts/generate-article-mistral.ts "Article Topic"
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

async function generateArticle(topic: string) {
    console.log('📝 Generating Article with Mistral AI...\n');
    console.log(`📌 Topic: "${topic}"\n`);

    // Load environment
    loadEnvFile();

    // Check API key
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
        console.error('❌ MISTRAL_API_KEY not found in .env.local');
        console.log('\n💡 Run this first:');
        console.log('   npx tsx scripts/setup-mistral-key.ts');
        process.exit(1);
    }

    try {
        // Initialize Mistral client
        const client = new Mistral({
            apiKey: apiKey
        });

        console.log('🤖 Generating content with Mistral Small...\n');

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

        const response = await client.chat.complete({
            model: 'mistral-small-latest',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert financial content writer specializing in Indian markets. You create comprehensive, SEO-optimized articles with professional HTML formatting.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
        });

        const articleContent = response.choices?.[0]?.message?.content || '';
        
        console.log('✅ Article Generated Successfully!\n');
        console.log('📊 Content Stats:');
        console.log(`   Words: ~${articleContent.split(/\s+/).length}`);
        console.log(`   Characters: ${articleContent.length}`);
        console.log(`   Tokens Used: ${response.usage?.total_tokens || 'N/A'}\n`);

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
        console.log('\n💰 Mistral AI Benefits:');
        console.log('   ✅ FREE tier with rate limits');
        console.log('   ✅ Excellent multilingual support');
        console.log('   ✅ Fast inference speed');
        console.log('   ✅ European language specialist');
        
        console.log('\n📚 Next Steps:');
        console.log('   1. Review the generated article');
        console.log('   2. Edit and refine as needed');
        console.log('   3. Use auto-publish script to insert into database');
        
        return articleContent;

    } catch (error: any) {
        console.error('\n❌ Generation Failed!\n');
        console.error('Error:', error.message);
        
        if (error.message?.includes('401')) {
            console.log('\n💡 Your API key may be invalid.');
            console.log('   Get a new key: https://console.mistral.ai/');
        } else if (error.message?.includes('429')) {
            console.log('\n📊 Rate limit exceeded.');
            console.log('   Wait a moment and try again.');
        }
        
        console.log('\n🆓 Alternatives:');
        console.log('   Google Gemini: npx tsx scripts/generate-article-gemini.ts "' + topic + '"');
        console.log('   OpenAI: npx tsx scripts/generate-article-openai.ts "' + topic + '"');
        
        process.exit(1);
    }
}

// Get topic from command line
const topic = process.argv[2];

if (!topic) {
    console.log('📝 Article Generator - Mistral AI\n');
    console.log('Usage:');
    console.log('  npx tsx scripts/generate-article-mistral.ts "Your Article Topic"\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/generate-article-mistral.ts "Best Mutual Funds for 2026"');
    console.log('  npx tsx scripts/generate-article-mistral.ts "Tax Saving Investment Options"');
    console.log('  npx tsx scripts/generate-article-mistral.ts "Complete Guide to Index Funds"\n');
    console.log('💰 Cost: FREE tier with rate limits');
    console.log('⚡ Speed: ~10-15 seconds per article');
    console.log('🌍 Specialty: Multilingual, European languages\n');
    process.exit(1);
}

// Generate the article
generateArticle(topic).catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
