/**
 * 🎯 SMART TOPIC FILTER
 * 
 * Uses duplicate-detector logic to intelligently filter topics
 * before generation to prevent duplicates and wasted API calls.
 * 
 * Features:
 * - Checks existing articles in database
 * - Uses keyword overlap detection
 * - Uses title similarity matching
 * - Filters out topics that are too similar to existing content
 */

import { createClient } from '@supabase/supabase-js';
import { checkForDuplicates } from '../quality/duplicate-detector';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Lazy initialization to ensure env vars are loaded
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
    if (!supabaseInstance) {
        if (!supabaseUrl || !supabaseKey) {
            // Check process.env again in case it was loaded late
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
            
            if (url && key) {
                supabaseInstance = createClient(url, key);
                return supabaseInstance;
            }
            
            throw new Error('Supabase credentials missing. Ensure .env.local is loaded and variables are set.');
        }
        supabaseInstance = createClient(supabaseUrl, supabaseKey);
    }
    return supabaseInstance;
}

export interface TopicFilterResult {
    unique_topics: string[];
    filtered_topics: string[];
    filter_reasons: { [topic: string]: string };
    total_checked: number;
    total_unique: number;
    total_filtered: number;
}

/**
 * Filter topics using duplicate detection logic
 * 
 * @param topics - List of topic titles to check
 * @param category - Category to check within (default: 'mutual-funds')
 * @param maxTopics - Maximum unique topics to return
 * @returns Filtered list of unique topics
 */
export async function filterUniqueTopics(
    topics: string[],
    category: string = 'mutual-funds',
    maxTopics?: number
): Promise<TopicFilterResult> {
    const uniqueTopics: string[] = [];
    const filteredTopics: string[] = [];
    const filterReasons: { [topic: string]: string } = {};
    
    console.log(`🔍 Filtering ${topics.length} topics for uniqueness...`);
    console.log(`   Category: ${category}`);
    console.log(`   Max to return: ${maxTopics || 'unlimited'}\n`);
    
    for (const topic of topics) {
        // Stop if we've reached max
        if (maxTopics && uniqueTopics.length >= maxTopics) {
            filteredTopics.push(topic);
            filterReasons[topic] = 'Max topics reached';
            continue;
        }
        
        try {
            // Extract keywords from topic
            const keywords = topic
                .toLowerCase()
                .split(/\s+/)
                .filter(w => w.length > 3 && !['guide', 'complete', 'ultimate', '2026'].includes(w));
            
            // Check for duplicates
            const dupCheck = await checkForDuplicates(topic, keywords, category);
            
            if (dupCheck.recommendation === 'BLOCK') {
                filteredTopics.push(topic);
                filterReasons[topic] = dupCheck.reason;
                console.log(`   ❌ Filtered: "${topic}"`);
                console.log(`      Reason: ${dupCheck.reason}`);
                if (dupCheck.similar_articles.length > 0) {
                    console.log(`      Similar to: "${dupCheck.similar_articles[0].title}"`);
                }
            } else if (dupCheck.recommendation === 'WARN') {
                // Include with warning
                uniqueTopics.push(topic);
                console.log(`   ⚠️  Included with warning: "${topic}"`);
                console.log(`      ${dupCheck.reason}`);
            } else {
                uniqueTopics.push(topic);
                console.log(`   ✅ Unique: "${topic}"`);
            }
            
        } catch (error: any) {
            // If duplicate check fails, be conservative and include
            console.log(`   ⚠️  Check failed for "${topic}" - including anyway`);
            console.log(`      Error: ${error.message}`);
            uniqueTopics.push(topic);
        }
    }
    
    console.log(`\n📊 Filter Results:`);
    console.log(`   Total checked: ${topics.length}`);
    console.log(`   Unique topics: ${uniqueTopics.length}`);
    console.log(`   Filtered out: ${filteredTopics.length}`);
    
    return {
        unique_topics: uniqueTopics,
        filtered_topics: filteredTopics,
        filter_reasons: filterReasons,
        total_checked: topics.length,
        total_unique: uniqueTopics.length,
        total_filtered: filteredTopics.length
    };
}

/**
 * Filter topics by exact title match (existing logic)
 */
export async function filterByExactTitle(
    topics: string[]
): Promise<{ unique: string[]; existing: string[] }> {
    const supabase = getSupabase();
    const { data: existingArticles } = await supabase
        .from('articles')
        .select('title');
    
    const existingTitles = new Set(existingArticles?.map((a: { title: string }) => a.title) || []);
    
    const unique = topics.filter((t: string) => !existingTitles.has(t));
    const existing = topics.filter((t: string) => existingTitles.has(t));
    
    return { unique, existing };
}

/**
 * Combined filter: exact title + duplicate detection
 * 
 * This is the most robust approach:
 * 1. First filter out exact title matches (fast)
 * 2. Then use duplicate-detector for remaining topics (thorough)
 */
export async function smartFilterTopics(
    topics: string[],
    category: string = 'mutual-funds',
    maxTopics?: number
): Promise<TopicFilterResult> {
    console.log('🧠 Smart Topic Filter - Two-Stage Process\n');
    
    // Stage 1: Filter exact title matches
    console.log('📋 Stage 1: Filtering exact title matches...');
    const { unique: afterExactFilter, existing } = await filterByExactTitle(topics);
    console.log(`   Removed ${existing.length} exact matches`);
    console.log(`   Remaining: ${afterExactFilter.length} topics\n`);
    
    // Stage 2: Duplicate detection on remaining topics
    console.log('🔍 Stage 2: Checking for semantic duplicates...');
    const result = await filterUniqueTopics(afterExactFilter, category, maxTopics);
    
    // Combine filter reasons
    const combinedReasons: { [topic: string]: string } = { ...result.filter_reasons };
    existing.forEach(topic => {
        combinedReasons[topic] = 'Exact title match in database';
    });
    
    return {
        unique_topics: result.unique_topics,
        filtered_topics: [...existing, ...result.filtered_topics],
        filter_reasons: combinedReasons,
        total_checked: topics.length,
        total_unique: result.unique_topics.length,
        total_filtered: existing.length + result.filtered_topics.length
    };
}

/**
 * Get filter statistics
 */
export function getFilterStats(result: TopicFilterResult): {
    pass_rate: number;
    filter_rate: number;
    top_filter_reasons: { reason: string; count: number }[];
} {
    const passRate = (result.total_unique / result.total_checked) * 100;
    const filterRate = (result.total_filtered / result.total_checked) * 100;
    
    // Count filter reasons
    const reasonCounts: { [key: string]: number } = {};
    Object.values(result.filter_reasons).forEach(reason => {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
    
    const topReasons = Object.entries(reasonCounts)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count);
    
    return {
        pass_rate: passRate,
        filter_rate: filterRate,
        top_filter_reasons: topReasons
    };
}
