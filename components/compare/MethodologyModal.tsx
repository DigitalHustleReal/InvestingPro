"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Scale, FileSearch, HelpCircle } from "lucide-react";

export function MethodologyModal() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-500 text-xs flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-300">
                    <HelpCircle className="w-3 h-3" />
                    How we compare
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Scale className="w-6 h-6 text-primary-600" />
                        Comparison Methodology
                    </DialogTitle>
                    <DialogDescription className="text-base text-slate-500">
                        Our goal is to provide unbiased, data-driven recommendations. Here is how our scoring engine works.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">1. Trust Score (40%)</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                We prioritize safety above all. We analyze regulatory standing, data privacy policies, and historical complaints. A score above 90 indicates "Bank-Grade Security".
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center flex-shrink-0">
                            <FileSearch className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">2. Feature Coverage (30%)</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                We count the number of premium features (e.g., Lounge Access, Zero Forex Markup) relative to the category standard. More useful features = Higher score.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                            <Scale className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">3. Value Analysis (30%)</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                We weigh the Annual Fee against the Reward Rate. A card that offers high rewards for a low fee scores highest in this metric.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <strong>Disclaimer:</strong> InvestingPro is an independent platform. While we may earn a commission from partner links, our ratings are never influence by commercial relationships.
                </div>
            </DialogContent>
        </Dialog>
    );
}
