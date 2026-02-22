'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaService, MediaItem } from '@/lib/cms/media-service';
import ImageEditor from '@/components/admin/ImageEditor';
import { toast } from 'sonner';

interface MediaUploaderProps {
    onUploadComplete?: (files: MediaItem[]) => void;
    destinationFolder?: string;
}

export function MediaUploader({ onUploadComplete, destinationFolder = 'uploads' }: MediaUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    // ImageEditor state — holds a single pending image file waiting for crop/edit
    const [pendingImage, setPendingImage] = useState<File | null>(null);
    const [pendingNonImages, setPendingNonImages] = useState<File[]>([]);
    const [editorOpen, setEditorOpen] = useState(false);

    /** Shared upload helper for a list of files, called after editing */
    const uploadFiles = useCallback(async (files: File[]) => {
        setUploading(true);
        setProgress(0);
        const uploadedFiles: MediaItem[] = [];
        let completed = 0;

        try {
            for (const file of files) {
                try {
                    const result = await mediaService.uploadFile(file, destinationFolder);
                    if (result) uploadedFiles.push(result);
                    completed++;
                    setProgress((completed / files.length) * 100);
                } catch {
                    toast.error(`Failed to upload ${file.name}`);
                }
            }
            if (uploadedFiles.length > 0) {
                toast.success(`Uploaded ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}`);
                onUploadComplete?.(uploadedFiles);
            }
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [destinationFolder, onUploadComplete]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const images = acceptedFiles.filter(f => f.type.startsWith('image/'));
        const nonImages = acceptedFiles.filter(f => !f.type.startsWith('image/'));

        if (images.length === 1) {
            // Single image → open editor
            setPendingImage(images[0]);
            setPendingNonImages(nonImages);
            setEditorOpen(true);
        } else {
            // Multiple files or no images → upload directly
            uploadFiles(acceptedFiles);
        }
    }, [uploadFiles]);

    /** Called when user saves the edited image */
    const handleEditorSave = useCallback((editedFile: File) => {
        setEditorOpen(false);
        setPendingImage(null);
        uploadFiles([editedFile, ...pendingNonImages]);
        setPendingNonImages([]);
    }, [uploadFiles, pendingNonImages]);

    /** Called when user dismisses without editing — upload original */
    const handleEditorDiscard = useCallback(() => {
        setEditorOpen(false);
        if (pendingImage) {
            uploadFiles([pendingImage, ...pendingNonImages]);
        }
        setPendingImage(null);
        setPendingNonImages([]);
    }, [uploadFiles, pendingImage, pendingNonImages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
        },
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer text-center
                    ${isDragActive
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-wt-border dark:border-wt-border hover:border-brand-400 bg-surface-darker/50 dark:bg-surface-darker/50 hover:bg-wt-card dark:bg-wt-card'}
                `}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {uploading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center space-y-4"
                        >
                            <div className="relative w-16 h-16">
                                <svg className="animate-spin w-16 h-16 text-brand-500" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium text-wt-text/80 dark:text-wt-text/80">
                                Uploading… {Math.round(progress)}%
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center space-y-4"
                        >
                            <div className="p-4 bg-muted dark:bg-muted rounded-full text-brand-400">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium text-wt-text/90 dark:text-wt-text/90">
                                    {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
                                </p>
                                <p className="text-sm text-wt-text-muted dark:text-wt-text-muted">
                                    Images open an editor — crop, resize, rotate before saving
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Image Editor — opens for single-image drops */}
            <ImageEditor
                open={editorOpen}
                onOpenChange={(open) => { if (!open) handleEditorDiscard(); }}
                imageFile={pendingImage}
                onSave={handleEditorSave}
            />
        </div>
    );
}
