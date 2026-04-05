import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "c6fbbb8cdaa8f1927d27388185cc953f";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://investingpro.in";

/**
 * IndexNow API — submit URLs to Bing/Yandex for instant indexing
 *
 * POST /api/indexnow — batch submit URLs
 * Body: { urls: string[] }
 *
 * GET /api/indexnow?url=/credit-cards — submit single URL
 */

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const urls: string[] = body.urls || [];

    if (urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    const fullUrls = urls.map((u) =>
      u.startsWith("http") ? u : `${BASE_URL}${u}`,
    );

    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "investingpro.in",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: fullUrls.slice(0, 10000),
      }),
    });

    return NextResponse.json({
      submitted: fullUrls.length,
      status: response.status,
      message:
        response.status === 200
          ? "URLs submitted successfully"
          : "Submitted (may be queued)",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit URLs" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing ?url= parameter" },
      { status: 400 },
    );
  }

  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  try {
    const response = await fetch(
      `https://api.indexnow.org/IndexNow?url=${encodeURIComponent(fullUrl)}&key=${INDEXNOW_KEY}`,
    );

    return NextResponse.json({
      url: fullUrl,
      status: response.status,
      message:
        response.status === 200 ? "URL submitted" : "Submitted (may be queued)",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit URL" },
      { status: 500 },
    );
  }
}
