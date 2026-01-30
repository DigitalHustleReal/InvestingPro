"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function EligibilityPreChecker() {
    const [income, setIncome] = useState<number>(25000);
    const [score, setScore] = useState<number>(750);
    const [result, setResult] = useState<'high' | 'medium' | 'low' | null>(null);

    const checkEligibility = () => {
        // Simple heuristic logic (Mock)
        if (score >= 750 && income >= 25000) {
            setResult('high');
        } else if (score >= 700 || income >= 50000) {
            setResult('medium');
        } else {
            setResult('low');
        }
    };

    return (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle2 className="text-green-400" />
                    Check Your Approval Chance
                </CardTitle>
                <p className="text-slate-400 text-sm">No impact on credit score • Instant result</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {!result ? (
                    <>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <Label className="text-slate-200">Monthly Income</Label>
                                    <span className="text-green-400 font-bold">{formatCurrency(income)}</span>
                                </div>
                                <Slider 
                                    value={[income]} 
                                    onValueChange={(vals) => setIncome(vals[0])} 
                                    min={10000} 
                                    max={200000} 
                                    step={5000} 
                                    className="py-2"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <Label className="text-slate-200">Credit Score (Approx)</Label>
                                    <span className="text-yellow-400 font-bold">{score}</span>
                                </div>
                                <Slider 
                                    value={[score]} 
                                    onValueChange={(vals) => setScore(vals[0])} 
                                    min={300} 
                                    max={900} 
                                    step={10} 
                                    className="py-2"
                                />
                            </div>
                        </div>

                        <Button 
                            onClick={checkEligibility}
                            className="w-full bg-green-600 hover:bg-green-500 font-bold text-lg h-12"
                        >
                            Check Now
                        </Button>
                    </>
                ) : (
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                        {result === 'high' && (
                            <>
                                <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-green-400 mb-2">High Approval Chance!</h3>
                                <p className="text-slate-300 mb-6">You qualify for premium rewards cards.</p>
                            </>
                        )}
                        {result === 'medium' && (
                            <>
                                <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-10 h-10 text-yellow-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Fair Approval Chance</h3>
                                <p className="text-slate-300 mb-6">You qualify for most entry-level cards.</p>
                            </>
                        )}
                        {result === 'low' && (
                            <>
                                <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="w-10 h-10 text-red-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-red-400 mb-2">Low Approval Chance</h3>
                                <p className="text-slate-300 mb-6">Consider secured cards to build history.</p>
                            </>
                        )}

                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                className="flex-1 bg-transparent border-slate-600 hover:bg-white/10 text-white"
                                onClick={() => setResult(null)}
                            >
                                Check Again
                            </Button>
                            <Link href="/credit-cards/find-your-card" className="flex-1">
                                <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold">
                                    Get Cards <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
