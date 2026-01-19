"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

interface ImageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (url: string, alt?: string) => void;
    initialUrl?: string;
    initialAlt?: string;
}

export default function ImageModal({
    open,
    onOpenChange,
    onConfirm,
    initialUrl = '',
    initialAlt = '',
}: ImageModalProps) {
    const [url, setUrl] = useState(initialUrl);
    const [alt, setAlt] = useState(initialAlt);

    const handleConfirm = () => {
        if (url.trim()) {
            // Validate URL
            try {
                new URL(url);
                onConfirm(url.trim(), alt.trim() || undefined);
                setUrl('');
                setAlt('');
                onOpenChange(false);
            } catch {
                // If not a valid URL, try adding https://
                const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
                try {
                    new URL(urlWithProtocol);
                    onConfirm(urlWithProtocol, alt.trim() || undefined);
                    setUrl('');
                    setAlt('');
                    onOpenChange(false);
                } catch {
                    // Invalid URL
                    toast.error('Please enter a valid image URL');
                }
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Image</DialogTitle>
                    <DialogDescription>
                        Enter the image URL and optional alt text
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="image-url">Image URL *</Label>
                        <Input
                            id="image-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="mt-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleConfirm();
                                }
                            }}
                            autoFocus
                        />
                    </div>
                    <div>
                        <Label htmlFor="image-alt">Alt Text (Optional)</Label>
                        <Input
                            id="image-alt"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            placeholder="Description of the image"
                            className="mt-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleConfirm();
                                }
                            }}
                        />
                        <p className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                            Alt text helps with accessibility and SEO
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!url.trim()}>
                        Add Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

