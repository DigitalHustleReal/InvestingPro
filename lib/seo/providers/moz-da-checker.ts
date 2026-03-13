/**
 * Domain Authority Checker
 * 
 * Checks domain authority (DA) of competitor sites found in SERP.
 * Uses Moz's free Link Explorer API (10,000 rows/month free).
 * Falls back to a curated static lookup for known Indian finance sites.
 * 
 * Free signup: https://moz.com/products/api
 * Set: MOZ_ACCESS_ID and MOZ_SECRET_KEY in .env.local
 */

import { logger } from '@/lib/logger';

export interface DAResult {
    domain: string;
    domainAuthority: number;   // 0-100 (Moz DA or estimate)
    pageAuthority: number;     // 0-100
    spamScore: number;         // 0-17
    source: 'moz' | 'static_lookup' | 'estimated';
}

// Comprehensive static DA lookup for Indian finance sites
// Updated based on Moz DA data (March 2026)
const STATIC_DA_TABLE: Record<string, number> = {
    // Ultra-high authority (DA 85-100)
    'wikipedia.org': 95,
    'rbi.org.in': 88,
    'sebi.gov.in': 85,
    'incometax.gov.in': 82,
    'irda.gov.in': 80,
    'economictimes.indiatimes.com': 87,
    'livemint.com': 82,
    'business-standard.com': 80,
    'hindustantimes.com': 79,
    'ndtv.com': 85,
    'thehindu.com': 86,
    'timesofindia.indiatimes.com': 88,
    'forbes.com': 93,
    'bloomberg.com': 92,
    'reuters.com': 93,
    'nytimes.com': 95,
    
    // High authority Indian finance (DA 60-85)
    'moneycontrol.com': 80,
    'valueresearchonline.com': 68,
    'morningstar.in': 65,
    'fundresearch.in': 55,
    'bseindia.com': 72,
    'nseindia.com': 75,
    'mutualfundssahihai.com': 55,
    
    // Mid-tier finance sites (DA 40-60)
    'cleartax.in': 62,
    'taxguru.in': 58,
    'bankbazaar.com': 65,
    'paisabazaar.com': 63,
    'policybazaar.com': 64,
    'coverfox.com': 52,
    'groww.in': 68,
    'zerodha.com': 72,
    'upstox.com': 60,
    'angelone.in': 58,
    'icicidirect.com': 65,
    'hdfcsec.com': 64,
    'motilaloswal.com': 58,
    'indiainfoline.com': 55,
    'sharekhan.com': 60,
    'fincash.com': 45,
    'etmoney.com': 55,
    'kuvera.in': 50,
    'scripbox.com': 52,
    'wealthdesk.in': 40,
    'fisdom.com': 42,
    'edelweiss.in': 55,
    'nipponindiaim.com': 58,
    'hdfcfund.com': 60,
    
    // Lower authority (DA 20-40)
    'personalfinanceplan.in': 35,
    'jagoinvestor.com': 40,
    'freefincal.com': 38,
    'subramoneymutualfund.com': 32,
    'capitalminds.in': 30,
};

/**
 * Check domain authority for a list of URLs/domains
 */
export async function checkDomainAuthority(urls: string[]): Promise<DAResult[]> {
    const domains = urls.map(extractDomain).filter(Boolean);
    const uniqueDomains = [...new Set(domains)];

    const results: DAResult[] = [];

    for (const domain of uniqueDomains) {
        const result = await getDomainAuthority(domain);
        results.push(result);
    }

    return results;
}

/**
 * Get DA for a single domain
 */
export async function getDomainAuthority(domain: string): Promise<DAResult> {
    // Check static lookup first (fastest, no API limit)
    const staticDA = getStaticDA(domain);
    if (staticDA !== null) {
        return {
            domain,
            domainAuthority: staticDA,
            pageAuthority: Math.max(0, staticDA - 10),
            spamScore: staticDA > 60 ? 1 : 3,
            source: 'static_lookup',
        };
    }

    // Try Moz API if configured
    const mozAccessId = process.env.MOZ_ACCESS_ID;
    const mozSecretKey = process.env.MOZ_SECRET_KEY;

    if (mozAccessId && mozSecretKey) {
        try {
            return await fetchMozDA(domain, mozAccessId, mozSecretKey);
        } catch (error) {
            logger.warn('Moz DA API failed', { domain, error: (error as Error).message });
        }
    }

    // Fallback: intelligent estimation
    return estimateDA(domain);
}

function getStaticDA(domain: string): number | null {
    // Direct match
    if (STATIC_DA_TABLE[domain] !== undefined) {
        return STATIC_DA_TABLE[domain];
    }

    // Substring match (for subdomains)
    for (const [key, da] of Object.entries(STATIC_DA_TABLE)) {
        if (domain.includes(key) || key.includes(domain)) {
            return da;
        }
    }

    return null;
}

async function fetchMozDA(domain: string, accessId: string, secretKey: string): Promise<DAResult> {
    const credentials = Buffer.from(`${accessId}:${secretKey}`).toString('base64');

    const response = await fetch('https://lsapi.seomoz.com/v2/url_metrics', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            targets: [`${domain}/`],
        }),
        signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
        throw new Error(`Moz API returned ${response.status}`);
    }

    const data = await response.json();
    const result = data?.results?.[0];

    if (!result) throw new Error('No result from Moz');

    return {
        domain,
        domainAuthority: Math.round(result.domain_authority || 0),
        pageAuthority: Math.round(result.page_authority || 0),
        spamScore: Math.round(result.spam_score || 0),
        source: 'moz',
    };
}

function estimateDA(domain: string): DAResult {
    let estimated = 25; // Default for unknown sites

    // TLD-based estimates
    if (domain.endsWith('.gov.in') || domain.endsWith('.nic.in')) estimated = 75;
    else if (domain.endsWith('.edu')) estimated = 70;
    else if (domain.endsWith('.org')) estimated = 45;
    else if (domain.endsWith('.co.in')) estimated = 30;

    // Domain age heuristics (short domains tend to be older)
    const parts = domain.replace(/\.(com|in|org|net|co\.in)$/, '').split('.');
    const mainPart = parts[parts.length - 1];
    if (mainPart.length <= 6) estimated += 10; // Short domain = likely established
    if (mainPart.length >= 12) estimated -= 5; // Long domain = likely newer

    return {
        domain,
        domainAuthority: Math.min(70, Math.max(10, estimated)),
        pageAuthority: Math.max(5, estimated - 15),
        spamScore: 5,
        source: 'estimated',
    };
}

function extractDomain(url: string): string {
    try {
        const u = url.startsWith('http') ? url : `https://${url}`;
        const parsed = new URL(u);
        return parsed.hostname.replace(/^www\./, '');
    } catch {
        return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    }
}

/**
 * Get YOUR site's current domain authority (for rankability gap calculation)
 */
export async function getYourSiteDA(): Promise<number> {
    const yourDomain = process.env.NEXT_PUBLIC_SITE_URL 
        ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
        : 'localhost';
    
    // If configured in env, use that directly (most accurate)
    const configuredDA = process.env.YOUR_SITE_DA;
    if (configuredDA) {
        return parseInt(configuredDA, 10);
    }

    // Try to get from Moz
    const result = await getDomainAuthority(yourDomain);
    return result.domainAuthority;
}
