/**
 * AI Operation Helpers
 * 
 * Wrapper functions for allowed AI operations with strict constraints
 */

import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import type { AIDataSource, AIContentMetadata } from './constraints';

/**
 * Summarize factual data from verified sources
 */
export async function summarizeFactualData({
    data,
    dataSources,
    context
}: {
    data: any;
    dataSources: AIDataSource[];
    context?: string;
}): Promise<{
    summary: string;
    ai_metadata: AIContentMetadata;
}> {
    const prompt = `Summarize the following factual data in an informative, neutral tone.
    
${context ? `Context: ${context}\n` : ''}
Data to summarize:
${JSON.stringify(data, null, 2)}

Requirements:
- Use only factual information from the provided data
- Do not add opinions or recommendations
- Include key metrics and facts
- Use neutral, educational language
- Cite data sources`;

    const result = await api.integrations.Core.InvokeLLM({
        prompt,
        operation: 'summarize_factual_data',
        contextData: data,
        dataSources,
        citations: dataSources.map(ds => ds.source_url || ds.source_name)
    });

    return {
        summary: result.content || '',
        ai_metadata: result.ai_metadata
    };
}

/**
 * Explain a formula or calculation
 */
export async function explainFormula({
    formula,
    formulaName,
    example,
    dataSources
}: {
    formula: string;
    formulaName: string;
    example?: any;
    dataSources: AIDataSource[];
}): Promise<{
    explanation: string;
    ai_metadata: AIContentMetadata;
}> {
    const prompt = `Explain the following financial formula in simple, educational terms.

Formula Name: ${formulaName}
Formula: ${formula}
${example ? `Example Calculation:\n${JSON.stringify(example, null, 2)}` : ''}

Requirements:
- Explain what the formula calculates
- Break down each component
- Use simple language suitable for beginners
- Do not provide investment advice
- Use educational, neutral tone`;

    const result = await api.integrations.Core.InvokeLLM({
        prompt,
        operation: 'explain_formula',
        contextData: { formula, formulaName, example },
        dataSources,
        citations: dataSources.map(ds => ds.source_url || ds.source_name)
    });

    return {
        explanation: result.content || '',
        ai_metadata: result.ai_metadata
    };
}

/**
 * Generate FAQs from content
 */
export async function generateFAQs({
    content,
    topic,
    dataSources
}: {
    content: string;
    topic: string;
    dataSources: AIDataSource[];
}): Promise<{
    faqs: Array<{ question: string; answer: string }>;
    ai_metadata: AIContentMetadata;
}> {
    const prompt = `Generate frequently asked questions (FAQs) based on the following content.

Topic: ${topic}

Content:
${content}

Requirements:
- Generate 5-10 relevant FAQs
- Answers must be based only on the provided content
- Use neutral, informative language
- Do not provide financial advice
- Format as JSON array: [{"question": "...", "answer": "..."}]`;

    const result = await api.integrations.Core.InvokeLLM({
        prompt,
        operation: 'generate_faqs',
        contextData: { content, topic },
        dataSources,
        citations: dataSources.map(ds => ds.source_url || ds.source_name)
    });

    // Parse FAQs from response
    let faqs: Array<{ question: string; answer: string }> = [];
    try {
        const parsed = typeof result.content === 'string' ? JSON.parse(result.content) : result.content;
        faqs = parsed.faqs || parsed || [];
    } catch (error) {
        logger.error('Error parsing FAQs from AI response', error as Error);
    }

    return {
        faqs,
        ai_metadata: result.ai_metadata
    };
}

/**
 * Generate metadata (title, description, tags)
 */
export async function generateMetadata({
    content,
    topic,
    dataSources
}: {
    content: string;
    topic: string;
    dataSources: AIDataSource[];
}): Promise<{
    seo_title: string;
    seo_description: string;
    tags: string[];
    ai_metadata: AIContentMetadata;
}> {
    const prompt = `Generate SEO metadata for the following content.

Topic: ${topic}

Content:
${content.substring(0, 2000)}...

Requirements:
- Generate an SEO-optimized title (50-60 characters)
- Generate an SEO meta description (150-160 characters)
- Generate 5-10 relevant tags
- Focus on Indian financial market keywords
- Format as JSON: {"seo_title": "...", "seo_description": "...", "tags": [...]}`;

    const result = await api.integrations.Core.InvokeLLM({
        prompt,
        operation: 'generate_metadata',
        contextData: { content, topic },
        dataSources,
        citations: dataSources.map(ds => ds.source_url || ds.source_name)
    });

    // Parse metadata from response
    let seo_title = topic;
    let seo_description = `Learn about ${topic} on InvestingPro.in`;
    let tags: string[] = [];

    try {
        const parsed = typeof result.content === 'string' ? JSON.parse(result.content) : result.content;
        seo_title = parsed.seo_title || parsed.title || seo_title;
        seo_description = parsed.seo_description || parsed.description || seo_description;
        tags = parsed.tags || [];
    } catch (error) {
        logger.error('Error parsing metadata from AI response', error as Error);
    }

    return {
        seo_title,
        seo_description,
        tags,
        ai_metadata: result.ai_metadata
    };
}

