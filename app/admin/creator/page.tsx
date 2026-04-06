"use client";

import React from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Video,
  Smartphone,
  Compass,
  Share2,
  Clapperboard,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Tool card data                                                     */
/* ------------------------------------------------------------------ */

interface CreatorTool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const TOOLS: CreatorTool[] = [
  {
    id: "script",
    name: "YouTube Script Generator",
    description: "Generate scripts for finance YouTube videos",
    icon: Video,
    href: "/admin/creator/script",
  },
  {
    id: "shorts",
    name: "Shorts/Reels Generator",
    description: "Create short-form video scripts for Instagram/YouTube",
    icon: Smartphone,
    href: "/admin/creator/shorts",
  },
  {
    id: "research",
    name: "Topic Research",
    description: "Discover trending finance topics with data",
    icon: Compass,
    href: "/admin/creator/research",
    badge: "Coming Soon",
  },
  {
    id: "social",
    name: "Social Posts",
    description: "Generate platform-specific social media posts",
    icon: Share2,
    href: "/admin/creator/social",
    badge: "Coming Soon",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function CreatorStudioPage() {
  return (
    <AdminLayout>
      <AdminPageContainer>
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Clapperboard className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Creator Studio
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered tools for video scripts, short-form content,
                research, and social media posts.
              </p>
            </div>
          </div>
        </div>

        {/* Tool Cards — 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isDisabled = !!tool.badge;

            const card = (
              <Card
                key={tool.id}
                className={cn(
                  "group relative transition-all duration-200",
                  isDisabled
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow-md hover:border-emerald-500/30 cursor-pointer",
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    {tool.badge && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle className="text-base font-semibold">
                    {tool.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                  {!isDisabled && (
                    <div className="flex items-center text-sm font-medium text-emerald-400 pt-1 group-hover:translate-x-0.5 transition-transform">
                      Open tool
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );

            if (isDisabled) {
              return <div key={tool.id}>{card}</div>;
            }

            return (
              <Link key={tool.id} href={tool.href} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </AdminPageContainer>
    </AdminLayout>
  );
}
