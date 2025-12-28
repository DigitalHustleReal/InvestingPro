"use client";

import React from 'react';
import Link from 'next/link';

interface LogoProps {
    variant?: 'default' | 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
}

/**
 * InvestingPro Logo Component
 * Features "I" and "P" monogram similar to NerdWallet's "NW" style
 * Professional, institutional design with variants for different contexts
 */
export default function Logo({ 
    variant = 'default', 
    size = 'md',
    showText = true,
    className = '' 
}: LogoProps) {
    // Size variants
    const sizeClasses = {
        sm: { logo: 'w-8 h-8', text: 'text-lg', iconSize: 20 },
        md: { logo: 'w-10 h-10', text: 'text-xl', iconSize: 24 },
        lg: { logo: 'w-12 h-12', text: 'text-2xl', iconSize: 28 }
    };

    // Color variants based on context
    const variantClasses = {
        default: {
            logoBg: 'bg-gradient-to-br from-teal-600 to-emerald-600',
            logoFill: 'white',
            brandText: 'text-slate-900'
        },
        light: {
            logoBg: 'bg-white',
            logoFill: '#0d9488', // teal-600
            brandText: 'text-white'
        },
        dark: {
            logoBg: 'bg-gradient-to-br from-teal-600 to-emerald-600',
            logoFill: 'white',
            brandText: 'text-white'
        }
    };

    const currentSize = sizeClasses[size];
    const currentVariant = variantClasses[variant];

    return (
        <Link 
            href="/" 
            className={`flex items-center gap-2.5 ${className}`}
            aria-label="InvestingPro Home"
        >
            {/* Logo Icon - IP Monogram */}
            <div className={`${currentSize.logo} ${currentVariant.logoBg} rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20`}>
                <svg 
                    width={currentSize.iconSize} 
                    height={currentSize.iconSize} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                >
                    {/* Letter I - Left vertical bar */}
                    <rect 
                        x="3" 
                        y="4" 
                        width="4.5" 
                        height="16" 
                        rx="0.75" 
                        fill={currentVariant.logoFill}
                    />
                    
                    {/* Letter P - Right side */}
                    {/* P's vertical stem */}
                    <rect 
                        x="11.5" 
                        y="4" 
                        width="4.5" 
                        height="16" 
                        rx="0.75" 
                        fill={currentVariant.logoFill}
                    />
                    
                    {/* P's top rounded loop - simplified path */}
                    <ellipse 
                        cx="18.5" 
                        cy="10.5" 
                        rx="4" 
                        ry="3.5" 
                        fill={currentVariant.logoFill}
                    />
                    
                    {/* P's opening - create the bottom opening by masking */}
                    <rect 
                        x="11.5" 
                        y="10.5" 
                        width="4.5" 
                        height="9.5" 
                        fill={currentVariant.logoBg}
                    />
                </svg>
            </div>
            
            {/* Brand Text */}
            {showText && (
                <span className={`${currentSize.text} font-bold ${currentVariant.brandText} tracking-tight`}>
                    InvestingPro
                </span>
            )}
        </Link>
    );
}
