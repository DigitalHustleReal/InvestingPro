/**
 * User Subscription API
 * 
 * Returns current user's subscription status
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Return free plan for unauthenticated users
      return NextResponse.json({
        plan: 'free',
        status: 'active',
        isAuthenticated: false,
      });
    }

    // Get user's subscription from profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('subscription_plan, subscription_status, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({
        plan: 'free',
        status: 'active',
        isAuthenticated: true,
      });
    }

    return NextResponse.json({
      plan: profile.subscription_plan || 'free',
      status: profile.subscription_status || 'active',
      isAuthenticated: true,
      hasStripeCustomer: !!profile.stripe_customer_id,
    });
  } catch (error) {
    console.error('[API] Subscription check error:', error);
    return NextResponse.json({
      plan: 'free',
      status: 'active',
      error: 'Failed to check subscription',
    });
  }
}
