/**
 * SERP Analyzer Module
 *
 * Analyzes the top 10 Google results for a keyword to understand
 * competitor content, word counts, headings, and content gaps.
 *
 * Two-tier approach:
 *   Tier 1: Google Custom Search JSON API (if GOOGLE_CSE_KEY + GOOGLE_CSE_ID exist)
 *   Tier 2: AI-powered SERP simulation via OpenAI (fallback)
 */

import OpenAI from "openai";
import { logger } from "@/lib/logger";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SERPResult {
  title: string;
  url: string;
  description: string;
  position: number;
}

export interface SERPAnalysis {
  keyword: string;
  topResults: SERPResult[];
  avgWordCount: number;
  commonH2s: string[];
  contentGaps: string[];
  targetWordCount: number;
  suggestedH2s: string[];
}

// ---------------------------------------------------------------------------
// Google Custom Search (Tier 1)
// ---------------------------------------------------------------------------

interface GoogleCSEItem {
  title?: string;
  link?: string;
  snippet?: string;
}

interface GoogleCSEResponse {
  items?: GoogleCSEItem[];
}

function isGoogleCSEAvailable(): boolean {
  return Boolean(process.env.GOOGLE_CSE_KEY && process.env.GOOGLE_CSE_ID);
}

async function fetchGoogleCSEResults(keyword: string): Promise<SERPResult[]> {
  const key = process.env.GOOGLE_CSE_KEY!;
  const cx = process.env.GOOGLE_CSE_ID!;

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", key);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", keyword);
  url.searchParams.set("num", "10");

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google CSE request failed (${res.status}): ${text}`);
  }

  const data: GoogleCSEResponse = await res.json();

  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item, idx) => ({
    title: item.title ?? "",
    url: item.link ?? "",
    description: item.snippet ?? "",
    position: idx + 1,
  }));
}

// ---------------------------------------------------------------------------
// AI-powered analysis (used by both tiers for deeper insights)
// ---------------------------------------------------------------------------

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for SERP analysis");
  }
  return new OpenAI({ apiKey });
}

/**
 * When we have real SERP results (Tier 1), ask AI to infer headings,
 * word counts, and content gaps from the titles/descriptions.
 */
async function analyzeRealResults(
  keyword: string,
  results: SERPResult[],
): Promise<Omit<SERPAnalysis, "keyword" | "topResults">> {
  const openai = getOpenAIClient();

  const resultsSummary = results
    .map((r) => `${r.position}. "${r.title}" — ${r.url}\n   ${r.description}`)
    .join("\n");

  const prompt = `You are an SEO content strategist for an Indian personal finance website (InvestingPro.in).

I have the top ${results.length} Google results for the keyword: "${keyword}"

${resultsSummary}

Based on these results, provide the following analysis as JSON (no markdown, just raw JSON):

{
  "avgWordCount": <estimated average word count of these articles (number)>,
  "commonH2s": [<list of H2 headings these articles likely share, 5-10 items>],
  "contentGaps": [<topics or angles these results miss that we could cover, 3-6 items>],
  "targetWordCount": <recommended word count to outrank them (number)>,
  "suggestedH2s": [<recommended H2 outline for our article, 8-12 items>]
}

Focus on the Indian personal finance context. Return ONLY valid JSON.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 1500,
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";
  const parsed = parseAIResponse(raw);
  return {
    avgWordCount: (parsed.avgWordCount as number) || 1500,
    commonH2s: (parsed.commonH2s as string[]) || [],
    contentGaps: (parsed.contentGaps as string[]) || [],
    targetWordCount: (parsed.targetWordCount as number) || 2000,
    suggestedH2s: (parsed.suggestedH2s as string[]) || [],
  };
}

/**
 * Tier 2 fallback: AI simulates what SERP results would look like and
 * returns both the simulated results and the analysis.
 */
async function simulateSERP(keyword: string): Promise<SERPAnalysis> {
  const openai = getOpenAIClient();

  const prompt = `You are an SEO content strategist for an Indian personal finance website (InvestingPro.in).

For the search query "${keyword}", simulate what the top 10 Google results in India would look like and analyze them.

Return ONLY valid JSON with this exact structure (no markdown fences):

{
  "topResults": [
    { "title": "...", "url": "...", "description": "...", "position": 1 },
    ...up to 10 results
  ],
  "avgWordCount": <number>,
  "commonH2s": [<5-10 strings — headings these articles likely share>],
  "contentGaps": [<3-6 strings — topics/angles competitors miss>],
  "targetWordCount": <number — recommended word count to outrank>,
  "suggestedH2s": [<8-12 strings — recommended H2 outline for our article>]
}

Use realistic Indian finance websites (Groww, ET Money, Cleartax, Zerodha Varsity, BankBazaar, Policybazaar, Moneycontrol, etc.) for the simulated results. Return ONLY valid JSON.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 2500,
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";
  const parsed = parseAIResponse(raw);

  return {
    keyword,
    topResults: (parsed.topResults as SERPResult[]) || [],
    avgWordCount: (parsed.avgWordCount as number) || 1500,
    commonH2s: (parsed.commonH2s as string[]) || [],
    contentGaps: (parsed.contentGaps as string[]) || [],
    targetWordCount: (parsed.targetWordCount as number) || 2000,
    suggestedH2s: (parsed.suggestedH2s as string[]) || [],
  };
}

// ---------------------------------------------------------------------------
// JSON parsing helper
// ---------------------------------------------------------------------------

function parseAIResponse(raw: string): Record<string, unknown> {
  // Strip markdown code fences if present
  let cleaned = raw;
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    logger.error("Failed to parse AI SERP response", { raw, error: e });
    return {};
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Analyze the SERP landscape for a keyword.
 *
 * - Tier 1 (preferred): Google Custom Search API for real results, then AI analysis
 * - Tier 2 (fallback): Full AI simulation when no CSE credentials
 */
export async function analyzeSERP(keyword: string): Promise<SERPAnalysis> {
  if (!keyword || keyword.trim().length === 0) {
    throw new Error("Keyword is required for SERP analysis");
  }

  const trimmedKeyword = keyword.trim();

  // Tier 1: Real Google results + AI analysis
  if (isGoogleCSEAvailable()) {
    try {
      logger.info("SERP Analyzer: Using Google CSE (Tier 1)", {
        keyword: trimmedKeyword,
      });

      const topResults = await fetchGoogleCSEResults(trimmedKeyword);

      if (topResults.length === 0) {
        logger.warn(
          "SERP Analyzer: Google CSE returned no results, falling back to AI",
          { keyword: trimmedKeyword },
        );
        return simulateSERP(trimmedKeyword);
      }

      const analysis = await analyzeRealResults(trimmedKeyword, topResults);

      return {
        keyword: trimmedKeyword,
        topResults,
        avgWordCount: (analysis.avgWordCount as number) ?? 1500,
        commonH2s: (analysis.commonH2s as string[]) ?? [],
        contentGaps: (analysis.contentGaps as string[]) ?? [],
        targetWordCount: (analysis.targetWordCount as number) ?? 2000,
        suggestedH2s: (analysis.suggestedH2s as string[]) ?? [],
      };
    } catch (err) {
      logger.error("SERP Analyzer: Google CSE failed, falling back to AI", {
        keyword: trimmedKeyword,
        error: err instanceof Error ? err.message : String(err),
      });
      // Fall through to Tier 2
    }
  }

  // Tier 2: AI simulation
  logger.info("SERP Analyzer: Using AI simulation (Tier 2)", {
    keyword: trimmedKeyword,
  });
  return simulateSERP(trimmedKeyword);
}
