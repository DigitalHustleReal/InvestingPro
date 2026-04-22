"use client";

import Link from "next/link";
import { getDeskForCategory } from "@/lib/data/team";

interface DeskBylineProps {
  /** Article category — used to auto-select the right editorial desk */
  category?: string | null;
  /** ISO date string or locale-formatted date to display */
  updatedAt?: string | null;
  className?: string;
}

/**
 * DeskByline — shows the editorial desk responsible for an article.
 *
 * InvestingPro Tax Desk
 * Tax planning · ITR filing · Section 80C, HRA, capital gains  ·  Updated Apr 17, 2026
 * Fact-checked against official sources  ·  Editorial standards →
 */
export function DeskByline({
  category,
  updatedAt,
  className = "",
}: DeskBylineProps) {
  const desk = getDeskForCategory(category);

  const formattedDate = updatedAt
    ? (() => {
        try {
          return new Date(updatedAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } catch {
          return updatedAt;
        }
      })()
    : null;

  return (
    <div className={`text-[13px] leading-relaxed ${className}`}>
      {/* Desk name */}
      <span className="font-semibold text-ink dark:text-gray-100">
        {desk.name}
      </span>

      {/* Expertise tags + date on the same line */}
      <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-muted-foreground">
        {desk.expertiseTags.map((tag, i) => (
          <span key={tag}>
            {i > 0 && <span className="mr-1.5 opacity-40">·</span>}
            {tag}
          </span>
        ))}
        {formattedDate && (
          <>
            <span className="opacity-40">·</span>
            <span>Updated {formattedDate}</span>
          </>
        )}
      </div>

      {/* Fact-check + editorial link */}
      <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-muted-foreground">
        <Link
          href="/about/editorial-team"
          className="hover:text-primary hover:underline transition-colors"
        >
          Fact-checked against official sources
        </Link>
        <span className="opacity-40">·</span>
        <Link
          href="/about/editorial-standards"
          className="hover:text-primary hover:underline transition-colors"
        >
          Editorial standards →
        </Link>
      </div>
    </div>
  );
}
