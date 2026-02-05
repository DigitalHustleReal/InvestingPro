import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  Landmark,
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  Clock,
  Percent,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { getProductBySlug } from '@/lib/products/server-service'

interface FixedDepositDetail {
  id: string
  name: string
  provider: string
  image?: string
  rating: number
  interestRate: string
  seniorCitizenRate: string
  minDeposit: string
  maxDeposit: string
  tenure: string
  description: string
  applyLink: string
  keyFeatures: string[]
  tenureOptions: { tenure: string; rate: string }[]
  eligibility: {
    minAge: number
    requiredDocuments: string[]
  }
  pros: string[]
  cons: string[]
}

async function getFixedDepositData(slug: string): Promise<FixedDepositDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== 'fixed_deposit') return null;

  const features = product.features || {};
  
  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    rating: product.rating.overall,
    interestRate: features.interest_rate || '7.5% p.a.',
    seniorCitizenRate: features.senior_rate || '8.0% p.a.',
    minDeposit: features.min_deposit || '₹1,000',
    maxDeposit: features.max_deposit || 'No Limit',
    tenure: features.tenure || '7 days to 10 years',
    description: product.description || '',
    applyLink: product.affiliate_link || product.official_link || '#',
    keyFeatures: product.features?.key_highlights || product.pros?.slice(0, 5) || [],
    tenureOptions: features.tenure_options || [
      { tenure: '1 Year', rate: '6.8%' },
      { tenure: '2 Years', rate: '7.0%' },
      { tenure: '3 Years', rate: '7.25%' },
      { tenure: '5 Years', rate: '7.5%' }
    ],
    eligibility: {
      minAge: features.min_age || 18,
      requiredDocuments: features.docs || ['PAN Card', 'Aadhaar Card', 'Address Proof']
    },
    pros: product.pros || [],
    cons: product.cons || []
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const fd = await getFixedDepositData(slug)
  
  if (!fd) {
    return { title: 'Fixed Deposit Not Found - InvestingPro' }
  }
  
  return {
    title: `${fd.name} FD Review - Interest Rate ${fd.interestRate} | InvestingPro`,
    description: `${fd.description} Interest Rate: ${fd.interestRate}. Senior Citizen: ${fd.seniorCitizenRate}. Compare and invest online.`,
    keywords: `${fd.name}, ${fd.provider} fixed deposit, FD interest rate, best fixed deposit`,
  }
}

export default async function FixedDepositDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fd = await getFixedDepositData(slug)
  
  if (!fd) {
    notFound()
  }
  
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-success-900 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-500/20 text-success-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Landmark className="w-4 h-4" />
                  Fixed Deposit
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg">{fd.rating}</span>
                  <span className="text-success-200 text-sm">/5</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{fd.name}</h1>
              <p className="text-success-100 mb-6">{fd.provider}</p>
              <p className="text-lg text-success-100 mb-8 max-w-2xl">{fd.description}</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div>
                  <p className="text-sm text-success-200">Interest Rate</p>
                  <p className="text-xl font-bold">{fd.interestRate}</p>
                </div>
                <div>
                  <p className="text-sm text-success-200">Senior Citizen</p>
                  <p className="text-xl font-bold">{fd.seniorCitizenRate}</p>
                </div>
                <div>
                  <p className="text-sm text-success-200">Min Deposit</p>
                  <p className="text-xl font-bold">{fd.minDeposit}</p>
                </div>
                <div>
                  <p className="text-sm text-success-200">Tenure</p>
                  <p className="text-xl font-bold">{fd.tenure.split(' ')[0]}</p>
                </div>
              </div>
            </div>
            
            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <p className="text-sm text-success-200 mb-4">Start earning guaranteed returns</p>
                  <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 text-lg mb-3">
                      Open FD <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="flex items-center justify-center gap-2 text-success-200 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>DICGC Insured up to ₹5 Lakh</span>
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
            {/* Interest Rates by Tenure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-primary-600" />
                  Interest Rates by Tenure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50 dark:bg-slate-800">
                        <th className="text-left py-3 px-4 font-semibold">Tenure</th>
                        <th className="text-right py-3 px-4 font-semibold">Interest Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fd.tenureOptions.map((option, index) => (
                        <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-3 px-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {option.tenure}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-primary-600">{option.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  * Senior citizens get additional 0.25% - 0.50% on these rates
                </p>
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
                  {fd.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
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
                    {fd.pros.map((pro, index) => (
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
                    {fd.cons.map((con, index) => (
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
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-success-600 to-primary-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Start Earning Today</h3>
                  <p className="text-sm text-success-100 mb-4">Guaranteed returns with zero risk</p>
                  <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-success-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Open FD <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
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
                    <p className="text-slate-500">Minimum Age</p>
                    <p className="font-semibold">{fd.eligibility.minAge} years</p>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="font-medium mb-2">Required Documents:</p>
                    <ul className="space-y-1.5">
                      {fd.eligibility.requiredDocuments.map((doc, index) => (
                        <li key={index} className="text-slate-600 dark:text-slate-400 text-xs flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary-500 flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Safety Notice */}
              <Card className="mt-6 bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-secondary-600 flex-shrink-0" />
                    <div className="text-xs text-secondary-800 dark:text-secondary-200">
                      <p className="font-semibold mb-1">Safe Investment</p>
                      <p>Bank FDs are insured by DICGC for up to ₹5 Lakh per depositor per bank.</p>
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
          <h2 className="text-3xl font-bold mb-4">Open {fd.name} Today</h2>
          <p className="text-slate-300 mb-8">Earn guaranteed returns with India's trusted bank!</p>
          <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-12 py-6 text-lg">
              Open FD Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
