/**
 * Content Enricher
 *
 * Takes raw markdown article content and an InterLinkSet, then injects:
 * 1. Inline glossary links (first occurrence of each term)
 * 2. Calculator CTA boxes after every 3rd H2
 * 3. "Related Reading" section before the FAQ heading
 * 4. "Top Products" section after Related Reading
 */

import type { InterLinkSet } from "./auto-interlink";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Enrich markdown article content with internal links.
 *
 * @param markdown  The raw markdown body of the article
 * @param links     The InterLinkSet produced by `generateInterlinks()`
 * @returns         Enriched markdown string
 */
export function enrichArticleContent(
  markdown: string,
  links: InterLinkSet,
): string {
  if (!markdown) return markdown;

  let enriched = markdown;

  // Step 1 — Inline glossary links (first occurrence only, case-insensitive)
  enriched = insertGlossaryLinks(enriched, links.glossaryLinks);

  // Step 2 — Calculator CTA boxes after every 3rd H2
  enriched = insertCalculatorCTAs(enriched, links.calculatorLinks);

  // Step 3 — "Related Reading" + "Top Products" before FAQ
  enriched = insertRelatedSections(
    enriched,
    links.relatedArticles,
    links.productPageLinks,
  );

  return enriched;
}

// ---------------------------------------------------------------------------
// Glossary inline linking
// ---------------------------------------------------------------------------

function insertGlossaryLinks(
  markdown: string,
  glossaryLinks: InterLinkSet["glossaryLinks"],
): string {
  if (!glossaryLinks || glossaryLinks.length === 0) return markdown;

  let result = markdown;

  for (const entry of glossaryLinks) {
    if (!entry.term || !entry.slug) continue;

    // Escape special regex characters in the term
    const escaped = entry.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match the first occurrence that is NOT already inside a markdown link
    // i.e. not preceded by [ or followed by ](
    // We use a word-boundary match so partial words are not linked.
    const pattern = new RegExp(`(?<!\\[)\\b(${escaped})\\b(?!\\]\\()`, "i");

    const match = result.match(pattern);
    if (match && match.index !== undefined) {
      const original = match[1];
      const link = `[${original}](/glossary/${entry.slug})`;
      result =
        result.slice(0, match.index) +
        link +
        result.slice(match.index + original.length);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Calculator CTA insertion
// ---------------------------------------------------------------------------

function insertCalculatorCTAs(
  markdown: string,
  calculatorLinks: InterLinkSet["calculatorLinks"],
): string {
  if (!calculatorLinks || calculatorLinks.length === 0) return markdown;

  // Split content into lines to find H2 positions
  const lines = markdown.split("\n");
  const h2Indices: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      h2Indices.push(i);
    }
  }

  // Insert a calculator CTA after every 3rd H2
  // Work backwards so indices stay valid after insertion
  let calcIndex = 0;
  const insertPositions: {
    afterLine: number;
    calc: (typeof calculatorLinks)[number];
  }[] = [];

  for (let i = 0; i < h2Indices.length; i++) {
    // After the 3rd, 6th, 9th… H2
    if ((i + 1) % 3 === 0 && calcIndex < calculatorLinks.length) {
      // Find the end of the section: either the next H2 or 2 lines after current H2
      const nextH2 = h2Indices[i + 1];
      const insertAfter =
        nextH2 !== undefined
          ? nextH2 - 1
          : Math.min(h2Indices[i] + 2, lines.length - 1);

      insertPositions.push({
        afterLine: insertAfter,
        calc: calculatorLinks[calcIndex],
      });
      calcIndex++;
    }
  }

  // Insert backwards to preserve line indices
  for (let i = insertPositions.length - 1; i >= 0; i--) {
    const { afterLine, calc } = insertPositions[i];
    const ctaBlock = buildCalculatorCTA(calc);
    lines.splice(afterLine + 1, 0, "", ctaBlock, "");
  }

  return lines.join("\n");
}

function buildCalculatorCTA(calc: {
  name: string;
  path: string;
  context: string;
}): string {
  return [
    `> **🧮 ${calc.name}**`,
    `> ${calc.context}`,
    `> [Try the ${calc.name} →](${calc.path})`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Related Reading + Top Products sections
// ---------------------------------------------------------------------------

function insertRelatedSections(
  markdown: string,
  relatedArticles: InterLinkSet["relatedArticles"],
  productPageLinks: InterLinkSet["productPageLinks"],
): string {
  const sections: string[] = [];

  // Build "Related Reading" section
  if (relatedArticles && relatedArticles.length > 0) {
    sections.push("## Related Reading");
    sections.push("");
    for (const article of relatedArticles) {
      sections.push(`- [${article.anchor}](/article/${article.slug})`);
    }
    sections.push("");
  }

  // Build "Top Products" section
  if (productPageLinks && productPageLinks.length > 0) {
    sections.push("## Top Products");
    sections.push("");
    for (const product of productPageLinks) {
      sections.push(`- [${product.name}](${product.path})`);
    }
    sections.push("");
  }

  if (sections.length === 0) return markdown;

  const insertBlock = sections.join("\n");

  // Try to insert before the FAQ heading (## FAQ, ## FAQs, ## Frequently Asked Questions)
  const faqPattern = /^(##\s+(?:FAQ|FAQs|Frequently Asked Questions))/im;
  const faqMatch = markdown.match(faqPattern);

  if (faqMatch && faqMatch.index !== undefined) {
    return (
      markdown.slice(0, faqMatch.index) +
      insertBlock +
      "\n" +
      markdown.slice(faqMatch.index)
    );
  }

  // No FAQ section found — append at the end
  return markdown + "\n\n" + insertBlock;
}
