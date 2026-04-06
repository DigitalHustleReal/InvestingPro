"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NAV_SECTIONS,
  getCategorySections,
  getActiveCategory,
  type NavItem,
} from "@/lib/admin/navigation-config";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Single dark sidebar showing ALL navigation sections (Conduit-style).
 * Supports collapsed state (72px icons-only) and expanded state (260px icons + labels).
 */
export default function AdminSidebar({
  collapsed = false,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const allSections = Object.values(NAV_SECTIONS);

  return (
    <div
      className={cn(
        "h-full flex flex-col pt-0 pb-3 bg-gray-950 text-gray-300 border-r border-white/[0.06] transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      {/* Brand / Logo area */}
      <div
        className={cn(
          "shrink-0 flex items-center gap-2.5 border-b border-white/[0.06] h-16",
          collapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-emerald-500/25 font-inter">
          IP
        </div>
        {!collapsed && (
          <span className="text-[15px] font-bold text-white tracking-tight font-inter">
            InvestingPro
          </span>
        )}
      </div>

      <nav
        className={cn(
          "flex-1 overflow-y-auto pt-4",
          collapsed ? "px-2" : "px-3",
        )}
        aria-label="Main navigation"
      >
        {allSections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className={cn("mb-4", sectionIndex > 0 && "mt-1")}
          >
            {!collapsed && (
              <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 pl-3 font-inter">
                {section.title}
              </h3>
            )}
            {collapsed && sectionIndex > 0 && (
              <div
                className="mb-3 mt-1 border-t border-white/[0.06]"
                aria-hidden="true"
              />
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <SidebarLink
                      item={item}
                      isActive={isActive}
                      collapsed={collapsed}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile card */}
      <div
        className={cn(
          "mt-auto border-t border-white/[0.06] pt-4 pb-2",
          collapsed ? "px-2" : "px-3",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors cursor-pointer group",
            collapsed ? "p-2 justify-center" : "p-2.5",
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all font-inter">
            DH
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground m-0 font-inter group-hover:text-foreground transition-colors">
                Digital Hustle
              </p>
              <p className="text-[11px] text-muted-foreground m-0 font-inter">
                Super Admin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse/Expand toggle button */}
      {onToggle && (
        <div
          className={cn(
            "px-2 pt-2",
            collapsed ? "flex justify-center" : "px-3",
          )}
        >
          <button
            onClick={onToggle}
            className={cn(
              "flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.07] text-gray-400 hover:text-white transition-all duration-200",
              collapsed ? "w-10 h-10" : "w-full h-9 gap-2",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-medium font-inter">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// Separate component for hover state handling
function SidebarLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group relative font-inter",
        collapsed ? "px-0 justify-center" : "px-3",
        isActive
          ? "text-primary bg-primary/10 border-l-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-l-2 border-transparent",
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 transition-colors relative z-10 shrink-0",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      {!collapsed && (
        <span className="relative z-10 transition-opacity duration-200">
          {item.label}
        </span>
      )}
      {!collapsed && item.badge !== undefined && item.badge > 0 && (
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
