import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | InvestingPro',
  description: 'Terms and conditions governing the use of InvestingPro platform and services.',
  robots: 'index, follow',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-600 dark:text-slate-600 mb-8">
            Last updated: January 23, 2026
          </p>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                By accessing and using InvestingPro ("Platform", "Service", "we", "us", or "our"), you ("User", "you", or "your") 
                accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                These Terms constitute a legally binding agreement between you and InvestingPro. By creating an account or using our services, 
                you represent that you are at least 18 years of age and have the legal capacity to enter into this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                2. Description of Service
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                InvestingPro is an online platform that provides:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Educational content and information about personal finance, investments, and financial products in India</li>
                <li>Comparison tools for financial products including credit cards, mutual funds, loans, and insurance</li>
                <li>Financial calculators and planning tools</li>
                <li>Articles, guides, and research on financial topics</li>
                <li>User account features for saving preferences and tracking information</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 font-semibold mt-4">
                IMPORTANT: InvestingPro is NOT a registered investment advisor, broker-dealer, financial planner, or SEBI-registered entity. 
                We do not provide personalized investment advice, recommendations to buy or sell securities, or portfolio management services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                3. User Accounts and Registration
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                3.1 Account Creation
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                You may create an account to access certain features of the Platform. When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your password</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                3.2 Account Termination
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                We reserve the right to suspend or terminate your account at any time, with or without notice, for violation of these Terms 
                or for any other reason at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                4. Prohibited Uses
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                You agree NOT to use the Platform for any of the following purposes:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Any unlawful purpose or in violation of any applicable laws or regulations</li>
                <li>To transmit any harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable content</li>
                <li>To impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
                <li>To interfere with or disrupt the Platform or servers or networks connected to the Platform</li>
                <li>To attempt to gain unauthorized access to any portion of the Platform or any other systems or networks</li>
                <li>To use any automated means (bots, scrapers, crawlers) to access the Platform without our express written permission</li>
                <li>To copy, reproduce, distribute, or create derivative works from our content without authorization</li>
                <li>To engage in any activity that could damage, disable, overburden, or impair the Platform</li>
                <li>To collect or store personal data about other users without their consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                5. Intellectual Property Rights
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                All content on the Platform, including but not limited to text, graphics, logos, images, software, and data compilations, 
                is the property of InvestingPro or its content suppliers and is protected by Indian and international copyright laws.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for personal, 
                non-commercial purposes. You may not modify, copy, distribute, transmit, display, reproduce, publish, license, 
                create derivative works from, or sell any content obtained from the Platform without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                6. User-Generated Content
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                If you submit, post, or transmit any content to the Platform (comments, reviews, feedback, etc.), you grant us a 
                worldwide, non-exclusive, royalty-free, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, 
                translate, distribute, and display such content in any media.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                You represent and warrant that you own or have the necessary rights to the content you submit and that such content 
                does not violate any third-party rights or applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                7. Third-Party Links and Services
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                The Platform may contain links to third-party websites, products, or services ("Third-Party Services"). These links are 
                provided for your convenience only. We do not endorse, control, or assume responsibility for any Third-Party Services.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                Your interactions with Third-Party Services are solely between you and the third party. We are not liable for any loss 
                or damage arising from your use of Third-Party Services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                8. Affiliate Relationships
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                InvestingPro participates in affiliate marketing programs. We may earn commissions when you click on affiliate links 
                or apply for products through our Platform. These commissions help us maintain and improve our services at no cost to you.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                Our affiliate relationships do not influence our editorial content or product comparisons. We maintain editorial independence 
                and provide honest, unbiased information. For more details, see our{' '}
                <Link href="/affiliate-disclosure" className="text-primary-600 hover:text-primary-700 underline">
                  Affiliate Disclosure
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                9. Disclaimers and Limitations of Liability
              </h2>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                9.1 No Financial Advice
              </h3>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">
                THE PLATFORM AND ALL CONTENT ARE PROVIDED FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. NOTHING ON THIS PLATFORM 
                CONSTITUTES FINANCIAL, INVESTMENT, TAX, OR LEGAL ADVICE. YOU SHOULD CONSULT WITH LICENSED PROFESSIONALS BEFORE MAKING 
                ANY FINANCIAL DECISIONS.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                9.2 No Warranties
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING 
                BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                9.3 Limitation of Liability
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, INVESTINGPRO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, 
                ARISING FROM YOUR USE OF OR INABILITY TO USE THE PLATFORM.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID TO US IN THE PAST TWELVE MONTHS, OR 
                ONE HUNDRED RUPEES (₹100), WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                10. Indemnification
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                You agree to indemnify, defend, and hold harmless InvestingPro, its officers, directors, employees, agents, and affiliates 
                from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising 
                from:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Your use of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your content or submissions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                11. Governing Law and Jurisdiction
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                Any disputes arising out of or relating to these Terms or your use of the Platform shall be subject to the exclusive 
                jurisdiction of the courts located in [Your City], India. You consent to the personal jurisdiction of such courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated 
                Terms on the Platform and updating the "Last updated" date.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                Your continued use of the Platform after such modifications constitutes your acceptance of the updated Terms. If you do 
                not agree to the modified Terms, you must stop using the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                13. Severability
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full 
                force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                14. Entire Agreement
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                These Terms, together with our{' '}
                <Link href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link href="/cookie-policy" className="text-primary-600 hover:text-primary-700 underline">
                  Cookie Policy
                </Link>
                , constitute the entire agreement between you and InvestingPro regarding your use of the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                15. Contact Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mt-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Email:</strong> legal@investingpro.in<br />
                  <strong>Address:</strong> InvestingPro, India
                </p>
              </div>
            </section>

            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mt-8">
              <p className="text-sm text-primary-900 dark:text-primary-200">
                <strong>Acknowledgment:</strong> By using InvestingPro, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
