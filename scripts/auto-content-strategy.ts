import googleTrends from 'google-trends-api';
import * as fs from 'fs';
import * as path from 'path';

/**
 * AUTO CONTENT STRATEGY GENERATOR
 * 
 * Automatically generates a content calendar based on:
 * - Google Trends data
 * - Search volume
 * - Seasonal patterns
 * - Related queries
 * 
 * Usage: npx tsx scripts/auto-content-strategy.ts
 */

interface TopicIdea {
    title: string;
    keyword: string;
    searchVolume: string;
    difficulty: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    seasonality: string;
}

async function generateContentStrategy() {
    console.log('🎯 AUTO CONTENT STRATEGY GENERATOR\n');
    console.log('Generating data-driven content calendar...\n');
    console.log('═'.repeat(60));

    try {
        const contentIdeas: TopicIdea[] = [];

        // 1. Get trending topics
        console.log('\n1️⃣ Analyzing Google Trends...');
        
        const dailyTrends = await googleTrends.dailyTrends({
            geo: 'IN',
            hl: 'en-IN'
        });

        const trendsData = JSON.parse(dailyTrends);
        const trendingSearches = trendsData.default.trendingSearchesDays[0].trendingSearches;

        // Filter finance topics
        const financeKeywords = [
            'stock', 'mutual fund', 'investment', 'sip', 'tax',
            'insurance', 'loan', 'credit', 'savings', 'ipo'
        ];

        const financeTrends = trendingSearches.filter((trend: any) => {
            const query = trend.title.query.toLowerCase();
            return financeKeywords.some(kw => query.includes(kw));
        });

        console.log(`   ✅ Found ${financeTrends.length} trending finance topics`);

        // 2. Get related queries for key topics
        console.log('\n2️⃣ Finding related queries...');
        
        const mainTopics = [
            'mutual funds',
            'sip investment',
            'tax saving',
            'stock market',
            'insurance plans'
        ];

        for (const topic of mainTopics) {
            try {
                const related = await googleTrends.relatedQueries({
                    keyword: topic,
                    geo: 'IN'
                });

                const relatedData = JSON.parse(related);
                const queries = relatedData.default.rankedList[0]?.rankedKeyword || [];

                queries.slice(0, 5).forEach((q: any) => {
                    contentIdeas.push({
                        title: generateTitle(q.query),
                        keyword: q.query,
                        searchVolume: `${q.value}%`,
                        difficulty: estimateDifficulty(q.query),
                        priority: q.value > 50 ? 'HIGH' : 'MEDIUM',
                        category: categorize(q.query),
                        seasonality: 'Year-round'
                    });
                });
            } catch (error) {
                console.log(`   ⚠️  Skipped ${topic} (rate limit)`);
            }

            // Wait to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`   ✅ Generated ${contentIdeas.length} content ideas`);

        // 3. Add seasonal topics
        console.log('\n3️⃣ Adding seasonal topics...');
        
        const seasonalTopics = [
            { keyword: 'tax saving mutual funds', season: 'January-March', priority: 'HIGH' as const },
            { keyword: 'best elss funds', season: 'January-March', priority: 'HIGH' as const },
            { keyword: 'budget 2026 impact', season: 'February', priority: 'HIGH' as const },
            { keyword: 'diwali investment ideas', season: 'October-November', priority: 'MEDIUM' as const },
            { keyword: 'new year investment planning', season: 'December-January', priority: 'MEDIUM' as const },
        ];

        seasonalTopics.forEach(topic => {
            contentIdeas.push({
                title: generateTitle(topic.keyword),
                keyword: topic.keyword,
                searchVolume: 'Seasonal',
                difficulty: 'Medium',
                priority: topic.priority,
                category: categorize(topic.keyword),
                seasonality: topic.season
            });
        });

        console.log(`   ✅ Added ${seasonalTopics.length} seasonal topics`);

        // 4. Prioritize and organize
        console.log('\n4️⃣ Prioritizing content...');
        
        const prioritized = contentIdeas.sort((a, b) => {
            const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        console.log(`   ✅ Organized ${prioritized.length} topics by priority`);

        // 5. Generate content calendar
        console.log('\n5️⃣ Creating content calendar...');
        
        const calendar = generateCalendar(prioritized);
        
        console.log(`   ✅ Generated 30-day content calendar`);

        // Display results
        console.log('\n' + '═'.repeat(60));
        console.log('📊 CONTENT STRATEGY SUMMARY');
        console.log('═'.repeat(60));
        console.log('');

        console.log('📈 By Priority:');
        console.log(`   HIGH: ${prioritized.filter(t => t.priority === 'HIGH').length} topics`);
        console.log(`   MEDIUM: ${prioritized.filter(t => t.priority === 'MEDIUM').length} topics`);
        console.log(`   LOW: ${prioritized.filter(t => t.priority === 'LOW').length} topics`);
        console.log('');

        console.log('📁 By Category:');
        const categories = [...new Set(prioritized.map(t => t.category))];
        categories.forEach(cat => {
            const count = prioritized.filter(t => t.category === cat).length;
            console.log(`   ${cat}: ${count} topics`);
        });

        console.log('\n' + '─'.repeat(60));
        console.log('🎯 TOP 10 RECOMMENDED TOPICS');
        console.log('─'.repeat(60));
        console.log('');

        prioritized.slice(0, 10).forEach((topic, index) => {
            console.log(`${index + 1}. ${topic.title}`);
            console.log(`   Keyword: ${topic.keyword}`);
            console.log(`   Priority: ${topic.priority} | Category: ${topic.category}`);
            console.log(`   Difficulty: ${topic.difficulty} | Volume: ${topic.searchVolume}`);
            console.log('');
        });

        // Save to files
        const timestamp = Date.now();
        
        // Save full strategy
        const strategyPath = `./content-strategy-${timestamp}.json`;
        fs.writeFileSync(strategyPath, JSON.stringify({
            generatedAt: new Date().toISOString(),
            totalTopics: prioritized.length,
            topicsByPriority: {
                high: prioritized.filter(t => t.priority === 'HIGH').length,
                medium: prioritized.filter(t => t.priority === 'MEDIUM').length,
                low: prioritized.filter(t => t.priority === 'LOW').length
            },
            topics: prioritized,
            calendar: calendar
        }, null, 2));

        // Save simple topic list
        const topicsPath = `./topics-to-generate.txt`;
        const topicsList = prioritized.map(t => t.title).join('\n');
        fs.writeFileSync(topicsPath, topicsList);

        console.log('─'.repeat(60));
        console.log('💾 Files saved:');
        console.log(`   Strategy: ${strategyPath}`);
        console.log(`   Topics list: ${topicsPath}`);
        console.log('─'.repeat(60));

        console.log('\n🚀 NEXT STEPS:');
        console.log('   1. Review the content strategy');
        console.log('   2. Start generating articles:');
        console.log('      npx tsx scripts/complete-auto-publish.ts "Topic from list"');
        console.log('   3. Or batch generate:');
        console.log('      while read topic; do');
        console.log('        npx tsx scripts/complete-auto-publish.ts "$topic"');
        console.log('      done < topics-to-generate.txt');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        console.log('\n💡 Try again in a few minutes (Google Trends rate limit)');
    }
}

// Helper functions
function generateTitle(keyword: string): string {
    const templates = [
        `Complete Guide to ${keyword}`,
        `${keyword}: Everything You Need to Know`,
        `Best ${keyword} in India 2026`,
        `How to Choose ${keyword}`,
        `${keyword} Explained: A Beginner's Guide`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)]
        .replace(/\b\w/g, l => l.toUpperCase());
}

function categorize(keyword: string): string {
    const kw = keyword.toLowerCase();
    
    if (kw.includes('mutual fund') || kw.includes('sip') || kw.includes('elss')) return 'mutual-funds';
    if (kw.includes('stock') || kw.includes('share') || kw.includes('equity')) return 'stocks';
    if (kw.includes('tax') || kw.includes('saving') || kw.includes('80c')) return 'tax';
    if (kw.includes('insurance') || kw.includes('policy')) return 'insurance';
    if (kw.includes('loan') || kw.includes('credit')) return 'loans';
    
    return 'investment';
}

function estimateDifficulty(keyword: string): string {
    const wordCount = keyword.split(' ').length;
    
    if (wordCount >= 4) return 'Low';
    if (wordCount === 3) return 'Medium';
    return 'High';
}

function generateCalendar(topics: TopicIdea[]) {
    const calendar = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        calendar.push({
            date: date.toISOString().split('T')[0],
            topic: topics[i % topics.length]
        });
    }
    
    return calendar;
}

// Run
generateContentStrategy().catch(console.error);
