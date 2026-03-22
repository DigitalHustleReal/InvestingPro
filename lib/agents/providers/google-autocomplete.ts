/**
 * Google Autocomplete suggestions provider.
 * Uses the unofficial Google Autocomplete API as a proxy for trending searches.
 */

export interface GoogleSuggestion {
    keyword: string;
    relevance: number;
}

/**
 * Fetches autocomplete suggestions from Google for a given query.
 * @param query - The search query
 * @param hl - Language code (e.g. 'en')
 * @param gl - Country code (e.g. 'IN')
 */
export async function getGoogleSuggestions(
    query: string,
    gl: string = 'IN',
    hl: string = 'en'
): Promise<GoogleSuggestion[]> {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}`;

    const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
        throw new Error(`Google suggestions request failed: ${response.status}`);
    }

    const data = await response.json() as [string, string[]];
    const suggestions: string[] = data[1] ?? [];

    return suggestions.map((keyword, index) => ({
        keyword,
        relevance: Math.max(100 - index * 10, 10),
    }));
}
