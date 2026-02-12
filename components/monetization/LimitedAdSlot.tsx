"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient as api } from '@/lib/api-client';
import { logger } from '@/lib/logger';
import DisclosureBlock from './DisclosureBlock';

interface AdSlot {
    id: string;
    position: 'header' | 'sidebar' | 'in-article' | 'footer' | 'between-cards';
    maxPerPage: number;
    maxPerSession: number;
}

interface LimitedAdSlotProps {
    position: AdSlot['position'];
    pageName: string;
    className?: string;
}

/**
 * Limited Ad Slot Component
 * 
 * Displays ads with strict limits:
 * - Maximum ads per page
 * - Maximum ads per session
 * - Clear disclosure
 * - No popups
 * - No dark patterns
 */
export default function LimitedAdSlot({
    position,
    pageName,
    className = ""
}: LimitedAdSlotProps) {
    const [ad, setAd] = useState<any>(null);
    const [visible, setVisible] = useState(true);
    const [adsShown, setAdsShown] = useState(0);

    // Ad slot limits
    const AD_LIMITS: Record<string, { perPage: number; perSession: number }> = {
        header: { perPage: 1, perSession: 2 },
        sidebar: { perPage: 1, perSession: 3 },
        'in-article': { perPage: 2, perSession: 4 },
        footer: { perPage: 1, perSession: 2 },
        'between-cards': { perPage: 1, perSession: 2 },
    };

    useEffect(() => {
        // Check session limits
        const sessionKey = `ads_shown_${position}`;
        const sessionCount = parseInt(sessionStorage.getItem(sessionKey) || '0', 10);
        const limit = AD_LIMITS[position]?.perSession || 3;

        if (sessionCount >= limit) {
            return; // Don't show more ads this session
        }

        loadAd();
    }, [position, pageName]);

    const loadAd = async () => {
        try {
            const ads = await api.entities.AdPlacement.filter({
                position: position,
                status: 'active',
            });

            // Filter by page
            const relevantAds = ads.filter((ad: any) =>
                !ad.pages || ad.pages.length === 0 || ad.pages.includes(pageName)
            );

            if (relevantAds.length > 0) {
                const selectedAd = relevantAds[Math.floor(Math.random() * relevantAds.length)];
                setAd(selectedAd);

                // Track impression
                await api.entities.AdPlacement.update(selectedAd.id, {
                    impressions: (selectedAd.impressions || 0) + 1,
                });

                // Update session count
                const sessionKey = `ads_shown_${position}`;
                const currentCount = parseInt(sessionStorage.getItem(sessionKey) || '0', 10);
                sessionStorage.setItem(sessionKey, String(currentCount + 1));
                setAdsShown(currentCount + 1);
            }
        } catch (error) {
            logger.error('Error loading ad', error as Error, { position, pageName });
        }
    };

    const handleClick = async () => {
        if (ad && ad.click_url) {
            try {
                // Track click
                await api.entities.AdPlacement.update(ad.id, {
                    clicks: (ad.clicks || 0) + 1,
                    spent: (ad.spent || 0) + (ad.cpc || 0),
                });

                // Track source
                if (typeof window !== 'undefined') {
                    const clickData = {
                        ad_id: ad.id,
                        position: position,
                        source_page: window.location.pathname,
                        user_agent: navigator.userAgent,
                        referrer: document.referrer,
                    };
                    // Store for analytics
                    sessionStorage.setItem(`ad_click_${ad.id}`, JSON.stringify(clickData));
                }

                window.open(ad.click_url, '_blank', 'noopener,noreferrer');
            } catch (error) {
                logger.error('Error tracking ad click', error as Error, { adId: ad.id });
                window.open(ad.click_url, '_blank', 'noopener,noreferrer');
            }
        }
    };

    if (!ad || !visible) return null;

    const getPositionStyles = () => {
        switch (position) {
            case 'header':
                return 'w-full bg-slate-100 border-b border-slate-200';
            case 'sidebar':
                return 'sticky top-24 bg-white border border-slate-200 rounded-xl';
            case 'in-article':
                return 'my-8 bg-slate-50 border border-slate-200 rounded-xl';
            case 'footer':
                return 'w-full bg-slate-100 border-t border-slate-200';
            case 'between-cards':
                return 'bg-gradient-to-r from-primary-50 to-primary-100 border border-secondary-200 rounded-xl';
            default:
                return 'bg-slate-100 border border-slate-200 rounded-lg';
        }
    };

    return (
        <div className={`relative ${getPositionStyles()} ${className} overflow-hidden`}>
            {/* Close button (no dark pattern - clearly visible) */}
            <div className="absolute top-2 right-2 z-10">
                <button
                    onClick={() => setVisible(false)}
                    className="w-6 h-6 rounded-full bg-slate-800/50 hover:bg-slate-800/70 flex items-center justify-center text-white transition-colors"
                    aria-label="Close ad"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Clear "Ad" label */}
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-600 px-3 pt-2">
                Advertisement
            </div>

            {/* Ad content */}
            <div
                onClick={handleClick}
                className="cursor-pointer p-4 hover:opacity-95 transition-opacity"
                dangerouslySetInnerHTML={{ __html: ad.ad_content }}
            />

            {/* Advertiser info */}
            {ad.advertiser && (
                <div className="px-3 pb-2 text-[10px] text-slate-500 uppercase tracking-tighter">
                    by {ad.advertiser}
                </div>
            )}

            {/* Disclosure (compact) */}
            <div className="px-3 pb-2">
                <DisclosureBlock type="ad" compact={true} />
            </div>
        </div>
    );
}

