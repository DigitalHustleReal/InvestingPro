"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = React.useState('');

    // Note: This would need a proper users API endpoint
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users', searchQuery],
        queryFn: async () => {
            // Placeholder - would need actual users API
            return [];
        },
        initialData: []
    });

    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-slate-50">
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                            <p className="text-sm text-slate-600 mt-1">Manage user accounts and permissions</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Users List */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">Loading...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <Card>
                            <CardContent className="p-6 md:p-8 text-center">
                                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
                                <p className="text-slate-600">
                                    {searchQuery ? 'Try a different search query' : 'Users will appear here once they register'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user: any) => (
                                <Card key={user.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-slate-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{user.full_name || user.email}</h3>
                                                    <p className="text-sm text-slate-600">{user.email}</p>
                                                </div>
                                            </div>
                                            <Badge className={
                                                user.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : user.role === 'editor'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-slate-100 text-slate-700'
                                            }>
                                                {user.role || 'user'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
