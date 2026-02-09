"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from '@/lib/api-client';
import { logger } from "@/lib/logger";
import SEOHead from "@/components/common/SEOHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AddHoldingDialog from "@/components/portfolio/AddHoldingDialog";
import PortfolioSummary from "@/components/portfolio/PortfolioSummary";
import AssetAllocation from "@/components/portfolio/AssetAllocation";
import HoldingsList from "@/components/portfolio/HoldingsList";
import RiskAnalysis from "@/components/portfolio/RiskAnalysis";
import { TrendingUp, Activity, ShieldCheck, Zap, Briefcase } from "lucide-react";

export default function PortfolioPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Only run on client side to avoid hydration issues
        if (typeof window !== 'undefined') {
            loadUser();
        }
    }, []);

    const loadUser = async () => {
        try {
            const userData = await api.auth.me();
            if (!userData) {
                // Use router instead of window.location to avoid hydration issues
                router.push('/');
                return;
            }
            setUser(userData);
        } catch (error) {
            // Silently handle auth errors - allow page to render gracefully
            logger.error('Failed to load user in portfolio page', error as Error);
        } finally {
            setLoading(false);
        }
    };

    const { data: allHoldings = [] } = useQuery({
        queryKey: ['portfolio', user?.email],
        queryFn: () => api.entities.Portfolio.list(),
        enabled: !!user?.email
    });
    
    // Ensure allHoldings is always an array before filtering
    const safeHoldings = Array.isArray(allHoldings) ? allHoldings : [];
    const holdings = safeHoldings.filter((h: any) => h.user_email === user?.email);

    const addHoldingMutation = useMutation({
        mutationFn: (holding) => api.entities.Portfolio.create(holding),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
        }
    });

    const deleteHoldingMutation = useMutation({
        mutationFn: (id: string) => api.entities.Portfolio.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <LoadingSpinner text="Decrypting Private Ledger..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <SEOHead
                title="Institutional Grade Portfolio Tracker | InvestingPro"
                description="Monitor your investments with high-fidelity analytics, risk profiling, and real-time performance tracking."
            />

            {/* Authority Hero Section */}
            <div className="bg-slate-900 border-b border-white/5 pt-28 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[140px] -translate-y-1/2" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary-600 rounded-full blur-[100px] translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-secondary-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-secondary-500/20">
                                <ShieldCheck className="w-4 h-4 text-secondary-400" />
                                <span className="text-secondary-400 font-semibold text- uppercase tracking-[0.2em]">AES-256 Vault Protection</span>
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
                                Capital <span className="text-secondary-400">Headquarters</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                                Strategic overview of your global investment positions. Real-time benchmarking against India VIX and Nifty 50.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <AddHoldingDialog
                                onAdd={(holding) => addHoldingMutation.mutate(holding)}
                                user={user}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                        {[
                            { icon: Activity, label: "Live Pulse", value: "Real-time" },
                            { icon: Zap, label: "Execution", value: "Instant" },
                            { icon: Briefcase, label: "Verified", value: "Institutional" },
                            { icon: TrendingUp, label: "Alpha", value: "Calculated" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 group hover:border-secondary-500/50 transition-colors">
                                <item.icon className="w-5 h-5 text-secondary-400 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-st leading-none mb-1">{item.label}</p>
                                    <p className="text-sm font-bold text-white">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <PortfolioSummary holdings={holdings} />

                    {/* Charts & Analysis */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        <AssetAllocation holdings={holdings} />
                        <RiskAnalysis holdings={holdings} user={user} />
                    </div>

                    {/* Holdings List */}
                    <HoldingsList
                        holdings={holdings}
                        onDelete={(id: string) => deleteHoldingMutation.mutate(id)}
                    />
                </div>
            </div>
        </div>
    );
}
