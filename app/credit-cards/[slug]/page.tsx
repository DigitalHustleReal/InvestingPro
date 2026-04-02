import { cn } from '@/lib/utils'
import TrustBadge from '@/components/common/TrustBadge'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Star,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Gift,
  Plane,
  ShoppingBag,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Users,
  TrendingUp,
  Percent,
  Trophy,
  Target,
  Wallet,
  BarChart3,
  Calculator
} from 'lucide-react'
import ProductReviews from '@/components/reviews/ProductReviews'
import DifferentiationCard from '@/components/products/DifferentiationCard'
import StickyMobileCTA from '@/components/products/StickyMobileCTA'
import ApplicationStats from '@/components/products/ApplicationStats'
import FAQAccordion from '@/components/common/FAQAccordion'
import { CREDIT_CARD_GENERAL_FAQS } from '@/lib/content/seo-content'
import { scoreCreditCard } from '@/lib/products/scoring-rules'
import { CreditCard as CreditCardType } from '@/types'
import DecisionFramework from '@/components/common/DecisionFramework'
import DecisionCTA from '@/components/common/DecisionCTA'
import AutoBreadcrumbs from '@/components/common/AutoBreadcrumbs'
import AuthorByline from '@/components/common/AuthorByline'
import RatingBreakdown from '@/components/reviews/RatingBreakdown'
import RelatedArticles from '@/components/content/RelatedArticles'
import CreditCardValueCalculator from '@/components/products/CreditCardValueCalculator'
import { getReviewStats } from '@/lib/content/review-data'
import ExpertOpinion from '@/components/products/ExpertOpinion'
import ComparisonCTA from '@/components/products/ComparisonCTA'
import DocumentChecklist, { CREDIT_CARD_DOCUMENTS } from '@/components/products/DocumentChecklist'
import { getExpertOpinion } from '@/lib/content/expert-opinions'
import InlineChecker from '@/components/eligibility/InlineChecker'
import MiniRewardsCalculator from '@/components/calculators/MiniRewardsCalculator'
import AlternativesCarousel from '@/components/products/AlternativesCarousel'
import RelatedCalculators from '@/components/calculators/RelatedCalculators'
import { getSimilarProducts } from '@/lib/utils/product-similarity'
import WhatsAppAlerts from '@/components/common/WhatsAppAlerts'
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure'
import { CreditCardSchema } from '@/components/seo/SchemaMarkup'
import DataFreshnessIndicator from '@/components/common/DataFreshnessIndicator'
import CreditCardVisual from '@/components/common/CreditCardVisual'
import RelatedPages from '@/components/common/RelatedPages'

interface CreditCardDetail {
  id: string
  name: string
  type: string
  provider: string
  image?: string
  rating: number
  annualFee: number
  joiningFee: number
  rewardRate: string
  welcomeBonus?: string
  minCreditScore?: number
  interestRate: string
  description: string
  applyLink: string
  updatedAt: string | null

  // Detailed features
  keyFeatures: string[]
  rewardProgram: {
    name: string
    pointsPerRupee: number
    redemptionValue: string
    categories: { name: string; rate: string }[]
  }
  benefits: {
    category: string
    items: string[]
  }[]
  eligibility: {
    minAge: number
    minIncome: number
    requiredDocuments: string[]
  }
  fees: {
    name: string
    amount: string
    details?: string
  }[]
  pros: string[]
  cons: string[]
}

import { createClient } from '@/lib/supabase/static'
import { createServiceClient } from '@/lib/supabase/service'

async function getCreditCardData(slug: string, useServiceClient: boolean = false): Promise<CreditCardDetail | null> {
  // Use service client for build-time (generateStaticParams), static client for runtime
  const supabase = useServiceClient ? createServiceClient() : createClient();
  console.log(`[CardPage] Fetching slug: ${slug}`);
  const { data: card, error } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('slug', slug)
    .maybeSingle(); // Use maybeSingle() instead of single() to handle 0 rows gracefully

  if (error) {
    console.error(`[CardPage] Error fetching ${slug}:`, error);
    return null;
  }
  
  if (!card) {
    console.error(`[CardPage] No card found for ${slug}`);
    return null;
  }
  
  console.log(`[CardPage] Found card: ${card.name} (${card.id})`);

  // Derive benefits from type
  const isTravel = card.type === 'Travel' || card.type === 'Premium';
  const isShopping = card.type === 'Shopping' || card.type === 'Cashback';
  
  return {
    id: card.id,
    name: card.name,
    type: card.type || 'Standard',
    provider: card.bank,
    image: card.image_url,
    rating: Number(card.rating) || 4.5,
    annualFee: Number(card.annual_fee) || 0,
    joiningFee: Number(card.joining_fee) || 0,
    rewardRate: card.rewards?.length ? card.rewards[0] : 'Check detailed rewards',
    welcomeBonus: 'Welcome benefits applicable', // Placeholder
    minCreditScore: 700,
    interestRate: card.interest_rate || '3.5% pm',
    description: card.description || `The ${card.name} from ${card.bank} is a ${card.type} credit card offering competitive benefits and rewards.`,
    applyLink: card.apply_link || card.source_url || '#',
    updatedAt: card.updated_at || null,

    keyFeatures: card.rewards || card.pros || [],
    rewardProgram: {
      name: `${card.name} Rewards`,
      pointsPerRupee: 2,
      redemptionValue: 'Variable',
      categories: (card.rewards || []).map((reward: string, i: number) => ({
        name: reward.split('—')[0]?.split('on ')?.pop()?.trim() || `Benefit ${i + 1}`,
        rate: reward,
      }))
    },
    benefits: [
      {
        category: 'Rewards & Cashback',
        items: card.rewards || ['Reward Points', 'Fuel Surcharge Waiver']
      },
      {
        category: 'Highlights',
        items: card.pros || (isTravel
          ? ['Airport Lounge Access', 'Travel Insurance']
          : (isShopping
              ? ['Cashback on Spends', 'Discount Vouchers']
              : ['Dining Discounts', 'Movie Offers']))
      }
    ],
    eligibility: {
      minAge: 21,
      minIncome: 25000,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Income Proof']
    },
    fees: [
      { name: 'Joining Fee', amount: card.joining_fee ? `₹${card.joining_fee}` : 'Nil', details: 'First year fee' },
      { name: 'Annual Fee', amount: card.annual_fee ? `₹${card.annual_fee}` : 'Nil', details: 'From second year onwards' },
    ],
    pros: card.pros || [],
    cons: card.cons || ['Annual fee might apply']
  };
}

/**
 * Generate static params for all active credit cards
 * This pre-generates all product pages at build time for better SEO
 */
export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data: cards, error } = await supabase
      .from('credit_cards')
      .select('slug')
      .not('slug', 'is', null);
    
    if (error) {
      console.error('[generateStaticParams] Error fetching credit cards:', error);
      return [];
    }
    
    if (!cards || cards.length === 0) {
      console.warn('[generateStaticParams] No credit cards found');
      return [];
    }
    
    console.log(`[generateStaticParams] Generating ${cards.length} credit card pages`);
    return cards.map(card => ({ slug: card.slug }));
  } catch (error) {
    console.error('[generateStaticParams] Failed to generate static params:', error);
    return [];
  }
}

// ISR: Revalidate every hour to keep data fresh while maintaining static benefits
export const revalidate = 3600; // 1 hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCreditCardData(slug, true) // Use service client for metadata generation (build-time)
  
  if (!card) {
    return {
      title: 'Credit Card Not Found - InvestingPro',
    }
  }
  
  return {
    title: `${card.name} Review - Features, Benefits & Apply Online | InvestingPro`,
    description: `${card.description} Rating: ${card.rating}/5. Annual fee: ₹${card.annualFee}. Compare benefits, eligibility, and apply online.`,
    keywords: `${card.name}, ${card.provider} credit card, credit card review, ${card.provider.toLowerCase()} card benefits, apply credit card online`,
    openGraph: {
      title: `${card.name} Review | InvestingPro`,
      description: card.description,
      type: 'article',
      images: card.image ? [card.image] : [],
    },
    alternates: {
      canonical: `/credit-cards/${slug}`,
    }
  }
}

export default async function CreditCardDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const card = await getCreditCardData(params.slug, false) // Use server client for runtime
  
  if (!card) {
    notFound()
  }
  
  // Format the updated date for display
  const lastUpdatedDate = card.updatedAt
    ? new Date(card.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-slate-50 dark:bg-black min-h-screen">
      {/* JSON-LD Schema Markup for SEO */}
      <CreditCardSchema
        name={card.name}
        slug={params.slug}
        description={card.description}
        provider={card.provider}
        image={card.image}
        rating={card.rating}
        annualFee={card.annualFee}
        interestRate={card.interestRate}
        faqs={CREDIT_CARD_GENERAL_FAQS}
      />

      {/* Hero Section - The "Decision Layer" */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AutoBreadcrumbs />
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                
                {/* Visual Anchor (Left) */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                    <div className="aspect-[1.586/1] w-full relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-50/10">
                         {card.image ? (
                           <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                         ) : (
                           <CreditCardVisual
                             cardName={card.name}
                             bankName={card.provider}
                             cardType={card.type}
                             className="w-full h-full"
                             size="lg"
                           />
                         )}
                         {/* Best For Tag overlay */}
                         <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-white/20 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                            Best for {card.type}
                         </div>
                    </div>

                    {/* Approval Odds Meter (Indian Context Mechanics) */}
                    <div className="mt-6 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Approval Odds</p>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                             {/* Mock logic for visualization - typically would be dynamic based on user profile */}
                             <div className={`h-full rounded-full ${card.minCreditScore && card.minCreditScore > 750 ? 'w-1/3 bg-red-500' : 'w-3/4 bg-success-500'}`}></div>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                             {card.minCreditScore && card.minCreditScore > 750 ? 'Excellent Credit Req.' : 'Good Chance'} 
                             <span className="text-slate-400 font-normal ml-1">({card.minCreditScore}+)</span>
                        </p>
                    </div>
                </div>

                {/* Decision Data (Right) */}
                <div className="flex-1 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="text-secondary-600 dark:text-secondary-400 font-bold tracking-tight text-xs uppercase">{card.provider} Bank</span>
                            <div className="flex items-center gap-2">
                                <TrustBadge type="verified" />
                                <TrustBadge type="fact-checked" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 font-heading">
                            {card.name}
                        </h1>

                        {/* Pre-Launch Critical: Affiliate Disclosure above the fold */}
                        <div className="mb-6">
                           <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg p-3 max-w-fit" />
                        </div>

                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                            {card.description}
                        </p>
                        <AuthorByline />
                        <div className="mt-3">
                            <DataFreshnessIndicator
                                lastUpdated={card.updatedAt || new Date().toISOString()}
                                label="Last updated"
                                size="sm"
                            />
                        </div>
                    </div>

                    {/* Expert Opinion Box - NEW */}
                    <ExpertOpinion 
                        productName={card.name}
                        opinion={getExpertOpinion(params.slug, 'credit_card')}
                    />

                    {/* Application Statistics - NEW */}
                    <ApplicationStats 
                        productName={card.name}
                        className="mt-6"
                    />



                    {/* Trust Strip & Real Math */}
                    <div className="grid grid-cols-3 gap-4 border-y border-slate-100 dark:border-slate-800 py-6">
                        <div>
                           <p className="text-xs text-slate-500 uppercase font-bold mb-1">Annual Fee</p>
                           <p className="text-xl font-bold text-slate-900 dark:text-white">₹{card.annualFee}</p>
                           <p className="text-xs text-slate-400">+ GST</p>
                        </div>
                        <div>
                           <p className="text-xs text-slate-500 uppercase font-bold mb-1">Reward Value</p>
                           <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">~1.5% - 3.3%</p>
                           <p className="text-xs text-slate-400">Real Return</p>
                        </div>
                        <div>
                           <p className="text-xs text-slate-500 uppercase font-bold mb-1">Rating</p>
                           <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <span className="text-xl font-bold text-slate-900 dark:text-white">{card.rating}</span>
                                <span className="text-sm text-slate-400">/5</span>
                           </div>
                        </div>
                    </div>

                    {/* Quick Math Value Calculator (New Audit Feature) */}
                    <div className="mb-6">
                        <CreditCardValueCalculator 
                            annualFee={card.annualFee} 
                            cashbackRate={card.type === 'Premium' || card.type === 'Travel' ? 2.5 : 1.5} 
                        />
                    </div>

                    {/* CTA Area */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                            <Button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-xl shadow-primary-600/20 transition-all hover:scale-105 active:scale-95">
                                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </a>
                        <Button variant="outline" className="h-auto py-3 px-6 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                            Check Eligibility
                        </Button>
                    </div>
                    
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> 
                        Secure application via {card.provider} official site.
                    </p>
                </div>
            </div>
        </div>
      </div>
      
      {/* ─── Quick Nav (Sticky Table of Contents) ─── */}
      <nav className="sticky top-[56px] z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-2 -mx-1">
            {[
              { id: 'at-a-glance', label: 'At a Glance' },
              { id: 'features', label: 'Features' },
              { id: 'rewards', label: 'Rewards' },
              { id: 'fees', label: 'Fees' },
              { id: 'eligibility', label: 'Eligibility' },
              { id: 'pros-cons', label: 'Pros & Cons' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'faqs', label: 'FAQs' },
            ].map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors whitespace-nowrap"
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── At a Glance Summary Box ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <section id="at-a-glance" className="scroll-mt-28">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-700 dark:text-green-500" />
              At a Glance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Annual Fee</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{card.annualFee === 0 ? 'FREE' : `₹${card.annualFee.toLocaleString('en-IN')}`}</p>
                <p className="text-xs text-slate-400">+ GST applicable</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joining Fee</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{card.joiningFee === 0 ? 'FREE' : `₹${card.joiningFee.toLocaleString('en-IN')}`}</p>
                <p className="text-xs text-slate-400">One-time</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reward Rate</p>
                <p className="text-2xl font-black text-green-700 dark:text-green-400">{card.rewardRate}</p>
                <p className="text-xs text-slate-400">On eligible spends</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Welcome Bonus</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{card.welcomeBonus || 'N/A'}</p>
                <p className="text-xs text-slate-400">On activation</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interest Rate</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{card.interestRate}</p>
                <p className="text-xs text-slate-400">On outstanding</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Best For</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-400">{card.type}</p>
                <p className="text-xs text-slate-400">Card category</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Who Should Get This Card? ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-700 dark:text-green-500" />
            Who Should Get This Card?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ideal For */}
            <div className="bg-green-50/50 dark:bg-green-950/20 rounded-xl p-5 border border-green-100 dark:border-green-900/30">
              <h3 className="font-bold text-green-800 dark:text-green-400 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Ideal For
              </h3>
              <ul className="space-y-3">
                {(() => {
                  const idealFor: string[] = [];
                  if (card.type === 'Travel' || card.type === 'Premium') {
                    idealFor.push('Frequent flyers and international travelers');
                    idealFor.push('Those who value airport lounge access');
                    idealFor.push('High spenders seeking premium travel perks');
                  } else if (card.type === 'Cashback') {
                    idealFor.push('Everyday spenders who want money back');
                    idealFor.push('Online shoppers and bill payers');
                    idealFor.push('Those who prefer simple cash rewards over points');
                  } else if (card.type === 'Shopping') {
                    idealFor.push('Frequent online and retail shoppers');
                    idealFor.push('Those who shop across partner brands');
                    idealFor.push('Deal hunters looking for extra discounts');
                  } else {
                    idealFor.push('First-time credit card users');
                    idealFor.push('Those building or improving their credit score');
                    idealFor.push('Anyone seeking a reliable all-purpose card');
                  }
                  if (card.annualFee === 0) idealFor.push('Budget-conscious users who want zero annual fees');
                  else if (card.annualFee >= 5000) idealFor.push(`Those who spend enough to justify the ₹${card.annualFee.toLocaleString('en-IN')} annual fee`);
                  return idealFor.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ));
                })()}
              </ul>
            </div>
            {/* Not Ideal For */}
            <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-5 border border-red-100 dark:border-red-900/30">
              <h3 className="font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                <XCircle className="w-4 h-4" /> Not Ideal For
              </h3>
              <ul className="space-y-3">
                {(() => {
                  const notIdealFor: string[] = [];
                  const monthlyIncome = card.eligibility.minIncome / 12;
                  if (card.annualFee >= 2000) notIdealFor.push(`Low spenders under ₹${Math.round(card.annualFee / 12 * 10).toLocaleString('en-IN')}/month`);
                  if (card.eligibility.minIncome > 500000) notIdealFor.push(`Those earning below ₹${(card.eligibility.minIncome / 100000).toFixed(0)}L/year`);
                  if (card.type === 'Travel' || card.type === 'Premium') {
                    notIdealFor.push('Infrequent travelers who won\'t use travel perks');
                    notIdealFor.push('Those who prefer simple cashback over reward points');
                  } else if (card.type === 'Cashback') {
                    notIdealFor.push('Those seeking premium travel benefits');
                    notIdealFor.push('Users who prefer points-based loyalty programs');
                  } else {
                    notIdealFor.push('Power users seeking premium category-specific rewards');
                    notIdealFor.push('Frequent international travelers needing forex benefits');
                  }
                  if (card.annualFee === 0) notIdealFor.push('Those expecting premium perks from a no-fee card');
                  return notIdealFor.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Framework */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <DecisionFramework
                    productId={card.id}
                    productName={card.name}
                    category="credit-cards"
                    affiliateLink={card.applyLink}
                    variant="compact"
                />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <InlineChecker
                    productType="credit_card"
                    cardType={card.annualFee > 5000 ? 'premium' : card.annualFee > 0 ? 'standard' : 'entry'}
                />

                {/* WhatsApp Alerts */}
                <Card className="border-none bg-success-50 dark:bg-success-900/10 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-success-600 text-white rounded-lg group-hover:scale-110 transition-transform">
                        <MessageCircle size={18} />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Rate Alerts</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      Get updates on WhatsApp about <span className="font-bold">{card.name}</span> rates and offers.
                    </p>
                    <WhatsAppAlerts
                      productName={card.name}
                      trigger={
                        <Button className="w-full bg-success-600 hover:bg-success-700 text-white font-black rounded-xl h-12 shadow-lg shadow-success-500/20">
                          Activate via WhatsApp
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
            </div>
        </div>
      </div>

      {/* ─── Main Content (Separated Sections with Anchors) ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="space-y-10">

            {/* ─── Key Features Section ─── */}
            <section id="features" className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
                <CheckCircle2 className="w-6 h-6 text-green-700 dark:text-green-500" />
                Key Features
              </h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {card.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                    <div className="bg-white dark:bg-slate-800 rounded-full p-1 mt-0.5 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-700 dark:text-green-400 flex-shrink-0" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ─── Scoring Breakdown (Methodology-Based) ─── */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-700 dark:text-green-500" />
                InvestingPro Score Breakdown
              </h2>
              {(() => {
                const score = scoreCreditCard(card as unknown as CreditCardType);
                return (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-green-700 dark:bg-green-600 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">{score.overall.toFixed(1)}</span>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">Overall Score</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Out of 10 — based on our methodology</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {score.breakdown.map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{item.score.toFixed(1)}/10</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-green-600 dark:bg-green-500 transition-all"
                              style={{ width: `${(item.score / 10) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-400">Weight: {(item.weight * 100).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                    {score.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {score.tags.map((tag, i) => (
                          <span key={i} className="text-xs font-semibold px-3 py-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </section>

            {/* ─── Rewards Program Section ─── */}
            <section id="rewards" className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
                <Gift className="w-6 h-6 text-green-700 dark:text-green-500" />
                Rewards Program
              </h2>
              <div className="grid gap-3">
                {card.rewardProgram.categories.map((cat, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-green-200 dark:hover:border-green-800 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{cat.rate}</p>
                  </div>
                ))}
              </div>

              {/* Mini Rewards Calculator */}
              <div className="mt-8">
                  <MiniRewardsCalculator
                      annualFee={card.annualFee}
                      rewardRate={card.rewardProgram.pointsPerRupee || 1.5}
                  />
              </div>
            </section>

            {/* ─── Fees & Charges Section ─── */}
            <section id="fees" className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
                <IndianRupee className="w-6 h-6 text-green-700 dark:text-green-500" />
                Fees & Charges
              </h2>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Fee Type</th>
                            <th className="px-6 py-4">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {card.fees.map((fee, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="px-6 py-4">
                                  <div className="font-semibold text-slate-900 dark:text-slate-200">{fee.name}</div>
                                  {fee.details && <div className="text-slate-500 dark:text-slate-500 text-xs mt-0.5">{fee.details}</div>}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-200">{fee.amount}</td>
                          </tr>
                      ))}
                      {/* Total First Year Cost Row */}
                      <tr className="bg-green-50/50 dark:bg-green-950/20 border-t-2 border-green-200 dark:border-green-800">
                          <td className="px-6 py-4">
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-green-700 dark:text-green-500" />
                                Total First Year Cost
                              </div>
                              <div className="text-slate-500 dark:text-slate-500 text-xs mt-0.5">Joining Fee + Annual Fee (Year 1)</div>
                          </td>
                          <td className="px-6 py-4 font-black text-lg text-green-700 dark:text-green-400">
                            {card.joiningFee + card.annualFee === 0 ? 'FREE' : `₹${(card.joiningFee + card.annualFee).toLocaleString('en-IN')}`}
                          </td>
                      </tr>
                    </tbody>
                </table>
              </div>
            </section>

            {/* ─── Eligibility Section ─── */}
            <section id="eligibility" className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
               <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
                  <ShieldCheck className="w-6 h-6 text-green-700 dark:text-green-500" />
                  Eligibility Criteria
               </h2>
               <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Age</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{card.eligibility.minAge}+ Years</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Income</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">₹{(typeof card.eligibility.minIncome === 'number' ? card.eligibility.minIncome / 100000 : 0.25).toFixed(1)}L <span className="text-xs font-normal text-slate-500">/ year</span></p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Documents</p>
                      <div className="flex flex-wrap gap-2">
                          {card.eligibility.requiredDocuments.map((doc, i) => (
                              <span key={i} className="text-xs font-medium px-2 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">{doc}</span>
                          ))}
                      </div>
                  </div>
               </div>

               {/* Document Checklist */}
               <DocumentChecklist
                 documents={CREDIT_CARD_DOCUMENTS}
                 productName={card.name}
               />
            </section>

            {/* ─── Benefits Section ─── */}
            <section className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-green-700 dark:text-green-500" />
                Benefits Breakdown
              </h2>
              <div className="grid gap-8">
                {card.benefits.map((benefit, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                         {benefit.category === 'Travel' && <Plane className="w-5 h-5" />}
                         {benefit.category === 'Dining' && <ShoppingBag className="w-5 h-5" />}
                         {benefit.category === 'Shopping' && <Gift className="w-5 h-5" />}
                         {benefit.category !== 'Travel' && benefit.category !== 'Dining' && benefit.category !== 'Shopping' && <Star className="w-5 h-5" />}
                      </div>
                      {benefit.category}
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {benefit.items.map((item, idx) => (
                        <li key={idx} className="text-slate-600 dark:text-slate-400 flex items-start gap-2 text-sm leading-6">
                          <span className="text-green-600 dark:text-green-400 font-bold mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── Pros & Cons Section ─── */}
            <section id="pros-cons" className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                  {/* Pros */}
                  <div className="p-6 sm:p-8">
                      <h3 className="font-bold text-lg text-green-700 dark:text-green-400 flex items-center gap-2 mb-4">
                          <CheckCircle2 className="w-5 h-5" /> Pros
                      </h3>
                      <ul className="space-y-3">
                          {card.pros.map((pro, index) => (
                              <li key={index} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Cons */}
                  <div className="p-6 sm:p-8">
                      <h3 className="font-bold text-lg text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
                           <XCircle className="w-5 h-5" /> Cons
                      </h3>
                      <ul className="space-y-3">
                          {card.cons.map((con, index) => (
                              <li key={index} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                                  <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                  <span>{con}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
                </div>
            </section>

            {/* ─── Dynamic Compare Links ─── */}
            <section className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-700 dark:text-green-500" />
                Compare {card.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">See how this card stacks up against popular alternatives.</p>
              {(() => {
                const similarProducts = getSimilarProducts(card as any, [], 4);
                const compareLinks = similarProducts
                  .filter((p: any) => p.slug && p.slug !== params.slug)
                  .slice(0, 3)
                  .map((p: any) => ({
                    slug: p.slug,
                    name: p.name,
                    url: `/compare/${params.slug}-vs-${p.slug}`,
                  }));

                return compareLinks.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {compareLinks.map((link: any, i: number) => (
                      <a
                        key={i}
                        href={link.url}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-all group"
                      >
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{card.name} vs</p>
                          <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{link.name}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <ComparisonCTA
                    currentProductSlug={params.slug}
                    currentProductName={card.name}
                    similarProducts={[]}
                  />
                );
              })()}
            </section>

            {/* Related Articles */}
            <RelatedArticles />

            {/* ─── FAQ Section ─── */}
            <section id="faqs" className="scroll-mt-28">
              <FAQAccordion
                  items={CREDIT_CARD_GENERAL_FAQS}
                  className=""
              />
            </section>

            {/* ─── User Reviews ─── */}
            <section id="reviews" className="scroll-mt-28">
              <ProductReviews productSlug={params.slug} productType="credit_card" />
            </section>

            {/* Rating Distribution */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Rating Overview</h3>
              <RatingBreakdown
                distribution={getReviewStats(params.slug).distribution}
                totalReviews={getReviewStats(params.slug).count}
              />
            </section>

            {/* Alternatives Carousel */}
            <AlternativesCarousel
                products={getSimilarProducts(card as any, [], 4)}
                currentProductSlug={params.slug}
                className="mt-0"
            />

            {/* Related Calculators */}
            <RelatedCalculators
                category="credit_card"
                className="mt-0"
            />
          </div>

      </div>

      {/* Related Pages — Internal Linking for SEO */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <RelatedPages
          currentSlug={params.slug}
          category={card.type.toLowerCase()}
          maxLinks={6}
        />
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your wallet?</h2>
          <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto">Apply for the {card.name} today and start earning rewards on every spend.</p>
          <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-primary-600/30 transition-all hover:-translate-y-1">
              Apply Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
          <p className="text-slate-500 text-xs mt-6">Application processed securely by {card.provider}</p>
        </div>
      </div>
      {/* Sticky Mobile CTA */}
      <StickyMobileCTA 
        productName={card.name} 
        providerName={card.provider}
        image={card.image}
        rating={card.rating}
        applyLink={`/go/${params.slug}`} 
      />
    </div>
  )
}
