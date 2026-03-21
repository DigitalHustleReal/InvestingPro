import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | InvestingPro',
  description: 'Learn about how InvestingPro uses cookies to improve your experience and protect your privacy.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Last updated: January 16, 2026
          </p>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              What Are Cookies?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Types of Cookies We Use
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
              1. Essential Cookies (Always Active)
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality such as:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-6 space-y-2">
              <li>Authentication and session management</li>
              <li>Security features (CSRF protection)</li>
              <li>Load balancing</li>
              <li>Cookie consent preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
              2. Analytics Cookies (Optional)
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We use analytics cookies to understand how visitors interact with our website:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-6 space-y-2">
              <li><strong>Google Analytics:</strong> Traffic analysis and user behavior</li>
              <li><strong>Axiom:</strong> Performance monitoring and error tracking</li>
              <li><strong>PostHog:</strong> Product analytics and feature usage</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
              3. Advertising Cookies (Optional)
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              These cookies help us show you relevant content and track conversions:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-6 space-y-2">
              <li>Affiliate tracking cookies</li>
              <li>Conversion tracking</li>
              <li>Personalized content recommendations</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
              4. Functional Cookies (Optional)
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              These cookies enhance your experience:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-6 space-y-2">
              <li>Dark mode preferences</li>
              <li>Language preferences</li>
              <li>Saved comparisons and favorites</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Managing Your Cookie Preferences
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              You have full control over which cookies you accept:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-6 space-y-2">
              <li><strong>Cookie Banner:</strong> Use our cookie consent banner to accept or reject non-essential cookies</li>
              <li><strong>Browser Settings:</strong> Configure your browser to block or delete cookies</li>
              <li><strong>Opt-Out Links:</strong> Use third-party opt-out tools for analytics and advertising cookies</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Some cookies are set by third-party services that appear on our pages. We do not control these cookies. 
              Please refer to the third parties' privacy policies for more information:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-6 space-y-2">
              <li><a href="https://policies.google.com/privacy" className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">Google Analytics Privacy Policy</a></li>
              <li><a href="https://posthog.com/privacy" className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">PostHog Privacy Policy</a></li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Cookie Retention
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Different cookies have different lifespans:
            </p>
            <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-6 space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain for a set period (up to 1 year)</li>
              <li><strong>Consent Cookie:</strong> Stored for 365 days</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Updates to This Policy
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page 
              and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Contact Us
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <ul className="list-none text-slate-700 dark:text-slate-300 mb-6 space-y-2">
              <li><strong>Email:</strong> privacy@investingpro.in</li>
              <li><strong>Address:</strong> InvestingPro, India</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
