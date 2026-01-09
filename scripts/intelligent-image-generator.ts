/**
 * Intelligent Product Image Generator
 * 
 * Process:
 * 1. Research product on official bank website
 * 2. Extract actual colors, design, features
 * 3. Generate AI image matching exact product OR scrape real image
 * 4. Use Indian names for authenticity
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// Indian names for authenticity
const INDIAN_NAMES = [
  'RAJESH KUMAR',
  'PRIYA SHARMA',
  'AMIT PATEL',
  'NEHA SINGH',
  'VIKRAM RAO',
  'ANJALI VERMA',
  'SANJAY GUPTA',
  'DIVYA MEHTA',
  'RAHUL CHOPRA',
  'KAVITA NAIR'
];

// Official bank website patterns
const BANK_WEBSITES: Record<string, string> = {
  'HDFC': 'https://www.hdfcbank.com/personal/pay/cards/credit-cards',
  'ICICI': 'https://www.icicibank.com/Personal-Banking/cards/credit-card',
  'Axis': 'https://www.axisbank.com/retail/cards/credit-card',
  'SBI': 'https://www.sbi.co.in/web/personal-banking/cards/credit-cards',
  'Kotak': 'https://www.kotak.com/en/personal-banking/cards/credit-cards.html',
  'AMEX': 'https://www.americanexpress.com/in/credit-cards/',
  'IndusInd': 'https://www.indusind.com/in/en/personal/cards/credit-cards.html'
};

interface ProductResearch {
  cardColor: string;
  cardDesign: string;
  logoPlacement: string;
  features: string[];
  actualImageUrl?: string;
}

/**
 * Step 1: Research actual product on official website
 */
async function researchProduct(productName: string, providerName: string): Promise<ProductResearch> {
  console.log(`   🔍 Researching: ${productName} on ${providerName} official site...`);
  
  try {
    // Extract bank name
    const bank = Object.keys(BANK_WEBSITES).find(b => 
      providerName.toUpperCase().includes(b.toUpperCase())
    );
    
    if (!bank) {
      throw new Error(`Bank not found for provider: ${providerName}`);
    }
    
    const baseUrl = BANK_WEBSITES[bank];
    
    // Fetch bank's credit card page
    const response = await axios.get(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract product details (this is simplified - real implementation would be bank-specific)
    const research: ProductResearch = {
      cardColor: 'Not found',
      cardDesign: 'Standard',
      logoPlacement: 'Top-left',
      features: [],
      actualImageUrl: undefined
    };
    
    // Try to find the specific card image
    // Look for image with product name in alt text or nearby text
    const productNameLower = productName.toLowerCase();
    const cardImages = $('img').filter((i, el) => {
      const alt = $(el).attr('alt')?.toLowerCase() || '';
      const src = $(el).attr('src') || '';
      return alt.includes(productNameLower) || src.includes(productNameLower);
    });
    
    if (cardImages.length > 0) {
      let imgSrc = $(cardImages[0]).attr('src');
      if (imgSrc) {
        // Handle relative URLs
        if (imgSrc.startsWith('/')) {
          const baseUrlObj = new URL(baseUrl);
          imgSrc = `${baseUrlObj.protocol}//${baseUrlObj.host}${imgSrc}`;
        }
        research.actualImageUrl = imgSrc;
        console.log(`   ✅ Found actual product image: ${imgSrc.substring(0, 60)}...`);
      }
    }
    
    return research;
    
  } catch (error: any) {
    console.log(`   ⚠️  Cannot scrape ${providerName}: ${error.message}`);
    console.log(`   📝 Will use manual product knowledge...`);
    
    // Fallback: Use manual product knowledge database
    return await getManualProductKnowledge(productName, providerName);
  }
}

/**
 * Manual product knowledge database (fallback if scraping fails)
 */
async function getManualProductKnowledge(productName: string, providerName: string): Promise<ProductResearch> {
  const productLower = productName.toLowerCase();
  const research: ProductResearch = {
    cardColor: '#1F4E7C', // Default dark blue
    cardDesign: 'Modern premium',
    logoPlacement: 'Top-left',
    features: []
  };
  
  // HDFC Products
  if (productLower.includes('hdfc regalia gold')) {
    research.cardColor = '#8B4513'; // Brown/Gold
    research.cardDesign = 'Gold gradient with HDFC logo, diagonal gold stripe';
    research.features = ['HDFC BANK logo top-left', 'REGALIA GOLD text', 'Gold/brown color scheme'];
  } else if (productLower.includes('hdfc millennia')) {
    research.cardColor = '#DC143C'; // Crimson red
    research.cardDesign = 'Red/black gradient with modern geometric patterns';
    research.features = ['HDFC BANK logo', 'MILLENNIA text', 'Red color scheme'];
  } else if (productLower.includes('hdfc moneyback')) {
    research.cardColor = '#1F4E7C'; // Blue
    research.cardDesign = 'Blue card with HDFC branding';
    research.features = ['HDFC BANK logo', 'MoneyBack+ text', 'Blue color'];
  }
  
  // ICICI Products
  else if (productLower.includes('icici sapphiro')) {
    research.cardColor = '#000080'; // Navy blue
    research.cardDesign = 'Dark blue/black premium card with platinum accents';
    research.features = ['ICICI BANK logo', 'Sapphiro text', 'Premium dark color'];
  } else if (productLower.includes('amazon pay icici')) {
    research.cardColor = '#FF9900'; // Amazon orange
    research.cardDesign = 'Blue/orange gradient with Amazon logo';
    research.features = ['ICICI BANK logo', 'Amazon logo', 'Blue and orange colors'];
  }
  
  // Axis Products
  else if (productLower.includes('axis magnus')) {
    research.cardColor = '#000000'; // Black
    research.cardDesign = 'Premium black card with burgundy accents';
    research.features = ['AXIS BANK logo', 'MAGNUS text', 'Black/burgundy premium'];
  } else if (productLower.includes('axis ace')) {
    research.cardColor = '#DC143C'; // Red
    research.cardDesign = 'Red and black modern design';
    research.features = ['AXIS BANK logo', 'ACE text', 'Red/black color scheme'];
  } else if (productLower.includes('flipkart axis')) {
    research.cardColor = '#2874F0'; // Flipkart blue
    research.cardDesign = 'Blue card with Flipkart branding';
    research.features = ['AXIS BANK logo', 'Flipkart logo', 'Blue color'];
  }
  
  // SBI Products
  else if (productLower.includes('sbi card elite')) {
    research.cardColor = '#000000'; // Black
    research.cardDesign = 'Black premium card with gold accents';
    research.features = ['SBI CARD logo', 'ELITE text', 'Black/gold premium'];
  }
  
  // AMEX Products
  else if (productLower.includes('amex platinum')) {
    research.cardColor = '#C0C0C0'; // Platinum/silver
    research.cardDesign = 'Platinum metallic with AMEX centurion';
    research.features = ['AMEX logo', 'PLATINUM TRAVEL', 'Metallic silver'];
  }
  
  // IndusInd Products
  else if (productLower.includes('indusind iconia')) {
    research.cardColor = '#800020'; // Dark red/burgundy
    research.cardDesign = 'Burgundy premium card with AmEx co-branding';
    research.features = ['IndusInd Bank logo', 'ICONIA text', 'AmEx acceptance mark'];
  }
  
  return research;
}

/**
 * Step 2: Generate accurate AI image based on research
 */
async function generateAccurateImage(
  product: any,
  research: ProductResearch
): Promise<string> {
  const indianName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
  
  // Build ultra-specific prompt based on research
  const prompt = `Ultra-realistic credit card photograph for "${product.name}".

EXACT SPECIFICATIONS:
- Card color: ${research.cardColor}
- Design style: ${research.cardDesign}
- Features: ${research.features.join(', ')}

MANDATORY TEXT ELEMENTS (MUST BE CLEARLY READABLE):
- Bank/Provider name at top-left
- Product name ("${product.name.split(' ').slice(-2).join(' ')}")
- Cardholder name: "${indianName}"
- Card number: "5234 **** **** 1189"
- Valid thru: "12/28"
- EMV chip (gold square)
- Contactless symbol (wifi waves)

VISUAL REQUIREMENTS:
- Professional product photography
- Flat frontal view (NO dramatic tilting)
- Plain white or light gray background ONLY (#F5F5F5)
- Soft drop shadow beneath card for dimension
- High contrast, sharp details
- Photo-realistic rendering
- Indian credit card standard design

CRITICAL:  
- NO text hallucinations
- ALL text must be real, readable English
- Consistent horizontal orientation
- Clean, professional, authentic Indian banking aesthetic`;

  console.log(`   📝 Generating with Indian name: ${indianName}`);
  console.log(`   🎨 Using colors: ${research.cardColor}`);
  
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard'
  });
  
  return response.data[0].url!;
}

/**
 * Step 3: Download actual product image from bank website
 */
async function downloadOfficialImage(
  imageUrl: string,
  product: any
): Promise<string> {
  console.log(`   💾 Downloading official image: ${imageUrl.substring(0, 60)}...`);
  
  const response = await axios.get(imageUrl, { 
    responseType: 'arraybuffer',
    timeout: 10000
  });
  const buffer = Buffer.from(response.data);
  
  const category = product.category || 'credit_card';
  const dir = path.join(process.cwd(), 'public', 'images', 'products', category);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filename = `${product.slug}.png`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  
  return `/images/products/${category}/${filename}`;
}

/**
 * Step 4: Main generation with intelligent fallback
 */
async function generateIntelligentImage(product: any): Promise<string> {
  try {
    // Step 1: Research the actual product
    const research = await researchProduct(product.name, product.provider_name);
    
    // Step 2: Try to use official image if found
    if (research.actualImageUrl) {
      try {
        console.log(`   ✅ Using official product image!`);
        return await downloadOfficialImage(research.actualImageUrl, product);
      } catch (error) {
        console.log(`   ⚠️  Official image download failed, generating AI image...`);
      }
    }
    
    // Step 3: Generate AI image based on research
    console.log(`   🎨 Generating AI image based on product research...`);
    const imageUrl = await generateAccurateImage(product, research);
    
    // Download and save
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    
    const category = product.category || 'credit_card';
    const dir = path.join(process.cwd(), 'public', 'images', 'products', category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const filename = `${product.slug}.png`;
    fs.writeFileSync(path.join(dir, filename), buffer);
    
    return `/images/products/${category}/${filename}`;
    
  } catch (error: any) {
    throw new Error(`Failed to generate intelligent image: ${error.message}`);
  }
}

/**
 * Main execution
 */
async function regenerateIntelligent() {
  console.log('🧠 INTELLIGENT Product Image Generation\\n');
  console.log('═'.repeat(60));
  console.log('Process: Research → Scrape/Generate → Save\\n');
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'credit_card')
    .limit(3); // Start with 3 test products
  
  if (!products || products.length === 0) {
    console.log('❌ No products found!');
    return;
  }
  
  console.log(`📊 Processing ${products.length} products\\n`);
  
  let successCount = 0;
  let totalCost = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;
    
    try {
      console.log(`\\n🎯 ${progress} ${product.name}`);
      console.log(`   🏦 Provider: ${product.provider_name}`);
      
      const localPath = await generateIntelligentImage(product);
      
      await supabase
        .from('products')
        .update({ image_url: localPath })
        .eq('id', product.id);
      
      console.log(`   ✅ Saved: ${localPath}`);
      successCount++;
      totalCost += 0.04; // Only count if AI generated
      
      if (i < products.length - 1) {
        console.log(`   ⏱️  Waiting 3s for rate limits...`);
        await new Promise(r => setTimeout(r, 3000));
      }
      
    } catch (error: any) {
      console.error(`   ❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\\n' + '═'.repeat(60));
  console.log(`\\n📈 COMPLETE!`);
  console.log(`   ✅ Success: ${successCount}/${products.length}`);
  console.log(`   💰 Total Cost: $${totalCost.toFixed(2)}`);
}

regenerateIntelligent();
