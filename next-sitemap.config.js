/**
 * DEPRECATED — Next.js App Router sitemap is now generated via app/sitemap.ts
 * This file is kept for reference only. next-sitemap is no longer used.
 * generateRobotsTxt is disabled to prevent conflict with app/robots.ts
 */
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://investingpro.in',
  generateRobotsTxt: false, // Disabled — app/robots.ts handles this
  generateIndexSitemap: false,
  // All sitemap generation is handled by app/sitemap.ts
  // Do not run next-sitemap postbuild script
};
