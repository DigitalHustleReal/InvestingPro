/**
 * Content Gap Analyzer
 * 
 * Purpose: Identify content gaps by comparing your content library
 * against competitor coverage and search demand.
 * 
 * Features:
 * - Compare content coverage vs competitors
 * - Identify missing topics/keywords
 * - Detect underserved categories
 * - Priority scoring for gap filling
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export interface ContentGap {
  id: string;
  topic: string;
  keyword: string;
  category: string;
  gapType: 'missing' | 'weak' | 'outdated' | 'underserved';
  priority: 'high' | 'medium' | 'low';
  
  // Search metrics
  searchVolume?: number;
  difficulty?: number;
  
  // Competitor data
  competitorCount: number;
  competitorArticles: {
    competitor: string;
    url?: string;
    title?: string;
    estimatedTraffic?: number;
  }[];
  
  // Revenue potential
  revenuePotential: 'high' | 'medium' | 'low';
  estimatedMonthlyRevenue?: number;
  
  // Your coverage
  yourArticles: {
    id: string;
    title: string;
    score?: number;
    lastUpdated?: string;
  }[];
  
  // Recommendation
  recommendation: string;
  suggestedTitle?: string;
  
  // Metadata
  detectedAt: string;
  confidence: number;
}

export interface GapAnalysisResult {
  category: string;
  totalGaps: number;
  highPriorityGaps: number;
  gaps: ContentGap[];
  coverageScore: number; // 0-100
  competitorComparison: {
    competitor: string;
    articleCount: number;
    avgQuality?: number;
  }[];
  recommendations: string[];
  analyzedAt: string;
}

export interface CategoryCoverage {
  category: string;
  yourArticleCount: number;
  estimatedMarketSize: number;
  coveragePercentage: number;
  topMissingTopics: string[];
  growthPotential: 'high' | 'medium' | 'low';
}

// ============================================
// COMPETITOR DATA (Would be fetched from SERP API in production)
// ============================================

const COMPETITOR_DATA: Record<string, {
  name: string;
  strengths: string[];
  estimatedArticles: Record<string, number>;
}> = {
  'bankbazaar': {
    name: 'BankBazaar',
    strengths: ['credit-cards', 'loans', 'insurance'],
    estimatedArticles: {
      'credit-cards': 500,
      'loans': 400,
      'insurance': 300,
      'mutual-funds': 150,
    },
  },
  'paisabazaar': {
    name: 'PaisaBazaar',
    strengths: ['credit-cards', 'loans'],
    estimatedArticles: {
      'credit-cards': 450,
      'loans': 500,
      'insurance': 200,
      'mutual-funds': 100,
    },
  },
  'etmoney': {
    name: 'ET Money',
    strengths: ['mutual-funds', 'investing'],
    estimatedArticles: {
      'credit-cards': 100,
      'loans': 80,
      'insurance': 150,
      'mutual-funds': 400,
    },
  },
  'groww': {
    name: 'Groww',
    strengths: ['mutual-funds', 'stocks'],
    estimatedArticles: {
      'credit-cards': 50,
      'loans': 40,
      'insurance': 100,
      'mutual-funds': 350,
    },
  },
};

// Common topics that should be covered per category
const ESSENTIAL_TOPICS: Record<string, string[]> = {
  'credit-cards': [
    'best credit cards',
    'credit card for salary',
    'cashback credit cards',
    'travel credit cards',
    'fuel credit cards',
    'lifetime free credit cards',
    'credit card for students',
    'credit card comparison',
    'credit card rewards',
    'credit card eligibility',
    'credit card apply online',
    'credit card benefits',
    'lounge access credit cards',
    'premium credit cards',
    'credit card for beginners',
    'credit card vs debit card',
    'credit card limit increase',
    'credit card bill payment',
    'credit card EMI',
    'credit card offers',
  ],
  'mutual-funds': [
    'best mutual funds',
    'SIP investment',
    'ELSS funds',
    'tax saving funds',
    'index funds',
    'large cap funds',
    'mid cap funds',
    'small cap funds',
    'hybrid funds',
    'debt funds',
    'flexi cap funds',
    'mutual fund for beginners',
    'SIP calculator',
    'mutual fund returns',
    'best AMC',
    'mutual fund comparison',
    'direct vs regular funds',
    'mutual fund portfolio',
    'retirement funds',
    'children education funds',
  ],
  'loans': [
    'home loan',
    'personal loan',
    'car loan',
    'education loan',
    'business loan',
    'loan against property',
    'gold loan',
    'loan EMI calculator',
    'loan interest rates',
    'loan eligibility',
    'prepayment charges',
    'loan comparison',
    'best bank for loan',
    'loan for self employed',
    'loan without documents',
    'instant loan',
    'loan balance transfer',
  ],
  'insurance': [
    'term insurance',
    'health insurance',
    'life insurance',
    'car insurance',
    'bike insurance',
    'travel insurance',
    'family floater',
    'insurance premium calculator',
    'insurance claim process',
    'best insurance company',
    'insurance comparison',
    'insurance for senior citizens',
    'critical illness cover',
    'accidental cover',
  ],
  'taxes': [
    'income tax',
    'ITR filing',
    'tax deductions',
    'section 80C',
    'section 80D',
    'HRA exemption',
    'capital gains tax',
    'tax saving investments',
    'new tax regime',
    'old vs new tax regime',
    'TDS',
    'advance tax',
    'tax refund',
  ],
};

// ============================================
// CONTENT GAP ANALYZER CLASS
// ============================================

export class ContentGapAnalyzer {
  private supabase = createClient();

  // ============================================
  // MAIN ANALYSIS METHODS
  // ============================================

  /**
   * Analyze content gaps for a specific category
   */
  async analyzeCategory(category: string): Promise<GapAnalysisResult> {
    try {
      // Get your articles in this category
      const { data: yourArticles, error } = await this.supabase
        .from('articles')
        .select('id, title, slug, quality_score, updated_at, primary_keyword')
        .eq('category', category)
        .eq('status', 'published');

      if (error) throw error;

      const articles = yourArticles || [];
      const essentialTopics = ESSENTIAL_TOPICS[category] || [];

      // Identify gaps
      const gaps: ContentGap[] = [];

      // Check each essential topic
      for (const topic of essentialTopics) {
        const gap = this.analyzeTopicGap(topic, category, articles);
        if (gap) {
          gaps.push(gap);
        }
      }

      // Sort by priority
      gaps.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      // Calculate coverage score
      const coveredTopics = essentialTopics.filter(topic =>
        articles.some((a: any) => 
          a.title?.toLowerCase().includes(topic.toLowerCase()) ||
          a.primary_keyword?.toLowerCase().includes(topic.toLowerCase())
        )
      ).length;
      const coverageScore = Math.round((coveredTopics / essentialTopics.length) * 100);

      // Competitor comparison
      const competitorComparison = Object.entries(COMPETITOR_DATA).map(([, data]) => ({
        competitor: data.name,
        articleCount: data.estimatedArticles[category] || 0,
      }));

      // Generate recommendations
      const recommendations = this.generateCategoryRecommendations(gaps, coverageScore, category);

      return {
        category,
        totalGaps: gaps.length,
        highPriorityGaps: gaps.filter(g => g.priority === 'high').length,
        gaps,
        coverageScore,
        competitorComparison,
        recommendations,
        analyzedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error analyzing category gaps', error as Error);
      throw error;
    }
  }

  /**
   * Analyze a specific topic for gaps
   */
  private analyzeTopicGap(
    topic: string,
    category: string,
    articles: any[]
  ): ContentGap | null {
    const topicLower = topic.toLowerCase();

    // Find matching articles
    const matchingArticles = articles.filter(a =>
      a.title?.toLowerCase().includes(topicLower) ||
      a.primary_keyword?.toLowerCase().includes(topicLower) ||
      a.slug?.includes(topicLower.replace(/\s+/g, '-'))
    );

    // Check if gap exists
    let gapType: ContentGap['gapType'] | null = null;

    if (matchingArticles.length === 0) {
      gapType = 'missing';
    } else {
      // Check if existing articles are weak or outdated
      const avgScore = matchingArticles.reduce((sum, a) => sum + (a.quality_score || 60), 0) / matchingArticles.length;
      const oldestUpdate = Math.min(...matchingArticles.map(a => new Date(a.updated_at || a.created_at).getTime()));
      const monthsSinceUpdate = (Date.now() - oldestUpdate) / (30 * 24 * 60 * 60 * 1000);

      if (avgScore < 70) {
        gapType = 'weak';
      } else if (monthsSinceUpdate > 6) {
        gapType = 'outdated';
      } else if (matchingArticles.length < 2) {
        // Only one article for an important topic
        gapType = 'underserved';
      }
    }

    if (!gapType) return null;

    // Get competitor data
    const competitorArticles = Object.entries(COMPETITOR_DATA)
      .filter(([, data]) => data.strengths.includes(category))
      .map(([, data]) => ({
        competitor: data.name,
        title: `${topic} - ${data.name}`,
      }));

    // Calculate priority
    const priority = this.calculateGapPriority(gapType, competitorArticles.length, category, topic);

    // Estimate revenue
    const { revenuePotential, estimatedRevenue } = this.estimateRevenuePotential(category, topic);

    return {
      id: `gap_${category}_${topic.replace(/\s+/g, '_')}`,
      topic,
      keyword: topic,
      category,
      gapType,
      priority,
      competitorCount: competitorArticles.length,
      competitorArticles,
      revenuePotential,
      estimatedMonthlyRevenue: estimatedRevenue,
      yourArticles: matchingArticles.map(a => ({
        id: a.id,
        title: a.title,
        score: a.quality_score,
        lastUpdated: a.updated_at,
      })),
      recommendation: this.getGapRecommendation(gapType, topic, matchingArticles.length),
      suggestedTitle: this.suggestTitle(topic, category),
      detectedAt: new Date().toISOString(),
      confidence: gapType === 'missing' ? 0.95 : 0.8,
    };
  }

  /**
   * Calculate gap priority
   */
  private calculateGapPriority(
    gapType: ContentGap['gapType'],
    competitorCount: number,
    category: string,
    topic: string
  ): ContentGap['priority'] {
    let score = 0;

    // Gap type weight
    if (gapType === 'missing') score += 40;
    else if (gapType === 'outdated') score += 30;
    else if (gapType === 'weak') score += 25;
    else score += 15;

    // Competitor coverage
    if (competitorCount >= 3) score += 30;
    else if (competitorCount >= 2) score += 20;
    else if (competitorCount >= 1) score += 10;

    // Topic importance (essential topics get boost)
    if (ESSENTIAL_TOPICS[category]?.slice(0, 5).includes(topic)) {
      score += 30; // Top 5 essential topics
    } else if (ESSENTIAL_TOPICS[category]?.slice(0, 10).includes(topic)) {
      score += 20; // Top 10 essential topics
    }

    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Estimate revenue potential for a topic
   */
  private estimateRevenuePotential(category: string, topic: string): {
    revenuePotential: ContentGap['revenuePotential'];
    estimatedRevenue: number;
  } {
    // Revenue multipliers by category
    const categoryRevenue: Record<string, number> = {
      'credit-cards': 3500,
      'loans': 2500,
      'insurance': 2000,
      'mutual-funds': 1500,
      'taxes': 1000,
    };

    const baseRevenue = categoryRevenue[category] || 1000;

    // Topic modifiers
    let multiplier = 1.0;
    if (topic.includes('best')) multiplier *= 1.5;
    if (topic.includes('compare')) multiplier *= 1.3;
    if (topic.includes('vs')) multiplier *= 1.2;
    if (topic.includes('review')) multiplier *= 1.1;

    const estimatedRevenue = Math.round(baseRevenue * multiplier);

    let revenuePotential: ContentGap['revenuePotential'] = 'medium';
    if (estimatedRevenue >= 4000) revenuePotential = 'high';
    else if (estimatedRevenue < 2000) revenuePotential = 'low';

    return { revenuePotential, estimatedRevenue };
  }

  /**
   * Get recommendation for gap
   */
  private getGapRecommendation(
    gapType: ContentGap['gapType'],
    topic: string,
    existingCount: number
  ): string {
    switch (gapType) {
      case 'missing':
        return `Create comprehensive article on "${topic}" - no coverage exists`;
      case 'outdated':
        return `Update existing ${existingCount} article(s) on "${topic}" - content is stale`;
      case 'weak':
        return `Improve quality of existing article(s) on "${topic}" - low scores`;
      case 'underserved':
        return `Create additional content on "${topic}" - only ${existingCount} article exists`;
      default:
        return `Review content strategy for "${topic}"`;
    }
  }

  /**
   * Suggest title for new content
   */
  private suggestTitle(topic: string, category: string): string {
    const year = new Date().getFullYear();
    const templates = [
      `Best ${topic} in India ${year}: Complete Guide`,
      `Top 10 ${topic} in ${year} - Expert Comparison`,
      `${topic}: Everything You Need to Know (${year} Guide)`,
      `${topic} - Compare & Choose the Best Option`,
    ];

    // Pick template based on topic type
    if (topic.includes('best') || topic.includes('top')) {
      return `${topic.charAt(0).toUpperCase() + topic.slice(1)} in India ${year}`;
    }
    if (topic.includes('calculator') || topic.includes('eligibility')) {
      return `${topic.charAt(0).toUpperCase() + topic.slice(1)} - Free Online Tool & Guide`;
    }

    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate recommendations for category
   */
  private generateCategoryRecommendations(
    gaps: ContentGap[],
    coverageScore: number,
    category: string
  ): string[] {
    const recommendations: string[] = [];

    if (coverageScore < 50) {
      recommendations.push(`Low coverage (${coverageScore}%) - prioritize creating foundational content`);
    }

    const highPriorityGaps = gaps.filter(g => g.priority === 'high');
    if (highPriorityGaps.length > 0) {
      recommendations.push(`${highPriorityGaps.length} high-priority gaps detected - address these first`);
    }

    const missingGaps = gaps.filter(g => g.gapType === 'missing');
    if (missingGaps.length > 5) {
      recommendations.push(`${missingGaps.length} topics with no coverage - consider content sprint`);
    }

    const outdatedGaps = gaps.filter(g => g.gapType === 'outdated');
    if (outdatedGaps.length > 3) {
      recommendations.push(`${outdatedGaps.length} articles need refresh - schedule updates`);
    }

    // Competitor recommendation
    const topCompetitor = Object.values(COMPETITOR_DATA)
      .filter(c => c.strengths.includes(category))
      .sort((a, b) => (b.estimatedArticles[category] || 0) - (a.estimatedArticles[category] || 0))[0];

    if (topCompetitor) {
      recommendations.push(`${topCompetitor.name} leads in ${category} - analyze their top content`);
    }

    return recommendations;
  }

  // ============================================
  // OVERALL ANALYSIS
  // ============================================

  /**
   * Get category coverage overview
   */
  async getCategoryCoverage(): Promise<CategoryCoverage[]> {
    const categories = ['credit-cards', 'mutual-funds', 'loans', 'insurance', 'taxes'];
    const coverages: CategoryCoverage[] = [];

    for (const category of categories) {
      try {
        const { count } = await this.supabase
          .from('articles')
          .select('id', { count: 'exact', head: true })
          .eq('category', category)
          .eq('status', 'published');

        const yourArticleCount = count || 0;
        const essentialTopics = ESSENTIAL_TOPICS[category] || [];
        const estimatedMarketSize = essentialTopics.length * 5; // Estimate 5 articles per topic

        // Get top missing
        const result = await this.analyzeCategory(category);
        const topMissing = result.gaps
          .filter(g => g.gapType === 'missing')
          .slice(0, 3)
          .map(g => g.topic);

        coverages.push({
          category,
          yourArticleCount,
          estimatedMarketSize,
          coveragePercentage: Math.round((yourArticleCount / estimatedMarketSize) * 100),
          topMissingTopics: topMissing,
          growthPotential: yourArticleCount < 50 ? 'high' : yourArticleCount < 100 ? 'medium' : 'low',
        });
      } catch (error) {
        logger.error(`Error getting coverage for ${category}`, error as Error);
      }
    }

    return coverages;
  }

  /**
   * Get all high-priority gaps across categories
   */
  async getAllHighPriorityGaps(limit: number = 20): Promise<ContentGap[]> {
    const categories = ['credit-cards', 'mutual-funds', 'loans', 'insurance'];
    const allGaps: ContentGap[] = [];

    for (const category of categories) {
      try {
        const result = await this.analyzeCategory(category);
        allGaps.push(...result.gaps.filter(g => g.priority === 'high'));
      } catch (error) {
        logger.error(`Error getting gaps for ${category}`, error as Error);
      }
    }

    // Sort by estimated revenue and return top
    return allGaps
      .sort((a, b) => (b.estimatedMonthlyRevenue || 0) - (a.estimatedMonthlyRevenue || 0))
      .slice(0, limit);
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const contentGapAnalyzer = new ContentGapAnalyzer();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export async function analyzeContentGaps(category: string): Promise<GapAnalysisResult> {
  return contentGapAnalyzer.analyzeCategory(category);
}

export async function getCategoryCoverage(): Promise<CategoryCoverage[]> {
  return contentGapAnalyzer.getCategoryCoverage();
}

export async function getHighPriorityGaps(limit?: number): Promise<ContentGap[]> {
  return contentGapAnalyzer.getAllHighPriorityGaps(limit);
}
