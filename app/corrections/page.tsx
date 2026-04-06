import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Clock,
  Mail,
  CheckCircle2,
  FileWarning,
  Eye,
  MessageSquare,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Corrections Policy — How We Handle Errors | InvestingPro",
  description:
    "Our commitment to accuracy. Learn how errors are reported, investigated, and corrected on InvestingPro. All corrections are transparent with full audit trails.",
  openGraph: {
    title: "Corrections Policy | InvestingPro India",
    description:
      "How we handle errors, corrections, and transparency on InvestingPro.",
    url: "https://investingpro.in/corrections",
    type: "website",
  },
};

export default function CorrectionsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Corrections Policy",
    description:
      "How InvestingPro handles errors, corrections, and transparency.",
    url: "https://investingpro.in/corrections",
    publisher: {
      "@type": "Organization",
      name: "InvestingPro India",
      url: "https://investingpro.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero */}
        <div className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/10 pointer-events-none" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge
                variant="outline"
                className="mb-4 bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/50 dark:text-primary-400"
              >
                Accountability & Accuracy
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Corrections Policy
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                We take accuracy seriously. When we get something wrong, we fix
                it transparently and promptly. Here is exactly how our
                corrections process works.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Our Commitment */}
          <Card className="border-2 border-primary-100 dark:border-primary-900">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Our Commitment to Accuracy
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Financial information impacts real decisions about money. We
                    understand the responsibility that comes with publishing
                    product comparisons, interest rates, and financial guidance.
                    When errors occur — and they sometimes do — we believe the
                    right thing to do is acknowledge them openly, correct them
                    swiftly, and learn from them to prevent recurrence.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Report an Error */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary-600" />
                How to Report an Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                If you spot an inaccuracy in any of our content — incorrect
                interest rate, outdated fee, wrong calculation, or factual error
                — please let us know using any of these channels:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <Mail className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      Email (Preferred)
                    </h4>
                    <a
                      href="mailto:corrections@investingpro.in"
                      className="text-sm text-primary-600 hover:underline font-medium"
                    >
                      corrections@investingpro.in
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Include the article URL, the error, and the correct
                      information with a source if possible.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      On-Page Feedback
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use the &quot;Report an Issue&quot; link at the bottom of
                      any article or comparison page.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This goes directly to the editorial team for that content
                      category.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correction Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary-600" />
                Correction Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    time: "Within 2 hours",
                    title: "Acknowledgement",
                    description:
                      "We acknowledge receipt of your error report and assign it to the relevant subject matter expert for investigation.",
                  },
                  {
                    time: "Within 24 hours",
                    title: "Investigation & Verification",
                    description:
                      "The assigned expert verifies the reported error against primary sources. If confirmed, a correction is drafted. If the error involves a financial product rate or fee, we also contact the provider directly for confirmation.",
                  },
                  {
                    time: "Within 48 hours",
                    title: "Correction Published",
                    description:
                      "The corrected content is published with a visible correction notice. For critical errors (wrong interest rate, incorrect eligibility criteria), we aim for same-day correction.",
                  },
                  {
                    time: "Within 72 hours",
                    title: "Reporter Notified",
                    description:
                      "We email the person who reported the error to confirm the correction has been made and thank them for improving our content.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex-shrink-0 w-28">
                      <Badge
                        variant="outline"
                        className="text-xs border-primary-200 text-primary-600 whitespace-nowrap"
                      >
                        {item.time}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How Corrections Appear */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-primary-600" />
                How Corrections Appear on Our Site
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                We believe in full transparency. When we correct content, we
                make it visible — not hidden.
              </p>

              {/* Example correction notice */}
              <div className="border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-r-lg">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Correction (April 3, 2026)
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  An earlier version of this article stated the HDFC Regalia
                  annual fee as ₹2,500. The correct fee is ₹3,500 (revised
                  effective January 2026). We regret the error. The comparison
                  scores have been recalculated.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Our correction practices:
                </h4>
                <ul className="space-y-2">
                  {[
                    "Correction notices are placed at the top of the affected article, clearly visible before the content.",
                    "The original incorrect text is shown with strikethrough formatting so readers can see what changed.",
                    "Every correction includes the date of the correction and a brief explanation of what was wrong.",
                    'The "Last Updated" date on the article is updated to reflect the correction.',
                    "For product comparison pages, scores are recalculated and any ranking changes are noted.",
                    "We never silently delete or alter content without a correction notice.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Types of Corrections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileWarning className="w-6 h-6 text-primary-600" />
                Types of Corrections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "Factual Correction",
                    severity: "High",
                    badge: "bg-red-100 text-red-700 border-red-200",
                    description:
                      "Incorrect data points — wrong interest rate, fee, eligibility criteria, or regulatory information. These are corrected immediately with a prominent notice.",
                  },
                  {
                    type: "Calculation Error",
                    severity: "High",
                    badge: "bg-red-100 text-red-700 border-red-200",
                    description:
                      "Errors in comparison scores, savings calculations, or EMI computations. Scores are recalculated and any ranking changes noted.",
                  },
                  {
                    type: "Outdated Information",
                    severity: "Medium",
                    badge: "bg-amber-100 text-amber-700 border-amber-200",
                    description:
                      "Information that was correct at publication but has since changed (e.g., a bank revised its fees). Updated with a note about the change.",
                  },
                  {
                    type: "Clarification",
                    severity: "Low",
                    badge: "bg-blue-100 text-blue-700 border-blue-200",
                    description:
                      'Content that was technically accurate but misleading or incomplete. Clarified with additional context. These do not get a correction notice but may update the "Last Updated" date.',
                  },
                  {
                    type: "Typo / Grammar",
                    severity: "Low",
                    badge: "bg-gray-100 text-gray-700 border-gray-200",
                    description:
                      "Minor typographical or grammatical errors that do not affect the meaning. Fixed silently without a correction notice.",
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 ${item.badge}`}
                    >
                      {item.severity}
                    </Badge>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {item.type}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact for Corrections */}
          <div className="bg-primary-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
            <div className="relative z-10 text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold mb-3">Found an Error?</h2>
              <p className="text-primary-100 mb-6">
                Help us maintain the highest standards. Send corrections to our
                editorial team and we will investigate within 24 hours.
              </p>
              <a
                href="mailto:corrections@investingpro.in"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-900 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-4 h-4" />
                corrections@investingpro.in
              </a>
            </div>
          </div>

          {/* Related Pages */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/editorial-methodology"
              className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-gray-900"
            >
              <BookOpen className="w-5 h-5 text-primary-600 mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Editorial Methodology
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our 5-step review process.
              </p>
            </Link>
            <Link
              href="/authors"
              className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-gray-900"
            >
              <ShieldCheck className="w-5 h-5 text-primary-600 mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Our Team
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Meet our certified experts.
              </p>
            </Link>
            <Link
              href="/about-our-data"
              className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors bg-white dark:bg-gray-900"
            >
              <BookOpen className="w-5 h-5 text-primary-600 mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                About Our Data
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Data sources and freshness.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
