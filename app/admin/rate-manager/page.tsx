"use client";

import React, { useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Percent,
    CheckCircle2,
    Clock,
    Edit3,
    Save,
    X,
    RefreshCw,
    AlertCircle,
    Building2,
    CreditCard,
    TrendingUp,
    Loader2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RateRow {
    id: string;
    provider: string;
    product: string;
    rate: string;
    rateSecondary?: string; // e.g. senior citizen rate for FD
    lastUpdated: string;
    isVerifiedToday: boolean;
    category: 'fd' | 'loan' | 'credit-card';
    notes?: string;
}

type EditState = Record<string, { rate: string; rateSecondary?: string; notes?: string }>;

// ─── Mock seed data (replaced by real API in production) ──────────────────────

const SEED_RATES: RateRow[] = [
    // Fixed Deposits
    { id: 'fd-sbi', provider: 'SBI', product: '1-Year FD', rate: '6.80', rateSecondary: '7.30', lastUpdated: '2026-03-20', isVerifiedToday: false, category: 'fd' },
    { id: 'fd-hdfc', provider: 'HDFC Bank', product: '1-Year FD', rate: '7.10', rateSecondary: '7.60', lastUpdated: '2026-03-22', isVerifiedToday: false, category: 'fd' },
    { id: 'fd-icici', provider: 'ICICI Bank', product: '1-Year FD', rate: '7.10', rateSecondary: '7.60', lastUpdated: '2026-03-18', isVerifiedToday: false, category: 'fd' },
    { id: 'fd-kotak', provider: 'Kotak Mahindra', product: '1-Year FD', rate: '7.25', rateSecondary: '7.75', lastUpdated: '2026-03-15', isVerifiedToday: false, category: 'fd' },
    { id: 'fd-axis', provider: 'Axis Bank', product: '1-Year FD', rate: '7.10', rateSecondary: '7.85', lastUpdated: '2026-03-10', isVerifiedToday: false, category: 'fd' },
    { id: 'fd-shriram', provider: 'Shriram Finance', product: '1-Year FD', rate: '8.15', rateSecondary: '8.65', lastUpdated: '2026-03-24', isVerifiedToday: true, category: 'fd', notes: 'NBFC — higher risk than bank FDs' },
    // Loans
    { id: 'loan-sbi-hl', provider: 'SBI', product: 'Home Loan', rate: '8.40', lastUpdated: '2026-03-21', isVerifiedToday: false, category: 'loan' },
    { id: 'loan-hdfc-hl', provider: 'HDFC Bank', product: 'Home Loan', rate: '8.50', lastUpdated: '2026-03-22', isVerifiedToday: false, category: 'loan' },
    { id: 'loan-icici-pl', provider: 'ICICI Bank', product: 'Personal Loan', rate: '10.50', lastUpdated: '2026-03-19', isVerifiedToday: false, category: 'loan' },
    { id: 'loan-hdfc-pl', provider: 'HDFC Bank', product: 'Personal Loan', rate: '10.50', lastUpdated: '2026-03-22', isVerifiedToday: false, category: 'loan' },
    { id: 'loan-bajaj', provider: 'Bajaj Finance', product: 'Personal Loan', rate: '11.00', lastUpdated: '2026-03-15', isVerifiedToday: false, category: 'loan' },
    // Credit Cards
    { id: 'cc-hdfc-regalia', provider: 'HDFC Bank', product: 'Regalia Credit Card', rate: '3.60', lastUpdated: '2026-03-20', isVerifiedToday: false, category: 'credit-card', notes: 'Monthly interest rate on outstanding' },
    { id: 'cc-sbi-cashback', provider: 'SBI Cards', product: 'SBI Cashback Card', rate: '3.50', lastUpdated: '2026-03-20', isVerifiedToday: false, category: 'credit-card' },
    { id: 'cc-axis-ace', provider: 'Axis Bank', product: 'Ace Credit Card', rate: '3.40', lastUpdated: '2026-03-18', isVerifiedToday: false, category: 'credit-card' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function staleDays(dateStr: string): number {
    const now = new Date();
    const then = new Date(dateStr);
    return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function stalenessColor(days: number): string {
    if (days === 0) return 'text-primary-600 dark:text-primary-400';
    if (days <= 7) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
}

function staleBadge(days: number) {
    if (days === 0) return <Badge className="bg-primary-50 text-primary-700 border-primary-100 text-[10px]">Verified Today</Badge>;
    if (days <= 7) return <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[10px]">{days}d ago</Badge>;
    return <Badge className="bg-red-50 text-red-700 border-red-100 text-[10px]">{days}d ago — Stale</Badge>;
}

// ─── Rate Row Component ───────────────────────────────────────────────────────

function RateRowItem({
    row,
    editing,
    editValues,
    onEdit,
    onSave,
    onCancel,
    onVerify,
    onChange,
    saving,
}: {
    row: RateRow;
    editing: boolean;
    editValues: { rate: string; rateSecondary?: string; notes?: string };
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onVerify: () => void;
    onChange: (field: 'rate' | 'rateSecondary' | 'notes', val: string) => void;
    saving: boolean;
}) {
    const days = staleDays(row.lastUpdated);

    return (
        <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            {/* Provider + Product */}
            <td className="py-3 px-4">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{row.provider}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{row.product}</div>
            </td>

            {/* Rate */}
            <td className="py-3 px-4">
                {editing ? (
                    <div className="flex items-center gap-2">
                        <Input
                            value={editValues.rate}
                            onChange={(e) => onChange('rate', e.target.value)}
                            className="w-24 h-8 text-sm font-mono"
                            placeholder="0.00"
                            type="number"
                            step="0.05"
                        />
                        <span className="text-xs text-slate-500">%</span>
                    </div>
                ) : (
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{row.rate}%</span>
                )}
            </td>

            {/* Senior / Secondary Rate */}
            {row.category === 'fd' && (
                <td className="py-3 px-4">
                    {editing ? (
                        <div className="flex items-center gap-2">
                            <Input
                                value={editValues.rateSecondary ?? ''}
                                onChange={(e) => onChange('rateSecondary', e.target.value)}
                                className="w-24 h-8 text-sm font-mono"
                                placeholder="0.00"
                                type="number"
                                step="0.05"
                            />
                            <span className="text-xs text-slate-500">%</span>
                        </div>
                    ) : (
                        <span className="font-mono text-sm text-amber-600 dark:text-amber-400">
                            {row.rateSecondary ? `${row.rateSecondary}%` : '—'}
                        </span>
                    )}
                </td>
            )}

            {/* Notes */}
            <td className="py-3 px-4 hidden md:table-cell max-w-[200px]">
                {editing ? (
                    <Input
                        value={editValues.notes ?? ''}
                        onChange={(e) => onChange('notes', e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Optional note"
                    />
                ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500 truncate block">{row.notes || '—'}</span>
                )}
            </td>

            {/* Last Updated */}
            <td className="py-3 px-4 whitespace-nowrap">
                <div className={`text-xs font-medium ${stalenessColor(days)}`}>
                    {row.lastUpdated}
                </div>
                <div className="mt-0.5">{staleBadge(days)}</div>
            </td>

            {/* Actions */}
            <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                    {editing ? (
                        <>
                            <Button
                                size="sm"
                                onClick={onSave}
                                disabled={saving}
                                className="h-7 px-3 text-xs bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Save className="w-3 h-3 mr-1" />Save</>}
                            </Button>
                            <Button size="sm" variant="outline" onClick={onCancel} className="h-7 px-2 text-xs">
                                <X className="w-3 h-3" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="sm" variant="outline" onClick={onEdit} className="h-7 px-3 text-xs">
                                <Edit3 className="w-3 h-3 mr-1" />Edit
                            </Button>
                            {days > 0 && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onVerify}
                                    className="h-7 px-3 text-xs border-primary-200 text-primary-600 hover:bg-primary-50"
                                    title="Mark rate as verified today (no change)"
                                >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />Verify
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ─── Rate Table ───────────────────────────────────────────────────────────────

function RateTable({ rows, category }: { rows: RateRow[]; category: 'fd' | 'loan' | 'credit-card' }) {
    const [rates, setRates] = useState<RateRow[]>(rows);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editState, setEditState] = useState<EditState>({});
    const [savingId, setSavingId] = useState<string | null>(null);
    const [saveMsg, setSaveMsg] = useState<{ id: string; msg: string } | null>(null);

    const staleCount = rates.filter(r => staleDays(r.lastUpdated) > 7).length;

    const handleEdit = (row: RateRow) => {
        setEditingId(row.id);
        setEditState(prev => ({
            ...prev,
            [row.id]: { rate: row.rate, rateSecondary: row.rateSecondary, notes: row.notes },
        }));
    };

    const handleCancel = () => setEditingId(null);

    const handleChange = (id: string, field: 'rate' | 'rateSecondary' | 'notes', val: string) => {
        setEditState(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: val },
        }));
    };

    const handleSave = useCallback(async (row: RateRow) => {
        setSavingId(row.id);
        const vals = editState[row.id];
        try {
            // TODO: Replace with real API call when rate manager API is built
            // await fetch('/api/admin/rates', { method: 'PATCH', body: JSON.stringify({ id: row.id, ...vals }) });
            await new Promise(r => setTimeout(r, 400)); // simulate API
            setRates(prev => prev.map(r =>
                r.id === row.id
                    ? { ...r, rate: vals.rate, rateSecondary: vals.rateSecondary, notes: vals.notes, lastUpdated: new Date().toISOString().split('T')[0], isVerifiedToday: true }
                    : r
            ));
            setEditingId(null);
            setSaveMsg({ id: row.id, msg: 'Saved ✓' });
            setTimeout(() => setSaveMsg(null), 2000);
        } finally {
            setSavingId(null);
        }
    }, [editState]);

    const handleVerify = useCallback(async (row: RateRow) => {
        setSavingId(row.id);
        try {
            await new Promise(r => setTimeout(r, 300)); // simulate API
            setRates(prev => prev.map(r =>
                r.id === row.id
                    ? { ...r, lastUpdated: new Date().toISOString().split('T')[0], isVerifiedToday: true }
                    : r
            ));
            setSaveMsg({ id: row.id, msg: 'Verified ✓' });
            setTimeout(() => setSaveMsg(null), 2000);
        } finally {
            setSavingId(null);
        }
    }, []);

    const handleVerifyAll = async () => {
        const today = new Date().toISOString().split('T')[0];
        setRates(prev => prev.map(r => ({ ...r, lastUpdated: today, isVerifiedToday: true })));
    };

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    {staleCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-semibold">{staleCount} rates are stale (&gt;7 days old)</span>
                        </div>
                    )}
                    {staleCount === 0 && (
                        <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg px-3 py-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-semibold">All rates up to date</span>
                        </div>
                    )}
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleVerifyAll}
                    className="text-xs h-8 border-primary-200 text-primary-600 hover:bg-primary-50"
                >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Mark All Verified Today
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Provider / Product</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                {category === 'fd' ? 'Rate (General)' : category === 'credit-card' ? 'Monthly Rate' : 'Interest Rate'}
                            </th>
                            {category === 'fd' && (
                                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Senior Citizen</th>
                            )}
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Notes</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Last Verified</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900">
                        {rates.map(row => (
                            <React.Fragment key={row.id}>
                                <RateRowItem
                                    row={row}
                                    editing={editingId === row.id}
                                    editValues={editState[row.id] ?? { rate: row.rate, rateSecondary: row.rateSecondary, notes: row.notes }}
                                    onEdit={() => handleEdit(row)}
                                    onSave={() => handleSave(row)}
                                    onCancel={handleCancel}
                                    onVerify={() => handleVerify(row)}
                                    onChange={(field, val) => handleChange(row.id, field, val)}
                                    saving={savingId === row.id}
                                />
                                {saveMsg?.id === row.id && (
                                    <tr>
                                        <td colSpan={category === 'fd' ? 6 : 5} className="py-1 px-4">
                                            <span className="text-xs text-primary-600 font-semibold">{saveMsg.msg}</span>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                Changes are saved immediately. Rate data refreshes on the public site within 1 hour (ISR cache).
            </p>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RateManagerPage() {
    const fdRates = SEED_RATES.filter(r => r.category === 'fd');
    const loanRates = SEED_RATES.filter(r => r.category === 'loan');
    const ccRates = SEED_RATES.filter(r => r.category === 'credit-card');

    const totalStale = SEED_RATES.filter(r => staleDays(r.lastUpdated) > 7).length;

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
                {/* Header */}
                <div className="mb-8 border-b border-border/50 pb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                    <Percent className="w-5 h-5 text-primary-500" />
                                </div>
                                Rate Table Manager
                                {totalStale > 0 && (
                                    <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px] font-bold ml-2">
                                        {totalStale} stale
                                    </Badge>
                                )}
                            </h1>
                            <p className="text-muted-foreground text-sm mt-2 ml-13">
                                Update FD, loan, and credit card rates without touching code. Changes reflect on the site within 1 hour.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Public cache: 1hr ISR
                        </div>
                    </div>
                </div>

                {/* How-to Guide Card */}
                <Card className="mb-6 border-primary-100 dark:border-primary-900/50 bg-primary-50/30 dark:bg-primary-950/20">
                    <CardContent className="p-4">
                        <div className="grid sm:grid-cols-3 gap-4 text-sm">
                            {[
                                { icon: Edit3, title: 'Edit a rate', desc: 'Click "Edit" on any row, update the number, click "Save". Done in 10 seconds.' },
                                { icon: CheckCircle2, title: 'Verify without changing', desc: 'If the rate is still correct, click "Verify" — updates the "last verified" date only.' },
                                { icon: Clock, title: 'Stale warning', desc: 'Rows older than 7 days are flagged red. Aim to verify all rates at least weekly.' },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="flex items-start gap-3">
                                    <Icon className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="fd">
                    <TabsList className="mb-6">
                        <TabsTrigger value="fd" className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" />
                            Fixed Deposits
                            <Badge className="ml-1 bg-slate-100 text-slate-600 border-0 text-[10px]">{fdRates.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="loans" className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Loans
                            <Badge className="ml-1 bg-slate-100 text-slate-600 border-0 text-[10px]">{loanRates.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="credit-cards" className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5" />
                            Credit Cards
                            <Badge className="ml-1 bg-slate-100 text-slate-600 border-0 text-[10px]">{ccRates.length}</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="fd">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary-500" />
                                    Fixed Deposit Rates
                                    <span className="text-xs font-normal text-slate-500 ml-2">Rates for 1-year tenure. Update all tenure rates via the FD product editor.</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RateTable rows={fdRates} category="fd" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="loans">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary-500" />
                                    Loan Interest Rates
                                    <span className="text-xs font-normal text-slate-500 ml-2">Starting interest rate (p.a.). Actual rate depends on applicant profile.</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RateTable rows={loanRates} category="loan" />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="credit-cards">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary-500" />
                                    Credit Card Interest Rates
                                    <span className="text-xs font-normal text-slate-500 ml-2">Monthly finance charge on outstanding balance.</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RateTable rows={ccRates} category="credit-card" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
