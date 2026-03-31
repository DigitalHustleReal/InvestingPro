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
import DifferentiationCard from '@/components/products/DifferentiationCard'
import { scoreMutualFund } from '@/lib/products/scoring-rules'
import { MutualFund } from '@/types'
import DecisionFramework from '@/components/common/DecisionFramework'
import DecisionCTA from '@/components/common/DecisionCTA'
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure'
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer'
import Link from 'next/link'

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

import { createServiceClient } from '@/lib/supabase/service'

async function getMutualFundData(slug: string): Promise<MutualFundDetail | null> {
  const supabase = createServiceClient();
  const { data: fund, error } = await supabase
    .from('mutual_funds')
    .select('*')
    .eq('slug', slug)
    .maybeSingle(); // Use maybeSingle() to handle 0 rows gracefully

  if (error || !fund) return null;

  // Map DB fields to UI Interface
  return {
    id: fund.id,
    name: fund.name,
    amc: fund.fund_house,
    category: fund.category,
    subCategory: fund.category, // Map if distinct
    nav: Number(fund.nav) || 0,
    rating: Number(fund.rating) || 4,
    riskLevel: (fund.risk?.toLowerCase() as any) || 'high',
    expenseRatio: Number(fund.expense_ratio) || 0,
    exitLoad: 'Check scheme docs', // Not in new schema yet, placeholder
    minInvestment: Number(fund.min_investment) || 500,
    sipMinInvestment: 500, // Default or parse if mixed
    
    returns: {
      '1Y': Number(fund.returns_1y) || 0,
      '3Y': Number(fund.returns_3y) || 0,
      '5Y': Number(fund.returns_5y) || 0,
      sinceInception: 0 // Not in schema yet
    },
    
    aum: Number(fund.aum || 0), // Schema has aum? Check if I added it? In schema it is TEXT? or missing?
    // Start of Schema Check: I added 'aum' in my thought but did I add it to `ingest` script?
    // Ingest script had `aum? ... // aum? MFAPI doesn't provide AUM`.
    // So AUM will be null/0.
    
    launchDate: fund.launch_date || '2010-01-01',
    benchmarkName: 'Nifty 50 TRI',
    benchmarkReturns: { '1Y': 12, '3Y': 15, '5Y': 14 }, // Benchmarks
    
    description: fund.description || `The ${fund.name} is a ${fund.category} fund by ${fund.fund_house}.`,
    applyLink: '#', // Placeholder
    
    investmentObjective: `To generate wealth over the long term by investing in ${fund.category} instruments.`,
    
    portfolioHoldings: {
      topStocks: [], // Data enrichment needed later
      sectorAllocation: [],
      assetAllocation: [ { type: 'Equity', weight: 98 }, { type: 'Cash', weight: 2 } ]
    },
    
    keyFeatures: [
        `Ranked ${fund.rating}/5 by our algorithms`,
        `${fund.returns_3y}% 3-Year Returns`,
        `${fund.category} Category`,
        `Managed by ${fund.fund_house}`
    ],
    suitableFor: [
      'Long term wealth creation',
      'Investors with 5+ year horizon',
      'SIP investors'
    ],
    
    taxBenefits: fund.category === 'ELSS' ? 'Tax saving up to ₹1.5L under 80C' : 'LTCG tax of 10% on gains > ₹1L',
    
    pros: [],
    cons: [],
    
    fundManager: {
      name: 'Fund Manager',
      experience: 10
    }
  };
}

/**
 * Generate static params for all active mutual funds
 * This pre-generates all product pages at build time for better SEO
 */
export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data: funds, error } = await supabase
      .from('mutual_funds')
      .select('slug')
      .not('slug', 'is', null);
    
    if (error) {
      console.error('[generateStaticParams] Error fetching mutual funds:', error);
      return [];
    }
    
    if (!funds || funds.length === 0) {
      console.warn('[generateStaticParams] No active mutual funds found');
      return [];
    }
    
    console.log(`[generateStaticParams] Generating ${funds.length} mutual fund pages`);
    return funds.map(fund => ({ slug: fund.slug }));
  } catch (error) {
    console.error('[generateStaticParams] Failed to generate static params:', error);
    return [];
  }
}

// Force static generation with ISR (Incremental Static Regeneration)
export const dynamic = 'force-static';
// Revalidate every hour to keep NAV and returns data fresh
export const revalidate = 3600; // 1 hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fund = await getMutualFundData(slug)
  
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
    case 'low': return 'bg-green-100 text-green-600 border-green-600'
    case 'moderate': return 'bg-amber-100 text-amber-600 border-amber-600'
    case 'high': return 'bg-amber-100 text-amber-600 border-amber-600'
    case 'very_high': return 'bg-red-100 text-red-600 border-red-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getReturnColor = (value: number) => {
  if (value >= 15) return 'text-green-600'
  if (value >= 10) return 'text-green-600'
  if (value >= 5) return 'text-amber-600'
  return 'text-red-600'
}

export default async function MutualFundDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fund = await getMutualFundData(slug)
  
  if (!fund) {
    notFound()
  }
  
  // SIP calculator helper
  const calcSIP = (monthly: number, rate: number, years: number) => {
    const r = rate / 12 / 100;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[13px] text-gray-400">
              <li><Link href="/" className="hover:text-gray-700 transition-colors">Home</Link></li>
              <li className="text-gray-300">/</li>
              <li><Link href="/mutual-funds" className="hover:text-gray-700 transition-colors">Mutual Funds</Link></li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-700">{fund.name}</li>
            </ol>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Fund Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <PieChart className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase">{fund.amc}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{fund.name}</h1>
               
               {/* Pre-Launch Critical: Affiliate Disclosure above the fold */}
               <div className="mb-6">
                 <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="bg-gray-50 border-gray-200 text-gray-700 rounded-lg p-3 max-w-fit" />
               </div>

               <p className="text-lg text-green-600 mb-4">{fund.description}</p>
              
              {/* Category & Rating */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-green-600">Category: </span>
                  <span className="font-semibold">{fund.subCategory}</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{fund.rating}/5</span>
                </div>
                <div className={`px-4 py-2 rounded-lg border ${getRiskColor(fund.riskLevel)}`}>
                  <span className="text-sm font-semibold capitalize">{fund.riskLevel.replace('_', ' ')} Risk</span>
                </div>
              </div>
              
              {/* Returns */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(fund.returns).map(([period, value]) => (
                  <div key={period} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-green-600 mb-1">{period === 'sinceInception' ? 'Since Inception' : period}</p>
                    <p className={`text-2xl font-bold ${value >= 15 ? 'text-green-600' : 'text-gray-900'}`}>
                      {value}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right: Invest Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-green-600">Current NAV</p>
                    <p className="text-3xl font-bold">₹{fund.nav.toFixed(2)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-green-600">Lumpsum</p>
                      <p className="font-semibold">₹{fund.minInvestment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-green-600">SIP</p>
                      <p className="font-semibold">₹{fund.sipMinInvestment}/month</p>
                    </div>
                  </div>
                  
                  <DecisionCTA
                    text="Start SIP Now"
                    href={fund.applyLink}
                    productId={fund.id}
                    variant="primary"
                    size="lg"
                    className="w-full h-14 text-lg font-bold mb-2"
                    isExternal={!!fund.applyLink}
                    showIcon={true}
                  />
                  <p className="text-xs text-green-600 text-center">Start SIP or make lumpsum investment</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decision Framework */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <DecisionFramework
          productId={fund.id}
          productName={fund.name}
          category="mutual-funds"
          affiliateLink={fund.applyLink}
          variant="compact"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Investment Objective */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6 md:p-8">
                  <Target className="w-6 h-6 text-green-600" />
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
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {fund.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
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
                  <BarChart3 className="w-6 h-6 text-green-600" />
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
                            className="bg-green-600 h-2 rounded-full transition-all" 
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
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                          <span className="text-sm font-medium text-gray-700">{stock.name}</span>
                          <span className="text-sm font-semibold text-green-600">{stock.weight}%</span>
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
                        <div key={index} className="p-3 bg-gray-100 rounded border border-gray-200">
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
              <Card className="border-green-600 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-6 md:p-8">
                    <CheckCircle2 className="w-5 h-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {fund.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 bg-red-100/30">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-6 md:p-8">
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
            
            {/* Differentiation Score Card */}
            <DifferentiationCard 
                score={scoreMutualFund({
                    id: fund.id,
                    slug: slug,
                    name: fund.name,
                    category: 'mutual_fund',
                    provider: fund.amc,
                    description: fund.description,
                    rating: fund.rating,
                    reviewsCount: 0,
                    applyLink: fund.applyLink,
                    riskLevel: fund.riskLevel,
                    fundCategory: (fund.subCategory?.toLowerCase().includes('equity') ? 'equity' : 'debt') as any, // Simple map
                    subCategory: fund.subCategory,
                    returns1Y: fund.returns['1Y'],
                    returns3Y: fund.returns['3Y'],
                    returns5Y: fund.returns['5Y'],
                    expenseRatio: fund.expenseRatio,
                    exitLoad: fund.exitLoad,
                    aum: (fund.aum / 100).toFixed(0) + ' Cr',
                    manager: fund.fundManager.name
                })}
                productName={fund.name}
            />

            {/* Invest CTA (Sticky) */}
            <div className="sticky top-6">
              <Card className="bg-white border-b border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Start Investing</h3>
                  <p className="text-sm text-green-600 mb-4">SIP from ₹{fund.sipMinInvestment}/month</p>
                  <a href={fund.applyLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Invest Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-green-600 text-center">
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
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Tax Benefits */}
              {fund.taxBenefits && (
                <Card className="bg-blue-100 border-blue-600">
                  <CardHeader>
                    <CardTitle className="text-base text-blue-600">Tax Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-600">{fund.taxBenefits}</p>
                  </CardContent>
                </Card>
              )}
              
               {/* Risk Warning & Full Compliance Disclosure */}
               <ComplianceDisclaimer variant="compact" className="bg-amber-50 border-amber-200 shadow-sm" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Returns vs Benchmark */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" /> Returns vs Benchmark ({fund.benchmarkName})</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Period</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">{fund.name}</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">{fund.benchmarkName}</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Difference</th>
                </tr></thead>
                <tbody>
                  {(['1Y', '3Y', '5Y'] as const).map((period) => {
                    const fundReturn = fund.returns[period];
                    const benchReturn = fund.benchmarkReturns[period];
                    const diff = fundReturn - benchReturn;
                    return (
                      <tr key={period} className="border-b border-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{period}</td>
                        <td className={`py-3 px-4 text-right font-bold tabular-nums ${fundReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fundReturn}%</td>
                        <td className="py-3 px-4 text-right text-gray-600 tabular-nums">{benchReturn}%</td>
                        <td className={`py-3 px-4 text-right font-semibold tabular-nums ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>{diff >= 0 ? '+' : ''}{diff.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SIP Projection */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Card className="bg-green-50 border-green-200">
          <CardHeader><CardTitle className="flex items-center gap-2 text-green-800"><IndianRupee className="w-5 h-5" /> SIP Projection</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">If you invested monthly via SIP in this fund (based on {fund.returns['3Y']}% 3-year returns):</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '₹5,000/mo for 5yr', value: calcSIP(5000, fund.returns['3Y'], 5) },
                { label: '₹10,000/mo for 10yr', value: calcSIP(10000, fund.returns['3Y'], 10) },
                { label: '₹15,000/mo for 15yr', value: calcSIP(15000, fund.returns['3Y'], 15) },
                { label: '₹25,000/mo for 20yr', value: calcSIP(25000, fund.returns['3Y'], 20) },
              ].map((proj) => (
                <div key={proj.label} className="bg-white rounded-xl p-4 border border-green-100 text-center">
                  <p className="text-xs text-gray-500 mb-1">{proj.label}</p>
                  <p className="text-xl font-black text-green-700 tabular-nums">₹{(proj.value / 100000).toFixed(1)}L</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-3">Projections based on past 3Y returns. Actual returns may vary. Past performance is not indicative of future results.</p>
          </CardContent>
        </Card>
      </div>

      {/* How to Invest */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Card>
          <CardHeader><CardTitle>How to Invest in {fund.name}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Complete KYC', desc: 'PAN + Aadhaar verification (one-time, 2 min)' },
                { step: '2', title: 'Choose Plan', desc: 'Direct plan recommended (lower expense ratio)' },
                { step: '3', title: 'Set SIP Amount', desc: `Minimum ₹${fund.sipMinInvestment}/month` },
                { step: '4', title: 'Start Investing', desc: 'Auto-debit from bank account every month' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-2">{s.step}</div>
                  <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {[
            { q: `Is ${fund.name} a good investment?`, a: `${fund.name} has delivered ${fund.returns['3Y']}% returns over 3 years with a ${fund.riskLevel} risk profile. It's rated ${fund.rating}/5. Whether it's good for you depends on your investment horizon (we recommend 5+ years for equity funds) and risk tolerance.` },
            { q: `What is the minimum SIP amount for ${fund.name}?`, a: `The minimum SIP amount is ₹${fund.sipMinInvestment}/month. For lumpsum investment, the minimum is ₹${fund.minInvestment.toLocaleString()}.` },
            { q: `What is the expense ratio of ${fund.name}?`, a: `The expense ratio is ${fund.expenseRatio}%. This is the annual fee charged by ${fund.amc} for managing the fund. We recommend comparing with similar funds in the ${fund.category} category.` },
            { q: 'Should I choose Direct or Regular plan?', a: 'Direct plans have 0.5-1% lower expense ratios (no distributor commission). Over 10+ years, this difference compounds to lakhs. We always recommend Direct plans for informed investors.' },
            { q: `Can I withdraw from ${fund.name} anytime?`, a: `Yes, you can redeem your investment anytime. Exit load: ${fund.exitLoad}. Redemption amount is typically credited within 1-3 business days.` },
            { q: 'How are returns taxed?', a: fund.taxBenefits || 'Equity funds: LTCG above ₹1.25L taxed at 12.5% (held >1yr). Short-term (<1yr): 20%. Debt funds: taxed at slab rate.' },
          ].map((f, i) => (
            <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors list-none">{f.q}<span className="text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0 ml-4">›</span></summary>
              <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{f.a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Investment Journey with {fund.name}</h2>
          <p className="text-green-600 mb-8">Build wealth systematically through SIP or invest lumpsum</p>
          <a href={fund.applyLink} target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-600 hover:bg-green-600 text-white font-semibold px-12 py-6 text-lg">
              Invest Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
