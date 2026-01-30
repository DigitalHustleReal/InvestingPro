import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FAQAccordion from '@/components/common/FAQAccordion'
import AuthorByline from '@/components/common/AuthorByline'
import RelatedArticles from '@/components/content/RelatedArticles'
import { CREDIT_CARD_GENERAL_FAQS } from '@/lib/content/seo-content'
import {
  Star,
  Percent,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Calculator,
  Clock,
  FileText,
  AlertTriangle,
  ExternalLink,
  CreditCard,
  Home,
  TrendingDown
} from 'lucide-react'
import DifferentiationCard from '@/components/products/DifferentiationCard'
import { scoreLoan } from '@/lib/products/scoring-rules'
import { Loan } from '@/types'

interface LoanDetail {
  id: string
  name: string
  provider: string
  loanType: string
  rating: number
  interestRateMin:number
  interestRateMax: number
  maxLoanAmount: number
  minLoanAmount: number
  processingFee: string
  maxTenureMonths: number
  minTenureMonths: number
  minCreditScore?: number
  prepaymentCharges: string
  
  description: string
  applyLink: string
  
  // Detailed features
  keyFeatures: string[]
  eligibility: {
    minAge: number
    maxAge: number
    minIncome: number
    employmentType: string[]
    requiredDocuments: string[]
  }
  
  fees: {
    name: string
    amount: string
    details?: string
  }[]
  
  benefits: string[]
  specialOffers?: string
  
  emiExample: {
    loanAmount: number
    tenure: number
    interestRate: number
    emi: number
    totalInterest: number
  }
  
  pros: string[]
  cons: string[]
}

import { getProductBySlug } from '@/lib/products/server-service'

async function getLoanData(slug: string): Promise<LoanDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== 'loan') return null;

  const features = product.features || {};
  
  return {
    id: product.id,
    name: product.name,
    provider: product.provider_name,
    loanType: features.type || 'Personal Loan',
    rating: product.rating,
    interestRateMin: parseFloat(features.rate_min || '10.5'),
    interestRateMax: parseFloat(features.rate_max || '21.0'),
    maxLoanAmount: parseInt(features.max_amount || '4000000'),
    minLoanAmount: parseInt(features.min_amount || '50000'),
    processingFee: features.processing_fee || 'Up to 2.5%',
    maxTenureMonths: parseInt(features.max_tenure_months || '60'),
    minTenureMonths: parseInt(features.min_tenure_months || '12'),
    minCreditScore: parseInt(features.min_score || '750'),
    prepaymentCharges: features.prepayment || '4% + GST',
    
    description: product.description || '',
    applyLink: product.affiliate_link || product.official_link || '#',
    
    keyFeatures: features.key_highlights || product.pros.slice(0, 5) || [],
    eligibility: {
      minAge: features.min_age || 21,
      maxAge: features.max_age || 60,
      minIncome: features.min_income || 25000,
      employmentType: features.employment_types || ['Salaried', 'Self-Employed'],
      requiredDocuments: features.docs || ['PAN Card', 'Aadhaar Card', 'Salary Slips']
    },
    
    fees: features.fee_schedule || [
      { name: 'Processing Fee', amount: features.processing_fee || 'Up to 2.5%' },
      { name: 'Prepayment Charges', amount: features.prepayment || '4% + GST' }
    ],
    
    benefits: features.benefit_items || product.pros.slice(0, 5) || [],
    
    emiExample: features.emi_example || {
      loanAmount: 500000,
      tenure: 36,
      interestRate: 12.5,
      emi: 16680,
      totalInterest: 100480
    },
    
    pros: product.pros,
    cons: product.cons
  };
}

// Enable dynamic rendering for routes not pre-generated
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const loan = await getLoanData(slug)
  
  if (!loan) {
    return {
      title: 'Loan Not Found - InvestingPro',
    }
  }
  
  return {
    title: `${loan.name} - Interest Rate ${loan.interestRateMin}%, Apply Online | InvestingPro`,
    description: `${loan.description} Interest: ${loan.interestRateMin}-${loan.interestRateMax}%. Loan amount: ₹${(loan.maxLoanAmount / 100000).toFixed(0)} Lakh. Rating: ${loan.rating}/5.`,
    keywords: `${loan.name}, ${loan.provider} loan, personal loan, loan interest rate, ${loan.provider.toLowerCase()} loan apply online`,
    openGraph: {
      title: `${loan.name} Review | InvestingPro`,
      description: loan.description,
      type: 'article',
      images: [], // Add loan image if available in future
    },
    alternates: {
      canonical: `/loans/${slug}`,
    }
  }
}

export default async function LoanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loan = await getLoanData(slug)
  
  if (!loan) {
    notFound()
  }
  
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-success-900 to-success-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Loan Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-primary-300 mb-3">
                <IndianRupee className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase">{loan.provider} • {loan.loanType}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{loan.name}</h1>
              <p className="text-lg text-primary-100 mb-6">{loan.description}</p>
              <AuthorByline className="text-primary-100 border-primary-100/20 mb-6" />
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-amber-500 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-white text-white" />
                  <span className="font-bold text-lg">{loan.rating}/5</span>
                </div>
                <span className="text-primary-200">Trusted by 10 Lakh+ Customers</span>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-primary-200">Interest Rate</p>
                  <p className="text-2xl font-bold">{loan.interestRateMin}% - {loan.interestRateMax}%</p>
                </div>
                <div>
                  <p className="text-sm text-primary-200">Max Loan Amount</p>
                  <p className="text-2xl font-bold">₹{(loan.maxLoanAmount / 100000).toFixed(0)}L</p>
                </div>
                <div>
                  <p className="text-sm text-primary-200">Processing Fee</p>
                  <p className="text-2xl font-bold">{loan.processingFee.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-200">Tenure</p>
                  <p className="text-2xl font-bold">{loan.minTenureMonths / 12}-{loan.maxTenureMonths / 12} Years</p>
                </div>
              </div>
            </div>
            
            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <p className="text-sm text-primary-100 mb-4">Get instant approval</p>
                  <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-primary-700 hover:bg-gray-100 font-semibold py-6 text-lg mb-3">
                      Apply Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="bg-primary-700/30 border border-primary-500/50 rounded-lg p-3 text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-primary-200" />
                    <p className="text-sm text-primary-100 font-semibold">Disbursal in 48 hours</p>
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
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* EMI Calculator Example */}
            <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8 text-white">
                  <Calculator className="w-6 h-6" />
                  EMI Calculation Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-primary-200">Loan Amount</p>
                    <p className="text-xl font-bold">₹{(loan.emiExample.loanAmount / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-200">Tenure</p>
                    <p className="text-xl font-bold">{loan.emiExample.tenure} Months</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-200">Interest Rate</p>
                    <p className="text-xl font-bold">{loan.emiExample.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-200">Monthly EMI</p>
                    <p className="text-2xl font-bold text-accent-300">₹{loan.emiExample.emi.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm text-primary-100">Total Interest: ₹{loan.emiExample.totalInterest.toLocaleString()}</p>
                  <p className="text-sm text-primary-100">Total Amount Payable: ₹{(loan.emiExample.loanAmount + loan.emiExample.totalInterest).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
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
                  {loan.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <TrendingDown className="w-6 h-6 text-primary-600" />
                  Loan Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {loan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                {loan.specialOffers && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-amber-900 mb-1">🎁 Special Offer</p>
                    <p className="text-sm text-amber-800">{loan.specialOffers}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary-200 bg-primary-50/30">
                <CardHeader>
                  <CardTitle className="text-primary-700 flex items-center gap-6 md:p-8">
                    <CheckCircle2 className="w-5 h-5" />
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {loan.pros.map((pro, index) => (
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
                    Disadvantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {loan.cons.map((con, index) => (
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
                  <FileText className="w-6 h-6 text-gray-600" />
                  Fees & Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loan.fees.map((fee, index) => (
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
            
            {/* Differentiation Score Card */}
            <DifferentiationCard 
                score={scoreLoan({
                    id: loan.id,
                    slug: slug,
                    name: loan.name,
                    category: 'loan',
                    provider: loan.provider,
                    description: loan.description,
                    rating: loan.rating,
                    reviewsCount: 0,
                    applyLink: loan.applyLink,
                    loanType: (loan.loanType.toLowerCase().includes('home') ? 'home' : 'personal') as any,
                    interestRateMin: loan.interestRateMin,
                    interestRateMax: loan.interestRateMax,
                    interestRateType: 'floating',
                    processingFee: loan.processingFee,
                    prepaymentCharges: loan.prepaymentCharges,
                    maxTenureMonths: loan.maxTenureMonths,
                    maxAmount: loan.maxLoanAmount.toString(),
                    minSalary: loan.eligibility.minIncome,
                    minAge: loan.eligibility.minAge
                })}
                productName={loan.name}
            />

            {/* Apply CTA (Sticky) */}
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-success-600 to-success-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Get Instant Loan</h3>
                  <p className="text-sm text-primary-100 mb-4">Approval in 10 seconds</p>
                  <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-primary-700 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Check Eligibility <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-primary-100 text-center">
                    No impact on credit score • 100% paperless
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
                    <p className="text-gray-600">Age Criteria</p>
                    <p className="font-semibold text-gray-900">{loan.eligibility.minAge} - {loan.eligibility.maxAge} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Minimum Income</p>
                    <p className="font-semibold text-gray-900">₹{(loan.eligibility.minIncome / 1000).toFixed(0)}k/month</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Credit Score</p>
                    <p className="font-semibold text-gray-900">{loan.minCreditScore}+ (Good to Excellent)</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employment Type</p>
                    <div className="space-y-1 mt-1">
                      {loan.eligibility.employmentType.map((type, index) => (
                        <p key={index} className="text-xs text-gray-600">✓ {type}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="font-medium text-gray-900 mb-2">Required Documents:</p>
                    <ul className="space-y-1.5">
                      {loan.eligibility.requiredDocuments.map((doc, index) => (
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
              <Card className="bg-danger-50 border-danger-200">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-danger-800">
                      <p className="font-semibold mb-1">Borrow Responsibly</p>
                      <p>Failure to repay may impact your credit score and lead to legal action. Ensure EMI fits your budget.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <RelatedArticles />
         <FAQAccordion 
            items={CREDIT_CARD_GENERAL_FAQS} 
            title="Personally Loan FAQs"
            className="mb-12"
         />
      </div>

      {/* Bottom CTA */}
      <div className="bg-primary-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Apply for {loan.name} in Minutes</h2>
          <p className="text-primary-200 mb-8">100% digital process • Quick approval • Instant disbursal</p>
          <a href={`/go/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-primary-700 hover:bg-gray-100 font-semibold px-12 py-6 text-lg">
              Check Eligibility Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
