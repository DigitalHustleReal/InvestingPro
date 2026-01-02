// Test environment variable loading
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

console.log('Testing environment variables...\n');

console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('GOOGLE_GEMINI_API_KEY exists:', !!process.env.GOOGLE_GEMINI_API_KEY);

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('\n✅ Environment variables loaded successfully!');
  console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`);
} else {
  console.log('\n❌ Environment variables NOT loaded');
  console.log('Make sure .env.local exists in project root');
}
