import { createClient } from '@/lib/supabase/client';
import { NAVIGATION_CONFIG, NavigationCategory } from './config';

/**
 * Navigation Service
 * Fetches navigation structure from Database, falls back to Static Config.
 */
export async function getNavigation(): Promise<NavigationCategory[]> {
    try {
        const supabase = createClient();
        
        // 1. Fetch Top Level Categories from DB
        const { data: dbCategories, error } = await supabase
            .from('categories')
            .select('name, slug, description')
            .order('name');

        if (error || !dbCategories || dbCategories.length === 0) {
            // Fallback to static if DB is empty or error
            return NAVIGATION_CONFIG;
        }

        // 2. Map Key Categories to Full Structure
        // Since DB 'categories' table is flat (just name/slug), we need to Hydrate them with Intents.
        // For now, we will Match DB categories with Static Config to keep the rich submenu structure
        // but allow DB to control ORDER and VISIBILITY (if we added is_visible flag)
        
        // Phase 2: We will store the entire nested tree in a `navigation_nodes` table.
        // For Phase 1: We simply return the Static Config as the "Source of Truth" for structure,
        // but we define the interface here.
        
        return NAVIGATION_CONFIG;

    } catch (error) {
        console.error("Navigation Fetch Failed", error);
        return NAVIGATION_CONFIG;
    }
}
