import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  Landmark,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Clock,
  Percent,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { getProductBySlug } from "@/lib/products/server-service";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import EditorialVerdict from "@/components/products/EditorialVerdict";
import SimilarProducts from "@/components/products/SimilarProducts";
import { ProductFAQSchema } from "@/components/products/ProductFAQSchema";
import { ProductSchemaMarkup } from "@/components/products/ProductSchemaMarkup";
import ArticleFeedback from "@/components/articles/ArticleFeedback";

interface FixedDepositDetail {
  id: string;
  name: string;
  provider: string;
  image?: string;
  rating: number;
  interestRate: string;
  seniorCitizenRate: string;
  minDeposit: string;
  maxDeposit: string;
  tenure: string;
  description: string;
  applyLink: string;
  keyFeatures: string[];
  tenureOptions: { tenure: string; rate: string }[];
  eligibility: {
    minAge: number;
    requiredDocuments: string[];
  };
  pros: string[];
  cons: string[];
}

const FD_FAQS = [
  {
    q: "Is FD interest taxable?",
    a: "Yes. FD interest is added to your taxable income. TDS of 10% is deducted if interest exceeds ₹40,000/year (₹50,000 for seniors). Submit Form 15G/15H to avoid TDS if income is below taxable limit.",
  },
  {
    q: "What happens if I break my FD early?",
    a: "Most banks charge a penalty of 0.5-1% on the applicable rate. The interest is recalculated at the rate applicable for the actual period held, minus the penalty.",
  },
  {
    q: "Are FDs safe? What if the bank fails?",
    a: "Bank FDs up to ₹5L per depositor per bank are insured by DICGC (a subsidiary of RBI). Corporate FDs are not covered by DICGC — check the credit rating before investing.",
  },
  {
    q: "What is the difference between cumulative and non-cumulative FD?",
    a: "Cumulative FDs pay interest at maturity (compounding). Non-cumulative FDs pay interest monthly/quarterly/annually. Cumulative gives higher effective returns.",
  },
  {
    q: "Can NRIs open FDs in India?",
    a: "Yes. NRIs can open NRE FDs (tax-free, repatriable) or NRO FDs (taxable in India). Interest rates and terms may differ from resident FDs.",
  },
  {
    q: "What is a tax-saving FD?",
    a: "A 5-year FD that qualifies for Section 80C deduction up to ₹1.5L/year. It has a 5-year lock-in — premature withdrawal is not allowed.",
  },
];

async function getFixedDepositData(
  slug: string,
): Promise<FixedDepositDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== "fixed_deposit") return null;

  const features = product.features || {};

  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    rating: product.rating.overall,
    interestRate: features.interest_rate || "7.5% p.a.",
    seniorCitizenRate: features.senior_rate || "8.0% p.a.",
    minDeposit: features.min_deposit || "₹1,000",
    maxDeposit: features.max_deposit || "No Limit",
    tenure: features.tenure || "7 days to 10 years",
    description: product.description || "",
    applyLink: product.affiliate_link || product.official_link || "#",
    keyFeatures:
      product.features?.key_highlights || product.pros?.slice(0, 5) || [],
    tenureOptions: features.tenure_options || [
      { tenure: "1 Year", rate: "6.8%" },
      { tenure: "2 Years", rate: "7.0%" },
      { tenure: "3 Years", rate: "7.25%" },
      { tenure: "5 Years", rate: "7.5%" },
    ],
    eligibility: {
      minAge: features.min_age || 18,
      requiredDocuments: features.docs || [
        "PAN Card",
        "Aadhaar Card",
        "Address Proof",
      ],
    },
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
  const fd = await getFixedDepositData(slug);

  if (!fd) {
    return { title: "Fixed Deposit Not Found - InvestingPro" };
  }

  const title = `${fd.name} FD Review - Interest Rate ${fd.interestRate} | InvestingPro`;
  const description = `${fd.description} Interest Rate: ${fd.interestRate}. Senior Citizen: ${fd.seniorCitizenRate}. Compare and invest online.`;

  return {
    title,
    description,
    keywords: `${fd.name}, ${fd.provider} fixed deposit, FD interest rate, best fixed deposit`,
    openGraph: {
      title,
      description,
      url: `https://investingpro.in/fixed-deposits/${slug}`,
      siteName: "InvestingPro",
      type: "website",
      ...(fd.image
        ? {
            images: [{ url: fd.image, width: 1200, height: 630, alt: fd.name }],
          }
        : {}),
    },
  };
}

export default async function FixedDepositDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fd = await getFixedDepositData(slug);

  if (!fd) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Schema Markup */}
      <ProductSchemaMarkup
        product={{
          name: fd.name,
          description: fd.description,
          image: fd.image,
          rating: fd.rating,
          category: "Fixed Deposit",
          provider: fd.provider,
          url: `/fixed-deposits/${slug}`,
        }}
      />
      <ProductFAQSchema faqs={FD_FAQS} />

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
                <span className="bg-emerald-500/20 text-action-green dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Landmark className="w-4 h-4" />
                  Fixed Deposit
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg text-foreground">
                    {fd.rating}
                  </span>
                  <span className="text-action-green dark:text-green-400 text-sm">
                    /5
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {fd.name}
              </h1>
              <p className="text-action-green dark:text-green-400 mb-6">
                {fd.provider}
              </p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                {fd.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-background dark:bg-muted/50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-xl font-bold text-foreground">
                    {fd.interestRate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Senior Citizen
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {fd.seniorCitizenRate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Min Deposit</p>
                  <p className="text-xl font-bold text-foreground">
                    {fd.minDeposit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tenure</p>
                  <p className="text-xl font-bold text-foreground">
                    {fd.tenure.split(" ")[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-background dark:bg-muted/50 border border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Start earning guaranteed returns
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-action-green hover:bg-authority-green dark:bg-green-600 dark:hover:bg-action-green/100 text-white font-semibold py-6 text-lg mb-3">
                      Open FD <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>DICGC Insured up to ₹5 Lakh</span>
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
            {/* Interest Rates by Tenure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-action-green" />
                  Interest Rates by Tenure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Tenure
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">
                          Interest Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fd.tenureOptions.map((option, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 px-4 flex items-center gap-2 text-foreground">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {option.tenure}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-action-green dark:text-green-400">
                            {option.rate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * Senior citizens get additional 0.25% - 0.50% on these rates
                </p>
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
                  {fd.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-action-green flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-600 dark:border-green-500">
                <CardHeader className="bg-green-100 dark:bg-green-900/30">
                  <CardTitle className="text-action-green dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {fd.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-action-green flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="bg-red-100 dark:bg-red-900/30">
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {fd.cons.map((con, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Editorial Verdict */}
            <EditorialVerdict
              productName={fd.name}
              rating={fd.rating}
              verdict={`${fd.name} from ${fd.provider} offers competitive interest rates of up to ${fd.interestRate} for general customers and ${fd.seniorCitizenRate} for senior citizens. With a minimum deposit of ${fd.minDeposit} and flexible tenure options, this FD is a solid choice for risk-averse investors seeking guaranteed returns.`}
              scores={[
                { label: "Interest Rate", score: Math.min(fd.rating + 0.2, 5) },
                { label: "Safety", score: 4.8 },
                { label: "Flexibility", score: Math.min(fd.rating - 0.1, 5) },
                { label: "Tax Benefit", score: 3.5 },
              ]}
            />

            {/* Similar Products */}
            <SimilarProducts
              category="fixed_deposit"
              currentProductId={fd.id}
              maxProducts={4}
            />

            {/* Article Feedback */}
            <ArticleFeedback articleId={`fd-${fd.id}`} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-6">
              <Card className="bg-card border-b border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Start Earning Today
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Guaranteed returns with zero risk
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-card text-action-green hover:bg-muted dark:bg-muted dark:text-green-400 dark:hover:bg-muted/80 font-semibold py-6 mb-3">
                      Open FD <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
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
                    <p className="font-semibold text-foreground">
                      {fd.eligibility.minAge} years
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="font-medium text-foreground mb-2">
                      Required Documents:
                    </p>
                    <ul className="space-y-1.5">
                      {fd.eligibility.requiredDocuments.map((doc, index) => (
                        <li
                          key={index}
                          className="text-muted-foreground text-xs flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3 h-3 text-action-green flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Notice */}
              <Card className="mt-6 bg-blue-100 dark:bg-blue-900/30 border-blue-600 dark:border-blue-500">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      <p className="font-semibold mb-1">Safe Investment</p>
                      <p>
                        Bank FDs are insured by DICGC for up to ₹5 Lakh per
                        depositor per bank.
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
          {FD_FAQS.map((f, i) => (
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
          <h2 className="text-3xl font-bold mb-4">Open {fd.name} Today</h2>
          <p className="text-ink-60 mb-8">
            Earn guaranteed returns with India&#39;s trusted bank!
          </p>
          <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-action-green hover:bg-authority-green dark:hover:bg-action-green/100 text-white font-semibold px-12 py-6 text-lg">
              Open FD Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
