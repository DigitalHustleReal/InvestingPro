import { NextRequest, NextResponse } from 'next/server';

/**
 * IndexNow API endpoint
 *
 * Notifies Bing, Yandex, and other IndexNow-compatible search engines
 * immediately when new content is published or updated.
 * Called by: CMS publish hooks, cron job, manual trigger.
 *
 * Key file: /public/da64085efc8f4d5e8126d30f07c3e38f.txt
 */

const INDEXNOW_KEY = 'da64085efc8f4d5e8126d30f07c3e38f';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://investingpro.in';
const INDEXNOW_HOST = 'https://api.indexnow.org/indexnow';

// Protect endpoint with a secret — call with ?secret=CRON_SECRET
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get('authorization');
  const secret = new URL(request.url).searchParams.get('secret');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}` && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let urls: string[];
  try {
    const body = await request.json();
    urls = Array.isArray(body.urls) ? body.urls : [body.url].filter(Boolean);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!urls || urls.length === 0) {
    return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
  }

  // Ensure all URLs are absolute
  const absoluteUrls = urls.map((u) =>
    u.startsWith('http') ? u : `${BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`
  );

  try {
    const payload = {
      host: new URL(BASE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: absoluteUrls,
    };

    const response = await fetch(INDEXNOW_HOST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      submitted: absoluteUrls.length,
      urls: absoluteUrls,
      status: response.status,
      ok: response.ok,
    });
  } catch (error) {
    return NextResponse.json({ error: 'IndexNow submission failed', detail: String(error) }, { status: 500 });
  }
}

// GET: submit a single URL via query param (convenient for testing)
export async function GET(request: NextRequest) {
  const url = new URL(request.url).searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Provide ?url=<path>' }, { status: 400 });
  }

  const absoluteUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  try {
    const response = await fetch(
      `${INDEXNOW_HOST}?url=${encodeURIComponent(absoluteUrl)}&key=${INDEXNOW_KEY}`,
    );
    return NextResponse.json({ submitted: absoluteUrl, status: response.status, ok: response.ok });
  } catch (error) {
    return NextResponse.json({ error: 'IndexNow submission failed', detail: String(error) }, { status: 500 });
  }
}
