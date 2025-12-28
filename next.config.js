/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure dev server stays alive
    reactStrictMode: true,
    
    // Error handling
    onDemandEntries: {
        // Keep pages in memory longer to prevent auto-stopping
        maxInactiveAge: 60 * 1000, // 60 seconds
        pagesBufferLength: 5,
    },
    
    // Logging configuration
    logging: {
        fetches: {
            fullUrl: process.env.NODE_ENV === 'development',
        },
    },
    
    // Experimental features for stability
    experimental: {
        // Keep server components alive
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

module.exports = nextConfig;

