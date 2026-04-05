import { NextRequest, NextResponse } from "next/server";
import { newsletterService } from "@/lib/services";
import { logger } from "@/lib/logger";
import { createAPIWrapper } from "@/lib/middleware/api-wrapper";
import { withValidation } from "@/lib/middleware/validation";
import { newsletterSubscribeSchema } from "@/lib/validation/schemas";
import { sanitizeText } from "@/lib/middleware/input-sanitization";

export const POST = createAPIWrapper("/api/newsletter", {
  rateLimitType: "public",
  trackMetrics: true,
})(
  withValidation(
    newsletterSubscribeSchema,
    undefined,
  )(async (request: NextRequest, body: any, _query: unknown) => {
    try {
      // Body is already validated by middleware
      // Sanitize user inputs
      const sanitizedEmail = body.email ? sanitizeText(body.email) : body.email;
      const sanitizedName = body.name ? sanitizeText(body.name) : body.name;

      const result = await newsletterService.subscribe({
        email: sanitizedEmail,
        name: sanitizedName,
        source: body.source,
        interests: body.interests,
        frequency: body.frequency,
      });

      return NextResponse.json(result);
    } catch (error) {
      logger.error(
        "Newsletter API error",
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error; // Let API wrapper handle error response
    }
  }),
);

export const GET = createAPIWrapper("/api/newsletter", {
  rateLimitType: "public",
  trackMetrics: true,
})(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const token = searchParams.get("token");

    if (action === "verify" && token) {
      const result = await newsletterService.verify(token);
      return NextResponse.json(result);
    }

    if (action === "count") {
      const count = await newsletterService.getSubscriberCount();
      return NextResponse.json({ count });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    logger.error(
      "Newsletter API GET error",
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error; // Let API wrapper handle error response
  }
});

export const DELETE = createAPIWrapper("/api/newsletter", {
  rateLimitType: "public",
  trackMetrics: true,
})(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    // Sanitize email input
    const sanitizedEmail = sanitizeText(email);
    const result = await newsletterService.unsubscribe(sanitizedEmail);
    return NextResponse.json(result);
  } catch (error) {
    logger.error(
      "Newsletter unsubscribe error",
      error instanceof Error ? error : new Error(String(error)),
    );
    throw error; // Let API wrapper handle error response
  }
});
