"use client";

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, Building2, ArrowRight, Heart, LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { apiClient as api } from '@/lib/api-client';
import { InsuranceFilterSidebar, InsuranceFilterState } from "@/components/insurance/FilterSidebar";
import { ResponsiveFilterContainer } from '@/components/products/ResponsiveFilterContainer';

function csrBadge(csr: number | string) {
    const val = typeof csr === 'string' ? parseFloat(csr) : csr;
    if (!val || isNaN(val)) return { label: 'N/A', class: 'bg-gray-100 text-gray-500' };
    if (val >= 98) return { label: `${val}% Excellent`, class: 'bg-green-50 text-green-700' };
    if (val >= 95) return { label: `${val}% Good`, class: 'bg-green-50 text-green-600' };
    if (val >= 90) return { label: `${val}% Fair`, class: 'bg-amber-50 text-amber-700' };
    return { label: `${val}% Poor`, class: 'bg-red-50 text-red-600' };
}

export default function InsuranceClient() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
    const [policyType, setPolicyType] = useState<string>('all');
    const [familyType, setFamilyType] = useState<string>('self');
    const [minCSR, setMinCSR] = useState(0);
    const [visibleCount, setVisibleCount] = useState(6);
    const [sortKey, setSortKey] = useState<string>('csr');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const toggleSort = (k: string) => { if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc'); else { setSortKey(k); setSortDir('desc'); } };
    const SH = ({ label, k }: { label: string; k: string }) => (<button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 cursor-pointer hover:text-green-700 transition-colors">{label}<ArrowUpDown size={10} className={sortKey === k ? 'text-green-600' : 'text-gray-300'} /></button>);

    const [filters, setFilters] = useState<InsuranceFilterState>({
        maxPremium: 50000, minCover: 5000000, insurers: [], policyTypes: [],
    });
    const activeFiltersCount = (filters.insurers.length > 0 ? 1 : 0) + (filters.policyTypes.length > 0 ? 1 : 0);

    useEffect(() => {
        (async () => {
            try {
                const data = await api.entities.Insurance?.list() || [];
                setAssets(Array.isArray(data) ? data : (data as any)?.data || []);
            } catch { setAssets([]); }
            finally { setLoading(false); }
        })();
    }, []);

    const filtered = assets.filter((a) => {
        const name = (a.name || '').toLowerCase();
        const provider = (a.provider_name || a.providerName || '').toLowerCase();
        const searchMatch = name.includes(searchTerm.toLowerCase()) || provider.includes(searchTerm.toLowerCase());
        const typeMatch = policyType === 'all' || (a.category || a.type || '').toLowerCase().includes(policyType);
        const csrVal = parseFloat(a.specs?.claimRatio || a.claimSettlementRatio || '0');
        const csrMatch = csrVal >= minCSR || minCSR === 0;
        const insurerMatch = filters.insurers.length === 0 || filters.insurers.some((i: string) => provider.includes(i.toLowerCase()));
        const sidebarTypeMatch = filters.policyTypes.length === 0 || filters.policyTypes.some((t: string) => (a.category || a.type || '').toLowerCase().includes(t.toLowerCase()));
        return searchMatch && typeMatch && csrMatch && insurerMatch && sidebarTypeMatch;
    });

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            <ResponsiveFilterContainer activeFiltersCount={activeFiltersCount}>
                <InsuranceFilterSidebar filters={filters} setFilters={setFilters} />
            </ResponsiveFilterContainer>

            <div className="flex-1 w-full space-y-4">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search insurers..." className="pl-10 h-11 bg-white border-gray-200 rounded-lg text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search insurance" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <select value={policyType} onChange={(e) => setPolicyType(e.target.value)} aria-label="Policy type" className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer">
                            <option value="all">All Types</option>
                            <option value="term">Term Life</option>
                            <option value="health">Health</option>
                            <option value="life">Life</option>
                            <option value="car">Car</option>
                            <option value="travel">Travel</option>
                        </select>
                        <select value={familyType} onChange={(e) => setFamilyType(e.target.value)} aria-label="Family" className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer">
                            <option value="self">Self</option>
                            <option value="self-spouse">Self + Spouse</option>
                            <option value="family">Family</option>
                            <option value="parents">Parents</option>
                        </select>
                        <select value={minCSR} onChange={(e) => setMinCSR(Number(e.target.value))} aria-label="Min CSR" className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer">
                            <option value={0}>Any CSR</option>
                            <option value={95}>95%+</option>
                            <option value={98}>98%+</option>
                        </select>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                            <button onClick={() => setViewMode('table')} aria-pressed={viewMode === 'table'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'table' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><List className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} className={`p-2 rounded-md transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}><LayoutGrid className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>


                {loading ? (
                    <div className="py-16 text-center"><div className="inline-flex items-center gap-2 text-sm text-gray-500"><div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />Loading plans...</div></div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-xl border border-gray-200"><p className="text-gray-500">No plans match your filters.</p></div>
                ) : viewMode === 'table' ? (
                    /* ── Table view ── */
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Plan" k="name" /></th>
                                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="Premium" k="premium" /></th>
                                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Cover</th>
                                <th className="text-center px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"><SH label="CSR" k="csr" /></th>
                                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Network</th>
                                <th className="text-right px-3 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Claim Speed</th>
                                <th className="text-right px-4 py-3" />
                            </tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.slice(0, visibleCount).map((plan: any) => {
                                    const csr = csrBadge(plan.specs?.claimRatio || plan.claimSettlementRatio || 0);
                                    return (
                                        <tr key={plan.id || plan.slug} className="hover:bg-green-50/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <Link href={`/insurance/${plan.slug || plan.id}`} className="group">
                                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{plan.name}</p>
                                                    <p className="text-[11px] text-gray-500">{plan.provider_name || plan.providerName} · {plan.category || plan.type || 'Health'}</p>
                                                </Link>
                                            </td>
                                            <td className="px-3 py-3 text-right"><span className="text-sm font-bold text-gray-900 tabular-nums">{plan.specs?.premium || plan.premium || 'Quote'}</span></td>
                                            <td className="px-3 py-3 text-right"><span className="text-sm font-semibold text-gray-900">{plan.specs?.coverAmount || plan.coverAmount || 'N/A'}</span></td>
                                            <td className="px-3 py-3 text-center"><Badge className={`text-[9px] font-bold ${csr.class}`}>{csr.label}</Badge></td>
                                            <td className="px-3 py-3 text-right"><span className="text-sm text-gray-700">{plan.specs?.networkHospitals || '10,000+'}</span></td>
                                            <td className="px-3 py-3 text-right"><span className="text-sm text-gray-700">{plan.specs?.claimSpeed || '5-7 days'}</span></td>
                                            <td className="px-4 py-3 text-right"><Link href={`/insurance/${plan.slug || plan.id}`} className="text-xs font-medium text-green-600 hover:text-green-700">Details →</Link></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* ── Grid view ── */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filtered.slice(0, visibleCount).map((plan: any) => {
                            const csr = csrBadge(plan.specs?.claimRatio || plan.claimSettlementRatio || 0);
                            return (
                                <Link key={plan.id || plan.slug} href={`/insurance/${plan.slug || plan.id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-sm transition-all group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors leading-tight">{plan.name}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{plan.provider_name || plan.providerName}</p>
                                        </div>
                                        <Badge className="text-[9px] bg-teal-50 text-teal-700 border-teal-200">{plan.category || plan.type || 'Health'}</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                                        <div><p className="text-[9px] text-gray-400 uppercase font-medium">Premium</p><p className="text-sm font-bold text-gray-900">{plan.specs?.premium || plan.premium || 'Get Quote'}<span className="text-[10px] font-normal text-gray-500">/yr</span></p></div>
                                        <div><p className="text-[9px] text-gray-400 uppercase font-medium">Cover</p><p className="text-sm font-bold text-gray-900">{plan.specs?.coverAmount || plan.coverAmount || '₹10L - ₹1Cr'}</p></div>
                                        <div><p className="text-[9px] text-gray-400 uppercase font-medium">Network</p><p className="text-sm font-semibold text-gray-900 flex items-center gap-1"><Building2 size={12} className="text-green-600" />{plan.specs?.networkHospitals || '10,000+'}</p></div>
                                        <div><p className="text-[9px] text-gray-400 uppercase font-medium">Room Limit</p><p className="text-sm font-semibold text-gray-900">{plan.specs?.roomRentLimit || 'No limit'}</p></div>
                                    </div>
                                    <div className="flex items-center gap-3 mb-3 p-2.5 bg-gray-50 rounded-lg">
                                        <div className="flex-1"><p className="text-[9px] text-gray-400 uppercase font-medium">CSR</p><Badge className={`text-[10px] font-bold mt-0.5 ${csr.class}`}><CheckCircle size={10} className="mr-1" />{csr.label}</Badge></div>
                                        <div className="flex-1"><p className="text-[9px] text-gray-400 uppercase font-medium">Claim Speed</p><p className="text-xs font-semibold text-gray-900 flex items-center gap-1 mt-0.5"><Clock size={10} className="text-green-600" />{plan.specs?.claimSpeed || '5-7 days'}</p></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {plan.specs?.waitingPeriod && <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">Waiting: {plan.specs.waitingPeriod}</span>}
                                        {(plan.specs?.coPayment === '0%' || plan.specs?.coPayment === 0) ? <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-medium">0% Co-pay</span> : plan.specs?.coPayment ? <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{plan.specs.coPayment} Co-pay</span> : null}
                                        {plan.specs?.noClaimBonus && <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-medium"><Heart size={9} className="inline mr-0.5" />NCB: {plan.specs.noClaimBonus}</span>}
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <p className="text-[11px] text-gray-500">Tax benefit u/s 80D</p>
                                        <span className="text-[11px] text-green-600 font-medium group-hover:underline flex items-center gap-0.5">View Plan <ArrowRight size={10} /></span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {filtered.length > visibleCount && (
                    <div className="pt-6 text-center">
                        <button onClick={() => setVisibleCount(p => p + 6)} className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors cursor-pointer">
                            Show more
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
