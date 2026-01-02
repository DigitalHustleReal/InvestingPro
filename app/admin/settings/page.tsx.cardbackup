"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [siteName, setSiteName] = React.useState('InvestingPro');
    const [siteDescription, setSiteDescription] = React.useState('');
    const [saving, setSaving] = React.useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        toast.success('Settings saved successfully!');
    };

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-slate-50">
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                            <p className="text-sm text-slate-600 mt-1">Configure site settings and preferences</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* General Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    General Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input
                                        id="siteName"
                                        value={siteName}
                                        onChange={(e) => setSiteName(e.target.value)}
                                        placeholder="InvestingPro"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siteDescription">Site Description</Label>
                                    <Textarea
                                        id="siteDescription"
                                        value={siteDescription}
                                        onChange={(e) => setSiteDescription(e.target.value)}
                                        placeholder="India's Best Financial Comparison Platform"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="metaTitle">Default Meta Title</Label>
                                    <Input
                                        id="metaTitle"
                                        placeholder="InvestingPro - Compare Financial Products"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="metaDescription">Default Meta Description</Label>
                                    <Textarea
                                        id="metaDescription"
                                        placeholder="Compare credit cards, loans, mutual funds, and more..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* API Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>API & Integrations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="openaiKey">OpenAI API Key</Label>
                                    <Input
                                        id="openaiKey"
                                        type="password"
                                        placeholder="sk-..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supabaseUrl">Supabase URL</Label>
                                    <Input
                                        id="supabaseUrl"
                                        placeholder="https://your-project.supabase.co"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button 
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                {saving ? (
                                    <>
                                        <span className="mr-2">Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Settings
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
