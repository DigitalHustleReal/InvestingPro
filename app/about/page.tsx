import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target, Users, Zap, Shield, TrendingUp, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About InvestingPro - India\'s Decision-Making Platform for Smart Financial Choices',
  description: 'Learn how InvestingPro helps millions of Indians make better financial decisions with real-time comparisons, expert insights, and instant application links for credit cards and investments.',
  openGraph: {
    title: 'About InvestingPro - Our Story',
    description: 'Helping India make smarter financial decisions, one choice at a time.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Helping India Make Smarter Financial Decisions
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              We built InvestingPro because we believe every Indian deserves to make confident financial choices without confusion, hidden fees, or biased advice.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">The Problem We Saw</h2>
              
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8 mb-8">
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                  In 2025, a friend called me frustrated. He'd spent 3 hours comparing credit cards across 5 different websites. Each site showed different "best cards." Each had hidden fees. None explained which card actually fit his spending pattern.
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                  He asked me: <span className="font-semibold text-slate-900 dark:text-white">"Why is choosing a credit card harder than choosing a phone?"</span>
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  That question changed everything.
                </p>
              </div>

              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">What We Discovered</h3>
              
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                We researched how Indians make financial decisions. We found:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Information overload:</strong> 10+ aggregator sites, all claiming to be "best," none explaining why
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Hidden agendas:</strong> Sites pushed products with highest commissions, not best fit
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">No personalization:</strong> Generic "best card" lists that ignored individual spending patterns
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-lg text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Outdated information:</strong> Stale offers, expired rates, broken links
                  </span>
                </li>
              </ul>

              <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600 rounded-r-lg p-6 mb-8">
                <p className="text-lg text-slate-800 dark:text-slate-200 font-semibold">
                  Indians weren't making bad financial decisions because they were uninformed. They were making bad decisions because they were overwhelmed with conflicting, biased, and outdated information.
                </p>
              </div>

              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Our Solution</h3>
              
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                We built InvestingPro with three core principles:
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Decision-Focused</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    We don't just educate. We help you decide. Every comparison, every tool, every article is designed to answer: "Which one should I choose?"
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Always Updated</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    We use automation to update rates, offers, and comparisons daily. No stale information. No expired offers.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Transparent</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    We're upfront about affiliate partnerships. We show you the best option for YOU, not the highest commission for us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Mission</h3>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  To help every Indian make confident financial decisions by providing real-time, unbiased comparisons and instant access to the best credit cards and investment options.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Vision</h3>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  To become India's most trusted decision-making platform for personal finance, where millions of Indians start their financial journey with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">
              What Makes InvestingPro Different
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                    We Focus on Decisions, Not Education
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Other sites explain "What is a credit card?" We answer "Which credit card should YOU get based on YOUR spending?" Decision-focused content that drives action.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                    We Go Deep, Not Wide
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    We dominate Credit Cards and Mutual Funds with comprehensive, up-to-date comparisons. We'd rather be the best at 2 things than mediocre at 10.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                    We Update Daily, Not Monthly
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Our automation system updates rates, offers, and comparisons every day. You always see the latest information, not last month's data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                    We're Transparent About Affiliates
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Yes, we earn commissions when you apply through our links. But we show you the best option for YOU, not the highest commission for us. Our reputation depends on your trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Commitment to You</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-primary-100">Unbiased Comparisons</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Daily</div>
                <div className="text-primary-100">Content Updates</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-primary-100">Decision Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
              Ready to Make Smarter Financial Decisions?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Join thousands of Indians who trust InvestingPro for their financial choices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/credit-cards"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                Compare Credit Cards
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/mutual-funds"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg border-2 border-slate-200 dark:border-slate-700 transition-colors"
              >
                Explore Mutual Funds
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
