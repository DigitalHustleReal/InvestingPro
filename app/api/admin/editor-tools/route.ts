import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { autoOptimizeArticle } from "@/lib/automation/seo-optimizer";
import { proofreadContent } from "@/lib/automation/copy-editor";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export async function POST(req: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const body = await req.json();
    const { action, title, content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    if (action === "optimize-seo") {
      const result = await autoOptimizeArticle(title || "", content);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === "proofread") {
      const result = await proofreadContent(content);
      return NextResponse.json({ success: true, polished_content: result });
    } else if (action === "generate-image") {
      const keyword = body.keyword || title; // Use keyword if provided, else title
      if (!keyword)
        return NextResponse.json(
          { error: "Keyword or Title required" },
          { status: 400 },
        );

      // Lazy import to avoid circular dep if any (though unlikely here)
      const { imageService } =
        await import("@/lib/images/stock-image-service-enhanced");
      const imageResult = await imageService.getFeaturedImage(keyword);

      if (!imageResult) {
        return NextResponse.json(
          { success: false, error: "No image found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        url: imageResult.url,
        alt: imageResult.alt_text,
        source: imageResult.source,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    logger.error("Editor Tool Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
