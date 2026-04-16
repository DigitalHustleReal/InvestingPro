/**
 * Generic article publisher — reads HTML from content/ and publishes to Supabase
 * Usage: npx tsx scripts/publish-article.ts <config-json-path>
 *
 * Config JSON format:
 * {
 *   "title": "...",
 *   "slug": "...",
 *   "htmlFile": "content/my-article.html",
 *   "excerpt": "...",
 *   "seoTitle": "...",
 *   "seoDescription": "...",
 *   "category": "tax-planning",
 *   "tags": ["tag1", "tag2"],
 *   "readingTime": 15,
 *   "featuredImage": "https://images.pexels.com/..."
 * }
 */
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface ArticleConfig {
  title: string;
  slug: string;
  htmlFile: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  category: string;
  tags: string[];
  readingTime: number;
  featuredImage?: string;
  authorName?: string;
  schemaMarkup?: Record<string, unknown>;
  scheduledAt?: string; // ISO timestamp for scheduled publishing
}

async function main() {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error("Usage: npx tsx scripts/publish-article.ts <config.json>");
    process.exit(1);
  }

  const config: ArticleConfig = JSON.parse(
    fs.readFileSync(configPath, "utf-8"),
  );

  // Read HTML content
  const htmlPath = path.resolve(config.htmlFile);
  if (!fs.existsSync(htmlPath)) {
    console.error(`HTML file not found: ${htmlPath}`);
    process.exit(1);
  }
  const bodyHtml = fs.readFileSync(htmlPath, "utf-8");

  // Check if article already exists
  const { data: existing } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", config.slug)
    .single();

  const now = new Date().toISOString();
  const isScheduled = !!config.scheduledAt;

  const articleData: Record<string, unknown> = {
    title: config.title,
    slug: config.slug,
    excerpt: config.excerpt,
    seo_title: config.seoTitle || `${config.title} | InvestingPro`,
    seo_description: config.seoDescription || config.excerpt,
    body_html: bodyHtml,
    body_markdown: "",
    content: bodyHtml,
    category: config.category,
    tags: config.tags,
    status: isScheduled ? "scheduled" : "published",
    published_at: isScheduled ? config.scheduledAt : now,
    published_date: isScheduled
      ? config.scheduledAt!.split("T")[0]
      : now.split("T")[0],
    updated_at: now,
    reading_time: config.readingTime,
    read_time: String(config.readingTime),
    author_name: config.authorName || "InvestingPro Research",
    featured_image: config.featuredImage || "",
    views: 0,
  };

  if (isScheduled) {
    articleData.scheduled_publish_at = config.scheduledAt;
  }

  if (config.schemaMarkup) {
    articleData.schema_markup = config.schemaMarkup;
  }

  let result;
  if (existing?.id) {
    console.log(`Updating existing article ${existing.id}...`);
    const { data, error } = await supabase
      .from("articles")
      .update(articleData)
      .eq("id", existing.id)
      .select("id, slug, title, status")
      .single();
    result = { data, error };
  } else {
    console.log("Inserting new article...");
    const { data, error } = await supabase
      .from("articles")
      .insert(articleData)
      .select("id, slug, title, status")
      .single();
    result = { data, error };
  }

  if (result.error) {
    console.error("Error:", result.error);
    process.exit(1);
  }

  console.log(`✅ Article ${isScheduled ? "scheduled" : "published"}!`);
  console.log(`   Title: ${result.data?.title}`);
  console.log(`   Status: ${result.data?.status}`);
  console.log(`   URL: https://investingpro.in/articles/${result.data?.slug}`);
  if (isScheduled) {
    console.log(`   Scheduled for: ${config.scheduledAt}`);
  }
}

main().catch(console.error);
