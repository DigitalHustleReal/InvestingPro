"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES, getActiveCategory } from "@/lib/admin/navigation-config";

/**
 * Header Nav (Layer 1): Main groups – Content, Automation, Pipeline, Insights, etc.
 * Always visible below the top bar. Drives which sections appear in the contextual sidebar.
 */
export default function AdminHeaderNav() {
  const pathname = usePathname();
  const activeCategory = getActiveCategory(pathname);

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar px-2 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-border/50 sticky top-0 z-30"
      aria-label="Main navigation"
    >
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        return (
          <Link
            key={category.id}
            href={category.defaultPath}
            className={cn(
              "relative flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-in-out",
              isActive
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{category.label}</span>
            {/* Active underline indicator with smooth transition */}
            <span
              className={cn(
                "absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary transition-all duration-300 ease-in-out",
                isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
