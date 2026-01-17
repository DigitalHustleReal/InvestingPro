"use client";

import React from 'react';
import Link from 'next/link';
import { DataTable, ColumnDef } from '@/components/data-table';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Star, TrendingUp, CheckCircle2 } from "lucide-react";
import { useCompare } from '@/contexts/CompareContext';
import { cn } from '@/lib/utils';

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
                        <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase">
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
            mobileHidden: true
        },
        {
            key: 'risk',
            header: 'Risk',
            accessor: (row) => (
                <span 
                    className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter", 
                        row.risk === "Very High" ? "text-danger-600 bg-danger-50 dark:bg-danger-900/20" :
                        row.risk === "High" ? "text-accent-600 bg-accent-50 dark:bg-accent-900/20" :
                        "text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                    )}
                >
                    {row.risk || "Moderate"}
                </span>
            ),
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
                    <span className="text-[9px] text-slate-400 font-bold uppercase">1Y</span>
                </div>
            ),
            sortable: true,
            align: 'right',
            width: '10%',
            mobileHidden: true
        },
        {
            key: 'returns_3y',
            header: '3Y Return',
            accessor: (row) => (
                <div className="flex flex-col items-end">
                    <span className={cn("text-sm font-bold", row.returns_3y >= 15 ? 'text-primary-600' : 'text-slate-900 dark:text-white')}>
                        {row.returns_3y}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">3Y</span>
                </div>
            ),
            sortable: true,
            align: 'right',
            width: '10%'
        },
        {
            key: 'aum',
            header: 'AUM (Cr)',
            accessor: (row) => (
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                    ₹{row.aum}
                </span>
            ),
            sortable: true,
            align: 'right',
            width: '11%',
            mobileHidden: true
        },
        {
            key: 'actions',
            header: 'Action',
            accessor: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10" 
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
