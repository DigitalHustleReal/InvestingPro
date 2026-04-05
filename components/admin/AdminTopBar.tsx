"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function AdminTopBar() {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <header
      data-admin-header
      role="banner"
      className="sticky top-0 z-50 w-full h-16 flex items-center border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-between w-full px-6">
        {/* Brand - SaaS Style */}
        <div className="flex items-center gap-3 shrink-0 min-w-[200px]">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 font-bold">
            IP
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            InvestingPro
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 bg-primary/10 text-primary border border-primary/20">
            CMS
          </span>
        </div>

        {/* Spacer — navigation moved to sidebar */}
        <div className="flex-1 min-w-0 mx-2" />

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0 justify-end min-w-[200px]">
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden lg:inline">View Site</span>
          </Link>

          <div className="w-px h-6 bg-border mx-1" />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border-none cursor-pointer transition-colors",
                userMenuOpen
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
              aria-expanded={userMenuOpen}
            >
              <span className="hidden sm:inline">Account</span>
              <Settings className="h-4 w-4" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] bg-card backdrop-blur-md rounded-lg shadow-xl border border-border p-1 z-[100]">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error bg-transparent hover:bg-error/10 border-none rounded-md cursor-pointer text-left transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
