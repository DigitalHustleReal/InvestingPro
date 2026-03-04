import { GoogleGenAI } from "@google/genai";
import { logger } from '@/lib/logger';
import slugify from 'slugify';

/**
 * 🗣️ POLYGLOT AGENT (Indian Language Specialist)
 * 
 * Responsibilities:
 * 1. Translate Article Content (HTML) to Target Language.
 * 2. Preserve formatting (tables, bold, headers).
 * 3. Localize numerals if needed (optional).
 * 4. Generate SEO Title in Target Language.
 */

export interface TranslationResult {
    translated_title: string;
    translated_content: string; // HTML
    translated_excerpt: string;
    language_code: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
    'hi': 'Hindi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'mr': 'Marathi',
    'bn': 'Bengali',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam'
};

export async function translateArticle(
    title: string, 
    contentHtml: string, 
    targetLangCode: string
): Promise<TranslationResult> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenAI({ apiKey });
    const targetLang = LANGUAGE_NAMES[targetLangCode] || targetLangCode;

    // HYBRID MODE: "Mix regional language with English"
    const prompt = `
    ROLE: You are an Expert Financial Translator for the Indian Market.
    TASK: Translate the following Article from English to **${targetLang}**.

    GUIDELINES:
    1. **HYBRID STYLE (CRITICAL)**: Use a "Spoken Style" (e.g. Hinglish/Tanglish). 
       - **KEEP TECHNICAL TERMS IN ENGLISH** (e.g. SIP, Mutual Fund, Equity, ROI, Portfolio).
       - Translate the explanation/grammar to ${targetLang}.
       - *Example (Hindi)*: "Mutual Funds mein SIP karna long-term wealth ke liye zaroori hai."
    2. **Preserve HTML Structure**: Keep all <h1>, <p>, <table>, <div> tags exactly as is. Only translate the text inside.
    3. **Tone**: Authoritative, Professional, yet Easy to Read.
    4. **Translate Title**: Provide a catchy title in ${targetLang} (or Hybrid if common).
    5. **Translate Excerpt**: Provide a short summary in ${targetLang}.

    INPUT TITLE: "${title}"
    INPUT CONTENT HTML:
    ${contentHtml}

    RETURN JSON ONLY:
    {
        "translated_title": "...",
        "translated_content": "...",
        "translated_excerpt": "..."
    }
    `;

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const text = response.text || "{}";
        const json = JSON.parse(text);

        return {
            translated_title: json.translated_title,
            translated_content: json.translated_content,
            translated_excerpt: json.translated_excerpt,
            language_code: targetLangCode
        };

    } catch (error) {
        logger.error("Translation Failed", error);
        throw new Error(`Failed to translate to ${targetLang}`);
    }
}
