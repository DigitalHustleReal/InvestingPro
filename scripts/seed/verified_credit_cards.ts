import { createServiceClient } from '../../lib/supabase/service';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const VERIFIED_CARDS = [
  // --- HDFC BANK ---
  {
    name: "HDFC Regalia Gold Credit Card",
    category: "credit_cards",
    source_url: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card",
    key_features: [
      "Complimentary Club Vistara Silver Tier and M&S Voucher on spend of Rs. 1 Lakh",
      "5X Reward Points on Myntra, Nykaa, M&S, Reliance Digital",
      "12 Complimentary Airport Lounge Access within India and 6 outside India (via Priority Pass)",
      "Good for: Premium Lifestyle & Travel"
    ],
    // Verified Data
    fees: {
       annual_fee: 2500,
       joining_fee: 2500,
       renewal_fee_waiver: 400000 // Spends > 4L waives fee
    },
    rates: {
       interest_rate: "3.6% per month (43.2% annually)",
       rewards_rate: "4 Reward Points on every Rs. 150 spent"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "HDFC Millennia Credit Card",
    category: "credit_cards",
    source_url: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card",
    key_features: [
      "5% CashBack on Amazon, Flipkart, BookMyShow, Cult.fit, Myntra, Sony LIV, Swiggy, Tata CLiQ, Uber and Zomato",
      "1% Fuel Surcharge waiver",
      "8 Complimentary Domestic Airport Lounge access per year",
      "Good for: Online Shopping & Cashback"
    ],
    fees: {
       annual_fee: 1000,
       joining_fee: 1000,
       renewal_fee_waiver: 100000
    },
    rates: {
       interest_rate: "3.6% per month (43.2% annually)",
       rewards_rate: "5% Cashback on 10 merchant partners"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  // --- SBI CARD ---
  {
    name: "SBI Cashback Credit Card",
    category: "credit_cards",
    source_url: "https://www.sbicard.com/en/personal/credit-cards/rewards/cashback-sbi-card.page",
    key_features: [
      "5% Cashback on online spends without any merchant restriction",
      "1% Cashback on offline spends",
      "Auto-credit of cashback to statement",
      "Good for: Universal Online Shopping"
    ],
    fees: {
       annual_fee: 999,
       joining_fee: 999,
       renewal_fee_waiver: 200000
    },
    rates: {
       interest_rate: "3.5% per month (42% annually)",
       rewards_rate: "5% on online spends"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "SBI SimplyClick Credit Card",
    category: "credit_cards",
    source_url: "https://www.sbicard.com/en/personal/credit-cards/shopping/simplyclick-sbi-card.page",
    key_features: [
      "10X Reward Points on Amazon / BookMyShow / Cleartrip / Lenskart / Netmeds",
      "Amazon gift card worth Rs. 500 on joining",
      "Good for: Entry level online shopping"
    ],
    fees: {
       annual_fee: 499,
       joining_fee: 499,
       renewal_fee_waiver: 100000
    },
    rates: {
       interest_rate: "3.5% per month (42% annually)",
       rewards_rate: "10X Rewards on exclusive partners"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  // --- AXIS BANK ---
  {
    name: "Axis Bank Ace Credit Card",
    category: "credit_cards",
    source_url: "https://www.axisbank.com/retail/cards/credit-card/ace-credit-card",
    key_features: [
      "5% Unlimited Cashback on Google Pay bill payments",
      "4% Unlimited Cashback on Swiggy, Zomato, Ola",
      "2% Unlimited Cashback on all other spends",
      "Good for: Utility Bills & Daily Spends"
    ],
    fees: {
       annual_fee: 499,
       joining_fee: 499,
       renewal_fee_waiver: 200000
    },
    rates: {
       interest_rate: "3.6% per month (52.86% annually)",
       rewards_rate: "5% Flat Cashback on Bills"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "Flipkart Axis Bank Credit Card",
    category: "credit_cards",
    source_url: "https://www.axisbank.com/retail/cards/credit-card/flipkart-axisbank-credit-card",
    key_features: [
      "5% Unlimited Cashback on Flipkart",
      "4% Cashback on Preferred Merchants (Cleartrip, cult.fit, PVR, Swiggy, Uber)",
      "1.5% Unlimited Cashback on other spends",
      "Good for: Flipkart Shoppers"
    ],
    fees: {
       annual_fee: 500,
       joining_fee: 500,
       renewal_fee_waiver: 350000
    },
    rates: {
       interest_rate: "3.6% per month (52.86% annually)",
       rewards_rate: "5% Cashback on Flipkart"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  // --- ICICI BANK ---
  {
    name: "Amazon Pay ICICI Bank Credit Card",
    category: "credit_cards",
    source_url: "https://www.icicibank.com/personal-banking/cards/credit-card/amazon-pay-credit-card",
    key_features: [
      "Lifetime Free Credit Card",
      "5% Cashback on Amazon for Prime members (3% for non-Prime)",
      "2% Cashback on Amazon Pay partner merchants",
      "1% Cashback on all other payments",
      "Good for: Amazon Users (LTF)"
    ],
    fees: {
       annual_fee: 0,
       joining_fee: 0,
       renewal_fee_waiver: 0
    },
    rates: {
       interest_rate: "3.5% - 3.8% per month",
       rewards_rate: "5% Amazon Pay Balance"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "ICICI Bank Platinum Chip Credit Card",
    category: "credit_cards",
    source_url: "https://www.icicibank.com/personal-banking/cards/credit-card/platinum-chip-card",
    key_features: [
      "Lifetime Free",
      "Earn 2 PAYBACK points on every Rs. 100 spent (Retail)",
      "Good for: Basic usage, building credit history"
    ],
    fees: {
       annual_fee: 0,
       joining_fee: 0,
       renewal_fee_waiver: 0
    },
    rates: {
       interest_rate: "3.4% per month (40.8% annually)",
       rewards_rate: "2 Points per Rs 100"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  // --- IDFC FIRST ---
  {
    name: "IDFC FIRST Millennia Credit Card",
    category: "credit_cards",
    source_url: "https://www.idfcfirstbank.com/credit-card/millennia",
    key_features: [
      "Lifetime Free",
      "10X Reward Points on spends > Rs 20,000/month",
      "6X on Online spends, 3X on Offline",
      "Interest free cash withdrawal up to 48 days",
      "Good for: Lifetime Free with high rewards"
    ],
    fees: {
       annual_fee: 0,
       joining_fee: 0,
       renewal_fee_waiver: 0
    },
    rates: {
       interest_rate: "0.75% - 3.5% per month (Dynamic)",
       rewards_rate: "Up to 10X Rewards"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  }
];

async function seedVerifiedCreditCards() {
    console.log('🌱 Starting Verified Credit Card Seeding...');
    console.log(`📋 Found ${VERIFIED_CARDS.length} verified cards to seed.`);

    const supabase = createServiceClient();

    for (const card of VERIFIED_CARDS) {
        // Upsert by name to prevent duplicates
        // Note: In a real app, we'd use a slug or unique code. Here we use name for simplicity.
        
        // 1. Construct the payload matching the DB schema
        // Merging fees and rates into the 'key_fields' JSONB column if specific columns don't exist
        // or mapping to specific columns if they do.
        // Assuming 'key_fields' stores the flexible data for now based on previous audits.
        
        const payload = {
            name: card.name,
            slug: card.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            category: 'credit_card',
            provider_name: card.name.split(' ')[0], // Heuristic: "HDFC", "SBI", "Axis"
            official_link: card.source_url,
            tags: ['travel', 'rewards', 'shopping', 'cashback'], // Generic tags for now to ensure visibility in all subcats
            features: card.key_features, // MAP to 'features' column
            // Store structured data in verification_notes as JSON string since key_fields is missing
            verification_notes: JSON.stringify({
                fees: card.fees,
                rates: card.rates,
                verification_source: "manual_verified_seed",
                verified_at: new Date().toISOString()
            }),
            verification_status: 'verified', // Set status to verified
            
            // Helpful metadata
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Try to insert/update
        const { data: existing } = await supabase
            .from('products') 
            .select('id')
            .eq('name', card.name)
            .single();

        let error;
        if (existing) {
            // Update
            console.log(`🔄 Updating existing card: ${card.name}`);
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
            // Insert
            console.log(`✨ Creating new card: ${card.name}`);
            const { error: insertError } = await supabase
                .from('products')
                .insert(payload);
            error = insertError;
        }

        if (error) {
            console.error(`❌ Failed to process ${card.name}:`, error.message);
        } else {
            console.log(`✅ Successfully synced: ${card.name}`);
        }
    }
    
    console.log('🏁 Verified Seeding Complete.');
}

seedVerifiedCreditCards().catch(console.error);
