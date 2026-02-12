import { formatINR, formatPercentage, formatGainLoss, parseINR } from '@/lib/utils/currency';

describe('Currency Utils', () => {
    describe('formatINR', () => {
        it('formats amounts according to Indian numbering system', () => {
            // Note: Intl.NumberFormat might use different non-breaking space characters or symbols depending on environment
            // We use .toContain or simplify the check if needed, but standard en-IN formatting is expected.
            expect(formatINR(100000)).toContain('1,00,000');
            expect(formatINR(10000000)).toContain('1,00,00,000');
        });

        it('handles zero and NaN', () => {
            expect(formatINR(0)).toContain('0');
            expect(formatINR(NaN)).toContain('--');
        });

        it('supports compact notation', () => {
            expect(formatINR(1000, { compact: true })).toContain('1.0K');
            expect(formatINR(100000, { compact: true })).toContain('1.0L');
            expect(formatINR(10000000, { compact: true })).toContain('1.0Cr');
        });

        it('supports decimal places', () => {
            expect(formatINR(123456.78, { decimals: 2 })).toContain('1,23,456.78');
        });
    });

    describe('formatPercentage', () => {
        it('formats numbers as percentages', () => {
            expect(formatPercentage(12.5)).toBe('12.50%');
            expect(formatPercentage(7.892, 1)).toBe('7.9%');
        });

        it('handles NaN', () => {
            expect(formatPercentage(NaN)).toBe('--%');
        });
    });

    describe('formatGainLoss', () => {
        it('returns correct color and icon for positive amounts', () => {
            const result = formatGainLoss(5000);
            expect(result.color).toBe('text-success-700');
            expect(result.icon).toBe('▲');
            expect(result.formatted).toContain('5,000');
        });

        it('returns correct color and icon for negative amounts', () => {
            const result = formatGainLoss(-5000);
            expect(result.color).toBe('text-danger-700');
            expect(result.icon).toBe('▼');
            expect(result.formatted).toContain('5,000');
        });

        it('returns neutral for zero', () => {
            const result = formatGainLoss(0);
            expect(result.color).toBe('text-stone-900');
            expect(result.icon).toBe('');
        });
    });

    describe('parseINR', () => {
        it('parses standard formatted strings', () => {
            expect(parseINR('₹1,00,000')).toBe(100000);
            expect(parseINR('1,00,000')).toBe(100000);
        });

        it('parses compact strings', () => {
            expect(parseINR('₹50L')).toBe(5000000);
            expect(parseINR('2.5Cr')).toBe(25000000);
            expect(parseINR('10K')).toBe(10000);
        });

        it('handles invalid input', () => {
            expect(parseINR('')).toBe(0);
            expect(parseINR('abc')).toBe(0);
        });
    });
});
