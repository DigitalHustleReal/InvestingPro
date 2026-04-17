import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { Mistral } from "@mistralai/mistralai";
import OpenAI from "openai";

// Load env vars
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Error: Supabase credentials missing");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Article Topics Type
interface Topic {
  category: string;
  title: string;
  keywords: string;
  target_audience: string;
}

// Helper: Get Prompt — NerdWallet-quality content
function getArticlePrompt(topic: Topic): string {
  return `You are a senior financial content writer for InvestingPro.in, India's independent financial comparison platform. Write like NerdWallet — authoritative, clear, data-driven, trustworthy.

Write a comprehensive article on: "${topic.title}"

TARGET: ${topic.target_audience}
KEYWORDS: ${topic.keywords}

CONTENT RULES:
1. Length: 2000-3000 words minimum
2. Voice: Second-person ("you/your"), short paragraphs (1-3 sentences max)
3. Explain every financial term on first use in plain language
4. Use ₹ for all amounts, Indian context only (RBI, SEBI, IRDAI references)
5. Include real numbers, rates, and data points (current as of April 2026)
6. Never give personalized financial advice — always add "consult a qualified advisor"
7. Tone: Professional, helpful, non-promotional. Like a trusted friend who's also an expert.

HTML FORMAT (CRITICAL — no Markdown, no H1):
- Start with a <div class="key-takeaways"> section (3-5 bullet points summarizing the article)
- Use <h2> for 8-10 major sections
- Use <h3> for sub-sections within each h2
- Keep paragraphs SHORT: 1-3 sentences each in <p> tags
- Use <ul><li> for lists (minimum 4 lists in the article)
- Use <table> for any comparison data (with <thead> and <tbody>)
- Use <blockquote> for expert tips (1-2 times)
- Use <div class="pro-tip"><h4>Pro Tip</h4><p>...</p></div> for actionable advice
- Use <div class="warning-box"><h4>Warning</h4><p>...</p></div> for cautions
- Use <strong> for emphasis, never for entire sentences

INTERNAL LINKING (MUST INCLUDE):
Add 5-8 internal links using this format:
- <a href="/calculators/sip">SIP Calculator</a> — link to relevant calculators
- <a href="/calculators/emi">EMI Calculator</a>
- <a href="/calculators/fd">FD Calculator</a>
- <a href="/calculators/ppf">PPF Calculator</a>
- <a href="/articles/SLUG">related article title</a> — link to related articles
- <a href="/glossary/TERM-SLUG">term</a> — link glossary terms (use dashed-underline style)
- <a href="/credit-cards">Compare Credit Cards</a> — link to product pages

GLOSSARY LINKING — wrap these terms with glossary links when they first appear:
CIBIL Score → <a href="/glossary/cibil-score" class="glossary-link">CIBIL Score</a>
SIP → <a href="/glossary/sip-systematic-investment-plan" class="glossary-link">SIP</a>
NAV → <a href="/glossary/nav-net-asset-value" class="glossary-link">NAV</a>
EMI → <a href="/glossary/emi-equated-monthly-instalment" class="glossary-link">EMI</a>
AUM → <a href="/glossary/aum-assets-under-management" class="glossary-link">AUM</a>
APR → <a href="/glossary/apr-annual-percentage-rate" class="glossary-link">APR</a>
CAGR → <a href="/glossary/cagr-compound-annual-growth-rate" class="glossary-link">CAGR</a>

FAQ SECTION (MUST INCLUDE AT END):
End with exactly 5 FAQs in this format:
<div class="faq-section">
<h2>Frequently Asked Questions</h2>
<div class="faq-item"><h3>Question here?</h3><p>Answer here (2-3 sentences).</p></div>
<div class="faq-item"><h3>Question here?</h3><p>Answer here.</p></div>
</div>

DISCLAIMER (ADD AT VERY END):
<div class="warning-box"><h4>Disclaimer</h4><p>This article is for informational purposes only and does not constitute financial advice. Rates and offers are subject to change. Please consult a SEBI-registered advisor before making investment decisions. InvestingPro.in may earn a commission when you apply through our links.</p></div>

Generate ONLY the clean article content HTML now. No Markdown. No H1 tags. No code blocks.`;
}

// AI Providers
async function tryGemini(topic: Topic): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not found");

  // Using GoogleGenAI SDK format (v0.1.0+) which might function differently than v1
  // Adjusting to common pattern for @google/generative-ai if that's what's installed or @google/genai
  // The previous script used @google/genai. Let's assume standard google-generative-ai pattern if the other fails,
  // but the import said @google/genai.
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models
    .generateContent({
      model: "gemini-2.0-flash-exp", // Trying a reliable model name, or fallback to gemini-1.5-flash
      contents: [{ role: "user", parts: [{ text: getArticlePrompt(topic) }] }],
    })
    .catch(async () => {
      // Fallback model
      return await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          { role: "user", parts: [{ text: getArticlePrompt(topic) }] },
        ],
      });
    });

  return response.response.text();
}

async function tryGroq(topic: Topic): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not found");
  const groq = new Groq({ apiKey });
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: getArticlePrompt(topic) }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content || "";
}

async function tryMistral(topic: Topic): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY not found");
  const client = new Mistral({ apiKey });
  const response = await client.chat.complete({
    model: "mistral-small-latest",
    messages: [{ role: "user", content: getArticlePrompt(topic) }],
  });
  return response.choices?.[0]?.message?.content || "";
}

async function tryOpenAI(topic: Topic): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  // Check if it's the placeholder
  if (!apiKey || apiKey.includes("PqPq"))
    throw new Error("OPENAI_API_KEY not found or invalid");
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    messages: [{ role: "user", content: getArticlePrompt(topic) }],
    model: "gpt-4o-mini",
  });
  return completion.choices[0]?.message?.content || "";
}

// Meta Description Generator
async function generateMeta(topic: Topic, content: string): Promise<string> {
  try {
    // Use Groq for speed/cost if available
    if (process.env.GROQ_API_KEY) {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Write a 150 char meta description for article "${topic.title}". Content start: ${content.substring(0, 500)}`,
          },
        ],
        model: "llama-3.1-8b-instant",
      });
      return (
        completion.choices[0]?.message?.content?.replace(/["']/g, "") || ""
      );
    }
    return `${topic.title} - Comprehensive guide for ${topic.target_audience}. Learn about ${topic.keywords}.`;
  } catch {
    return `${topic.title} - Comprehensive guide for ${topic.target_audience}. Learn about ${topic.keywords}.`;
  }
}

// Utils
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function calculateReadingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Extract FAQ Schema from generated HTML
function extractFAQSchema(html: string, title: string): any | null {
  try {
    const faqRegex =
      /<div class="faq-item">\s*<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>\s*<\/div>/gs;
    const faqs: { question: string; answer: string }[] = [];
    let match;
    while ((match = faqRegex.exec(html)) !== null) {
      faqs.push({ question: match[1].trim(), answer: match[2].trim() });
    }
    if (faqs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  } catch {
    return null;
  }
}

// Main Process
async function main() {
  console.log("🚀 Starting Batch Article Generation...");

  // START PIPELINE LOG
  // We import dynamically or use direct DB insert if outside Next.js context issues arise
  // But since this is a script, direct DB is safer and faster than importing the class if it relies on Next.js headers
  const runId = crypto.randomUUID();
  try {
    await supabase.from("pipeline_runs").insert({
      id: runId,
      pipeline_type: "article_generator",
      status: "running",
      params: { mode: "batch" },
      started_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Failed to start log", e);
  }

  const topicsPath = path.join(process.cwd(), "scripts/data/topics.json");
  if (!fs.existsSync(topicsPath)) {
    console.error("❌ Topic list not found");
    return;
  }

  const topics: Topic[] = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
  console.log(`📋 Found ${topics.length} topics`);

  // Process batch — configurable via BATCH_SIZE env var
  const batchSize = parseInt(process.env.BATCH_SIZE || "10", 10);
  const batchOffset = parseInt(process.env.BATCH_OFFSET || "0", 10);
  const limitedTopics = topics.slice(batchOffset, batchOffset + batchSize);
  console.log(
    `📦 Batch: Processing topics ${batchOffset + 1}-${batchOffset + limitedTopics.length} of ${topics.length}`,
  );

  let generated = 0;
  let errors = 0;

  for (const topic of limitedTopics) {
    try {
      // Check existence
      const slug = createSlug(topic.title);
      const { data: existing } = await supabase
        .from("articles")
        .select("id")
        .eq("slug", slug)
        .single();
      if (existing) {
        console.log(`⏩ Skipping "${topic.title}" (Already exists)`);
        continue;
      }

      console.log(`📝 Generating "${topic.title}"...`);

      // Generate Content with failover
      let content = "";
      let provider = "";

      // Try providers
      try {
        content = await tryGemini(topic);
        provider = "Gemini";
      } catch (e) {
        console.log("   🔸 Gemini failed, trying Groq...");
        try {
          content = await tryGroq(topic);
          provider = "Groq";
        } catch (e) {
          console.log("   🔸 Groq failed, trying Mistral...");
          try {
            content = await tryMistral(topic);
            provider = "Mistral";
          } catch (e) {
            console.log("   🔸 Mistral failed, trying OpenAI...");
            try {
              content = await tryOpenAI(topic);
              provider = "OpenAI";
            } catch (e) {
              console.error(`❌ All providers failed for "${topic.title}"`);
              errors++;
              continue;
            }
          }
        }
      }

      // Clean up content (sometimes models output markdown blocks)
      content = content
        .replace(/^```html/, "")
        .replace(/```$/, "")
        .trim();

      // Generate Metadata
      const metaDesc = await generateMeta(topic, content);
      const readTime = calculateReadingTime(content);

      // --- IMAGE GENERATION START ---
      let featuredImage: string | null = null;
      try {
        // Dynamic Import for the new Manager
        const { ImageManager } = await import("@/lib/media/image-manager");

        const result = await ImageManager.selectImage(
          topic.title,
          topic.category,
        );
        if (result) {
          featuredImage = result.url;
          // We could also store result.credit if we had a column for it
        }
      } catch (imgErr) {
        console.error("   ⚠️ Image Manager failed:", imgErr);
        // Last ditch fallback
        featuredImage =
          "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=1200&q=80";
      }
      // --- IMAGE GENERATION END ---

      // Extract FAQs from content for schema markup
      const faqSchema = extractFAQSchema(content, topic.title);

      // Map category to author desk
      const deskMap: Record<string, string> = {
        credit_cards: "InvestingPro Credit Team",
        "credit-cards": "InvestingPro Credit Team",
        mutual_fund: "InvestingPro Investment Desk",
        "mutual-funds": "InvestingPro Investment Desk",
        loan: "InvestingPro Lending Desk",
        loans: "InvestingPro Lending Desk",
        "personal-loans": "InvestingPro Lending Desk",
        insurance: "InvestingPro Insurance Desk",
        tax: "InvestingPro Tax Desk",
        tax_planning: "InvestingPro Tax Desk",
        "tax-planning": "InvestingPro Tax Desk",
        banking: "InvestingPro Banking Desk",
        "fixed-deposits": "InvestingPro Banking Desk",
        fixed_deposit: "InvestingPro Banking Desk",
        investing: "InvestingPro Investment Desk",
        "investing-basics": "InvestingPro Investment Desk",
        stocks: "InvestingPro Investment Desk",
        "demat-accounts": "InvestingPro Investment Desk",
        retirement: "InvestingPro Investment Desk",
        ipo: "InvestingPro Investment Desk",
        "personal-finance": "InvestingPro Editorial Team",
        personal_finance: "InvestingPro Editorial Team",
        "small-business": "InvestingPro Editorial Team",
        small_business: "InvestingPro Editorial Team",
      };
      const authorName =
        deskMap[topic.category] || "InvestingPro Editorial Team";

      // Save to DB
      const articleData = {
        title: topic.title,
        slug,
        excerpt: metaDesc,
        category: topic.category,
        body_html: content,
        meta_title: topic.title,
        meta_description: metaDesc,
        featured_image: featuredImage,
        status: "published",
        published_at: new Date().toISOString(),
        published_date: new Date().toISOString().split("T")[0],
        content_type: "article",
        read_time: readTime,
        author_name: authorName,
        schema_markup: faqSchema ? { faqSchema } : null,
        tags: topic.keywords
          .split(",")
          .map((k: string) => k.trim())
          .slice(0, 5),
        pipeline_run_id: runId,
      };

      const { error: insertError } = await supabase
        .from("articles")
        .insert([articleData]);

      if (insertError) throw insertError;

      console.log(`✅ Saved "${topic.title}" using ${provider}`);
      generated++;

      // Wait 2s to be nice to APIs
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err: any) {
      console.error(`❌ Error processing "${topic.title}":`, err.message);
      errors++;
    }
  }

  // COMPLETE PIPELINE LOG
  try {
    await supabase
      .from("pipeline_runs")
      .update({
        status: errors > 0 ? "completed_with_errors" : "completed",
        completed_at: new Date().toISOString(),
        result: { generated, errors },
      })
      .eq("id", runId);
  } catch (e) {
    console.error("Failed to complete log", e);
  }

  console.log(`\n🎉 Batch Complete! Generated ${generated} new articles.`);
}

main();
