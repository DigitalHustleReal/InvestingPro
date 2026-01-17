/**
 * Unsaved Changes Warning Hook
 * 
 * Warns user before leaving page with unsaved changes
 */

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface UseUnsavedChangesOptions {
    enabled: boolean;
    message?: string;
    onBeforeLeave?: () => boolean; // Return false to prevent navigation
}

/**
 * Warn user before leaving page with unsaved changes
 */
export function useUnsavedChanges(options: UseUnsavedChangesOptions) {
    const { enabled, message = 'You have unsaved changes. Are you sure you want to leave?', onBeforeLeave } = options;
    const router = useRouter();
    const isLeavingRef = useRef(false);

    useEffect(() => {
        if (!enabled) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = message;
            return message;
        };

        // Handle browser back/forward
        const handlePopState = (e: PopStateEvent) => {
            if (!isLeavingRef.current) {
                const confirmed = window.confirm(message);
                if (!confirmed) {
                    e.preventDefault();
                    window.history.pushState(null, '', window.location.href);
                } else {
                    isLeavingRef.current = true;
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [enabled, message]);

    // Intercept router navigation
    const originalPush = router.push;
    const originalReplace = router.replace;

    useEffect(() => {
        if (!enabled) return;

        router.push = ((href: string, options?: any) => {
            if (!isLeavingRef.current) {
                const shouldLeave = onBeforeLeave ? onBeforeLeave() : window.confirm(message);
                if (!shouldLeave) {
                    return Promise.resolve(false);
                }
                isLeavingRef.current = true;
            }
            return originalPush.call(router, href, options);
        }) as typeof router.push;

        router.replace = ((href: string, options?: any) => {
            if (!isLeavingRef.current) {
                const shouldLeave = onBeforeLeave ? onBeforeLeave() : window.confirm(message);
                if (!shouldLeave) {
                    return Promise.resolve(false);
                }
                isLeavingRef.current = true;
            }
            return originalReplace.call(router, href, options);
        }) as typeof router.replace;

        return () => {
            router.push = originalPush;
            router.replace = originalReplace;
        };
    }, [enabled, message, onBeforeLeave, router]);
}
