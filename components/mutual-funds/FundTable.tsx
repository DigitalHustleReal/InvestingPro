"use client";

import React from 'react';
import Link from 'next/link';
import { DataTable, ColumnDef } from '@/components/data-table';
import { Badge } from "@/components/ui/badge";
import { GaugeMeter } from "@/components/ui/GaugeMeter";
import { Button } from "@/components/ui/Button";
import { Star, TrendingUp, CheckCircle2 } from "lucide-react";
import { useCompare } from '@/contexts/CompareContext';
import { cn, formatCompactNumber } from '@/lib/utils';
import { TrendSparkline } from '@/components/common/TrendSparkline';

interface FundTableProps {
    funds: any[];
}

export function FundTable({ funds }: FundTableProps) {
    const { addProduct, removeProduct, isSelected, selectedProducts } = useCompare();

    // Define columns for the DataTable
    const columns: ColumnDef[] = [
        {
            key: 'name',
            header: 'Fund Name',
            accessor: (row) => (
                <div className="flex flex-col gap-1 min-w-[250px]">
                    <Link 
                        href={`/mutual-funds/${row.id}`} 
                        className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
                    >
                        {row.name}
                    </Link>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] h-4 rounded px-1.5 border-slate-200 text-slate-500 font-bold">
                            {row.category}
                        </Badge>
                        <span className="text-[9px] text-slate-600 font-bold flex items-center gap-1 uppercase">
                            <CheckCircle2 className="w-2.5 h-2.5 text-secondary-500" />
                            Direct
                        </span>
                    </div>
                </div>
            ),
            sortable: true,
            width: '35%'
        },
        {
            key: 'rating',
            header: 'Rating',
            accessor: (row) => (
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            className={cn(
                                "w-3.5 h-3.5", 
                                i < (row.rating || 4) ? 'text-accent-400 fill-accent-400' : 'text-slate-200 dark:text-slate-700'
                            )} 
                        />
                    ))}
                </div>
            ),
            sortable: true,
            align: 'center',
            width: '12%',
            // mobileHidden: true - showing on mobile now
        },
        {
            key: 'risk',
            header: 'Risk',

            accessor: (row) => {
                const riskMap: Record<string, number> = {
                    "Very High": 90,
                    "High": 75,
                    "Moderate": 50,
                    "Low to Moderate": 35,
                    "Low": 20,
                    "Very Low": 10
                };
                const riskValue = riskMap[row.risk] || 50;

                return (
                    <div className="flex flex-col items-center">
                        <GaugeMeter 
                            value={riskValue} 
                            size={55} 
                            showValue={false} 
                            colors={{ low: '#10b981', medium: '#f59e0b', high: '#ef4444' }} // Green low risk, Red high risk
                        />
                        <span className="text-[9px] font-bold text-slate-500 uppercase -mt-2">{row.risk}</span>
                    </div>
                );
            },
            sortable: false,
            align: 'center',
            width: '12%'
        },
        {
            key: 'returns_1y',
            header: '1Y Return',
            accessor: (row) => (
                <div className="flex flex-col items-end">
                    <span className={cn("text-sm font-bold", row.returns_1y >= 0 ? 'text-primary-600' : 'text-danger-600')}>
                        {row.returns_1y}%
                    </span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">1Y</span>
                </div>
            ),
            sortable: true,
            align: 'right',
            width: '10%',
            // mobileHidden: true - showing on mobile now
        },

    // ... inside columns definition
        {
            key: 'returns_3y',
            header: '3Y Return',
            accessor: (row) => (
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        <TrendSparkline 
                            width={60} 
                            height={20} 
                            data={[10, 12, row.returns_3y - 5, row.returns_3y - 2, row.returns_3y]} 
                            trend={row.returns_3y >= 15 ? 'up' : 'neutral'}
                        />
                         <span className={cn("text-sm font-bold", row.returns_3y >= 15 ? 'text-primary-600' : 'text-slate-900 dark:text-white')}>
                            {row.returns_3y}%
                        </span>
                    </div>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">3Y CAGR</span>
                </div>
            ),
            sortable: true,
            align: 'right',
            width: '18%' // Increased width for sparkline
        },
        {
            key: 'holdings',
            header: 'Top Holdings',
            accessor: (row) => (
                 <div className="flex flex-col gap-1">
                    <div className="flex -space-x-1.5 overflow-hidden py-1">
                        {/* Mock Logos/Initials for Holdings */}
                        {['HDFC', 'REL', 'INFY', 'ICICI'].map((h, i) => (
                            <div key={i} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 border border-white text-[8px] font-bold text-slate-600" title={h}>
                                {h[0]}
                            </div>
                        ))}
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-50 border border-white text-[8px] text-slate-600 font-medium">
                            +6
                        </div>
                    </div>
                    <p className="text-[9px] text-slate-600 leading-tight truncate w-24">
                        Financials, Tech, Energy
                    </p>
                </div>
            ),
            sortable: false,
            width: '15%'
        },
        {
            key: 'aum',
            header: 'AUM (Cr)',
            accessor: (row) => (
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                    ₹{formatCompactNumber(row.aum)}
                </span>
            ),
            sortable: true,
            align: 'right',
            width: '11%',
            // mobileHidden: true - showing on mobile now
        },
        {
            key: 'actions',
            header: 'Action',
            accessor: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-slate-600 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10" 
                        asChild
                    >
                        <Link href={`/mutual-funds/${row.id}`}>
                            <TrendingUp className="w-4 h-4" />
                        </Link>
                    </Button>
                    <Button 
                        size="sm" 
                        className="h-9 px-4 text-[10px] font-black bg-primary-600 hover:bg-primary-700 text-white rounded-xl uppercase tracking-widest transition-all shadow-lg hover:shadow-primary-500/25"
                    >
                        Invest
                    </Button>
                </div>
            ),
            sortable: false,
            align: 'right',
            width: '10%'
        }
    ];

    // Handle selection changes
    const handleSelectionChange = (selectedRows: any[]) => {
        // Clear all first
        selectedProducts.forEach(product => removeProduct(product.id));
        
        // Add new selections
        selectedRows.forEach(row => {
            if (!isSelected(row.id)) {
                addProduct(row);
            }
        });
    };

    return (
        <DataTable
            columns={columns}
            data={funds}
            selectable={true}
            onSelectionChange={handleSelectionChange}
            sortable={true}
            defaultSort={{ column: 'returns_3y', direction: 'desc' }}
            onRowClick={(fund) => {
                // Optional: navigate to fund detail page on row click
                // window.location.href = `/mutual-funds/${fund.id}`;
            }}
            className="animate-in fade-in duration-500"
        />
    );
}
