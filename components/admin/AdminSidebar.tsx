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
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Contextual sidebar (Layer 2): Shows sections for the active main group from Header Nav.
 * Supports collapsed state (72px icons-only) and expanded state (260px icons + labels).
 */
export default function AdminSidebar({
  collapsed = false,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const activeCategory = getActiveCategory(pathname);
  const navSections = getCategorySections(activeCategory);

  return (
    <div
      className={cn(
        "h-full flex flex-col pt-5 pb-5 bg-card border-r border-border transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      <nav
        className={cn("flex-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}
        aria-label="Main navigation"
      >
        {navSections.map((section, sectionIndex) => (
          <div key={section.title} className="mb-6">
            {sectionIndex > 0 && (
              <div
                className="mb-3 mt-1 border-t border-border-subtle"
                aria-hidden="true"
              />
            )}
            {!collapsed && (
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 pl-3 font-inter">
                {section.title}
              </h3>
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
          "mt-auto border-t border-border pt-4 pb-2",
          collapsed ? "px-2" : "px-3",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl bg-muted border border-border hover:bg-muted/80 transition-colors cursor-pointer group",
            collapsed ? "p-2 justify-center" : "p-2.5",
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all font-inter">
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
              "flex items-center justify-center rounded-lg border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200",
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
        "flex items-center gap-3 py-3 rounded-md text-sm font-medium transition-all duration-200 group relative font-inter",
        collapsed ? "px-0 justify-center" : "px-3",
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
