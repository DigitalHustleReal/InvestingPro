"use client";

import React, { useState } from "react";
import { Mail, Bell, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface InlineSignupProps {
  variant: "card-alerts" | "save-results" | "weekly-picks";
  cardName?: string;
  category?: string;
  className?: string;
}

/**
 * Frictionless inline signup — no popup, no modal, no interruption.
 * Appears naturally within the content flow.
 * NerdWallet-style: value-first, email optional.
 */
export default function InlineSignup({
  variant,
  cardName,
  category,
  className,
}: InlineSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          interests: category ? [category] : [],
          source: variant,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-5 text-center",
          className,
        )}
      >
        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
        <p className="font-bold text-green-800 dark:text-green-300 text-sm">
          You&apos;re all set!
        </p>
        <p className="text-xs text-green-600 dark:text-green-500 mt-1">
          {variant === "card-alerts" &&
            `We'll notify you about ${cardName || "card"} updates and better alternatives.`}
          {variant === "save-results" &&
            "Your comparison results have been saved. Check your inbox."}
          {variant === "weekly-picks" &&
            "Expect your first weekly picks email this Friday."}
        </p>
      </div>
    );
  }

  const configs = {
    "card-alerts": {
      icon: <Bell className="w-5 h-5" />,
      title: "Get Rate Alerts",
      description: `Know when ${cardName || "this card"} changes fees or adds new offers.`,
      placeholder: "your@email.com",
      cta: "Alert Me",
      bgClass:
        "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800",
    },
    "save-results": {
      icon: <Mail className="w-5 h-5" />,
      title: "Save This Comparison",
      description:
        "Email yourself these results to review later. No account needed.",
      placeholder: "your@email.com",
      cta: "Email Results",
      bgClass:
        "bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800",
    },
    "weekly-picks": {
      icon: <TrendingUp className="w-5 h-5" />,
      title: `Best ${category || "Credit"} Cards This Week`,
      description:
        "One email per week. Our analysts pick 3 cards worth your attention.",
      placeholder: "your@email.com",
      cta: "Get Picks",
      bgClass:
        "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800",
    },
  };

  const config = configs[variant];

  return (
    <div className={cn("border rounded-xl p-5", config.bgClass, className)}>
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 flex-shrink-0">
          {config.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">
            {config.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {config.description}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={config.placeholder}
          required
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap"
        >
          {loading ? "..." : config.cta}
        </Button>
      </form>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{error}</p>
      )}
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
