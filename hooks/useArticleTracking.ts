
import { useEffect, useRef } from 'react';

/**
 * Hook to track article view analytics
 * Records view on mount and tracks read time on unmount
 */
export function useArticleTracking(articleId: string | null | undefined) {
    const startTime = useRef<number>(Date.now());
    const hasTracked = useRef<boolean>(false);

    useEffect(() => {
        if (!articleId || hasTracked.current) return;
        
        // Record view after slight delay to avoid bots
        const timer = setTimeout(() => {
            recordView();
            hasTracked.current = true;
        }, 2000);

        return () => {
            clearTimeout(timer);
            
            // Record read duration on unmount
            if (hasTracked.current) {
                const duration = Math.round((Date.now() - startTime.current) / 1000);
                recordDuration(duration);
            }
        };
    }, [articleId]);

    const recordView = async () => {
        try {
            await fetch('/api/admin/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    articleId,
                    referrer: typeof document !== 'undefined' ? document.referrer : undefined
                })
            });
        } catch (error) {
            // Silent fail - analytics shouldn't break the app
            console.debug('View tracking failed', error);
        }
    };

    const recordDuration = async (duration: number) => {
        if (duration < 5) return; // Ignore very short visits
        
        try {
            await fetch('/api/admin/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    articleId,
                    duration
                })
            });
        } catch (error) {
            console.debug('Duration tracking failed', error);
        }
    };
}
