"use client";

import { useState, useRef, DragEvent } from 'react';
import { mediaService, UploadProgress } from '@/lib/media/media-service';
import { Button } from '@/components/ui/Button';

interface MediaUploaderProps {
    onUploadComplete?: (url: string, mediaId: string) => void;
    folder?: string;
    acceptedTypes?: string[];
    maxSizeMB?: number;
}

export function MediaUploader({
    onUploadComplete,
    folder = 'uploads',
    acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSizeMB = 10
}: MediaUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [progress, setProgress] = useState<UploadProgress | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        setError(null);
        setPreview(null);

        try {
            // Show preview
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

            setUploading(true);

            // Upload with progress tracking
            const media = await mediaService.uploadImage(file, {
                folder,
                onProgress: setProgress
            });

            // Clean up preview
            URL.revokeObjectURL(previewUrl);

            // Notify parent
            if (onUploadComplete) {
                onUploadComplete(media.publicUrl, media.id);
            }

            // Reset
            setPreview(null);
            setProgress(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (err: any) {
            setError(err.message || 'Upload failed');
            if (preview) {
                URL.revokeObjectURL(preview);
                setPreview(null);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    return (
        <div className="w-full">
            {/* Drop Zone */}
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center
                    transition-all duration-200
                    ${dragActive 
                        ? 'border-primary bg-primary/5 scale-[1.02]' 
                        : 'border-gray-300 hover:border-gray-400'
                    }
                    ${uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes.join(',')}
                    onChange={(e) => handleUpload(e.target.files)}
                    className="hidden"
                    disabled={uploading}
                />

                {/* Upload Icon/Preview */}
                {preview ? (
                    <div className="mb-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-32 mx-auto rounded"
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}

                {/* Upload Status */}
                {uploading && progress ? (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                            {progress.message || 'Uploading...'}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress.progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            {progress.progress}%
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-700">
                            {dragActive ? 'Drop image here' : 'Drop image here or click to upload'}
                        </p>
                        <p className="text-sm text-gray-500">
                            PNG, JPG, GIF, WebP up to {maxSizeMB}MB
                        </p>
                        {!dragActive && (
                            <Button
                                type="button"
                                variant="default"
                                className="mt-4"
                                disabled={uploading}
                            >
                                Choose File
                            </Button>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
            </div>

            {/* Upload Tips */}
            {!uploading && !error && (
                <div className="mt-4 p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
                    <h4 className="text-sm font-medium text-secondary-900 mb-2">
                        💡 Upload Tips:
                    </h4>
                    <ul className="text-sm text-secondary-700 space-y-1">
                        <li>• Use descriptive filenames for better SEO</li>
                        <li>• Optimize images before upload (recommended: under 500KB)</li>
                        <li>• Landscape images work best for featured images (16:9 ratio)</li>
                        <li>• Add alt text after upload for accessibility</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
