"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calculator, BookOpen, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Compare", href: "/compare", icon: Search },
  { label: "Tools", href: "/calculators", icon: Calculator },
  { label: "Learn", href: "/articles", icon: BookOpen },
  { label: "Account", href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className="surface-ink lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-canvas-15 pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${
                isActive ? "text-action-green" : "text-canvas-70"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-[22px] h-[22px]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
