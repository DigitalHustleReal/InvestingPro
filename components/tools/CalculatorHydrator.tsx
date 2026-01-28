"use client";

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import SIPCalculator from './SIPCalculator';

/**
 * Hydrates static HTML placeholders with interactive React widgets
 * Usage: <div data-widget="sip-calculator"></div>
 */
export default function CalculatorHydrator() {
    useEffect(() => {
        // 1. Find all SIP Calculator placeholders
        const sipCalculators = document.querySelectorAll('[data-widget="sip-calculator"]');
        sipCalculators.forEach((el) => {
            if (el.getAttribute('data-hydrated')) return;
            try {
                const root = createRoot(el);
                root.render(<SIPCalculator />);
                el.setAttribute('data-hydrated', 'true');
            } catch (e) {
                console.error("Failed to hydrate SIP Calculator", e);
            }
        });

        // 2. Find all Auto Calculator placeholders
        const autoCalculators = document.querySelectorAll('[data-widget="auto-calculator"]');
        autoCalculators.forEach((el) => {
            if (el.getAttribute('data-hydrated')) return;
            try {
                const path = window.location.pathname;
                const root = createRoot(el);
                
                // Determine widget based on path
                if (path.includes('mutual-fund') || path.includes('investment')) {
                    root.render(<SIPCalculator />);
                } else if (path.includes('loan') || path.includes('credit-card')) {
                    // Fallback to EMI for debt-related or just SIP as general
                    root.render(<SIPCalculator />); // TODO: Replace with EMICalculator once ready
                } else {
                    root.render(<SIPCalculator />);
                }
                
                el.setAttribute('data-hydrated', 'true');
            } catch (e) {
                console.error("Failed to hydrate Auto Calculator", e);
            }
        });

    }, []); // Run once on mount

    return null;
}
