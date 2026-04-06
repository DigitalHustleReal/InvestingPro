/**
 * API Route: Content Strategy - Gap Analysis
 *
 * Purpose: Provide content gap data and opportunity scoring
 *
 * Endpoints:
 * - GET: Get content gaps and opportunities
 * - POST: Analyze specific category or keywords
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  contentGapAnalyzer,
  analyzeContentGaps,
  getCategoryCoverage,
  getHighPriorityGaps,
} from "@/lib/intelligence/content-gap-analyzer";
import {
  opportunityScorer,
  discoverCategoryOpportunities,
} from "@/lib/intelligence/opportunity-scorer";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

// ============================================
// GET - Get gaps and opportunities
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type") || "overview";
    const limit = parseInt(searchParams.get("limit") || "20");

    // Overview - get all high-priority gaps
    if (type === "overview" || !category) {
      const [highPriorityGaps, categoryCoverage] = await Promise.all([
        getHighPriorityGaps(limit),
        getCategoryCoverage(),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          highPriorityGaps,
          categoryCoverage,
          totalGaps: highPriorityGaps.length,
          summary: {
            categoriesAnalyzed: categoryCoverage.length,
            avgCoverage: Math.round(
              categoryCoverage.reduce(
                (sum, c) => sum + c.coveragePercentage,
                0,
              ) / categoryCoverage.length,
            ),
            highGrowthCategories: categoryCoverage
              .filter((c) => c.growthPotential === "high")
              .map((c) => c.category),
          },
        },
        analyzedAt: new Date().toISOString(),
      });
    }

    // Category-specific analysis
    if (type === "category") {
      const gapAnalysis = await analyzeContentGaps(category);
      const opportunities = await discoverCategoryOpportunities(category);

      return NextResponse.json({
        success: true,
        data: {
          gapAnalysis,
          opportunities: opportunities.slice(0, limit),
          summary: {
            totalGaps: gapAnalysis.totalGaps,
            coverageScore: gapAnalysis.coverageScore,
            highPriorityCount: gapAnalysis.highPriorityGaps,
            topOpportunity: opportunities[0]?.keyword || null,
          },
        },
        analyzedAt: new Date().toISOString(),
      });
    }

    // Opportunities only
    if (type === "opportunities") {
      const opportunities = await discoverCategoryOpportunities(category);

      return NextResponse.json({
        success: true,
        data: {
          opportunities: opportunities.slice(0, limit),
          category,
        },
        analyzedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid type parameter" },
      { status: 400 },
    );
  } catch (error) {
    logger.error("Error in strategy gaps API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze content gaps" },
      { status: 500 },
    );
  }
}

// ============================================
// POST - Analyze specific keywords
// ============================================

export async function POST(request: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const body = await request.json();
    const { action, category, keywords } = body;

    // Analyze category
    if (action === "analyzeCategory" && category) {
      const [gapAnalysis, opportunities] = await Promise.all([
        analyzeContentGaps(category),
        discoverCategoryOpportunities(category),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          gapAnalysis,
          opportunities,
        },
      });
    }

    // Score keywords
    if (action === "scoreKeywords" && keywords && Array.isArray(keywords)) {
      const result = await opportunityScorer.scoreOpportunities(
        keywords.map((k: string) => ({ keyword: k, category })),
        { category },
      );

      return NextResponse.json({
        success: true,
        data: {
          opportunities: result.opportunities,
          topPicks: result.topPicks,
          quickWins: result.quickWins,
          totalEstimatedRevenue: result.totalEstimatedRevenue,
        },
      });
    }

    // Discover opportunities
    if (action === "discover" && category) {
      const keywords = await opportunityScorer.discoverOpportunities(category);
      const result = await opportunityScorer.scoreOpportunities(keywords, {
        category,
      });

      return NextResponse.json({
        success: true,
        data: {
          opportunities: result.opportunities,
          topPicks: result.topPicks,
          quickWins: result.quickWins,
          highValueTargets: result.highValueTargets,
          categoryBreakdown: result.categoryBreakdown,
          totalEstimatedRevenue: result.totalEstimatedRevenue,
        },
      });
    }

    // Compare coverage
    if (action === "compareCoverage") {
      const coverage = await getCategoryCoverage();

      return NextResponse.json({
        success: true,
        data: {
          coverage,
          summary: {
            totalCategories: coverage.length,
            avgCoverage: Math.round(
              coverage.reduce((sum, c) => sum + c.coveragePercentage, 0) /
                coverage.length,
            ),
            lowestCoverage: coverage.reduce((min, c) =>
              c.coveragePercentage < min.coveragePercentage ? c : min,
            ),
          },
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    logger.error("Error in strategy gaps POST:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 },
    );
  }
}
