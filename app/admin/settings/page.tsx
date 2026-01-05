"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, Globe, Search, Key, Database, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPageHeader, ContentSection, ActionButton } from '@/components/admin/AdminUIKit';

export default function SettingsPage() {
    const [siteName, setSiteName] = React.useState('InvestingPro');
    const [siteDescription, setSiteDescription] = React.useState('');
    const [saving, setSaving] = React.useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        toast.success('Settings saved!');
    };

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                <AdminPageHeader
                    title="Settings"
                    subtitle="Configure site settings and preferences"
                    icon={Settings}
                    iconColor="blue"
                    actions={
                        <ActionButton onClick={handleSave} icon={Save} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Settings'}
                        </ActionButton>
                    }
                />

                <div className="max-w-4xl space-y-6">
                    {/* General Settings */}
                    <ContentSection title="General Settings" subtitle="Basic site configuration">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-slate-500" /> Site Name
                                </Label>
                                <Input
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    placeholder="InvestingPro"
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Site Description</Label>
                                <Textarea
                                    value={siteDescription}
                                    onChange={(e) => setSiteDescription(e.target.value)}
                                    placeholder="India's Best Financial Comparison Platform"
                                    rows={3}
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                    </ContentSection>

                    {/* SEO Settings */}
                    <ContentSection title="SEO Settings" subtitle="Search engine optimization defaults">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 flex items-center gap-2">
                                    <Search className="w-4 h-4 text-slate-500" /> Default Meta Title
                                </Label>
                                <Input
                                    placeholder="InvestingPro - Compare Financial Products"
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Default Meta Description</Label>
                                <Textarea
                                    placeholder="Compare credit cards, loans, mutual funds, and more..."
                                    rows={3}
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                    </ContentSection>

                    {/* API & Integrations */}
                    <ContentSection title="API & Integrations" subtitle="Third-party service connections">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" /> OpenAI API Key
                                </Label>
                                <Input
                                    type="password"
                                    placeholder="sk-..."
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 flex items-center gap-2">
                                    <Key className="w-4 h-4 text-secondary-500" /> Google Gemini Key
                                </Label>
                                <Input
                                    type="password"
                                    placeholder="AIza..."
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 flex items-center gap-2">
                                    <Database className="w-4 h-4 text-teal-500" /> Supabase URL
                                </Label>
                                <Input
                                    placeholder="https://your-project.supabase.co"
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-secondary-500" /> Supabase Anon Key
                                </Label>
                                <Input
                                    type="password"
                                    placeholder="eyJhbGciOiJIUzI1NiIs..."
                                    className="bg-slate-800/50 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                    </ContentSection>

                    {/* Environment Info */}
                    <ContentSection title="Environment" subtitle="Current deployment information">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Mode</div>
                                <div className="text-sm font-medium text-emerald-400">Development</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Region</div>
                                <div className="text-sm font-medium text-white">Asia (Mumbai)</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Version</div>
                                <div className="text-sm font-medium text-white">v1.0.0</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Database</div>
                                <div className="text-sm font-medium text-teal-400">Connected</div>
                            </div>
                        </div>
                    </ContentSection>
                </div>
            </div>
        </AdminLayout>
    );
}
