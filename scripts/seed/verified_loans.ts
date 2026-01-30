import { createServiceClient } from '../../lib/supabase/service';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const VERIFIED_LOANS = [
  // --- PERSONAL LOANS ---
  {
    name: "HDFC Personal Loan",
    category: "loans",
    source_url: "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan",
    key_features: [
      "Interest rates starting from 10.50% pa",
      "Loan amount up to ₹40 Lakhs",
      "Tenure: 12 to 60 months",
      "Instant Disbursal for pre-approved customers (10 seconds)"
    ],
    fees: {
       processing_fee: "Up to 2.50% of the loan amount subject to a minimum of ₹2999 & maximum of ₹25000",
       foreclosure_charges: "Up to 4%"
    },
    rates: {
       interest_rate: "10.50% - 24.00% p.a.",
       min_tenure: "12 months",
       max_tenure: "60 months"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "SBI Personal Loan (Xpress Credit)",
    category: "loans",
    source_url: "https://sbi.co.in/web/personal-banking/loans/personal-loans/xpress-credit-personal-loan",
    key_features: [
      "For Salaried Employees of selected corporates",
      "Low Interest Rates",
      "No Hidden Costs",
      "Daily Reducing Balance"
    ],
    fees: {
       processing_fee: "Low processing charges (Communicated at time of application)",
       foreclosure_charges: "3%"
    },
    rates: {
       interest_rate: "11.00% - 14.00% p.a.",
       min_tenure: "6 months",
       max_tenure: "72 months"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "ICICI Bank Personal Loan",
    category: "loans",
    source_url: "https://www.icicibank.com/personal-banking/loans/personal-loan",
    key_features: [
      "Fixed rate of interest",
      "Loan up to ₹50 Lakhs",
      "Digital application process"
    ],
    fees: {
       processing_fee: "Up to 2.25% of loan amount + GST",
       foreclosure_charges: "5% per annum on principal outstanding"
    },
    rates: {
       interest_rate: "10.75% - 19.00% p.a.",
       min_tenure: "12 months",
       max_tenure: "72 months"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  // --- HOME LOANS ---
  {
    name: "SBI Home Loan",
    category: "loans",
    source_url: "https://homeloans.sbi/products/view/regular-home-loan",
    key_features: [
      "Lowest Interest Rates",
      "Low Processing Fee",
      "No Hidden Charges",
      "No Prepayment Penalty",
      "Interest charges on Daily Reducing Balance"
    ],
    fees: {
       processing_fee: "0.35% of Loan Amount (Min ₹2000, Max ₹10000) + GST",
       foreclosure_charges: "Nil"
    },
    rates: {
       interest_rate: "8.50% - 9.65% p.a.",
       min_tenure: "N/A",
       max_tenure: "30 years"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  },
  {
    name: "HDFC Home Loan",
    category: "loans",
    source_url: "https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan",
    key_features: [
      "Attractive Interest Rates",
      "Special rates for women applicants",
      "Customised repayment options",
      "24x7 Post Disbursement Services"
    ],
    fees: {
       processing_fee: "Up to 0.50% of loan amount or ₹3000 whichever is higher + GST",
       foreclosure_charges: "Nil (For floating rate loans)"
    },
    rates: {
       interest_rate: "8.50% - 9.40% p.a.",
       min_tenure: "N/A",
       max_tenure: "30 years"
    },
    verification_status: {
       is_verified: true,
       verified_at: new Date().toISOString(),
       source: "manual_verified_seed"
    }
  }
];

async function seedVerifiedLoans() {
    console.log('🌱 Starting Verified Loans Seeding...');
    console.log(`📋 Found ${VERIFIED_LOANS.length} verified loans to seed.`);

    const supabase = createServiceClient();

    for (const loan of VERIFIED_LOANS) {
        const payload = {
            name: loan.name,
            slug: loan.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            category: 'loan',
            provider_name: loan.name.split(' ')[0],
            official_link: loan.source_url,
            tags: [loan.category.includes('Personal') ? 'personal' : (loan.category.includes('Home') ? 'home' : 'personal')],
            features: loan.key_features,
            verification_notes: JSON.stringify({
                fees: loan.fees,
                rates: loan.rates,
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
            .eq('name', loan.name)
            .single();

        let error;
        if (existing) {
            console.log(`🔄 Updating existing loan: ${loan.name}`);
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
            console.log(`✨ Creating new loan: ${loan.name}`);
            const { error: insertError } = await supabase
                .from('products')
                .insert(payload);
            error = insertError;
        }

        if (error) {
            console.error(`❌ Failed to process ${loan.name}:`, error.message);
        } else {
            console.log(`✅ Successfully synced: ${loan.name}`);
        }
    }
    
    console.log('🏁 Verified Loans Seeding Complete.');
}

seedVerifiedLoans().catch(console.error);
