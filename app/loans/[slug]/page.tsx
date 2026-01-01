import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

// This would normally come from database or API
async function getLoanData(slug: string): Promise<LoanDetail | null> {
  // TODO: Replace with actual database query
  const mockLoans: Record<string, LoanDetail> = {
    'hdfc-personal-loan': {
      id: 'hdfc-personal-loan',
      name: 'HDFC Bank Personal Loan',
      provider: 'HDFC Bank',
      loanType: 'Personal Loan',
      rating: 4.3,
      interestRateMin: 10.5,
      interestRateMax: 21.0,
      maxLoanAmount: 4000000,
      minLoanAmount: 50000,
      processingFee: 'Upto 2.5% of loan amount',
      maxTenureMonths: 60,
      minTenureMonths: 12,
      minCreditScore: 750,
      prepaymentCharges: '4% + GST (reducing annually)',
      
      description: 'Get instant personal loan approval from HDFC Bank with minimal documentation. Quick disbursal within 48 hours for salaried and self-employed individuals.',
      applyLink: 'https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan',
      
      keyFeatures: [
        'Instant loan approval in 10 seconds (for pre-approved customers)',
        'Minimal documentation required',
        'Flexible repayment tenure (1-5 years)',
        'No collateral or security needed',
        'Quick disbursal within 48 hours',
        'Special interest rates for existing HDFC customers',
        'Balance transfer facility available'
      ],
      
      eligibility: {
        minAge: 21,
        maxAge: 60,
        minIncome: 25000,
        employmentType: ['Salaried', 'Self-Employed Professional', 'Self-Employed Business Owner'],
        requiredDocuments: [
          'PAN Card (mandatory)',
          'Aadhaar Card / Voter ID / Passport',
          'Latest 3 months salary slips (salaried)',
          'Latest 6 months bank statements',
          'Latest 2 years ITR with computation (self-employed)',
          'Current residence proof',
          'Passport size photographs'
        ]
      },
      
      fees: [
        { name: 'Processing Fee', amount: 'Up to 2.5%', details: 'Of loan amount + GST' },
        { name: 'Prepayment Charges', amount: '4% + GST', details: 'Reduces annually (Year 1: 4%, Year 2: 3%, Year 3+: 2%)' },
        { name: 'Late Payment Penalty', amount: '2% per month', details: 'On overdue amount' },
        { name: 'Cheque Bounce Charges', amount: '₹500 + GST', details: 'Per bounce' },
        { name: 'Loan Cancellation', amount: '₹3,000 + GST', details: 'If cancelled after sanction' },
        { name: 'EMI/Cheque Swapping', amount: '₹500 + GST', details: 'Per swap' }
      ],
      
      benefits: [
        'No end-use restrictions (use for any purpose)',
        'Flexible repayment options (monthly EMI)',
        'Balance transfer from other banks at lower rates',
        'Top-up loan facility on existing loan',
        'Insurance coverage option available',
        'Pre-closure allowed (with charges)',
        'Special rates for women borrowers',
        'Dedicated relationship manager'
      ],
      
      specialOffers: 'Get 0.5% interest rate discount for HDFC account holders. No processing fee for loan amount above ₹10 lakhs (limited period offer).',
      
      emiExample: {
        loanAmount: 500000,
        tenure: 36,
        interestRate: 12.5,
        emi: 16680,
        totalInterest: 100480
      },
      
      pros: [
        'Quick approval and fast disbursal (48 hours)',
        'Minimal documentation for existing customers',
        'Competitive interest rates (10.5% onwards)',
        'High loan amount (up to ₹40 lakhs)',
        'Good customer service and support',
        'Balance transfer facility helps save on interest'
      ],
      
      cons: [
        'High credit score requirement (750+)',
        'Processing fee can be expensive (up to 2.5%)',
        'Prepayment charges apply for first 3 years',
        'Interest rate varies significantly based on profile',
        'Late payment penalties are strict',
        'Not suitable for low-income borrowers (min ₹25k/month)'
      ]
    }
  }
  
  return mockLoans[slug] || null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const loan = await getLoanData(params.slug)
  
  if (!loan) {
    return {
      title: 'Loan Not Found - InvestingPro',
    }
  }
  
  return {
    title: `${loan.name} - Interest Rate ${loan.interestRateMin}%, Apply Online | InvestingPro`,
    description: `${loan.description} Interest: ${loan.interestRateMin}-${loan.interestRateMax}%. Loan amount: ₹${(loan.maxLoanAmount / 100000).toFixed(0)} Lakh. Rating: ${loan.rating}/5.`,
    keywords: `${loan.name}, ${loan.provider} loan, personal loan, loan interest rate, ${loan.provider.toLowerCase()} loan apply online`,
  }
}

export default async function LoanDetailPage({ params }: { params: { slug: string } }) {
  const loan = await getLoanData(params.slug)
  
  if (!loan) {
    notFound()
  }
  
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Loan Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-emerald-300 mb-3">
                <IndianRupee className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase">{loan.provider} • {loan.loanType}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{loan.name}</h1>
              <p className="text-lg text-emerald-100 mb-6">{loan.description}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-amber-500 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-white text-white" />
                  <span className="font-bold text-lg">{loan.rating}/5</span>
                </div>
                <span className="text-emerald-200">Trusted by 10 Lakh+ Customers</span>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-emerald-200">Interest Rate</p>
                  <p className="text-2xl font-bold">{loan.interestRateMin}% - {loan.interestRateMax}%</p>
                </div>
                <div>
                  <p className="text-sm text-emerald-200">Max Loan Amount</p>
                  <p className="text-2xl font-bold">₹{(loan.maxLoanAmount / 100000).toFixed(0)}L</p>
                </div>
                <div>
                  <p className="text-sm text-emerald-200">Processing Fee</p>
                  <p className="text-2xl font-bold">{loan.processingFee.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="text-sm text-emerald-200">Tenure</p>
                  <p className="text-2xl font-bold">{loan.minTenureMonths / 12}-{loan.maxTenureMonths / 12} Years</p>
                </div>
              </div>
            </div>
            
            {/* Right: Apply Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <p className="text-sm text-emerald-100 mb-4">Get instant approval</p>
                  <a href={loan.applyLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-6 text-lg mb-3">
                      Apply Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <div className="bg-emerald-700/30 border border-emerald-500/50 rounded-lg p-3 text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-emerald-200" />
                    <p className="text-sm text-emerald-100 font-semibold">Disbursal in 48 hours</p>
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
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calculator className="w-6 h-6" />
                  EMI Calculation Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-indigo-200">Loan Amount</p>
                    <p className="text-xl font-bold">₹{(loan.emiExample.loanAmount / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Tenure</p>
                    <p className="text-xl font-bold">{loan.emiExample.tenure} Months</p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Interest Rate</p>
                    <p className="text-xl font-bold">{loan.emiExample.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Monthly EMI</p>
                    <p className="text-2xl font-bold text-yellow-300">₹{loan.emiExample.emi.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm text-indigo-100">Total Interest: ₹{loan.emiExample.totalInterest.toLocaleString()}</p>
                  <p className="text-sm text-indigo-100">Total Amount Payable: ₹{(loan.emiExample.loanAmount + loan.emiExample.totalInterest).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {loan.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-6 h-6 text-blue-600" />
                  Loan Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {loan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
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
              <Card className="border-emerald-200 bg-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {loan.pros.map((pro, index) => (
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
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Disadvantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {loan.cons.map((con, index) => (
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
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-gray-600" />
                  Fees & Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loan.fees.map((fee, index) => (
                    <div key={index} className="flex items-start justify-between p-3 border-b last:border-0">
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
              <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Get Instant Loan</h3>
                  <p className="text-sm text-emerald-100 mb-4">Approval in 10 seconds</p>
                  <a href={loan.applyLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Check Eligibility <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-emerald-100 text-center">
                    No impact on credit score • 100% paperless
                  </p>
                </CardContent>
              </Card>
              
              {/* Eligibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
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
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {/* Important Notice */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-800">
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
      
      {/* Bottom CTA */}
      <div className="bg-emerald-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Apply for {loan.name} in Minutes</h2>
          <p className="text-emerald-200 mb-8">100% digital process • Quick approval • Instant disbursal</p>
          <a href={loan.applyLink} target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold px-12 py-6 text-lg">
              Check Eligibility Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
