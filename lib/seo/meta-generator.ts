/**
 * 🏷️ META DESCRIPTION GENERATOR
 * 
 * Generates SEO-optimized meta descriptions automatically
 * Target: 120-160 characters with keyword and CTA
 */

import OpenAI from 'openai';
import { logger } from '@/lib/logger';

export interface MetaDescriptionResult {
  metaDescription: string;
  length: number;
  isValid: boolean;          // true if 120-160 chars
  hasKeyword: boolean;
  hasCTA: boolean;
  suggestions: string[];
}

/**
 * Generate meta description using AI
 */
export async function generateMetaDescription(
  title: string,
  content: string,
  primaryKeyword?: string
): Promise<MetaDescriptionResult> {
  // Extract primary keyword from title if not provided
  const keyword = primaryKeyword || extractKeyword(title);
  
  // Try AI generation first
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const prompt = `Write a compelling meta description for this article:

Title: ${title}
Primary Keyword: ${keyword}

Requirements:
- Exactly 145-155 characters (strict limit)
- Include the keyword naturally
- Include a call-to-action (CTA) like "Learn how", "Discover", "Find out"
- Make it compelling and click-worthy
- Target audience: Indian professionals interested in finance
- Write ONLY the meta description, nothing else

Meta description:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100
    });
    
    const generated = response.choices[0].message.content?.trim() || '';
    
    if (generated.length > 0) {
      return validateMetaDescription(generated, keyword);
    }
  } catch (error) {
    logger.warn('AI generation failed, using fallback:', error);
  }
  
  // Fallback: Generate from content
  return generateMetaDescriptionFallback(title, content, keyword);
}

/**
 * Extract primary keyword from title
 */
function extractKeyword(title: string): string {
  // Remove common words and take first 3-4 meaningful words
  const stopWords = ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but', 'is', 'are', 'was', 'were'];
  
  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => !stopWords.includes(w) && w.length > 2);
  
  return words.slice(0, 3).join(' ');
}

/**
 * Fallback meta description generator (no AI)
 */
function generateMetaDescriptionFallback(
  title: string,
  content: string,
  keyword: string
): MetaDescriptionResult {
  // Extract first meaningful paragraph
  const textOnly = content.replace(/<[^>]*>/g, ' ').trim();
  const sentences = textOnly.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
  const firstSentence = sentences[0] || '';
  
  // Create description
  let description = `${firstSentence}. Learn about ${keyword} in India 2026.`;
  
  // Trim to 155 chars
  if (description.length > 155) {
    description = description.substring(0, 152) + '...';
  }
  
  return validateMetaDescription(description, keyword);
}

/**
 * Validate meta description quality
 */
function validateMetaDescription(
  description: string,
  keyword: string
): MetaDescriptionResult {
  const length = description.length;
  const isValid = length >= 120 && length <= 160;
  const hasKeyword = description.toLowerCase().includes(keyword.toLowerCase());
  
  // Check for CTAs
  const ctas = ['learn', 'discover', 'find out', 'compare', 'get', 'understand', 'explore'];
  const hasCTA = ctas.some(cta => description.toLowerCase().includes(cta));
  
  const suggestions: string[] = [];
  
  if (length < 120) {
    suggestions.push(`Too short (${length} chars). Add more detail. Target: 145-155 chars.`);
  } else if (length > 160) {
    suggestions.push(`Too long (${length} chars). Trim to max 160 chars.`);
  }
  
  if (!hasKeyword) {
    suggestions.push(`Include primary keyword: "${keyword}"`);
  }
  
  if (!hasCTA) {
    suggestions.push('Add a call-to-action (Learn, Discover, Compare, etc.)');
  }
  
  return {
    metaDescription: description,
    length,
    isValid,
    hasKeyword,
    hasCTA,
    suggestions
  };
}

/**
 * Generate meta description without AI (instant)
 */
export function generateMetaDescriptionQuick(
  title: string,
  content: string
): string {
  const keyword = extractKeyword(title);
  const result = generateMetaDescriptionFallback(title, content, keyword);
  return result.metaDescription;
}

/**
 * Test meta description generator
 */
export function testMetaGenerator() {
  logger.info('\n🏷️ META DESCRIPTION GENERATOR TEST\n');
  logger.info('='.repeat(60));
  
  const testCases = [
    {
      title: 'Best Credit Cards in India 2026',
      content: 'Finding the right credit card can save you thousands. This guide helps you compare rewards, cashback, and fees.'
    },
    {
      title: 'SIP Calculator - Plan Your Investments',
      content: 'Use our SIP calculator to plan your systematic investment plan. Calculate returns and see how your wealth grows over time.'
    }
  ];
  
  testCases.forEach((test, idx) => {
    const result = generateMetaDescriptionQuick(test.title, test.content);
    logger.info(`\nTest ${idx + 1}: ${test.title}`);
    logger.info(`  Generated: "${result}"`);
    logger.info(`  Length: ${result.length} chars ${result.length >= 120 && result.length <= 160 ? '✅' : '❌'}`);
  });
  
  logger.info('\n' + '='.repeat(60) + '\n');
}
