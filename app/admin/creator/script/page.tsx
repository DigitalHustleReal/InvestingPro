"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Video, ArrowLeft, Loader2, Copy, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ScriptSection {
  title: string;
  content: string;
  duration: string;
}

interface GeneratedScript {
  title: string;
  totalDuration: string;
  sections: ScriptSection[];
}

/* ------------------------------------------------------------------ */
/*  Mock script generation                                             */
/* ------------------------------------------------------------------ */

function generateMockScript(
  topic: string,
  length: string,
  style: string,
  audience: string,
): GeneratedScript {
  const durationMap: Record<string, string> = {
    "5": "5 minutes",
    "10": "10 minutes",
    "15": "15 minutes",
    "20": "20 minutes",
  };

  return {
    title: `${topic} — Complete ${style.charAt(0).toUpperCase() + style.slice(1)} Guide`,
    totalDuration: durationMap[length] || "10 minutes",
    sections: [
      {
        title: "Hook (First 30 seconds)",
        duration: "0:00 — 0:30",
        content: `[OPEN ON: Dynamic text overlay with trending graph]\n\n"Did you know that most ${audience === "beginners" ? "new investors" : "investors"} make this one critical mistake with ${topic.toLowerCase()}? In the next ${length} minutes, I'll show you exactly how to avoid it — and what the smart money is doing instead."\n\n[CUT TO: Host on camera, energetic delivery]\n\n"What's going on everyone — welcome back to the channel. If you're new here, hit that subscribe button because we break down complex finance topics into actionable strategies."`,
      },
      {
        title: "Introduction",
        duration: "0:30 — 1:30",
        content: `"So today we're diving deep into ${topic.toLowerCase()}. ${style === "educational" ? "I'm going to break this down step by step so even if you've never looked at this before, you'll walk away with a complete understanding." : style === "news analysis" ? "There's been a lot of movement in this space recently, and I want to give you the full picture of what's happening and why it matters for your portfolio." : style === "tutorial" ? "I'll walk you through the exact process I use, screen by screen, so you can replicate this yourself." : "We're going to keep this fun and easy to follow — no boring jargon, I promise."}\n\n[B-ROLL: Relevant charts/data visualizations]\n\nHere's what we'll cover:\n1. The fundamentals you need to know\n2. Common mistakes and how to avoid them\n3. A proven strategy that actually works\n4. My personal recommendations for ${audience === "beginners" ? "getting started" : audience === "intermediate" ? "leveling up" : "optimizing returns"}"`,
      },
      {
        title: "Main Content — Section 1: Fundamentals",
        duration: "1:30 — 4:00",
        content: `"Let's start with the basics of ${topic.toLowerCase()}.\n\n[SCREEN RECORDING / GRAPHICS]\n\nFirst thing to understand — ${topic.toLowerCase()} isn't as complicated as people make it sound. At its core, it's about [key principle].\n\n${audience === "beginners" ? "Think of it like this: imagine you're building a house. You wouldn't start with the roof, right? Same thing here — we need to lay the foundation first." : "You probably already know the basics, so let me skip ahead to what actually moves the needle."}\n\nHere are the three numbers that matter most:\n- [Metric 1] — this tells you [explanation]\n- [Metric 2] — watch this closely because [reason]\n- [Metric 3] — most people ignore this, but it's crucial"`,
      },
      {
        title: "Main Content — Section 2: Common Mistakes",
        duration: "4:00 — 7:00",
        content: `"Now here's where most people go wrong.\n\n[TEXT OVERLAY: Mistake #1]\n\nMistake number one: [specific mistake related to ${topic.toLowerCase()}]. I see this ALL the time in the comments. People think [misconception], but the data shows [reality].\n\n[SHOW DATA/CHART]\n\nMistake number two: timing the market instead of time IN the market. Whether it's ${topic.toLowerCase()} or anything else, consistency beats trying to be clever.\n\nMistake number three: ignoring the tax implications. In India, ${topic.toLowerCase()} has specific tax rules under Section [X] that can save you — or cost you — lakhs over time."`,
      },
      {
        title: "Main Content — Section 3: Proven Strategy",
        duration: "7:00 — 10:00",
        content: `"Alright, now for the good stuff — here's the strategy.\n\n[ANIMATED BREAKDOWN]\n\nStep 1: ${audience === "beginners" ? "Open a demat account with a SEBI-registered broker" : "Review your current allocation"}\nStep 2: Research using the criteria I just showed you\nStep 3: Start with [specific amount/approach] and scale from there\nStep 4: Set up automatic [investments/reviews] every [period]\n\nI personally use this exact approach, and here are my results over the last [timeframe]:\n\n[SHOW RESULTS SCREENSHOT]\n\nNow, I'm not a financial advisor — this is what works for me. Always do your own research."`,
      },
      {
        title: "Call to Action",
        duration: `${parseInt(length) - 1}:00 — ${parseInt(length) - 0}:30`,
        content: `"If you found this helpful, smash that like button — it really helps the channel. And if you want more content like this, subscribe and hit the bell icon so you never miss an upload.\n\n[END SCREEN OVERLAY]\n\nI also made a detailed video on [related topic] — I'll link it right here. Go check it out next.\n\nDrop a comment below telling me: what's YOUR biggest question about ${topic.toLowerCase()}? I read every single comment and might feature yours in the next video."`,
      },
      {
        title: "Outro",
        duration: `${parseInt(length) - 0}:30 — ${length}:00`,
        content: `"That's it for today's video. Remember — ${audience === "beginners" ? "everyone starts somewhere, and the fact that you're watching this puts you ahead of 90% of people" : "the key to success is consistency and continuous learning"}.\n\nI'll see you in the next one. Until then — invest smart, stay informed.\n\n[END SCREEN: Subscribe + Next Video + Playlist]\n[MUSIC FADES OUT]"`,
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ScriptGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("10");
  const [style, setStyle] = useState("educational");
  const [audience, setAudience] = useState("beginners");
  const [keyPoints, setKeyPoints] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<GeneratedScript | null>(null);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) {
      toast.error("Please enter a video topic");
      return;
    }

    setIsGenerating(true);
    setScript(null);

    // Mock generation with setTimeout
    setTimeout(() => {
      const generated = generateMockScript(topic, length, style, audience);
      setScript(generated);
      setIsGenerating(false);
      toast.success("Script generated successfully!", {
        description: `${generated.sections.length} sections — ${generated.totalDuration} total`,
      });
    }, 2500);
  }, [topic, length, style, audience]);

  const handleCopySection = useCallback((section: ScriptSection) => {
    navigator.clipboard.writeText(section.content).then(() => {
      toast.success(`Copied "${section.title}" to clipboard`);
    });
  }, []);

  const handleCopyAll = useCallback(() => {
    if (!script) return;
    const full = script.sections
      .map((s) => `## ${s.title}\n[${s.duration}]\n\n${s.content}`)
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(full).then(() => {
      toast.success("Full script copied to clipboard");
    });
  }, [script]);

  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/creator"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Creator Studio
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Video className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                YouTube Script Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Generate structured video scripts for finance YouTube content.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Script Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Topic */}
              <div className="space-y-2">
                <Label htmlFor="topic">Video Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g. Best SIP strategies for 2026"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* Target Length */}
              <div className="space-y-2">
                <Label>Target Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                    <SelectItem value="news analysis">News Analysis</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginners">Beginners</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Key Points */}
              <div className="space-y-2">
                <Label htmlFor="keypoints">Key Points to Cover</Label>
                <Textarea
                  id="keypoints"
                  placeholder="Optional: bullet points or topics you want the script to include..."
                  rows={4}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Right — Output */}
          <div className="lg:col-span-2 space-y-4">
            {!script && !isGenerating && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 mb-4">
                    <Video className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    No script generated yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Fill in the settings on the left and click Generate Script
                    to create a structured YouTube video script.
                  </p>
                </CardContent>
              </Card>
            )}

            {isGenerating && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-1">
                    Generating your script...
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Crafting a {length}-minute {style} script for {audience}{" "}
                    audience.
                  </p>
                </CardContent>
              </Card>
            )}

            {script && !isGenerating && (
              <>
                {/* Script header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{script.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {script.totalDuration}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {script.sections.length} sections
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyAll}>
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy All
                  </Button>
                </div>

                {/* Script sections */}
                {script.sections.map((section, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {i + 1}
                          </span>
                          <CardTitle className="text-sm font-semibold">
                            {section.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {section.duration}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleCopySection(section)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed font-sans">
                        {section.content}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </AdminPageContainer>
    </AdminLayout>
  );
}
