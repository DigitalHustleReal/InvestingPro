/**
 * ReadingProgressBar - Shows reading progress at top of article
 * UI/UX Phase 3 - Reading Progress Bar
 */

"use client";

import { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  /** Target element to track (usually article content) */
  targetId?: string;
  /** Custom progress value (0-100). If provided, overrides scroll tracking */
  progress?: number;
  /** Height of the progress bar */
  height?: number;
}

export function ReadingProgressBar({ 
  targetId = 'main-content',
  progress: externalProgress,
  height = 2 
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If external progress is provided, use it
    if (externalProgress !== undefined) {
      setProgress(Math.min(100, Math.max(0, externalProgress)));
      return;
    }

    // Otherwise, track scroll progress
    const calculateProgress = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        setProgress(0);
        return;
      }

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const targetTop = target.offsetTop;
      const targetHeight = target.offsetHeight;

      // Calculate how much of the target element has been scrolled
      const elementScrollTop = Math.max(0, scrollTop - targetTop);
      const elementScrollBottom = Math.min(targetHeight, scrollTop + windowHeight - targetTop);
      const scrolled = elementScrollBottom - elementScrollTop;
      
      const progressPercent = targetHeight > 0 
        ? (scrolled / targetHeight) * 100 
        : 0;

      setProgress(Math.min(100, Math.max(0, progressPercent)));
    };

    // Initial calculation
    calculateProgress();

    // Update on scroll
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [targetId, externalProgress]);

  if (progress === 0) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-gray-200/50 dark:bg-gray-800/50"
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div 
        className="h-full bg-gradient-to-r from-indian-gold/50 via-primary-500 to-indian-gold/100 transition-all duration-300 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
