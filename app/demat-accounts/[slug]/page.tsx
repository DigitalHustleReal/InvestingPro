import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Smartphone,
  BarChart3,
  AlertCircle,
  ExternalLink,
  Clock,
  Zap,
} from "lucide-react";
import { getProductBySlug } from "@/lib/products/server-service";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import EditorialVerdict from "@/components/products/EditorialVerdict";
import SimilarProducts from "@/components/products/SimilarProducts";
import { ProductFAQSchema } from "@/components/products/ProductFAQSchema";
import { ProductSchemaMarkup } from "@/components/products/ProductSchemaMarkup";
import StickyMobileCTA from "@/components/products/StickyMobileCTA";
import ArticleFeedback from "@/components/articles/ArticleFeedback";

interface DematAccountDetail {
  id: string;
  name: string;
  provider: string;
  image?: string;
  rating: number;
  accountOpeningFee: number;
  annualMaintenanceFee: number;
  equityDeliveryBrokerage: string;
  intradayBrokerage: string;
  description: string;
  applyLink: string;
  keyFeatures: string[];
  tradingPlatforms: string[];
  researchTools: string[];
  eligibility: {
    minAge: number;
    requiredDocuments: string[];
  };
  fees: { name: string; amount: string; details?: string }[];
  pros: string[];
  cons: string[];
}

const FAQ_DATA = [
  {
    q: "What is a demat account?",
    a: "A demat account holds your shares and securities in electronic form. You need one to buy stocks, mutual funds, bonds, and ETFs on Indian exchanges.",
  },
  {
    q: "How much does it cost to open a demat account?",
    a: "Most discount brokers offer free account opening. Annual maintenance (AMC) ranges from ₹0-₹750. Some brokers charge ₹200-₹300 for account opening.",
  },
  {
    q: "What is the difference between a demat account and trading account?",
    a: "Demat account stores your securities. Trading account is used to place buy/sell orders. You need both to trade. Most brokers open both together.",
  },
  {
    q: "Can I have multiple demat accounts?",
    a: "Yes. There is no legal limit. Some investors use different brokers for different purposes (one for long-term, another for trading).",
  },
  {
    q: "What documents do I need?",
    a: "PAN card, Aadhaar (for eKYC), bank account details, and a recent photograph. Most brokers offer instant digital account opening via eKYC.",
  },
  {
    q: "Is my money safe in a demat account?",
    a: "Securities in demat are held by NSDL/CDSL (depositories), not the broker. Even if the broker shuts down, your securities are safe. Cash balance should be kept minimal.",
  },
];

async function getDematAccountData(
  slug: string,
): Promise<DematAccountDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || !["demat_account", "broker"].includes(product.category))
    return null;

  const features = product.features || {};

  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    rating: product.rating.overall,
    accountOpeningFee:
      parseInt(
        String(features.account_opening_fee || "0").replace(/[^0-9]/g, ""),
      ) || 0,
    annualMaintenanceFee:
      parseInt(String(features.amc || "0").replace(/[^0-9]/g, "")) || 0,
    equityDeliveryBrokerage: features.equity_delivery || "Zero",
    intradayBrokerage: features.intraday_brokerage || "₹20 per order",
    description: product.description || "",
    applyLink: product.affiliate_link || product.official_link || "#",
    keyFeatures:
      product.features?.key_highlights || product.pros?.slice(0, 5) || [],
    tradingPlatforms: features.platforms || ["Web", "Mobile App", "Desktop"],
    researchTools: features.research_tools || ["Charts", "Screeners", "News"],
    eligibility: {
      minAge: features.min_age || 18,
      requiredDocuments: features.docs || [
        "PAN Card",
        "Aadhaar Card",
        "Bank Statement",
      ],
    },
    fees: [
      {
        name: "Account Opening",
        amount: `₹${features.account_opening_fee || "0"}`,
      },
      { name: "Annual Maintenance", amount: `₹${features.amc || "0"}` },
      { name: "Equity Delivery", amount: features.equity_delivery || "Zero" },
      {
        name: "Intraday/F&O",
        amount: features.intraday_brokerage || "₹20/order",
      },
    ],
    pros: product.pros || [],
    cons: product.cons || [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const account = await getDematAccountData(slug);

  if (!account) {
    return { title: "Demat Account Not Found" };
  }

  const title = `${account.name} Review - Features, Fees & Open Account Online`;
  const description = `${account.description} Rating: ${account.rating}/5. Brokerage: ${account.equityDeliveryBrokerage}. Compare features and open account online.`;

  return {
    title,
    description,
    keywords: `${account.name}, ${account.provider} demat account, trading account, stock broker review`,
    openGraph: {
      title,
      description,
      url: `https://investingpro.in/demat-accounts/${slug}`,
      siteName: "InvestingPro",
      type: "website",
      ...(account.image ? { images: [{ url: account.image }] } : {}),
    },
    alternates: {
      canonical: `https://investingpro.in/demat-accounts/${slug}`,
    },
  };
}

export default async function DematAccountDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const account = await getDematAccountData(slug);

  if (!account) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Schema Markup */}
      <ProductSchemaMarkup
        product={{
          name: account.name,
          description: account.description,
          image: account.image,
          rating: account.rating,
          category: "Demat Account",
          provider: account.provider,
          url: `/demat-accounts/${slug}`,
        }}
      />
      <ProductFAQSchema faqs={FAQ_DATA} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AutoBreadcrumbs />
      </div>

      {/* Hero Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-100/20 dark:bg-green-900/30 text-action-green px-3 py-1 rounded-full text-sm font-medium">
                  Demat Account
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg">{account.rating}</span>
                  <span className="text-muted-foreground text-sm">/5</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {account.name}
              </h1>
              <p className="text-muted-foreground mb-6">{account.provider}</p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                {account.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-background dark:bg-muted/30 rounded-xl p-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Opening
                  </p>
                  <p className="text-xl font-bold">
                    ₹{account.accountOpeningFee}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AMC</p>
                  <p className="text-xl font-bold">
                    ₹{account.annualMaintenanceFee}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Equity Delivery
                  </p>
                  <p className="text-xl font-bold">
                    {account.equityDeliveryBrokerage}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Intraday</p>
                  <p className="text-xl font-bold">
                    {account.intradayBrokerage}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-background dark:bg-muted/30 border border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Open your demat account in 15 minutes
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-action-green hover:bg-authority-green text-white font-semibold py-6 text-lg mb-3">
                      Open Account <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <Zap className="w-4 h-4" />
                    <span>100% Digital • Paperless KYC</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trading Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-action-green" />
                  Trading Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {account.tradingPlatforms.map((platform, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 dark:bg-muted/30 p-4 rounded-lg text-center"
                    >
                      <Smartphone className="w-8 h-8 text-action-green mx-auto mb-2" />
                      <p className="font-medium">{platform}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-action-green" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {account.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-action-green flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-action-green" />
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-semibold">
                          Fee Type
                        </th>
                        <th className="text-right py-3 font-semibold">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {account.fees.map((fee, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 text-muted-foreground">
                            {fee.name}
                          </td>
                          <td className="py-3 text-right font-semibold">
                            {fee.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-600">
                <CardHeader className="bg-green-100 dark:bg-green-900/30">
                  <CardTitle className="text-action-green flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {account.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-action-green flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-900">
                <CardHeader className="bg-red-100 dark:bg-red-900/30">
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {account.cons.map((con, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Editorial Verdict */}
            <EditorialVerdict
              productName={account.name}
              rating={account.rating}
              verdict={`${account.name} by ${account.provider} is a solid choice for Indian investors looking for a reliable trading and demat account. With equity delivery brokerage at ${account.equityDeliveryBrokerage} and intraday at ${account.intradayBrokerage}, it offers competitive pricing in the market.`}
              scores={[
                { label: "Features", score: Math.min(account.rating + 0.2, 5) },
                {
                  label: "Pricing",
                  score:
                    account.accountOpeningFee === 0 &&
                    account.annualMaintenanceFee === 0
                      ? 4.8
                      : Math.max(account.rating - 0.3, 3),
                },
                { label: "Platform", score: Math.min(account.rating + 0.1, 5) },
                { label: "Support", score: Math.max(account.rating - 0.2, 3) },
              ]}
            />

            {/* Similar Products */}
            <SimilarProducts
              category="demat_account"
              currentProductId={account.id}
              maxProducts={4}
            />

            {/* Article Feedback */}
            <ArticleFeedback articleId={`demat-${account.id}`} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Sticky CTA */}
            <div className="sticky top-6">
              <Card className="bg-card border-b border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    Ready to Start Trading?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Open your account in minutes
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-action-green hover:bg-authority-green text-white font-semibold py-6 mb-3">
                      Open Account <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-muted-foreground text-center">
                    Free account opening • 2-3 min process
                  </p>
                </CardContent>
              </Card>

              {/* Eligibility */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-action-green" />
                    Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-muted-foreground">Minimum Age</p>
                    <p className="font-semibold">
                      {account.eligibility.minAge} years
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="font-medium mb-2">Required Documents:</p>
                    <ul className="space-y-1.5">
                      {account.eligibility.requiredDocuments.map(
                        (doc, index) => (
                          <li
                            key={index}
                            className="text-muted-foreground text-xs flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-3 h-3 text-action-green flex-shrink-0 mt-0.5" />
                            {doc}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="mt-6 bg-indian-gold/10 dark:bg-amber-950/30 border-indian-gold/30 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-indian-gold flex-shrink-0" />
                    <div className="text-xs text-amber-800 dark:text-amber-200">
                      <p className="font-semibold mb-1">Investment Risk</p>
                      <p>
                        Trading in securities market is subject to market risks.
                        Read all related documents before investing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQ_DATA.map((f, i) => (
            <details
              key={i}
              className="group bg-card border border-border rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-foreground hover:bg-muted/50 transition-colors list-none">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0 ml-4">
                  ›
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Investing with {account.name}
          </h2>
          <p className="text-ink-60 mb-8">
            Join millions of investors. Open your account today!
          </p>
          <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-action-green hover:bg-authority-green text-white font-semibold px-12 py-6 text-lg">
              Open Free Account <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        productName={account.name}
        providerName={account.provider}
        image={account.image}
        rating={account.rating}
        applyLink={`/go/${slug}`}
      />
    </div>
  );
}
