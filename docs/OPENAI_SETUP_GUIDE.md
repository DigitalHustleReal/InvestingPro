# OpenAI API Setup Guide
## Quick Start for Content Generation

### Step 1: Get Your API Key (5 mins)

1. Go to: https://platform.openai.com/api-keys
2. Sign in (or create account)
3. Click **"Create new secret key"**
4. Name it: `InvestingPro-Content-Gen`
5. **Copy the key** (starts with `sk-proj-...`)
6. **IMPORTANT:** Save it somewhere - you can't see it again!

---

### Step 2: Add Credits (2 mins)

1. Go to: https://platform.openai.com/settings/organization/billing
2. Click **"Add payment method"**
3. Add credit card
4. **Buy credits:** Start with $10 (₹800)
   - This will generate ~5,000 product descriptions!
   - Cost: ~$0.002 per description = ₹0.16 each

---

### Step 3: Save API Key to Project (1 min)

Create `.env.local` file in your project root:

```bash
# In project root: c:\Users\shivp\Desktop\InvestingPro_App
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**Security:** This file is already in `.gitignore` - won't be committed!

---

### Step 4: Install OpenAI SDK (1 min)

```bash
npm install openai
```

---

### Step 5: Test API Connection (5 mins)

Create test script: `scripts/test-openai.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testConnection() {
  console.log('🔍 Testing OpenAI connection...\n');
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cheaper model for testing
      messages: [
        {
          role: 'user',
          content: 'Say "API connected successfully!" and nothing else.'
        }
      ],
      max_tokens: 10
    });
    
    console.log('✅ SUCCESS!');
    console.log('Response:', response.choices[0].message.content);
    console.log('\n💰 Cost:', (response.usage?.total_tokens || 0) * 0.000001, 'USD');
    
  } catch (error) {
    console.error('❌ ERROR:', error);
  }
}

testConnection();
```

Run it:
```bash
npx ts-node scripts/test-openai.ts
```

**Expected output:**
```
🔍 Testing OpenAI connection...
✅ SUCCESS!
Response: API connected successfully!
💰 Cost: 0.000015 USD
```

---

### Step 6: Generate First Product Description (10 mins)

Create: `scripts/generate-single-description.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateDescription() {
  const creditCard = {
    name: 'HDFC Regalia Credit Card',
    issuer: 'HDFC Bank',
    category: 'Premium Lifestyle',
    annualFee: '₹2,500',
    joiningBonus: '10,000 reward points',
    rewardsRate: '4 points per ₹150'
  };
  
  const prompt = `You are a financial content writer for InvestingPro.in, India's premier personal finance platform.

Write a compelling, professional product description for this credit card:

**Card Details:**
- Name: ${creditCard.name}
- Issuer: ${creditCard.issuer}
- Category: ${creditCard.category}
- Annual Fee: ${creditCard.annualFee}
- Joining Bonus: ${creditCard.joiningBonus}
- Rewards Rate: ${creditCard.rewardsRate}

**Requirements:**
- Length: 150-200 words
- Tone: Professional yet accessible
- Target audience: Indian middle-class professionals
- Include: Key benefits, ideal user profile, standout features
- Format: 2-3 short paragraphs
- NO marketing fluff - factual and helpful
- Use Indian English (crore, lakh, etc.)

Write ONLY the description, no extra commentary.`;

  console.log('🤖 Generating description...\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500
  });

  const description = response.choices[0].message.content;
  
  console.log('📝 Generated Description:\n');
  console.log(description);
  console.log('\n---\n');
  console.log('📊 Stats:');
  console.log('- Tokens used:', response.usage?.total_tokens);
  console.log('- Cost: ₹', ((response.usage?.total_tokens || 0) * 0.000001 * 83).toFixed(4));
  console.log('- Time: ~2 seconds');
}

generateDescription();
```

Run it:
```bash
npx ts-node scripts/generate-single-description.ts
```

---

### ✅ Checklist

- [ ] OpenAI account created
- [ ] API key generated and saved
- [ ] $10 credits added
- [ ] `.env.local` file created with API key
- [ ] `openai` npm package installed
- [ ] Test script run successfully
- [ ] First description generated

**Once done, tell me and we'll move to Task 3: Bulk content generation!** 🚀
