/**
 * Glossary Enrichment Service
 * 
 * AI-powered service to transform basic glossary terms into
 * Investopedia-style rich content with examples, use cases, and related content.
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { api } from '@/lib/api';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface BasicTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  slug: string;
}

interface EnrichedContent {
  extended_definition: string; // 200-300 words
  why_it_matters: string; // 150 words
  example_numeric: string; // With calculations
  example_text: string; // Explanation
  how_to_use: string; // Practical guide
  common_mistakes: string[]; // 3-5 mistakes
  related_terms: string[]; // 3-5 related terms
  related_calculators: string[]; // Applicable calculators
  seo_title: string;
  seo_description: string;
  meta_keywords: string[];
}

/**
 * Generate rich content for a glossary term using AI
 */
export async function enrichGlossaryTerm(basicTerm: BasicTerm): Promise<EnrichedContent> {
  const prompt = `
You are a financial education expert creating Investopedia-style content for Indian investors.

Term: ${basicTerm.term}
Category: ${basicTerm.category}
Current Definition: ${basicTerm.definition}

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
    const result = await api.integrations.Core.InvokeLLM({
      prompt,
      operation: 'glossary_enrichment',
      contextData: basicTerm
    });

    return result as EnrichedContent;
  } catch (error) {
    logger.error(`Error enriching term "${basicTerm.term}":`, error);
    
    // Fallback to basic enrichment
    return {
      extended_definition: basicTerm.definition,
      why_it_matters: `Understanding ${basicTerm.term} is crucial for making informed financial decisions in India.`,
      example_numeric: `Example: ${basicTerm.term} in practice`,
      example_text: 'Detailed example pending AI generation.',
      how_to_use: `Use ${basicTerm.term} when making financial decisions related to ${basicTerm.category}.`,
      common_mistakes: ['Not understanding the full implications', 'Ignoring associated costs'],
      related_terms: [],
      related_calculators: [],
      seo_title: `${basicTerm.term} - Definition & Examples | InvestingPro`,
      seo_description: `Learn about ${basicTerm.term}: ${basicTerm.definition.substring(0, 100)}...`,
      meta_keywords: [basicTerm.term, basicTerm.category, 'India', 'finance']
    };
  }
}

/**
 * Update a glossary term with enriched content
 */
export async function updateTermWithEnrichedContent(
  termId: string,
  enriched: EnrichedContent
): Promise<void> {
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
    throw new Error(`Failed to update term: ${error.message}`);
  }
}

/**
 * Enrich a single term (for testing)
 */
export async function enrichSingleTerm(slug: string): Promise<void> {
  const { data: term, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !term) {
    throw new Error(`Term not found: ${slug}`);
  }

  logger.info(`🔄 Enriching: ${term.term}...`);
  
  const enriched = await enrichGlossaryTerm(term);
  await updateTermWithEnrichedContent(term.id, enriched);
  
  logger.info(`✅ Enriched: ${term.term}`);
}

/**
 * Batch enrich all terms
 */
export async function enrichAllTerms(batchSize: number = 5): Promise<void> {
  const { data: terms, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('is_ai_generated', false)
    .order('term');

  if (error || !terms) {
    throw new Error('Failed to fetch terms');
  }

  logger.info(`📊 Found ${terms.length} terms to enrich\n`);

  let enriched = 0;
  let failed = 0;

  // Process in batches to avoid rate limits
  for (let i = 0; i < terms.length; i += batchSize) {
    const batch = terms.slice(i, i + batchSize);
    
    logger.info(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(terms.length / batchSize)}`);
    
    await Promise.all(
      batch.map(async (term) => {
        try {
          logger.info(`  🔄 ${term.term}...`);
          const enrichedContent = await enrichGlossaryTerm(term);
          await updateTermWithEnrichedContent(term.id, enrichedContent);
          logger.info(`  ✅ ${term.term}`);
          enriched++;
        } catch (error) {
          logger.error(`  ❌ ${term.term}:`, error);
          failed++;
        }
      })
    );

    // Wait between batches to respect rate limits
    if (i + batchSize < terms.length) {
      logger.info('  ⏳ Waiting 5 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  logger.info('\n═══════════════════════════════════════');
  logger.info('📊 ENRICHMENT COMPLETE');
  logger.info('═══════════════════════════════════════');
  logger.info(`✅ Successfully enriched: ${enriched} terms`);
  logger.info(`❌ Failed: ${failed} terms`);
  logger.info(`📚 Total: ${terms.length} terms`);
}
