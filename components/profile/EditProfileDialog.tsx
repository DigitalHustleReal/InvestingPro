"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient as api } from "@/lib/api-client";
import { User, Mail, FileText, Camera } from "lucide-react";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
    onUpdate: () => void;
}

export default function EditProfileDialog({ open, onOpenChange, user, onUpdate }: EditProfileDialogProps) {
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        bio: user?.bio || '',
        profile_picture: user?.profile_picture || '',
        expertise: user?.expertise?.join(', ') || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const expertiseArray = formData.expertise.split(',').map((s: string) => s.trim()).filter(Boolean);
            await api.auth.updateMe({
                full_name: formData.full_name,
                bio: formData.bio,
                profile_picture: formData.profile_picture,
                expertise: expertiseArray
            });
            onUpdate();
            onOpenChange(false);
        } catch (error) {
            // Error handled gracefully - user will see form still open
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-xl p-8 border-0 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Refine Authority Profile</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium pt-1">
                        Keep your credentials updated to maintain your status as a verified market contributor.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-[10px] font-semibold uppercase text-slate-400 tracking-st px-1">Display Identity</Label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="pl-12 h-14 rounded-xl border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold"
                                placeholder="Real Name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[10px] font-semibold uppercase text-slate-400 tracking-st px-1">Authority Bio</Label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="pl-12 min-h-[100px] rounded-xl border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold pt-3.5"
                                placeholder="Expert in Equity Derivatives and Micro-cap analysis..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expertise" className="text-[10px] font-semibold uppercase text-slate-400 tracking-st px-1">Domains of Expertise (Comma separated)</Label>
                        <div className="relative group">
                            <Input
                                id="expertise"
                                value={formData.expertise}
                                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                className="h-14 rounded-xl border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold"
                                placeholder="Mutual Funds, SIPs, IPOs"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="profile_picture" className="text-[10px] font-semibold uppercase text-slate-400 tracking-st px-1">Avatar URL</Label>
                        <div className="relative group">
                            <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                            <Input
                                id="profile_picture"
                                value={formData.profile_picture}
                                onChange={(e) => setFormData({ ...formData, profile_picture: e.target.value })}
                                className="pl-12 h-14 rounded-xl border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl h-14 font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                        >
                            Discard Changes
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl h-14 bg-slate-900 hover:bg-secondary-600 font-semibold uppercase tracking-widest text-white transition-all px-8 shadow-xl shadow-purple-500/10"
                        >
                            {saving ? 'Synchronizing...' : 'Save DNA Profile'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
