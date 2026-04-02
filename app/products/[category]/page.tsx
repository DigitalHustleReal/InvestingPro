"use client";

import React, { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/lib/products/product-service';
import SEOHead from '@/components/common/SEOHead';
import Pagination from '@/components/common/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { 
    Search, 
    ArrowRight, 
    TrendingUp,
    CheckCircle,
    Shield,
    Package
} from 'lucide-react';
import Link from 'next/link';

const CATEGORY_META: Record<string, { title: string; description: string; icon: string }> = {
    credit_card: {
        title: 'Best Credit Cards in India',
        description: 'Compare and find the best credit cards with rewards, cashback, and lounge access.',
        icon: '💳'
    },
    mutual_fund: {
        title: 'Top Mutual Funds',
        description: 'Discover high-performing mutual funds for your investment portfolio.',
        icon: '📈'
    },
    loan: {
        title: 'Best Loan Offers',
        description: 'Compare personal loans, home loans, and business loans with competitive rates.',
        icon: '💰'
    },
    insurance: {
        title: 'Insurance Plans',
        description: 'Find the right life, health, and term insurance for you and your family.',
        icon: '🛡️'
    },
    broker: {
        title: 'Best Stock Brokers',
        description: 'Compare trading platforms, brokerage fees, and features.',
        icon: '📊'
    }
};

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function ProductCategoryPage() {
    const params = useParams();
    const category = params.category as string;
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const debouncedSearch = useDebounce(searchTerm, 300);
    const categoryMeta = CATEGORY_META[category] || { 
        title: 'Products', 
        description: 'Browse our curated selection of financial products.', 
        icon: '📦' 
    };

    const { data, isLoading } = useQuery({
        queryKey: ['products', category, currentPage, debouncedSearch],
        queryFn: () => productService.getProductsPaginated({
            page: currentPage,
            limit: itemsPerPage,
            category,
            search: debouncedSearch
        }),
        staleTime: 60000,
        placeholderData: (prev) => prev,
    });

    const products = data?.products || [];
    const totalItems = data?.total || 0;
    const totalPages = data?.totalPages || 0;

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <SEOHead
                title={`${categoryMeta.title} | InvestingPro`}
                description={categoryMeta.description}
            />

            {/* Hero */}
            <div className="bg-gray-900 border-b border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-[128px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    <div className="max-w-3xl">
                        <div className="text-5xl mb-4">{categoryMeta.icon}</div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                            {categoryMeta.title}
                        </h1>
                        <p className="text-xl text-gray-400 mb-8">
                            {categoryMeta.description}
                        </p>
                        <div className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-12 h-14 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Results count */}
                <div className="flex justify-between items-center mb-8">
                    <p className="text-gray-600">
                        Showing <span className="font-bold text-gray-900">{products.length}</span> of{' '}
                        <span className="font-bold text-gray-900">{totalItems}</span> products
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6">
                                    <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
                                    <div className="h-6 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                </CardContent>
                            </Card>
                        ))
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search terms.</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <Link key={product.id} href={`/products/${category}/${product.slug}`}>
                                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-200 group bg-white overflow-hidden">
                                    <CardContent className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{product.provider_name}</p>
                                                </div>
                                            </div>
                                            {product.trust_score && product.trust_score >= 70 && (
                                                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                    <span className="text-sm font-bold text-emerald-700">{product.trust_score}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Meta Description */}
                                        {product.meta_description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {product.meta_description}
                                            </p>
                                        )}

                                        {/* Status */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {product.verification_status === 'verified' && (
                                                <Badge className="bg-success-100 text-success-700 border-0 text-xs flex items-center gap-1">
                                                    <Shield className="w-3 h-3" /> Verified
                                                </Badge>
                                            )}
                                            {product.launch_date && (
                                                <Badge variant="outline" className="text-xs">
                                                    Since {new Date(product.launch_date).getFullYear()}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <span className="text-sm text-emerald-600 font-medium group-hover:underline flex items-center gap-1">
                                                View Details <ArrowRight className="w-4 h-4" />
                                            </span>
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                                                Learn More
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
