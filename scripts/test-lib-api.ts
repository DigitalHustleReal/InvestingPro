/**
 * Test InvokeLLM from lib/api.ts directly
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testLibApi() {
    console.log('====================================================');
    console.log('🧪 TEST: lib/api.ts InvokeLLM wrapper');
    console.log('====================================================\n');

    try {
        // Dynamic import to use the app's module resolution/env
        const { api } = await import('@/lib/api');
        
        console.log('📋 Calling api.integrations.Core.InvokeLLM...');
        const prompt = "Write a one sentence definition of 'Inflation'.";
        
        const result = await api.integrations.Core.InvokeLLM({
            prompt: prompt,
            operation: 'generate', // Use a valid operation
            systemPrompt: 'You are a helpful assistant. Return JSON object with "content" field.'
        });

        console.log('\n====================================================');
        console.log('✅ SUCCESS! API wrapper returned:');
        console.log('====================================================');
        console.log(JSON.stringify(result, null, 2));

    } catch (error: any) {
        console.log('\n====================================================');
        console.log('❌ FAILED');
        console.log('====================================================');
        console.log(`Error: ${error.message}`);
        if (error.stack) console.log(error.stack);
    }
}

testLibApi();
