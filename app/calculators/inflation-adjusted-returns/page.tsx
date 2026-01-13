"use client";

import { InflationAdjustedCalculator } from "@/components/calculators/InflationAdjustedCalculator";
import SEOHead from "@/components/common/SEOHead";
import { Breadcrumb } from "@/components/common/Breadcrumb";

export default function InflationAdjustedReturnsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <SEOHead
                title="Inflation Adjusted Returns Calculator - Real Value Calculator | InvestingPro"
                description="Calculate inflation-adjusted returns to understand the real value of your investments. Free calculator with accurate projections."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Breadcrumb 
                    items={[
                        { label: "Calculators", href: "/calculators" },
                        { label: "Inflation Adjusted Returns" }
                    ]} 
                />
                
                <div className="mt-8">
                    <InflationAdjustedCalculator />
                </div>
            </div>
        </div>
    );
}
