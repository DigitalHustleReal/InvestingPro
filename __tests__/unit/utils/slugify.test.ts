import { slugifyTerm } from '@/lib/utils';

describe('slugifyTerm', () => {
    it('converts simple text to lowercase slug', () => {
        expect(slugifyTerm('Hello World')).toBe('hello-world');
    });

    it('replaces multiple non-alphanumeric characters with a single hyphen', () => {
        expect(slugifyTerm('Best Credit Cards -- 2026')).toBe('best-credit-cards-2026');
    });

    it('removes leading and trailing hyphens', () => {
        expect(slugifyTerm('---hello---')).toBe('hello');
        expect(slugifyTerm('  spaced  ')).toBe('spaced');
    });

    it('handles special characters and punctuation', () => {
        expect(slugifyTerm('SBI Card: Rewards & Benefits!')).toBe('sbi-card-rewards-benefits');
        expect(slugifyTerm('HDFC 10X Rewards (2026)')).toBe('hdfc-10x-rewards-2026');
    });

    it('strips non-Latin characters (Indian language text)', () => {
        // Hindi characters are non-alphanumeric in the [a-z0-9] regex
        expect(slugifyTerm('क्रेडिट कार्ड')).toBe('');
        // Mixed: keeps only the Latin/numeric parts
        expect(slugifyTerm('Best कार्ड 2026')).toBe('best-2026');
    });

    it('handles empty string', () => {
        expect(slugifyTerm('')).toBe('');
    });

    it('handles string with only special characters', () => {
        expect(slugifyTerm('!@#$%^&*()')).toBe('');
    });

    it('handles numeric-only strings', () => {
        expect(slugifyTerm('12345')).toBe('12345');
    });
});
