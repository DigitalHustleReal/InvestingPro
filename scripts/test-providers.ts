/**
 * Test each AI provider directly
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testProviders() {
    console.log('====================================================');
    console.log('🔧 PROVIDER TEST: Testing each AI provider directly');
    console.log('====================================================\n');

    const testPrompt = 'Write a single sentence about credit cards in India.';

    // Test 1: OpenAI
    console.log('1️⃣ Testing OpenAI (gpt-4o-mini)...');
    try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 100
        });
        const content = response.choices[0]?.message?.content;
        console.log(`   ✅ OpenAI SUCCESS: "${content}"`);
    } catch (error: any) {
        console.log(`   ❌ OpenAI FAILED: ${error.message}`);
    }

    // Test 2: Gemini
    console.log('\n2️⃣ Testing Gemini (gemini-2.0-flash)...');
    try {
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: testPrompt }] }],
                generationConfig: { temperature: 0.3 }
            })
        });
        const data = await response.json();
        if (response.ok) {
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`   ✅ Gemini SUCCESS: "${text}"`);
        } else {
            console.log(`   ❌ Gemini FAILED: ${data.error?.message}`);
        }
    } catch (error: any) {
        console.log(`   ❌ Gemini FAILED: ${error.message}`);
    }

    // Test 3: Groq
    console.log('\n3️⃣ Testing Groq (llama-3.1-8b-instant)...');
    try {
        const Groq = (await import('groq-sdk')).default;
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: testPrompt }],
            model: 'llama-3.1-8b-instant',
        });
        const content = response.choices[0]?.message?.content;
        console.log(`   ✅ Groq SUCCESS: "${content}"`);
    } catch (error: any) {
        console.log(`   ❌ Groq FAILED: ${error.message}`);
    }

    // Test 4: Mistral
    console.log('\n4️⃣ Testing Mistral (mistral-small-latest)...');
    try {
        const { Mistral } = await import('@mistralai/mistralai');
        const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
        const response = await mistral.chat.complete({
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: testPrompt }],
        });
        const content = response.choices?.[0]?.message?.content;
        console.log(`   ✅ Mistral SUCCESS: "${content}"`);
    } catch (error: any) {
        console.log(`   ❌ Mistral FAILED: ${error.message}`);
    }

    console.log('\n====================================================');
    console.log('Test complete. Use working providers for generation.');
    console.log('====================================================');
}

testProviders();
