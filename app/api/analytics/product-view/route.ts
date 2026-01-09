import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productSlug, sessionId, referrer, deviceType } = body;

    if (!productSlug) {
      return NextResponse.json({ error: 'Product slug required' }, { status: 400 });
    }

    // Get geo/device info from headers
    const country = request.headers.get('cf-ipcountry') || 
                    request.headers.get('x-vercel-ip-country') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    
    // Detect device type from user agent if not provided
    const detectedDevice = deviceType || (
      /mobile/i.test(userAgent) ? 'mobile' : 
      /tablet|ipad/i.test(userAgent) ? 'tablet' : 'desktop'
    );

    // Detect browser
    const browser = /chrome/i.test(userAgent) ? 'chrome' :
                    /firefox/i.test(userAgent) ? 'firefox' :
                    /safari/i.test(userAgent) ? 'safari' :
                    /edge/i.test(userAgent) ? 'edge' : 'other';

    // Parse UTM params from referrer
    const refUrl = referrer ? new URL(referrer).searchParams : null;
    
    const viewData = {
      product_id: productId || null,
      product_slug: productSlug,
      session_id: sessionId || crypto.randomUUID(),
      referrer: referrer || null,
      utm_source: refUrl?.get('utm_source') || null,
      utm_medium: refUrl?.get('utm_medium') || null,
      utm_campaign: refUrl?.get('utm_campaign') || null,
      device_type: detectedDevice,
      browser,
      country
    };

    const { error } = await supabase
      .from('product_views')
      .insert(viewData);

    if (error) {
      console.error('View tracking error:', error);
      // Don't fail the request - analytics shouldn't break UX
      return NextResponse.json({ tracked: false }, { status: 200 });
    }

    return NextResponse.json({ tracked: true, sessionId: viewData.session_id });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json({ tracked: false }, { status: 200 });
  }
}
