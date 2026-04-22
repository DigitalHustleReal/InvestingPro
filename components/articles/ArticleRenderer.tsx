/**
 * Shared Article Renderer Component
 *
 * Used by both preview and public article pages for consistent rendering.
 * Handles normalized HTML rendering with proper styling.
 */

import React from "react";
import { normalizeArticleBody } from "@/lib/content/normalize";
import { enrichContent } from "@/lib/content/link-manager";
import CalculatorHydrator from "@/components/tools/CalculatorHydrator";
import ReactMarkdown from "react-markdown";
import { logger } from "@/lib/logger";

interface ArticleRendererProps {
  body_html?: string | null;
  body_markdown?: string | null;
  content?: string | null; // Legacy fallback
  className?: string;
}

export default function ArticleRenderer({
  body_html,
  body_markdown,
  content,
  className = "article-prose",
}: ArticleRendererProps) {
  // Get raw content from any source (priority: body_html > body_markdown > content)
  const rawContent = body_html || body_markdown || content || "";

  if (!rawContent || !rawContent.trim()) {
    return (
      <div className="p-8 bg-canvas rounded-sm border-2 border-ink/10">
        <p className="font-mono text-[12px] uppercase tracking-wider text-ink-60 text-center">
          No content available for this article.
        </p>
      </div>
    );
  }

  try {
    // 1. NORMALIZE: Convert all content to clean HTML
    const normalizedHTML = normalizeArticleBody(rawContent);

    if (!normalizedHTML || normalizedHTML.trim().length < 10) {
      return (
        <div className="p-8 bg-warning-red/5 rounded-sm border-2 border-warning-red/20">
          <p className="font-mono text-[12px] uppercase tracking-wider text-warning-red text-center">
            Error rendering content.
          </p>
        </div>
      );
    }

    // 2. ENRICH: Expand shortcodes and links
    const enrichedHTML = enrichContent(normalizedHTML);

    // Render normalized HTML + Hydrator
    return (
      <>
        <div
          className={className}
          dangerouslySetInnerHTML={{ __html: enrichedHTML }}
        />
        <CalculatorHydrator />
      </>
    );
  } catch (error) {
    logger.error(
      "Error rendering article content",
      error instanceof Error ? error : undefined,
    );
    // Fallback to ReactMarkdown
    return (
      <div className={className}>
        <ReactMarkdown>{rawContent}</ReactMarkdown>
      </div>
    );
  }
}
