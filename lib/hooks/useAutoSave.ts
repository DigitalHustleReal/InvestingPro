/**
 * Auto-save Hook
 * 
 * Automatically saves form data at intervals and on blur
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): T & { cancel: () => void } {
    let timeout: NodeJS.Timeout | null = null;
    
    const debounced = ((...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T & { cancel: () => void };
    
    debounced.cancel = () => {
        if (timeout) clearTimeout(timeout);
        timeout = null;
    };
    
    return debounced;
}

export interface AutoSaveOptions {
    saveFn: (data: any) => Promise<void>;
    interval?: number; // Auto-save interval in ms (default: 30000)
    enabled?: boolean; // Enable/disable auto-save (default: true)
    onSaveStart?: () => void;
    onSaveSuccess?: () => void;
    onSaveError?: (error: Error) => void;
}

export interface AutoSaveState {
    isSaving: boolean;
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;
}

/**
 * Auto-save hook
 */
export function useAutoSave<T extends Record<string, any>>(
    data: T,
    options: AutoSaveOptions
): AutoSaveState {
    const {
        saveFn,
        interval = 30000,
        enabled = true,
        onSaveStart,
        onSaveSuccess,
        onSaveError,
    } = options;

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const dataRef = useRef(data);
    const lastSavedDataRef = useRef<string>('');
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update data ref when data changes
    useEffect(() => {
        dataRef.current = data;
        const dataString = JSON.stringify(data);
        
        if (dataString !== lastSavedDataRef.current && lastSavedDataRef.current !== '') {
            setHasUnsavedChanges(true);
        }
    }, [data]);

    // Debounced save function
    const debouncedSave = useCallback(
        debounce(async (dataToSave: T) => {
            if (!enabled || isSaving) return;

            setIsSaving(true);
            onSaveStart?.();

            try {
                await saveFn(dataToSave);
                const now = new Date();
                setLastSaved(now);
                setHasUnsavedChanges(false);
                lastSavedDataRef.current = JSON.stringify(dataToSave);
                onSaveSuccess?.();
            } catch (error) {
                onSaveError?.(error as Error);
            } finally {
                setIsSaving(false);
            }
        }, 1000), // Wait 1 second after last change before saving
        [saveFn, enabled, isSaving, onSaveStart, onSaveSuccess, onSaveError]
    );

    // Auto-save on interval
    useEffect(() => {
        if (!enabled) return;

        const scheduleSave = () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                if (hasUnsavedChanges && !isSaving) {
                    debouncedSave(dataRef.current);
                }
                scheduleSave();
            }, interval);
        };

        scheduleSave();

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            debouncedSave.cancel();
        };
    }, [enabled, interval, hasUnsavedChanges, isSaving, debouncedSave]);

    // Save on unmount if there are unsaved changes
    useEffect(() => {
        return () => {
            if (hasUnsavedChanges && enabled) {
                debouncedSave.cancel(); // Cancel debounce to save immediately
                saveFn(dataRef.current).catch(() => {
                    // Silently fail on unmount save
                });
            }
        };
    }, [hasUnsavedChanges, enabled, saveFn, debouncedSave]);

    return {
        isSaving,
        lastSaved,
        hasUnsavedChanges,
    };
}
