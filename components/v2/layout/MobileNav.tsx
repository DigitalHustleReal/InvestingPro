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
      className="lg:hidden fixed bottom-0 left-0 right-0 min-h-[56px] bg-white dark:bg-[#0A1F14] border-t border-gray-200 dark:border-white/10 z-50 flex pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="Mobile navigation"
    >
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
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
              isActive
                ? "text-[#16A34A]"
                : "text-[#0A1F14]/40 dark:text-white/40"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
