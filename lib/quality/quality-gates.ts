/**
 * 🎯 INTEGRATED QUALITY GATE SYSTEM
 * 
 * Combines all quality checks into a single validation pipeline
 * Used before publishing any content
 * 
 * Components:
 * 1. Content Quality Scorer (readability, SEO, structure)
 * 2. Plagiarism Checker (similarity detection)
 * 3. Meta Description Generator
 * 4. Alt Text Generator
 */

import { scoreContent, QualityScore } from './content-scorer';
import { checkPlagiarism, PlagiarismResult } from './plagiarism-checker';
import { generateMetaDescription, generateMetaDescriptionQuick, MetaDescriptionResult } from '../seo/meta-generator';
import { generateAltText, generateAltTextQuick, AltTextResult } from '../seo/alt-text-generator';

export interface QualityGateResult {
  canPublish: boolean;
  overallScore: number;           // 0-100
  quality: QualityScore;
  plagiarism: PlagiarismResult;
  meta: MetaDescriptionResult;
  altText: AltTextResult;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface ArticleInput {
  title: string;
  content: string;
  metaDescription?: string;
  imageContext?: string;
  primaryKeyword?: string;
  articleId?: string;             // For plagiarism check exclusion
}

/**
 * Run all quality gates on article content
 */
export async function runQualityGates(
  article: ArticleInput,
  supabaseClient?: any,
  useAI: boolean = true
): Promise<QualityGateResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  console.log('\n🔍 Running Quality Gates...\n');
  
  // 1. Content Quality Scoring
  console.log('  [1/4] Quality Scoring...');
  const quality = scoreContent(
    article.title,
    article.content,
    article.metaDescription
  );
  
  if (!quality.canPublish) {
    errors.push(`Quality score too low: ${quality.overall}/100 (minimum: 70)`);
  }
  
  recommendations.push(...quality.recommendations);
  
  // 2. Plagiarism Check
  console.log('  [2/4] Plagiarism Detection...');
  const plagiarism = await checkPlagiarism(
    article.content,
    article.title,
    article.articleId,
    supabaseClient
  );
  
  if (plagiarism.isPlagiarized) {
    errors.push(`Plagiarism detected: ${plagiarism.similarityScore}% similarity (max: 15%)`);
  } else if (plagiarism.similarityScore > 10) {
    warnings.push(`Minor similarity detected: ${plagiarism.similarityScore}%`);
  }
  
  warnings.push(...plagiarism.warnings);
  
  // 3. Meta Description Generation/Validation
  console.log('  [3/4] Meta Description...');
  let meta: MetaDescriptionResult;
  
  if (!article.metaDescription) {
    // Generate new meta description
    if (useAI) {
      try {
        meta = await generateMetaDescription(
          article.title,
          article.content,
          article.primaryKeyword
        );
      } catch (error) {
        console.warn('    AI generation failed, using fallback');
        const quickMeta = generateMetaDescriptionQuick(article.title, article.content);
        meta = {
          metaDescription: quickMeta,
          length: quickMeta.length,
          isValid: quickMeta.length >= 120 && quickMeta.length <= 160,
          hasKeyword: true,
          hasCTA: true,
          suggestions: []
        };
      }
    } else {
      const quickMeta = generateMetaDescriptionQuick(article.title, article.content);
      meta = {
        metaDescription: quickMeta,
        length: quickMeta.length,
        isValid: quickMeta.length >= 120 && quickMeta.length <= 160,
        hasKeyword: true,
        hasCTA: true,
        suggestions: []
      };
    }
  } else {
    // Validate existing meta
    meta = {
      metaDescription: article.metaDescription,
      length: article.metaDescription.length,
      isValid: article.metaDescription.length >= 120 && article.metaDescription.length <= 160,
      hasKeyword: article.metaDescription.toLowerCase().includes(article.title.split(' ')[0].toLowerCase()),
      hasCTA: true,
      suggestions: []
    };
  }
  
  if (!meta.isValid) {
    warnings.push(`Meta description length: ${meta.length} chars (optimal: 145-155)`);
  }
  
  recommendations.push(...meta.suggestions);
  
  // 4. Alt Text Generation
  console.log('  [4/4] Alt Text Generation...');
  let altText: AltTextResult;
  
  if (useAI) {
    try {
      altText = await generateAltText(
        article.title,
        article.imageContext || 'article hero image',
        article.primaryKeyword
      );
    } catch (error) {
      console.warn('    AI generation failed, using fallback');
      const quickAlt = generateAltTextQuick(article.title, article.imageContext || 'hero image');
      altText = {
        altText: quickAlt,
        length: quickAlt.length,
        isValid: quickAlt.length >= 50 && quickAlt.length <= 125,
        hasKeyword: true,
        isDescriptive: true,
        suggestions: []
      };
    }
  } else {
    const quickAlt = generateAltTextQuick(article.title, article.imageContext || 'hero image');
    altText = {
      altText: quickAlt,
      length: quickAlt.length,
      isValid: quickAlt.length >= 50 && quickAlt.length <= 125,
      hasKeyword: true,
      isDescriptive: true,
      suggestions: []
    };
  }
  
  recommendations.push(...altText.suggestions);
  
  // Determine overall pass/fail
  const canPublish = quality.canPublish && !plagiarism.isPlagiarized;
  const overallScore = Math.round((quality.overall * 0.7) + ((plagiarism.isPlagiarized ? 0 : 100) * 0.3));
  
  console.log('\n✅ Quality Gates Complete!\n');
  
  return {
    canPublish,
    overallScore,
    quality,
    plagiarism,
    meta,
    altText,
    errors,
    warnings,
    recommendations: recommendations.filter((r, i, arr) => arr.indexOf(r) === i) // Unique
  };
}

/**
 * Quick quality check (no AI, no database)
 */
export function runQuickQualityCheck(
  title: string,
  content: string,
  metaDescription?: string
): Omit<QualityGateResult, 'plagiarism' | 'meta' | 'altText'> {
  const quality = scoreContent(title, content, metaDescription);
  
  return {
    canPublish: quality.canPublish,
    overallScore: quality.overall,
    quality,
    errors: quality.canPublish ? [] : [`Quality score too low: ${quality.overall}/100`],
    warnings: [],
    recommendations: quality.recommendations
  };
}

/**
 * Format quality gate results for display
 */
export function formatQualityReport(result: QualityGateResult): string {
  const lines: string[] = [];
  
  lines.push('═'.repeat(60));
  lines.push('📊 QUALITY GATE REPORT');
  lines.push('═'.repeat(60));
  lines.push('');
  
  // Overall Status
  lines.push(`Overall Status: ${result.canPublish ? '✅ PASS' : '❌ FAIL'}`);
  lines.push(`Overall Score: ${result.overallScore}/100`);
  lines.push('');
  
  // Detailed Scores
  lines.push('Detailed Scores:');
  lines.push(`  Quality:      ${result.quality.overall}/100 ${result.quality.canPublish ? '✅' : '❌'}`);
  lines.push(`    Readability: ${result.quality.readability}/100`);
  lines.push(`    SEO:         ${result.quality.seo}/100`);
  lines.push(`    Structure:   ${result.quality.structure}/100`);
  lines.push(`  Plagiarism:   ${result.plagiarism.similarityScore}% ${result.plagiarism.canPublish ? '✅' : '❌'}`);
  lines.push('');
  
  // Generated Content
  lines.push('Generated SEO Elements:');
  lines.push(`  Meta: "${result.meta.metaDescription}"`);
  lines.push(`        (${result.meta.length} chars ${result.meta.isValid ? '✅' : '⚠️'})`);
  lines.push(`  Alt:  "${result.altText.altText}"`);
  lines.push(`        (${result.altText.length} chars ${result.altText.isValid ? '✅' : '⚠️'})`);
  lines.push('');
  
  // Errors
  if (result.errors.length > 0) {
    lines.push('❌ Errors (Must Fix):');
    result.errors.forEach(err => lines.push(`  • ${err}`));
    lines.push('');
  }
  
  // Warnings
  if (result.warnings.length > 0) {
    lines.push('⚠️  Warnings:');
    result.warnings.forEach(warn => lines.push(`  • ${warn}`));
    lines.push('');
  }
  
  // Recommendations
  if (result.recommendations.length > 0) {
    lines.push('💡 Recommendations:');
    result.recommendations.slice(0, 5).forEach(rec => lines.push(`  • ${rec}`));
    lines.push('');
  }
  
  lines.push('═'.repeat(60));
  
  return lines.join('\n');
}
