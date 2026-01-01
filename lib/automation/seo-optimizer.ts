import { GoogleGenAI } from "@google/genai";

/**
 * 🚀 SEO OPTIMIZER AGENT
 * 
 * Responsibilities:
 * 1. Read Article Content.
 * 2. Generate High-CTR SEO Title (under 60 chars).
 * 3. Generate Compelling Meta Description (under 160 chars).
 * 4. Extract Primary & Secondary Keywords.
 * 5. Determine Search Intent.
 */

export interface SEOOptimizationResult {
    seo_title: string;
    meta_description: string;
    primary_keyword: string;
    secondary_keywords: string[];
    search_intent: 'informational' | 'commercial' | 'transactional';
}

export async function optimizeArticleSEO(title: string, content: string): Promise<SEOOptimizationResult> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenAI({ apiKey });
    
    // Truncate content for analysis to save tokens (first ~3000 chars is usually enough for SEO context)
    const context = content.substring(0, 3000);

    const prompt = `
    ROLE: You are an Expert SEO Strategist for the Indian Market.
    TASK: Optimize the metadata for the following article targeting Indian users.

    ARTICLE TITLE: "${title}"
    CONTENT EXCERPT:
    "${context}..."

    REQUIREMENTS:
    1. **SEO Title**: Catchy, High CTR, includes main keyword, under 60 chars. Use "India 2026" if relevant.
    2. **Meta Description**: Compelling summary that drives clicks, includes keyword, under 160 chars.
    3. **Primary Keyword**: The single most valuable search term in India (e.g. "Best SIP Plans").
    4. **Secondary Keywords**: 3-5 LSI/Related keywords relevant to Indian context.
    5. **Search Intent**: classify as 'informational', 'commercial', or 'transactional'.

    RETURN JSON ONLY:
    {
        "seo_title": "...",
        "meta_description": "...",
        "primary_keyword": "...",
        "secondary_keywords": ["..."],
        "search_intent": "..."
    }
    `;

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("SEO Optimization Failed", error);
        // Fallback
        return {
            seo_title: title.substring(0, 60),
            meta_description: content.substring(0, 150),
            primary_keyword: "finance",
            secondary_keywords: [],
            search_intent: "informational"
        };
    }
}
