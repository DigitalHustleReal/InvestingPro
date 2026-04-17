import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AutoBreadcrumbs from "@/components/common/AutoBreadcrumbs";
import EditorialVerdict from "@/components/products/EditorialVerdict";
import SimilarProducts from "@/components/products/SimilarProducts";
import { ProductFAQSchema } from "@/components/products/ProductFAQSchema";
import { ProductSchemaMarkup } from "@/components/products/ProductSchemaMarkup";
import ArticleFeedback from "@/components/articles/ArticleFeedback";
import AuthorByline from "@/components/common/AuthorByline";
import RelatedArticles from "@/components/content/RelatedArticles";
import DifferentiationCard from "@/components/products/DifferentiationCard";
import { scoreLoan } from "@/lib/products/scoring-rules";
import { getProductBySlug } from "@/lib/products/server-service";
import {
  Star,
  Percent,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Calculator,
  Clock,
  FileText,
  AlertTriangle,
  ExternalLink,
  TrendingDown,
} from "lucide-react";

// ─── Loan-Specific FAQs ─────────────────────────────────────────────────────

const LOAN_FAQS = [
  {
    q: "How is EMI calculated?",
    a: "EMI is calculated using the formula: EMI = P x R x (1+R)^N / [(1+R)^N - 1], where P is the principal loan amount, R is the monthly interest rate (annual rate / 12 / 100), and N is the tenure in months. Most banks provide an online EMI calculator for quick estimates.",
  },
  {
    q: "What is a floating vs fixed interest rate?",
    a: "A fixed interest rate remains constant throughout the loan tenure, giving predictable EMIs. A floating rate is linked to the RBI repo rate or the bank's MCLR/EBLR and can change periodically — it may go up or down. Floating rates are usually 1-2% lower than fixed rates initially.",
  },
  {
    q: "What happens if I miss an EMI?",
    a: "Missing an EMI results in a late payment fee (typically 2-3% of the EMI amount), a negative impact on your CIBIL score, and potential penal interest charges. Consecutive missed EMIs can lead to the loan being classified as NPA and legal recovery action by the lender.",
  },
  {
    q: "Can I prepay my loan? Are there charges?",
    a: "Yes, most loans allow prepayment. For floating-rate loans, RBI has mandated zero prepayment/foreclosure charges for individual borrowers. Fixed-rate loans may attract prepayment charges of 2-5% of the outstanding principal. Check your loan agreement for specific terms.",
  },
  {
    q: "What documents are needed for a personal loan?",
    a: "Typically required: PAN Card, Aadhaar Card, last 3-6 months' salary slips, bank statements for 6 months, Form 16 or ITR for the last 2 years, passport-size photographs, and address proof. Self-employed applicants additionally need business proof and audited financials.",
  },
  {
    q: "How does CIBIL score affect my loan approval?",
    a: "A CIBIL score of 750+ is considered good and increases approval chances with competitive interest rates. Scores between 650-749 may get approval but at higher rates. Below 650, most banks will reject the application. You can improve your score by paying bills on time, keeping credit utilisation low, and maintaining a healthy credit mix.",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface LoanDetail {
  id: string;
  name: string;
  provider: string;
  image?: string;
  loanType: string;
  rating: number;
  interestRateMin: number;
  interestRateMax: number;
  maxLoanAmount: number;
  minLoanAmount: number;
  processingFee: string;
  maxTenureMonths: number;
  minTenureMonths: number;
  minCreditScore?: number;
  prepaymentCharges: string;

  description: string;
  applyLink: string;

  keyFeatures: string[];
  eligibility: {
    minAge: number;
    maxAge: number;
    minIncome: number;
    employmentType: string[];
    requiredDocuments: string[];
  };

  fees: {
    name: string;
    amount: string;
    details?: string;
  }[];

  benefits: string[];
  specialOffers?: string;

  emiExample: {
    loanAmount: number;
    tenure: number;
    interestRate: number;
    emi: number;
    totalInterest: number;
  };

  pros: string[];
  cons: string[];
}

// ─── Data Fetcher ────────────────────────────────────────────────────────────

async function getLoanData(slug: string): Promise<LoanDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== "loan") return null;

  const features = product.features || {};

  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    loanType: features.type || "Personal Loan",
    rating: product.rating.overall,
    interestRateMin: parseFloat(features.rate_min || "10.5"),
    interestRateMax: parseFloat(features.rate_max || "21.0"),
    maxLoanAmount: parseInt(features.max_amount || "4000000"),
    minLoanAmount: parseInt(features.min_amount || "50000"),
    processingFee: features.processing_fee || "Up to 2.5%",
    maxTenureMonths: parseInt(features.max_tenure_months || "60"),
    minTenureMonths: parseInt(features.min_tenure_months || "12"),
    minCreditScore: parseInt(features.min_score || "750"),
    prepaymentCharges: features.prepayment || "4% + GST",

    description: product.description || "",
    applyLink: product.affiliate_link || product.official_link || "#",

    keyFeatures: features.key_highlights || product.pros.slice(0, 5) || [],
    eligibility: {
      minAge: features.min_age || 21,
      maxAge: features.max_age || 60,
      minIncome: features.min_income || 25000,
      employmentType: features.employment_types || [
        "Salaried",
        "Self-Employed",
      ],
      requiredDocuments: features.docs || [
        "PAN Card",
        "Aadhaar Card",
        "Salary Slips",
      ],
    },

    fees: features.fee_schedule || [
      {
        name: "Processing Fee",
        amount: features.processing_fee || "Up to 2.5%",
      },
      { name: "Prepayment Charges", amount: features.prepayment || "4% + GST" },
    ],

    benefits: features.benefit_items || product.pros.slice(0, 5) || [],
    specialOffers: features.special_offers || undefined,

    emiExample: features.emi_example || {
      loanAmount: 500000,
      tenure: 36,
      interestRate: 12.5,
      emi: 16680,
      totalInterest: 100480,
    },

    pros: product.pros || [],
    cons: product.cons || [],
  };
}

// ─── Dynamic Params ──────────────────────────────────────────────────────────

export const dynamicParams = true;

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loan = await getLoanData(slug);

  if (!loan) {
    return {
      title: "Loan Not Found",
    };
  }

  const title = `${loan.name} - Interest Rate ${loan.interestRateMin}% onwards, Apply Online`;
  const description = `${loan.description} Interest: ${loan.interestRateMin}-${loan.interestRateMax}%. Loan amount: up to ₹${(loan.maxLoanAmount / 100000).toFixed(0)} Lakh. Rating: ${loan.rating}/5.`;

  return {
    title,
    description,
    keywords: `${loan.name}, ${loan.provider} loan, ${loan.loanType.toLowerCase()}, loan interest rate, ${loan.provider.toLowerCase()} loan apply online, EMI calculator`,
    openGraph: {
      title: `${loan.name} Review | InvestingPro`,
      description,
      url: `https://investingpro.in/loans/${slug}`,
      siteName: "InvestingPro",
      type: "website",
      ...(loan.image
        ? {
            images: [
              { url: loan.image, width: 1200, height: 630, alt: loan.name },
            ],
          }
        : {}),
    },
    alternates: {
      canonical: `/loans/${slug}`,
    },
  };
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loan = await getLoanData(slug);

  if (!loan) {
    notFound();
  }

  // Compute editorial scores from loan data
  const interestRateScore = Math.max(
    2,
    Math.min(5, 5 - (loan.interestRateMin - 8) * 0.3),
  );
  const processingSpeedScore = loan.processingFee.includes("Nil")
    ? 4.8
    : Math.min(4.5, loan.rating + 0.1);
  const transparencyScore = Math.min(5, loan.rating + 0.2);
  const prepaymentScore = loan.prepaymentCharges.toLowerCase().includes("nil")
    ? 5.0
    : loan.prepaymentCharges.includes("2%")
      ? 4.0
      : 3.5;

  return (
    <div className="bg-background min-h-screen">
      {/* Schema Markup */}
      <ProductSchemaMarkup
        product={{
          name: loan.name,
          description: loan.description,
          image: loan.image,
          rating: loan.rating,
          category: "Loan",
          provider: loan.provider,
          url: `/loans/${slug}`,
        }}
      />
      <ProductFAQSchema faqs={LOAN_FAQS} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AutoBreadcrumbs />
      </div>

      {/* Hero Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Loan Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {loan.loanType}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg text-foreground">
                    {loan.rating}
                  </span>
                  <span className="text-muted-foreground text-sm">/5</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {loan.name}
              </h1>
              <p className="text-green-600 dark:text-green-400 mb-4">
                {loan.provider}
              </p>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {loan.description}
              </p>
              <AuthorByline className="text-muted-foreground border-border mb-6" />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-background dark:bg-muted/50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-xl font-bold text-foreground">
                    {loan.interestRateMin}% - {loan.interestRateMax}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Max Loan Amount
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    ₹{(loan.maxLoanAmount / 100000).toFixed(0)}L
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Processing Fee
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {loan.processingFee}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tenure</p>
                  <p className="text-xl font-bold text-foreground">
                    {loan.minTenureMonths / 12}-{loan.maxTenureMonths / 12}{" "}
                    Years
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-background dark:bg-muted/50 border border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Get instant approval
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-semibold py-6 text-lg mb-3">
                      Apply Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-[10px] text-muted-foreground text-center mb-3">
                    Check eligibility in 2 min -- No CIBIL impact
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-500/50 rounded-lg p-3 text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      Disbursal in 48 hours
                    </p>
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
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* EMI Calculator Example */}
            <Card className="bg-gradient-to-br from-green-700 to-green-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calculator className="w-6 h-6" />
                  EMI Calculation Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-green-200">Loan Amount</p>
                    <p className="text-xl font-bold">
                      ₹{(loan.emiExample.loanAmount / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-200">Tenure</p>
                    <p className="text-xl font-bold">
                      {loan.emiExample.tenure} Months
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-200">Interest Rate</p>
                    <p className="text-xl font-bold">
                      {loan.emiExample.interestRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-200">Monthly EMI</p>
                    <p className="text-2xl font-bold text-green-300">
                      ₹{loan.emiExample.emi.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm text-green-200">
                    Total Interest: ₹
                    {loan.emiExample.totalInterest.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-200">
                    Total Amount Payable: ₹
                    {(
                      loan.emiExample.loanAmount + loan.emiExample.totalInterest
                    ).toLocaleString()}
                  </p>
                </div>
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
                  {loan.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  Loan Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {loan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground text-sm">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {loan.specialOffers && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">
                      Special Offer
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      {loan.specialOffers}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-600 dark:border-green-500">
                <CardHeader className="bg-green-100 dark:bg-green-900/30">
                  <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {loan.pros.map((pro, index) => (
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

              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="bg-red-100 dark:bg-red-900/30">
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Disadvantages
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {loan.cons.map((con, index) => (
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

            {/* Fees & Charges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  Fees &amp; Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {loan.fees.map((fee, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {fee.name}
                        </p>
                        {fee.details && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {fee.details}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-foreground ml-4">
                        {fee.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Editorial Verdict */}
            <EditorialVerdict
              productName={loan.name}
              rating={loan.rating}
              verdict={`${loan.name} from ${loan.provider} offers ${loan.loanType.toLowerCase()} starting at ${loan.interestRateMin}% p.a. with loan amounts up to ₹${(loan.maxLoanAmount / 100000).toFixed(0)} Lakh. With a tenure range of ${loan.minTenureMonths / 12}-${loan.maxTenureMonths / 12} years and processing fee of ${loan.processingFee}, this loan is a ${loan.rating >= 4 ? "strong" : "reasonable"} option for borrowers with a CIBIL score of ${loan.minCreditScore}+.`}
              scores={[
                {
                  label: "Interest Rate",
                  score: Math.round(interestRateScore * 10) / 10,
                },
                {
                  label: "Processing Speed",
                  score: Math.round(processingSpeedScore * 10) / 10,
                },
                {
                  label: "Transparency",
                  score: Math.round(transparencyScore * 10) / 10,
                },
                {
                  label: "Prepayment Flexibility",
                  score: Math.round(prepaymentScore * 10) / 10,
                },
              ]}
            />

            {/* Similar Products */}
            <SimilarProducts
              category="loan"
              currentProductId={loan.id}
              maxProducts={4}
            />

            {/* Article Feedback */}
            <ArticleFeedback articleId={`loan-${loan.id}`} />
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            {/* Differentiation Score Card */}
            <DifferentiationCard
              score={scoreLoan({
                id: loan.id,
                slug: slug,
                name: loan.name,
                category: "loan",
                provider: loan.provider,
                description: loan.description,
                rating: loan.rating,
                reviewsCount: 0,
                applyLink: loan.applyLink,
                loanType: (loan.loanType.toLowerCase().includes("home")
                  ? "home"
                  : "personal") as any,
                interestRateMin: loan.interestRateMin,
                interestRateMax: loan.interestRateMax,
                interestRateType: "floating",
                processingFee: loan.processingFee,
                prepaymentCharges: loan.prepaymentCharges,
                maxTenureMonths: loan.maxTenureMonths,
                maxAmount: loan.maxLoanAmount.toString(),
                minSalary: loan.eligibility.minIncome,
                minAge: loan.eligibility.minAge,
              })}
              productName={loan.name}
            />

            {/* Apply CTA (Sticky) */}
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Get Instant Loan</h3>
                  <p className="text-sm text-green-200 mb-4">
                    Approval in 10 seconds
                  </p>
                  <a
                    href={`/go/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-white text-green-600 hover:bg-gray-100 dark:hover:bg-gray-200 font-semibold py-6 mb-3">
                      Check Eligibility{" "}
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-green-200 text-center">
                    No impact on credit score -- 100% paperless
                  </p>
                </CardContent>
              </Card>

              {/* Eligibility */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-muted-foreground">Age Criteria</p>
                    <p className="font-semibold text-foreground">
                      {loan.eligibility.minAge} - {loan.eligibility.maxAge}{" "}
                      years
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Minimum Income</p>
                    <p className="font-semibold text-foreground">
                      ₹{(loan.eligibility.minIncome / 1000).toFixed(0)}k/month
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Credit Score</p>
                    <p className="font-semibold text-foreground">
                      {loan.minCreditScore}+ (Good to Excellent)
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employment Type</p>
                    <div className="space-y-1 mt-1">
                      {loan.eligibility.employmentType.map((type, index) => (
                        <p
                          key={index}
                          className="text-xs text-muted-foreground"
                        >
                          ✓ {type}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="font-medium text-foreground mb-2">
                      Required Documents:
                    </p>
                    <ul className="space-y-1.5">
                      {loan.eligibility.requiredDocuments.map((doc, index) => (
                        <li
                          key={index}
                          className="text-muted-foreground text-xs flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notice */}
              <Card className="mt-6 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-600 dark:text-red-400">
                      <p className="font-semibold mb-1">Borrow Responsibly</p>
                      <p>
                        Failure to repay may impact your credit score and lead
                        to legal action. Ensure EMI fits your budget.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <RelatedArticles />
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {LOAN_FAQS.map((f, i) => (
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Apply for {loan.name} in Minutes
          </h2>
          <p className="text-gray-400 mb-8">
            100% digital process -- Quick approval -- Instant disbursal
          </p>
          <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white font-semibold px-12 py-6 text-lg">
              Check Eligibility Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
