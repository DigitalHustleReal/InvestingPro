/**
 * 🎬 VIDEO SCRIPT PROMPT GENERATOR
 * 
 * 100% Automated, Platform-Optimized Video Script Prompts
 * 
 * Features:
 * - Platform-specific optimization (YouTube, Instagram Reels, TikTok)
 * - Content extraction from articles
 * - Hook generation
 * - Engagement optimization
 * - Brand consistency
 */

export interface VideoScriptPromptOptions {
    articleTitle: string;
    articleContent: string;
    articleExcerpt?: string;
    platform: 'youtube' | 'instagram-reels' | 'tiktok' | 'shorts';
    videoType: 'educational' | 'tutorial' | 'explainer' | 'tips' | 'story';
    duration?: number; // seconds
    category: string;
    keywords?: string[];
    tone?: 'professional' | 'conversational' | 'energetic' | 'educational';
    includeCTA?: boolean;
}

export interface GeneratedVideoScriptPrompt {
    prompt: string;
    platform: string;
    videoType: string;
    duration: number;
    structure: string[];
    hook: string;
    cta: string;
}

// ============================================================================
// PLATFORM SPECIFICATIONS
// ============================================================================

const PLATFORM_SPECS = {
    youtube: {
        name: 'YouTube',
        minDuration: 60,
        maxDuration: 600,
        optimalDuration: 180,
        hookLength: 15,
        structure: ['Hook', 'Introduction', 'Main Content', 'Summary', 'CTA'],
        engagementTips: ['Ask to subscribe', 'Request likes', 'Ask questions', 'Include timestamps']
    },
    'instagram-reels': {
        name: 'Instagram Reels',
        minDuration: 15,
        maxDuration: 90,
        optimalDuration: 30,
        hookLength: 3,
        structure: ['Hook', 'Quick Value', 'CTA'],
        engagementTips: ['Fast-paced', 'Visual-first', 'Use text overlays', 'Ask for saves']
    },
    tiktok: {
        name: 'TikTok',
        minDuration: 15,
        maxDuration: 180,
        optimalDuration: 30,
        hookLength: 3,
        structure: ['Hook', 'Quick Value', 'CTA'],
        engagementTips: ['Trending sounds', 'Fast cuts', 'Engaging visuals', 'Ask for follows']
    },
    shorts: {
        name: 'YouTube Shorts',
        minDuration: 15,
        maxDuration: 60,
        optimalDuration: 30,
        hookLength: 3,
        structure: ['Hook', 'Quick Value', 'CTA'],
        engagementTips: ['Vertical format', 'Fast-paced', 'Visual-first', 'Ask to subscribe']
    }
};

// ============================================================================
// CONTENT EXTRACTION
// ============================================================================

/**
 * Extract key points for video script
 */
function extractVideoKeyPoints(content: string, maxPoints: number = 5): string[] {
    // Extract headings
    const headingMatches = content.match(/^#{1,3}\s+(.+)$/gm);
    const headings = headingMatches?.slice(0, maxPoints).map(h => h.replace(/^#+\s+/, '')) || [];
    
    // Extract numbered lists
    const numberedMatches = content.match(/^\d+\.\s+(.+)$/gm);
    const numbered = numberedMatches?.slice(0, maxPoints).map(n => n.replace(/^\d+\.\s+/, '')) || [];
    
    // Extract key sentences
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    const keySentences = paragraphs.slice(0, maxPoints).map(p => {
        const firstSentence = p.split(/[.!?]/)[0];
        return firstSentence.length > 80 ? firstSentence.substring(0, 80) + '...' : firstSentence;
    });
    
    // Combine and deduplicate
    const allPoints = [...headings, ...numbered, ...keySentences];
    const uniquePoints = Array.from(new Set(allPoints));
    
    return uniquePoints.slice(0, maxPoints);
}

/**
 * Extract statistics for video
 */
function extractVideoStatistics(content: string): Array<{ label: string; value: string }> {
    const stats: Array<{ label: string; value: string }> = [];
    
    // Extract percentages
    const percentageMatches = content.match(/(\d+(?:\.\d+)?)\s*%/g);
    if (percentageMatches) {
        percentageMatches.slice(0, 3).forEach(match => {
            stats.push({
                label: 'Percentage',
                value: match
            });
        });
    }
    
    // Extract numbers with context
    const numberMatches = content.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s+(lakh|crore|thousand|million|years?|months?|days?)/gi);
    if (numberMatches) {
        numberMatches.slice(0, 3).forEach(match => {
            stats.push({
                label: 'Number',
                value: match
            });
        });
    }
    
    return stats.slice(0, 5);
}

// ============================================================================
// PROMPT GENERATION
// ============================================================================

/**
 * Generate video script prompt
 */
export function generateVideoScriptPrompt(options: VideoScriptPromptOptions): GeneratedVideoScriptPrompt {
    const {
        articleTitle,
        articleContent,
        articleExcerpt,
        platform,
        videoType,
        duration,
        category,
        keywords = [],
        tone = 'conversational',
        includeCTA = true
    } = options;
    
    const platformSpec = PLATFORM_SPECS[platform];
    const videoDuration = duration || platformSpec.optimalDuration;
    
    // Extract content elements
    const keyPoints = extractVideoKeyPoints(articleContent, platform === 'youtube' ? 5 : 3);
    const statistics = extractVideoStatistics(articleContent);
    const excerpt = articleExcerpt || articleContent.substring(0, 200);
    
    // Generate hook
    const hook = generateVideoHook(articleTitle, platform, videoType);
    
    // Generate CTA
    const cta = includeCTA ? generateVideoCTA(platform, category) : '';
    
    // Build prompt
    const prompt = buildVideoScriptPrompt({
        articleTitle,
        excerpt,
        keyPoints,
        statistics,
        platform,
        platformSpec,
        videoType,
        videoDuration,
        hook,
        cta,
        tone,
        keywords
    });
    
    return {
        prompt,
        platform,
        videoType,
        duration: videoDuration,
        structure: platformSpec.structure,
        hook,
        cta
    };
}

/**
 * Build video script prompt
 */
function buildVideoScriptPrompt(params: {
    articleTitle: string;
    excerpt: string;
    keyPoints: string[];
    statistics: Array<{ label: string; value: string }>;
    platform: string;
    platformSpec: (typeof PLATFORM_SPECS)[keyof typeof PLATFORM_SPECS];
    videoType: string;
    videoDuration: number;
    hook: string;
    cta: string;
    tone: string;
    keywords: string[];
}): string {
    const { articleTitle, excerpt, keyPoints, statistics, platform, platformSpec, videoType, videoDuration, hook, cta, tone, keywords } = params;
    
    let prompt = `Create a ${platformSpec.name} ${videoType} video script based on: "${articleTitle}"\n\n`;
    
    prompt += `VIDEO DETAILS:\n`;
    prompt += `- Platform: ${platformSpec.name}\n`;
    prompt += `- Type: ${videoType}\n`;
    prompt += `- Duration: ${videoDuration} seconds\n`;
    prompt += `- Tone: ${tone}\n`;
    prompt += `\n`;
    
    prompt += `ARTICLE SUMMARY:\n`;
    prompt += `${excerpt}\n\n`;
    
    prompt += `KEY POINTS TO COVER:\n`;
    keyPoints.forEach((point, i) => {
        prompt += `${i + 1}. ${point.substring(0, 100)}\n`;
    });
    prompt += `\n`;
    
    if (statistics.length > 0) {
        prompt += `STATISTICS TO INCLUDE:\n`;
        statistics.forEach((stat, i) => {
            prompt += `${i + 1}. ${stat.value}\n`;
        });
        prompt += `\n`;
    }
    
    prompt += `SCRIPT STRUCTURE:\n`;
    platformSpec.structure.forEach((section: any, i: any) => {
        prompt += `${i + 1}. ${section}\n`;
    });
    prompt += `\n`;
    
    prompt += `HOOK (first ${platformSpec.hookLength} seconds):\n`;
    prompt += `${hook}\n\n`;
    
    prompt += `PLATFORM REQUIREMENTS:\n`;
    prompt += `- Duration: ${videoDuration} seconds (${Math.round(videoDuration / 60)} minutes)\n`;
    prompt += `- Hook: ${platformSpec.hookLength} seconds\n`;
    prompt += `- Main content: ${Math.round((videoDuration - platformSpec.hookLength - 5) * 0.7)} seconds\n`;
    prompt += `- Summary: ${Math.round((videoDuration - platformSpec.hookLength - 5) * 0.2)} seconds\n`;
    prompt += `- CTA: 5 seconds\n`;
    prompt += `\n`;
    
    prompt += `WRITING REQUIREMENTS:\n`;
    platformSpec.engagementTips.forEach((tip: any) => {
        prompt += `- ${tip}\n`;
    });
    prompt += `- ${tone} tone throughout\n`;
    prompt += `- Conversational and engaging\n`;
    prompt += `- Include visual cues (mention what to show)\n`;
    prompt += `- Use transitions between points\n`;
    prompt += `- Include pauses for emphasis\n`;
    prompt += `\n`;
    
    if (platform === 'youtube') {
        prompt += `YOUTUBE SPECIFIC:\n`;
        prompt += `- Include timestamps for chapters\n`;
        prompt += `- Ask to subscribe and like\n`;
        prompt += `- Include related video suggestions\n`;
        prompt += `- Use screen annotations\n`;
        prompt += `\n`;
    } else if (platform === 'instagram-reels' || platform === 'tiktok' || platform === 'shorts') {
        prompt += `SHORT-FORM SPECIFIC:\n`;
        prompt += `- Fast-paced delivery\n`;
        prompt += `- Visual-first approach\n`;
        prompt += `- Text overlays for key points\n`;
        prompt += `- Quick cuts and transitions\n`;
        prompt += `- Hook in first 3 seconds\n`;
        prompt += `\n`;
    }
    
    prompt += `CTA: ${cta}\n\n`;
    
    prompt += `OUTPUT FORMAT:\n`;
    prompt += `Return JSON with script:\n`;
    prompt += `{\n`;
    prompt += `  "hook": "Hook script (${platformSpec.hookLength}s)",\n`;
    prompt += `  "introduction": "Introduction script",\n`;
    prompt += `  "mainContent": [\n`;
    prompt += `    { "point": "Point 1", "script": "...", "duration": <seconds>, "visualCue": "..." },\n`;
    prompt += `    { "point": "Point 2", "script": "...", "duration": <seconds>, "visualCue": "..." }\n`;
    prompt += `  ],\n`;
    prompt += `  "summary": "Summary script",\n`;
    prompt += `  "cta": "${cta}",\n`;
    prompt += `  "totalDuration": ${videoDuration},\n`;
    prompt += `  "keywords": [${keywords.map(k => `"${k}"`).join(', ')}]\n`;
    prompt += `}\n`;
    
    return prompt.trim();
}

/**
 * Generate video hook
 */
function generateVideoHook(articleTitle: string, platform: string, videoType: string): string {
    const hooks: Record<string, Record<string, string>> = {
        youtube: {
            educational: `Did you know that ${articleTitle.toLowerCase()}? In this video, I'll show you everything you need to know.`,
            tutorial: `Want to learn ${articleTitle.toLowerCase()}? I'll walk you through it step by step.`,
            explainer: `Let me explain ${articleTitle.toLowerCase()} in simple terms.`,
            tips: `Here are ${articleTitle.toLowerCase()} that will change how you think about finance.`,
            story: `Let me tell you a story about ${articleTitle.toLowerCase()}.`
        },
        'instagram-reels': {
            educational: `${articleTitle} - Here's what you need to know! 💡`,
            tutorial: `How to ${articleTitle.toLowerCase()} - Quick tutorial! ⚡`,
            explainer: `${articleTitle} explained in 30 seconds! 🎯`,
            tips: `Top tips for ${articleTitle.toLowerCase()}! 💰`,
            story: `Story time: ${articleTitle} 📖`
        },
        tiktok: {
            educational: `POV: You learn ${articleTitle.toLowerCase()} 🎓`,
            tutorial: `How to ${articleTitle.toLowerCase()} (you need this!) ⚡`,
            explainer: `${articleTitle} explained! 💡`,
            tips: `Tips for ${articleTitle.toLowerCase()} that actually work! 💰`,
            story: `Story: ${articleTitle} 📖`
        },
        shorts: {
            educational: `${articleTitle} - Quick explainer! 💡`,
            tutorial: `How to ${articleTitle.toLowerCase()} in 30 seconds! ⚡`,
            explainer: `${articleTitle} explained simply! 🎯`,
            tips: `Top tips: ${articleTitle.toLowerCase()} 💰`,
            story: `Quick story: ${articleTitle} 📖`
        }
    };
    
    return hooks[platform]?.[videoType] || `Learn about ${articleTitle.toLowerCase()} in this video!`;
}

/**
 * Generate video CTA
 */
function generateVideoCTA(platform: string, category: string): string {
    const ctas: Record<string, Record<string, string>> = {
        youtube: {
            'mutual-funds': 'Subscribe for more investing tips and start your SIP journey today!',
            'credit-cards': 'Subscribe for more financial tips and find the best credit card for you!',
            'loans': 'Subscribe for more loan guides and get instant approval!',
            'insurance': 'Subscribe for more insurance tips and protect your family!',
            'tax-planning': 'Subscribe for more tax tips and save more this year!',
            'retirement': 'Subscribe for more retirement planning tips!',
            'investing-basics': 'Subscribe for more investing education!',
            'stocks': 'Subscribe for more stock market insights!'
        },
        'instagram-reels': {
            'mutual-funds': 'Save this for later and start your SIP journey! 💰',
            'credit-cards': 'Save this and find the best credit card! 🎯',
            'loans': 'Save this for loan tips! ⚡',
            'insurance': 'Save this for insurance tips! 🛡️',
            'tax-planning': 'Save this for tax savings! 💸',
            'retirement': 'Save this for retirement planning! 🎯',
            'investing-basics': 'Save this for investing tips! 🚀',
            'stocks': 'Save this for stock insights! 📈'
        },
        tiktok: {
            'mutual-funds': 'Follow for more investing tips! 💰',
            'credit-cards': 'Follow for more financial tips! 🎯',
            'loans': 'Follow for loan guides! ⚡',
            'insurance': 'Follow for insurance tips! 🛡️',
            'tax-planning': 'Follow for tax savings! 💸',
            'retirement': 'Follow for retirement planning! 🎯',
            'investing-basics': 'Follow for investing education! 🚀',
            'stocks': 'Follow for stock insights! 📈'
        },
        shorts: {
            'mutual-funds': 'Subscribe for more investing tips! 💰',
            'credit-cards': 'Subscribe for more financial tips! 🎯',
            'loans': 'Subscribe for loan guides! ⚡',
            'insurance': 'Subscribe for insurance tips! 🛡️',
            'tax-planning': 'Subscribe for tax savings! 💸',
            'retirement': 'Subscribe for retirement planning! 🎯',
            'investing-basics': 'Subscribe for investing education! 🚀',
            'stocks': 'Subscribe for stock insights! 📈'
        }
    };
    
    return ctas[platform]?.[category] || 'Subscribe for more financial tips!';
}

// ============================================================================
// EXPORT
// ============================================================================

export const videoScriptPromptGenerator = {
    generate: generateVideoScriptPrompt,
    extractKeyPoints: extractVideoKeyPoints,
    extractStatistics: extractVideoStatistics
};
