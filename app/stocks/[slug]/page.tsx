import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Star, 
  TrendingUp,
  TrendingDown,
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  BarChart3,
  Activity,
  PieChart,
  AlertCircle,
  ExternalLink,
  Target,
  Calendar,
  Building2
} from 'lucide-react'
import { getProductBySlug } from '@/lib/products/server-service'

interface StockDetail {
  id: string
  name: string
  symbol: string
  sector: string
  image?: string
  rating: number
  currentPrice: string
  change: string
  changePercent: string
  isPositive: boolean
  marketCap: string
  peRatio: string
  dividendYield: string
  weekHigh52: string
  weekLow52: string
  description: string
  tradeLink: string
  keyMetrics: { label: string; value: string }[]
  pros: string[]
  cons: string[]
  analystRating: string
  targetPrice: string
}

async function getStockData(slug: string): Promise<StockDetail | null> {
  const product = await getProductBySlug(slug);
  if (!product || product.category !== 'stock') return null;

  const features = product.features || {};
  const changeValue = parseFloat(features.change || '0');
  
  return {
    id: product.id,
    name: product.name,
    symbol: features.symbol || product.name.split(' ')[0].toUpperCase(),
    sector: features.sector || 'Technology',
    image: product.image_url || undefined,
    rating: product.rating,
    currentPrice: features.current_price || '₹1,500',
    change: features.change || '+25.50',
    changePercent: features.change_percent || '+1.72%',
    isPositive: changeValue >= 0,
    marketCap: features.market_cap || '₹5,00,000 Cr',
    peRatio: features.pe_ratio || '25.5',
    dividendYield: features.dividend_yield || '1.2%',
    weekHigh52: features.week_high_52 || '₹1,800',
    weekLow52: features.week_low_52 || '₹1,200',
    description: product.description || '',
    tradeLink: product.affiliate_link || product.official_link || '#',
    keyMetrics: features.key_metrics || [
      { label: 'Book Value', value: features.book_value || '₹450' },
      { label: 'EPS', value: features.eps || '₹58.5' },
      { label: 'ROE', value: features.roe || '18.5%' },
      { label: 'Debt to Equity', value: features.debt_equity || '0.25' }
    ],
    pros: product.pros || [],
    cons: product.cons || [],
    analystRating: features.analyst_rating || 'Buy',
    targetPrice: features.target_price || '₹1,850'
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const stock = await getStockData(params.slug)
  
  if (!stock) {
    return { title: 'Stock Not Found - InvestingPro' }
  }
  
  return {
    title: `${stock.name} (${stock.symbol}) Stock Analysis - Price, Target & Buy | InvestingPro`,
    description: `${stock.name} stock analysis. Current Price: ${stock.currentPrice}. Target: ${stock.targetPrice}. P/E: ${stock.peRatio}. Complete fundamental analysis.`,
    keywords: `${stock.name}, ${stock.symbol} stock, ${stock.symbol} share price, ${stock.sector} stocks`,
  }
}

export default async function StockDetailPage({ params }: { params: { slug: string } }) {
  const stock = await getStockData(params.slug)
  
  if (!stock) {
    notFound()
  }

  const TrendIcon = stock.isPositive ? TrendingUp : TrendingDown;
  const trendColor = stock.isPositive ? 'text-success-500' : 'text-danger-500';
  const trendBg = stock.isPositive ? 'bg-success-50 dark:bg-success-900/20' : 'bg-danger-50 dark:bg-danger-900/20';
  
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {stock.sector}
                </span>
                <span className="bg-primary-600 text-white px-2 py-1 rounded text-sm font-bold">
                  {stock.symbol}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{stock.name}</h1>
              
              {/* Price Display */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold">{stock.currentPrice}</span>
                <div className={`flex items-center gap-1 ${trendColor}`}>
                  <TrendIcon className="w-5 h-5" />
                  <span className="font-semibold">{stock.change}</span>
                  <span className="text-sm">({stock.changePercent})</span>
                </div>
              </div>
              
              <p className="text-lg text-slate-300 mb-8 max-w-2xl">{stock.description}</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div>
                  <p className="text-sm text-slate-400">Market Cap</p>
                  <p className="text-lg font-bold">{stock.marketCap}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">P/E Ratio</p>
                  <p className="text-lg font-bold">{stock.peRatio}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Div. Yield</p>
                  <p className="text-lg font-bold">{stock.dividendYield}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">52W High</p>
                  <p className="text-lg font-bold text-success-400">{stock.weekHigh52}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">52W Low</p>
                  <p className="text-lg font-bold text-danger-400">{stock.weekLow52}</p>
                </div>
              </div>
            </div>
            
            {/* Right: Trade Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  {/* Analyst Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-300">Analyst Rating</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      stock.analystRating === 'Buy' ? 'bg-success-500 text-white' :
                      stock.analystRating === 'Hold' ? 'bg-accent-500 text-black' :
                      'bg-danger-500 text-white'
                    }`}>
                      {stock.analystRating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-slate-300">Target Price</span>
                    <span className="text-xl font-bold text-success-400">{stock.targetPrice}</span>
                  </div>
                  
                  <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-6 text-lg mb-3">
                      Trade Now <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <p className="text-xs text-slate-400 text-center">
                    Open demat account to start trading
                  </p>
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
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-600" />
                  Key Financial Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stock.keyMetrics.map((metric, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">{metric.label}</p>
                      <p className="font-bold text-lg">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-600" />
                  52-Week Price Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pt-6 pb-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-danger-500 font-semibold">{stock.weekLow52}</span>
                    <span className="text-slate-500">Current: {stock.currentPrice}</span>
                    <span className="text-success-500 font-semibold">{stock.weekHigh52}</span>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full relative">
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg"
                      style={{ left: '60%' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-success-200 dark:border-success-800">
                <CardHeader className="bg-success-50 dark:bg-success-900/20">
                  <CardTitle className="text-success-700 dark:text-success-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Investment Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {stock.pros.map((pro, index) => (
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
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {stock.cons.map((con, index) => (
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
              {/* Trade CTA */}
              <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5" />
                    <span className="text-primary-100">Target Price</span>
                  </div>
                  <p className="text-3xl font-bold mb-4">{stock.targetPrice}</p>
                  <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-white text-primary-600 hover:bg-gray-100 font-semibold py-6 mb-3">
                      Buy {stock.symbol} <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
              
              {/* Company Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary-600" />
                    Company Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="text-slate-500">Sector</p>
                    <p className="font-semibold">{stock.sector}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Symbol</p>
                    <p className="font-semibold">{stock.symbol}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Market Cap</p>
                    <p className="font-semibold">{stock.marketCap}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Risk Disclaimer */}
              <Card className="mt-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="text-xs text-amber-800 dark:text-amber-200">
                      <p className="font-semibold mb-1">Investment Risk</p>
                      <p>Stock investments are subject to market risks. Past performance is not indicative of future results. Please do your own research.</p>
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
          <h2 className="text-3xl font-bold mb-4">Start Trading {stock.symbol} Today</h2>
          <p className="text-slate-300 mb-8">Open a demat account and invest in top Indian stocks!</p>
          <a href={`/go/${params.slug}`} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-12 py-6 text-lg">
              Open Demat Account <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
