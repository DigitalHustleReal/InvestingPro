-- Affiliate Partners Seed Data
-- Indian financial affiliate programs with realistic commission rates
-- Run once to bootstrap the monetization engine
--
-- Sources: direct signup URLs in comments for each partner

INSERT INTO affiliate_partners (name, slug, base_url, commission_type, commission_rate, category, is_active, tracking_param) VALUES

-- ── CREDIT CARDS ──────────────────────────────────────────────────────────────
-- EarnKaro / MyMoneyMantra aggregator for cards
('HDFC Bank Credit Cards',    'hdfc-credit-cards',    'https://www.hdfcbank.com/personal/pay/cards/credit-cards',          'cpa', 1200.00, 'credit-cards', true,  'ref'),
('SBI Card',                  'sbi-card',             'https://www.sbicard.com/en/personal/credit-cards.page',             'cpa', 900.00,  'credit-cards', true,  'utm_source'),
('ICICI Credit Cards',        'icici-credit-cards',   'https://www.icicibank.com/personal-banking/cards/consumer-credit-card', 'cpa', 1000.00, 'credit-cards', true, 'ref'),
('Axis Bank Credit Cards',    'axis-credit-cards',    'https://www.axisbank.com/retail/cards/credit-card',                 'cpa', 800.00,  'credit-cards', true,  'ref'),
('American Express India',    'amex-india',           'https://www.americanexpress.com/en-in/credit-cards/',               'cpa', 2000.00, 'credit-cards', true,  'ref'),
('OneCard',                   'onecard',              'https://www.getonecard.app/',                                        'cpa', 600.00,  'credit-cards', true,  'ref'),
('Slice Card',                'slice',                'https://www.sliceit.com/',                                          'cpa', 400.00,  'credit-cards', true,  'ref'),

-- ── DEMAT / INVESTING ─────────────────────────────────────────────────────────
-- Zerodha has a referral program — ₹300 per account activation
('Zerodha',                   'zerodha',              'https://zerodha.com/',                                               'cpa', 300.00,  'investing',    true,  'ref'),
('Groww',                     'groww',                'https://groww.in/',                                                  'cpa', 200.00,  'investing',    true,  'ref'),
('Upstox',                    'upstox',               'https://upstox.com/',                                                'cpa', 300.00,  'investing',    true,  'ref'),
('Angel One',                 'angel-one',            'https://www.angelone.in/',                                           'cpa', 250.00,  'investing',    true,  'ref'),
('INDmoney',                  'indmoney',             'https://www.indmoney.com/',                                          'cpa', 150.00,  'investing',    true,  'ref'),

-- ── MUTUAL FUNDS ─────────────────────────────────────────────────────────────
('Coin by Zerodha',           'coin-zerodha',         'https://coin.zerodha.com/',                                          'cpa', 100.00,  'mutual-funds', true,  'ref'),
('Kuvera',                    'kuvera',               'https://kuvera.in/',                                                 'cpa', 50.00,   'mutual-funds', true,  'ref'),
('ET Money',                  'et-money',             'https://www.etmoney.com/',                                           'cpa', 100.00,  'mutual-funds', true,  'ref'),

-- ── LOANS ─────────────────────────────────────────────────────────────────────
-- Personal loans — high CPA, lowest hanging fruit for revenue
('Bajaj Finserv',             'bajaj-finserv',        'https://www.bajajfinserv.in/personal-loan',                         'cpa', 2500.00, 'loans',        true,  'utm_source'),
('MoneyTap',                  'moneytap',             'https://www.moneytap.com/',                                          'cpa', 1500.00, 'loans',        true,  'ref'),
('KreditBee',                 'kreditbee',            'https://kreditbee.in/',                                              'cpa', 800.00,  'loans',        true,  'ref'),
('Navi',                      'navi',                 'https://navi.com/personal-loan/',                                    'cpa', 1000.00, 'loans',        true,  'ref'),
('IDFC FIRST Bank',           'idfc-first',           'https://www.idfcfirstbank.com/personal-loan',                       'cpa', 2000.00, 'loans',        true,  'ref'),
('Tata Capital',              'tata-capital',         'https://www.tatacapital.com/personal-loan.html',                    'cpa', 1800.00, 'loans',        true,  'ref'),

-- ── INSURANCE ─────────────────────────────────────────────────────────────────
-- Revenue share model is standard for insurance aggregators
('PolicyBazaar',              'policybazaar',         'https://www.policybazaar.com/',                                      'revenue_share', 15.00, 'insurance', true, 'PBPartner'),
('Ditto Insurance',           'ditto-insurance',      'https://joinditto.in/',                                              'revenue_share', 10.00, 'insurance', true, 'ref'),
('Acko',                      'acko',                 'https://www.acko.com/',                                              'cpa', 300.00,  'insurance',    true,  'ref'),
('Digit Insurance',           'digit-insurance',      'https://www.godigit.com/',                                           'cpa', 400.00,  'insurance',    true,  'ref'),

-- ── AGGREGATORS (high volume, lower CPA) ─────────────────────────────────────
('BankBazaar',                'bankbazaar',           'https://www.bankbazaar.com/',                                        'cpa', 500.00,  'credit-cards', true,  'ref'),
('PaisaBazaar',               'paisabazaar',          'https://www.paisabazaar.com/',                                       'cpa', 400.00,  'loans',        true,  'ref'),
('EarnKaro',                  'earnkaro',             'https://earnkaro.com/',                                              'cpa', 100.00,  'credit-cards', true,  'ref')

ON CONFLICT (slug) DO UPDATE SET
    commission_rate = EXCLUDED.commission_rate,
    is_active = EXCLUDED.is_active,
    tracking_param = EXCLUDED.tracking_param;
