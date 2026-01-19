/**
 * Fetch with timeout utility
 * Prevents hanging connections that cause repeated failures
 */

export interface FetchWithTimeoutOptions extends RequestInit {
    timeout?: number; // Timeout in milliseconds (default: 30000)
}

/**
 * Fetch with automatic timeout
 * Throws error if request takes longer than timeout
 */
export async function fetchWithTimeout(
    url: string | URL,
    options: FetchWithTimeoutOptions = {}
): Promise<Response> {
    const { timeout = 30000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms: ${url}`);
        }
        throw error;
    }
}
