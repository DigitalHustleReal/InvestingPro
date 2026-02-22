/**
 * JSON Extraction Utilities
 * 
 * Provides robust methods to extract and parse JSON from strings that might contain
 * markdown code blocks, conversational text, or other "fluff".
 */

import { logger } from '@/lib/logger';

/**
 * Extracts and parses the first JSON object or array found in a string.
 * Handles markdown code blocks, leading/trailing text, and basic malformed JSON.
 * 
 * @param content The string potentially containing JSON
 * @returns The parsed JSON object or null if none found
 */
export function extractJSON<T = any>(content: string): T | null {
    if (!content) return null;

    try {
        // 1. Clean markdown fences
        let cleaned = content.trim();
        cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();

        // 2. Try direct parse first (fast path)
        try {
            return JSON.parse(cleaned) as T;
        } catch (e) {
            // Keep going if direct parse fails
        }

        // 3. Regex-based extraction (Slow path)
        // Find the first '{' or '[' and matching closing character
        const startChars = ['{', '['];
        const endChars = ['}', ']'];
        
        let firstIndex = -1;
        let charType = -1;

        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            const typeIndex = startChars.indexOf(char);
            if (typeIndex !== -1) {
                firstIndex = i;
                charType = typeIndex;
                break;
            }
        }

        if (firstIndex === -1) return null;

        const targetEndChar = endChars[charType];
        const lastIndex = content.lastIndexOf(targetEndChar);

        if (lastIndex === -1 || lastIndex < firstIndex) return null;

        const jsonCandidate = content.substring(firstIndex, lastIndex + 1);

        try {
            return JSON.parse(jsonCandidate) as T;
        } catch (e) {
            logger.debug('Failed to parse regex-extracted JSON', { 
                error: (e as Error).message,
                snippet: jsonCandidate.substring(0, 100) + '...'
            });
            
            // 4. Fallback: Brute force cleanup
            // Try to fix common AI mistakes like trailing commas
            const fixedJson = jsonCandidate
                .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
                .replace(/\/\/.*$/gm, '')       // Remove single line comments
                .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
            
            try {
                return JSON.parse(fixedJson) as T;
            } catch (fallbackError) {
                return null;
            }
        }
    } catch (error) {
        logger.error('Error in extractJSON utility', error as Error);
        return null;
    }
}
