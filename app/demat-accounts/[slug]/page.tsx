import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  TrendingUp,
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  Smartphone,
  BarChart3,
  AlertCircle,
  ExternalLink,
  Clock,
  Zap
} from 'lucide-react'
import { getProductBySlug } from '@/lib/products/server-service'

interface DematAccountDetail {
  id: string
  name: string
  provider: string
  image?: string
  rating: number
  accountOpeningFee: number
  annualMaintenanceFee: number
  equityDeliveryBrokerage: string
  intradayBrokerage: string
  description: string
  applyLink: string
  keyFeatures: string[]
  tradingPlatforms: string[]
  researchTools: string[]
  eligibility: {
    minAge: number
    requiredDocuments: string[]
  }
  fees: { name: string; amount: string; details?: string }[]
  pros: string[]
  cons: string[]
}

async function getDematAccountData(slug: string): Promise<DematAccountDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== 'demat_account') return null;

  const features = product.features || {};
  
  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    rating: product.rating.overall,
    accountOpeningFee: parseInt(String(features.account_opening_fee || '0').replace(/[^0-9]/g, '')) || 0,
    annualMaintenanceFee: parseInt(String(features.amc || '0').replace(/[^0-9]/g, '')) || 0,
    equityDeliveryBrokerage: features.equity_delivery || 'Zero',
    intradayBrokerage: features.intraday_brokerage || '₹20 per order',
    description: product.description || '',
    applyLink: product.affiliate_link || product.official_link || '#',
    keyFeatures: product.features?.key_highlights || product.pros?.slice(0, 5) || [],
    tradingPlatforms: features.platforms || ['Web', 'Mobile App', 'Desktop'],
    researchTools: features.research_tools || ['Charts', 'Screeners', 'News'],
    eligibility: {
      minAge: features.min_age || 18,
      requiredDocuments: features.docs || ['PAN Card', 'Aadhaar Card', 'Bank Statement']
    },
    fees: [
      { name: 'Account Opening', amount: `₹${features.account_opening_fee || '0'}` },
      { name: 'Annual Maintenance', amount: `₹${features.amc || '0'}` },
      { name: 'Equity Delivery', amount: features.equity_delivery || 'Zero' },
      { name: 'Intraday/F&O', amount: features.intraday_brokerage || '₹20/order' }
    ],
    pros: product.pros || [],
    cons: product.cons || []
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const account = await getDematAccountData(slug)
  
  if (!account) {
    return { title: 'Demat Account Not Found - InvestingPro' }
  }
  
  return {
    title: `${account.name} Review - Features, Fees & Open Account Online | InvestingPro`,
    description: `${account.description} Rating: ${account.rating}/5. Brokerage: ${account.equityDeliveryBrokerage}. Compare features and open account online.`,
    keywords: `${account.name}, ${account.provider} demat account, trading account, stock broker review`,
  }
}

export default async function DematAccountDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const account = await getDematAccountData(slug)
  
  if (!account) {
    notFound()
  }
  
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-secondary-500/20 text-secondary-200 px-3 py-1 rounded-full text-sm font-medium">
                  Demat Account
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg">{account.rating}</span>
                  <span className="text-secondary-200 text-sm">/5</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{account.name}</h1>
              <p className="text-secondary-100 mb-6">{account.provider}</p>
              <p className="text-lg text-secondary-100 mb-8 max-w-2xl">{account.description}</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div>
                  <p className="text-sm text-secondary-200">Account Opening</p>
                  <p className="text-xl font-bold">₹{account.accountOpeningFee}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-200">AMC</p>
                  <p className="text-xl font-bold">₹{account.annualMaintenanceFee}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-200">Equity Delivery</p>
                  <p className="text-xl font-bold">{account.equityDeliveryBrokerage}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-200">Intraday</p>
                  <p className="text-xl font-bold">{account.intradayBrokerage}</p>
                </div>
              </div>
            </div>
            
            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <p className="text-sm text-secondary-200 mb-4">Open your demat account in 15 minutes</p>
                  <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 text-lg mb-3">
                      Open Account <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="flex items-center justify-center gap-2 text-secondary-200 text-sm">
                    <Zap className="w-4 h-4" />
                    <span>100% Digital • Paperless KYC</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trading Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary-600" />
                  Trading Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {account.tradingPlatforms.map((platform, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <Smartphone className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                      <p className="font-medium">{platform}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {account.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-primary-600" />
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-semibold">Fee Type</th>
                        <th className="text-right py-3 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {account.fees.map((fee, index) => (
                        <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-3 text-slate-600 dark:text-slate-400">{fee.name}</td>
                          <td className="py-3 text-right font-semibold">{fee.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-success-200 dark:border-success-800">
                <CardHeader className="bg-success-50 dark:bg-success-900/20">
                  <CardTitle className="text-success-700 dark:text-success-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {account.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-danger-200 dark:border-danger-800">
                <CardHeader className="bg-danger-50 dark:bg-danger-900/20">
                  <CardTitle className="text-danger-700 dark:text-danger-400 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {account.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Sticky CTA */}
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-secondary-600 to-secondary-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Ready to Start Trading?</h3>
                  <p className="text-sm text-secondary-100 mb-4">Open your account in minutes</p>
                  <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-secondary-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Open Account <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-secondary-100 text-center">
                    Free account opening • 2-3 min process
                  </p>
                </CardContent>
              </Card>
              
              {/* Eligibility */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary-600" />
                    Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Minimum Age</p>
                    <p className="font-semibold">{account.eligibility.minAge} years</p>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="font-medium mb-2">Required Documents:</p>
                    <ul className="space-y-1.5">
                      {account.eligibility.requiredDocuments.map((doc, index) => (
                        <li key={index} className="text-slate-600 dark:text-slate-400 text-xs flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary-500 flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Disclaimer */}
              <Card className="mt-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-xs text-amber-800 dark:text-amber-200">
                      <p className="font-semibold mb-1">Investment Risk</p>
                      <p>Trading in securities market is subject to market risks. Read all related documents before investing.</p>
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
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Investing with {account.name}</h2>
          <p className="text-slate-300 mb-8">Join millions of investors. Open your account today!</p>
          <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-12 py-6 text-lg">
              Open Free Account <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
