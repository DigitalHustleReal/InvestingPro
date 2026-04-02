import React from 'react';
import { Info } from 'lucide-react';

export function AdvertiserDisclosure({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-start gap-2 p-3 bg-gray-50/50 border border-gray-100 rounded-lg text-xs text-gray-500 ${className}`}>
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-600" />
            <p>
                <span className="font-semibold text-gray-600">Advertiser Disclosure:</span> InvestingPro.in is an independent comparison platform. 
                We may receive compensation when you click on links to products from our partners (like Banks or AMCs). 
                However, our reviews, ratings, and comparisons are based on objective analysis and are never influenced by compensation.
            </p>
        </div>
    );
}
