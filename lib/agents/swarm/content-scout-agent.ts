/**
 * Content Scout Agent
 *
 * SENSE phase — discovers trending topics and keywords using FREE sources:
 * - Google Autocomplete (free, no API key)
 * - Reddit India Finance subs (free JSON API)
 * - YouTube Autocomplete (free)
 * - RSS feeds from Indian finance sites
 *
 * Writes discovered topics to `content_queue` for downstream agents.
 * Runs: 2:00 AM IST daily
 */

import { BaseSwarmAgent } from "./base-swarm-agent";
import { AgentContext, AgentResult } from "../base-agent";
import { getGoogleSuggestions } from "../providers/google-autocomplete";
import { logger } from "@/lib/logger";

// Seed keywords by category — the scout expands these via autocomplete
const SEED_KEYWORDS: Record<string, string[]> = {
  "credit-cards": [
    "best credit card India",
    "credit card rewards India",
    "credit card for travel India",
    "cashback credit card",
    "credit card annual fee waiver",
    "student credit card India",
    "fuel credit card India",
  ],
  "mutual-funds": [
    "best mutual fund India",
    "SIP investment India",
    "ELSS tax saving fund",
    "index fund India",
    "mutual fund vs fixed deposit",
    "best SIP for beginners",
    "small cap mutual fund",
  ],
  loans: [
    "home loan interest rate India",
    "personal loan India",
    "education loan India",
    "car loan EMI calculator",
    "home loan prepayment",
    "loan against property",
  ],
  insurance: [
    "term life insurance India",
    "health insurance India",
    "car insurance renewal",
    "best health insurance family",
    "claim settlement ratio",
  ],
  "tax-planning": [
    "income tax saving India",
    "section 80C investment",
    "new tax regime vs old",
    "tax saving FD",
    "HRA exemption calculation",
    "NPS tax benefit",
  ],
  "fixed-deposits": [
    "best FD rates India",
    "senior citizen FD rates",
    "corporate FD safe",
    "FD vs debt mutual fund",
    "tax saving fixed deposit",
  ],
  banking: [
    "best savings account India",
    "zero balance account",
    "digital banking India",
    "UPI payment limit",
    "savings account interest rate",
  ],
  investing: [
    "stock market for beginners India",
    "demat account India",
    "IPO investment India",
    "gold investment India",
    "PPF vs NPS",
    "FIRE retirement India",
  ],
};

export class ContentScoutAgent extends BaseSwarmAgent {
  constructor() {
    super({
      name: "ContentScoutAgent",
      batchSize: 20, // Max topics to discover per run
      claimTimeoutMs: 5 * 60 * 1000,
      cronSchedule: "0 2 * * *",
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    let totalDiscovered = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    try {
      // 1. Get existing topics to avoid duplicates
      const { data: existingTopics } = await this.supabase
        .from("content_queue")
        .select("topic")
        .in("status", ["pending", "claimed", "in_progress", "completed"]);
      const { data: existingArticles } = await this.supabase
        .from("articles")
        .select("title, primary_keyword");

      const existingSet = new Set<string>();
      existingTopics?.forEach((t: any) =>
        existingSet.add(t.topic.toLowerCase()),
      );
      existingArticles?.forEach((a: any) => {
        if (a.title) existingSet.add(a.title.toLowerCase());
        if (a.primary_keyword) existingSet.add(a.primary_keyword.toLowerCase());
      });

      // 2. Discover topics from each source
      const discoveredTopics: Array<{
        topic: string;
        category: string;
        keywords: string[];
        priority: number;
        source: string;
      }> = [];

      // Source 1: Google Autocomplete (free)
      for (const [category, seeds] of Object.entries(SEED_KEYWORDS)) {
        // Pick 2 random seeds per category to keep request count low
        const selectedSeeds = seeds.sort(() => Math.random() - 0.5).slice(0, 2);

        for (const seed of selectedSeeds) {
          try {
            const suggestions = await getGoogleSuggestions(seed, "IN", "en");
            for (const suggestion of suggestions) {
              const topic = suggestion.keyword;
              if (
                !existingSet.has(topic.toLowerCase()) &&
                topic.length > 15 &&
                topic.length < 100
              ) {
                discoveredTopics.push({
                  topic,
                  category,
                  keywords: [seed, topic],
                  priority: Math.min(
                    10,
                    Math.max(1, Math.round(suggestion.relevance / 15)),
                  ),
                  source: "google_autocomplete",
                });
                existingSet.add(topic.toLowerCase());
              }
            }
          } catch (err) {
            errors.push(`Google Autocomplete failed for "${seed}": ${err}`);
          }

          // Small delay to avoid rate limiting
          await new Promise((r) => setTimeout(r, 300));
        }
      }

      // Source 2: Reddit India Finance subs (free JSON API)
      for (const sub of [
        "IndiaInvestments",
        "personalfinanceindia",
        "CreditCardsIndia",
      ]) {
        try {
          const posts = await this.fetchRedditPosts(sub);
          for (const post of posts) {
            if (
              !existingSet.has(post.title.toLowerCase()) &&
              post.title.length > 15
            ) {
              const category = this.categorizeRedditPost(post.title);
              discoveredTopics.push({
                topic: post.title,
                category,
                keywords: [post.title],
                priority: Math.min(
                  10,
                  Math.max(3, Math.round(post.score / 50)),
                ),
                source: `reddit_${sub}`,
              });
              existingSet.add(post.title.toLowerCase());
            }
          }
        } catch (err) {
          errors.push(`Reddit ${sub} failed: ${err}`);
        }
      }

      // Source 3: YouTube Autocomplete (free)
      const ytSeeds = [
        "best credit card India 2026",
        "mutual fund SIP",
        "home loan tips India",
        "tax saving investment",
      ];
      for (const seed of ytSeeds.slice(0, 2)) {
        try {
          const suggestions = await this.fetchYouTubeSuggestions(seed);
          for (const s of suggestions) {
            if (!existingSet.has(s.toLowerCase()) && s.length > 15) {
              discoveredTopics.push({
                topic: s,
                category: this.categorizeRedditPost(s),
                keywords: [seed, s],
                priority: 4,
                source: "youtube_autocomplete",
              });
              existingSet.add(s.toLowerCase());
            }
          }
        } catch (err) {
          errors.push(`YouTube Autocomplete failed: ${err}`);
        }
      }

      // 3. Deduplicate and limit
      const uniqueTopics = discoveredTopics.slice(0, this.config.batchSize);

      // 4. Insert into content_queue
      if (uniqueTopics.length > 0) {
        const queueItems = uniqueTopics.map((t) => ({
          topic: t.topic,
          category: t.category,
          keywords: t.keywords,
          source_agent: this.config.name,
          priority: t.priority,
          status: "pending",
          metadata: {
            source: t.source,
            discovered_at: new Date().toISOString(),
          },
        }));

        totalDiscovered = await this.enqueue("content_queue", queueItems);
      }

      totalSkipped = discoveredTopics.length - totalDiscovered;

      return {
        success: true,
        data: {
          discovered: totalDiscovered,
          skipped: totalSkipped,
          sources: {
            google_autocomplete: discoveredTopics.filter(
              (t) => t.source === "google_autocomplete",
            ).length,
            reddit: discoveredTopics.filter((t) =>
              t.source.startsWith("reddit"),
            ).length,
            youtube: discoveredTopics.filter(
              (t) => t.source === "youtube_autocomplete",
            ).length,
          },
        },
        metadata: {
          itemsProcessed: totalDiscovered,
          itemsFailed: errors.length,
        },
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return this.handleError(error, context);
    }
  }

  private async fetchRedditPosts(
    subreddit: string,
  ): Promise<Array<{ title: string; score: number }>> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`,
        {
          signal: controller.signal,
          headers: {
            "User-Agent": "InvestingPro/1.0 (content-scout)",
          },
        },
      );
      clearTimeout(timeout);

      if (!res.ok) return [];
      const data = await res.json();
      return (data.data?.children || [])
        .filter((c: any) => !c.data.stickied && c.data.score > 10)
        .map((c: any) => ({
          title: c.data.title,
          score: c.data.score,
        }));
    } catch {
      clearTimeout(timeout);
      return [];
    }
  }

  private async fetchYouTubeSuggestions(query: string): Promise<string[]> {
    try {
      const res = await fetch(
        `https://suggestqueries.google.com/complete/search?client=youtube&q=${encodeURIComponent(query)}&hl=en&gl=IN`,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: AbortSignal.timeout(5000),
        },
      );
      if (!res.ok) return [];
      const text = await res.text();
      // Response is JSONP: window.google.ac.h([...])
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) return [];
      const data = JSON.parse(match[0]);
      return (data[1] || []).map((item: any) => item[0]).filter(Boolean);
    } catch {
      return [];
    }
  }

  private categorizeRedditPost(title: string): string {
    const t = title.toLowerCase();
    if (t.includes("credit card") || t.includes("cc ")) return "credit-cards";
    if (t.includes("mutual fund") || t.includes("sip") || t.includes("elss"))
      return "mutual-funds";
    if (t.includes("loan") || t.includes("emi")) return "loans";
    if (t.includes("insurance") || t.includes("health plan"))
      return "insurance";
    if (t.includes("tax") || t.includes("80c") || t.includes("itr"))
      return "tax-planning";
    if (t.includes("fd") || t.includes("fixed deposit"))
      return "fixed-deposits";
    if (t.includes("bank") || t.includes("savings account")) return "banking";
    if (
      t.includes("stock") ||
      t.includes("nifty") ||
      t.includes("demat") ||
      t.includes("ipo")
    )
      return "investing";
    if (t.includes("ppf") || t.includes("nps") || t.includes("pension"))
      return "retirement";
    return "personal-finance";
  }
}
