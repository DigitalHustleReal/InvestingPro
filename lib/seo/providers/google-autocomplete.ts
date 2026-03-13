/**
 * Google Autocomplete Provider
 * 
 * Uses Google's free Suggest/Autocomplete API and "People Also Ask" scraping
 * to generate real keyword suggestions — no API key required.
 * 
 * Endpoints:
 *  - Suggest:   https://suggestqueries.google.com/complete/search?q=...&client=firefox&hl=en-IN&gl=IN
 *  - PAA scrape: via a SERP scrape of 'related:query' pattern
 */

import { logger } from '@/lib/logger';

export interface AutocompleteResult {
    keyword: string;
    source: 'autocomplete' | 'paa' | 'related';
    position: number;
}

/**
 * Fetch real Google autocomplete suggestions for a keyword
 */
export async function getGoogleSuggestions(
    query: string,
    geo = 'IN',
    lang = 'en'
): Promise<AutocompleteResult[]> {
    const results: AutocompleteResult[] = [];

    try {
        // Google Suggest API — completely free, no key needed
        const url = `https://suggestqueries.google.com/complete/search?q=${encodeURIComponent(query)}&client=firefox&hl=${lang}-${geo}&gl=${geo}&output=json`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error(`Google Suggest API returned ${response.status}`);
        }

        const text = await response.text();
        
        // Response is JSONP-like: ["query", ["suggestion1", "suggestion2", ...]]
        const parsed = JSON.parse(text);
        const suggestions: string[] = parsed[1] || [];

        suggestions.forEach((suggestion, i) => {
            if (suggestion && suggestion !== query) {
                results.push({
                    keyword: suggestion,
                    source: 'autocomplete',
                    position: i + 1,
                });
            }
        });

        logger.info(`Google autocomplete: ${results.length} suggestions for "${query}"`);
    } catch (error) {
        logger.warn('Google autocomplete failed', { query, error: (error as Error).message });
    }

    // Also try alphabet variations (a-z suffix trick for more long-tail)
    if (results.length < 5) {
        const alphaSuggestions = await getAlphabetVariations(query);
        results.push(...alphaSuggestions);
    }

    return results;
}

/**
 * Get suggestions by appending a-z to the query
 * Classic "keyword alphabet soup" technique — finds long-tail keywords Google users actually type
 */
async function getAlphabetVariations(query: string): Promise<AutocompleteResult[]> {
    const results: AutocompleteResult[] = [];
    const letters = ['a', 'b', 'c', 'e', 'f', 'h', 'i', 'l', 'm', 'p', 'r', 's', 't', 'w'];

    // Only try a few letters to stay fast and avoid rate limits
    for (const letter of letters.slice(0, 5)) {
        try {
            const url = `https://suggestqueries.google.com/complete/search?q=${encodeURIComponent(`${query} ${letter}`)}&client=firefox&hl=en-IN&gl=IN&output=json`;
            
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                signal: AbortSignal.timeout(3000),
            });
            
            if (!response.ok) continue;
            
            const text = await response.text();
            const parsed = JSON.parse(text);
            const suggestions: string[] = parsed[1] || [];
            
            for (const suggestion of suggestions.slice(0, 2)) {
                if (suggestion && !results.find(r => r.keyword === suggestion)) {
                    results.push({ keyword: suggestion, source: 'autocomplete', position: results.length + 1 });
                }
            }

            // Small delay to be polite
            await new Promise(r => setTimeout(r, 200));
        } catch {
            // Continue with next letter
        }
    }

    return results;
}

/**
 * Get "People Also Ask" style questions using a search query
 * These are goldmines for long-tail, low-competition keywords
 */
export async function getPeopleAlsoAsk(topic: string): Promise<string[]> {
    // PAA via a structured query to get question formats
    const questionPrefixes = [
        `what is ${topic}`,
        `how to ${topic}`,
        `why ${topic}`,
        `when ${topic}`,
        `which ${topic}`,
        `best ${topic} for beginners`,
        `${topic} explained`,
        `${topic} in india`,
    ];

    const questions: string[] = [];
    
    // Get suggestions for each question prefix
    for (const prefix of questionPrefixes.slice(0, 4)) {
        try {
            const suggestions = await getGoogleSuggestions(prefix);
            const qSuggestions = suggestions
                .filter(s => s.keyword.length > prefix.length)
                .map(s => s.keyword);
            questions.push(...qSuggestions.slice(0, 2));
            
            await new Promise(r => setTimeout(r, 300)); // Rate limit between requests
        } catch {
            // Continue
        }
    }

    return [...new Set(questions)].slice(0, 10);
}

/**
 * Score an autocomplete suggestion for desirability
 * Lower KD keywords that appear in autocomplete = high opportunity
 */
export function scoreAutocompleteKeyword(keyword: string, originalQuery: string): {
    score: number;
    reason: string;
} {
    const words = keyword.split(' ');
    const isLongTail = words.length >= 4;
    const hasYear = /202[4-9]|203[0-9]/.test(keyword);
    const hasQuestion = /^(how|what|why|when|which|is|are|can|should)/i.test(keyword);
    const hasLocalIntent = /india|delhi|mumbai|bangalore|₹|inr|rupee/i.test(keyword);
    const hasComparison = /vs|versus|compare|difference/i.test(keyword);
    const hasCommercialIntent = /best|top|review|rating|cheap|affordable/i.test(keyword);

    let score = 50; // Base score
    const reasons: string[] = [];

    if (isLongTail) { score += 20; reasons.push('long-tail (low KD)'); }
    if (hasYear) { score += 10; reasons.push('time-sensitive (fresh content)'); }
    if (hasQuestion) { score += 15; reasons.push('question format (featured snippet)'); }
    if (hasLocalIntent) { score += 10; reasons.push('India-specific (less competition)'); }
    if (hasComparison) { score += 5; reasons.push('comparison intent'); }
    if (hasCommercialIntent) { score -= 10; reasons.push('commercial (high KD)'); }

    return {
        score: Math.min(100, Math.max(0, score)),
        reason: reasons.join(', ') || 'standard keyword',
    };
}
