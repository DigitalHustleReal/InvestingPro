"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface ArticleFeedbackProps {
  articleId: string;
}

export default function ArticleFeedback({ articleId }: ArticleFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const storageKey = `feedback_${articleId}`;

  useEffect(() => {
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) {
        setSubmitted(true);
      }
    } catch {
      // localStorage unavailable (SSR or privacy mode)
    }
  }, [storageKey]);

  const handleFeedback = useCallback(
    async (helpful: boolean) => {
      if (submitted || loading) return;
      setLoading(true);

      try {
        // Save to localStorage first (prevents double voting)
        localStorage.setItem(storageKey, helpful ? "yes" : "no");
      } catch {
        // localStorage unavailable
      }

      // Attempt Supabase save (non-blocking, best-effort)
      try {
        const supabase = createClient();
        await supabase.from("article_feedback").insert({
          article_id: articleId,
          helpful,
          created_at: new Date().toISOString(),
        });
      } catch {
        // Table may not exist yet — that's fine, localStorage is the fallback
      }

      setSubmitted(true);
      setLoading(false);
    },
    [articleId, storageKey, submitted, loading],
  );

  if (submitted) {
    return (
      <div className="my-12 flex items-center justify-center gap-3 rounded-sm border border-green-200 bg-action-green/10 px-6 py-5 dark:border-green-800 dark:bg-green-950/30">
        <CheckCircle2 className="h-5 w-5 text-action-green dark:text-green-400" />
        <span className="text-sm font-medium text-green-800 dark:text-green-300">
          Thank you for your feedback!
        </span>
      </div>
    );
  }

  return (
    <div className="my-12 rounded-sm border border-ink/10 bg-white px-6 py-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-4 text-base font-semibold text-ink dark:text-gray-100">
        Was this article helpful?
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => handleFeedback(true)}
          className={cn(
            "gap-2 rounded-lg border-gray-300 px-6 py-2.5 text-sm font-medium transition-colors",
            "hover:border-green-500 hover:bg-action-green/10 hover:text-authority-green",
            "dark:border-gray-600 dark:hover:border-green-500 dark:hover:bg-green-950/40 dark:hover:text-green-400",
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
        </Button>
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => handleFeedback(false)}
          className={cn(
            "gap-2 rounded-lg border-gray-300 px-6 py-2.5 text-sm font-medium transition-colors",
            "hover:border-red-400 hover:bg-red-50 hover:text-red-600",
            "dark:border-gray-600 dark:hover:border-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400",
          )}
        >
          <ThumbsDown className="h-4 w-4" />
          No
        </Button>
      </div>
    </div>
  );
}
