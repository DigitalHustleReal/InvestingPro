import googleTrends from 'google-trends-api';

/**
 * TRENDING TOPICS FINDER
 * 
 * Finds trending financial topics in India using Google Trends
 * Perfect for data-driven content strategy
 * 
 * Usage: npx tsx scripts/find-trending-topics.ts
 */

async function findTrendingTopics() {
    console.log('🔍 TRENDING TOPICS FINDER\n');
    console.log('Finding trending financial topics in India...\n');
    console.log('─'.repeat(60));

    try {
        // Get daily trending searches in India
        console.log('\n📈 Fetching Google Trends data...');
        
        const dailyTrends = await googleTrends.dailyTrends({
            geo: 'IN',
            hl: 'en-IN'
        });

        const trendsData = JSON.parse(dailyTrends);
        const trendingSearches = trendsData.default.trendingSearchesDays[0].trendingSearches;

        // Filter for finance-related topics
        const financeKeywords = [
            'stock', 'share', 'mutual fund', 'investment', 'trading',
            'nse', 'bse', 'sensex', 'nifty', 'ipo', 'sip', 'tax',
            'savings', 'insurance', 'loan', 'credit', 'demat',
            'portfolio', 'dividend', 'equity', 'debt', 'gold',
            'crypto', 'bitcoin', 'rupee', 'dollar', 'bank'
        ];

        const financeTrends = trendingSearches.filter((trend: any) => {
            const query = trend.title.query.toLowerCase();
            return financeKeywords.some(keyword => query.includes(keyword));
        });

        console.log(`✅ Found ${financeTrends.length} finance-related trending topics\n`);

        // Display trending topics
        console.log('═'.repeat(60));
        console.log('📊 TRENDING FINANCIAL TOPICS IN INDIA');
        console.log('═'.repeat(60));
        console.log('');

        financeTrends.slice(0, 10).forEach((trend: any, index: number) => {
            const traffic = trend.formattedTraffic || 'N/A';
            console.log(`${index + 1}. ${trend.title.query}`);
            console.log(`   Traffic: ${traffic}`);
            
            if (trend.articles && trend.articles.length > 0) {
                console.log(`   Source: ${trend.articles[0].source}`);
            }
            console.log('');
        });

        // Get related queries for a specific topic
        console.log('─'.repeat(60));
        console.log('🔗 RELATED QUERIES FOR "MUTUAL FUNDS"');
        console.log('─'.repeat(60));
        console.log('');

        const relatedQueries = await googleTrends.relatedQueries({
            keyword: 'mutual funds',
            geo: 'IN',
            hl: 'en-IN'
        });

        const relatedData = JSON.parse(relatedQueries);
        const topQueries = relatedData.default.rankedList[0]?.rankedKeyword || [];

        topQueries.slice(0, 10).forEach((query: any, index: number) => {
            console.log(`${index + 1}. ${query.query} (${query.value}% interest)`);
        });

        // Get interest over time
        console.log('\n' + '─'.repeat(60));
        console.log('📈 INTEREST OVER TIME - TOP KEYWORDS');
        console.log('─'.repeat(60));
        console.log('');

        const keywords = ['mutual funds', 'sip investment', 'tax saving'];
        
        for (const keyword of keywords) {
            const interestData = await googleTrends.interestOverTime({
                keyword: keyword,
                geo: 'IN',
                startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            });

            const interest = JSON.parse(interestData);
            const avgInterest = interest.default.timelineData.reduce((sum: number, item: any) => {
                return sum + (item.value[0] || 0);
            }, 0) / interest.default.timelineData.length;

            console.log(`${keyword}: ${Math.round(avgInterest)}/100 average interest`);
        }

        // Generate article topics
        console.log('\n' + '═'.repeat(60));
        console.log('💡 RECOMMENDED ARTICLE TOPICS');
        console.log('═'.repeat(60));
        console.log('');

        const articleTopics = [
            ...financeTrends.slice(0, 5).map((t: any) => ({
                title: `Complete Guide to ${t.title.query}`,
                traffic: t.formattedTraffic,
                priority: 'HIGH'
            })),
            ...topQueries.slice(0, 5).map((q: any) => ({
                title: `Everything You Need to Know About ${q.query}`,
                traffic: `${q.value}% interest`,
                priority: 'MEDIUM'
            }))
        ];

        articleTopics.forEach((topic, index) => {
            console.log(`${index + 1}. ${topic.title}`);
            console.log(`   Traffic: ${topic.traffic}`);
            console.log(`   Priority: ${topic.priority}`);
            console.log('');
        });

        // Save to file
        const fs = require('fs');
        const outputPath = './trending-topics-' + Date.now() + '.json';
        fs.writeFileSync(outputPath, JSON.stringify({
            generatedAt: new Date().toISOString(),
            financeTrends: financeTrends.slice(0, 10),
            relatedQueries: topQueries.slice(0, 10),
            recommendedTopics: articleTopics
        }, null, 2));

        console.log('─'.repeat(60));
        console.log(`💾 Data saved to: ${outputPath}`);
        console.log('─'.repeat(60));

        console.log('\n🎯 NEXT STEPS:');
        console.log('   1. Review recommended topics');
        console.log('   2. Generate articles for high-priority topics:');
        console.log('      npx tsx scripts/complete-auto-publish.ts "Topic Title"');
        console.log('   3. Track performance and iterate');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   - Google Trends may have rate limits');
        console.log('   - Try again in a few minutes');
        console.log('   - Check your internet connection');
    }
}

// Run
findTrendingTopics().catch(console.error);
