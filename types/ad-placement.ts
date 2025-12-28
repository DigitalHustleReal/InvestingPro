export type AdPosition = 'header' | 'sidebar' | 'in-article' | 'footer' | 'between-cards';
export type AdType = 'banner' | 'native' | 'video' | 'sponsored-content';
export type AdStatus = 'active' | 'paused' | 'expired';

export interface AdPlacement {
    id: string;
    name: string;

    position: AdPosition;
    pages: string[]; // e.g. ['/home', '/credit-cards']

    ad_type: AdType;
    advertiser?: string;
    ad_content: string; // HTML or URL
    click_url?: string;

    status: AdStatus;
    start_date?: string;
    end_date?: string;

    // Stats
    impressions: number;
    clicks: number;
    cpc?: number;
    budget?: number;
    spent: number;
}
