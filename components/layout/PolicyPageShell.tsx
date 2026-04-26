/**
 * PolicyPageShell — shared v3 chrome for legal/compliance pages
 * (privacy, terms, disclaimer, cookie-policy, affiliate-disclosure).
 *
 * Renders the v3 ink hero + breadcrumb + max-width content slot.
 * Inner content uses `.article-prose` so Playfair H2/H3 + ink colors
 * + indian-gold pull-quote + mono OL apply automatically.
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface PolicyPageShellProps {
  title: string;
  /** Highlighted segment shown in indian-gold (split the title) */
  highlight: string;
  lead: string;
  lastUpdated: string;
  breadcrumbLabel: string;
  /** Eyebrow line above title (e.g. "Trust", "Legal") */
  eyebrow?: string;
  children: React.ReactNode;
  /** Optional bottom-strip footer links */
  footerLinks?: { label: string; href: string }[];
}

const DEFAULT_FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Affiliate disclosure", href: "/affiliate-disclosure" },
];

export function PolicyPageShell({
  title,
  highlight,
  lead,
  lastUpdated,
  breadcrumbLabel,
  eyebrow = "Legal",
  children,
  footerLinks = DEFAULT_FOOTER_LINKS,
}: PolicyPageShellProps) {
  // Split the title around the highlight phrase. Falls back to whole-title
  // if highlight isn't a substring.
  const idx = title.indexOf(highlight);
  const before = idx >= 0 ? title.slice(0, idx) : title;
  const after = idx >= 0 ? title.slice(idx + highlight.length) : "";

  return (
    <div className="min-h-screen bg-canvas">
      <section className="surface-ink pt-12 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-canvas-70">
              <li>
                <Link
                  href="/"
                  className="hover:text-indian-gold transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-3 h-3" />
                </Link>
              </li>
              <ChevronRight className="w-3 h-3 text-canvas-70" />
              <li className="text-canvas">{breadcrumbLabel}</li>
            </ol>
          </nav>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-indian-gold mb-4">
            {eyebrow} · Last updated {lastUpdated}
          </div>
          <h1 className="font-display font-black text-[40px] md:text-[58px] leading-[1.05] tracking-tight text-canvas max-w-[860px]">
            {before}
            {idx >= 0 && <span className="text-indian-gold">{highlight}</span>}
            {after}
          </h1>
          <p className="mt-7 font-serif text-[19px] md:text-[21px] leading-[1.55] text-canvas max-w-[820px]">
            {lead}
          </p>
        </div>
      </section>

      <section className="bg-canvas py-12 md:py-16">
        <div className="max-w-[820px] mx-auto px-6 article-prose">
          {children}
        </div>
      </section>

      <section className="bg-canvas py-10 border-t-2 border-ink-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-60">
          <div>
            {breadcrumbLabel} · last updated {lastUpdated}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-indian-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
