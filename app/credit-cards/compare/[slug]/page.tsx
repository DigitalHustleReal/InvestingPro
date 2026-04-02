import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/static'
import { createServiceClient } from '@/lib/supabase/service'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs'
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure'
import CreditCardVisual from '@/components/common/CreditCardVisual'
import FAQAccordion from '@/components/common/FAQAccordion'
import AuthorByline from '@/components/common/AuthorByline'
import InlineSignup from '@/components/engagement/InlineSignup'
import { VersusSchema } from '@/components/seo/SchemaMarkup'
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  Minus,
  CreditCard as CreditCardIcon,
  IndianRupee,
  Plane,
  Gift,
  Fuel,
  Percent,
  ExternalLink,
  Scale,
  ChevronRight,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CardData {
  id: string
  slug: string
  name: string
  bank: string
  type: string
  description: string
  annual_fee: string | number | null
  joining_fee: string | number | null
  interest_rate: string | null
  rewards: string[] | null
  pros: string[] | null
  cons: string[] | null
  rating: number | null
  image_url: string | null
  apply_link: string | null
  source_url: string | null
  features: Record<string, string> | null
  updated_at: string | null
}

// ─── Data Fetching ──────────────────────────────────────────────────────────────

async function getCardBySlug(slug: string, useServiceClient = false): Promise<CardData | null> {
  try {
    const supabase = useServiceClient ? createServiceClient() : createClient()
    const { data, error } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.error(`[VersusPage] Error fetching card ${slug}:`, error)
      return null
    }
    return data
  } catch (error) {
    console.error(`[VersusPage] Failed to fetch card ${slug}:`, error)
    return null
  }
}

function parseVersusSlug(slug: string): { card1Slug: string; card2Slug: string } | null {
  const parts = slug.split('-vs-')
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null
  }
  return { card1Slug: parts[0], card2Slug: parts[1] }
}

// ─── Static Generation ──────────────────────────────────────────────────────────

export const dynamic = 'force-static'
export const revalidate = 3600

// Top 20 popular comparison pairs for pre-generation
const POPULAR_COMPARISONS = [
  'hdfc-infinia-vs-sbi-card-aurum',
  'axis-ace-credit-card-vs-amazon-pay-icici-credit-card',
  'hdfc-regalia-gold-vs-sbi-card-elite',
  'hdfc-millennia-vs-axis-flipkart-credit-card',
  'sbi-cashback-credit-card-vs-idfc-first-classic-credit-card',
  'hdfc-diners-club-black-vs-hdfc-infinia',
  'amex-platinum-card-vs-hdfc-infinia',
  'axis-magnus-vs-hdfc-diners-club-black',
  'sbi-simplysave-credit-card-vs-hdfc-millennia',
  'icici-amazon-pay-credit-card-vs-flipkart-axis-bank-credit-card',
  'hdfc-regalia-vs-axis-magnus',
  'sbi-card-elite-vs-hdfc-regalia-gold',
  'idfc-first-wealth-credit-card-vs-hdfc-millennia',
  'au-ixigo-credit-card-vs-axis-ace-credit-card',
  'kotak-league-platinum-vs-hdfc-millennia',
  'icici-coral-credit-card-vs-sbi-simplysave-credit-card',
  'hdfc-swiggy-credit-card-vs-axis-flipkart-credit-card',
  'indusind-legend-credit-card-vs-hdfc-diners-club-privilege',
  'yes-first-preferred-vs-idfc-first-classic-credit-card',
  'standard-chartered-ultimate-vs-hdfc-regalia-gold',
]

export async function generateStaticParams() {
  return POPULAR_COMPARISONS.map((slug) => ({ slug }))
}

// ─── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseVersusSlug(slug)
  if (!parsed) {
    return { title: 'Comparison Not Found - InvestingPro' }
  }

  const [card1, card2] = await Promise.all([
    getCardBySlug(parsed.card1Slug, true),
    getCardBySlug(parsed.card2Slug, true),
  ])

  if (!card1 || !card2) {
    return { title: 'Comparison Not Found - InvestingPro' }
  }

  const year = new Date().getFullYear()
  const title = `${card1.name} vs ${card2.name} - Which is Better? (${year}) | InvestingPro`
  const description = `Compare ${card1.name} vs ${card2.name} side by side. See differences in annual fee, rewards, lounge access, welcome bonus & more. Find the best credit card for you in ${year}.`

  return {
    title,
    description,
    keywords: `${card1.name} vs ${card2.name}, ${card1.bank} vs ${card2.bank}, credit card comparison, best credit card india ${year}`,
    openGraph: {
      title: `${card1.name} vs ${card2.name} | InvestingPro`,
      description,
      type: 'article',
      url: `/credit-cards/compare/${slug}`,
    },
    alternates: {
      canonical: `/credit-cards/compare/${slug}`,
    },
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatFee(fee: string | number | null | undefined): string {
  if (fee === null || fee === undefined || fee === '' || fee === '0' || fee === 0) return 'Nil'
  const num = Number(fee)
  if (!isNaN(num)) return num === 0 ? 'Nil' : `₹${num.toLocaleString('en-IN')}`
  return String(fee)
}

function getFeatureValue(card: CardData, featureKey: string): string {
  if (card.features && card.features[featureKey]) {
    return card.features[featureKey]
  }
  return 'N/A'
}

type Verdict = 'card1' | 'card2' | 'tie'

function compareNumericFees(fee1: string | number | null, fee2: string | number | null): Verdict {
  const n1 = Number(fee1) || 0
  const n2 = Number(fee2) || 0
  if (n1 === n2) return 'tie'
  return n1 < n2 ? 'card1' : 'card2' // Lower fee is better
}

function compareRatings(r1: number | null, r2: number | null): Verdict {
  const v1 = r1 || 0
  const v2 = r2 || 0
  if (v1 === v2) return 'tie'
  return v1 > v2 ? 'card1' : 'card2'
}

interface ComparisonRow {
  label: string
  icon: React.ReactNode
  card1Value: string
  card2Value: string
  verdict: Verdict
  note?: string
}

function buildComparisonRows(card1: CardData, card2: CardData): ComparisonRow[] {
  const rows: ComparisonRow[] = []

  // Annual Fee
  const af1 = formatFee(card1.annual_fee)
  const af2 = formatFee(card2.annual_fee)
  rows.push({
    label: 'Annual Fee',
    icon: <IndianRupee className="w-4 h-4" />,
    card1Value: af1,
    card2Value: af2,
    verdict: compareNumericFees(card1.annual_fee, card2.annual_fee),
  })

  // Joining Fee
  const jf1 = formatFee(card1.joining_fee)
  const jf2 = formatFee(card2.joining_fee)
  rows.push({
    label: 'Joining Fee',
    icon: <CreditCardIcon className="w-4 h-4" />,
    card1Value: jf1,
    card2Value: jf2,
    verdict: compareNumericFees(card1.joining_fee, card2.joining_fee),
  })

  // Reward Rate
  const rr1 = getFeatureValue(card1, 'Reward Rate') !== 'N/A' ? getFeatureValue(card1, 'Reward Rate') : (card1.rewards?.[0] || 'Check details')
  const rr2 = getFeatureValue(card2, 'Reward Rate') !== 'N/A' ? getFeatureValue(card2, 'Reward Rate') : (card2.rewards?.[0] || 'Check details')
  rows.push({
    label: 'Reward Rate',
    icon: <Gift className="w-4 h-4" />,
    card1Value: rr1,
    card2Value: rr2,
    verdict: 'tie',
  })

  // Lounge Access
  const la1 = getFeatureValue(card1, 'Lounge Access')
  const la2 = getFeatureValue(card2, 'Lounge Access')
  rows.push({
    label: 'Lounge Access',
    icon: <Plane className="w-4 h-4" />,
    card1Value: la1 !== 'N/A' ? la1 : 'Check details',
    card2Value: la2 !== 'N/A' ? la2 : 'Check details',
    verdict: 'tie',
  })

  // Welcome Bonus
  const wb1 = getFeatureValue(card1, 'Welcome Bonus')
  const wb2 = getFeatureValue(card2, 'Welcome Bonus')
  rows.push({
    label: 'Welcome Bonus',
    icon: <Gift className="w-4 h-4" />,
    card1Value: wb1 !== 'N/A' ? wb1 : 'Check details',
    card2Value: wb2 !== 'N/A' ? wb2 : 'Check details',
    verdict: 'tie',
  })

  // Interest Rate
  rows.push({
    label: 'Interest Rate',
    icon: <Percent className="w-4 h-4" />,
    card1Value: card1.interest_rate || '3.5% p.m.',
    card2Value: card2.interest_rate || '3.5% p.m.',
    verdict: 'tie',
  })

  // Fuel Surcharge
  const fs1 = getFeatureValue(card1, 'Fuel Surcharge Waiver')
  const fs2 = getFeatureValue(card2, 'Fuel Surcharge Waiver')
  rows.push({
    label: 'Fuel Surcharge Waiver',
    icon: <Fuel className="w-4 h-4" />,
    card1Value: fs1 !== 'N/A' ? fs1 : 'Check details',
    card2Value: fs2 !== 'N/A' ? fs2 : 'Check details',
    verdict: 'tie',
  })

  // Card Type
  rows.push({
    label: 'Card Type',
    icon: <CreditCardIcon className="w-4 h-4" />,
    card1Value: card1.type || 'Standard',
    card2Value: card2.type || 'Standard',
    verdict: 'tie',
  })

  // Rating
  rows.push({
    label: 'InvestingPro Rating',
    icon: <Trophy className="w-4 h-4" />,
    card1Value: `${card1.rating || 4.5}/5`,
    card2Value: `${card2.rating || 4.5}/5`,
    verdict: compareRatings(card1.rating, card2.rating),
  })

  return rows
}

function generateFAQs(card1: CardData, card2: CardData): { question: string; answer: string }[] {
  const year = new Date().getFullYear()
  return [
    {
      question: `Which is better, ${card1.name} or ${card2.name}?`,
      answer: `Both cards have their strengths. ${card1.name} from ${card1.bank} is a ${card1.type} card, while ${card2.name} from ${card2.bank} is a ${card2.type} card. The best choice depends on your spending patterns and lifestyle. Compare the features above to decide which suits you better.`,
    },
    {
      question: `What is the annual fee difference between ${card1.name} and ${card2.name}?`,
      answer: `${card1.name} has an annual fee of ${formatFee(card1.annual_fee)}, while ${card2.name} has an annual fee of ${formatFee(card2.annual_fee)}. Consider the benefits offered relative to the fee when making your decision.`,
    },
    {
      question: `Which card has better rewards - ${card1.name} or ${card2.name}?`,
      answer: `Both cards offer competitive reward programs. Review the reward rate, categories, and redemption options in the comparison table above to see which aligns better with your spending habits.`,
    },
    {
      question: `Can I hold both ${card1.name} and ${card2.name}?`,
      answer: `Yes, you can hold both cards simultaneously as they are issued by different banks (${card1.bank} and ${card2.bank}). Many cardholders use multiple cards to maximize rewards across different spending categories.`,
    },
    {
      question: `Which card is easier to get approved for in ${year}?`,
      answer: `Both cards have eligibility requirements including minimum income and credit score criteria. Generally, cards with lower annual fees have more relaxed eligibility. Check each card's specific requirements before applying.`,
    },
  ]
}

// ─── Verdict Badge Component ────────────────────────────────────────────────────

function VerdictBadge({ verdict, card1Name, card2Name }: { verdict: Verdict; card1Name: string; card2Name: string }) {
  if (verdict === 'tie') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Minus className="w-3 h-3" /> Tie
      </span>
    )
  }
  const winner = verdict === 'card1' ? card1Name : card2Name
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400">
      <Trophy className="w-3 h-3" /> {winner.split(' ').slice(0, 2).join(' ')}
    </span>
  )
}

// ─── Page Component ─────────────────────────────────────────────────────────────

export default async function CreditCardVersusPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const parsed = parseVersusSlug(slug)

  if (!parsed) {
    notFound()
  }

  const [card1, card2] = await Promise.all([
    getCardBySlug(parsed.card1Slug),
    getCardBySlug(parsed.card2Slug),
  ])

  if (!card1 || !card2) {
    notFound()
  }

  const year = new Date().getFullYear()
  const comparisonRows = buildComparisonRows(card1, card2)
  const faqs = generateFAQs(card1, card2)

  // Count wins for overall verdict
  const card1Wins = comparisonRows.filter((r) => r.verdict === 'card1').length
  const card2Wins = comparisonRows.filter((r) => r.verdict === 'card2').length

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen">
      {/* Schema Markup */}
      <VersusSchema
        product1Name={card1.name}
        product1Slug={card1.slug}
        product1Image={card1.image_url || undefined}
        product1Rating={card1.rating || undefined}
        product2Name={card2.name}
        product2Slug={card2.slug}
        product2Image={card2.image_url || undefined}
        product2Rating={card2.rating || undefined}
        combination={slug}
        category="Credit Cards"
      />

      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AutoBreadcrumbs />

          <div className="text-center mt-6 mb-8">
            <Badge variant="outline" className="mb-4 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
              <Scale className="w-3 h-3 mr-1" /> Credit Card Comparison
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              {card1.name} vs {card2.name}
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Detailed side-by-side comparison of features, fees, rewards, and benefits to help you pick the right card in {year}.
            </p>
          </div>

          <AuthorByline />

          {/* Side-by-Side Card Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 mt-8 max-w-4xl mx-auto">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="aspect-[1.586/1] w-full max-w-xs relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-50/10">
                {card1.image_url ? (
                  <img src={card1.image_url} alt={card1.name} className="w-full h-full object-cover" />
                ) : (
                  <CreditCardVisual
                    cardName={card1.name}
                    bankName={card1.bank}
                    cardType={card1.type}
                    className="w-full h-full"
                    size="lg"
                  />
                )}
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{card1.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{card1.bank}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                  {card1.type}
                </Badge>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{card1.rating || 4.5}/5</span>
              </div>
              {card1.apply_link && card1.apply_link !== '#' && (
                <Button asChild className="mt-4 bg-green-700 hover:bg-green-800 text-white">
                  <Link href={card1.apply_link} target="_blank" rel="noopener noreferrer nofollow">
                    Apply Now <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              )}
            </div>

            {/* VS Divider */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              {/* Positioned via parent relative - handled by grid gap */}
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="aspect-[1.586/1] w-full max-w-xs relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-50/10">
                {card2.image_url ? (
                  <img src={card2.image_url} alt={card2.name} className="w-full h-full object-cover" />
                ) : (
                  <CreditCardVisual
                    cardName={card2.name}
                    bankName={card2.bank}
                    cardType={card2.type}
                    className="w-full h-full"
                    size="lg"
                  />
                )}
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{card2.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{card2.bank}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                  {card2.type}
                </Badge>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{card2.rating || 4.5}/5</span>
              </div>
              {card2.apply_link && card2.apply_link !== '#' && (
                <Button asChild className="mt-4 bg-green-700 hover:bg-green-800 text-white">
                  <Link href={card2.apply_link} target="_blank" rel="noopener noreferrer nofollow">
                    Apply Now <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* VS badge between cards on mobile */}
          <div className="flex justify-center -mt-2 md:hidden">
            <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-sm shadow-lg">
              VS
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Affiliate Disclosure */}
        <AffiliateDisclosure
          hasAffiliateLink={!!(card1.apply_link || card2.apply_link)}
          variant="inline"
        />

        {/* Feature-by-Feature Comparison Table */}
        <Card className="mt-8 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Scale className="w-5 h-5 text-green-700 dark:text-green-400" />
              Feature-by-Feature Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <div>Feature</div>
              <div className="text-center">{card1.name.split(' ').slice(0, 3).join(' ')}</div>
              <div className="text-center">{card2.name.split(' ').slice(0, 3).join(' ')}</div>
              <div className="text-center">Winner</div>
            </div>

            {/* Comparison Rows */}
            {comparisonRows.map((row, index) => (
              <div
                key={row.label}
                className={cn(
                  'px-6 py-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0',
                  index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/50 dark:bg-slate-900/30'
                )}
              >
                {/* Desktop Layout */}
                <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="text-green-700 dark:text-green-400">{row.icon}</span>
                    {row.label}
                  </div>
                  <div className={cn(
                    'text-center text-sm font-medium',
                    row.verdict === 'card1' ? 'text-green-700 dark:text-green-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  )}>
                    {row.card1Value}
                    {row.verdict === 'card1' && <CheckCircle2 className="w-4 h-4 inline ml-1 text-green-600" />}
                  </div>
                  <div className={cn(
                    'text-center text-sm font-medium',
                    row.verdict === 'card2' ? 'text-green-700 dark:text-green-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  )}>
                    {row.card2Value}
                    {row.verdict === 'card2' && <CheckCircle2 className="w-4 h-4 inline ml-1 text-green-600" />}
                  </div>
                  <div className="text-center">
                    <VerdictBadge verdict={row.verdict} card1Name={card1.name} card2Name={card2.name} />
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <span className="text-green-700 dark:text-green-400">{row.icon}</span>
                    {row.label}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={cn(
                      'p-3 rounded-lg text-center text-sm',
                      row.verdict === 'card1'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 font-bold text-green-700 dark:text-green-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    )}>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 truncate">{card1.name.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="font-medium">{row.card1Value}</p>
                    </div>
                    <div className={cn(
                      'p-3 rounded-lg text-center text-sm',
                      row.verdict === 'card2'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 font-bold text-green-700 dark:text-green-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    )}>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 truncate">{card2.name.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="font-medium">{row.card2Value}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <VerdictBadge verdict={row.verdict} card1Name={card1.name} card2Name={card2.name} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overall Verdict */}
        <Card className="mt-8 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-green-700 dark:text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Overall Verdict</h3>
              {card1Wins > card2Wins ? (
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-green-700 dark:text-green-400">{card1.name}</span> edges ahead in {card1Wins} categories,
                  while <span className="font-semibold">{card2.name}</span> wins in {card2Wins}.
                  However, the best card depends on your specific spending patterns and lifestyle needs.
                </p>
              ) : card2Wins > card1Wins ? (
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-green-700 dark:text-green-400">{card2.name}</span> edges ahead in {card2Wins} categories,
                  while <span className="font-semibold">{card1.name}</span> wins in {card1Wins}.
                  However, the best card depends on your specific spending patterns and lifestyle needs.
                </p>
              ) : (
                <p className="text-slate-600 dark:text-slate-400">
                  Both <span className="font-semibold">{card1.name}</span> and <span className="font-semibold">{card2.name}</span> are
                  closely matched. Your choice should depend on your spending habits, preferred benefits, and the card type that aligns with your lifestyle.
                </p>
              )}
            </div>

            {/* Quick recommendation cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">Choose {card1.name} if:</h4>
                <ul className="space-y-1.5">
                  {(card1.pros || []).slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {pro}
                    </li>
                  ))}
                </ul>
                {card1.apply_link && card1.apply_link !== '#' && (
                  <Button asChild size="sm" className="mt-3 w-full bg-green-700 hover:bg-green-800 text-white">
                    <Link href={card1.apply_link} target="_blank" rel="noopener noreferrer nofollow">
                      Apply for {card1.name.split(' ').slice(0, 2).join(' ')} <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">Choose {card2.name} if:</h4>
                <ul className="space-y-1.5">
                  {(card2.pros || []).slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {pro}
                    </li>
                  ))}
                </ul>
                {card2.apply_link && card2.apply_link !== '#' && (
                  <Button asChild size="sm" className="mt-3 w-full bg-green-700 hover:bg-green-800 text-white">
                    <Link href={card2.apply_link} target="_blank" rel="noopener noreferrer nofollow">
                      Apply for {card2.name.split(' ').slice(0, 2).join(' ')} <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pros & Cons Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[card1, card2].map((card) => (
            <Card key={card.id} className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900 dark:text-white">{card.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pros */}
                <div>
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-1.5">
                    {(card.pros || []).map((pro, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Cons */}
                <div>
                  <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-1.5">
                    {(card.cons || []).map((con, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SEO Content Block */}
        <Card className="mt-8 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6 sm:p-8 prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0">
              {card1.name} vs {card2.name}: Complete Comparison Guide ({year})
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Choosing between {card1.name} and {card2.name} is a common dilemma for Indian credit card users.
              Both cards are offered by reputable banks -- {card1.bank} and {card2.bank} respectively --
              and cater to different spending patterns and lifestyles.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              The {card1.name} is a <strong>{card1.type}</strong> credit card with an annual fee of {formatFee(card1.annual_fee)}.
              {card1.description}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              On the other hand, the {card2.name} is a <strong>{card2.type}</strong> credit card with an annual fee of {formatFee(card2.annual_fee)}.
              {card2.description}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              When comparing these cards, consider factors such as your monthly spending patterns, preferred reward categories,
              travel frequency, and whether you value lounge access or cashback more. The right card can save you thousands of rupees
              annually through rewards and benefits.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-8">
          <FAQAccordion
            title={`${card1.name} vs ${card2.name} - FAQs`}
            items={faqs}
          />
        </div>

        {/* Save Results — Frictionless inline signup */}
        <div className="mt-8">
          <InlineSignup variant="save-results" />
        </div>

        {/* Back to comparisons */}
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950">
            <Link href="/credit-cards/compare">
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
              View All Credit Card Comparisons
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
