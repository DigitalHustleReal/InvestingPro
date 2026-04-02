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
      bgColor: 'bg-primary-50 dark:bg-primary-950',
      borderColor: 'border-primary-500 dark:border-primary-400',
      iconColor: 'text-primary-600 dark:text-primary-400',
      titleColor: 'text-primary-900 dark:text-primary-100',
      defaultTitle: 'Key Takeaway'
    },
    'important': {
      icon: AlertCircle,
      bgColor: 'bg-secondary-50 dark:bg-secondary-950',
      borderColor: 'border-secondary-500 dark:border-secondary-400',
      iconColor: 'text-primary-600 dark:text-primary-400',
      titleColor: 'text-secondary-900 dark:text-secondary-100',
      defaultTitle: 'Important'
    },
    'tip': {
      icon: Lightbulb,
      bgColor: 'bg-accent-50 dark:bg-accent-950',
      borderColor: 'border-accent-500 dark:border-accent-400',
      iconColor: 'text-accent-600 dark:text-accent-400',
      titleColor: 'text-accent-900 dark:text-accent-100',
      defaultTitle: 'Pro Tip'
    },
    'warning': {
      icon: AlertTriangle,
      bgColor: 'bg-danger-50 dark:bg-danger-950',
      borderColor: 'border-danger-500 dark:border-danger-400',
      iconColor: 'text-danger-600 dark:text-danger-400',
      titleColor: 'text-danger-900 dark:text-danger-100',
      defaultTitle: 'Warning'
    },
    'example': {
      icon: TrendingUp,
      bgColor: 'bg-secondary-50 dark:bg-secondary-950',
      borderColor: 'border-secondary-500 dark:border-secondary-400',
      iconColor: 'text-secondary-600 dark:text-secondary-400',
      titleColor: 'text-secondary-900 dark:text-secondary-100',
      defaultTitle: 'Example'
    },
    'definition': {
      icon: Info,
      bgColor: 'bg-gray-50 dark:bg-gray-900',
      borderColor: 'border-gray-400 dark:border-gray-600',
      iconColor: 'text-gray-600 dark:text-gray-400',
      titleColor: 'text-gray-900 dark:text-gray-100',
      defaultTitle: 'Definition'
    },
    'calculation': {
      icon: Calculator,
      bgColor: 'bg-primary-50 dark:bg-primary-950',
      borderColor: 'border-primary-500 dark:border-primary-400',
      iconColor: 'text-primary-600 dark:text-primary-400',
      titleColor: 'text-primary-900 dark:text-primary-100',
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
          <div className="text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none">
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
    emerald: 'bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100 border-primary-300 dark:border-primary-700',
    blue: 'bg-secondary-100 dark:bg-secondary-900/50 text-secondary-900 dark:text-secondary-100 border-secondary-300 dark:border-secondary-700',
    amber: 'bg-accent-100 dark:bg-accent-900/50 text-accent-900 dark:text-accent-100 border-accent-300 dark:border-accent-700',
    purple: 'bg-secondary-100 dark:bg-secondary-900/50 text-secondary-900 dark:text-secondary-100 border-secondary-300 dark:border-secondary-700'
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
    <div className="bg-white dark:bg-gray-800 border-2 border-primary-200 dark:border-primary-700 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
      {trend && (
        <p className={cn(
          'text-xs mt-1 font-medium',
          trendDirection === 'up' && 'text-success-600 dark:text-success-400',
          trendDirection === 'down' && 'text-danger-600 dark:text-danger-400',
          trendDirection === 'neutral' && 'text-gray-600 dark:text-gray-400'
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
    <div className="my-8 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-3">
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800">
            <div className="font-semibold text-gray-900 dark:text-white">{item.label}</div>
            {item.good && (
              <div className="flex items-center gap-2 text-success-700 dark:text-success-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{item.good}</span>
              </div>
            )}
            {item.bad && (
              <div className="flex items-center gap-2 text-danger-700 dark:text-danger-400">
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
    <div className="my-8 bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-2 border-primary-500 dark:border-primary-600 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100">Key Takeaways</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <span className="text-gray-800 dark:text-gray-200 flex-1">{item}</span>
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
    <div className="my-6 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-400 dark:border-primary-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-5 h-5 text-primary-600" />
        <h4 className="font-bold text-primary-900">{title}</h4>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded p-4 font-mono text-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {formula}
      </div>
      {explanation && (
        <p className="text-sm text-primary-800 dark:text-primary-300">{explanation}</p>
      )}
    </div>
  )
}

/**
 * Quick Facts Box
 */
export function QuickFacts({ facts }: { facts: Array<{ label: string; value: string }> }) {
  return (
    <div className="my-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg p-5">
      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        Quick Facts
      </h4>
      <dl className="space-y-2">
        {facts.map((fact, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <dt className="text-sm text-gray-600 dark:text-gray-400">{fact.label}</dt>
            <dd className="font-semibold text-gray-900 dark:text-white">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
