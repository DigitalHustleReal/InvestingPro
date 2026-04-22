"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics/posthog-service";
import { CheckCircle2, Mail } from "lucide-react";

// Inline newsletter capture placed at the end of every article.
// Compact, editorial tone — "liked this? here's more like it".
// Fires on-page without a popup (user preference: no popups).

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  category?: string;
  articleSlug?: string;
}

export default function ArticleNewsletterInline({
  category,
  articleSlug,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "article_bottom_inline",
          interests: category ? [category] : undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Couldn't subscribe. Try again.");
        setStatus("error");
        return;
      }

      trackEvent("newsletter_subscribed", {
        source: "article_bottom_inline",
        article_slug: articleSlug,
        article_category: category,
      });
      setStatus("success");
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  return (
    <aside
      aria-label="Newsletter signup"
      className="my-10 bg-ink text-canvas border-2 border-ink rounded-sm p-6 sm:p-8 relative overflow-hidden"
    >
      {/* Gold accent underline — editorial signature */}
      <div className="absolute bottom-0 left-6 w-16 h-[3px] bg-indian-gold" />

      <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="w-12 h-12 bg-indian-gold flex items-center justify-center rounded-sm flex-shrink-0">
          <Mail className="w-5 h-5 text-ink" />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-2 font-semibold">
            The Weekly Decision
          </div>
          <h3 className="font-display font-bold text-[22px] sm:text-[26px] text-canvas leading-snug mb-2">
            Like this? Get one like it{" "}
            <em className="italic text-indian-gold">every Friday.</em>
          </h3>
          <p className="text-[13px] text-canvas-70 leading-relaxed mb-4 max-w-lg">
            One email per week with our best research on{" "}
            {category
              ? category.replace(/-/g, " ").toLowerCase()
              : "Indian personal finance"}
            . No spam. No affiliate pitches. Unsubscribe anytime.
          </p>

          {status === "success" ? (
            <div className="flex items-center gap-2 bg-action-green/20 border border-action-green/30 rounded-sm px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-action-green flex-shrink-0" />
              <span className="font-mono text-[11px] text-canvas">
                Check your inbox to confirm. First issue ships Friday.
              </span>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-0 max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  disabled={status === "submitting"}
                  className="flex-1 px-4 py-2.5 border-2 border-canvas/20 sm:border-r-0 rounded-sm sm:rounded-r-none bg-ink/60 text-canvas text-sm placeholder:text-canvas-70/50 focus:outline-none focus:border-indian-gold disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="px-5 py-2.5 mt-2 sm:mt-0 bg-indian-gold text-ink font-mono text-[11px] uppercase tracking-wider font-semibold rounded-sm sm:rounded-l-none hover:bg-canvas transition-colors disabled:opacity-50"
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
              {status === "error" && error && (
                <p
                  role="alert"
                  className="font-mono text-[11px] text-warning-red mt-2"
                >
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
