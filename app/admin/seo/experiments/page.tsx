"use client";

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
    Plus, 
    FlaskConical, 
    TrendingUp, 
    Play, 
    Pause, 
    Trash2,
    BarChart3,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface ABVariant {
    id: string;
    name: string;
    content: string;
    weight: number;
}

interface ABTest {
    id: string;
    name: string;
    description: string | null;
    element: 'cta' | 'headline' | 'layout' | 'image' | 'copy' | 'popup';
    variants: ABVariant[];
    status: 'draft' | 'running' | 'paused' | 'completed';
    traffic_split: number;
    winner_variant_id: string | null;
    created_at: string;
}

interface ABTestStats {
    variantId: string;
    impressions: number;
    conversions: number;
    ctr: number;
}

export default function SEOExperimentsPage() {
    const [newTestOpen, setNewTestOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
    const queryClient = useQueryClient();
    const supabase = createClient();

    // Form state for new test
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        element: 'headline' as ABTest['element'],
        trafficSplit: 50,
        controlContent: '',
        variantContent: '',
    });

    // Fetch all A/B tests
    const { data: tests = [], isLoading, refetch } = useQuery({
        queryKey: ['ab-tests'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('ab_tests')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return (data || []) as ABTest[];
        },
    });

    // Fetch stats for a test
    const { data: testStats } = useQuery({
        queryKey: ['ab-test-stats', selectedTest?.id],
        queryFn: async () => {
            if (!selectedTest) return null;
            
            const { data, error } = await supabase
                .from('ab_test_events')
                .select('variant_id, event_type')
                .eq('test_id', selectedTest.id);
            
            if (error) throw error;
            if (!data) return null;

            // Calculate stats per variant
            const stats: Record<string, { impressions: number; conversions: number }> = {};
            
            data.forEach((event: { variant_id: string; event_type: string }) => {
                if (!stats[event.variant_id]) {
                    stats[event.variant_id] = { impressions: 0, conversions: 0 };
                }
                if (event.event_type === 'impression') {
                    stats[event.variant_id].impressions++;
                } else if (event.event_type === 'conversion') {
                    stats[event.variant_id].conversions++;
                }
            });

            return Object.entries(stats).map(([variantId, s]) => ({
                variantId,
                impressions: s.impressions,
                conversions: s.conversions,
                ctr: s.impressions > 0 ? (s.conversions / s.impressions) * 100 : 0,
            })) as ABTestStats[];
        },
        enabled: !!selectedTest,
    });

    // Create test mutation
    const createTest = useMutation({
        mutationFn: async () => {
            const variants: ABVariant[] = [
                { id: 'control', name: 'Control (A)', content: formData.controlContent, weight: 50 },
                { id: 'variant-b', name: 'Variant (B)', content: formData.variantContent, weight: 50 },
            ];

            const { data, error } = await supabase
                .from('ab_tests')
                .insert({
                    name: formData.name,
                    description: formData.description || null,
                    element: formData.element,
                    variants,
                    status: 'draft',
                    traffic_split: formData.trafficSplit,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            toast.success('A/B test created successfully');
            setNewTestOpen(false);
            setFormData({
                name: '',
                description: '',
                element: 'headline',
                trafficSplit: 50,
                controlContent: '',
                variantContent: '',
            });
            queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
        },
        onError: (error) => {
            toast.error('Failed to create test: ' + (error as Error).message);
        },
    });

    // Update test status mutation
    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ABTest['status'] }) => {
            const updates: any = { status };
            if (status === 'running') {
                updates.start_date = new Date().toISOString();
            } else if (status === 'completed') {
                updates.end_date = new Date().toISOString();
            }

            const { error } = await supabase
                .from('ab_tests')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Test status updated');
            queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
        },
        onError: (error) => {
            toast.error('Failed to update status: ' + (error as Error).message);
        },
    });

    // Delete test mutation
    const deleteTest = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('ab_tests')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Test deleted');
            setSelectedTest(null);
            queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
        },
        onError: (error) => {
            toast.error('Failed to delete test: ' + (error as Error).message);
        },
    });

    const getStatusBadge = (status: ABTest['status']) => {
        switch (status) {
            case 'running':
                return <Badge className="bg-success-500/20 text-success-400 border-success-500/30">Running</Badge>;
            case 'paused':
                return <Badge className="bg-warning-500/20 text-warning-400 border-warning-500/30">Paused</Badge>;
            case 'completed':
                return <Badge className="bg-primary-500/20 text-primary-400 border-primary-500/30">Completed</Badge>;
            default:
                return <Badge className="bg-muted/20 text-muted-foreground border-muted/30">Draft</Badge>;
        }
    };

    const getVariantStats = (variantId: string): ABTestStats | undefined => {
        return testStats?.find(s => s.variantId === variantId);
    };

    const getWinningVariant = (test: ABTest): string | null => {
        if (!testStats || testStats.length < 2) return null;
        const sorted = [...testStats].sort((a, b) => b.ctr - a.ctr);
        if (sorted[0].ctr > sorted[1].ctr && sorted[0].impressions >= 100) {
            return sorted[0].variantId;
        }
        return null;
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FlaskConical className="w-8 h-8 text-secondary-600" />
                            A/B Testing Experiments
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Test headlines, CTAs, and layouts to optimize conversion rates.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => refetch()} className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                        <Button onClick={() => setNewTestOpen(true)} className="bg-secondary-600 hover:bg-secondary-700 gap-2">
                            <Plus className="w-4 h-4" />
                            New Experiment
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Tests</p>
                                    <p className="text-2xl font-bold text-foreground">{tests.length}</p>
                                </div>
                                <FlaskConical className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Running</p>
                                    <p className="text-2xl font-bold text-success-400">
                                        {tests.filter(t => t.status === 'running').length}
                                    </p>
                                </div>
                                <Play className="w-8 h-8 text-success-400/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
                                    <p className="text-2xl font-bold text-primary-400">
                                        {tests.filter(t => t.status === 'completed').length}
                                    </p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-primary-400/30" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Draft</p>
                                    <p className="text-2xl font-bold text-muted-foreground">
                                        {tests.filter(t => t.status === 'draft').length}
                                    </p>
                                </div>
                                <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tests Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="col-span-2 text-center py-12 text-muted-foreground">
                            Loading experiments...
                        </div>
                    ) : tests.length === 0 ? (
                        <div className="col-span-2 text-center py-12">
                            <FlaskConical className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground">No experiments yet.</p>
                            <p className="text-sm text-muted-foreground/70">Create your first A/B test to start optimizing.</p>
                        </div>
                    ) : (
                        tests.map(test => (
                            <Card 
                                key={test.id} 
                                className={`border-border/50 hover:border-primary-500/30 transition-all cursor-pointer ${
                                    selectedTest?.id === test.id ? 'ring-2 ring-primary-500/50' : ''
                                }`}
                                onClick={() => setSelectedTest(test)}
                            >
                                <CardHeader className="pb-3 border-b border-border/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(test.status)}
                                            <Badge variant="outline" className="text-xs capitalize">
                                                {test.element}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            {test.status === 'draft' || test.status === 'paused' ? (
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 text-success-400 hover:text-success-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus.mutate({ id: test.id, status: 'running' });
                                                    }}
                                                >
                                                    <Play className="w-4 h-4" />
                                                </Button>
                                            ) : test.status === 'running' ? (
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 text-warning-400 hover:text-warning-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus.mutate({ id: test.id, status: 'paused' });
                                                    }}
                                                >
                                                    <Pause className="w-4 h-4" />
                                                </Button>
                                            ) : null}
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-8 w-8 text-danger-400 hover:text-danger-300"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Delete this test?')) {
                                                        deleteTest.mutate(test.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-foreground mb-2">{test.name}</h3>
                                    {test.description && (
                                        <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
                                    )}
                                    
                                    {/* Variants */}
                                    <div className="space-y-3">
                                        {test.variants.map((variant, idx) => {
                                            const stats = selectedTest?.id === test.id ? getVariantStats(variant.id) : null;
                                            const isWinner = selectedTest?.id === test.id && getWinningVariant(test) === variant.id;
                                            
                                            return (
                                                <div 
                                                    key={variant.id}
                                                    className={`relative p-3 rounded-lg border ${
                                                        isWinner 
                                                            ? 'border-success-500/30 bg-success-500/5' 
                                                            : 'border-border/50 bg-muted/5'
                                                    }`}
                                                >
                                                    {isWinner && (
                                                        <div className="absolute -right-2 -top-2 bg-success-500 text-white p-1 rounded-full">
                                                            <TrendingUp className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                            {variant.name}
                                                        </span>
                                                        {stats && (
                                                            <span className={`text-sm font-bold ${isWinner ? 'text-success-400' : 'text-muted-foreground'}`}>
                                                                {stats.ctr.toFixed(1)}% CTR
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-foreground line-clamp-2">{variant.content}</p>
                                                    {stats && (
                                                        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                                                            <span>{stats.impressions.toLocaleString()} impressions</span>
                                                            <span>{stats.conversions.toLocaleString()} conversions</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                                        <span>{test.traffic_split}% traffic</span>
                                        <span>Created {new Date(test.created_at).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* New Test Dialog */}
                <Dialog open={newTestOpen} onOpenChange={setNewTestOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FlaskConical className="w-5 h-5 text-secondary-500" />
                                Create New A/B Test
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Test Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Homepage CTA Button Test"
                                    value={formData.name}
                                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="What are you testing?"
                                    value={formData.description}
                                    onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Element Type</Label>
                                    <Select
                                        value={formData.element}
                                        onValueChange={(v: string) => setFormData(f => ({ ...f, element: v as ABTest['element'] }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="headline">Headline</SelectItem>
                                            <SelectItem value="cta">CTA Button</SelectItem>
                                            <SelectItem value="copy">Copy/Text</SelectItem>
                                            <SelectItem value="image">Image</SelectItem>
                                            <SelectItem value="layout">Layout</SelectItem>
                                            <SelectItem value="popup">Popup</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="traffic">Traffic Split (%)</Label>
                                    <Input
                                        id="traffic"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formData.trafficSplit}
                                        onChange={(e) => setFormData(f => ({ ...f, trafficSplit: parseInt(e.target.value) || 50 }))}
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="control">Control (A) Content</Label>
                                <Textarea
                                    id="control"
                                    placeholder="Original content to test against"
                                    value={formData.controlContent}
                                    onChange={(e) => setFormData(f => ({ ...f, controlContent: e.target.value }))}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="variant">Variant (B) Content</Label>
                                <Textarea
                                    id="variant"
                                    placeholder="New content to test"
                                    value={formData.variantContent}
                                    onChange={(e) => setFormData(f => ({ ...f, variantContent: e.target.value }))}
                                />
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setNewTestOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={() => createTest.mutate()}
                                disabled={!formData.name || !formData.controlContent || !formData.variantContent}
                                className="bg-secondary-600 hover:bg-secondary-700"
                            >
                                Create Test
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
