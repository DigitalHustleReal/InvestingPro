import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Check if the current user has admin role
 * Checks both JWT claim and user_profiles.role
 */
export async function checkAdminRole(): Promise<boolean> {
    try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            logger.warn('No authenticated user found');
            return false;
        }

        // Check JWT claim
        const { data: { session } } = await supabase.auth.getSession();
        const jwtRole = session?.access_token ? 
            JSON.parse(atob(session.access_token.split('.')[1]))?.role : null;
        
        if (jwtRole === 'admin') {
            return true;
        }

        // Check user_profiles.role
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            logger.warn('Failed to fetch user profile', profileError);
            return false;
        }

        return profile?.role === 'admin';
    } catch (error) {
        logger.error('Error checking admin role', error as Error);
        return false;
    }
}

/**
 * Get current user's role
 */
export async function getUserRole(): Promise<'admin' | 'editor' | 'user' | null> {
    try {
        const supabase = createClient();
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return null;
        }

        // Check user_profiles.role first
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role) {
            return profile.role as 'admin' | 'editor' | 'user';
        }

        // Fallback to JWT claim
        const { data: { session } } = await supabase.auth.getSession();
        const jwtRole = session?.access_token ? 
            JSON.parse(atob(session.access_token.split('.')[1]))?.role : null;
        
        return jwtRole || null;
    } catch (error) {
        logger.error('Error getting user role', error as Error);
        return null;
    }
}


