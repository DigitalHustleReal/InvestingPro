import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calculator, Search, Coins, Calendar, BarChart3, TrendingUp,
  Shield, Wallet, ArrowRight, Zap, Globe, FileText,
  IndianRupee, PiggyBank, Home, Landmark, ReceiptText,
  Scale, Percent, RefreshCw, Target, Heart,
} from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs';

export const metadata: Metadata = {
  title: 'Free Financial Tools for India — Calculators, Lookups & Data | InvestingPro',
  description:
    '25+ free financial tools for India — IFSC lookup, gold rate, bank holidays, EMI calculator, SIP calculator, tax calculator, NPS calculator and more. No signup required.',
};

interface Tool {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  tag: string;
  tagColor: string;
  category: string;
  searches?: string;
}

const TOOLS: Tool[] = [
  // Data tools (the new programmatic SEO powerhouses)
  {
    title: 'IFSC Code Finder',
    desc: 'Look up any bank branch IFSC, address, SWIFT, NEFT/RTGS/IMPS availability. 1.6L+ branches.',
    href: '/ifsc',
    icon: Search,
    tag: 'Data Tool',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    category: 'Data Tools',
    searches: '1.29M/mo',
  },
  {
    title: 'Gold Rate Today',
    desc: 'Live 24K, 22K, 18K gold rates for 50+ Indian cities. Aaj sone ka bhav — IBJA authenticated.',
    href: '/gold-rate',
    icon: Coins,
    tag: 'Data Tool',
    tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    category: 'Data Tools',
    searches: '2.4M/mo',
  },
  {
    title: 'Bank Holidays 2025–26',
    desc: 'Complete RBI bank holiday calendar for all 25 states. Know when NEFT/RTGS closes.',
    href: '/bank-holidays',
    icon: Calendar,
    tag: 'Data Tool',
    tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    category: 'Data Tools',
    searches: '280K/mo',
  },
  {
    title: 'RBI Rates Dashboard',
    desc: 'Repo rate, reverse repo, CRR, SLR, CPI inflation, forex rates — all from RBI DBIE.',
    href: '/rbi-rates',
    icon: Landmark,
    tag: 'Data Tool',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    category: 'Data Tools',
    searches: '120K/mo',
  },

  // Investment calculators
  {
    title: 'SIP Calculator',
    desc: 'Calculate monthly SIP returns with CAGR. See how ₹5,000/month grows over 10–30 years.',
    href: '/calculators/sip',
    icon: TrendingUp,
    tag: 'Calculator',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    category: 'Investment Calculators',
    searches: '2.5M/mo',
  },
  {
    title: 'Lump Sum Calculator',
    desc: 'One-time investment growth calculator. Find future value of your lump sum investment.',
    href: '/calculators/lumpsum',
    icon: BarChart3,
    tag: 'Calculator',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    category: 'Investment Calculators',
  },
  {
    title: 'SWP Calculator',
    desc: 'Systematic Withdrawal Plan — how long will your corpus last? Plan your retirement income.',
    href: '/calculators/swp',
    icon: RefreshCw,
    tag: 'Calculator',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    category: 'Investment Calculators',
    searches: '+423% YoY',
  },
  {
    title: 'PPF Calculator',
    desc: 'Public Provident Fund returns with 7.1% interest. Calculate maturity amount and tax savings.',
    href: '/calculators/ppf',
    icon: PiggyBank,
    tag: 'Calculator',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    category: 'Investment Calculators',
    searches: '900K/mo',
  },
  {
    title: 'NPS Calculator',
    desc: 'National Pension System corpus calculator. Compare Tier I vs Tier II and plan retirement.',
    href: '/calculators/nps',
    icon: Target,
    tag: 'Calculator',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    category: 'Investment Calculators',
  },
  {
    title: 'FD Calculator',
    desc: 'Fixed Deposit maturity calculator. Compare simple vs compound interest across tenures.',
    href: '/calculators/fd',
    icon: Landmark,
    tag: 'Calculator',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    category: 'Investment Calculators',
  },
  {
    title: 'RD Calculator',
    desc: 'Recurring Deposit — monthly savings scheme calculator. Banks, post office rates.',
    href: '/calculators/rd',
    icon: IndianRupee,
    tag: 'Calculator',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    category: 'Investment Calculators',
  },

  // Loan calculators
  {
    title: 'EMI Calculator',
    desc: 'Loan EMI calculator for home, personal, and car loans. Principal vs interest breakdown.',
    href: '/calculators/emi',
    icon: Home,
    tag: 'Calculator',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    category: 'Loan Calculators',
    searches: '10M/mo',
  },
  {
    title: 'Home Loan vs SIP',
    desc: 'Should you prepay your home loan or invest the amount in SIP? Data-driven comparison.',
    href: '/calculators/home-loan-vs-sip',
    icon: Scale,
    tag: 'Calculator',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    category: 'Loan Calculators',
  },
  {
    title: 'Compound Interest',
    desc: 'Power of compounding calculator. See how your money grows with different frequencies.',
    href: '/calculators/compound-interest',
    icon: Percent,
    tag: 'Calculator',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    category: 'Loan Calculators',
  },

  // Tax calculators
  {
    title: 'Income Tax Calculator',
    desc: 'Old vs New tax regime comparison. Which saves more for your income and deductions?',
    href: '/calculators/tax',
    icon: ReceiptText,
    tag: 'Calculator',
    tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    category: 'Tax Calculators',
    searches: '1.5M/mo',
  },
  {
    title: 'GST Calculator',
    desc: 'Add or remove GST from any amount. All slabs: 5%, 12%, 18%, 28%. Inclusive/exclusive.',
    href: '/calculators/gst',
    icon: FileText,
    tag: 'Calculator',
    tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    category: 'Tax Calculators',
  },
  {
    title: 'SSY Calculator',
    desc: 'Sukanya Samriddhi Yojana — returns calculator for daughters. 8.2% tax-free interest.',
    href: '/calculators/ssy',
    icon: Heart,
    tag: 'Calculator',
    tagColor: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    category: 'Tax Calculators',
  },
  {
    title: 'SCSS Calculator',
    desc: 'Senior Citizen Savings Scheme — quarterly interest calculator. Post office returns.',
    href: '/calculators/scss',
    icon: PiggyBank,
    tag: 'Calculator',
    tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    category: 'Tax Calculators',
  },
  {
    title: 'NSC Calculator',
    desc: 'National Savings Certificate — 5-year fixed return calculator. 80C eligible.',
    href: '/calculators/nsc',
    icon: FileText,
    tag: 'Calculator',
    tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    category: 'Tax Calculators',
  },
  {
    title: 'KVP Calculator',
    desc: 'Kisan Vikas Patra — money doubling calculator. When does your ₹ double at current rates?',
    href: '/calculators/kvp',
    icon: Zap,
    tag: 'Calculator',
    tagColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    category: 'Tax Calculators',
  },

  // Planning tools
  {
    title: 'Goal Planning Calculator',
    desc: 'How much to invest monthly to reach any financial goal — house, education, retirement.',
    href: '/calculators/goal-planning',
    icon: Target,
    tag: 'Planner',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    category: 'Planning Tools',
  },
  {
    title: 'Retirement Calculator',
    desc: 'Plan your retirement corpus. How much do you need and how to get there by 60.',
    href: '/calculators/retirement',
    icon: Home,
    tag: 'Planner',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    category: 'Planning Tools',
  },
  {
    title: 'Inflation-Adjusted Returns',
    desc: 'What are your real returns after inflation? FD at 7% with 4% inflation = 2.88% real.',
    href: '/calculators/inflation-adjusted-returns',
    icon: TrendingUp,
    tag: 'Planner',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    category: 'Planning Tools',
  },
  {
    title: 'Portfolio Rebalancing',
    desc: 'How to rebalance equity:debt allocation. Restore your target asset allocation automatically.',
    href: '/calculators/portfolio-rebalancing',
    icon: RefreshCw,
    tag: 'Planner',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    category: 'Planning Tools',
  },

  // AI-powered tools
  {
    title: 'Investment Risk Analyzer',
    desc: '2-minute quiz to discover your risk profile. Get personalised asset allocation advice.',
    href: '/tools/risk-analyzer',
    icon: Shield,
    tag: 'AI Tool',
    tagColor: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
    category: 'AI-Powered Tools',
  },
  {
    title: 'Wallet Architect',
    desc: 'Tell us your spending pattern — get the ideal 2-3 card combination to maximise rewards.',
    href: '/tools/wallet-architect',
    icon: Wallet,
    tag: 'AI Tool',
    tagColor: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
    category: 'AI-Powered Tools',
  },
];

const CATEGORIES = [
  'Data Tools',
  'Investment Calculators',
  'Loan Calculators',
  'Tax Calculators',
  'Planning Tools',
  'AI-Powered Tools',
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Data Tools': Globe,
  'Investment Calculators': TrendingUp,
  'Loan Calculators': Home,
  'Tax Calculators': ReceiptText,
  'Planning Tools': Target,
  'AI-Powered Tools': Zap,
};

export default function ToolsHubPage() {
  const totalSearches = '17M+';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEOHead
        title="Free Financial Tools India — 25+ Calculators & Data Tools | InvestingPro"
        description="India's largest collection of free financial tools. IFSC lookup, gold rates, bank holidays, SIP calculator, EMI calculator, income tax calculator and more. No signup required."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'InvestingPro Free Financial Tools',
          description: '25+ free financial tools for India',
          url: 'https://investingpro.in/tools',
          hasPart: TOOLS.slice(0, 10).map(t => ({
            '@type': 'WebApplication',
            name: t.title,
            description: t.desc,
            url: `https://investingpro.in${t.href}`,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          })),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-800 pt-24 pb-16">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-green-300/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 text-center">
          <AutoBreadcrumbs className="mb-6 justify-center [&_*]:text-green-200 [&_a]:text-green-300" />

          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Zap className="h-3.5 w-3.5" />
            {TOOLS.length} tools · 100% free · No signup required
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display">
            Free Financial Tools
            <span className="block text-emerald-300">for India</span>
          </h1>
          <p className="text-lg text-green-100 mb-6 max-w-xl mx-auto">
            Every tool you need to make smarter money decisions — calculators, live data, lookups. Built with RBI-sourced data.
          </p>

          {/* Stats */}
          <div className="inline-grid grid-cols-3 gap-px bg-white/20 rounded-2xl overflow-hidden max-w-lg w-full mx-auto">
            {[
              { value: TOOLS.length.toString(), label: 'Free tools' },
              { value: totalSearches, label: 'Monthly searches' },
              { value: '₹0', label: 'Cost to use' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm px-5 py-4 text-center">
                <div className="text-2xl font-bold text-white font-display">{s.value}</div>
                <div className="text-xs text-green-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-14">

        {/* Category sections */}
        {CATEGORIES.map(category => {
          const tools = TOOLS.filter(t => t.category === category);
          const CatIcon = CATEGORY_ICONS[category];
          return (
            <section key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CatIcon className="h-5 w-5 text-green-700 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">{category}</h2>
                  <p className="text-sm text-slate-500">{tools.length} tools</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map(tool => (
                  <Link key={tool.href} href={tool.href}
                    className="group flex flex-col p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                        <tool.icon className="h-5 w-5 text-green-700 dark:text-green-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        {tool.searches && (
                          <span className="text-xs text-slate-400 font-mono">{tool.searches}</span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.tagColor}`}>
                          {tool.tag}
                        </span>
                      </div>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                      {tool.title}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{tool.desc}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400">
                      Use free tool
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-green-900 to-green-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white font-display mb-3">
            Ready to invest smarter?
          </h2>
          <p className="text-green-100 mb-6 max-w-md mx-auto text-sm">
            All tools are free, no account required. When you're ready to take action, compare the best products in every category.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/credit-cards', label: 'Compare Credit Cards' },
              { href: '/mutual-funds', label: 'Explore Mutual Funds' },
              { href: '/fixed-deposits', label: 'Best FD Rates' },
              { href: '/loans', label: 'Compare Loans' },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
