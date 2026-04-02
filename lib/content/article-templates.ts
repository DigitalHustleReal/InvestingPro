/**
 * CMS Article Templates
 *
 * 5 standard templates for consistent content creation.
 * Used by the CMS editor to scaffold new articles.
 */

export interface ArticleTemplateSection {
  id: string;
  title: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'table' | 'list' | 'faq' | 'cta' | 'calculator';
}

export interface ArticleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'review' | 'comparison' | 'listicle' | 'guide' | 'news';
  sections: ArticleTemplateSection[];
  seoDefaults: {
    titleTemplate: string;
    descriptionTemplate: string;
    schema: string;
  };
  contentGuidelines: string[];
}

// ---------------------------------------------------------------------------
// 1. Product Review
// ---------------------------------------------------------------------------
export const productReviewTemplate: ArticleTemplate = {
  id: 'product-review',
  name: 'Product Review',
  description: 'In-depth review of a single financial product (credit card, loan, fund, etc.)',
  category: 'review',
  sections: [
    { id: 'overview', title: 'Overview', placeholder: 'Summarise the product in 2-3 sentences. Include issuer, category, and standout feature.', required: true, type: 'text' },
    { id: 'key-features', title: 'Key Features', placeholder: 'List the 5-8 most important features with brief explanations.', required: true, type: 'list' },
    { id: 'pros-cons', title: 'Pros & Cons', placeholder: 'Balanced list of advantages and drawbacks.', required: true, type: 'table' },
    { id: 'who-should-get', title: 'Who Should Get This', placeholder: 'Describe the ideal user profile — income, spending habits, goals.', required: true, type: 'text' },
    { id: 'how-to-apply', title: 'How to Apply', placeholder: 'Step-by-step application process with eligibility criteria.', required: false, type: 'text' },
    { id: 'comparison', title: 'Quick Comparison', placeholder: 'Side-by-side table comparing this product with 2 alternatives.', required: false, type: 'table' },
    { id: 'verdict', title: 'Our Verdict', placeholder: 'Final recommendation with rating (out of 5). Be specific about who benefits most.', required: true, type: 'text' },
    { id: 'faq', title: 'FAQ', placeholder: 'Answer 5-8 common questions about this product.', required: true, type: 'faq' },
    { id: 'cta', title: 'Apply Now', placeholder: 'CTA button linking to the product application page.', required: false, type: 'cta' },
  ],
  seoDefaults: {
    titleTemplate: '{Product Name} Review {Year} — Features, Pros, Cons | InvestingPro',
    descriptionTemplate: 'Detailed {Product Name} review with features, fees, pros & cons, and who should apply. Updated for {Year}.',
    schema: 'Review',
  },
  contentGuidelines: [
    'Include the annual fee, interest rate, and key numeric details in the first paragraph.',
    'Never use superlatives without evidence ("best", "cheapest") — use "one of the top" or cite rankings.',
    'Add the financial disclaimer at the bottom.',
    'Link to the relevant calculator (EMI, SIP, FD) where applicable.',
    'Include at least one comparison table with 2 alternatives.',
  ],
};

// ---------------------------------------------------------------------------
// 2. Comparison (X vs Y)
// ---------------------------------------------------------------------------
export const comparisonTemplate: ArticleTemplate = {
  id: 'comparison',
  name: 'Product Comparison (X vs Y)',
  description: 'Head-to-head comparison of 2-3 financial products',
  category: 'comparison',
  sections: [
    { id: 'quick-verdict', title: 'Quick Verdict', placeholder: 'One-paragraph winner declaration with key differentiator.', required: true, type: 'text' },
    { id: 'comparison-table', title: 'Feature Comparison', placeholder: 'Side-by-side table of all features with winner per row.', required: true, type: 'table' },
    { id: 'detailed-analysis', title: 'Detailed Analysis', placeholder: 'Deep dive into 4-6 key comparison areas (fees, rewards, eligibility, etc.).', required: true, type: 'text' },
    { id: 'best-for', title: 'Best For', placeholder: 'Scenario-based recommendations — "Choose X if...", "Choose Y if...".', required: true, type: 'list' },
    { id: 'methodology', title: 'How We Compared', placeholder: 'Brief explanation of comparison criteria and scoring.', required: false, type: 'text' },
    { id: 'faq', title: 'FAQ', placeholder: 'Common comparison questions answered.', required: true, type: 'faq' },
    { id: 'cta', title: 'Apply', placeholder: 'CTA buttons for each product.', required: false, type: 'cta' },
  ],
  seoDefaults: {
    titleTemplate: '{Product A} vs {Product B} ({Year}) — Which Is Better? | InvestingPro',
    descriptionTemplate: 'Compare {Product A} vs {Product B} side by side. Features, fees, rewards, and which one suits you better. Updated {Year}.',
    schema: 'WebPage',
  },
  contentGuidelines: [
    'Always declare a winner with reasoning — don\'t sit on the fence.',
    'Use a comparison table as the first visual element after the verdict.',
    'Mark the winner per feature row with a checkmark or highlight.',
    'Include "Best for" scenarios so readers self-select.',
    'Link to individual product reviews for deeper information.',
  ],
};

// ---------------------------------------------------------------------------
// 3. Best Of (Listicle)
// ---------------------------------------------------------------------------
export const bestOfListicleTemplate: ArticleTemplate = {
  id: 'best-of-listicle',
  name: 'Best Of Listicle',
  description: '"Best Credit Cards in 2026" style ranked list',
  category: 'listicle',
  sections: [
    { id: 'editors-picks', title: "Editor's Top 3", placeholder: 'Highlight the top 3 picks with one-line reasons.', required: true, type: 'list' },
    { id: 'full-list', title: 'Full List', placeholder: 'Ranked list of 8-15 products. Each with: name, rating, key feature, one pro, one con, CTA.', required: true, type: 'list' },
    { id: 'how-we-ranked', title: 'How We Ranked', placeholder: 'Explain ranking criteria — fees, features, user ratings, expert analysis.', required: true, type: 'text' },
    { id: 'methodology', title: 'Our Methodology', placeholder: 'Detailed scoring system and data sources.', required: false, type: 'text' },
    { id: 'buying-guide', title: 'Buying Guide', placeholder: 'What to look for when choosing a product in this category.', required: false, type: 'text' },
    { id: 'faq', title: 'FAQ', placeholder: 'Category-level questions answered.', required: true, type: 'faq' },
  ],
  seoDefaults: {
    titleTemplate: 'Best {Category} in India ({Year}) — Top {Count} Picks | InvestingPro',
    descriptionTemplate: 'Ranked list of the best {Category} in India for {Year}. Expert-reviewed with fees, features, and who each is best for.',
    schema: 'ItemList',
  },
  contentGuidelines: [
    'Lead with the top 3 picks — most readers won\'t scroll past them.',
    'Each product needs: name, rating (out of 5), standout feature, one pro, one con.',
    'Include affiliate CTAs but never let them influence ranking.',
    'Update the list quarterly — stale listicles lose rankings.',
    'Add "Best for X" tags to help readers scan (e.g., "Best for cashback", "Best for students").',
  ],
};

// ---------------------------------------------------------------------------
// 4. Educational Guide
// ---------------------------------------------------------------------------
export const educationalGuideTemplate: ArticleTemplate = {
  id: 'educational-guide',
  name: 'Educational Guide',
  description: '"What is a SIP?" style explainer for financial concepts',
  category: 'guide',
  sections: [
    { id: 'tldr', title: 'TL;DR', placeholder: '3-4 bullet points summarising the key takeaways.', required: true, type: 'list' },
    { id: 'what-is-it', title: 'What Is It?', placeholder: 'Simple definition in plain English. Avoid jargon.', required: true, type: 'text' },
    { id: 'how-it-works', title: 'How It Works', placeholder: 'Step-by-step explanation with an example.', required: true, type: 'text' },
    { id: 'example', title: 'Example / Calculator', placeholder: 'Real-world example with numbers. Link to relevant calculator.', required: true, type: 'calculator' },
    { id: 'benefits', title: 'Benefits', placeholder: 'List 4-6 advantages with brief explanations.', required: true, type: 'list' },
    { id: 'risks', title: 'Risks & Limitations', placeholder: 'Honest list of drawbacks and things to watch out for.', required: true, type: 'list' },
    { id: 'how-to-start', title: 'How to Get Started', placeholder: 'Actionable steps for a beginner.', required: false, type: 'text' },
    { id: 'faq', title: 'FAQ', placeholder: 'Answer 6-10 beginner questions.', required: true, type: 'faq' },
  ],
  seoDefaults: {
    titleTemplate: 'What Is {Topic}? A Simple Guide for Beginners ({Year}) | InvestingPro',
    descriptionTemplate: 'Learn what {Topic} is, how it works, benefits, risks, and how to get started. Simple guide with examples and calculator.',
    schema: 'Article',
  },
  contentGuidelines: [
    'Write at an 8th-grade reading level — avoid financial jargon without explanation.',
    'Include a concrete example with Indian Rupee amounts.',
    'Link to the relevant calculator so readers can run their own numbers.',
    'Add glossary term links for technical words.',
    'Use analogies to explain complex concepts.',
  ],
};

// ---------------------------------------------------------------------------
// 5. News / Update
// ---------------------------------------------------------------------------
export const newsUpdateTemplate: ArticleTemplate = {
  id: 'news-update',
  name: 'News / Market Update',
  description: '"RBI Rate Cut Impact" style time-sensitive update',
  category: 'news',
  sections: [
    { id: 'key-takeaway', title: 'Key Takeaway', placeholder: 'One sentence: what happened and why it matters to the reader.', required: true, type: 'text' },
    { id: 'what-happened', title: 'What Happened', placeholder: 'Factual summary of the event — who, what, when, where.', required: true, type: 'text' },
    { id: 'what-it-means', title: 'What It Means for You', placeholder: 'Impact analysis for Indian consumers/investors. Be specific.', required: true, type: 'text' },
    { id: 'action-items', title: 'Action Items', placeholder: 'Concrete steps readers should take (or avoid).', required: true, type: 'list' },
    { id: 'related-products', title: 'Related Products', placeholder: 'Products affected by this update with links.', required: false, type: 'cta' },
    { id: 'timeline', title: 'Timeline', placeholder: 'When changes take effect, key dates to remember.', required: false, type: 'text' },
  ],
  seoDefaults: {
    titleTemplate: '{Event} — What It Means for Your {Category} ({Month} {Year}) | InvestingPro',
    descriptionTemplate: '{Event} explained: impact on {Category}, action items, and what to do next. Updated {Date}.',
    schema: 'NewsArticle',
  },
  contentGuidelines: [
    'Publish within 24 hours of the event for SEO freshness signals.',
    'Lead with the reader impact, not the event itself.',
    'Include the exact date and time of the event.',
    'Link to official sources (RBI, SEBI, government gazette).',
    'Add an "Updated" timestamp at the top — news articles must show recency.',
    'Keep it under 1,000 words — news should be concise.',
  ],
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const articleTemplates: ArticleTemplate[] = [
  productReviewTemplate,
  comparisonTemplate,
  bestOfListicleTemplate,
  educationalGuideTemplate,
  newsUpdateTemplate,
];

export function getArticleTemplate(id: string): ArticleTemplate | undefined {
  return articleTemplates.find((t) => t.id === id);
}

export function getArticleTemplatesByCategory(
  category: ArticleTemplate['category']
): ArticleTemplate[] {
  return articleTemplates.filter((t) => t.category === category);
}
