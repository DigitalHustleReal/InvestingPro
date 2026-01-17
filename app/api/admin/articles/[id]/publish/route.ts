import { NextRequest, NextResponse } from 'next/server';
import { articleService, type ArticleContent, type ArticleMetadata } from '@/lib/cms/article-service';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { factCheckArticle, formatFactCheckResult } from '@/lib/validation/fact-checker';
import { checkCompliance, formatComplianceResult } from '@/lib/compliance/regulatory-checker';

/**
 * POST /api/admin/articles/[id]/publish
 * Publish article (admin only)
 * Sets status to 'published' and updates published_at timestamp
 * 
 * NEW: Includes fact-checking and compliance validation before publish
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      logger.warn('Unauthorized article publish attempt', { articleId: id });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, metadata } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate content structure
    const articleContent: ArticleContent = {
      body_markdown: content.body_markdown || content.content || '',
      body_html: content.body_html || '',
      content: content.content || content.body_markdown || '', // Legacy
    };

    // Validate and prepare metadata
    const articleMetadata: Partial<ArticleMetadata> = metadata || {};

    // PHASE 1: FACT-CHECKING (URGENT - Compliance Risk)
    logger.info('Publish: Starting fact-check validation', { articleId: id });
    const fullContent = articleContent.body_markdown || articleContent.body_html || articleContent.content || '';
    const factCheckResult = await factCheckArticle(fullContent, {
      category: articleMetadata.category,
      title: articleMetadata.title,
      sources: metadata?.ai_metadata?.data_sources?.map((s: any) => s.source_url) || [],
    });

    // PHASE 1: COMPLIANCE CHECK (URGENT - Legal Risk)
    logger.info('Publish: Starting compliance validation', { articleId: id });
    const complianceResult = await checkCompliance(fullContent, {
      category: articleMetadata.category,
      title: articleMetadata.title,
      isPromotional: fullContent.toLowerCase().includes('apply now') || fullContent.toLowerCase().includes('click here'),
    });

    // Block publish if critical errors found
    const hasCriticalFactErrors = factCheckResult.errors.some(e => e.severity === 'critical');
    const hasCriticalComplianceErrors = complianceResult.violations.some(v => v.severity === 'critical');

    if (hasCriticalFactErrors || hasCriticalComplianceErrors) {
      logger.warn('Publish blocked: Critical validation errors', {
        articleId: id,
        factCheckErrors: factCheckResult.errors.filter(e => e.severity === 'critical').length,
        complianceViolations: complianceResult.violations.filter(v => v.severity === 'critical').length,
      });

      return NextResponse.json(
        {
          error: 'Publication blocked due to validation errors',
          factCheck: {
            isValid: factCheckResult.isValid,
            confidence: factCheckResult.confidence,
            errors: factCheckResult.errors,
            warnings: factCheckResult.warnings,
            message: formatFactCheckResult(factCheckResult),
          },
          compliance: {
            isCompliant: complianceResult.isCompliant,
            complianceScore: complianceResult.complianceScore,
            violations: complianceResult.violations,
            warnings: complianceResult.warnings,
            message: formatComplianceResult(complianceResult),
          },
          blocked: true,
        },
        { status: 400 }
      );
    }

    // Log warnings but allow publish (warnings are non-blocking)
    if (factCheckResult.warnings.length > 0 || complianceResult.warnings.length > 0) {
      logger.warn('Publish: Validation warnings (non-blocking)', {
        articleId: id,
        factCheckWarnings: factCheckResult.warnings.length,
        complianceWarnings: complianceResult.warnings.length,
      });
    }

    // Proceed with publish
    const result = await articleService.publishArticle(
      id,
      articleContent,
      articleMetadata
    );

    // Return success with validation results
    return NextResponse.json({
      ...result,
      validation: {
        factCheck: {
          isValid: factCheckResult.isValid,
          confidence: factCheckResult.confidence,
          warnings: factCheckResult.warnings,
          message: formatFactCheckResult(factCheckResult),
        },
        compliance: {
          isCompliant: complianceResult.isCompliant,
          complianceScore: complianceResult.complianceScore,
          warnings: complianceResult.warnings,
          recommendations: complianceResult.recommendations,
          message: formatComplianceResult(complianceResult),
        },
      },
    });
  } catch (error) {
    logger.error('Error publishing article', error as Error, { articleId: id });
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && errorMessage.includes('not found') ? 404 : 500 }
    );
  }
}
