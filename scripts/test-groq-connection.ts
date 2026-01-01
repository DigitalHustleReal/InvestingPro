import Groq from 'groq-sdk';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Groq API Connection (Fixed with official SDK)
 * Groq = FASTEST AI inference in the world (500+ tokens/sec)
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

async function testGroq() {
    console.log('🧪 Testing Groq API Connection...\n');
    console.log('⚡ FASTEST AI INFERENCE IN THE WORLD!\n');

    // Load environment
    loadEnvFile();

    // Check API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error('❌ GROQ_API_KEY not found in .env.local');
        console.log('\n💡 Run this first:');
        console.log('   npx tsx scripts/setup-groq-key.ts');
        process.exit(1);
    }

    console.log('✅ API Key found');
    console.log(`🔑 Key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}\n`);

    try {
        // Initialize Groq client (official SDK)
        const groq = new Groq({
            apiKey: apiKey
        });

        console.log('📡 Sending test request to Groq...\n');

        const startTime = Date.now();

        // Test with chat completion (official format from docs)
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: 'Say "Hello! Groq API is working correctly." in exactly 10 words.'
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 50,
        });

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        const response = completion.choices[0]?.message?.content || '';
        
        console.log('✅ Connection Successful!\n');
        console.log('📝 Test Response:');
        console.log(`   "${response}"\n`);
        
        console.log('📊 API Details:');
        console.log(`   Model: ${completion.model}`);
        console.log(`   Tokens Used: ${completion.usage?.total_tokens || 'N/A'}`);
        console.log(`   Time: ${duration.toFixed(2)}s`);
        
        if (completion.usage?.total_tokens) {
            const tokensPerSec = completion.usage.total_tokens / duration;
            console.log(`   Speed: ${Math.round(tokensPerSec)} tokens/second ⚡⚡⚡`);
        }

        console.log('\n🎉 Groq API is ready for ULTRA-FAST content generation!');
        console.log('\n⚡ Groq Benefits:');
        console.log('   ✅ FASTEST inference (500+ tokens/sec)');
        console.log('   ✅ FREE tier with rate limits');
        console.log('   ✅ 32K context window');
        console.log('   ✅ Perfect for real-time applications');
        console.log('   ✅ Llama 3.3, Mixtral, Gemma models');
        
        console.log('\n📚 Next Steps:');
        console.log('   1. Generate your first article:');
        console.log('      npx tsx scripts/generate-article-groq.ts "Your Topic Here"');
        console.log('   2. Or use for real-time chat/responses');
        
        return true;

    } catch (error: any) {
        console.error('❌ Connection Failed!\n');
        console.error('Error:', error.message);
        
        if (error.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            console.log('\n💡 Your API key may be invalid or expired.');
            console.log('   Get a new key: https://console.groq.com/keys');
            console.log('   Then update: npx tsx scripts/setup-groq-key.ts');
        } else if (error.status === 429 || error.message?.includes('429')) {
            console.log('\n📊 Rate limit exceeded.');
            console.log('   Wait a moment and try again.');
        }
        
        if (error.stack) {
            console.log('\n🔍 Error details:');
            console.log(error.stack.split('\n').slice(0, 3).join('\n'));
        }
        
        process.exit(1);
    }
}

// Run the test
testGroq().catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
