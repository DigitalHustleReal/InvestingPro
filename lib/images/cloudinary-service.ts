/**
 * Cloudinary Image Service
 * 
 * Free tier: 25K transformations/month, 25GB storage
 * Use for: Article images, product images, user uploads
 * 
 * Setup:
 * 1. Create account at cloudinary.com
 * 2. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local
 * 3. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME for client-side
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best';
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  };
  tags?: string[];
}

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: string;
}

/**
 * Upload an image from URL
 */
export async function uploadFromUrl(
  imageUrl: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  if (!isConfigured) {
    console.warn('[CLOUDINARY] Not configured, skipping upload');
    return { success: false, error: 'Cloudinary not configured' };
  }

  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: options.folder || 'investingpro',
      public_id: options.publicId,
      transformation: options.transformation ? [
        {
          width: options.transformation.width,
          height: options.transformation.height,
          crop: options.transformation.crop || 'fill',
          quality: options.transformation.quality || 'auto',
          fetch_format: options.transformation.format || 'auto',
        },
      ] : undefined,
      tags: options.tags,
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('[CLOUDINARY] Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload a base64 encoded image
 */
export async function uploadFromBase64(
  base64Data: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  if (!isConfigured) {
    return { success: false, error: 'Cloudinary not configured' };
  }

  try {
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Data}`,
      {
        folder: options.folder || 'investingpro',
        public_id: options.publicId,
        tags: options.tags,
      }
    );

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('[CLOUDINARY] Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Generate optimized URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return publicId; // Return original if not configured
  }

  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
        quality: options.quality || 'auto',
        fetch_format: options.format || 'auto',
      },
    ],
  });
}

/**
 * Generate featured image URL (1200x630 for OG)
 */
export function getFeaturedImageUrl(publicId: string): string {
  return getOptimizedUrl(publicId, {
    width: 1200,
    height: 630,
    crop: 'fill',
    quality: 'auto:good',
    format: 'webp',
  });
}

/**
 * Generate thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 200): string {
  return getOptimizedUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 'auto',
    format: 'webp',
  });
}

/**
 * Delete an image
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  if (!isConfigured) return false;

  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('[CLOUDINARY] Delete error:', error);
    return false;
  }
}

/**
 * Upload article featured image
 */
export async function uploadArticleImage(
  imageUrl: string,
  articleSlug: string
): Promise<UploadResult> {
  return uploadFromUrl(imageUrl, {
    folder: 'investingpro/articles',
    publicId: `article-${articleSlug}`,
    transformation: {
      width: 1200,
      height: 630,
      crop: 'fill',
      quality: 'auto:good',
      format: 'webp',
    },
    tags: ['article', 'featured-image'],
  });
}

/**
 * Upload product image
 */
export async function uploadProductImage(
  imageUrl: string,
  productSlug: string
): Promise<UploadResult> {
  return uploadFromUrl(imageUrl, {
    folder: 'investingpro/products',
    publicId: `product-${productSlug}`,
    transformation: {
      width: 400,
      height: 400,
      crop: 'fit',
      quality: 'auto:good',
      format: 'webp',
    },
    tags: ['product'],
  });
}

export default {
  uploadFromUrl,
  uploadFromBase64,
  getOptimizedUrl,
  getFeaturedImageUrl,
  getThumbnailUrl,
  deleteImage,
  uploadArticleImage,
  uploadProductImage,
  isConfigured,
};
