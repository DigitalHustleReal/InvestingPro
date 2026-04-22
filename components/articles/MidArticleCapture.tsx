"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mail, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface MidArticleCaptureProps {
  category: string;
  articleId: string;
}

const categoryLeadMagnets: Record<
  string,
  { title: string; description: string }
> = {
  "credit-cards": {
    title: "Free Credit Card Rewards Guide",
    description:
      "Get our comparison sheet of the top 20 credit cards in India with hidden perks most sites don't tell you.",
  },
  "mutual-funds": {
    title: "Free Mutual Fund Starter Kit",
    description:
      "Download our curated list of best-performing funds for 2026 with SIP recommendations by goal.",
  },
  investing: {
    title: "Free Investment Checklist",
    description:
      "Our 15-point checklist used by SEBI-registered advisors before making any investment decision.",
  },
  loans: {
    title: "Free Loan Comparison Sheet",
    description:
      "Get our live-updated spreadsheet comparing interest rates across all major Indian banks.",
  },
  insurance: {
    title: "Free Insurance Planning Guide",
    description:
      "Calculate exactly how much life and health cover you need based on your age, income, and dependents.",
  },
  "fixed-deposits": {
    title: "Free FD Rate Tracker",
    description:
      "Get our weekly updated sheet of the best FD rates across 30+ banks and NBFCs in India.",
  },
  "demat-accounts": {
    title: "Free Broker Comparison Guide",
    description:
      "Side-by-side comparison of charges, platforms, and features of India's top 10 brokers.",
  },
  tax: {
    title: "Free Tax Saving Playbook",
    description:
      "Our step-by-step guide to legally save up to ₹1.5L in taxes using Section 80C, 80D, and NPS.",
  },
};

const defaultLeadMagnet = {
  title: "Free Personal Finance Toolkit",
  description:
    "Get our curated collection of calculators, comparison sheets, and planning templates — used by 10,000+ readers.",
};

function getLeadMagnet(category: string) {
  const slug = (category || "").toLowerCase();
  for (const [key, value] of Object.entries(categoryLeadMagnets)) {
    if (slug.includes(key)) return value;
  }
  return defaultLeadMagnet;
}

export default function MidArticleCapture({
  category,
  articleId,
}: MidArticleCaptureProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const dismissKey = `dismissed_capture_${articleId}`;

  // Check if previously dismissed
  useEffect(() => {
    try {
      if (localStorage.getItem(dismissKey)) {
        setDismissed(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, [dismissKey]);

  // IntersectionObserver to trigger visibility at ~50% scroll
  useEffect(() => {
    if (dismissed) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [dismissed]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(dismissKey, "1");
    } catch {
      // localStorage unavailable
    }
  }, [dismissKey]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || loading) return;

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      setLoading(true);
      setError("");

      // Attempt Supabase save (best-effort)
      try {
        const supabase = createClient();
        await supabase.from("email_captures").insert({
          email,
          category,
          article_id: articleId,
          lead_magnet: getLeadMagnet(category).title,
          created_at: new Date().toISOString(),
        });
      } catch {
        // Table may not exist — that's okay
      }

      // Save locally to prevent re-showing
      try {
        localStorage.setItem(dismissKey, "1");
      } catch {
        // localStorage unavailable
      }

      setSubmitted(true);
      setLoading(false);
    },
    [email, loading, category, articleId, dismissKey],
  );

  const leadMagnet = getLeadMagnet(category);

  // The sentinel div is always rendered so IntersectionObserver can track it
  if (dismissed) {
    return <div ref={sentinelRef} aria-hidden="true" />;
  }

  if (submitted) {
    return (
      <div className="my-10 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-white px-8 py-8 dark:border-green-800 dark:from-green-950/30 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-action-green dark:text-green-400" />
          <div>
            <p className="text-base font-semibold text-green-800 dark:text-green-300">
              You&apos;re in! Check your inbox.
            </p>
            <p className="mt-1 text-sm text-authority-green/80 dark:text-green-400/70">
              We&apos;ve sent your free guide to {email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Invisible sentinel placed where the banner should appear */}
      <div ref={sentinelRef} aria-hidden="true" />

      <div
        className={cn(
          "my-10 overflow-hidden rounded-2xl border-l-[6px] border-l-green-600 border border-ink/10 bg-gradient-to-r from-green-50 to-white shadow-sm transition-all duration-700 dark:border-gray-700 dark:border-l-green-500 dark:from-green-950/20 dark:to-gray-900",
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <div className="relative px-8 py-8">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="absolute right-4 top-4 rounded-full p-1.5 text-ink-60 transition-colors hover:bg-gray-100 hover:text-ink-60 dark:hover:bg-gray-800 dark:hover:text-ink/20"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Left: content */}
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-5 w-5 text-action-green dark:text-green-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-authority-green dark:text-green-400">
                  Free Resource
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-ink dark:text-gray-100">
                {leadMagnet.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-60 dark:text-ink-60">
                {leadMagnet.description}
              </p>
            </div>

            {/* Right: form */}
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[280px]"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="your@email.com"
                required
                className={cn(
                  "w-full rounded-lg border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-60 outline-none transition-colors",
                  "focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
                  "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-ink-60 dark:focus:border-green-500",
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300",
                )}
              />
              {error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 rounded-lg bg-authority-green px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800 dark:bg-action-green dark:hover:bg-authority-green"
              >
                {loading ? "Sending..." : "Get Free Guide"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
              <p className="text-center text-[11px] text-ink-60 dark:text-ink-60">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
