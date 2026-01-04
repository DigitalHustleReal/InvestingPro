/**
 * Quick test script to generate first 5 glossary terms
 * Run: npx tsx scripts/test-glossary-generation.ts
 */

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

const testTerms = [
    'Credit Limit',
    'Annual Percentage Rate (APR)',
    'EMI (Equated Monthly Installment)',
    'Grace Period',
    'Cashback'
];

async function generateGlossaryTerm(term: string, category: string) {
    const prompt = `You are a financial expert writing glossary definitions for an Indian financial platform.

Generate a comprehensive glossary entry for the term: "${term}"
Category: ${category}

Provide the following in JSON format:
{
  "term": "${term}",
  "definition": "A clear, concise definition in 50-100 words",
  "detailedExplanation": "A detailed explanation in 200-300 words covering what it is, how it works, and why it matters in the Indian context",
  "example": "A practical example showing how this term applies in India, using Indian Rupees (₹) where applicable",
  "relatedTerms": ["term1", "term2", "term3"],
  "searchKeywords": ["keyword1", "keyword2"]
}

Make sure to:
1. Use Indian context (₹, Indian banks, Indian regulations where relevant)
2. Be accurate and factual
3. Use simple language for beginners
4. Include specific examples with numbers`;

    try {
        console.log(`\n📝 Generating: ${term}...`);
        
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert financial educator specializing in Indian financial markets and products.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        const parsed = JSON.parse(content);
        
        console.log(`✅ Generated: ${term}`);
        console.log(`   Definition: ${parsed.definition.substring(0, 100)}...`);
        
        return parsed;
    } catch (error) {
        console.error(`❌ Error generating "${term}":`, error);
        throw error;
    }
}

async function main() {
    console.log('🚀 Testing AI Glossary Generation');
    console.log('==================================\n');
    
    if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OPENAI_API_KEY not found in environment variables');
        console.error('   Please add it to .env.local file');
        process.exit(1);
    }
    
    console.log('✅ OpenAI API Key found');
    console.log(`📊 Generating ${testTerms.length} test terms...\n`);
    
    const results = [];
    
    for (const term of testTerms) {
        try {
            const result = await generateGlossaryTerm(term, 'credit-cards');
            results.push(result);
            
            // Wait 2 seconds between calls to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`Failed to generate "${term}"`);
        }
    }
    
    console.log('\n=====================================');
    console.log('🎉 Generation Complete!');
    console.log(`✅ Successfully generated: ${results.length}/${testTerms.length} terms`);
    
    console.log('\n📋 Sample Output:');
    console.log('=================');
    if (results.length > 0) {
        const sample = results[0];
        console.log(`\nTerm: ${sample.term}`);
        console.log(`\nDefinition:`);
        console.log(sample.definition);
        console.log(`\nExample:`);
        console.log(sample.example);
        console.log(`\nRelated Terms: ${sample.relatedTerms.join(', ')}`);
    }
    
    console.log('\n💡 Next Steps:');
    console.log('1. Review the generated content above');
    console.log('2. If quality is good, proceed with full batch (100 terms)');
    console.log('3. Set up Supabase tables to store results');
    
    // Save to JSON file
    const fs = require('fs');
    fs.writeFileSync(
        'glossary-test-output.json',
        JSON.stringify(results, null, 2)
    );
    console.log('\n💾 Results saved to: glossary-test-output.json');
}

main().catch(console.error);
