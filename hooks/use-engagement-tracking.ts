/**
 * Client-side Engagement Tracking Hook
 * 
 * Purpose: Track user engagement on article pages
 */

'use client';

import { useEffect, useRef } from 'react';
import { engagementTracker } from '@/lib/intelligence/analyzers/engagement-tracker';

export function useEngagementTracking(articleId: string, userId?: string) {
  const sessionId = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const startTime = useRef<number>(Date.now());
  const maxScroll = useRef<number>(0);

  useEffect(() => {
    // Initialize session
    engagementTracker.initializeSession(articleId, sessionId.current, userId);

    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const scrollDepth = ((scrollTop + windowHeight) / documentHeight) * 100;
      maxScroll.current = Math.max(maxScroll.current, scrollDepth);
      
      engagementTracker.updateScrollDepth(sessionId.current, maxScroll.current);
      
      // Mark as completed if scrolled to bottom
      if (scrollDepth > 95) {
        engagementTracker.completeSession(sessionId.current);
      }
    };

    // Track time on page
    const timeInterval = setInterval(() => {
      const timeOnPage = (Date.now() - startTime.current) / 1000;
      engagementTracker.updateTimeOnPage(sessionId.current, timeOnPage);
    }, 5000); // Update every 5 seconds

    // Add event listeners
    window.addEventListener('scroll', handleScroll);

    // Save session on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
      
      const timeOnPage = (Date.now() - startTime.current) / 1000;
      engagementTracker.updateTimeOnPage(sessionId.current, timeOnPage);
      engagementTracker.saveSession(sessionId.current);
    };
  }, [articleId, userId]);

  // Return tracking functions
  return {
    trackClick: () => engagementTracker.trackInteraction(sessionId.current, 'click'),
    trackShare: () => engagementTracker.trackInteraction(sessionId.current, 'share'),
    trackBookmark: () => engagementTracker.trackInteraction(sessionId.current, 'bookmark'),
    trackCalculator: () => engagementTracker.trackInteraction(sessionId.current, 'calculator'),
    trackAffiliate: () => engagementTracker.trackInteraction(sessionId.current, 'affiliate'),
    trackCompare: () => engagementTracker.trackInteraction(sessionId.current, 'compare'),
  };
}
