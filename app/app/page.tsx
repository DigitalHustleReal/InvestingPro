import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "InvestingPro App — Coming Soon",
  description:
    "InvestingPro mobile app for iOS and Android. Compare financial products, use calculators, and track your portfolio on the go.",
};

export default function AppPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📱</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          InvestingPro App
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Compare credit cards, mutual funds, and loans. Use 25+ calculators.
          Track your portfolio — all from your phone.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <p className="text-green-800 font-semibold mb-1">Coming Soon</p>
          <p className="text-green-700 text-sm">
            Our mobile app is in development. Meanwhile, use our PWA — tap
            &quot;Add to Home Screen&quot; in your browser for an app-like
            experience.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Explore InvestingPro →
        </Link>
      </div>
    </main>
  );
}
