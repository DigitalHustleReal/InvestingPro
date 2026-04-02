"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Upload, X } from "lucide-react";

const expertiseOptions = [
    "Mutual Funds", "Stocks", "Insurance", "Tax Planning",
    "Retirement", "Real Estate", "Cryptocurrency", "Personal Finance"
];

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any;
    onUpdate: () => Promise<void>;
}

export default function EditProfileDialog({ open, onOpenChange, user, onUpdate }: EditProfileDialogProps) {
    const [formData, setFormData] = useState({
        bio: user?.bio || '',
        profile_picture: user?.profile_picture || '',
        expertise: user?.expertise || [],
        twitter: user?.social_links?.twitter || '',
        linkedin: user?.social_links?.linkedin || '',
        website: user?.social_links?.website || ''
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await api.integrations.Core.UploadFile({ file });
            setFormData({ ...formData, profile_picture: result.file_url });
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const toggleExpertise = (exp: string) => {
        if (formData.expertise.includes(exp)) {
            setFormData({
                ...formData,
                expertise: formData.expertise.filter((e: string) => e !== exp)
            });
        } else {
            setFormData({
                ...formData,
                expertise: [...formData.expertise, exp]
            });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.auth.updateMe({
                bio: formData.bio,
                profile_picture: formData.profile_picture,
                expertise: formData.expertise,
                social_links: {
                    twitter: formData.twitter,
                    linkedin: formData.linkedin,
                    website: formData.website
                }
            });

            await onUpdate();
            onOpenChange(false);
        } catch (error: any) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information and preferences
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-4">
                            {formData.profile_picture && (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                    <img
                                        src={formData.profile_picture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => setFormData({ ...formData, profile_picture: '' })}
                                        className="absolute top-1 right-1 w-6 h-6 bg-danger-500 rounded-full flex items-center justify-center text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <div className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 flex items-center gap-2 transition-colors">
                                    <Upload className="w-4 h-4" />
                                    {uploading ? 'Uploading...' : 'Upload Photo'}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us about yourself and your investment experience..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={4}
                        />
                    </div>

                    {/* Expertise */}
                    <div className="space-y-2">
                        <Label>Areas of Expertise</Label>
                        <div className="flex flex-wrap gap-2">
                            {expertiseOptions.map((exp) => (
                                <Badge
                                    key={exp}
                                    onClick={() => toggleExpertise(exp)}
                                    variant={formData.expertise.includes(exp) ? "default" : "outline"}
                                    className={`cursor-pointer transition-colors ${formData.expertise.includes(exp)
                                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {exp}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <Label>Social Links (Optional)</Label>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                                <Input
                                    id="twitter"
                                    placeholder="https://twitter.com/username"
                                    value={formData.twitter}
                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    placeholder="https://linkedin.com/in/username"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-sm">Website</Label>
                                <Input
                                    id="website"
                                    placeholder="https://yourwebsite.com"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving || uploading}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
