"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SEOHead from '@/components/common/SEOHead';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import Link from 'next/link';
import DecisionCTA from '@/components/common/DecisionCTA';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import { logger } from '@/lib/logger';

type ProductType = 'credit-card' | 'mutual-fund' | 'loan' | 'insurance';

export default function ApplicationPage() {
    const params = useParams();
    const router = useRouter();
    const productType = (params.productType as ProductType) || 'credit-card';
    const productId = params.productId as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                
                // Map productType to API entity
                let productData = null;
                switch (productType) {
                    case 'credit-card':
                        productData = await api.entities.CreditCard.getById(productId);
                        break;
                    case 'mutual-fund':
                        productData = await api.entities.MutualFund.getById(productId);
                        break;
                    case 'loan':
                        productData = await api.entities.Loan.getById(productId);
                        break;
                    case 'insurance':
                        productData = await api.entities.Insurance?.getById(productId);
                        break;
                }

                if (!productData) {
                    setError('Product not found');
                    return;
                }

                setProduct(productData);
            } catch (err) {
                logger.error('Failed to load product', err as Error);
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId, productType]);

    const handleConversion = (event: { type: string; productId?: string }) => {
        // Track conversion
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'application_page_view', {
                product_id: productId,
                product_type: productType
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
                    <Link href="/">
                        <DecisionCTA
                            text="Go to Homepage"
                            href="/"
                            variant="primary"
                        />
                    </Link>
                </div>
            </div>
        );
    }

    const affiliateLink = product.affiliate_link || product.apply_link || product.link;
    const productName = product.name || 'Product';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <SEOHead
                title={`Apply for ${productName} - Instant Application | InvestingPro`}
                description={`Apply for ${productName} instantly. Secure application process with instant approval. Compare and apply for the best ${productType.replace('-', ' ')} products.`}
            />

            <div className="bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <Link href={`/${productType}s/${product.slug || productId}`} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Product Details
                    </Link>

                    {/* Application Section */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full px-4 py-2 mb-4">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Secure Application</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Apply for {productName}
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    You'll be redirected to the official provider's website to complete your application.
                                </p>
                            </div>

                            {/* Trust Signals */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What happens next:</h3>
                                <ul className="space-y-3">
                                    {[
                                        "You'll be redirected to the official application page",
                                        "Complete the secure application form",
                                        "Get instant approval decision (if eligible)",
                                        "Receive confirmation via email/SMS"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="text-center">
                                {affiliateLink ? (
                                    <DecisionCTA
                                        text={productType === 'credit-card' ? 'Apply Instantly' : 
                                              productType === 'mutual-fund' ? 'Start SIP Now' :
                                              productType === 'loan' ? 'Check Eligibility' :
                                              'Get Protected'}
                                        href={affiliateLink}
                                        productId={productId}
                                        variant="primary"
                                        size="lg"
                                        className="w-full md:w-auto min-w-[280px] h-14 text-lg font-bold"
                                        isExternal={true}
                                        showIcon={true}
                                        onConversion={handleConversion}
                                    />
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">Application link not available. Please contact support.</p>
                                )}
                            </div>

                            {/* Disclaimer */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
                                By clicking the button above, you'll be redirected to the official provider's website. 
                                InvestingPro earns a commission if you complete the application.
                            </p>
                        </div>

                        {/* Compliance Disclaimer */}
                        <div className="mt-8">
                            <ComplianceDisclaimer variant="compact" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
