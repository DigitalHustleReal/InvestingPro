"use client";

import React from 'react';
import { CategoryHeroProps } from '@/lib/visuals/types';

/**
 * Auto-generated Hero Graphic for Categories
 * 
 * Generates editorial, neutral, institutional visuals using:
 * - SVG diagrams
 * - Chart-based visuals
 * - Geometric patterns
 * - No stock photos, people, or random AI art
 */
export default function CategoryHero({ 
    category, 
    title, 
    description,
    metrics 
}: CategoryHeroProps) {
    const colorScheme = getCategoryColors(category);
    
    return (
        <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Background Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-600"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-between px-8 lg:px-16">
                {/* Left: Text */}
                <div className="flex-1 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* Right: Visual Diagram */}
                <div className="hidden lg:block w-96 h-96 flex-shrink-0">
                    <CategoryDiagram category={category} metrics={metrics} />
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorScheme.gradient}`} />
        </div>
    );
}

/**
 * Category-specific diagram generator
 */
function CategoryDiagram({ category, metrics }: { category: string; metrics?: any }) {
    switch (category) {
        case 'credit-cards':
            return <CreditCardDiagram metrics={metrics} />;
        case 'loans':
            return <LoanDiagram metrics={metrics} />;
        case 'banking':
            return <BankingDiagram metrics={metrics} />;
        case 'investing':
            return <InvestingDiagram metrics={metrics} />;
        case 'insurance':
            return <InsuranceDiagram metrics={metrics} />;
        default:
            return <GenericDiagram category={category} />;
    }
}

/**
 * Credit Card Diagram - Shows comparison metrics
 */
function CreditCardDiagram({ metrics }: { metrics?: any }) {
    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Card Shapes */}
            <rect x="50" y="100" width="120" height="80" rx="8" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" />
            <rect x="230" y="100" width="120" height="80" rx="8" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.4" />
            
            {/* Comparison Bars */}
            <rect x="50" y="220" width="80" height="8" fill="#10b981" opacity="0.8" />
            <rect x="50" y="240" width="120" height="8" fill="#10b981" opacity="0.6" />
            <rect x="50" y="260" width="100" height="8" fill="#10b981" opacity="0.4" />
            
            {/* Metrics Text */}
            <text x="200" y="200" fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">
                Compare Features
            </text>
            <text x="200" y="300" fill="#94a3b8" fontSize="12" textAnchor="middle">
                {metrics?.count || '500+'} Cards
            </text>
        </svg>
    );
}

/**
 * Loan Diagram - Shows interest rate comparison
 */
function LoanDiagram({ metrics }: { metrics?: any }) {
    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Interest Rate Bars */}
            <rect x="80" y="150" width="40" height="120" fill="#10b981" opacity="0.8" />
            <rect x="140" y="120" width="40" height="150" fill="#10b981" opacity="0.6" />
            <rect x="200" y="100" width="40" height="170" fill="#10b981" opacity="0.4" />
            <rect x="260" y="130" width="40" height="140" fill="#10b981" opacity="0.5" />
            
            {/* Axis */}
            <line x1="60" y1="280" x2="320" y2="280" stroke="#475569" strokeWidth="2" />
            <line x1="60" y1="280" x2="60" y2="80" stroke="#475569" strokeWidth="2" />
            
            {/* Labels */}
            <text x="200" y="310" fill="#94a3b8" fontSize="12" textAnchor="middle">
                Interest Rates
            </text>
            <text x="200" y="60" fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle">
                Compare Rates
            </text>
        </svg>
    );
}

/**
 * Banking Diagram - Shows deposit products
 */
function BankingDiagram({ metrics }: { metrics?: any }) {
    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Circular Progress Indicators */}
            <circle cx="200" cy="200" r="80" fill="none" stroke="#334155" strokeWidth="8" />
            <circle 
                cx="200" 
                cy="200" 
                r="80" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="8" 
                strokeDasharray={`${2 * Math.PI * 80 * 0.75} ${2 * Math.PI * 80}`}
                strokeDashoffset={-2 * Math.PI * 80 * 0.25}
                transform="rotate(-90 200 200)"
                opacity="0.8"
            />
            
            {/* Center Text */}
            <text x="200" y="195" fill="#e2e8f0" fontSize="24" fontWeight="bold" textAnchor="middle">
                {metrics?.rate || '9.5%'}
            </text>
            <text x="200" y="215" fill="#94a3b8" fontSize="12" textAnchor="middle">
                Best Rate
            </text>
        </svg>
    );
}

/**
 * Investing Diagram - Shows growth chart
 */
function InvestingDiagram({ metrics }: { metrics?: any }) {
    const points = "50,250 100,220 150,200 200,180 250,160 300,140 350,120";
    
    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Grid */}
            <defs>
                <pattern id="investGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#investGrid)" />
            
            {/* Growth Line */}
            <polyline
                points={points}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                opacity="0.8"
            />
            
            {/* Area Fill */}
            <polygon
                points={`${points} 350,250 50,250`}
                fill="#10b981"
                opacity="0.1"
            />
            
            {/* Axis */}
            <line x1="50" y1="250" x2="350" y2="250" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="250" x2="50" y2="100" stroke="#475569" strokeWidth="2" />
        </svg>
    );
}

/**
 * Insurance Diagram - Shows coverage visualization
 */
function InsuranceDiagram({ metrics }: { metrics?: any }) {
    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Shield Shape */}
            <path
                d="M 200 80 L 280 120 L 280 200 Q 280 280 200 320 Q 120 280 120 200 L 120 120 Z"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                opacity="0.6"
            />
            
            {/* Inner Shield */}
            <path
                d="M 200 120 L 250 150 L 250 210 Q 250 260 200 280 Q 150 260 150 210 L 150 150 Z"
                fill="#10b981"
                opacity="0.2"
            />
            
            {/* Coverage Text */}
            <text x="200" y="200" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle">
                Coverage
            </text>
            <text x="200" y="220" fill="#94a3b8" fontSize="12" textAnchor="middle">
                Protection Plans
            </text>
        </svg>
    );
}

/**
 * Generic Diagram for unknown categories
 */
function GenericDiagram({ category }: { category: string }) {
    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Geometric Pattern */}
            <circle cx="200" cy="200" r="60" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.4" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.2" />
            <rect x="150" y="150" width="100" height="100" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.3" transform="rotate(45 200 200)" />
        </svg>
    );
}

/**
 * Get color scheme for category
 */
function getCategoryColors(category: string) {
    const schemes: Record<string, { gradient: string }> = {
        'credit-cards': { gradient: 'from-indigo-500 to-purple-500' },
        'loans': { gradient: 'from-emerald-500 to-teal-500' },
        'banking': { gradient: 'from-blue-500 to-cyan-500' },
        'investing': { gradient: 'from-teal-500 to-emerald-500' },
        'insurance': { gradient: 'from-rose-500 to-pink-500' },
        'small-business': { gradient: 'from-amber-500 to-orange-500' },
    };
    
    return schemes[category] || { gradient: 'from-slate-500 to-slate-600' };
}

