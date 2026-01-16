/**
 * Newsletter Subscribe API
 * Handles newsletter subscriptions from popups and forms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, source, tags, metadata } = body;

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email address is required' },
                { status: 400 }
            );
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if already subscribed
        const { data: existing } = await supabase
            .from('newsletter_subscribers')
            .select('id, email')
            .eq('email', normalizedEmail)
            .single();

        if (existing) {
            // Already subscribed - return success (idempotent)
            logger.info('Newsletter subscription - already exists', { email: normalizedEmail });
            return NextResponse.json({
                success: true,
                message: 'You are already subscribed!',
                alreadySubscribed: true
            });
        }

        // Insert new subscriber
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .insert({
                email: normalizedEmail,
                name: name || null,
                source: source || 'website',
                tags: tags || [],
                metadata: metadata || {},
                subscribed_at: new Date().toISOString(),
                status: 'active'
            })
            .select()
            .single();

        if (error) {
            // Handle duplicate key error gracefully
            if (error.code === '23505') {
                return NextResponse.json({
                    success: true,
                    message: 'You are already subscribed!',
                    alreadySubscribed: true
                });
            }

            throw error;
        }

        logger.info('Newsletter subscription created', { 
            email: normalizedEmail, 
            source: source || 'website' 
        });

        // TODO: Send welcome email via Resend
        // await sendWelcomeEmail(normalizedEmail, name);

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed!',
            subscriber: {
                email: data.email,
                subscribedAt: data.subscribed_at
            }
        });

    } catch (error: any) {
        logger.error('Error subscribing to newsletter', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to subscribe',
                message: error.message || 'An error occurred. Please try again later.'
            },
            { status: 500 }
        );
    }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter is required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('email, subscribed_at, status')
            .eq('email', normalizedEmail)
            .single();

        if (error || !data) {
            return NextResponse.json({
                subscribed: false
            });
        }

        return NextResponse.json({
            subscribed: true,
            subscribedAt: data.subscribed_at,
            status: data.status
        });

    } catch (error: any) {
        logger.error('Error checking subscription status', error);
        
        return NextResponse.json(
            {
                error: 'Failed to check subscription status',
                message: error.message
            },
            { status: 500 }
        );
    }
}
