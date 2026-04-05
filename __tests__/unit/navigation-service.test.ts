import { NAVIGATION_CONFIG } from '@/lib/navigation/config';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
    createClient: jest.fn(),
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
    logger: { error: jest.fn(), info: jest.fn(), warn: jest.fn() },
}));

import { createClient } from '@/lib/supabase/client';
import { getNavigation } from '@/lib/navigation/service';

const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockOrder = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    mockOrder.mockResolvedValue({ data: null, error: null });
    mockSelect.mockReturnValue({ order: mockOrder });
    mockFrom.mockReturnValue({ select: mockSelect });
    (createClient as jest.Mock).mockReturnValue({ from: mockFrom });
});

describe('getNavigation', () => {
    it('returns NAVIGATION_CONFIG when DB returns empty data', async () => {
        mockOrder.mockResolvedValue({ data: [], error: null });
        const result = await getNavigation();
        expect(result).toEqual(NAVIGATION_CONFIG);
    });

    it('returns NAVIGATION_CONFIG when DB returns an error', async () => {
        mockOrder.mockResolvedValue({ data: null, error: { message: 'DB down' } });
        const result = await getNavigation();
        expect(result).toEqual(NAVIGATION_CONFIG);
    });

    it('returns NAVIGATION_CONFIG when DB returns valid categories (phase 1 always returns static)', async () => {
        mockOrder.mockResolvedValue({
            data: [{ name: 'Credit Cards', slug: 'credit-cards', description: 'Cards' }],
            error: null,
        });
        const result = await getNavigation();
        // Phase 1 implementation always returns static config
        expect(result).toEqual(NAVIGATION_CONFIG);
    });

    it('returns NAVIGATION_CONFIG when createClient throws', async () => {
        (createClient as jest.Mock).mockImplementation(() => {
            throw new Error('Client init failed');
        });
        const result = await getNavigation();
        expect(result).toEqual(NAVIGATION_CONFIG);
    });

    it('queries the categories table', async () => {
        mockOrder.mockResolvedValue({ data: [], error: null });
        await getNavigation();
        expect(mockFrom).toHaveBeenCalledWith('categories');
        expect(mockSelect).toHaveBeenCalledWith('name, slug, description');
        expect(mockOrder).toHaveBeenCalledWith('name');
    });
});

describe('NAVIGATION_CONFIG structure', () => {
    it('contains at least one category', () => {
        expect(NAVIGATION_CONFIG.length).toBeGreaterThan(0);
    });

    it('every category has required fields', () => {
        NAVIGATION_CONFIG.forEach(cat => {
            expect(cat).toHaveProperty('name');
            expect(cat).toHaveProperty('slug');
            expect(cat).toHaveProperty('description');
            expect(cat).toHaveProperty('intents');
            expect(cat.slug).toMatch(/^[a-z0-9-]+$/);
        });
    });

    it('credit-cards category exists with expected intents', () => {
        const cc = NAVIGATION_CONFIG.find(c => c.slug === 'credit-cards');
        expect(cc).toBeDefined();
        expect(cc!.intents.length).toBeGreaterThan(0);
        const intentSlugs = cc!.intents.map(i => i.slug);
        expect(intentSlugs).toContain('best');
        expect(intentSlugs).toContain('compare');
    });
});
