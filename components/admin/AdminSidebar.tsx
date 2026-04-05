"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getCategorySections,
  getActiveCategory,
  type NavItem,
} from "@/lib/admin/navigation-config";
import { cn } from "@/lib/utils";

/**
 * Contextual sidebar (Layer 2): Shows sections for the active main group from Header Nav.
 * Modernized with Glassmorphism.
 */
export default function AdminSidebar() {
  const pathname = usePathname();
  const activeCategory = getActiveCategory(pathname);
  const navSections = getCategorySections(activeCategory);

  return (
    <div className="h-full flex flex-col pt-5 pb-5 bg-card border-r border-border transition-all duration-300">
      <nav className="flex-1 overflow-y-auto px-3" aria-label="Main navigation">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title} className="mb-6">
            {sectionIndex > 0 && (
              <div
                className="mb-3 mt-1 border-t border-border-subtle"
                aria-hidden="true"
              />
            )}
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 pl-3 font-inter">
              {section.title}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <SidebarLink item={item} isActive={isActive} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto border-t border-border pt-4 px-3 pb-2">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted border border-border hover:bg-muted/80 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all font-inter">
            DH
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground m-0 font-inter group-hover:text-foreground transition-colors">
              Digital Hustle
            </p>
            <p className="text-[11px] text-muted-foreground m-0 font-inter">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate component for hover state handling
function SidebarLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 group relative font-inter",
        isActive
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
      )}
      <Icon
        className={cn(
          "w-4 h-4 transition-colors relative z-10",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span className="relative z-10">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={cn(
            "ml-auto text-[10px] px-1.5 py-0.5 rounded-full relative z-10 transition-colors font-bold",
            isActive
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}
