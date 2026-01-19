/**
 * Readability Analyzer
 * Calculates Flesch Reading Ease and Flesch-Kincaid Grade Level
 */

export interface ReadabilityScore {
    fleschEase: number;        // 0-100 (higher = easier)
    fleschGrade: number;       // 0-18 (lower = easier)
    assessment: string;
    targetAudience: string;
    suggestions: string[];
    metrics: {
        sentences: number;
        words: number;
        syllables: number;
        avgWordsPerSentence: number;
        avgSyllablesPerWord: number;
    };
}

/**
 * Calculate readability scores
 */
export function calculateReadability(text: string): ReadabilityScore {
    // Strip HTML and clean text
    const cleanText = stripHTML(text);
    
    // Count metrics
    const sentences = countSentences(cleanText);
    const words = countWords(cleanText);
    const syllables = countSyllables(cleanText);
    
    // Calculate averages
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    const avgSyllablesPerWord = words > 0 ? syllables / words : 0;
    
    // Flesch Reading Ease: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    // Score: 0-100 (higher = easier)
    const fleschEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Flesch-Kincaid Grade Level: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    // Score: 0-18 (U.S. grade level)
    const fleschGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
    
    // Get assessment
    const assessment = getAssessment(fleschEase);
    const targetAudience = getTargetAudience(fleschGrade);
    const suggestions = generateSuggestions(fleschEase, fleschGrade, avgWordsPerSentence);
    
    return {
        fleschEase: Math.max(0, Math.min(100, fleschEase)),
        fleschGrade: Math.max(0, Math.min(18, fleschGrade)),
        assessment,
        targetAudience,
        suggestions,
        metrics: {
            sentences,
            words,
            syllables,
            avgWordsPerSentence,
            avgSyllablesPerWord
        }
    };
}

/**
 * Get readability assessment
 */
function getAssessment(score: number): string {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
}

/**
 * Get target audience
 */
function getTargetAudience(grade: number): string {
    if (grade <= 5) return '5th grade (10-11 years)';
    if (grade <= 6) return '6th grade (11-12 years)';
    if (grade <= 7) return '7th grade (12-13 years)';
    if (grade <= 8) return '8th grade (13-14 years)';
    if (grade <= 9) return '9th grade (14-15 years)';
    if (grade <= 10) return 'High school (15-16 years)';
    if (grade <= 12) return 'High school senior (17-18 years)';
    if (grade <= 14) return 'College student';
    if (grade <= 16) return 'College graduate';
    return 'Professional/Academic';
}

/**
 * Generate improvement suggestions
 */
function generateSuggestions(ease: number, grade: number, avgSentenceLength: number): string[] {
    const suggestions: string[] = [];
    
    // Target: 60-70 Flesch Ease (Standard/Fairly Easy)
    if (ease < 60) {
        suggestions.push('Content is too difficult. Simplify language and shorten sentences.');
    }
    if (ease > 80) {
        suggestions.push('Content may be too simple. Add more detail and depth.');
    }
    
    // Target: 8-9 grade level (High school)
    if (grade > 10) {
        suggestions.push('Reading level is too high. Use simpler words and shorter sentences.');
    }
    if (grade < 7) {
        suggestions.push('Reading level may be too low. Add more sophisticated vocabulary.');
    }
    
    // Sentence length
    if (avgSentenceLength > 25) {
        suggestions.push('Sentences are too long. Break them into shorter sentences (aim for 15-20 words).');
    }
    if (avgSentenceLength < 10) {
        suggestions.push('Sentences are too short. Combine some for better flow.');
    }
    
    // Ideal range
    if (ease >= 60 && ease <= 70 && grade >= 8 && grade <= 9) {
        suggestions.push('✅ Readability is in the optimal range for general audience!');
    }
    
    return suggestions;
}

/**
 * Strip HTML tags
 */
function stripHTML(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Count sentences
 */
function countSentences(text: string): number {
    // Split on sentence-ending punctuation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    return Math.max(1, sentences.length);
}

/**
 * Count words
 */
function countWords(text: string): number {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    return Math.max(1, words.length);
}

/**
 * Count syllables (approximate)
 */
function countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;
    
    for (const word of words) {
        if (word.length === 0) continue;
        
        // Remove non-alphabetic characters
        const cleanWord = word.replace(/[^a-z]/g, '');
        if (cleanWord.length === 0) continue;
        
        // Count syllables using vowel groups
        const syllables = countWordSyllables(cleanWord);
        totalSyllables += syllables;
    }
    
    return Math.max(1, totalSyllables);
}

/**
 * Count syllables in a single word
 */
function countWordSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    // Count vowel groups
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
        const isVowel = 'aeiouy'.includes(word[i]);
        
        if (isVowel && !previousWasVowel) {
            count++;
        }
        
        previousWasVowel = isVowel;
    }
    
    // Adjust for silent 'e'
    if (word.endsWith('e')) {
        count--;
    }
    
    // Adjust for 'le' ending
    if (word.endsWith('le') && word.length > 2 && !'aeiouy'.includes(word[word.length - 3])) {
        count++;
    }
    
    return Math.max(1, count);
}
