/**
 * Generate ONE article using the full pipeline:
 * SERP Analysis → RAG Context → AI Generation → Enrichment → SEO → Interlinks → Publish
 *
 * Usage: npx tsx --env-file=.env.local scripts/generate-one-article.ts "Best Credit Cards in India 2026" credit-cards
 */
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { analyzeSERP } from "../lib/ai/serp-analyzer";
import { generateArticleSEO } from "../lib/ai/auto-seo";
import { getAuthorForCategory } from "../lib/ai/auto-author";
import { enrichArticleContent } from "../lib/ai/content-enricher";
import { generateInterlinks } from "../lib/ai/auto-interlink";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const CALC_MAP: Record<string, string[]> = {
  "credit-cards": ["[EMI Calculator](https://investingpro.in/calculators/emi)"],
  "mutual-funds": [
    "[SIP Calculator](https://investingpro.in/calculators/sip)",
    "[Lumpsum Calculator](https://investingpro.in/calculators/lumpsum)",
  ],
  tax: [
    "[Income Tax Calculator](https://investingpro.in/calculators/income-tax)",
  ],
  loans: ["[EMI Calculator](https://investingpro.in/calculators/emi)"],
  "fixed-deposits": ["[FD Calculator](https://investingpro.in/calculators/fd)"],
  "investing-basics": [
    "[SIP Calculator](https://investingpro.in/calculators/sip)",
  ],
};

async function getProductData(category: string): Promise<string> {
  if (category === "credit-cards") {
    const { data, error } = await supabase
      .from("credit_cards")
      .select(
        "name, bank, type, description, annual_fee, reward_rate, rewards, min_income, pros, cons, lounge_access, fuel_surcharge_waiver, rating, slug",
      )
      .order("rating", { ascending: false })
      .limit(12);
    if (error) console.log("  CC query error:", error.message);
    if (data && data.length > 0) {
      let ctx = `\n=== REAL CREDIT CARD DATA (${data.length} cards from InvestingPro DB) ===\n`;
      ctx += "USE ONLY THIS DATA. Do NOT make up card features.\n";
      data.forEach((c: any, i: number) => {
        ctx += `\nCard ${i + 1}: ${c.name} (${c.rating}/5)\n`;
        ctx += `  Bank: ${c.bank}\n`;
        ctx += `  Type: ${c.type || "General"}\n`;
        ctx += `  Annual Fee: ${typeof c.annual_fee === "number" ? `₹${c.annual_fee}` : c.annual_fee || "N/A"}\n`;
        ctx += `  Reward Rate: ${c.reward_rate ? `${c.reward_rate}x` : "N/A"}\n`;
        ctx += `  Min Income: ${typeof c.min_income === "number" ? `₹${c.min_income.toLocaleString("en-IN")}` : "N/A"}\n`;
        ctx += `  Lounge Access: ${c.lounge_access ? "Yes" : "No"}\n`;
        ctx += `  Fuel Surcharge Waiver: ${c.fuel_surcharge_waiver ? "Yes" : "No"}\n`;
        if (c.rewards && c.rewards.length > 0)
          ctx += `  Rewards: ${c.rewards.slice(0, 3).join("; ")}\n`;
        if (c.pros && c.pros.length > 0)
          ctx += `  Pros: ${c.pros.slice(0, 3).join("; ")}\n`;
        if (c.cons && c.cons.length > 0)
          ctx += `  Cons: ${c.cons.slice(0, 2).join("; ")}\n`;
        ctx += `  Link: https://investingpro.in/credit-cards/${c.slug}\n`;
      });
      return ctx;
    }
  }
  const catMap: Record<string, string> = {
    "mutual-funds": "mutual_fund",
    loans: "loan",
    "fixed-deposits": "fixed_deposit",
  };
  const dbCat = catMap[category];
  if (!dbCat) return "";
  const { data } = await supabase
    .from("products")
    .select("name, provider_name, rating, best_for, pros, cons")
    .eq("category", dbCat)
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .limit(10);
  if (!data || data.length === 0) return "";
  let ctx = "\n=== REAL PRODUCT DATA ===\n";
  data.forEach((p: any, i: number) => {
    ctx += `\nProduct ${i + 1}: ${p.name}\n  Provider: ${p.provider_name || "N/A"}\n  Rating: ${p.rating || "N/A"}/5\n  Best For: ${p.best_for || "N/A"}\n`;
    if (p.pros)
      ctx += `  Pros: ${Array.isArray(p.pros) ? p.pros.join(", ") : p.pros}\n`;
    if (p.cons)
      ctx += `  Cons: ${Array.isArray(p.cons) ? p.cons.join(", ") : p.cons}\n`;
  });
  return ctx;
}

async function main() {
  const topic = process.argv[2] || "Best Credit Cards in India 2026";
  const category = process.argv[3] || "credit-cards";
  const slug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  console.log("=== FULL PIPELINE ARTICLE GENERATOR ===\n");
  console.log(`Topic: ${topic}`);
  console.log(`Category: ${category}`);
  console.log(`Slug: ${slug}\n`);

  // Step 1: SERP Analysis
  console.log("STEP 1: Analyzing SERP...");
  let serpData;
  try {
    serpData = await analyzeSERP(topic);
    console.log(`  Top results: ${serpData.topResults.length}`);
    console.log(`  Content gaps: ${serpData.contentGaps.join(", ")}`);
    console.log(`  Target word count: ${serpData.targetWordCount}`);
    console.log(`  Suggested H2s: ${serpData.suggestedH2s.length}`);
  } catch (err: any) {
    console.log(`  SERP failed: ${err.message?.slice(0, 60)}, using defaults`);
    serpData = {
      keyword: topic,
      topResults: [],
      avgWordCount: 2000,
      commonH2s: [],
      contentGaps: ["comprehensive comparison", "real data"],
      targetWordCount: 2500,
      suggestedH2s: [],
    };
  }

  // Step 2: Product data (RAG)
  console.log("\nSTEP 2: Fetching product data...");
  const productCtx = await getProductData(category);
  console.log(
    `  Product context: ${productCtx ? productCtx.split("\n").length + " lines" : "none"}`,
  );

  // Step 3: Generate content with SERP-informed prompt
  console.log("\nSTEP 3: Generating article via GPT-4o...");
  const calcLinks = (CALC_MAP[category] || []).join("\n");
  const serpH2s =
    serpData.suggestedH2s.length > 0
      ? `\n=== SERP-INFORMED H2 OUTLINE (use these as your structure) ===\n${serpData.suggestedH2s.map((h, i) => `${i + 1}. ${h}`).join("\n")}\n`
      : "";
  const serpGaps =
    serpData.contentGaps.length > 0
      ? `\n=== CONTENT GAPS TO FILL (competitors miss these — cover them) ===\n${serpData.contentGaps.map((g) => `- ${g}`).join("\n")}\n`
      : "";

  const prompt = `You are the lead financial writer at InvestingPro.in — India's NerdWallet. Write an AUTHORITATIVE article that outranks every competitor.

TOPIC: ${topic}
TARGET WORD COUNT: ${serpData.targetWordCount || 2500}+ words (competitors average ${serpData.avgWordCount || 1800})
${productCtx}
${serpH2s}
${serpGaps}
=== CALCULATORS TO EMBED ===
${calcLinks}

=== MANDATORY STRUCTURE ===
1. Opening hook with surprising stat (100-150 words)
2. > **Quick Answer:** [2-3 sentence direct answer for featured snippet]
3. **At a Glance** comparison table (top 5 products, real data only)
4. 8-12 deep sections (## headings), each 200-400 words with:
   - ### subsections, > **Expert Tip:** boxes, > **Warning:** boxes
   - Real numbers from product data above
   - Calculator links where relevant
5. REQUIRED sections: "How to Choose", "Step-by-Step Guide", "Common Mistakes", "Who Should/Shouldn't", "The Bottom Line"
6. ## Frequently Asked Questions (7-10 Q&As, ### per question)
7. Disclaimer at end

=== RULES ===
- Use only INR with Lakh/Crore format
- Reference SPECIFIC products from data — NO hallucination
- Bold key numbers and product names
- Include internal links to InvestingPro calculators
- Write at 10th-grade reading level
- Every H2 should be a searchable phrase
- No AI-obvious filler phrases`;

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 8000,
    temperature: 0.6,
  });
  let content = result.choices[0]?.message?.content || "";
  const rawWordCount = content.split(/\s+/).length;
  console.log(
    `  Raw content: ${rawWordCount} words, ${(content.match(/^## /gm) || []).length} H2 sections`,
  );

  // Step 4: Auto SEO
  console.log("\nSTEP 4: Generating SEO metadata...");
  const seo = generateArticleSEO(topic, content, category);
  console.log(`  Title: ${seo.seoTitle}`);
  console.log(`  Reading time: ${seo.readingTime} min`);
  console.log(`  Difficulty: ${seo.difficulty}`);
  console.log(`  Tags: ${seo.tags.join(", ")}`);

  // Step 5: Author persona
  console.log("\nSTEP 5: Assigning author...");
  const author = getAuthorForCategory(category);
  console.log(`  Author: ${author.name} (${author.expertise})`);

  // Step 6: Interlinks
  console.log("\nSTEP 6: Generating interlinks...");
  let interlinks;
  try {
    interlinks = await generateInterlinks(category, topic, slug);
    console.log(`  Related articles: ${interlinks.relatedArticles.length}`);
    console.log(`  Calculator links: ${interlinks.calculatorLinks.length}`);
    console.log(`  Product links: ${interlinks.productPageLinks.length}`);
  } catch (err: any) {
    console.log(`  Interlinks failed: ${err.message?.slice(0, 60)}`);
    interlinks = {
      relatedArticles: [],
      calculatorLinks: [],
      productPageLinks: [],
      glossaryLinks: [],
    };
  }

  // Step 7: Enrich content
  console.log("\nSTEP 7: Enriching content with links...");
  try {
    content = enrichArticleContent(content, interlinks);
    const enrichedWordCount = content.split(/\s+/).length;
    console.log(
      `  Enriched: ${enrichedWordCount} words (added ${enrichedWordCount - rawWordCount})`,
    );
  } catch (err: any) {
    console.log(
      `  Enrichment failed: ${err.message?.slice(0, 60)}, using raw content`,
    );
  }

  // Step 8: Quality scoring
  const wordCount = content.split(/\s+/).length;
  const h2Count = (content.match(/^## /gm) || []).length;
  const h3Count = (content.match(/^### /gm) || []).length;
  const hasTable = content.includes("|");
  const hasFaq = /faq|frequently/i.test(content);
  const hasLinks = content.includes("](");
  const hasBlockquote = content.includes("> **");
  const hasBold = (content.match(/\*\*/g) || []).length;

  let quality = 50;
  if (wordCount > 2000) quality += 8;
  if (wordCount > 2500) quality += 7;
  if (wordCount > 3000) quality += 5;
  if (hasTable) quality += 8;
  if (hasFaq) quality += 5;
  if (h2Count >= 8) quality += 5;
  if (h2Count >= 10) quality += 3;
  if (h3Count >= 5) quality += 3;
  if (hasLinks) quality += 3;
  if (hasBlockquote) quality += 3;
  if (hasBold > 10) quality += 3;
  if (interlinks.relatedArticles.length > 0) quality += 2;
  if (interlinks.productPageLinks.length > 0) quality += 2;
  quality = Math.min(quality, 97);

  console.log(`\nSTEP 8: Quality score: ${quality}/100`);

  // Step 9: Save to DB
  console.log("\nSTEP 9: Saving to Supabase...");
  const { data: saved, error } = await supabase
    .from("articles")
    .insert({
      title: topic,
      slug,
      body_markdown: content,
      body_html: "",
      content,
      excerpt: seo.excerpt,
      category,
      status: "published",
      published_at: new Date().toISOString(),
      seo_title: seo.seoTitle,
      seo_description: seo.seoDescription,
      quality_score: quality,
      language: "en",
      tags: seo.tags,
      ai_generated: true,
      difficulty_level: seo.difficulty,
      read_time: seo.readingTime,
      primary_keyword: seo.primaryKeyword,
      secondary_keywords: seo.secondaryKeywords,
    })
    .select("id")
    .single();

  if (error) {
    console.log(`  DB ERROR: ${error.message}`);
    return;
  }

  console.log(`  Saved: ${saved.id}`);

  // Summary
  console.log("\n=== ARTICLE PUBLISHED ===");
  console.log(`Title: ${topic}`);
  console.log(`URL: https://investingpro.in/articles/${slug}`);
  console.log(`Words: ${wordCount}`);
  console.log(`Quality: ${quality}/100`);
  console.log(`Sections: ${h2Count} H2, ${h3Count} H3`);
  console.log(`Author: ${author.name}`);
  console.log(`Reading time: ${seo.readingTime} min`);
  console.log(`Table: ${hasTable ? "Yes" : "No"}`);
  console.log(`FAQ: ${hasFaq ? "Yes" : "No"}`);
  console.log(
    `Interlinks: ${interlinks.relatedArticles.length} articles, ${interlinks.calculatorLinks.length} calcs, ${interlinks.productPageLinks.length} products`,
  );
  console.log(
    `\nPipeline: SERP → RAG → GPT-4o → SEO → Author → Interlinks → Enrich → Publish`,
  );
}

main().catch(console.error);
