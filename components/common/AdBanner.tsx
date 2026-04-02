"use client";

import React, { useEffect, useState } from 'react';
import { api } from "@/lib/api";
import { X } from "lucide-react";
import { logger } from "@/lib/logger";

interface Ad {
    id: string;
    position: string;
    ad_content: string;
    click_url?: string;
    advertiser?: string;
    pages?: string[];
    impressions?: number;
    clicks?: number;
    spent?: number;
    cpc?: number;
}

interface AdBannerProps {
    position: 'header' | 'sidebar' | 'in-article' | 'footer' | 'between-cards';
    pageName: string;
}

export default function AdBanner({ position, pageName }: AdBannerProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        loadAd();
    }, [position, pageName]);

    const loadAd = async () => {
        try {
            const ads = await api.entities.AdPlacement.filter({
                position: position,
                status: 'active'
            }) as unknown as Ad[];

            // Filter by page
            const relevantAds = ads.filter((ad: Ad) =>
                !ad.pages || ad.pages.length === 0 || ad.pages.includes(pageName)
            );

            if (relevantAds.length > 0) {
                // Pick random ad if multiple
                const selectedAd = relevantAds[Math.floor(Math.random() * relevantAds.length)];
                setAd(selectedAd);

                // Track impression
                await api.entities.AdPlacement.update(selectedAd.id, {
                    impressions: (selectedAd.impressions || 0) + 1
                });
            }
        } catch (error) {
            logger.error('Error loading ad', error as Error, { position, pageName });
            // Silently fail - ad just won't show
        }
    };

    const handleClick = async () => {
        if (ad && ad.click_url) {
            try {
                // Track click
                await api.entities.AdPlacement.update(ad.id, {
                    clicks: (ad.clicks || 0) + 1,
                    spent: (ad.spent || 0) + (ad.cpc || 0)
                });

                window.open(ad.click_url, '_blank', 'noopener,noreferrer');
            } catch (error) {
                logger.error('Error tracking ad click', error as Error, { adId: ad.id });
                // Still open link even if tracking fails
                window.open(ad.click_url, '_blank', 'noopener,noreferrer');
            }
        }
    };

    if (!ad || !visible) return null;

    const getPositionStyles = () => {
        switch (position) {
            case 'header':
                return 'w-full bg-gray-100 border-b border-gray-200';
            case 'sidebar':
                return 'sticky top-24 bg-white border border-gray-200 rounded-xl';
            case 'in-article':
                return 'my-8 bg-gray-50 border border-gray-200 rounded-xl';
            case 'footer':
                return 'w-full bg-gray-100 border-t border-gray-200';
            case 'between-cards':
                return 'bg-gradient-to-r from-primary-50 to-primary-100 border border-secondary-200 rounded-xl';
            default:
                return 'bg-gray-100 border border-gray-200 rounded-lg';
        }
    };

    return (
        <div className={`relative ${getPositionStyles()} overflow-hidden`}>
            <div className="absolute top-2 right-2 z-10">
                <button
                    onClick={() => setVisible(false)}
                    className="w-6 h-6 rounded-full bg-gray-800/50 hover:bg-gray-800/70 flex items-center justify-center text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-600 px-3 pt-2">Sponsored</div>

            <div
                onClick={handleClick}
                className="cursor-pointer p-4 hover:opacity-95 transition-opacity"
                dangerouslySetInnerHTML={{ __html: ad.ad_content }}
            />

            {ad.advertiser && (
                <div className="px-3 pb-2 text-[10px] text-gray-500 uppercase tracking-tighter">
                    by {ad.advertiser}
                </div>
            )}
        </div>
    );
}
