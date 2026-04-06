"use client";

/**
 * Contextual Lead Magnet
 *
 * Shows personalized lead magnets based on the category/page the user is viewing
 * Much higher conversion rate than generic popups!
 */

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  Download,
  ArrowRight,
  Loader2,
  CheckCircle,
  CreditCard,
  Home,
  TrendingUp,
  Shield,
  Wallet,
  PiggyBank,
  Calculator,
  FileText,
  Gift,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Category-specific lead magnets
const CATEGORY_OFFERS: Record<string, CategoryOffer> = {
  "credit-cards": {
    icon: CreditCard,
    color: "from-secondary-500 to-secondary-600",
    title: "Best Credit Cards 2026",
    subtitle: "Matched to your spending style",
    description:
      "Get our expert-curated list of top credit cards for rewards, cashback, travel & more.",
    buttonText: "Get Free Guide",
    guideType: "credit-card-guide",
    benefits: ["Compare 50+ cards", "Rewards calculator", "Application tips"],
  },
  loans: {
    icon: Home,
    color: "from-primary-500 to-primary-600",
    title: "Home Loan Comparison",
    subtitle: "Save lakhs on interest",
    description:
      "Compare rates from 20+ banks. Our guide shows you how to get the lowest EMI.",
    buttonText: "Download Comparison",
    guideType: "home-loan-guide",
    benefits: ["Rate comparison", "EMI calculator", "Negotiation tips"],
  },
  "mutual-funds": {
    icon: TrendingUp,
    color: "from-primary-500 to-primary-700",
    title: "Top Mutual Funds 2026",
    subtitle: "Expert-picked funds",
    description:
      "Our research team analyzed 500+ schemes. Get the top picks for every goal.",
    buttonText: "Get Fund Picks",
    guideType: "mutual-fund-guide",
    benefits: ["Category winners", "SIP strategies", "Tax-saving funds"],
  },
  insurance: {
    icon: Shield,
    color: "from-danger-500 to-danger-600",
    title: "Insurance Buying Guide",
    subtitle: "Don't overpay again",
    description:
      "Learn how to choose the right coverage without paying for features you don't need.",
    buttonText: "Get Free Guide",
    guideType: "insurance-guide",
    benefits: ["Coverage calculator", "Claim tips", "Policy comparison"],
  },
  "fixed-deposits": {
    icon: PiggyBank,
    color: "from-accent-500 to-orange-600",
    title: "FD Rate Comparison",
    subtitle: "Highest rates today",
    description: "Live comparison of FD rates from 30+ banks. Updated daily.",
    buttonText: "See Latest Rates",
    guideType: "fd-comparison",
    benefits: ["Rate tracker", "Tax-saver FDs", "Laddering strategy"],
  },
  "demat-accounts": {
    icon: Wallet,
    color: "from-secondary-500 to-primary-600",
    title: "Demat Account Guide",
    subtitle: "Start investing today",
    description:
      "Compare brokers, understand charges, and open your first demat account.",
    buttonText: "Get Broker Comparison",
    guideType: "demat-guide",
    benefits: ["Broker comparison", "Brokerage calculator", "Opening guide"],
  },
  calculators: {
    icon: Calculator,
    color: "from-primary-500 to-primary-600",
    title: "Save Your Results",
    subtitle: "Email detailed breakdown",
    description:
      "Get your calculation results with projections and recommendations sent to your inbox.",
    buttonText: "Email My Results",
    guideType: "calculator-results",
    benefits: ["Detailed breakdown", "PDF report", "Expert tips"],
  },
  default: {
    icon: Gift,
    color: "from-primary-500 to-primary-600",
    title: "Weekly Finance Tips",
    subtitle: "Free weekly insights",
    description:
      "Get our best money-saving tips and product updates every Tuesday.",
    buttonText: "Subscribe Free",
    guideType: "newsletter",
    benefits: ["Weekly insights", "Exclusive offers", "Expert advice"],
  },
};

interface CategoryOffer {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  guideType: string;
  benefits: string[];
}

interface ContextualLeadMagnetProps {
  // Override auto-detection
  category?: string;

  // Display options
  variant?: "inline" | "sidebar" | "banner" | "modal";

  // Callbacks
  onSubscribe?: (email: string, guideType: string) => Promise<void>;

  // Feature flags
  disabled?: boolean;
}

export function ContextualLeadMagnet({
  category: forcedCategory,
  variant = "sidebar",
  onSubscribe,
  disabled = false,
}: ContextualLeadMagnetProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const supabase = createClient();

  // Detect category from pathname
  const detectedCategory = forcedCategory || detectCategory(pathname);
  const offer = CATEGORY_OFFERS[detectedCategory] || CATEGORY_OFFERS.default;
  const Icon = offer.icon;

  // Check if already subscribed for this offer
  useEffect(() => {
    const dismissedOffers = localStorage.getItem("ip_dismissed_offers");
    if (dismissedOffers?.includes(offer.guideType)) {
      setDismissed(true);
    }
  }, [offer.guideType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      // Save to database
      await supabase.from("newsletter_subscribers").insert({
        email,
        source: `contextual_${offer.guideType}`,
        tags: [detectedCategory, offer.guideType],
        metadata: { pathname, offer: offer.guideType },
      });

      // Custom handler
      if (onSubscribe) {
        await onSubscribe(email, offer.guideType);
      }

      setSuccess(true);

      // Mark as converted
      const dismissed = localStorage.getItem("ip_dismissed_offers") || "";
      localStorage.setItem(
        "ip_dismissed_offers",
        dismissed + "," + offer.guideType,
      );
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    const dismissed = localStorage.getItem("ip_dismissed_offers") || "";
    localStorage.setItem(
      "ip_dismissed_offers",
      dismissed + "," + offer.guideType,
    );
  };

  if (disabled || dismissed) return null;

  // Success state
  if (success) {
    return (
      <div className={getVariantClasses(variant)}>
        <div className="text-center py-6">
          <CheckCircle className="w-12 h-12 text-success-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            You're all set!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Check your inbox for the download link.
          </p>
        </div>
      </div>
    );
  }

  // Inline variant (minimal)
  if (variant === "inline") {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${offer.color} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {offer.title}
            </h4>
            <p className="text-xs text-gray-500">{offer.subtitle}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r ${offer.color} hover:opacity-90 disabled:opacity-50`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get"}
          </button>
        </form>
      </div>
    );
  }

  // Banner variant (horizontal)
  if (variant === "banner") {
    return (
      <div
        className={`bg-gradient-to-r ${offer.color} rounded-xl p-4 text-white relative`}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8" />
            <div>
              <h4 className="font-bold">{offer.title}</h4>
              <p className="text-sm text-white/80">{offer.description}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 md:ml-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-lg placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-lg hover:bg-white/90 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {offer.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Sidebar variant (default - vertical card)
  return (
    <div className={getVariantClasses(variant)}>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      {/* Header */}
      <div
        className={`bg-gradient-to-br ${offer.color} p-4 -mx-4 -mt-4 mb-4 rounded-t-xl`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">{offer.title}</h3>
            <p className="text-sm text-white/80">{offer.subtitle}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {offer.description}
      </p>

      {/* Benefits */}
      <ul className="space-y-2 mb-4">
        {offer.benefits.map((benefit, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-medium rounded-lg bg-gradient-to-r ${offer.color} hover:opacity-90 transition-opacity disabled:opacity-50`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Download className="w-4 h-4" />
              {offer.buttonText}
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-3">
        Free • No spam • Unsubscribe anytime
      </p>
    </div>
  );
}

// Detect category from pathname
function detectCategory(pathname: string): string {
  if (pathname.includes("/credit-card")) return "credit-cards";
  if (pathname.includes("/loan")) return "loans";
  if (pathname.includes("/mutual-fund")) return "mutual-funds";
  if (pathname.includes("/insurance")) return "insurance";
  if (pathname.includes("/fixed-deposit") || pathname.includes("/fd"))
    return "fixed-deposits";
  if (pathname.includes("/demat") || pathname.includes("/stock"))
    return "demat-accounts";
  if (pathname.includes("/calculator")) return "calculators";
  return "default";
}

// Get CSS classes for variant
function getVariantClasses(variant: string): string {
  const base =
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 relative";

  switch (variant) {
    case "sidebar":
      return `${base} shadow-lg`;
    case "inline":
      return base;
    case "banner":
      return base;
    default:
      return base;
  }
}

export default ContextualLeadMagnet;
