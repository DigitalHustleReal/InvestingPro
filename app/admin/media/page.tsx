'use client';

import { useState } from 'react';
import { MediaUploader } from '@/components/admin/media/MediaUploader';
import { MediaLibrary } from '@/components/admin/media/MediaLibrary';
import { AdminPageHeader, ContentSection, StatCard } from '@/components/admin/AdminUIKit';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import { Toaster } from 'sonner';
import { Image, Upload, HardDrive, FileImage } from 'lucide-react';

export default function MediaPage() {
    const [refreshKey, setRefreshKey] = useState(0);

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
                    <StatCard label="Total Files" value="--" icon={FileImage} color="purple" />
                    <StatCard label="Storage Used" value="--" icon={HardDrive} color="blue" />
                    <StatCard label="Images" value="--" icon={Image} color="teal" />
                    <StatCard label="Documents" value="--" icon={Upload} color="amber" />
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
