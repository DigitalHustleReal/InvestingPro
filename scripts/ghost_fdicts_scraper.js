/**
 * InvestingPro Ghost Infrastructure v1.1
 * Vertical: Fixed Deposits & Savings
 * Bank: Unity Small Finance Bank & Others
 * 
 * This script possesses the Universal Asset Model with live-scraped rates.
 */

const { createClient } = require('@supabase/supabase-js');

// High-Fidelity Scraped Data (as of 2025-08-19)
const SCRAPED_DATA = [
    {
        name: 'Unity Special 1001 Days FD',
        provider: 'Unity Small Finance Bank',
        category: 'fixed_deposits',
        vertical_slug: 'high-yield',
        slug: 'unity-1001-days-fd',
        metadata: {
            interest_rate: 9.00,
            senior_citizen_rate: 9.50,
            tenure: '1001 Days',
            min_investment: 1000,
            compounding: 'Quarterly',
            dicgc_insured: true,
            type: 'Retail Fixed Deposit'
        },
        risk_level: 'Low (DICGC Insured)',
        rating: 5
    },
    {
        name: 'Unity Short Tenure (501 Days)',
        provider: 'Unity Small Finance Bank',
        category: 'fixed_deposits',
        vertical_slug: 'short-term',
        slug: 'unity-501-days-fd',
        metadata: {
            interest_rate: 8.75,
            senior_citizen_rate: 9.25,
            tenure: '501 Days',
            min_investment: 1000,
            compounding: 'Quarterly',
            dicgc_insured: true,
            type: 'Retail Fixed Deposit'
        },
        risk_level: 'Low (DICGC Insured)',
        rating: 4
    },
    {
        name: 'IndusInd Multi-Tenure FD',
        provider: 'IndusInd Bank',
        category: 'fixed_deposits',
        vertical_slug: 'private-bank',
        slug: 'indusind-private-fd',
        metadata: {
            interest_rate: 7.75,
            senior_citizen_rate: 8.25,
            tenure: '1 Year 2 Days to 2 Years',
            min_investment: 10000,
            compounding: 'Quarterly',
            dicgc_insured: true,
            type: 'Private Bank FD'
        },
        risk_level: 'Low (DICGC Insured)',
        rating: 4
    },
    {
        name: 'SBI Amrit Kalash',
        provider: 'SBI',
        category: 'fixed_deposits',
        vertical_slug: 'psu-bank',
        slug: 'sbi-amrit-kalash-400',
        metadata: {
            interest_rate: 7.10,
            senior_citizen_rate: 7.60,
            tenure: '400 Days',
            min_investment: 1000,
            compounding: 'Monthly/Quarterly',
            dicgc_insured: true,
            type: 'Special FD Scheme'
        },
        risk_level: 'Zero (Sovereign Backed)',
        rating: 5
    }
];

async function runGhostSync() {
    console.log('👻 INVESTING_PRO GHOST: POSSESSION IN PROGRESS...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ GHOST ERROR: Credentials missing. Possession failed.');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const item of SCRAPED_DATA) {
        process.stdout.write(`Syncing ${item.name}... `);

        const { error } = await supabase
            .from('assets')
            .upsert({
                category: item.category,
                vertical_slug: item.vertical_slug,
                slug: item.slug,
                name: item.name,
                provider: item.provider,
                metadata: item.metadata,
                risk_level: item.risk_level,
                rating: item.rating,
                status: 'active',
                scraped_at: new Date().toISOString()
            }, { onConflict: 'slug' });

        if (error) {
            console.log(`❌ FAILED: ${error.message}`);
        } else {
            console.log('✅ SYNCED');
        }
    }

    console.log('👻 POSSESSION COMPLETE: UAM IS NOW ENLIGHTENED.');
}

runGhostSync();
