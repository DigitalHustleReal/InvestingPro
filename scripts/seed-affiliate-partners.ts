/**
 * Seed Affiliate Partners
 * Populates the affiliate_partners table with Indian financial affiliate networks
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const AFFILIATE_PARTNERS = [
    // Credit Card Partners
    {
        name: 'HDFC Bank',
        slug: 'hdfc-bank',
        logo_url: '/assets/partners/hdfc.png',
        base_url: 'https://apply.hdfcbank.com',
        commission_type: 'cpa',
        commission_rate: 800, // ₹800 per approved card
        category: 'credit_card',
        tracking_param: 'ref',
        is_active: true
    },
    {
        name: 'SBI Card',
        slug: 'sbi-card',
        logo_url: '/assets/partners/sbi.png',
        base_url: 'https://www.sbicard.com/apply',
        commission_type: 'cpa',
        commission_rate: 600,
        category: 'credit_card',
        tracking_param: 'partner',
        is_active: true
    },
    {
        name: 'Axis Bank',
        slug: 'axis-bank',
        logo_url: '/assets/partners/axis.png',
        base_url: 'https://www.axisbank.com/cards',
        commission_type: 'cpa',
        commission_rate: 700,
        category: 'credit_card',
        tracking_param: 'src',
        is_active: true
    },
    {
        name: 'ICICI Bank',
        slug: 'icici-bank',
        logo_url: '/assets/partners/icici.png',
        base_url: 'https://www.icicibank.com/cards',
        commission_type: 'cpa',
        commission_rate: 650,
        category: 'credit_card',
        tracking_param: 'aff',
        is_active: true
    },
    
    // Broker Partners
    {
        name: 'Zerodha',
        slug: 'zerodha',
        logo_url: '/assets/partners/zerodha.png',
        base_url: 'https://zerodha.com/open-account',
        commission_type: 'cpa',
        commission_rate: 300, // ₹300 per account
        category: 'broker',
        tracking_param: 'ref',
        is_active: true
    },
    {
        name: 'Groww',
        slug: 'groww',
        logo_url: '/assets/partners/groww.png',
        base_url: 'https://groww.in/open-demat',
        commission_type: 'cpa',
        commission_rate: 250,
        category: 'broker',
        tracking_param: 'partner',
        is_active: true
    },
    {
        name: 'Upstox',
        slug: 'upstox',
        logo_url: '/assets/partners/upstox.png',
        base_url: 'https://upstox.com/open-account',
        commission_type: 'cpa',
        commission_rate: 200,
        category: 'broker',
        tracking_param: 'ref',
        is_active: true
    },
    {
        name: 'Angel One',
        slug: 'angel-one',
        logo_url: '/assets/partners/angelone.png',
        base_url: 'https://www.angelone.in/open-account',
        commission_type: 'cpa',
        commission_rate: 400,
        category: 'broker',
        tracking_param: 'partner_id',
        is_active: true
    },
    
    // Loan Partners
    {
        name: 'BankBazaar',
        slug: 'bankbazaar',
        logo_url: '/assets/partners/bankbazaar.png',
        base_url: 'https://www.bankbazaar.com',
        commission_type: 'cpa',
        commission_rate: 500,
        category: 'loan',
        tracking_param: 'utm_source',
        is_active: true
    },
    {
        name: 'Paisabazaar',
        slug: 'paisabazaar',
        logo_url: '/assets/partners/paisabazaar.png',
        base_url: 'https://www.paisabazaar.com',
        commission_type: 'cpa',
        commission_rate: 450,
        category: 'loan',
        tracking_param: 'ref',
        is_active: true
    },
    
    // Insurance Partners
    {
        name: 'Policybazaar',
        slug: 'policybazaar',
        logo_url: '/assets/partners/policybazaar.png',
        base_url: 'https://www.policybazaar.com',
        commission_type: 'revenue_share',
        commission_rate: 15, // 15% of first premium
        category: 'insurance',
        tracking_param: 'partner',
        is_active: true
    },
    {
        name: 'Digit Insurance',
        slug: 'digit-insurance',
        logo_url: '/assets/partners/digit.png',
        base_url: 'https://www.godigit.com',
        commission_type: 'revenue_share',
        commission_rate: 12,
        category: 'insurance',
        tracking_param: 'ref',
        is_active: true
    },
    
    // Mutual Fund Partners
    {
        name: 'Kuvera',
        slug: 'kuvera',
        logo_url: '/assets/partners/kuvera.png',
        base_url: 'https://kuvera.in/signup',
        commission_type: 'cpc',
        commission_rate: 5, // ₹5 per click
        category: 'mutual_fund',
        tracking_param: 'ref',
        is_active: true
    },
    {
        name: 'ET Money',
        slug: 'et-money',
        logo_url: '/assets/partners/etmoney.png',
        base_url: 'https://www.etmoney.com/invest',
        commission_type: 'cpa',
        commission_rate: 150,
        category: 'mutual_fund',
        tracking_param: 'partner',
        is_active: true
    }
];

async function seedPartners() {
    console.log('🤝 Seeding Affiliate Partners...\n');
    
    let success = 0;
    let failed = 0;
    
    for (const partner of AFFILIATE_PARTNERS) {
        // Delete existing partner by slug first (if any)
        await supabase
            .from('affiliate_partners')
            .delete()
            .eq('slug', partner.slug);
        
        // Insert new partner
        const { error } = await supabase
            .from('affiliate_partners')
            .insert(partner);
        
        if (error) {
            console.log(`❌ Failed: ${partner.name} - ${error.message}`);
            failed++;
        } else {
            console.log(`✅ Seeded: ${partner.name} (${partner.category})`);
            success++;
        }
    }
    
    console.log(`\n✨ Partner Seeding Complete!`);
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
}

seedPartners().catch(console.error);
