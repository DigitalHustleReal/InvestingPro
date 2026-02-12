import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, Star } from 'lucide-react';

interface ReviewVerdictProps {
    score: number; // 0 to 10
    verdictTitle: string;
    verdictSummary: string;
    pros: string[];
    cons: string[];
    recommendedAction?: string;
}

export default function ReviewVerdict({
    score,
    verdictTitle,
    verdictSummary,
    pros,
    cons,
    recommendedAction = "Apply Now"
}: ReviewVerdictProps) {
    
    // Determine color theme based on score
    const theme = score >= 8 
        ? { color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200', fill: 'bg-primary-500' }
        : score >= 5 
            ? { color: 'text-accent-700', bg: 'bg-accent-50', border: 'border-accent-200', fill: 'bg-accent-500' }
            : { color: 'text-danger-700', bg: 'bg-danger-50', border: 'border-danger-200', fill: 'bg-danger-500' };

    return (
        <div className="my-8 rounded-xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden border-slate-200 dark:border-slate-800">
            {/* Header / Score Strip */}
            <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="uppercase tracking-widest text-xs font-bold text-slate-600 mb-2">Our Verdict</div>
                    <h3 className="text-2xl font-bold leading-tight">{verdictTitle}</h3>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-bold">{score}/10</div>
                        <div className="text-xs text-slate-600">InvestingPro Rating</div>
                    </div>
                    {/* Radial Progress Placeholder (Simple CSS) */}
                    <div className={cn("w-20 h-20 rounded-full flex items-center justify-center border-4 text-3xl font-bold bg-slate-800", theme.border)}>
                        <span className={theme.color.replace('700', '400')}>{score}</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8">
                <p className="text-slate-600 leading-relaxed text-lg mb-8">
                    {verdictSummary}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Pros */}
                    <div>
                        <h4 className="flex items-center gap-2 font-bold text-primary-700 mb-4 uppercase text-sm tracking-wide">
                            <span className="p-1 rounded-full bg-primary-100"><Check className="w-3 h-3" /></span>
                            Pros
                        </h4>
                        <ul className="space-y-3">
                            {pros.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cons */}
                    <div>
                        <h4 className="flex items-center gap-2 font-bold text-danger-700 mb-4 uppercase text-sm tracking-wide">
                            <span className="p-1 rounded-full bg-danger-100"><X className="w-3 h-3" /></span>
                            Cons
                        </h4>
                        <ul className="space-y-3">
                            {cons.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <X className="w-4 h-4 text-danger-500 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
                {/* Could be a CTA button here */}
                 <span className="text-xs text-slate-500 italic">Last updated: {new Date().toLocaleDateString()} by Editorial Team</span>
            </div>
        </div>
    );
}
