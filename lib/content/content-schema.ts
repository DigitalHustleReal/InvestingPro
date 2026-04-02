/**
 * Intent-Aware Content Schema System
 * 
 * Comprehensive type definitions for:
 * - User search intents
 * - Content types matched to intents
 * - Category-specific configurations
 * - Tone and voice guidelines
 * - Author personas
 */

// ============================================
// USER INTENT TYPES
// ============================================

export type UserIntent = 
  | 'informational'     // "What is SIP?" - Learning
  | 'educational'       // "How to invest in mutual funds" - How-to
  | 'comparison'        // "HDFC vs ICICI credit card" - Comparing options
  | 'transactional'     // "Best credit card apply" - Ready to buy
  | 'navigational'      // "HDFC bank login" - Looking for specific page
  | 'investigational';  // "Is Zerodha safe?" - Researching before decision

export interface IntentSignals {
  intent: UserIntent;
  confidence: number; // 0-1
  keywords: string[];
  suggestedContentType: ContentType;
  suggestedTone: ToneType;
}

// Intent detection patterns
export const INTENT_PATTERNS: Record<UserIntent, string[]> = {
  informational: ['what is', 'meaning of', 'define', 'explain', 'tell me about'],
  educational: ['how to', 'guide', 'steps to', 'learn', 'tutorial', 'beginner'],
  comparison: ['vs', 'versus', 'compare', 'difference between', 'better', 'which is'],
  transactional: ['best', 'top', 'apply', 'buy', 'open', 'get', 'apply online'],
  navigational: ['login', 'website', 'app', 'download', 'customer care', 'helpline'],
  investigational: ['review', 'is it safe', 'worth it', 'pros and cons', 'should i'],
};

// ============================================
// CONTENT TYPES
// ============================================

export type ContentType = 
  | 'glossary_term'
  | 'how_to_guide'
  | 'listicle'           // "10 Best Credit Cards"
  | 'comparison_article' // "A vs B"
  | 'product_review'
  | 'category_roundup'   // "Best Mutual Funds 2026"
  | 'news_analysis'
  | 'calculator_guide'
  | 'faq_article'
  | 'pillar_content';    // Long-form comprehensive guide

export interface ContentTypeConfig {
  type: ContentType;
  matchedIntents: UserIntent[];
  wordCountRange: [number, number];
  requiredSections: string[];
  optionalSections: string[];
  seoRequirements: SEORequirements;
  monetizable: boolean;
  affiliateOpportunity: 'high' | 'medium' | 'low' | 'none';
}

export const CONTENT_TYPE_CONFIGS: Record<ContentType, ContentTypeConfig> = {
  glossary_term: {
    type: 'glossary_term',
    matchedIntents: ['informational'],
    wordCountRange: [300, 600],
    requiredSections: ['definition', 'explanation', 'example'],
    optionalSections: ['related_terms', 'faq'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 2 },
    monetizable: false,
    affiliateOpportunity: 'low',
  },
  how_to_guide: {
    type: 'how_to_guide',
    matchedIntents: ['educational'],
    wordCountRange: [1200, 2000],
    requiredSections: ['intro', 'prerequisites', 'steps', 'tips', 'conclusion'],
    optionalSections: ['video', 'checklist', 'tools_needed'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 5 },
    monetizable: true,
    affiliateOpportunity: 'medium',
  },
  listicle: {
    type: 'listicle',
    matchedIntents: ['transactional', 'investigational'],
    wordCountRange: [2000, 4000],
    requiredSections: ['intro', 'methodology', 'list_items', 'comparison_table', 'verdict'],
    optionalSections: ['faq', 'buyer_guide'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 10 },
    monetizable: true,
    affiliateOpportunity: 'high',
  },
  comparison_article: {
    type: 'comparison_article',
    matchedIntents: ['comparison'],
    wordCountRange: [1500, 2500],
    requiredSections: ['intro', 'overview_a', 'overview_b', 'comparison_table', 'verdict'],
    optionalSections: ['faq', 'when_to_choose_a', 'when_to_choose_b'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 5 },
    monetizable: true,
    affiliateOpportunity: 'high',
  },
  product_review: {
    type: 'product_review',
    matchedIntents: ['investigational', 'transactional'],
    wordCountRange: [1500, 2500],
    requiredSections: ['intro', 'features', 'pros_cons', 'pricing', 'verdict'],
    optionalSections: ['user_reviews', 'alternatives', 'faq'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 5 },
    monetizable: true,
    affiliateOpportunity: 'high',
  },
  category_roundup: {
    type: 'category_roundup',
    matchedIntents: ['transactional'],
    wordCountRange: [3000, 5000],
    requiredSections: ['intro', 'methodology', 'picks', 'comparison_table', 'faq', 'verdict'],
    optionalSections: ['buyer_guide', 'trends'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 15 },
    monetizable: true,
    affiliateOpportunity: 'high',
  },
  news_analysis: {
    type: 'news_analysis',
    matchedIntents: ['informational'],
    wordCountRange: [800, 1500],
    requiredSections: ['headline', 'summary', 'analysis', 'impact', 'action_items'],
    optionalSections: ['expert_quotes', 'timeline'],
    seoRequirements: { hasFAQ: false, hasSchema: true, internalLinks: 3 },
    monetizable: false,
    affiliateOpportunity: 'low',
  },
  calculator_guide: {
    type: 'calculator_guide',
    matchedIntents: ['educational'],
    wordCountRange: [1000, 1800],
    requiredSections: ['intro', 'how_to_use', 'formula_explanation', 'examples', 'tips'],
    optionalSections: ['faq', 'related_calculators'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 5 },
    monetizable: true,
    affiliateOpportunity: 'medium',
  },
  faq_article: {
    type: 'faq_article',
    matchedIntents: ['informational', 'educational'],
    wordCountRange: [1500, 2500],
    requiredSections: ['intro', 'faqs', 'conclusion'],
    optionalSections: ['related_topics'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 5 },
    monetizable: false,
    affiliateOpportunity: 'low',
  },
  pillar_content: {
    type: 'pillar_content',
    matchedIntents: ['educational', 'informational'],
    wordCountRange: [5000, 10000],
    requiredSections: ['intro', 'chapters', 'key_takeaways', 'faq', 'conclusion'],
    optionalSections: ['downloadable_pdf', 'video_series', 'checklist'],
    seoRequirements: { hasFAQ: true, hasSchema: true, internalLinks: 20 },
    monetizable: true,
    affiliateOpportunity: 'high',
  },
};

// ============================================
// TONE & VOICE
// ============================================

export type ToneType =
  | 'educational'      // Teaching, patient, step-by-step
  | 'authoritative'    // Expert, confident, data-driven
  | 'conversational'   // Friendly, relatable, casual
  | 'urgent'           // Time-sensitive, action-oriented
  | 'reassuring'       // Calming, supportive, trust-building
  | 'analytical';      // Objective, comparison-focused

export interface ToneConfig {
  tone: ToneType;
  description: string;
  voiceCharacteristics: string[];
  doList: string[];
  dontList: string[];
  examplePhrase: string;
}

export const TONE_CONFIGS: Record<ToneType, ToneConfig> = {
  educational: {
    tone: 'educational',
    description: 'Patient teacher explaining to a beginner',
    voiceCharacteristics: ['Patient', 'Encouraging', 'Clear', 'Step-by-step'],
    doList: [
      'Use simple analogies',
      'Explain jargon immediately',
      'Break complex topics into steps',
      'Use "you" and "your"',
    ],
    dontList: [
      'Assume prior knowledge',
      'Use unexplained acronyms',
      'Rush through concepts',
    ],
    examplePhrase: 'Think of SIP like a recurring deposit, but for mutual funds. Every month, a fixed amount is automatically invested.',
  },
  authoritative: {
    tone: 'authoritative',
    description: 'Expert sharing insights backed by data',
    voiceCharacteristics: ['Confident', 'Data-driven', 'Precise', 'Expert'],
    doList: [
      'Cite sources and data',
      'Use specific numbers',
      'Reference regulations (RBI, SEBI)',
      'Provide expert analysis',
    ],
    dontList: [
      'Be vague or wishy-washy',
      'Make claims without backing',
      'Use casual language',
    ],
    examplePhrase: 'According to AMFI data, equity mutual funds delivered 12.3% CAGR over the last 10 years, outperforming FDs by 5.2 percentage points.',
  },
  conversational: {
    tone: 'conversational',
    description: 'Friend giving advice over chai',
    voiceCharacteristics: ['Friendly', 'Relatable', 'Warm', 'Personal'],
    doList: [
      'Use everyday language',
      'Share relatable examples',
      'Ask rhetorical questions',
      'Use contractions',
    ],
    dontList: [
      'Be too formal',
      'Use corporate jargon',
      'Sound like a textbook',
    ],
    examplePhrase: 'So you\'ve got ₹10,000 sitting in your savings account earning what... 3%? Let\'s fix that.',
  },
  urgent: {
    tone: 'urgent',
    description: 'Advisor pointing out time-sensitive opportunity',
    voiceCharacteristics: ['Action-oriented', 'Time-sensitive', 'Clear CTA', 'Benefit-focused'],
    doList: [
      'Highlight deadlines',
      'Emphasize limited offers',
      'Use action verbs',
      'Create FOMO appropriately',
    ],
    dontList: [
      'Be pushy or salesy',
      'Create false urgency',
      'Pressure the reader',
    ],
    examplePhrase: 'Tax-saving investments for FY 2026-27 must be done by March 31st. With 45 days left, here\'s your action plan.',
  },
  reassuring: {
    tone: 'reassuring',
    description: 'Trusted advisor calming concerns',
    voiceCharacteristics: ['Supportive', 'Empathetic', 'Trust-building', 'Calm'],
    doList: [
      'Acknowledge concerns',
      'Provide safety information',
      'Highlight protections',
      'Be encouraging',
    ],
    dontList: [
      'Dismiss worries',
      'Oversimplify risks',
      'Make guarantees',
    ],
    examplePhrase: 'It\'s completely normal to feel anxious about your first investment. Here\'s what protects your money and how to start safely.',
  },
  analytical: {
    tone: 'analytical',
    description: 'Analyst presenting objective comparison',
    voiceCharacteristics: ['Objective', 'Balanced', 'Data-focused', 'Neutral'],
    doList: [
      'Present both sides fairly',
      'Use tables and comparisons',
      'Let data speak',
      'Avoid personal opinions',
    ],
    dontList: [
      'Show bias',
      'Make recommendations without data',
      'Use emotional language',
    ],
    examplePhrase: 'Comparing annual fees: Card A charges ₹499 (waived on ₹50K spend) while Card B charges ₹999 (waived on ₹2L spend). Here\'s how to decide.',
  },
};

// ============================================
// CATEGORY CONFIGURATIONS
// ============================================

export type FinanceCategory =
  | 'credit_cards'
  | 'loans'
  | 'mutual_funds'
  | 'insurance'
  | 'fixed_deposits'
  | 'stocks'
  | 'demat'
  | 'tax'
  | 'banking'
  | 'nps_ppf'
  | 'gold'
  | 'real_estate';

export interface CategoryConfig {
  category: FinanceCategory;
  displayName: string;
  defaultTone: ToneType;
  primaryIntents: UserIntent[];
  topContentTypes: ContentType[];
  keyTopics: string[];
  regulatoryBody: string;
  affiliateValue: 'high' | 'medium' | 'low';
  seasonality: string[];
}

export const CATEGORY_CONFIGS: Record<FinanceCategory, CategoryConfig> = {
  credit_cards: {
    category: 'credit_cards',
    displayName: 'Credit Cards',
    defaultTone: 'conversational',
    primaryIntents: ['transactional', 'comparison'],
    topContentTypes: ['listicle', 'comparison_article', 'product_review'],
    keyTopics: ['rewards', 'cashback', 'travel', 'fuel', 'lifestyle', 'fees', 'eligibility'],
    regulatoryBody: 'RBI',
    affiliateValue: 'high',
    seasonality: ['Diwali (Oct-Nov)', 'Year-end (Dec)', 'New Year (Jan)'],
  },
  loans: {
    category: 'loans',
    displayName: 'Loans',
    defaultTone: 'reassuring',
    primaryIntents: ['transactional', 'educational'],
    topContentTypes: ['how_to_guide', 'listicle', 'calculator_guide'],
    keyTopics: ['home loan', 'personal loan', 'car loan', 'education loan', 'EMI', 'interest rates'],
    regulatoryBody: 'RBI',
    affiliateValue: 'high',
    seasonality: ['Festival season', 'Financial year end (Mar)', 'Home buying (Oct-Dec)'],
  },
  mutual_funds: {
    category: 'mutual_funds',
    displayName: 'Mutual Funds',
    defaultTone: 'educational',
    primaryIntents: ['educational', 'investigational'],
    topContentTypes: ['how_to_guide', 'listicle', 'comparison_article', 'pillar_content'],
    keyTopics: ['SIP', 'ELSS', 'equity funds', 'debt funds', 'hybrid', 'returns', 'NAV'],
    regulatoryBody: 'SEBI/AMFI',
    affiliateValue: 'medium',
    seasonality: ['Tax saving (Jan-Mar)', 'Market corrections', 'New Year goals'],
  },
  insurance: {
    category: 'insurance',
    displayName: 'Insurance',
    defaultTone: 'reassuring',
    primaryIntents: ['investigational', 'transactional'],
    topContentTypes: ['listicle', 'product_review', 'comparison_article'],
    keyTopics: ['term insurance', 'health insurance', 'life insurance', 'claims', 'premium'],
    regulatoryBody: 'IRDAI',
    affiliateValue: 'high',
    seasonality: ['Tax saving (Jan-Mar)', 'Health awareness (Apr)'],
  },
  fixed_deposits: {
    category: 'fixed_deposits',
    displayName: 'Fixed Deposits',
    defaultTone: 'authoritative',
    primaryIntents: ['transactional', 'informational'],
    topContentTypes: ['listicle', 'news_analysis', 'comparison_article'],
    keyTopics: ['FD rates', 'senior citizen FD', 'tax-saver FD', 'bank FD', 'corporate FD'],
    regulatoryBody: 'RBI',
    affiliateValue: 'medium',
    seasonality: ['Rate hike announcements', 'Senior citizen day (Aug)'],
  },
  stocks: {
    category: 'stocks',
    displayName: 'Stocks & Trading',
    defaultTone: 'analytical',
    primaryIntents: ['educational', 'informational'],
    topContentTypes: ['how_to_guide', 'news_analysis', 'pillar_content'],
    keyTopics: ['IPO', 'share market', 'trading', 'fundamental analysis', 'technical analysis'],
    regulatoryBody: 'SEBI',
    affiliateValue: 'medium',
    seasonality: ['IPO season', 'Budget (Feb)', 'AGM season (Jul-Sep)'],
  },
  demat: {
    category: 'demat',
    displayName: 'Demat & Brokers',
    defaultTone: 'conversational',
    primaryIntents: ['transactional', 'comparison'],
    topContentTypes: ['listicle', 'comparison_article', 'product_review'],
    keyTopics: ['demat account', 'brokerage charges', 'Zerodha', 'Groww', 'Angel One'],
    regulatoryBody: 'SEBI/CDSL/NSDL',
    affiliateValue: 'high',
    seasonality: ['Market rally periods', 'IPO announcements'],
  },
  tax: {
    category: 'tax',
    displayName: 'Tax & ITR',
    defaultTone: 'educational',
    primaryIntents: ['educational', 'informational'],
    topContentTypes: ['how_to_guide', 'calculator_guide', 'faq_article'],
    keyTopics: ['income tax', 'ITR filing', 'tax slabs', 'Section 80C', 'Form 16', 'TDS'],
    regulatoryBody: 'Income Tax Department',
    affiliateValue: 'low',
    seasonality: ['ITR filing (Jul-Nov)', 'Tax planning (Jan-Mar)'],
  },
  banking: {
    category: 'banking',
    displayName: 'Banking',
    defaultTone: 'conversational',
    primaryIntents: ['transactional', 'informational'],
    topContentTypes: ['listicle', 'how_to_guide', 'product_review'],
    keyTopics: ['savings account', 'salary account', 'zero balance', 'UPI', 'net banking'],
    regulatoryBody: 'RBI',
    affiliateValue: 'medium',
    seasonality: ['Salary season (Apr)', 'Festival offers'],
  },
  nps_ppf: {
    category: 'nps_ppf',
    displayName: 'NPS & PPF',
    defaultTone: 'educational',
    primaryIntents: ['educational', 'investigational'],
    topContentTypes: ['how_to_guide', 'comparison_article', 'calculator_guide'],
    keyTopics: ['NPS', 'PPF', 'EPF', 'pension', 'retirement planning', 'tax benefits'],
    regulatoryBody: 'PFRDA/Ministry of Finance',
    affiliateValue: 'low',
    seasonality: ['Tax saving (Jan-Mar)', 'Retirement month (Sep)'],
  },
  gold: {
    category: 'gold',
    displayName: 'Gold Investment',
    defaultTone: 'analytical',
    primaryIntents: ['informational', 'transactional'],
    topContentTypes: ['news_analysis', 'how_to_guide', 'comparison_article'],
    keyTopics: ['gold ETF', 'sovereign gold bonds', 'digital gold', 'gold price'],
    regulatoryBody: 'RBI/SEBI',
    affiliateValue: 'medium',
    seasonality: ['Akshaya Tritiya', 'Diwali', 'Dhanteras'],
  },
  real_estate: {
    category: 'real_estate',
    displayName: 'Real Estate',
    defaultTone: 'authoritative',
    primaryIntents: ['educational', 'investigational'],
    topContentTypes: ['how_to_guide', 'pillar_content', 'news_analysis'],
    keyTopics: ['home buying', 'property registration', 'RERA', 'stamp duty', 'loan eligibility'],
    regulatoryBody: 'RERA',
    affiliateValue: 'high',
    seasonality: ['Festival season', 'Financial year end'],
  },
};

// ============================================
// SEO REQUIREMENTS
// ============================================

export interface SEORequirements {
  hasFAQ: boolean;
  hasSchema: boolean;
  internalLinks: number;
  externalLinks?: number;
  readingLevel?: string; // e.g., "Grade 8-10"
}

// ============================================
// ARTICLE SCHEMA (Combined)
// ============================================

export interface ArticleSchema {
  // Identification
  id?: string;
  slug: string;
  
  // Metadata
  title: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  
  // Classification
  intent: UserIntent;
  contentType: ContentType;
  category: FinanceCategory;
  tone: ToneType;
  
  // Content
  content: string; // Markdown
  excerpt: string;
  keyTakeaways: string[];
  
  // Structure
  headings: string[];
  sections: ArticleSection[];
  faq?: FAQItem[];
  
  // Comparison (if applicable)
  comparisonData?: ComparisonData;
  
  // Products (if applicable)
  featuredProducts?: string[]; // Product IDs
  affiliateLinks?: AffiliateLink[];
  
  // Author
  authorId: string;
  editorId?: string;
  
  // SEO
  keywords: string[];
  internalLinks: InternalLink[];
  schema: StructuredData;
  
  // Status
  status: 'draft' | 'review' | 'scheduled' | 'published';
  publishedAt?: string;
  scheduledFor?: string;
  
  // Metrics
  wordCount: number;
  readingTimeMinutes: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface ArticleSection {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'callout' | 'product_card' | 'cta';
  level?: number; // For headings
  content: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ComparisonData {
  itemA: { name: string; id?: string };
  itemB: { name: string; id?: string };
  criteria: ComparisonCriterion[];
  winner?: 'A' | 'B' | 'tie';
  verdict: string;
}

export interface ComparisonCriterion {
  name: string;
  valueA: string;
  valueB: string;
  winner?: 'A' | 'B' | 'tie';
}

export interface AffiliateLink {
  productId: string;
  anchorText: string;
  url: string;
  position: number;
}

export interface InternalLink {
  anchorText: string;
  url: string;
  context?: string;
}

export interface StructuredData {
  '@type': 'Article' | 'FAQPage' | 'HowTo' | 'Product' | 'Review';
  data: Record<string, any>;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Detect user intent from query/title
 */
export function detectIntent(query: string): IntentSignals {
  const lowerQuery = query.toLowerCase();
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerQuery.includes(pattern)) {
        const intentType = intent as UserIntent;
        return {
          intent: intentType,
          confidence: 0.8,
          keywords: patterns.filter(p => lowerQuery.includes(p)),
          suggestedContentType: getSuggestedContentType(intentType),
          suggestedTone: getSuggestedTone(intentType),
        };
      }
    }
  }
  
  // Default to informational
  return {
    intent: 'informational',
    confidence: 0.5,
    keywords: [],
    suggestedContentType: 'how_to_guide',
    suggestedTone: 'educational',
  };
}

function getSuggestedContentType(intent: UserIntent): ContentType {
  const mapping: Record<UserIntent, ContentType> = {
    informational: 'glossary_term',
    educational: 'how_to_guide',
    comparison: 'comparison_article',
    transactional: 'listicle',
    navigational: 'faq_article',
    investigational: 'product_review',
  };
  return mapping[intent];
}

function getSuggestedTone(intent: UserIntent): ToneType {
  const mapping: Record<UserIntent, ToneType> = {
    informational: 'educational',
    educational: 'educational',
    comparison: 'analytical',
    transactional: 'conversational',
    navigational: 'conversational',
    investigational: 'reassuring',
  };
  return mapping[intent];
}

/**
 * Get content configuration for a topic
 */
export function getContentConfig(topic: string, category: FinanceCategory) {
  const intent = detectIntent(topic);
  const categoryConfig = CATEGORY_CONFIGS[category];
  const contentTypeConfig = CONTENT_TYPE_CONFIGS[intent.suggestedContentType];
  const toneConfig = TONE_CONFIGS[intent.suggestedTone];
  
  return {
    intent,
    category: categoryConfig,
    contentType: contentTypeConfig,
    tone: toneConfig,
  };
}
