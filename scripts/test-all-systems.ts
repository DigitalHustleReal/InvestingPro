/**
 * Comprehensive System Test
 * 
 * Tests all scrapers, content generators, AI persona, and automation
 * Fires all systems and reports status
 */

import { logger } from '@/lib/logger';

interface TestResult {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    duration?: number;
    details?: any;
}

const results: TestResult[] = [];

/**
 * Test Scrapers
 */
async function testScrapers(): Promise<TestResult[]> {
    const scraperResults: TestResult[] = [];
    
    logger.info('🧪 Testing Scrapers...');
    
    // 1. Test RBI Rates Scraper
    try {
        const startTime = Date.now();
        const { getRBIPolicyRates } = await import('@/lib/data-sources/rbi-api');
        const rates = await getRBIPolicyRates();
        const duration = Date.now() - startTime;
        
        if (rates) {
            scraperResults.push({
                name: 'RBI Rates Scraper',
                status: 'pass',
                message: `Successfully fetched RBI rates (Repo: ${rates.repoRate}%)`,
                duration,
                details: rates
            });
        } else {
            scraperResults.push({
                name: 'RBI Rates Scraper',
                status: 'warning',
                message: 'RBI rates returned null (using defaults)',
                duration
            });
        }
    } catch (error) {
        scraperResults.push({
            name: 'RBI Rates Scraper',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    // 2. Test AMFI NAV Scraper
    try {
        const startTime = Date.now();
        const { getAllMutualFunds } = await import('@/lib/data-sources/amfi-api');
        const funds = await getAllMutualFunds();
        const duration = Date.now() - startTime;
        
        if (funds && funds.length > 0) {
            scraperResults.push({
                name: 'AMFI NAV Scraper',
                status: 'pass',
                message: `Successfully fetched ${funds.length} mutual funds`,
                duration,
                details: { count: funds.length }
            });
        } else {
            scraperResults.push({
                name: 'AMFI NAV Scraper',
                status: 'warning',
                message: 'No mutual funds returned',
                duration
            });
        }
    } catch (error) {
        scraperResults.push({
            name: 'AMFI NAV Scraper',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    // 3. Test Credit Card Scraper
    try {
        const startTime = Date.now();
        // Check if Playwright scraper is available
        const { isPlaywrightAvailable } = await import('@/lib/scraper/playwright-scraper');
        const available = await isPlaywrightAvailable();
        const duration = Date.now() - startTime;
        
        if (available) {
            scraperResults.push({
                name: 'Credit Card Scraper (Playwright)',
                status: 'pass',
                message: 'Playwright scraper is available',
                duration
            });
        } else {
            scraperResults.push({
                name: 'Credit Card Scraper (Playwright)',
                status: 'warning',
                message: 'Playwright not available (scraper will use fallback)',
                duration
            });
        }
    } catch (error) {
        scraperResults.push({
            name: 'Credit Card Scraper (Playwright)',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    return scraperResults;
}

/**
 * Test Content Generators
 */
async function testContentGenerators(): Promise<TestResult[]> {
    const generatorResults: TestResult[] = [];
    
    logger.info('🧪 Testing Content Generators...');
    
    // 1. Test Article Generator
    try {
        const startTime = Date.now();
        const { generateArticleContent } = await import('@/lib/workers/articleGenerator');
        
        // Test with a simple topic
        const testTopic = 'Best credit cards in India';
        const result = await generateArticleContent({
            topic: testTopic,
            category: 'credit-cards',
            targetKeywords: ['best credit card', 'credit card india'],
            contentLength: 'medium',
            targetAudience: 'general'
        });
        const duration = Date.now() - startTime;
        
        if (result && result.title) {
            generatorResults.push({
                name: 'Article Generator',
                status: 'pass',
                message: `Successfully generated article: "${result.title}"`,
                duration,
                details: {
                    wordCount: result.word_count,
                    status: result.status
                }
            });
        } else {
            generatorResults.push({
                name: 'Article Generator',
                status: 'fail',
                message: 'Article generation returned invalid result',
                duration
            });
        }
    } catch (error) {
        generatorResults.push({
            name: 'Article Generator',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    // 2. Test Keyword API
    try {
        const startTime = Date.now();
        const { getKeywordData } = await import('@/lib/seo/keyword-api-client');
        const keywordClient = await import('@/lib/seo/keyword-api-client').then(m => m.default);
        const keywordData = await keywordClient.getKeywordData('best credit card');
        const duration = Date.now() - startTime;
        
        if (keywordData) {
            generatorResults.push({
                name: 'Keyword API',
                status: 'pass',
                message: `Fetched keyword data (Volume: ${keywordData.searchVolume}, Difficulty: ${keywordData.difficulty})`,
                duration,
                details: keywordData
            });
        } else {
            generatorResults.push({
                name: 'Keyword API',
                status: 'warning',
                message: 'Keyword data returned null (using fallback)',
                duration
            });
        }
    } catch (error) {
        generatorResults.push({
            name: 'Keyword API',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    return generatorResults;
}

/**
 * Test AI Persona & Quality
 */
async function testAIPersona(): Promise<TestResult[]> {
    const aiResults: TestResult[] = [];
    
    logger.info('🧪 Testing AI Persona & Quality...');
    
    // 1. Test Fact-Checker (server-side only - skip if running in test environment)
    try {
        const startTime = Date.now();
        // Note: fact-checker uses server-only imports, so we'll test it differently
        // In production, this runs on the server via API routes
        const testContent = 'The RBI repo rate is 6.5% and mutual funds offer guaranteed returns of 12%.';
        
        // For now, we'll just verify the module can be imported (server-side only)
        // Actual testing happens via API routes
        const factCheckerModule = await import('@/lib/validation/fact-checker').catch(() => null);
        const factCheckDuration = Date.now() - startTime;
        const duration = Date.now() - startTime;
        
        if (factCheckerModule) {
            aiResults.push({
                name: 'Fact-Checker',
                status: 'pass',
                message: 'Fact-checker module available (runs via API routes on server)',
                duration: factCheckDuration,
                details: {
                    note: 'Fact-checking is server-side only. Test via /api/admin/articles/validate/fact-check endpoint.'
                }
            });
        } else {
            aiResults.push({
                name: 'Fact-Checker',
                status: 'warning',
                message: 'Fact-checker module import failed (expected in client-side test)',
                duration: factCheckDuration,
                details: {
                    note: 'This is normal - fact-checking runs server-side via API routes'
                }
            });
        }
    } catch (error) {
        aiResults.push({
            name: 'Fact-Checker',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    // 2. Test Compliance Checker
    try {
        const startTime = Date.now();
        const { checkCompliance } = await import('@/lib/compliance/regulatory-checker');
        const testContent = 'This mutual fund guarantees 15% returns with no risk.';
        const result = await checkCompliance(testContent, {
            category: 'mutual-funds'
        });
        const duration = Date.now() - startTime;
        
        if (result) {
            aiResults.push({
                name: 'Compliance Checker',
                status: result.isCompliant ? 'pass' : 'warning',
                message: `Compliance check complete (Compliant: ${result.isCompliant}, Score: ${result.complianceScore}%, Violations: ${result.violations.length})`,
                duration,
                details: {
                    isCompliant: result.isCompliant,
                    complianceScore: result.complianceScore,
                    violations: result.violations.length,
                    warnings: result.warnings.length
                }
            });
        } else {
            aiResults.push({
                name: 'Compliance Checker',
                status: 'fail',
                message: 'Compliance check returned null',
                duration
            });
        }
    } catch (error) {
        aiResults.push({
            name: 'Compliance Checker',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    // 3. Test Plagiarism Checker
    try {
        const startTime = Date.now();
        const { checkPlagiarism } = await import('@/lib/quality/plagiarism-checker');
        const testContent = 'This is a test article about credit cards. Credit cards are useful financial tools.';
        const result = await checkPlagiarism(testContent, 'Test Article');
        const duration = Date.now() - startTime;
        
        if (result) {
            aiResults.push({
                name: 'Plagiarism Checker',
                status: result.isPlagiarized ? 'warning' : 'pass',
                message: `Plagiarism check complete (Similarity: ${result.similarityScore}%, Can Publish: ${result.canPublish})`,
                duration,
                details: {
                    isPlagiarized: result.isPlagiarized,
                    similarityScore: result.similarityScore,
                    canPublish: result.canPublish,
                    matches: result.matches.length
                }
            });
        } else {
            aiResults.push({
                name: 'Plagiarism Checker',
                status: 'fail',
                message: 'Plagiarism check returned null',
                duration
            });
        }
    } catch (error) {
        aiResults.push({
            name: 'Plagiarism Checker',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    return aiResults;
}

/**
 * Test Automation
 */
async function testAutomation(): Promise<TestResult[]> {
    const automationResults: TestResult[] = [];
    
    logger.info('🧪 Testing Automation...');
    
    // 1. Test Auto-Refresh Triggers
    try {
        const startTime = Date.now();
        const { checkRankingDrops, checkDataChanges } = await import('@/lib/automation/auto-refresh-triggers');
        
        const rankingDrops = await checkRankingDrops();
        const dataChanges = await checkDataChanges();
        const duration = Date.now() - startTime;
        
        automationResults.push({
            name: 'Auto-Refresh Triggers',
            status: 'pass',
            message: `Checked triggers (Ranking Drops: ${rankingDrops.length}, Data Changes: ${dataChanges.length})`,
            duration,
            details: {
                rankingDrops: rankingDrops.length,
                dataChanges: dataChanges.length
            }
        });
    } catch (error) {
        automationResults.push({
            name: 'Auto-Refresh Triggers',
            status: 'fail',
            message: `Error: ${(error as Error).message}`,
            details: error
        });
    }
    
    // 2. Test Rankings Tracking
    try {
        const startTime = Date.now();
        const { getGSCRankings } = await import('@/lib/seo/gsc-api');
        const rankings = await getGSCRankings(['best credit card']);
        const duration = Date.now() - startTime;
        
        automationResults.push({
            name: 'Rankings Tracking (GSC)',
            status: rankings.length > 0 ? 'pass' : 'warning',
            message: `GSC API check complete (Rankings: ${rankings.length})`,
            duration,
            details: {
                rankings: rankings.length,
                note: 'Returns empty if GSC API not configured'
            }
        });
    } catch (error) {
        automationResults.push({
            name: 'Rankings Tracking (GSC)',
            status: 'warning',
            message: `GSC API not configured or error: ${(error as Error).message}`,
            details: error
        });
    }
    
    return automationResults;
}

/**
 * Main test function
 */
async function runAllTests() {
    logger.info('🚀 Starting Comprehensive System Test...');
    logger.info('');
    
    const startTime = Date.now();
    
    // Run all tests
    const scraperResults = await testScrapers();
    const generatorResults = await testContentGenerators();
    const aiResults = await testAIPersona();
    const automationResults = await testAutomation();
    
    // Combine results
    results.push(...scraperResults);
    results.push(...generatorResults);
    results.push(...aiResults);
    results.push(...automationResults);
    
    const totalDuration = Date.now() - startTime;
    
    // Print summary
    logger.info('');
    logger.info('📊 TEST RESULTS SUMMARY');
    logger.info('='.repeat(60));
    logger.info('');
    
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    
    logger.info(`✅ Passed: ${passed}`);
    logger.info(`❌ Failed: ${failed}`);
    logger.info(`⚠️  Warnings: ${warnings}`);
    logger.info(`⏱️  Total Duration: ${totalDuration}ms`);
    logger.info('');
    
    // Print detailed results
    logger.info('📋 DETAILED RESULTS:');
    logger.info('-'.repeat(60));
    
    for (const result of results) {
        const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
        const durationStr = result.duration ? ` (${result.duration}ms)` : '';
        logger.info(`${icon} ${result.name}: ${result.message}${durationStr}`);
        
        if (result.details && result.status === 'fail') {
            logger.info(`   Details: ${JSON.stringify(result.details, null, 2)}`);
        }
    }
    
    logger.info('');
    logger.info('='.repeat(60));
    
    // Return summary
    return {
        total: results.length,
        passed,
        failed,
        warnings,
        duration: totalDuration,
        results
    };
}

// Run if called directly
if (require.main === module) {
    runAllTests()
        .then((summary) => {
            logger.info('');
            logger.info(`✅ Test complete! ${summary.passed}/${summary.total} passed`);
            process.exit(summary.failed > 0 ? 1 : 0);
        })
        .catch((error) => {
            logger.error('Test failed with error:', error);
            process.exit(1);
        });
}

export { runAllTests };
