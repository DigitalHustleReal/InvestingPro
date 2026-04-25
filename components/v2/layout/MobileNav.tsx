"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calculator, BookOpen, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT, useLocale } from "@/lib/i18n/client";
import { localizedPath, stripLocale } from "@/lib/i18n/url";
import type { StringKey } from "@/lib/i18n/strings/en";

interface NavItem {
  /** English fallback shown when no labelKey is set or the key is
   *  missing in the active locale. */
  label: string;
  labelKey?: StringKey;
  href: string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Compare", labelKey: "nav.compare", href: "/compare", icon: Search },
  {
    label: "Tools",
    labelKey: "section.tools",
    href: "/calculators",
    icon: Calculator,
  },
  { label: "Learn", labelKey: "nav.learn", href: "/articles", icon: BookOpen },
  { label: "Account", href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();
  const t = useT();
  const locale = useLocale();

  if (pathname?.startsWith("/admin")) return null;

  // Active-state matching against the canonical (locale-stripped) path
  // so /hi/compare still highlights the "Compare" tab.
  const canonicalPath = pathname ? stripLocale(pathname).basePath : "/";

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
              ? canonicalPath === "/"
              : canonicalPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={localizedPath(item.href, locale)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${
                isActive ? "text-action-green" : "text-canvas-70"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-[22px] h-[22px]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">
                {item.labelKey ? t(item.labelKey) : item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
