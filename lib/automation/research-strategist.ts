import { GoogleGenAI } from "@google/genai";
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';

/**
 * 🕵️ RESEARCH STRATEGIST AGENT
 * 
 * Responsibilities:
 * 1. Analyze a broad topic (e.g. "Mutual Funds").
 * 2. Generate a Content Plan (5-10 Article Ideas) based on "High Traffic" potential.
 * 3. Schedule them on the Calendar.
 */

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper: AI Provider (Simplified for Strategy)
async function generateStrategy(topic: string): Promise<any[]> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenAI({ apiKey });
    
    const prompt = `
    You are a Content Strategist for a major Indian Financial Publication (InvestingPro India).
    Plan 5 high-impact article ideas for the topic: "${topic}".
    
    Consider Indian Market Context (SEBI rules, Tax Season, Festivals, Market Sentiment).

    For each article, provide:
    1. Title (Click-worthy, SEO optimized for India)
    2. Primary Keyword (High volume in India)
    3. Target Audience (e.g. "Salaried Employees", "Retired Indians", "SIP Investors")
    4. Estimated Search Intent (Informational, Commercial)

    Return valid JSON array:
    [
        {
            "title": "...",
            "primary_keyword": "...",
            "target_audience": "...",
            "search_intent": "..."
        }
    ]
    `;

    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-exp", // Use fast model
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    const text = response.text || "[]";
    try {
        return JSON.parse(text);
    } catch (e) {
        logger.error("Failed to parse strategy JSON", e);
        return [];
    }
}

/**
 * Main Function: Plan and Populate Calendar
 */
export async function planContentCalendar(topic: string, daysToSpread: number = 30) {
    logger.info(`🕵️ Strategist: Planning content for '${topic}'...`);
    
    // 1. Get Ideas
    const ideas = await generateStrategy(topic);
    
    if (!ideas || ideas.length === 0) {
        throw new Error("Strategist failed to generate ideas.");
    }
    
    logger.info(`   ✅ Generated ${ideas.length} ideas.`);

    // 2. Schedule them
    const results = [];
    const today = new Date();

    for (let i = 0; i < ideas.length; i++) {
        const idea = ideas[i];
        
        // Spread dates: Every 3 days, for example, or evenly distributed
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + (i * Math.ceil(daysToSpread / ideas.length)));
        
        const slug = slugify(idea.title, { lower: true, strict: true });
        
        // Insert as 'draft' or 'scheduled'
        // 'scheduled' status is better if we have it, else 'draft' with a date.
        // We added 'scheduled' to types, so let's use it.
        
        const { data, error } = await supabase
            .from('articles')
            .insert({
                title: idea.title,
                slug: slug,
                status: 'draft', // Start as Draft (to be written)
                // We could use 'scheduled' if the Writer Agent was auto-triggered.
                // For now, Draft is safer for "Human Gate".
                
                category: 'investing-basics', // Default, needs classifier
                editorial_notes: {
                    strategy_origin: 'AI Strategist',
                    target_audience: idea.target_audience,
                    search_intent: idea.search_intent
                },
                primary_keyword: idea.primary_keyword,
                published_date: scheduleDate.toISOString().split('T')[0], // The "Plan" date
                
                ai_generated: true,
                author_name: 'AI Strategist'
            })
            .select()
            .single();

        if (error) {
            logger.error(`   ❌ Failed to schedule: ${idea.title}`, error);
        } else {
            logger.info(`   📅 Scheduled: ${idea.title} for ${scheduleDate.toDateString()}`);
            results.push(data);
        }
    }

    return results;
}
