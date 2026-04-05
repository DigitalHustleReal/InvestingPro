import { generateBreadcrumbs, generateBreadcrumbSchema, BreadcrumbItem } from '@/lib/linking/breadcrumbs';

describe('generateBreadcrumbs', () => {
    it('returns only Home for root path', () => {
        const crumbs = generateBreadcrumbs('/');
        expect(crumbs).toEqual([{ label: 'Home', url: '/' }]);
    });

    it('returns Home for empty path', () => {
        const crumbs = generateBreadcrumbs('');
        expect(crumbs).toEqual([{ label: 'Home', url: '/' }]);
    });

    it('generates breadcrumbs for a navigation config category', () => {
        const crumbs = generateBreadcrumbs('/credit-cards');
        expect(crumbs).toHaveLength(2);
        expect(crumbs[0]).toEqual({ label: 'Home', url: '/' });
        expect(crumbs[1]).toEqual({ label: 'Credit Cards', url: '/credit-cards' });
    });

    it('generates breadcrumbs for category + intent', () => {
        const crumbs = generateBreadcrumbs('/credit-cards/best');
        expect(crumbs).toHaveLength(3);
        expect(crumbs[0].label).toBe('Home');
        expect(crumbs[1].label).toBe('Credit Cards');
        expect(crumbs[2].label).toBe('Best');
        expect(crumbs[2].url).toBe('/credit-cards/best');
    });

    it('uses fallback labels for non-navigation routes', () => {
        const crumbs = generateBreadcrumbs('/calculators/sip');
        expect(crumbs).toHaveLength(3);
        expect(crumbs[1].label).toBe('Calculators');
        expect(crumbs[2].label).toBe('Sip');
    });

    it('formats unknown segments as title case', () => {
        const crumbs = generateBreadcrumbs('/some-unknown-page');
        expect(crumbs).toHaveLength(2);
        expect(crumbs[1].label).toBe('Some Unknown Page');
        expect(crumbs[1].url).toBe('/some-unknown-page');
    });

    it('builds correct URLs for deep paths', () => {
        const crumbs = generateBreadcrumbs('/blog/investing-tips');
        expect(crumbs[1].url).toBe('/blog');
        expect(crumbs[2].url).toBe('/blog/investing-tips');
    });
});

describe('generateBreadcrumbSchema', () => {
    it('generates valid JSON-LD breadcrumb schema', () => {
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', url: '/' },
            { label: 'Credit Cards', url: '/credit-cards' },
            { label: 'Best', url: '/credit-cards/best' },
        ];

        const schema = generateBreadcrumbSchema(breadcrumbs);

        expect(schema['@context']).toBe('https://schema.org');
        expect(schema['@type']).toBe('BreadcrumbList');
        expect(schema.itemListElement).toHaveLength(3);
    });

    it('assigns correct positions starting from 1', () => {
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', url: '/' },
            { label: 'Mutual Funds', url: '/mutual-funds' },
        ];

        const schema = generateBreadcrumbSchema(breadcrumbs);
        expect(schema.itemListElement[0].position).toBe(1);
        expect(schema.itemListElement[1].position).toBe(2);
    });

    it('generates full URLs with base domain', () => {
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', url: '/' },
        ];

        const schema = generateBreadcrumbSchema(breadcrumbs);
        expect(schema.itemListElement[0].item).toBe('https://investingpro.in/');
    });

    it('uses ListItem type for each element', () => {
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', url: '/' },
            { label: 'Blog', url: '/blog' },
        ];

        const schema = generateBreadcrumbSchema(breadcrumbs);
        schema.itemListElement.forEach((item: any) => {
            expect(item['@type']).toBe('ListItem');
            expect(item).toHaveProperty('name');
            expect(item).toHaveProperty('item');
            expect(item).toHaveProperty('position');
        });
    });
});
