
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3001'; // Force IPv4 to avoid node 18+ localhost issues
console.log(`🛡️ Starting Audit 25: Security Baseline Scan`);
console.log(`   Target: ${BASE_URL}`);

interface ScanResult {
    check: string;
    status: 'PASS' | 'FAIL' | 'WARN';
    details: string;
}

const results: ScanResult[] = [];

async function checkUrl(url: string, description: string, expectedStatus = 200, forbidStatus = [404, 403, 401]) {
    try {
        const res = await axios.get(url, { validateStatus: () => true, timeout: 5000 });
        if (res.status === expectedStatus) {
            return { status: res.status, headers: res.headers, data: res.data };
        }
        return { status: res.status, headers: res.headers, data: null };
    } catch (err: any) {
        return { status: 'ERROR', details: err.message };
    }
}

async function runScan() {
    // 1. Check Security Headers
    const home = await checkUrl(BASE_URL, 'Homepage');
    if (home.status === 200) {
        const headers = home.headers as any;
        const missingHeaders = [];
        
        if (!headers['strict-transport-security'] && !BASE_URL.includes('localhost')) missingHeaders.push('HSTS');
        if (!headers['x-frame-options']) missingHeaders.push('X-Frame-Options');
        if (!headers['x-content-type-options']) missingHeaders.push('X-Content-Type-Options');
        // CSP is often complex, just warning if missing
        if (!headers['content-security-policy']) missingHeaders.push('Content-Security-Policy');

        if (missingHeaders.length > 0) {
            results.push({ check: 'Security Headers', status: 'WARN', details: `Missing: ${missingHeaders.join(', ')}` });
        } else {
            results.push({ check: 'Security Headers', status: 'PASS', details: 'All core headers present' });
        }
        
        // Powered By check
        if (headers['x-powered-by']) {
            results.push({ check: 'Information Leakage', status: 'WARN', details: `Exposed X-Powered-By: ${headers['x-powered-by']}` });
        }
    } else {
        results.push({ check: 'Homepage Availability', status: 'FAIL', details: `Status: ${home.status}` });
    }

    // 2. Sensitive File Probe
    const sensitiveFiles = [
        '.env',
        '.env.local',
        '.git/HEAD',
        '.vscode/settings.json',
        'package.json',
        'backup.sql',
        'scripts/drills/audit_17_report.json'
    ];

    for (const file of sensitiveFiles) {
        const res = await checkUrl(`${BASE_URL}/${file}`, file);
        if (res.status === 200) {
            results.push({ check: `Exposed File: ${file}`, status: 'FAIL', details: 'Accessible via public URL!' });
        } else {
            results.push({ check: `Protected File: ${file}`, status: 'PASS', details: `Status: ${res.status}` });
        }
    }

    // 3. API Data Leakage
    // Check if products API returns sensitive internal fields
    const productApi = await checkUrl(`${BASE_URL}/api/products`, 'Products API');
    if (productApi.status === 200 && productApi.data) {
        const dataStr = JSON.stringify(productApi.data);
        const leakage = [];
        if (dataStr.includes('supplier_id')) leakage.push('supplier_id');
        if (dataStr.includes('margin')) leakage.push('margin');
        if (dataStr.includes('cost_price')) leakage.push('cost_price');
        
        if (leakage.length > 0) {
            results.push({ check: 'API Data Leakage', status: 'FAIL', details: `Exposed fields: ${leakage.join(', ')}` });
        } else {
            results.push({ check: 'API Data Leakage', status: 'PASS', details: 'No sensitive fields found in /api/products' });
        }
    }

    // 4. Admin Access
    const adminPaths = ['/admin', '/dashboard', '/cms'];
    for (const path of adminPaths) {
        const res = await checkUrl(`${BASE_URL}${path}`, path);
        // Should require auth (redirect to login or 401/403)
        // If 200 OK and "Login" not in body, potential bypass
        if (res.status === 200 && !JSON.stringify(res.data).toLowerCase().includes('login')) {
             results.push({ check: `Admin Path: ${path}`, status: 'WARN', details: 'Accessible without redirect? Check manually.' });
        } else {
             results.push({ check: `Admin Path: ${path}`, status: 'PASS', details: `Protected (Status: ${res.status})` });
        }
    }

    // Output Report
    console.log('\n📊 Security Audit Results:');
    const reportPath = path.join(process.cwd(), 'scripts/drills/audit_25_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    let failureCount = 0;
    results.forEach(r => {
        const icon = r.status === 'PASS' ? '✅' : (r.status === 'WARN' ? '⚠️' : '❌');
        console.log(`${icon} [${r.status}] ${r.check}: ${r.details}`);
        if (r.status === 'FAIL') failureCount++;
    });

    console.log(`\nReport saved to: ${reportPath}`);
    if (failureCount > 0) process.exit(1);
}

runScan().catch(console.error);
