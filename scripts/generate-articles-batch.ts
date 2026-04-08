import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const TOPICS = [
  {
    topic: "Best Credit Cards in India 2026",
    category: "credit-cards",
    slug: "best-credit-cards-india-2026",
  },
  {
    topic: "Best Cashback Credit Cards India 2026",
    category: "credit-cards",
    slug: "best-cashback-credit-cards-india-2026",
  },
  {
    topic: "Best Travel Credit Cards India with Lounge Access",
    category: "credit-cards",
    slug: "best-travel-credit-cards-india-lounge-access",
  },
  {
    topic: "Best Credit Cards for Online Shopping India",
    category: "credit-cards",
    slug: "best-credit-cards-online-shopping-india",
  },
  {
    topic: "Best Lifetime Free Credit Cards India 2026",
    category: "credit-cards",
    slug: "best-lifetime-free-credit-cards-india-2026",
  },
  {
    topic: "Best Credit Card for Salary 25000 to 50000",
    category: "credit-cards",
    slug: "best-credit-card-salary-25000-50000",
  },
  {
    topic: "HDFC Regalia Gold vs Axis Magnus Comparison",
    category: "credit-cards",
    slug: "hdfc-regalia-gold-vs-axis-magnus-comparison",
  },
  {
    topic: "How to Increase CIBIL Score from 650 to 750",
    category: "credit-cards",
    slug: "how-to-increase-cibil-score-650-to-750",
  },
  {
    topic: "Best SIP Plans to Invest in 2026 for Beginners",
    category: "mutual-funds",
    slug: "best-sip-plans-2026-beginners",
  },
  {
    topic: "Best ELSS Tax Saving Mutual Funds 2026",
    category: "mutual-funds",
    slug: "best-elss-tax-saving-mutual-funds-2026",
  },
  {
    topic: "SIP vs Lumpsum Investment Which is Better",
    category: "mutual-funds",
    slug: "sip-vs-lumpsum-investment-which-is-better",
  },
  {
    topic: "Best Index Funds in India 2026 for Long Term",
    category: "mutual-funds",
    slug: "best-index-funds-india-2026-long-term",
  },
  {
    topic: "How to Start SIP with 500 Rupees Complete Guide",
    category: "mutual-funds",
    slug: "how-to-start-sip-500-rupees-guide",
  },
  {
    topic: "Old vs New Tax Regime 2026 Which is Better",
    category: "tax",
    slug: "old-vs-new-tax-regime-2026-which-is-better",
  },
  {
    topic: "Section 80C Tax Saving Options Guide 2026",
    category: "tax",
    slug: "section-80c-tax-saving-options-guide-2026",
  },
  {
    topic: "Best Tax Saving Investments 80C 80D 80E",
    category: "tax",
    slug: "best-tax-saving-investments-80c-80d-80e",
  },
  {
    topic: "Home Loan Interest Rates All Banks 2026",
    category: "loans",
    slug: "home-loan-interest-rates-all-banks-2026",
  },
  {
    topic: "How to Get Home Loan with Low CIBIL Score",
    category: "loans",
    slug: "how-to-get-home-loan-low-cibil-score",
  },
  {
    topic: "Home Loan EMI Calculator How Much Can You Afford",
    category: "loans",
    slug: "home-loan-emi-calculator-how-much-afford",
  },
  {
    topic: "Best Fixed Deposit Rates India 2026 All Banks",
    category: "fixed-deposits",
    slug: "best-fixed-deposit-rates-india-2026",
  },
  {
    topic: "Small Finance Bank FD Rates 2026 Higher Returns",
    category: "fixed-deposits",
    slug: "small-finance-bank-fd-rates-2026",
  },
  {
    topic: "Complete Guide to Personal Finance for Beginners India",
    category: "investing-basics",
    slug: "guide-personal-finance-beginners-india",
  },
  {
    topic: "What is Mutual Fund How It Works Explained",
    category: "investing-basics",
    slug: "what-is-mutual-fund-how-it-works",
  },
  {
    topic: "PPF vs NPS vs ELSS Best for Tax Saving",
    category: "investing-basics",
    slug: "ppf-vs-nps-vs-elss-best-tax-saving",
  },
  {
    topic: "How to Build Emergency Fund in India",
    category: "investing-basics",
    slug: "how-to-build-emergency-fund-india",
  },
];

const CALC_MAP: Record<string, string[]> = {
  "credit-cards": ["[EMI Calculator](https://investingpro.in/calculators/emi)"],
  "mutual-funds": [
    "[SIP Calculator](https://investingpro.in/calculators/sip)",
    "[Lumpsum Calculator](https://investingpro.in/calculators/lumpsum)",
  ],
  tax: [
    "[Income Tax Calculator](https://investingpro.in/calculators/income-tax)",
  ],
  loans: [
    "[EMI Calculator](https://investingpro.in/calculators/emi)",
    "[Home Loan Calculator](https://investingpro.in/calculators/home-loan)",
  ],
  "fixed-deposits": ["[FD Calculator](https://investingpro.in/calculators/fd)"],
  "investing-basics": [
    "[SIP Calculator](https://investingpro.in/calculators/sip)",
    "[PPF Calculator](https://investingpro.in/calculators/ppf)",
  ],
};

async function getProductData(category: string): Promise<string> {
  const catMap: Record<string, string> = {
    "credit-cards": "credit_card",
    "mutual-funds": "mutual_fund",
    loans: "loan",
    "fixed-deposits": "fixed_deposit",
  };

  if (category === "credit-cards") {
    const { data } = await supabase
      .from("credit_cards")
      .select(
        "name, bank, annual_fee, reward_rate, best_for, benefits, lounge_access",
      )
      .limit(10);
    if (data && data.length > 0) {
      let ctx = "\n=== REAL CREDIT CARD DATA ===\n";
      data.forEach((c: any, i: number) => {
        ctx += `\nCard ${i + 1}: ${c.name}\n`;
        ctx += `  Bank: ${c.bank || "N/A"}\n`;
        ctx += `  Annual Fee: ${c.annual_fee || "N/A"}\n`;
        ctx += `  Reward Rate: ${c.reward_rate || "N/A"}\n`;
        ctx += `  Best For: ${c.best_for || "N/A"}\n`;
        if (c.lounge_access) ctx += `  Lounge: ${c.lounge_access}\n`;
      });
      return ctx;
    }
  }

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
    ctx += `\nProduct ${i + 1}: ${p.name}\n`;
    ctx += `  Provider: ${p.provider_name || "N/A"}\n`;
    ctx += `  Rating: ${p.rating || "N/A"}/5\n`;
    ctx += `  Best For: ${p.best_for || "N/A"}\n`;
    if (p.pros)
      ctx += `  Pros: ${Array.isArray(p.pros) ? p.pros.join(", ") : p.pros}\n`;
    if (p.cons)
      ctx += `  Cons: ${Array.isArray(p.cons) ? p.cons.join(", ") : p.cons}\n`;
  });
  return ctx;
}

async function generate(t: (typeof TOPICS)[0]): Promise<boolean> {
  console.log(`\n  Generating: ${t.topic}`);

  const { data: existing } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", t.slug)
    .maybeSingle();

  if (existing) {
    console.log(`    Skip (exists)`);
    return false;
  }

  const productCtx = await getProductData(t.category);
  const calcLinks = (CALC_MAP[t.category] || []).join("\n");

  const prompt = `You are the lead financial writer at InvestingPro.in — India's NerdWallet. Write an AUTHORITATIVE, deeply researched article that outranks every competitor on Google for this topic.

TOPIC: ${t.topic}

ABSOLUTE MINIMUM: 2,500 words. Target 3,000+. Google rewards comprehensive content.

${productCtx}

=== CALCULATORS TO LINK (embed naturally, not just at the end) ===
${calcLinks}

=== MANDATORY ARTICLE STRUCTURE ===

1. **Opening Hook (100-150 words)**
   - Start with a surprising stat, question, or scenario an Indian reader relates to
   - State what this article covers and why it matters RIGHT NOW in April 2026
   - Include the primary keyword in the first sentence

2. **Quick Answer Box** (for featured snippet capture)
   - Use a > blockquote with a 2-3 sentence direct answer to the topic
   - Format: > **Quick Answer:** [direct answer]

3. **At a Glance** (comparison table)
   - Markdown table with | pipes comparing top 5 products
   - Columns: Product Name | Key Feature | Annual Fee/Cost | Best For | Our Rating
   - Use ONLY real data from the product data above

4. **Deep Sections (## headings, 8-12 sections)**
   Each section should be 200-400 words with:
   - ### subsections for detailed breakdowns
   - Real numbers (interest rates, fees, returns) from product data
   - > **Expert Tip:** callout boxes with actionable advice
   - > **Warning:** callout for common pitfalls
   - Bullet lists for scannable content
   - Inline links to InvestingPro calculators where relevant

5. **Required Sections (MUST include ALL of these):**
   - "## How to Choose [the right product]" — decision framework with criteria
   - "## Step-by-Step Guide" — numbered actionable steps
   - "## Common Mistakes to Avoid" — 5+ mistakes with explanations
   - "## [Product] vs [Alternative]" — comparison subsection
   - "## Who Should [action] and Who Shouldn't" — clear segmentation
   - "## Tax Implications" — if applicable to the topic
   - "## What Experts Say" — quote or paraphrase industry perspective
   - "## The Bottom Line" — clear, opinionated recommendation

6. **FAQ Section (## Frequently Asked Questions)**
   - 7-10 Q&As using ### for each question
   - Answers should be 2-4 sentences each
   - Questions should match what people actually Google
   - Include long-tail question variants

7. **Disclaimer (at the very end)**
   - "---"
   - "*Disclaimer: This article is for educational purposes only. InvestingPro.in is not a SEBI-registered investment advisor. Please consult a qualified financial advisor before making investment decisions. Data sourced from official bank/AMC websites and AMFI, verified as of April 2026.*"

=== CONTENT QUALITY RULES ===
- Use INR: always ₹ symbol, Lakh/Crore format (₹5,000, ₹10L, ₹1.5Cr)
- Reference SPECIFIC products with REAL data from above — NO hallucination
- Every claim backed by data or marked: "In our analysis..." / "Based on our research..."
- Include internal links naturally: [SIP Calculator](https://investingpro.in/calculators/sip)
- Bold key numbers and product names for scannability
- Use --- horizontal rules between major sections
- Include "Last updated: April 2026" in the opening
- Write at a 10th-grade reading level — expert but not jargon-heavy
- Address the reader as "you" — conversational but authoritative

=== SEO RULES ===
- Primary keyword in first paragraph, first H2, and last paragraph
- Use semantic variations throughout (e.g., "best credit cards" → "top-rated cards" → "highest-rated credit cards")
- H2 headings should be questions people Google
- Each H2 should be independently useful (snippet-worthy)
- FAQ questions should match "People Also Ask" format

DO NOT:
- Write generic filler ("In today's fast-paced world...")
- Use AI-obvious phrases ("It's important to note that...")
- Make up features, fees, or rates not in the data
- Recommend specific stocks or give SEBI-registered advice
- Use passive voice excessively
- End sections with "In conclusion" or "To summarize"`;

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8000,
      temperature: 0.6,
    });
    const content = result.choices[0]?.message?.content || "";

    if (!content || content.length < 3000) {
      console.log(`    Failed: too short (${content?.length || 0} chars)`);
      return false;
    }

    const wordCount = content.split(/\s+/).length;
    const h2Count = (content.match(/^## /gm) || []).length;
    const h3Count = (content.match(/^### /gm) || []).length;
    const hasTable = content.includes("|");
    const hasFaq = /faq|frequently/i.test(content);
    const hasLinks = content.includes("](");
    const hasBlockquote = content.includes("> **");
    const hasHr = content.includes("---");
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
    if (hasHr) quality += 2;
    if (hasBold > 10) quality += 3;
    quality = Math.min(quality, 97);

    const excerpt =
      content
        .split("\n")
        .find(
          (l: string) =>
            l.length > 60 && !l.startsWith("#") && !l.startsWith("|"),
        )
        ?.slice(0, 155) || t.topic;

    const { error } = await supabase.from("articles").insert({
      title: t.topic,
      slug: t.slug,
      body_markdown: content,
      body_html: "",
      content: content,
      excerpt,
      category: t.category,
      status: "published",
      published_at: new Date().toISOString(),
      seo_title: `${t.topic} | InvestingPro`.slice(0, 60),
      seo_description: excerpt,
      quality_score: quality,
      language: "en",
      tags: [t.category, "india", "2026", "guide"],
      ai_generated: true,
    });

    if (error) {
      console.log(`    DB error: ${error.message}`);
      return false;
    }

    console.log(
      `    Published: ${wordCount} words, q:${quality}, ${h2Count} sections`,
    );
    return true;
  } catch (err: any) {
    console.log(`    AI error: ${err.message?.slice(0, 80)}`);
    return false;
  }
}

async function main() {
  console.log("InvestingPro Content Generator - RAG Batch");
  console.log(`${TOPICS.length} articles queued\n`);

  let ok = 0;
  let fail = 0;

  for (const t of TOPICS) {
    const success = await generate(t);
    if (success) ok++;
    else fail++;
    await new Promise((r) => setTimeout(r, 2500));
  }

  console.log(`\n=== DONE: ${ok} published, ${fail} skipped/failed ===`);
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact" });
  console.log(`Total articles: ${count}`);
}

main().catch(console.error);
