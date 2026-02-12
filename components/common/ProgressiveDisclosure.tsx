"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProgressiveDisclosureProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    buttonVariant?: 'default' | 'minimal';
}

/**
 * Progressive Disclosure Component
 * Hides secondary information behind a toggle to reduce cognitive load
 */
export default function ProgressiveDisclosure({ 
    title, 
    children, 
    defaultOpen = false,
    className = '',
    buttonVariant = 'default'
}: ProgressiveDisclosureProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (buttonVariant === 'minimal') {
        return (
            <div className={`border-t border-slate-200 ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors px-6"
                >
                    <span className="font-semibold text-slate-700">{title}</span>
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-600" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                    )}
                </button>
                {isOpen && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                        {children}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`border border-slate-200 rounded-xl overflow-hidden ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <span className="font-semibold text-slate-900">{title}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
            </button>
            {isOpen && (
                <div className="p-4 bg-white animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

/**
 * Details Grid Component
 * Displays key-value pairs in a clean grid
 */
interface DetailsGridProps {
    items: Array<{ label: string; value: React.ReactNode; tooltip?: string }>;
    columns?: 1 | 2 | 3;
}

export function DetailsGrid({ items, columns = 2 }: DetailsGridProps) {
    const gridClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }[columns];

    return (
        <div className={`grid ${gridClass} gap-4`}>
            {items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {item.label}
                        {item.tooltip && (
                            <span className="ml-1 text-slate-600 cursor-help" title={item.tooltip}>ⓘ</span>
                        )}
                    </dt>
                    <dd className="text-sm font-semibold text-slate-900">{item.value}</dd>
                </div>
            ))}
        </div>
    );
}

/**
 * View More Button
 * Simple button to expand content
 */
interface ViewMoreButtonProps {
    isExpanded: boolean;
    onClick: () => void;
    expandedText?: string;
    collapsedText?: string;
}

export function ViewMoreButton({ 
    isExpanded, 
    onClick,
    expandedText = 'View Less',
    collapsedText = 'View More Details'
}: ViewMoreButtonProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="w-full sm:w-auto text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-semibold"
        >
            {isExpanded ? (
                <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    {expandedText}
                </>
            ) : (
                <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    {collapsedText}
                </>
            )}
        </Button>
    );
}
