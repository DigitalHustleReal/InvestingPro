"use client";

import React, { useState, useRef, useCallback } from 'react';
import TipTapEditor from './TipTapEditor';
import MediaLibraryPicker from './MediaLibraryPicker';
import { Editor } from '@tiptap/react';

interface TipTapEditorWithMediaProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * TipTapEditorWithMedia - Enhanced editor with media library integration
 * 
 * Wraps TipTapEditor and adds media library picker for image insertion
 */
export default function TipTapEditorWithMedia({
    content,
    onChange,
    placeholder,
    className,
}: TipTapEditorWithMediaProps) {
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const editorRef = useRef<Editor | null>(null);

    const handleImageSelect = useCallback((url: string) => {
        // Insert image into editor at current cursor position
        const editor = editorRef.current || (window as any).__tiptapEditor;
        if (editor) {
            editor.chain().focus().setImage({ src: url, alt: '' }).run();
        }
        setIsMediaPickerOpen(false);
    }, []);

    const handleImageSelectRequest = useCallback(() => {
        setIsMediaPickerOpen(true);
    }, []);

    // Store editor reference when it's available
    React.useEffect(() => {
        const checkEditor = setInterval(() => {
            const editor = (window as any).__tiptapEditor;
            if (editor && !editorRef.current) {
                editorRef.current = editor;
            }
        }, 100);

        return () => clearInterval(checkEditor);
    }, []);

    return (
        <>
            <TipTapEditor
                content={content}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                onImageSelect={handleImageSelectRequest}
            />
            <MediaLibraryPicker
                open={isMediaPickerOpen}
                onOpenChange={setIsMediaPickerOpen}
                onSelect={handleImageSelect}
            />
        </>
    );
}

