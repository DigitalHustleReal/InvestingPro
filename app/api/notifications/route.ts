import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notificationService } from '@/lib/engagement/notification-service';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const countOnly = searchParams.get('countOnly') === 'true';
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '20');

        if (countOnly) {
            const count = await notificationService.getUnreadCount(user.id);
            return NextResponse.json({ count });
        }

        const notifications = await notificationService.getUserNotifications(user.id, {
            unreadOnly,
            limit
        });

        return NextResponse.json({ notifications });

    } catch (error) {
        logger.error('Notifications API error', error as Error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
