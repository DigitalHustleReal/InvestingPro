/**
 * Test Readability Analyzer
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { calculateReadability } from '../lib/content/readability-analyzer';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testReadability() {
    console.log('📖 Testing Readability Analyzer\n');
    
    try {
        // Get the tax regime article
        const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('slug', 'new-vs-old-tax-regime-12-lakh-salary-2026')
            .single();
        
        if (error || !article) {
            console.log('❌ Article not found');
            return;
        }
        
        console.log('📄 Analyzing:', article.title);
        console.log('');
        
        // Calculate readability
        const readability = calculateReadability(article.content);
        
        // Display results
        console.log('📊 READABILITY ANALYSIS');
        console.log('='.repeat(60));
        
        console.log(`\n📈 Flesch Reading Ease: ${readability.fleschEase.toFixed(1)}/100`);
        console.log(`   Assessment: ${readability.assessment}`);
        console.log(`   ${getEaseEmoji(readability.fleschEase)}`);
        
        console.log(`\n🎓 Flesch-Kincaid Grade: ${readability.fleschGrade.toFixed(1)}`);
        console.log(`   Target Audience: ${readability.targetAudience}`);
        console.log(`   ${getGradeEmoji(readability.fleschGrade)}`);
        
        console.log('\n📝 Text Metrics:');
        console.log(`   Sentences: ${readability.metrics.sentences}`);
        console.log(`   Words: ${readability.metrics.words}`);
        console.log(`   Syllables: ${readability.metrics.syllables}`);
        console.log(`   Avg Words/Sentence: ${readability.metrics.avgWordsPerSentence.toFixed(1)}`);
        console.log(`   Avg Syllables/Word: ${readability.metrics.avgSyllablesPerWord.toFixed(2)}`);
        
        console.log('\n💡 Suggestions:');
        readability.suggestions.forEach((suggestion, i) => {
            console.log(`   ${i + 1}. ${suggestion}`);
        });
        
        console.log('\n' + '='.repeat(60));
        console.log(getOverallAssessment(readability.fleschEase, readability.fleschGrade));
        console.log('='.repeat(60));
        
        console.log('\n✅ Readability analysis complete!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

function getEaseEmoji(score: number): string {
    if (score >= 80) return '🟢 Very readable';
    if (score >= 60) return '🟢 Good readability';
    if (score >= 50) return '🟡 Moderate readability';
    if (score >= 30) return '🟠 Difficult to read';
    return '🔴 Very difficult';
}

function getGradeEmoji(grade: number): string {
    if (grade <= 8) return '🟢 Accessible to most readers';
    if (grade <= 10) return '🟢 High school level';
    if (grade <= 12) return '🟡 Advanced high school';
    if (grade <= 14) return '🟠 College level';
    return '🔴 Professional/Academic';
}

function getOverallAssessment(ease: number, grade: number): string {
    if (ease >= 60 && ease <= 70 && grade >= 8 && grade <= 9) {
        return '🎯 OPTIMAL READABILITY - Perfect for general audience!';
    }
    if (ease >= 50 && ease <= 80 && grade >= 7 && grade <= 11) {
        return '✅ GOOD READABILITY - Suitable for most readers';
    }
    if (ease < 50 || grade > 12) {
        return '⚠️  TOO DIFFICULT - Simplify language and shorten sentences';
    }
    if (ease > 80 || grade < 7) {
        return '⚠️  TOO SIMPLE - Add more depth and sophistication';
    }
    return '📊 READABILITY ANALYZED';
}

testReadability();
