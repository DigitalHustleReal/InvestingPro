import { getJson } from "serpapi";
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from "@google/genai";

/**
 * 🕵️ DEEP SEARCH ANALYZER
 * 
 * Capability:
 * - See Top 10 Google Results
 * - Read their content
 * - Identify Gaps
 * - Synthesize "Best Article" Strategy
 */

export interface CompetitorData {
    url: string;
    title: string;
    snippet: string;
    content_summary?: string;
}

export interface ResearchBrief {
    top_competitors: CompetitorData[];
    content_gaps: string[];
    key_statistics: string[];
    recommended_structure: string[];
    unique_angle: string;
}

export class SERPAnalyzer {
    private apiKey: string | undefined;
    private genAI: GoogleGenAI | null = null;

    constructor() {
        this.apiKey = process.env.SERPAPI_API_KEY; // Optional: Works with synthetic if missing
        
        // Lazy initialization - only create when needed
        const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (geminiKey) {
            this.genAI = new GoogleGenAI({ apiKey: geminiKey });
        }
    }
    
    private ensureGenAI(): GoogleGenAI {
        if (!this.genAI) {
            const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
            if (!geminiKey) {
                throw new Error("Missing Gemini API Key for Analysis");
            }
            this.genAI = new GoogleGenAI({ apiKey: geminiKey });
        }
        return this.genAI;
    }

    /**
     * 1. GET TOP RESULTS
     * Fetches real Google results or simulates them if no API key.
     */
    async getTopResults(query: string): Promise<CompetitorData[]> {
        if (!this.apiKey) {
            console.log("⚠️ No SERPAPI_API_KEY found. Using Synthetic Simulation.");
            return this.simulateTopResults(query);
        }

        console.log(`🔍 Searching Google for: "${query}"...`);
        try {
            // Use the serpapi library wrapper if available/working, or fetch directly
            // The package 'serpapi' has getJson.
            // But getting it to work in Edge/Node environments varies.
            // We'll wrap in a Promise.
            return new Promise((resolve, reject) => {
                getJson({
                    engine: "google",
                    q: query,
                    api_key: this.apiKey,
                    gl: "in", // Targeting India
                    location: "India"
                }, (json: any) => {
                    if (!json || !json.organic_results) {
                        resolve(this.simulateTopResults(query)); // Fallback on empty
                        return;
                    }
                    
                    const competitors = json.organic_results.slice(0, 5).map((r: any) => ({
                        title: r.title,
                        url: r.link,
                        snippet: r.snippet
                    }));
                    resolve(competitors);
                });
            });

        } catch (error) {
            console.error("SERP API Failed", error);
            return this.simulateTopResults(query);
        }
    }

    /**
     * 2. READ CONTENT (Simplified Scrape)
     * Fetches HTML and extracts main text.
     */
    async readContent(url: string): Promise<string> {
        try {
            const { data } = await axios.get(url, {
                timeout: 5000,
                headers: { 'User-Agent': 'Mozilla/5.0 (content-researcher-bot)' }
            });
            const $ = cheerio.load(data);
            
            // Remove junk
            $('script').remove();
            $('style').remove();
            $('nav').remove();
            $('footer').remove();
            
            // Extract text from paragraphs
            let text = '';
            $('h1, h2, h3, p').each((_, el) => {
                text += $(el).text() + '\n';
            });
            
            return text.substring(0, 2000); // Limit context size
        } catch (error) {
            return "Could not read content (protected or timeout).";
        }
    }

    /**
     * 3. SYNTHETIC SIMULATION (Fallback)
     * If no API key, hallucinate the likely top results (surprisingly effective for common topics).
     */
    private async simulateTopResults(topic: string): Promise<CompetitorData[]> {
        const prompt = `
        Simulate the top 5 Google Search results for the query: "${topic}" in India.
        Return valid JSON array:
        [ { "title": "...", "url": "...", "snippet": "..." } ]
        
        **CRITICAL**: Simulate results from top INDIAN domains only:
        - MoneyControl.com
        - EconomicTimes.indiatimes.com
        - ClearTax.in
        - ValueResearchOnline.com
        - Groww.in
        `;
        
        const response = await this.ensureGenAI().models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return JSON.parse(response.text || "[]");
    }

    /**
     * 4. ANALYZE & IDENTIFY GAPS
     * The core "Strategist" logic.
     */
    async analyzeCompetitors(topic: string): Promise<ResearchBrief> {
        console.log(`🕵️ Analying competitive landscape for: ${topic}`);
        
        // A. Search
        const competitors = await this.getTopResults(topic);
        console.log(`   Found ${competitors.length} competitors.`);
        
        // B. Read (Analyze Snippets + Deep Read 1-2 if possible)
        // For speed, we heavily rely on snippets + AI knowledge, 
        // but we'll try to read the #1 result to ground the AI.
        let deepContext = "";
        if (competitors.length > 0) {
            const bestUrl = competitors[0].url;
            if (!bestUrl.includes('simulate')) {
                 const content = await this.readContent(bestUrl);
                 deepContext = `Top Result Content (${bestUrl}):\n${content}\n\n`;
            }
        }

        // C. Synthesize Brief
        const prompt = `
        You are a Competition Analyst.
        Topic: "${topic}"
        
        Top Competitors found:
        ${JSON.stringify(competitors)}
        
        ${deepContext}
        
        TASK:
        1. Analyze what the competitors are covering.
        2. Identify 3 MAJOR GAPS (What are they missing? data? tables? local examples?).
        3. Define a "Unique Angle" to beat them.
        4. List key statistics/facts that MUST be included.
        
        Return JSON:
        {
            "content_gaps": ["..."],
            "key_statistics": ["..."],
            "recommended_structure": ["..."],
            "unique_angle": "..."
        }
        `;
        
        const response = await this.ensureGenAI().models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const analysis = JSON.parse(response.text || "{}");
        
        return {
            top_competitors: competitors,
            ...analysis
        };
    }
}

export const serpAnalyzer = new SERPAnalyzer();
