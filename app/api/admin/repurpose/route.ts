import { NextRequest, NextResponse } from "next/server";
import { repurposeArticle, RepurposeFormat } from "@/lib/automation/repurposer";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export async function POST(req: NextRequest) {
  try {
    const { error: authError } = await requireAdminApi();
    if (authError) return authError;

    const body = await req.json();
    const { title, content, format } = body;

    if (!title || !content || !format) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await repurposeArticle(
      content,
      title,
      format as RepurposeFormat,
    );

    return NextResponse.json({
      success: true,
      data: result.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Repurposing failed" },
      { status: 500 },
    );
  }
}
