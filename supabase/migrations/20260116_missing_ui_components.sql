-- =====================================================
-- MISSING UI COMPONENTS SCHEMA
-- Created: 2026-01-16
-- Purpose: Add testimonials, partners, and FAQs tables
-- =====================================================

-- =====================================================
-- TESTIMONIALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- RLS for testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are viewable by everyone"
  ON testimonials FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (false); -- Will be updated when auth is implemented

CREATE POLICY "Only admins can update testimonials"
  ON testimonials FOR UPDATE
  USING (false); -- Will be updated when auth is implemented

CREATE POLICY "Only admins can delete testimonials"
  ON testimonials FOR DELETE
  USING (false); -- Will be updated when auth is implemented

-- =====================================================
-- PARTNERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  category TEXT, -- 'bank', 'fintech', 'insurance', 'broker', etc.
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for partners
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_partners_featured ON partners(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_partners_display_order ON partners(display_order);

-- RLS for partners
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners are viewable by everyone"
  ON partners FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert partners"
  ON partners FOR INSERT
  WITH CHECK (false); -- Will be updated when auth is implemented

CREATE POLICY "Only admins can update partners"
  ON partners FOR UPDATE
  USING (false); -- Will be updated when auth is implemented

CREATE POLICY "Only admins can delete partners"
  ON partners FOR DELETE
  USING (false); -- Will be updated when auth is implemented

-- =====================================================
-- FAQS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL, -- 'credit-cards', 'mutual-funds', 'general', etc.
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for FAQs
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON faqs(category, display_order);

-- RLS for FAQs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs are viewable by everyone"
  ON faqs FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert FAQs"
  ON faqs FOR INSERT
  WITH CHECK (false); -- Will be updated when auth is implemented

CREATE POLICY "Only admins can update FAQs"
  ON faqs FOR UPDATE
  USING (false); -- Will be updated when auth is implemented

CREATE POLICY "Only admins can delete FAQs"
  ON faqs FOR DELETE
  USING (false); -- Will be updated when auth is implemented

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Sample Testimonials
INSERT INTO testimonials (name, role, company, content, rating, avatar_url, featured, display_order) VALUES
('Rajesh Kumar', 'Software Engineer', 'TCS', 'InvestingPro helped me choose the perfect credit card. The comparison tool is amazing!', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', true, 1),
('Priya Sharma', 'Marketing Manager', 'Infosys', 'Best platform for mutual fund research. Saved me hours of research time.', 5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', true, 2),
('Amit Patel', 'Entrepreneur', 'Startup Founder', 'The SIP calculator is incredibly accurate. Highly recommend!', 5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', true, 3),
('Sneha Reddy', 'Financial Analyst', 'HDFC Bank', 'Comprehensive guides and unbiased reviews. My go-to resource for financial decisions.', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', false, 4),
('Vikram Singh', 'Doctor', 'Apollo Hospitals', 'Helped me understand tax-saving investments. Simple and clear explanations.', 4, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', false, 5)
ON CONFLICT DO NOTHING;

-- Sample Partners
INSERT INTO partners (name, logo_url, website_url, category, featured, display_order) VALUES
('HDFC Bank', 'https://logo.clearbit.com/hdfcbank.com', 'https://www.hdfcbank.com', 'bank', true, 1),
('ICICI Bank', 'https://logo.clearbit.com/icicibank.com', 'https://www.icicibank.com', 'bank', true, 2),
('Axis Bank', 'https://logo.clearbit.com/axisbank.com', 'https://www.axisbank.com', 'bank', true, 3),
('SBI', 'https://logo.clearbit.com/sbi.co.in', 'https://www.sbi.co.in', 'bank', true, 4),
('Zerodha', 'https://logo.clearbit.com/zerodha.com', 'https://zerodha.com', 'broker', true, 5),
('Groww', 'https://logo.clearbit.com/groww.in', 'https://groww.in', 'fintech', true, 6),
('Paytm Money', 'https://logo.clearbit.com/paytm.com', 'https://www.paytm.com/money', 'fintech', false, 7),
('ET Money', 'https://logo.clearbit.com/etmoney.com', 'https://www.etmoney.com', 'fintech', false, 8)
ON CONFLICT DO NOTHING;

-- Sample FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('What is a credit card?', 'A credit card is a payment card that allows you to borrow money from the bank to make purchases. You need to repay the borrowed amount along with interest if not paid within the grace period.', 'credit-cards', 1),
('How do I choose the best credit card?', 'Consider your spending patterns, income level, and benefits you need (cashback, rewards, travel). Use our comparison tool to find cards that match your requirements.', 'credit-cards', 2),
('What is the minimum CIBIL score for a credit card?', 'Most banks require a CIBIL score of 750+ for premium cards. Some entry-level cards may be available with scores as low as 650.', 'credit-cards', 3),
('What is a mutual fund?', 'A mutual fund is a professionally managed investment vehicle that pools money from multiple investors to invest in stocks, bonds, or other securities.', 'mutual-funds', 1),
('What is SIP?', 'SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly in mutual funds. It helps in rupee cost averaging and disciplined investing.', 'mutual-funds', 2),
('How much should I invest in mutual funds?', 'Start with at least 10-15% of your monthly income. You can increase this as your income grows. Use our SIP calculator to plan your investments.', 'mutual-funds', 3),
('Is InvestingPro free to use?', 'Yes! InvestingPro is completely free. We earn through affiliate partnerships when you apply for products through our platform.', 'general', 1),
('How do you make money?', 'We earn commissions from banks and financial institutions when you apply for products through our links. This doesn''t cost you anything extra.', 'general', 2),
('Are your reviews unbiased?', 'Yes. We maintain editorial independence and review products based on features, benefits, and user feedback, not commission rates.', 'general', 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- UPDATE TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp for testimonials
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();

-- Trigger to update updated_at timestamp for partners
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_partners_updated_at();

-- Trigger to update updated_at timestamp for FAQs
CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_faqs_updated_at();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 
  (SELECT COUNT(*) FROM testimonials) as total_testimonials,
  (SELECT COUNT(*) FROM testimonials WHERE featured = true) as featured_testimonials,
  (SELECT COUNT(*) FROM partners) as total_partners,
  (SELECT COUNT(*) FROM partners WHERE featured = true) as featured_partners,
  (SELECT COUNT(*) FROM faqs) as total_faqs,
  'Missing UI components schema created successfully!' as status;
