"use client";

import React from 'react';

interface LogoIconProps {
    className?: string;
    fill?: string;
    background?: string;
}

/**
 * InvestingPro Logo Icon - IP Monogram
 * Clean, professional monogram using "I" and "P" letters
 * Inspired by NerdWallet's NW monogram style
 */
export default function LogoIcon({ 
    className = "w-10 h-10", 
    fill = "white",
    background = "#0d9488" // teal-600 default
}: LogoIconProps) {
    return (
        <svg 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="InvestingPro Logo"
        >
            {/* Background rounded rectangle */}
            <rect 
                width="32" 
                height="32" 
                rx="6" 
                fill={background}
            />
            
            {/* Letter I - Left vertical bar */}
            <rect 
                x="5" 
                y="5" 
                width="5" 
                height="22" 
                rx="1" 
                fill={fill}
            />
            
            {/* Letter P - Right side */}
            {/* P's vertical stem */}
            <rect 
                x="16" 
                y="5" 
                width="5" 
                height="22" 
                rx="1" 
                fill={fill}
            />
            
            {/* P's top rounded loop */}
            <path 
                d="M21 5 L21 14 C21 17.314 23.686 20 27 20 C30.314 20 33 17.314 33 14 C33 10.686 30.314 8 27 8 C23.686 8 21 10.686 21 14 Z" 
                fill={fill}
                transform="translate(-5, -5)"
            />
            
            {/* P's opening - create the bottom opening */}
            <rect 
                x="16" 
                y="14" 
                width="5" 
                height="13" 
                fill={background}
            />
        </svg>
    );
}
