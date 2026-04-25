/**
 * Category FAQ — Server Component
 *
 * Renders a v3 FAQ block + FAQPage JSON-LD for AI ingestion.
 * Per claude-seo:seo-schema (Aug 2023 update): FAQPage rich snippets are
 * restricted to gov / healthcare on Google. The schema is still valuable
 * for ChatGPT / Claude / Perplexity citation, so we emit it regardless.
 *
 * Visible Q&A is the primary GEO win — AI agents pattern-match on the
 * "Q: ... A: ..." structure and lift it as a citation block.
 */

import { getFAQsForCategory } from "@/lib/content/faqs";
import { urlCategoryLabel, type UrlCategory } from "@/lib/routing/category-map";

export default async function CategoryFAQ({
  urlCategory,
  variant = "canvas",
}: {
  urlCategory: UrlCategory;
  variant?: "canvas" | "ink";
}) {
  const faqs = await getFAQsForCategory(urlCategory);
  if (!faqs.length) return null;

  const label = urlCategoryLabel(urlCategory);

  // FAQPage schema. Google may not render rich snippets on commercial
  // sites (Aug 2023 restriction), but ChatGPT/Claude/Perplexity ingest it.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const isInk = variant === "ink";
  const sectionClass = isInk ? "surface-ink" : "bg-canvas";
  const eyebrowClass = "text-indian-gold";
  const headingClass = isInk ? "text-canvas" : "text-ink";
  const detailBg = isInk ? "border-canvas-15" : "border-ink-12";
  const questionText = isInk ? "text-canvas" : "text-ink";
  const answerText = isInk ? "text-canvas-70" : "text-ink-80";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className={`${sectionClass} py-14`}>
        <div className="max-w-[920px] mx-auto px-6">
          <div
            className={`font-mono text-[10px] uppercase tracking-[0.2em] ${eyebrowClass} mb-3`}
          >
            Quick answers
          </div>
          <h2
            className={`font-display font-black text-[28px] md:text-[36px] leading-[1.1] ${headingClass} tracking-tight mb-10`}
          >
            {label} — frequently asked
          </h2>

          <div className={`divide-y ${detailBg} border-t border-b ${detailBg}`}>
            {faqs.map((f, i) => (
              <details key={i} className="group">
                <summary
                  className={`flex items-start justify-between gap-6 py-5 cursor-pointer list-none ${questionText} hover:text-indian-gold transition-colors`}
                >
                  <span className="font-display text-[18px] md:text-[20px] font-black leading-tight">
                    {f.question}
                  </span>
                  <span
                    className={`shrink-0 mt-1 font-mono text-[16px] font-black ${eyebrowClass} group-open:rotate-45 transition-transform`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div
                  className={`pb-6 pr-10 font-serif text-[15px] md:text-[16px] leading-[1.65] ${answerText}`}
                >
                  {f.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
