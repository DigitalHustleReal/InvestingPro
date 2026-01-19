
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

console.log('Checking keys...');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('GOOGLE_GEMINI_API_KEY exists:', !!process.env.GOOGLE_GEMINI_API_KEY);
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('MISTRAL_API_KEY exists:', !!process.env.MISTRAL_API_KEY);
console.log('SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);

if (process.env.OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY.length);
    console.log('OPENAI_API_KEY start:', process.env.OPENAI_API_KEY.substring(0, 3) + '...');
}
