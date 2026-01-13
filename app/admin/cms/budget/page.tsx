"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BudgetGovernorPanel from '@/components/admin/BudgetGovernorPanel';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CMSBudgetPage() {
    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <DollarSign className="w-8 h-8 text-secondary-400" />
                            Budget Management
                        </h1>
                        <p className="text-slate-400">Monitor and control daily spending limits</p>
                    </div>
                </div>

                {/* Budget Panel */}
                <Card className="bg-white/[0.03] border-white/5">
                    <CardHeader className="border-b border-white/5">
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-secondary-400" />
                            Daily Budget Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <BudgetGovernorPanel />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
