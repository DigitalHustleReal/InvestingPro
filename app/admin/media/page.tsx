'use client';

import { useState, useEffect } from 'react';
import { MediaUploader } from '@/components/admin/media/MediaUploader';
import { MediaLibrary } from '@/components/admin/media/MediaLibrary';
import { AdminPageHeader, ContentSection, StatCard } from '@/components/admin/AdminUIKit';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import { Toaster } from 'sonner';
import { Image, Upload, HardDrive, FileImage } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MediaStats {
    totalFiles: number;
    totalBytes: number;
    imageCount: number;
    docCount: number;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function MediaPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [stats, setStats] = useState<MediaStats | null>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            try {
                const { data, error } = await supabase
                    .from('media')
                    .select('mime_type, file_size');

                if (error || !data) return;

                const totalFiles = data.length;
                const totalBytes = data.reduce((sum: number, f: any) => sum + (f.file_size || 0), 0);
                const imageCount = data.filter((f: any) => f.mime_type?.startsWith('image/')).length;
                const docCount = totalFiles - imageCount;

                setStats({ totalFiles, totalBytes, imageCount, docCount });
            } catch {
                // silently fail — stats are non-critical
            }
        }
        fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    const handleUploadComplete = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <AdminLayout>
            <AdminPageContainer>
                <Toaster position="top-right" theme="dark" />
                
                <AdminPageHeader
                    title="Media Library"
                    subtitle="Manage your images and documents efficiently"
                    icon={Image}
                    iconColor="purple"
                />

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Files"
                        value={stats ? stats.totalFiles : '—'}
                        icon={FileImage}
                        color="purple"
                    />
                    <StatCard
                        label="Storage Used"
                        value={stats ? formatBytes(stats.totalBytes) : '—'}
                        icon={HardDrive}
                        color="blue"
                    />
                    <StatCard
                        label="Images"
                        value={stats ? stats.imageCount : '—'}
                        icon={Image}
                        color="teal"
                    />
                    <StatCard
                        label="Documents"
                        value={stats ? stats.docCount : '—'}
                        icon={Upload}
                        color="amber"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="space-y-6">
                        <ContentSection title="Upload Media">
                            <MediaUploader onUploadComplete={handleUploadComplete} />
                        </ContentSection>
                        
                        <ContentSection title="Storage Info">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-muted-foreground dark:text-muted-foreground">
                                    <span>Max file size</span>
                                    <span className="text-foreground dark:text-foreground font-medium">10MB</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground dark:text-muted-foreground">
                                    <span>Formats</span>
                                    <span className="text-foreground dark:text-foreground font-medium">JPG, PNG, WebP, PDF</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground dark:text-muted-foreground">
                                    <span>CDN</span>
                                    <span className="text-primary-400 font-medium">Enabled</span>
                                </div>
                            </div>
                        </ContentSection>
                    </div>

                    {/* Library Section */}
                    <div className="lg:col-span-2">
                        <ContentSection title="Browser" subtitle="Click to copy URL • Hover for actions">
                            <MediaLibrary key={refreshKey} />
                        </ContentSection>
                    </div>
                </div>
            </AdminPageContainer>
        </AdminLayout>
    );
}
