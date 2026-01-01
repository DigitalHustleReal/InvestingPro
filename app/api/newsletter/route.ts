import { NextRequest, NextResponse } from 'next/server';
import { newsletterService } from '@/lib/engagement/newsletter-service';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, name, interests, frequency } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        const result = await newsletterService.subscribe({
            email,
            name,
            interests,
            frequency
        });

        return NextResponse.json(result);

    } catch (error) {
        logger.error('Newsletter API error', error as Error);
        return NextResponse.json(
            { success: false, message: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const token = searchParams.get('token');

        if (action === 'verify' && token) {
            const result = await newsletterService.verify(token);
            return NextResponse.json(result);
        }

        if (action === 'count') {
            const count = await newsletterService.getSubscriberCount();
            return NextResponse.json({ count });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );

    } catch (error) {
        logger.error('Newsletter API GET error', error as Error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        const result = await newsletterService.unsubscribe(email);
        return NextResponse.json(result);

    } catch (error) {
        logger.error('Newsletter unsubscribe error', error as Error);
        return NextResponse.json(
            { success: false, message: 'Failed to unsubscribe' },
            { status: 500 }
        );
    }
}
