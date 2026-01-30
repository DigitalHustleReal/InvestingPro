import React from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/data-table/DataTable';
import { ColumnDef } from '@/components/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Star, ArrowUpRight, CreditCard as CardIcon } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { formatCompactNumber } from '@/lib/utils';

interface CreditCardTableProps {
    cards: any[];
}

export function CreditCardTable({ cards }: CreditCardTableProps) {
    const { addProduct, removeProduct, isSelected, selectedProducts } = useCompare();

    // Define columns for the DataTable
    const columns: ColumnDef[] = [
        {
            key: 'name',
            header: 'Card Name',
            accessor: (row) => (
                <div className="flex flex-col gap-2 min-w-[280px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md">
                            <CardIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <Link
                                href={`/credit-cards/${row.slug}`}
                                className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors text-sm"
                            >
                                {row.name}
                            </Link>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                {row.provider || row.provider_name || 'Bank'}
                            </p>
                        </div>
                    </div>
                    {row.metadata?.network && (
                        <Badge variant="outline" className="text-[9px] h-5 rounded px-2 border-slate-200 text-slate-600 font-bold w-fit">
                            {row.metadata.network}
                        </Badge>
                    )}
                </div>
            ),
            sortable: true,
            width: '35%'
        },
        {
            key:' annual_fee',
            header: 'Annual Fee',
            accessor: (row) => {
                const fee = row.features?.annual_fee || row.features?.['Annual Fee'] || 0;
                const feeNum = typeof fee === 'string' ? parseInt(fee.replace(/[^0-9]/g, '')) : fee;
                
                return (
                    <div className="text-center">
                        <p className={`font-bold ${feeNum === 0 ? 'text-primary-600' : 'text-slate-900 dark:text-white'}`}>
                            {feeNum === 0 ? '₹0' : `₹${formatCompactNumber(feeNum)}`}
                        </p>
                        {feeNum === 0 && (
                            <Badge className="text-[8px] bg-primary-100 text-primary-700 border-0 mt-1">
                                Lifetime Free
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
            key: 'reward_rate',
            header: 'Reward Rate',
            accessor: (row) => {
                const rate = row.features?.reward_rate || row.features?.['Reward Rate'] || '1%';
                return (
                    <div className="text-center">
                        <p className="font-bold text-primary-600">{rate}</p>
                    </div>
                );
            },
            sortable: true,
            width: '12%',
            align: 'center'
        },
        {
            key: 'forex_markup',
            header: 'Forex Markup',
            accessor: (row) => {
                const markup = row.features?.forex_markup || row.features?.['Forex Markup'] || '3.5%';
                const markupNum = parseFloat(markup);
                
                return (
                    <div className="text-center">
                        <p className={`font-bold ${markupNum < 2 ? 'text-primary-600' : 'text-slate-900 dark:text-white'}`}>
                            {markup}
                        </p>
                        {markupNum < 2 && (
                            <p className="text-[8px] text-primary-500 font-semibold">Low Fee</p>
                        )}
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
                // Handle both simple number rating and object rating from RichProduct
                let ratingVal = 4.0;
                
                if (typeof row.rating === 'number' && !isNaN(row.rating)) {
                    ratingVal = row.rating;
                } else if (typeof row.rating === 'object' && row.rating !== null) {
                    const overall = row.rating.overall;
                    ratingVal = (typeof overall === 'number' && !isNaN(overall)) ? overall : 4.0;
                } else if (typeof row.rating === 'string') {
                    const parsed = parseFloat(row.rating);
                    ratingVal = (!isNaN(parsed)) ? parsed : 4.0;
                }

                // Ensure ratingVal is a valid number
                const safeRating = Number(ratingVal);
                const finalRating = isNaN(safeRating) ? 4.0 : safeRating;

                const stars = Math.round(finalRating);
                
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
                            {finalRating.toFixed(1)}
                        </span>
                    </div>
                );
            },
            sortable: true,
            width: '10%',
            align: 'center'
        },
        {
            key: 'best_for',
            header: 'Best For',
            accessor: (row) => {
                const bestFor = row.best_for || row.bestFor || 'General';
                const badgeColors: Record<string, string> = {
                    'Travel': 'bg-secondary-100 text-secondary-700 border-secondary-200',
                    'Cashback': 'bg-success-100 text-success-700 border-success-200',
                    'Premium': 'bg-accent-100 text-accent-700 border-accent-200',
                    'Rewards': 'bg-primary-100 text-primary-700 border-primary-200',
                    'General': 'bg-slate-100 text-slate-700 border-slate-200'
                };
                
                return (
                    <Badge className={`${badgeColors[bestFor] || badgeColors['General']} text-[10px] font-bold border`}>
                        {bestFor}
                    </Badge>
                );
            },
            sortable: false,
            width: '15%',
            align: 'center'
        },
        {
            key: 'actions',
            header: 'Actions',
            accessor: (row) => (
                <div className="flex flex-col gap-2">
                    <Link href={`/credit-cards/${row.slug}`} className="w-full">
                        <Button 
                            variant="outline" 
                            className="w-full h-9 rounded-xl border-slate-200 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-[10px] uppercase tracking-wider"
                        >
                            Details
                        </Button>
                    </Link>
                    <Link href={row.affiliate_link || row.link || `/credit-cards/${row.slug}`} className="w-full">
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
            data={cards}
            selectable={true}
            onSelectionChange={handleSelectionChange}
            sortable={true}
            defaultSort={{ column: 'rating', direction: 'desc' }}
            onRowClick={(card) => {
                // Optional: navigate to card detail page on row click
                // window.location.href = `/credit-cards/${card.slug}`;
            }}
            className="animate-in fade-in duration-500"
        />
    );
}
