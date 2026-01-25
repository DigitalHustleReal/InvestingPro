
import { RichProduct } from '@/types/rich-product';

export interface SpendProfile {
    groceries: number;
    dining: number;
    travel: number;
    fuel: number;
    online: number;
    utilities: number;
    other: number;
}

export interface CardResult {
    card: RichProduct;
    totalRewardValue: number;
    netBenefit: number;
    breakdown: {
        category: string;
        points: number;
        value: number;
    }[];
}

/**
 * MOCK LOGIC for Wallet Optimization.
 * In production, this would parse the specific 'reward_matrix' JSON of each card.
 * For now, we use heuristics based on card names/types.
 */
export function calculateBestCards(profile: SpendProfile, allCards: RichProduct[]): CardResult[] {
    const results = allCards.map(card => {
        let totalPoints = 0;
        let totalCashbackValue = 0;
        const breakdown = [];

        // Normalize Card Data (Handling Generic Supabase Data)
        const name = card.name.toLowerCase();
        const features = JSON.stringify(card.features || {}).toLowerCase();
        
        // Fee Logic
        const annualFeeObj = card.specs?.annual_fee || card.features?.['Annual Fee'] || 0;
        const annualFee = typeof annualFeeObj === 'string' ? parseInt(annualFeeObj.replace(/[^0-9]/g, '')) || 0 : 0;

        // --- HEURISTIC REWARD CALCULATION ---
        
        // 1. Travel Cards (e.g. Atlas, Infinia, Regalia)
        if (name.includes('atlas') || name.includes('travel') || name.includes('miles')) {
            // High reward on Travel (e.g. 5%)
            const travelReward = profile.travel * 0.05;
            totalCashbackValue += travelReward;
            breakdown.push({ category: 'Travel', points: 0, value: travelReward });
            
            // Base reward (1%)
            const baseReward = (profile.dining + profile.groceries + profile.online + profile.other) * 0.01;
            totalCashbackValue += baseReward;
        } 
        // 2. Shopping/Online Cards (e.g. SBI Cashback, Flipkart Axis)
        else if (name.includes('cashback') || name.includes('flipkart') || name.includes('amazon') || name.includes('swiggy')) {
            // High reward on Online/Dining (e.g. 5%)
            const onlineReward = (profile.online + profile.dining) * 0.05;
            totalCashbackValue += onlineReward;
            breakdown.push({ category: 'Online & Dining', points: 0, value: onlineReward });
            
            // Base (1%)
            const baseReward = (profile.travel + profile.fuel + profile.other) * 0.01;
            totalCashbackValue += baseReward;
        }
        // 3. Fuel Cards
        else if (name.includes('fuel') || name.includes('ioc') || name.includes('bpcl')) {
            const fuelReward = profile.fuel * 0.04;
            totalCashbackValue += fuelReward;
             breakdown.push({ category: 'Fuel', points: 0, value: fuelReward });
             
             const baseReward = (profile.grocery + profile.other) * 0.005; // Lower base
             totalCashbackValue += baseReward;
        }
        // 4. Premium/General (Infinia, Emerald)
        else if (name.includes('infinia') || name.includes('emerald') || name.includes('gold')) {
             const flatReward = (profile.groceries + profile.dining + profile.travel + profile.online + profile.other) * 0.033; // ~3.3%
             totalCashbackValue += flatReward;
             breakdown.push({ category: 'All Spends', points: 0, value: flatReward });
        }
        // 5. Entry Level
        else {
            const flatReward = (profile.groceries + profile.dining + profile.travel + profile.online + profile.other) * 0.01; // 1%
            totalCashbackValue += flatReward;
        }

        return {
            card,
            totalRewardValue: Math.round(totalCashbackValue * 12), // Annualized
            netBenefit: Math.round((totalCashbackValue * 12) - annualFee),
            breakdown
        };
    });

    return results.sort((a, b) => b.netBenefit - a.netBenefit);
}
