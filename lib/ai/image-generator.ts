/**
 * AI Image Generation System
 * 
 * Automatically generates:
 * - Featured images for articles
 * - In-article illustrations
 * - Charts and graphics
 * 
 * Uses DALL-E 3 for high-quality, brand-consistent images
 */

import OpenAI from 'openai'

// Lazy initialization - only create when needed
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openaiClient;
}

/**
 * Brand colors for image generation
 */
const BRAND_COLORS = {
  primary: '#10b981', // emerald-500
  secondary: '#059669', // emerald-600
  accent: '#f59e0b', // amber-500
  background: '#f8fafc' // slate-50
}

/**
 * Generate featured image for article
 */
export async function generateFeaturedImage(articleTitle: string, category: string): Promise<string | null> {
  try {
    const openai = getOpenAI();
    const prompt = createFeaturedImagePrompt(articleTitle, category)
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1792x1024', // 16:9 aspect ratio (perfect for featured images)
      quality: 'hd',
      n: 1,
      style: 'natural' // More professional than 'vivid'
    })
    
    return response.data[0]?.url || null
  } catch (error) {
    console.error('Error generating featured image:', error)
    return null
  }
}

/**
 * Generate in-article illustration
 */
export async function generateArticleIllustration(concept: string, style: 'chart' | 'diagram' | 'infographic' = 'infographic'): Promise<string | null> {
  try {
    const openai = getOpenAI();
    const prompt = createIllustrationPrompt(concept, style)
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024', // Square for in-article use
      quality: 'standard', // Faster and cheaper for in-article images
      n: 1,
      style: 'natural'
    })
    
    return response.data[0]?.url || null
  } catch (error) {
    console.error('Error generating illustration:', error)
    return null
  }
}

/**
 * Create prompt for featured image
 */
function createFeaturedImagePrompt(title: string, category: string): string {
  const categoryStyles = {
    credit_cards: 'modern credit cards, premium banking, financial technology',
    mutual_funds: 'stock market graphs, investment growth, financial planning charts',
    personal_loans: 'money transfer, personal finance, financial security',
    insurance: 'protection shield, family security, safety umbrella',
    investing: 'upward trending charts, wealth growth, investment portfolio',
    tax: 'calculator, tax documents, financial planning',
    credit_score: 'credit rating gauge, score improvement, financial health',
    fixed_deposits: 'savings growth, compound interest, secure investment',
    home_loans: 'dream home, house keys, mortgage approval',
    gold_investment: 'gold bars, precious metals, safe haven investment'
  }

  const styleElements = categoryStyles[category as keyof typeof categoryStyles] || 'financial growth and success'

  return `Create a professional, modern featured image for a financial article titled "${title}".

Style requirements:
- Clean, minimalist design with emerald green (#10b981) as primary color
- Professional, trustworthy aesthetic suitable for finance/business
- Include relevant visual metaphors: ${styleElements}
- Flat design or subtle gradients
- No text overlays or logos
- High contrast, easily readable
- Modern, contemporary style
- Convey professionalism and trust

Color palette:
- Primary: Emerald green (#10b981)
- Accent: Amber/gold (#f59e0b)
- Background: Light gray/white (#f8fafc)
- Supporting: Deep blue, slate gray

The image should look like it belongs on a premium financial website like Bloomberg or Investopedia.`
}

/**
 * Create prompt for in-article illustration
 */
function createIllustrationPrompt(concept: string, style: 'chart' | 'diagram' | 'infographic'): string {
  const styleDescriptions = {
    chart: 'Clean, professional data visualization chart with emerald green bars/lines',
    diagram: 'Simple flowchart or process diagram with emerald green accents',
    infographic: 'Modern infographic illustration with icons and emerald green theme'
  }

  return `Create a ${style} illustrating "${concept}".

Requirements:
- ${styleDescriptions[style]}
- Minimalist, clean design
- Emerald green (#10b981) as primary color
- Professional, suitable for financial content
- Clear, easy to understand
- No text labels (will be added separately)
- Transparent or white background
- High quality, HD resolution

The illustration should complement financial article content and match InvestingPro brand aesthetic.`
}

/**
 * Download and save image to Supabase Storage
 */
export async function downloadAndSaveImage(imageUrl: string, fileName: string): Promise<string | null> {
  try {
    // Download image
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    
    // Convert to base64 for Supabase
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload to Supabase Storage
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(`ai-generated/${fileName}`, buffer, {
        contentType: blob.type,
        upsert: false
      })
    
    if (error) {
      console.error('Error uploading to Supabase:', error)
      return null
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path)
    
    return publicUrlData.publicUrl
  } catch (error) {
    console.error('Error downloading/saving image:', error)
    return null
  }
}

/**
 * Generate complete article with images
 */
export async function generateArticleWithImages(
  title: string,
  category: string,
  bodyHtml: string
): Promise<{
  featuredImage: string | null
  bodyWithImages: string
}> {
  try {
    // Generate featured image
    const featuredImageUrl = await generateFeaturedImage(title, category)
    let featuredImage: string | null = null
    
    if (featuredImageUrl) {
      const fileName = `featured-${Date.now()}-${slugify(title)}.png`
      featuredImage = await downloadAndSaveImage(featuredImageUrl, fileName)
    }
    
    // TODO: Parse bodyHtml and insert illustrations at strategic points
    // For now, return original body
    const bodyWithImages = bodyHtml
    
    return {
      featuredImage,
      bodyWithImages
    }
  } catch (error) {
    console.error('Error generating article with images:', error)
    return {
      featuredImage: null,
      bodyWithImages: bodyHtml
    }
  }
}

/**
 * Helper: Create URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)
}

/**
 * Cost estimation
 */
export const IMAGE_COSTS = {
  featured_hd: 0.080, // DALL-E 3 HD 1792x1024
  featured_standard: 0.040, // DALL-E 3 Standard 1792x1024
  illustration_hd: 0.080, // DALL-E 3 HD 1024x1024
  illustration_standard: 0.040 // DALL-E 3 Standard 1024x1024
}

export function estimateImageCost(
  featuredImages: number = 1,
  illustrations: number = 2,
  useHD: boolean = true
): number {
  const featuredCost = featuredImages * (useHD ? IMAGE_COSTS.featured_hd : IMAGE_COSTS.featured_standard)
  const illustrationCost = illustrations * (useHD ? IMAGE_COSTS.illustration_hd : IMAGE_COSTS.illustration_standard)
  return featuredCost + illustrationCost
}
