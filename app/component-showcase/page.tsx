import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Component Showcase - All Professional Elements | InvestingPro',
  description: 'Visual demonstration of all professional article components including key takeaways, callouts, stats boxes, and more.',
}

export default function ComponentShowcasePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Professional Article Components Showcase
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This page demonstrates all available article components. Use these in your articles for a professional, Investopedia-style appearance.
        </p>

        {/* Article Content with ALL components */}
        <article className="prose prose-slate max-w-none">
          <h2>Introduction</h2>
          <p>
            This showcase demonstrates how to use professional components in your financial articles. These components help highlight important information, improve readability, and create a premium user experience similar to leading financial publications.
          </p>

          {/* KEY TAKEAWAYS BOX */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-primary-500 rounded-lg p-6 my-8">
            <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
              ✓ Key Takeaways
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-gray-800">Professional components make your content stand out and improve user engagement</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-gray-800">Key Takeaways boxes should appear right after the introduction to summarize main points</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-gray-800">Use callout boxes to highlight important tips, warnings, and examples throughout your article</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span className="text-gray-800">Stats boxes are perfect for displaying numbers, returns, and financial metrics</span>
              </li>
            </ul>
          </div>

          <h2>Callout Boxes - Tips & Warnings</h2>
          <p>
            Callout boxes draw attention to important information. Here are the different types:
          </p>

          {/* PRO TIP */}
          <div className="my-6 p-6 rounded-lg border-l-4 bg-amber-50 border-amber-500">
            <h4 className="font-bold text-lg mb-2 text-amber-900">💡 Pro Tip</h4>
            <p className="text-gray-700">
              Use Pro Tip boxes to share expert advice and insider knowledge. These should contain actionable insights that readers can immediately apply.
            </p>
          </div>

          {/* IMPORTANT */}
          <div className="my-6 p-6 rounded-lg border-l-4 bg-secondary-50 border-secondary-500">
            <h4 className="font-bold text-lg mb-2 text-secondary-900">ℹ️ Important</h4>
            <p className="text-gray-700">
              Important boxes highlight critical information that readers must not miss. Use these for regulatory requirements, deadlines, or essential details.
            </p>
          </div>

          {/* WARNING */}
          <div className="my-6 p-6 rounded-lg border-l-4 bg-red-50 border-red-500">
            <h4 className="font-bold text-lg mb-2 text-red-900">⚠️ Warning</h4>
            <p className="text-gray-700">
              Warning boxes alert readers to potential risks, pitfalls, or common mistakes. Always include these when discussing investment risks or financial decisions that could have negative consequences.
            </p>
          </div>

          {/* EXAMPLE */}
          <div className="my-6 p-6 rounded-lg border-l-4 bg-secondary-50 border-secondary-500">
            <h4 className="font-bold text-lg mb-2 text-secondary-900">📊 Example</h4>
            <p className="text-gray-700 mb-2">
              <strong>Scenario:</strong> Rajesh invests ₹10,000 per month in a SIP for 20 years at 12% annual returns.
            </p>
            <p className="text-gray-700">
              <strong>Result:</strong> Total investment of ₹24 lakhs grows to approximately ₹1 crore through the power of compounding!
            </p>
          </div>

          <h2>Stats & Data Display</h2>
          <p>
            Use stats boxes to showcase important numbers, returns, or financial metrics:
          </p>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-white border-2 border-primary-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Average SIP Returns</p>
              <p className="text-3xl font-bold text-primary-600">12.5%</p>
              <p className="text-xs mt-1 font-medium text-green-600">+2.3% vs last year</p>
            </div>
            <div className="bg-white border-2 border-primary-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Min Investment</p>
              <p className="text-3xl font-bold text-primary-600">₹500</p>
              <p className="text-xs mt-1 font-medium text-gray-600">Per month</p>
            </div>
            <div className="bg-white border-2 border-primary-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Tax Benefit</p>
              <p className="text-3xl font-bold text-primary-600">₹1.5L</p>
              <p className="text-xs mt-1 font-medium text-gray-600">Section 80C</p>
            </div>
          </div>

          <h2>Quick Facts Box</h2>
          <p>
            Perfect for displaying key-value pairs like eligibility criteria, fees, or specifications:
          </p>

          {/* QUICK FACTS */}
          <div className="my-6 bg-slate-50 border border-slate-300 rounded-lg p-5">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              ℹ️ Quick Facts
            </h4>
            <dl className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <dt className="text-sm text-gray-600">Minimum Investment</dt>
                <dd className="font-semibold text-gray-900">₹500/month</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <dt className="text-sm text-gray-600">Lock-in Period</dt>
                <dd className="font-semibold text-gray-900">3 years (ELSS)</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <dt className="text-sm text-gray-600">Tax Benefit</dt>
                <dd className="font-semibold text-gray-900">Up to ₹1.5 Lakh (80C)</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm text-gray-600">Risk Level</dt>
                <dd className="font-semibold text-gray-900">Moderate to High</dd>
              </div>
            </dl>
          </div>

          <h2>Formula Box</h2>
          <p>
            Use formula boxes to display financial calculations clearly:
          </p>

          {/* FORMULA BOX */}
          <div className="my-6 bg-primary-50 border-2 border-indigo-400 rounded-lg p-6">
            <h4 className="font-bold text-primary-900 mb-3 flex items-center gap-2">
              🧮 SIP Return Calculation
            </h4>
            <div className="bg-white rounded p-4 font-mono text-center text-lg font-semibold text-gray-900 mb-3">
              FV = P × [(1 + r)ⁿ - 1] / r × (1 + r)
            </div>
            <p className="text-sm text-primary-800">
              <strong>Where:</strong> FV = Future Value, P = Monthly Investment, r = Monthly Rate of Return, n = Number of Months
            </p>
          </div>

          <h2>Comparison Table</h2>
          <p>
            Perfect for side-by-side comparisons:
          </p>

          {/* COMPARISON TABLE */}
          <div className="my-8 border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-primary-600 text-white px-6 py-3">
              <h3 className="font-bold text-lg">SIP vs Lumpsum Comparison</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="font-semibold text-gray-900">Investment Style</div>
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">✓</span>
                  <span>Regular monthly investments</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-lg">○</span>
                  <span>One-time large investment</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="font-semibold text-gray-900">Risk Level</div>
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">✓</span>
                  <span>Lower (rupee cost averaging)</span>
                </div>
                <div className="flex items-center gap-2 text-red-700">
                  <span className="text-lg">✗</span>
                  <span>Higher (market timing risk)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="font-semibold text-gray-900">Best For</div>
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">✓</span>
                  <span>Salaried individuals</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">✓</span>
                  <span>Those with lump sum available</span>
                </div>
              </div>
            </div>
          </div>

          <h2>Inline Text Highlighting</h2>
          <p>
            Highlight important numbers or terms inline: 
            <span className="px-2 py-0.5 mx-1 rounded border font-semibold bg-primary-100 text-primary-900 border-primary-300">₹10 lakh coverage</span>,
            <span className="px-2 py-0.5 mx-1 rounded border font-semibold bg-secondary-100 text-secondary-900 border-secondary-300">12.5% returns</span>, or
            <span className="px-2 py-0.5 mx-1 rounded border font-semibold bg-amber-100 text-amber-900 border-amber-300">Section 80C benefit</span>.
          </p>

          <h2>Visual Graphics (No Images Required!)</h2>
          <p>
            These graphics are rendered using pure CSS/SVG - no external images needed! They load instantly and look professional.
          </p>

          <h3>Progress Bars</h3>
          <div className="my-6 p-6 bg-gray-50 rounded-lg">
            {/* Progress Bar 1 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Portfolio Allocation - Equity</span>
                <span className="text-sm font-bold text-gray-900">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-3 rounded-full bg-primary-600" style={{ width: '70%' }} />
              </div>
            </div>

            {/* Progress Bar 2 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Debt Allocation</span>
                <span className="text-sm font-bold text-gray-900">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-3 rounded-full bg-primary-600" style={{ width: '25%' }} />
              </div>
            </div>

            {/* Progress Bar 3 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Cash & Others</span>
                <span className="text-sm font-bold text-gray-900">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-3 rounded-full bg-amber-500" style={{ width: '5%' }} />
              </div>
            </div>
          </div>

          <h3>Pie Chart (Asset Allocation)</h3>
          <div className="flex flex-col md:flex-row items-center gap-6 my-6">
            {/* Pie Chart Visual */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden" style={{ 
              background: `conic-gradient(
                #10b981 0deg 252deg,
                #3b82f6 252deg 342deg,
                #f59e0b 342deg 360deg
              )`
            }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">100%</span>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-primary-600" />
                <span className="text-sm text-gray-700">Equity</span>
                <span className="text-sm font-semibold text-gray-900">70%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-primary-600" />
                <span className="text-sm text-gray-700">Debt</span>
                <span className="text-sm font-semibold text-gray-900">25%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-amber-500" />
                <span className="text-sm text-gray-700">Cash</span>
                <span className="text-sm font-semibold text-gray-900">5%</span>
              </div>
            </div>
          </div>

          <h3>Bar Chart (Returns Comparison)</h3>
          <div className="my-6 p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-end justify-around gap-4 h-64">
              <div className="flex flex-col items-center flex-1">
                <div className="mb-2 text-sm font-semibold text-gray-900">12.5%</div>
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '62.5%' }}>
                  <div className="absolute bottom-0 w-full rounded-t-lg bg-primary-600" style={{ height: '100%' }} />
                </div>
                <div className="mt-2 text-xs text-center text-gray-600">SIP Returns</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="mb-2 text-sm font-semibold text-gray-900">8.5%</div>
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '42.5%' }}>
                  <div className="absolute bottom-0 w-full rounded-t-lg bg-primary-600" style={{ height: '100%' }} />
                </div>
                <div className="mt-2 text-xs text-center text-gray-600">FD Returns</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="mb-2 text-sm font-semibold text-gray-900">6.5%</div>
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '32.5%' }}>
                  <div className="absolute bottom-0 w-full rounded-t-lg bg-amber-500" style={{ height: '100%' }} />
                </div>
                <div className="mt-2 text-xs text-center text-gray-600">Savings A/C</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="mb-2 text-sm font-semibold text-gray-900">20%</div>
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                  <div className="absolute bottom-0 w-full rounded-t-lg bg-secondary-600" style={{ height: '100%' }} />
                </div>
                <div className="mt-2 text-xs text-center text-gray-600">Gold</div>
              </div>
            </div>
          </div>

          <h3>Comparison Slider</h3>
          <div className="my-6 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-gray-200">
            <div className="flex justify-between mb-3">
              <span className="font-semibold text-gray-900">SIP Investment</span>
              <span className="font-semibold text-gray-900">Lumpsum Investment</span>
            </div>
            <div className="relative h-12 bg-white rounded-full overflow-hidden border-2 border-gray-300">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-end pr-4" style={{ width: '65%' }}>
                <span className="text-white font-bold text-sm">65%</span>
              </div>
              <div className="absolute right-0 top-0 h-full bg-gradient-to-r from-secondary-500 to-secondary-600 flex items-center justify-start pl-4" style={{ width: '35%' }}>
                <span className="text-white font-bold text-sm">35%</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">Based on risk-adjusted returns over 10 years</p>
          </div>

          <h3>Timeline / Process Flow</h3>
          <div className="my-6">
            <div className="flex gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">1</div>
                <div className="w-0.5 h-full bg-primary-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h4 className="font-bold text-gray-900 mb-1">Check Eligibility</h4>
                <p className="text-gray-600 text-sm">Verify your credit score, income, and basic requirements before applying</p>
              </div>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">2</div>
                <div className="w-0.5 h-full bg-primary-200 mt-2" />
              </div>
              <div className="flex-1 pb-6">
                <h4 className="font-bold text-gray-900 mb-1">Submit Application</h4>
                <p className="text-gray-600 text-sm">Fill out the online form with accurate personal and financial information</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">3</div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">Get Approval</h4>
                <p className="text-gray-600 text-sm">Receive instant decision or wait 24-48 hours for approval confirmation</p>
              </div>
            </div>
          </div>

          <h3>Rating Display</h3>
          <div className="flex items-center gap-3 my-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
            <div className="flex gap-1">
              <svg className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <svg className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <svg className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <svg className="w-6 h-6 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <svg className="w-6 h-6 text-gray-300" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-900">4.0/5.0</span>
          </div>

          <h3>Growth Indicators</h3>
          <div className="flex flex-wrap gap-4 my-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-green-200">
              <span className="text-2xl font-bold text-green-600">+12.5%</span>
              <span className="text-2xl text-green-600">↗</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-red-200">
              <span className="text-2xl font-bold text-red-600">-3.2%</span>
              <span className="text-2xl text-red-600">↘</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-gray-200">
              <span className="text-2xl font-bold text-gray-600">0%</span>
              <span className="text-2xl text-gray-600">→</span>
            </div>
          </div>

          <h3>Feature Comparison Grid</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
            <div className="flex items-center gap-3 p-4 rounded-lg border-2 bg-primary-50 border-primary-200">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary-600">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Zero Annual Fee</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border-2 bg-primary-50 border-primary-200">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary-600">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Cashback on All Purchases</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border-2 bg-gray-50 border-gray-200">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-400">
                <span className="text-white text-sm font-bold">✗</span>
              </div>
              <span className="text-sm font-medium text-gray-500">Lounge Access</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border-2 bg-gray-50 border-gray-200">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-400">
                <span className="text-white text-sm font-bold">✗</span>
              </div>
              <span className="text-sm font-medium text-gray-500">International Travel Insurance</span>
            </div>
          </div>

          <h3>Metric Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="bg-white border-2 border-primary-200 rounded-lg p-6 text-center shadow-sm">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-sm text-gray-600 mb-2">Average Returns</p>
              <p className="text-3xl font-bold text-primary-600 mb-2">14.2%</p>
              <p className="text-xs font-medium text-green-600">+2.3% vs last year</p>
            </div>
            <div className="bg-white border-2 border-primary-200 rounded-lg p-6 text-center shadow-sm">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-sm text-gray-600 mb-2">Min Investment</p>
              <p className="text-3xl font-bold text-primary-600 mb-2">₹500</p>
              <p className="text-xs font-medium text-gray-600">Per month via SIP</p>
            </div>
            <div className="bg-white border-2 border-primary-200 rounded-lg p-6 text-center shadow-sm">
              <div className="text-4xl mb-2">🔒</div>
              <p className="text-sm text-gray-600 mb-2">Lock-in Period</p>
              <p className="text-3xl font-bold text-primary-600 mb-2">3 Years</p>
              <p className="text-xs font-medium text-gray-600">Tax-saving ELSS</p>
            </div>
          </div>

          <h2>Conclusion</h2>
          <p>
            These professional components elevate your content from basic text to premium financial journalism. Use them strategically to:
          </p>
          <ul>
            <li>Highlight critical information with callout boxes</li>
            <li>Summarize main points with Key Takeaways</li>
            <li>Display data clearly with stats boxes</li>
            <li>Show calculations with formula boxes</li>
            <li>Compare options with comparison tables</li>
          </ul>
          <p>
            <strong>Ready to create professional articles?</strong> Copy the HTML from this page and use it in your content!
          </p>
        </article>
      </div>
    </div>
  )
}
