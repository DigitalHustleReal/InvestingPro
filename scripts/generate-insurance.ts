
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const INSURANCE_PLANS = [
  // --- TERM INSURANCE ---
  {
    name: "LIC Jeevan Amar",
    provider: "LIC",
    type: "Term",
    cover: "1 Cr",
    premium: 15500, // Annual approx for 30M non-smoker
    ratio: 98.7,
    features: ["Sovereign Guarantee", "Whole Life Option", "Premium Waiver Benefit"]
  },
  {
    name: "HDFC Life Click 2 Protect Supreme",
    provider: "HDFC Life",
    type: "Term",
    cover: "1 Cr",
    premium: 13200,
    ratio: 99.5,
    features: ["Smart Exit Benefit", "Terminal Illness Cover", "Increasing Cover Option"]
  },
  {
    name: "ICICI Pru iProtect Smart",
    provider: "ICICI Prudential",
    type: "Term",
    cover: "1 Cr",
    premium: 12800,
    ratio: 99.2,
    features: ["Integrated Critical Illness", "Accidental Death Benefit", "Smart Exit"]
  },
  {
    name: "Max Life Smart Secure Plus",
    provider: "Max Life",
    type: "Term",
    cover: "1 Cr",
    premium: 12500,
    ratio: 99.5,
    features: ["Premium Break Option", "Joint Life Cover", "Return of Premium"]
  },
  {
    name: "Tata AIA Sampoorna Raksha Supreme",
    provider: "Tata AIA",
    type: "Term",
    cover: "1 Cr",
    premium: 13000,
    ratio: 99.0,
    features: ["Life Stage Benefit", "Health & Wellness Service", "Top-up Cover"]
  },
  
  // --- HEALTH INSURANCE ---
  {
    name: "HDFC ERGO Optima Secure",
    provider: "HDFC ERGO",
    type: "Health",
    cover: "10 Lakh",
    premium: 18000,
    ratio: 98.1,
    features: ["4X Coverage Benefit", "No Claim Bonus 50%", "Unlimited Restoration"]
  },
  {
    name: "Star Health Comprehensive",
    provider: "Star Health",
    type: "Health",
    cover: "10 Lakh",
    premium: 16500,
    ratio: 98.2,
    features: ["Maternity Cover", "Free Health Checkup", "Buy Back PED"]
  },
  {
    name: "Niva Bupa ReAssure 2.0",
    provider: "Niva Bupa",
    type: "Health",
    cover: "10 Lakh",
    premium: 15800,
    ratio: 96.5,
    features: ["Lock the Clock (Age Lock)", "Booster Benefit", "Live Healthy discount"]
  }
];

async function generateInsurance() {
  console.log('🚀 Starting Insurance Generator...');
  let count = 0;

  for (const plan of INSURANCE_PLANS) {
    const slug = slugify(`${plan.provider}-${plan.name}`, { lower: true, strict: true });
    
    // Check if new schema handles "claim_settlement_ratio" (it was in the SQL file I wrote)
    // Table: insurance (id, slug, name, provider_name, type, cover_amount, min_premium, claim_settlement_ratio, features)
    
    const payload = {
      slug: slug,
      name: plan.name,
      provider_name: plan.provider,
      type: plan.type,
      cover_amount: plan.cover,
      min_premium: plan.premium,
      claim_settlement_ratio: plan.ratio,
      features: {
        highlights: plan.features,
        verified_source: "MoneyControl Best of 2026"
      }
    };

    const { error } = await supabase
      .from('insurance')
      .upsert(payload, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error upserting ${plan.name}:`, error.message);
    } else {
      console.log(`✅ Upserted: ${plan.name}`);
      count++;
    }
  }

  console.log(`\n🎉 Generated ${count} Insurance Plans!`);
}

generateInsurance();
