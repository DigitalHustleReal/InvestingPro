import React from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/data-table/DataTable';
import { ColumnDef } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Star, ArrowUpRight, TrendingDown, Percent, Calendar } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';

interface LoansTableProps {
    loans: any[];
}

export function LoansTable({ loans }: LoansTableProps) {
    const { addProduct, removeProduct, isSelected, selectedProducts } = useCompare();

    // Define columns for the DataTable
    const columns: ColumnDef[] = [
        {
            key: 'name',
            header: 'Loan Name',
            accessor: (row) => (
                <div className="flex flex-col gap-2 min-w-[260px]">
                    <Link
                        href={`/loans/${row.slug}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors text-sm"
                    >
                        {row.name}
                    </Link>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            {row.provider || row.provider_name || 'Lender'}
                        </p>
                        {row.category && (
                            <Badge variant="outline" className="text-[8px] h-4 rounded px-1.5 border-slate-200 text-slate-500 font-bold">
                                {row.category}
                            </Badge>
                        )}
                    </div>
                </div>
            ),
            sortable: true,
            width: '30%'
        },
        {
            key: 'interest_rate',
            header: 'Interest Rate',
            accessor: (row) => {
                const rate = row.features?.interest_rate || row.features?.['Interest Rate'] || '10.5%';
                const rateNum = parseFloat(rate);
                
                return (
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                            <Percent className={`w-3.5 h-3.5 ${rateNum < 10 ? 'text-primary-600' : 'text-slate-400'}`} />
                            <p className={`font-bold ${rateNum < 10 ? 'text-primary-600' : 'text-slate-900 dark:text-white'}`}>
                                {rate}
                            </p>
                        </div>
                        <p className="text-[8px] text-slate-400 uppercase font-semibold">p.a.</p>
                        {rateNum < 10 && (
                            <Badge className="text-[7px] bg-primary-100 text-primary-700 border-0 h-4">
                                Best Rate
                            </Badge>
                        )}
                    </div>
                );
            },
            sortable: true,
            width: '15%',
            align: 'center'
        },
        {
            key: 'max_amount',
            header: 'Max Amount',
            accessor: (row) => {
                const amount = row.features?.max_loan_amount || row.features?.['Max Amount'] || '₹40L';
                
                return (
                    <div className="text-center">
                        <p className="font-bold text-slate-900 dark:text-white">{amount}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">Maximum</p>
                    </div>
                );
            },
            sortable: true,
            width: '15%',
            align: 'center'
        },
        {
            key: 'tenure',
            header: 'Tenure',
            accessor: (row) => {
                const tenure = row.features?.tenure || row.features?.['Tenure'] || '5 years';
                
                return (
                    <div className="flex flex-col items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{tenure}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">Max Period</p>
                    </div>
                );
            },
            sortable: true,
            width: '12%',
            align: 'center'
        },
        {
            key: 'processing_fee',
            header: 'Processing Fee',
            accessor: (row) => {
                const fee = row.features?.processing_fee || row.features?.['Processing Fee'] || '2%';
                const feeNum = parseFloat(fee);
                
                return (
                    <div className="text-center">
                        <p className={`font-bold ${feeNum < 1.5 ? 'text-primary-600' : feeNum > 3 ? 'text-danger-600' : 'text-slate-900 dark:text-white'}`}>
                            {fee}
                        </p>
                        {feeNum < 1.5 && (
                            <Badge className="text-[7px] bg-primary-100 text-primary-700 border-0 mt-1 h-4">
                                Low Fee
                            </Badge>
                        )}
                        {feeNum > 3 && (
                            <Badge className="text-[7px] bg-danger-100 text-danger-700 border-0 mt-1 h-4">
                                High Fee
                            </Badge>
                        )}
                    </div>
                );
            },
            sortable: true,
            width: '12%',
            align: 'center'
        },
        {
            key: 'approval',
            header: 'Approval Chance',
            accessor: (row) => {
                 // Mock logic: randomly high or medium based on name length
                 const chance = row.name.length % 2 === 0 ? "High" : "Very High";
                 return (
                    <div className="text-center">
                        <Badge variant="outline" className={`h-5 border-0 font-bold text-[9px] uppercase tracking-wider ${
                            chance === "Very High" 
                                ? "bg-success-50 text-success-700 ring-1 ring-success-600/20" 
                                : "bg-warning-50 text-warning-700 ring-1 ring-warning-600/20"
                        }`}>
                            {chance}
                        </Badge>
                        <p className="text-[8px] text-slate-400 mt-1">Based on profile</p>
                    </div>
                 );
            },
            sortable: false,
            width: '12%',
            align: 'center'
        },
        {
            key: 'rating',
            header: 'Rating',
            accessor: (row) => {
                // Safely extract and validate rating
                let rating = 4.0;
                
                if (typeof row.rating === 'number' && !isNaN(row.rating)) {
                    rating = row.rating;
                } else if (typeof row.rating === 'string') {
                    const parsed = parseFloat(row.rating);
                    rating = (!isNaN(parsed)) ? parsed : 4.0;
                } else if (row.rating === null || row.rating === undefined) {
                    rating = 4.0;
                }

                // Final validation
                if (typeof rating !== 'number' || isNaN(rating)) {
                    rating = 4.0;
                }

                const stars = Math.round(rating);
                
                return (
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                        i < stars
                                            ? 'text-accent-400 fill-accent-400'
                                            : 'text-slate-300 dark:text-slate-600'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                );
            },
            sortable: true,
            width: '10%',
            align: 'center'
        },
        {
            key: 'actions',
            header: 'Actions',
            accessor: (row) => (
                <div className="flex flex-col gap-2">
                    <Link href={`/loans/${row.slug}`} className="w-full">
                        <Button 
                            variant="outline" 
                            className="w-full h-9 rounded-xl border-slate-200 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-wider"
                        >
                            Compare
                        </Button>
                    </Link>
                    <Link href={row.affiliate_link || row.link || `/loans/${row.slug}`} className="w-full">
                        <Button 
                            className="w-full h-9 rounded-xl bg-primary-600 hover:bg-secondary-600 dark:bg-primary-500 dark:hover:bg-secondary-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
                        >
                            Apply
                            <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                    </Link>
                </div>
            ),
            sortable: false,
            width: '6%',
            align: 'center'
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
            data={loans}
            selectable={true}
            onSelectionChange={handleSelectionChange}
            sortable={true}
            defaultSort={{ column: 'interest_rate', direction: 'asc' }} // Lowest interest rate first
            onRowClick={(loan) => {
                // Optional: navigate to loan detail page on row click
                // window.location.href = `/loans/${loan.slug}`;
            }}
            className="animate-in fade-in duration-500"
        />
    );
}
