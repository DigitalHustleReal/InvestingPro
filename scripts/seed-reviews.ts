
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const reviews = [
  {
    product_slug: 'hdfc-regalia-gold',
    product_type: 'credit_card',
    rating: 5,
    title: 'Excellent for travelers!',
    content: 'The airport lounge access is a lifesaver. I used the priority pass twice last month. Highly recommended for frequent flyers.',
    is_verified_purchase: true,
    helpful_count: 12
  },
  {
    product_slug: 'hdfc-regalia-gold',
    product_type: 'credit_card',
    rating: 4,
    title: 'Good rewards but high fee',
    content: 'Reward points are great if you shop at Myntra and Nykaa. The annual fee is a bit steep, but waiver criteria is achievable.',
    is_verified_purchase: true,
    helpful_count: 5
  },
  {
    product_slug: 'hdfc-regalia-gold',
    product_type: 'credit_card',
    rating: 5,
    title: 'Best verified upgrade',
    content: 'Got upgraded from Regalia First. The gold benefits are definitely noticeable. Love the Club Vistara membership.',
    is_verified_purchase: false,
    helpful_count: 2
  }
];

async function seedReviews() {
  console.log('Seeding reviews for HDFC Regalia Gold...');
  
  // 1. Get a distinct user ID to attribute reviews to (or use a placeholder if testing RLS)
  // For seeding, we'll fetch the first user found or use a static one if none.
  const { data: users } = await supabase.from('auth.users').select('id').limit(1); // specific query might fail depending on permissions
  
  // Fallback: Using a known UUID or creating a dummy one might fail FK constraint if user doesn't exist.
  // Let's try to get a real user ID from the public users table if you have one, or just pick one commonly used.
  // Actually, 'auth.users' is generally not accessible directly via client unless service role.
  // Let's assume we can fetch from a public profile table if it exists, or...
  
  // Strategy: Try to find a user in 'auth.users' using service role (which we have in this script).
  // Note: 'auth.users' is in the 'auth' schema.
  const { data: authUsers, error } = await supabase.auth.admin.listUsers();
  
  let userId = authUsers?.users?.[0]?.id;

  if (!userId) {
     console.log('No users found. Creating a dummy user for reviews...');
     const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'reviewer@example.com',
        password: 'password123',
        email_confirm: true
     });
     userId = newUser.user?.id;
  }

  if (!userId) {
      console.error('Could not get a user ID to link reviews to.');
      return;
  }

  const reviewsWithUser = reviews.map(r => ({ ...r, user_id: userId }));

  const { error: insertError } = await supabase.from('reviews').insert(reviewsWithUser);
  
  if (insertError) {
      console.error('Error inserting reviews:', insertError);
  } else {
      console.log('✅ Successfully seeded 3 reviews!');
  }
}

seedReviews();
