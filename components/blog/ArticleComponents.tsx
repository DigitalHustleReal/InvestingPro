import React from 'react'
import { AlertCircle, CheckCircle2, Lightbulb, TrendingUp, AlertTriangle, Info, DollarSign, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Article Callout Boxes - Like Investopedia
 * 
 * Usage in HTML content:
 * <div data-callout="key-takeaway">Your content here</div>
 * <div data-callout="important">Important info</div>
 * <div data-callout="tip">Pro tip here</div>
 */

interface CalloutProps {
  type: 'key-takeaway' | 'important' | 'tip' | 'warning' | 'example' | 'definition' | 'calculation'
  title?: string
  children: React.ReactNode
  className?: string
}

export function Callout({ type, title, children, className }: CalloutProps) {
  const config = {
    'key-takeaway': {
      icon: CheckCircle2,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-500',
      iconColor: 'text-primary-600',
      titleColor: 'text-primary-900',
      defaultTitle: 'Key Takeaway'
    },
    'important': {
      icon: AlertCircle,
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-500',
      iconColor: 'text-primary-600',
      titleColor: 'text-secondary-900',
      defaultTitle: 'Important'
    },
    'tip': {
      icon: Lightbulb,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-500',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      defaultTitle: 'Pro Tip'
    },
    'warning': {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      defaultTitle: 'Warning'
    },
    'example': {
      icon: TrendingUp,
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-500',
      iconColor: 'text-secondary-600',
      titleColor: 'text-secondary-900',
      defaultTitle: 'Example'
    },
    'definition': {
      icon: Info,
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-400',
      iconColor: 'text-slate-600',
      titleColor: 'text-slate-900',
      defaultTitle: 'Definition'
    },
    'calculation': {
      icon: Calculator,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-500',
      iconColor: 'text-primary-600',
      titleColor: 'text-primary-900',
      defaultTitle: 'Calculation'
    }
  }

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, defaultTitle } = config[type]

  return (
    <div className={cn(
      'my-6 p-6 rounded-lg border-l-4',
      bgColor,
      borderColor,
      className
    )}>
      <div className="flex gap-3">
        <Icon className={cn('w-6 h-6 flex-shrink-0 mt-0.5', iconColor)} />
        <div className="flex-1">
          <h4 className={cn('font-bold text-lg mb-2', titleColor)}>
            {title || defaultTitle}
          </h4>
          <div className="text-gray-700 prose prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Inline Highlight - For emphasizing text
 */
export function Highlight({ children, color = 'emerald' }: { children: React.ReactNode, color?: 'emerald' | 'blue' | 'amber' | 'purple' }) {
  const colors = {
    emerald: 'bg-primary-100 text-primary-900 border-primary-300',
    blue: 'bg-secondary-100 text-secondary-900 border-secondary-300',
    amber: 'bg-amber-100 text-amber-900 border-amber-300',
    purple: 'bg-secondary-100 text-secondary-900 border-secondary-300'
  }

  return (
    <span className={cn(
      'px-2 py-0.5 rounded border font-semibold',
      colors[color]
    )}>
      {children}
    </span>
  )
}

/**
 * Stats Box - For displaying numbers/statistics
 */
export function StatBox({ label, value, trend, trendDirection }: {
  label: string
  value: string | number
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="bg-white border-2 border-primary-200 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-primary-600">{value}</p>
      {trend && (
        <p className={cn(
          'text-xs mt-1 font-medium',
          trendDirection === 'up' && 'text-green-600',
          trendDirection === 'down' && 'text-red-600',
          trendDirection === 'neutral' && 'text-gray-600'
        )}>
          {trend}
        </p>
      )}
    </div>
  )
}

/**
 * Comparison Table - For side-by-side comparisons
 */
export function ComparisonBox({ title, items }: {
  title: string
  items: Array<{ label: string; good?: string; bad?: string }>
}) {
  return (
    <div className="my-8 border-2 border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-primary-600 text-white px-6 py-3">
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="font-semibold text-gray-900">{item.label}</div>
            {item.good && (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>{item.good}</span>
              </div>
            )}
            {item.bad && (
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span>{item.bad}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Key Takeaways Box (like Investopedia)
 */
export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <div className="my-8 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-primary-500 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-6 h-6 text-primary-600" />
        <h3 className="text-xl font-bold text-primary-900">Key Takeaways</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <span className="text-gray-800 flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Formula Box - For displaying financial formulas
 */
export function FormulaBox({ title, formula, explanation }: {
  title: string
  formula: string
  explanation?: string
}) {
  return (
    <div className="my-6 bg-primary-50 border-2 border-indigo-400 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-5 h-5 text-primary-600" />
        <h4 className="font-bold text-primary-900">{title}</h4>
      </div>
      <div className="bg-white rounded p-4 font-mono text-center text-lg font-semibold text-gray-900 mb-3">
        {formula}
      </div>
      {explanation && (
        <p className="text-sm text-primary-800">{explanation}</p>
      )}
    </div>
  )
}

/**
 * Quick Facts Box
 */
export function QuickFacts({ facts }: { facts: Array<{ label: string; value: string }> }) {
  return (
    <div className="my-6 bg-slate-50 border border-slate-300 rounded-lg p-5">
      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Info className="w-5 h-5" />
        Quick Facts
      </h4>
      <dl className="space-y-2">
        {facts.map((fact, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
            <dt className="text-sm text-gray-600">{fact.label}</dt>
            <dd className="font-semibold text-gray-900">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
