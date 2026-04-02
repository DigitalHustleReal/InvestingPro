/**
 * Credit Score Gauge Component - Week 3, Task 3.4
 * Purpose: Visual credit score display with gauge meter
 * 
 * Features:
 * - Animated gauge (300-900 range)
 * - Color-coded ranges
 * - Rating labels
 * - Responsive design
 */

"use client";

import { cn } from "@/lib/utils";
import { formatCreditScore } from "@/lib/utils/currency";
import { TrendingUp, Award } from "lucide-react";

interface CreditScoreGaugeProps {
  score: number;
  className?: string;
  showDetails?: boolean;
}

export function CreditScoreGauge({
  score,
  className,
  showDetails = true,
}: CreditScoreGaugeProps) {
  const { formatted, color, rating } = formatCreditScore(score);

  // Calculate gauge rotation (-90deg to +90deg)
  // Score range: 300-900
  const minScore = 300;
  const maxScore = 900;
  const normalizedScore = Math.min(Math.max(score, minScore), maxScore);
  const percentage = (normalizedScore - minScore) / (maxScore - minScore);
  const rotation = -90 + (percentage * 180); // -90deg (left) to +90deg (right)

  // Get gauge color
  const getGaugeColor = () => {
    if (score >= 750) return 'text-success-600';
    if (score >= 700) return 'text-primary-600';
    if (score >= 650) return 'text-warning-600';
    return 'text-danger-600';
  };

  // Get background arc colors
  const getArcColor = (rangeMin: number, rangeMax: number) => {
    if (score >= rangeMin && score < rangeMax) {
      return 'opacity-100';
    }
    return 'opacity-30';
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Gauge Container */}
      <div className="relative w-64 h-32 mb-4">
        {/* Background Arc (SVG) */}
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Poor Range (300-650) - Red */}
          <path
            d="M 10 90 A 80 80 0 0 1 65 20"
            fill="none"
            stroke="#EF4444"
            strokeWidth="12"
            strokeLinecap="round"
            className={getArcColor(300, 650)}
          />
          
          {/* Fair Range (650-700) - Amber */}
          <path
            d="M 65 20 A 80 80 0 0 1 100 10"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="12"
            strokeLinecap="round"
            className={getArcColor(650, 700)}
          />
          
          {/* Good Range (700-750) - Teal */}
          <path
            d="M 100 10 A 80 80 0 0 1 135 20"
            fill="none"
            stroke="#0A5F56"
            strokeWidth="12"
            strokeLinecap="round"
            className={getArcColor(700, 750)}
          />
          
          {/* Excellent Range (750-900) - Green */}
          <path
            d="M 135 20 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="#10B981"
            strokeWidth="12"
            strokeLinecap="round"
            className={getArcColor(750, 900)}
          />

          {/* Needle */}
          <g transform={`rotate(${rotation} 100 90)`}>
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="25"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={cn("transition-transform duration-700 ease-out", getGaugeColor())}
            />
            <circle
              cx="100"
              cy="90"
              r="6"
              fill="currentColor"
              className={getGaugeColor()}
            />
          </g>
        </svg>

        {/* Score Display (Center) */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className={cn("text-5xl font-bold font-mono", color)}>
            {formatted}
          </div>
        </div>
      </div>

      {/* Rating Label */}
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm",
        score >= 750 && "bg-success-100 text-success-700",
        score >= 700 && score < 750 && "bg-primary-100 text-primary-700",
        score >= 650 && score < 700 && "bg-warning-100 text-warning-700",
        score < 650 && "bg-danger-100 text-danger-700"
      )}>
        {score >= 750 && <Award className="w-4 h-4" />}
        {score >= 700 && score < 750 && <TrendingUp className="w-4 h-4" />}
        <span>{rating}</span>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="mt-6 w-full max-w-sm space-y-2">
          {/* Range Labels */}
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-2">
            <span>300</span>
            <span>900</span>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Range</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">300 - 900</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Score</p>
              <p className={cn("text-sm font-semibold", color)}>{score}</p>
            </div>
          </div>

          {/* Rating Guide */}
          <div className="mt-4 p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
            <p className="text-xs font-semibold text-secondary-900 mb-2">Credit Score Guide:</p>
            <div className="space-y-1 text-xs text-secondary-800">
              <div className="flex justify-between">
                <span>• 750+ (Excellent)</span>
                <span className="text-success-700 font-medium">Best rates</span>
              </div>
              <div className="flex justify-between">
                <span>• 700-749 (Good)</span>
                <span className="text-primary-700 font-medium">Good approval</span>
              </div>
              <div className="flex justify-between">
                <span>• 650-699 (Fair)</span>
                <span className="text-warning-700 font-medium">Moderate rates</span>
              </div>
              <div className="flex justify-between">
                <span>• Below 650 (Poor)</span>
                <span className="text-danger-700 font-medium">Limited options</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact gauge without details
 */
export function CompactCreditScoreGauge(
  props: Omit<CreditScoreGaugeProps, 'showDetails'>
) {
  return <CreditScoreGauge {...props} showDetails={false} />;
}
