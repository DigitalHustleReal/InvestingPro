'use client';

import { ProductScore } from '@/lib/products/scoring-rules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Zap, TrendingUp, SearchCheck } from 'lucide-react';

interface DifferentiationCardProps {
    score: ProductScore;
    productName: string;
}

export default function DifferentiationCard({ score, productName }: DifferentiationCardProps) {
    if (score.overall === 0) return null;

    const getColor = (val: number) => {
        if (val >= 8) return 'bg-success-500';
        if (val >= 5) return 'bg-accent-500';
        return 'bg-danger-500';
    };

    return (
        <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white overflow-hidden border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <SearchCheck className="w-5 h-5 text-success-600 dark:text-success-400" />
                    Why this card?
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Overall Score with Tags */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                         <div className="flex flex-wrap gap-2 mb-2">
                            {score.tags.map(tag => (
                                <span key={tag} className="text-xs font-bold bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-white px-2 py-1 rounded-full border border-slate-200 dark:border-white/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-600 max-w-[200px]">
                            Calculated based on rewards, fees, and benefits analysis.
                        </p>
                    </div>
                    
                    <div className="text-center bg-white/50 dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-success-600 to-secondary-600 dark:from-success-400 dark:to-secondary-400">
                            {score.overall}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider font-semibold">
                            Pro Score
                        </div>
                    </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-4">
                    {score.breakdown.map((item) => (
                        <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                                <span className="font-bold text-slate-900 dark:text-white">{item.score}/10</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${getColor(item.score)}`} 
                                    style={{ width: `${item.score * 10}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Bottom Insight */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-start gap-3">
                    <Trophy className="w-8 h-8 text-accent-500 dark:text-accent-400 flex-shrink-0" />
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        This card ranks in the <span className="text-accent-600 dark:text-accent-400 font-bold">Top 10%</span> for {score.breakdown.reduce((a, b) => a.score > b.score ? a : b).label.toLowerCase()}.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
