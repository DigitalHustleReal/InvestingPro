"use client";

import React, { useState, useEffect } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Sidebar Table of Contents — sticky, scroll-spy, in the right sidebar
 * Replaces the DraggableTableOfContents overlay
 */
export default function SidebarTableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");

  // Scan headings from article content
  useEffect(() => {
    let attempts = 0;

    const scan = () => {
      const container =
        document.getElementById("article-content") ||
        document.querySelector(".prose");
      if (!container) return false;

      const els = container.querySelectorAll("h2, h3");
      if (els.length < 2) return false;

      const items: TOCItem[] = [];
      els.forEach((el, i) => {
        const id = el.id || `toc-${i}`;
        el.id = id;
        const text = el.textContent?.trim() || "";
        if (text.length > 2 && text.length < 120) {
          items.push({ id, text, level: parseInt(el.tagName[1]) });
        }
      });

      if (items.length > 0) {
        setHeadings(items);
        return true;
      }
      return false;
    };

    scan();
    const interval = setInterval(() => {
      if (scan() || attempts++ > 15) clearInterval(interval);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Scroll spy
  useEffect(() => {
    if (headings.length === 0) return;

    const onScroll = () => {
      const offset = 120;
      let current = "";
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = headings[i].id;
          break;
        }
      }
      if (current && current !== activeId) setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings, activeId]);

  if (headings.length < 3) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <List className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          In This Article
        </span>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(h.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(h.id);
                }}
                className={cn(
                  "block text-[13px] leading-snug py-1.5 px-3 rounded-lg transition-all",
                  h.level === 3 ? "pl-6" : "",
                  activeId === h.id
                    ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
