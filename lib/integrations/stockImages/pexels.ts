/**
 * Pexels Stock Image API Integration
 * 
 * Free tier: Unlimited requests
 * Documentation: https://www.pexels.com/api/documentation/
 */

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || '';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

export interface PexelsPhoto {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    };
    alt: string;
}

export interface PexelsSearchResponse {
    total_results: number;
    page: number;
    per_page: number;
    photos: PexelsPhoto[];
    next_page?: string;
}

/**
 * Search Pexels for stock images
 */
export async function searchPexelsImages(
    query: string,
    options: {
        perPage?: number;
        page?: number;
        orientation?: 'landscape' | 'portrait' | 'square';
        size?: 'large' | 'medium' | 'small';
        color?: string;
    } = {}
): Promise<PexelsSearchResponse> {
    if (!PEXELS_API_KEY) {
        throw new Error('Pexels API key not configured. Get one at https://www.pexels.com/api/');
    }

    const {
        perPage = 20,
        page = 1,
        orientation,
        size = 'large',
        color,
    } = options;

    const params = new URLSearchParams({
        query,
        per_page: perPage.toString(),
        page: page.toString(),
    });

    if (orientation) params.append('orientation', orientation);
    if (color) params.append('color', color);

    try {
        const response = await fetch(`${PEXELS_API_URL}/search?${params}`, {
            headers: {
                'Authorization': PEXELS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.statusText}`);
        }

        const data: PexelsSearchResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Pexels images:', error);
        throw error;
    }
}

/**
 * Get curated photos for a specific topic
 */
export async function getCuratedPhotos(
    page: number = 1,
    perPage: number = 20
): Promise<PexelsSearchResponse> {
    if (!PEXELS_API_KEY) {
        throw new Error('Pexels API key not configured');
    }

    const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
    });

    try {
        const response = await fetch(`${PEXELS_API_URL}/curated?${params}`, {
            headers: {
                'Authorization': PEXELS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.statusText}`);
        }

        const data: PexelsSearchResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching curated Pexels images:', error);
        throw error;
    }
}

/**
 * Convert Pexels photo to our MediaItem format
 */
export function pexelsPhotoToMediaItem(photo: PexelsPhoto): {
    id: string;
    name: string;
    url: string;
    thumbnail: string;
    source: string;
    photographer: string;
    photographer_url: string;
    width: number;
    height: number;
    alt_text: string;
} {
    return {
        id: `pexels-${photo.id}`,
        name: photo.alt || `Photo by ${photo.photographer}`,
        url: photo.src.large2x || photo.src.large,
        thumbnail: photo.src.medium,
        source: 'Pexels',
        photographer: photo.photographer,
        photographer_url: photo.photographer_url,
        width: photo.width,
        height: photo.height,
        alt_text: photo.alt || `Stock photo: ${photo.photographer}`,
    };
}



















