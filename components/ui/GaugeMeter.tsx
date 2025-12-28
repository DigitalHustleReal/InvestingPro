"use client";

import React from 'react';

interface GaugeMeterProps {
    value: number; // 0-100 percentage
    min?: number;
    max?: number;
    size?: number;
    label?: string;
    colors?: {
        low: string;
        medium: string;
        high: string;
    };
    showValue?: boolean;
    unit?: string;
}

export function GaugeMeter({
    value,
    min = 0,
    max = 100,
    size = 120,
    label,
    colors,
    showValue = true,
    unit = '%'
}: GaugeMeterProps) {
    // Default consistent color scheme (teal/emerald for positive, red for negative)
    const defaultColors = {
        low: '#ef4444', // red for negative/low
        medium: '#14b8a6', // teal
        high: '#10b981' // emerald
    };
    const gaugeColors = colors || defaultColors;
    
    // Clamp value between min and max
    const clampedValue = Math.max(min, Math.min(max, value));
    // Calculate percentage for the gauge (0-100)
    const percentage = ((clampedValue - min) / (max - min)) * 100;
    
    // Determine color based on percentage (consistent across all calculators)
    let color = gaugeColors.high; // Default to emerald
    if (percentage < 40) color = gaugeColors.low; // Red for low
    else if (percentage < 70) color = gaugeColors.medium; // Teal for medium
    
    // Gauge arc calculations (180 degree arc)
    const radius = size * 0.35;
    const centerX = size / 2;
    const centerY = size * 0.65;
    const strokeWidth = size * 0.08;
    
    // Start angle: -180 degrees (left side), End angle: 0 degrees (right side)
    const startAngle = -180;
    const endAngle = 0;
    const currentAngle = startAngle + (percentage / 100) * (endAngle - startAngle);
    
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (currentAngle * Math.PI) / 180;
    
    // Calculate arc path
    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    
    // Background arc
    const bgEndRad = (endAngle * Math.PI) / 180;
    const bgEndX = centerX + radius * Math.cos(bgEndRad);
    const bgEndY = centerY + radius * Math.sin(bgEndRad);
    const bgArcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${bgEndX} ${bgEndY}`;
    
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-full max-w-[120px] sm:max-w-none" style={{ width: size, height: size * 0.7 }}>
                <svg className="w-full h-auto" width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`} preserveAspectRatio="xMidYMid meet">
                    {/* Background arc */}
                    <path
                        d={bgArcPath}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Value arc */}
                    <path
                        d={arcPath}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                    />
                    {/* Needle/Center dot */}
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r={strokeWidth * 0.8}
                        fill={color}
                        className="transition-all duration-500 ease-out"
                    />
                </svg>
                
                {/* Value text */}
                {showValue && (
                    <div 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center w-full"
                        style={{ bottom: size * 0.05 }}
                    >
                        <div className="text-xl sm:text-2xl font-extrabold" style={{ color }}>
                            {clampedValue % 1 === 0 ? clampedValue.toFixed(0) : clampedValue.toFixed(1)}
                            {unit && <span className="text-sm sm:text-base ml-0.5 opacity-90">{unit}</span>}
                        </div>
                        {label && (
                            <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 sm:mt-1.5">
                                {label}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

