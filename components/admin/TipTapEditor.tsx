"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Editor } from '@tiptap/core';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Quote, Undo, Redo, Code, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TipTapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    onImageSelect?: () => void;
}

/**
 * TipTap Rich Text Editor
 * 
 * A full-featured WYSIWYG editor with:
 * - Basic formatting (bold, italic, headings)
 * - Lists (ordered and unordered)
 * - Links
 * - Images
 * - Tables
 * - Code blocks
 */
export default function TipTapEditor({
    content,
    onChange,
    placeholder = 'Start writing...',
    className = '',
    onImageSelect,
}: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse border border-slate-300 my-4',
                },
            }),
            TableRow,
            TableHeader,
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-slate-300 px-4 py-2',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose prose-slate max-w-none focus:outline-none min-h-[400px] p-4 ${className}`,
                'data-placeholder': placeholder,
            },
        },
    });

    // Store editor reference globally for TipTapEditorWithMedia
    useEffect(() => {
        if (editor) {
            (window as any).__tiptapEditor = editor;
        }
        return () => {
            if ((window as any).__tiptapEditor === editor) {
                delete (window as any).__tiptapEditor;
            }
        };
    }, [editor]);

    // Update editor content when prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    if (!editor) {
        return (
            <div className="border border-slate-300 rounded-lg p-4 min-h-[400px] bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500">Loading editor...</p>
            </div>
        );
    }

    const addImage = () => {
        if (onImageSelect) {
            onImageSelect();
        } else {
            const url = window.prompt('Enter image URL:');
            if (url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    };

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    return (
        <div className="border border-slate-300 rounded-lg bg-white overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-slate-300 p-2 flex flex-wrap items-center gap-1 bg-slate-50">
                {/* Text Formatting */}
                <Button
                    type="button"
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className="h-8 w-8 p-0"
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="h-8 w-8 p-0"
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('code') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className="h-8 w-8 p-0"
                    title="Code"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Headings */}
                <Button
                    type="button"
                    variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="h-8 w-8 p-0"
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className="h-8 w-8 p-0"
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className="h-8 w-8 p-0"
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Lists */}
                <Button
                    type="button"
                    variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className="h-8 w-8 p-0"
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className="h-8 w-8 p-0"
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Media & Links */}
                <Button
                    type="button"
                    variant={editor.isActive('link') ? 'default' : 'outline'}
                    size="sm"
                    onClick={addLink}
                    className="h-8 w-8 p-0"
                    title="Add Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImage}
                    className="h-8 w-8 p-0"
                    title="Add Image"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={insertTable}
                    className="h-8 w-8 p-0"
                    title="Insert Table"
                >
                    <Grid3x3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                {/* Undo/Redo */}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0"
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0"
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <div className="relative">
                <EditorContent editor={editor} className="prose prose-slate max-w-none" />
                {/* Placeholder - Only show when editor is empty and focused */}
                {editor.isEmpty && (
                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400">
                        {placeholder}
                    </div>
                )}
            </div>
        </div>
    );
}
