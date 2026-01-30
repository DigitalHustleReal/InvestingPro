import { createServiceClient } from '../../lib/supabase/service';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const VERIFIED_INSURANCE = [
  // --- LIFE INSURANCE (TERM) ---
  {
    name: "ICICI Pru iProtect Smart",
    category: "insurance",
    source_url: "https://www.iciciprulife.com/term-insurance-plans/iprotect-smart-term-insurance-calculator.html",
    key_features: [
      "Life cover up to 99 years",
      "Critical illness cover for 34 critical illnesses",
      "Accidental death benefit"
    ],
    fees: {
       min_premium: "₹450/month (approx)",
       policy_term: "Up to 99 years"
    },
    rates: {
       claim_settlement_ratio: "99.17% (FY23-24)",
       solvency_ratio: "196%"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "HDFC Life Click 2 Protect Super",
    category: "insurance",
    source_url: "https://www.hdfclife.com/term-insurance-plans/click-2-protect-super",
    key_features: [
      "Flexibility to choose plan option",
      "Return of Premium option available",
      "Smart Exit Benefit"
    ],
    fees: {
       min_premium: "Varies significantly by age/smoker status",
       policy_term: "Up to 85 years"
    },
    rates: {
       claim_settlement_ratio: "99.30% (FY23-24)",
       solvency_ratio: "203%"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "Max Life Smart Secure Plus",
    category: "insurance",
    source_url: "https://www.maxlifeinsurance.com/term-insurance-plans/smart-secure-plus-plan",
    key_features: [
      "Return of Premium Option",
      "Terminal Illness Cover",
      "Joint Life option"
    ],
    fees: {
       min_premium: "Competitive market rates",
       policy_term: "Up to 85 years"
    },
    rates: {
       claim_settlement_ratio: "99.51% (FY23-24)",
       solvency_ratio: "190%"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  // --- HEALTH INSURANCE ---
  {
    name: "Star Health Optima Insurance Plan",
    category: "insurance",
    source_url: "https://www.starhealth.in/health-insurance/family-health-optima-insurance-plan",
    key_features: [
      "Auto Restoration of Basic Sum Insured 3 times a year",
      "No Claim Bonus for every claim-free year",
      "Coverage for Assisted Reproduction Treatment"
    ],
    fees: {
       min_premium: "Based on age and zone",
       min_sum_insured: "₹3 Lakhs",
       max_sum_insured: "₹25 Lakhs"
    },
    rates: {
       claim_settlement_ratio: "90% (Approx)",
       incurred_claims_ratio: "65%"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "Niva Bupa ReAssure 2.0",
    category: "insurance",
    source_url: "https://www.nivabupa.com/health-insurance-plans/reassure-2-0-plan.html",
    key_features: [
      "ReAssure Forever: Unlimited sum insured restoration",
      "Lock the Clock: Premium based on entry age until claim",
      "Booster+: Unused base sum insured carries forward"
    ],
    fees: {
       min_premium: "Market standard",
       min_sum_insured: "₹5 Lakhs",
       max_sum_insured: "₹1 Crore"
    },
    rates: {
       claim_settlement_ratio: "91.6%",
       incurred_claims_ratio: "54%"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  }
];

async function seedVerifiedInsurance() {
    console.log('🌱 Starting Verified Insurance Seeding...');
    console.log(`📋 Found ${VERIFIED_INSURANCE.length} verified policies to seed.`);

    const supabase = createServiceClient();

    for (const policy of VERIFIED_INSURANCE) {
        const payload = {
            name: policy.name,
            slug: policy.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            category: policy.category,
            provider_name: policy.name.split(' ')[0],
            official_link: policy.source_url,
            tags: [policy.category.toLowerCase().includes('health') ? 'health' : (policy.category.toLowerCase().includes('term') ? 'term' : 'life')],
            features: policy.key_features,
            verification_notes: JSON.stringify({
                fees: policy.fees,
                rates: policy.rates,
                verification_source: "manual_verified_seed",
                verified_at: new Date().toISOString()
            }),
            verification_status: 'verified',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('name', policy.name)
            .single();

        let error;
        if (existing) {
            console.log(`🔄 Updating existing policy: ${policy.name}`);
            const { error: updateError } = await supabase
                .from('products')
                .update({ 
                    features: payload.features,
                    verification_notes: payload.verification_notes,
                    verification_status: payload.verification_status,
                    official_link: payload.official_link,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);
            error = updateError;
        } else {
            console.log(`✨ Creating new policy: ${policy.name}`);
            const { error: insertError } = await supabase
                .from('products')
                .insert(payload);
            error = insertError;
        }

        if (error) {
            console.error(`❌ Failed to process ${policy.name}:`, error.message);
        } else {
            console.log(`✅ Successfully synced: ${policy.name}`);
        }
    }
    
    console.log('🏁 Verified Insurance Seeding Complete.');
}

seedVerifiedInsurance().catch(console.error);
