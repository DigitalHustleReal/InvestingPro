"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InlineEligibilityWidget() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        income: '',
        employment: 'salaried',
        score: '750+'
    });

    const handleCheck = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    return (
        <Card className="w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] border-0 relative overflow-hidden">
            {/* Visual Header */}
            <div className="bg-primary-600 h-2 bg-gradient-to-r from-primary-500 to-secondary-500" />
            
            <CardContent className="p-6">
                {step === 1 ? (
                    <div className="space-y-4">
                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Check Eligibility Instantly</h3>
                            <p className="text-xs text-slate-500">Get pre-approved offers in 30 seconds</p>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs font-semibold text-slate-600">Monthly Income</Label>
                                <Input 
                                    placeholder="e.g. 50000" 
                                    className="h-10 rounded-xl" 
                                    value={formData.income}
                                    onChange={(e) => setFormData({...formData, income: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-semibold text-slate-600">Employment Type</Label>
                                <Select defaultValue="salaried">
                                    <SelectTrigger className="h-10 rounded-xl">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="salaried">Salaried</SelectItem>
                                        <SelectItem value="self_employed">Self Employed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-semibold text-slate-600">Credit Score (Approx)</Label>
                                <Select defaultValue="750+">
                                    <SelectTrigger className="h-10 rounded-xl">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="750+">Excellent (750+)</SelectItem>
                                        <SelectItem value="700-749">Good (700-749)</SelectItem>
                                        <SelectItem value="650-699">Fair (650-699)</SelectItem>
                                        <SelectItem value="new">New to Credit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-11 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold mt-2"
                            onClick={handleCheck}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Check Now"}
                            {!loading && <ChevronRight className="w-4 h-4 ml-1" />}
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Make You Eligible!</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Based on your profile, you qualify for loans up to <span className="font-bold text-slate-900 dark:text-white">₹15 Lakhs</span>.
                        </p>
                        
                        <div className="bg-slate-50 rounded-xl p-3 mb-6 text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Pre-approved Offers</p>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[8px] font-bold">H</div>
                                <span className="text-sm font-bold">HDFC Bank</span>
                                <span className="ml-auto text-xs font-bold text-success-600">10.25%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center text-white text-[8px] font-bold">S</div>
                                <span className="text-sm font-bold">SBI Loan</span>
                                <span className="ml-auto text-xs font-bold text-success-600">10.50%</span>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold"
                            onClick={() => window.location.hash = '#results'} // Scroll to list
                        >
                            View All 12 Offers
                        </Button>
                        <button 
                            className="text-xs text-slate-400 mt-3 hover:text-primary-600 hover:underline"
                            onClick={() => setStep(1)}
                        >
                            Check for someone else
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
