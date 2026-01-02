import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import OpenAI from 'openai';

async function testOpenAI() {
    console.log('🔵 Testing OpenAI API Connection...');

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('❌ OPENAI_API_KEY is missing in .env.local');
        return;
    }
    console.log(`   🔑 Key found: ${apiKey.substring(0, 8)}...`);

    const openai = new OpenAI({ apiKey });

    try {
        // 1. Test Chat Completion (GPT-4o or 3.5-turbo)
        console.log('   Testing Chat Completion...');
        const chat = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Say "Hello Finance"' }],
            max_tokens: 10
        });
        console.log(`   ✅ Chat Response: "${chat.choices[0].message.content}"`);

        // 2. Test DALL-E 3 (Image Generation)
        console.log('   Testing DALL-E 3 (Image Generation)...');
        const image = await openai.images.generate({
            model: "dall-e-3",
            prompt: "A futuristic chart of Indian Stock Market growth, infographic style, minimal, vector art",
            n: 1,
            size: "1024x1024",
        });

        console.log(`   ✅ Image Generated: ${image.data[0].url}`);
        console.log('🎉 OpenAI is FULLY FUNCTIONAL (Text + Image)!');

    } catch (error: any) {
        console.error(`❌ OpenAI Test Failed: ${error.message}`);
        if (error.code === 'insufficient_quota') {
            console.error('   ⚠️ Error: You have run out of credits or billing is not active.');
        }
    }
}

testOpenAI();
