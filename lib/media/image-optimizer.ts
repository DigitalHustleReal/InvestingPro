/**
 * Image Optimization Utility
 * WordPress-style image processing: compression, resizing, WebP conversion
 */

export interface ImageVariant {
    name: string;
    maxWidth: number;
    maxHeight: number;
    quality: number;
}

export interface OptimizedImage {
    original: {
        blob: Blob;
        width: number;
        height: number;
        size: number;
    };
    variants: {
        [key: string]: {
            blob: Blob;
            width: number;
            height: number;
            size: number;
            url?: string;
        };
    };
    metadata: {
        originalSize: number;
        optimizedSize: number;
        savings: number;
        savingsPercent: number;
    };
}

// WordPress-style image sizes
export const DEFAULT_IMAGE_VARIANTS: ImageVariant[] = [
    { name: 'thumbnail', maxWidth: 150, maxHeight: 150, quality: 0.85 },
    { name: 'medium', maxWidth: 300, maxHeight: 300, quality: 0.85 },
    { name: 'large', maxWidth: 1024, maxHeight: 1024, quality: 0.85 },
    { name: 'featured', maxWidth: 1200, maxHeight: 675, quality: 0.85 }, // 16:9 for featured images
];

export class ImageOptimizer {
    /**
     * Optimize image with multiple variants (like WordPress)
     */
    static async optimizeImage(
        file: File,
        variants: ImageVariant[] = DEFAULT_IMAGE_VARIANTS
    ): Promise<OptimizedImage> {
        // Load original image
        const img = await this.loadImage(file);
        
        // Compress original
        const optimizedOriginal = await this.compressImage(img, {
            maxWidth: 2048,
            maxHeight: 2048,
            quality: 0.9,
            format: 'webp'
        });

        const result: OptimizedImage = {
            original: {
                blob: optimizedOriginal,
                width: img.width,
                height: img.height,
                size: optimizedOriginal.size
            },
            variants: {},
            metadata: {
                originalSize: file.size,
                optimizedSize: optimizedOriginal.size,
                savings: file.size - optimizedOriginal.size,
                savingsPercent: Math.round((1 - optimizedOriginal.size / file.size) * 100)
            }
        };

        // Generate variants
        for (const variant of variants) {
            const resized = await this.compressImage(img, {
                maxWidth: variant.maxWidth,
                maxHeight: variant.maxHeight,
                quality: variant.quality,
                format: 'webp'
            });

            const dimensions = this.calculateDimensions(
                img.width,
                img.height,
                variant.maxWidth,
                variant.maxHeight
            );

            result.variants[variant.name] = {
                blob: resized,
                width: dimensions.width,
                height: dimensions.height,
                size: resized.size
            };
        }

        return result;
    }

    /**
     * Load image from file
     */
    private static loadImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };

            img.src = url;
        });
    }

    /**
     * Compress image to blob with WebP format
     */
    private static async compressImage(
        img: HTMLImageElement,
        options: {
            maxWidth: number;
            maxHeight: number;
            quality: number;
            format: 'webp' | 'jpeg' | 'png';
        }
    ): Promise<Blob> {
        const dimensions = this.calculateDimensions(
            img.width,
            img.height,
            options.maxWidth,
            options.maxHeight
        );

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw resized image
        ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

        // Convert to blob
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                },
                `image/${options.format}`,
                options.quality
            );
        });
    }

    /**
     * Calculate dimensions maintaining aspect ratio
     */
    private static calculateDimensions(
        originalWidth: number,
        originalHeight: number,
        maxWidth: number,
        maxHeight: number
    ): { width: number; height: number } {
        let width = originalWidth;
        let height = originalHeight;

        // If image is smaller than max, keep original size
        if (width <= maxWidth && height <= maxHeight) {
            return { width, height };
        }

        // Calculate aspect ratio
        const aspectRatio = width / height;

        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }

        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        return {
            width: Math.round(width),
            height: Math.round(height)
        };
    }

    /**
     * Get file size in human-readable format
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Validate image before processing
     */
    static validateImage(file: File): { valid: boolean; error?: string } {
        // Check file type
        if (!file.type.startsWith('image/')) {
            return { valid: false, error: 'File must be an image' };
        }

        // Check file size (max 20MB for processing)
        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
            return { valid: false, error: 'Image too large (max 20MB)' };
        }

        // Check specific formats
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Unsupported format. Use JPEG, PNG, GIF, or WebP' };
        }

        return { valid: true };
    }
}

/**
 * Quick optimization function
 */
export async function optimizeImageFile(file: File): Promise<{
    optimized: Blob;
    savings: number;
    savingsPercent: number;
}> {
    const validation = ImageOptimizer.validateImage(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    const result = await ImageOptimizer.optimizeImage(file, []);
    
    return {
        optimized: result.original.blob,
        savings: result.metadata.savings,
        savingsPercent: result.metadata.savingsPercent
    };
}
