import React from "react";
import { Shield, ExternalLink, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import SEOHead from "@/components/common/SEOHead";
import { STAT_STRINGS } from "@/lib/constants/platform-stats";

export default function HowWeMakeMoneyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead
        title="How We Make Money | InvestingPro"
        description="Learn how InvestingPro maintains editorial independence while funding our free comparison platform through affiliate partnerships."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-widest">
              Transparency & Trust
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-white mb-6">
            How We Make Money
          </h1>
          <p className="text-xl text-stone-600 dark:text-gray-600 max-w-2xl mx-auto">
            We're committed to complete transparency about how we fund our
            platform while maintaining 100% editorial independence.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-200 mb-3 mt-0">
              The Short Answer
            </h2>
            <p className="text-secondary-800 dark:text-secondary-300 mb-0">
              InvestingPro is an independent comparison platform supported by{" "}
              <strong>affiliate commissions</strong>. When you apply for a
              product through our links, we may earn a fee from the provider.
              This allows us to offer our comparison tools and research
              completely free to you.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-12 mb-4">
            Our Commitment to Independence
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-0 mb-2">
                  Editorial Independence Guaranteed
                </h3>
                <p className="text-stone-700 dark:text-gray-300">
                  Our recommendations are <strong>NEVER</strong> influenced by
                  affiliate commissions. We analyze all products equally,
                  regardless of partnership status.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-0 mb-2">
                  Firewall Between Editorial & Commercial
                </h3>
                <p className="text-stone-700 dark:text-gray-300">
                  Our editorial team has <strong>ZERO access</strong> to
                  commercial deals or partnership agreements. They don't know
                  which products pay more or less.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-0 mb-2">
                  We Recommend Against Partners Too
                </h3>
                <p className="text-stone-700 dark:text-gray-300">
                  We analyze products across 50+ banks but only recommend the
                  best per category. If a partner's product doesn't make the
                  cut, we'll tell you why to avoid it.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-0 mb-2">
                  Transparent Labeling
                </h3>
                <p className="text-stone-700 dark:text-gray-300">
                  We clearly mark which products are affiliate partners vs.
                  non-partners. Both receive equal editorial treatment.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-12 mb-4">
            How Affiliate Commissions Work
          </h2>

          <ol className="space-y-4">
            <li>
              <strong>You click an "Apply Now" link</strong> on one of our
              product cards
            </li>
            <li>
              <strong>You're redirected to the provider's website</strong>{" "}
              (bank, lender, etc.)
            </li>
            <li>
              <strong>If you complete an application,</strong> the provider may
              pay us a commission
            </li>
            <li>
              <strong>You pay nothing extra.</strong> The commission comes from
              the provider's marketing budget
            </li>
          </ol>

          <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 my-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-0 mb-2">
                  Important Note
                </h3>
                <p className="text-stone-700 dark:text-gray-300 mb-0">
                  Not all products we recommend are affiliate partners. We
                  recommend many products from which we earn nothing, simply
                  because they're the best option for specific situations.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-12 mb-4">
            Why This Model Works
          </h2>

          <p className="text-stone-700 dark:text-gray-300">
            The affiliate model allows us to:
          </p>

          <ul className="space-y-2">
            <li>
              Offer our comparison tools <strong>completely free</strong> to
              consumers
            </li>
            <li>
              Invest in thorough,<strong> independent research</strong> and
              analysis
            </li>
            <li>
              Maintain a team of <strong>expert analysts</strong> and
              fact-checkers
            </li>
            <li>
              Keep our platform updated with the{" "}
              <strong>latest product data</strong>
            </li>
            <li>
              Build better tools like{" "}
              <strong>calculators and comparison tables</strong>
            </li>
          </ul>

          <p className="text-stone-700 dark:text-gray-300">
            Without affiliate revenue, we'd need to charge subscription fees or
            display intrusive ads, making our services inaccessible to many
            Indians who need them most.
          </p>

          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-12 mb-4">
            Our Editorial Standards
          </h2>

          <p className="text-stone-700 dark:text-gray-300">
            Every product recommendation goes through:
          </p>

          <ul className="space-y-2">
            <li>
              <strong>Data Analysis:</strong> We collect and compare data from
              hundreds of sources
            </li>
            <li>
              <strong>Expert Review:</strong> Financial analysts with 5-10+
              years experience evaluate each product
            </li>
            <li>
              <strong>Fact-Checking:</strong> Every claim is verified by a
              separate fact-checker
            </li>
            <li>
              <strong>Regular Updates:</strong> We review and update
              recommendations monthly
            </li>
            <li>
              <strong>User Feedback:</strong> We incorporate real user reviews
              and experiences
            </li>
          </ul>

          <p className="text-stone-700 dark:text-gray-300 mt-6">
            <Link
              href="/methodology"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              Read our full methodology â†’
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-12 mb-4">
            Questions?
          </h2>

          <p className="text-stone-700 dark:text-gray-300">
            We're committed to transparency. If you have questions about our
            business model or how we maintain editorial independence, please
            contact us at{" "}
            <a
              href="mailto:contact@investingpro.in"
              className="text-primary-600 dark:text-primary-400 font-semibold"
            >
              contact@investingpro.in
            </a>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-3">
            Ready to Find Your Best Financial Product?
          </h3>
          <p className="text-stone-600 dark:text-gray-600 mb-6">
            {STAT_STRINGS.testimonial}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors"
          >
            Start Comparing
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
