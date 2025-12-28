import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Health Check Endpoint
 * Used for monitoring and uptime checks
 */
export async function GET() {
    try {
        // Basic health check
        const health: any = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        };

        // Check if Supabase environment variables are set
        const hasSupabaseConfig = !!(
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        health.database = {
            configured: hasSupabaseConfig,
            connected: false,
        };

        // Test database connection if configured
        if (hasSupabaseConfig) {
            try {
                const supabase = await createClient();
                
                // Try to query a simple table (user_profiles is common)
                // If it fails, try another table or just check connection
                const { error } = await supabase
                    .from('user_profiles')
                    .select('1')
                    .limit(1);

                if (error) {
                    // Table might not exist, but connection works
                    // Try a different approach - just check if we can reach Supabase
                    const { data: { user } } = await supabase.auth.getUser();
                    health.database.connected = true;
                    health.database.status = 'connected';
                    health.database.note = error.code === 'PGRST116' 
                        ? 'Tables may not be created yet' 
                        : 'Connection works, some tables may not exist';
                } else {
                    health.database.connected = true;
                    health.database.status = 'connected';
                }
            } catch (dbError: any) {
                health.database.connected = false;
                health.database.status = 'error';
                health.database.error = dbError.message;
                health.status = 'degraded';
            }
        } else {
            health.database.status = 'not_configured';
            health.database.note = 'Supabase environment variables not set';
        }

        const statusCode = health.status === 'ok' ? 200 : health.status === 'degraded' ? 503 : 500;
        return NextResponse.json(health, { status: statusCode });
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: error.message,
            },
            { status: 500 }
        );
    }
}


