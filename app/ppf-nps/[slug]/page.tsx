import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  Wallet,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Clock,
  Percent,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  PiggyBank,
  Calculator,
} from "lucide-react";
import { getProductBySlug } from "@/lib/products/server-service";

interface PPFNPSDetail {
  id: string;
  name: string;
  provider: string;
  image?: string;
  rating: number;
  schemeType: string;
  interestRate: string;
  lockInPeriod: string;
  minInvestment: string;
  maxInvestment: string;
  taxBenefit: string;
  description: string;
  applyLink: string;
  keyFeatures: string[];
  taxBenefits: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    requiredDocuments: string[];
  };
  pros: string[];
  cons: string[];
}

async function getPPFNPSData(slug: string): Promise<PPFNPSDetail | null> {
  const product = await getProductBySlug(slug);
  if (
    !product ||
    (product.category !== "ppf" &&
      product.category !== "nps" &&
      product.category !== "ppf_nps")
  )
    return null;

  const features = product.features || {};

  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    rating: product.rating.overall,
    schemeType: features.scheme_type || "Government Scheme",
    interestRate: features.interest_rate || "7.1% p.a.",
    lockInPeriod: features.lock_in || "15 years",
    minInvestment: features.min_investment || "₹500/year",
    maxInvestment: features.max_investment || "₹1.5 Lakh/year",
    taxBenefit: features.tax_benefit || "Section 80C",
    description: product.description || "",
    applyLink: product.affiliate_link || product.official_link || "#",
    keyFeatures:
      product.features?.key_highlights || product.pros?.slice(0, 5) || [],
    taxBenefits: features.tax_benefits || [
      "Investment deductible under Section 80C up to ₹1.5 Lakh",
      "Interest earned is tax-free",
      "Maturity amount is completely tax-free (EEE status)",
    ],
    eligibility: {
      minAge: features.min_age || 18,
      maxAge: features.max_age || 60,
      requiredDocuments: features.docs || [
        "PAN Card",
        "Aadhaar Card",
        "Passport Photo",
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
  const scheme = await getPPFNPSData(slug);

  if (!scheme) {
    return { title: "Scheme Not Found - InvestingPro" };
  }

  return {
    title: `${scheme.name} Review - ${scheme.interestRate} Interest Rate | InvestingPro`,
    description: `${scheme.description} Interest: ${scheme.interestRate}. Tax Benefits: ${scheme.taxBenefit}. Complete guide and how to invest.`,
    keywords: `${scheme.name}, PPF, NPS, tax saving investment, ${scheme.taxBenefit}`,
  };
}

export default async function PPFNPSDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scheme = await getPPFNPSData(slug);

  if (!scheme) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-500/20 text-amber-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <PiggyBank className="w-4 h-4" />
                  {scheme.schemeType}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg">{scheme.rating}</span>
                  <span className="text-amber-200 text-sm">/5</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {scheme.name}
              </h1>
              <p className="text-amber-100 mb-6">{scheme.provider}</p>
              <p className="text-lg text-amber-100 mb-8 max-w-2xl">
                {scheme.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-amber-200">Interest Rate</p>
                  <p className="text-xl font-bold">{scheme.interestRate}</p>
                </div>
                <div>
                  <p className="text-sm text-amber-200">Lock-in</p>
                  <p className="text-xl font-bold">{scheme.lockInPeriod}</p>
                </div>
                <div>
                  <p className="text-sm text-amber-200">Min Investment</p>
                  <p className="text-xl font-bold">{scheme.minInvestment}</p>
                </div>
                <div>
                  <p className="text-sm text-amber-200">Tax Benefit</p>
                  <p className="text-xl font-bold">
                    {scheme.taxBenefit.replace("Section ", "")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-6">
                  <p className="text-sm text-amber-200 mb-4">
                    Start your tax-saving journey
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-600 text-white font-semibold py-6 text-lg mb-3">
                      Open Account <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="flex items-center justify-center gap-2 text-amber-200 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Government Backed • 100% Safe</span>
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
            {/* Tax Benefits */}
            <Card className="border-green-600">
              <CardHeader className="bg-green-100">
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Calculator className="w-5 h-5" />
                  Tax Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {scheme.taxBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {scheme.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Investment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-600" />
                  Investment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Minimum</p>
                    <p className="font-bold text-lg">{scheme.minInvestment}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Maximum</p>
                    <p className="font-bold text-lg">{scheme.maxInvestment}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Lock-in Period</p>
                    <p className="font-bold text-lg">{scheme.lockInPeriod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-600">
                <CardHeader className="bg-green-100">
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {scheme.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="bg-red-100">
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {scheme.cons.map((con, index) => (
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Save Tax Today</h3>
                  <p className="text-sm text-amber-100 mb-4">
                    Up to ₹46,800 tax savings
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-white text-amber-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Start Investing <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Eligibility */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-gray-500">Age Requirement</p>
                    <p className="font-semibold">
                      {scheme.eligibility.minAge} - {scheme.eligibility.maxAge}{" "}
                      years
                    </p>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="font-medium mb-2">Required Documents:</p>
                    <ul className="space-y-1.5">
                      {scheme.eligibility.requiredDocuments.map(
                        (doc, index) => (
                          <li
                            key={index}
                            className="text-gray-600 text-xs flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                            {doc}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Government Notice */}
              <Card className="mt-6 bg-blue-100 border-blue-600">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-xs text-blue-600">
                      <p className="font-semibold mb-1">Government Backed</p>
                      <p>
                        This is a sovereign scheme backed by Government of
                        India. Your investment is 100% safe.
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
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {[
            {
              q: "What is the current PPF interest rate?",
              a: "PPF rate is 7.1% per annum (Q1 FY2026-27), compounded annually. The rate is reviewed every quarter by the Ministry of Finance.",
            },
            {
              q: "Can I withdraw from PPF before 15 years?",
              a: "Partial withdrawal is allowed from year 7 (up to 50% of balance at end of year 4). Premature closure is only allowed after 5 years for medical emergencies or higher education.",
            },
            {
              q: "Is NPS better than PPF?",
              a: "NPS offers higher potential returns (10-12% in equity) with additional ₹50K 80CCD(1B) deduction. PPF gives guaranteed 7.1% with fully tax-free maturity (EEE). NPS is better for higher returns; PPF for guaranteed safety.",
            },
            {
              q: "What is the maximum investment in PPF per year?",
              a: "₹1.5L per financial year. Minimum is ₹500/year. Deposits can be made in up to 12 installments per year.",
            },
            {
              q: "Can I have a PPF account and NPS account both?",
              a: "Yes. Both accounts can be held simultaneously. Combined 80C deduction is ₹1.5L, but NPS gives additional ₹50K under 80CCD(1B) — total ₹2L tax benefit.",
            },
            {
              q: "What happens to PPF at maturity?",
              a: "After 15 years, you can either withdraw the full amount (tax-free) or extend in blocks of 5 years with or without further contributions. The extension earns the prevailing interest rate.",
            },
          ].map((f, i) => (
            <details
              key={i}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">
                {f.q}
                <span className="text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-4">
                  ›
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your {scheme.name} Today
          </h2>
          <p className="text-gray-500 mb-8">Build wealth while saving taxes!</p>
          <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-600 text-white font-semibold px-12 py-6 text-lg">
              Open Account <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
