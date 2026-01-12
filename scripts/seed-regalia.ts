
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const card = {
  slug: 'hdfc-regalia-gold',
  name: 'HDFC Regalia Gold Credit Card',
  bank: 'HDFC Bank',
  type: 'Premium',
  description: 'A premium credit card with luxury travel benefits and accelerated rewards.',
  rating: 4.8,
  annual_fee: 2500,
  joining_fee: 2500,
  rewards: ['User 5X Reward Points at M&S, Myntra, Nykaa', '4 Reward Points on every ₹150 spent'],
  pros: ['Complimentary Club Vistara Silver Tier', '12 complimentary airport lounge access'],
  cons: ['High annual fee', 'Invite only for some users'],
  apply_link: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'
};

async function seed() {
  const { error } = await supabase.from('credit_cards').upsert(card, { onConflict: 'slug' });
  if (error) console.error('Error seeding card:', error);
  else console.log('Successfully seeded HDFC Regalia Gold!');
}

seed();
