/**
 * Theme Color Image Editor
 * 
 * Applies brand theme colors to images:
 * - Color overlays (tinting)
 * - Brand color filters
 * - Graphics generation in theme colors
 * - Automated brand consistency
 * 
 * Uses Cloudinary transformations + Sharp for server-side processing
 */

import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { getThemePalette, getCategoryAccent } from '@/lib/theme/brand-theme';
import type { FinanceCategory } from '@/lib/prompts/category-prompts';

export interface ThemeColorOptions {
    /**
     * Theme color to apply
     */
    color?: 'primary' | 'secondary' | 'accent' | 'category';
    
    /**
     * Category for category-specific colors
     */
    category?: FinanceCategory;
    
    /**
     * Overlay opacity (0-100)
     */
    opacity?: number;
    
    /**
     * Blend mode: 'overlay', 'multiply', 'screen', 'soft-light'
     */
    blendMode?: 'overlay' | 'multiply' | 'screen' | 'soft-light' | 'color';
    
    /**
     * Apply as filter (subtle) or overlay (strong)
     */
    intensity?: 'subtle' | 'medium' | 'strong';
}

export interface GraphicsOptions {
    /**
     * Graphics type
     */
    type: 'quote-card' | 'stat-card' | 'cta-banner' | 'icon' | 'badge';
    
    /**
     * Text content
     */
    text?: string;
    
    /**
     * Subtitle/description
     */
    subtitle?: string;
    
    /**
     * Dimensions
     */
    width?: number;
    height?: number;
    
    /**
     * Theme color
     */
    themeColor?: 'primary' | 'secondary' | 'accent' | 'category';
    
    /**
     * Category for category-specific colors
     */
    category?: FinanceCategory;
    
    /**
     * Background style
     */
    background?: 'solid' | 'gradient' | 'transparent';
}

/**
 * Get theme color hex value
 */
function getThemeColor(
    color: 'primary' | 'secondary' | 'accent' | 'category',
    category?: FinanceCategory
): string {
    const theme = getThemePalette('light');
    
    switch (color) {
        case 'primary':
            return theme.primary; // #14B8A6
        case 'secondary':
            return theme.secondary; // #0EA5E9
        case 'accent':
            return theme.accent; // #F59E0B
        case 'category':
            if (category) {
                return getCategoryAccent(category) || theme.primary;
            }
            return theme.primary;
        default:
            return theme.primary;
    }
}

/**
 * Apply theme color overlay to image using Cloudinary
 */
export function applyThemeColorOverlay(
    publicId: string,
    options: ThemeColorOptions = {}
): string {
    const {
        color = 'primary',
        category,
        opacity = 30,
        blendMode = 'overlay',
        intensity = 'medium'
    } = options;
    
    const themeColor = getThemeColor(color, category);
    
    // Convert hex to RGB
    const hex = themeColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust opacity based on intensity
    const finalOpacity = intensity === 'subtle' 
        ? Math.floor(opacity * 0.5)
        : intensity === 'strong'
        ? Math.floor(opacity * 1.5)
        : opacity;
    
    // Cloudinary transformation
    const transformation = [
        {
            colorize: `${finalOpacity}:${r}:${g}:${b}`,
            effect: blendMode === 'overlay' ? 'overlay' : undefined,
        },
        {
            quality: 'auto',
            fetch_format: 'auto'
        }
    ];
    
    return cloudinary.url(publicId, {
        transformation: transformation.filter(t => t !== undefined)
    });
}

/**
 * Apply theme color filter to image (server-side with Sharp)
 */
export async function applyThemeColorFilter(
    imageBuffer: Buffer,
    options: ThemeColorOptions = {}
): Promise<Buffer> {
    const {
        color = 'primary',
        category,
        opacity = 20,
        blendMode = 'overlay',
        intensity = 'medium'
    } = options;
    
    const themeColor = getThemeColor(color, category);
    
    // Adjust opacity based on intensity
    const finalOpacity = intensity === 'subtle' 
        ? opacity * 0.5
        : intensity === 'strong'
        ? opacity * 1.5
        : opacity;
    
    // Get image dimensions
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 630;
    
    // Create color overlay
    const overlaySVG = `
        <svg width="${width}" height="${height}">
            <rect width="${width}" height="${height}" 
                  fill="${themeColor}" 
                  opacity="${finalOpacity / 100}"/>
        </svg>
    `;
    
    // Apply overlay
    const result = await sharp(imageBuffer)
        .composite([{
            input: Buffer.from(overlaySVG),
            blend: blendMode === 'overlay' ? 'over' : 'multiply'
        }])
        .png()
        .toBuffer();
    
    return result;
}

/**
 * Generate graphics in theme colors
 */
export async function generateThemeGraphics(
    options: GraphicsOptions
): Promise<Buffer> {
    const {
        type,
        text = '',
        subtitle,
        width = 1200,
        height = 630,
        themeColor = 'primary',
        category,
        background = 'gradient'
    } = options;
    
    const color = getThemeColor(themeColor, category);
    const theme = getThemePalette('light');
    
    // Get background based on style
    let bgSVG: string;
    
    if (background === 'solid') {
        bgSVG = `<rect width="${width}" height="${height}" fill="${color}"/>`;
    } else if (background === 'gradient') {
        const secondaryColor = themeColor === 'primary' 
            ? theme.primaryStrong 
            : themeColor === 'secondary'
            ? theme.secondaryStrong
            : theme.accentStrong;
        
        bgSVG = `
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#grad)"/>
        `;
    } else {
        bgSVG = `<rect width="${width}" height="${height}" fill="transparent"/>`;
    }
    
    // Generate SVG based on type
    let contentSVG = '';
    
    switch (type) {
        case 'quote-card':
            contentSVG = `
                <text x="${width / 2}" y="${height / 2 - 30}" 
                      font-family="Inter, Arial, sans-serif" 
                      font-size="32" 
                      font-weight="700" 
                      fill="#FFFFFF" 
                      text-anchor="middle">
                    "${text}"
                </text>
                ${subtitle ? `
                <text x="${width / 2}" y="${height / 2 + 30}" 
                      font-family="Inter, Arial, sans-serif" 
                      font-size="18" 
                      font-weight="500" 
                      fill="#FFFFFF" 
                      opacity="0.9"
                      text-anchor="middle">
                    ${subtitle}
                </text>
                ` : ''}
            `;
            break;
            
        case 'stat-card':
            contentSVG = `
                <text x="${width / 2}" y="${height / 2 - 20}" 
                      font-family="Inter, Arial, sans-serif" 
                      font-size="24" 
                      font-weight="500" 
                      fill="#FFFFFF" 
                      opacity="0.8"
                      text-anchor="middle">
                    ${subtitle || 'Statistic'}
                </text>
                <text x="${width / 2}" y="${height / 2 + 40}" 
                      font-family="Inter, Arial, sans-serif" 
                      font-size="48" 
                      font-weight="700" 
                      fill="#FFFFFF" 
                      text-anchor="middle">
                    ${text}
                </text>
            `;
            break;
            
        case 'cta-banner':
            contentSVG = `
                <text x="${width / 2}" y="${height / 2}" 
                      font-family="Inter, Arial, sans-serif" 
                      font-size="36" 
                      font-weight="700" 
                      fill="#FFFFFF" 
                      text-anchor="middle">
                    ${text}
                </text>
                ${subtitle ? `
                <text x="${width / 2}" y="${height / 2 + 50}" 
                      font-family="Inter, Arial, sans-serif" 
                      font-size="20" 
                      font-weight="500" 
                      fill="#FFFFFF" 
                      opacity="0.9"
                      text-anchor="middle">
                    ${subtitle}
                </text>
                ` : ''}
            `;
            break;
            
        case 'icon':
            // Simple icon placeholder
            contentSVG = `
                <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 3}" 
                        fill="#FFFFFF" opacity="0.9"/>
            `;
            break;
            
        case 'badge':
            contentSVG = `
                <rect x="${width * 0.1}" y="${height * 0.2}" 
                      width="${width * 0.8}" height="${height * 0.6}" 
                      rx="20" fill="#FFFFFF" opacity="0.2"/>
                <text x="${width / 2}" y="${height / 2 + 10}" 
                      font-family="Inter, Arial, sans-serif" 
                      font-size="28" 
                      font-weight="700" 
                      fill="#FFFFFF" 
                      text-anchor="middle">
                    ${text}
                </text>
            `;
            break;
    }
    
    // Combine SVG
    const fullSVG = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            ${bgSVG}
            ${contentSVG}
        </svg>
    `;
    
    // Convert to PNG buffer
    const buffer = await sharp(Buffer.from(fullSVG))
        .png()
        .toBuffer();
    
    return buffer;
}

/**
 * Apply theme color to existing image URL (Cloudinary)
 */
export function getThemedImageUrl(
    imageUrl: string,
    options: ThemeColorOptions = {}
): string {
    // If already a Cloudinary URL, extract publicId
    const cloudinaryMatch = imageUrl.match(/\/v\d+\/(.+)\.(jpg|png|webp)/);
    
    if (cloudinaryMatch) {
        const publicId = cloudinaryMatch[1];
        return applyThemeColorOverlay(publicId, options);
    }
    
    // If external URL, upload first then apply (would need async handling)
    // For now, return original URL
    return imageUrl;
}

/**
 * Generate quote card with theme colors
 */
export async function generateQuoteCard(
    quote: string,
    author?: string,
    category?: FinanceCategory
): Promise<Buffer> {
    return generateThemeGraphics({
        type: 'quote-card',
        text: quote,
        subtitle: author,
        width: 1200,
        height: 630,
        themeColor: 'primary',
        category,
        background: 'gradient'
    });
}

/**
 * Generate stat card with theme colors
 */
export async function generateStatCard(
    value: string,
    label: string,
    category?: FinanceCategory
): Promise<Buffer> {
    return generateThemeGraphics({
        type: 'stat-card',
        text: value,
        subtitle: label,
        width: 800,
        height: 400,
        themeColor: 'primary',
        category,
        background: 'gradient'
    });
}

/**
 * Generate CTA banner with theme colors
 */
export async function generateCTABanner(
    text: string,
    subtitle?: string,
    category?: FinanceCategory
): Promise<Buffer> {
    return generateThemeGraphics({
        type: 'cta-banner',
        text,
        subtitle,
        width: 1200,
        height: 300,
        themeColor: 'accent',
        category,
        background: 'gradient'
    });
}
