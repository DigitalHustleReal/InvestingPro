
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Generators ---

const banks = ['HDFC Bank', 'SBI Card', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'IDFC First', 'IndusInd Bank', 'Yes Bank', 'Standard Chartered', 'American Express'];
const cardNames = ['Regalia Gold', 'Millennia', 'SimplyCLICK', 'Platinum Travel', 'Ace', 'Sapphiro', 'Rubyx', 'Coral', 'Privilege', 'Select', 'Ultimate', 'Black', 'Platinum', 'Titanium'];
const loanProviders = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Bajaj Finserv', 'Tata Capital', 'Aditya Birla', 'Kotak Mahindra', 'Axis Bank'];
const fundHouses = ['SBI Mutual Fund', 'HDFC Mutual Fund', 'ICICI Prudential', 'Axis Mutual Fund', 'Nippon India', 'Kotak Mutual Fund', 'UTI Mutual Fund', 'Mirae Asset'];
const fundTypes = ['Bluechip Fund', 'Midcap Fund', 'Small Cap Fund', 'Flexi Cap Fund', 'Tax Saver (ELSS)', 'Liquid Fund', 'Balanced Advantage'];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number, decimals: number = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

function generateCreditCard(index: number) {
  const bank = getRandom(banks);
  const name = `${bank} ${getRandom(cardNames)} ${index}`; // Append index to ensure uniqueness if needed, or just relying on random combo
  // Cleaner name
  const cleanName = `${bank} ${getRandom(cardNames)}`; 
  // Dedupe logic handled later or by slug uniqueness

  const annualFee = getRandomInt(0, 10000);
  
  return {
    name: cleanName,
    slug: `${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
    category: 'credit_card',
    provider_name: bank,
    description: `A premium credit card by ${bank} offering exclusive rewards and benefits for lifestyle and travel.`,
    image_url: `https://placehold.co/600x400/0A5F56/FFF?text=${encodeURIComponent(cleanName)}`,
    rating: getRandomFloat(3.5, 5.0),
    features: {
      annual_fee: annualFee === 0 ? 'Lifetime Free' : `₹${annualFee}`,
      reward_rate: `${getRandomFloat(1, 5)}%`,
      lounge_access: `${getRandomInt(0, 8)} Domestic/Quarter`,
      forex_markup: `${getRandomFloat(1.5, 3.5)}%`
    },
    pros: ['High Reward Rate', 'Complimentary Lounge Access', 'Fuel Surcharge Waiver'],
    cons: ['High Annual Fee', 'Invite Only'], // Standard cons
    trust_score: getRandomInt(80, 100),
    is_active: true
  };
}

function generateLoan(index: number) {
  const provider = getRandom(loanProviders);
  const type = 'Personal Loan';
  const name = `${provider} ${type}`;
  
  return {
    name: name,
    slug: `${provider.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-personal-loan-${index}`,
    category: 'loan',
    provider_name: provider,
    description: `Instant ${type} from ${provider} with competitive interest rates and quick disbursal.`,
    image_url: `https://placehold.co/600x400/D97706/FFF?text=${encodeURIComponent(name)}`,
    rating: getRandomFloat(3.8, 4.9),
    features: {
      interest_rate: `${getRandomFloat(10.5, 16.0)}% p.a.`,
      processing_fee: `${getRandomFloat(0.5, 2.5)}%`,
      tenure: '12-60 Months',
      max_amount: `₹${getRandomInt(5, 50)} Lakhs`
    },
    pros: ['Quick Disbursal', 'Minimal Documentation', 'Flexible Tenure'],
    cons: ['Processing Fee Applicable', 'Pre-closure charges'],
    trust_score: getRandomInt(75, 95),
    is_active: true
  };
}

function generateMutualFund(index: number) {
  const house = getRandom(fundHouses);
  const type = getRandom(fundTypes);
  const name = `${house} ${type}`;

  return {
    name: name,
    slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
    category: 'mutual_fund',
    provider_name: house,
    description: `A top-rated ${type} from ${house} aiming for long-term capital appreciation.`,
    image_url: `https://placehold.co/600x400/059669/FFF?text=${encodeURIComponent(name)}`,
    rating: getRandomFloat(3.5, 5.0),
    features: {
      returns_3yr: `${getRandomFloat(12, 25)}%`,
      expense_ratio: `${getRandomFloat(0.5, 1.5)}%`,
      min_sip: `₹${getRandomInt(1, 10) * 100}`,
      risk_level: 'Very High'
    },
    pros: ['Consistent Returns', 'Experienced Fund Manager', 'Low Expense Ratio'],
    cons: ['Market Risk', 'Exit Load'],
    trust_score: getRandomInt(85, 98),
    is_active: true
  };
}

async function seed() {
  console.log('🚀 Starting Mega Seed (100+ Products)...');

  const products = [];

  // 40 Credit Cards
  for (let i = 0; i < 40; i++) {
    products.push(generateCreditCard(i));
  }

  // 30 Loans
  for (let i = 0; i < 30; i++) {
    products.push(generateLoan(i));
  }

  // 30 Mutual Funds
  for (let i = 0; i < 30; i++) {
    products.push(generateMutualFund(i));
  }
  
  // Brokers (Static)
  const brokers = [
    {
       name: 'Zerodha Kite',
       slug: 'zerodha-kite-mega',
       category: 'broker',
       provider_name: 'Zerodha',
       description: 'India\'s #1 Discount Broker',
       image_url: 'https://placehold.co/600x400/3B82F6/FFF?text=Zerodha',
       rating: 4.8,
       features: { brokerage: '₹0 Eq Delivery', amc: '₹300/yr' },
       trust_score: 95
    },
    {
       name: 'Upstox Pro',
       slug: 'upstox-pro-mega',
       category: 'broker',
       provider_name: 'Upstox',
       description: 'Fast and reliable trading platform',
       image_url: 'https://placehold.co/600x400/3B82F6/FFF?text=Upstox',
       rating: 4.5,
       features: { brokerage: '₹20/order', amc: 'Free' },
       trust_score: 90
    }
  ];
  products.push(...brokers);

  console.log(`📦 Prepared ${products.length} products to insert.`);

  // Insert in chunks to avoid request size limits
  const chunkSize = 20;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    
    // Attempt upsert
    // Note: If 'cons' column is missing in DB (as noted in prev summary), we might want to omit it if error occurs. 
    // But let's try with it first. If it fails, we handle error.
    
    const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'slug' });
    
    if (error) {
        console.error(`❌ Error inserting chunk ${i/chunkSize + 1}:`, error.message);
        
        // Fallback: Try inserting without 'cons' and 'pros' if columns missing
        if (error.message.includes('column "cons"') || error.message.includes("Could not find the 'cons' column")) {
            console.log('⚠️ Retrying without pros/cons columns...');
            const strippedChunk = chunk.map(({ pros, cons, ...rest }) => rest);
            const { error: retryError } = await supabase.from('products').upsert(strippedChunk, { onConflict: 'slug' });
            
            if (retryError) {
                console.error(`❌ Retry 1 failed:`, retryError.message);
                
                // Fallback 2: Try without description as well
                if (retryError.message.includes('description')) {
                     console.log('⚠️ Retrying without description/pros/cons...');
                     const strippedChunk2 = strippedChunk.map(({ description, ...rest }) => rest);
                     const { error: retryError2 } = await supabase.from('products').upsert(strippedChunk2, { onConflict: 'slug' });
                     if (retryError2) {
                         console.error(`❌ Retry 2 failed:`, retryError2.message);
                     } else {
                         console.log(`✅ Chunk ${i/chunkSize + 1} inserted (minimal fields)`);
                     }
                }
            } else {
                console.log(`✅ Chunk ${i/chunkSize + 1} inserted (without pros/cons)`);
            }
        }
    } else {
        console.log(`✅ Chunk ${i/chunkSize + 1} inserted successfully`);
    }
  }

  console.log('✨ Mega Seed Complete!');
}

seed().catch(e => console.error(e));
