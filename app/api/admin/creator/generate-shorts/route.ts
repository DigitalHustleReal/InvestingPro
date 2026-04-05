import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai-service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, platform, tone } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const platformLabel =
      platform === "both"
        ? "YouTube Shorts and Instagram Reels"
        : platform === "youtube"
          ? "YouTube Shorts"
          : "Instagram Reels";

    const prompt = `You are an expert short-form video script writer for Indian personal finance content (InvestingPro channel).

Generate exactly 3 short-form video script variations for:
- Topic: ${topic}
- Platform: ${platformLabel}
- Tone: ${tone || "professional"}

IMPORTANT CONTEXT: This is for Indian audiences. Reference Indian financial context — SIP, mutual funds, PPF, NPS, ELSS, FDs, tax sections (80C, 80D), INR amounts (Rs/₹), SEBI, NSE/BSE, etc.

Each script should be 30-60 seconds when spoken aloud. Each variation should take a DIFFERENT angle on the topic.

Return ONLY valid JSON (no markdown, no code fences) in this exact format:
[
  {
    "id": 1,
    "hookLine": "An attention-grabbing opening line (max 15 words)",
    "keyPoints": [
      "Point 1 — concise, punchy, actionable",
      "Point 2 — ...",
      "Point 3 — ...",
      "Point 4 — ..."
    ],
    "cta": "Call to action tailored to ${platformLabel}",
    "hashtags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6", "Tag7"]
  },
  {
    "id": 2,
    "hookLine": "...",
    "keyPoints": ["...", "...", "..."],
    "cta": "...",
    "hashtags": ["...", "...", "...", "...", "...", "...", "..."]
  },
  {
    "id": 3,
    "hookLine": "...",
    "keyPoints": ["...", "...", "...", "..."],
    "cta": "...",
    "hashtags": ["...", "...", "...", "...", "...", "...", "..."]
  }
]

Make each variation distinct:
- Variation 1: Myth-busting / contrarian take
- Variation 2: Step-by-step / how-to
- Variation 3: Story / relatable scenario

Hook lines must stop the scroll — provocative, surprising, or emotionally compelling. Hashtags should mix broad (#PersonalFinance) with niche (#${topic.replace(/\s+/g, "")}).`;

    const result = await aiService.generate(prompt, {
      format: "json",
      operation: "generate",
      tier: "precision",
    });

    // Parse the JSON response
    let parsed;
    try {
      const cleaned = result
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      logger.error(
        "Failed to parse AI shorts response as JSON",
        new Error("JSON parse error"),
      );
      return NextResponse.json(
        {
          error: "AI returned invalid format. Please try again.",
          raw: result.substring(0, 500),
        },
        { status: 502 },
      );
    }

    // Validate structure — expect an array of 3
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json(
        {
          error: "AI returned incomplete shorts data. Please try again.",
        },
        { status: 502 },
      );
    }

    // Ensure each item has required fields
    const validated = parsed.map(
      (item: Record<string, unknown>, index: number) => ({
        id: index + 1,
        hookLine: (item.hookLine as string) || "",
        keyPoints: Array.isArray(item.keyPoints) ? item.keyPoints : [],
        cta: (item.cta as string) || "",
        hashtags: Array.isArray(item.hashtags) ? item.hashtags : [],
      }),
    );

    return NextResponse.json({ success: true, data: validated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      "Shorts generation error",
      error instanceof Error ? error : new Error(message),
    );

    if (message.includes("Daily budget")) {
      return NextResponse.json(
        { error: "AI budget limit reached. Try again later." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: message || "Shorts generation failed" },
      { status: 500 },
    );
  }
}
