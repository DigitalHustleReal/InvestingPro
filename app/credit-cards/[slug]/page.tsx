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
  ExternalLink
} from 'lucide-react'
import ProductReviews from '@/components/reviews/ProductReviews'
import DifferentiationCard from '@/components/products/DifferentiationCard'
import { scoreCreditCard } from '@/lib/products/scoring-rules'
import { CreditCard as CreditCardType } from '@/types'
import DecisionFramework from '@/components/common/DecisionFramework'
import DecisionCTA from '@/components/common/DecisionCTA'

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

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

async function getCreditCardData(slug: string, useServiceClient: boolean = false): Promise<CreditCardDetail | null> {
  // Use service client for build-time (generateStaticParams), server client for runtime
  const supabase = useServiceClient ? createServiceClient() : await createClient();
  console.log(`[CardPage] Fetching slug: ${slug}`);
  const { data: card, error } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('slug', slug)
    .single();

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
  }
}

export default async function CreditCardDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const card = await getCreditCardData(params.slug, false) // Use server client for runtime
  
  if (!card) {
    notFound()
  }
  
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Card Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-primary-400 mb-3">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase">{card.provider}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{card.name}</h1>
              <p className="text-lg text-slate-300 mb-6">{card.description}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-amber-500 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-white text-white" />
                  <span className="font-bold text-lg">{card.rating}/5</span>
                </div>
                <span className="text-slate-300">Highly Rated</span>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Annual Fee</p>
                  <p className="text-xl font-bold">₹{card.annualFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Reward Rate</p>
                  <p className="text-xl font-bold text-primary-400">{card.rewardRate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Min Credit Score</p>
                  <p className="text-xl font-bold">{card.minCreditScore}+</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Interest Rate</p>
                  <p className="text-xl font-bold">{card.interestRate.split(' ')[0]}</p>
                </div>
              </div>
            </div>
            
            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <p className="text-sm text-slate-300 mb-4">Start your application now</p>
                  <DecisionCTA
                    text="Apply Instantly"
                    href={card.applyLink}
                    productId={card.id}
                    variant="primary"
                    size="lg"
                    className="w-full h-14 text-lg font-bold mb-3"
                    isExternal={!!card.applyLink}
                    showIcon={true}
                  />
                  {card.welcomeBonus && (
                    <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-6 md:p-8 text-center">
                      <Gift className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                      <p className="text-sm text-amber-100 font-semibold">{card.welcomeBonus}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decision Framework */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <DecisionFramework
          productId={card.id}
          productName={card.name}
          category="credit-cards"
          affiliateLink={card.applyLink}
          variant="compact"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <CheckCircle2 className="w-6 h-6 text-primary-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {card.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Rewards Program */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <Gift className="w-6 h-6 text-primary-600" />
                  Rewards Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{card.rewardProgram.name}</h3>
                <p className="text-gray-600 mb-4">
                  Earn <strong>{card.rewardProgram.pointsPerRupee} points per ₹150</strong> spent. 
                  Redemption value: {card.rewardProgram.redemptionValue}
                </p>
                
                <div className="space-y-3">
                  {card.rewardProgram.categories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-6 md:p-8 bg-slate-50 rounded-lg">
                      <span className="font-medium text-gray-700">{cat.name}</span>
                      <span className="text-primary-600 font-semibold">{cat.rate}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Benefits by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {card.benefits.map((benefit, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        {benefit.category === 'Travel' && <Plane className="w-5 h-5 text-primary-600" />}
                        {benefit.category === 'Dining' && <ShoppingBag className="w-5 h-5 text-accent-600" />}
                        {benefit.category === 'Shopping' && <Gift className="w-5 h-5 text-primary-600" />}
                        {benefit.category}
                      </h3>
                      <ul className="space-y-2 ml-7">
                        {benefit.items.map((item, idx) => (
                          <li key={idx} className="text-gray-600 flex items-start gap-2">
                            <span className="text-primary-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary-200 bg-primary-50/30">
                <CardHeader>
                  <CardTitle className="text-primary-700 flex items-center gap-6 md:p-8">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {card.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-1" />
                        <span className="text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-danger-200 bg-danger-50/30">
                <CardHeader>
                  <CardTitle className="text-danger-700 flex items-center gap-6 md:p-8">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {card.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <XCircle className="w-4 h-4 text-danger-600 flex-shrink-0 mt-1" />
                        <span className="text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Fees & Charges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <IndianRupee className="w-6 h-6 text-gray-600" />
                  Fees & Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {card.fees.map((fee, index) => (
                    <div key={index} className="flex items-start justify-between p-6 md:p-8 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{fee.name}</p>
                        {fee.details && <p className="text-sm text-gray-500 mt-1">{fee.details}</p>}
                      </div>
                      <p className="font-semibold text-gray-900 ml-4">{fee.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Reviews */}
            <ProductReviews productSlug={params.slug} productType="credit_card" />
          </div>
          
          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Differentiation Score Card */}
            <DifferentiationCard 
                score={scoreCreditCard({
                    id: card.id,
                    slug: params.slug,
                    name: card.name,
                    category: 'credit_card',
                    type: (card.type?.toLowerCase() as any) || 'rewards',
                    provider: card.provider,
                    description: card.description,
                    rating: card.rating,
                    reviewsCount: 0,
                    applyLink: card.applyLink,
                    joiningFee: card.joiningFee,
                    annualFee: card.annualFee,
                    rewardRate: card.rewardRate,
                    features: card.keyFeatures,
                    pros: card.pros,
                    cons: card.cons,
                    loungeAccess: card.pros.find((p: string) => p.toLowerCase().includes('lounge')) || ''
                })}
                productName={card.name}
            />

            {/* Apply CTA (Sticky) */}
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
                  <p className="text-sm text-primary-100 mb-4">Get instant approval decision online</p>
                  <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-primary-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Apply Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-primary-100 text-center">
                    Secure application • 2-3 min process
                  </p>
                </CardContent>
              </Card>
              
              {/* Eligibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-6 md:p-8">
                    <ShieldCheck className="w-5 h-5 text-primary-600" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-gray-600">Minimum Age</p>
                    <p className="font-semibold text-gray-900">{card.eligibility.minAge} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Minimum Income</p>
                    <p className="font-semibold text-gray-900">₹{(card.eligibility.minIncome / 100000).toFixed(1)} Lakh/year</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Credit Score</p>
                    <p className="font-semibold text-gray-900">{card.minCreditScore}+ (Good to Excellent)</p>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="font-medium text-gray-900 mb-2">Required Documents:</p>
                    <ul className="space-y-1.5">
                      {card.eligibility.requiredDocuments.map((doc, index) => (
                        <li key={index} className="text-gray-600 text-xs flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary-500 flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Important Notice */}
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800">
                      <p className="font-semibold mb-1">Important</p>
                      <p>Credit approval is subject to the bank's discretion. Interest charges apply on unpaid balances. Borrow responsibly.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Apply for {card.name} Today</h2>
          <p className="text-slate-300 mb-8">Join thousands of satisfied cardholders. Apply online in minutes!</p>
          <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-12 py-6 text-lg">
              Apply Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
