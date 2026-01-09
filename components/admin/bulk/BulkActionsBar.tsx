'use client';

import { useState } from 'react';
import { Trash2, Archive, Send, Tag, FolderOpen, Download, CheckSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export interface BulkAction {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    variant: 'default' | 'danger' | 'success';
    action: (ids: string[]) => Promise<void>;
}

interface BulkActionsBarProps {
    selectedIds: string[];
    onClearSelection: () => void;
    actions: BulkAction[];
    entityName?: string;
}

export function BulkActionsBar({ 
    selectedIds, 
    onClearSelection, 
    actions,
    entityName = 'items'
}: BulkActionsBarProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleAction = async (action: BulkAction) => {
        if (selectedIds.length === 0) return;
        
        const confirmMessage = action.variant === 'danger' 
            ? `Are you sure you want to ${action.label.toLowerCase()} ${selectedIds.length} ${entityName}?`
            : null;
        
        if (confirmMessage && !confirm(confirmMessage)) return;

        setLoading(action.id);
        try {
            await action.action(selectedIds);
            toast.success(`Successfully ${action.label.toLowerCase()}ed ${selectedIds.length} ${entityName}`);
            onClearSelection();
        } catch (error: any) {
            toast.error(`Failed to ${action.label.toLowerCase()}: ${error.message}`);
        } finally {
            setLoading(null);
        }
    };

    const variantStyles = {
        default: 'bg-slate-700 hover:bg-slate-600 text-white',
        danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
        success: 'bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 border border-primary-500/30'
    };

    return (
        <AnimatePresence>
            {selectedIds.length > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="flex items-center gap-3 px-6 py-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl shadow-black/50">
                        {/* Selection Count */}
                        <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
                            <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                                <CheckSquare className="w-4 h-4 text-brand-400" />
                            </div>
                            <span className="text-sm font-medium text-white">
                                {selectedIds.length} selected
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {actions.map((action) => {
                                const Icon = action.icon;
                                const isLoading = loading === action.id;
                                
                                return (
                                    <button
                                        key={action.id}
                                        onClick={() => handleAction(action)}
                                        disabled={isLoading}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                            transition-all duration-200 disabled:opacity-50
                                            ${variantStyles[action.variant]}
                                        `}
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                        {action.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Clear Selection */}
                        <button
                            onClick={onClearSelection}
                            className="ml-2 p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                            title="Clear selection"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Pre-built action creators for common operations
export function createArticleBulkActions(supabase: any): BulkAction[] {
    return [
        {
            id: 'publish',
            label: 'Publish',
            icon: Send,
            variant: 'success',
            action: async (ids: string[]) => {
                const { error } = await supabase
                    .from('articles')
                    .update({ status: 'published', published_at: new Date().toISOString() })
                    .in('id', ids);
                if (error) throw error;
            }
        },
        {
            id: 'archive',
            label: 'Archive',
            icon: Archive,
            variant: 'default',
            action: async (ids: string[]) => {
                const { error } = await supabase
                    .from('articles')
                    .update({ status: 'archived' })
                    .in('id', ids);
                if (error) throw error;
            }
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: Trash2,
            variant: 'danger',
            action: async (ids: string[]) => {
                const { error } = await supabase
                    .from('articles')
                    .delete()
                    .in('id', ids);
                if (error) throw error;
            }
        }
    ];
}

export function createGlossaryBulkActions(supabase: any): BulkAction[] {
    return [
        {
            id: 'publish',
            label: 'Publish',
            icon: Send,
            variant: 'success',
            action: async (ids: string[]) => {
                const { error } = await supabase
                    .from('glossary_terms')
                    .update({ published: true })
                    .in('id', ids);
                if (error) throw error;
            }
        },
        {
            id: 'unpublish',
            label: 'Unpublish',
            icon: Archive,
            variant: 'default',
            action: async (ids: string[]) => {
                const { error } = await supabase
                    .from('glossary_terms')
                    .update({ published: false })
                    .in('id', ids);
                if (error) throw error;
            }
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: Trash2,
            variant: 'danger',
            action: async (ids: string[]) => {
                const { error } = await supabase
                    .from('glossary_terms')
                    .delete()
                    .in('id', ids);
                if (error) throw error;
            }
        }
    ];
}
