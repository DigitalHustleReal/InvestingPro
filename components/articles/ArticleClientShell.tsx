"use client";

/**
 * ArticleClientShell — client island inside the ISR server article page.
 * Handles: reading progress bar, bookmark button, share button.
 * Everything else is server-rendered.
 */

import { useEffect, useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
import BookmarkButton from "@/components/engagement/BookmarkButton";

interface Props {
  articleId: string;
  articleTitle: string;
}

export function ArticleClientShell({ articleId, articleTitle }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.getElementById("article-content");
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = Math.max(0, -top);
      const pct = Math.min(100, (scrolled / height) * 100);
      setProgress(pct);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* Reading progress bar — fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-muted/30 pointer-events-none">
        <div
          className="h-full bg-primary transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Inline bookmark + share — rendered in meta row via portal target */}
      <div id="article-actions" className="contents">
        <div className="flex items-center gap-1.5">
          <BookmarkButton articleId={articleId} variant="icon" size="sm" />
          <button
            onClick={handleShare}
            title="Share article"
            className="w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors flex items-center justify-center"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
