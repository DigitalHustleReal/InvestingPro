/**
 * WordPress-style Article Editor
 * 
 * GUTENBERG-STYLE ARCHITECTURE:
 * - Editor does NOT mount until article content is loaded
 * - Initial content is passed once at mount (no rehydration)
 * - Editor state is fully controlled (no uncontrolled HTML)
 * - Toolbar reflects schema-based blocks
 */

"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { SemanticImage } from './extensions/SemanticImage';
import LinkExtension from '@tiptap/extension-link';
import { normalizeArticleBody } from '@/lib/content/normalize';
import { htmlToMarkdown } from '@/lib/editor/markdown';
import { tiptapToHTML } from '@/lib/editor/markdown';
import { cn } from '@/lib/utils';
import './extensions/SemanticImage.css';
import { Button } from '@/components/ui/Button';
import { ImagePickerButton } from './editor/ImagePickerButton';
import {
    Bold,
    Italic,
    Code,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Link as LinkIcon,
    Image as ImageIcon,
    Grid3x3,
    Minus,
} from 'lucide-react';

interface ArticleEditorProps {
    // Content (loaded from article service)
    initialContent?: {
        body_markdown?: string;
        body_html?: string;
        content?: string;
    };
    // Callbacks
    onChange?: (content: { markdown: string; html: string }) => void;
    // UI
    placeholder?: string;
    className?: string;
    editable?: boolean;
}

/**
 * WordPress-style Editor
 * 
 * CRITICAL RULES:
 * 1. Editor does NOT mount until content is loaded
 * 2. Initial content passed once at mount (no rehydration)
 * 3. Fully controlled state (no uncontrolled HTML)
 */
export default function ArticleEditor({
    initialContent,
    onChange,
    placeholder = 'Start writing...',
    className = '',
    editable = true,
}: ArticleEditorProps) {
    const [isReady, setIsReady] = useState(false);
    const onChangeRef = useRef(onChange);
    const hasInitializedRef = useRef(false);

    // Update ref when onChange changes
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // CRITICAL: Normalize content ONCE before editor creation
    const normalizedContent = React.useMemo(() => {
        if (!initialContent) {
            return { html: '', markdown: '' };
        }

        // Priority: body_markdown (PRIMARY) > body_html > content (legacy)
        const rawContent = initialContent.body_markdown 
            || initialContent.body_html 
            || initialContent.content 
            || '';

        if (!rawContent.trim()) {
            return { html: '', markdown: '' };
        }

        // Normalize to clean HTML
        const normalizedHTML = normalizeArticleBody(rawContent);
        
        // Generate markdown from HTML
        const normalizedMarkdown = normalizedHTML ? htmlToMarkdown(normalizedHTML) : '';

        return {
            html: normalizedHTML,
            markdown: normalizedMarkdown,
        };
    }, [initialContent]);

    // CRITICAL: Editor mounts after a short delay to ensure DOM is ready
    // This prevents hydration mismatches and ensures content loads correctly
    useEffect(() => {
        // Always set ready after content is normalized (even if empty)
        setIsReady(true);
    }, []);

    // Create editor instance
    // CRITICAL: Only create once, with initial content
    // Memoize extensions to prevent re-initialization
    const extensions = React.useMemo(() => [
        StarterKit.configure({
            heading: { levels: [1, 2, 3, 4] },
        }),
        Table.configure({
            resizable: true,
            HTMLAttributes: { class: 'border-collapse border border-wt-border my-4' },
        }),
        TableRow,
        TableHeader,
        TableCell.configure({
            HTMLAttributes: { class: 'border border-wt-border px-4 py-2' },
        }),
        LinkExtension.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
            HTMLAttributes: {
                class: 'text-primary hover:underline transition-colors',
            },
        }).extend({
            addAttributes() {
                return {
                    ...this.parent?.(),
                    'data-article-id': {
                        default: null,
                    },
                    class: {
                        default: 'text-primary hover:underline transition-colors',
                    },
                }
            },
        }),
        SemanticImage,
    ], []);

    // Create editor instance
    // CRITICAL: Minimal dependencies to prevent re-mounting
    const editor = useEditor({
        extensions,
        content: '', // content handled by useEffect
        editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-gray dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4",
                    "text-slate-900 dark:text-text-primary",
                    "[&_h1]:text-slate-900 dark:[&_h1]:text-text-primary",
                    "[&_h2]:text-slate-900 dark:[&_h2]:text-text-primary",
                    "[&_h3]:text-slate-900 dark:[&_h3]:text-text-primary",
                    "[&_h4]:text-slate-900 dark:[&_h4]:text-text-primary",
                    "[&_p]:text-slate-900 dark:[&_p]:text-text-primary",
                    "[&_ul]:text-slate-900 dark:[&_ul]:text-text-primary",
                    "[&_ol]:text-slate-900 dark:[&_ol]:text-text-primary",
                    "[&_li]:text-slate-900 dark:[&_li]:text-text-primary",
                    "[&_strong]:text-slate-900 dark:[&_strong]:text-text-primary",
                    "[&_blockquote]:text-slate-500 dark:[&_blockquote]:text-text-secondary/50 [&_blockquote]:border-border",
                    "[&_code]:text-slate-900 dark:[&_code]:text-text-primary [&_code]:bg-slate-100 dark:[&_code]:bg-subtle [&_code]:px-1 [&_code]:rounded",
                    "[&_a]:text-primary hover:[&_a]:underline",
                    className
                ),
                'data-placeholder': placeholder,
            },
        },
        onUpdate: ({ editor }) => {
            if (onChangeRef.current && hasInitializedRef.current) {
                try {
                    const rawHTML = tiptapToHTML(editor);
                    const normalizedHTML = normalizeArticleBody(rawHTML);
                    const markdown = htmlToMarkdown(normalizedHTML);
                    onChangeRef.current({ markdown, html: normalizedHTML });
                } catch (error) {
                    console.error('Error extracting editor content:', error);
                }
            }
        },
    }, [editable]); // Only recompute if editable changes

    // CRITICAL: Set content once after editor is ready
    // This happens only once, preventing rehydration issues
    useEffect(() => {
        if (!editor || !isReady || hasInitializedRef.current) return;

        if (normalizedContent.html) {
            editor.commands.setContent(normalizedContent.html, { emitUpdate: false });
        }
        
        hasInitializedRef.current = true;
    }, [editor, isReady, normalizedContent.html]);

    // Toolbar actions
    const addLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addSemanticImage = useCallback(() => {
        if (!editor) return;
        const semanticKey = window.prompt(
            'Enter semantic image reference (e.g., auto:elss:hero):',
            'auto:'
        );
        if (semanticKey && semanticKey.trim()) {
            editor.chain().focus().setImage({ src: semanticKey.trim() }).run();
        }
    }, [editor]);

    const insertTable = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }, [editor]);

    // AI Outline Generation
    const generateOutline = useCallback(async () => {
        if (!editor || !isReady) return;
        
        const topic = window.prompt("Enter topic for AI Outline:");
        if (!topic) return;

        const originalContent = editor.getHTML();
        // Insert loading state
        editor.commands.setContent(originalContent + '<p><em>Generating outline...</em></p>');

        try {
            const response = await fetch('/api/ai/outline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });

            if (!response.ok) throw new Error('Failed to generate outline');

            const data = await response.json();
            const outline = data.outline;

            // Format outline as HTML
            let outlineHtml = ''; // Initialize empty string
            
            outline.forEach((section: any) => {
                outlineHtml += `<h${section.level}>${section.title}</h${section.level}>`;
                if (section.description) {
                   outlineHtml += `<p><em>${section.description}</em></p>`;
                }
            });

            // Append to editor
             editor.commands.setContent(originalContent + outlineHtml);

        } catch (error) {
            console.error("Outline generation failed:", error);
            alert("Failed to generate outline. Please try again.");
            // Revert content on failure (remove loading text)
             editor.commands.setContent(originalContent);
        }
    }, [editor, isReady]);

    // Don't render until ready (prevents hydration mismatch)
    if (!isReady) {
        return (
            <div className="border border-wt-border rounded-lg bg-white overflow-hidden min-h-[400px] flex items-center justify-center">
                <div className="text-wt-text-muted dark:text-wt-text-muted">Loading editor...</div>
            </div>
        );
    }

    if (!editor) {
        return (
            <div className="border border-wt-border rounded-lg bg-white overflow-hidden min-h-[400px] flex items-center justify-center">
                <div className="text-wt-text-muted dark:text-wt-text-muted">Initializing editor...</div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#020617] rounded-xl overflow-hidden shadow-sm border border-wt-border dark:border-slate-800 transition-all duration-300">
            {/* Toolbar */}
            {editable && (
                <div className="border-b border-wt-border dark:border-slate-800 p-2 flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-900 backdrop-blur-md transition-colors duration-300">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Heading 1"
                        aria-pressed={editor.isActive('heading', { level: 1 })}
                    >
                        <Heading1 className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Heading 2"
                        aria-pressed={editor.isActive('heading', { level: 2 })}
                    >
                        <Heading2 className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Heading 3"
                        aria-pressed={editor.isActive('heading', { level: 3 })}
                    >
                        <Heading3 className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1 self-center" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Bold (Ctrl+B)"
                        aria-pressed={editor.isActive('bold')}
                    >
                        <Bold className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Italic (Ctrl+I)"
                        aria-pressed={editor.isActive('italic')}
                    >
                        <Italic className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={editor.isActive('code') ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Inline code"
                        aria-pressed={editor.isActive('code')}
                    >
                        <Code className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1 self-center" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Bullet list"
                        aria-pressed={editor.isActive('bulletList')}
                    >
                        <List className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Numbered list"
                        aria-pressed={editor.isActive('orderedList')}
                    >
                        <ListOrdered className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Quote"
                        aria-pressed={editor.isActive('blockquote')}
                    >
                        <Quote className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1 self-center" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addLink}
                        className={editor.isActive('link') ? 'bg-surface-hover text-primary font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}
                        aria-label="Add link"
                        aria-pressed={editor.isActive('link')}
                    >
                        <LinkIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <ImagePickerButton editor={editor} />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addSemanticImage}
                        className="text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                        aria-label="Insert semantic image reference"
                        title="Insert semantic image reference"
                    >
                        <ImageIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={insertTable}
                        className="text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                        aria-label="Insert table (3x3)"
                    >
                        <Grid3x3 className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                        aria-label="Insert horizontal rule"
                    >
                        <Minus className="w-5 h-5" aria-hidden="true" />
                    </Button>
                     <div className="w-px h-6 bg-border mx-1 self-center" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={generateOutline}
                        className="text-primary hover:bg-primary/10 gap-2 font-medium"
                        aria-label="Generate AI Outline"
                    >
                        ✨ Outline
                    </Button>
                </div>
            )}

            {/* Editor Content */}
            <div 
                className="p-6 md:p-8 min-h-[500px] bg-white dark:bg-slate-950"
                role="textbox"
                aria-label="Article content editor"
                aria-multiline="true"
            >
                <div className="prose-admin">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
}



