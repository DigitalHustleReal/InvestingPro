/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://investingpro.in',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  
  // Exclude admin and API routes
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/server-sitemap.xml',
  ],
  
  // Additional paths to include
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/credit-cards'),
    await config.transform(config, '/mutual-funds'),
    await config.transform(config, '/loans'),
    await config.transform(config, '/insurance'),
    await config.transform(config, '/calculators/sip'),
    await config.transform(config, '/calculators/emi'),
    await config.transform(config, '/calculators/tax'),
    await config.transform(config, '/calculators/fd'),
    await config.transform(config, '/calculators/ppf'),
    await config.transform(config, '/calculators/nps'),
    await config.transform(config, '/calculators/rd'),
    await config.transform(config, '/terms-of-service'),
    await config.transform(config, '/privacy-policy'),
    await config.transform(config, '/cookie-policy'),
    await config.transform(config, '/disclaimer'),
    await config.transform(config, '/affiliate-disclosure'),
  ],
  
  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://investingpro.in/sitemap.xml',
    ],
  },
  
  // Transform function for custom priorities
  transform: async (config, path) => {
    // Homepage gets highest priority
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Product pages get high priority
    if (path.includes('/credit-cards') || 
        path.includes('/mutual-funds') || 
        path.includes('/loans') || 
        path.includes('/insurance')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Calculator pages get medium-high priority
    if (path.includes('/calculators')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Legal pages get lower priority
    if (path.includes('/terms') || 
        path.includes('/privacy') || 
        path.includes('/disclaimer') ||
        path.includes('/cookie')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Default
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
