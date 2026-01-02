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
        // Find all SIP Calculator placeholders
        const sipCalculators = document.querySelectorAll('[data-widget="sip-calculator"]');
        
        sipCalculators.forEach((el) => {
            // Prevent double hydration
            if (el.getAttribute('data-hydrated')) return;
            
            try {
                const root = createRoot(el);
                root.render(<SIPCalculator />);
                el.setAttribute('data-hydrated', 'true');
            } catch (e) {
                console.error("Failed to hydrate SIP Calculator", e);
            }
        });

        // Add other calculators here (e.g. data-widget="tax-calculator")

    }, []); // Run once on mount

    return null;
}
