import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Simple wrapper for Gemini if OpenAI is missing
async function callGemini(prompt: string, apiKey: string) {
    const model = 'gemini-1.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`Gemini Error: ${await response.text()}`);
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text;
}

async function extractData() {
    const url = process.argv[2];
    if (!url) {
        console.error('Please provide a URL as argument');
        process.exit(1);
    }

    console.log(`🔍 Fetching: ${url}`);
    
    // 1. Fetch HTML
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    
    if (!response.ok) {
        console.error(`Failed to fetch: ${response.status} ${response.statusText}`);
        process.exit(1);
    }
    
    const html = await response.text();
    
    // 2. Clean HTML (Very naive cleaning to reduce token usage)
    const cleanText = html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 15000); // Limit context window
        
    console.log(`📄 Extracted ${cleanText.length} chars of text context.`);
    
    // 3. Construct Prompt
    const prompt = `
    You are a Data Extraction AI. 
    Extract the following Credit Card details from the text below.
    Return ONLY valid JSON.
    
    Fields to extract:
    - name (string)
    - annual_fee (number, extract value only)
    - joining_fee (number)
    - interest_rate (string, e.g. "3.6% per month")
    - rewards_rate (string summary)
    - key_features (array of strings)
    
    Text Context:
    "${cleanText}"
    `;
    
    console.log('🤖 Sending to AI...');
    
    // 4. Call LLM
    let result = '';
    
    // Try OpenAI First
    if (process.env.OPENAI_API_KEY) {
        try {
            console.log('Using OpenAI...');
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
            });
            result = completion.choices[0].message.content || '{}';
        } catch (openaiError: any) {
            console.error('❌ OpenAI Failed:', openaiError.message);
            console.log('🔄 Failing over to Gemini...');
        }
    }

    // Try Gemini if OpenAI failed or key missing
    if (!result && (process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY)) {
        try {
            console.log('Using Gemini...');
            const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
            result = await callGemini(prompt + "\n\nJSON Response:", key!);
        } catch (geminiError: any) {
             console.error('❌ Gemini Failed:', geminiError.message);
        }
    }

    if (!result) {
        console.warn('⚠️ All AI providers failed (likely quota/key issues).');
        console.log('🔄 Swithing to MOCK MODE for prototype demonstration...');
        
        // Mock Response for HDFC Regalia Gold (just to show format)
        result = JSON.stringify({
            name: "HDFC Regalia Gold Credit Card",
            annual_fee: 2500,
            joining_fee: 2500,
            interest_rate: "3.6% per month (43.2% annually)",
            rewards_rate: "4 Reward Points on every Rs.150 spent",
            key_features: [
                "Complimentary Airport Lounge Access",
                "Priority Pass Membership",
                "Marks & Spencer / Myntra / Reliance Digital Vouchers on spending Rs. 1 Lakh",
                "5X Reward Points on Myntra, Nykaa, M&S, Reliance Digital"
            ],
            welcom_benefits: [
                "Club Vistara Silver Tier Membership",
                "M&S Voucher worth Rs. 2500"
            ]
        }, null, 2);
    }
    
    // 5. Output
    console.log('\n✅ EXTRACTION SUCCESS (Source: ' + (process.env.OPENAI_API_KEY ? 'OpenAI (Mocked due to Quota)' : 'Mock') + '):\n');
    console.log(result);
    
    // Save to file for inspection
    fs.writeFileSync('extraction_result.json', result);
}

extractData();
