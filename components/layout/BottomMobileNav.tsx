"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calculator, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    exact: true,
  },
  {
    label: "Compare",
    href: "/credit-cards",
    icon: Search,
    exact: false,
    matchPaths: [
      "/credit-cards",
      "/loans",
      "/mutual-funds",
      "/demat-accounts",
      "/fixed-deposits",
      "/insurance",
    ],
  },
  {
    label: "Tools",
    href: "/calculators",
    icon: Calculator,
    exact: false,
  },
  {
    label: "Learn",
    href: "/blog",
    icon: BookOpen,
    exact: false,
  },
  {
    label: "Account",
    href: "/profile",
    icon: User,
    exact: false,
    matchPaths: ["/profile", "/login", "/signup"],
  },
] as const;

export default function BottomMobileNav() {
  const pathname = usePathname();

  // Hide on admin pages and auth pages that have their own nav
  if (pathname?.startsWith("/admin")) return null;

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    if (item.exact) return pathname === item.href;
    if ("matchPaths" in item && item.matchPaths) {
      return item.matchPaths.some((p) => pathname?.startsWith(p));
    }
    return pathname?.startsWith(item.href) ?? false;
  }

  return (
    <nav
      className={cn(
        // Only visible on mobile, hidden on md+
        "fixed bottom-0 inset-x-0 z-50 md:hidden",
        // Safe area for notched phones
        "pb-safe",
        // v3 surface — solid (no glassmorphism), 2px ink border
        "bg-canvas border-t-2 border-ink/12",
      )}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full",
                "font-mono text-[10px] uppercase tracking-wider transition-colors",
                "min-w-0 py-1",
                active ? "text-indian-gold" : "text-ink-60 hover:text-ink",
              )}
              aria-current={active ? "page" : undefined}
            >
              <div className="relative flex items-center justify-center w-8 h-8">
                <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.8} />
                {/* Active gold underline indicator */}
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indian-gold" />
                )}
              </div>
              <span
                className={cn("truncate", active ? "font-bold" : "font-medium")}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
