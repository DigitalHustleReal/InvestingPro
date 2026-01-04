
"use client";

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface FilterState {
    minReturns: number;
    maxExpenseRatio: number;
    minAum: number;
    riskLevels: string[];
    categories: string[];
    amcs: string[];
    rating: number; // Min rating (1-5)
}

interface FilterSidebarProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const CATEGORIES = ["Equity", "Debt", "Hybrid", "ELSS", "Index", "Global"];
const RISKS = ["Low", "Low to Moderate", "Moderate", "Moderately High", "High", "Very High"];
const AMCS = ["SBI", "HDFC", "ICICI", "Axis", "Nippon", "Kotak", "Parag Parikh", "Mirae Asset"];

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {

    const handleReset = () => {
        setFilters({
            minReturns: 0,
            maxExpenseRatio: 2.5,
            minAum: 0,
            riskLevels: [],
            categories: [],
            amcs: [],
            rating: 0
        });
    };

    const toggleArrayItem = (key: keyof FilterState, value: string) => {
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
                    <Search className="w-4 h-4 text-emerald-500" />
                    Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-slate-500 hover:text-emerald-600">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-6">
                
                {/* 1. Category */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fund Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => toggleArrayItem('categories', cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                    filters.categories.includes(cat)
                                        ? 'bg-slate-900 dark:bg-emerald-500 text-white border-slate-900 dark:border-emerald-500 shadow-lg shadow-slate-900/20'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                {/* 2. Returns Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Min 3Y Returns</label>
                         <span className="text-sm font-bold text-emerald-600">{filters.minReturns}%</span>
                    </div>
                    <Slider
                        defaultValue={[filters.minReturns]}
                        max={40}
                        step={1}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, minReturns: val[0] }))}
                        className="py-4"
                    />
                </div>

                 <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                {/* 3. Risk Profile */}
                <Accordion type="single" collapsible defaultValue="risk" className="w-full">
                    <AccordionItem value="risk" className="border-0">
                        <AccordionTrigger className="text-sm font-bold text-slate-800 dark:text-white py-2 hover:no-underline">
                            Risk Profile
                        </AccordionTrigger>
                        <AccordionContent>
                             <div className="space-y-3 pt-2">
                                {RISKS.map((risk) => (
                                    <div className="flex items-center space-x-2" key={risk}>
                                        <Checkbox 
                                            id={`risk-${risk}`} 
                                            checked={filters.riskLevels.includes(risk)}
                                            onCheckedChange={() => toggleArrayItem('riskLevels', risk)}
                                        />
                                        <Label htmlFor={`risk-${risk}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                                            {risk}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                 <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                 {/* 4. Fund House */}
                 <div className="space-y-3">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fund House (AMC)</label>
                     <div className="relative">
                         <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                         <Input className="h-9 pl-8 bg-slate-50 dark:bg-slate-800 border-0" placeholder="Search AMC..." />
                     </div>
                     <div className="max-h-32 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                        {AMCS.map(amc => (
                             <div className="flex items-center space-x-2" key={amc}>
                                <Checkbox 
                                    id={`amc-${amc}`} 
                                    checked={filters.amcs.includes(amc)}
                                    // amc logic here
                                />
                                <Label htmlFor={`amc-${amc}`} className="text-sm text-slate-600 dark:text-slate-400">
                                    {amc} Mutual Fund
                                </Label>
                            </div>
                        ))}
                     </div>
                 </div>
                 
                 <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />
                 
                 {/* 5. Expense Ratio */}
                 <div className="space-y-4">
                     <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Expense Ratio</label>
                         <span className="text-sm font-bold text-rose-600">{filters.maxExpenseRatio}%</span>
                    </div>
                    <Slider
                        defaultValue={[filters.maxExpenseRatio]}
                        max={3}
                        step={0.1}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, maxExpenseRatio: val[0] }))}
                    />
                 </div>

            </div>

             {/* Footer Actions */}
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                 <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/20">
                     Show Funds
                 </Button>
             </div>
        </div>
    );
}
