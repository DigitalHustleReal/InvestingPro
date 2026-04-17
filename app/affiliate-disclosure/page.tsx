import { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, DollarSign, Shield, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Learn how InvestingPro earns commissions through affiliate partnerships and our commitment to editorial independence.",
  robots: "index, follow",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Affiliate Disclosure
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Transparency about how we earn revenue
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-8">
            {/* Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="text-base font-semibold text-blue-900 dark:text-blue-200 mb-2">
                📢 Quick Summary
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                InvestingPro earns commissions when you apply for financial
                products through our affiliate links. This helps us keep the
                platform free. Our recommendations remain unbiased and based on
                thorough research.
              </p>
            </div>

            {/* Section 1: What is Affiliate Marketing */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  1. What is Affiliate Marketing?
                </h2>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  Affiliate marketing is a performance-based marketing model
                  where we earn a commission when you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Click on an "Apply Now" or affiliate link on our platform
                  </li>
                  <li>
                    Complete an application for a financial product (credit
                    card, loan, insurance, etc.)
                  </li>
                  <li>Get approved and activate the product</li>
                  <li>
                    Make a purchase or investment through our partner links
                  </li>
                </ul>
                <p>
                  These commissions help us maintain and improve InvestingPro at
                  no cost to you.
                </p>
              </div>
            </section>

            {/* Section 2: How We Earn */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  2. How We Earn Commissions
                </h2>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  We participate in affiliate programs with various financial
                  institutions and service providers:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                  Credit Cards
                </h3>
                <p>
                  When you apply for a credit card through our affiliate links
                  and get approved, we earn a commission from the card issuer.
                  Commission rates vary by card and issuer.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                  Loans (Personal, Home, Auto)
                </h3>
                <p>
                  We earn commissions when you apply for and are approved for
                  loans through our partner banks and NBFCs. The commission is
                  typically a percentage of the loan amount.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                  Mutual Funds & Investments
                </h3>
                <p>
                  Some mutual fund platforms and investment services pay us a
                  commission when you open an account or make investments
                  through our referral links.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                  Insurance Products
                </h3>
                <p>
                  Insurance companies pay us commissions when you purchase
                  policies (life, health, motor, etc.) through our affiliate
                  links.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                  Banking Products
                </h3>
                <p>
                  We earn commissions when you open savings accounts, fixed
                  deposits, or other banking products through our partner banks.
                </p>
              </div>
            </section>

            {/* Section 3: No Additional Cost */}
            <section>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-4">
                  3. You Don't Pay Extra
                </h2>
                <p className="text-green-800 dark:text-green-300">
                  <strong>Important:</strong> Affiliate commissions do NOT
                  increase the cost to you. You pay the same price, interest
                  rate, or fees whether you use our affiliate link or go
                  directly to the provider's website.
                </p>
                <p className="text-green-800 dark:text-green-300 mt-3">
                  The commission is paid by the financial institution from their
                  marketing budget, not from your pocket.
                </p>
              </div>
            </section>

            {/* Section 4: Editorial Independence */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  4. Our Commitment to Editorial Independence
                </h2>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>We maintain strict editorial independence.</strong>{" "}
                  Our affiliate relationships do NOT influence:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Product Rankings:</strong> Products are ranked based
                    on objective criteria (features, fees, benefits)
                  </li>
                  <li>
                    <strong>Recommendations:</strong> We recommend products
                    based on merit, not commission rates
                  </li>
                  <li>
                    <strong>Reviews:</strong> Our reviews are honest and
                    unbiased
                  </li>
                  <li>
                    <strong>Comparisons:</strong> Comparison tables show all
                    relevant products, not just those with high commissions
                  </li>
                  <li>
                    <strong>Editorial Content:</strong> Articles and guides are
                    written to educate, not to promote specific products
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>Our Promise:</strong> We only recommend products we
                  believe provide genuine value to our users. If a product
                  doesn't meet our quality standards, we won't promote it,
                  regardless of commission rates.
                </p>
              </div>
            </section>

            {/* Section 5: How We Choose Partners */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. How We Choose Affiliate Partners
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  We partner with financial institutions and service providers
                  based on:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Reputation:</strong> Established, trustworthy
                    companies with good customer reviews
                  </li>
                  <li>
                    <strong>Product Quality:</strong> Competitive features,
                    fees, and benefits
                  </li>
                  <li>
                    <strong>Customer Service:</strong> Responsive support and
                    fair practices
                  </li>
                  <li>
                    <strong>Regulatory Compliance:</strong> Proper licensing and
                    regulatory approvals (RBI, SEBI, IRDAI)
                  </li>
                  <li>
                    <strong>User Experience:</strong> Easy application process
                    and transparent terms
                  </li>
                </ul>
                <p className="mt-4">
                  We regularly review our affiliate partnerships and remove
                  partners that don't meet our standards.
                </p>
              </div>
            </section>

            {/* Section 6: Disclosure Practices */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                  6. How We Disclose Affiliate Links
                </h2>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  We clearly disclose affiliate relationships in the following
                  ways:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Affiliate Badges:</strong> "Affiliate Link" badges
                    next to partner links
                  </li>
                  <li>
                    <strong>Page Disclaimers:</strong> Disclosure notices on
                    product comparison pages
                  </li>
                  <li>
                    <strong>This Page:</strong> Comprehensive disclosure on this
                    dedicated page
                  </li>
                  <li>
                    <strong>Footer Links:</strong> Link to this disclosure in
                    our website footer
                  </li>
                </ul>
                <p className="mt-4">
                  We comply with FTC (Federal Trade Commission) guidelines and
                  Indian advertising standards (ASCI) for affiliate disclosure.
                </p>
              </div>
            </section>

            {/* Section 7: Non-Affiliate Content */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Non-Affiliate Content
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  Not all content on InvestingPro is monetized through affiliate
                  links:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Educational Articles:</strong> Guides, tutorials,
                    and financial literacy content
                  </li>
                  <li>
                    <strong>Calculators:</strong> Free financial calculators
                    (SIP, EMI, Tax, etc.)
                  </li>
                  <li>
                    <strong>Research:</strong> Market analysis and financial
                    news
                  </li>
                  <li>
                    <strong>Glossary:</strong> Financial terms and definitions
                  </li>
                </ul>
                <p className="mt-4">
                  This content is provided free of charge to help you make
                  informed financial decisions.
                </p>
              </div>
            </section>

            {/* Section 8: Your Trust Matters */}
            <section className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-200 mb-4">
                8. Your Trust is Our Priority
              </h2>
              <p className="text-primary-800 dark:text-primary-300 mb-3">
                We understand that trust is earned, not given. That's why we:
              </p>
              <ul className="list-disc pl-6 text-primary-800 dark:text-primary-300 space-y-2">
                <li>✅ Provide transparent, honest information</li>
                <li>✅ Clearly disclose all affiliate relationships</li>
                <li>✅ Maintain editorial independence</li>
                <li>✅ Prioritize user value over commission rates</li>
                <li>✅ Regularly update product information</li>
                <li>✅ Respond to user feedback and concerns</li>
              </ul>
              <p className="text-primary-800 dark:text-primary-300 mt-4">
                <strong>Our Mission:</strong> To help you make informed
                financial decisions, not to maximize commissions.
              </p>
            </section>

            {/* Section 9: Questions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Questions or Concerns?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions about our affiliate relationships or
                how we earn revenue, please contact us:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> contact@investingpro.in
                  <br />
                  <strong>Partnerships:</strong> partnerships@investingpro.in
                  <br />
                  <strong>Address:</strong> InvestingPro, India
                </p>
              </div>
            </section>

            {/* Related Documents */}
            <section className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Related Legal Documents
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/terms-of-service"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Terms of Service
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Platform usage terms
                    </p>
                  </div>
                </Link>

                <Link
                  href="/privacy-policy"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Privacy Policy
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Data protection
                    </p>
                  </div>
                </Link>

                <Link
                  href="/disclaimer"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Disclaimer
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Risk disclosures
                    </p>
                  </div>
                </Link>

                <Link
                  href="/cookie-policy"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Cookie Policy
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Cookie usage
                    </p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Final Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Thank You:</strong> By using InvestingPro, you help us
                continue providing free, high-quality financial information and
                tools. We appreciate your trust and support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
