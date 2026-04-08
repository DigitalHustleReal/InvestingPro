/**
 * Topic Scorer — ranks feed items by relevance and revenue potential
 *
 * Decides WHAT to write about based on:
 * 1. Relevance to InvestingPro categories
 * 2. Revenue potential (credit cards > insurance > loans > MF > FD)
 * 3. Recency (newer = higher score)
 * 4. Engagement signals (Reddit score, comment count)
 * 5. Deduplication against existing articles
 */

import type { FeedItem } from "./feed-ingester";

export interface ScoredTopic {
  title: string;
  url: string;
  sourceName: string;
  category: string;
  score: number;
  reason: string;
  suggestedSlug: string;
  suggestedArticleType: "news" | "guide" | "comparison" | "analysis";
}

// Revenue weight per category
const CATEGORY_REVENUE: Record<string, number> = {
  "credit-cards": 10,
  loans: 9,
  insurance: 8,
  "mutual-funds": 7,
  "fixed-deposits": 5,
  tax: 6,
  banking: 4,
  markets: 3,
  regulatory: 8,
  trending: 5,
  community: 4,
  "personal-finance": 6,
  news: 3,
};

// Keywords that indicate high-intent topics
const HIGH_INTENT_KEYWORDS = [
  "best",
  "top",
  "compare",
  "vs",
  "review",
  "2026",
  "new launch",
  "rate change",
  "rbi",
  "interest rate",
  "cibil",
  "credit score",
  "tax saving",
  "80c",
  "sip",
  "emi",
  "home loan",
  "personal loan",
  "credit card",
  "mutual fund",
  "fixed deposit",
  "nps",
  "ppf",
  "budget 2026",
  "new regime",
  "old regime",
];

export function scoreTopics(
  items: FeedItem[],
  existingSlugs: Set<string>,
): ScoredTopic[] {
  const scored: ScoredTopic[] = [];

  for (const item of items) {
    const title = item.title.toLowerCase();
    const slug = title
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);

    // Skip if we already have an article with similar slug
    if (existingSlugs.has(slug)) continue;

    let score = 0;
    const reasons: string[] = [];

    // Category revenue weight (0-10)
    const catWeight = CATEGORY_REVENUE[item.category] || 3;
    score += catWeight;
    reasons.push(`category:${catWeight}`);

    // High-intent keyword match (0-15)
    let keywordHits = 0;
    for (const kw of HIGH_INTENT_KEYWORDS) {
      if (title.includes(kw)) keywordHits++;
    }
    score += Math.min(keywordHits * 3, 15);
    if (keywordHits > 0) reasons.push(`keywords:${keywordHits}`);

    // Recency (0-10)
    const ageHours =
      (Date.now() - new Date(item.publishedAt).getTime()) / 3600000;
    if (ageHours < 6) {
      score += 10;
      reasons.push("fresh:<6h");
    } else if (ageHours < 24) {
      score += 7;
      reasons.push("recent:<24h");
    } else if (ageHours < 72) {
      score += 4;
      reasons.push("recent:<3d");
    }

    // Reddit engagement signals
    if (item.raw?.score) {
      const redditScore = item.raw.score as number;
      if (redditScore > 100) {
        score += 5;
        reasons.push(`reddit:${redditScore}`);
      } else if (redditScore > 30) {
        score += 3;
      }
    }

    // Determine article type
    let articleType: ScoredTopic["suggestedArticleType"] = "news";
    if (/rate change|rbi|new policy|budget|announce/i.test(item.title))
      articleType = "analysis";
    if (/best|top|compare|vs/i.test(item.title)) articleType = "comparison";
    if (/how to|guide|step/i.test(item.title)) articleType = "guide";

    scored.push({
      title: item.title,
      url: item.url,
      sourceName: item.sourceName,
      category: item.category,
      score,
      reason: reasons.join(", "),
      suggestedSlug: slug,
      suggestedArticleType: articleType,
    });
  }

  // Sort by score descending
  return scored.sort((a, b) => b.score - a.score);
}
