import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { RevenueService } from '@/lib/services/revenue-service';

// Use service role for admin access
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/v1/admin/revenue/dashboard
 * Returns overall revenue metrics, revenue by category, conversion rates, and trends
 * 
 * Query Parameters:
 * - startDate (optional): ISO date string, defaults to 30 days ago
 * - endDate (optional): ISO date string, defaults to now
 */
export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        await requireAdmin();

        // Validate and parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Validate date format if provided
        if (startDateParam && isNaN(Date.parse(startDateParam))) {
            return NextResponse.json(
                { error: 'Invalid startDate format. Use ISO 8601 format.' },
                { status: 400 }
            );
        }

        if (endDateParam && isNaN(Date.parse(endDateParam))) {
            return NextResponse.json(
                { error: 'Invalid endDate format. Use ISO 8601 format.' },
                { status: 400 }
            );
        }

        const startDate = startDateParam || undefined; // Let service handle default
        const endDate = endDateParam || undefined;

        // Ensure startDate is before endDate if both exist
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return NextResponse.json(
                { error: 'startDate must be before endDate' },
                { status: 400 }
            );
        }

        const revenueService = new RevenueService(supabase);
        const metrics = await revenueService.getDashboardMetrics(startDate, endDate);

        return NextResponse.json(metrics);

    } catch (error: any) {
        logger.error('Revenue dashboard error:', error);
        
        // Return more specific error messages
        if (error.message?.includes('permission denied') || error.message?.includes('RLS')) {
            return NextResponse.json(
                { 
                    error: 'Database permission error',
                    code: 'DB_PERMISSION_ERROR',
                    message: 'Unable to access revenue data. Please check database permissions.'
                },
                { status: 403 }
            );
        }

        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
            return NextResponse.json(
                { 
                    error: 'Database schema error',
                    code: 'DB_SCHEMA_ERROR',
                    message: 'Required database tables are missing. Please run migrations.'
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch revenue data. Please try again later.'
            },
            { status: 500 }
        );
    }
}
