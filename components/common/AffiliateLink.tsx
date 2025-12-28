"use client";

import React from 'react';
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { ExternalLink } from "lucide-react";
import { logger } from "@/lib/logger";

interface AffiliateLinkProps {
    productId: string;
    articleId?: string | null;
    children?: React.ReactNode;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function AffiliateLink({
    productId,
    articleId = null,
    children,
    className = "",
    variant = "default"
}: AffiliateLinkProps) {

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        let product: any = null;
        try {
            // Get product details
            const products = await api.entities.AffiliateProduct.filter({ id: productId });

            if (!products || products.length === 0) {
                logger.warn("Affiliate product not found", { productId });
                return;
            }

            product = products[0];

            // Track click
            await api.entities.AffiliateClick.create({
                product_id: productId,
                article_id: articleId,
                user_agent: navigator.userAgent,
                referrer: window.location.href,
            });

            // Redirect to affiliate link
            window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
        } catch (error) {
            logger.error('Error tracking affiliate click', error as Error, { productId });
            // Still open link even if tracking fails
            if (product?.affiliate_link) {
                window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
            }
        }
    };

    return (
        <Button
            onClick={handleClick}
            className={className}
            variant={variant}
        >
            {children || 'Apply Now'}
            <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
    );
}
