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
  UtensilsCrossed,
  ShoppingCart,
  Sparkles,
  MessageCircle
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
    
    keyFeatures: card.pros || [],
    rewardProgram: {
      name: `${card.name} Rewards`,
      pointsPerRupee: 2, // Default
      redemptionValue: 'Variable',
      categories: [
        { name: 'General Spends', rate: '2 points/₹150' },
        { name: 'Accelerated', rate: '5x - 10x points' }
      ]
    },
    benefits: [
      {
        category: 'Core Benefits',
        items: card.pros || ['Reward Points', 'Fuel Surcharge Waiver']
      },
      {
        category: isTravel ? 'Travel' : (isShopping ? 'Shopping' : 'Lifestyle'),
        items: isTravel 
          ? ['Airport Lounge Access', 'Travel Insurance'] 
          : (isShopping 
              ? ['Cashback on Spends', 'Discount Vouchers'] 
              : ['Dining Discounts', 'Movie Offers'])
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

// Force static generation with ISR (Incremental Static Regeneration)
export const dynamic = 'force-static';
// Revalidate every hour to keep data fresh while maintaining static benefits
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
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - The "Decision Layer" */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <AutoBreadcrumbs />
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                
                {/* Visual Anchor (Left) */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                    <div className="aspect-[1.586/1] w-full relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 ring-1 ring-gray-900/10">
                         {card.image ? (
                           <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                              <span className="text-white font-bold text-2xl">{card.provider}</span>
                           </div>
                         )}
                         {/* Best For Tag overlay */}
                         <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-sm border border-white/20 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                            Best for {card.type}
                         </div>
                    </div>

                    {/* Approval Odds Meter (Indian Context Mechanics) */}
                    <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Approval Odds</p>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                             {/* Mock logic for visualization - typically would be dynamic based on user profile */}
                             <div className={`h-full rounded-full ${card.minCreditScore && card.minCreditScore > 750 ? 'w-1/3 bg-red-500' : 'w-3/4 bg-green-500'}`}></div>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                             {card.minCreditScore && card.minCreditScore > 750 ? 'Excellent Credit Req.' : 'Good Chance'} 
                             <span className="text-gray-400 font-normal ml-1">({card.minCreditScore}+)</span>
                        </p>
                    </div>
                </div>

                {/* Decision Data (Right) */}
                <div className="flex-1 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="text-blue-600 font-bold tracking-tight text-xs uppercase">{card.provider} Bank</span>
                            <div className="flex items-center gap-2">
                                <TrustBadge type="verified" />
                                <TrustBadge type="fact-checked" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 font-heading">
                            {card.name}
                        </h1>

                        {/* Pre-Launch Critical: Affiliate Disclosure above the fold */}
                        <div className="mb-6">
                           <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="bg-gray-50 border-gray-200 rounded-lg p-3 max-w-fit" />
                        </div>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                            {card.description}
                        </p>
                        <AuthorByline />
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
                    <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6">
                        <div>
                           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Annual Fee</p>
                           <p className="text-xl font-bold text-gray-900">₹{card.annualFee}</p>
                           <p className="text-xs text-gray-400">+ GST</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Reward Value</p>
                           <p className="text-xl font-bold text-green-600">~1.5% - 3.3%</p>
                           <p className="text-xs text-gray-400">Real Return</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Rating</p>
                           <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <span className="text-xl font-bold text-gray-900">{card.rating}</span>
                                <span className="text-sm text-gray-400">/5</span>
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
                            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-xl shadow-green-600/20 transition-all hover:scale-105 active:scale-95">
                                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </a>
                        <Button variant="outline" className="h-auto py-3 px-6 rounded-xl border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                            Check Eligibility
                        </Button>
                    </div>
                    
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> 
                        Secure application via {card.provider} official site.
                    </p>
                </div>
            </div>
        </div>
      </div>
      
      {/* Decision Framework */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
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

                {/* WhatsApp Alerts - NEW */}
                <Card className="border-none bg-green-50 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-600 text-white rounded-lg group-hover:scale-110 transition-transform">
                        <MessageCircle size={18} />
                      </div>
                      <h4 className="font-bold text-gray-900">Rate Alerts</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                      Get updates on WhatsApp about <span className="font-bold">{card.name}</span> rates and offers.
                    </p>
                    <WhatsAppAlerts 
                      productName={card.name} 
                      trigger={
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-black rounded-xl h-12 shadow-lg shadow-green-500/20">
                          Activate via WhatsApp
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
            </div>
        </div>
      </div>

      {/* Main Content (Single Column "One Big Page") */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="space-y-12">
            
            {/* Unified Editorial Card */}
            <Card className="p-8 space-y-12 shadow-xl shadow-gray-200/50">
              
              {/* Key Features Section */}
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-900">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Key Features
                </h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {card.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <div className="bg-white rounded-full p-1 mt-0.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      </div>
                      <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <hr className="border-gray-100" />

              <hr className="border-gray-100" />

              <div className="p-8 bg-gray-50 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Rating Overview</h3>
                <RatingBreakdown 
                  distribution={getReviewStats(params.slug).distribution}
                  totalReviews={getReviewStats(params.slug).count}
                />
              </div>
              
              <hr className="border-gray-100" />

              {/* Eligibility Section (Moved from Sidebar) */}
              <section>
                 <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-900">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                    Eligibility Criteria
                 </h2>
                 <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Age</p>
                        <p className="text-xl font-bold text-gray-900">{card.eligibility.minAge}+ Years</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Income</p>
                        <p className="text-xl font-bold text-gray-900">₹{(typeof card.eligibility.minIncome === 'number' ? card.eligibility.minIncome / 100000 : 0.25).toFixed(1)}L <span className="text-xs font-normal text-gray-500">/ year</span></p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Documents</p>
                        <div className="flex flex-wrap gap-2">
                            {card.eligibility.requiredDocuments.map((doc, i) => (
                                <span key={i} className="text-xs font-medium px-2 py-1 bg-white rounded border border-gray-200">{doc}</span>
                            ))}
                        </div>
                    </div>
                 </div>
              </section>

              <hr className="border-gray-100" />

              {/* Rewards Program Section */}
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-900">
                  <Gift className="w-6 h-6 text-green-600" />
                  Rewards Program
                </h2>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-6">
                   <h3 className="font-bold text-xl mb-2 text-gray-900">{card.rewardProgram.name}</h3>
                   <p className="text-gray-600">
                     Earn <strong className="text-green-700">{card.rewardProgram.pointsPerRupee} points per ₹150</strong> spent. 
                     Redemption value: {card.rewardProgram.redemptionValue}
                   </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {card.rewardProgram.categories.map((cat, index) => (
                    <div key={index} className="flex flex-col p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{cat.name}</span>
                          {/* Visual Trust Concept: Simulated Brand Icons */}
                          {cat.name.includes("Dining") && <div className="flex gap-1"><UtensilsCrossed className="w-4 h-4 text-orange-500" /></div>}
                          {cat.name.includes("Travel") && <div className="flex gap-1"><Plane className="w-4 h-4 text-blue-500" /></div>}
                          {cat.name.includes("Online") && <div className="flex gap-1"><ShoppingCart className="w-4 h-4 text-amazon-500 text-[#FF9900]" /></div>}
                      </div>
                      <span className="text-green-700 font-bold text-lg">{cat.rate}</span>
                    </div>
                  ))}
                </div>

                {/* Mini Rewards Calculator - NEW */}
                <div className="mt-8">
                    <MiniRewardsCalculator 
                        annualFee={card.annualFee}
                        rewardRate={card.rewardProgram.pointsPerRupee || 1.5}
                    />
                </div>
              </section>

              <hr className="border-gray-100" />
            
              {/* Benefits Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Benefits Breakdown</h2>
                <div className="grid gap-8">
                  {card.benefits.map((benefit, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                           {benefit.category === 'Travel' && <Plane className="w-5 h-5" />}
                           {benefit.category === 'Dining' && <ShoppingBag className="w-5 h-5" />}
                           {benefit.category === 'Shopping' && <Gift className="w-5 h-5" />}
                           {benefit.category !== 'Travel' && benefit.category !== 'Dining' && benefit.category !== 'Shopping' && <Star className="w-5 h-5" />}
                        </div>
                        {benefit.category}
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {benefit.items.map((item, idx) => (
                          <li key={idx} className="text-gray-600 flex items-start gap-2 text-sm leading-6">
                            <span className="text-green-500 font-bold mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pros & Cons Section (Embedded) */}
              <section className="bg-gray-50/50 rounded-2xl p-2 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {/* Pros */}
                    <div className="p-6">
                        <h3 className="font-bold text-lg text-green-700 flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5" /> Pros
                        </h3>
                        <ul className="space-y-3">
                            {card.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cons */}
                    <div className="p-6">
                        <h3 className="font-bold text-lg text-red-700 flex items-center gap-2 mb-4">
                             <XCircle className="w-5 h-5" /> Cons
                        </h3>
                        <ul className="space-y-3">
                            {card.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                    <span>{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                  </div>
              </section>

              <hr className="border-gray-100" />

              {/* Comparison CTA - NEW */}
              <ComparisonCTA 
                currentProductSlug={params.slug}
                currentProductName={card.name}
                similarProducts={[
                  // TODO: Fetch similar products dynamically
                  { slug: 'hdfc-regalia', name: 'HDFC Regalia' },
                  { slug: 'sbi-simplysave', name: 'SBI SimplySAVE' }
                ]}
              />

              <hr className="border-gray-100" />

              {/* Document Checklist - NEW */}
              <DocumentChecklist 
                documents={CREDIT_CARD_DOCUMENTS}
                productName={card.name}
              />

              <hr className="border-gray-100" />

              {/* Fees Section */}
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-900">
                  <IndianRupee className="w-6 h-6 text-gray-700" />
                  Fees & Charges
                </h2>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                          <tr>
                              <th className="px-6 py-4">Fee Type</th>
                              <th className="px-6 py-4">Amount</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {card.fees.map((fee, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{fee.name}</div>
                                    {fee.details && <div className="text-gray-500 text-xs mt-0.5">{fee.details}</div>}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">{fee.amount}</td>
                            </tr>
                        ))}
                      </tbody>
                  </table>
                </div>
              </section>

            </Card>

            {/* Related Articles */}
            <RelatedArticles />

            {/* FAQ Section */}
            <FAQAccordion 
                items={CREDIT_CARD_GENERAL_FAQS} 
                className="my-12"
            />

            {/* User Reviews */}
            <ProductReviews productSlug={params.slug} productType="credit_card" />

            {/* Alternatives Carousel - NEW */}
            <AlternativesCarousel 
                products={getSimilarProducts(card as any, [], 4)} // Passing empty array for now, will need actual products list
                currentProductSlug={params.slug}
                className="mt-12"
            />

            {/* Related Calculators - NEW */}
            <RelatedCalculators 
                category="credit_card"
                className="mt-12"
            />
          </div>
          
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your wallet?</h2>
          <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto">Apply for the {card.name} today and start earning rewards on every spend.</p>
          <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-500 text-white font-bold px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-green-600/30 transition-all hover:-translate-y-1">
              Apply Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
          <p className="text-gray-500 text-xs mt-6">Application processed securely by {card.provider}</p>
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
