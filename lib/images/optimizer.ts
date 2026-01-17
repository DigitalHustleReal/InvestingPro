/**
 * Image Optimization Service
 * 
 * Automatically optimizes images for web:
 * - Compression (reduce file size)
 * - Format conversion (WebP)
 * - Responsive image generation
 * - Lazy loading support
 * 
 * Uses:
 * - Cloudinary (if configured) - preferred
 * - Sharp (fallback) - for local processing
 * - Browser Image Compression (client-side fallback)
 */

import { logger } from '@/lib/logger';

export interface ImageOptimizationOptions {
    quality?: number; // 1-100, default 80
    format?: 'webp' | 'jpg' | 'png' | 'auto';
    maxWidth?: number; // Resize if larger
    maxHeight?: number; // Resize if larger
    lazy?: boolean; // Add lazy loading attributes
}

export interface OptimizedImage {
    url: string;
    originalUrl: string;
    format: string;
    width?: number;
    height?: number;
    size: number; // Bytes
    originalSize: number; // Bytes
    compressionRatio: number; // Percentage saved
    webpUrl?: string; // WebP version if generated
    responsiveUrls?: {
        '1x': string;
        '2x': string;
        '3x': string;
    };
}

/**
 * Optimize image using Cloudinary (preferred method)
 */
export async function optimizeImageCloudinary(
    imageUrl: string,
    options: ImageOptimizationOptions = {}
): Promise<OptimizedImage> {
    const quality = options.quality || 80;
    const format = options.format || 'auto';
    const maxWidth = options.maxWidth;
    const maxHeight = options.maxHeight;

    try {
        // Check if already Cloudinary URL
        if (imageUrl.includes('cloudinary.com')) {
            // Cloudinary URL transformations
            let optimizedUrl = imageUrl;

            // Add format transformation
            if (format === 'webp' && !optimizedUrl.includes('/f_webp')) {
                // Insert format transformation into Cloudinary URL
                optimizedUrl = optimizedUrl.replace(
                    /\/upload\/(.*?)\//,
                    `/upload/f_webp,q_${quality}$1/`
                );
            } else if (format === 'auto') {
                optimizedUrl = optimizedUrl.replace(
                    /\/upload\/(.*?)\//,
                    `/upload/q_auto,f_auto$1/`
                );
            }

            // Add size transformation
            if (maxWidth || maxHeight) {
                const sizeTransform = `w_${maxWidth || 'auto'},h_${maxHeight || 'auto'},c_limit`;
                optimizedUrl = optimizedUrl.replace(
                    /\/upload\/(.*?)\//,
                    `/upload/${sizeTransform},$1/`
                );
            }

            return {
                url: optimizedUrl,
                originalUrl: imageUrl,
                format: format === 'auto' ? 'auto' : format,
                size: 0, // Cloudinary doesn't provide size info easily
                originalSize: 0,
                compressionRatio: 0
            };
        }

        // If not Cloudinary URL, use Cloudinary upload with transformation
        // This requires Cloudinary upload API call
        logger.warn('Image not in Cloudinary, optimization limited', { imageUrl });
        return {
            url: imageUrl,
            originalUrl: imageUrl,
            format: 'unknown',
            size: 0,
            originalSize: 0,
            compressionRatio: 0
        };
    } catch (error) {
        logger.error('Error optimizing image with Cloudinary', error as Error, { imageUrl });
        return {
            url: imageUrl,
            originalUrl: imageUrl,
            format: 'unknown',
            size: 0,
            originalSize: 0,
            compressionRatio: 0
        };
    }
}

/**
 * Optimize image using Sharp (server-side fallback)
 * Requires: npm install sharp
 */
export async function optimizeImageSharp(
    imageBuffer: Buffer,
    options: ImageOptimizationOptions = {}
): Promise<{
    buffer: Buffer;
    format: string;
    width?: number;
    height?: number;
    size: number;
}> {
    try {
        // Dynamic import to avoid bundle issues if sharp not installed
        const sharp = await import('sharp').catch(() => null);

        if (!sharp) {
            logger.warn('Sharp not installed, skipping optimization');
            return {
                buffer: imageBuffer,
                format: 'unknown',
                size: imageBuffer.length
            };
        }

        const quality = options.quality || 80;
        const format = options.format || 'webp';
        const maxWidth = options.maxWidth;
        const maxHeight = options.maxHeight;

        let pipeline = sharp.default(imageBuffer);

        // Resize if needed
        if (maxWidth || maxHeight) {
            pipeline = pipeline.resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Convert format and optimize
        switch (format) {
            case 'webp':
                pipeline = pipeline.webp({ quality });
                break;
            case 'jpg':
                pipeline = pipeline.jpeg({ quality });
                break;
            case 'png':
                pipeline = pipeline.png({ quality: Math.floor(quality * 9 / 100) }); // PNG quality 0-9
                break;
        }

        const optimizedBuffer = await pipeline.toBuffer();
        const metadata = await sharp.default(optimizedBuffer).metadata();

        return {
            buffer: optimizedBuffer,
            format: format,
            width: metadata.width,
            height: metadata.height,
            size: optimizedBuffer.length
        };
    } catch (error) {
        logger.error('Error optimizing image with Sharp', error as Error);
        return {
            buffer: imageBuffer,
            format: 'unknown',
            size: imageBuffer.length
        };
    }
}

/**
 * Generate responsive image URLs (1x, 2x, 3x)
 */
export function generateResponsiveUrls(
    baseUrl: string,
    options: {
        widths?: number[]; // e.g., [800, 1200, 1920]
    } = {}
): OptimizedImage['responsiveUrls'] {
    const widths = options.widths || [800, 1200, 1920];

    // If Cloudinary URL, add width transformations
    if (baseUrl.includes('cloudinary.com')) {
        return {
            '1x': baseUrl.replace(/\/upload\/(.*?)\//, `/upload/w_${widths[0]},c_limit,$1/`),
            '2x': baseUrl.replace(/\/upload\/(.*?)\//, `/upload/w_${widths[1]},c_limit,$1/`),
            '3x': baseUrl.replace(/\/upload\/(.*?)\//, `/upload/w_${widths[2]},c_limit,$1/`)
        };
    }

    // For non-Cloudinary URLs, return same URL for all densities
    // (Responsive handling would need to be done in CSS/HTML)
    return {
        '1x': baseUrl,
        '2x': baseUrl,
        '3x': baseUrl
    };
}

/**
 * Main optimization function - tries Cloudinary first, falls back to Sharp
 */
export async function optimizeImage(
    imageUrl: string | Buffer,
    options: ImageOptimizationOptions = {}
): Promise<OptimizedImage> {
    try {
        // If URL provided, try Cloudinary optimization
        if (typeof imageUrl === 'string') {
            return await optimizeImageCloudinary(imageUrl, options);
        }

        // If buffer provided, use Sharp
        const result = await optimizeImageSharp(imageUrl, options);
        
        return {
            url: '', // Buffer needs to be uploaded separately
            originalUrl: '',
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.size,
            originalSize: imageUrl.length,
            compressionRatio: imageUrl.length > 0 
                ? ((imageUrl.length - result.size) / imageUrl.length) * 100 
                : 0
        };
    } catch (error) {
        logger.error('Error optimizing image', error as Error);
        return {
            url: typeof imageUrl === 'string' ? imageUrl : '',
            originalUrl: typeof imageUrl === 'string' ? imageUrl : '',
            format: 'unknown',
            size: 0,
            originalSize: 0,
            compressionRatio: 0
        };
    }
}

/**
 * Batch optimize multiple images
 */
export async function batchOptimizeImages(
    imageUrls: string[],
    options: ImageOptimizationOptions = {}
): Promise<OptimizedImage[]> {
    const results: OptimizedImage[] = [];

    for (const url of imageUrls) {
        try {
            const optimized = await optimizeImage(url, options);
            results.push(optimized);
        } catch (error) {
            logger.warn('Failed to optimize image', { url, error });
            results.push({
                url,
                originalUrl: url,
                format: 'unknown',
                size: 0,
                originalSize: 0,
                compressionRatio: 0
            });
        }
    }

    return results;
}

/**
 * Get optimization recommendations for an image
 */
export function getOptimizationRecommendations(
    originalSize: number,
    currentFormat: string,
    url: string
): string[] {
    const recommendations: string[] = [];
    const sizeInMB = originalSize / (1024 * 1024);

    // Size recommendations
    if (sizeInMB > 1) {
        recommendations.push(`Image is ${sizeInMB.toFixed(2)}MB - compress to <500KB`);
    } else if (sizeInMB > 0.5) {
        recommendations.push(`Image is ${sizeInMB.toFixed(2)}MB - optimize further`);
    }

    // Format recommendations
    if (currentFormat === 'png' && sizeInMB > 0.2) {
        recommendations.push('Convert PNG to WebP for 30-50% size reduction');
    }

    if (currentFormat === 'jpg' && !url.includes('cloudinary.com')) {
        recommendations.push('Use Cloudinary or Sharp to convert to WebP');
    }

    // Lazy loading
    if (!url.includes('loading=')) {
        recommendations.push('Add lazy loading attribute');
    }

    // Responsive images
    if (!url.includes('srcset')) {
        recommendations.push('Generate responsive image srcset (1x, 2x, 3x)');
    }

    return recommendations;
}
