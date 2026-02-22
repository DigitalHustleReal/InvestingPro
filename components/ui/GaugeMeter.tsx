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

/** Text labels for each band — used alongside color for color-blind users. */
const BAND_LABELS = {
    low:    { short: 'Low',    detail: 'Needs Work'    },
    medium: { short: 'Medium', detail: 'Getting There' },
    high:   { short: 'High',   detail: 'Excellent'     },
} as const;

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
    // Default consistent color scheme — orange replaces red so color-blind users
    // can distinguish Low/High without relying solely on hue.
    const defaultColors = {
        low:    '#f97316', // orange  (visible to deuteranopes)
        medium: '#14b8a6', // teal
        high:   '#10b981', // emerald
    };
    const gaugeColors = colors || defaultColors;

    // Clamp value between min and max
    const clampedValue = Math.max(min, Math.min(max, value));
    // Calculate percentage for the gauge (0-100)
    const percentage = ((clampedValue - min) / (max - min)) * 100;

    // Determine color & band based on percentage
    let color = gaugeColors.high;
    let band: keyof typeof BAND_LABELS = 'high';
    if (percentage < 40)      { color = gaugeColors.low;    band = 'low';    }
    else if (percentage < 70) { color = gaugeColors.medium; band = 'medium'; }

    // Gauge arc calculations (180-degree arc)
    const radius      = size * 0.35;
    const centerX     = size / 2;
    const centerY     = size * 0.65;
    const strokeWidth = size * 0.08;

    const startAngle   = -180;
    const endAngle     = 0;
    const currentAngle = startAngle + (percentage / 100) * (endAngle - startAngle);

    const startRad = (startAngle   * Math.PI) / 180;
    const endRad   = (currentAngle * Math.PI) / 180;

    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    const endX   = centerX + radius * Math.cos(endRad);
    const endY   = centerY + radius * Math.sin(endRad);

    const largeArcFlag = percentage > 50 ? 1 : 0;
    const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    // Background arc (full 180°)
    const bgEndRad  = (endAngle * Math.PI) / 180;
    const bgEndX    = centerX + radius * Math.cos(bgEndRad);
    const bgEndY    = centerY + radius * Math.sin(bgEndRad);
    const bgArcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${bgEndX} ${bgEndY}`;

    const accessibleLabel =
        `${label ? label + ': ' : ''}${clampedValue}${unit} — ${BAND_LABELS[band].short} (${BAND_LABELS[band].detail})`;

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-full max-w-[120px] sm:max-w-none" style={{ width: size, height: size * 0.7 }}>
                <svg
                    className="w-full h-auto"
                    width={size}
                    height={size * 0.7}
                    viewBox={`0 0 ${size} ${size * 0.7}`}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label={accessibleLabel}
                >
                    {/* Screen-reader title */}
                    <title>{accessibleLabel}</title>

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
                    {/* Centre dot */}
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r={strokeWidth * 0.8}
                        fill={color}
                        className="transition-all duration-500 ease-out"
                    />
                </svg>

                {/* Numeric value */}
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
                            <div className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 sm:mt-1.5">
                                {label}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Accessible band label — text supplement to color for color-blind users */}
            <div
                className="mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ color, backgroundColor: `${color}18` }}
                aria-hidden="true"
            >
                {BAND_LABELS[band].short} · {BAND_LABELS[band].detail}
            </div>
        </div>
    );
}
