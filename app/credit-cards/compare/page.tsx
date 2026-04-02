import { Metadata } from 'next'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs'
import AuthorByline from '@/components/common/AuthorByline'
import {
  Scale,
  ArrowRight,
  CreditCard,
  Plane,
  ShoppingCart,
  Fuel,
  Sparkles,
  IndianRupee,
  ChevronRight,
} from 'lucide-react'

// ─── Static Config ──────────────────────────────────────────────────────────────

export const dynamic = 'force-static'
export const revalidate = 3600

// ─── Metadata ───────────────────────────────────────────────────────────────────

const year = new Date().getFullYear()

export const metadata: Metadata = {
  title: `Compare Credit Cards India ${year} - Side by Side Comparison | InvestingPro`,
  description: `Compare the best credit cards in India ${year}. Side-by-side comparison of features, annual fees, rewards, lounge access & benefits. Find the perfect credit card for your needs.`,
  keywords: `compare credit cards india, credit card comparison ${year}, best credit card india, side by side credit card comparison`,
  openGraph: {
    title: `Compare Credit Cards India ${year} | InvestingPro`,
    description: `Side-by-side comparison of the best credit cards in India. Compare fees, rewards, and benefits.`,
    type: 'website',
    url: '/credit-cards/compare',
  },
  alternates: {
    canonical: '/credit-cards/compare',
  },
}

// ─── Comparison Data ────────────────────────────────────────────────────────────

interface ComparisonPair {
  slug: string
  card1: string
  card2: string
  card1Bank: string
  card2Bank: string
  highlight?: string
}

interface ComparisonCategory {
  title: string
  icon: React.ReactNode
  description: string
  pairs: ComparisonPair[]
}

const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    title: 'Premium Credit Cards',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Top-tier cards with luxury benefits, high reward rates, and exclusive perks.',
    pairs: [
      {
        slug: 'hdfc-infinia-vs-sbi-card-aurum',
        card1: 'HDFC Infinia',
        card2: 'SBI Card AURUM',
        card1Bank: 'HDFC Bank',
        card2Bank: 'SBI Card',
        highlight: 'Most Popular',
      },
      {
        slug: 'hdfc-diners-club-black-vs-hdfc-infinia',
        card1: 'HDFC Diners Club Black',
        card2: 'HDFC Infinia',
        card1Bank: 'HDFC Bank',
        card2Bank: 'HDFC Bank',
      },
      {
        slug: 'amex-platinum-card-vs-hdfc-infinia',
        card1: 'Amex Platinum',
        card2: 'HDFC Infinia',
        card1Bank: 'American Express',
        card2Bank: 'HDFC Bank',
      },
      {
        slug: 'axis-magnus-vs-hdfc-diners-club-black',
        card1: 'Axis Magnus',
        card2: 'HDFC Diners Club Black',
        card1Bank: 'Axis Bank',
        card2Bank: 'HDFC Bank',
      },
      {
        slug: 'hdfc-regalia-vs-axis-magnus',
        card1: 'HDFC Regalia',
        card2: 'Axis Magnus',
        card1Bank: 'HDFC Bank',
        card2Bank: 'Axis Bank',
      },
      {
        slug: 'indusind-legend-credit-card-vs-hdfc-diners-club-privilege',
        card1: 'IndusInd Legend',
        card2: 'HDFC Diners Club Privilege',
        card1Bank: 'IndusInd Bank',
        card2Bank: 'HDFC Bank',
      },
    ],
  },
  {
    title: 'Rewards & Cashback Cards',
    icon: <IndianRupee className="w-5 h-5" />,
    description: 'Cards designed for everyday spenders who want maximum value back.',
    pairs: [
      {
        slug: 'axis-ace-credit-card-vs-amazon-pay-icici-credit-card',
        card1: 'Axis ACE',
        card2: 'Amazon Pay ICICI',
        card1Bank: 'Axis Bank',
        card2Bank: 'ICICI Bank',
        highlight: 'Best for Online Shopping',
      },
      {
        slug: 'hdfc-millennia-vs-axis-flipkart-credit-card',
        card1: 'HDFC Millennia',
        card2: 'Axis Flipkart',
        card1Bank: 'HDFC Bank',
        card2Bank: 'Axis Bank',
      },
      {
        slug: 'sbi-cashback-credit-card-vs-idfc-first-classic-credit-card',
        card1: 'SBI Cashback',
        card2: 'IDFC First Classic',
        card1Bank: 'SBI Card',
        card2Bank: 'IDFC First Bank',
      },
      {
        slug: 'icici-amazon-pay-credit-card-vs-flipkart-axis-bank-credit-card',
        card1: 'ICICI Amazon Pay',
        card2: 'Flipkart Axis Bank',
        card1Bank: 'ICICI Bank',
        card2Bank: 'Axis Bank',
      },
      {
        slug: 'hdfc-swiggy-credit-card-vs-axis-flipkart-credit-card',
        card1: 'HDFC Swiggy',
        card2: 'Axis Flipkart',
        card1Bank: 'HDFC Bank',
        card2Bank: 'Axis Bank',
      },
    ],
  },
  {
    title: 'Travel Credit Cards',
    icon: <Plane className="w-5 h-5" />,
    description: 'Cards with lounge access, air miles, travel insurance and forex benefits.',
    pairs: [
      {
        slug: 'hdfc-regalia-gold-vs-sbi-card-elite',
        card1: 'HDFC Regalia Gold',
        card2: 'SBI Card ELITE',
        card1Bank: 'HDFC Bank',
        card2Bank: 'SBI Card',
        highlight: 'Best for Travellers',
      },
      {
        slug: 'sbi-card-elite-vs-hdfc-regalia-gold',
        card1: 'SBI Card ELITE',
        card2: 'HDFC Regalia Gold',
        card1Bank: 'SBI Card',
        card2Bank: 'HDFC Bank',
      },
      {
        slug: 'au-ixigo-credit-card-vs-axis-ace-credit-card',
        card1: 'AU Ixigo',
        card2: 'Axis ACE',
        card1Bank: 'AU Small Finance Bank',
        card2Bank: 'Axis Bank',
      },
      {
        slug: 'standard-chartered-ultimate-vs-hdfc-regalia-gold',
        card1: 'Standard Chartered Ultimate',
        card2: 'HDFC Regalia Gold',
        card1Bank: 'Standard Chartered',
        card2Bank: 'HDFC Bank',
      },
    ],
  },
  {
    title: 'Entry-Level & Lifetime Free Cards',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Great starter cards with no or low fees for first-time cardholders.',
    pairs: [
      {
        slug: 'sbi-simplysave-credit-card-vs-hdfc-millennia',
        card1: 'SBI SimplySAVE',
        card2: 'HDFC Millennia',
        card1Bank: 'SBI Card',
        card2Bank: 'HDFC Bank',
        highlight: 'Best for Beginners',
      },
      {
        slug: 'idfc-first-wealth-credit-card-vs-hdfc-millennia',
        card1: 'IDFC First Wealth',
        card2: 'HDFC Millennia',
        card1Bank: 'IDFC First Bank',
        card2Bank: 'HDFC Bank',
      },
      {
        slug: 'kotak-league-platinum-vs-hdfc-millennia',
        card1: 'Kotak League Platinum',
        card2: 'HDFC Millennia',
        card1Bank: 'Kotak Mahindra Bank',
        card2Bank: 'HDFC Bank',
      },
      {
        slug: 'icici-coral-credit-card-vs-sbi-simplysave-credit-card',
        card1: 'ICICI Coral',
        card2: 'SBI SimplySAVE',
        card1Bank: 'ICICI Bank',
        card2Bank: 'SBI Card',
      },
      {
        slug: 'yes-first-preferred-vs-idfc-first-classic-credit-card',
        card1: 'YES First Preferred',
        card2: 'IDFC First Classic',
        card1Bank: 'YES Bank',
        card2Bank: 'IDFC First Bank',
      },
    ],
  },
]

// ─── Page Component ─────────────────────────────────────────────────────────────

export default function CreditCardCompareIndexPage() {
  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen">
      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AutoBreadcrumbs />

          <div className="text-center mt-6">
            <Badge variant="outline" className="mb-4 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
              <Scale className="w-3 h-3 mr-1" /> Credit Card Comparisons
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
              Compare Credit Cards
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Side-by-side comparisons of India's most popular credit cards.
              See features, fees, rewards, and our expert verdict to pick the right card for you.
            </p>
          </div>

          <AuthorByline className="mt-6 justify-center" />
        </div>
      </div>

      {/* Comparison Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {COMPARISON_CATEGORIES.map((category) => (
            <section key={category.title}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{category.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                </div>
              </div>

              {/* Comparison Pair Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.pairs.map((pair) => (
                  <Link
                    key={pair.slug}
                    href={`/credit-cards/compare/${pair.slug}`}
                    className="group"
                  >
                    <Card className="h-full border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-950">
                      <CardContent className="p-5">
                        {pair.highlight && (
                          <Badge className="mb-3 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 text-xs">
                            {pair.highlight}
                          </Badge>
                        )}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 text-center">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">{pair.card1}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{pair.card1Bank}</p>
                          </div>
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">
                            VS
                          </div>
                          <div className="flex-1 text-center">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">{pair.card2}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{pair.card2Bank}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-center text-xs font-medium text-green-700 dark:text-green-400 group-hover:text-green-800 dark:group-hover:text-green-300 transition-colors">
                          Compare Now <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* SEO Content */}
        <Card className="mt-16 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6 sm:p-8 prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0">
              How to Compare Credit Cards in India ({year})
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              With dozens of credit cards available from major banks like HDFC, SBI, ICICI, Axis, and more,
              choosing the right card can be overwhelming. Our side-by-side comparisons break down the key
              differences across features like annual fees, reward rates, lounge access, welcome bonuses,
              and more.
            </p>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Key Factors to Compare</h3>
            <ul className="text-slate-600 dark:text-slate-400">
              <li><strong>Annual Fee vs Benefits:</strong> Higher fee cards often offer better rewards, but calculate if you will use enough benefits to justify the cost.</li>
              <li><strong>Reward Rate:</strong> Compare the earning rate across different spend categories (grocery, dining, travel, fuel) to match your lifestyle.</li>
              <li><strong>Lounge Access:</strong> If you travel frequently, airport lounge access can easily offset the annual fee.</li>
              <li><strong>Welcome Bonus:</strong> First-year benefits can significantly improve the value proposition of a new card.</li>
              <li><strong>Interest Rate:</strong> If you don't always pay the full bill, the interest rate matters more than rewards.</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400">
              Use our detailed comparisons above to make an informed decision. Each comparison page includes
              a feature-by-feature breakdown, winner verdict, pros and cons, and expert recommendations.
            </p>
          </CardContent>
        </Card>

        {/* Back to Credit Cards */}
        <div className="mt-8 text-center">
          <Link
            href="/credit-cards"
            className="inline-flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to All Credit Cards
          </Link>
        </div>
      </div>
    </div>
  )
}
