import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test OpenAI API Connection with Correct Format
 * Based on official OpenAI documentation
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

async function testOpenAI() {
    console.log('🧪 Testing OpenAI API Connection...\n');

    // Load environment
    loadEnvFile();

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('❌ OPENAI_API_KEY not found in .env.local');
        console.log('\n💡 Add your OpenAI API key to .env.local:');
        console.log('   OPENAI_API_KEY=sk-proj-...');
        process.exit(1);
    }

    console.log('✅ API Key found');
    console.log(`🔑 Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}\n`);

    try {
        // Initialize OpenAI client
        const client = new OpenAI({
            apiKey: apiKey,
        });

        console.log('📡 Sending test request to OpenAI...\n');

        // Test with chat completions (standard API)
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini", // Using cost-effective model for testing
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant for testing API connections."
                },
                {
                    role: "user",
                    content: "Say 'Hello! OpenAI API is working correctly.' in exactly 10 words."
                }
            ],
            max_tokens: 50,
            temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content || '';
        
        console.log('✅ Connection Successful!\n');
        console.log('📝 Test Response:');
        console.log(`   "${response}"\n`);
        
        console.log('📊 API Details:');
        console.log(`   Model: ${completion.model}`);
        console.log(`   Tokens Used: ${completion.usage?.total_tokens || 'N/A'}`);
        console.log(`   Finish Reason: ${completion.choices[0]?.finish_reason}\n`);

        console.log('🎉 OpenAI API is ready for content generation!');
        console.log('\n💰 Cost Estimate:');
        console.log('   gpt-4o-mini: ~$0.15 per 1M input tokens');
        console.log('   gpt-4o: ~$2.50 per 1M input tokens');
        console.log('   For 100 articles: ~$5-20 with gpt-4o-mini');
        
        console.log('\n📚 Next Steps:');
        console.log('   1. Generate your first article:');
        console.log('      npx tsx scripts/generate-article-openai.ts "Your Topic Here"');
        console.log('   2. Or use the automated publish script');
        
        return true;

    } catch (error: any) {
        console.error('❌ Connection Failed!\n');
        
        if (error.status === 401) {
            console.error('🔐 Authentication Error:');
            console.error('   Your API key is invalid or expired.');
            console.error('   Please check your key at: https://platform.openai.com/api-keys');
            console.error('\n💡 Common issues:');
            console.error('   - Key was copied incorrectly (check for extra spaces)');
            console.error('   - Key has been revoked');
            console.error('   - Account needs billing setup');
        } else if (error.status === 429) {
            console.error('⏱️  Rate Limit Error:');
            console.error('   You have exceeded your API quota.');
            console.error('   Check your usage at: https://platform.openai.com/usage');
        } else if (error.status === 500) {
            console.error('🔧 Server Error:');
            console.error('   OpenAI servers are experiencing issues.');
            console.error('   Check status at: https://status.openai.com/');
        } else {
            console.error('⚠️  Error Details:');
            console.error(`   Status: ${error.status || 'Unknown'}`);
            console.error(`   Message: ${error.message || 'Unknown error'}`);
        }
        
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Verify your API key is correct');
        console.log('   2. Check your OpenAI account has credits');
        console.log('   3. Ensure you have API access enabled');
        console.log('   4. Visit: https://platform.openai.com/account/billing');
        console.log('\n🆓 Alternative: Use Google Gemini (FREE)');
        console.log('   npx tsx scripts/generate-article-gemini.ts "Topic"');
        
        process.exit(1);
    }
}

// Run the test
testOpenAI().catch((error) => {
    console.error('💥 Unexpected Error:', error.message);
    process.exit(1);
});
