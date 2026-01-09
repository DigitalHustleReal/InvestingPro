
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listUsers() {
    console.log('👥 Fetching Authors...');
    const { data: users, error } = await supabase
        .from('authors')
        .select('id, name, role');

    if (error) {
        console.error('Error fetching authors:', error);
        return;
    }

    if (!users || users.length === 0) {
        console.log('No authors found in "authors" table.');
    } else {
        console.table(users);
    }
}

listUsers();
