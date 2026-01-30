
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config({ path: '.env.local' });

async function diagnose() {
    console.log('🔍 Diagnosing OpenAI API Key...');
    
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ No OPENAI_API_KEY found in .env.local');
        return;
    }
    
    console.log(`🔑 Key found: ${process.env.OPENAI_API_KEY.substring(0, 8)}...`);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    try {
        console.log('📡 Attempting simple completion...');
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Say "Hello"' }],
        });
        console.log('✅ Success! Quota is active.');
        console.log('Response:', completion.choices[0].message.content);
    } catch (e: any) {
        console.error('\n❌ FAILURE DETAILS:');
        console.error('Status:', e.status);
        console.error('Type:', e.type);
        console.error('Code:', e.code);
        console.error('Message:', e.message);
        
        if (e.code === 'insufficient_quota') {
            console.log('\n💡 DIAGNOSIS: "insufficient_quota"');
            console.log('Possible causes:');
            console.log('1. You added credit ($20) but have a "Usage Limit" set to $0 in settings.');
            console.log('2. The payment failed or is still processing (can take 1 hour).');
            console.log('3. You are using an old key from a different "Project" than the one you funded.');
        }
    }
}

diagnose();
