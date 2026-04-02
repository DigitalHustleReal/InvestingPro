import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - InvestingPro',
  description: 'Privacy policy for InvestingPro - How we collect, use, and protect your data',
}

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-slate-600 mb-8">Last Updated: April 2, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 mb-4">
              Welcome to InvestingPro ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website investingpro.in and use our services.
            </p>
            <p className="text-slate-700 mb-4">
              By using InvestingPro, you consent to the data practices described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">2.1 Personal Information</h3>
            <p className="text-slate-700 mb-2">We may collect the following personal information that you voluntarily provide to us:</p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Financial preferences and interests</li>
              <li>Demographic information (age, location)</li>
              <li>Newsletter subscription preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="text-slate-700 mb-2">When you visit our website, we automatically collect certain information:</p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages visited, time spent on pages</li>
              <li>Referral source and exit pages</li>
              <li>Click-through data and usage patterns</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">2.3 Cookies and Tracking Technologies</h3>
            <p className="text-slate-700 mb-4">
              We use cookies, web beacons, and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user behavior. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-700 mb-2">We use your information for the following purposes:</p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li><strong>Provide Services:</strong> To deliver financial comparison tools, calculators, and product recommendations</li>
              <li><strong>Personalization:</strong> To tailor content and recommendations based on your preferences</li>
              <li><strong>Communication:</strong> To send newsletters, updates, and promotional materials (with your consent)</li>
              <li><strong>Analytics:</strong> To understand usage patterns and improve our services</li>
              <li><strong>Security:</strong> To protect against fraud, unauthorized access, and malicious activity</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations in India</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">4.1 Third-Party Service Providers</h3>
            <p className="text-slate-700 mb-4">
              We may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or servicing you. These providers include:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li>Analytics providers (Google Analytics)</li>
              <li>Email service providers (SendGrid, ConvertKit)</li>
              <li>Hosting services (Vercel, Supabase)</li>
              <li>Payment processors (Razorpay, for premium services)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">4.2 Affiliate Partners</h3>
            <p className="text-slate-700 mb-4">
              When you click on "Apply Now" buttons or external links, we may share limited information with our financial product partners. We earn commission on successful referrals. For details, see our <a href="/how-we-make-money" className="text-primary-600 hover:text-primary-700 underline">How We Make Money</a> page.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">4.3 Legal Requirements</h3>
            <p className="text-slate-700 mb-4">
              We may disclose your information if required by law, court order, or government authority, or to protect our rights, property, or safety.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
            <p className="text-slate-700 mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure database storage with encryption at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection best practices</li>
            </ul>
            <p className="text-slate-700 mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights (Under Indian Law)</h2>
            <p className="text-slate-700 mb-4">
              Under the Digital Personal Data Protection Act, 2023 (DPDP Act), you have the following rights:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li><strong>Access:</strong> Request access to your personal data we hold</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
              <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Grievance Redressal:</strong> File a complaint with our Data Protection Officer</li>
            </ul>
            <p className="text-slate-700 mb-4">
              To exercise your rights, contact us at: <a href="mailto:privacy@investingpro.in" className="text-primary-600 hover:text-primary-700 underline">privacy@investingpro.in</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Children's Privacy</h2>
            <p className="text-slate-700 mb-4">
              InvestingPro is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies Policy</h2>
            <p className="text-slate-700 mb-4">
              We use the following types of cookies:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics Cookies:</strong> To understand user behavior and improve our services</li>
              <li><strong>Marketing Cookies:</strong> To deliver targeted advertising</li>
              <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
            </ul>
            <p className="text-slate-700 mb-4">
              You can manage cookie preferences via our Cookie Consent banner or your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Data Retention</h2>
            <p className="text-slate-700 mb-4">
              We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. After the retention period, we securely delete or anonymize your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. International Data Transfers</h2>
            <p className="text-slate-700 mb-4">
              Your data may be transferred to and processed in countries outside India where our service providers are located (e.g., United States for cloud hosting). We ensure adequate safeguards are in place through:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Data Processing Agreements with vendors</li>
              <li>Compliance with Indian data protection laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-slate-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
              <li>Posting the updated policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending an email notification (for material changes)</li>
            </ul>
            <p className="text-slate-700 mb-4">
              Your continued use of InvestingPro after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-slate-50 p-6 rounded-lg">
              <p className="text-slate-700 mb-2"><strong>Data Protection Officer</strong></p>
              <p className="text-slate-700 mb-2">Email: <a href="mailto:privacy@investingpro.in" className="text-primary-600 hover:text-primary-700 underline">privacy@investingpro.in</a></p>
              <p className="text-slate-700 mb-2">Address: InvestingPro, Bangalore, Karnataka, India</p>
              <p className="text-slate-700 mb-2">Response Time: Within 30 days of receiving your request</p>
            </div>
          </section>

            <section className="mb-8 bg-accent-50 p-6 rounded-lg border border-accent-200">
            <h2 className="text-2xl font-bold text-accent-900 mb-4">13. Grievance Redressal</h2>
            <p className="text-accent-800 mb-4">
              As per the Digital Personal Data Protection Act, 2023, you have the right to file a grievance regarding data privacy. Our Grievance Officer will respond to your complaint within the statutory timeline of 30 days.
            </p>
            <div className="bg-white rounded-lg p-4 border border-accent-200 space-y-1">
              <p className="text-accent-900 font-semibold">Grievance Officer: Shivam Patel</p>
              <p className="text-accent-800">
                <strong>Email:</strong>{' '}
                <a href="mailto:grievance@investingpro.in" className="text-primary-600 hover:text-primary-700 underline">
                  grievance@investingpro.in
                </a>
              </p>
              <p className="text-accent-800"><strong>Address:</strong> InvestingPro, Bangalore, Karnataka, India — 560001</p>
              <p className="text-accent-800"><strong>Response Time:</strong> Within 30 days of receiving your complaint</p>
            </div>
          </section>


          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              This Privacy Policy is governed by the laws of India. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
