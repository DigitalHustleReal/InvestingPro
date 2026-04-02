"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: 'auto' | 'green' | 'red' | 'gray';
  strokeWidth?: number;
  className?: string;
  showDot?: boolean;
}

/**
 * Minimal SVG sparkline chart — inline mini chart for product cards/tables.
 * Auto-colors green (up) or red (down) based on first vs last value.
 */
export default function Sparkline({
  data,
  width = 80,
  height = 24,
  color = 'auto',
  strokeWidth = 1.5,
  className,
  showDot = true,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const isUp = data[data.length - 1] >= data[0];
  const strokeColor = color === 'auto'
    ? (isUp ? '#16a34a' : '#ef4444')
    : color === 'green' ? '#16a34a'
    : color === 'red' ? '#ef4444'
    : '#9ca3af';

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return { x, y };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const lastPoint = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("inline-block", className)}
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {showDot && lastPoint && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2}
          fill={strokeColor}
        />
      )}
    </svg>
  );
}
