
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRODUCTS = [
  {
    name: "Zerodha Kite",
    slug: "zerodha-kite",
    category: "broker",
    rating: 4.8,
    features: ["Zero Brokerage on Delivery", "Clean UI", "Top Mobile App", "Direct Mutual Funds"],
    pricing: "₹0 Equity Delivery, ₹20 Intraday",
    pros: ["Market leader trust", "Simple interface", "Robust API"],
    cons: ["Occasional downtime", "No advisory"],
    cta_text: "Open Account",
    cta_url: "https://zerodha.com/open-account",
    icon_url: "https://zerodha.com/static/images/logo.svg"
  },
  {
    name: "Groww",
    slug: "groww",
    category: "broker",
    rating: 4.7,
    features: ["Free Account Opening", "Zero Maintenance", "US Stocks", "Instant Paperless"],
    pricing: "₹0 Account Opening, ₹20 per order",
    pros: ["Very beginner friendly", "US Stocks support", "Fast activation"],
    cons: ["Charts can be basic", "Customer support delays"],
    cta_text: "Get App",
    cta_url: "https://groww.in/",
    icon_url: "https://groww.in/groww-logo-270.png"
  },
  {
    name: "Upstox",
    slug: "upstox",
    category: "broker",
    rating: 4.6,
    features: ["Fast Execution", "Good Charts", "Margin Trading Facility", "IPO Application"],
    pricing: "₹0 Equity Delivery, ₹20 Intraday",
    pros: ["Ratan Tata backed", "Good for traders", "Margin funding"],
    cons: ["UI can be complex", "Aggressive marketing"],
    cta_text: "Sign Up",
    cta_url: "https://upstox.com/",
    icon_url: "https://upstox.com/app/themes/upstox/dist/img/logo/upstox-logo-new.svg"
  },
  {
    name: "Angel One",
    slug: "angel-one",
    category: "broker",
    rating: 4.5,
    features: ["Advisory Tips", "Smart API", "ARQ Prime", "Full Service"],
    pricing: "₹0 Equity Delivery, ₹20 Intraday",
    pros: ["Advisory services included", "Strong local presence", "Robo advisory"],
    cons: ["App feels cluttered", "Spam calls"],
    cta_text: "View Offer",
    cta_url: "https://angelone.in/",
    icon_url: "https://w3assets.angelone.in/wp-content/uploads/2024/04/Logo.svg"
  }
];

async function populateProducts() {
  console.log('🛍️ POPULATING PRODUCTS...');
  
  for (const product of PRODUCTS) {
    // Check if exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', product.slug)
      .single();

    if (existing) {
      console.log(`⏩ Skipping ${product.name} (Already exists)`);
      continue;
    }

    // Insert
    const { error } = await supabase
      .from('products')
      .insert({
        ...product,
        is_active: true,
        // featured_image: product.icon_url, // Map checking schema
        reviews_count: Math.floor(Math.random() * 500) + 100,
        popularity_score: Math.floor(Math.random() * 20) + 80
      });

    if (error) {
      console.error(`❌ Failed to add ${product.name}:`, error.message);
    } else {
      console.log(`✅ Added ${product.name}`);
    }
  }
  
  console.log('\n✨ Product Population Complete!');
}

populateProducts();
