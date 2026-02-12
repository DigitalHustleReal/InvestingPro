import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { api } from '@/lib/api';

async function testInvokeLLM() {
    console.log('--- TESTING InvokeLLM ---');
    
    const term = "SIP (Systematic Investment Plan)";
    const prompt = `
    ROLE: You are an expert financial lexicographer modeled after Investopedia.
    GOAL: Write a precise, high-authority glossary definition for: "${term}".
    CONTEXT: Indian Financial Markets (SEBI, RBI, INR context).

    STRUCTURE (Return valid JSON):
    {
        "content": "<HTML CONTENT HERE>"
    }

    HTML STRUCTURE:
    <h1>What is ${term}?</h1>
    <p class="definition"><strong>Definition:</strong> [1-2 sentences, Investopedia style].</p>
    
    <div class="key-takeaways bg-slate-50 p-4 rounded-lg my-4">
        <h3>Key Takeaways</h3>
        <ul>
            <li>[Point 1]</li>
            <li>[Point 2]</li>
            <li>[Point 3]</li>
        </ul>
    </div>

    <h2>Understanding ${term}</h2>
    <p>[Detailed explanation, 2-3 paragraphs. Simple language.]</p>

    <h3>Example of ${term}</h3>
    <p>[Real world example using Indian Rupees or Companies].</p>

    <h3>Why it Matters</h3>
    <p>[Significance for investors].</p>
    `;

    try {
        console.log('Calling InvokeLLM...');
        const result = await api.integrations.Core.InvokeLLM({
            prompt: prompt,
            operation: 'generate_glossary',
            contextData: { term }
        });

        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (e: any) {
        console.error('Error:', e.message);
    }

    console.log('\n--- TEST COMPLETE ---');
}

testInvokeLLM().catch(console.error);
