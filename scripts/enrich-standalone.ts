/**
 * Standalone Glossary Enrichment Script
 * 
 * Run with: npx tsx scripts/enrich-standalone.ts [slug]
 * 
 * This is a standalone version that doesn't rely on Next.js path aliases
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!geminiKey) {
  console.error('❌ Missing GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface EnrichedContent {
  extended_definition: string;
  why_it_matters: string;
  example_numeric: string;
  example_text: string;
  how_to_use: string;
  common_mistakes: string[];
  related_terms: string[];
  related_calculators: string[];
  seo_title: string;
  seo_description: string;
  meta_keywords: string[];
}

async function callGeminiAPI(prompt: string): Promise<any> {
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('No response from Gemini');
  }

  // Clean and parse JSON
  let cleanText = text.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\\s*/, '').replace(/\\s*```$/, '');
  }

  return JSON.parse(cleanText);
}

async function enrichTerm(term: any): Promise<EnrichedContent> {
  const prompt = `
You are a financial education expert creating Investopedia-style content for Indian investors.

Term: ${term.term}
Category: ${term.category}
Current Definition: ${term.definition}

Create comprehensive, educational content following this structure:

1. EXTENDED DEFINITION (200-300 words):
   - Expand the definition with more context
   - Explain technical aspects in simple language
   - Include Indian market context where relevant
   - Use examples from Indian financial products

2. WHY IT MATTERS (150 words):
   - Explain practical importance for Indian investors
   - Real-world impact on financial decisions
   - How it affects returns, taxes, or risk

3. NUMERIC EXAMPLE:
   - Step-by-step calculation with Indian Rupees
   - Show the math clearly
   - Use realistic Indian market numbers
   - Format as a worked example

4. EXAMPLE EXPLANATION:
   - Explain what the numbers mean
   - Practical interpretation
   - Key takeaways

5. HOW TO USE:
   - Practical guide for investors
   - When to apply this concept
   - Action steps

6. COMMON MISTAKES (3-5 points):
   - What investors often get wrong
   - Misconceptions to avoid
   - Warning signs

7. RELATED TERMS (3-5 terms):
   - Other glossary terms that connect to this
   - Terms investors should learn next

8. RELATED CALCULATORS:
   - Which calculators on our platform apply
   - Choose from: sip, lumpsum, swp, stp, retirement, ppf, nps, fd, tax, goal-planning, home-loan-vs-sip, inflation-adjusted-returns

9. SEO:
   - Title (60 chars): Optimized for search
   - Description (160 chars): Compelling meta description
   - Keywords (5-7): Relevant search terms

Return ONLY valid JSON with this structure:
{
  "extended_definition": "...",
  "why_it_matters": "...",
  "example_numeric": "...",
  "example_text": "...",
  "how_to_use": "...",
  "common_mistakes": ["...", "..."],
  "related_terms": ["...", "..."],
  "related_calculators": ["sip", "..."],
  "seo_title": "...",
  "seo_description": "...",
  "meta_keywords": ["...", "..."]
}
`;

  try {
    const result = await callGeminiAPI(prompt);
    return result;
  } catch (error) {
    console.error(`Error calling Gemini:`, error);
    
    // Fallback
    return {
      extended_definition: term.definition,
      why_it_matters: `Understanding ${term.term} is crucial for making informed financial decisions in India.`,
      example_numeric: `Example: ${term.term} in practice with Indian Rupees`,
      example_text: 'Detailed example will be generated.',
      how_to_use: `Use ${term.term} when making financial decisions related to ${term.category}.`,
      common_mistakes: ['Not understanding the full implications', 'Ignoring associated costs'],
      related_terms: [],
      related_calculators: [],
      seo_title: `${term.term} - Definition & Examples | InvestingPro`,
      seo_description: `Learn about ${term.term}: ${term.definition.substring(0, 100)}...`,
      meta_keywords: [term.term, term.category, 'India', 'finance']
    };
  }
}

async function updateTerm(termId: string, enriched: EnrichedContent) {
  const { error } = await supabase
    .from('glossary_terms')
    .update({
      definition: enriched.extended_definition,
      why_it_matters: enriched.why_it_matters,
      example_numeric: enriched.example_numeric,
      example_text: enriched.example_text,
      how_to_use: enriched.how_to_use,
      common_mistakes: enriched.common_mistakes,
      related_terms: enriched.related_terms,
      related_calculators: enriched.related_calculators,
      seo_title: enriched.seo_title,
      seo_description: enriched.seo_description,
      meta_keywords: enriched.meta_keywords,
      is_ai_generated: true,
      requires_review: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', termId);

  if (error) {
    throw new Error(`Failed to update: ${error.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Enrich single term
    const slug = args[0];
    console.log(`🎯 Enriching single term: ${slug}\\n`);
    
    const { data: term, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !term) {
      console.error(`❌ Term not found: ${slug}`);
      process.exit(1);
    }

    console.log(`📝 Term: ${term.term}`);
    console.log(`📂 Category: ${term.category}`);
    console.log(`🔄 Generating rich content...\\n`);

    const enriched = await enrichTerm(term);
    await updateTerm(term.id, enriched);

    console.log(`\\n✅ Successfully enriched: ${term.term}`);
    console.log(`\\n📊 Generated content:`);
    console.log(`   - Definition: ${enriched.extended_definition.substring(0, 100)}...`);
    console.log(`   - Why it matters: ${enriched.why_it_matters.substring(0, 100)}...`);
    console.log(`   - Related calculators: ${enriched.related_calculators.join(', ')}`);
    console.log(`   - Related terms: ${enriched.related_terms.join(', ')}`);
    
  } else {
    // Enrich all terms
    console.log('🌱 Starting batch enrichment...\\n');
    
    const { data: terms, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .eq('is_ai_generated', false)
      .order('term');

    if (error || !terms) {
      console.error('❌ Failed to fetch terms');
      process.exit(1);
    }

    console.log(`📊 Found ${terms.length} terms to enrich\\n`);

    let enriched = 0;
    let failed = 0;
    const batchSize = 3;

    for (let i = 0; i < terms.length; i += batchSize) {
      const batch = terms.slice(i, i + batchSize);
      
      console.log(`\\n📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(terms.length / batchSize)}`);
      
      for (const term of batch) {
        try {
          console.log(`  🔄 ${term.term}...`);
          const enrichedContent = await enrichTerm(term);
          await updateTerm(term.id, enrichedContent);
          console.log(`  ✅ ${term.term}`);
          enriched++;
        } catch (error: any) {
          console.error(`  ❌ ${term.term}:`, error.message);
          failed++;
        }
      }

      if (i + batchSize < terms.length) {
        console.log('  ⏳ Waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log('\\n═══════════════════════════════════════');
    console.log('📊 ENRICHMENT COMPLETE');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Successfully enriched: ${enriched} terms`);
    console.log(`❌ Failed: ${failed} terms`);
    console.log(`📚 Total: ${terms.length} terms\\n`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
