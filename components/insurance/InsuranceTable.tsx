import React from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/data-table/DataTable';
import { ColumnDef } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Star, ArrowUpRight, Shield, Heart, Car } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';

interface InsuranceTableProps {
    plans: any[];
}

export function InsuranceTable({ plans }: InsuranceTableProps) {
    const { addProduct, removeProduct, isSelected, selectedProducts } = useCompare();

    // Define columns for the DataTable
    const columns: ColumnDef[] = [
        {
            key: 'name',
            header: 'Plan Name',
            accessor: (row) => (
                <div className="flex flex-col gap-2 min-w-[280px]">
                    <div className="flex items-center gap-3">
                        {/* Type Icon */}
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 dark:text-primary-400">
                             {row.category?.toLowerCase() === 'health' ? <Heart className="w-5 h-5" /> : 
                              row.category?.toLowerCase() === 'motor' ? <Car className="w-5 h-5" /> : 
                              <Shield className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <Link
                                href={`/insurance/${row.slug}`}
                                className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors text-sm"
                            >
                                {row.name}
                            </Link>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                    {row.provider || row.provider_name || 'Insurer'}
                                </p>
                                {row.metadata?.type && (
                                    <Badge variant="outline" className="text-[8px] h-4 rounded px-1.5 border-slate-200 text-slate-500 font-bold">
                                        {row.metadata.type}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ),
            sortable: true,
            width: '30%'
        },
        {
            key: 'premium',
            header: 'Premium',
            accessor: (row) => {
                const premium = row.features?.premium || row.features?.['Premium'] || '₹500/mo';
                
                return (
                    <div className="text-center">
                        <p className="font-bold text-slate-900 dark:text-white">
                            {premium}
                        </p>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">Starts from</p>
                    </div>
                );
            },
            sortable: true,
            width: '12%',
            align: 'center'
        },
        {
            key: 'coverage',
            header: 'Coverage',
            accessor: (row) => {
                const coverage = row.features?.coverage || row.features?.['Coverage'] || '₹1Cr';
                
                return (
                    <div className="text-center">
                        <p className="font-bold text-primary-600">
                            {coverage}
                        </p>
                        <p className="text-[9px] text-slate-400 uppercase font-semibold">Sum Assured</p>
                    </div>
                );
            },
            sortable: true,
            width: '15%',
            align: 'center'
        },
        {
            key: 'claim_settlement',
            header: 'Claim Settlement',
            accessor: (row) => {
                const csr = row.features?.claim_settlement_ratio || row.features?.['CSR'] || '98.5%';
                const csrNum = parseFloat(csr);
                
                return (
                    <div className="text-center">
                        <p className={`font-bold ${csrNum > 98 ? 'text-success-600' : 'text-slate-900 dark:text-white'}`}>
                            {csr}
                        </p>
                        {csrNum > 98 && (
                            <Badge className="text-[7px] bg-success-100 text-success-700 border-0 mt-1 h-4">
                                Excellent
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
            key: 'policy_term',
            header: 'Policy Term',
            accessor: (row) => {
                const term = row.features?.policy_term || row.features?.['Policy Term'] || '1 Year';
                
                return (
                    <div className="text-center">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{term}</p>
                    </div>
                );
            },
            sortable: true,
            width: '10%',
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
                    <Link href={`/insurance/${row.slug}`} className="w-full">
                        <Button 
                            variant="outline" 
                            className="w-full h-9 rounded-xl border-slate-200 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-wider"
                        >
                            Compare
                        </Button>
                    </Link>
                    <Link href={row.affiliate_link || row.link || `/insurance/${row.slug}`} className="w-full">
                        <Button 
                            className="w-full h-9 rounded-xl bg-primary-600 hover:bg-secondary-600 dark:bg-primary-500 dark:hover:bg-secondary-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
                        >
                            Get Quote
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
            data={plans}
            selectable={true}
            onSelectionChange={handleSelectionChange}
            sortable={true}
            defaultSort={{ column: 'claim_settlement', direction: 'desc' }} // Best CSR first
            onRowClick={(plan) => {
                // Optional: navigate to plan detail page on row click
                // window.location.href = `/insurance/${plan.slug}`;
            }}
            className="animate-in fade-in duration-500"
        />
    );
}
