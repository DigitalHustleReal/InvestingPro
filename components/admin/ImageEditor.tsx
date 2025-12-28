"use client";

import React, { useState, useCallback, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { ZoomIn, ZoomOut, RotateCw, Download, X, Maximize2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageEditorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageFile: File | null;
    onSave: (file: File, metadata?: { width?: number; height?: number }) => void;
    aspectRatio?: number; // Optional aspect ratio (e.g., 16/9, 1, 4/3)
}

/**
 * ImageEditor - Professional image editing tool
 * 
 * Features:
 * - Crop images with aspect ratio control
 * - Resize images
 * - Rotate images
 * - Compress images before upload
 */
export default function ImageEditor({
    open,
    onOpenChange,
    imageFile,
    onSave,
    aspectRatio,
}: ImageEditorProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [targetWidth, setTargetWidth] = useState<number>(1920);
    const [targetHeight, setTargetHeight] = useState<number>(1080);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Load image when file changes
    React.useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
        } else {
            setImageSrc(null);
        }
    }, [imageFile]);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    const getRadianAngle = (degreeValue: number) => {
        return (degreeValue * Math.PI) / 180;
    };

    const rotateSize = (width: number, height: number, rotation: number) => {
        const rotRad = getRadianAngle(rotation);
        return {
            width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
            height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
        };
    };

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area,
        rotation = 0,
        flip = { horizontal: false, vertical: false }
    ): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const rotRad = getRadianAngle(rotation);

        // Calculate bounding box of the rotated image
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation
        );

        // Set canvas size to match the bounding box
        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        // Translate canvas context to a central location to allow rotating and flipping around the center
        ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
        ctx.rotate(rotRad);
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
        ctx.translate(-image.width / 2, -image.height / 2);

        // Draw rotated image
        ctx.drawImage(image, 0, 0);

        const data = ctx.getImageData(
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height
        );

        // Set canvas size to final desired crop size
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // Paste generated rotate image at the top left corner
        ctx.putImageData(
            data,
            0,
            0
        );

        // Resize if target dimensions are set
        if (targetWidth && targetHeight) {
            const resizedCanvas = document.createElement('canvas');
            const resizedCtx = resizedCanvas.getContext('2d');
            if (!resizedCtx) throw new Error('No 2d context');

            resizedCanvas.width = targetWidth;
            resizedCanvas.height = targetHeight;
            resizedCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
            return new Promise((resolve) => {
                resizedCanvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                }, 'image/jpeg', 0.9);
            });
        }

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
            }, 'image/jpeg', 0.9);
        });
    };

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels || !imageFile) return;

        setIsProcessing(true);
        try {
            // Get cropped image blob
            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );

            // Compress the image
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: Math.max(targetWidth, targetHeight),
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(
                new File([croppedBlob], imageFile.name, { type: 'image/jpeg' }),
                options
            );

            // Create a new File object with the processed image
            const finalFile = new File(
                [compressedFile],
                imageFile.name.replace(/\.[^/.]+$/, '.jpg'),
                { type: 'image/jpeg' }
            );

            onSave(finalFile, {
                width: targetWidth,
                height: targetHeight,
            });

            onOpenChange(false);
        } catch (error) {
            console.error('Error processing image:', error);
            toast.error('Failed to process image. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleWidthChange = (value: string) => {
        const width = parseInt(value) || 0;
        setTargetWidth(width);
        if (maintainAspectRatio && aspectRatio) {
            setTargetHeight(Math.round(width / aspectRatio));
        }
    };

    const handleHeightChange = (value: string) => {
        const height = parseInt(value) || 0;
        setTargetHeight(height);
        if (maintainAspectRatio && aspectRatio) {
            setTargetWidth(Math.round(height * aspectRatio));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                    <DialogDescription>
                        Crop, resize, and adjust your image before uploading.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col flex-1 min-h-0 gap-4">
                    {imageSrc && (
                        <>
                            {/* Crop Area */}
                            <div className="relative w-full h-96 bg-slate-900 rounded-lg overflow-hidden">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={aspectRatio}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    cropShape="rect"
                                    showGrid={true}
                                />
                            </div>

                            {/* Controls */}
                            <div className="space-y-4">
                                {/* Zoom Control */}
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">
                                        Zoom: {Math.round(zoom * 100)}%
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <ZoomOut className="w-4 h-4 text-slate-500" />
                                        <Slider
                                            value={[zoom]}
                                            onValueChange={(value) => setZoom(value[0])}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            className="flex-1"
                                        />
                                        <ZoomIn className="w-4 h-4 text-slate-500" />
                                    </div>
                                </div>

                                {/* Rotation Control */}
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">
                                        Rotation: {rotation}°
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setRotation((prev) => (prev - 90) % 360)}
                                        >
                                            <RotateCw className="w-4 h-4 mr-2 rotate-180" />
                                            Rotate Left
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                        >
                                            <RotateCw className="w-4 h-4 mr-2" />
                                            Rotate Right
                                        </Button>
                                    </div>
                                </div>

                                {/* Resize Controls */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">
                                            Target Width (px)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={targetWidth}
                                            onChange={(e) => handleWidthChange(e.target.value)}
                                            min={100}
                                            max={4000}
                                            step={10}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">
                                            Target Height (px)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={targetHeight}
                                            onChange={(e) => handleHeightChange(e.target.value)}
                                            min={100}
                                            max={4000}
                                            step={10}
                                        />
                                    </div>
                                    {aspectRatio && (
                                        <div className="col-span-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={maintainAspectRatio}
                                                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm text-slate-700">
                                                    Maintain aspect ratio ({aspectRatio.toFixed(2)})
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isProcessing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!imageSrc || !croppedAreaPixels || isProcessing}
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                        {isProcessing ? (
                            <>
                                <Maximize2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Save & Upload
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

