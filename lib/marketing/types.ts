
export interface AffiliateProduct {
  id: string; // Network specific ID
  name: string;
  url: string; // Affiliate Tracking URL
  description?: string;
  price?: string;
  currency?: string;
  category: string;
  merchant: string; // e.g., "HDFC Bank", "Amazon"
  payout?: string; // e.g., "₹1500 per sale"
  imageUrl?: string;
  
  // Metadata for matching
  tags?: string[];
  campaignId?: string;
}

export interface AffiliateAdapter {
  providerName: string;
  
  /**
   * Fetch offers/products from the affiliate network
   * @param category specific category to fetch (e.g. 'credit-cards')
   */
  fetchProducts(category: string): Promise<AffiliateProduct[]>;
  
  /**
   * Validate if the connection to the network is working
   */
  validateConnection(): Promise<boolean>;
}
