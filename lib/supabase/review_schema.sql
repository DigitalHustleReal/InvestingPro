-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL, -- Reference to credit_cards.id, mutual_funds.id, etc.
    
    -- User Info (Can link to auth.users if logged in, or generic name)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional Link to User
    user_name TEXT NOT NULL,
    
    -- Content
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    review_text TEXT NOT NULL,
    
    pros TEXT[],
    cons TEXT[],
    
    -- Metadata
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    language TEXT DEFAULT 'en',
    
    -- Moderation
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can VIEW APPROVED reviews
CREATE POLICY "Public can view approved reviews" 
ON reviews FOR SELECT 
USING (status = 'approved');

-- Authenticated Users can INSERT reviews (Pending approval)
CREATE POLICY "Users can submit reviews" 
ON reviews FOR INSERT 
WITH CHECK (auth.role() = 'authenticated'); -- Or 'true' if allowing anon reviews

-- Admins can do everything
CREATE POLICY "Admins can manage reviews" 
ON reviews FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');
