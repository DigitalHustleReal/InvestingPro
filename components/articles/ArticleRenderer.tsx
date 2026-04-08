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
  className = "prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-th:bg-muted/50 prose-th:text-foreground prose-th:p-4 prose-th:rounded-t-lg prose-td:p-4 prose-img:rounded-xl prose-img:shadow-lg",
}: ArticleRendererProps) {
  // Get raw content from any source (priority: body_html > body_markdown > content)
  const rawContent = body_html || body_markdown || content || "";

  if (!rawContent || !rawContent.trim()) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center">
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
        <div className="p-8 bg-danger-50 rounded-lg border border-danger-200">
          <p className="text-danger-800 text-center">
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
