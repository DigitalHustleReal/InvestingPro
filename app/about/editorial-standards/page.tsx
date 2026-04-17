import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/common/SEOHead";
import {
  FileText,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Award,
  Users,
  Target,
  BookOpen,
  Scale,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Editorial Standards | InvestingPro - Our Commitment to Accuracy & Transparency",
  description:
    "Learn about our rigorous editorial process, expert team credentials, fact-checking methodology, and commitment to E-E-A-T principles for financial content.",
};

/**
 * Enhanced Editorial Standards Page
 *
 * Comprehensive page showcasing:
 * - Editorial team credentials (E-E-A-T)
 * - 5-step content review process
 * - Fact-checking methodology
 * - Update frequency policy
 * - Conflict of interest disclosure
 * - Correction policy
 */
export default function EditorialStandardsPage() {
  return (
    <>
      <SEOHead
        title="Editorial Standards | InvestingPro"
        description="Our editorial standards, content review process, and commitment to transparency and accuracy in financial information."
        url="https://investingpro.in/about/editorial-standards"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Editorial Standards
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our commitment to accuracy, transparency, and independence in
              financial content
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-600" />
                51+ Articles Published
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-600" />
                5-Step Review Process
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-600" />
                100% Fact-Checked
              </span>
            </div>
          </div>

          {/* Editorial Team */}
          <Card className="mb-8 border-2 border-primary-100 dark:border-primary-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary-600" />
                Our Editorial Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                All content on InvestingPro is researched from official sources
                and fact-checked before publication. Our editorial team operates
                through specialist desks:
              </p>

              <div className="grid md:grid-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Tax Desk
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Income tax guides verified against the Income Tax Act
                        1961 and Finance Act amendments. Salary-based examples
                        with real INR calculations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Credit &amp; Banking Team
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Credit card reward rates verified from official T&amp;C
                        documents. CIBIL content aligned with TransUnion
                        guidelines.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Investment Research
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mutual fund recommendations backed by historical NAV
                        data. SIP calculations validated against AMC
                        calculators.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Lending &amp; Insurance Desk
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Interest rates sourced from bank websites and RBI data.
                        Insurance comparisons based on IRDAI-filed product
                        brochures.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <p className="text-sm text-primary-900 dark:text-primary-100">
                  <strong>Our Sources:</strong> RBI circulars, SEBI guidelines,
                  Income Tax Act 1961, IRDAI filings, bank/NBFC websites, AMFI
                  data, TransUnion CIBIL, and CBDT notifications.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 5-Step Review Process */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary-600" />
                5-Step Content Review Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Data Collection & Verification",
                    description:
                      "All data points are collected from authoritative sources (RBI, SEBI, AMFI, company filings) and verified for accuracy. Each data point includes source attribution and timestamp.",
                  },
                  {
                    step: 2,
                    title: "Content Creation",
                    description:
                      "Content is created by subject matter experts using verified data. All financial claims are supported by citations to authoritative sources.",
                  },
                  {
                    step: 3,
                    title: "Fact-Checking",
                    description:
                      "Independent fact-checker verifies all claims, calculations, and data points. Financial data is cross-referenced with multiple sources.",
                  },
                  {
                    step: 4,
                    title: "Compliance Review",
                    description:
                      "Content is reviewed for compliance with RBI, SEBI, and IRDAI guidelines. Ensures informational language (no financial advice) and proper disclaimers.",
                  },
                  {
                    step: 5,
                    title: "Editorial Approval",
                    description:
                      "Senior editor reviews for accuracy, clarity, and completeness before publication. All content includes author credentials and review date.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fact-Checking Methodology */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary-600" />
                Fact-Checking Methodology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Source Verification
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    All sources must meet our credibility standards:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Tier 1: Government sources (RBI, SEBI, IRDAI, Ministry
                        of Finance)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>Tier 2: Industry bodies (AMFI, IBA, IRDA)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Tier 3: Company filings, annual reports, official
                        disclosures
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Tier 4: Reputable financial news (Economic Times, Mint,
                        Business Standard)
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Data Validation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All numerical data is verified through:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4 mt-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Cross-referencing with multiple authoritative sources
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Manual calculation verification for derived metrics
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Timestamp and source attribution for all data points
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Frequency */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary-600" />
                Content Update Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Regular Updates
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Product Data:</strong> Updated daily from
                        provider websites and official sources
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Regulatory Content:</strong> Updated immediately
                        when regulations change
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Guides & Articles:</strong> Reviewed quarterly
                        and updated as needed
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Calculators:</strong> Verified monthly for
                        accuracy
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Transparency:</strong> All content displays "Last
                    Updated" dates. Content older than 12 months is flagged for
                    mandatory review.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Independence & Conflicts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-primary-600" />
                Editorial Independence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Conflict of Interest Policy
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    We maintain strict editorial independence:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Rankings and recommendations are based solely on data
                        and analysis
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Affiliate relationships do not influence editorial
                        content
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>All affiliate links are clearly disclosed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                      <span>
                        Editorial team has no financial stake in recommended
                        products
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <p className="text-sm text-primary-900 dark:text-primary-100">
                    <strong>Full Disclosure:</strong> Learn more about how we
                    make money while maintaining editorial independence on our{" "}
                    <Link
                      href="/how-we-make-money"
                      className="underline font-semibold"
                    >
                      Revenue Model page
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Principles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary-600" />
                Core Editorial Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Authoritative & Neutral
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All content is research-driven and neutral. We do not favor
                    any provider or product.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Data-Driven
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Every claim is backed by verified data with full provenance
                    (source, timestamp, update frequency).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Transparent
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our methodology, data sources, and ranking calculations are
                    publicly disclosed.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Independent
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rankings and content are not influenced by monetization,
                    affiliate relationships, or advertising.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Corrections Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Corrections & Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                We are committed to accuracy. If you find an error:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                  <span>
                    Contact us at{" "}
                    <a
                      href="mailto:contact@investingpro.in"
                      className="text-primary-600 hover:underline"
                    >
                      contact@investingpro.in
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                  <span>
                    We will investigate and correct verified errors within 24
                    hours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                  <span>
                    All corrections are documented with timestamps and noted in
                    content
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
                  <span>
                    Significant corrections are disclosed at the top of the
                    article
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Important:</strong> InvestingPro.in is not registered with
              SEBI as an investment advisor. All information on this platform is
              for educational and informational purposes only. Users should
              consult with qualified financial advisors before making financial
              decisions.
            </p>
          </div>

          {/* Related Links */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link
              href="/about/editorial-team"
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Meet Our Team
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn about our expert contributors
              </p>
            </Link>
            <Link
              href="/how-we-make-money"
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Revenue Model
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How we maintain independence
              </p>
            </Link>
            <Link
              href="/affiliate-disclosure"
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Affiliate Disclosure
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our affiliate relationships
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
