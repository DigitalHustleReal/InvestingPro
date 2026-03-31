
"use client";

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Filter } from "lucide-react";

export interface InsuranceFilterState {
    maxPremium: number;
    minCover: number;
    insurers: string[];
    policyTypes: string[];
}

const POLICY_TYPES = ["Term Life", "Health", "Life", "Car", "Travel", "Bike", "ULIP"];
const INSURERS = ["LIC", "HDFC Life", "ICICI Prudential", "SBI Life", "Max Life", "Star Health", "ICICI Lombard", "Bajaj Allianz", "HDFC ERGO", "Tata AIG"];

interface FilterSidebarProps {
    filters: InsuranceFilterState;
    setFilters: React.Dispatch<React.SetStateAction<InsuranceFilterState>>;
}

export function InsuranceFilterSidebar({ filters, setFilters }: FilterSidebarProps) {
    const handleReset = () => {
        setFilters({ maxPremium: 50000, minCover: 5000000, insurers: [], policyTypes: [] });
    };

    const toggleArrayItem = (key: 'insurers' | 'policyTypes', value: string) => {
        setFilters(prev => {
            const current = prev[key] as string[];
            const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
            return { ...prev, [key]: updated };
        });
    };

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4 text-green-600" />
                    Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-gray-500 hover:text-green-600 cursor-pointer">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
            </div>

            <div className="p-5 space-y-6">
                {/* Max Premium */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Yearly Premium</label>
                        <span className="text-sm font-bold text-gray-900 tabular-nums">₹{filters.maxPremium.toLocaleString('en-IN')}</span>
                    </div>
                    <Slider defaultValue={[filters.maxPremium]} max={100000} step={1000} onValueChange={(val) => setFilters(prev => ({ ...prev, maxPremium: val[0] }))} />
                </div>

                {/* Min Cover */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Cover Amount</label>
                        <span className="text-sm font-bold text-gray-900 tabular-nums">₹{(filters.minCover / 100000).toFixed(0)}L</span>
                    </div>
                    <Slider defaultValue={[filters.minCover]} min={500000} max={50000000} step={500000} onValueChange={(val) => setFilters(prev => ({ ...prev, minCover: val[0] }))} />
                </div>

                {/* Policy Type */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Policy Type</label>
                    <div className="flex flex-wrap gap-2">
                        {POLICY_TYPES.map(type => (
                            <button key={type} onClick={() => toggleArrayItem('policyTypes', type)}
                                className={`text-xs px-3 py-2 rounded-lg border transition-all font-semibold cursor-pointer ${
                                    filters.policyTypes.includes(type)
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Insurers */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferred Insurer</label>
                    <div className="grid grid-cols-1 gap-2">
                        {INSURERS.map((ins) => (
                            <div className="flex items-center space-x-2" key={ins}>
                                <Checkbox id={`ins-${ins}`} checked={filters.insurers.includes(ins)} onCheckedChange={() => toggleArrayItem('insurers', ins)} />
                                <Label htmlFor={`ins-${ins}`} className="text-sm font-medium text-gray-600 cursor-pointer">{ins}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
