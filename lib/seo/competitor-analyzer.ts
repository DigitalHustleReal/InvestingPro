/**
 * 🏆 COMPETITOR CONTENT ANALYZER
 *
 * Takes SERP analysis results and generates:
 * 1. A superior article outline that beats all competitors
 * 2. Content strategy with gaps to exploit
 * 3. SEO-optimized structure with InvestingPro advantages
 */

import { logger } from "@/lib/logger";
import { aiService } from "@/lib/ai-service";
import type { SerpAnalysis, PageAnalysis } from "./serp-scraper";

export interface ContentOutline {
  title: string;
  seoTitle: string;
  seoDescription: string;
  targetWordCount: number;
  sections: OutlineSection[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
  contentStrategy: string;
  competitiveEdge: string[];
  embeddedElements: EmbeddedElement[];
  internalLinks: InternalLink[];
}

export interface OutlineSection {
  heading: string;
  level: number; // h2, h3
  description: string;
  targetWords: number;
  includeTable?: boolean;
  includeCalculatorCTA?: boolean;
  includeImage?: boolean;
  includeInfobox?: boolean;
}

export interface EmbeddedElement {
  type:
    | "calculator"
    | "comparison_table"
    | "infographic"
    | "expert_tip"
    | "product_card"
    | "cta_button";
  placement: string; // "after section 3", "in introduction", etc.
  details: string;
}

export interface InternalLink {
  anchorText: string;
  targetUrl: string;
  context: string;
}

/**
 * Generate a superior content outline based on competitor analysis
 */
export async function generateSuperiorOutline(
  serpAnalysis: SerpAnalysis,
  category: string = "personal-finance",
): Promise<ContentOutline> {
  const { keyword, competitiveInsights, pageAnalyses, topResults } =
    serpAnalysis;

  // Build competitor summary for AI
  const competitorSummary = pageAnalyses
    .filter((p) => p.wordCount > 100)
    .slice(0, 5)
    .map(
      (p, i) =>
        `#${i + 1} "${p.title}" (${p.wordCount} words, ${p.headings.length} headings, ${p.imageCount} images, ${p.faqQuestions.length} FAQs)\n   Outline: ${p.contentStructure.slice(0, 8).join(" → ")}`,
    )
    .join("\n");

  const allFaqs = [
    ...new Set(pageAnalyses.flatMap((p) => p.faqQuestions)),
  ].slice(0, 15);

  const prompt = `You are an expert SEO content strategist for InvestingPro.in, India's financial comparison platform.

TASK: Create a superior article outline for the keyword "${keyword}" that OUTRANKS all current top results.

COMPETITOR ANALYSIS:
${competitorSummary || "No competitor data available — create comprehensive original outline."}

COMPETITOR METRICS:
- Average word count: ${competitiveInsights.avgWordCount}
- Average headings: ${competitiveInsights.avgHeadingCount}
- Average images: ${competitiveInsights.avgImageCount}
- Common headings used: ${competitiveInsights.commonHeadings.slice(0, 10).join(", ") || "N/A"}
- Content gaps: ${competitiveInsights.contentGaps.join("; ")}
- Difficulty: ${competitiveInsights.difficulty}

EXISTING FAQs FROM COMPETITORS:
${allFaqs.map((q) => `- ${q}`).join("\n") || "None found"}

YOUR TARGET:
- Word count: ${competitiveInsights.targetWordCount} words (25% more than competitors)
- Category: ${category}
- Audience: Indian investors/consumers (use ₹, Indian banks, SEBI/RBI context)

INVESTINGPRO ADVANTAGES TO EMBED:
- Real product comparison data (credit cards, mutual funds, FDs, insurance, loans)
- Financial calculators (SIP, EMI, FD, PPF, NPS, tax, FIRE, retirement)
- Transparent scoring methodology
- Affiliate "Apply Now" links for revenue
- Expert tip boxes and fact-check callouts

Return ONLY valid JSON:
{
  "title": "H1 title (compelling, keyword-rich, under 70 chars)",
  "seoTitle": "SEO title tag (under 60 chars, keyword at start)",
  "seoDescription": "Meta description (under 155 chars, includes CTA)",
  "targetWordCount": ${competitiveInsights.targetWordCount},
  "contentStrategy": "2-3 sentence strategy explaining HOW this outline beats competitors",
  "competitiveEdge": ["edge1", "edge2", "edge3"],
  "keywords": ["primary keyword", "secondary1", "secondary2", "long-tail1"],
  "sections": [
    {
      "heading": "Section H2 heading",
      "level": 2,
      "description": "What to cover in this section",
      "targetWords": 300,
      "includeTable": false,
      "includeCalculatorCTA": false,
      "includeImage": true,
      "includeInfobox": false
    }
  ],
  "faqs": [
    { "question": "FAQ question?", "answer": "Concise 2-3 sentence answer with Indian context" }
  ],
  "embeddedElements": [
    {
      "type": "calculator",
      "placement": "after section 2",
      "details": "Embed SIP calculator with pre-filled values for this topic"
    },
    {
      "type": "comparison_table",
      "placement": "in section 3",
      "details": "Top 5 products compared: name, rate, fees, rating, apply link"
    }
  ],
  "internalLinks": [
    {
      "anchorText": "SIP calculator",
      "targetUrl": "/calculators/sip",
      "context": "Link when mentioning SIP calculations"
    }
  ]
}

RULES:
- Include 8-15 sections (more than competitors)
- Include at least 7 FAQs (more than competitors)
- Embed at least 1 calculator CTA and 1 comparison table
- Add expert tip boxes for unique value
- Every section should have a clear purpose
- Use Indian financial terminology (CIBIL, SEBI, RBI, NEFT, UPI, etc.)
- Target featured snippet with FAQ schema
`;

  try {
    const response = await aiService.generate(prompt, {
      format: "json",
      operation: "analyze",
      tier: "precision",
    });

    // Parse JSON response
    let outline: ContentOutline;
    try {
      outline = JSON.parse(response);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        outline = JSON.parse(jsonMatch[1]);
      } else {
        const braceMatch = response.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          outline = JSON.parse(braceMatch[0]);
        } else {
          throw new Error("Could not parse outline JSON");
        }
      }
    }

    // Ensure required fields
    outline.targetWordCount =
      outline.targetWordCount || competitiveInsights.targetWordCount;
    outline.keywords = outline.keywords || [keyword];
    outline.sections = outline.sections || [];
    outline.faqs = outline.faqs || [];
    outline.embeddedElements = outline.embeddedElements || [];
    outline.internalLinks = outline.internalLinks || [];

    logger.info("Superior outline generated", {
      keyword,
      sections: outline.sections.length,
      faqs: outline.faqs.length,
      targetWords: outline.targetWordCount,
    });

    return outline;
  } catch (error) {
    logger.error("Outline generation failed", error as Error);
    // Return fallback outline
    return createFallbackOutline(keyword, category, competitiveInsights);
  }
}

function createFallbackOutline(
  keyword: string,
  category: string,
  insights: SerpAnalysis["competitiveInsights"],
): ContentOutline {
  return {
    title: `${keyword} in India (2026) — Complete Guide`,
    seoTitle: `${keyword} India 2026 — Compare & Choose | InvestingPro`,
    seoDescription: `Compare the best ${keyword.toLowerCase()} options in India. Expert ratings, calculators, and transparent scoring. Updated for 2026.`,
    targetWordCount: insights.targetWordCount,
    contentStrategy:
      "Comprehensive guide covering all competitor topics plus unique InvestingPro advantages like embedded calculators and real product data.",
    competitiveEdge: [
      "Embedded financial calculators",
      "Real-time product comparison data",
      "Transparent scoring methodology",
    ],
    keywords: [
      keyword,
      `best ${keyword}`,
      `${keyword} India`,
      `${keyword} comparison`,
    ],
    sections: [
      {
        heading: `What is ${keyword}?`,
        level: 2,
        description: "Clear definition with Indian context",
        targetWords: 200,
      },
      {
        heading: `Best ${keyword} in India (2026)`,
        level: 2,
        description: "Top picks with comparison table",
        targetWords: 400,
        includeTable: true,
      },
      {
        heading: "How to Choose",
        level: 2,
        description: "Decision framework for Indian consumers",
        targetWords: 300,
        includeInfobox: true,
      },
      {
        heading: "Key Features to Compare",
        level: 2,
        description: "Feature-by-feature breakdown",
        targetWords: 400,
      },
      {
        heading: "Calculator",
        level: 2,
        description: "Interactive calculator for this topic",
        targetWords: 150,
        includeCalculatorCTA: true,
      },
      {
        heading: "Tax Implications",
        level: 2,
        description: "Section 80C/80D and tax treatment",
        targetWords: 250,
      },
      {
        heading: "Expert Tips",
        level: 2,
        description: "Actionable advice from financial experts",
        targetWords: 200,
        includeInfobox: true,
      },
      {
        heading: "FAQs",
        level: 2,
        description: "Common questions and answers",
        targetWords: 300,
      },
    ],
    faqs: [
      {
        question: `What is the best ${keyword} in India?`,
        answer: `The best option depends on your needs. Compare top-rated options on InvestingPro with transparent scoring.`,
      },
      {
        question: `Is ${keyword} safe in India?`,
        answer: `Products regulated by SEBI/RBI/IRDAI are generally safe. Always check the provider's credentials and ratings.`,
      },
    ],
    embeddedElements: [
      {
        type: "comparison_table",
        placement: "in section 2",
        details: "Top 5 products with key metrics",
      },
      {
        type: "calculator",
        placement: "after section 4",
        details: "Relevant calculator for this topic",
      },
    ],
    internalLinks: [
      {
        anchorText: "financial calculators",
        targetUrl: "/calculators",
        context: "When mentioning calculations",
      },
    ],
  };
}
