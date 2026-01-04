import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  CreditCard, 
  Percent, 
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  Gift,
  Plane,
  ShoppingBag,
  Fuel,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface CreditCardDetail {
  id: string
  name: string
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

import { getProductBySlug } from '@/lib/products/server-service'

async function getCreditCardData(slug: string): Promise<CreditCardDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== 'credit_card') return null;

  // Map Supabase Product to CreditCardDetail
  const features = product.features || {};
  
  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    rating: product.rating,
    annualFee: parseInt(String(features.annual_fee || '0').replace(/[^0-9]/g, '')) || 0,
    joiningFee: parseInt(String(features.joining_fee || '0').replace(/[^0-9]/g, '')) || 0,
    rewardRate: features.rewards || 'Standard rewards',
    welcomeBonus: features.welcome_bonus,
    minCreditScore: features.min_score || 700,
    interestRate: features.interest_rate || '3.5% pm',
    description: product.description || '',
    applyLink: product.affiliate_link || product.official_link || '#',
    
    keyFeatures: product.features.key_highlights || product.pros.slice(0, 5) || [],
    rewardProgram: {
      name: features.reward_program_name || `${product.name} Rewards`,
      pointsPerRupee: features.points_per_100 || 2,
      redemptionValue: features.point_value || '1 point = ₹0.25',
      categories: features.reward_categories || [
        { name: 'Dining', rate: features.dining_rate || '3x points' },
        { name: 'Shopping', rate: features.shopping_rate || '2x points' },
        { name: 'Travel', rate: features.travel_rate || '2x points' },
      ]
    },
    benefits: features.benefit_structure || [
      {
        category: 'Travel',
        items: features.travel_benefits || ['Airport lounge access', 'Travel insurance']
      },
      {
        category: 'Dining',
        items: features.dining_benefits || ['Dining discounts', 'Complimentary meals']
      }
    ],
    eligibility: {
      minAge: features.min_age || 21,
      minIncome: features.min_income || 300000,
      requiredDocuments: features.docs || ['PAN Card', 'Aadhaar Card', 'Salary Slips']
    },
    fees: features.fee_schedule || [
      { name: 'Joining Fee', amount: `₹${features.joining_fee || '0'}`, details: features.joining_waiver },
      { name: 'Annual Fee', amount: `₹${features.annual_fee || '0'}`, details: features.annual_waiver },
      { name: 'Markup Fee', amount: features.forex_fee || '3.5%', details: 'On international spends' }
    ],
    pros: product.pros,
    cons: product.cons
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const card = await getCreditCardData(params.slug)
  
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

export default async function CreditCardDetailPage({ params }: { params: { slug: string } }) {
  const card = await getCreditCardData(params.slug)
  
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
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
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
                  <p className="text-xl font-bold text-emerald-400">{card.rewardRate}</p>
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
                  <a href={card.applyLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary-600 hover:bg-emerald-700 text-white font-semibold py-6 text-lg mb-3">
                      Apply Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
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
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {card.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
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
                  <Gift className="w-6 h-6 text-purple-600" />
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
                      <span className="text-emerald-600 font-semibold">{cat.rate}</span>
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
                        {benefit.category === 'Dining' && <ShoppingBag className="w-5 h-5 text-orange-600" />}
                        {benefit.category === 'Shopping' && <Gift className="w-5 h-5 text-purple-600" />}
                        {benefit.category}
                      </h3>
                      <ul className="space-y-2 ml-7">
                        {benefit.items.map((item, idx) => (
                          <li key={idx} className="text-gray-600 flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
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
              <Card className="border-emerald-200 bg-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-emerald-700 flex items-center gap-6 md:p-8">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {card.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-1" />
                        <span className="text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 bg-red-50/30">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-6 md:p-8">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {card.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
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
          </div>
          
          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Apply CTA (Sticky) */}
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
                  <p className="text-sm text-emerald-100 mb-4">Get instant approval decision online</p>
                  <a href={card.applyLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Apply Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-emerald-100 text-center">
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
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
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
          <a href={card.applyLink} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-600 hover:bg-emerald-700 text-white font-semibold px-12 py-6 text-lg">
              Apply Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
