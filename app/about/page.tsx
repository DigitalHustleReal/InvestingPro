import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Target,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Heart,
  Award,
  AlertTriangle,
  CheckCircle2,
  Linkedin,
  Twitter,
} from "lucide-react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title:
    "About InvestingPro - India's Decision-Making Platform for Smart Financial Choices",
  description:
    "Learn how InvestingPro helps Indians make better financial decisions with real-time comparisons, expert insights, and instant application links for credit cards and investments.",
  openGraph: {
    title: "About InvestingPro - India's Decision-Making Platform",
    description: "Empowering Indians to make smarter financial choices.",
  },
};

export default async function AboutPage() {
  // Use direct client to avoid any next/headers dependencies from internal libs
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: teamMembers } = await supabase
    .from("authors")
    .select("id, name, slug, role, avatar, bio, is_expert, expert_order")
    .eq("is_expert", true)
    .order("expert_order")
    .limit(20);

  const members = teamMembers || [
    {
      name: "Shiv Pratap",
      role: "Founder & CEO",
      slug: "shiv-pratap",
      avatar: null,
    },
    {
      name: "InvestingPro Editorial",
      role: "Research & Analysis",
      slug: "investingpro",
      avatar: null,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ... Hero Section ... */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-gray-700/20 dark:[mask-image:linear-gradient(0deg,rgba(15,23,42,1),rgba(15,23,42,0.3))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-wider mb-6 ring-1 ring-primary-200 dark:ring-primary-800">
              <Zap className="w-3 h-3" />
              Our Mission
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-8">
              Helping India Make{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Better Financial Decisions
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10">
              InvestingPro is built on a simple promise: transparency. We cut
              through the fine print and marketing jargon to give you the real
              math behind every financial product in India.
            </p>
          </div>
        </div>
      </section>

      {/* What We Cover Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">7</div>
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                Product Categories
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                Banks & NBFCs Tracked
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                Financial Calculators
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">Daily</div>
              <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                Data Updates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We follow a strict editorial methodology to ensure every
              recommendation is backed by data, not commission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Independent Reviews
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We don't accept payment for reviews. If a product is bad, we say
                it's bad. Our "Match Score" is powered by transparent
                algorithms.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center text-secondary-600 dark:text-secondary-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Hyper-Localized Data
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We specialize in the Indian market, tracking real-time data from
                50+ Indian banks, NBFCs, and AMC providers.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                User-Centered Focus
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We build tools that we use ourselves. Every calculator and
                comparison engine is designed to solve a real human problem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Experts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every article is researched from official sources and fact-checked
              before publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member) => (
              <div
                key={member.slug}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src={`https://api.dicebear.com/7.x/personas/svg?seed=${member.slug}`}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="opacity-80"
                    />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider mb-4">
                    {member.role}
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/author/${member.slug}`}
                      className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-600 hover:text-gray-600 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight">
            Join the Revolution in Personal Finance
          </h2>
          <p className="text-xl text-primary-100 mb-10 leading-relaxed">
            Stop guessing. Start knowing. Make smarter financial choices with
            transparent comparisons and real data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/compare">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 font-bold px-8 h-12 shadow-xl"
              >
                Explore Products
              </Button>
            </Link>
            <Link href="/credit-cards">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-bold px-8 h-12"
              >
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Independence Disclaimer */}
      <section className="py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
            InvestingPro.in is an independent platform owned and operated in
            India. It is not affiliated with, endorsed by, or associated in any
            way with Investing.com, InvestingPro™ by Investing.com, or any of
            their parent companies, subsidiaries, or affiliates. All trademarks
            belong to their respective owners.
          </p>
        </div>
      </section>
    </div>
  );
}
