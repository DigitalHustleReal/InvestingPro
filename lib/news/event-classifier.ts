/**
 * News Event Classifier
 *
 * Detects category from headline keyword patterns and
 * scores importance using base × government × rate-change × recency multipliers.
 */
import { RawNewsItem } from './source-poller';

export interface ClassifiedEvent {
  category: string;
  importance_score: number;
  keywords: string[];
}

// Category patterns — ordered by priority (first match wins)
const CATEGORY_PATTERNS: Array<{ category: string; patterns: RegExp[] }> = [
  {
    category: 'da_announcement',
    patterns: [
      /dearness allowance/i,
      /\bDA hike\b/i,
      /dearness relief/i,
      /\bDR hike\b/i,
      /DA revision/i,
    ],
  },
  {
    category: 'repo_rate',
    patterns: [
      /repo rate/i,
      /RBI rate/i,
      /monetary policy committee/i,
      /\bMPC\b.*meeting/i,
      /reverse repo/i,
      /bank rate/i,
      /policy rate/i,
    ],
  },
  {
    category: 'lpg',
    patterns: [/LPG price/i, /cooking gas/i, /cylinder price/i, /domestic gas/i, /\bLPG\b.*rate/i],
  },
  {
    category: 'fuel_price',
    patterns: [
      /petrol price/i,
      /diesel price/i,
      /fuel price/i,
      /CNG price/i,
      /crude oil.*price/i,
      /fuel rate/i,
    ],
  },
  {
    category: 'gold_silver',
    patterns: [
      /gold price/i,
      /silver price/i,
      /\bMCX gold\b/i,
      /gold rate/i,
      /sovereign gold bond/i,
      /\bSGB\b/i,
      /bullion/i,
    ],
  },
  {
    category: 'tax_change',
    patterns: [
      /income tax/i,
      /tax slab/i,
      /TDS rate/i,
      /GST rate/i,
      /80[CD]/i,
      /tax exemption/i,
      /new tax regime/i,
      /tax deduction/i,
      /surcharge/i,
    ],
  },
  {
    category: 'budget',
    patterns: [
      /union budget/i,
      /interim budget/i,
      /fiscal deficit/i,
      /budget 202/i,
      /halwa ceremony/i,
    ],
  },
  {
    category: 'pay_commission',
    patterns: [
      /pay commission/i,
      /7th CPC/i,
      /8th CPC/i,
      /salary revision/i,
      /fitment factor/i,
      /pay matrix/i,
    ],
  },
  {
    category: 'mutual_fund',
    patterns: [
      /mutual fund/i,
      /SEBI circular.*fund/i,
      /\bNFO\b/i,
      /fund NAV/i,
      /SIP limit/i,
      /expense ratio/i,
      /AMFI/i,
    ],
  },
  {
    category: 'ipo',
    patterns: [/\bIPO\b/i, /initial public offer/i, /listing gain/i, /SME IPO/i, /\bGMP\b/i],
  },
  {
    category: 'epfo',
    patterns: [
      /EPFO/i,
      /EPF interest/i,
      /provident fund/i,
      /PF withdrawal/i,
      /\bUAN\b/i,
      /employees' provident/i,
    ],
  },
  {
    category: 'insurance_regulation',
    patterns: [
      /IRDAI/i,
      /insurance premium/i,
      /health insurance.*rule/i,
      /term plan.*rule/i,
      /life insurance regulation/i,
      /motor insurance/i,
    ],
  },
  {
    category: 'banking',
    patterns: [
      /FD rate/i,
      /fixed deposit.*rate/i,
      /bank interest rate/i,
      /savings rate/i,
      /RBI circular/i,
      /\bNBFC\b/i,
      /digital lending/i,
    ],
  },
  {
    category: 'pension',
    patterns: [
      /\bNPS\b/i,
      /pension.*scheme/i,
      /old pension scheme/i,
      /\bOPS\b/i,
      /PFRDA/i,
      /gratuity/i,
      /retirement.*benefit/i,
    ],
  },
  {
    category: 'forex',
    patterns: [/rupee/i, /USD.*INR/i, /forex reserve/i, /dollar rate/i, /exchange rate.*india/i],
  },
  {
    category: 'markets',
    patterns: [/\bNIFTY\b/i, /\bSENSEX\b/i, /stock market/i, /\bBSE\b/i, /\bFII\b/i, /\bDII\b/i],
  },
  {
    category: 'general_finance',
    patterns: [/personal finance/i, /investment.*india/i, /financial planning/i],
  },
];

const GOVT_SOURCE_KEYWORDS = [
  'rbi', 'sebi', 'irdai', 'pib', 'ministry', 'government', 'finance ministry',
  'ppac', 'iocl', 'amfi', 'epfo', 'pfrda', 'nse', 'bse',
];

export function detectCategory(headline: string, categoryTags: string[]): string {
  // 1. Keyword pattern matching (most reliable)
  for (const { category, patterns } of CATEGORY_PATTERNS) {
    if (patterns.some((p) => p.test(headline))) return category;
  }
  // 2. Fall back to first source category_tag
  if (categoryTags.length) return categoryTags[0];
  return 'general_finance';
}

export function scoreImportance(
  baseImportance: number,
  sourceName: string,
  headline: string,
  publishedAt: string
): number {
  let score = baseImportance;

  // Government/regulatory source multiplier
  const srcLower = sourceName.toLowerCase();
  if (GOVT_SOURCE_KEYWORDS.some((g) => srcLower.includes(g))) {
    score *= 1.2;
  }

  // Percentage change mentioned in headline
  const pctMatch = headline.match(/(\d+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    if (pct >= 5) score *= 1.5;
    else if (pct >= 2) score *= 1.3;
  }

  // Large absolute rupee amounts (crores)
  const croreMatch = headline.match(/₹?\s*(\d+(?:,\d+)*)\s*(?:lakh|crore)/i);
  if (croreMatch) score *= 1.1;

  // Recency multiplier
  let ageMinutes = 999;
  try {
    ageMinutes = (Date.now() - new Date(publishedAt).getTime()) / 60_000;
  } catch {}
  if (ageMinutes < 30) score *= 1.1;
  else if (ageMinutes > 240) score *= 0.7;

  return Math.min(10, parseFloat(score.toFixed(1)));
}

export function extractKeywords(headline: string, category: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'be', 'to', 'of', 'and', 'in',
    'for', 'on', 'with', 'by', 'from', 'at', 'as', 'its', 'it', 'that',
    'this', 'will', 'after', 'new', 'says', 'india',
  ]);

  const words = headline
    .replace(/[^\w\s₹]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w.toLowerCase()))
    .slice(0, 8)
    .map((w) => w.toLowerCase());

  // Category terms as additional keywords
  const catWords = category.split('_').filter((w) => w.length > 2);

  return [...new Set([...catWords, ...words])].slice(0, 12);
}

export function classifyItem(
  item: RawNewsItem,
  source: { base_importance: number; name: string; category_tags: string[] }
): ClassifiedEvent {
  const category = detectCategory(item.headline, source.category_tags);
  const importance_score = scoreImportance(
    source.base_importance,
    source.name,
    item.headline,
    item.published_at
  );
  const keywords = extractKeywords(item.headline, category);
  return { category, importance_score, keywords };
}
