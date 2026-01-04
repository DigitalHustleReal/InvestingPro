"use client";

import { MediaLibrary } from '@/components/media/MediaLibrary';

/**
 * Media Manager Page
 * Standalone page for managing all media files
 * Route: /admin/media
 */
export default function MediaManagerPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Media Library
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Upload, manage, and organize all your images in one place
                    </p>
                </div>
            </div>

            {/* Media Library */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm" style={{ height: 'calc(100vh - 200px)' }}>
                    <MediaLibrary mode="browse" />
                </div>
            </div>
        </div>
    );
}
