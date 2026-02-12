
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL is set!');
  console.log(`   Length: ${process.env.DATABASE_URL.length}`);
  // Check if it looks like a postgres url
  if (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://')) {
      console.log('   Format: Valid Postgres URL scheme');
  } else {
      console.log('   Format: UNKNOWN scheme');
  }
} else {
  console.log('❌ DATABASE_URL is NOT set.');
}
