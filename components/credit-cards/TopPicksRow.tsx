"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Trophy, Plane, ShoppingBag, Check } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import { apiClient as api } from '@/lib/api-client';

export default function TopPicksRow() {
    const [winners, setWinners] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchWinners = async () => {
            try {
                // Fetch all cards and pick winners based on logic (e.g. rating or specific flags)
                // In a real CMS, we'd query .eq('is_editor_choice', true)
                const cards = await api.entities.CreditCard.list();
                
                // Simulate "Winner Selection" logic from the raw data
                const bestOverall = cards.find((c: any) => c.rating >= 4.8) || cards[0];
                const bestTravel = cards.find((c: any) => c.type === 'travel' && c.rating >= 4.5) || cards[1];
                const bestCashback = cards.find((c: any) => c.type === 'cashback') || cards[2];

                if (bestOverall) {
                    setWinners([
                        {
                            id: bestOverall.id,
                            title: "Editors' Choice",
                            cardName: bestOverall.name,
                            image: bestOverall.image_url,
                            badge: "Best Overall",
                            badgeColor: "bg-blue-600",
                            icon: Trophy,
                            benefits: bestOverall.features?.slice(0, 3) || ["Great Rewards", "Low Fee"],
                            fee: bestOverall.annualFee
                        },
                        {
                            id: bestTravel?.id || 'travel',
                            title: "Best for Travel",
                            cardName: bestTravel?.name || "Travel Elite",
                            image: bestTravel?.image_url,
                            badge: "Travel Winner",
                            badgeColor: "bg-purple-600",
                            icon: Plane,
                            benefits: bestTravel?.features?.slice(0, 3) || ["Lounge Access", "Air Miles"],
                            fee: bestTravel?.annualFee || "₹499"
                        },
                        {
                            id: bestCashback?.id || 'cashback',
                            title: "Best Cashback",
                            cardName: bestCashback?.name || "Cashback King",
                            image: bestCashback?.image_url,
                            badge: "5% Unlimited",
                            badgeColor: "bg-green-600",
                            icon: ShoppingBag,
                            benefits: bestCashback?.features?.slice(0, 3) || ["Cashback", "Discounts"],
                            fee: bestCashback?.annualFee || "₹0"
                        }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch winners", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWinners();
    }, []);

    if (loading) return <div className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl mb-12"></div>;
    if (winners.length === 0) return null;

    return (
        <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Editors' Top Picks <span className="text-slate-600 font-medium text-lg ml-2">January 2026</span>
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {winners.map((card, idx) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-slate-200 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-500" />
                        <div className="relative h-full bg-white dark:bg-slate-900 rounded-[1.75rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-xl transition-all duration-300 flex flex-col">
                            
                            {/* Header Badge */}
                            <div className={`absolute top-0 right-0 ${card.badgeColor} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-bl-xl rounded-tr-[1.75rem]`}>
                                {card.badge}
                            </div>
                            
                            {/* Card Image Placeholder */}
                            <div className="h-32 mb-4 relative flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                {card.image ? (
                                    <img src={card.image} alt={card.cardName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-40 h-24 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg rotate-[-5deg] flex items-center justify-center text-white font-bold opacity-90">
                                        {card.cardName}
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                {card.cardName}
                            </h3>
                            <div className="text-xs font-semibold text-slate-500 mb-4">
                                Fee: <span className="text-slate-900 dark:text-white">{card.fee}</span>
                            </div>
                            
                            <ul className="space-y-2 mb-6 flex-1">
                                {card.benefits.map((benefit: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                        <Check className="w-3.5 h-3.5 text-success-500 mt-0.5 shrink-0" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                            
                            <Link href={`/credit-cards/${card.id}`} className="w-full">
                                <Button size="sm" className="w-full rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary-600 dark:hover:bg-primary-400 dark:hover:text-white transition-colors">
                                    Apply Now
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
