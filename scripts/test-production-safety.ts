/**
 * Test Script: Idempotency
 * Tests that duplicate requests return cached responses
 */

import { generateIdempotencyKey } from '../lib/middleware/idempotency';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

interface TestResult {
    test: string;
    passed: boolean;
    details: string;
}

async function testIdempotency(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    console.log('🧪 Testing Idempotency Middleware\n');
    
    // Test 1: Article Generation Idempotency
    console.log('Test 1: Article Generation Idempotency');
    const key1 = generateIdempotencyKey();
    
    try {
        // First request
        const response1 = await fetch(`${API_BASE_URL}/api/articles/generate-comprehensive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Idempotency-Key': key1
            },
            body: JSON.stringify({
                topic: 'Test Article for Idempotency',
                category: 'investing',
                contentLength: 'medium'
            })
        });
        
        const result1 = await response1.json();
        const isReplayed1 = response1.headers.get('X-Idempotent-Replayed');
        
        console.log(`  First request: ${response1.status} (Replayed: ${isReplayed1})`);
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Second request (duplicate)
        const response2 = await fetch(`${API_BASE_URL}/api/articles/generate-comprehensive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Idempotency-Key': key1
            },
            body: JSON.stringify({
                topic: 'Test Article for Idempotency',
                category: 'investing',
                contentLength: 'medium'
            })
        });
        
        const result2 = await response2.json();
        const isReplayed2 = response2.headers.get('X-Idempotent-Replayed');
        
        console.log(`  Second request: ${response2.status} (Replayed: ${isReplayed2})`);
        
        // Verify
        const responsesIdentical = JSON.stringify(result1) === JSON.stringify(result2);
        const secondWasReplayed = isReplayed2 === 'true';
        
        const passed = responsesIdentical && secondWasReplayed;
        
        results.push({
            test: 'Article Generation Idempotency',
            passed,
            details: passed 
                ? 'Duplicate request returned cached response' 
                : `Failed: Identical=${responsesIdentical}, Replayed=${secondWasReplayed}`
        });
        
        console.log(`  ✓ Responses identical: ${responsesIdentical}`);
        console.log(`  ✓ Second was replayed: ${secondWasReplayed}\n`);
        
    } catch (error) {
        results.push({
            test: 'Article Generation Idempotency',
            passed: false,
            details: `Error: ${error instanceof Error ? error.message : String(error)}`
        });
        console.log(`  ✗ Error: ${error}\n`);
    }
    
    // Test 2: Workflow Start Idempotency
    console.log('Test 2: Workflow Start Idempotency');
    const key2 = generateIdempotencyKey();
    
    try {
        // First request
        const response1 = await fetch(`${API_BASE_URL}/api/workflows/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Idempotency-Key': key2
            },
            body: JSON.stringify({
                workflowName: 'test-workflow',
                context: { test: true }
            })
        });
        
        const result1 = await response1.json();
        const isReplayed1 = response1.headers.get('X-Idempotent-Replayed');
        
        console.log(`  First request: ${response1.status} (Replayed: ${isReplayed1})`);
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Second request (duplicate)
        const response2 = await fetch(`${API_BASE_URL}/api/workflows/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Idempotency-Key': key2
            },
            body: JSON.stringify({
                workflowName: 'test-workflow',
                context: { test: true }
            })
        });
        
        const result2 = await response2.json();
        const isReplayed2 = response2.headers.get('X-Idempotent-Replayed');
        
        console.log(`  Second request: ${response2.status} (Replayed: ${isReplayed2})`);
        
        // Verify
        const responsesIdentical = JSON.stringify(result1) === JSON.stringify(result2);
        const secondWasReplayed = isReplayed2 === 'true';
        
        const passed = responsesIdentical && secondWasReplayed;
        
        results.push({
            test: 'Workflow Start Idempotency',
            passed,
            details: passed 
                ? 'Duplicate request returned cached response' 
                : `Failed: Identical=${responsesIdentical}, Replayed=${secondWasReplayed}`
        });
        
        console.log(`  ✓ Responses identical: ${responsesIdentical}`);
        console.log(`  ✓ Second was replayed: ${secondWasReplayed}\n`);
        
    } catch (error) {
        results.push({
            test: 'Workflow Start Idempotency',
            passed: false,
            details: `Error: ${error instanceof Error ? error.message : String(error)}`
        });
        console.log(`  ✗ Error: ${error}\n`);
    }
    
    // Test 3: No Idempotency Key (should work normally)
    console.log('Test 3: Request Without Idempotency Key');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/articles/generate-comprehensive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: 'Test Article Without Key',
                category: 'investing',
                contentLength: 'medium'
            })
        });
        
        const hasIdempotencyHeader = response.headers.has('X-Idempotency-Key');
        
        console.log(`  Response: ${response.status}`);
        console.log(`  Has Idempotency Header: ${hasIdempotencyHeader}`);
        
        const passed = !hasIdempotencyHeader;
        
        results.push({
            test: 'Request Without Idempotency Key',
            passed,
            details: passed 
                ? 'Request processed normally without idempotency' 
                : 'Unexpected idempotency header present'
        });
        
        console.log(`  ✓ Processed normally: ${passed}\n`);
        
    } catch (error) {
        results.push({
            test: 'Request Without Idempotency Key',
            passed: false,
            details: `Error: ${error instanceof Error ? error.message : String(error)}`
        });
        console.log(`  ✗ Error: ${error}\n`);
    }
    
    return results;
}

async function testHealthCheck(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    console.log('🏥 Testing Health Check Endpoint\n');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const health = await response.json();
        
        console.log(`Status: ${response.status}`);
        console.log(`Overall Health: ${health.status}`);
        console.log(`Components:`);
        console.log(`  - Database: ${health.components?.database?.status}`);
        console.log(`  - Cache: ${health.components?.cache?.status}`);
        console.log(`  - AI Providers: ${health.components?.ai_providers?.status}`);
        console.log(`  - Workflows: ${health.components?.workflows?.status}`);
        console.log(`  - Metrics: ${health.components?.metrics?.status}\n`);
        
        const passed = response.status === 200 && health.status === 'healthy';
        
        results.push({
            test: 'Health Check Endpoint',
            passed,
            details: passed 
                ? 'All components healthy' 
                : `Status: ${health.status}, HTTP: ${response.status}`
        });
        
    } catch (error) {
        results.push({
            test: 'Health Check Endpoint',
            passed: false,
            details: `Error: ${error instanceof Error ? error.message : String(error)}`
        });
        console.log(`✗ Error: ${error}\n`);
    }
    
    return results;
}

async function runAllTests() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Production Safety Tests');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const allResults: TestResult[] = [];
    
    // Run health check test
    const healthResults = await testHealthCheck();
    allResults.push(...healthResults);
    
    // Run idempotency tests
    const idempotencyResults = await testIdempotency();
    allResults.push(...idempotencyResults);
    
    // Print summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('  Test Summary');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const passed = allResults.filter(r => r.passed).length;
    const failed = allResults.filter(r => !r.passed).length;
    
    allResults.forEach(result => {
        const icon = result.passed ? '✓' : '✗';
        console.log(`${icon} ${result.test}`);
        if (!result.passed) {
            console.log(`  ${result.details}`);
        }
    });
    
    console.log(`\nTotal: ${allResults.length} tests`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed!');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the details above.');
    }
    
    process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
});
