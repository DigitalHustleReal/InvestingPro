/**
 * Stock Photo Service
 * Integrates with Pexels and Pixabay for free stock images
 * Uses server-side API route to keep keys secure
 */

export interface StockPhoto {
    id: string;
    url: string;
    thumbnailUrl: string;
    photographer: string;
    photographerUrl: string;
    width: number;
    height: number;
    source: 'pexels' | 'pixabay';
    downloadUrl: string;
}

export class StockPhotoService {
    /**
     * Search both Pexels and Pixabay via server-side API
     */
    static async searchPhotos(query: string, page = 1): Promise<StockPhoto[]> {
        try {
            const response = await fetch(`/api/stock-photos?query=${encodeURIComponent(query)}&page=${page}`);
            
            if (!response.ok) {
                console.error('Stock photo search failed:', response.statusText);
                return [];
            }
            
            const data = await response.json();
            return data.photos || [];
        } catch (error) {
            console.error('Stock photo search error:', error);
            return [];
        }
    }

    /**
     * Get curated/featured photos (no search query)
     */
    static async getCuratedPhotos(): Promise<StockPhoto[]> {
        // Use a generic query for curated photos
        return this.searchPhotos('business finance', 1);
    }

    /**
     * Download stock photo and convert to File
     */
    static async downloadPhoto(photo: StockPhoto): Promise<File> {
        const response = await fetch(photo.downloadUrl);
        
        if (!response.ok) {
            throw new Error('Failed to download image');
        }

        const blob = await response.blob();
        
        // Create filename from photographer and timestamp
        const timestamp = Date.now();
        const filename = `${photo.source}-${photo.photographer.replace(/\s+/g, '-')}-${timestamp}.jpg`;

        return new File([blob], filename, { type: 'image/jpeg' });
    }
}
