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
/*  AI script generation via API                                       */
/* ------------------------------------------------------------------ */

async function generateScriptFromAI(
  topic: string,
  length: string,
  style: string,
  audience: string,
  keyPoints: string,
): Promise<GeneratedScript> {
  const response = await fetch("/api/admin/creator/generate-script", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, length, style, audience, keyPoints }),
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || "Script generation failed");
  }

  return json.data as GeneratedScript;
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

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error("Please enter a video topic");
      return;
    }

    setIsGenerating(true);
    setScript(null);

    try {
      const generated = await generateScriptFromAI(
        topic,
        length,
        style,
        audience,
        keyPoints,
      );
      setScript(generated);
      toast.success("Script generated successfully!", {
        description: `${generated.sections.length} sections — ${generated.totalDuration} total`,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Script generation failed";
      toast.error("Generation failed", { description: message });
    } finally {
      setIsGenerating(false);
    }
  }, [topic, length, style, audience, keyPoints]);

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
