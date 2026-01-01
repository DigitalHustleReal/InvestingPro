import { Mistral } from '@mistralai/mistralai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Mistral AI API Connection
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

async function testMistral() {
    console.log('🧪 Testing Mistral AI API Connection...\n');

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

    console.log('✅ API Key found');
    console.log(`🔑 Key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}\n`);

    try {
        // Initialize Mistral client
        const client = new Mistral({
            apiKey: apiKey
        });

        console.log('📡 Sending test request to Mistral AI...\n');

        // Test with a simple chat completion
        const response = await client.chat.complete({
            model: 'mistral-small-latest',
            messages: [
                {
                    role: 'user',
                    content: 'Say "Hello! Mistral AI is working correctly." in exactly 10 words.'
                }
            ],
        });

        const text = response.choices?.[0]?.message?.content || '';
        
        console.log('✅ Connection Successful!\n');
        console.log('📝 Test Response:');
        console.log(`   "${text}"\n`);
        
        console.log('📊 API Details:');
        console.log(`   Model: ${response.model}`);
        console.log(`   Tokens Used: ${response.usage?.total_tokens || 'N/A'}`);
        console.log(`   Provider: Mistral AI\n`);

        console.log('🎉 Mistral AI is ready for content generation!');
        console.log('\n💰 Benefits:');
        console.log('   ✅ FREE tier with rate limits');
        console.log('   ✅ Excellent for multilingual content');
        console.log('   ✅ Strong European language support');
        console.log('   ✅ Fast inference speed');
        
        console.log('\n📚 Next Steps:');
        console.log('   1. Generate your first article:');
        console.log('      npx tsx scripts/generate-article-mistral.ts "Your Topic Here"');
        console.log('   2. Or use as fallback in automation');
        
        return true;

    } catch (error: any) {
        console.error('❌ Connection Failed!\n');
        console.error('Error:', error.message);
        
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            console.log('\n💡 Your API key may be invalid.');
            console.log('   Get a new key: https://console.mistral.ai/');
        } else if (error.message?.includes('429')) {
            console.log('\n📊 Rate limit exceeded.');
            console.log('   Wait a moment and try again.');
        }
        
        if (error.stack) {
            console.log('\n🔍 Stack trace:');
            console.log(error.stack.split('\n').slice(0, 5).join('\n'));
        }
        
        process.exit(1);
    }
}

// Run the test
testMistral().catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
