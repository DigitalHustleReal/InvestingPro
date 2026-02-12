import { retry, CircuitBreaker } from '@/lib/utils/retry';

describe('Retry Utils', () => {
    describe('retry', () => {
        it('returns success on first attempt', async () => {
            const fn = jest.fn().mockResolvedValue('success');
            const result = await retry(fn);
            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('retries on failure and eventually succeeds', async () => {
            const fn = jest.fn()
                .mockRejectedValueOnce(new Error('fail'))
                .mockRejectedValueOnce(new Error('fail'))
                .mockResolvedValue('success');
            
            const result = await retry(fn, { delay: 10 });
            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(3);
        });

        it('throws error after exhausting retries', async () => {
            const fn = jest.fn().mockRejectedValue(new Error('fail'));
            await expect(retry(fn, { maxRetries: 2, delay: 10 })).rejects.toThrow('fail');
            expect(fn).toHaveBeenCalledTimes(3); // 1st try + 2 retries
        });

        it('does not retry on rate limit errors', async () => {
            const fn = jest.fn().mockRejectedValue(new Error('Rate limit exceeded'));
            await expect(retry(fn, { delay: 10 })).rejects.toThrow('Rate limit exceeded');
            expect(fn).toHaveBeenCalledTimes(1);
        });
    });

    describe('CircuitBreaker', () => {
        it('allows execution when closed', async () => {
            const cb = new CircuitBreaker(2);
            const fn = jest.fn().mockResolvedValue('success');
            const result = await cb.execute(fn);
            expect(result).toBe('success');
            expect(cb.getState()).toBe('closed');
        });

        it('opens circuit after threshold failures', async () => {
            const cb = new CircuitBreaker(2);
            const fn = jest.fn().mockRejectedValue(new Error('fail'));
            
            await expect(cb.execute(fn)).rejects.toThrow('fail');
            expect(cb.getState()).toBe('closed'); // 1 failure
            
            await expect(cb.execute(fn)).rejects.toThrow('fail');
            expect(cb.getState()).toBe('open'); // 2 failures
        });

        it('prevents execution when open', async () => {
            const cb = new CircuitBreaker(1);
            const fn = jest.fn().mockRejectedValue(new Error('fail'));
            
            await expect(cb.execute(fn)).rejects.toThrow('fail');
            expect(cb.getState()).toBe('open');
            
            await expect(cb.execute(() => Promise.resolve('ok'))).rejects.toThrow('Circuit breaker is open');
        });
    });
});
