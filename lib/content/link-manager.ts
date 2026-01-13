
/**
 * Content Enrichment Utility
 * 
 * Handles:
 * 1. Shortcode expansion (e.g. [sip-calculator] -> Widget placeholder)
 * 2. Affiliate link injection (Future)
 * 3. Internal linking (Future)
 */

export function enrichContent(html: string): string {
    if (!html) return '';
    
    let enriched = html;

    // 1. Calculator Shortcodes
    // Replace [sip-calculator] with Hydration Placeholder
    enriched = enriched.replace(
        /\[sip-calculator\]/gi, 
        '<div data-widget="sip-calculator" class="my-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-slate-500">Loading Calculator...</div>'
    );

    // 2. Affiliate & Internal Links
    const LINKS = [
        { key: 'Zerodha', url: 'https://zerodha.com/?c=DEMO', rel: 'nofollow noopener' },
        { key: 'SIP Calculator', url: '#sip-calculator', rel: '' }, // Internal anchor or link
        { key: 'Contact Us', url: '/contact', rel: '' }
    ];

    LINKS.forEach(link => {
        // Simple global replacement (Case insensitive). 
        // Note: Production-grade implementation should use a DOM parser to avoid breaking attributes.
        // This is a lightweight implementation.
        const regex = new RegExp(`\\b(${link.key})\\b(?!([^<]+)?>)`, 'gi'); 
        enriched = enriched.replace(regex, (match) => {
            return `<a href="${link.url}" class="text-primary-600 hover:underline" ${link.rel ? `rel="${link.rel}" target="_blank"` : ''}>${match}</a>`;
        });
    });
    
    return enriched;
}
