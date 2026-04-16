// Product reviews — empty until real user reviews are collected
// DO NOT add fabricated reviews

export interface Review {
  id: string;
  productSlug: string;
  productType: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  date: string;
  verified: boolean;
  helpful: number;
  unhelpful: number;
}

// Empty — reviews come from Supabase when real users submit them
export const MOCK_REVIEWS: Review[] = [];

export function getReviewsForProduct(_slug: string, _type: string): Review[] {
  return [];
}

export function getReviewStats(_slug?: string, _type?: string) {
  return {
    count: 0,
    totalReviews: 0,
    average: 0,
    averageRating: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
}

export function generateReviewSchema(_slug: string, _name: string) {
  return null; // No reviews to generate schema for
}

// Alias for callers using this name
export const getProductReviews = getReviewsForProduct;
