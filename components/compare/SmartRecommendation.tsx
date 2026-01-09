import { RichProduct } from "@/types/rich-product";
import { Badge } from "@/components/ui/badge";
import { Crown, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-primary-100 dark:border-primary-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-md ring-4 ring-primary-100 dark:ring-primary-900/50">
                    <Crown className="w-8 h-8 text-primary-500 fill-emerald-500" />
                </div>
                <div className="absolute -bottom-2 w-full text-center">
                    <Badge variant="default" className="bg-primary-600 text-[10px] px-2 py-0.5 pointer-events-none">
                        WINNER
                    </Badge>
                </div>
            </div>

            <div className="flex-grow text-center md:text-left">
                <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">
                    Smart Recommendation
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                    {winner.name}
                    {winner.rating.trust_score >= 90 && (
                        <ShieldCheck className="w-5 h-5 text-primary-500" />
                    )}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    Based on our analysis, this product offers the best balance of 
                    <span className="font-semibold text-slate-800 dark:text-slate-200"> Trust ({winner.rating.trust_score})</span>, 
                    <span className="font-semibold text-slate-800 dark:text-slate-200"> User Ratings ({winner.rating.overall}/5)</span>, 
                    and Feature coverage.
                </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-4 border-t md:border-t-0 md:border-l border-primary-200 dark:border-primary-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-center md:justify-start">
                <div className="text-center">
                    <div className="text-2xl font-black text-primary-600 dark:text-primary-400">
                        {winner.rating.trust_score}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-primary-700/60 dark:text-primary-500/60">
                        Trust Score
                    </div>
                </div>
                <div className="w-px h-10 bg-primary-200 dark:bg-primary-800"></div>
                <div className="text-center">
                    <div className="text-2xl font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        {winner.rating.overall} <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">
                        User Rating
                    </div>
                </div>
            </div>
        </div>
    );
}
