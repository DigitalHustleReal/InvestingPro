import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  Shield,
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  Heart,
  Car,
  Home,
  AlertCircle,
  ExternalLink,
  Users,
  FileText
} from 'lucide-react'
import { getProductBySlug } from '@/lib/products/server-service'

interface InsuranceDetail {
  id: string
  name: string
  provider: string
  image?: string
  rating: number
  insuranceType: string
  coverAmount: string
  premium: string
  claimSettlementRatio: string
  description: string
  applyLink: string
  keyFeatures: string[]
  coverageDetails: string[]
  exclusions: string[]
  eligibility: {
    minAge: number
    maxAge: number
    requiredDocuments: string[]
  }
  premiumDetails: { name: string; amount: string }[]
  pros: string[]
  cons: string[]
}

async function getInsuranceData(slug: string): Promise<InsuranceDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== 'insurance') return null;

  const features = product.features || {};
  
  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    image: product.image_url || undefined,
    rating: product.rating,
    insuranceType: features.insurance_type || 'Life Insurance',
    coverAmount: features.cover_amount || '₹1 Crore',
    premium: features.premium || '₹500/month',
    claimSettlementRatio: features.claim_ratio || '98%',
    description: product.description || '',
    applyLink: product.affiliate_link || product.official_link || '#',
    keyFeatures: product.features?.key_highlights || product.pros?.slice(0, 5) || [],
    coverageDetails: features.coverage || ['Death Benefit', 'Terminal Illness', 'Accidental Death'],
    exclusions: features.exclusions || ['Suicide within 1 year', 'Pre-existing conditions'],
    eligibility: {
      minAge: features.min_age || 18,
      maxAge: features.max_age || 65,
      requiredDocuments: features.docs || ['ID Proof', 'Address Proof', 'Medical Reports']
    },
    premiumDetails: [
      { name: 'Monthly Premium', amount: features.monthly_premium || features.premium || 'Varies' },
      { name: 'Annual Premium', amount: features.annual_premium || 'Varies' },
      { name: 'Cover Amount', amount: features.cover_amount || '₹1 Crore' }
    ],
    pros: product.pros || [],
    cons: product.cons || []
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const insurance = await getInsuranceData(params.slug)
  
  if (!insurance) {
    return { title: 'Insurance Not Found - InvestingPro' }
  }
  
  return {
    title: `${insurance.name} Review - Coverage, Premium & Buy Online | InvestingPro`,
    description: `${insurance.description} Rating: ${insurance.rating}/5. Claim Ratio: ${insurance.claimSettlementRatio}. Compare and buy online.`,
    keywords: `${insurance.name}, ${insurance.provider} insurance, ${insurance.insuranceType}, buy insurance online`,
  }
}

export default async function InsuranceDetailPage({ params }: { params: { slug: string } }) {
  const insurance = await getInsuranceData(params.slug)
  
  if (!insurance) {
    notFound()
  }

  const getInsuranceIcon = () => {
    const type = insurance.insuranceType.toLowerCase();
    if (type.includes('health')) return Heart;
    if (type.includes('motor') || type.includes('car')) return Car;
    if (type.includes('home')) return Home;
    return Shield;
  };
  const InsuranceIcon = getInsuranceIcon();
  
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 to-violet-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <InsuranceIcon className="w-4 h-4" />
                  {insurance.insuranceType}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg">{insurance.rating}</span>
                  <span className="text-purple-200 text-sm">/5</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{insurance.name}</h1>
              <p className="text-purple-100 mb-6">{insurance.provider}</p>
              <p className="text-lg text-purple-100 mb-8 max-w-2xl">{insurance.description}</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div>
                  <p className="text-sm text-purple-200">Cover Amount</p>
                  <p className="text-xl font-bold">{insurance.coverAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-200">Premium</p>
                  <p className="text-xl font-bold">{insurance.premium}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-200">Claim Ratio</p>
                  <p className="text-xl font-bold">{insurance.claimSettlementRatio}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-200">Type</p>
                  <p className="text-xl font-bold">{insurance.insuranceType.split(' ')[0]}</p>
                </div>
              </div>
            </div>
            
            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <p className="text-sm text-purple-200 mb-4">Get covered in minutes</p>
                  <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 text-lg mb-3">
                      Get Quote <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="flex items-center justify-center gap-2 text-purple-200 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>IRDAI Approved • Instant Policy</span>
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
            {/* Coverage Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  What's Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insurance.coverageDetails.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insurance.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Exclusions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  What's Not Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insurance.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="bg-green-50 dark:bg-green-900/20">
                  <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Pros
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {insurance.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader className="bg-red-50 dark:bg-red-900/20">
                  <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cons
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {insurance.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
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
              <Card className="bg-gradient-to-br from-purple-600 to-violet-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Protect Your Family</h3>
                  <p className="text-sm text-purple-100 mb-4">Get instant quotes now</p>
                  <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Get Quote <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
              
              {/* Eligibility */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-slate-500">Age Requirement</p>
                    <p className="font-semibold">{insurance.eligibility.minAge} - {insurance.eligibility.maxAge} years</p>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="font-medium mb-2">Required Documents:</p>
                    <ul className="space-y-1.5">
                      {insurance.eligibility.requiredDocuments.map((doc, index) => (
                        <li key={index} className="text-slate-600 dark:text-slate-400 text-xs flex items-start gap-2">
                          <FileText className="w-3 h-3 text-primary-500 flex-shrink-0 mt-0.5" />
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
                      <p className="font-semibold mb-1">Important</p>
                      <p>Insurance is subject to terms and conditions. Please read the policy document carefully before buying.</p>
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
          <h2 className="text-3xl font-bold mb-4">Secure Your Future with {insurance.name}</h2>
          <p className="text-slate-300 mb-8">Get comprehensive coverage at the best rates!</p>
          <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-12 py-6 text-lg">
              Get Free Quote <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
