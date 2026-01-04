"use client";

import { useState } from 'react';
import { generateFeaturedImage } from '@/lib/ai/image-generator';
import { mediaService } from '@/lib/media/media-service';

export function AIImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const quickPrompts = [
        'Professional credit card on desk with laptop',
        'Modern banking interface on smartphone',
        'Financial growth chart with rising arrow',
        'Person using mobile banking app',
        'Investment portfolio dashboard',
        'Business meeting discussing finances',
        'Credit score meter showing excellent',
        'Stack of coins with plant growing'
    ];

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setGenerating(true);
        setError(null);
        setGeneratedUrl(null);

        try {
            // Generate image using AI with prompt as title and default category
            const imageUrl = await generateFeaturedImage(prompt, 'credit-cards');
            setGeneratedUrl(imageUrl);
        } catch (err: any) {
            setError(err.message || 'Failed to generate image');
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveToLibrary = async () => {
        if (!generatedUrl) return;

        try {
            // Download generated image
            const response = await fetch(generatedUrl);
            const blob = await response.blob();
            
            // Convert to File
            const file = new File(
                [blob],
                `ai-generated-${Date.now()}.png`,
                { type: 'image/png' }
            );

            // Upload to media library
            await mediaService.uploadImage(file, {
                folder: 'ai-generated',
                title: prompt,
                altText: prompt
            });

            alert('Image saved to media library!');
        } catch (err: any) {
            alert(`Failed to save: ${err.message}`);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    🎨 AI Image Generator
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Generate custom images using AI. Perfect for unique featured images.
                </p>

                {/* Prompt Input */}
                <div className="space-y-3">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the image you want... (e.g., 'Professional credit card on wooden desk with laptop in background, modern lighting')"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={generating || !prompt.trim()}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <span className="inline-block animate-spin mr-2">⏳</span>
                                Generating... (this may take 10-30 seconds)
                            </>
                        ) : (
                            <>🎨 Generate Image</>
                        )}
                    </button>
                </div>

                {/* Quick Prompts */}
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Quick Ideas:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {quickPrompts.map((quickPrompt) => (
                            <button
                                key={quickPrompt}
                                onClick={() => setPrompt(quickPrompt)}
                                className="text-left px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                                {quickPrompt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Generated Image */}
            <div className="flex-1 overflow-auto p-4">
                {error ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center max-w-md">
                            <div className="text-6xl mb-4">❌</div>
                            <p className="text-red-600 font-medium mb-2">Generation Failed</p>
                            <p className="text-sm text-gray-600">{error}</p>
                            <button
                                onClick={() => {
                                    setError(null);
                                    setGeneratedUrl(null);
                                }}
                                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : generatedUrl ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Preview */}
                        <div className="border rounded-lg overflow-hidden mb-4">
                            <img
                                src={generatedUrl}
                                alt={prompt}
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Prompt used */}
                        <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Prompt used:</p>
                            <p className="text-sm text-gray-600 italic">"{prompt}"</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveToLibrary}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            >
                                ✓ Save to Media Library
                            </button>
                            <button
                                onClick={() => {
                                    setGeneratedUrl(null);
                                    setPrompt('');
                                }}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                            >
                                🔄 Generate New
                            </button>
                            <a
                                href={generatedUrl}
                                download={`ai-generated-${Date.now()}.png`}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
                            >
                                ⬇️ Download
                            </a>
                        </div>
                    </div>
                ) : generating ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block animate-spin text-6xl mb-4">🎨</div>
                            <p className="text-lg font-medium text-gray-700 mb-2">
                                Generating your image...
                            </p>
                            <p className="text-sm text-gray-500">
                                This may take 10-30 seconds
                            </p>
                            <div className="mt-4 w-64 mx-auto bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center max-w-md">
                            <div className="text-6xl mb-4">🎨</div>
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                Ready to generate!
                            </p>
                            <p className="text-gray-400 text-sm">
                                Enter a description above and click "Generate Image"
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="border-t p-4 bg-amber-50">
                <h4 className="text-sm font-medium text-amber-900 mb-2">
                    💡 Tips for Better Results:
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Be specific: describe style, lighting, colors, setting</li>
                    <li>• Add keywords like "professional", "modern", "clean"</li>
                    <li>• Mention the mood: "bright", "serious", "friendly"</li>
                    <li>• Example: "Modern credit card on marble desk, soft lighting, minimalist, professional"</li>
                </ul>
            </div>
        </div>
    );
}
