/**
 * AI Drafting System for Glossary Terms
 * 
 * STRICT RULES:
 * - AI drafts ONLY from factual data
 * - NO opinions
 * - NO recommendations
 * - Only factual explanations
 */

import OpenAI from 'openai';
import { logger } from '@/lib/logger';
import {
    validateAIContent,
    calculateConfidence,
    createChangeLog,
    generateSystemPrompt,
    type AIDataSource,
    type AIContentMetadata,
    ALLOWED_AI_OPERATIONS,
} from '@/lib/ai/constraints';

const openai = typeof window === 'undefined' && process.env.OPENAI_API_KEY 
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    : null;

export interface GlossaryDraftInput {
    term: string;
    full_form?: string;
    category: string;
    sources: Array<{
        name: string;
        url: string;
        type: 'regulatory' | 'official_site' | 'rbi' | 'sebi' | 'amfi' | 'scraped';
        verified: boolean;
        data?: string; // Factual data from source
    }>;
    related_calculators?: string[];
    related_guides?: string[];
}

export interface GlossaryDraftOutput {
    definition: string;
    why_it_matters: string;
    example_numeric: string;
    example_text?: string;
    related_terms: string[];
    ai_metadata: AIContentMetadata;
}

/**
 * Generate glossary term draft using AI (factual data only)
 */
export async function draftGlossaryTerm(input: GlossaryDraftInput): Promise<GlossaryDraftOutput> {
    if (!openai) {
        logger.warn('OpenAI API key not configured, returning mock draft');
        return getMockDraft(input);
    }

    try {
        // Build data sources for confidence calculation
        const dataSources: AIDataSource[] = input.sources.map(source => ({
            source_type: source.type === 'rbi' ? 'rbi' :
                        source.type === 'sebi' ? 'sebi' :
                        source.type === 'amfi' ? 'amfi' :
                        source.type === 'official_site' ? 'official_site' :
                        'scraped',
            source_name: source.name,
            source_url: source.url,
            last_verified: new Date().toISOString(),
            confidence: source.verified ? 0.9 : 0.7,
        }));

        // Build factual data context
        const factualData = input.sources
            .filter(s => s.data)
            .map(s => `Source: ${s.name} (${s.url})\nData: ${s.data}`)
            .join('\n\n');

        // Generate system prompt with strict constraints
        const systemPrompt = `You are a glossary term generator for InvestingPro.in, an Indian financial education platform.

ABSOLUTE RULES:
1. Use ONLY factual data provided in the sources
2. NO opinions, recommendations, or advice
3. NO subjective language
4. Use informational, educational tone only
5. Include numeric examples when possible
6. Explain "why it matters" factually

FORBIDDEN:
- "We recommend"
- "You should"
- "Best option"
- Any advisory language
- Subjective opinions

ALLOWED:
- "This term refers to..."
- "According to [source]..."
- "The data shows..."
- Factual explanations only

Generate a glossary entry based ONLY on the provided factual data.`;

        const userPrompt = `Create a glossary entry for: ${input.term}${input.full_form ? ` (${input.full_form})` : ''}

Category: ${input.category}

Factual Data from Sources:
${factualData || 'No specific data provided. Use general factual knowledge only.'}

${input.related_calculators?.length ? `Related Calculators: ${input.related_calculators.join(', ')}` : ''}
${input.related_guides?.length ? `Related Guides: ${input.related_guides.join(', ')}` : ''}

Requirements:
1. Definition: Clear, factual definition (max 200 words)
2. Why it matters: Factual explanation of importance (max 150 words)
3. Example (numeric): Provide a concrete numeric example with calculation
4. Example text: Brief explanation of the numeric example
5. Related terms: Suggest 2-5 related glossary terms (just term names, no URLs)

Return JSON format:
{
    "definition": "...",
    "why_it_matters": "...",
    "example_numeric": "...",
    "example_text": "...",
    "related_terms": ["term1", "term2"]
}`;

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3, // Low temperature for factual output
            max_tokens: 1500,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No content in OpenAI response');
        }

        const parsed = JSON.parse(content);

        // Validate AI output
        const validation = validateAIContent(
            `${parsed.definition} ${parsed.why_it_matters}`,
            'summarize_factual_data'
        );

        // Calculate confidence
        const confidence = calculateConfidence(dataSources);

        // Create change log
        const changeLog = [createChangeLog('created', [
            'AI draft generated',
            `Operation: summarize_factual_data`,
            validation.forbidden_phrases_found.length > 0 
                ? `Warning: ${validation.forbidden_phrases_found.length} forbidden phrase(s) found`
                : 'Content validated successfully'
        ], 'ai')];

        // Build AI metadata
        const aiMetadata: AIContentMetadata = {
            data_sources: dataSources,
            confidence,
            change_log: changeLog,
            generated_at: new Date().toISOString(),
            generated_by: 'ai',
            requires_review: true,
            review_status: 'pending',
            forbidden_phrases_found: validation.forbidden_phrases_found,
            allowed_operations: ['summarize_factual_data'],
        };

        return {
            definition: parsed.definition || '',
            why_it_matters: parsed.why_it_matters || '',
            example_numeric: parsed.example_numeric || '',
            example_text: parsed.example_text,
            related_terms: parsed.related_terms || [],
            ai_metadata: aiMetadata,
        };

    } catch (error: any) {
        logger.error('Error drafting glossary term', error as Error, { term: input.term });
        return getMockDraft(input);
    }
}

/**
 * Mock draft for when AI is not available
 */
function getMockDraft(input: GlossaryDraftInput): GlossaryDraftOutput {
    const confidence = calculateConfidence(
        input.sources.map(s => ({
            source_type: 'scraped' as const,
            source_name: s.name,
            source_url: s.url,
            last_verified: new Date().toISOString(),
            confidence: 0.7,
        }))
    );

    return {
        definition: `${input.term} is a financial term that requires factual definition based on verified sources.`,
        why_it_matters: `Understanding ${input.term} is important for making informed financial decisions.`,
        example_numeric: 'Example calculation will be provided after review.',
        example_text: 'This example demonstrates the concept numerically.',
        related_terms: [],
        ai_metadata: {
            data_sources: input.sources.map(s => ({
                source_type: 'scraped' as const,
                source_name: s.name,
                source_url: s.url,
                last_verified: new Date().toISOString(),
                confidence: 0.7,
            })),
            confidence,
            change_log: [createChangeLog('created', ['Mock draft created'], 'ai')],
            generated_at: new Date().toISOString(),
            generated_by: 'ai',
            requires_review: true,
            review_status: 'pending',
            forbidden_phrases_found: [],
            allowed_operations: ['summarize_factual_data'],
        },
    };
}

