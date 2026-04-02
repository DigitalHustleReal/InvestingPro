/**
 * 🖼️ IMAGE ALT TEXT GENERATOR
 * 
 * Generates descriptive, SEO-optimized alt text for images
 * Improves accessibility and SEO
 */

import OpenAI from 'openai';
import { logger } from '@/lib/logger';

export interface AltTextResult {
  altText: string;
  length: number;
  isValid: boolean;          // true if 50-125 chars
  hasKeyword: boolean;
  isDescriptive: boolean;
  suggestions: string[];
}

/**
 * Generate alt text using AI
 */
export async function generateAltText(
  articleTitle: string,
  imageContext?: string,
  primaryKeyword?: string
): Promise<AltTextResult> {
  const keyword = primaryKeyword || extractKeyword(articleTitle);
  const context = imageContext || 'article hero image';
  
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const prompt = `Generate descriptive alt text for an image in this article:

Article: ${articleTitle}
Image Context: ${context}
Keyword: ${keyword}

Requirements:
- 50-100 characters (optimal length)
- Describe what's in the image clearly
- Include keyword naturally if relevant
- Be specific and descriptive
- Avoid "image of" or "picture of"
- Target: SEO + accessibility

Write ONLY the alt text:`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 50
    });
    
    const generated = response.choices[0].message.content?.trim() || '';
    
    if (generated.length > 0) {
      return validateAltText(generated, keyword);
    }
  } catch (error: any) {
    logger.warn('AI generation failed, using fallback:', error);
  }
  
  // Fallback
  return generateAltTextFallback(articleTitle, keyword, context);
}

/**
 * Extract keyword from title
 */
function extractKeyword(title: string): string {
  const stopWords = ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but'];
  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => !stopWords.includes(w) && w.length > 2);
  
  return words.slice(0, 3).join(' ');
}

/**
 * Fallback alt text generator
 */
function generateAltTextFallback(
  title: string,
  keyword: string,
  context: string
): AltTextResult {
  // Generate descriptive alt text based on context
  let altText = '';
  
  if (context.includes('chart') || context.includes('graph')) {
    altText = `Chart showing ${keyword} data and trends`;
  } else if (context.includes('calculator')) {
    altText = `${keyword} calculator tool screenshot`;
  } else if (context.includes('comparison')) {
    altText = `${keyword} comparison table`;
  } else if (context.includes('infographic')) {
    altText = `Infographic explaining ${keyword}`;
  } else {
    altText = `Visual guide to ${keyword}`;
  }
  
  // Trim if needed
  if (altText.length > 125) {
    altText = altText.substring(0, 122) + '...';
  }
  
  return validateAltText(altText, keyword);
}

/**
 * Validate alt text quality
 */
function validateAltText(
  altText: string,
  keyword: string
): AltTextResult {
  const length = altText.length;
  const isValid = length >= 50 && length <= 125;
  const hasKeyword = altText.toLowerCase().includes(keyword.toLowerCase().split(' ')[0]);
  
  // Check if descriptive (has specific words)
  const descriptiveWords = ['showing', 'displaying', 'illustrating', 'comparing', 'explaining', 'guide', 'chart', 'graph', 'table', 'calculator'];
  const isDescriptive = descriptiveWords.some(word => altText.toLowerCase().includes(word));
  
  const suggestions: string[] = [];
  
  if (length < 50) {
    suggestions.push(`Too short (${length} chars). Be more descriptive. Target: 50-100 chars.`);
  } else if (length > 125) {
    suggestions.push(`Too long (${length} chars). Keep under 125 chars for best results.`);
  }
  
  if (!hasKeyword) {
    suggestions.push(`Include keyword: "${keyword}"`);
  }
  
  if (!isDescriptive) {
    suggestions.push('Make it more descriptive (what does the image show?)');
  }
  
  // Check for bad patterns
  if (altText.toLowerCase().match(/^(image|picture|photo) (of|showing)/)) {
    suggestions.push('Avoid starting with "image of" or "picture of"');
  }
  
  return {
    altText,
    length,
    isValid,
    hasKeyword,
    isDescriptive,
    suggestions
  };
}

/**
 * Generate alt text without AI (instant)
 */
export function generateAltTextQuick(
  articleTitle: string,
  imageContext: string = 'hero image'
): string {
  const keyword = extractKeyword(articleTitle);
  const result = generateAltTextFallback(articleTitle, keyword, imageContext);
  return result.altText;
}

/**
 * Generate alt text for common image types
 */
export function generateAltTextByType(
  articleTitle: string,
  imageType: 'hero' | 'chart' | 'calculator' | 'comparison' | 'infographic' | 'screenshot'
): string {
  const keyword = extractKeyword(articleTitle);
  
  const templates = {
    hero: `Visual guide to ${keyword} in India`,
    chart: `Chart showing ${keyword} growth and performance data`,
    calculator: `Interactive ${keyword} calculator interface`,
    comparison: `Side-by-side comparison of ${keyword} options`,
    infographic: `Infographic explaining ${keyword} concepts`,
    screenshot: `Screenshot of ${keyword} example`
  };
  
  return templates[imageType];
}

/**
 * Test alt text generator
 */
export function testAltTextGenerator() {
  logger.info('\n🖼️ ALT TEXT GENERATOR TEST\n');
  logger.info('='.repeat(60));
  
  const testCases = [
    {
      title: 'Best Credit Cards in India 2026',
      context: 'comparison chart'
    },
    {
      title: 'SIP Calculator - Investment Planning',
      context: 'calculator screenshot'
    },
    {
      title: 'How to Choose Mutual Funds',
      context: 'infographic'
    }
  ];
  
  testCases.forEach((test, idx) => {
    const result = generateAltTextQuick(test.title, test.context);
    logger.info(`\nTest ${idx + 1}: ${test.title} (${test.context})`);
    logger.info(`  Alt Text: "${result}"`);
    logger.info(`  Length: ${result.length} chars ${result.length >= 50 && result.length <= 125 ? '✅' : '❌'}`);
  });
  
  logger.info('\n' + '='.repeat(60) + '\n');
}
