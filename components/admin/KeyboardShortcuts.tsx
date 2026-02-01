/**
 * Keyboard Shortcuts Component
 * 
 * Handles keyboard shortcuts and displays help modal
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export interface KeyboardShortcut {
    key: string;
    description: string;
    action?: () => void;
}

export interface KeyboardShortcutsProps {
    shortcuts?: KeyboardShortcut[];
}

export function KeyboardShortcuts({ shortcuts = [] }: KeyboardShortcutsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Default shortcuts
    const defaultShortcuts: KeyboardShortcut[] = [
        {
            key: '⌘?',
            description: 'Show keyboard shortcuts',
        },
        {
            key: '⌘N',
            description: 'New article',
            action: () => router.push('/admin/articles/new'),
        },
        {
            key: '⌘S',
            description: 'Save article',
        },
        {
            key: '⌘P',
            description: 'Publish article',
        },
        {
            key: '⌘E',
            description: 'Open editor',
        },
        {
            key: 'Esc',
            description: 'Close modals/dialogs',
        },
    ];

    const allShortcuts = [...defaultShortcuts, ...shortcuts];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + ? - Show shortcuts
            if ((e.metaKey || e.ctrlKey) && e.key === '?') {
                e.preventDefault();
                setIsOpen(true);
            }


            // Cmd/Ctrl + N - New article
            if ((e.metaKey || e.ctrlKey) && e.key === 'n' && !e.shiftKey) {
                e.preventDefault();
                router.push('/admin/articles/new');
            }

            // Cmd/Ctrl + S - Save (prevent browser save dialog)
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                // Trigger save action (handled by parent component)
                const saveEvent = new CustomEvent('keyboard-save');
                window.dispatchEvent(saveEvent);
            }

            // Cmd/Ctrl + P - Publish (prevent browser print dialog)
            if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
                e.preventDefault();
                // Trigger publish action (handled by parent component)
                const publishEvent = new CustomEvent('keyboard-publish');
                window.dispatchEvent(publishEvent);
            }

            // Custom shortcuts
            for (const shortcut of shortcuts) {
                if (shortcut.action) {
                    // Simple key matching (can be extended for complex shortcuts)
                    if (shortcut.key === e.key || shortcut.key.toLowerCase() === e.key.toLowerCase()) {
                        e.preventDefault();
                        shortcut.action();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router, shortcuts]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Keyboard Shortcuts</DialogTitle>
                        <DialogDescription>
                            Speed up your workflow with these keyboard shortcuts
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        {allShortcuts.map((shortcut, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg bg-surface-darker/50 dark:bg-surface-darker/50 border border-wt-border dark:border-wt-border"
                            >
                                <span className="text-wt-text/80 dark:text-wt-text/80">{shortcut.description}</span>
                                <Badge variant="outline" className="font-mono">
                                    {shortcut.key}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default KeyboardShortcuts;
