
"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
    Users, 
    Plus, 
    Search, 
    MoreVertical, 
    Mail, 
    Globe, 
    Twitter, 
    Linkedin, 
    Trash2, 
    Edit,
    CheckCircle2,
    Briefcase
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

export default function AuthorsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<any>(null);
    const queryClient = useQueryClient();
    const supabase = createClient();

    // Fetch Authors
    const { data: authors = [], isLoading } = useQuery({
        queryKey: ['authors'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('authors')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw error;
            return data;
        }
    });

    // Create/Update Mutation
    const mutation = useMutation({
        mutationFn: async (author: any) => {
            const cleanData = {
                name: author.name,
                slug: author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                role: author.role,
                bio: author.bio,
                photo_url: author.photo_url,
                email: author.email,
                social_links: author.social_links,
                is_active: true
            };

            if (editingAuthor?.id) {
                const { error } = await supabase.from('authors').update(cleanData).eq('id', editingAuthor.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('authors').insert(cleanData);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            toast.success(editingAuthor ? 'Author updated' : 'Author recruited');
            setIsDialogOpen(false);
            setEditingAuthor(null);
            queryClient.invalidateQueries({ queryKey: ['authors'] });
        },
        onError: (err: any) => {
            toast.error('Operation failed: ' + err.message);
        }
    });

    const [formData, setFormData] = useState({
        name: '',
        role: 'Financial Analyst',
        bio: '',
        photo_url: '',
        email: '',
        twitter: '',
        linkedin: ''
    });

    const handleEdit = (author: any) => {
        setEditingAuthor(author);
        setFormData({
            name: author.name,
            role: author.role || '',
            bio: author.bio || '',
            photo_url: author.photo_url || '',
            email: author.email || '',
            twitter: author.social_links?.twitter || '',
            linkedin: author.social_links?.linkedin || ''
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingAuthor(null);
        setFormData({
            name: '',
            role: 'Financial Analyst',
            bio: '',
            photo_url: '',
            email: '',
            twitter: '',
            linkedin: ''
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        mutation.mutate({
            ...formData,
            social_links: {
                twitter: formData.twitter,
                linkedin: formData.linkedin
            }
        });
    };

    // Ensure authors is always an array
    const authorsArray = Array.isArray(authors) ? authors : [];
    const filteredAuthors = authorsArray.filter((a: any) => 
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="min-h-screen text-slate-100 p-8 font-sans">
                {/* Breadcrumb */}
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25 flex items-center justify-center">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Editorial Team
                            </h1>
                            <p className="text-slate-400 mt-1">Manage the experts behind your content authority.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            onClick={handleCreate} 
                            className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white rounded-xl shadow-lg shadow-primary-500/25"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Recruit Expert
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8 relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                        placeholder="Search team members..." 
                        className="pl-10 bg-white/5 border-white/10 rounded-xl focus:ring-primary-500/50 text-white placeholder:text-slate-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAuthors.map((author: any) => (
                        <Card key={author.id} className="bg-white/[0.02] border-white/5 hover:border-primary-500/30 transition-all duration-300 group overflow-hidden relative">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 blur-3xl -mr-12 -mt-12 group-hover:bg-primary-500/20 transition-colors" />
                            
                            <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                                <div className="w-24 h-24 rounded-full border-4 border-white/5 mb-4 shadow-2xl relative overflow-hidden bg-slate-800">
                                    <img 
                                        src={author.photo_url || `https://api.dicebear.com/7.x/personas/svg?seed=${author.slug}`} 
                                        alt={author.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{author.name}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 justify-center">
                                    <Briefcase className="w-3 h-3" />
                                    {author.role || 'Contributor'}
                                </p>

                                <p className="text-sm text-slate-400 line-clamp-3 mb-6 min-h-[60px]">
                                    {author.bio || "No biography available for this team member."}
                                </p>

                                <div className="flex items-center gap-3 mt-auto w-full justify-center">
                                    {author.social_links?.twitter && (
                                        <a href={author.social_links.twitter} target="_blank" className="p-2 rounded-lg bg-white/5 hover:bg-secondary-500/20 hover:text-secondary-400 text-slate-500 transition-colors">
                                            <Twitter className="w-4 h-4" />
                                        </a>
                                    )}
                                    {author.social_links?.linkedin && (
                                        <a href={author.social_links.linkedin} target="_blank" className="p-2 rounded-lg bg-white/5 hover:bg-secondary-600/20 hover:text-secondary-500 text-slate-500 transition-colors">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="ml-auto border-white/10 hover:bg-white/5 hover:text-primary-400"
                                        onClick={() => handleEdit(author)}
                                    >
                                        <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {/* Add New Card */}
                    <button 
                        onClick={handleCreate}
                        className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-xl bg-white/[0.01] hover:bg-primary-500/5 hover:border-primary-500/30 transition-all group min-h-[360px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-slate-500 group-hover:text-primary-400" />
                        </div>
                        <h3 className="font-bold text-slate-400 group-hover:text-primary-400">Recruit New Talent</h3>
                    </button>
                </div>

                {/* Creation Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                {editingAuthor ? <Edit className="w-5 h-5 text-primary-400" /> : <Plus className="w-5 h-5 text-primary-400" />}
                                {editingAuthor ? 'Edit Profile' : 'Recruit New Expert'}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                                Fill in the details for this team member.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border-white/10" placeholder="e.g. Sarah Smith" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Role / Title</label>
                                    <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="bg-white/5 border-white/10" placeholder="e.g. Chief Economist" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Biography</label>
                                <textarea 
                                    value={formData.bio} 
                                    onChange={e => setFormData({...formData, bio: e.target.value})} 
                                    className="w-full h-24 bg-white/5 border border-white/10 rounded-md p-3 text-sm focus:ring-primary-500/50 focus:outline-none placeholder:text-slate-600" 
                                    placeholder="Write a compelling bio..." 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    Profile Photo URL <span className="text-xs text-slate-600 text-normal normal-case">(DiceBear used if empty)</span>
                                </label>
                                <Input value={formData.photo_url} onChange={e => setFormData({...formData, photo_url: e.target.value})} className="bg-white/5 border-white/10" placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Twitter className="w-3 h-3"/> Twitter</label>
                                    <Input value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} className="bg-white/5 border-white/10" placeholder="@handle" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Linkedin className="w-3 h-3"/> LinkedIn</label>
                                    <Input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="bg-white/5 border-white/10" placeholder="Profile URL" />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/10 hover:bg-white/5 text-slate-400">Cancel</Button>
                            <Button onClick={handleSubmit} disabled={mutation.isPending} className="bg-primary-600 hover:bg-primary-700 text-white font-bold">
                                {mutation.isPending ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
