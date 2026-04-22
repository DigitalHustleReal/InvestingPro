import TrustBadge from "@/components/common/TrustBadge";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Gift,
  Plane,
  ShoppingBag,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  UtensilsCrossed,
  ShoppingCart,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import ProductReviews from "@/components/reviews/ProductReviews";
import DifferentiationCard from "@/components/products/DifferentiationCard";
import StickyMobileCTA from "@/components/products/StickyMobileCTA";
import ApplicationStats from "@/components/products/ApplicationStats";
import FAQAccordion from "@/components/common/FAQAccordion";
import { CREDIT_CARD_GENERAL_FAQS } from "@/lib/content/seo-content";
import { scoreCreditCard } from "@/lib/products/scoring-rules";
import { CreditCard as CreditCardType } from "@/types";
import DecisionFramework from "@/components/common/DecisionFramework";
import DecisionCTA from "@/components/common/DecisionCTA";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import AuthorByline from "@/components/common/AuthorByline";
import RatingBreakdown from "@/components/reviews/RatingBreakdown";
import RelatedArticles from "@/components/content/RelatedArticles";
import CreditCardValueCalculator from "@/components/products/CreditCardValueCalculator";
import { getReviewStats } from "@/lib/content/review-data";
import ExpertOpinion from "@/components/products/ExpertOpinion";
import ComparisonCTA from "@/components/products/ComparisonCTA";
import DocumentChecklist, {
  CREDIT_CARD_DOCUMENTS,
} from "@/components/products/DocumentChecklist";
import { getExpertOpinion } from "@/lib/content/expert-opinions";
import InlineChecker from "@/components/eligibility/InlineChecker";
import MiniRewardsCalculator from "@/components/calculators/MiniRewardsCalculator";
import AlternativesCarousel from "@/components/products/AlternativesCarousel";
import RelatedCalculators from "@/components/calculators/RelatedCalculators";
import { getSimilarProducts } from "@/lib/utils/product-similarity";
import RewardRateTable from "@/components/products/RewardRateTable";
import ProductShareButtons from "@/components/products/ProductShareButtons";
import WhatsAppAlerts from "@/components/common/WhatsAppAlerts";
import AffiliateDisclosure from "@/components/common/AffiliateDisclosure";
import ApplyNowCTA from "@/components/products/ApplyNowCTA";
import { ProductFAQSchema } from "@/components/products/ProductFAQSchema";
import { ProductSchemaMarkup } from "@/components/products/ProductSchemaMarkup";
import ArticleFeedback from "@/components/articles/ArticleFeedback";
import TableOfContents from "@/components/content/TableOfContents";

interface CreditCardDetail {
  id: string;
  name: string;
  type: string;
  provider: string;
  image?: string;
  rating: number;
  annualFee: number;
  joiningFee: number;
  rewardRate: string;
  welcomeBonus?: string;
  minCreditScore?: number;
  interestRate: string;
  description: string;
  applyLink: string;

  // Detailed features
  keyFeatures: string[];
  rewardProgram: {
    name: string;
    pointsPerRupee: number;
    redemptionValue: string;
    categories: { name: string; rate: string }[];
  };
  benefits: {
    category: string;
    items: string[];
  }[];
  eligibility: {
    minAge: number;
    minIncome: number;
    requiredDocuments: string[];
  };
  fees: {
    name: string;
    amount: string;
    details?: string;
  }[];
  pros: string[];
  cons: string[];
}

import { createClient } from "@/lib/supabase/static";
import { createServiceClient } from "@/lib/supabase/service";
import { logger } from "@/lib/logger";

async function getCreditCardData(
  slug: string,
  useServiceClient: boolean = false,
): Promise<CreditCardDetail | null> {
  // Use service client for build-time (generateStaticParams), static client for runtime
  const supabase = useServiceClient ? createServiceClient() : createClient();
  logger.info(`[CardPage] Fetching slug: ${slug}`);

  const SELECT_COLS =
    "id, slug, name, type, bank, image_url, rating, annual_fee, joining_fee, rewards, interest_rate_text, description, apply_link, pros, cons, features, updated_at, reward_rate, reward_type, min_income, annual_fee_text, joining_fee_text";

  // Primary attempt: exact slug match
  let { data: card, error } = await supabase
    .from("credit_cards")
    .select(SELECT_COLS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logger.error(`[CardPage] Error fetching ${slug}:`, error as Error);
    return null;
  }

  // FALLBACK 1: fuzzy slug match (handles URL-DB slug drift across all cards
  // — e.g., listing links to `hdfc-swiggy-credit-card` but DB has
  // `hdfc-bank-swiggy-credit-card`). Tries progressively relaxed matches.
  if (!card && slug) {
    logger.info(`[CardPage] Exact match failed, trying fuzzy match for ${slug}`);

    // Strategy A: ilike pattern — slug contained in DB slug OR DB slug
    // contained in URL slug
    const { data: fuzzyMatches } = await supabase
      .from("credit_cards")
      .select(SELECT_COLS)
      .or(`slug.ilike.%${slug}%,slug.ilike.${slug.replace(/-credit-card$/, "")}%`)
      .limit(2);

    if (fuzzyMatches && fuzzyMatches.length > 0) {
      card = fuzzyMatches[0] as unknown as typeof card;
      logger.info(
        `[CardPage] Fuzzy matched ${slug} → ${(card as any).slug} (${(card as any).name})`,
      );
    }
  }

  // FALLBACK 2: token-overlap match — split slug into tokens, find card whose
  // slug contains the most tokens. Handles "swiggy" → "hdfc-swiggy-credit-card"
  // vs DB "swiggy-hdfc-card".
  if (!card && slug) {
    const tokens = slug
      .split("-")
      .filter((t) => t.length > 2 && !["credit", "card", "the", "and"].includes(t));
    if (tokens.length > 0) {
      const { data: tokenMatches } = await supabase
        .from("credit_cards")
        .select(SELECT_COLS)
        .or(tokens.map((t) => `slug.ilike.%${t}%`).join(","))
        .limit(5);

      if (tokenMatches && tokenMatches.length > 0) {
        // Pick the card with most token matches
        const scored = tokenMatches.map((m: any) => ({
          card: m,
          score: tokens.filter((t) => (m.slug || "").includes(t)).length,
        }));
        scored.sort((a, b) => b.score - a.score);
        if (scored[0].score >= Math.ceil(tokens.length / 2)) {
          card = scored[0].card as unknown as typeof card;
          logger.info(
            `[CardPage] Token-matched ${slug} → ${(card as any).slug} (score ${scored[0].score}/${tokens.length})`,
          );
        }
      }
    }
  }

  if (!card) {
    logger.warn(`[CardPage] No card found for ${slug} (exact + fuzzy + token all failed)`);
    return null;
  }

  logger.info(`[CardPage] Found card: ${card.name} (${card.id})`);

  // Derive benefits from type
  const isTravel = card.type === "Travel" || card.type === "Premium";
  const isShopping = card.type === "Shopping" || card.type === "Cashback";

  return {
    id: card.id,
    name: card.name,
    type: card.type || "Standard",
    provider: card.bank,
    image: card.image_url,
    rating: Number(card.rating) || 4.5,
    annualFee: Number(card.annual_fee) || 0,
    joiningFee: Number(card.joining_fee) || 0,
    rewardRate: card.rewards?.length
      ? card.rewards[0]
      : "Check detailed rewards",
    welcomeBonus: "Welcome benefits applicable", // Placeholder
    minCreditScore: 700,
    interestRate: card.interest_rate_text || "3.5% pm",
    description:
      card.description ||
      `The ${card.name} from ${card.bank} is a ${card.type} credit card offering competitive benefits and rewards.`,
    applyLink: card.apply_link || "#",

    keyFeatures: card.pros || [],
    rewardProgram: {
      name: `${card.name} Rewards`,
      pointsPerRupee: 2, // Default
      redemptionValue: "Variable",
      categories: [
        { name: "General Spends", rate: "2 points/₹150" },
        { name: "Accelerated", rate: "5x - 10x points" },
      ],
    },
    benefits: [
      {
        category: "Core Benefits",
        items: card.pros || ["Reward Points", "Fuel Surcharge Waiver"],
      },
      {
        category: isTravel ? "Travel" : isShopping ? "Shopping" : "Lifestyle",
        items: isTravel
          ? ["Airport Lounge Access", "Travel Insurance"]
          : isShopping
            ? ["Cashback on Spends", "Discount Vouchers"]
            : ["Dining Discounts", "Movie Offers"],
      },
    ],
    eligibility: {
      minAge: 21,
      minIncome: 25000,
      requiredDocuments: ["PAN Card", "Aadhaar Card", "Income Proof"],
    },
    fees: [
      {
        name: "Joining Fee",
        amount: card.joining_fee ? `₹${card.joining_fee}` : "Nil",
        details: "First year fee",
      },
      {
        name: "Annual Fee",
        amount: card.annual_fee ? `₹${card.annual_fee}` : "Nil",
        details: "From second year onwards",
      },
    ],
    pros: card.pros || [],
    cons: card.cons || ["Annual fee might apply"],
  };
}

/**
 * Generate static params for all active credit cards
 * This pre-generates all product pages at build time for better SEO
 */
export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data: cards, error } = await supabase
      .from("credit_cards")
      .select("slug")
      .not("slug", "is", null);

    if (error) {
      logger.error(
        "[generateStaticParams] Error fetching credit cards:",
        error as Error,
      );
      return [];
    }

    if (!cards || cards.length === 0) {
      logger.warn("[generateStaticParams] No credit cards found");
      return [];
    }

    logger.info(
      `[generateStaticParams] Generating ${cards.length} credit card pages`,
    );
    return cards.map((card) => ({ slug: card.slug }));
  } catch (error) {
    logger.error(
      "[generateStaticParams] Failed to generate static params:",
      error as Error,
    );
    return [];
  }
}

// Force static generation with ISR (Incremental Static Regeneration)
// Revalidate every hour to keep data fresh while maintaining static benefits
export const revalidate = 3600; // 1 hour
export const dynamicParams = true; // Allow ISR for slugs not in generateStaticParams

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCreditCardData(slug, true); // Use service client for metadata generation (build-time)

  if (!card) {
    return {
      title: "Credit Card Not Found",
    };
  }

  return {
    title: `${card.name} Review - Features, Benefits & Apply Online`,
    description: `${card.description} Rating: ${card.rating}/5. Annual fee: ₹${card.annualFee}. Compare benefits, eligibility, and apply online.`,
    keywords: `${card.name}, ${card.provider} credit card, credit card review, ${card.provider.toLowerCase()} card benefits, apply credit card online`,
    openGraph: {
      title: `${card.name} Review | InvestingPro`,
      description: card.description,
      type: "article",
      images: card.image ? [card.image] : [],
    },
    alternates: {
      canonical: `/credit-cards/${slug}`,
    },
  };
}

export default async function CreditCardDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const card = await getCreditCardData(params.slug, false); // Use server client for runtime

  if (!card) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Schema Markup for SEO */}
      <ProductSchemaMarkup
        product={{
          name: card.name,
          description: card.description,
          image: card.image,
          rating: card.rating,
          category: "credit-cards",
          provider: card.provider,
          url: `/credit-cards/${params.slug}`,
        }}
      />

      {/* Hero Section — NerdWallet+ editorial decision layer */}
      <div className="bg-canvas border-b-2 border-ink/10 pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top strip: breadcrumb + advertiser disclosure */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-ink/10">
            <AutoBreadcrumbs />
            <AffiliateDisclosure
              variant="inline"
              hasAffiliateLink={true}
              className="font-mono text-[11px] uppercase tracking-wider text-ink-60"
            />
          </div>

          <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-10 items-start">
            {/* LEFT: Card image + approval odds card */}
            <div className="flex flex-col gap-5">
              <div className="aspect-[1.586/1] w-full relative rounded-sm overflow-hidden border-2 border-ink/10 bg-ink/5">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-ink flex items-center justify-center">
                    <span className="font-display font-black text-canvas text-3xl tracking-tight">
                      {card.provider}
                    </span>
                  </div>
                )}
                {/* Editor's Pick gold strip — brainstorm editorial signature */}
                <div className="absolute bottom-0 left-0 right-0 bg-indian-gold text-ink font-mono text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                  Editor&apos;s Pick · Best for {card.type}
                </div>
              </div>

              {/* Approval odds — brainstorm palette only */}
              <div className="bg-white border-2 border-ink/10 rounded-sm p-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60 mb-2 font-semibold">
                  Approval Odds
                </div>
                <div className="h-1.5 bg-ink/5 rounded-sm overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-sm ${
                      card.minCreditScore && card.minCreditScore > 750
                        ? "w-1/3 bg-warning-red"
                        : "w-3/4 bg-action-green"
                    }`}
                  />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-display font-bold text-sm text-ink">
                    {card.minCreditScore && card.minCreditScore > 750
                      ? "Excellent credit"
                      : "Good chance"}
                  </span>
                  <span className="font-mono text-[11px] text-ink-60 tabular-nums">
                    CIBIL {card.minCreditScore}+
                  </span>
                </div>
              </div>

              {/* Secondary CTA — eligibility check */}
              <a
                href="#eligibility-checker"
                className="block text-center font-mono text-[11px] uppercase tracking-wider text-ink border-2 border-ink py-3 rounded-sm hover:bg-ink hover:text-canvas transition-colors"
              >
                Check eligibility &rarr;
              </a>
            </div>

            {/* RIGHT: Editorial content */}
            <div className="min-w-0">
              {/* Eyebrow — provider + mono */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-indian-gold font-semibold">
                  {card.provider} Bank
                </span>
                <span className="text-ink/20">·</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-60">
                  Credit Card
                </span>
              </div>

              {/* Playfair hero title */}
              <h1 className="font-display font-black text-[36px] md:text-[52px] lg:text-[60px] text-ink tracking-tight leading-[1.02] mb-5">
                {card.name}
              </h1>

              {/* Our Take — editorial verdict inline, always visible */}
              <div className="mb-5 pb-5 border-b border-ink/10">
                <div className="font-mono text-[10px] uppercase tracking-wider text-indian-gold mb-1.5 font-semibold">
                  Our Take
                </div>
                <p className="font-display text-[17px] text-ink leading-snug max-w-2xl">
                  {card.description}
                </p>
              </div>

              {/* Byline row: author + share */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <AuthorByline />
                <ProductShareButtons
                  productName={card.name}
                  productUrl={`/credit-cards/${params.slug}`}
                />
              </div>

              {/* Key stats — mono data strip with SQUARE SCORE at left */}
              <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-0 border-2 border-ink/10 rounded-sm mb-6 bg-white">
                {/* Square score badge */}
                <div className="flex flex-col items-center justify-center border-r-2 border-ink/10 px-5 py-4">
                  <span className="font-mono text-[28px] font-bold text-ink leading-none tabular-nums">
                    {Math.round((card.rating || 4) * 20)}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-ink-60 mt-0.5">
                    /100
                  </span>
                </div>
                <div className="px-4 py-3 border-r border-ink/10">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                    Annual Fee
                  </div>
                  <div className="font-mono text-[17px] font-bold text-ink tabular-nums mt-0.5">
                    ₹{(card.annualFee || 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="px-4 py-3 border-r border-ink/10">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                    Reward Rate
                  </div>
                  <div className="font-mono text-[17px] font-bold text-action-green tabular-nums mt-0.5">
                    {card.rewardRate || "1.5–3.3%"}
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-60">
                    Interest
                  </div>
                  <div className="font-mono text-[17px] font-bold text-ink tabular-nums mt-0.5">
                    {card.interestRate || "42% p.a."}
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="max-w-sm mb-3">
                <ApplyNowCTA
                  href={`/go/${params.slug}`}
                  productName={card.name}
                  productSlug={params.slug}
                  productId={card.id}
                  category="credit_card"
                  providerName={card.provider}
                  sourcePage="credit-card-detail"
                  variant="default"
                />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-60 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-action-green" />
                Secure application on {card.provider}&apos;s official site
              </p>
            </div>
          </div>

          {/* Expert opinion + application stats — below hero grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-ink/10">
            <ExpertOpinion
              productName={card.name}
              opinion={getExpertOpinion(params.slug, "credit_card")}
            />
            <ApplicationStats productName={card.name} />
          </div>

          {/* Quick Math Value Calculator — separate section below */}
          <div className="mt-8">
            <CreditCardValueCalculator
              annualFee={card.annualFee}
              cashbackRate={
                card.type === "Premium" || card.type === "Travel" ? 2.5 : 1.5
              }
            />
          </div>
        </div>
      </div>

      {/* Decision Framework */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DecisionFramework
              productId={card.id}
              productName={card.name}
              category="credit-cards"
              affiliateLink={card.applyLink}
              variant="compact"
            />
          </div>
          <div
            id="eligibility-checker"
            className="lg:col-span-1 space-y-8 scroll-mt-24"
          >
            <InlineChecker
              productType="credit_card"
              cardType={
                card.annualFee > 5000
                  ? "premium"
                  : card.annualFee > 0
                    ? "standard"
                    : "entry"
              }
            />

            {/* WhatsApp Alerts - NEW */}
            <Card className="border-none bg-action-green/10 dark:bg-green-950/30 overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-600 text-white rounded-sm group-hover:scale-110 transition-transform">
                    <MessageCircle size={18} />
                  </div>
                  <h4 className="font-bold text-foreground">Rate Alerts</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Get updates on WhatsApp about{" "}
                  <span className="font-bold">{card.name}</span> rates and
                  offers.
                </p>
                <WhatsAppAlerts
                  productName={card.name}
                  trigger={
                    <Button className="w-full bg-action-green hover:bg-authority-green text-white font-black rounded-xl h-12 shadow-none shadow-green-500/20">
                      Activate via WhatsApp
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content with TOC Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_260px] gap-8">
          <div className="space-y-12">
            {/* Unified Editorial Card */}
            <Card className="p-8 space-y-12 shadow-none shadow-gray-200/50">
              {/* Key Features Section */}
              <section id="key-features" className="scroll-mt-24">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-ink">
                  <CheckCircle2 className="w-6 h-6 text-action-green" />
                  Key Features
                </h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {card.keyFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-sm"
                    >
                      <div className="bg-white dark:bg-gray-700 rounded-full p-1 mt-0.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-action-green flex-shrink-0" />
                      </div>
                      <span className="text-ink dark:text-ink/20 font-medium leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <hr className="border-gray-100" />

              <hr className="border-gray-100" />

              <div
                id="rating"
                className="p-8 bg-gray-50 rounded-sm scroll-mt-24"
              >
                <h3 className="text-xl font-bold mb-6 text-ink">
                  Rating Overview
                </h3>
                <RatingBreakdown
                  distribution={getReviewStats(params.slug).distribution}
                  totalReviews={getReviewStats(params.slug).count}
                />
              </div>

              <hr className="border-gray-100" />

              {/* Eligibility Section (Moved from Sidebar) */}
              <section id="eligibility" className="scroll-mt-24">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-ink">
                  <ShieldCheck className="w-6 h-6 text-action-green" />
                  Eligibility Criteria
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <p className="text-ink-60 text-sm font-bold uppercase tracking-wider mb-2">
                      Age
                    </p>
                    <p className="text-xl font-display font-bold text-ink">
                      {card.eligibility.minAge}+ Years
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <p className="text-ink-60 text-sm font-bold uppercase tracking-wider mb-2">
                      Income
                    </p>
                    <p className="text-xl font-display font-bold text-ink">
                      ₹
                      {(typeof card.eligibility.minIncome === "number"
                        ? card.eligibility.minIncome / 100000
                        : 0.25
                      ).toFixed(1)}
                      L{" "}
                      <span className="text-xs font-normal text-ink-60">
                        / year
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <p className="text-ink-60 text-sm font-bold uppercase tracking-wider mb-2">
                      Documents
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {card.eligibility.requiredDocuments.map((doc, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Rewards Program Section */}
              <section id="rewards" className="scroll-mt-24">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-ink">
                  <Gift className="w-6 h-6 text-action-green" />
                  Rewards Program
                </h2>
                <div className="bg-canvas border-2 border-ink/10 rounded-sm p-6 mb-6">
                  <h3 className="font-bold text-xl mb-2 text-ink">
                    {card.rewardProgram.name}
                  </h3>
                  <p className="text-ink-60">
                    Earn{" "}
                    <strong className="text-authority-green">
                      {card.rewardProgram.pointsPerRupee} points per ₹150
                    </strong>{" "}
                    spent. Redemption value:{" "}
                    {card.rewardProgram.redemptionValue}
                  </p>
                </div>

                <RewardRateTable
                  categories={card.rewardProgram.categories}
                  pointsPerRupee={card.rewardProgram.pointsPerRupee}
                  redemptionValue={card.rewardProgram.redemptionValue}
                  annualFee={card.annualFee}
                />

                {/* Mini Rewards Calculator - NEW */}
                <div className="mt-8">
                  <MiniRewardsCalculator
                    annualFee={card.annualFee}
                    rewardRate={card.rewardProgram.pointsPerRupee || 1.5}
                  />
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Benefits Section */}
              <section id="benefits" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6 text-ink">
                  Benefits Breakdown
                </h2>
                <div className="grid gap-8">
                  {card.benefits.map((benefit, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-ink">
                        <div className="p-2 bg-gray-100 rounded-sm text-ink">
                          {benefit.category === "Travel" && (
                            <Plane className="w-5 h-5" />
                          )}
                          {benefit.category === "Dining" && (
                            <ShoppingBag className="w-5 h-5" />
                          )}
                          {benefit.category === "Shopping" && (
                            <Gift className="w-5 h-5" />
                          )}
                          {benefit.category !== "Travel" &&
                            benefit.category !== "Dining" &&
                            benefit.category !== "Shopping" && (
                              <Star className="w-5 h-5" />
                            )}
                        </div>
                        {benefit.category}
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {benefit.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-ink-60 flex items-start gap-2 text-sm leading-6"
                          >
                            <span className="text-action-green font-bold mt-1">
                              •
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pros & Cons Section (Embedded) */}
              <section
                id="pros-cons"
                className="bg-gray-50/50 rounded-sm p-2 border border-gray-100 scroll-mt-24"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  {/* Pros */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-authority-green flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5" /> Pros
                    </h3>
                    <ul className="space-y-3">
                      {card.pros.map((pro, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-ink text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-action-green flex-shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-red-700 flex items-center gap-2 mb-4">
                      <XCircle className="w-5 h-5" /> Cons
                    </h3>
                    <ul className="space-y-3">
                      {card.cons.map((con, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-ink text-sm"
                        >
                          <XCircle className="w-4 h-4 text-warning-red flex-shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Comparison CTA - NEW */}
              <ComparisonCTA
                currentProductSlug={params.slug}
                currentProductName={card.name}
                similarProducts={[
                  // TODO: Fetch similar products dynamically
                  { slug: "hdfc-regalia", name: "HDFC Regalia" },
                  { slug: "sbi-simplysave", name: "SBI SimplySAVE" },
                ]}
              />

              <hr className="border-gray-100" />

              {/* Document Checklist - NEW */}
              <DocumentChecklist
                documents={CREDIT_CARD_DOCUMENTS}
                productName={card.name}
              />

              <hr className="border-gray-100" />

              {/* Fees Section */}
              <section id="fees" className="scroll-mt-24">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-ink">
                  <IndianRupee className="w-6 h-6 text-ink" />
                  Fees & Charges
                </h2>
                <div className="border-2 border-ink/10 rounded-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-ink-60 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4">Fee Type</th>
                        <th className="px-6 py-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {card.fees.map((fee, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-display font-semibold text-ink">
                              {fee.name}
                            </div>
                            {fee.details && (
                              <div className="text-ink-60 text-xs mt-0.5">
                                {fee.details}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-display font-bold text-ink">
                            {fee.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </Card>

            {/* Related Articles */}
            <RelatedArticles />

            {/* "Was this helpful?" Feedback */}
            <ArticleFeedback articleId={`cc-${card.id}`} />

            {/* FAQ Section with Schema */}
            <div id="faqs" className="my-12 scroll-mt-24">
              <ProductFAQSchema
                faqs={CREDIT_CARD_GENERAL_FAQS.map((f: any) => ({
                  q: f.question || f.q,
                  a: f.answer || f.a,
                }))}
              />
            </div>

            {/* User Reviews */}
            <div id="reviews" className="scroll-mt-24">
              <ProductReviews
                productSlug={params.slug}
                productType="credit_card"
              />
            </div>

            {/* Alternatives Carousel - NEW */}
            <div id="alternatives" className="scroll-mt-24">
              <AlternativesCarousel
                products={getSimilarProducts(card as any, [], 4)} // Passing empty array for now, will need actual products list
                currentProductSlug={params.slug}
                className="mt-12"
              />
            </div>

            {/* Related Calculators - NEW */}
            <RelatedCalculators category="credit_card" className="mt-12" />
          </div>

          {/* Right Column: TOC Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents
                items={[
                  { id: "key-features", text: "Key Features", level: 2 },
                  { id: "rating", text: "Rating Overview", level: 2 },
                  { id: "eligibility", text: "Eligibility", level: 2 },
                  { id: "rewards", text: "Rewards Program", level: 2 },
                  { id: "benefits", text: "Benefits", level: 2 },
                  { id: "pros-cons", text: "Pros & Cons", level: 2 },
                  { id: "fees", text: "Fees & Charges", level: 2 },
                  { id: "faqs", text: "FAQs", level: 2 },
                  { id: "reviews", text: "Reviews", level: 2 },
                  { id: "alternatives", text: "Alternatives", level: 2 },
                ]}
              />

              {/* Compact Apply Now CTA */}
              <Card className="border-green-200 bg-action-green/10/50 dark:bg-green-950/20 dark:border-green-900">
                <CardContent className="p-4 text-center space-y-3">
                  <p className="text-sm font-bold text-foreground">
                    {card.name}
                  </p>
                  <ApplyNowCTA
                    href={`/go/${params.slug}`}
                    productName={card.name}
                    productSlug={params.slug}
                    productId={card.id}
                    category="credit_card"
                    providerName={card.provider}
                    sourcePage="credit-card-detail-sidebar"
                    variant="default"
                    className="w-full"
                  />
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Secure application
                  </p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to upgrade your wallet?
          </h2>
          <p className="text-ink/20 mb-10 text-lg max-w-2xl mx-auto">
            Apply for the {card.name} today and start earning rewards on every
            spend.
          </p>
          <ApplyNowCTA
            href={`/go/${params.slug}`}
            productName={card.name}
            productSlug={params.slug}
            productId={card.id}
            category="credit_card"
            providerName={card.provider}
            sourcePage="credit-card-detail"
            variant="default"
          />
          <p className="text-ink-60 text-xs mt-6">
            Application processed securely by {card.provider}
          </p>
        </div>
      </div>
      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        productName={card.name}
        providerName={card.provider}
        image={card.image}
        rating={card.rating}
        applyLink={`/go/${params.slug}`}
      />
    </div>
  );
}
