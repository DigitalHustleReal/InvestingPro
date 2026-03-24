/**
 * Gold Rate Data — IBJA / MCX
 * City list + static seed rates (updated via ISR / cron).
 * API: https://indiagoldratesapi.com/api/rates  (free tier)
 * Fallback: last-known rates baked in for SSG.
 */

export interface GoldRate {
  city: string;
  slug: string;
  state: string;
  rate22k: number; // ₹ per gram
  rate24k: number;
  rate18k: number;
  change1d: number; // ₹ change vs yesterday
  changePercent: number;
  updatedAt: string; // ISO date string
}

export interface GoldHistoryPoint {
  date: string;
  rate24k: number;
  rate22k: number;
}

/** All cities we generate pages for */
export const GOLD_RATE_CITIES: Array<{ city: string; slug: string; state: string }> = [
  { city: 'Mumbai', slug: 'mumbai', state: 'Maharashtra' },
  { city: 'Delhi', slug: 'delhi', state: 'Delhi' },
  { city: 'Bangalore', slug: 'bangalore', state: 'Karnataka' },
  { city: 'Chennai', slug: 'chennai', state: 'Tamil Nadu' },
  { city: 'Hyderabad', slug: 'hyderabad', state: 'Telangana' },
  { city: 'Kolkata', slug: 'kolkata', state: 'West Bengal' },
  { city: 'Pune', slug: 'pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', slug: 'jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', slug: 'lucknow', state: 'Uttar Pradesh' },
  { city: 'Surat', slug: 'surat', state: 'Gujarat' },
  { city: 'Coimbatore', slug: 'coimbatore', state: 'Tamil Nadu' },
  { city: 'Kochi', slug: 'kochi', state: 'Kerala' },
  { city: 'Indore', slug: 'indore', state: 'Madhya Pradesh' },
  { city: 'Patna', slug: 'patna', state: 'Bihar' },
  { city: 'Bhopal', slug: 'bhopal', state: 'Madhya Pradesh' },
  { city: 'Nagpur', slug: 'nagpur', state: 'Maharashtra' },
  { city: 'Vadodara', slug: 'vadodara', state: 'Gujarat' },
  { city: 'Visakhapatnam', slug: 'visakhapatnam', state: 'Andhra Pradesh' },
  { city: 'Chandigarh', slug: 'chandigarh', state: 'Punjab' },
  { city: 'Amritsar', slug: 'amritsar', state: 'Punjab' },
  { city: 'Thiruvananthapuram', slug: 'thiruvananthapuram', state: 'Kerala' },
  { city: 'Mysore', slug: 'mysore', state: 'Karnataka' },
  { city: 'Ranchi', slug: 'ranchi', state: 'Jharkhand' },
  { city: 'Guwahati', slug: 'guwahati', state: 'Assam' },
  { city: 'Bhubaneswar', slug: 'bhubaneswar', state: 'Odisha' },
  { city: 'Nashik', slug: 'nashik', state: 'Maharashtra' },
  { city: 'Rajkot', slug: 'rajkot', state: 'Gujarat' },
  { city: 'Jabalpur', slug: 'jabalpur', state: 'Madhya Pradesh' },
  { city: 'Ludhiana', slug: 'ludhiana', state: 'Punjab' },
  { city: 'Agra', slug: 'agra', state: 'Uttar Pradesh' },
  { city: 'Varanasi', slug: 'varanasi', state: 'Uttar Pradesh' },
  { city: 'Madurai', slug: 'madurai', state: 'Tamil Nadu' },
  { city: 'Meerut', slug: 'meerut', state: 'Uttar Pradesh' },
  { city: 'Faridabad', slug: 'faridabad', state: 'Haryana' },
  { city: 'Gurgaon', slug: 'gurgaon', state: 'Haryana' },
  { city: 'Noida', slug: 'noida', state: 'Uttar Pradesh' },
  { city: 'Thane', slug: 'thane', state: 'Maharashtra' },
  { city: 'Navi Mumbai', slug: 'navi-mumbai', state: 'Maharashtra' },
  { city: 'Dehradun', slug: 'dehradun', state: 'Uttarakhand' },
  { city: 'Raipur', slug: 'raipur', state: 'Chhattisgarh' },
  { city: 'Srinagar', slug: 'srinagar', state: 'Jammu & Kashmir' },
  { city: 'Jammu', slug: 'jammu', state: 'Jammu & Kashmir' },
  { city: 'Hubli', slug: 'hubli', state: 'Karnataka' },
  { city: 'Mangalore', slug: 'mangalore', state: 'Karnataka' },
  { city: 'Tiruchirappalli', slug: 'tiruchirappalli', state: 'Tamil Nadu' },
  { city: 'Salem', slug: 'salem', state: 'Tamil Nadu' },
  { city: 'Tirunelveli', slug: 'tirunelveli', state: 'Tamil Nadu' },
  { city: 'Thrissur', slug: 'thrissur', state: 'Kerala' },
  { city: 'Kozhikode', slug: 'kozhikode', state: 'Kerala' },
];

/**
 * Base rate seeded from IBJA Mar 24 2026. Actual rates fetched at runtime via ISR.
 * City-level variation is typically ±₹50–₹200 from Mumbai base (local taxes + making charges).
 */
const BASE_24K = 8850; // ₹ per gram — Mar 24 2026 approx
const BASE_22K = 8114;
const BASE_18K = 6638;

const CITY_PREMIUM: Record<string, number> = {
  mumbai: 0,
  delhi: 20,
  bangalore: 45,
  chennai: 60,
  hyderabad: 55,
  kolkata: 30,
  pune: 10,
  ahmedabad: 15,
  jaipur: 25,
  kochi: 80,
  coimbatore: 65,
  thiruvananthapuram: 85,
  thrissur: 80,
  kozhikode: 78,
};

export function getSeedRate(slug: string): GoldRate {
  const city = GOLD_RATE_CITIES.find(c => c.slug === slug);
  const premium = CITY_PREMIUM[slug] ?? 35;
  return {
    city: city?.city ?? slug,
    slug,
    state: city?.state ?? '',
    rate24k: BASE_24K + premium,
    rate22k: BASE_22K + Math.round(premium * 0.917),
    rate18k: BASE_18K + Math.round(premium * 0.75),
    change1d: 0,
    changePercent: 0,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fetch live gold rate for a city.
 * Falls back to seed data if API is unavailable.
 */
export async function fetchGoldRate(slug: string): Promise<GoldRate> {
  try {
    const res = await fetch(
      `https://indiagoldratesapi.com/api/rates?city=${slug}`,
      { next: { revalidate: 3600 } } // hourly
    );
    if (res.ok) {
      const json = await res.json();
      const premium = CITY_PREMIUM[slug] ?? 35;
      return {
        city: json.city ?? GOLD_RATE_CITIES.find(c => c.slug === slug)?.city ?? slug,
        slug,
        state: GOLD_RATE_CITIES.find(c => c.slug === slug)?.state ?? '',
        rate24k: json.rate_24k ?? BASE_24K + premium,
        rate22k: json.rate_22k ?? BASE_22K + Math.round(premium * 0.917),
        rate18k: json.rate_18k ?? BASE_18K + Math.round(premium * 0.75),
        change1d: json.change_1d ?? 0,
        changePercent: json.change_pct ?? 0,
        updatedAt: new Date().toISOString(),
      };
    }
  } catch {
    // fallthrough to seed
  }
  return getSeedRate(slug);
}

/** 52-week high/low for display — seed values, refreshed via ISR */
export const GOLD_52W = {
  high24k: 9450,
  low24k: 7680,
  high22k: 8666,
  low22k: 7042,
};

export const GOLD_PURITY_GUIDE = [
  { karat: '24K', purity: '99.9%', use: 'Coins, bars, investment', colour: 'bg-amber-100 text-amber-800 border-amber-200' },
  { karat: '22K', purity: '91.6%', use: 'Jewellery (most popular)', colour: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { karat: '18K', purity: '75%', use: 'Diamond-studded jewellery', colour: 'bg-orange-100 text-orange-800 border-orange-200' },
  { karat: '14K', purity: '58.3%', use: 'Trendy / casual jewellery', colour: 'bg-red-50 text-red-700 border-red-200' },
];
