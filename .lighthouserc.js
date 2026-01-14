/**
 * Lighthouse CI Configuration
 * 
 * Performance budgets and CI checks
 */

module.exports = {
    ci: {
        collect: {
            url: [
                'http://localhost:3000',
                'http://localhost:3000/article/sample-article',
                'http://localhost:3000/mutual-funds',
                'http://localhost:3000/calculators/sip',
            ],
            numberOfRuns: 3,
            startServerCommand: 'npm run start',
            startServerReadyPattern: 'ready on',
            startServerReadyTimeout: 10000,
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.95 }],
                'categories:best-practices': ['warn', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }],
                
                // Performance metrics
                'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
                'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
                'total-blocking-time': ['warn', { maxNumericValue: 300 }],
                'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
                'speed-index': ['warn', { maxNumericValue: 3000 }],
                
                // Resource budgets
                'resource-summary:script:size': ['error', { maxNumericValue: 500000 }], // 500KB
                'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }], // 50KB
                'resource-summary:image:size': ['warn', { maxNumericValue: 1000000 }], // 1MB
                
                // Best practices
                'uses-optimized-images': 'warn',
                'uses-text-compression': 'error',
                'uses-responsive-images': 'warn',
                'modern-image-formats': 'warn',
                'offscreen-images': 'warn',
                'render-blocking-resources': 'error',
                'unused-css-rules': 'warn',
                'unused-javascript': 'warn',
                'efficient-animated-content': 'warn',
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
