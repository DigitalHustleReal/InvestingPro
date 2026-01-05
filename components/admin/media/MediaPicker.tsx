'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaLibrary } from "./MediaLibrary";
import { MediaItem } from "@/lib/cms/media-service";

interface MediaPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (item: MediaItem) => void;
}

export function MediaPicker({ open, onOpenChange, onSelect }: MediaPickerProps) {
    
    const handleSelect = (item: MediaItem) => {
        onSelect(item);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl h-[80vh] flex flex-col bg-slate-900 border-slate-800 text-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-brand-400 to-secondary-500 bg-clip-text text-transparent">
                        Select Media
                    </DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 overflow-hidden min-h-0">
                    <MediaLibrary 
                        selectionMode={true} 
                        onSelect={handleSelect} 
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
