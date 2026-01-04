/**
 * Auto Alt-Text Generation API
 * Generates descriptive alt text for images using AI vision
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
    try {
        const { imageUrl, context = '' } = await request.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
        }

        console.log('🖼️ Generating alt text for:', imageUrl);

        // Generate alt text with context
        const altText = await generateAltText(imageUrl, context);
        
        console.log('✅ Generated alt text:', altText);

        return NextResponse.json({
            altText,
            length: altText.length,
            source: 'ai-vision'
        });

    } catch (error: any) {
        console.error('Alt text generation error:', error);
        
        // Fallback to context-based
        const { context = '', imageUrl = '' } = await request.json();
        const fallback = generateFallbackAltText(imageUrl, context);
        
        return NextResponse.json({
            altText: fallback,
            length: fallback.length,
            source: 'fallback',
            error: 'Using context-based fallback'
        });
    }
}

async function generateAltText(imageUrl: string, context: string): Promise<string> {
    try {
        // Check if GPT-4 Vision is available
        if (!process.env.OPENAI_API_KEY) {
            return generateFallbackAltText(imageUrl, context);
        }

        const prompt = context 
            ? `Describe this image for alt text. Context: This image is used in an article about "${context}". 

Write a concise, descriptive alt text (max 125 characters) that:
- Describes what's visible in the image
- Relates to the context: ${context}
- Is SEO-friendly
- Helps visually impaired users

Respond with ONLY the alt text, nothing else.`
            : `Describe this image for alt text in max 125 characters. Focus on what's visible and make it SEO-friendly. Respond with ONLY the alt text.`;

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_VISION_MODEL || 'gpt-4-vision-preview',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl,
                                detail: 'low' // Cheaper, faster
                            }
                        }
                    ]
                }
            ],
            max_tokens: 100,
            temperature: 0.5
        });

        const altText = response.choices[0]?.message?.content?.trim() || '';
        
        // Validate length (alt text should be under 125 chars)
        if (altText.length > 125) {
            return altText.substring(0, 122) + '...';
        }

        return altText || generateFallbackAltText(imageUrl, context);

    } catch (error) {
        console.error('AI vision failed:', error);
        return generateFallbackAltText(imageUrl, context);
    }
}

function generateFallbackAltText(imageUrl: string, context: string): string {
    // Extract filename for basic description
    const filename = imageUrl.split('/').pop()?.split('?')[0] || 'image';
    const name = filename
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ')    // Replace dashes/underscores with spaces
        .replace(/\d+/g, '')       // Remove numbers
        .trim();

    if (context) {
        return `${context} - ${name || 'illustration'}`.substring(0, 125);
    }

    if (name && name.length > 3) {
        return `Image showing ${name}`.substring(0, 125);
    }

    return 'Relevant illustration for article';
}
