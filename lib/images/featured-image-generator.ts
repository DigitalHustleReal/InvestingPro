/**
 * 🖼️ PRODUCTION FEATURED IMAGE GENERATOR
 * 
 * Creates optimized featured images for articles with:
 * - Text overlays (title, branding)
 * - Multiple social media formats
 * - Brand consistency
 * - Open Graph optimization
 * 
 * OUTPUT FORMATS:
 * - Article Header: 1920x1080 (16:9)
 * - Open Graph: 1200x630
 * - Twitter Card: 1200x600
 * - LinkedIn: 1200x627
 * - Square (Instagram): 1080x1080
 * 
 * FEATURES:
 * - Automatic text positioning
 * - Brand color overlays
 * - Logo placement
 * - Quality optimization
 * - Multiple format generation in one call
 */

import sharp from 'sharp';
import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import { getThemePalette } from '../theme/brand-theme';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface FeaturedImageOptions {
    source_image_url: string; // Base image
    title: string; // Article title
    subtitle?: string; // Category or author
    format?: ImageFormat | 'all';
    brand_overlay?: boolean;
    add_logo?: boolean;
}

export type ImageFormat = 'header' | 'og' | 'twitter' | 'linkedin' | 'square';

export interface GeneratedImage {
    format: ImageFormat;
    width: number;
    height: number;
    buffer: Buffer;
    filename: string;
    url?: string; // After upload
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const FORMATS = {
    header: { width: 1920, height: 1080, name: 'Article Header' },
    og: { width: 1200, height: 630, name: 'Open Graph' },
    twitter: { width: 1200, height: 600, name: 'Twitter Card' },
    linkedin: { width: 1200, height: 627, name: 'LinkedIn' },
    square: { width: 1080, height: 1080, name: 'Instagram Square' }
};

const BRAND_THEME = getThemePalette('light');

const BRAND_CONFIG = {
    primary_color: BRAND_THEME.primary,
    secondary_color: BRAND_THEME.primaryStrong,
    accent_color: BRAND_THEME.accent,
    dark_overlay: BRAND_THEME.overlay.dark, // Dark overlay for text readability
    font_family: 'Inter', // Would need to load font file
    logo_path: 'public/images/logo.png' // Adjust path as needed
};

// ============================================================================
// UTILITY: DOWNLOAD IMAGE
// ============================================================================

async function downloadImage(url: string): Promise<Buffer> {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 10000
        });
        return Buffer.from(response.data);
    } catch (error) {
        throw new Error(`Failed to download image from ${url}`);
    }
}

// ============================================================================
// IMAGE PROCESSING
// ============================================================================

async function createFeaturedImage(
    sourceBuffer: Buffer,
    title: string,
    subtitle: string | undefined,
    format: ImageFormat,
    brandOverlay: boolean = true,
    addLogo: boolean = true
): Promise<GeneratedImage> {
    const formatConfig = FORMATS[format];
    
    console.log(`🎨 Creating ${formatConfig.name} (${formatConfig.width}x${formatConfig.height})`);
    
    try {
        // Resize and crop source image
        let image = sharp(sourceBuffer)
            .resize(formatConfig.width, formatConfig.height, {
                fit: 'cover',
                position: 'center'
            });
        
        // Apply dark overlay for text readability
        if (brandOverlay) {
            const overlayBuffer = Buffer.from(
                `<svg width="${formatConfig.width}" height="${formatConfig.height}">
                    <rect width="${formatConfig.width}" height="${formatConfig.height}" 
                          fill="${BRAND_CONFIG.dark_overlay}"/>
                </svg>`
            );
            
            image = image.composite([{
                input: overlayBuffer,
                blend: 'over'
            }]);
        }
        
        // Add title text
        const titleSVG = createTitleSVG(
            title,
            subtitle,
            formatConfig.width,
            formatConfig.height
        );
        
        image = image.composite([{
            input: Buffer.from(titleSVG),
            top: 0,
            left: 0
        }]);
        
        // Add logo (optional)
        if (addLogo) {
            try {
                const logoExists = await fs.access(BRAND_CONFIG.logo_path).then(() => true).catch(() => false);
                if (logoExists) {
                    const logo = await sharp(BRAND_CONFIG.logo_path)
                        .resize(150, null, { withoutEnlargement: true })
                        .toBuffer();
                    
                    image = image.composite([{
                        input: logo,
                        gravity: 'southeast',
                        blend: 'over'
                    }]);
                }
            } catch (error) {
                // Logo not available, skip
                console.log('ℹ️ Logo not found, skipping');
            }
        }
        
        // Generate final buffer
        const buffer = await image
            .png({ quality: 90 })
            .toBuffer();
        
        const filename = `featured-${format}-${Date.now()}.png`;
        
        return {
            format,
            width: formatConfig.width,
            height: formatConfig.height,
            buffer,
            filename
        };
    } catch (error) {
        throw new Error(`Failed to create ${format} image: ${error}`);
    }
}

// ============================================================================
// SVG TEXT OVERLAY
// ============================================================================

function createTitleSVG(
    title: string,
    subtitle: string | undefined,
    width: number,
    height: number
): string {
    // Truncate title if too long
    const maxChars = width === 1080 ? 40 : 60;
    const displayTitle = title.length > maxChars 
        ? title.substring(0, maxChars - 3) + '...'
        : title;
    
    // Calculate font sizes based on image dimensions
    const titleFontSize = Math.floor(width / 20);
    const subtitleFontSize = Math.floor(width / 35);
    
    // Center text vertically
    const titleY = height / 2 - (subtitle ? 50 : 0);
    const subtitleY = height / 2 + 50;
    
    return `
        <svg width="${width}" height="${height}">
            <defs>
                <style>
                    .title {
                        font-family: 'Inter', 'Arial', sans-serif;
                        font-size: ${titleFontSize}px;
                        font-weight: 700;
                        fill: #FFFFFF;
                        text-anchor: middle;
                    }
                    .subtitle {
                        font-family: 'Inter', 'Arial', sans-serif;
                        font-size: ${subtitleFontSize}px;
                        font-weight: 500;
                        fill: ${BRAND_CONFIG.primary_color};
                        text-anchor: middle;
                    }
                </style>
            </defs>
            
            <!-- Title -->
            <text x="${width / 2}" y="${titleY}" class="title">
                ${escapeXML(displayTitle)}
            </text>
            
            ${subtitle ? `
            <!-- Subtitle -->
            <text x="${width / 2}" y="${subtitleY}" class="subtitle">
                ${escapeXML(subtitle)}
            </text>
            ` : ''}
            
            <!-- Brand accent line -->
            <line x1="${width / 2 - 100}" y1="${titleY + 20}" 
                  x2="${width / 2 + 100}" y2="${titleY + 20}" 
                  stroke="${BRAND_CONFIG.primary_color}" 
                  stroke-width="4"/>
        </svg>
    `.trim();
}

function escapeXML(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ============================================================================
// MAIN EXPORT: FEATURED IMAGE GENERATOR
// ============================================================================

export class FeaturedImageGenerator {
    /**
     * Generate featured image(s) from source
     */
    async generate(options: FeaturedImageOptions): Promise<GeneratedImage[]> {
        console.log(`\n🖼️ Generating featured images...`);
        console.log(`   Source: ${options.source_image_url}`);
        console.log(`   Title: "${options.title}"`);
        
        // Download source image
        const sourceBuffer = await downloadImage(options.source_image_url);
        
        // Determine which formats to generate
        const formatsToGenerate: ImageFormat[] = options.format === 'all'
            ? Object.keys(FORMATS) as ImageFormat[]
            : [options.format || 'header'];
        
        const results: GeneratedImage[] = [];
        
        for (const format of formatsToGenerate) {
            try {
                const generated = await createFeaturedImage(
                    sourceBuffer,
                    options.title,
                    options.subtitle,
                    format,
                    options.brand_overlay ?? true,
                    options.add_logo ?? true
                );
                results.push(generated);
                
                console.log(`✅ Generated ${format} image`);
            } catch (error) {
                console.error(`Failed to generate ${format} image:`, error);
            }
        }
        
        return results;
    }
    
    /**
     * Generate and save to filesystem
     */
    async generateAndSave(
        options: FeaturedImageOptions,
        outputDir: string = 'public/images/featured'
    ): Promise<string[]> {
        const images = await this.generate(options);
        const savedPaths: string[] = [];
        
        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });
        
        for (const image of images) {
            const filepath = path.join(outputDir, image.filename);
            await fs.writeFile(filepath, image.buffer);
            savedPaths.push(filepath);
            console.log(`💾 Saved: ${filepath}`);
        }
        
        return savedPaths;
    }
    
    /**
     * Generate simple text overlay on solid color background
     */
    async generateSimple(
        title: string,
        format: ImageFormat = 'og',
        backgroundColor: string = BRAND_CONFIG.secondary_color
    ): Promise<GeneratedImage> {
        const formatConfig = FORMATS[format];
        
        // Create solid color background
        const bgSVG = `
            <svg width="${formatConfig.width}" height="${formatConfig.height}">
                <rect width="${formatConfig.width}" height="${formatConfig.height}" 
                      fill="${backgroundColor}"/>
            </svg>
        `;
        
        const buffer = await sharp(Buffer.from(bgSVG))
            .composite([{
                input: Buffer.from(createTitleSVG(title, undefined, formatConfig.width, formatConfig.height)),
                top: 0,
                left: 0
            }])
            .png()
            .toBuffer();
        
        return {
            format,
            width: formatConfig.width,
            height: formatConfig.height,
            buffer,
            filename: `simple-${format}-${Date.now()}.png`
        };
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const featuredImageGenerator = new FeaturedImageGenerator();

// ============================================================================
// UTILITY: BATCH GENERATION
// ============================================================================

/**
 * Generate featured images for multiple articles
 */
export async function batchGenerateFeaturedImages(
    articles: Array<{
        title: string;
        source_image_url: string;
        category?: string;
    }>,
    outputDir?: string
): Promise<Record<string, string[]>> {
    const results: Record<string, string[]> = {};
    
    for (const article of articles) {
        try {
            const paths = await featuredImageGenerator.generateAndSave({
                source_image_url: article.source_image_url,
                title: article.title,
                subtitle: article.category,
                format: 'all'
            }, outputDir);
            
            results[article.title] = paths;
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Failed to generate for "${article.title}":`, error);
            results[article.title] = [];
        }
    }
    
    return results;
}
