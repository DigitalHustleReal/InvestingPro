import { z } from 'zod';

// Zod Schema for Credit Card Data
export const CreditCardScraperSchema = z.object({
  name: z.string(),
  provider_name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  rating: z.number().optional(),
  
  // Fees
  annual_fee: z.number().or(z.string()),
  joining_fee: z.number().or(z.string()).optional(),
  
  // Features
  reward_rate: z.string().optional(),
  lounge_access: z.string().optional(),
  
  // Metadata
  apply_link: z.string().url().optional(),
  image_url: z.string().url().optional(),
  
  // Lists
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  features: z.union([z.array(z.string()), z.record(z.any())]).optional(),
});

export type ScrapedCreditCard = z.infer<typeof CreditCardScraperSchema>;

// Shared Scraper Config
export interface ScraperConfig {
    headless?: boolean;
    proxy?: string;
    userAgent?: string;
    timeout?: number;
}
