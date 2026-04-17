import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/common/SEOHead";
import {
  Scale,
  TrendingUp,
  Shield,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Ranking Methodology",
  description:
    "Transparent, data-driven ranking methodology for credit cards, mutual funds, and personal loans. Learn how we calculate scores and rankings.",
};

/**
 * Methodology Page
 *
 * Explains how rankings are calculated - transparent, reproducible, explainable.
 * This is CRITICAL for YMYL (Your Money Your Life) compliance.
 */
export default function MethodologyPage() {
  return (
    <>
      <SEOHead
        title="Our Ranking Methodology | InvestingPro"
        description="Transparent, data-driven ranking methodology for credit cards, mutual funds, and personal loans. Learn how we calculate scores and rankings."
        url="https://investingpro.in/methodology"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Ranking Methodology
            </h1>
            <p className="text-xl text-gray-600">
              Transparent, data-driven, and reproducible rankings
            </p>
          </div>

          {/* Core Principles */}
          <Card className="mb-8 border-2 border-primary-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-6 md:p-8">
                <Shield className="w-6 h-6 text-primary-600" />
                Core Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Deterministic
                    </h3>
                    <p className="text-sm text-gray-600">
                      Same inputs always produce the same outputs. Rankings are
                      reproducible.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Transparent
                    </h3>
                    <p className="text-sm text-gray-600">
                      All factors, weights, and calculations are publicly
                      disclosed.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Explainable
                    </h3>
                    <p className="text-sm text-gray-600">
                      Every score has a detailed breakdown showing how it was
                      calculated.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Independent
                    </h3>
                    <p className="text-sm text-gray-600">
                      Rankings are NOT influenced by monetization, affiliate
                      relationships, or advertising.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editorial Independence */}
          <Card className="mb-8 border-2 border-green-100 dark:border-green-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-600" />
                Editorial Independence &amp; Commercial Separation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Separate editorial and commercial teams
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our editorial analysts who determine ratings and rankings
                      are organizationally separate from our commercial and
                      partnerships team. Commercial relationships are disclosed
                      but cannot influence editorial scores.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Compensation does not influence ratings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      When you apply through our affiliate links, we may earn a
                      commission. This compensation never changes a
                      product&apos;s score, rank, or recommendation. Products
                      are ranked purely by their objective score — not by
                      affiliate revenue potential.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      No paid placements or sponsored rankings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No bank, AMC, lender, or financial institution can pay to
                      appear higher in our rankings. The top-ranked product is
                      always the highest-scoring product by our published
                      criteria — nothing more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      All content is for educational purposes only
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      InvestingPro.in provides information and comparison tools
                      to help you make informed decisions. Our content does not
                      constitute personalized financial, investment, tax, or
                      legal advice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Affiliate disclosure link */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/how-we-make-money"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  How we make money &rarr;
                </Link>
                <Link
                  href="/affiliate-disclosure"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Affiliate disclosure &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Credit Cards Methodology */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-6 md:p-8">
                <Scale className="w-6 h-6 text-primary-600" />
                Credit Cards Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Factors & Weights
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Annual Fee (lower is better)
                      </span>
                      <span className="text-sm text-gray-600">25%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Rewards Rate (higher is better)
                      </span>
                      <span className="text-sm text-gray-600">30%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Features Count
                      </span>
                      <span className="text-sm text-gray-600">15%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Interest Rate (lower is better)
                      </span>
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Eligibility (easier is better)
                      </span>
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Provider Trust
                      </span>
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Calculation Method
                  </h3>
                  <p className="text-sm text-gray-600">
                    Each factor is normalized to a 0-100 scale, then multiplied
                    by its weight. The sum of all weighted scores gives the
                    total score (0-100). Products are ranked by total score in
                    descending order.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mutual Funds Methodology */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-6 md:p-8">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                Mutual Funds Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Factors & Weights
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Returns (3Y weighted 50%, 5Y 30%, 1Y 20%)
                      </span>
                      <span className="text-sm text-gray-600">40%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Expense Ratio (lower is better)
                      </span>
                      <span className="text-sm text-gray-600">20%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Risk-Adjusted Returns (Sharpe ratio)
                      </span>
                      <span className="text-sm text-gray-600">20%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        AUM (larger is better, stability)
                      </span>
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Fund Manager Experience
                      </span>
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Loans Methodology */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-6 md:p-8">
                <FileText className="w-6 h-6 text-primary-600" />
                Personal Loans Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Factors & Weights
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Interest Rate (lower is better)
                      </span>
                      <span className="text-sm text-gray-600">40%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Processing Fee (lower is better)
                      </span>
                      <span className="text-sm text-gray-600">20%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Loan Amount Range (higher max is better)
                      </span>
                      <span className="text-sm text-gray-600">15%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Eligibility (easier is better)
                      </span>
                      <span className="text-sm text-gray-600">15%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <span className="text-sm font-medium">
                        Provider Trust
                      </span>
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Data Sources & Provenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                All data used in rankings comes from verified sources with full
                provenance tracking:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Every numeric value has a source URL, fetched_at timestamp,
                    and update frequency
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Data is refreshed according to update frequency (daily,
                    weekly, monthly)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>All sources are verified and publicly accessible</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>Raw data snapshots are stored for audit trail</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Versioning */}
          <Card>
            <CardHeader>
              <CardTitle>Versioning & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Ranking configurations are versioned. When weights or
                methodology change:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>A new version is created with updated weights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Previous rankings remain stored for historical reference
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>
                    All ranking calculations are timestamped and reproducible
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Legal disclaimer */}
          <div className="mt-8 p-6 md:p-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Important Disclosures
                </p>
                <ul className="space-y-1.5 text-sm text-amber-800 dark:text-amber-300">
                  <li>
                    <strong>NOT a SEBI registered investment advisor.</strong>{" "}
                    InvestingPro.in is a financial comparison and information
                    platform, not a registered investment advisor under SEBI
                    (Investment Advisers) Regulations, 2013.
                  </li>
                  <li>
                    <strong>For educational purposes only.</strong> All content
                    — including rankings, scores, comparisons, and calculators —
                    is provided for general information and educational
                    purposes. It does not constitute personalized financial,
                    investment, tax, or legal advice.
                  </li>
                  <li>
                    <strong>
                      Past performance is not indicative of future results.
                    </strong>{" "}
                    Mutual fund and investment product rankings reflect
                    historical data only.
                  </li>
                  <li>
                    <strong>Consult a qualified advisor.</strong> Before making
                    any financial decision, please consult with a
                    SEBI-registered investment advisor or qualified financial
                    professional who can assess your individual circumstances.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
