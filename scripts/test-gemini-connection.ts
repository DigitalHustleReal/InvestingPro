import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Google Gemini API Connection
 * Loads .env.local manually for testing
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

async function testGeminiConnection() {
    console.log('🧪 Testing Google Gemini API Connection...\n');

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

    console.log('✅ API Key found');
    console.log(`🔑 Key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}\n`);

    try {
        // Initialize Gemini client
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: process.env.GEMINI_MODEL || 'gemini-1.5-pro'
        });

        console.log('📡 Sending test request to Google Gemini...\n');

        // Test with a simple prompt
        const result = await model.generateContent('Say "Hello! Google Gemini API is working correctly." in exactly 10 words.');

        const response = result.response.text();
        
        console.log('✅ Connection Successful!\n');
        console.log('📝 Test Response:');
        console.log(`   "${response}"\n`);
        
        console.log('📊 API Details:');
        console.log(`   Model: ${process.env.GEMINI_MODEL || 'gemini-1.5-pro'}`);
        console.log(`   Provider: Google AI Studio`);
        console.log(`   Pricing: FREE tier\n`);

        console.log('🎉 Google Gemini API is ready for content generation!');
        console.log('\n💰 Benefits:');
        console.log('   ✅ FREE tier with generous limits');
        console.log('   ✅ 60 requests per minute');
        console.log('   ✅ High-quality content generation');
        console.log('   ✅ No credit card required');
        
        console.log('\n📚 Next Steps:');
        console.log('   1. Generate your first article:');
        console.log('      npx tsx scripts/generate-article-gemini.ts "Your Topic Here"');
        console.log('   2. Or use the content automation workflow');
        
        return true;

    } catch (error: any) {
        console.error('❌ Connection Failed!\n');
        
        if (error.message?.includes('API_KEY_INVALID')) {
            console.error('🔐 Authentication Error:');
            console.error('   Your API key is invalid.');
            console.error('   Please check your key at: https://aistudio.google.com/app/apikey');
        } else if (error.message?.includes('RATE_LIMIT')) {
            console.error('⏱️  Rate Limit Error:');
            console.error('   You have exceeded your API quota.');
            console.error('   Free tier: 60 requests/minute');
        } else if (error.message?.includes('QUOTA_EXCEEDED')) {
            console.error('📊 Quota Exceeded:');
            console.error('   Daily quota limit reached.');
            console.error('   Wait 24 hours or upgrade your plan.');
        } else {
            console.error('⚠️  Error Details:');
            console.error(`   Message: ${error.message || 'Unknown error'}`);
            if (error.stack) {
                console.error(`   Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`);
            }
        }
        
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Verify your API key is correct');
        console.log('   2. Check you created the key at: https://aistudio.google.com/app/apikey');
        console.log('   3. Ensure API key has no restrictions');
        console.log('   4. Try creating a new API key');
        
        process.exit(1);
    }
}

// Run the test
testGeminiConnection().catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
