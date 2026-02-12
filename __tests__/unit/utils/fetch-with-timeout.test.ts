import { fetchWithTimeout } from '@/lib/utils/fetch-with-timeout';

describe('fetchWithTimeout', () => {
    beforeEach(() => {
        // Reset global fetch mock if any
        global.fetch = jest.fn();
    });

    it('should resolve when fetch succeeds within timeout', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(new Response('ok'));
        const response = await fetchWithTimeout('http://example.com');
        expect(await response.text()).toBe('ok');
    });

    it('should throw timeout error when fetch takes too long', async () => {
        (global.fetch as jest.Mock).mockImplementation((_url, options) => {
            return new Promise((resolve, reject) => {
                if (options?.signal) {
                    options.signal.addEventListener('abort', () => {
                        const error = new Error('The user aborted a request.');
                        error.name = 'AbortError';
                        reject(error);
                    });
                }
                // Never resolve, simulate hang
            });
        });

        // Use a very short timeout for testing
        const promise = fetchWithTimeout('http://example.com', { timeout: 10 });
        
        // Wait for it to fail
        await expect(promise).rejects.toThrow('Request timeout after 10ms');
    });

    it('should pass through other fetch errors', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
        await expect(fetchWithTimeout('http://example.com')).rejects.toThrow('Network error');
    });
});
