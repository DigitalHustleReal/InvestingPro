
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { keywordResearchService } from '../lib/keyword-research/KeywordResearchService';
import { generateArticleCore } from '../lib/automation/article-generator';
import { smartFilterTopics } from '../lib/automation/topic-filter';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// CONFIG
const DEFAULT_TOPIC = "Mutual Funds";
const BATCH_SIZE = 5;

// AUTHORS
const AUTHORS = {
    VIKRAM: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Expert
    RIYA: '9bf4e75a-6943-4cc2-9856-1558bf0ef121'   // Guide
};

async function autoGrow() {
    console.log('🤖 AUTONOMOUS CONTENT AGENT STARTING...');
    
    // 1. RESEARCH PHASE
    const rootTopic = process.argv[2] || DEFAULT_TOPIC;
    console.log(`\n🔍 Researching opportunities for: "${rootTopic}"...`);
    
    // Get long-tail variations
    const keywords = await keywordResearchService.generateLongTailKeywords(rootTopic, 20);
    const candidateTopics = keywords.map(k => k.keyword_text);
    
    console.log(`✅ Discovered ${candidateTopics.length} potential topics.`);
    
    // 2. PLANNING PHASE
    console.log('\n🧠 Planning content strategy...');
    const filterResult = await smartFilterTopics(candidateTopics, 'mutual-funds', BATCH_SIZE);
    const approvedTopics = filterResult.unique_topics;
    
    console.log(`✨ Approved ${approvedTopics.length} topics for production.`);
    console.log(`🗑️  Discarded ${filterResult.total_filtered} duplicates/low-value.`);
    
    if (approvedTopics.length === 0) {
        console.log('😴 No new topics to generate. Agent sleeping.');
        return;
    }
    
    // 3. EXECUTION PHASE
    console.log('\n🚀 STARTING PRODUCTION RUN');
    
    for (let i = 0; i < approvedTopics.length; i++) {
        const topic = approvedTopics[i];
        console.log(`\n[${i+1}/${approvedTopics.length}] Generating: "${topic}"`);
        
        try {
            // Assign Author
            const isAdvanced = topic.toLowerCase().includes('tax') || topic.toLowerCase().includes('advanced');
            const authorId = isAdvanced ? AUTHORS.VIKRAM : AUTHORS.RIYA;
            
            // Generate
            const result = await generateArticleCore(topic, (msg) => console.log(`   ${msg}`), { authorId });
            
            if (result.success) {
                console.log(`✅ PUBLISHED: ${result.url}`);
            } else {
                console.log(`❌ FAILED: ${result.error}`);
            }
            
            // Rate Limit
            if (i < approvedTopics.length - 1) {
                console.log('   zzz... resting for 20s...');
                await new Promise(r => setTimeout(r, 20000));
            }
            
        } catch (err: any) {
            console.error(`💥 Error: ${err.message}`);
        }
    }
    
    console.log('\n🤖 MISSION COMPLETE.');
}

autoGrow();
