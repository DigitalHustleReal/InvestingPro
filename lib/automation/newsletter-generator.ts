/**
 * 📧 NEWSLETTER GENERATOR
 * 
 * 100% Automated Newsletter Generation
 * 
 * Process:
 * 1. Curate articles for newsletter
 * 2. Generate newsletter prompt
 * 3. Generate newsletter content with AI
 * 4. Format as HTML email
 * 5. Schedule and send
 */

import { newsletterPromptGenerator, NewsletterPromptOptions } from '@/lib/prompts/newsletter-prompts';
import { selectNewsletterTemplate } from '@/lib/templates/newsletter-templates';
import { multiProviderAI } from '@/lib/ai/providers/multi-provider';
import { logger } from '@/lib/logger';

export interface NewsletterGenerationResult {
    newsletterType: string;
    htmlContent: string;
    textContent: string;
    subject: string;
    sections: Array<{ name: string; content: string }>;
    cta: string;
}

/**
 * Generate newsletter automatically
 */
export async function generateNewsletter(params: {
    newsletterType: 'weekly' | 'monthly' | 'promotional' | 'digest';
    articles: Array<{ title: string; excerpt: string; url: string; category: string }>;
    category?: string;
    personalization?: {
        subscriberName?: string;
        preferences?: string[];
    };
    includeStats?: boolean;
    includeTrends?: boolean;
}): Promise<NewsletterGenerationResult> {
    const {
        newsletterType,
        articles,
        category,
        personalization,
        includeStats = true,
        includeTrends = true
    } = params;
    
    logger.info('Generating newsletter', { newsletterType, articleCount: articles.length });
    
    try {
        // Get template
        const template = selectNewsletterTemplate(newsletterType);
        
        // Generate prompt
        const promptOptions: NewsletterPromptOptions = {
            newsletterType,
            articles,
            category,
            personalization,
            includeStats,
            includeTrends
        };
        
        const promptResult = newsletterPromptGenerator.generate(promptOptions);
        
        // Generate content with AI
        const aiResult = await multiProviderAI.generate({
            prompt: promptResult.prompt,
            priority: 'quality', // Quality for newsletters
            maxTokens: 2000
        });
        
        // Parse result (assuming HTML format)
        const htmlContent = aiResult.content.includes('<html') 
            ? aiResult.content 
            : convertToHTML(aiResult.content, promptResult.sections);
        
        // Generate subject line
        const subject = generateNewsletterSubject(newsletterType, articles[0]?.title || 'Financial Insights');
        
        return {
            newsletterType,
            htmlContent,
            textContent: stripHTML(htmlContent),
            subject,
            sections: promptResult.sections,
            cta: promptResult.cta
        };
        
    } catch (error) {
        logger.error('Newsletter generation failed', error as Error);
        throw error;
    }
}

/**
 * Convert markdown/text to HTML email format
 */
function convertToHTML(content: string, sections: Array<{ name: string; content: string }>): string {
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
`;
    
    // Add header
    html += `
    <header style="text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981;">
        <h1 style="color: #10b981; margin: 0;">InvestingPro Newsletter</h1>
        <p style="color: #666; margin: 5px 0;">${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
    </header>
    `;
    
    // Add content
    html += `
    <main style="padding: 20px 0;">
        ${content.replace(/\n/g, '<br>')}
    </main>
    `;
    
    // Add footer
    html += `
    <footer style="text-align: center; padding: 20px 0; border-top: 1px solid #ddd; margin-top: 30px; font-size: 12px; color: #666;">
        <p>You're receiving this because you subscribed to InvestingPro newsletter.</p>
        <p><a href="#" style="color: #10b981;">Unsubscribe</a> | <a href="#" style="color: #10b981;">Contact Us</a></p>
        <p>&copy; ${new Date().getFullYear()} InvestingPro. All rights reserved.</p>
    </footer>
    </body>
</html>
    `;
    
    return html;
}

/**
 * Strip HTML tags for text version
 */
function stripHTML(html: string): string {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

/**
 * Generate newsletter subject line
 */
function generateNewsletterSubject(newsletterType: string, mainTitle: string): string {
    const subjects: Record<string, string> = {
        weekly: `Weekly Financial Insights: ${mainTitle.substring(0, 40)}`,
        monthly: `Monthly Digest: Your Financial Guide for ${new Date().toLocaleDateString('en-IN', { month: 'long' })}`,
        promotional: `Special: ${mainTitle.substring(0, 50)}`,
        digest: `Quick Digest: ${mainTitle.substring(0, 40)}`
    };
    
    return subjects[newsletterType] || `InvestingPro Newsletter: ${mainTitle.substring(0, 40)}`;
}
