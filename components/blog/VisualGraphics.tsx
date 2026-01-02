import React from 'react'

/**
 * CSS-Based Visual Graphics Components
 * 
 * These render instantly without requiring external images
 * Perfect for charts, progress bars, comparisons, and visual data
 */

interface ProgressBarProps {
  label: string
  percentage: number
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple'
  showValue?: boolean
}

/**
 * Progress Bar / Percentage Indicator
 */
export function ProgressBar({ label, percentage, color = 'emerald', showValue = true }: ProgressBarProps) {
  const colors = {
    emerald: 'bg-primary-600',
    blue: 'bg-primary-600',
    amber: 'bg-amber-500',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && <span className="text-sm font-bold text-gray-900">{percentage}%</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Pie Chart (CSS-based, no images)
 */
export function PieChart({ segments }: { segments: Array<{ label: string; percentage: number; color: string }> }) {
  let currentAngle = 0
  
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 my-6">
      {/* Pie Chart Visual */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden" style={{ 
        background: `conic-gradient(
          ${segments.map((seg, index) => {
            const startAngle = currentAngle
            currentAngle += (seg.percentage / 100) * 360
            return `${seg.color} ${startAngle}deg ${currentAngle}deg`
          }).join(', ')}
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
        {segments.map((seg, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: seg.color }} />
            <span className="text-sm text-gray-700">{seg.label}</span>
            <span className="text-sm font-semibold text-gray-900">{seg.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Bar Chart (Vertical)
 */
export function BarChart({ data, maxValue }: { 
  data: Array<{ label: string; value: number; color?: string }>
  maxValue?: number
}) {
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  return (
    <div className="my-6 p-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-end justify-around gap-4 h-64">
        {data.map((item, index) => {
          const heightPercentage = (item.value / max) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="mb-2 text-sm font-semibold text-gray-900">
                {item.value}
              </div>
              <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: `${heightPercentage}%` }}>
                <div 
                  className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
                  style={{ 
                    height: '100%',
                    backgroundColor: item.color || '#10b981'
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-center text-gray-600 max-w-[80px]">
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Comparison Slider
 */
export function ComparisonSlider({ 
  option1, 
  option2, 
  percentage 
}: { 
  option1: string
  option2: string
  percentage: number 
}) {
  return (
    <div className="my-6 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-gray-200">
      <div className="flex justify-between mb-3">
        <span className="font-semibold text-gray-900">{option1}</span>
        <span className="font-semibold text-gray-900">{option2}</span>
      </div>
      <div className="relative h-12 bg-white rounded-full overflow-hidden border-2 border-gray-300">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-end pr-4 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        >
          <span className="text-white font-bold text-sm">{percentage}%</span>
        </div>
        <div 
          className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-start pl-4"
          style={{ width: `${100 - percentage}%` }}
        >
          <span className="text-white font-bold text-sm">{100 - percentage}%</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Timeline / Process Flow
 */
export function Timeline({ steps }: { steps: Array<{ title: string; description: string }> }) {
  return (
    <div className="my-6">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4 mb-6 last:mb-0">
          {/* Step Number Circle */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 h-full bg-emerald-200 mt-2" />
            )}
          </div>
          
          {/* Step Content */}
          <div className="flex-1 pb-6">
            <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Rating/Score Display
 */
export function RatingDisplay({ rating, maxRating = 5, label }: { rating: number; maxRating?: number; label?: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className="flex gap-1">
        {Array.from({ length: maxRating }).map((_, index) => (
          <svg
            key={index}
            className={`w-6 h-6 ${index < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-bold text-gray-900">{rating}/{maxRating}</span>
    </div>
  )
}

/**
 * Growth Arrow Indicator
 */
export function GrowthIndicator({ 
  value, 
  trend 
}: { 
  value: string | number
  trend: 'up' | 'down' | 'neutral'
}) {
  const colors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }
  
  const arrows = {
    up: '↗',
    down: '↘',
    neutral: '→'
  }
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 ${
      trend === 'up' ? 'border-green-200' : trend === 'down' ? 'border-red-200' : 'border-gray-200'
    }`}>
      <span className={`text-2xl font-bold ${colors[trend]}`}>{value}</span>
      <span className={`text-2xl ${colors[trend]}`}>{arrows[trend]}</span>
    </div>
  )
}

/**
 * Feature Comparison Grid
 */
export function FeatureGrid({ 
  features 
}: { 
  features: Array<{ name: string; available: boolean }>
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
      {features.map((feature, index) => (
        <div 
          key={index}
          className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
            feature.available 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            feature.available ? 'bg-primary-600' : 'bg-gray-400'
          }`}>
            <span className="text-white text-sm font-bold">
              {feature.available ? '✓' : '✗'}
            </span>
          </div>
          <span className={`text-sm font-medium ${
            feature.available ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {feature.name}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Metric Card with Icon
 */
export function MetricCard({ 
  icon, 
  label, 
  value, 
  change,
  changeType 
}: { 
  icon: string
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}) {
  return (
    <div className="bg-white border-2 border-emerald-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold text-emerald-600 mb-2">{value}</p>
      {change && (
        <p className={`text-xs font-medium ${
          changeType === 'positive' ? 'text-green-600' : 
          changeType === 'negative' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {change}
        </p>
      )}
    </div>
  )
}
