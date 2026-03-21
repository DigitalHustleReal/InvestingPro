
"use client";

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface InvestingFilterState {
    fundTypes: string[];
    riskLevels: string[];
    minCAGR: number;
    maxExpenseRatio: number;
    fundHouses: string[];
    minInvestment: number;
}

interface InvestingFilterSidebarProps {
    filters: InvestingFilterState;
    setFilters: React.Dispatch<React.SetStateAction<InvestingFilterState>>;
}

const FUND_TYPES = ["Mutual Fund", "Stock", "PPF", "NPS", "Gold", "FD", "Bond"];
const RISKS = ["Low", "Low to Moderate", "Moderate", "Moderately High", "High", "Very High"];
const FUND_HOUSES = ["SBI", "HDFC", "ICICI", "Axis", "Nippon", "Kotak", "Parag Parikh", "Mirae Asset", "DSP", "Franklin Templeton"];

export function InvestingFilterSidebar({ filters, setFilters }: InvestingFilterSidebarProps) {

    const handleReset = () => {
        setFilters({
            fundTypes: [],
            riskLevels: [],
            minCAGR: 0,
            maxExpenseRatio: 2.5,
            fundHouses: [],
            minInvestment: 0
        });
    };

    const toggleArrayItem = (key: keyof InvestingFilterState, value: string) => {
        setFilters(prev => {
            const current = (prev[key] as string[]);
            const newArray = current.includes(value) 
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [key]: newArray };
        });
    };

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full max-h-[calc(100vh-120px)] sticky top-28">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-500" />
                    Fund Finder
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-slate-500 hover:text-primary-600">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-6">
                
                {/* 1. Fund Type */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Investment Type</label>
                    <div className="flex flex-wrap gap-2">
                        {FUND_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => toggleArrayItem('fundTypes', type)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                    filters.fundTypes.includes(type)
                                        ? 'bg-slate-900 dark:bg-primary-500 text-white border-slate-900 dark:border-primary-500 shadow-lg shadow-slate-900/20'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                {/* 2. CAGR Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Min CAGR (3Y)</label>
                         <span className="text-sm font-bold text-primary-600">{filters.minCAGR}%</span>
                    </div>
                    <Slider
                        defaultValue={[filters.minCAGR]}
                        max={40}
                        step={1}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, minCAGR: val[0] }))}
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
                     <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fund House / Provider</label>
                     <div className="relative">
                         <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-600" />
                         <Input className="h-9 pl-8 bg-slate-50 dark:bg-slate-800 border-0" placeholder="Search provider..." />
                     </div>
                     <div className="max-h-32 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                        {FUND_HOUSES.map(house => (
                             <div className="flex items-center space-x-2" key={house}>
                                <Checkbox 
                                    id={`house-${house}`} 
                                    checked={filters.fundHouses.includes(house)}
                                    onCheckedChange={() => toggleArrayItem('fundHouses', house)}
                                />
                                <Label htmlFor={`house-${house}`} className="text-sm text-slate-600 dark:text-slate-400">
                                    {house}
                                </Label>
                            </div>
                        ))}
                     </div>
                 </div>
                 
                 <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />
                 
                 {/* 5. Expense Ratio */}
                 <div className="space-y-4">
                     <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Max Expense Ratio</label>
                         <span className="text-sm font-bold text-danger-600">{filters.maxExpenseRatio}%</span>
                    </div>
                    <Slider
                        defaultValue={[filters.maxExpenseRatio]}
                        max={3}
                        step={0.1}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, maxExpenseRatio: val[0] }))}
                    />
                 </div>

                 <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

                 {/* 6. Min Investment */}
                 <div className="space-y-4">
                     <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Min Investment</label>
                         <span className="text-sm font-bold text-slate-700 dark:text-slate-300">₹{filters.minInvestment.toLocaleString()}</span>
                    </div>
                    <Slider
                        defaultValue={[filters.minInvestment]}
                        max={10000}
                        step={500}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, minInvestment: val[0] }))}
                    />
                    <div className="flex justify-between text-xs text-slate-600">
                        <span>₹0</span>
                        <span>₹10,000</span>
                    </div>
                 </div>

            </div>

             {/* Footer Actions */}
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                 <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-primary-500/20">
                     Apply Filters
                 </Button>
             </div>
        </div>
    );
}
