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

interface LinkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (url: string, text?: string) => void;
    initialUrl?: string;
    initialText?: string;
}

export default function LinkModal({
    open,
    onOpenChange,
    onConfirm,
    initialUrl = '',
    initialText = '',
}: LinkModalProps) {
    const [url, setUrl] = useState(initialUrl);
    const [text, setText] = useState(initialText);

    const handleConfirm = () => {
        if (url.trim()) {
            // Validate URL
            try {
                new URL(url);
                onConfirm(url.trim(), text.trim() || undefined);
                setUrl('');
                setText('');
                onOpenChange(false);
            } catch {
                // If not a valid URL, try adding https://
                const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
                try {
                    new URL(urlWithProtocol);
                    onConfirm(urlWithProtocol, text.trim() || undefined);
                    setUrl('');
                    setText('');
                    onOpenChange(false);
                } catch {
                    // Invalid URL
                    toast.error('Please enter a valid URL');
                }
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Link</DialogTitle>
                    <DialogDescription>
                        Enter the URL and optional link text
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="link-url">URL *</Label>
                        <Input
                            id="link-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
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
                        <Label htmlFor="link-text">Link Text (Optional)</Label>
                        <Input
                            id="link-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Click here"
                            className="mt-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleConfirm();
                                }
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!url.trim()}>
                        Add Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

