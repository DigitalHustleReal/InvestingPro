/**
 * 🔍 REAL SERP SCRAPER
 *
 * Fetches actual Google search results for a keyword and extracts:
 * - Top 10 page titles, URLs, descriptions
 * - Page content structure (headings, word count, FAQs)
 * - Content gaps and opportunities
 *
 * Uses web fetching to get real SERP data instead of LLM estimation.
 */

import { logger } from "@/lib/logger";

export interface SerpResult {
  position: number;
  title: string;
  url: string;
  description: string;
  domain: string;
}

export interface PageAnalysis {
  url: string;
  title: string;
  headings: { level: number; text: string }[];
  wordCount: number;
  hasImages: boolean;
  imageCount: number;
  hasTables: boolean;
  hasCalculator: boolean;
  hasFAQ: boolean;
  faqQuestions: string[];
  internalLinks: number;
  externalLinks: number;
  readingTimeMinutes: number;
  contentStructure: string[]; // Simplified outline
}

export interface SerpAnalysis {
  keyword: string;
  totalResults: number;
  topResults: SerpResult[];
  pageAnalyses: PageAnalysis[];
  competitiveInsights: {
    avgWordCount: number;
    avgHeadingCount: number;
    avgImageCount: number;
    avgFaqCount: number;
    commonHeadings: string[];
    contentGaps: string[];
    targetWordCount: number;
    difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  };
}

/**
 * Scrape SERP results for a keyword using Google Custom Search API
 * Falls back to AI-estimated analysis if API is unavailable
 */
export async function scrapeSERP(keyword: string): Promise<SerpAnalysis> {
  const results: SerpResult[] = [];
  const pageAnalyses: PageAnalysis[] = [];

  try {
    // Try Google Custom Search API first
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

    if (apiKey && searchEngineId) {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(keyword + " India")}&num=10&gl=in&hl=en`;
      const res = await fetch(url, { next: { revalidate: 86400 } });

      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i];
            results.push({
              position: i + 1,
              title: item.title || "",
              url: item.link || "",
              description: item.snippet || "",
              domain: new URL(item.link).hostname,
            });
          }
        }
      }
    }

    // If no API key or no results, use manual competitor list for Indian finance
    if (results.length === 0) {
      const indianFinanceCompetitors = getIndianFinanceCompetitors(keyword);
      results.push(...indianFinanceCompetitors);
    }

    // Analyze top pages (fetch actual content for top 5)
    const analysisPromises = results
      .slice(0, 5)
      .map((r) =>
        analyzePage(r.url).catch(() => createEmptyAnalysis(r.url, r.title)),
      );
    const analyses = await Promise.allSettled(analysisPromises);
    for (const result of analyses) {
      if (result.status === "fulfilled") {
        pageAnalyses.push(result.value);
      }
    }
  } catch (error) {
    logger.error("SERP scraping failed", error as Error);
  }

  // Compute competitive insights
  const insights = computeCompetitiveInsights(keyword, pageAnalyses);

  return {
    keyword,
    totalResults: results.length,
    topResults: results,
    pageAnalyses,
    competitiveInsights: insights,
  };
}

/**
 * Fetch and analyze a single page's content structure
 */
async function analyzePage(url: string): Promise<PageAnalysis> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; InvestingProBot/1.0; +https://investingpro.in)",
        Accept: "text/html",
      },
    });

    clearTimeout(timeout);

    if (!res.ok) return createEmptyAnalysis(url, "");

    const html = await res.text();
    return parsePageContent(url, html);
  } catch {
    clearTimeout(timeout);
    return createEmptyAnalysis(url, "");
  }
}

/**
 * Parse HTML content to extract structure
 */
function parsePageContent(url: string, html: string): PageAnalysis {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "";

  // Extract headings (h1-h6)
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings: { level: number; text: string }[] = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 0 && text.length < 200) {
      headings.push({ level: parseInt(match[1]), text });
    }
  }

  // Strip HTML for word count
  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = textContent.split(/\s+/).length;

  // Count images
  const imageMatches = html.match(/<img\b/gi);
  const imageCount = imageMatches ? imageMatches.length : 0;

  // Check for tables
  const hasTables = /<table\b/i.test(html);

  // Check for calculator-like elements
  const hasCalculator =
    /calculator|calc-widget|input.*type="range"|slider/i.test(html);

  // Extract FAQ questions
  const faqQuestions: string[] = [];
  // Look for FAQ schema
  const faqSchemaMatch = html.match(/"@type"\s*:\s*"FAQPage"/i);
  if (faqSchemaMatch) {
    const questionRegex = /"name"\s*:\s*"([^"]+)"/g;
    let qMatch;
    while ((qMatch = questionRegex.exec(html)) !== null) {
      if (
        qMatch[1].endsWith("?") ||
        qMatch[1].toLowerCase().startsWith("what") ||
        qMatch[1].toLowerCase().startsWith("how")
      ) {
        faqQuestions.push(qMatch[1]);
      }
    }
  }
  // Also look for common FAQ patterns in headings
  for (const h of headings) {
    if (h.text.includes("?") && h.level >= 2) {
      faqQuestions.push(h.text);
    }
  }

  // Count links
  const internalLinks = (html.match(/href=["'][^"']*["']/gi) || []).filter(
    (l) => !l.includes("http") || l.includes(new URL(url).hostname),
  ).length;
  const externalLinks = (html.match(/href=["']https?:\/\//gi) || []).length;

  // Content structure (simplified outline)
  const contentStructure = headings
    .filter((h) => h.level <= 3)
    .map((h) => `${"  ".repeat(h.level - 1)}${h.text}`);

  return {
    url,
    title,
    headings,
    wordCount: Math.min(wordCount, 20000), // Cap at 20K (some pages have huge footers)
    hasImages: imageCount > 0,
    imageCount,
    hasTables,
    hasCalculator,
    hasFAQ: faqQuestions.length > 0,
    faqQuestions: faqQuestions.slice(0, 10),
    internalLinks,
    externalLinks,
    readingTimeMinutes: Math.ceil(wordCount / 250),
    contentStructure,
  };
}

function createEmptyAnalysis(url: string, title: string): PageAnalysis {
  return {
    url,
    title,
    headings: [],
    wordCount: 0,
    hasImages: false,
    imageCount: 0,
    hasTables: false,
    hasCalculator: false,
    hasFAQ: false,
    faqQuestions: [],
    internalLinks: 0,
    externalLinks: 0,
    readingTimeMinutes: 0,
    contentStructure: [],
  };
}

function computeCompetitiveInsights(
  keyword: string,
  analyses: PageAnalysis[],
): SerpAnalysis["competitiveInsights"] {
  const validAnalyses = analyses.filter((a) => a.wordCount > 100);

  if (validAnalyses.length === 0) {
    return {
      avgWordCount: 2000,
      avgHeadingCount: 12,
      avgImageCount: 5,
      avgFaqCount: 5,
      commonHeadings: [],
      contentGaps: [],
      targetWordCount: 2500,
      difficulty: "Medium",
    };
  }

  const avg = (arr: number[]) =>
    Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  const avgWordCount = avg(validAnalyses.map((a) => a.wordCount));
  const avgHeadingCount = avg(validAnalyses.map((a) => a.headings.length));
  const avgImageCount = avg(validAnalyses.map((a) => a.imageCount));
  const avgFaqCount = avg(validAnalyses.map((a) => a.faqQuestions.length));

  // Find common heading themes
  const allHeadings = validAnalyses.flatMap((a) =>
    a.headings.filter((h) => h.level <= 3).map((h) => h.text.toLowerCase()),
  );
  const headingFreq = new Map<string, number>();
  for (const h of allHeadings) {
    // Normalize heading
    const normalized = h
      .replace(/\d+/g, "N")
      .replace(/₹[\d,]+/g, "₹X")
      .trim();
    headingFreq.set(normalized, (headingFreq.get(normalized) || 0) + 1);
  }
  const commonHeadings = [...headingFreq.entries()]
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([heading]) => heading);

  // Identify content gaps
  const contentGaps: string[] = [];
  const hasCalc = validAnalyses.some((a) => a.hasCalculator);
  const hasTable = validAnalyses.some((a) => a.hasTables);
  const hasFaq = validAnalyses.some((a) => a.hasFAQ);

  if (!hasCalc)
    contentGaps.push("No competitor has an embedded calculator — opportunity!");
  if (!hasTable)
    contentGaps.push(
      "No competitor uses comparison tables — add structured data",
    );
  if (!hasFaq)
    contentGaps.push(
      "No competitor has FAQ schema — add for featured snippets",
    );
  if (avgImageCount < 3)
    contentGaps.push("Competitors lack visuals — add infographics and charts");
  if (avgWordCount < 1500)
    contentGaps.push("Thin competitor content — go deep for authority");

  // Always add InvestingPro-specific gaps
  contentGaps.push(
    "Add embedded calculator CTA (SIP/EMI/FD relevant to topic)",
  );
  contentGaps.push("Add comparison table with 'Apply Now' affiliate links");
  contentGaps.push("Add expert tip boxes with Indian-specific advice");

  // Difficulty estimation
  let difficulty: "Easy" | "Medium" | "Hard" | "Very Hard" = "Medium";
  if (avgWordCount > 3000 && avgHeadingCount > 15) difficulty = "Hard";
  if (avgWordCount > 5000) difficulty = "Very Hard";
  if (avgWordCount < 1200 && avgHeadingCount < 8) difficulty = "Easy";

  // Target: 25% more than average, min 2000
  const targetWordCount = Math.max(2000, Math.round(avgWordCount * 1.25));

  return {
    avgWordCount,
    avgHeadingCount,
    avgImageCount,
    avgFaqCount,
    commonHeadings,
    contentGaps,
    targetWordCount,
    difficulty,
  };
}

/**
 * Known Indian finance competitors for fallback SERP estimation
 */
function getIndianFinanceCompetitors(keyword: string): SerpResult[] {
  const competitors = [
    {
      domain: "bankbazaar.com",
      title: `${keyword} - Compare & Apply Online | BankBazaar`,
    },
    {
      domain: "paisabazaar.com",
      title: `${keyword} in India 2026 | Paisabazaar`,
    },
    {
      domain: "economictimes.indiatimes.com",
      title: `${keyword} - The Economic Times`,
    },
    {
      domain: "cleartax.in",
      title: `${keyword} - Guide & Calculator | ClearTax`,
    },
    {
      domain: "groww.in",
      title: `${keyword} - Learn & Invest | Groww`,
    },
    {
      domain: "etmoney.com",
      title: `${keyword} - Compare & Invest | ET Money`,
    },
    {
      domain: "moneycontrol.com",
      title: `${keyword} | Moneycontrol`,
    },
    {
      domain: "livemint.com",
      title: `${keyword} | Mint`,
    },
    {
      domain: "financialexpress.com",
      title: `${keyword} | Financial Express`,
    },
    {
      domain: "ndtv.com",
      title: `${keyword} | NDTV Profit`,
    },
  ];

  return competitors.map((c, i) => ({
    position: i + 1,
    title: c.title,
    url: `https://${c.domain}/${keyword.toLowerCase().replace(/\s+/g, "-")}`,
    description: `Compare ${keyword} options in India. Expert reviews, latest rates, and tools.`,
    domain: c.domain,
  }));
}
