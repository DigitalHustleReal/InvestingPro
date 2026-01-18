import { NextResponse } from 'next/server';

/**
 * AI Provider Health Check Endpoint
 * Tests all AI providers to see which ones are working
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    providers: {},
    summary: {
      working: [],
      failing: []
    }
  };

  // Test OpenAI
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      results.providers.openai = { status: 'no_api_key', error: 'OPENAI_API_KEY not found in environment' };
      results.summary.failing.push('openai');
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Say "test"' }],
          max_tokens: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        results.providers.openai = { 
          status: 'working', 
          model: 'gpt-4o-mini',
          response: data.choices[0]?.message?.content 
        };
        results.summary.working.push('openai');
      } else {
        const error = await response.json();
        results.providers.openai = { 
          status: 'error', 
          error: error.error?.message || 'Unknown error',
          code: response.status
        };
        results.summary.failing.push('openai');
      }
    }
  } catch (error: any) {
    results.providers.openai = { status: 'error', error: error.message };
    results.summary.failing.push('openai');
  }

  // Test Gemini
  try {
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      results.providers.gemini = { status: 'no_api_key', error: 'GOOGLE_GEMINI_API_KEY not found in environment' };
      results.summary.failing.push('gemini');
    } else {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            role: 'user', 
            parts: [{ text: 'Say "test"' }] 
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        results.providers.gemini = { 
          status: 'working', 
          model: 'gemini-1.5-flash',
          response: text 
        };
        results.summary.working.push('gemini');
      } else {
        const error = await response.json();
        results.providers.gemini = { 
          status: 'error', 
          error: error.error?.message || 'Unknown error',
          code: response.status
        };
        results.summary.failing.push('gemini');
      }
    }
  } catch (error: any) {
    results.providers.gemini = { status: 'error', error: error.message };
    results.summary.failing.push('gemini');
  }

  // Test Groq
  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      results.providers.groq = { status: 'no_api_key', error: 'GROQ_API_KEY not found in environment' };
      results.summary.failing.push('groq');
    } else {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'Say "test"' }],
          max_tokens: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        results.providers.groq = { 
          status: 'working', 
          model: 'llama-3.3-70b-versatile',
          response: data.choices[0]?.message?.content 
        };
        results.summary.working.push('groq');
      } else {
        const error = await response.json();
        results.providers.groq = { 
          status: 'error', 
          error: error.error?.message || 'Unknown error',
          code: response.status
        };
        results.summary.failing.push('groq');
      }
    }
  } catch (error: any) {
    results.providers.groq = { status: 'error', error: error.message };
    results.summary.failing.push('groq');
  }

  // Test Mistral
  try {
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (!mistralKey) {
      results.providers.mistral = { status: 'no_api_key', error: 'MISTRAL_API_KEY not found in environment' };
      results.summary.failing.push('mistral');
    } else {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mistralKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [{ role: 'user', content: 'Say "test"' }],
          max_tokens: 10
        })
      });

      if (response.ok) {
        const data = await response.json();
        results.providers.mistral = { 
          status: 'working', 
          model: 'mistral-small-latest',
          response: data.choices[0]?.message?.content 
        };
        results.summary.working.push('mistral');
      } else {
        const error = await response.json();
        results.providers.mistral = { 
          status: 'error', 
          error: error.error?.message || 'Unknown error',
          code: response.status
        };
        results.summary.failing.push('mistral');
      }
    }
  } catch (error: any) {
    results.providers.mistral = { status: 'error', error: error.message };
    results.summary.failing.push('mistral');
  }

  // Add recommendations
  results.recommendations = [];
  
  if (results.summary.working.length === 0) {
    results.recommendations.push('⚠️ CRITICAL: All AI providers are failing. Check your API keys in .env.local');
    results.recommendations.push('1. Verify all API keys are valid and not expired');
    results.recommendations.push('2. Check if you have sufficient credits/quota');
    results.recommendations.push('3. Verify network connectivity to AI provider APIs');
  } else {
    results.recommendations.push(`✅ ${results.summary.working.length} provider(s) working: ${results.summary.working.join(', ')}`);
    if (results.summary.failing.length > 0) {
      results.recommendations.push(`⚠️ ${results.summary.failing.length} provider(s) failing: ${results.summary.failing.join(', ')}`);
    }
  }

  return NextResponse.json(results, { 
    status: results.summary.working.length > 0 ? 200 : 500 
  });
}
