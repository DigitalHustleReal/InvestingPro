import { GoogleGenAI } from "@google/genai";

/**
 * ✍️ COPY EDITOR AGENT (The "Grammarly Killer")
 * 
 * Responsibilities:
 * 1. Fix Grammar & Spelling.
 * 2. Improve Flow & Readability.
 * 3. Maintain the "Authority" Tone.
 * 4. Return clean Markdown.
 */

export async function proofreadContent(markdown: string): Promise<string> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenAI({ apiKey });

    const prompt = `
    ROLE: You are a Senior Copy Editor at a top Indian Financial Publication (like Mint or Economic Times).
    TASK: Proofread and Polish the following article content.

    GUIDELINES:
    1. Fix ALL grammar, spelling, and punctuation errors.
    2. **STRICTLY USE INDIAN ENGLISH** (British Spelling: 'colour', 'centre', 'programme', 'labour').
    3. Improve sentence flow (make it punchy and professional).
    4. **DO NOT** change the core meaning or structure (keep headings, tables, HTML tags).
    5. Ensure the tone is "Authoritative yet Accessible" for an Indian audience.
    6. Return ONLY the polished Markdown.

    CONTENT:
    ${markdown}
    `;

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
        });

        return response.text || markdown;
    } catch (error) {
        console.error("Proofreading Failed", error);
        return markdown; // Safety net: return original
    }
}
