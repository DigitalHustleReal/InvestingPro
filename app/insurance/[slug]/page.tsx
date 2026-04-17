import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  Shield,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Heart,
  Car,
  Home,
  AlertCircle,
  ExternalLink,
  Users,
  FileText,
} from "lucide-react";
import { getProductBySlug } from "@/lib/products/server-service";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import EditorialVerdict from "@/components/products/EditorialVerdict";
import SimilarProducts from "@/components/products/SimilarProducts";
import { ProductFAQSchema } from "@/components/products/ProductFAQSchema";
import { ProductSchemaMarkup } from "@/components/products/ProductSchemaMarkup";
import ArticleFeedback from "@/components/articles/ArticleFeedback";

interface InsuranceDetail {
  id: string;
  name: string;
  provider: string;
  image?: string;
  rating: number;
  insuranceType: string;
  coverAmount: string;
  premium: string;
  claimSettlementRatio: string;
  description: string;
  applyLink: string;
  keyFeatures: string[];
  coverageDetails: string[];
  exclusions: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    requiredDocuments: string[];
  };
  premiumDetails: { name: string; amount: string }[];
  pros: string[];
  cons: string[];
}

const INSURANCE_FAQS = [
  {
    q: "What is claim settlement ratio and why does it matter?",
    a: "CSR is the percentage of claims an insurer pays out of total claims received. Higher CSR (>95%) means the insurer is reliable. We track this data for every insurer.",
  },
  {
    q: "How much health insurance cover do I need?",
    a: "Minimum ₹10L for individuals, ₹25L+ for families in metros. Medical inflation runs at 14% annually — what costs ₹5L today will cost ₹20L in 10 years.",
  },
  {
    q: "What is the waiting period for pre-existing conditions?",
    a: "Most health insurance plans have a 2-4 year waiting period for pre-existing conditions. Some plans offer lower waiting periods at higher premiums.",
  },
  {
    q: "Is the premium tax deductible?",
    a: "Yes. Health insurance premiums qualify for deduction under Section 80D — up to ₹25,000 for self (₹50,000 for senior citizens), plus ₹25,000-₹50,000 for parents.",
  },
  {
    q: "Can I switch my insurance provider?",
    a: "Yes, health insurance is portable from the 2nd year. Your waiting periods carry over to the new insurer. File portability request 45 days before renewal.",
  },
  {
    q: "What documents are needed to file a claim?",
    a: "Typically: hospital bills, discharge summary, doctor prescriptions, policy copy, ID proof. Cashless claims need pre-authorization from the TPA/insurer.",
  },
];

async function getInsuranceData(slug: string): Promise<InsuranceDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== "insurance") return null;

  const features = product.features || {};

  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    rating: product.rating.overall,
    insuranceType: features.insurance_type || "Life Insurance",
    coverAmount: features.cover_amount || "₹1 Crore",
    premium: features.premium || "₹500/month",
    claimSettlementRatio: features.claim_ratio || "98%",
    description: product.description || "",
    applyLink: product.affiliate_link || product.official_link || "#",
    keyFeatures:
      product.features?.key_highlights || product.pros?.slice(0, 5) || [],
    coverageDetails: features.coverage || [
      "Death Benefit",
      "Terminal Illness",
      "Accidental Death",
    ],
    exclusions: features.exclusions || [
      "Suicide within 1 year",
      "Pre-existing conditions",
    ],
    eligibility: {
      minAge: features.min_age || 18,
      maxAge: features.max_age || 65,
      requiredDocuments: features.docs || [
        "ID Proof",
        "Address Proof",
        "Medical Reports",
      ],
    },
    premiumDetails: [
      {
        name: "Monthly Premium",
        amount: features.monthly_premium || features.premium || "Varies",
      },
      { name: "Annual Premium", amount: features.annual_premium || "Varies" },
      { name: "Cover Amount", amount: features.cover_amount || "₹1 Crore" },
    ],
    pros: product.pros || [],
    cons: product.cons || [],
  };
}

// Enable dynamic rendering for routes not pre-generated
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insurance = await getInsuranceData(slug);

  if (!insurance) {
    return { title: "Insurance Not Found" };
  }

  return {
    title: `${insurance.name} Review - Coverage, Premium & Buy Online`,
    description: `${insurance.description} Rating: ${insurance.rating}/5. Claim Ratio: ${insurance.claimSettlementRatio}. Compare and buy online.`,
    keywords: `${insurance.name}, ${insurance.provider} insurance, ${insurance.insuranceType}, buy insurance online`,
    openGraph: {
      title: `${insurance.name} Review | InvestingPro`,
      description: insurance.description,
      type: "article",
      images: insurance.image ? [insurance.image] : [],
    },
    alternates: {
      canonical: `/insurance/${slug}`,
    },
  };
}

export default async function InsuranceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insurance = await getInsuranceData(slug);

  if (!insurance) {
    notFound();
  }

  const getInsuranceIcon = () => {
    const type = insurance.insuranceType.toLowerCase();
    if (type.includes("health")) return Heart;
    if (type.includes("motor") || type.includes("car")) return Car;
    if (type.includes("home")) return Home;
    return Shield;
  };
  const InsuranceIcon = getInsuranceIcon();

  return (
    <div className="bg-background min-h-screen">
      {/* Schema Markup for SEO */}
      <ProductSchemaMarkup
        product={{
          name: insurance.name,
          description: insurance.description,
          image: insurance.image,
          rating: insurance.rating,
          category: "Insurance",
          provider: insurance.provider,
          url: `/insurance/${slug}`,
        }}
      />
      <ProductFAQSchema faqs={INSURANCE_FAQS} />

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
                <span className="bg-green-50 dark:bg-green-950/40 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <InsuranceIcon className="w-4 h-4" />
                  {insurance.insuranceType}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg text-foreground">
                    {insurance.rating}
                  </span>
                  <span className="text-green-600 text-sm">/5</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                {insurance.name}
              </h1>
              <p className="text-green-600 mb-6">{insurance.provider}</p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                {insurance.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-background dark:bg-muted/50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cover Amount</p>
                  <p className="text-xl font-bold text-foreground">
                    {insurance.coverAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Premium</p>
                  <p className="text-xl font-bold text-foreground">
                    {insurance.premium}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Claim Ratio</p>
                  <p className="text-xl font-bold text-foreground">
                    {insurance.claimSettlementRatio}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-xl font-bold text-foreground">
                    {insurance.insuranceType.split(" ")[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-background dark:bg-muted/50 border border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Get covered in minutes
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg mb-3">
                      Get Quote <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>IRDAI Approved &bull; Instant Policy</span>
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
            {/* Coverage Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  What&apos;s Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insurance.coverageDetails.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insurance.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Exclusions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  What&apos;s Not Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insurance.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-600">
                <CardHeader className="bg-green-100 dark:bg-green-950/40">
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {insurance.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-900">
                <CardHeader className="bg-red-100 dark:bg-red-950/40">
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {insurance.cons.map((con, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Editorial Verdict */}
            <EditorialVerdict
              productName={insurance.name}
              rating={insurance.rating}
              verdict={`${insurance.name} by ${insurance.provider} offers ${insurance.coverAmount} coverage with a ${insurance.claimSettlementRatio} claim settlement ratio. ${insurance.insuranceType === "Health Insurance" ? "Strong health coverage with cashless hospitalization options." : "Reliable protection for you and your family."}`}
              scores={[
                {
                  label: "Coverage",
                  score: Math.min(insurance.rating + 0.2, 5),
                },
                {
                  label: "Claim Process",
                  score: Math.min(insurance.rating + 0.1, 5),
                },
                {
                  label: "Premium Value",
                  score: Math.min(insurance.rating - 0.1, 5),
                },
                {
                  label: "Customer Service",
                  score: Math.min(insurance.rating, 5),
                },
              ]}
            />

            {/* Similar Products */}
            <SimilarProducts
              category="insurance"
              currentProductId={insurance.id}
              maxProducts={4}
            />

            {/* Article Feedback */}
            <ArticleFeedback articleId={insurance.id} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    Protect Your Family
                  </h3>
                  <p className="text-sm text-green-100 mb-4">
                    Get instant quotes now
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-white text-green-600 hover:bg-gray-100 dark:hover:bg-gray-200 font-semibold py-6 mb-3">
                      Get Quote <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Eligibility */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-muted-foreground">Age Requirement</p>
                    <p className="font-semibold text-foreground">
                      {insurance.eligibility.minAge} -{" "}
                      {insurance.eligibility.maxAge} years
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="font-medium mb-2 text-foreground">
                      Required Documents:
                    </p>
                    <ul className="space-y-1.5">
                      {insurance.eligibility.requiredDocuments.map(
                        (doc, index) => (
                          <li
                            key={index}
                            className="text-muted-foreground text-xs flex items-start gap-2"
                          >
                            <FileText className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                            {doc}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-xs text-amber-800 dark:text-amber-200">
                      <p className="font-semibold mb-1">Important</p>
                      <p>
                        Insurance is subject to terms and conditions. Please
                        read the policy document carefully before buying.
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
          {INSURANCE_FAQS.map((f, i) => (
            <details
              key={i}
              className="group bg-card border border-border rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-foreground hover:bg-muted/50 transition-colors list-none">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0 ml-4">
                  &rsaquo;
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
            Secure Your Future with {insurance.name}
          </h2>
          <p className="text-gray-400 mb-8">
            Get comprehensive coverage at the best rates!
          </p>
          <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-12 py-6 text-lg">
              Get Free Quote <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
