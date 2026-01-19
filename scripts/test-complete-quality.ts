/**
 * Test Complete Quality System
 * Tests all 5 quality features together
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { scoreArticleQuality } from '../lib/content/quality-scorer';
import { calculateReadability } from '../lib/content/readability-analyzer';
import { researchKeywords, analyzeKeywordDistribution } from '../lib/seo/keyword-researcher';
import { factCheckArticle } from '../lib/content/fact-checker';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testCompleteQualitySystem() {
    console.log('🎯 Testing Complete Quality System\n');
    console.log('='.repeat(70));
    
    try {
        // Get article
        const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', 'new-vs-old-tax-regime-12-lakh-salary-2026')
            .single();
        
        if (error || !article) {
            console.log('❌ Article not found');
            return;
        }
        
        console.log(`\n📄 Article: ${article.title}\n`);
        
        // 1. Quality Score
        console.log('1️⃣  QUALITY SCORE');
        console.log('-'.repeat(70));
        const quality = scoreArticleQuality({
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            keywords: article.keywords,
            meta_title: article.meta_title,
            meta_description: article.meta_description,
            featured_image: article.featured_image
        });
        console.log(`   Overall: ${quality.overall}/100 ${getGrade(quality.overall)}`);
        console.log(`   Depth: ${quality.depth}/100`);
        console.log(`   Structure: ${quality.structure}/100`);
        console.log(`   Completeness: ${quality.completeness}/100`);
        console.log(`   Word Count: ${quality.details.wordCount}`);
        
        // 2. Readability
        console.log(`\n2️⃣  READABILITY`);
        console.log('-'.repeat(70));
        const readability = calculateReadability(article.content);
        console.log(`   Flesch Ease: ${readability.fleschEase.toFixed(1)}/100 (${readability.assessment})`);
        console.log(`   Grade Level: ${readability.fleschGrade.toFixed(1)} (${readability.targetAudience})`);
        console.log(`   Avg Sentence: ${readability.metrics.avgWordsPerSentence.toFixed(1)} words`);
        
        // 3. Keyword Research
        console.log(`\n3️⃣  KEYWORD RESEARCH`);
        console.log('-'.repeat(70));
        const keywords = await researchKeywords(article.title, article.category);
        console.log(`   Primary: ${keywords.primary}`);
        console.log(`   Secondary (${keywords.secondary.length}): ${keywords.secondary.slice(0, 3).join(', ')}...`);
        console.log(`   LSI (${keywords.lsi.length}): ${keywords.lsi.slice(0, 3).join(', ')}...`);
        console.log(`   Long-tail (${keywords.longTail.length}): ${keywords.longTail.slice(0, 2).join(', ')}...`);
        
        const kwDistribution = analyzeKeywordDistribution(article.content, [keywords.primary]);
        console.log(`   Keyword Density: ${kwDistribution.density.toFixed(2)}%`);
        console.log(`   In Title: ${kwDistribution.inTitle ? '✅' : '❌'}`);
        console.log(`   In First Para: ${kwDistribution.inFirstParagraph ? '✅' : '❌'}`);
        
        // 4. Fact-Checking
        console.log(`\n4️⃣  FACT-CHECKING`);
        console.log('-'.repeat(70));
        const factCheck = await factCheckArticle({
            title: article.title,
            content: article.content,
            category: article.category
        });
        console.log(`   Status: ${factCheck.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`   Confidence: ${factCheck.confidence.toFixed(0)}%`);
        console.log(`   Validations: ${factCheck.validations.length}`);
        console.log(`   Issues: ${factCheck.issues.length} (${factCheck.issues.filter(i => i.type === 'error').length} errors, ${factCheck.issues.filter(i => i.type === 'warning').length} warnings)`);
        
        if (factCheck.issues.length > 0) {
            console.log(`\n   Issues Found:`);
            factCheck.issues.slice(0, 3).forEach((issue, i) => {
                console.log(`   ${i + 1}. [${issue.type.toUpperCase()}] ${issue.message}`);
            });
        }
        
        // 5. Featured Image
        console.log(`\n5️⃣  FEATURED IMAGE`);
        console.log('-'.repeat(70));
        console.log(`   Status: ${article.featured_image ? '✅ Present' : '❌ Missing'}`);
        if (article.featured_image) {
            console.log(`   URL: ${article.featured_image.substring(0, 50)}...`);
        } else {
            console.log(`   Note: Add REPLICATE_API_TOKEN to enable auto-generation`);
        }
        
        // Overall Assessment
        console.log(`\n${'='.repeat(70)}`);
        console.log('📊 OVERALL QUALITY ASSESSMENT');
        console.log('='.repeat(70));
        
        const overallScore = Math.round(
            quality.overall * 0.35 +
            (readability.fleschEase >= 60 && readability.fleschEase <= 70 ? 100 : 60) * 0.20 +
            (kwDistribution.inTitle && kwDistribution.inFirstParagraph ? 100 : 70) * 0.20 +
            factCheck.confidence * 0.15 +
            (article.featured_image ? 100 : 0) * 0.10
        );
        
        console.log(`\n🎯 Final Quality Score: ${overallScore}/100 ${getGrade(overallScore)}\n`);
        
        console.log('Breakdown:');
        console.log(`   Content Quality: ${quality.overall}/100 (35% weight)`);
        console.log(`   Readability: ${readability.fleschEase >= 60 && readability.fleschEase <= 70 ? '100' : '60'}/100 (20% weight)`);
        console.log(`   SEO/Keywords: ${kwDistribution.inTitle && kwDistribution.inFirstParagraph ? '100' : '70'}/100 (20% weight)`);
        console.log(`   Fact-Check: ${factCheck.confidence.toFixed(0)}/100 (15% weight)`);
        console.log(`   Visual: ${article.featured_image ? '100' : '0'}/100 (10% weight)`);
        
        console.log(`\n${getOverallAssessment(overallScore)}\n`);
        
        console.log('='.repeat(70));
        console.log('✅ Complete quality system test finished!\n');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

function getGrade(score: number): string {
    if (score >= 90) return '🟢 Excellent';
    if (score >= 80) return '🟢 Good';
    if (score >= 70) return '🟡 Fair';
    if (score >= 60) return '🟠 Needs Work';
    return '🔴 Poor';
}

function getOverallAssessment(score: number): string {
    if (score >= 90) return '🎉 EXCELLENT - Professional quality, ready to publish!';
    if (score >= 80) return '✅ GOOD - High quality with minor improvements possible';
    if (score >= 70) return '⚠️  FAIR - Acceptable quality, some improvements recommended';
    if (score >= 60) return '🔴 NEEDS WORK - Significant improvements required';
    return '❌ POOR - Major revision needed before publishing';
}

testCompleteQualitySystem();
