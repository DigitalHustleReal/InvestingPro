import { createServiceClient } from '../lib/supabase/service';
import axios from 'axios';
import slugify from 'slugify';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dotenv.config({ path: '.env.local' });
dayjs.extend(customParseFormat);

const supabase = createServiceClient();
const MFAPI_BASE = 'https://api.mfapi.in/mf';

interface MFScheme {
    schemeCode: number;
    schemeName: string;
}

interface MFMeta {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
}

interface MFData {
    date: string; // DD-MM-YYYY
    nav: string;
}

interface MFDetails {
    meta: MFMeta;
    data: MFData[];
}

const TARGET_KEYWORDS = ['Bluechip', 'Midcap', 'Small Cap', 'Flexi Cap', 'ELSS', 'Nifty 50'];

// Actually, Direct Growth is better for returns, but Regular is more common for distributors. 
// Let's stick to "Growth" and exclude "IDCW"/"Dividend".
// Note: api.mfapi.in lists EVERYTHING. 
// Let's target "Regular Plan" & "Growth" explicitly if possible, or "Direct Plan" & "Growth".
// Modern apps prefer Direct. Let's try to get "Direct" & "Growth" for best returns display.

async function fetchMasterList(): Promise<MFScheme[]> {
    console.log('Fetching master list...');
    const { data } = await axios.get<MFScheme[]>(MFAPI_BASE);
    return data;
}

function calculateCAGR(currentNav: number, oldNav: number, years: number): number {
    if (!oldNav || oldNav === 0) return 0;
    const cagr = Math.pow(currentNav / oldNav, 1 / years) - 1;
    return parseFloat((cagr * 100).toFixed(2));
}

function getNavAtDate(data: MFData[], date: dayjs.Dayjs): number {
    // Find closest date <= target date
    // Data is usually sorted desc (latest first) or asc?
    // MFAPI data[0] is latest.
    
    // Performance note: historical data can be 2000+ entries.
    // We scan.
    
    for (const entry of data) {
        const entryDate = dayjs(entry.date, 'DD-MM-YYYY');
        if (entryDate.isSame(date, 'day') || entryDate.isBefore(date)) {
            return parseFloat(entry.nav);
        }
    }
    return 0; // Not found (too old)
}

async function processScheme(scheme: MFScheme) {
    try {
        // Fetch details
        const { data: details } = await axios.get<MFDetails>(`${MFAPI_BASE}/${scheme.schemeCode}`);
        if (!details.data || details.data.length === 0) return;

        const meta = details.meta;
        const navHistory = details.data;
        const currentNav = parseFloat(navHistory[0].nav);
        const lastDate = dayjs(navHistory[0].date, 'DD-MM-YYYY');

        // Calculate Returns
        const nav1Y = getNavAtDate(navHistory, lastDate.subtract(1, 'year'));
        const nav3Y = getNavAtDate(navHistory, lastDate.subtract(3, 'year'));
        const nav5Y = getNavAtDate(navHistory, lastDate.subtract(5, 'year'));

        const returns1Y = nav1Y ? calculateCAGR(currentNav, nav1Y, 1) : null;
        const returns3Y = nav3Y ? calculateCAGR(currentNav, nav3Y, 3) : null;
        const returns5Y = nav5Y ? calculateCAGR(currentNav, nav5Y, 5) : null;

        // Map Category (Simple logic)
        let category = 'Equity';
        const nameLower = meta.scheme_name.toLowerCase();
        if (nameLower.includes('large cap') || nameLower.includes('bluechip')) category = 'Large Cap';
        else if (nameLower.includes('mid cap')) category = 'Mid Cap';
        else if (nameLower.includes('small cap')) category = 'Small Cap';
        else if (nameLower.includes('flexi cap')) category = 'Flexi Cap';
        else if (nameLower.includes('elss') || nameLower.includes('tax saver')) category = 'ELSS';
        else if (nameLower.includes('index') || nameLower.includes('nifty')) category = 'Index Fund';
        else if (nameLower.includes('debt') || nameLower.includes('liquid')) category = 'Debt';
        else if (nameLower.includes('hybrid') || nameLower.includes('balanced')) category = 'Hybrid';

        // Prepare DB Record
        const record = {
            slug: slugify(meta.scheme_name, { lower: true, strict: true }),
            scheme_code: meta.scheme_code,
            name: meta.scheme_name,
            fund_house: meta.fund_house,
            category: category, 
            nav: currentNav,
            returns_1y: returns1Y,
            returns_3y: returns3Y,
            returns_5y: returns5Y,
            rating: 4, // Default placeholder, MFAPI doesn't have ratings
            risk: 'Very High', // Default for Equity
            min_investment: '500', 
            // aum? MFAPI doesn't provide AUM in this endpoint usually.
            is_verified: true
        };

        // Check if category is valid per constraint? Schema has constraint.
        // If my 'Equity' default isn't in constraint, it will fail.
        // Constraint: 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Multi Cap', 'ELSS', 'Index Fund', 'Debt', 'Hybrid'
        // 'Equity' is NOT in constraint. So I must ensure category matches one of these.
        if (category === 'Equity') category = 'Flexi Cap'; // Fallback
        
        record.category = category;

        // Upsert
        const { error } = await supabase
            .from('mutual_funds')
            .upsert(record, { onConflict: 'scheme_code' });

        if (error) {
            console.error(`Error saving ${meta.scheme_name}:`, error.message);
        } else {
            console.log(`✅ Saved: ${meta.scheme_name} | 1Y: ${returns1Y}%`);
        }

    } catch (err: any) {
        console.error(`Failed to process ${scheme.schemeName}:`, err.message);
    }
}

async function main() {
    const list = await fetchMasterList();
    console.log(`Total Schemes: ${list.length}`);

    // Filter
    const candidates = list.filter(s => {
        const name = s.schemeName;
        // Strict filter for demo: Top Keywords AND "Growth" AND NOT "Regular" (Prefer Direct)
        // Actually, let's mix. Just ensure it contains "Growth".
        const hasKeyword = TARGET_KEYWORDS.some(k => name.includes(k));
        const isGrowth = name.includes('Growth') && !name.includes('IDCW') && !name.includes('Dividend');
        const isDirect = name.includes('Direct'); // Optional
        
        return hasKeyword && isGrowth && isDirect;
    });

    console.log(`Filtered Candidates: ${candidates.length}`);
    const limited = candidates.slice(0, 50); // Process top 50

    console.log(`Processing ${limited.length} schemes...`);
    
    // Batch or Serial? 
    // Serial is safer for API limits. MFAPI is robust but let's be nice.
    for (const scheme of limited) {
        await processScheme(scheme);
        // await new Promise(r => setTimeout(r, 100)); // Throttle
    }
}

main().catch(console.error);
