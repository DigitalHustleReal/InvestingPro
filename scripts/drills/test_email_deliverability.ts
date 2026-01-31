import dotenv from 'dotenv';
import { Resend } from 'resend';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testDeliverability() {
    console.log('📧 Starting Email Deliverability Test (Audit 16)...');
    
    // Manual fallback: Read .env.local directly if env var is missing
    if (!process.env.RESEND_API_KEY) {
        console.log('⚠️  RESEND_API_KEY not in process.env, attempting manual read...');
        try {
            const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
            const match = envContent.match(/RESEND_API_KEY=(.+)/);
            if (match && match[1]) {
                process.env.RESEND_API_KEY = match[1].trim();
                console.log('✅ Found RESEND_API_KEY manually in .env.local');
            }
        } catch (e) {
            console.warn('   Could not read .env.local manually');
        }
    }

    if (!process.env.RESEND_API_KEY) {
        console.error('❌ Error: RESEND_API_KEY is definitely missing.');
        process.exit(1);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const testEmail = process.argv[2] || 'shivp@investingpro.in'; // Default to user email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'InvestingPro <onboarding@resend.dev>';

    console.log(`📤 Sending test email to: ${testEmail}`);
    console.log(`📬 From: ${fromEmail}`);

    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [testEmail],
            subject: '🚀 InvestingPro: Pre-Launch Deliverability Test',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h1 style="color: #0d9488;">Deliverability Test</h1>
                    <p>This is a P0 Audit Test for <b>InvestingPro.in</b>.</p>
                    <p>If you are reading this in your <b>Primary Inbox</b>, the test is a SUCCESS ✅.</p>
                    <p>If this is in <b>Spam</b>, we have a configuration issue with SPF/DKIM ❌.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 12px; color: #64748b;">Timestamp: ${new Date().toISOString()}</p>
                    <p style="font-size: 12px; color: #64748b;">Test ID: drill_audit_16_${Math.random().toString(36).substring(7)}</p>
                </div>
            `,
            text: `InvestingPro Deliverability Test. If you see this in your inbox, Audit 16 is partial success. Check HTML for full verification.`,
            tags: [
                { name: 'category', value: 'audit_test' },
                { name: 'audit_id', value: '16' }
            ]
        });

        if (error) {
            console.error('❌ Resend API Error:', error);
            return;
        }

        console.log('✅ Email sent successfully!');
        console.log(`✉️ Message ID: ${data?.id}`);
        console.log('\n--- NEXT STEPS ---');
        console.log('1. Check your inbox for the email.');
        console.log('2. Verify it is NOT in the spam folder.');
        console.log('3. Confirm to me that it arrived successfully.');

    } catch (err) {
        console.error('❌ Radical failure sending email:', err);
    }
}

testDeliverability().catch(console.error);
