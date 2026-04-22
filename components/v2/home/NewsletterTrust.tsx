"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics/posthog-service";
import { CheckCircle2 } from "lucide-react";

// v3 Bold Redesign newsletter capture.
// Real POST to /api/newsletter (existing route), real success state,
// PostHog tracking, no vanity "Join 2,400+" copy (user: no inventory brags).

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterTrust() {
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
          source: "homepage_newsletter_trust",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Couldn't subscribe. Try again.");
        setStatus("error");
        return;
      }

      trackEvent("newsletter_subscribed", {
        source: "homepage_newsletter_trust",
      });
      setStatus("success");
    } catch (err) {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  return (
    <section className="surface-canvas py-16 border-t-2 border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
            The Weekly Decision · Fridays
          </div>
          <h2 className="font-display font-black text-[32px] sm:text-[44px] leading-[1.08] tracking-tight text-ink mb-4">
            One email. The week&apos;s best{" "}
            <em className="italic text-indian-gold">financial decisions.</em>
          </h2>
          <p className="text-ink-60 mb-8 leading-relaxed">
            No spam. No sales pitches. Just research-backed insights for Indian
            investors — the same analysis we&apos;d send a friend.
          </p>

          {status === "success" ? (
            <div
              role="status"
              className="max-w-md mx-auto flex items-center justify-center gap-3 bg-action-green/10 border-2 border-action-green/30 rounded-sm px-5 py-4"
            >
              <CheckCircle2 className="w-5 h-5 text-action-green flex-shrink-0" />
              <span className="font-mono text-[12px] text-ink text-left">
                Check your inbox to confirm. First issue ships Friday.
              </span>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  disabled={status === "submitting"}
                  className="flex-1 px-4 py-3 border-2 border-ink/15 sm:border-r-0 rounded-sm sm:rounded-r-none bg-white text-ink text-sm placeholder:text-ink-60/60 focus:outline-none focus:border-indian-gold disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="px-6 py-3 mt-2 sm:mt-0 bg-ink text-canvas font-mono text-[12px] uppercase tracking-wider font-semibold rounded-sm sm:rounded-l-none hover:bg-authority-green transition-colors cursor-pointer disabled:opacity-50"
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                </button>
              </form>

              {status === "error" && error && (
                <p
                  role="alert"
                  className="font-mono text-[11px] text-warning-red mt-3"
                >
                  {error}
                </p>
              )}

              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mt-4">
                Unsubscribe anytime · No data sharing
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
