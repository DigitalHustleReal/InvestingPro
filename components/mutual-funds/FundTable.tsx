
"use client";

import React from 'react';
import Link from 'next/link';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Star, TrendingUp, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompare } from '@/contexts/CompareContext';
import { cn } from '@/lib/utils';

interface FundTableProps {
    funds: any[];
}

export function FundTable({ funds }: FundTableProps) {
    const { addProduct, removeProduct, isSelected } = useCompare();

    return (
        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl animate-in fade-in duration-500">
            <div className="overflow-x-auto no-scrollbar">
                <Table className="min-w-[900px]">
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                            <TableHead className="w-[60px] pl-6 sticky left-0 bg-slate-50 dark:bg-slate-800 z-30">
                               <Checkbox />
                            </TableHead>
                            <TableHead className="w-[300px] sticky left-[60px] bg-slate-50 dark:bg-slate-800 z-30 font-bold uppercase tracking-wider text-[10px]">Fund Name</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-[10px]">Rating</TableHead>
                            <TableHead className="font-bold uppercase tracking-wider text-[10px]">Risk</TableHead>
                            <TableHead className="text-right font-bold uppercase tracking-wider text-[10px]">1Y Return</TableHead>
                            <TableHead className="text-right font-bold uppercase tracking-wider text-[10px]">3Y Return</TableHead>
                            <TableHead className="text-right font-bold uppercase tracking-wider text-[10px]">AUM (Cr)</TableHead>
                            <TableHead className="text-right pr-6 font-bold uppercase tracking-wider text-[10px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {funds.map((fund) => {
                            const selected = isSelected(fund.id);
                            return (
                                <TableRow key={fund.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-50 dark:border-slate-800">
                                    <TableCell className="pl-6 sticky left-0 bg-white dark:bg-slate-900 z-20 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50">
                                        <Checkbox 
                                            checked={selected} 
                                            onCheckedChange={(checked) => {
                                                if (checked) addProduct(fund);
                                                else removeProduct(fund.id);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="sticky left-[60px] bg-white dark:bg-slate-900 z-20 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                        <div className="flex flex-col gap-1">
                                            <Link href={`/mutual-funds/${fund.id}`} className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors line-clamp-1">
                                                {fund.name}
                                            </Link>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] h-4 rounded px-1.5 border-slate-200 text-slate-500 font-bold bg-white dark:bg-slate-950 dark:border-slate-700">
                                                    {fund.category}
                                                </Badge>
                                                <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase">
                                                    <CheckCircle2 className="w-2.5 h-2.5 text-secondary-500" />
                                                    Direct
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("w-3.5 h-3.5", i < (fund.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700')} />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter", 
                                            fund.risk === "Very High" ? "text-red-600 bg-red-50 dark:bg-red-900/20" :
                                            fund.risk === "High" ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20" :
                                            "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                                        )}>
                                            {fund.risk || "Moderate"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={cn("text-sm font-bold", fund.returns_1y >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
                                                {fund.returns_1y}%
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase">1Y</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={cn("text-sm font-bold", fund.returns_3y >= 15 ? 'text-emerald-600' : 'text-slate-900 dark:text-white')}>
                                                {fund.returns_3y}%
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase">3Y</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                                            ₹{fund.aum}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10" asChild>
                                                <Link href={`/mutual-funds/${fund.id}`}>
                                                    <TrendingUp className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button size="sm" className="h-9 px-4 text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/25">
                                                Invest
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
