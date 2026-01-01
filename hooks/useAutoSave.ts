import { useEffect, useRef, useCallback } from 'react';

interface UseAutoSaveOptions {
    onSave: () => void | Promise<void>;
    delay?: number;
    enabled?: boolean;
}

/**
 * Auto-save hook that debounces save calls
 * Triggers save after user stops typing for specified delay
 */
export function useAutoSave({ onSave, delay = 3000, enabled = true }: UseAutoSaveOptions) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSaveRef = useRef<Date | null>(null);

    const triggerSave = useCallback(() => {
        if (!enabled) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(async () => {
            try {
                await onSave();
                lastSaveRef.current = new Date();
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, delay);
    }, [onSave, delay, enabled]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        triggerSave,
        lastSave: lastSaveRef.current,
    };
}


















