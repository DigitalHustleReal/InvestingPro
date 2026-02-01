'use client';

import { useState } from 'react';
import { Check, Minus } from 'lucide-react';

interface SelectableRowProps {
    id: string;
    isSelected: boolean;
    onToggle: (id: string) => void;
    children: React.ReactNode;
}

export function SelectableRow({ id, isSelected, onToggle, children }: SelectableRowProps) {
    return (
        <tr 
            className={`
                transition-colors cursor-pointer
                ${isSelected 
                    ? 'bg-brand-500/10 hover:bg-brand-500/15' 
                    : 'hover:bg-wt-card dark:bg-wt-card'
                }
            `}
            onClick={() => onToggle(id)}
        >
            <td className="px-4 py-3 w-12">
                <div 
                    className={`
                        w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                        ${isSelected 
                            ? 'bg-brand-500 border-brand-500' 
                            : 'border-wt-border/70 dark:border-wt-border/70 hover:border-brand-400'
                        }
                    `}
                    onClick={(e) => { e.stopPropagation(); onToggle(id); }}
                >
                    {isSelected && <Check className="w-3 h-3 text-wt-text dark:text-wt-text" />}
                </div>
            </td>
            {children}
        </tr>
    );
}

interface SelectAllCheckboxProps {
    allIds: string[];
    selectedIds: string[];
    onSelectAll: () => void;
    onDeselectAll: () => void;
}

export function SelectAllCheckbox({ 
    allIds, 
    selectedIds, 
    onSelectAll, 
    onDeselectAll 
}: SelectAllCheckboxProps) {
    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;
    const isPartialSelected = selectedIds.length > 0 && selectedIds.length < allIds.length;

    const handleClick = () => {
        if (isAllSelected || isPartialSelected) {
            onDeselectAll();
        } else {
            onSelectAll();
        }
    };

    return (
        <th className="px-4 py-3 w-12">
            <div 
                className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer
                    ${isAllSelected 
                        ? 'bg-brand-500 border-brand-500' 
                        : isPartialSelected
                            ? 'bg-brand-500/50 border-brand-500'
                            : 'border-wt-border/70 dark:border-wt-border/70 hover:border-brand-400'
                    }
                `}
                onClick={handleClick}
            >
                {isAllSelected && <Check className="w-3 h-3 text-wt-text dark:text-wt-text" />}
                {isPartialSelected && <Minus className="w-3 h-3 text-wt-text dark:text-wt-text" />}
            </div>
        </th>
    );
}

// Hook for managing selection state
export function useRowSelection<T extends { id: string }>(items: T[]) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggle = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        setSelectedIds(items.map(item => item.id));
    };

    const deselectAll = () => {
        setSelectedIds([]);
    };

    const isSelected = (id: string) => selectedIds.includes(id);

    return {
        selectedIds,
        toggle,
        selectAll,
        deselectAll,
        isSelected,
        allIds: items.map(item => item.id)
    };
}
