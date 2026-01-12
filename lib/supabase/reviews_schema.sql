-- Reviews Table for User Ratings & Comments
-- Supports Credit Cards, Mutual Funds, Loans, and Insurance via 'product_slug' and 'product_type'

DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Polymorphic Linking
  product_slug TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('credit_card', 'mutual_fund', 'loan', 'insurance', 'stock')),
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  
  -- Status & Social Proof
  is_verified_purchase BOOLEAN DEFAULT FALSE, -- Can be set by backend if we have purchase tracking later
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_slug, product_type);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can read reviews
CREATE POLICY "Public Read Reviews"
  ON reviews FOR SELECT
  USING (true);

-- Policy 2: Authenticated users can create reviews
CREATE POLICY "Authenticated Create Reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own reviews
CREATE POLICY "Users Update Own Reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy 4: Users can delete their own reviews
CREATE POLICY "Users Delete Own Reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);
