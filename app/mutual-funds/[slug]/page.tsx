import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  TrendingUp, 
  Percent, 
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  PieChart,
  BarChart3,
  AlertTriangle,
  ExternalLink,
  Target,
  Award
} from 'lucide-react'

interface MutualFundDetail {
  id: string
  name: string
  amc: string
  category: string
  subCategory: string
  nav: number
  rating: number
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high'
  expenseRatio: number
  exitLoad: string
  minInvestment: number
  sipMinInvestment: number
  
  returns: {
    '1Y': number
    '3Y': number
    '5Y': number
    '10Y'?: number
    sinceInception: number
  }
  
  aum: number
  launchDate: string
  benchmarkName: string
  benchmarkReturns: {
    '1Y': number
    '3Y': number
    '5Y': number
  }
  
  description: string
  applyLink: string
  
  // Detailed features
  investmentObjective: string
  portfolioHoldings: {
    topStocks?: { name: string; weight: number }[]
    sectorAllocation?: { sector: string; weight: number }[]
    assetAllocation: { type: string; weight: number }[]
  }
  
  keyFeatures: string[]
  suitableFor: string[]
  taxBenefits?: string
  
  pros: string[]
  cons: string[]
  
  fundManager: {
    name: string
    experience: number
  }
}

import { getProductBySlug } from '@/lib/products/server-service'

async function getMutualFundData(slug: string): Promise<MutualFundDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== 'mutual_fund') return null;

  const features = product.features || {};
  
  return {
    id: product.id,
    name: product.name,
    amc: product.provider_name,
    category: features.category || 'Equity',
    subCategory: features.sub_category || 'Large Cap',
    nav: parseFloat(features.nav || '0'),
    rating: product.rating,
    riskLevel: (features.risk_level?.toLowerCase() as any) || 'high',
    expenseRatio: parseFloat(features.expense_ratio || '0'),
    exitLoad: features.exit_load || '1% for 1 year',
    minInvestment: parseInt(features.min_lumpsum || '5000'),
    sipMinInvestment: parseInt(features.min_sip || '500'),
    
    returns: {
      '1Y': parseFloat(features.returns_1y || '0'),
      '3Y': parseFloat(features.returns_3y || '0'),
      '5Y': parseFloat(features.returns_5y || '0'),
      '10Y': features.returns_10y ? parseFloat(features.returns_10y) : undefined,
      sinceInception: parseFloat(features.returns_inception || '0')
    },
    
    aum: parseInt(features.aum_crores || '0'),
    launchDate: features.launch_date || '2010-01-01',
    benchmarkName: features.benchmark || 'Nifty 50 TRI',
    benchmarkReturns: {
      '1Y': parseFloat(features.benchmark_1y || '0'),
      '3Y': parseFloat(features.benchmark_3y || '0'),
      '5Y': parseFloat(features.benchmark_5y || '0')
    },
    
    description: product.description || '',
    applyLink: product.affiliate_link || product.official_link || '#',
    
    investmentObjective: features.objective || 'To generate long-term capital appreciation.',
    
    portfolioHoldings: features.portfolio_holdings || {
      topStocks: features.top_holdings || [],
      sectorAllocation: features.sector_allocation || [],
      assetAllocation: features.asset_allocation || [
        { type: 'Equity', weight: 95 },
        { type: 'Cash', weight: 5 }
      ]
    },
    
    keyFeatures: features.key_highlights || product.pros.slice(0, 5) || [],
    suitableFor: features.suitability || [
      'Long term investors',
      'Investors seeking growth',
      'SIP investors'
    ],
    
    taxBenefits: features.tax_implication || 'LTCG applies for gains above 1L.',
    
    pros: product.pros,
    cons: product.cons,
    
    fundManager: {
      name: features.manager_name || 'Expert Manager',
      experience: parseInt(features.manager_exp || '10')
    }
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fund = await getMutualFundData(params.slug)
  
  if (!fund) {
    return {
      title: 'Mutual Fund Not Found - InvestingPro',
    }
  }
  
  return {
    title: `${fund.name} Review - Returns, NAV, SIP & Invest Online | InvestingPro`,
    description: `${fund.description} 3Y Returns: ${fund.returns['3Y']}%. Expense Ratio: ${fund.expenseRatio}%. Rating: ${fund.rating}/5. Invest via SIP from ₹${fund.sipMinInvestment}.`,
    keywords: `${fund.name}, ${fund.amc}, ${fund.category} fund, mutual fund investment, SIP, NAV, ${fund.name.toLowerCase()} review`,
  }
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'bg-green-100 text-green-700 border-green-200'
    case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'very_high': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getReturnColor = (value: number) => {
  if (value >= 15) return 'text-green-600'
  if (value >= 10) return 'text-primary-600'
  if (value >= 5) return 'text-yellow-600'
  return 'text-red-600'
}

export default async function MutualFundDetailPage({ params }: { params: { slug: string } }) {
  const fund = await getMutualFundData(params.slug)
  
  if (!fund) {
    notFound()
  }
  
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Fund Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-primary-300 mb-3">
                <PieChart className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase">{fund.amc}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{fund.name}</h1>
              <p className="text-lg text-primary-200 mb-4">{fund.description}</p>
              
              {/* Category & Rating */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="bg-primary-700/50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-primary-200">Category: </span>
                  <span className="font-semibold">{fund.subCategory}</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-white text-white" />
                  <span className="font-bold">{fund.rating}/5</span>
                </div>
                <div className={`px-4 py-2 rounded-lg border ${getRiskColor(fund.riskLevel)}`}>
                  <span className="text-sm font-semibold capitalize">{fund.riskLevel.replace('_', ' ')} Risk</span>
                </div>
              </div>
              
              {/* Returns */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(fund.returns).map(([period, value]) => (
                  <div key={period} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-sm text-primary-200 mb-1">{period === 'sinceInception' ? 'Since Inception' : period}</p>
                    <p className={`text-2xl font-bold ${value >= 15 ? 'text-primary-400' : 'text-white'}`}>
                      {value}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right: Invest Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-primary-200">Current NAV</p>
                    <p className="text-3xl font-bold">₹{fund.nav.toFixed(2)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-primary-200">Lumpsum</p>
                      <p className="font-semibold">₹{fund.minInvestment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-primary-200">SIP</p>
                      <p className="font-semibold">₹{fund.sipMinInvestment}/month</p>
                    </div>
                  </div>
                  
                  <a href={fund.applyLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 text-lg mb-2">
                      Invest Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-primary-200 text-center">Start SIP or make lumpsum investment</p>
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
            {/* Investment Objective */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <Target className="w-6 h-6 text-primary-600" />
                  Investment Objective
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{fund.investmentObjective}</p>
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
                  {fund.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Portfolio Holdings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                  Portfolio Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Asset Allocation */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Asset Allocation</h3>
                  <div className="space-y-2">
                    {fund.portfolioHoldings.assetAllocation.map((asset, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{asset.type}</span>
                          <span className="text-sm font-semibold">{asset.weight}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all" 
                            style={{ width: `${asset.weight}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Top Holdings */}
                {fund.portfolioHoldings.topStocks && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">Top 5 Holdings</h3>
                    <div className="space-y-2">
                      {fund.portfolioHoldings.topStocks.map((stock, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-sm font-medium text-gray-700">{stock.name}</span>
                          <span className="text-sm font-semibold text-primary-600">{stock.weight}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sector Allocation */}
                {fund.portfolioHoldings.sectorAllocation && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Sector Allocation</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {fund.portfolioHoldings.sectorAllocation.map((sector, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded border border-slate-200">
                          <p className="text-xs text-gray-500">{sector.sector}</p>
                          <p className="text-lg font-bold text-gray-900">{sector.weight}%</p>
                        </div>
                      ))}
                    </div>
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
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fund.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-1" />
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
                    Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fund.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-1" />
                        <span className="text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Fund Details */}
            <Card>
              <CardHeader>
                <CardTitle>Fund Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Expense Ratio</p>
                    <p className="font-semibold text-gray-900">{fund.expenseRatio}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Exit Load</p>
                    <p className="font-semibold text-gray-900">{fund.exitLoad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">AUM</p>
                    <p className="font-semibold text-gray-900">₹{(fund.aum / 100).toFixed(0)} Cr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fund Manager</p>
                    <p className="font-semibold text-gray-900">{fund.fundManager.name}</p>
                    <p className="text-xs text-gray-500">{fund.fundManager.experience} years experience</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Invest CTA (Sticky) */}
            <div className="sticky top-6">
              <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Start Investing</h3>
                  <p className="text-sm text-primary-100 mb-4">SIP from ₹{fund.sipMinInvestment}/month</p>
                  <a href={fund.applyLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-primary-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Invest Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-primary-100 text-center">
                    Zero commission • Instant investment
                  </p>
                </CardContent>
              </Card>
              
              {/* Suitable For */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-6 md:p-8">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    Suitable For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fund.suitableFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Tax Benefits */}
              {fund.taxBenefits && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base text-blue-900">Tax Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-800">{fund.taxBenefits}</p>
                  </CardContent>
                </Card>
              )}
              
              {/* Risk Warning */}
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800">
                      <p className="font-semibold mb-1">SEBI Disclaimer</p>
                      <p>Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully before investing.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="bg-primary-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Investment Journey with {fund.name}</h2>
          <p className="text-primary-200 mb-8">Build wealth systematically through SIP or invest lumpsum</p>
          <a href={fund.applyLink} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-12 py-6 text-lg">
              Invest Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
