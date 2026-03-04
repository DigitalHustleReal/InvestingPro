/**
 * 📊 CONTENT QUALITY SCORER
 * 
 * Analyzes article content and assigns a quality score (0-100)
 * Prevents publication of low-quality content
 * 
 * Components:
 * - Readability (Flesch-Kincaid)
 * - SEO optimization
 * - Content structure
 * - Overall quality threshold
 */

export interface QualityScore {
  overall: number;           // 0-100
  readability: number;       // 0-100
  seo: number;              // 0-100
  structure: number;         // 0-100
  canPublish: boolean;       // true if overall >= 70
  recommendations: string[];
  details: QualityDetails;
}

export interface QualityDetails {
  readability: {
    score: number;
    gradeLevel: number;
    avgSentenceLength: number;
    avgWordLength: number;
    rating: 'Easy' | 'Medium' | 'Hard';
  };
  seo: {
    score: number;
    hasMetaDescription: boolean;
    metaLength: number;
    hasHeadings: boolean;
    headingStructure: boolean;
    keywordDensity: number;
  };
  structure: {
    score: number;
    wordCount: number;
    paragraphCount: number;
    hasIntro: boolean;
    hasConclusion: boolean;
    listCount: number;
  };
}

/**
 * Calculate Flesch-Kincaid Reading Ease Score
 * Score: 0-100 (higher = easier to read)
 * Target: 60-70 (8th-9th grade level)
 */
function calculateReadability(content: string): QualityDetails['readability'] {
  // Handle null/undefined content
  if (!content || typeof content !== 'string') {
    return {
      score: 50,
      gradeLevel: 0,
      avgSentenceLength: 0,
      avgWordLength: 0,
      rating: 'Medium'
    };
  }
  
  // Remove HTML tags
  const textOnly = content.replace(/<[^>]*>/g, ' ').trim();
  
  // Count sentences (approximate)
  const sentences = textOnly.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;
  
  // Count words
  const words = textOnly.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length || 1;
  
  // Count syllables (simplified - count vowel groups)
  const syllableCount = words.reduce((total, word) => {
    const vowelGroups = word.toLowerCase().match(/[aeiouy]+/g);
    return total + (vowelGroups ? vowelGroups.length : 1);
  }, 0);
  
  // Flesch Reading Ease = 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words)
  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;
  
  const fleschScore = Math.max(0, Math.min(100,
    206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
  ));
  
  // Calculate grade level (Flesch-Kincaid Grade Level)
  const gradeLevel = Math.max(0,
    (0.39 * avgSentenceLength) + (11.8 * avgSyllablesPerWord) - 15.59
  );
  
  // Calculate average word length
  const totalChars = words.reduce((sum, word) => sum + word.length, 0);
  const avgWordLength = totalChars / wordCount;
  
  // Determine rating
  let rating: 'Easy' | 'Medium' | 'Hard';
  if (fleschScore >= 70) rating = 'Easy';
  else if (fleschScore >= 50) rating = 'Medium';
  else rating = 'Hard';
  
  // Convert to 0-100 score (target: 60-70 = 100 points)
  let readabilityScore;
  if (fleschScore >= 60 && fleschScore <= 70) {
    readabilityScore = 100; // Perfect range
  } else if (fleschScore > 70) {
    readabilityScore = Math.max(70, 100 - (fleschScore - 70) * 2); // Too easy
  } else {
    readabilityScore = Math.max(30, fleschScore + 30); // Too hard
  }
  
  return {
    score: Math.round(readabilityScore),
    gradeLevel: Math.round(gradeLevel * 10) / 10,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    rating
  };
}

/**
 * Calculate SEO Score
 */
function calculateSEO(
  title: string,
  content: string,
  metaDescription?: string
): QualityDetails['seo'] {
  // Handle null/undefined content
  if (!content || typeof content !== 'string') {
    return {
      score: 50,
      hasMetaDescription: false,
      metaLength: 0,
      hasHeadings: false,
      headingStructure: false,
      keywordDensity: 0
    };
  }
  
  let score = 0;
  const textOnly = content.replace(/<[^>]*>/g, ' ');
  
  // Meta description (30 points)
  const hasMetaDescription = !!metaDescription && metaDescription.length > 0;
  const metaLength = metaDescription?.length || 0;
  if (hasMetaDescription) {
    if (metaLength >= 120 && metaLength <= 160) {
      score += 30; // Perfect length
    } else if (metaLength >= 50 && metaLength <= 200) {
      score += 20; // Acceptable
    } else {
      score += 10; // Has description but poor length
    }
  }
  
  // Heading structure (30 points)
  const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;
  
  const hasHeadings = h2Count > 0 || h3Count > 0;
  const headingStructure = h1Count === 1 && h2Count >= 2;
  
  if (headingStructure) score += 30;
  else if (hasHeadings) score += 15;
  
  // Keyword density (20 points)
  // Extract main keyword from title (first 3-5 words)
  const mainKeyword = title.toLowerCase().split(' ').slice(0, 3).join(' ');
  const keywordOccurrences = textOnly.toLowerCase().split(mainKeyword).length - 1;
  const wordCount = textOnly.split(/\s+/).length;
  const keywordDensity = (keywordOccurrences / wordCount) * 100;
  
  if (keywordDensity >= 1 && keywordDensity <= 3) {
    score += 20; // Ideal density
  } else if (keywordDensity > 0 && keywordDensity < 5) {
    score += 10; // Acceptable
  }
  
  // Content length (20 points)
  if (wordCount >= 1500) score += 20;
  else if (wordCount >= 1000) score += 15;
  else if (wordCount >= 500) score += 10;
  
  return {
    score: Math.min(100, score),
    hasMetaDescription,
    metaLength,
    hasHeadings,
    headingStructure,
    keywordDensity: Math.round(keywordDensity * 100) / 100
  };
}

/**
 * Calculate Content Structure Score
 */
function calculateStructure(content: string): QualityDetails['structure'] {
  // Handle null/undefined content
  if (!content || typeof content !== 'string') {
    return {
      score: 50,
      wordCount: 0,
      paragraphCount: 0,
      hasIntro: false,
      hasConclusion: false,
      listCount: 0
    };
  }
  
  let score = 0;
  const textOnly = content.replace(/<[^>]*>/g, '\n');
  
  // Word count (30 points)
  const words = textOnly.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  if (wordCount >= 1500) score += 30;
  else if (wordCount >= 1000) score += 20;
  else if (wordCount >= 500) score += 10;
  
  // Paragraph count (20 points)
  const paragraphs = content.split(/<\/p>/i).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  
  if (paragraphCount >= 8) score += 20;
  else if (paragraphCount >= 5) score += 15;
  else if (paragraphCount >= 3) score += 10;
  
  // Has intro (15 points)
  const firstParagraph = paragraphs[0] || '';
  const hasIntro = firstParagraph.length > 100;
  if (hasIntro) score += 15;
  
  // Has conclusion (15 points)
  const lastParagraph = paragraphs[paragraphs.length - 1] || '';
  const hasConclusion = lastParagraph.toLowerCase().includes('conclusion') ||
                       lastParagraph.toLowerCase().includes('summary') ||
                       lastParagraph.toLowerCase().includes('final');
  if (hasConclusion) score += 15;
  
  // Lists (20 points)
  const ulCount = (content.match(/<ul[^>]*>/gi) || []).length;
  const olCount = (content.match(/<ol[^>]*>/gi) || []).length;
  const listCount = ulCount + olCount;
  
  if (listCount >= 3) score += 20;
  else if (listCount >= 1) score += 10;
  
  return {
    score: Math.min(100, score),
    wordCount,
    paragraphCount,
    hasIntro,
    hasConclusion,
    listCount
  };
}

/**
 * Main quality scoring function
 */
export function scoreContent(
  title: string,
  content: string,
  metaDescription?: string
): QualityScore {
  const readability = calculateReadability(content);
  const seo = calculateSEO(title, content, metaDescription);
  const structure = calculateStructure(content);
  
  // Weighted overall score
  // Readability: 35%, SEO: 35%, Structure: 30%
  const overall = Math.round(
    (readability.score * 0.35) +
    (seo.score * 0.35) +
    (structure.score * 0.30)
  );
  
  const canPublish = overall >= 70;
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (readability.score < 70) {
    if (readability.rating === 'Hard') {
      recommendations.push('Content is too complex. Use shorter sentences and simpler words.');
    } else if (readability.rating === 'Easy') {
      recommendations.push('Content might be too simple. Add more depth and detail.');
    }
  }
  
  if (seo.score < 70) {
    if (!seo.hasMetaDescription) {
      recommendations.push('Add a meta description (120-160 characters).');
    } else if (seo.metaLength < 120 || seo.metaLength > 160) {
      recommendations.push(`Meta description should be 120-160 chars (currently ${seo.metaLength}).`);
    }
    
    if (!seo.headingStructure) {
      recommendations.push('Improve heading structure: Use 1 H1 and at least 2 H2 headings.');
    }
    
    if (seo.keywordDensity < 1) {
      recommendations.push('Increase keyword usage in content (target: 1-3% density).');
    } else if (seo.keywordDensity > 3) {
      recommendations.push('Reduce keyword density to avoid over-optimization.');
    }
  }
  
  if (structure.score < 70) {
    if (structure.wordCount < 1000) {
      recommendations.push(`Increase content length (current: ${structure.wordCount} words, target: 1500+).`);
    }
    
    if (!structure.hasIntro) {
      recommendations.push('Add a proper introduction paragraph.');
    }
    
    if (!structure.hasConclusion) {
      recommendations.push('Add a conclusion section to summarize key points.');
    }
    
    if (structure.listCount < 2) {
      recommendations.push('Add more lists (bullet points or numbered lists) to improve scannability.');
    }
  }
  
  if (!canPublish) {
    recommendations.unshift(`Overall quality score is ${overall}/100. Minimum required: 70/100.`);
  }
  
  return {
    overall,
    readability: readability.score,
    seo: seo.score,
    structure: structure.score,
    canPublish,
    recommendations,
    details: {
      readability,
      seo,
      structure
    }
  };
}

/**
 * Test the scorer with sample content
 */
export function testScorer() {
  const sampleTitle = "Best Credit Cards in India 2026";
  const sampleContent = `
    <h1>Best Credit Cards in India 2026</h1>
    <p>Finding the right credit card can save you thousands of rupees every year. This guide helps you choose the best credit card for your needs.</p>
    
    <h2>Top Credit Cards</h2>
    <p>Here are the best credit cards available in India today:</p>
    <ul>
      <li>HDFC Regalia - Best for rewards</li>
      <li>SBI Card Elite - Best for travel</li>
      <li>Axis Magnus - Best for premium users</li>
    </ul>
    
    <h2>How to Choose</h2>
    <p>Consider your spending patterns, annual fees, and reward structure when selecting a credit card.</p>
    
    <h2>Conclusion</h2>
    <p>The best credit card depends on your individual needs and spending habits. Compare features carefully before applying.</p>
  `;
  const sampleMeta = "Compare the best credit cards in India 2026. Find cards with maximum rewards, cashback, and travel benefits.";
  
  const score = scoreContent(sampleTitle, sampleContent, sampleMeta);
  
  logger.info('\n📊 QUALITY SCORE TEST\n');
  logger.info('='.repeat(60));
  logger.info(`Overall Score: ${score.overall}/100 ${score.canPublish ? '✅ PASS' : '❌ FAIL'}`);
  logger.info(`  - Readability: ${score.readability}/100 (Grade ${score.details.readability.gradeLevel})`);
  logger.info(`  - SEO: ${score.seo}/100`);
  logger.info(`  - Structure: ${score.structure}/100`);
  logger.info('\n📋 Recommendations:');
  score.recommendations.forEach((rec, i) => {
    logger.info(`  ${i + 1}. ${rec}`);
  });
  logger.info('='.repeat(60) + '\n');
  
  return score;
}
