"use client";

import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Filter, Search, ChevronDown, ChevronUp, ShoppingCart, Plane, Fuel as FuelIcon, Utensils, Clapperboard, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface CCFilterState {
    maxFee: number;
    minRewardRate: number;
    networks: string[];
    issuers: string[];
    features: string[];
    spendingCategories: string[];
    creditScore: string[]; // NEW
    rewardsType: string[]; // NEW
    cardType: string[]; // NEW
}

interface FilterSidebarProps {
    filters: CCFilterState;
    setFilters: React.Dispatch<React.SetStateAction<CCFilterState>>;
}

const NETWORKS = ["Visa", "Mastercard", "Amex", "Rupay"];
const ISSUERS = ["HDFC", "SBI", "Axis", "ICICI", "Amex", "IDFC First", "Kotak", "IndusInd", "RBL", "Yes Bank", "Standard Chartered", "Citi"];
const FEATURES = ["Lounge Access", "No Forex Fee", "Fuel Surcharge Waiver", "Golf Access", "Air Miles", "Concierge", "Insurance"];
const CARD_TYPES = ["Rewards", "Travel", "Cashback", "Lifetime Free", "Premium", "Student", "Business"];
const REWARDS_TYPES = ["Cashback", "Air Miles", "Points", "Vouchers", "Fuel"];
const CREDIT_SCORES = [
    { label: "Excellent (750+)", value: "excellent" },
    { label: "Good (700-749)", value: "good" },
    { label: "Fair (650-699)", value: "fair" },
    { label: "New to Credit", value: "new" }
];

const SPENDING_CATEGORIES = [
    { value: "groceries", label: "Groceries", icon: ShoppingCart },
    { value: "travel", label: "Travel", icon: Plane },
    { value: "fuel", label: "Fuel", icon: FuelIcon },
    { value: "dining", label: "Dining", icon: Utensils },
    { value: "entertainment", label: "Movies", icon: Clapperboard },
    { value: "shopping", label: "Shopping", icon: ShoppingBag }
];

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
    const [showAllBanks, setShowAllBanks] = useState(false);
    const displayedIssuers = showAllBanks ? ISSUERS : ISSUERS.slice(0, 6);

    const handleReset = () => {
        setFilters({
            maxFee: 50000,
            minRewardRate: 0,
            networks: [],
            issuers: [],
            features: [],
            spendingCategories: [],
            creditScore: [],
            rewardsType: [],
            cardType: []
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
         <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full max-h-[calc(100vh-120px)] sticky top-28">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary-500" />
                    Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-slate-500 hover:text-primary-600">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-8">
                
                {/* 1. Credit Score (NEW - High Priority) */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        Eligibilty (Score)
                        <Badge variant="outline" className="text-[9px] h-4 px-1 border-primary-200 text-primary-600">New</Badge>
                    </label>
                    <div className="space-y-2">
                        {CREDIT_SCORES.map((score) => (
                            <div className="flex items-center space-x-2" key={score.value}>
                                <Checkbox 
                                    id={`score-${score.value}`} 
                                    checked={filters.creditScore.includes(score.value)}
                                    onCheckedChange={() => toggleArrayItem('creditScore', score.value)}
                                />
                                <Label htmlFor={`score-${score.value}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                                    {score.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                {/* 2. Card Type (NEW) */}
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Card Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CARD_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => toggleArrayItem('cardType', type)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                                    filters.cardType.includes(type)
                                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                {/* 3. Annual Fee Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Max Annual Fee</label>
                         <span className="text-sm font-bold text-slate-900 dark:text-white">₹{filters.maxFee}</span>
                    </div>
                    <Slider
                        defaultValue={[filters.maxFee]}
                        max={50000} // Increased range
                        step={500}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, maxFee: val[0] }))}
                    />
                </div>

                {/* 4. Issuer Bank (Expanded) */}
                <div className="space-y-3">
                     <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Issuer Bank</label>
                     <div className="space-y-2">
                        {displayedIssuers.map((issuer) => (
                             <div className="flex items-center space-x-2" key={issuer}>
                                <Checkbox 
                                    id={`issuer-${issuer}`} 
                                    checked={filters.issuers.includes(issuer)}
                                    onCheckedChange={() => toggleArrayItem('issuers', issuer)}
                                />
                                <Label htmlFor={`issuer-${issuer}`} className="text-sm text-slate-600 dark:text-slate-600 cursor-pointer">
                                    {issuer} Bank
                                </Label>
                            </div>
                        ))}
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs text-primary-600 p-0 hover:bg-transparent hover:text-primary-700"
                            onClick={() => setShowAllBanks(!showAllBanks)}
                        >
                            {showAllBanks ? "Show Less" : `See All Banks (${ISSUERS.length - 6}+)`}
                        </Button>
                    </div>
                </div>

                 <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                 {/* 5. Rewards Type (NEW) */}
                 <div className="space-y-3">
                     <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rewards Type</label>
                     <div className="flex flex-wrap gap-2">
                         {REWARDS_TYPES.map(type => (
                             <button
                                key={type}
                                onClick={() => toggleArrayItem('rewardsType', type)}
                                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                                    filters.rewardsType.includes(type)
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                             >
                                 {type}
                             </button>
                         ))}
                     </div>
                 </div>

                {/* 6. Spending Categories */}
                 <div className="space-y-3">
                     <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Best For Spending</label>
                     <div className="space-y-2">
                         {SPENDING_CATEGORIES.map((category) => (
                             <div className="flex items-center space-x-2" key={category.value}>
                                 <Checkbox 
                                     id={`spending-${category.value}`} 
                                     checked={filters.spendingCategories.includes(category.value)}
                                     onCheckedChange={() => toggleArrayItem('spendingCategories', category.value)}
                                 />
                                 <Label htmlFor={`spending-${category.value}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2">
                                     <category.icon className="w-4 h-4 text-primary-500" />
                                     {category.label}
                                 </Label>
                             </div>
                         ))}
                     </div>
                 </div>
                 
                   {/* 7. Premium Features */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Features</label>
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

            </div>
            
             {/* Footer Mobile apply button typically rendered by parent container, but we keep this clean here */}
         </div>
    );
}
