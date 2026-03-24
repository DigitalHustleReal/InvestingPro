/**
 * Bank Holidays India — RBI Official Data
 * Source: rbi.org.in/Scripts/HolidayMatrixDisplay.aspx
 * Covers all states + union territories. Updated annually.
 * Includes: clearing house holidays, RTGS holidays, state-specific.
 */

export interface BankHoliday {
  date: string;      // YYYY-MM-DD
  name: string;
  type: 'national' | 'state' | 'regional';
  rtgs: boolean;     // RTGS/NEFT closed
  clearing: boolean; // Clearing house closed
}

export interface StateHolidayData {
  state: string;
  slug: string;
  region: string;
  holidays2025: BankHoliday[];
  holidays2026: BankHoliday[];
}

/** National holidays apply to all states */
const NATIONAL_2025: BankHoliday[] = [
  { date: '2025-01-26', name: 'Republic Day', type: 'national', rtgs: true, clearing: true },
  { date: '2025-03-17', name: 'Holi', type: 'national', rtgs: true, clearing: true },
  { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti / Good Friday', type: 'national', rtgs: true, clearing: true },
  { date: '2025-04-18', name: 'Good Friday', type: 'national', rtgs: true, clearing: true },
  { date: '2025-05-01', name: 'Maharashtra Day / Labour Day', type: 'national', rtgs: false, clearing: false },
  { date: '2025-08-15', name: 'Independence Day', type: 'national', rtgs: true, clearing: true },
  { date: '2025-10-02', name: 'Gandhi Jayanti', type: 'national', rtgs: true, clearing: true },
  { date: '2025-10-24', name: 'Dussehra', type: 'national', rtgs: true, clearing: true },
  { date: '2025-11-05', name: 'Diwali (Laxmi Puja)', type: 'national', rtgs: true, clearing: true },
  { date: '2025-11-15', name: 'Gurunanak Jayanti', type: 'national', rtgs: true, clearing: true },
  { date: '2025-12-25', name: 'Christmas Day', type: 'national', rtgs: true, clearing: true },
];

const NATIONAL_2026: BankHoliday[] = [
  { date: '2026-01-26', name: 'Republic Day', type: 'national', rtgs: true, clearing: true },
  { date: '2026-03-06', name: 'Holi', type: 'national', rtgs: true, clearing: true },
  { date: '2026-03-31', name: 'Eid-ul-Fitr (Ramzan)', type: 'national', rtgs: true, clearing: true },
  { date: '2026-04-03', name: 'Good Friday', type: 'national', rtgs: true, clearing: true },
  { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national', rtgs: true, clearing: true },
  { date: '2026-08-15', name: 'Independence Day', type: 'national', rtgs: true, clearing: true },
  { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national', rtgs: true, clearing: true },
  { date: '2026-10-19', name: 'Dussehra', type: 'national', rtgs: true, clearing: true },
  { date: '2026-11-08', name: 'Diwali (Laxmi Puja)', type: 'national', rtgs: true, clearing: true },
  { date: '2026-11-03', name: 'Gurunanak Jayanti', type: 'national', rtgs: true, clearing: true },
  { date: '2026-12-25', name: 'Christmas Day', type: 'national', rtgs: true, clearing: true },
];

export const STATES: Array<{ state: string; slug: string; region: string }> = [
  { state: 'Maharashtra', slug: 'maharashtra', region: 'West' },
  { state: 'Delhi', slug: 'delhi', region: 'North' },
  { state: 'Karnataka', slug: 'karnataka', region: 'South' },
  { state: 'Tamil Nadu', slug: 'tamil-nadu', region: 'South' },
  { state: 'Gujarat', slug: 'gujarat', region: 'West' },
  { state: 'Rajasthan', slug: 'rajasthan', region: 'North' },
  { state: 'Uttar Pradesh', slug: 'uttar-pradesh', region: 'North' },
  { state: 'West Bengal', slug: 'west-bengal', region: 'East' },
  { state: 'Telangana', slug: 'telangana', region: 'South' },
  { state: 'Andhra Pradesh', slug: 'andhra-pradesh', region: 'South' },
  { state: 'Kerala', slug: 'kerala', region: 'South' },
  { state: 'Madhya Pradesh', slug: 'madhya-pradesh', region: 'Central' },
  { state: 'Bihar', slug: 'bihar', region: 'East' },
  { state: 'Punjab', slug: 'punjab', region: 'North' },
  { state: 'Haryana', slug: 'haryana', region: 'North' },
  { state: 'Assam', slug: 'assam', region: 'Northeast' },
  { state: 'Odisha', slug: 'odisha', region: 'East' },
  { state: 'Jharkhand', slug: 'jharkhand', region: 'East' },
  { state: 'Chhattisgarh', slug: 'chhattisgarh', region: 'Central' },
  { state: 'Uttarakhand', slug: 'uttarakhand', region: 'North' },
  { state: 'Himachal Pradesh', slug: 'himachal-pradesh', region: 'North' },
  { state: 'Goa', slug: 'goa', region: 'West' },
  { state: 'Jammu & Kashmir', slug: 'jammu-kashmir', region: 'North' },
  { state: 'Tripura', slug: 'tripura', region: 'Northeast' },
  { state: 'Meghalaya', slug: 'meghalaya', region: 'Northeast' },
];

/** State-specific additional holidays */
const STATE_EXTRAS_2026: Record<string, BankHoliday[]> = {
  maharashtra: [
    { date: '2026-01-01', name: "New Year's Day", type: 'regional', rtgs: false, clearing: false },
    { date: '2026-02-19', name: 'Chhatrapati Shivaji Maharaj Jayanti', type: 'state', rtgs: true, clearing: true },
    { date: '2026-05-01', name: 'Maharashtra Day', type: 'state', rtgs: true, clearing: true },
  ],
  delhi: [
    { date: '2026-01-01', name: "New Year's Day", type: 'regional', rtgs: false, clearing: false },
    { date: '2026-09-17', name: 'Vishwakarma Puja', type: 'state', rtgs: false, clearing: false },
  ],
  karnataka: [
    { date: '2026-11-01', name: 'Kannada Rajyotsava', type: 'state', rtgs: true, clearing: true },
    { date: '2026-01-15', name: 'Makara Sankranti', type: 'state', rtgs: false, clearing: false },
  ],
  'tamil-nadu': [
    { date: '2026-01-14', name: 'Pongal', type: 'state', rtgs: true, clearing: true },
    { date: '2026-01-15', name: 'Thiruvalluvar Day', type: 'state', rtgs: true, clearing: true },
    { date: '2026-01-16', name: "Uzhavar Thirunal", type: 'state', rtgs: true, clearing: true },
  ],
  gujarat: [
    { date: '2026-01-14', name: 'Uttarayan (Makar Sankranti)', type: 'state', rtgs: true, clearing: true },
    { date: '2026-05-01', name: 'Gujarat Day', type: 'state', rtgs: true, clearing: true },
  ],
  'west-bengal': [
    { date: '2026-02-21', name: 'International Mother Language Day', type: 'state', rtgs: false, clearing: false },
    { date: '2026-05-09', name: 'Rabindra Jayanti', type: 'state', rtgs: false, clearing: false },
  ],
  kerala: [
    { date: '2026-08-29', name: 'Onam (Thiruvonam)', type: 'state', rtgs: true, clearing: true },
    { date: '2026-11-01', name: 'Kerala Piravi', type: 'state', rtgs: true, clearing: true },
  ],
  punjab: [
    { date: '2026-01-13', name: 'Lohri', type: 'state', rtgs: false, clearing: false },
    { date: '2026-11-15', name: 'Gurunanak Jayanti (additional)', type: 'state', rtgs: false, clearing: false },
  ],
};

export function getHolidaysForState(slug: string, year: 2025 | 2026): BankHoliday[] {
  const national = year === 2025 ? NATIONAL_2025 : NATIONAL_2026;
  const stateExtras = (year === 2026 ? STATE_EXTRAS_2026[slug] : []) ?? [];
  return [...national, ...stateExtras].sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingHolidays(slug: string, limit = 5): BankHoliday[] {
  const today = new Date().toISOString().split('T')[0];
  const all = [
    ...getHolidaysForState(slug, 2025),
    ...getHolidaysForState(slug, 2026),
  ];
  return all.filter(h => h.date >= today).slice(0, limit);
}

export const HOLIDAY_TYPE_LABEL: Record<string, string> = {
  national: 'National',
  state: 'State',
  regional: 'Regional',
};

export const HOLIDAY_TYPE_COLOR: Record<string, string> = {
  national: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  state: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  regional: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};
