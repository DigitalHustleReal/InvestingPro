/**
 * Image Picker Button for TipTap Editor
 *
 * Opens media library picker, prompts for alt text, then inserts image.
 */

"use client";

import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';
import MediaLibraryPicker from '@/components/admin/MediaLibraryPicker';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImagePickerButtonProps {
    editor: Editor;
}

export function ImagePickerButton({ editor }: ImagePickerButtonProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [altText, setAltText] = useState('');

    /** Step 1 — User picks image from media library */
    const handleImageSelect = (url: string) => {
        if (!url) return;
        setShowPicker(false);
        setPendingUrl(url);
        setAltText('');
    };

    /** Step 2 — User confirms alt text and we insert */
    const handleInsert = () => {
        if (!pendingUrl) return;
        editor.chain().focus().setImage({ src: pendingUrl, alt: altText.trim() }).run();
        setPendingUrl(null);
        setAltText('');
    };

    const handleSkip = () => {
        if (!pendingUrl) return;
        editor.chain().focus().setImage({ src: pendingUrl, alt: '' }).run();
        setPendingUrl(null);
        setAltText('');
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

            {/* Step 1: Media Picker */}
            {showPicker && (
                <MediaLibraryPicker
                    open={showPicker}
                    onOpenChange={setShowPicker}
                    onSelect={handleImageSelect}
                />
            )}

            {/* Step 2: Alt Text Prompt */}
            <Dialog open={!!pendingUrl} onOpenChange={(open) => { if (!open) setPendingUrl(null); }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Alt Text</DialogTitle>
                    </DialogHeader>
                    {pendingUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={pendingUrl}
                            alt="Preview"
                            className="w-full max-h-48 object-contain rounded-lg border border-border bg-muted"
                        />
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="alt-text-input">Alt text <span className="text-muted-foreground text-xs ml-1">(for SEO &amp; accessibility)</span></Label>
                        <Input
                            id="alt-text-input"
                            placeholder="Describe the image…"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleInsert(); }}
                            autoFocus
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={handleSkip}>
                            Skip
                        </Button>
                        <Button type="button" size="sm" onClick={handleInsert}>
                            Insert Image
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
