/**
 * Create Admin User Script
 * 
 * Creates an admin user in the database with proper permissions
 * Run with: tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

interface AdminUser {
  email: string;
  password: string;
  displayName: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function validateEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function createAdminUser(adminData: AdminUser) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase credentials.\n' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('\n📝 Creating admin user...\n');

  // Step 1: Create auth user
  console.log('   1. Creating authentication user...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminData.email,
    password: adminData.password,
    email_confirm: true,
    user_metadata: {
      display_name: adminData.displayName,
    },
  });

  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error('User creation failed: No user returned');
  }

  console.log(`   ✓ Auth user created (ID: ${authData.user.id})`);

  // Step 2: Create user profile with admin role
  console.log('   2. Creating user profile with admin role...');
  
  // Check if table exists and has required columns
  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({
      id: authData.user.id,
      email: adminData.email,
      role: 'admin',
      display_name: adminData.displayName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.warn(`   ⚠️  Warning: Could not create user profile: ${profileError.message}`);
    console.log('   You may need to create the user_profiles table first.');
    console.log('   Or manually add the profile with SQL:');
    console.log(`
      INSERT INTO user_profiles (id, email, role, display_name)
      VALUES ('${authData.user.id}', '${adminData.email}', 'admin', '${adminData.displayName}');
    `);
  } else {
    console.log('   ✓ User profile created with admin role');
  }

  return authData.user;
}

async function checkExistingAdmin(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return false;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check if user already exists
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error || !data) {
    return false;
  }

  return data.users.some((user) => user.email === email);
}

async function main() {
  console.log('\n');
  console.log('═'.repeat(70));
  console.log('  InvestingPro Admin User Setup');
  console.log('═'.repeat(70));
  console.log('\n');

  // Check Supabase connection
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing Supabase credentials');
    console.log('   Please set the following environment variables:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY\n');
    process.exit(1);
  }

  console.log('✓ Supabase credentials found\n');

  // Collect admin user information
  console.log('Please provide admin user details:\n');

  let email = '';
  let isValidEmail = false;

  while (!isValidEmail) {
    email = await question('Email address: ');
    isValidEmail = await validateEmail(email);

    if (!isValidEmail) {
      console.log('❌ Invalid email format. Please try again.\n');
    }
  }

  // Check if user already exists
  const exists = await checkExistingAdmin(email);
  if (exists) {
    console.log(`\n⚠️  Warning: User with email ${email} already exists.`);
    const overwrite = await question('Do you want to continue anyway? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\nOperation cancelled.\n');
      rl.close();
      process.exit(0);
    }
  }

  const password = await question('Password (min 8 characters): ');

  if (password.length < 8) {
    console.log('\n❌ Password must be at least 8 characters long.\n');
    rl.close();
    process.exit(1);
  }

  const displayName = await question('Display name: ');

  console.log('\n');
  console.log('═'.repeat(70));
  console.log('Review Admin User Details:');
  console.log('─'.repeat(70));
  console.log(`   Email: ${email}`);
  console.log(`   Display Name: ${displayName}`);
  console.log(`   Role: admin`);
  console.log('═'.repeat(70));
  console.log('\n');

  const confirm = await question('Create this admin user? (y/N): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('\nOperation cancelled.\n');
    rl.close();
    process.exit(0);
  }

  try {
    const user = await createAdminUser({
      email,
      password,
      displayName,
    });

    console.log('\n');
    console.log('═'.repeat(70));
    console.log('✅ Admin user created successfully!');
    console.log('═'.repeat(70));
    console.log('\n');
    console.log('User Details:');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: admin`);
    console.log('\n');
    console.log('You can now log in at:');
    console.log(`   ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/login`);
    console.log('\n');
  } catch (error: any) {
    console.log('\n');
    console.log('═'.repeat(70));
    console.log('❌ Failed to create admin user');
    console.log('═'.repeat(70));
    console.log('\n');
    console.log('Error:', error.message);
    console.log('\n');
    console.log('Troubleshooting:');
    console.log('   1. Verify your Supabase credentials are correct');
    console.log('   2. Ensure the user_profiles table exists');
    console.log('   3. Check that RLS policies allow this operation');
    console.log('   4. Try creating the user manually via Supabase Dashboard\n');
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error('Script failed:', error);
  rl.close();
  process.exit(1);
});
