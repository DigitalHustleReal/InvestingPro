
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

// --- Data Arrays ---
const banks = ['HDFC Bank', 'SBI Card', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'IDFC First', 'IndusInd Bank', 'Yes Bank', 'RBL Bank', 'Federal Bank', 'AU Small Finance', 'Bank of Baroda'];
const cardNames = ['Regalia', 'Millennia', 'SimplyCLICK', 'Ace', 'Sapphiro', 'Rubyx', 'Coral', 'Privilege', 'Select', 'Platinum', 'Gold', 'Titanium', 'Black', 'Signature', 'Infinia', 'Magnus', 'Tata Neu Plus'];
const loanProviders = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Bajaj Finserv', 'Tata Capital', 'Aditya Birla Capital', 'Kotak Mahindra', 'Axis Bank', 'IDFC First', 'Poonawalla Fincorp', 'LIC Housing Finance', 'L&T Finance'];
const fundHouses = ['SBI Mutual Fund', 'HDFC Mutual Fund', 'ICICI Prudential', 'Axis Mutual Fund', 'Nippon India', 'Kotak Mutual Fund', 'UTI Mutual Fund', 'Mirae Asset', 'DSP Mutual Fund', 'Tata Mutual Fund', 'Aditya Birla Sun Life', 'PPFAS Mutual Fund'];
const fundTypes = ['Bluechip Fund', 'Midcap Fund', 'Small Cap Fund', 'Flexi Cap Fund', 'Tax Saver ELSS', 'Liquid Fund', 'Balanced Advantage Fund', 'Large Cap Fund', 'Multi Cap Fund', 'Index Fund', 'Nifty 50 Index', 'Nifty Next 50'];
const insurers = ['LIC', 'HDFC Life', 'ICICI Prudential Life', 'SBI Life', 'Max Life', 'Bajaj Allianz Life', 'Tata AIA', 'Aditya Birla Sun Life', 'PNB MetLife', 'Kotak Life'];
const healthInsurers = ['Star Health', 'Care Health', 'HDFC ERGO', 'ICICI Lombard', 'Niva Bupa', 'ManipalCigna', 'Bajaj Allianz GI', 'New India Assurance', 'National Insurance', 'Aditya Birla Health'];
const fdProviders = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak', 'IDFC First', 'RBL Bank', 'IndusInd Bank', 'Bajaj Finance', 'Shriram Finance', 'Mahindra Finance', 'PNB Housing'];
const brokers = ['Zerodha', 'Groww', 'Upstox', 'Angel One', '5paisa', 'ICICI Direct', 'HDFC Securities', 'Kotak Securities', 'Motilal Oswal', 'Sharekhan', 'Dhan', 'Fyers'];

// --- Utility Functions ---
const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number, decimals: number = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// --- Generators (No affiliate_link/official_link - uses /go/[slug] pattern) ---

function generateCreditCard(index: number) {
  const bank = getRandom(banks);
  const cardName = getRandom(cardNames);
  const name = `${bank} ${cardName}`;
  const annualFee = getRandomInt(0, 5000);
  
  return {
    name,
    slug: `${slugify(name)}-${index}`,
    category: 'credit_card',
    provider_name: bank,
    description: `Premium credit card by ${bank} with excellent rewards on shopping, dining, and travel. Enjoy exclusive benefits and lounge access.`,
    image_url: `/assets/products/credit-card-placeholder.png`,
    rating: getRandomFloat(3.8, 4.9),
    features: {
      annual_fee: annualFee === 0 ? 'Lifetime Free' : `₹${annualFee}`,
      joining_fee: annualFee === 0 ? '₹0' : `₹${annualFee}`,
      reward_rate: `${getRandomFloat(1, 5)}%`,
      lounge_access: `${getRandomInt(2, 8)} per quarter`,
      forex_markup: `${getRandomFloat(1.5, 3.5)}%`,
      welcome_bonus: annualFee > 2000 ? `${getRandomInt(5000, 25000)} bonus points` : undefined
    },
    pros: ['High reward rate on spends', 'Complimentary lounge access', 'Fuel surcharge waiver', 'Movie ticket discounts'],
    cons: annualFee > 0 ? ['Annual fee applicable', 'Income requirement'] : ['Limited lounge access'],
    trust_score: getRandomInt(80, 98),
    is_active: true
  };
}

function generateLoan(index: number) {
  const provider = getRandom(loanProviders);
  const loanTypes = ['Personal Loan', 'Home Loan', 'Car Loan', 'Business Loan', 'Education Loan'];
  const loanType = getRandom(loanTypes);
  const name = `${provider} ${loanType}`;
  
  const interestRate = loanType === 'Home Loan' ? getRandomFloat(8.5, 9.5) : 
                       loanType === 'Car Loan' ? getRandomFloat(8.0, 10.5) :
                       getRandomFloat(10.5, 18.0);
  
  return {
    name,
    slug: `${slugify(name)}-${index}`,
    category: 'loan',
    provider_name: provider,
    description: `Get instant ${loanType.toLowerCase()} from ${provider} with competitive interest rates, quick approval, and flexible repayment options.`,
    image_url: `/assets/products/loan-placeholder.png`,
    rating: getRandomFloat(3.8, 4.8),
    features: {
      interest_rate: `${interestRate}% p.a.`,
      processing_fee: `${getRandomFloat(0.5, 2.5)}%`,
      tenure: loanType === 'Home Loan' ? '5-30 years' : loanType === 'Car Loan' ? '1-7 years' : '12-60 months',
      max_amount: loanType === 'Home Loan' ? `₹${getRandomInt(50, 500)} Lakhs` : `₹${getRandomInt(5, 50)} Lakhs`,
      min_salary: `₹${getRandomInt(15, 30)},000/month`
    },
    pros: ['Quick disbursal', 'Minimal documentation', 'Flexible EMI options', 'Online application'],
    cons: ['Processing fee applicable', 'Pre-closure charges may apply'],
    trust_score: getRandomInt(75, 95),
    is_active: true
  };
}

function generateMutualFund(index: number) {
  const house = getRandom(fundHouses);
  const fundType = getRandom(fundTypes);
  const name = `${house} ${fundType}`;

  return {
    name,
    slug: `${slugify(name)}-${index}`,
    category: 'mutual_fund',
    provider_name: house,
    description: `${fundType} by ${house} focused on long-term capital appreciation through diversified equity investments.`,
    image_url: `/assets/products/mutual-fund-placeholder.png`,
    rating: getRandomFloat(3.8, 4.9),
    features: {
      returns_1yr: `${getRandomFloat(8, 35)}%`,
      returns_3yr: `${getRandomFloat(12, 25)}% CAGR`,
      returns_5yr: `${getRandomFloat(14, 22)}% CAGR`,
      expense_ratio: `${getRandomFloat(0.3, 1.8)}%`,
      min_sip: `₹${getRandomInt(1, 5) * 100}`,
      min_lumpsum: `₹${getRandomInt(1, 5) * 1000}`,
      risk_level: fundType.includes('Small') || fundType.includes('Midcap') ? 'Very High' : 'Moderately High',
      aum: `₹${getRandomInt(5000, 80000)} Cr`
    },
    pros: ['Consistent track record', 'Experienced fund management', 'Good diversification', 'SIP available from ₹100'],
    cons: ['Subject to market risk', 'Exit load for early redemption'],
    trust_score: getRandomInt(82, 98),
    is_active: true
  };
}

function generateInsurance(index: number) {
  const isHealth = index % 2 === 0;
  const insurer = isHealth ? getRandom(healthInsurers) : getRandom(insurers);
  const planType = isHealth ? 'Health Insurance' : 'Term Life Insurance';
  const name = `${insurer} ${isHealth ? 'Health Shield' : 'Term Plan'}`;

  return {
    name,
    slug: `${slugify(name)}-${index}`,
    category: 'insurance',
    provider_name: insurer,
    description: `Comprehensive ${planType.toLowerCase()} from ${insurer} offering extensive coverage and cashless claim settlement.`,
    image_url: `/assets/products/insurance-placeholder.png`,
    rating: getRandomFloat(4.0, 4.8),
    features: {
      cover_amount: isHealth ? `₹${getRandomInt(3, 25)} Lakhs` : `₹${getRandomInt(50, 200)} Lakhs`,
      premium: isHealth ? `₹${getRandomInt(8, 25)}K/year` : `₹${getRandomInt(5, 15)}K/year`,
      claim_ratio: `${getRandomFloat(95, 99)}%`,
      insurance_type: planType,
      no_claim_bonus: isHealth ? 'Up to 100%' : 'N/A',
      coverage: isHealth ? 'Individual/Family' : 'Life Cover'
    },
    pros: ['High claim settlement ratio', 'Cashless hospitals network', 'No medical test up to 45 years', 'Tax benefits under 80C/80D'],
    cons: ['Waiting period for pre-existing diseases', 'Co-payment in some plans'],
    trust_score: getRandomInt(85, 98),
    is_active: true
  };
}

function generateFixedDeposit(index: number) {
  const provider = getRandom(fdProviders);
  const isBankFD = !provider.includes('Finance');
  
  return {
    name: `${provider} Fixed Deposit`,
    slug: `${slugify(provider)}-fd-${index}`,
    category: 'insurance', // Using insurance as category for FD/savings products since DB constraint limits categories
    provider_name: provider,
    description: `Safe and secure fixed deposit by ${provider} with guaranteed returns and flexible tenure options.`,
    image_url: `/assets/products/fd-placeholder.png`,
    rating: getRandomFloat(4.0, 4.8),
    features: {
      interest_rate: isBankFD ? `${getRandomFloat(6.5, 7.5)}% p.a.` : `${getRandomFloat(7.5, 9.0)}% p.a.`,
      senior_rate: `+0.5% extra`,
      tenure: '7 days to 10 years',
      min_deposit: '₹1,000',
      tax_saver: 'Available (5 year lock-in)',
      dicgc_insured: isBankFD ? 'Yes (up to ₹5 Lakh)' : 'No',
      product_type: 'fixed_deposit'
    },
    pros: ['Guaranteed returns', 'Flexible tenure', isBankFD ? 'DICGC insured' : 'Higher interest rates', 'Senior citizen benefits'],
    cons: ['Premature withdrawal penalty', 'Interest taxable'],
    trust_score: getRandomInt(85, 98),
    is_active: true
  };
}

function generateDematAccount(index: number) {
  const broker = brokers[index % brokers.length];
  
  return {
    name: `${broker} Demat Account`,
    slug: slugify(broker),
    category: 'broker', // broker is valid category
    provider_name: broker,
    description: `Open a free demat & trading account with ${broker}. Trade in stocks, mutual funds, IPOs, and more with India's leading broker.`,
    image_url: `/assets/products/demat-placeholder.png`,
    rating: getRandomFloat(4.2, 4.9),
    features: {
      account_opening_fee: '₹0',
      amc: broker === 'Zerodha' ? '₹300/year' : '₹0',
      equity_delivery: '₹0',
      intraday_brokerage: `₹20 per order or ${getRandomFloat(0.01, 0.03)}%`,
      platforms: 'Web, Mobile App, Desktop',
      ipo_access: 'Yes - Free',
      mutual_funds: 'Direct - Zero commission'
    },
    pros: ['Free account opening', 'Zero delivery brokerage', 'Easy IPO application', 'User-friendly platform', 'Free mutual fund investing'],
    cons: ['Intraday charges apply', broker === 'Zerodha' ? 'AMC of ₹300/year' : 'Limited research tools'],
    trust_score: getRandomInt(88, 98),
    is_active: true
  };
}

function generatePPFNPS(index: number) {
  const isPPF = index % 2 === 0;
  const provider = isPPF ? 'Government of India' : 'PFRDA';
  
  return {
    name: isPPF ? 'PPF Account' : 'NPS Tier 1 Account',
    slug: isPPF ? `ppf-account-${index}` : `nps-tier1-${index}`,
    category: 'insurance', // Using insurance for savings/pension products - DB has limited categories
    provider_name: provider,
    description: isPPF 
      ? 'Public Provident Fund - A safe, long-term investment backed by Government of India with tax-free returns.'
      : 'National Pension System - A voluntary retirement savings scheme with market-linked returns and tax benefits.',
    image_url: `/assets/products/savings-placeholder.png`,
    rating: isPPF ? 4.7 : 4.5,
    features: {
      interest_rate: isPPF ? '7.1% p.a. (Q4 2025-26)' : 'Market-linked (8-12% historical)',
      lock_in: isPPF ? '15 years' : 'Till retirement (60)',
      min_investment: isPPF ? '₹500/year' : '₹1,000/year',
      max_investment: isPPF ? '₹1.5 Lakh/year' : 'No limit',
      tax_benefit: isPPF ? 'EEE (Exempt-Exempt-Exempt)' : 'Additional ₹50,000 under 80CCD(1B)',
      scheme_type: isPPF ? 'Small Savings Scheme' : 'Pension Scheme'
    },
    pros: isPPF 
      ? ['100% safe - Govt backed', 'Tax-free interest', 'EEE status - fully tax exempt', 'Loan facility available']
      : ['Additional tax deduction of ₹50,000', 'Market-linked higher returns', 'Portable across jobs', 'Low-cost pension fund'],
    cons: isPPF 
      ? ['15 year lock-in', 'Lower returns vs equity', 'No premature closure']
      : ['Market risk on returns', 'Money locked till 60', 'Complex withdrawal rules'],
    trust_score: isPPF ? 99 : 95,
    is_active: true
  };
}

// --- MAIN SEED FUNCTION ---
async function seed() {
  console.log('🚀 Starting Mega Seed (200+ Products)...\n');

  const products: any[] = [];

  // 50 Credit Cards
  console.log('💳 Generating 50 Credit Cards...');
  for (let i = 0; i < 50; i++) products.push(generateCreditCard(i));

  // 40 Loans  
  console.log('🏦 Generating 40 Loans...');
  for (let i = 0; i < 40; i++) products.push(generateLoan(i));

  // 40 Mutual Funds
  console.log('📈 Generating 40 Mutual Funds...');
  for (let i = 0; i < 40; i++) products.push(generateMutualFund(i));

  // 30 Insurance
  console.log('🛡️ Generating 30 Insurance...');
  for (let i = 0; i < 30; i++) products.push(generateInsurance(i));

  // 20 Fixed Deposits
  console.log('🏧 Generating 20 Fixed Deposits...');
  for (let i = 0; i < 20; i++) products.push(generateFixedDeposit(i));

  // 12 Demat Accounts (one per broker)
  console.log('📊 Generating 12 Demat Accounts...');
  for (let i = 0; i < brokers.length; i++) products.push(generateDematAccount(i));

  // 10 PPF/NPS
  console.log('🎯 Generating 10 PPF/NPS Schemes...');
  for (let i = 0; i < 10; i++) products.push(generatePPFNPS(i));

  console.log(`\n📦 Total: ${products.length} products ready to insert.\n`);

  // Insert in chunks
  const chunkSize = 25;
  let success = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    
    const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'slug' });
    
    if (error) {
      console.error(`❌ Chunk ${Math.floor(i/chunkSize) + 1} failed: ${error.message}`);
      failed += chunk.length;
    } else {
      console.log(`✅ Chunk ${Math.floor(i/chunkSize) + 1} - ${chunk.length} products inserted`);
      success += chunk.length;
    }
  }

  console.log(`\n✨ Mega Seed Complete!`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
}

seed().catch(e => console.error(e));
