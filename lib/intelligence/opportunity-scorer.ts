/**
 * Opportunity Scorer
 * 
 * Purpose: Score and prioritize content opportunities based on:
 * - Search volume
 * - Competition level
 * - Revenue potential
 * - Strategic fit
 * 
 * Helps decide which content to create next for maximum impact.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export interface ContentOpportunity {
  id: string;
  keyword: string;
  topic: string;
  category: string;
  
  // Scores (0-100)
  overallScore: number;
  volumeScore: number;
  competitionScore: number;
  revenueScore: number;
  relevanceScore: number;
  
  // Raw metrics
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
  trend?: 'rising' | 'stable' | 'declining';
  
  // Revenue estimates
  estimatedMonthlyTraffic: number;
  estimatedMonthlyRevenue: number;
  revenuePerArticle: number;
  
  // Competition
  competitionLevel: 'low' | 'medium' | 'high';
  topCompetitors: string[];
  canRank: boolean;
  
  // Recommendation
  priority: 'urgent' | 'high' | 'medium' | 'low';
  recommendedAction: string;
  suggestedContentType: 'pillar' | 'cluster' | 'comparison' | 'review' | 'guide';
  estimatedEffort: 'low' | 'medium' | 'high';
  
  // Metadata
  scoredAt: string;
  confidence: number;
}

export interface OpportunityScoringResult {
  opportunities: ContentOpportunity[];
  topPicks: ContentOpportunity[];
  quickWins: ContentOpportunity[];
  highValueTargets: ContentOpportunity[];
  categoryBreakdown: Record<string, {
    count: number;
    avgScore: number;
    topKeyword: string;
  }>;
  totalEstimatedRevenue: number;
  analyzedAt: string;
}

export interface KeywordInput {
  keyword: string;
  category?: string;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
}

// ============================================
// SCORING WEIGHTS
// ============================================

const SCORING_WEIGHTS = {
  volume: 0.25,      // Search volume importance
  competition: 0.25, // Lower competition = better
  revenue: 0.30,     // Revenue potential
  relevance: 0.20,   // Strategic fit
};

// Category revenue multipliers
const CATEGORY_REVENUE_MULTIPLIERS: Record<string, number> = {
  'credit-cards': 1.5,
  'loans': 1.3,
  'insurance': 1.2,
  'mutual-funds': 1.1,
  'taxes': 1.0,
  'banking': 0.8,
  'investing': 1.0,
};

// High-value keyword patterns
const HIGH_VALUE_PATTERNS = [
  /best/i,
  /top\s*\d+/i,
  /vs\.?/i,
  /compare/i,
  /review/i,
  /apply/i,
  /eligibility/i,
  /calculator/i,
];

// ============================================
// OPPORTUNITY SCORER CLASS
// ============================================

export class OpportunityScorer {
  private supabase = createClient();

  // ============================================
  // MAIN SCORING METHODS
  // ============================================

  /**
   * Score a list of keywords/opportunities
   */
  async scoreOpportunities(
    keywords: KeywordInput[],
    options: {
      limit?: number;
      minScore?: number;
      category?: string;
    } = {}
  ): Promise<OpportunityScoringResult> {
    const { limit = 50, minScore = 40, category } = options;

    try {
      // Filter by category if specified
      const filteredKeywords = category
        ? keywords.filter(k => k.category === category || !k.category)
        : keywords;

      // Score each opportunity
      const opportunities: ContentOpportunity[] = [];

      for (const input of filteredKeywords) {
        const opportunity = await this.scoreKeyword(input);
        if (opportunity.overallScore >= minScore) {
          opportunities.push(opportunity);
        }
      }

      // Sort by overall score
      opportunities.sort((a, b) => b.overallScore - a.overallScore);

      // Get top picks (highest overall score)
      const topPicks = opportunities.slice(0, 5);

      // Get quick wins (low competition, decent score)
      const quickWins = opportunities
        .filter(o => o.competitionLevel === 'low' && o.estimatedEffort !== 'high')
        .slice(0, 5);

      // Get high value targets (high revenue potential)
      const highValueTargets = [...opportunities]
        .sort((a, b) => b.estimatedMonthlyRevenue - a.estimatedMonthlyRevenue)
        .slice(0, 5);

      // Category breakdown
      const categoryBreakdown: Record<string, { count: number; avgScore: number; topKeyword: string }> = {};
      for (const opp of opportunities) {
        if (!categoryBreakdown[opp.category]) {
          categoryBreakdown[opp.category] = {
            count: 0,
            avgScore: 0,
            topKeyword: opp.keyword,
          };
        }
        categoryBreakdown[opp.category].count++;
        categoryBreakdown[opp.category].avgScore += opp.overallScore;
      }
      // Calculate averages
      for (const cat of Object.keys(categoryBreakdown)) {
        categoryBreakdown[cat].avgScore = Math.round(
          categoryBreakdown[cat].avgScore / categoryBreakdown[cat].count
        );
      }

      // Total estimated revenue
      const totalEstimatedRevenue = opportunities
        .slice(0, limit)
        .reduce((sum, o) => sum + o.estimatedMonthlyRevenue, 0);

      return {
        opportunities: opportunities.slice(0, limit),
        topPicks,
        quickWins,
        highValueTargets,
        categoryBreakdown,
        totalEstimatedRevenue,
        analyzedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error scoring opportunities', error as Error);
      throw error;
    }
  }

  /**
   * Score a single keyword opportunity
   */
  async scoreKeyword(input: KeywordInput): Promise<ContentOpportunity> {
    const keyword = input.keyword.toLowerCase().trim();
    const category = input.category || this.detectCategory(keyword);

    // Calculate individual scores
    const volumeScore = this.calculateVolumeScore(input.searchVolume);
    const competitionScore = this.calculateCompetitionScore(input.difficulty);
    const revenueScore = this.calculateRevenueScore(category, keyword, input.cpc);
    const relevanceScore = this.calculateRelevanceScore(keyword, category);

    // Calculate overall score
    const overallScore = Math.round(
      volumeScore * SCORING_WEIGHTS.volume +
      competitionScore * SCORING_WEIGHTS.competition +
      revenueScore * SCORING_WEIGHTS.revenue +
      relevanceScore * SCORING_WEIGHTS.relevance
    );

    // Determine competition level
    const competitionLevel = this.getCompetitionLevel(input.difficulty);

    // Estimate metrics
    const estimatedMonthlyTraffic = this.estimateTraffic(input.searchVolume, competitionLevel);
    const estimatedMonthlyRevenue = this.estimateRevenue(estimatedMonthlyTraffic, category, keyword);
    const revenuePerArticle = estimatedMonthlyRevenue;

    // Determine priority and recommendations
    const priority = this.determinePriority(overallScore, competitionLevel, estimatedMonthlyRevenue);
    const suggestedContentType = this.suggestContentType(keyword);
    const estimatedEffort = this.estimateEffort(keyword, suggestedContentType);

    // Check if we can realistically rank
    const canRank = competitionLevel !== 'high' || overallScore >= 75;

    return {
      id: `opp_${keyword.replace(/\s+/g, '_')}`,
      keyword,
      topic: this.formatTopic(keyword),
      category,
      
      overallScore,
      volumeScore,
      competitionScore,
      revenueScore,
      relevanceScore,
      
      searchVolume: input.searchVolume,
      difficulty: input.difficulty,
      cpc: input.cpc,
      trend: 'stable',
      
      estimatedMonthlyTraffic,
      estimatedMonthlyRevenue,
      revenuePerArticle,
      
      competitionLevel,
      topCompetitors: this.getTopCompetitors(category),
      canRank,
      
      priority,
      recommendedAction: this.getRecommendedAction(priority, suggestedContentType, keyword),
      suggestedContentType,
      estimatedEffort,
      
      scoredAt: new Date().toISOString(),
      confidence: this.calculateConfidence(input),
    };
  }

  // ============================================
  // SCORE CALCULATION METHODS
  // ============================================

  /**
   * Calculate volume score (0-100)
   */
  private calculateVolumeScore(searchVolume?: number): number {
    if (!searchVolume) return 50; // Default if unknown

    // Score brackets
    if (searchVolume >= 10000) return 100;
    if (searchVolume >= 5000) return 90;
    if (searchVolume >= 2000) return 80;
    if (searchVolume >= 1000) return 70;
    if (searchVolume >= 500) return 60;
    if (searchVolume >= 200) return 50;
    if (searchVolume >= 100) return 40;
    return 30;
  }

  /**
   * Calculate competition score (0-100, higher = less competition)
   */
  private calculateCompetitionScore(difficulty?: number): number {
    if (!difficulty) return 50; // Default if unknown

    // Invert difficulty (lower difficulty = higher score)
    // Assuming difficulty is 0-100
    return Math.max(0, 100 - difficulty);
  }

  /**
   * Calculate revenue score (0-100)
   */
  private calculateRevenueScore(category: string, keyword: string, cpc?: number): number {
    let score = 50; // Base score

    // Category multiplier
    const categoryMultiplier = CATEGORY_REVENUE_MULTIPLIERS[category] || 1.0;
    score *= categoryMultiplier;

    // High-value keyword patterns
    for (const pattern of HIGH_VALUE_PATTERNS) {
      if (pattern.test(keyword)) {
        score += 10;
        break; // Only add bonus once
      }
    }

    // CPC bonus
    if (cpc) {
      if (cpc >= 50) score += 20;
      else if (cpc >= 30) score += 15;
      else if (cpc >= 15) score += 10;
      else if (cpc >= 5) score += 5;
    }

    // Transactional intent bonus
    if (this.hasTransactionalIntent(keyword)) {
      score += 15;
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Calculate relevance score (0-100)
   */
  private calculateRelevanceScore(keyword: string, category: string): number {
    let score = 70; // Base score - assume relevant

    // Category match bonus
    const categoryKeywords: Record<string, string[]> = {
      'credit-cards': ['credit', 'card', 'rewards', 'cashback'],
      'mutual-funds': ['mutual', 'fund', 'sip', 'nav', 'amc'],
      'loans': ['loan', 'emi', 'interest', 'principal'],
      'insurance': ['insurance', 'premium', 'cover', 'policy'],
      'taxes': ['tax', 'itr', 'deduction', 'section'],
    };

    const relevantKeywords = categoryKeywords[category] || [];
    const matchCount = relevantKeywords.filter(rk => 
      keyword.toLowerCase().includes(rk)
    ).length;

    if (matchCount >= 2) score += 20;
    else if (matchCount >= 1) score += 10;

    // Evergreen content bonus
    if (this.isEvergreenTopic(keyword)) {
      score += 10;
    }

    return Math.min(100, score);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Detect category from keyword
   */
  private detectCategory(keyword: string): string {
    const keywordLower = keyword.toLowerCase();

    if (/credit|card|cashback|rewards/.test(keywordLower)) return 'credit-cards';
    if (/mutual|fund|sip|nav|amc/.test(keywordLower)) return 'mutual-funds';
    if (/loan|emi|mortgage/.test(keywordLower)) return 'loans';
    if (/insurance|premium|policy/.test(keywordLower)) return 'insurance';
    if (/tax|itr|deduction/.test(keywordLower)) return 'taxes';
    if (/bank|savings|fd|deposit/.test(keywordLower)) return 'banking';
    if (/invest|stock|share/.test(keywordLower)) return 'investing';

    return 'general';
  }

  /**
   * Get competition level from difficulty
   */
  private getCompetitionLevel(difficulty?: number): 'low' | 'medium' | 'high' {
    if (!difficulty) return 'medium';
    if (difficulty <= 30) return 'low';
    if (difficulty <= 60) return 'medium';
    return 'high';
  }

  /**
   * Estimate traffic from search volume and competition
   */
  private estimateTraffic(
    searchVolume?: number,
    competitionLevel?: 'low' | 'medium' | 'high'
  ): number {
    const baseVolume = searchVolume || 500;
    
    // CTR estimates by competition
    const ctrMultipliers = {
      low: 0.15,    // 15% CTR if ranking #1-3
      medium: 0.08, // 8% CTR
      high: 0.03,   // 3% CTR
    };

    const ctr = ctrMultipliers[competitionLevel || 'medium'];
    return Math.round(baseVolume * ctr);
  }

  /**
   * Estimate revenue from traffic
   */
  private estimateRevenue(traffic: number, category: string, keyword: string): number {
    // Base RPM (Revenue Per 1000 visitors)
    const baseRPM: Record<string, number> = {
      'credit-cards': 80,
      'loans': 60,
      'insurance': 50,
      'mutual-funds': 40,
      'taxes': 30,
      'banking': 25,
      'investing': 35,
      'general': 20,
    };

    let rpm = baseRPM[category] || 20;

    // High-intent keyword bonus
    if (this.hasTransactionalIntent(keyword)) {
      rpm *= 1.5;
    }

    return Math.round((traffic / 1000) * rpm * 30); // Monthly revenue
  }

  /**
   * Check if keyword has transactional intent
   */
  private hasTransactionalIntent(keyword: string): boolean {
    const transactionalPatterns = [
      /apply/i,
      /buy/i,
      /get/i,
      /open/i,
      /start/i,
      /eligibility/i,
      /how\s*to\s*apply/i,
      /online/i,
    ];

    return transactionalPatterns.some(p => p.test(keyword));
  }

  /**
   * Check if topic is evergreen
   */
  private isEvergreenTopic(keyword: string): boolean {
    const seasonalPatterns = [
      /\d{4}/,  // Year-specific
      /diwali/i,
      /holi/i,
      /tax\s*season/i,
      /budget\s*\d{4}/i,
    ];

    return !seasonalPatterns.some(p => p.test(keyword));
  }

  /**
   * Determine priority
   */
  private determinePriority(
    score: number,
    competition: 'low' | 'medium' | 'high',
    revenue: number
  ): 'urgent' | 'high' | 'medium' | 'low' {
    // Urgent: High score + low competition + high revenue
    if (score >= 80 && competition === 'low' && revenue >= 3000) return 'urgent';
    
    // High: Good score + manageable competition
    if (score >= 70 && competition !== 'high') return 'high';
    if (score >= 75 && revenue >= 4000) return 'high';
    
    // Medium: Decent opportunity
    if (score >= 50) return 'medium';
    
    return 'low';
  }

  /**
   * Suggest content type
   */
  private suggestContentType(
    keyword: string
  ): 'pillar' | 'cluster' | 'comparison' | 'review' | 'guide' {
    const keywordLower = keyword.toLowerCase();

    if (/vs\.?|compare|comparison/.test(keywordLower)) return 'comparison';
    if (/review|analysis/.test(keywordLower)) return 'review';
    if (/best|top\s*\d+/.test(keywordLower)) return 'pillar';
    if (/how\s*to|guide|tutorial/.test(keywordLower)) return 'guide';

    return 'cluster';
  }

  /**
   * Estimate effort required
   */
  private estimateEffort(
    keyword: string,
    contentType: 'pillar' | 'cluster' | 'comparison' | 'review' | 'guide'
  ): 'low' | 'medium' | 'high' {
    // Pillar pages require most effort
    if (contentType === 'pillar') return 'high';
    if (contentType === 'comparison') return 'medium';
    if (contentType === 'guide') return 'medium';
    if (contentType === 'review') return 'low';

    return 'low';
  }

  /**
   * Get recommended action
   */
  private getRecommendedAction(
    priority: string,
    contentType: string,
    keyword: string
  ): string {
    const actions = {
      urgent: `Create ${contentType} immediately - high-value opportunity for "${keyword}"`,
      high: `Prioritize ${contentType} creation for "${keyword}" - strong potential`,
      medium: `Add "${keyword}" to content calendar - good opportunity`,
      low: `Consider "${keyword}" for future content - lower priority`,
    };

    return actions[priority as keyof typeof actions] || actions.low;
  }

  /**
   * Get top competitors for category
   */
  private getTopCompetitors(category: string): string[] {
    const competitors: Record<string, string[]> = {
      'credit-cards': ['BankBazaar', 'PaisaBazaar', 'CardInsider'],
      'mutual-funds': ['ET Money', 'Groww', 'ValueResearch'],
      'loans': ['BankBazaar', 'PaisaBazaar', 'MyLoanCare'],
      'insurance': ['PolicyBazaar', 'Coverfox', 'Acko'],
      'taxes': ['ClearTax', 'TaxBuddy', 'ITRFile'],
    };

    return competitors[category] || ['Various competitors'];
  }

  /**
   * Format keyword as topic
   */
  private formatTopic(keyword: string): string {
    return keyword
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Calculate confidence in scoring
   */
  private calculateConfidence(input: KeywordInput): number {
    let confidence = 0.5; // Base

    if (input.searchVolume) confidence += 0.2;
    if (input.difficulty) confidence += 0.15;
    if (input.cpc) confidence += 0.1;
    if (input.category) confidence += 0.05;

    return Math.min(1, confidence);
  }

  // ============================================
  // DISCOVERY METHODS
  // ============================================

  /**
   * Generate keyword suggestions for a category
   */
  async discoverOpportunities(category: string): Promise<KeywordInput[]> {
    // In production, this would call a keyword research API
    // For now, return common patterns

    const baseKeywords: Record<string, string[]> = {
      'credit-cards': [
        'best credit cards india',
        'credit card for online shopping',
        'lifetime free credit cards',
        'credit card with no annual fee',
        'credit card for students',
        'credit card apply online',
        'credit card eligibility calculator',
        'credit card comparison',
        'cashback credit cards',
        'travel credit cards india',
      ],
      'mutual-funds': [
        'best sip plans',
        'top mutual funds 2026',
        'index funds india',
        'elss funds for tax saving',
        'best large cap funds',
        'sip calculator',
        'mutual fund for beginners',
        'direct vs regular mutual funds',
        'best amc in india',
        'flexi cap funds',
      ],
      'loans': [
        'home loan interest rates',
        'personal loan apply online',
        'home loan emi calculator',
        'loan against property',
        'education loan india',
        'car loan interest rates',
        'home loan eligibility',
        'best bank for home loan',
        'personal loan eligibility',
        'gold loan interest rates',
      ],
    };

    const keywords = baseKeywords[category] || [];

    // Add estimated metrics (in production, fetch from API)
    return keywords.map(keyword => ({
      keyword,
      category,
      searchVolume: Math.floor(Math.random() * 5000) + 500,
      difficulty: Math.floor(Math.random() * 60) + 20,
      cpc: Math.floor(Math.random() * 40) + 5,
    }));
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const opportunityScorer = new OpportunityScorer();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export async function scoreKeywordOpportunities(
  keywords: KeywordInput[],
  options?: { limit?: number; minScore?: number; category?: string }
): Promise<OpportunityScoringResult> {
  return opportunityScorer.scoreOpportunities(keywords, options);
}

export async function discoverCategoryOpportunities(
  category: string
): Promise<ContentOpportunity[]> {
  const keywords = await opportunityScorer.discoverOpportunities(category);
  const result = await opportunityScorer.scoreOpportunities(keywords, { category });
  return result.opportunities;
}

export async function scoreKeyword(input: KeywordInput): Promise<ContentOpportunity> {
  return opportunityScorer.scoreKeyword(input);
}
