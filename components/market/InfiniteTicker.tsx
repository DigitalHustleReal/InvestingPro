"use client";

import { useEffect, useState } from 'react';
import { getMarketIndices, MarketIndex } from '@/lib/market/service';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function InfiniteTicker() {
    const [indices, setIndices] = useState<MarketIndex[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchData = async () => {
            try {
                const data = await getMarketIndices();
                setIndices(data);
            } catch (error) {
                console.error("Failed to fetch market data", error);
            }
        };

        fetchData();
        // Simulate "Live" updates every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted || indices.length === 0) return null;

    // Duplicate data to ensure seamless scroll
    // Enough duplicates to fill a 4k screen width with items
    const tickerData = [...indices, ...indices, ...indices, ...indices];

    return (
        <div className="w-full bg-slate-950 border-b border-slate-800 overflow-hidden h-10 flex items-center relative z-40">
            {/* Gradient Fade Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>
            
            {/* Rolling Ticker */}
            <div className="flex animate-ticker whitespace-nowrap hover:pause">
                {tickerData.map((item, index) => (
                    <div 
                        key={`${item.id}-${index}`} 
                        className="inline-flex items-center gap-3 px-6 border-r border-slate-800/50 group cursor-pointer hover:bg-slate-900/50 transition-colors"
                    >
                        <div className="flex flex-col items-start justify-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                                {item.name}
                            </span>
                            {item.subtext && (
                                <span className="text-[10px] text-slate-600 leading-none">
                                    {item.subtext}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-slate-200 group-hover:text-white transition-colors">
                                {item.displayValue}
                            </span>
                            
                            {item.trend !== 'neutral' && (
                                <span className={`flex items-center text-xs font-bold ${
                                    item.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                                }`}>
                                    {item.trend === 'up' ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
