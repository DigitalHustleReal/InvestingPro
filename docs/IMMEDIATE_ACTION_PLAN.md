# Immediate Action Plan: Critical Fixes (Next 30 Days)

## Priority 1: Make AI Content Generation Operational

### Current Problem
`lib/api.ts` has a mock `InvokeLLM` function that just returns fake data.

### Solution

**Step 1: Install OpenAI SDK**
```bash
npm install openai
```

**Step 2: Update `lib/api.ts`**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const api = {
  integrations: {
    Core: {
      InvokeLLM: async ({ prompt }: { prompt: string }) => {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a financial content writer for an Indian investment platform. Always respond in valid JSON format."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 2000
          });
          
          return JSON.parse(response.choices[0].message.content || '{}');
        } catch (error) {
          console.error('AI Generation Error:', error);
          throw error;
        }
      },
      // ... rest of code
    }
  }
}
```

**Step 3: Add Environment Variable**
```bash
# .env.local
OPENAI_API_KEY=sk-your-key-here
```

---

## Priority 2: Connect Python Scrapers to Supabase

### Current Problem
Python scrapers exist but data goes nowhere. Need to write to Supabase.

### Solution

**Step 1: Create Supabase Writer**
```python
# lib/scraper/supabase_writer.py
import os
from supabase import create_client, Client
from typing import Dict, List

class SupabaseWriter:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        self.supabase: Client = create_client(url, key)
    
    def write_mutual_fund(self, fund_data: Dict):
        """Write mutual fund data to Supabase"""
        try:
            # Check if exists
            existing = self.supabase.table('assets').select('id').eq('slug', fund_data['slug']).execute()
            
            if existing.data:
                # Update
                self.supabase.table('assets').update({
                    'metadata': fund_data,
                    'updated_at': 'now()'
                }).eq('slug', fund_data['slug']).execute()
            else:
                # Insert
                self.supabase.table('assets').insert({
                    'name': fund_data['name'],
                    'slug': fund_data['slug'],
                    'category': 'mutual_funds',
                    'provider': fund_data.get('fund_house', ''),
                    'metadata': fund_data
                }).execute()
        except Exception as e:
            print(f"Error writing fund {fund_data.get('name')}: {e}")
    
    def write_credit_card(self, card_data: Dict):
        """Write credit card data to Supabase"""
        # Similar implementation
        pass
```

**Step 2: Update Pipeline**
```python
# lib/scraper/pipeline.py
from supabase_writer import SupabaseWriter

class DataPipeline:
    def __init__(self):
        self.scraper = ReviewScraper()
        self.analyzer = ReviewAnalyzer()
        self.writer = SupabaseWriter()  # Add this
    
    def process_product(self, product_name: str, company_name: str, product_id: str):
        # ... existing scraping code ...
        
        # Step 5: Write to Supabase (NEW)
        print("Step 5: Writing to Supabase...")
        self.writer.write_mutual_fund(final_data)
```

**Step 3: Create API Route for Scraping**
```typescript
// app/api/scraper/run/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  const { type, secret } = await request.json();
  
  // Security: Check secret key
  if (secret !== process.env.SCRAPER_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Run Python scraper
    const { stdout, stderr } = await execAsync(
      `cd lib/scraper && python pipeline.py --type ${type}`
    );
    
    return NextResponse.json({ 
      success: true, 
      output: stdout,
      error: stderr 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

**Step 4: Set Up Vercel Cron**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/scrape-mutual-funds",
      "schedule": "0 18 * * *"
    }
  ]
}
```

```typescript
// app/api/cron/scrape-mutual-funds/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // Trigger scraper
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/scraper/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'mutual_funds',
      secret: process.env.SCRAPER_SECRET
    })
  });
  
  return NextResponse.json({ success: true });
}
```

---

## Priority 3: Implement Multi-Language Content

### Current Problem
Language switcher exists but content isn't translated.

### Solution

**Step 1: Install next-intl**
```bash
npm install next-intl
```

**Step 2: Set Up i18n**
```typescript
// i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

**Step 3: Create Translation Files**
```json
// messages/hi.json
{
  "common": {
    "compare": "तुलना करें",
    "calculate": "गणना करें",
    "learn": "सीखें"
  },
  "products": {
    "mutualFunds": "म्यूचुअल फंड",
    "creditCards": "क्रेडिट कार्ड"
  }
}
```

**Step 4: Use in Components**
```typescript
// app/[locale]/mutual-funds/page.tsx
import { useTranslations } from 'next-intl';

export default function MutualFundsPage() {
  const t = useTranslations('products');
  
  return <h1>{t('mutualFunds')}</h1>;
}
```

**Step 5: AI Translation Pipeline**
```typescript
// lib/translations/ai-translator.ts
export async function translateContent(
  content: string,
  targetLang: string
): Promise<string> {
  const prompt = `Translate this financial content to ${targetLang}. 
  Maintain technical accuracy and cultural context.
  
  Content: ${content}`;
  
  const response = await api.integrations.Core.InvokeLLM({ prompt });
  return response.translated_text;
}
```

---

## Priority 4: Enhance Ranking Algorithm

### Current Problem
Basic static scoring, no personalization.

### Solution

**Step 1: Add User Behavior Tracking**
```typescript
// lib/analytics/track.ts
export function trackProductView(productId: string, userId?: string) {
  // Track in Supabase
  supabase.from('product_views').insert({
    product_id: productId,
    user_id: userId,
    viewed_at: new Date().toISOString()
  });
}

export function trackProductClick(productId: string, userId?: string) {
  supabase.from('product_clicks').insert({
    product_id: productId,
    user_id: userId,
    clicked_at: new Date().toISOString()
  });
}
```

**Step 2: Enhanced Ranking with Behavior**
```typescript
// lib/ranking/algorithm.ts
export function scoreCreditCardWithBehavior(
  card: CreditCard,
  allCards: CreditCard[],
  userBehavior?: UserBehavior
): ProductScore {
  const baseScore = scoreCreditCard(card, allCards);
  
  if (userBehavior) {
    // Boost score based on user clicks
    const clickBoost = userBehavior.clickRate * 5;
    // Boost based on conversions
    const conversionBoost = userBehavior.conversionRate * 10;
    
    baseScore.totalScore += clickBoost + conversionBoost;
  }
  
  return baseScore;
}
```

---

## Priority 5: Add Error Handling

### Current Problem
No error boundaries, poor error handling.

### Solution

**Step 1: Create Error Boundary**
```typescript
// components/common/ErrorBoundary.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to Sentry or logging service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <Button onClick={() => this.setState({ hasError: false })}>
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Step 2: Wrap App**
```typescript
// app/layout.tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## Quick Wins (This Week)

1. **Add Loading States** - Improve UX
2. **Implement Skeleton Screens** - Better perceived performance
3. **Add Toast Notifications** - Better user feedback
4. **Optimize Images** - Use Next.js Image component everywhere
5. **Add Meta Descriptions** - Improve SEO for existing pages

---

## Testing Checklist

Before deploying each fix:
- [ ] Test in development
- [ ] Check error handling
- [ ] Verify data flow
- [ ] Test edge cases
- [ ] Check performance impact
- [ ] Review security implications

---

**Estimated Time:** 30 days for all priorities  
**Team Size:** 1-2 developers  
**Dependencies:** OpenAI API key, Supabase service key

