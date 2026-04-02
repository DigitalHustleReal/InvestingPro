import { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Disclaimer - InvestingPro',
  description: 'Important disclaimers and risk disclosures for InvestingPro users',
}

export default function DisclaimerPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-10 h-10 text-danger-600" />
          <h1 className="text-4xl font-bold text-gray-900">Disclaimer</h1>
        </div>
        <p className="text-sm text-gray-600 mb-8">Last Updated: April 2, 2026</p>

        <div className="prose prose-slate max-w-none">
          {/* Critical Notice */}
          <div className="bg-danger-50 border-2 border-danger-300 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-danger-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              IMPORTANT NOTICE
            </h2>
            <p className="text-danger-800 font-semibold mb-4">
              InvestingPro is an information and comparison platform ONLY. We do NOT provide investment advice, financial advisory services, or act as brokers/distributors.
            </p>
            <p className="text-danger-800">
              All financial decisions are made at YOUR OWN RISK. Please consult a SEBI-registered investment advisor before making any financial decisions.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              InvestingPro provides financial product comparison and educational content for informational purposes only. We do not offer personalized financial advice, tax planning, investment recommendations, or portfolio management services.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>We are not:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>SEBI-registered investment advisors (RIA)</li>
              <li>Mutual fund distributors</li>
              <li>Insurance brokers (IRDAI-registered)</li>
              <li>Financial planners or wealth managers</li>
              <li>Credit counselors or debt advisors</li>
            </ul>
          </section>

          <section className="mb-8 bg-accent-50 border border-accent-300 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-accent-900 mb-4">2. Investment Risk Disclaimer (Mutual Funds & Securities)</h2>
            <p className="text-accent-800 font-semibold mb-4">
              STANDARD SEBI DISCLAIMER:
            </p>
            <p className="text-accent-800 mb-4">
              <strong>Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully before investing.</strong>
            </p>
            <ul className="list-disc list-inside text-accent-800 space-y-2 mb-4">
              <li>Past performance is not indicative of future results</li>
              <li>NAV (Net Asset Value) may go up or down</li>
              <li>There is no guarantee of returns or capital protection</li>
              <li>Investment in securities market involves risk of capital loss</li>
              <li>Equity investments carry higher risk but potential for higher returns</li>
              <li>Debt fund returns are subject to interest rate fluctuations</li>
            </ul>
            <p className="text-accent-800">
              <strong>Before Investing:</strong> Consult a SEBI-registered investment advisor (RIA) to assess your risk profile, financial goals, and suitability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Credit Product Disclaimer (Loans & Credit Cards)</h2>
            <p className="text-gray-700 mb-4">
              Credit approval is subject to lender criteria and underwriting policies. Interest rates, fees, and terms shown on InvestingPro are indicative and may vary based on:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Credit score (CIBIL, Experian, Equifax, CRIF)</li>
              <li>Income level and employment status</li>
              <li>Debt-to-income ratio</li>
              <li>Lender's internal risk assessment</li>
              <li>Market conditions and RBI policy changes</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Important:</strong> Borrowing involves legal obligations. Failure to repay may result in penalty charges, credit score damage, and legal action.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>RBI Guidelines:</strong> Borrow responsibly. Do not over-leverage. Ensure EMI payments fit within your budget.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Insurance Product Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              Insurance information is for comparison purposes only. Policy terms, coverage, exclusions, and premiums may vary by insurer.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Read the policy document carefully before purchasing</li>
              <li>Understand exclusions, waiting periods, and claim procedures</li>
              <li>Declare pre-existing conditions honestly to avoid claim rejection</li>
              <li>Premium rates depend on age, health status, and coverage selected</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>IRDAI Disclaimer:</strong> Insurance is the subject matter of solicitation. For product details, benefits, and exclusions, refer to the policy document.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Calculator Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              Our financial calculators (SIP, EMI, Tax, FD, etc.) provide ESTIMATES based on inputs you provide. Actual results may vary due to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Market fluctuations and volatility</li>
              <li>Changes in interest rates, tax laws, or regulations</li>
              <li>Entry/exit loads, expense ratios, and processing fees</li>
              <li>Rounding errors and compounding frequency differences</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Calculator results should NOT be solely relied upon for financial decisions. Consult a financial advisor for accurate projections.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Product Information Accuracy</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate and up-to-date product information, but:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Interest rates, fees, and features change frequently</li>
              <li>Information shown may not reflect the latest updates</li>
              <li>Product availability varies by location and customer profile</li>
              <li>Promotional offers and discounts are time-limited</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Always verify details with the financial institution before applying.</strong> InvestingPro is not responsible for outdated or inaccurate information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Affiliate Commission Disclosure</h2>
            <p className="text-gray-700 mb-4">
              InvestingPro earns commission from financial institutions when you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Click on "Apply Now" buttons and complete applications</li>
              <li>Are approved for credit cards, loans, or other products</li>
              <li>Open investment accounts or purchase financial products</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Editorial Independence:</strong> Affiliate relationships do NOT influence our ratings, rankings, or editorial content. Our reviews are based on objective criteria such as features, fees, customer reviews, and product quality.
            </p>
            <p className="text-gray-700 mb-4">
              For full transparency, see: <a href="/how-we-make-money" className="text-primary-600 hover:text-primary-700 underline">How We Make Money</a>
            </p>
          </section>

          <section className="mb-8 bg-gray-50 border border-gray-300 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. No Liability for Financial Losses</h2>
            <p className="text-gray-700 mb-4">
              InvestingPro and its affiliates SHALL NOT be held liable for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Financial losses arising from investment decisions</li>
              <li>Rejected loan/credit card applications</li>
              <li>Inaccurate product information or outdated data</li>
              <li>Calculator errors or estimation differences</li>
              <li>Third-party actions (banks, AMCs, insurers, etc.)</li>
              <li>Market fluctuations or economic downturns</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>User Responsibility:</strong> You acknowledge that all financial decisions are made at your own risk and discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links and Services</h2>
            <p className="text-gray-700 mb-4">
              When you click "Apply Now" or external links, you are redirected to third-party websites (banks, NBFCs, AMCs, insurance companies):
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>We do not control third-party websites or their practices</li>
              <li>Your interactions are governed by THEIR terms and privacy policies</li>
              <li>We are not responsible for application rejections or approval delays</li>
              <li>Disputes with providers must be resolved directly with them</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Tax Implications</h2>
            <p className="text-gray-700 mb-4">
              Tax calculators and information are for reference only. Tax laws in India are complex and subject to change:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Income tax rates and deductions vary by income slab</li>
              <li>Capital gains tax depends on holding period and asset class</li>
              <li>TDS (Tax Deducted at Source) applies to certain investments</li>
              <li>Exemptions under Section 80C, 80D, 10(10D), etc. have limits and conditions</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Consult a certified tax professional or CA (Chartered Accountant)</strong> for personalized tax advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Regulatory Compliance</h2>
            <p className="text-gray-700 mb-4">
              InvestingPro complies with applicable Indian laws, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Digital Personal Data Protection Act (DPDP), 2023</li>
              <li>Information Technology Act, 2000</li>
              <li>Consumer Protection Act, 2019</li>
              <li>Advertising Standards Council of India (ASCI) guidelines</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We are NOT regulated by:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>SEBI (Securities and Exchange Board of India)</li>
              <li>IRDAI (Insurance Regulatory and Development Authority of India)</li>
              <li>RBI (Reserve Bank of India)</li>
              <li>AMFI (Association of Mutual Funds in India)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. User Reviews and Ratings</h2>
            <p className="text-gray-700 mb-4">
              User-submitted reviews reflect individual opinions and experiences:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Reviews are NOT verified financial advice</li>
              <li>Ratings are subjective and may not reflect your experience</li>
              <li>We moderate reviews for spam but cannot guarantee accuracy</li>
              <li>Product providers may have different policies or offerings now</li>
            </ul>
          </section>

          <section className="mb-8 bg-primary-50 border border-primary-300 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">13. How to Use InvestingPro Safely</h2>
            <p className="text-primary-800 mb-4">
              <strong>Best Practices:</strong>
            </p>
            <ul className="list-disc list-inside text-primary-800 space-y-2 mb-4">
              <li>âœ… Use InvestingPro for comparison and research</li>
              <li>âœ… Verify product details with the provider before applying</li>
              <li>âœ… Consult a SEBI-registered advisor for investment decisions</li>
              <li>âœ… Read all scheme documents and terms & conditions</li>
              <li>âœ… Assess your risk tolerance and financial goals</li>
              <li>âœ… Diversify investments to reduce risk</li>
              <li>âœ… Borrow only what you can afford to repay</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact for Queries</h2>
            <p className="text-gray-700 mb-4">
              If you have questions or concerns about this disclaimer or our services:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">Email: <a href="mailto:support@investingpro.in" className="text-primary-600 hover:text-primary-700 underline">support@investingpro.in</a></p>
              <p className="text-gray-700 mb-2">Legal: <a href="mailto:legal@investingpro.in" className="text-primary-600 hover:text-primary-700 underline">legal@investingpro.in</a></p>
              <p className="text-gray-700">Address: Bangalore, Karnataka, India</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t-2 border-danger-300 bg-danger-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-danger-900 mb-4">FINAL REMINDER</h3>
            <p className="text-danger-800 font-semibold">
              InvestingPro is an information platform. We do NOT sell financial products, provide financial advice, or act as intermediaries. All transactions are between you and the financial product providers.
            </p>
            <p className="text-danger-800 mt-4">
              <strong>INVEST WISELY. BORROW RESPONSIBLY. INSURE ADEQUATELY.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
