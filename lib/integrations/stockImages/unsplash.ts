/**
 * Unsplash Stock Image API Integration
 * 
 * Free tier: 50 requests/hour
 * Documentation: https://unsplash.com/documentation
 */

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export interface UnsplashPhoto {
    id: string;
    width: number;
    height: number;
    color: string;
    description: string | null;
    alt_description: string | null;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    links: {
        self: string;
        html: string;
        download: string;
        download_location: string;
    };
    user: {
        id: string;
        username: string;
        name: string;
        links: {
            html: string;
        };
    };
    likes: number;
}

export interface UnsplashSearchResponse {
    total: number;
    total_pages: number;
    results: UnsplashPhoto[];
}

/**
 * Search Unsplash for stock images
 */
export async function searchUnsplashImages(
    query: string,
    options: {
        perPage?: number;
        page?: number;
        orientation?: 'landscape' | 'portrait' | 'squarish';
        orderBy?: 'latest' | 'oldest' | 'popular' | 'views' | 'downloads';
        color?: string;
    } = {}
): Promise<UnsplashSearchResponse> {
    if (!UNSPLASH_ACCESS_KEY) {
        throw new Error('Unsplash API key not configured. Get one at https://unsplash.com/developers');
    }

    const {
        perPage = 20,
        page = 1,
        orientation,
        orderBy = 'relevant',
        color,
    } = options;

    const params = new URLSearchParams({
        query,
        per_page: perPage.toString(),
        page: page.toString(),
        order_by: orderBy,
    });

    if (orientation) params.append('orientation', orientation);
    if (color) params.append('color', color);

    try {
        const response = await fetch(`${UNSPLASH_API_URL}/search/photos?${params}`, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.statusText}`);
        }

        const data: UnsplashSearchResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Unsplash images:', error);
        throw error;
    }
}

/**
 * Convert Unsplash photo to our MediaItem format
 */
export function unsplashPhotoToMediaItem(photo: UnsplashPhoto): {
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
        id: `unsplash-${photo.id}`,
        name: photo.description || photo.alt_description || `Photo by ${photo.user.name}`,
        url: photo.urls.regular,
        thumbnail: photo.urls.thumb,
        source: 'Unsplash',
        photographer: photo.user.name,
        photographer_url: photo.user.links.html,
        width: photo.width,
        height: photo.height,
        alt_text: photo.alt_description || photo.description || `Stock photo by ${photo.user.name}`,
    };
}
















