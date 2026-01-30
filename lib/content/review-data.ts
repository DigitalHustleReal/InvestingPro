// Mock review data for products
// In production, this will be replaced with Supabase data

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
  verified: boolean;
  helpful: number;
  notHelpful: number;
  createdAt: string;
  pros?: string[];
  cons?: string[];
}

// Credit Card Reviews
export const CREDIT_CARD_REVIEWS: Review[] = [
  {
    id: '1',
    productSlug: 'hdfc-regalia',
    productType: 'credit_card',
    userId: 'user1',
    userName: 'Rajesh Kumar',
    rating: 5,
    title: 'Excellent rewards program!',
    content: 'Been using this card for 2 years now. The reward points accumulate quickly, especially on dining and travel. Airport lounge access is a great perk. Annual fee is justified if you spend regularly.',
    verified: true,
    helpful: 45,
    notHelpful: 2,
    createdAt: '2026-01-15T10:30:00Z',
    pros: ['Great rewards rate', 'Airport lounge access', 'Easy redemption'],
    cons: ['High annual fee', 'Requires good credit score']
  },
  {
    id: '2',
    productSlug: 'hdfc-regalia',
    productType: 'credit_card',
    userId: 'user2',
    userName: 'Priya Sharma',
    rating: 4,
    title: 'Good for frequent travelers',
    content: 'The card is great for travel benefits. Complimentary lounge access saved me a lot during my business trips. However, the annual fee is steep if you don\'t spend enough to waive it.',
    verified: true,
    helpful: 32,
    notHelpful: 5,
    createdAt: '2026-01-10T14:20:00Z',
    pros: ['Travel benefits', 'Lounge access', 'Good customer service'],
    cons: ['Annual fee', 'Limited cashback on regular spends']
  },
  {
    id: '3',
    productSlug: 'hdfc-regalia',
    productType: 'credit_card',
    userId: 'user3',
    userName: 'Amit Patel',
    rating: 5,
    title: 'Best premium card in this range',
    content: 'Switched from another bank\'s card and couldn\'t be happier. The rewards program is transparent, and I\'ve already redeemed points for a flight ticket. Customer service is responsive.',
    verified: true,
    helpful: 28,
    notHelpful: 1,
    createdAt: '2026-01-05T09:15:00Z',
    pros: ['Transparent rewards', 'Responsive support', 'Premium benefits'],
    cons: ['Approval takes time']
  },
  {
    id: '4',
    productSlug: 'sbi-simplysave',
    productType: 'credit_card',
    userId: 'user4',
    userName: 'Sneha Reddy',
    rating: 5,
    title: 'Perfect for everyday spending',
    content: 'Lifetime free card with 10x rewards on dining and groceries - what more can you ask for? I use this for all my daily expenses and the points add up quickly.',
    verified: true,
    helpful: 52,
    notHelpful: 3,
    createdAt: '2026-01-20T11:45:00Z',
    pros: ['Lifetime free', '10x rewards on dining', 'Easy approval'],
    cons: ['Lower rewards on other categories']
  },
  {
    id: '5',
    productSlug: 'sbi-simplysave',
    productType: 'credit_card',
    userId: 'user5',
    userName: 'Vikram Singh',
    rating: 4,
    title: 'Great starter card',
    content: 'Got this as my first credit card. No annual fee is a huge plus. Rewards on dining and groceries are excellent. Would recommend for anyone starting their credit journey.',
    verified: true,
    helpful: 38,
    notHelpful: 2,
    createdAt: '2026-01-18T16:30:00Z',
    pros: ['No annual fee', 'Good rewards', 'Easy to manage'],
    cons: ['Limited premium benefits']
  }
];

// Get reviews for a specific product
export const getProductReviews = (productSlug: string): Review[] => {
  return CREDIT_CARD_REVIEWS.filter(review => review.productSlug === productSlug);
};

// Get review statistics
export const getReviewStats = (productSlug: string) => {
  const reviews = getProductReviews(productSlug);
  
  if (reviews.length === 0) {
    return {
      average: 0,
      count: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const distribution = reviews.reduce((acc, review) => {
    acc[review.rating as keyof typeof acc]++;
    return acc;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return {
    average: Math.round(average * 10) / 10,
    count: reviews.length,
    distribution
  };
};

// Generate review schema.org markup
export const generateReviewSchema = (productSlug: string, productName: string) => {
  const reviews = getProductReviews(productSlug);
  const stats = getReviewStats(productSlug);

  if (reviews.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": stats.average,
      "reviewCount": stats.count,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.userName
      },
      "datePublished": review.createdAt,
      "reviewBody": review.content,
      "name": review.title,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      }
    }))
  };
};
