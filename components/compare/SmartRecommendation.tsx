import { RichProduct } from "@/types/rich-product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Crown, ShieldCheck, Star, Sparkles, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface SmartRecommendationProps {
    products: RichProduct[];
}

export function SmartRecommendation({ products }: SmartRecommendationProps) {
    if (products.length < 2) return null;

    // Scoring Logic
    const scores = products.map(p => {
        const trustScore = p.rating.trust_score || 0;
        const ratingScore = (p.rating.overall || 0) * 20; // Convert 5 scale to 100
        const featureScore = Math.min((p.key_features?.length || 0) * 10, 100); // Cap at 10 features

        // Weighted Score: 40% Trust, 30% Rating, 30% Features
        const total = (trustScore * 0.4) + (ratingScore * 0.3) + (featureScore * 0.3);
        
        return {
            id: p.id,
            total,
            trustScore,
            ratingScore
        };
    });

    // Find Winner
    const winnerId = scores.reduce((prev, current) => (prev.total > current.total) ? prev : current).id;
    const winner = products.find(p => p.id === winnerId);
    if (!winner) return null;

    // Determine why it's the best
    const reasons = [];
    if (winner.rating.trust_score >= 90) reasons.push({ icon: ShieldCheck, text: `Highest trust score (${winner.rating.trust_score}/100)` });
    if (winner.rating.overall >= 4.5) reasons.push({ icon: Star, text: `Excellent rating (${winner.rating.overall}/5)` });
    if (winner.key_features && winner.key_features.length >= 5) reasons.push({ icon: CheckCircle, text: `Comprehensive features (${winner.key_features.length})` });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-yellow-900/10 dark:via-slate-900 dark:to-orange-900/10 p-8 mb-8 border-2 border-accent-200 dark:border-accent-800/50 shadow-xl"
        >
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50"
                    >
                        <Sparkles className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            AI Recommendation
                            <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0 text-xs">
                                SMART PICK
                            </Badge>
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Based on your comparison</p>
                    </div>
                </div>

                {/* Winner Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-2xl border-2 border-accent-200 dark:border-accent-800/50">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Product Image */}
                        {winner.image_url && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-accent-500/30 rounded-xl blur-xl" />
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-xl ring-4 ring-yellow-200 dark:ring-yellow-800">
                                    <Image
                                        src={winner.image_url}
                                        alt={winner.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>
                                {/* Trophy Badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.4 }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                        <Crown className="w-4 h-4 text-white fill-white" />
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Product Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h4 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                                {winner.name}
                            </h4>
                            <div className="flex items-center justify-center sm:justify-start gap-4 mb-3">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-accent-400" />
                                    <span className="font-bold text-lg">{winner.rating.overall.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="w-5 h-5 text-primary-600" />
                                    <span className="font-bold text-lg text-primary-600">{winner.rating.trust_score}</span>
                                </div>
                            </div>

                            {/* Why it's best */}
                            {reasons.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Why it's the best:</p>
                                    {reasons.map((reason, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + idx * 0.1 }}
                                            className="flex items-center gap-2"
                                        >
                                            <reason.icon className="w-4 h-4 text-success-600 dark:text-success-400" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{reason.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* CTA */}
                            <Button
                                className="w-full sm:w-auto bg-gradient-to-r from-success-600 to-success-600 hover:from-success-700 hover:to-success-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                                asChild
                            >
                                <Link href={`/go/${winner.slug}`} target="_blank">
                                    Apply for {winner.name}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
