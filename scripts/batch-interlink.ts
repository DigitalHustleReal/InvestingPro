/**
 * Batch Article Interlinking
 *
 * Adds article-to-article links for articles that have zero cross-links.
 * Finds related articles by category + title keyword overlap, then
 * inserts contextual <a> tags into body_html.
 *
 * Usage: npx tsx scripts/batch-interlink.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Category normalization (some use underscores, some hyphens)
function normalizeCategory(cat: string): string {
  return cat.replace(/_/g, "-").toLowerCase();
}

// Related category groups
const CATEGORY_GROUPS: Record<string, string[]> = {
  "credit-cards": ["credit-cards", "loans", "banking"],
  loans: ["loans", "credit-cards", "banking", "personal-finance"],
  insurance: ["insurance", "personal-finance", "tax"],
  investing: ["investing", "mutual-funds", "demat-accounts", "stocks", "ipo"],
  "mutual-funds": ["mutual-funds", "investing", "personal-finance"],
  "demat-accounts": ["demat-accounts", "investing", "stocks"],
  "demat-account": ["demat-accounts", "investing", "stocks"],
  stocks: ["stocks", "investing", "demat-accounts", "ipo"],
  banking: ["banking", "fixed-deposits", "personal-finance"],
  "fixed-deposits": ["fixed-deposits", "banking", "investing"],
  "fixed-deposit": ["fixed-deposits", "banking", "investing"],
  tax: ["tax", "personal-finance", "insurance"],
  "personal-finance": ["personal-finance", "investing", "banking", "tax"],
  "investing-basics": [
    "investing-basics",
    "investing",
    "mutual-funds",
    "personal-finance",
  ],
  ipo: ["ipo", "investing", "stocks", "demat-accounts"],
  retirement: ["retirement", "personal-finance", "investing"],
  "small-business": ["small-business", "loans", "tax"],
  "mutual-fund": ["mutual-funds", "investing", "personal-finance"],
};

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  body_html: string;
}

// Extract significant words from title (for matching)
function extractKeywords(title: string): string[] {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "how",
    "what",
    "which",
    "why",
    "when",
    "where",
    "who",
    "can",
    "should",
    "you",
    "your",
    "it",
    "its",
    "this",
    "that",
    "these",
    "those",
    "vs",
    "india",
    "indian",
    "2026",
    "2025",
    "best",
    "top",
    "complete",
    "guide",
    "explained",
    "comparison",
    "compared",
    "all",
    "every",
    "much",
    "many",
    "better",
    "actually",
    "really",
    "need",
    "step",
    "simple",
    "tips",
  ]);

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

// Find matching phrases in HTML content (only in text, not in tags/attrs)
function findTextMatch(html: string, phrase: string): number {
  // Simple approach: find phrase in text outside of HTML tags
  const lowerHtml = html.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();

  let pos = 0;
  while (pos < lowerHtml.length) {
    const idx = lowerHtml.indexOf(lowerPhrase, pos);
    if (idx === -1) return -1;

    // Check we're not inside an HTML tag or existing link
    const before = lowerHtml.substring(Math.max(0, idx - 200), idx);
    const lastOpenTag = before.lastIndexOf("<");
    const lastCloseTag = before.lastIndexOf(">");

    // Inside a tag if last < is after last >
    if (lastOpenTag > lastCloseTag) {
      pos = idx + 1;
      continue;
    }

    // Inside an existing <a> tag?
    const lastAOpen = before.lastIndexOf("<a ");
    const lastAClose = before.lastIndexOf("</a>");
    if (lastAOpen > lastAClose) {
      pos = idx + 1;
      continue;
    }

    // Inside heading? Skip — links in headings are bad practice
    const lastH = before.lastIndexOf("<h");
    const lastHClose = before.lastIndexOf("</h");
    if (lastH > lastHClose) {
      pos = idx + 1;
      continue;
    }

    return idx;
  }

  return -1;
}

// Insert a link at position in HTML
function insertLink(
  html: string,
  position: number,
  matchLength: number,
  slug: string,
): string {
  const matchText = html.substring(position, position + matchLength);
  const link = `<a href="/articles/${slug}">${matchText}</a>`;
  return (
    html.substring(0, position) + link + html.substring(position + matchLength)
  );
}

// Find related articles
function findRelated(article: Article, allArticles: Article[]): Article[] {
  const normCat = normalizeCategory(article.category);
  const relatedCats = CATEGORY_GROUPS[normCat] || [normCat];

  const keywords = extractKeywords(article.title);

  const scored = allArticles
    .filter((a) => a.id !== article.id)
    .map((a) => {
      let score = 0;
      const aNormCat = normalizeCategory(a.category);

      // Same category: +3
      if (aNormCat === normCat) score += 3;
      // Related category: +1
      else if (relatedCats.includes(aNormCat)) score += 1;
      // Unrelated: skip
      else return { article: a, score: 0 };

      // Title keyword overlap
      const aKeywords = extractKeywords(a.title);
      const overlap = keywords.filter((k) => aKeywords.includes(k));
      score += overlap.length * 0.5;

      return { article: a, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  return scored.map((s) => s.article);
}

// Build anchor text options from article title
function getAnchorTexts(title: string): string[] {
  const texts: string[] = [];

  // Full title (may be too long)
  if (title.length <= 60) texts.push(title);

  // Title before colon/dash
  const parts = title.split(/[:\u2014\u2013–—]/);
  if (parts[0] && parts[0].trim().length > 10) {
    texts.push(parts[0].trim());
  }

  // Key phrases from title
  const phrases = title.replace(/[()[\]]/g, "").split(/[,:\u2014\u2013–—?]/);

  for (const p of phrases) {
    const trimmed = p.trim();
    if (trimmed.length >= 8 && trimmed.length <= 50) {
      texts.push(trimmed);
    }
  }

  // Extract short key phrases (3-5 words)
  const words = title.split(/\s+/);
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = words.slice(i, i + 3).join(" ");
    if (phrase.length >= 10 && phrase.length <= 40) {
      texts.push(phrase);
    }
  }

  return [...new Set(texts)];
}

async function main() {
  console.log("=== Batch Article Interlinking ===\n");

  // Fetch all published articles
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, body_html")
    .eq("status", "published");

  if (error || !articles) {
    console.error("Failed to fetch articles:", error);
    return;
  }

  console.log(`Total published articles: ${articles.length}`);

  // Find articles with 0 article-to-article links
  const needsLinks = articles.filter((a) => {
    const html = a.body_html || "";
    return !html.includes("/articles/");
  });

  console.log(`Articles with 0 article links: ${needsLinks.length}`);

  // Also find articles with < 3 article links
  const weakLinks = articles.filter((a) => {
    const html = a.body_html || "";
    const matches = html.match(/href=["']\/articles\//g) || [];
    return matches.length > 0 && matches.length < 3;
  });

  console.log(`Articles with 1-2 article links: ${weakLinks.length}`);

  const toProcess = [...needsLinks, ...weakLinks];
  console.log(`\nProcessing ${toProcess.length} articles...\n`);

  let totalLinksAdded = 0;
  let articlesUpdated = 0;
  let articlesSkipped = 0;

  for (const article of toProcess) {
    if (!article.body_html) {
      articlesSkipped++;
      continue;
    }

    const related = findRelated(article, articles);
    if (related.length === 0) {
      articlesSkipped++;
      continue;
    }

    let html = article.body_html;
    let linksAdded = 0;
    const linkedSlugs = new Set<string>();
    const linkedPositions: number[] = [];

    // Count existing article links
    const existingLinks = (html.match(/href=["']\/articles\//g) || []).length;
    const targetLinks = 5; // Aim for 5 total article-to-article links
    const linksNeeded = Math.max(0, targetLinks - existingLinks);

    if (linksNeeded === 0) {
      articlesSkipped++;
      continue;
    }

    for (const related of findRelated(article, articles)) {
      if (linksAdded >= linksNeeded) break;
      if (linkedSlugs.has(related.slug)) continue;

      // Already linked to this article?
      if (html.includes(`/articles/${related.slug}`)) {
        linkedSlugs.add(related.slug);
        continue;
      }

      // Try to find a matching phrase in the content
      const anchors = getAnchorTexts(related.title);
      let linked = false;

      for (const anchor of anchors) {
        const pos = findTextMatch(html, anchor);
        if (pos === -1) continue;

        // Check not too close to another inserted link
        const tooClose = linkedPositions.some((p) => Math.abs(p - pos) < 300);
        if (tooClose) continue;

        html = insertLink(html, pos, anchor.length, related.slug);
        linkedSlugs.add(related.slug);
        linkedPositions.push(pos);
        linksAdded++;
        linked = true;
        break;
      }

      // If no phrase match, try individual significant keywords
      if (!linked) {
        const keywords = extractKeywords(related.title).filter(
          (k) => k.length >= 5,
        ); // Only meaningful words

        for (const kw of keywords) {
          const pos = findTextMatch(html, kw);
          if (pos === -1) continue;
          const tooClose = linkedPositions.some((p) => Math.abs(p - pos) < 300);
          if (tooClose) continue;

          html = insertLink(html, pos, kw.length, related.slug);
          linkedSlugs.add(related.slug);
          linkedPositions.push(pos);
          linksAdded++;
          break;
        }
      }
    }

    if (linksAdded > 0) {
      const { error: updateError } = await supabase
        .from("articles")
        .update({ body_html: html })
        .eq("id", article.id);

      if (updateError) {
        console.log(`  ERROR updating ${article.slug}: ${updateError.message}`);
      } else {
        totalLinksAdded += linksAdded;
        articlesUpdated++;
        if (articlesUpdated % 10 === 0) {
          console.log(
            `  Progress: ${articlesUpdated} articles updated, ${totalLinksAdded} links added...`,
          );
        }
      }
    } else {
      articlesSkipped++;
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Articles updated: ${articlesUpdated}`);
  console.log(`Links added: ${totalLinksAdded}`);
  console.log(`Articles skipped: ${articlesSkipped}`);

  // Final verification
  const { data: verifyData } = await supabase
    .from("articles")
    .select("slug, body_html")
    .eq("status", "published");

  let zeroLinks = 0;
  let weakLinksCount = 0;
  const stats: number[] = [];

  verifyData?.forEach((a) => {
    const count = (a.body_html?.match(/href=["']\/articles\//g) || []).length;
    stats.push(count);
    if (count === 0) zeroLinks++;
    else if (count < 3) weakLinksCount++;
  });

  const avg = stats.reduce((a, b) => a + b, 0) / stats.length;
  console.log(`\n=== FINAL STATE ===`);
  console.log(`Articles with 0 article links: ${zeroLinks}`);
  console.log(`Articles with 1-2 article links: ${weakLinksCount}`);
  console.log(`Average article links per article: ${avg.toFixed(1)}`);
}

main().catch(console.error);
