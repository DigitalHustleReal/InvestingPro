import { aiService } from '../lib/ai-service';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runTest() {
    console.log("🚦 STARTING GENERATION TEST...");

    // 1. GLOSSARY TERM
    console.log("\n--------------------------------");
    console.log("📘 TEST 1: Generating Glossary Term...");
    try {
        const term = "Compound Interest";
        const prompt = `You are a financial expert writing glossary definitions for an Indian financial platform.
Generate a comprehensive glossary entry for the term: "${term}"
Category: investing
Return JSON: { "term": "${term}", "definition": "...", "detailedExplanation": "...", "example": "...", "relatedTerms": [], "searchKeywords": [] }`;

        const data = await aiService.generateJSON(prompt);
        const slug = term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

        const { error } = await supabase.from('glossary_terms').insert({
            term: data.term,
            slug: slug,
            category: 'investing',
            definition: data.definition,
            detailed_explanation: data.detailedExplanation,
            example: data.example,
            related_terms: data.relatedTerms,
            search_keywords: data.searchKeywords,
            ai_generated: true,
            ai_model: 'test-runner',
            is_active: true
        });

        if (error) console.error("❌ Glossary Insert Failed:", error);
        else console.log("✅ Glossary Insert Success!");

    } catch (e: any) {
        console.error("❌ Glossary Gen Failed:", e.message);
    }

    // 2. ARTICLE
    console.log("\n--------------------------------");
    console.log("📄 TEST 2: Generating Standard Article...");
    try {
        const title = "Benefits of SIP in 2026";
        const prompt = `Write a short article structure for "${title}".
Return JSON: { "title": "${title}", "content": "Markdown content...", "excerpt": "..." }`;

        const data = await aiService.generateJSON(prompt);
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

        const { error } = await supabase.from('blog_posts').insert({
            title: data.title,
            slug: slug,
            content: data.content,
            excerpt: data.excerpt,
            meta_description: data.excerpt?.substring(0, 160) || data.title,
            category: 'investing',
            content_type: 'article',
            published: true,
            published_at: new Date().toISOString(),
            ai_generated: true,
            ai_model: 'test-runner'
        });

        if (error) console.error("❌ Article Insert Failed:", error);
        else console.log("✅ Article Insert Success!");

    } catch (e: any) {
        console.error("❌ Article Gen Failed:", e.message);
    }

    // 3. COMPARISON ARTICLE
    console.log("\n--------------------------------");
    console.log("⚖️ TEST 3: Generating Comparison Article...");
    try {
        const title = "FD vs Mutual Funds";
        const prompt = `Write a short comparison article structure for "${title}".
Return JSON: { "title": "${title}", "content": "Markdown content...", "excerpt": "..." }`;

        const data = await aiService.generateJSON(prompt);
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

        const { error } = await supabase.from('blog_posts').insert({
            title: data.title,
            slug: slug,
            content: data.content,
            excerpt: data.excerpt,
            meta_description: data.excerpt?.substring(0, 160) || data.title,
            category: 'investing',
            content_type: 'comparison',
            published: true,
            published_at: new Date().toISOString(),
            ai_generated: true,
            ai_model: 'test-runner'
        });

        if (error) console.error("❌ Comparison Insert Failed:", error);
        else console.log("✅ Comparison Insert Success!");

    } catch (e: any) {
        console.error("❌ Comparison Gen Failed:", e.message);
    }
}

runTest();
