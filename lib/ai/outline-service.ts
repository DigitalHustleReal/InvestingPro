

import { api } from '@/lib/api';


export interface OutlineSection {
    level: number; // 2 for H2, 3 for H3
    title: string;
    description?: string;
}

export async function generateOutline(topic: string, context?: string): Promise<OutlineSection[]> {
    try {
        const prompt = `
        ROLE: You are an expert financial editor creating a comprehensive article outline.
        TOPIC: "${topic}"
        ${context ? `CONTEXT: ${context}` : ''}

        TASK: Generate a detailed, SEO-optimized outline for a 2000+ word article on this topic.
        
        REQUIREMENTS:
        1. Structure: 8-10 H2 sections.
        2. Depth: Include H3 subsections for complex points.
        3. Flow: Use the AIDA model (Attention, Interest, Desire, Action).
        4. Indian Context: Include specific sections for Indian regulations (RBI/SEBI), taxation, or local examples if applicable.
        5. Format: Return ONLY a valid JSON array of objects.

        OUTPUT FORMAT (JSON ONLY):
        [
            { "level": 2, "title": "H2 Section Title", "description": "Brief note on what to cover" },
            { "level": 3, "title": "H3 Subsection", "description": "Specific detail" }
        ]
        `;

        const result = await api.integrations.Core.InvokeLLM({
            prompt: prompt,
            systemPrompt: "You are a JSON-only outline generator. Output STRICT VALID JSON. No markdown, no prose.",
            operation: 'generate_outline',
            contextData: { topic }
        });

        if (!result || !result.content) {
            throw new Error("AI failed to generate outline");
        }

        // Clean and parse JSON
        let cleanJson = result.content.trim();
        cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '');
        
        try {
            const outline = JSON.parse(cleanJson);
            if (Array.isArray(outline)) {
                return outline as OutlineSection[];
            }
            throw new Error("Invalid output format");
        } catch (e) {
            console.error("JSON Parse Error", e, result.content);
            throw new Error("Failed to parse AI response");
        }

    } catch (error) {
        console.error("Outline Generation Error:", error);
        // Fallback outline if AI fails
        return [
            { level: 2, "title": "Introduction", "description": "Hook the reader and explain the problem." },
            { level: 2, "title": "Understanding " + topic, "description": "Core concepts and definitions." },
            { level: 2, "title": "Key Benefits", "description": "Why this matters to the user." },
            { level: 2, "title": "How it Works", "description": "Step-by-step mechanisms." },
            { level: 2, "title": "Comparison Table", "description": "Compare top options." },
            { level: 2, "title": "Conclusion", "description": "Summary and final verdict." }
        ];
    }
}
