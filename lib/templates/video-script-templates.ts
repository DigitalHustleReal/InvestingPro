/**
 * 🎬 VIDEO SCRIPT TEMPLATES LIBRARY
 * 
 * Structured templates for consistent, high-quality video scripts
 * across different platforms and video types.
 */

export interface VideoScriptSection {
    id: string;
    name: string;
    required: boolean;
    duration: number; // seconds
    elements: string[];
}

export interface VideoScriptTemplate {
    id: string;
    name: string;
    description: string;
    platform: 'youtube' | 'instagram-reels' | 'tiktok' | 'shorts';
    videoType: 'educational' | 'tutorial' | 'explainer' | 'tips' | 'story';
    useCases: string[];
    
    // Structure
    sections: VideoScriptSection[];
    
    // Requirements
    minDuration: number;
    maxDuration: number;
    optimalDuration: number;
    requiredElements: string[];
    
    // Style
    tone: string;
    engagementTips: string[];
    
    // Prompts
    systemPrompt: string;
    generationPromptTemplate: string;
}

// ============================================================================
// TEMPLATE 1: YOUTUBE EDUCATIONAL VIDEO
// ============================================================================

export const YOUTUBE_EDUCATIONAL: VideoScriptTemplate = {
    id: 'youtube_educational',
    name: 'YouTube Educational Video',
    description: 'Long-form educational content for YouTube',
    platform: 'youtube',
    videoType: 'educational',
    useCases: ['Comprehensive guides', 'Deep dives', 'Educational content', 'How-to guides'],
    
    sections: [
        {
            id: 'hook',
            name: 'Hook',
            required: true,
            duration: 15,
            elements: ['Attention-grabbing opening', 'Question', 'Value proposition', 'Preview']
        },
        {
            id: 'introduction',
            name: 'Introduction',
            required: true,
            duration: 30,
            elements: ['Topic introduction', 'What viewers will learn', 'Why it matters']
        },
        {
            id: 'main_content',
            name: 'Main Content',
            required: true,
            duration: 120,
            elements: ['Key points (3-5)', 'Explanations', 'Examples', 'Visual cues', 'Transitions']
        },
        {
            id: 'summary',
            name: 'Summary',
            required: true,
            duration: 20,
            elements: ['Key takeaways', 'Recap', 'Reinforcement']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            duration: 15,
            elements: ['Subscribe request', 'Like request', 'Comment prompt', 'Related videos']
        }
    ],
    
    minDuration: 60,
    maxDuration: 600,
    optimalDuration: 180,
    
    requiredElements: [
        'Strong hook (15 seconds)',
        'Clear introduction',
        '3-5 main points',
        'Visual cues for each point',
        'Summary of key takeaways',
        'Subscribe and like CTA',
        'Timestamps for chapters'
    ],
    
    tone: 'Educational, authoritative, engaging',
    
    engagementTips: [
        'Ask to subscribe in first 30 seconds',
        'Request likes',
        'Ask questions in comments',
        'Include timestamps',
        'Mention related videos',
        'Use screen annotations'
    ],
    
    systemPrompt: `You are a video scriptwriter creating educational YouTube videos for financial content. Your scripts are clear, engaging, and help viewers learn effectively.`,
    
    generationPromptTemplate: `Create a YouTube educational video script (${optimalDuration} seconds) based on: "{articleTitle}"

Key points: {keyPoints}
Statistics: {statistics}

Structure:
- Hook (15s): {hook}
- Introduction (30s)
- Main content (120s): 3-5 key points
- Summary (20s)
- CTA (15s)

Requirements:
- Educational tone
- Clear explanations
- Visual cues
- Timestamps
- Subscribe CTA
- Like and comment prompts

Make it educational and engaging.`
};

// ============================================================================
// TEMPLATE 2: INSTAGRAM REELS
// ============================================================================

export const INSTAGRAM_REELS: VideoScriptTemplate = {
    id: 'instagram_reels',
    name: 'Instagram Reels',
    description: 'Short-form vertical video for Instagram Reels',
    platform: 'instagram-reels',
    videoType: 'tips',
    useCases: ['Quick tips', 'Quick facts', 'Trending content', 'Engagement'],
    
    sections: [
        {
            id: 'hook',
            name: 'Hook',
            required: true,
            duration: 3,
            elements: ['Attention-grabbing opening', 'Question', 'Bold statement']
        },
        {
            id: 'quick_value',
            name: 'Quick Value',
            required: true,
            duration: 25,
            elements: ['Main point', 'Quick tip', 'Visual demonstration', 'Text overlays']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            duration: 2,
            elements: ['Save prompt', 'Follow prompt', 'Comment prompt']
        }
    ],
    
    minDuration: 15,
    maxDuration: 90,
    optimalDuration: 30,
    
    requiredElements: [
        'Hook in first 3 seconds',
        'One main point',
        'Visual demonstration',
        'Text overlays',
        'Save and follow CTA',
        'Fast-paced delivery'
    ],
    
    tone: 'Energetic, engaging, fast-paced',
    
    engagementTips: [
        'Hook in first 3 seconds',
        'Fast-paced delivery',
        'Use text overlays',
        'Ask to save',
        'Ask to follow',
        'Use trending sounds'
    ],
    
    systemPrompt: `You are a video scriptwriter creating engaging Instagram Reels for financial content. Your scripts are fast-paced, visual-first, and drive engagement.`,
    
    generationPromptTemplate: `Create an Instagram Reels script (30 seconds) based on: "{articleTitle}"

Main point: {mainPoint}

Structure:
- Hook (3s): {hook}
- Quick value (25s): One main tip/point
- CTA (2s): Save and follow

Requirements:
- Fast-paced
- Visual-first
- Text overlays
- Save CTA
- Follow CTA
- Energetic tone

Make it engaging and shareable.`
};

// ============================================================================
// TEMPLATE 3: TIKTOK VIDEO
// ============================================================================

export const TIKTOK_VIDEO: VideoScriptTemplate = {
    id: 'tiktok_video',
    name: 'TikTok Video',
    description: 'Short-form vertical video for TikTok',
    platform: 'tiktok',
    videoType: 'tips',
    useCases: ['Quick tips', 'Trending content', 'Viral potential', 'Engagement'],
    
    sections: [
        {
            id: 'hook',
            name: 'Hook',
            required: true,
            duration: 3,
            elements: ['Attention-grabbing opening', 'Question', 'Trending hook']
        },
        {
            id: 'quick_value',
            name: 'Quick Value',
            required: true,
            duration: 25,
            elements: ['Main point', 'Quick tip', 'Visual demonstration', 'Text overlays', 'Fast cuts']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            duration: 2,
            elements: ['Follow prompt', 'Comment prompt', 'Share prompt']
        }
    ],
    
    minDuration: 15,
    maxDuration: 180,
    optimalDuration: 30,
    
    requiredElements: [
        'Hook in first 3 seconds',
        'One main point',
        'Visual demonstration',
        'Text overlays',
        'Follow CTA',
        'Fast cuts',
        'Trending elements'
    ],
    
    tone: 'Energetic, trendy, engaging',
    
    engagementTips: [
        'Hook in first 3 seconds',
        'Use trending sounds',
        'Fast cuts',
        'Ask to follow',
        'Ask for comments',
        'Use hashtags'
    ],
    
    systemPrompt: `You are a video scriptwriter creating viral TikTok videos for financial content. Your scripts are trendy, fast-paced, and drive engagement.`,
    
    generationPromptTemplate: `Create a TikTok script (30 seconds) based on: "{articleTitle}"

Main point: {mainPoint}

Structure:
- Hook (3s): {hook}
- Quick value (25s): One main tip/point
- CTA (2s): Follow and comment

Requirements:
- Fast-paced
- Trendy
- Visual-first
- Text overlays
- Follow CTA
- Comment prompt
- Energetic tone

Make it viral-worthy.`
};

// ============================================================================
// TEMPLATE 4: YOUTUBE SHORTS
// ============================================================================

export const YOUTUBE_SHORTS: VideoScriptTemplate = {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    description: 'Short-form vertical video for YouTube Shorts',
    platform: 'shorts',
    videoType: 'tips',
    useCases: ['Quick tips', 'Quick facts', 'Engagement', 'Subscriber growth'],
    
    sections: [
        {
            id: 'hook',
            name: 'Hook',
            required: true,
            duration: 3,
            elements: ['Attention-grabbing opening', 'Question', 'Value proposition']
        },
        {
            id: 'quick_value',
            name: 'Quick Value',
            required: true,
            duration: 25,
            elements: ['Main point', 'Quick tip', 'Visual demonstration', 'Text overlays']
        },
        {
            id: 'cta',
            name: 'Call-to-Action',
            required: true,
            duration: 2,
            elements: ['Subscribe prompt', 'Like prompt', 'Comment prompt']
        }
    ],
    
    minDuration: 15,
    maxDuration: 60,
    optimalDuration: 30,
    
    requiredElements: [
        'Hook in first 3 seconds',
        'One main point',
        'Visual demonstration',
        'Text overlays',
        'Subscribe CTA',
        'Like CTA',
        'Vertical format'
    ],
    
    tone: 'Energetic, engaging, educational',
    
    engagementTips: [
        'Hook in first 3 seconds',
        'Fast-paced',
        'Visual-first',
        'Ask to subscribe',
        'Ask for likes',
        'Ask for comments'
    ],
    
    systemPrompt: `You are a video scriptwriter creating engaging YouTube Shorts for financial content. Your scripts are fast-paced, educational, and drive subscriber growth.`,
    
    generationPromptTemplate: `Create a YouTube Shorts script (30 seconds) based on: "{articleTitle}"

Main point: {mainPoint}

Structure:
- Hook (3s): {hook}
- Quick value (25s): One main tip/point
- CTA (2s): Subscribe and like

Requirements:
- Fast-paced
- Vertical format
- Visual-first
- Text overlays
- Subscribe CTA
- Like CTA
- Educational tone

Make it engaging and subscriber-focused.`
};

// ============================================================================
// TEMPLATE SELECTOR
// ============================================================================

export function selectVideoScriptTemplate(
    platform: string,
    videoType: string = 'educational'
): VideoScriptTemplate {
    const templates: Record<string, VideoScriptTemplate> = {
        'youtube_educational': YOUTUBE_EDUCATIONAL,
        'instagram_reels': INSTAGRAM_REELS,
        'tiktok': TIKTOK_VIDEO,
        'shorts': YOUTUBE_SHORTS
    };
    
    const key = `${platform}_${videoType === 'educational' ? 'educational' : videoType === 'tips' ? 'tips' : 'educational'}`;
    return templates[key] || YOUTUBE_EDUCATIONAL;
}

export function getAllVideoScriptTemplates(): VideoScriptTemplate[] {
    return [
        YOUTUBE_EDUCATIONAL,
        INSTAGRAM_REELS,
        TIKTOK_VIDEO,
        YOUTUBE_SHORTS
    ];
}
