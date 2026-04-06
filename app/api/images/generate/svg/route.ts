import { NextRequest, NextResponse } from "next/server";
import { generateFeaturedImage } from "@/lib/images/svg/featured-image-generator";
import { generateComparisonImage } from "@/lib/images/svg/comparison-image-generator";
import { generateInfographic } from "@/lib/images/svg/infographic-templates";
import type {
  FeaturedImageInput,
  FeaturedCategory,
} from "@/lib/images/svg/featured-image-generator";
import type { ComparisonImageInput } from "@/lib/images/svg/comparison-image-generator";
import type { InfographicInput } from "@/lib/images/svg/infographic-templates";

/**
 * POST /api/images/generate/svg
 *
 * Programmatic SVG image generation endpoint.
 * Accepts JSON body specifying the image type and data.
 *
 * Requires CRON_SECRET header or admin auth for production use.
 *
 * Body:
 * {
 *   "type": "featured" | "comparison" | "infographic",
 *   "data": { ... template-specific data },
 *   "format": "svg" (default, always SVG)
 * }
 *
 * Returns: SVG image with appropriate Content-Type header.
 */

const VALID_CATEGORIES: FeaturedCategory[] = [
  "credit-cards",
  "mutual-funds",
  "loans",
  "tax-planning",
  "insurance",
  "personal-finance",
];

function isValidCategory(c: string): c is FeaturedCategory {
  return VALID_CATEGORIES.includes(c as FeaturedCategory);
}

export async function POST(request: NextRequest) {
  try {
    // Auth check: require CRON_SECRET or x-api-key
    const cronSecret = process.env.CRON_SECRET;
    const authHeader =
      request.headers.get("authorization") ??
      request.headers.get("x-cron-secret") ??
      request.headers.get("x-api-key");

    if (
      cronSecret &&
      authHeader !== `Bearer ${cronSecret}` &&
      authHeader !== cronSecret
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body as { type: string; data: unknown };

    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: type, data" },
        { status: 400 },
      );
    }

    let svg: string;

    switch (type) {
      case "featured": {
        const input = data as FeaturedImageInput;
        if (!input.title || !input.category) {
          return NextResponse.json(
            { error: "Featured image requires title and category" },
            { status: 400 },
          );
        }
        if (!isValidCategory(input.category)) {
          return NextResponse.json(
            {
              error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
            },
            { status: 400 },
          );
        }
        svg = generateFeaturedImage(input);
        break;
      }

      case "comparison": {
        const input = data as ComparisonImageInput;
        if (!input.title || !input.headers || !input.rows) {
          return NextResponse.json(
            { error: "Comparison image requires title, headers, and rows" },
            { status: 400 },
          );
        }
        if (!Array.isArray(input.headers) || !Array.isArray(input.rows)) {
          return NextResponse.json(
            { error: "headers and rows must be arrays" },
            { status: 400 },
          );
        }
        svg = generateComparisonImage(input);
        break;
      }

      case "infographic": {
        const input = data as InfographicInput;
        if (!input.type || !input.data) {
          return NextResponse.json(
            {
              error:
                "Infographic requires type (process|comparison|stats) and data",
            },
            { status: 400 },
          );
        }
        if (!["process", "comparison", "stats"].includes(input.type)) {
          return NextResponse.json(
            { error: "Infographic type must be process, comparison, or stats" },
            { status: 400 },
          );
        }
        svg = generateInfographic(input);
        break;
      }

      default:
        return NextResponse.json(
          {
            error: `Unknown type "${type}". Must be featured, comparison, or infographic`,
          },
          { status: 400 },
        );
    }

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Image generation failed: ${message}` },
      { status: 500 },
    );
  }
}
