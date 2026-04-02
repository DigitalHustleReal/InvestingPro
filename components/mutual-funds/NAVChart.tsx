"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NAVPoint {
  date: string;
  nav: number;
}

interface NAVChartProps {
  fundName: string;
  navHistory: NAVPoint[];
  currentNAV: number;
  className?: string;
}

type Period = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL';

const PERIODS: { key: Period; label: string; months: number }[] = [
  { key: '1M', label: '1M', months: 1 },
  { key: '3M', label: '3M', months: 3 },
  { key: '6M', label: '6M', months: 6 },
  { key: '1Y', label: '1Y', months: 12 },
  { key: '3Y', label: '3Y', months: 36 },
  { key: '5Y', label: '5Y', months: 60 },
  { key: 'ALL', label: 'All', months: 9999 },
];

function parseDate(dateStr: string): Date {
  // Handle DD-MM-YYYY format
  if (dateStr.includes('-') && dateStr.split('-')[0].length <= 2) {
    const [day, month, year] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  return new Date(dateStr);
}

function formatDate(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

export default function NAVChart({ fundName, navHistory, currentNAV, className }: NAVChartProps) {
  const [period, setPeriod] = useState<Period>('1Y');
  const [hoveredPoint, setHoveredPoint] = useState<NAVPoint | null>(null);

  const filteredData = useMemo(() => {
    if (!navHistory || navHistory.length === 0) return [];

    const sorted = [...navHistory].sort((a, b) =>
      parseDate(a.date).getTime() - parseDate(b.date).getTime()
    );

    const periodDef = PERIODS.find(p => p.key === period);
    if (!periodDef || periodDef.months === 9999) return sorted;

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - periodDef.months);

    return sorted.filter(p => parseDate(p.date) >= cutoff);
  }, [navHistory, period]);

  const { minNAV, maxNAV, periodReturn, startNAV } = useMemo(() => {
    if (filteredData.length === 0) return { minNAV: 0, maxNAV: 0, periodReturn: 0, startNAV: 0 };
    const navs = filteredData.map(d => d.nav);
    const min = Math.min(...navs);
    const max = Math.max(...navs);
    const start = filteredData[0].nav;
    const end = filteredData[filteredData.length - 1].nav;
    const ret = ((end - start) / start) * 100;
    return { minNAV: min, maxNAV: max, periodReturn: ret, startNAV: start };
  }, [filteredData]);

  if (!navHistory || navHistory.length === 0) {
    return null;
  }

  const isPositive = periodReturn >= 0;

  // SVG chart dimensions
  const width = 800;
  const height = 200;
  const padding = { top: 10, right: 10, bottom: 5, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate SVG path
  const range = maxNAV - minNAV || 1;
  const points = filteredData.map((d, i) => {
    const x = padding.left + (i / (filteredData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.nav - minNAV) / range) * chartHeight;
    return { x, y, data: d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${height} L ${padding.left} ${height} Z`;

  const displayPoint = hoveredPoint || filteredData[filteredData.length - 1];
  const displayReturn = hoveredPoint
    ? ((hoveredPoint.nav - startNAV) / startNAV) * 100
    : periodReturn;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            NAV Movement
          </CardTitle>
          <div className="flex items-center gap-1">
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                  period === p.key
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Current value display */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-2xl font-bold text-gray-900 tabular-nums">
            ₹{displayPoint?.nav?.toFixed(2) || currentNAV.toFixed(2)}
          </span>
          <span className={cn(
            "flex items-center gap-0.5 text-sm font-semibold tabular-nums",
            displayReturn >= 0 ? "text-green-600" : "text-red-500"
          )}>
            {displayReturn >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {displayReturn >= 0 ? '+' : ''}{displayReturn.toFixed(2)}%
          </span>
          {displayPoint && (
            <span className="text-xs text-gray-400">{formatDate(displayPoint.date)}</span>
          )}
        </div>

        {/* SVG Chart */}
        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-[200px]"
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Gradient fill */}
            <defs>
              <linearGradient id={`navGradient-${period}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? '#16a34a' : '#ef4444'} stopOpacity="0.15" />
                <stop offset="100%" stopColor={isPositive ? '#16a34a' : '#ef4444'} stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={areaPath}
              fill={`url(#navGradient-${period})`}
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke={isPositive ? '#16a34a' : '#ef4444'}
              strokeWidth="2"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Hover areas */}
            {points.map((p, i) => (
              <rect
                key={i}
                x={p.x - chartWidth / points.length / 2}
                y={0}
                width={chartWidth / points.length}
                height={height}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPoint(p.data)}
              />
            ))}

            {/* Hover dot */}
            {hoveredPoint && (() => {
              const hp = points.find(p => p.data.date === hoveredPoint.date);
              if (!hp) return null;
              return (
                <>
                  <line x1={hp.x} y1={0} x2={hp.x} y2={height} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 2" />
                  <circle cx={hp.x} cy={hp.y} r="4" fill={isPositive ? '#16a34a' : '#ef4444'} stroke="white" strokeWidth="2" />
                </>
              );
            })()}
          </svg>
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 tabular-nums">
          <span>Low: ₹{minNAV.toFixed(2)}</span>
          <span>High: ₹{maxNAV.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
