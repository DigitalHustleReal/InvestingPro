/**
 * Test Quality Scoring System
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { scoreArticleQuality } from '../lib/content/quality-scorer';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testQualityScoring() {
    console.log('🎯 Testing Quality Scoring System\n');
    
    try {
        // Get the tax regime article we created
        const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', 'new-vs-old-tax-regime-12-lakh-salary-2026')
            .single();
        
        if (error || !article) {
            console.log('❌ Article not found');
            return;
        }
        
        console.log('📄 Analyzing Article:', article.title);
        console.log('');
        
        // Score the article
        const score = scoreArticleQuality({
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            keywords: article.keywords,
            meta_title: article.meta_title,
            meta_description: article.meta_description,
            featured_image: article.featured_image
        });
        
        // Display results
        console.log('📊 QUALITY SCORE REPORT');
        console.log('='.repeat(60));
        console.log(`\n🎯 Overall Score: ${score.overall}/100`);
        
        // Score breakdown
        console.log('\n📈 Score Breakdown:');
        console.log(`   Depth:        ${score.depth}/100 ${getGrade(score.depth)}`);
        console.log(`   Structure:    ${score.structure}/100 ${getGrade(score.structure)}`);
        console.log(`   Completeness: ${score.completeness}/100 ${getGrade(score.completeness)}`);
        console.log(`   Readability:  ${score.readability}/100 ${getGrade(score.readability)}`);
        console.log(`   SEO:          ${score.seo}/100 ${getGrade(score.seo)}`);
        
        // Content metrics
        console.log('\n📝 Content Metrics:');
        console.log(`   Word Count:       ${score.details.wordCount}`);
        console.log(`   Headings (H2/H3): ${score.details.headingCount}`);
        console.log(`   Paragraphs:       ${score.details.paragraphCount}`);
        console.log(`   Lists:            ${score.details.listCount}`);
        console.log(`   Tables:           ${score.details.tableCount}`);
        console.log(`   Images:           ${score.details.imageCount}`);
        console.log(`   Avg Sentence:     ${score.details.avgSentenceLength.toFixed(1)} words`);
        console.log(`   Avg Paragraph:    ${score.details.avgParagraphLength.toFixed(1)} words`);
        
        // Issues
        if (score.issues.length > 0) {
            console.log('\n⚠️  Issues Found:');
            score.issues.forEach((issue, i) => {
                console.log(`   ${i + 1}. ${issue}`);
            });
        }
        
        // Suggestions
        if (score.suggestions.length > 0) {
            console.log('\n💡 Suggestions:');
            score.suggestions.forEach((suggestion, i) => {
                console.log(`   ${i + 1}. ${suggestion}`);
            });
        }
        
        // Overall assessment
        console.log('\n' + '='.repeat(60));
        console.log(getAssessment(score.overall));
        console.log('='.repeat(60));
        
        // Save score to database
        console.log('\n💾 Saving quality score to database...');
        
        const { error: updateError } = await supabase
            .from('articles')
            .update({
                quality_score: score.overall,
                quality_metrics: score
            })
            .eq('id', article.id);
        
        if (updateError) {
            console.log('⚠️  Could not save score (quality_score column may not exist)');
        } else {
            console.log('✅ Quality score saved to database');
        }
        
        console.log('\n✅ Quality scoring test complete!');
        
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

function getAssessment(score: number): string {
    if (score >= 90) return '🎉 EXCELLENT QUALITY - Ready to publish!';
    if (score >= 80) return '✅ GOOD QUALITY - Minor improvements recommended';
    if (score >= 70) return '⚠️  FAIR QUALITY - Some improvements needed';
    if (score >= 60) return '🔴 NEEDS WORK - Significant improvements required';
    return '❌ POOR QUALITY - Major revision needed';
}

testQualityScoring();
