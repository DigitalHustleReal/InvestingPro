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
import { normalizeArticleBody } from '@/lib/content/normalize';
import { htmlToMarkdown } from '@/lib/editor/markdown';
import { tiptapToHTML } from '@/lib/editor/markdown';
import './extensions/SemanticImage.css';
import { Button } from '@/components/ui/Button';
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

    // CRITICAL: Editor mounts ONLY after content is normalized
    // This prevents hydration mismatches and ensures content loads correctly
    useEffect(() => {
        if (normalizedContent.html || !initialContent) {
            setIsReady(true);
        }
    }, [normalizedContent.html, initialContent]);

    // Create editor instance
    // CRITICAL: Only create once, with initial content
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                history: { depth: 50 },
                heading: { levels: [1, 2, 3, 4] }, // H1-H4 support
                link: {
                    openOnClick: false,
                    HTMLAttributes: { class: 'text-blue-600 underline' },
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: { class: 'border-collapse border border-slate-300 my-4' },
            }),
            TableRow,
            TableHeader,
            TableCell.configure({
                HTMLAttributes: { class: 'border border-slate-300 px-4 py-2' },
            }),
            SemanticImage,
        ],
        // CRITICAL: Initialize with normalized HTML (only once)
        content: isReady ? normalizedContent.html : '',
        editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: `prose prose-slate max-w-none focus:outline-none min-h-[400px] p-4 ${className}`,
                'data-placeholder': placeholder,
            },
        },
        onUpdate: ({ editor }) => {
            // Extract content on change
            if (onChangeRef.current && hasInitializedRef.current) {
                try {
                    const rawHTML = tiptapToHTML(editor);
                    const normalizedHTML = normalizeArticleBody(rawHTML);
                    const markdown = htmlToMarkdown(normalizedHTML);
                    
                    onChangeRef.current({
                        markdown,
                        html: normalizedHTML,
                    });
                } catch (error) {
                    console.error('Error extracting editor content:', error);
                }
            }
        },
    }, [isReady, normalizedContent.html, editable, className, placeholder]);

    // CRITICAL: Set content once after editor is ready
    // This happens only once, preventing rehydration issues
    useEffect(() => {
        if (!editor || !isReady || hasInitializedRef.current) return;

        if (normalizedContent.html) {
            editor.commands.setContent(normalizedContent.html, false);
        }
        
        hasInitializedRef.current = true;
    }, [editor, isReady, normalizedContent.html]);

    // Don't render until ready (prevents hydration mismatch)
    if (!isReady) {
        return (
            <div className="border border-slate-300 rounded-lg bg-white overflow-hidden min-h-[400px] flex items-center justify-center">
                <div className="text-slate-400">Loading editor...</div>
            </div>
        );
    }

    if (!editor) {
        return (
            <div className="border border-slate-300 rounded-lg bg-white overflow-hidden min-h-[400px] flex items-center justify-center">
                <div className="text-slate-400">Initializing editor...</div>
            </div>
        );
    }

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

    return (
        <div className="border border-slate-300 rounded-lg bg-white overflow-hidden">
            {/* Toolbar */}
            {editable && (
                <div className="border-b border-slate-200 p-2 flex flex-wrap gap-1 bg-slate-50">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'bg-slate-200' : ''}
                    >
                        <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}
                    >
                        <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'bg-slate-200' : ''}
                    >
                        <Heading3 className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-slate-300 mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'bg-slate-200' : ''}
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'bg-slate-200' : ''}
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={editor.isActive('code') ? 'bg-slate-200' : ''}
                    >
                        <Code className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-slate-300 mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
                    >
                        <Quote className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-slate-300 mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addLink}
                        className={editor.isActive('link') ? 'bg-slate-200' : ''}
                    >
                        <LinkIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addSemanticImage}
                    >
                        <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={insertTable}
                    >
                        <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}


