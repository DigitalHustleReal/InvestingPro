/**
 * Image Optimizer
 * Optimizes images for web use
 */

import sharp from 'sharp';

interface OptimizeOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Optimize image for web
 */
export async function optimizeImage(
    imageBuffer: Buffer,
    options: OptimizeOptions = {}
): Promise<Buffer> {
    const {
        width = 1200,
        height = 630,
        quality = 90,
        format = 'webp'
    } = options;
    
    let pipeline = sharp(imageBuffer)
        .resize(width, height, {
            fit: 'cover',
            position: 'center'
        });
    
    // Apply format-specific optimization
    switch (format) {
        case 'webp':
            pipeline = pipeline.webp({ quality });
            break;
        case 'jpeg':
            pipeline = pipeline.jpeg({ quality, progressive: true });
            break;
        case 'png':
            pipeline = pipeline.png({ quality, compressionLevel: 9 });
            break;
    }
    
    return pipeline.toBuffer();
}

/**
 * Create social media optimized versions
 */
export async function createSocialVersions(imageBuffer: Buffer): Promise<{
    og: Buffer;      // 1200x630 for Open Graph
    twitter: Buffer; // 1200x600 for Twitter
    square: Buffer;  // 1080x1080 for Instagram
}> {
    const [og, twitter, square] = await Promise.all([
        optimizeImage(imageBuffer, { width: 1200, height: 630 }),
        optimizeImage(imageBuffer, { width: 1200, height: 600 }),
        optimizeImage(imageBuffer, { width: 1080, height: 1080 })
    ]);
    
    return { og, twitter, square };
}
