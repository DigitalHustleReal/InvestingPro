"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Info, TrendingUp } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScoreBreakdown {
    factor: string;
    rawValue: number | string | boolean;
    normalizedScore: number;
    weight: number;
    weightedScore: number;
    explanation: string;
}

interface RankingExplanationProps {
    totalScore: number;
    rank: number;
    breakdown: ScoreBreakdown[];
    strengths?: string[];
    weaknesses?: string[];
    explanation?: string;
    methodology?: string;
    calculatedAt?: string;
    dataSnapshotDate?: string;
}

/**
 * RankingExplanation Component
 * 
 * Displays transparent, explainable ranking breakdown for a product.
 * This is a CORE feature - rankings must be explainable and reproducible.
 */
export default function RankingExplanation({
    totalScore,
    rank,
    breakdown = [],
    strengths = [],
    weaknesses = [],
    explanation,
    methodology,
    calculatedAt,
    dataSnapshotDate,
}: RankingExplanationProps) {
    // Handle empty breakdown
    if (!breakdown || breakdown.length === 0) {
        return null;
    }

    // Sort breakdown by weighted score (descending)
    const sortedBreakdown = [...breakdown].sort(
        (a, b) => b.weightedScore - a.weightedScore
    );

    // Calculate total possible score (should be 100 if weights sum to 1)
    const totalPossibleScore = breakdown.reduce(
        (sum, item) => sum + item.weight * 100,
        0
    );

    return (
        <Card className="border-2 border-teal-100">
            <CardHeader className="bg-teal-50">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl mb-2">Ranking Score</CardTitle>
                        <p className="text-sm text-slate-600">
                            Transparent, data-driven ranking based on verified information
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-teal-600">
                            {totalScore.toFixed(1)}
                            <span className="text-lg text-slate-500">/100</span>
                        </div>
                        <Badge className="mt-2 bg-teal-100 text-teal-700">
                            Rank #{rank}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Overall Explanation */}
                {explanation && (
                    <div className="mb-6 p-6 md:p-8 bg-slate-50 rounded-lg">
                        <div className="flex items-start gap-2">
                            <Info className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700">{explanation}</p>
                        </div>
                    </div>
                )}

                {/* Score Breakdown */}
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-teal-600" />
                        Score Breakdown
                    </h3>
                    <div className="space-y-4">
                        {sortedBreakdown.map((item, index) => {
                            const percentage = (item.weightedScore / totalScore) * 100;
                            const factorName = item.factor.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-900">
                                                {factorName}
                                            </span>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="w-4 h-4 text-slate-400 cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs">
                                                        <p className="text-xs">
                                                            <strong>Weight:</strong> {(item.weight * 100).toFixed(0)}%<br />
                                                            <strong>Raw Value:</strong> {String(item.rawValue)}<br />
                                                            <strong>Normalized Score:</strong> {item.normalizedScore.toFixed(1)}/100<br />
                                                            <strong>Explanation:</strong> {item.explanation}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-slate-900">
                                                {item.weightedScore.toFixed(1)} pts
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {item.normalizedScore.toFixed(1)} × {(item.weight * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${(item.weightedScore / totalScore) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-500 pl-1">
                                        {item.explanation}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {strengths.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                Strengths
                            </h4>
                            <ul className="space-y-2">
                                {strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {weaknesses.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-rose-600" />
                                Areas for Improvement
                            </h4>
                            <ul className="space-y-2">
                                {weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                        <XCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                                        <span>{weakness}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Methodology Link */}
                {methodology && (
                    <div className="pt-4 border-t border-slate-200">
                        <p className="text-xs text-slate-600 mb-2">
                            <strong>Note:</strong> Rankings are calculated using a transparent, weighted methodology.
                            Rankings are not influenced by monetization or affiliate relationships.
                        </p>
                        <a
                            href="/methodology"
                            className="text-sm text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
                        >
                            View Full Methodology →
                        </a>
                    </div>
                )}

                {/* Metadata */}
                {(calculatedAt || dataSnapshotDate) && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="text-xs text-slate-500 space-y-1">
                            {calculatedAt && (
                                <div>
                                    <strong>Calculated:</strong> {new Date(calculatedAt).toLocaleString('en-IN')}
                                </div>
                            )}
                            {dataSnapshotDate && (
                                <div>
                                    <strong>Data Snapshot:</strong> {new Date(dataSnapshotDate).toLocaleDateString('en-IN')}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

