"use client";

import React from 'react';

interface TrendSparklineProps {
    data?: number[];
    color?: string;
    width?: number;
    height?: number;
    trend?: 'up' | 'down' | 'neutral';
}

export function TrendSparkline({ 
    data = [10, 15, 12, 18, 25, 22, 30], 
    color = "#10b981", 
    width = 60, 
    height = 24,
    trend = 'up'
}: TrendSparklineProps) {
    // If no data provided, generate a deterministic mock pattern based on trend
    const points = data;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    // Create SVG path
    const path = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * height; // Invert y for SVG
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    const fillColor = trend === 'up' ? 'text-success-500' : trend === 'down' ? 'text-danger-500' : 'text-gray-600';
    const strokeColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8';

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
             {/* Gradient Definition */}
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            
            {/* Area Fill */}
            <path 
                d={`${path} L ${width},${height} L 0,${height} Z`} 
                fill={`url(#grad-${color})`} 
                stroke="none" 
            />
            
            {/* Line */}
            <path 
                d={path} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </svg>
    );
}
