/**
 * Auto-SEO: Pure-logic SEO metadata generation for articles.
 * No AI calls — deterministic, fast, zero-cost.
 */

export interface ArticleSEO {
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  readingTime: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
}

// Common filler/stop words to strip from keywords
const FILLER_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "can",
  "need",
  "dare",
  "ought",
  "used",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "out",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "because",
  "but",
  "and",
  "or",
  "if",
  "while",
  "about",
  "up",
  "its",
  "it",
  "this",
  "that",
  "these",
  "those",
  "what",
  "which",
  "who",
  "whom",
  "your",
  "you",
  "we",
  "they",
  "he",
  "she",
  "me",
  "him",
  "her",
  "us",
  "them",
  "my",
  "his",
  "our",
  "their",
]);

const BEGINNER_SIGNALS = [
  "beginner",
  "guide",
  "what is",
  "basics",
  "introduction",
  "getting started",
  "101",
  "explained",
];
const ADVANCED_SIGNALS = [
  "advanced",
  "strategy",
  "portfolio",
  "optimization",
  "deep dive",
  "masterclass",
  "expert",
];
const INTERMEDIATE_SIGNALS = [
  "vs",
  "comparison",
  "best",
  "top",
  "review",
  "compare",
  "difference",
];

/**
 * Strip markdown headings, bold, italic, links, images, and HTML tags.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+.*$/gm, "") // headings
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1") // links → text
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italic
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // code
    .replace(/<[^>]+>/g, "") // HTML tags
    .trim();
}

/**
 * Extract paragraphs from content (lines that aren't headings, blank, or list markers only).
 */
function extractParagraphs(content: string): string[] {
  return content
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter((block) => {
      if (!block) return false;
      if (/^#{1,6}\s/.test(block)) return false;
      if (/^[-*]\s*$/.test(block)) return false;
      if (/^!\[/.test(block)) return false;
      return true;
    })
    .map(stripMarkdown)
    .filter((p) => p.length > 20);
}

/**
 * Extract H2 headings from markdown content.
 */
function extractH2s(content: string): string[] {
  const matches = content.match(/^##\s+(.+)$/gm);
  if (!matches) return [];
  return matches.map((m) => m.replace(/^##\s+/, "").trim());
}

/**
 * Count words in a text string.
 */
function wordCount(text: string): number {
  const cleaned = stripMarkdown(text);
  const words = cleaned.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Extract meaningful words from a string (> 3 chars, not filler).
 */
function extractMeaningfulWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !FILLER_WORDS.has(w));
}

/**
 * Truncate text to a max length, breaking at word boundaries.
 */
function truncateAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
}

/**
 * Split text into sentences.
 */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

/**
 * Generate complete SEO metadata for an article using pure logic (no AI).
 */
export function generateArticleSEO(
  title: string,
  content: string,
  category: string,
): ArticleSEO {
  // --- seoTitle ---
  const brandSuffix = " | InvestingPro";
  let seoTitle: string;
  if (title.length + brandSuffix.length <= 60) {
    seoTitle = title + brandSuffix;
  } else {
    seoTitle = truncateAtWord(title, 60);
  }

  // --- seoDescription ---
  const paragraphs = extractParagraphs(content);
  const firstPara = paragraphs[0] || title;
  const descBase = truncateAtWord(firstPara, 125);
  const seoDescription = descBase.endsWith(".")
    ? `${descBase} Read more on InvestingPro.`
    : `${descBase}. Read more on InvestingPro.`;

  // --- excerpt ---
  const allText = paragraphs.join(" ");
  const sentences = splitSentences(allText);
  let excerpt = "";
  for (const sentence of sentences) {
    const candidate = excerpt ? `${excerpt} ${sentence}` : sentence;
    if (candidate.length > 300) break;
    excerpt = candidate;
  }
  if (!excerpt) {
    excerpt = truncateAtWord(allText || title, 300);
  }
  // Ensure at least 200 chars if content allows
  if (excerpt.length < 200 && allText.length > excerpt.length) {
    excerpt = truncateAtWord(allText, 300);
  }

  // --- readingTime ---
  const totalWords = wordCount(content);
  const readingTime = Math.max(1, Math.ceil(totalWords / 200));

  // --- difficulty ---
  const titleLower = title.toLowerCase();
  let difficulty: "beginner" | "intermediate" | "advanced" = "intermediate";
  if (BEGINNER_SIGNALS.some((s) => titleLower.includes(s))) {
    difficulty = "beginner";
  } else if (ADVANCED_SIGNALS.some((s) => titleLower.includes(s))) {
    difficulty = "advanced";
  } else if (INTERMEDIATE_SIGNALS.some((s) => titleLower.includes(s))) {
    difficulty = "intermediate";
  }

  // --- tags ---
  const categoryWords = extractMeaningfulWords(category);
  const titleWords = extractMeaningfulWords(title);
  const tagSet = new Set<string>([...categoryWords, ...titleWords]);
  // Add category itself as a tag if meaningful
  const categoryClean = category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim();
  if (categoryClean.length > 3) {
    tagSet.add(categoryClean);
  }
  const tags = Array.from(tagSet).slice(0, 8);

  // --- primaryKeyword ---
  const primaryKeyword =
    extractMeaningfulWords(title).join(" ") || title.toLowerCase();

  // --- secondaryKeywords ---
  const h2s = extractH2s(content);
  const secondaryKeywords = [
    categoryClean,
    ...h2s.slice(0, 3).map((h) => h.toLowerCase()),
  ].filter((kw) => kw.length > 0);

  return {
    seoTitle,
    seoDescription,
    excerpt,
    readingTime,
    difficulty,
    tags,
    primaryKeyword,
    secondaryKeywords,
  };
}
