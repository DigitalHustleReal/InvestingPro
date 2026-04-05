import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai-service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, length, style, audience, keyPoints } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `You are an expert YouTube script writer specializing in Indian personal finance content for the channel InvestingPro.

Generate a complete, production-ready YouTube video script with the following parameters:
- Topic: ${topic}
- Target Length: ${length || "10"} minutes
- Style: ${style || "educational"}
- Target Audience: ${audience || "beginners"} (Indian investors)
${keyPoints ? `- Key Points to Cover: ${keyPoints}` : ""}

IMPORTANT CONTEXT: This is for an Indian personal finance YouTube channel. Reference Indian financial instruments (SIP, PPF, NPS, ELSS, FDs, etc.), Indian tax sections (80C, 80D, etc.), Indian market context (SEBI, NSE, BSE, Sensex, Nifty), and use INR amounts (Rs/₹).

Return ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "title": "Video title here",
  "totalDuration": "${length || "10"} minutes",
  "sections": [
    {
      "title": "Hook (First 30 seconds)",
      "duration": "0:00 — 0:30",
      "content": "Full script text for this section with stage directions in [BRACKETS]"
    },
    {
      "title": "Introduction",
      "duration": "0:30 — 1:30",
      "content": "..."
    },
    {
      "title": "Main Content — Section 1",
      "duration": "...",
      "content": "..."
    },
    {
      "title": "Main Content — Section 2",
      "duration": "...",
      "content": "..."
    },
    {
      "title": "Main Content — Section 3",
      "duration": "...",
      "content": "..."
    },
    {
      "title": "Call to Action",
      "duration": "...",
      "content": "..."
    },
    {
      "title": "Outro",
      "duration": "...",
      "content": "..."
    }
  ]
}

Make the script engaging, conversational, and packed with actionable advice. Include stage directions like [B-ROLL], [SCREEN RECORDING], [TEXT OVERLAY], [CUT TO], etc. The hook must grab attention in the first 5 seconds. Spread the sections evenly across the ${length || "10"}-minute duration.`;

    const result = await aiService.generate(prompt, {
      format: "json",
      operation: "generate",
      tier: "precision",
    });

    // Parse the JSON response
    let parsed;
    try {
      // Strip potential markdown fences the model might add despite instructions
      const cleaned = result
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      logger.error(
        "Failed to parse AI script response as JSON",
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

    // Validate structure
    if (
      !parsed.title ||
      !Array.isArray(parsed.sections) ||
      parsed.sections.length === 0
    ) {
      return NextResponse.json(
        {
          error: "AI returned incomplete script. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      "Script generation error",
      error instanceof Error ? error : new Error(message),
    );

    if (message.includes("Daily budget")) {
      return NextResponse.json(
        { error: "AI budget limit reached. Try again later." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: message || "Script generation failed" },
      { status: 500 },
    );
  }
}
