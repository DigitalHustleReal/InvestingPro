/**
 * 🎯 CONTENT QUALITY SCORER
 * 
 * Analyzes content quality across multiple dimensions:
 * - Grammar & spelling
 * - Readability (Flesch-Kincaid)
 * - SEO optimization
 * - Content structure
 * - Word count & density
 * - Sentence complexity
 * 
 * Returns 0-100 score with detailed breakdown
 */

import { logger } from '../logger';

export interface ContentQualityScore {
    overall: number;           // 0-100 composite score
    grammar: number;           // Grammar quality
    readability: number;       // Flesch-Kincaid based
    seo: number;              // On-page SEO
    structure: number;         // Content organization
    uniqueness: number;        // Estimated originality
    
    details: {
        wordCount: number;
        sentenceCount: number;
        avgWordsPerSentence: number;
        avgSyllablesPerWord: number;
        fleschScore: number;
        gradeLevel: number;
        headingCount: number;
        paragraphCount: number;
        keywordDensity: number;
    };
    
    issues: QualityIssue[];
    suggestions: string[];
    canPublish: boolean;
    grade: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface QualityIssue {
    severity: 'error' | 'warning' | 'info';
    category: 'grammar' | 'readability' | 'seo' | 'structure';
    message: string;
    line?: number;
}

/**
 * Analyze content quality
 */
export function analyzeContentQuality(
    content: string,
    title: string,
    targetKeyword?: string
): ContentQualityScore {
    const issues: QualityIssue[] = [];
    const suggestions: string[] = [];

    // 1. Basic metrics
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;
    
    // Count headings
    const headingMatches = content.match(/^#+\s+.+$/gm) || content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gm) || [];
    const headingCount = headingMatches.length;
    
    // Check for special elements (Bonus points)
    const hasQuickVerdict = content.includes('quick-verdict') || content.includes('Quick Verdict');
    const hasProTip = content.includes('pro-tip') || content.includes('Pro Tip');
    const hasWarning = content.includes('warning-box') || content.includes('Warning');
    const hasTable = content.includes('<table') || content.includes('| ---');
    const hasList = content.includes('<ul') || content.includes('<ol') || content.match(/^\s*[-*]\s+/m);

    // 2. Readability Analysis (Flesch-Kincaid)
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const syllables = countSyllables(content);
    const avgSyllablesPerWord = wordCount > 0 ? syllables / wordCount : 0;
    
    // Flesch Reading Ease Score (0-100, higher = easier)
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    const clampedFlesch = Math.max(0, Math.min(100, fleschScore));
    
    // Grade level (0-20+)
    const gradeLevel = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
    const clampedGrade = Math.max(0, Math.min(20, gradeLevel));

    // 3. Grammar Score (heuristic-based in absence of API)
    let grammarScore = 100;
    
    // Check for common issues
    if ((content.match(/\s{2,}/g) || []).length > 5) {
        grammarScore -= 5;
        issues.push({
            severity: 'warning',
            category: 'grammar',
            message: 'Multiple consecutive spaces found'
        });
    }
    
    // Check for missing punctuation
    const sentencesWithoutPeriod = sentences.filter(s => 
        !s.trim().match(/[.!?]$/)
    ).length;
    if (sentencesWithoutPeriod > sentenceCount * 0.1) {
        grammarScore -= 10;
        issues.push({
            severity: 'warning',
            category: 'grammar',
            message: 'Some sentences missing punctuation'
        });
    }
    
    // Check for passive voice (simple heuristic)
    const passiveIndicators = content.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || [];
    const passivePercentage = (passiveIndicators.length / sentenceCount) * 100;
    if (passivePercentage > 20) {
        grammarScore -= 5;
        suggestions.push('Consider reducing passive voice usage (currently high)');
    }

    // 4. Readability Score
    let readabilityScore = 0;
    
    // Flesch score contribution (optimal: 60-80 = conversational)
    if (clampedFlesch >= 60 && clampedFlesch <= 80) {
        readabilityScore = 100;
    } else if (clampedFlesch >= 50 && clampedFlesch <= 90) {
        readabilityScore = 80;
    } else {
        readabilityScore = 60;
    }
    
    // Grade level contribution (optimal: 6-10)
    if (clampedGrade >= 6 && clampedGrade <= 10) {
        readabilityScore = Math.min(100, readabilityScore + 10);
    } else if (clampedGrade > 12) {
        readabilityScore -= 10;
        suggestions.push(`Content grade level is ${clampedGrade.toFixed(1)} (too complex). Target: 8-10.`);
    }
    
    // Sentence length (optimal: 15-20 words)
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
        readabilityScore = Math.min(100, readabilityScore + 5);
    } else if (avgWordsPerSentence > 25) {
        readabilityScore -= 10;
        suggestions.push('Sentences are too long. Break into shorter sentences.');
    }

    // 5. SEO Score
    let seoScore = 100;
    
    // Word count (ideal: 1500+)
    if (wordCount < 1000) {
        seoScore -= 30;
        issues.push({
            severity: 'error',
            category: 'seo',
            message: `Content too short (${wordCount} words). Target: 1500+ words.`
        });
    } else if (wordCount < 1500) {
        seoScore -= 10;
        suggestions.push(`Content length is ${wordCount} words. Target: 1500+ for better SEO.`);
    }
    
    // Headings (should have at least 3 H2/H3)
    if (headingCount < 3) {
        seoScore -= 15;
        issues.push({
            severity: 'warning',
            category: 'seo',
            message: 'Too few headings. Add more H2/H3 sections for better structure.'
        });
    }
    
    // Keyword density (if provided)
    let keywordDensity = 0;
    if (targetKeyword) {
        const keywordRegex = new RegExp(targetKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const keywordMatches = content.match(keywordRegex) || [];
        keywordDensity = (keywordMatches.length / wordCount) * 100;
        
        if (keywordDensity < 0.5) {
            seoScore -= 10;
            suggestions.push('Keyword density is low. Use target keyword more naturally.');
        } else if (keywordDensity > 3) {
            seoScore -= 15;
            issues.push({
                severity: 'warning',
                category: 'seo',
                message: 'Keyword density too high (keyword stuffing). Reduce usage.'
            });
        }
    }
    
    // Paragraph length (optimal: 3-5 sentences)
    const longParagraphs = paragraphs.filter(p => {
        const pSentences = p.split(/[.!?]+/).length;
        return pSentences > 7;
    }).length;
    
    if (longParagraphs > paragraphCount * 0.3) {
        seoScore -= 5;
        suggestions.push('Some paragraphs are too long. Break into smaller chunks.');
    }

    // 6. Structure Score
    let structureScore = 100;
    
    // Should start with intro paragraph
    const firstParagraph = paragraphs[0];
    if (!firstParagraph || firstParagraph.split(/\s+/).length < 50) {
        structureScore -= 15;
        issues.push({
            severity: 'warning',
            category: 'structure',
            message: 'Introduction is too short or missing.'
        });
    }
    
    // Should have clear sections
    if (headingCount < 3) {
        structureScore -= 20;
    }
    
    // Reward rich elements
    if (hasQuickVerdict) structureScore += 5;
    if (hasProTip) structureScore += 5;
    if (hasWarning) structureScore += 5;
    if (hasTable) structureScore += 10;
    else {
         structureScore -= 10;
         suggestions.push('Content is missing a data table (crucial for financial topics).');
    }
    
    // Should have conclusion
    const lastParagraph = paragraphs[paragraphs.length - 1];
    if (!lastParagraph || lastParagraph.split(/\s+/).length < 30) {
        structureScore -= 10;
        suggestions.push('Add a stronger conclusion section.');
    }

    // 7. Uniqueness (heuristic - actual plagiarism check separate)
    let uniquenessScore = 85; // Assume decent uniqueness
    
    // Check for overly generic phrases
    const genericPhrases = [
        'in conclusion', 'in summary', 'to summarize',
        'it is important to note', 'it should be noted'
    ];
    
    let genericCount = 0;
    genericPhrases.forEach(phrase => {
        const matches = content.toLowerCase().match(new RegExp(phrase, 'g')) || [];
        genericCount += matches.length;
    });
    
    if (genericCount > 5) {
        uniquenessScore -= 10;
        suggestions.push('Content uses many generic phrases. Add more original insights.');
    }

    // 8. Calculate Overall Score (weighted average)
    const overall = Math.round(
        (grammarScore * 0.20) +
        (readabilityScore * 0.25) +
        (seoScore * 0.25) +
        (structureScore * 0.20) +
        (uniquenessScore * 0.10)
    );

    // Determine grade
    let grade: 'poor' | 'fair' | 'good' | 'excellent';
    if (overall >= 85) grade = 'excellent';
    else if (overall >= 75) grade = 'good';
    else if (overall >= 60) grade = 'fair';
    else grade = 'poor';

    // Can publish if overall > 70 and no critical errors
    const criticalErrors = issues.filter(i => i.severity === 'error');
    const canPublish = overall >= 70 && criticalErrors.length === 0;

    if (!canPublish) {
        if (overall < 70) {
            issues.push({
                severity: 'error',
                category: 'seo',
                message: `Quality score too low (${overall}/100). Target: 70+ for publishing.`
            });
        }
    }

    return {
        overall,
        grammar: Math.round(grammarScore),
        readability: Math.round(readabilityScore),
        seo: Math.round(seoScore),
        structure: Math.round(structureScore),
        uniqueness: Math.round(uniquenessScore),
        details: {
            wordCount,
            sentenceCount,
            avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
            avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
            fleschScore: Math.round(clampedFlesch * 10) / 10,
            gradeLevel: Math.round(clampedGrade * 10) / 10,
            headingCount,
            paragraphCount,
            keywordDensity: Math.round(keywordDensity * 100) / 100
        },
        issues,
        suggestions,
        canPublish,
        grade
    };
}

/**
 * Count syllables in text (approximate)
 */
function countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;

    words.forEach(word => {
        // Remove punctuation
        word = word.replace(/[^a-z]/g, '');
        if (word.length === 0) return;

        // Count vowel groups
        const vowels = word.match(/[aeiouy]+/g);
        let syllableCount = vowels ? vowels.length : 0;

        // Adjust for silent e
        if (word.endsWith('e')) {
            syllableCount--;
        }

        // At least 1 syllable per word
        if (syllableCount === 0) {
            syllableCount = 1;
        }

        totalSyllables += syllableCount;
    });

    return totalSyllables;
}

/**
 * Generate quality report for display
 */
export function generateQualityReport(score: ContentQualityScore): string {
    let report = '';
    
    report += `\n📊 CONTENT QUALITY REPORT\n`;
    report += `${'='.repeat(60)}\n\n`;
    
    report += `Overall Score: ${score.overall}/100 (${score.grade.toUpperCase()})\n`;
    report += `Can Publish: ${score.canPublish ? '✅ YES' : '❌ NO'}\n\n`;
    
    report += `Component Scores:\n`;
    report += `  Grammar:     ${score.grammar}/100\n`;
    report += `  Readability: ${score.readability}/100\n`;
    report += `  SEO:         ${score.seo}/100\n`;
    report += `  Structure:   ${score.structure}/100\n`;
    report += `  Uniqueness:  ${score.uniqueness}/100\n\n`;
    
    report += `Content Metrics:\n`;
    report += `  Words:               ${score.details.wordCount}\n`;
    report += `  Sentences:           ${score.details.sentenceCount}\n`;
    report += `  Avg Words/Sentence:  ${score.details.avgWordsPerSentence}\n`;
    report += `  Flesch Score:        ${score.details.fleschScore} (${getFleschCategory(score.details.fleschScore)})\n`;
    report += `  Grade Level:         ${score.details.gradeLevel}\n`;
    report += `  Headings:            ${score.details.headingCount}\n`;
    report += `  Paragraphs:          ${score.details.paragraphCount}\n`;
    
    if (score.issues.length > 0) {
        report += `\n⚠️  Issues Found (${score.issues.length}):\n`;
        score.issues.forEach((issue, i) => {
            const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
            report += `  ${icon} ${issue.message}\n`;
        });
    }
    
    if (score.suggestions.length > 0) {
        report += `\n💡 Suggestions (${score.suggestions.length}):\n`;
        score.suggestions.forEach((suggestion, i) => {
            report += `  ${i + 1}. ${suggestion}\n`;
        });
    }
    
    report += `\n${'='.repeat(60)}\n`;
    
    return report;
}

function getFleschCategory(score: number): string {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
}
