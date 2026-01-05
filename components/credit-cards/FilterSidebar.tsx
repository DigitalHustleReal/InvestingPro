
"use client";

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Filter, Search } from "lucide-react";

export interface CCFilterState {
    maxFee: number;
    minRewardRate: number;
    networks: string[];
    issuers: string[];
    features: string[];
}

interface FilterSidebarProps {
    filters: CCFilterState;
    setFilters: React.Dispatch<React.SetStateAction<CCFilterState>>;
}

const NETWORKS = ["Visa", "Mastercard", "Amex", "Rupay"];
const ISSUERS = ["HDFC", "SBI", "Axis", "ICICI", "Amex", "IDFC First"];
const FEATURES = ["Lounge Access", "No Forex Fee", "Fuel Surcharge Waiver", "Golf Access", "Air Miles"];

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
    
    const handleReset = () => {
        setFilters({
            maxFee: 10000,
            minRewardRate: 0,
            networks: [],
            issuers: [],
            features: []
        });
    };

    const toggleArrayItem = (key: keyof CCFilterState, value: string) => {
        setFilters(prev => {
            const current = (prev[key] as string[]);
            const newArray = current.includes(value) 
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [key]: newArray };
        });
    };

    return (
         <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full lg:sticky lg:top-28">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary-500" />
                    Card Finder
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-slate-500 hover:text-primary-600">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
            </div>

            <div className="p-5 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
                
                {/* 1. Annual Fee Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Annual Fee</label>
                         <span className="text-sm font-bold text-slate-900 dark:text-white">₹{filters.maxFee}</span>
                    </div>
                    <Slider
                        defaultValue={[filters.maxFee]}
                        max={20000}
                        step={500}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, maxFee: val[0] }))}
                    />
                </div>

                {/* 2. Issuer Filter */}
                <div className="space-y-3">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issuer Bank</label>
                     <div className="grid grid-cols-2 gap-2">
                        {ISSUERS.map(issuer => (
                            <button
                                key={issuer}
                                onClick={() => toggleArrayItem('issuers', issuer)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                                    filters.issuers.includes(issuer)
                                        ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 border-secondary-200 dark:border-secondary-700'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-transparent hover:border-slate-200'
                                }`}
                            >
                                {issuer}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Features */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Premium Features</label>
                    <div className="space-y-2">
                        {FEATURES.map((feat) => (
                            <div className="flex items-center space-x-2" key={feat}>
                                <Checkbox 
                                    id={`feat-${feat}`} 
                                    checked={filters.features.includes(feat)}
                                    onCheckedChange={() => toggleArrayItem('features', feat)}
                                />
                                <Label htmlFor={`feat-${feat}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                                    {feat}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* 4. Network */}
                 <div className="space-y-3">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Network</label>
                     <div className="flex flex-wrap gap-2">
                         {NETWORKS.map(net => (
                             <button
                                key={net}
                                onClick={() => toggleArrayItem('networks', net)}
                                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                                    filters.networks.includes(net)
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                             >
                                 {net}
                             </button>
                         ))}
                     </div>
                 </div>

            </div>
         </div>
    );
}
