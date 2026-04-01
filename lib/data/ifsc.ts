/**
 * IFSC Code Data Service
 *
 * Provides IFSC lookup data from the Razorpay IFSC open API.
 * Data source: https://ifsc.razorpay.com/{IFSC_CODE}
 * RBI publishes the complete IFSC database.
 */

export interface IFSCBranch {
    ifsc: string;
    bank: string;
    bankCode: string;
    branch: string;
    address: string;
    city: string;
    district: string;
    state: string;
    contact: string;
    imps: boolean;
    rtgs: boolean;
    neft: boolean;
    micr: string | null;
    swift: string | null;
    upi: boolean;
}

export interface BankInfo {
    name: string;
    fullName: string;
    logo: string;
    type: 'public' | 'private' | 'cooperative' | 'small_finance' | 'payment' | 'foreign';
    website: string;
    customerCare: string;
    headquarters: string;
    foundedYear: number;
    tagline: string;
    productSlugs: {
        savings?: string;
        fd?: string;
        loan?: string;
        creditCard?: string;
    };
}

// Popular banks metadata for enrichment
export const BANK_INFO: Record<string, BankInfo> = {
    SBIN: {
        name: 'SBI',
        fullName: 'State Bank of India',
        logo: '/images/banks/sbi.svg',
        type: 'public',
        website: 'https://www.onlinesbi.sbi',
        customerCare: '1800 1234',
        headquarters: 'Mumbai, Maharashtra',
        foundedYear: 1955,
        tagline: 'The Banker to Every Indian',
        productSlugs: { savings: 'sbi-savings', fd: 'sbi-fd', loan: 'sbi-home-loan', creditCard: 'sbi-simply-click' },
    },
    HDFC: {
        name: 'HDFC Bank',
        fullName: 'HDFC Bank Limited',
        logo: '/images/banks/hdfc.svg',
        type: 'private',
        website: 'https://www.hdfcbank.com',
        customerCare: '1800 202 6161',
        headquarters: 'Mumbai, Maharashtra',
        foundedYear: 1994,
        tagline: "We Understand Your World",
        productSlugs: { savings: 'hdfc-savings', fd: 'hdfc-fd', loan: 'hdfc-home-loan', creditCard: 'hdfc-millennia' },
    },
    ICIC: {
        name: 'ICICI Bank',
        fullName: 'ICICI Bank Limited',
        logo: '/images/banks/icici.svg',
        type: 'private',
        website: 'https://www.icicibank.com',
        customerCare: '1800 200 3344',
        headquarters: 'Mumbai, Maharashtra',
        foundedYear: 1994,
        tagline: 'Hum Hain Na',
        productSlugs: { savings: 'icici-savings', fd: 'icici-fd', loan: 'icici-home-loan', creditCard: 'icici-amazon-pay' },
    },
    AXIS: {
        name: 'Axis Bank',
        fullName: 'Axis Bank Limited',
        logo: '/images/banks/axis.svg',
        type: 'private',
        website: 'https://www.axisbank.com',
        customerCare: '1800 419 5555',
        headquarters: 'Mumbai, Maharashtra',
        foundedYear: 1993,
        tagline: 'Badhti Ka Naam Zindagi',
        productSlugs: { savings: 'axis-savings', fd: 'axis-fd', loan: 'axis-home-loan', creditCard: 'axis-ace' },
    },
    KKBK: {
        name: 'Kotak Bank',
        fullName: 'Kotak Mahindra Bank Limited',
        logo: '/images/banks/kotak.svg',
        type: 'private',
        website: 'https://www.kotak.com',
        customerCare: '1860 266 2666',
        headquarters: 'Mumbai, Maharashtra',
        foundedYear: 2003,
        tagline: "Let's Make Money Simple",
        productSlugs: { fd: 'kotak-fd', creditCard: 'kotak-811' },
    },
    PUNB: {
        name: 'PNB',
        fullName: 'Punjab National Bank',
        logo: '/images/banks/pnb.svg',
        type: 'public',
        website: 'https://www.pnbindia.in',
        customerCare: '1800 180 2222',
        headquarters: 'New Delhi',
        foundedYear: 1894,
        tagline: 'The Name You Can Bank Upon',
        productSlugs: { fd: 'pnb-fd', loan: 'pnb-home-loan' },
    },
};

// Popular bank codes for the index page
export const POPULAR_BANKS = [
    { code: 'SBIN', name: 'State Bank of India', branches: '22,000+', color: 'bg-blue-50 border-blue-200' },
    { code: 'HDFC', name: 'HDFC Bank', branches: '8,000+', color: 'bg-red-50 border-red-200' },
    { code: 'ICIC', name: 'ICICI Bank', branches: '6,000+', color: 'bg-orange-50 border-orange-200' },
    { code: 'AXIS', name: 'Axis Bank', branches: '5,000+', color: 'bg-purple-50 border-purple-200' },
    { code: 'KKBK', name: 'Kotak Mahindra Bank', branches: '1,800+', color: 'bg-red-50 border-red-200' },
    { code: 'PUNB', name: 'Punjab National Bank', branches: '10,000+', color: 'bg-amber-50 border-amber-200' },
    { code: 'BKID', name: 'Bank of India', branches: '5,100+', color: 'bg-blue-50 border-blue-200' },
    { code: 'BARB', name: 'Bank of Baroda', branches: '8,200+', color: 'bg-orange-50 border-orange-200' },
];

// Sample IFSC data for demo/static pages (real data comes from API)
const DEMO_IFSC_DATA: Record<string, IFSCBranch> = {
    'SBIN0001234': {
        ifsc: 'SBIN0001234',
        bank: 'STATE BANK OF INDIA',
        bankCode: 'SBIN',
        branch: 'MAIN BRANCH MUMBAI',
        address: 'State Bank Bhavan, Madame Cama Road, Nariman Point, Mumbai - 400021',
        city: 'MUMBAI',
        district: 'MUMBAI',
        state: 'MAHARASHTRA',
        contact: '022-22022426',
        imps: true,
        rtgs: true,
        neft: true,
        micr: '400002001',
        swift: 'SBININBB',
        upi: true,
    },
    'HDFC0000001': {
        ifsc: 'HDFC0000001',
        bank: 'HDFC BANK',
        bankCode: 'HDFC',
        branch: 'FORT',
        address: 'Ramon House, H T Parekh Marg, 169, Backbay Reclamation, Mumbai - 400020',
        city: 'MUMBAI',
        district: 'MUMBAI',
        state: 'MAHARASHTRA',
        contact: '022-30750000',
        imps: true,
        rtgs: true,
        neft: true,
        micr: '400240001',
        swift: 'HDFCINBB',
        upi: true,
    },
};

/**
 * Fetch IFSC data from Razorpay's free IFSC API
 * Falls back to demo data for development
 */
export async function fetchIFSCData(ifscCode: string): Promise<IFSCBranch | null> {
    const normalized = ifscCode.toUpperCase().trim();

    // Basic IFSC format validation: 4 letters + 0 + 6 alphanumeric
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(normalized)) {
        return null;
    }

    try {
        const res = await fetch(`https://ifsc.razorpay.com/${normalized}`, {
            next: { revalidate: 86400 }, // Cache for 24 hours — IFSC data rarely changes
            headers: { 'Accept': 'application/json' },
        });

        if (!res.ok) return null;

        const data = await res.json();

        return {
            ifsc: data.IFSC,
            bank: data.BANK,
            bankCode: data.BANKCODE,
            branch: data.BRANCH,
            address: data.ADDRESS,
            city: data.CITY,
            district: data.DISTRICT,
            state: data.STATE,
            contact: data.CONTACT || 'Not available',
            imps: data.IMPS === true || data.IMPS === 'true',
            rtgs: data.RTGS === true || data.RTGS === 'true',
            neft: data.NEFT === true || data.NEFT === 'true',
            micr: data.MICR || null,
            swift: data.SWIFT || null,
            upi: data.UPI === true || data.UPI === 'true',
        };
    } catch {
        // Return demo data as fallback during dev
        return DEMO_IFSC_DATA[normalized] ?? null;
    }
}

/**
 * Get enriched bank info for an IFSC branch
 */
export function getBankInfo(bankCode: string): BankInfo | null {
    return BANK_INFO[bankCode] ?? null;
}

/**
 * Decode what IFSC characters mean
 * IFSC format: AAAA0NNNNNN
 * - Characters 1-4: Bank code
 * - Character 5: Always '0' (reserved)
 * - Characters 6-11: Branch code
 */
export function decodeIFSC(ifsc: string): {
    bankCode: string;
    reserved: string;
    branchCode: string;
} {
    return {
        bankCode: ifsc.slice(0, 4),
        reserved: ifsc.slice(4, 5),
        branchCode: ifsc.slice(5, 11),
    };
}

/**
 * Get common transfer limits for India
 */
export const TRANSFER_INFO = {
    NEFT: {
        minAmount: null,
        maxAmount: null,
        timing: 'Monday–Saturday, 8:00 AM–7:00 PM (Closed on bank holidays)',
        settlement: 'Batch settlements every 30 minutes',
        charges: '₹0–₹25 depending on amount',
    },
    RTGS: {
        minAmount: '₹2,00,000',
        maxAmount: null,
        timing: 'Monday–Saturday, 7:00 AM–6:00 PM',
        settlement: 'Real-time (within 30 minutes)',
        charges: '₹20–₹50 depending on amount',
    },
    IMPS: {
        minAmount: '₹1',
        maxAmount: '₹5,00,000',
        timing: '24×7, 365 days',
        settlement: 'Instant',
        charges: '₹0–₹25 depending on bank',
    },
    UPI: {
        minAmount: '₹1',
        maxAmount: '₹1,00,000 (₹2 lakh for verified merchants)',
        timing: '24×7, 365 days',
        settlement: 'Instant',
        charges: '₹0 (free)',
    },
};
