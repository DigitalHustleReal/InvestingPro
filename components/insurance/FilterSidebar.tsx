
"use client";

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Filter, ShieldCheck } from "lucide-react";

export interface InsuranceFilterState {
    maxPremium: number;
    minCover: number;
    insurers: string[];
    policyTypes: string[];
}

interface FilterSidebarProps {
    filters: InsuranceFilterState;
    setFilters: React.Dispatch<React.SetStateAction<InsuranceFilterState>>;
}

const INSURERS = ["HDFC Life", "LIC", "ICICI Prudential", "SBI Life", "Max Life", "Tata AIA"];
const POLICY_TYPES = ["Term Life", "Health", "Endowment", "ULIP"];

export function InsuranceFilterSidebar({ filters, setFilters }: FilterSidebarProps) {
    
    const handleReset = () => {
        setFilters({
            maxPremium: 50000,
            minCover: 5000000,
            insurers: [],
            policyTypes: []
        });
    };

    const toggleArrayItem = (key: keyof InsuranceFilterState, value: string) => {
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
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-danger-500" />
                    Policy Finder
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-slate-500 hover:text-danger-600">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
            </div>

            <div className="p-5 space-y-8">
                
                {/* 1. Max Premium */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Max Yearly Premium</label>
                         <span className="text-sm font-bold text-slate-900 dark:text-white">₹{filters.maxPremium}</span>
                    </div>
                    <Slider
                        defaultValue={[filters.maxPremium]}
                        max={100000}
                        step={1000}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, maxPremium: val[0] }))}
                        className="bg-danger-100 dark:bg-danger-900/20"
                    />
                </div>

                {/* 2. Min Cover */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Min Cover Amount</label>
                         <span className="text-sm font-bold text-slate-900 dark:text-white">₹{(filters.minCover/100000).toFixed(0)}L</span>
                    </div>
                    <Slider
                        defaultValue={[filters.minCover]}
                        min={500000}
                        max={50000000}
                        step={500000}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, minCover: val[0] }))}
                    />
                </div>

                {/* 3. Policy Type */}
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Policy Type</label>
                    <div className="flex flex-wrap gap-2">
                        {POLICY_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => toggleArrayItem('policyTypes', type)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                                    filters.policyTypes.includes(type)
                                        ? 'bg-danger-600 text-white border-danger-600 shadow-lg shadow-danger-500/20'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Insurers */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Preferred Insurer</label>
                    <div className="grid grid-cols-1 gap-2">
                         {INSURERS.map((ins) => (
                            <div className="flex items-center space-x-2" key={ins}>
                                <Checkbox 
                                    id={`ins-${ins}`} 
                                    checked={filters.insurers.includes(ins)}
                                    onCheckedChange={() => toggleArrayItem('insurers', ins)}
                                />
                                <Label htmlFor={`ins-${ins}`} className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                                    {ins}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
         </div>
    );
}
