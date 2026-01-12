/**
 * 🎨 INFOGRAPHIC GENERATOR
 * 
 * 100% Automated Infographic Generation
 * 
 * Process:
 * 1. Extract data from article
 * 2. Generate precise infographic prompt
 * 3. Generate infographic with AI (DALL-E 3)
 * 4. Optimize for platform
 * 5. Save and cache
 */

import { infographicPromptGenerator, InfographicPromptOptions } from '@/lib/prompts/infographic-prompts';
import { selectInfographicTemplate } from '@/lib/templates/infographic-templates';
import { aiImageGenerator } from '@/lib/images/ai-image-generator';
import { logger } from '@/lib/logger';

export interface InfographicGenerationResult {
    infographicUrl: string | null;
    infographicType: string;
    dataStructure: any;
    platform: string;
    generationCost: number;
    cached: boolean;
}

/**
 * Generate infographic automatically
 */
export async function generateInfographic(params: {
    articleTitle: string;
    articleContent: string;
    category: string;
    infographicType: 'comparison' | 'timeline' | 'process' | 'statistics' | 'data-visualization' | 'flowchart';
    targetPlatform?: 'social' | 'article' | 'newsletter';
    dataPoints?: Array<{ label: string; value: number | string; unit?: string }>;
}): Promise<InfographicGenerationResult> {
    const {
        articleTitle,
        articleContent,
        category,
        infographicType,
        targetPlatform = 'article',
        dataPoints
    } = params;
    
    logger.info('Generating infographic', { articleTitle, infographicType, category });
    
    try {
        // Get template
        const template = selectInfographicTemplate(infographicType, targetPlatform);
        
        // Generate prompt
        const promptOptions: InfographicPromptOptions = {
            articleTitle,
            articleContent,
            category,
            infographicType,
            targetPlatform,
            dataPoints
        };
        
        const promptResult = infographicPromptGenerator.generate(promptOptions);
        
        // Generate image with AI
        const imageResult = await aiImageGenerator.generate({
            prompt: promptResult.prompt,
            style: 'infographic' as any,
            size: targetPlatform === 'social' ? '1200x1200' as any : '1920x1080' as any,
            quality: 'hd',
            brand_guidelines: true
        });
        
        return {
            infographicUrl: imageResult.url,
            infographicType,
            dataStructure: promptResult.dataStructure,
            platform: targetPlatform,
            generationCost: imageResult.cost_usd,
            cached: imageResult.cached || false
        };
        
    } catch (error) {
        logger.error('Infographic generation failed', error as Error);
        return {
            infographicUrl: null,
            infographicType,
            dataStructure: null,
            platform: targetPlatform,
            generationCost: 0,
            cached: false
        };
    }
}

/**
 * Generate multiple infographics from article
 */
export async function generateArticleInfographics(params: {
    articleTitle: string;
    articleContent: string;
    category: string;
}): Promise<InfographicGenerationResult[]> {
    const { articleTitle, articleContent, category } = params;
    
    const infographics: InfographicGenerationResult[] = [];
    
    // Determine which infographic types to generate based on content
    const infographicTypes: Array<'comparison' | 'timeline' | 'process' | 'statistics' | 'data-visualization' | 'flowchart'> = [];
    
    // Check for comparison content
    if (articleContent.toLowerCase().includes('vs') || articleContent.toLowerCase().includes('compare')) {
        infographicTypes.push('comparison');
    }
    
    // Check for process content
    if (articleContent.toLowerCase().includes('step') || articleContent.toLowerCase().includes('process')) {
        infographicTypes.push('process');
    }
    
    // Check for statistics
    if (articleContent.match(/\d+%/) || articleContent.match(/₹\s*\d+/)) {
        infographicTypes.push('statistics');
    }
    
    // Always generate at least one statistics infographic
    if (infographicTypes.length === 0) {
        infographicTypes.push('statistics');
    }
    
    // Generate infographics
    for (const type of infographicTypes.slice(0, 2)) { // Max 2 infographics per article
        try {
            const result = await generateInfographic({
                articleTitle,
                articleContent,
                category,
                infographicType: type,
                targetPlatform: 'social' // Optimize for social sharing
            });
            
            infographics.push(result);
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            logger.error(`Failed to generate ${type} infographic`, error as Error);
        }
    }
    
    return infographics;
}
