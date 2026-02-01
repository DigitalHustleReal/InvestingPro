'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Smartphone, Tablet, Monitor, X, Columns, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewPaneProps {
    content: string;
    title?: string;
    isOpen: boolean;
    onClose: () => void;
}

export function PreviewPane({ content, title, isOpen, onClose }: PreviewPaneProps) {
    const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    if (!isOpen) return null;

    const widthClass = {
        mobile: 'max-w-[375px]',
        tablet: 'max-w-[768px]',
        desktop: 'max-w-4xl'
    }[device];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-surface-darkest dark:bg-surface-darkest/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            >
                <div className="w-full h-full flex flex-col bg-surface-darker dark:bg-surface-darker border border-wt-border rounded-xl overflow-hidden shadow-2xl">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between p-4 border-b border-wt-border bg-surface-darker dark:bg-surface-darker z-10">
                        <div className="flex items-center gap-4">
                            <h2 className="font-semibold text-wt-text/90 dark:text-wt-text/90">
                                Preview: <span className="text-wt-gold">{title || 'Untitled'}</span>
                            </h2>
                            <div className="h-6 w-px bg-muted dark:bg-muted" />
                            <div className="flex items-center p-1 bg-muted dark:bg-muted rounded-lg border border-wt-border dark:border-wt-border">
                                <button
                                    onClick={() => setDevice('mobile')}
                                    className={`p-2 rounded-md transition-colors ${device === 'mobile' ? 'bg-wt-gold-subtle text-wt-gold' : 'text-wt-text-muted dark:text-wt-text-muted hover:text-wt-text/90 dark:text-wt-text/90'}`}
                                    title="Mobile (375px)"
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDevice('tablet')}
                                    className={`p-2 rounded-md transition-colors ${device === 'tablet' ? 'bg-wt-gold-subtle text-wt-gold' : 'text-wt-text-muted dark:text-wt-text-muted hover:text-wt-text/90 dark:text-wt-text/90'}`}
                                    title="Tablet (768px)"
                                >
                                    <Tablet className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDevice('desktop')}
                                    className={`p-2 rounded-md transition-colors ${device === 'desktop' ? 'bg-wt-gold-subtle text-wt-gold' : 'text-wt-text-muted dark:text-wt-text-muted hover:text-wt-text/90 dark:text-wt-text/90'}`}
                                    title="Desktop (Full)"
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-wt-danger/20 hover:text-wt-danger text-wt-text-muted dark:text-wt-text-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-wt-nav to-wt-nav p-8 flex justify-center">
                        <motion.div 
                            layout
                            className={`
                                w-full bg-white text-wt-text
                                transition-all duration-300 ease-in-out shadow-2xl rounded-lg
                                ${widthClass} min-h-[500px]
                            `}
                        >
                            <div className="p-8 md:p-12">
                                <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-wt-text prose-p:text-wt-text prose-li:text-wt-text prose-strong:text-wt-text prose-h1:text-4xl prose-h1:tracking-tight prose-a:text-wt-gold hover:prose-a:text-wt-gold prose-img:rounded-xl prose-pre:bg-surface-darker dark:bg-surface-darker prose-pre:text-wt-text/90 dark:text-wt-text/90">
                                    {title && <h1 className="!mt-0">{title}</h1>}
                                    <ReactMarkdown>{content}</ReactMarkdown>
                                </article>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// Inline Preview for Split-View
interface InlinePreviewProps {
    content: string;
    title?: string;
    className?: string;
}

export function InlinePreview({ content, title, className = '' }: InlinePreviewProps) {
    return (
        <div className={`bg-white text-wt-text rounded-lg shadow-lg overflow-hidden ${className}`}>
            <div className="p-6 bg-gradient-to-r from-wt-surface-hover to-wt-bg border-b border-wt-border">
                <div className="flex items-center gap-2 text-sm text-wt-text-muted/70 dark:text-wt-text-muted/70">
                    <Eye className="w-4 h-4" />
                    Live Preview
                </div>
            </div>
            <div className="p-8 overflow-y-auto">
                <article className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-wt-gold prose-img:rounded-xl">
                    {title && <h1 className="!mt-0">{title}</h1>}
                    <ReactMarkdown>{content}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
}

// Mini Preview Card for lists
interface MiniPreviewProps {
    content: string;
    title?: string;
    onClick?: () => void;
}

export function MiniPreview({ content, title, onClick }: MiniPreviewProps) {
    // Take first 200 characters
    const truncatedContent = content.length > 200 
        ? content.substring(0, 200) + '...' 
        : content;

    return (
        <div 
            className="bg-white text-wt-text rounded-lg border border-wt-border p-4 hover:border-wt-gold/50 hover:shadow-lg transition-all cursor-pointer"
            onClick={onClick}
        >
            {title && <h3 className="font-semibold text-sm mb-2 line-clamp-1">{title}</h3>}
            <p className="text-xs text-wt-text-muted/50 dark:text-wt-text-muted/50 line-clamp-3">{truncatedContent}</p>
        </div>
    );
}
