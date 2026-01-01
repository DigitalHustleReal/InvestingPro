import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - InvestingPro',
  description: 'Terms and conditions for using InvestingPro services',
}

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: December 31, 2025</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using InvestingPro ("the Service," "we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
            </p>
            <p className="text-gray-700 mb-4">
              These Terms constitute a legally binding agreement between you and InvestingPro. We reserve the right to modify these Terms at any time. Your continued use of the Service after changes indicates acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              InvestingPro is a financial comparison platform that provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Comparison tools for credit cards, loans, mutual funds, insurance, and other financial products</li>
              <li>Financial calculators (SIP, EMI, Tax, FD, etc.)</li>
              <li>Educational content and guides on personal finance</li>
              <li>Product ratings and reviews</li>
              <li>Affiliate links to financial product providers</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Our Service is informational and does not constitute financial advice. We are a comparison platform, not a financial advisor or broker.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Eligibility</h2>
            <p className="text-gray-700 mb-4">
              You must be at least 18 years old to use InvestingPro. By using the Service, you represent that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>You are of legal age to form a binding contract in India</li>
              <li>You are not prohibited from accessing the Service under Indian law</li>
              <li>All information you provide is accurate and truthful</li>
              <li>You will comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Account Creation</h3>
            <p className="text-gray-700 mb-4">
              You may create an account to access certain features. When creating an account:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>You are responsible for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Account Termination</h3>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate your account if you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Abuse the Service or harass other users</li>
              <li>Provide false or misleading information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Uses</h2>
            <p className="text-gray-700 mb-2">You agree NOT to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Use the Service for any illegal purposes</li>
              <li>Scrape, copy, or redistribute our content without permission</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Upload malicious code, viruses, or harmful software</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Spam, phish, or engage in fraudulent activities</li>
              <li>Manipulate calculator results or product ratings</li>
              <li>Interfere with other users' access to the Service</li>
            </ul>
          </section>

          <section className="mb-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">6. Financial Disclaimer</h2>
            <p className="text-yellow-800 mb-4">
              <strong>IMPORTANT:</strong> InvestingPro provides information for comparison purposes only. We do NOT provide financial advice.
            </p>
            <ul className="list-disc list-inside text-yellow-800 space-y-2 mb-4">
              <li>All investment decisions are made at your own risk</li>
              <li>Past performance does not guarantee future results</li>
              <li>We are not responsible for losses incurred from using our information</li>
              <li>Consult a certified financial planner before making investment decisions</li>
              <li>Product information may not be up-to-date; verify with providers</li>
            </ul>
            <p className="text-yellow-800">
              <strong>Investment & Credit Risk:</strong> Financial products are subject to market risks. Read all scheme-related documents carefully before investing. Credit approval is subject to lender criteria.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Affiliate Relationships & Compensation</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.1 Affiliate Disclosure</h3>
            <p className="text-gray-700 mb-4">
              InvestingPro earns commission when you click on "Apply Now" buttons or complete actions through our affiliate links. This is how we keep our service free for users.
            </p>
            <p className="text-gray-700 mb-4">
              However, affiliate compensation does NOT influence our ratings or recommendations. Our editorial team independently evaluates products based on features, benefits, and user reviews.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.2 How We Make Money</h3>
            <p className="text-gray-700 mb-4">
              For full transparency, see our <Link href="/how-we-make-money" className="text-emerald-600 hover:text-emerald-700 underline">How We Make Money</Link> page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">8.1 Our Content</h3>
            <p className="text-gray-700 mb-4">
              All content on InvestingPro (text, images, calculators, designs, logos) is owned by InvestingPro and protected by copyright, trademark, and intellectual property laws.
            </p>
            <p className="text-gray-700 mb-4">
              You may NOT:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Copy or scrape our content without permission</li>
              <li>Reproduce our calculators or comparison tools</li>
              <li>Use our brand name or logo without authorization</li>
              <li>Create derivative works based on our content</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">8.2 User-Generated Content</h3>
            <p className="text-gray-700 mb-4">
              If you submit reviews, comments, or other content:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>You retain ownership of your content</li>
              <li>You grant us a worldwide, non-exclusive license to use, display, and distribute your content</li>
              <li>Your content must not infringe on others' rights or violate laws</li>
              <li>We reserve the right to remove inappropriate content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Accuracy and Updates</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate and up-to-date information, but:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Product details (interest rates, fees, features) may change without notice</li>
              <li>We are not responsible for outdated information</li>
              <li>Always verify product details with the provider before applying</li>
              <li>Calculator results are estimates and may vary from actual outcomes</li>
            </ul>
            <p className="text-gray-700 mb-4">
              If you find inaccurate information, please report it to: <a href="mailto:feedback@investingpro.in" className="text-emerald-600 hover:text-emerald-700 underline">feedback@investingpro.in</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links and Services</h2>
            <p className="text-gray-700 mb-4">
              Our Service may contain links to third-party websites (banks, financial institutions, product providers):
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>We do not control or endorse third-party websites</li>
              <li>We are not responsible for their content, privacy policies, or practices</li>
              <li>Your interactions with third parties are governed by their terms</li>
              <li>Review their terms and privacy policies before providing information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>InvestingPro and its affiliates shall NOT be liable for any indirect, incidental, consequential, or punitive damages</li>
              <li>We are not liable for losses resulting from your use of the Service</li>
              <li>We are not liable for inaccurate information or outdated product details</li>
              <li>We are not liable for actions taken by third-party providers</li>
              <li>Our total liability to you shall not exceed ₹1,000 or the amount you paid us (if any), whichever is greater</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold harmless InvestingPro, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Your violation of these Terms</li>
              <li>Your use of the Service</li>
              <li>Your violation of any law or third-party rights</li>
              <li>Content you submit to the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Non-infringement of intellectual property</li>
              <li>Accuracy, completeness, or reliability of content</li>
              <li>Availability or uninterrupted access to the Service</li>
              <li>Security or freedom from errors, viruses, or harmful components</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.1 Governing Law</h3>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">14.2 Arbitration</h3>
            <p className="text-gray-700 mb-4">
              Before filing a lawsuit, you agree to attempt resolution through:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Good faith negotiation with our team</li>
              <li>Mediation (if negotiation fails)</li>
              <li>Arbitration under the Arbitration and Conciliation Act, 1996 (if mediation fails)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Modifications to Service</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Modify, suspend, or discontinue any part of the Service</li>
              <li>Change features, functionality, or pricing</li>
              <li>Impose limits on usage or storage</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We are not liable for any modifications or discontinuation of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Privacy</h2>
            <p className="text-gray-700 mb-4">
              Your use of the Service is also governed by our <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</Link>. By using InvestingPro, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Severability</h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>InvestingPro</strong></p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:legal@investingpro.in" className="text-emerald-600 hover:text-emerald-700 underline">legal@investingpro.in</a></p>
              <p className="text-gray-700 mb-2">Support: <a href="mailto:support@investingpro.in" className="text-emerald-600 hover:text-emerald-700 underline">support@investingpro.in</a></p>
              <p className="text-gray-700 mb-2">Address: Bangalore, Karnataka, India</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Entire Agreement:</strong> These Terms, along with our Privacy Policy, constitute the entire agreement between you and InvestingPro regarding the use of our Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
