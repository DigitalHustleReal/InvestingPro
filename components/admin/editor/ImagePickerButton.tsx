/**
 * Image Picker Button for TipTap Editor
 * 
 * Opens media library picker and inserts selected image into editor
 */

"use client";

import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';
import MediaLibraryPicker from '@/components/admin/MediaLibraryPicker';
import { Button } from '@/components/ui/Button';

interface ImagePickerButtonProps {
    editor: Editor;
}

export function ImagePickerButton({ editor }: ImagePickerButtonProps) {
    const [showPicker, setShowPicker] = useState(false);

    const handleImageSelect = (url: string) => {
        if (!url) return;

        // Insert image at current cursor position
        editor.chain().focus().setImage({ src: url, alt: '' }).run();
        setShowPicker(false);
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPicker(true)}
                className="h-8 w-8 p-0"
                title="Insert image from media library"
            >
                <ImageIcon className="h-4 w-4" />
            </Button>

            {showPicker && (
                <MediaLibraryPicker
                    open={showPicker}
                    onOpenChange={setShowPicker}
                    onSelect={handleImageSelect}
                />
            )}
        </>
    );
}
