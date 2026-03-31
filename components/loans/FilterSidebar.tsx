
"use client";

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Filter } from "lucide-react";

export interface LoanFilterState {
    maxRate: number;
    maxProcessingFee: number;
    loanTypes: string[];
    banks: string[];
}

interface FilterSidebarProps {
    filters: LoanFilterState;
    setFilters: React.Dispatch<React.SetStateAction<LoanFilterState>>;
}

const LOAN_TYPES = ["Home Loan", "Personal Loan", "Car Loan", "Education Loan"];
const BANKS = ["HDFC", "SBI", "ICICI", "Axis", "Kotak", "Bajaj Finserv"];

export function LoanFilterSidebar({ filters, setFilters }: FilterSidebarProps) {
    
    const handleReset = () => {
        setFilters({
            maxRate: 15,
            maxProcessingFee: 2,
            loanTypes: [],
            banks: []
        });
    };

    const toggleArrayItem = (key: keyof LoanFilterState, value: string) => {
        setFilters(prev => {
            const current = (prev[key] as string[]);
            const newArray = current.includes(value) 
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [key]: newArray };
        });
    };

    return (
         <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4 text-green-600" />
                    Loan Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-gray-500 hover:text-green-600">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
            </div>

            <div className="p-5 space-y-6">
                
                {/* 1. Interest Rate Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Interest Rate</label>
                         <span className="text-sm font-bold text-gray-900">{filters.maxRate}%</span>
                    </div>
                    <Slider
                        defaultValue={[filters.maxRate]}
                        max={30}
                        step={0.5}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, maxRate: val[0] }))}
                    />
                </div>

                {/* 2. Loan Type */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loan Type</label>
                    <div className="flex flex-wrap gap-2">
                        {LOAN_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => toggleArrayItem('loanTypes', type)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                                    filters.loanTypes.includes(type)
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Banks */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Bank</label>
                    <div className="grid grid-cols-2 gap-2">
                         {BANKS.map((bank) => (
                            <div className="flex items-center space-x-2" key={bank}>
                                <Checkbox 
                                    id={`bank-${bank}`} 
                                    checked={filters.banks.includes(bank)}
                                    onCheckedChange={() => toggleArrayItem('banks', bank)}
                                />
                                <Label htmlFor={`bank-${bank}`} className="text-sm font-medium text-gray-600 cursor-pointer">
                                    {bank}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
         </div>
    );
}
