"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
    CheckSquare, 
    Send, 
    FileX, 
    Archive, 
    Trash2, 
    Tags as TagsIcon,
    User,
    FolderTree,
    Loader2
} from 'lucide-react';

interface BulkActionsBarProps {
    selectedIds: string[];
    onActionComplete: () => void;
    onClearSelection: () => void;
}

export function BulkActionsBar({ 
    selectedIds, 
    onActionComplete,
    onClearSelection 
}: BulkActionsBarProps) {
    const [action, setAction] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showTagInput, setShowTagInput] = useState(false);

    const handleBulkAction = async (actionType: string, data?: any) => {
        if (selectedIds.length === 0) {
            toast.error('No articles selected');
            return;
        }

        const confirmActions = ['delete', 'archive'];
        if (confirmActions.includes(actionType)) {
            const confirmed = window.confirm(
                `Are you sure you want to ${actionType} ${selectedIds.length} article(s)?`
            );
            if (!confirmed) return;
        }

        setIsProcessing(true);
        try {
            const res = await fetch('/api/bulk-operations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: actionType,
                    articleIds: selectedIds,
                    data
                })
            });

            const json = await res.json();
            
            if (!res.ok) throw new Error(json.error);

            toast.success(json.message || `${json.count} articles updated`);
            onActionComplete();
            onClearSelection();
            setAction('');
        } catch (error: any) {
            toast.error(error.message || 'Bulk operation failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleActionChange = (value: string) => {
        setAction(value);

        switch (value) {
            case 'publish':
                handleBulkAction('publish');
                break;
            case 'unpublish':
                handleBulkAction('unpublish');
                break;
            case 'archive':
                handleBulkAction('archive');
                break;
            case 'delete':
                handleBulkAction('delete');
                break;
            case 'update-category':
                setShowCategoryPicker(true);
                break;
            case 'add-tags':
                setShowTagInput(true);
                break;
            default:
                break;
        }
    };

    if (selectedIds.length === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-slate-900 text-white rounded-lg shadow-2xl px-6 py-4 flex items-center gap-4 min-w-[500px]">
                {/* Selection Count */}
                <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-secondary-400" />
                    <span className="font-semibold">{selectedIds.length} Selected</span>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-700" />

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-400 hover:bg-green-400/10"
                        onClick={() => handleBulkAction('publish')}
                        disabled={isProcessing}
                        title="Publish selected"
                    >
                        <Send className="w-4 h-4 mr-1" />
                        Publish
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-orange-400 hover:bg-orange-400/10"
                        onClick={() => handleBulkAction('unpublish')}
                        disabled={isProcessing}
                        title="Unpublish selected"
                    >
                        <FileX className="w-4 h-4 mr-1" />
                        Unpublish
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:bg-slate-400/10"
                        onClick={() => handleBulkAction('archive')}
                        disabled={isProcessing}
                        title="Archive selected"
                    >
                        <Archive className="w-4 h-4 mr-1" />
                        Archive
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-400/10"
                        onClick={() => handleBulkAction('delete')}
                        disabled={isProcessing}
                        title="Delete selected"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                    </Button>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-700" />

                {/* More Actions Dropdown */}
                <Select value={action} onValueChange={handleActionChange} disabled={isProcessing}>
                    <SelectTrigger className="w-[150px] bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="More actions..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="update-category">
                            <div className="flex items-center gap-2">
                                <FolderTree className="w-4 h-4" />
                                Change Category
                            </div>
                        </SelectItem>
                        <SelectItem value="add-tags">
                            <div className="flex items-center gap-2">
                                <TagsIcon className="w-4 h-4" />
                                Add Tags
                            </div>
                        </SelectItem>
                        <SelectItem value="update-author">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Change Author
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Processing Indicator */}
                {isProcessing && (
                    <Loader2 className="w-5 h-5 animate-spin text-secondary-400" />
                )}

                {/* Clear Selection */}
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:bg-slate-800 ml-auto"
                    onClick={onClearSelection}
                    disabled={isProcessing}
                >
                    Clear
                </Button>
            </div>
        </div>
    );
}
