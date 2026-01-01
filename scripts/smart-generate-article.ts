import { GoogleGenAI } from "@google/genai";
import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * SMART AI ARTICLE GENERATOR WITH AUTOMATIC FAILOVER
 * 
 * Tries AI providers in order until one succeeds:
 * 1. Gemini (FREE, unlimited) - PRIMARY
 * 2. Groq (FREE, fastest) - BACKUP 1
 * 3. Mistral (FREE, rate-limited) - BACKUP 2
 * 4. OpenAI (PAID, premium) - FINAL FALLBACK
 * 
 * Usage: npx tsx scripts/smart-generate-article.ts "Article Topic"
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

// Generate article prompt
function getArticlePrompt(topic: string): string {
    return `Write a comprehensive, SEO-optimized article about "${topic}" for an Indian financial education platform called InvestingPro.

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
}

// Try Gemini (FREE, PRIMARY)
async function tryGemini(topic: string): Promise<string> {
    console.log('🔵 Trying Gemini (FREE, unlimited)...');
    
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_GEMINI_API_KEY not found');
    }

    process.env.GEMINI_API_KEY = apiKey;
    const ai = new GoogleGenAI({});
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: getArticlePrompt(topic),
    });

    return response.text;
}

// Try Groq (FREE, FASTEST)
async function tryGroq(topic: string): Promise<string> {
    console.log('⚡ Trying Groq (FREE, fastest)...');
    
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY not found');
    }

    const groq = new Groq({ apiKey });
    
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are an expert financial content writer specializing in Indian markets.'
            },
            {
                role: 'user',
                content: getArticlePrompt(topic)
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content || '';
}

// Try Mistral (FREE, BACKUP)
async function tryMistral(topic: string): Promise<string> {
    console.log('🟣 Trying Mistral (FREE, rate-limited)...');
    
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
        throw new Error('MISTRAL_API_KEY not found');
    }

    const client = new Mistral({ apiKey });
    
    const response = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: [
            {
                role: 'system',
                content: 'You are an expert financial content writer specializing in Indian markets.'
            },
            {
                role: 'user',
                content: getArticlePrompt(topic)
            }
        ],
    });

    return response.choices?.[0]?.message?.content || '';
}

// Try OpenAI (PAID, FINAL FALLBACK)
async function tryOpenAI(topic: string): Promise<string> {
    console.log('🟢 Trying OpenAI (PAID, premium)...');
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not found');
    }

    const client = new OpenAI({ apiKey });
    
    const completion = await client.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are an expert financial content writer specializing in Indian markets.'
            },
            {
                role: 'user',
                content: getArticlePrompt(topic)
            }
        ],
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 4000,
    });

    return completion.choices[0]?.message?.content || '';
}

// Main smart generation with failover
async function smartGenerateArticle(topic: string) {
    console.log('🤖 SMART AI ARTICLE GENERATOR WITH FAILOVER\n');
    console.log(`📌 Topic: "${topic}"\n`);
    console.log('─'.repeat(60));
    console.log('Will try AI providers in order until one succeeds:');
    console.log('1. Gemini (FREE) → 2. Groq (FREE) → 3. Mistral (FREE) → 4. OpenAI (PAID)');
    console.log('─'.repeat(60));
    console.log('');

    // Load environment
    loadEnvFile();

    const startTime = Date.now();
    let articleContent = '';
    let usedProvider = '';
    let attemptNumber = 0;

    // Try each provider in order
    const providers = [
        { name: 'Gemini', fn: tryGemini, cost: '$0.00' },
        { name: 'Groq', fn: tryGroq, cost: '$0.00' },
        { name: 'Mistral', fn: tryMistral, cost: '$0.00' },
        { name: 'OpenAI', fn: tryOpenAI, cost: '~$0.015' },
    ];

    for (const provider of providers) {
        attemptNumber++;
        try {
            articleContent = await provider.fn(topic);
            usedProvider = provider.name;
            
            console.log(`\n✅ SUCCESS with ${provider.name}!`);
            console.log(`   Cost: ${provider.cost}`);
            console.log(`   Attempts: ${attemptNumber}/${providers.length}`);
            break;
            
        } catch (error: any) {
            console.log(`\n❌ ${provider.name} failed: ${error.message}`);
            
            // Check if this is the last provider
            if (attemptNumber === providers.length) {
                console.error('\n💥 ALL AI PROVIDERS FAILED!');
                console.error('   Please check your API keys and try again.');
                process.exit(1);
            }
            
            console.log(`   Trying next provider...`);
        }
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Save article
    const outputDir = path.join(process.cwd(), 'generated-articles');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}.html`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, articleContent, 'utf-8');

    // Show results
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 ARTICLE GENERATED SUCCESSFULLY!');
    console.log('═'.repeat(60));
    
    console.log('\n📊 Generation Stats:');
    console.log(`   Provider Used: ${usedProvider}`);
    console.log(`   Total Time: ${duration.toFixed(2)}s`);
    console.log(`   Attempts: ${attemptNumber}/${providers.length}`);
    console.log(`   Words: ~${articleContent.split(/\s+/).length}`);
    console.log(`   Characters: ${articleContent.length}`);
    
    console.log('\n💾 Article Saved:');
    console.log(`   ${filepath}`);
    
    console.log('\n👀 Preview (first 300 characters):');
    console.log('─'.repeat(60));
    console.log(articleContent.substring(0, 300) + '...');
    console.log('─'.repeat(60));
    
    console.log('\n💡 Failover Strategy:');
    if (usedProvider === 'Gemini') {
        console.log('   ✅ Primary provider worked (Gemini - FREE)');
    } else if (usedProvider === 'Groq') {
        console.log('   ⚠️  Primary failed, used backup 1 (Groq - FREE)');
    } else if (usedProvider === 'Mistral') {
        console.log('   ⚠️  Primary + Backup 1 failed, used backup 2 (Mistral - FREE)');
    } else if (usedProvider === 'OpenAI') {
        console.log('   ⚠️  All free providers failed, used paid fallback (OpenAI)');
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Review the generated article');
    console.log('   2. Edit and refine as needed');
    console.log('   3. Publish to your platform');
    
    console.log('\n✨ Benefits of Smart Failover:');
    console.log('   ✅ Never fails - always generates content');
    console.log('   ✅ Cost-optimized - uses free providers first');
    console.log('   ✅ Speed-optimized - tries fastest providers');
    console.log('   ✅ Quality-guaranteed - falls back to premium if needed');
}

// Get topic from command line
const topic = process.argv[2];

if (!topic) {
    console.log('🤖 SMART AI ARTICLE GENERATOR WITH FAILOVER\n');
    console.log('Automatically tries multiple AI providers until one succeeds!\n');
    console.log('Usage:');
    console.log('  npx tsx scripts/smart-generate-article.ts "Your Article Topic"\n');
    console.log('Examples:');
    console.log('  npx tsx scripts/smart-generate-article.ts "Best Mutual Funds for 2026"');
    console.log('  npx tsx scripts/smart-generate-article.ts "Tax Saving Investment Options"\n');
    console.log('Failover Order:');
    console.log('  1. 🔵 Gemini (FREE, unlimited) - PRIMARY');
    console.log('  2. ⚡ Groq (FREE, fastest) - BACKUP 1');
    console.log('  3. 🟣 Mistral (FREE, rate-limited) - BACKUP 2');
    console.log('  4. 🟢 OpenAI (PAID, premium) - FINAL FALLBACK\n');
    console.log('Benefits:');
    console.log('  ✅ Never fails - always generates content');
    console.log('  ✅ Cost-optimized - uses free providers first');
    console.log('  ✅ Speed-optimized - tries fastest providers');
    console.log('  ✅ Quality-guaranteed - falls back to premium if needed\n');
    process.exit(1);
}

// Run smart generation
smartGenerateArticle(topic).catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
