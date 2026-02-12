import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | InvestingPro',
  description: 'How InvestingPro collects, uses, protects, and manages your personal information in compliance with Indian data protection laws and GDPR.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-600 mb-8">
            Last updated: January 16, 2026
          </p>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section>
              <p className="text-slate-700 dark:text-slate-300">
                InvestingPro ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your personal information when you use our platform and services.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                By using InvestingPro, you consent to the data practices described in this Privacy Policy. If you do not agree with our 
                policies and practices, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                1. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                1.1 Personal Information You Provide
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                We collect information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
                <li><strong>Profile Information:</strong> Age, location, financial goals (optional)</li>
                <li><strong>Communication Data:</strong> Messages, feedback, support requests</li>
                <li><strong>Preferences:</strong> Saved products, comparisons, watchlists</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                1.2 Automatically Collected Information
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                When you access our Platform, we automatically collect certain information:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns, search queries</li>
                <li><strong>Location Data:</strong> Approximate geographic location based on IP address</li>
                <li><strong>Referral Information:</strong> Source that referred you to our Platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                1.3 Cookies and Tracking Technologies
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities. 
                For detailed information about our use of cookies, please see our{' '}
                <Link href="/cookie-policy" className="text-primary-600 hover:text-primary-700 underline">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Service Provision:</strong> To provide, maintain, and improve our Platform and services</li>
                <li><strong>Personalization:</strong> To customize content and recommendations based on your preferences</li>
                <li><strong>Communication:</strong> To send you updates, newsletters, and promotional materials (with your consent)</li>
                <li><strong>Analytics:</strong> To analyze usage patterns and improve user experience</li>
                <li><strong>Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
                <li><strong>Research:</strong> To conduct research and development to improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                3. Legal Basis for Processing (GDPR)
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Consent:</strong> You have given explicit consent for specific processing activities</li>
                <li><strong>Contract:</strong> Processing is necessary to fulfill our contract with you (Terms of Service)</li>
                <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests (analytics, security)</li>
                <li><strong>Legal Obligation:</strong> Processing is required to comply with legal requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                4. How We Share Your Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                4.1 Service Providers
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                We share information with third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Supabase:</strong> Database hosting and authentication</li>
                <li><strong>Vercel:</strong> Website hosting and content delivery</li>
                <li><strong>Google Analytics:</strong> Website analytics and user behavior tracking</li>
                <li><strong>Axiom:</strong> Application monitoring and error tracking</li>
                <li><strong>PostHog:</strong> Product analytics and feature usage</li>
                <li><strong>Resend:</strong> Email delivery services</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                4.2 Affiliate Partners
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                When you click on affiliate links or apply for products, we may share limited information (click data, referral source) 
                with our affiliate partners to track conversions and earn commissions.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                4.3 Legal Requirements
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, 
                property, or safety.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                4.4 Business Transfers
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                5. Data Security
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Encryption:</strong> Data is encrypted in transit (HTTPS/TLS) and at rest (database encryption)</li>
                <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
                <li><strong>Security Monitoring:</strong> Continuous monitoring for security threats and vulnerabilities</li>
                <li><strong>Regular Audits:</strong> Periodic security audits and penetration testing</li>
                <li><strong>Secure Infrastructure:</strong> Hosting on secure, compliant cloud infrastructure</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect 
                your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                6. Your Privacy Rights
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                You have the following rights regarding your personal information:
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                6.1 Access and Portability
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                You have the right to request a copy of your personal data in a structured, machine-readable format.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                6.2 Rectification
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                You have the right to correct inaccurate or incomplete personal information.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                6.3 Erasure (Right to be Forgotten)
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                You have the right to request deletion of your personal data, subject to certain legal exceptions.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                6.4 Restriction of Processing
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                You have the right to request that we limit the processing of your personal information.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                6.5 Object to Processing
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                You have the right to object to processing of your personal data for direct marketing or based on legitimate interests.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                6.6 Withdraw Consent
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Where processing is based on consent, you have the right to withdraw consent at any time.
              </p>

              <p className="text-slate-700 dark:text-slate-300 mt-4">
                To exercise any of these rights, please contact us at privacy@investingpro.in. We will respond to your request within 
                30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                7. Data Retention
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law.
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after deletion</li>
                <li><strong>Usage Data:</strong> Retained for 24 months for analytics purposes</li>
                <li><strong>Communication Data:</strong> Retained for 12 months</li>
                <li><strong>Legal Records:</strong> Retained as required by applicable laws (typically 7 years)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from 
                children. If you are a parent or guardian and believe your child has provided us with personal information, please contact 
                us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                Your information may be transferred to and processed in countries outside of India, including the United States and European Union. 
                These countries may have different data protection laws than India.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                When we transfer your data internationally, we ensure appropriate safeguards are in place, such as:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>Adequacy decisions by relevant data protection authorities</li>
                <li>Privacy Shield certification (where applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                10. Third-Party Links
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                Our Platform may contain links to third-party websites and services. We are not responsible for the privacy practices of 
                these third parties. We encourage you to read their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will 
                notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Posting the updated Privacy Policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending you an email notification (for significant changes)</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mt-4">
                Your continued use of the Platform after such modifications constitutes your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                12. Contact Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mt-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Email:</strong> privacy@investingpro.in<br />
                  <strong>Data Protection Officer:</strong> dpo@investingpro.in<br />
                  <strong>Address:</strong> InvestingPro, India
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
                13. Complaints
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                If you believe we have not handled your personal information properly, you have the right to lodge a complaint with:
              </p>
              <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
                <li>Our Data Protection Officer (dpo@investingpro.in)</li>
                <li>The relevant data protection authority in your jurisdiction</li>
                <li>For EU residents: Your local supervisory authority</li>
              </ul>
            </section>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Your Privacy Matters:</strong> We are committed to protecting your personal information and respecting your privacy 
                rights. If you have any questions or concerns, please don't hesitate to contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
