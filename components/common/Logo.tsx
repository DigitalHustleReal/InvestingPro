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
        sm: { logo: 'w-6 h-6', text: 'text-lg', iconSize: 16 },
        md: { logo: 'w-8 h-8', text: 'text-[1.25rem]', iconSize: 20 },
        lg: { logo: 'w-10 h-10', text: 'text-2xl', iconSize: 24 }
    };

    // Color variants based on context
    const variantClasses = {
        default: {
            logoBg: 'bg-gradient-to-br from-primary-600 to-success-600',
            logoFill: 'white',
            brandText: 'text-slate-900 dark:text-white',
            accent: 'text-primary-600 dark:text-primary-400'
        },
        light: {
            logoBg: 'bg-white',
            logoFill: '#0d9488', // primary-600
            brandText: 'text-white',
            accent: 'text-primary-200'
        },
        dark: {
            logoBg: 'bg-gradient-to-br from-primary-600 to-success-600',
            logoFill: 'white',
            brandText: 'text-white',
            accent: 'text-primary-400'
        }
    };

    const currentSize = sizeClasses[size];
    const currentVariant = variantClasses[variant];

    return (
        <Link 
            href="/" 
            className={`flex items-center gap-2.5 group ${className}`}
            aria-label="InvestingPro Home"
        >
            {/* Logo Icon - Abstract Growth Symbol (3 Ascending Bars) */}
            <div className={`relative flex items-center justify-center ${currentSize.logo} rounded-lg ${currentVariant.logoBg} shadow-sm transition-transform group-hover:scale-105 duration-300`}>
                <svg 
                    width={currentSize.iconSize} 
                    height={currentSize.iconSize} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-sm"
                >
                    <path 
                        d="M6 20V14" 
                        stroke={currentVariant.logoFill} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                    <path 
                        d="M12 20V10" 
                        stroke={currentVariant.logoFill} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                    <path 
                        d="M18 20V4" 
                        stroke={currentVariant.logoFill} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            
            {/* Brand Text */}
            {showText && (
                <span className={`${currentSize.text} font-bold ${currentVariant.brandText} tracking-tight leading-none font-sans`}>
                    Investing<span className={currentVariant.accent}>P<span className="inline-block relative -top-[1px]">₹</span>o</span>
                </span>
            )}
        </Link>
    );
}
