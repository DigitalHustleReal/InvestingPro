"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet, FileText, BookOpen, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadResource {
    id: string;
    title: string;
    description: string;
    type: 'dashboard' | 'guide' | 'ebook' | 'pdf' | 'template';
    format: 'excel' | 'google-sheets' | 'notion' | 'pdf' | 'csv';
    category: string;
    downloadCount: number;
    requiresEmail: boolean;
    tags: string[];
}

interface DownloadResourceCardProps {
    resource: DownloadResource;
    onDownload?: (resourceId: string, email: string) => Promise<void>;
}

export default function DownloadResourceCard({ resource, onDownload }: DownloadResourceCardProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);

    const getIcon = () => {
        switch (resource.type) {
            case 'dashboard':
                return <FileSpreadsheet className="w-6 h-6" />;
            case 'guide':
            case 'ebook':
                return <BookOpen className="w-6 h-6" />;
            case 'pdf':
                return <FileText className="w-6 h-6" />;
            default:
                return <Download className="w-6 h-6" />;
        }
    };

    const getFormatBadge = () => {
        const formatLabels: Record<string, string> = {
            'excel': 'Excel',
            'google-sheets': 'Google Sheets',
            'notion': 'Notion',
            'pdf': 'PDF',
            'csv': 'CSV'
        };
        return formatLabels[resource.format] || resource.format.toUpperCase();
    };

    const handleDownload = async () => {
        if (resource.requiresEmail && !email) {
            setShowEmailForm(true);
            return;
        }

        if (resource.requiresEmail && !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setDownloading(true);

        try {
            if (onDownload) {
                await onDownload(resource.id, email);
            } else {
                // Default: call API
                const response = await fetch('/api/downloads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        resourceId: resource.id,
                        email: email || undefined,
                        name: name || undefined,
                        source: 'download_card'
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to download');
                }

                const data = await response.json();
                
                // Trigger download
                if (data.downloadUrl) {
                    window.open(data.downloadUrl, '_blank');
                }

                toast.success('Download started!');
                setShowEmailForm(false);
                setEmail('');
                setName('');
            }
        } catch (error) {
            toast.error('Failed to download. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            {getIcon()}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                            <CardDescription className="mt-1">
                                {resource.description}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline">{getFormatBadge()}</Badge>
                </div>
            </CardHeader>
            
            <CardContent>
                {showEmailForm && resource.requiresEmail ? (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Your name (optional)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        />
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={handleDownload}
                                disabled={downloading || !email}
                                className="flex-1"
                            >
                                {downloading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowEmailForm(false);
                                    setEmail('');
                                    setName('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                            We'll send you the download link and add you to our newsletter
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Download className="w-4 h-4" />
                            <span>{resource.downloadCount || 0} downloads</span>
                        </div>
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full"
                        >
                            {downloading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    {resource.requiresEmail ? 'Get Download' : 'Download Now'}
                                </>
                            )}
                        </Button>
                        {resource.requiresEmail && (
                            <p className="text-xs text-gray-500 text-center">
                                <Mail className="w-3 h-3 inline mr-1" />
                                Email required for download
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
