"use client";

import { useState, useRef } from 'react';
import { mediaService } from '@/lib/media/media-service';

interface MediaUploaderProps {
    onUploadComplete?: (url: string, mediaId: string) => void;
    folder?: string;
    className?: string;
}

export function MediaUploader({ onUploadComplete, folder = 'uploads', className }: MediaUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }
        setError(null);
        setIsUploading(true);
        setProgress(0);
        setStatus('Starting upload...');

        try {
            const result = await mediaService.uploadImage(file, {
                folder,
                onProgress: (p) => {
                    setProgress(p.progress);
                    setStatus(p.message || p.status);
                }
            });

            if (onUploadComplete) {
                onUploadComplete(result.publicUrl, result.id);
            }

            setTimeout(() => {
                setIsUploading(false);
                setProgress(0);
                setStatus('');
                if (inputRef.current) inputRef.current.value = '';
            }, 1000);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Upload failed. Please try again.');
            setIsUploading(false);
        }
    };

    const wrapperClass = [
        "relative border-2 border-dashed rounded-xl p-8 transition-colors text-center",
        dragActive ? "border-primary-500 bg-primary-50" : "border-slate-300 hover:border-slate-400",
        isUploading ? "pointer-events-none opacity-80" : ""
    ].join(" ");

    return (
        <div className={className || "w-full"}>
            <div
                className={wrapperClass}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <div className="w-full max-w-xs bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                            <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: progress + "%" }}
                            />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                            {status} ({Math.round(progress)}%)
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 space-y-4">
                        <div className="p-4 bg-slate-100 rounded-full">
                            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-medium text-slate-900">
                                Click or drag image to upload
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                Supports JPG, PNG, WebP (max 10MB)
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                        >
                            Select File
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="font-medium">Upload Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-500 hover:text-red-700"
                    >
                        X
                    </button>
                </div>
            )}
        </div>
    );
}