"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import { Users, Search, Shield, UserCheck, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AdminPageHeader, ContentSection, StatCard, EmptyState, StatusBadge } from '@/components/admin/AdminUIKit';

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = React.useState('');

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users', searchQuery],
        queryFn: async () => [],
        initialData: []
    });

    const filteredUsers = users.filter((u: any) => 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleVariant = (role: string): 'neutral' | 'completed' | 'processing' | 'warning' | 'error' => {
        switch (role) {
            case 'admin': return 'error';
            case 'editor': return 'processing';
            case 'author': return 'completed';
            default: return 'neutral';
        }
    };

    return (
        <AdminLayout>
            <AdminPageContainer>
                <AdminPageHeader
                    title="Users"
                    subtitle="Manage user accounts and permissions"
                    icon={Users}
                    iconColor="purple"
                />

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Users" value={users.length} icon={Users} color="purple" />
                    <StatCard label="Admins" value={users.filter((u: any) => u.role === 'admin').length} icon={Shield} color="rose" />
                    <StatCard label="Editors" value={users.filter((u: any) => u.role === 'editor').length} icon={UserCheck} color="blue" />
                    <StatCard label="Active" value={users.filter((u: any) => u.is_active).length} icon={UserCheck} color="teal" />
                </div>

                {/* Search */}
                <ContentSection>
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 dark:text-muted-foreground/70" />
                        <input
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 dark:bg-muted/50 border border-border dark:border-border rounded-lg text-foreground dark:text-foreground placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                </ContentSection>

                {/* Users List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-secondary-500/30 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <ContentSection>
                        <EmptyState
                            icon={Users}
                            title={searchQuery ? 'No users found' : 'No users yet'}
                            description={searchQuery ? 'Try a different search query' : 'Users will appear here once they register'}
                        />
                    </ContentSection>
                ) : (
                    <div className="space-y-4">
                        {filteredUsers.map((user: any) => (
                            <ContentSection key={user.id}>
                                <div className="flex items-center justify-between -m-6 p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500/20 to-pink-500/20 border border-secondary-500/30 flex items-center justify-center">
                                            <span className="text-lg font-bold text-secondary-400">
                                                {(user.full_name || user.email || 'U')[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground dark:text-foreground">{user.full_name || user.email}</h3>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground/70 dark:text-muted-foreground/70">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <StatusBadge status={getRoleVariant(user.role || 'user')}>
                                        {user.role || 'user'}
                                    </StatusBadge>
                                </div>
                            </ContentSection>
                        ))}
                    </div>
                )}
            </AdminPageContainer>
        </AdminLayout>
    );
}
