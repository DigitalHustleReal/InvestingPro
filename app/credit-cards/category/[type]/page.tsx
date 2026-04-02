import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronRight, Home, Wallet, Plane, Gift, Crown, ShoppingBag,
    Fuel, CreditCard, DoorOpen, Star, Check, X, ExternalLink, IndianRupee,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { cn, formatCurrency } from '@/lib/utils';
import { createServiceClient } from '@/lib/supabase/service';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import SEOContentBlock from '@/components/common/SEOContentBlock';
import RelatedPages from '@/components/common/RelatedPages';
import CreditCardsClient from '../../CreditCardsClient';

export const revalidate = 3600;
export const dynamic = 'force-static';

// ─── Category Configuration ────────────────────────────────────────────────────

interface CategoryConfig {
    title: string;
    metaTitle: string;
    metaDescription: string;
    heading: string;
    subheading: string;
    icon: typeof Wallet;
    introContent: string;
    faqs: Array<{ question: string; answer: string }>;
    filterFn: (card: any) => boolean;
    comparisonColumns: string[];
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
    cashback: {
        title: 'Best Cashback Credit Cards in India',
        metaTitle: `Best Cashback Credit Cards in India (${new Date().getFullYear()}) - Compare & Apply | InvestingPro`,
        metaDescription: `Compare the best cashback credit cards in India. Get 1-5% cashback on online shopping, groceries, fuel, dining, and utility bills. Find cards with highest cashback rates. Apply now.`,
        heading: 'Best Cashback Credit Cards',
        subheading: 'Earn 1-5% cashback on every purchase',
        icon: Wallet,
        comparisonColumns: ['Card Name', 'Cashback Rate', 'Annual Fee', 'Best For', 'Rating'],
        introContent: `
            <h3>What Are Cashback Credit Cards?</h3>
            <p>Cashback credit cards return a percentage of your spending as cash — directly credited to your statement or account. Unlike reward points that require complex redemption calculations, <strong>cashback is straightforward</strong>: spend ₹10,000, get ₹200-₹500 back depending on the card and category.</p>

            <h3>Types of Cashback Programs</h3>
            <p>Indian cashback cards come in two main flavors. <strong>Flat-rate cashback cards</strong> (like SBI Cashback) offer a fixed percentage on all spending — typically 1-2%. <strong>Category-specific cashback cards</strong> (like Amazon Pay ICICI or Axis Ace) offer higher rates (3-5%) on specific merchants or categories, with a lower base rate on everything else.</p>

            <h3>How to Maximize Cashback Earnings</h3>
            <p>The key to maximizing cashback is matching your card to your spending pattern. If you spend heavily on Amazon, the Amazon Pay ICICI card at 5% cashback is unbeatable. For bill payments and utility spending, Axis Ace at 2-4% offers the best value. For diversified spending, a flat-rate card like SBI Cashback at 1.5% on everything provides consistent returns.</p>

            <h3>Cashback vs Reward Points: Which Is Better?</h3>
            <p>For most Indian consumers spending ₹20,000-₹50,000/month, cashback cards deliver better value because:</p>
            <ul>
                <li><strong>No redemption hassle</strong> — cashback is auto-credited, no need to track points or worry about expiry.</li>
                <li><strong>Transparent value</strong> — you know exactly what you are earning, unlike points whose value varies by redemption method.</li>
                <li><strong>Better at lower spend levels</strong> — reward point programs often need ₹1L+ monthly spend to achieve comparable value.</li>
                <li><strong>No devaluation risk</strong> — reward programs can change point values; ₹1 cashback is always worth ₹1.</li>
            </ul>

            <h3>Cashback Caps and Limits</h3>
            <p>Most cashback cards have monthly or quarterly caps. For example, a card offering 5% cashback might cap it at ₹500/month. Always check the <strong>maximum cashback limit</strong> and calculate whether a card with lower rate but no cap might give you more total savings. At InvestingPro, we display these limits clearly on each card listing.</p>

            <h3>Best Practices for Cashback Cards</h3>
            <ul>
                <li>Route your highest-spend category through the card with the best rate for that category.</li>
                <li>Combine 2-3 cashback cards for different spending categories (shopping, bills, dining).</li>
                <li>Always pay the full statement balance — interest charges (36-42% APR) will far exceed any cashback earned.</li>
                <li>Check if cashback applies to EMI transactions — some cards exclude converted EMIs from cashback calculations.</li>
            </ul>
        `,
        faqs: [
            { question: 'Which credit card gives the highest cashback in India?', answer: 'Amazon Pay ICICI offers the highest at 5% on Amazon purchases. For broader usage, SBI Cashback gives 1.5% on all online spends, and Axis Ace offers 2-4% on bill payments and utility spends. The best choice depends on where you spend most.' },
            { question: 'Is cashback credited automatically?', answer: 'Most cashback cards auto-credit cashback to your statement within 1-2 billing cycles. Some cards like Amazon Pay ICICI credit cashback as Amazon Pay balance immediately. Check each card\'s terms for the exact cashback credit timeline.' },
            { question: 'Do cashback cards have annual fees?', answer: 'Many excellent cashback cards are Lifetime Free (like Amazon Pay ICICI and IDFC First Classic). Mid-tier cashback cards charge ₹499-₹999, while premium cashback cards may charge ₹1,500+. The fee is usually easily recovered through cashback earnings.' },
            { question: 'What is the maximum cashback I can earn per month?', answer: 'It varies by card. Entry-level cards cap at ₹200-₹500/month, mid-tier at ₹500-₹1,000, and premium cashback cards at ₹1,500-₹3,000. Some cards have per-transaction caps instead of monthly caps. We display all limits on each card listing.' },
            { question: 'Can I get cashback on EMI purchases?', answer: 'Most cards do not offer cashback on purchases converted to EMI. However, the initial transaction may still earn cashback before EMI conversion. Some cards like Citi Cashback offer cashback even on merchant EMI purchases — check individual card terms.' },
        ],
        filterFn: (card: any) => {
            const type = (card.type || '').toLowerCase();
            const name = (card.name || '').toLowerCase();
            const bestFor = (card.best_for || '').toLowerCase();
            return type === 'cashback' || name.includes('cashback') || bestFor.includes('cashback');
        },
    },

    travel: {
        title: 'Best Travel Credit Cards in India',
        metaTitle: `Best Travel Credit Cards in India (${new Date().getFullYear()}) - Airport Lounge, Miles, Forex | InvestingPro`,
        metaDescription: `Compare the best travel credit cards in India with airport lounge access, air miles, low forex markup, travel insurance, and Priority Pass. Book flights, hotels with rewards.`,
        heading: 'Best Travel Credit Cards',
        subheading: 'Earn miles, access lounges, and travel smarter',
        icon: Plane,
        comparisonColumns: ['Card Name', 'Lounge Access', 'Miles/Points', 'Forex Markup', 'Annual Fee'],
        introContent: `
            <h3>Why Get a Travel Credit Card?</h3>
            <p>Travel credit cards are designed for frequent flyers and travelers who want to maximize value from their spending. The best travel cards in India offer <strong>airport lounge access, air miles accumulation, low forex markup fees, complimentary travel insurance, and hotel/flight booking rewards</strong> that can save thousands on every trip.</p>

            <h3>Airport Lounge Access in India</h3>
            <p>One of the most valued travel card benefits, lounge access programs in India work through multiple networks: <strong>Priority Pass</strong> (global), <strong>Mastercard Lounge Key</strong>, <strong>Visa Airport Companion</strong>, and <strong>DreamFolks</strong> (domestic). A single lounge visit saves ₹800-₹2,500 depending on the airport and lounge tier. Cards like HDFC Regalia offer 12+ complimentary visits per year.</p>

            <h3>Understanding Air Miles</h3>
            <p>Travel cards earn air miles or reward points that can be redeemed for flights, hotel stays, and upgrades. The value per mile typically ranges from ₹0.25 to ₹1.50 depending on the program and redemption option. <strong>Transfer partners</strong> are key — cards that let you transfer points to airline loyalty programs (like InterMiles, Air India, Singapore Airlines) often provide the highest value per point.</p>

            <h3>Forex Markup: The Hidden Travel Cost</h3>
            <p>When you use a credit card internationally, banks charge a forex markup of 1-3.5% on every transaction. For a ₹5 Lakh international trip, that is ₹5,000-₹17,500 in markup fees alone. Cards with low forex markup (1-2%) or zero markup can save you significantly:</p>
            <ul>
                <li><strong>Axis Atlas</strong> — zero forex markup on international spends, best for frequent international travelers.</li>
                <li><strong>HDFC Regalia</strong> — 2% forex markup with strong reward earning on travel spends.</li>
                <li><strong>Amex Platinum Travel</strong> — premium forex benefits with comprehensive travel insurance.</li>
                <li><strong>IDFC First Select</strong> — no forex markup with no annual fee, great budget option.</li>
            </ul>

            <h3>Travel Insurance Benefits</h3>
            <p>Premium travel cards include complimentary travel insurance covering: trip cancellation/delay (up to ₹50,000), lost baggage (up to ₹2L), medical emergencies abroad (up to ₹50L), and personal accident cover (up to ₹1 Crore). This alone can be worth ₹5,000-₹10,000 per year in saved insurance premiums.</p>

            <h3>Choosing Between Travel Card Types</h3>
            <ul>
                <li><strong>Domestic travelers (5+ flights/year)</strong> — prioritize lounge access and domestic airline partnerships.</li>
                <li><strong>International travelers</strong> — prioritize low forex markup, Priority Pass, and international airline transfer partners.</li>
                <li><strong>Hotel-focused travelers</strong> — consider co-branded hotel cards (Marriott, ITC) for elite status and free nights.</li>
                <li><strong>Budget travelers</strong> — choose zero-fee cards with basic lounge access like IDFC First Select or AU Zenith+.</li>
            </ul>
        `,
        faqs: [
            { question: 'Which is the best travel credit card in India?', answer: 'For overall value, HDFC Infinia and Axis Magnus are the top picks with unlimited lounge access and excellent reward rates. For mid-range budgets, HDFC Regalia offers great lounge access at moderate fees. For zero annual fee, IDFC First Select provides basic travel perks without cost.' },
            { question: 'How does airport lounge access work with credit cards?', answer: 'Show your credit card at the lounge reception along with your boarding pass. The lounge program (Priority Pass, DreamFolks, etc.) verifies your eligibility. Most cards offer 4-12 complimentary visits per year; additional visits cost ₹800-₹2,000 per person.' },
            { question: 'What is forex markup and how to avoid it?', answer: 'Forex markup is a fee (1-3.5%) charged on every international transaction including online purchases in foreign currency. Cards like Axis Atlas and IDFC First Select charge zero forex markup. Even a 2% markup card saves significantly compared to the standard 3.5%.' },
            { question: 'Can I earn air miles on non-travel spending?', answer: 'Yes, most travel cards earn miles on all spending, not just travel. The earn rate is typically 2-4 miles per ₹100 on regular spending and 5-10 miles per ₹100 on travel-specific spending. Some cards offer accelerated earning on categories like dining, fuel, and international transactions.' },
            { question: 'Is travel insurance on credit cards sufficient?', answer: 'Credit card travel insurance covers the basics: trip cancellation, baggage loss, and medical emergencies. For comprehensive coverage (especially for adventure activities, pre-existing conditions, or high-value trips), consider supplementary travel insurance. Card insurance is a good safety net, not a complete replacement.' },
        ],
        filterFn: (card: any) => {
            const type = (card.type || '').toLowerCase();
            const name = (card.name || '').toLowerCase();
            const bestFor = (card.best_for || '').toLowerCase();
            return type === 'travel' || name.includes('travel') || name.includes('miles') ||
                   bestFor.includes('travel') || bestFor.includes('airline');
        },
    },

    rewards: {
        title: 'Best Rewards Credit Cards in India',
        metaTitle: `Best Rewards Credit Cards in India (${new Date().getFullYear()}) - Points, Benefits & Offers | InvestingPro`,
        metaDescription: `Compare the best rewards credit cards in India. Earn reward points on every purchase, redeem for flights, shopping, and more. Find cards with the highest reward rates.`,
        heading: 'Best Rewards Credit Cards',
        subheading: 'Earn valuable reward points on every purchase',
        icon: Gift,
        comparisonColumns: ['Card Name', 'Reward Rate', 'Welcome Bonus', 'Annual Fee', 'Best For'],
        introContent: `
            <h3>Understanding Reward Credit Cards</h3>
            <p>Reward credit cards earn points on every purchase, which can be redeemed for merchandise, flights, hotel stays, gift vouchers, and statement credits. Unlike cashback (which gives fixed percentages), <strong>reward points can deliver 2-5x more value</strong> when redeemed strategically — especially through airline and hotel transfer partners.</p>

            <h3>How Reward Points Work</h3>
            <p>Most Indian reward cards earn 1-5 points per ₹100-₹150 spent. The value per point varies by card and redemption method: direct statement credits typically offer ₹0.20-₹0.30 per point, catalog redemption ₹0.15-₹0.25, but airline mile transfers can yield ₹0.50-₹1.50 per point. <strong>Always aim for the highest-value redemption</strong>.</p>

            <h3>Accelerated Earning Categories</h3>
            <p>Most reward cards offer base earning rates on all spending and accelerated rates (2-10x) on specific categories like dining, entertainment, travel, online shopping, and partner merchants. Identifying your top spending categories and matching them to a card's accelerated categories is the key to maximizing rewards.</p>

            <h3>Milestone and Bonus Rewards</h3>
            <p>Many premium reward cards offer milestone bonuses at spending thresholds:</p>
            <ul>
                <li><strong>Welcome bonus</strong> — earn 500-10,000 points on first transaction or within first 60 days.</li>
                <li><strong>Quarterly milestones</strong> — bonus points at ₹50K, ₹1L, ₹2L quarterly spend levels.</li>
                <li><strong>Annual milestones</strong> — significant bonus at ₹3L, ₹5L, ₹8L, ₹10L annual spend (often enough to cover annual fees).</li>
                <li><strong>Renewal bonus</strong> — points credited on annual fee payment, partially offsetting the fee cost.</li>
            </ul>

            <h3>Reward Point Expiry and Management</h3>
            <p>Most reward programs have points expiry — typically 2-3 years from earning date. HDFC and Axis points expire after 2 years, while some premium cards offer non-expiring points. Always track your points balance and redeem before expiry to avoid losing earned value.</p>

            <h3>Best Reward Cards by Spending Level</h3>
            <ul>
                <li><strong>Under ₹30K/month spend</strong> — Cashback cards may give better value. If choosing rewards, go for HDFC MoneyBack+ or Axis Neo.</li>
                <li><strong>₹30K-₹75K/month</strong> — Sweet spot for reward cards. HDFC Regalia, Axis Privilege, or SBI Prime offer excellent value.</li>
                <li><strong>₹75K+ monthly spend</strong> — Premium reward cards shine. HDFC Infinia, Axis Magnus, or Amex MRCC deliver outstanding returns through transfer partners and milestone bonuses.</li>
            </ul>
        `,
        faqs: [
            { question: 'What is the best rewards credit card in India?', answer: 'For high spenders, HDFC Infinia (3.3% effective reward rate with transfer partners) is the best. For mid-range, HDFC Regalia offers strong rewards at moderate fees. For everyday spending, SBI Prime and Axis Privilege provide balanced reward programs.' },
            { question: 'How do I redeem reward points?', answer: 'Reward points can be redeemed through the bank\'s rewards portal for: airline miles (best value), hotel points, gift vouchers, statement credits, merchandise, and charity donations. The value per point varies significantly — airline transfers typically give 3-5x more value than catalog redemption.' },
            { question: 'Do reward points expire?', answer: 'Most banks expire points after 2-3 years. HDFC points expire after 2 years, Axis after 2 years, and SBI after 2 years. Some premium cards (like Amex) offer non-expiring points. Always check and redeem before expiry to avoid losing value.' },
            { question: 'What is the value of 1 reward point?', answer: 'It varies by bank and redemption method. HDFC reward points are worth ₹0.20-₹0.50 each, Axis Edge points ₹0.25-₹0.75, and SBI points ₹0.25. Value increases significantly (2-5x) when transferred to airline loyalty programs vs catalog redemption.' },
            { question: 'Should I choose rewards or cashback cards?', answer: 'For spending under ₹30,000/month, cashback is simpler and often more valuable. For ₹50,000+/month, reward cards with strategic redemption (airline transfers, milestone bonuses) significantly outperform cashback. The breakeven is usually around ₹40,000/month spend.' },
        ],
        filterFn: (card: any) => {
            const type = (card.type || '').toLowerCase();
            const bestFor = (card.best_for || '').toLowerCase();
            return type === 'rewards' || type === 'reward' || bestFor.includes('reward');
        },
    },

    premium: {
        title: 'Best Premium Credit Cards in India',
        metaTitle: `Best Premium Credit Cards in India (${new Date().getFullYear()}) - Luxury, Lounge & Lifestyle | InvestingPro`,
        metaDescription: `Compare premium and super-premium credit cards in India. Access unlimited lounges, concierge services, golf privileges, luxury hotel benefits, and elite reward programs.`,
        heading: 'Best Premium Credit Cards',
        subheading: 'Luxury benefits, unlimited lounges, and elite status',
        icon: Crown,
        comparisonColumns: ['Card Name', 'Annual Fee', 'Lounge Visits', 'Key Benefit', 'Min Income'],
        introContent: `
            <h3>What Makes a Card "Premium"?</h3>
            <p>Premium credit cards go beyond basic cashback and rewards to offer <strong>lifestyle experiences, concierge services, unlimited lounge access, golf privileges, hotel elite status, and exclusive event invitations</strong>. In India, premium cards are typically issued to customers with monthly incomes above ₹50,000 and come with annual fees ranging from ₹2,500 to ₹50,000.</p>

            <h3>Premium Card Tiers in India</h3>
            <p>The Indian premium card market has three distinct tiers:</p>
            <ul>
                <li><strong>Mid-Premium (₹2,500-₹5,000 fee)</strong> — HDFC Regalia, SBI Prime, Axis Privilege. Good lounge access, moderate reward rates.</li>
                <li><strong>Super-Premium (₹5,000-₹15,000 fee)</strong> — HDFC Infinia, Axis Magnus, Amex Gold. Excellent rewards, Priority Pass, milestone bonuses.</li>
                <li><strong>Ultra-Premium (₹15,000-₹50,000 fee)</strong> — Amex Platinum, HDFC Diners Club Black. Invitation-only, unlimited lounges, dedicated concierge, luxury experiences.</li>
            </ul>

            <h3>Is a Premium Card Worth the Fee?</h3>
            <p>A simple calculation: add up the value of benefits you will actually use (lounge visits at ₹1,200 each, milestone bonuses, insurance coverage, golf rounds, movie offers). If the total exceeds the annual fee by 2-3x, the card pays for itself. Most premium cards deliver <strong>3-5x ROI</strong> for users who actively use the benefits.</p>

            <h3>Key Premium Benefits Explained</h3>
            <ul>
                <li><strong>Concierge service</strong> — 24/7 personal assistant for restaurant reservations, event tickets, travel bookings, and gift sourcing.</li>
                <li><strong>Golf privileges</strong> — 4-12 complimentary rounds per year at premium courses worth ₹2,000-₹5,000 per round.</li>
                <li><strong>Hotel benefits</strong> — automatic elite status with Marriott/IHG/Hilton, room upgrades, late checkout, and free breakfast.</li>
                <li><strong>Purchase protection</strong> — insurance on purchases against damage/theft for 90-180 days, often up to ₹1-5 Lakhs.</li>
                <li><strong>Extended warranty</strong> — doubles the manufacturer warranty on electronics and appliances purchased with the card.</li>
            </ul>

            <h3>Who Should Get a Premium Card?</h3>
            <p>Premium cards make financial sense if you: earn ₹50,000+/month, fly 4+ times per year (domestic or international), spend ₹50,000+/month on the card, and actively use lifestyle benefits. If you rarely travel and spend under ₹30,000/month, a good cashback or rewards card will serve you better.</p>
        `,
        faqs: [
            { question: 'What is the best premium credit card in India?', answer: 'HDFC Infinia is widely considered the best overall premium card with 3.3% reward rate, unlimited lounge access, and ₹10,000 annual fee. Axis Magnus offers the best travel value. Amex Platinum delivers the most luxurious lifestyle benefits at ₹50,000+ fee.' },
            { question: 'What salary is needed for a premium credit card?', answer: 'Mid-premium cards (HDFC Regalia, SBI Prime) typically require ₹40,000-₹60,000 monthly salary. Super-premium (HDFC Infinia, Axis Magnus) require ₹1L+. Ultra-premium cards are usually invitation-only and require ₹2L+ salary or high NRV with the bank.' },
            { question: 'Are premium card annual fees refundable?', answer: 'Most premium cards offer spend-based fee waivers — spend a certain amount (usually ₹3-10L/year) to get the next year\'s fee waived. Some banks also reverse fees if you call and negotiate after demonstrating heavy usage. Always ask about fee waiver options before applying.' },
            { question: 'How do premium card concierge services work?', answer: 'Call the dedicated concierge number (usually 24/7). They can: book restaurants, find sold-out event tickets, arrange travel, source gifts, make hotel reservations with special rates, and handle everyday tasks. The service is complimentary and can save significant time.' },
            { question: 'Can I upgrade from a regular card to premium?', answer: 'Yes, most banks offer upgrade paths. Use your regular card responsibly for 6-12 months, maintain a good CIBIL score (750+), and request an upgrade. Many banks proactively offer upgrades to customers with high usage and good payment history.' },
        ],
        filterFn: (card: any) => {
            const type = (card.type || '').toLowerCase();
            return type === 'premium' || type === 'super premium' || type === 'luxury' || type === 'ultra-premium';
        },
    },

    shopping: {
        title: 'Best Shopping Credit Cards in India',
        metaTitle: `Best Shopping Credit Cards in India (${new Date().getFullYear()}) - Amazon, Flipkart, Online | InvestingPro`,
        metaDescription: `Compare the best credit cards for online and offline shopping in India. Get 3-5% cashback on Amazon, Flipkart, Myntra, and more. Find cards with the best shopping rewards.`,
        heading: 'Best Shopping Credit Cards',
        subheading: 'Maximize rewards on Amazon, Flipkart, and more',
        icon: ShoppingBag,
        comparisonColumns: ['Card Name', 'Shopping Cashback', 'Partner Brands', 'Annual Fee', 'Best For'],
        introContent: `
            <h3>Why Get a Shopping Credit Card?</h3>
            <p>India's e-commerce market has exploded, and if you regularly shop on Amazon, Flipkart, Myntra, Nykaa, or Swiggy, a shopping credit card can save you <strong>₹5,000-₹20,000 annually</strong>. Co-branded cards with specific retailers offer 3-5% cashback on that platform, while versatile shopping cards offer 2-3% on all online purchases.</p>

            <h3>Co-Branded vs General Shopping Cards</h3>
            <p>Co-branded cards (like Amazon Pay ICICI, Flipkart Axis Bank, Myntra Kotak) are designed around a single retailer — offering 3-5% rewards on that specific platform. General shopping cards (like SBI SimplyCLICK, HDFC Millennia) offer 2-3% rewards across all online merchants. <strong>If 60%+ of your shopping is on one platform, go co-branded. Otherwise, choose a general shopping card.</strong></p>

            <h3>Online vs Offline Shopping Rewards</h3>
            <p>Most shopping cards differentiate between online and offline (POS) transactions. Online purchases typically earn 2-5x more rewards than in-store swipes. If you shop primarily in physical stores, look for cards that offer equal or near-equal offline rewards — cards like HDFC Millennia offer 1% cashback on offline spends alongside 2.5% on online.</p>

            <h3>Making the Most of Sale Seasons</h3>
            <p>Combine your shopping card with sale events for maximum savings:</p>
            <ul>
                <li><strong>Amazon Great Indian Festival + Amazon Pay ICICI</strong> — 5% cashback plus sale discounts can deliver 30-50% effective savings.</li>
                <li><strong>Flipkart Big Billion Days + Flipkart Axis</strong> — additional cashback on already-discounted products.</li>
                <li><strong>No-Cost EMI</strong> — many shopping cards offer zero-cost EMI on partner platforms, letting you spread payments without extra cost.</li>
                <li><strong>Bank-specific offers</strong> — during sales, banks offer additional 10% instant discount (capped at ₹1,500-₹3,000) on their cards.</li>
            </ul>

            <h3>Hidden Benefits of Shopping Cards</h3>
            <ul>
                <li><strong>Purchase protection insurance</strong> — covers items against damage or theft for 90 days after purchase.</li>
                <li><strong>Extended warranty</strong> — doubles manufacturer warranty on electronics (check card terms for eligible categories).</li>
                <li><strong>Price protection</strong> — some cards refund the difference if the price drops within 30 days of purchase.</li>
                <li><strong>Easy EMI conversion</strong> — convert any purchase above ₹2,500 to 3-18 month EMI at competitive interest rates.</li>
            </ul>
        `,
        faqs: [
            { question: 'Which credit card gives the best cashback on Amazon?', answer: 'Amazon Pay ICICI offers 5% cashback for Prime members (3% for non-Prime) on Amazon purchases. It is Lifetime Free with no annual fee. This is the single best card for Amazon shopping in India.' },
            { question: 'What is the best credit card for Flipkart shopping?', answer: 'Flipkart Axis Bank Credit Card offers 5% cashback on Flipkart, Myntra, and Cleartrip purchases. It has no annual fee (Lifetime Free) and also offers 4% cashback on preferred partners and 1.5% on other spends.' },
            { question: 'Can I get no-cost EMI on credit cards?', answer: 'Yes, most shopping credit cards support no-cost EMI on partner platforms (Amazon, Flipkart, etc.) for purchases above ₹3,000-₹5,000. The interest is usually borne by the merchant. Check your card\'s EMI eligibility on each platform before purchasing.' },
            { question: 'Do shopping card rewards work on all websites?', answer: 'General online shopping cards (SBI SimplyCLICK, HDFC Millennia) give rewards on all online transactions. Co-branded cards give maximum rewards only on their specific platform and lower rates elsewhere. For diversified online shopping, choose a general card.' },
            { question: 'Are shopping credit cards worth it if I mostly shop offline?', answer: 'If you primarily shop at physical stores, a general rewards or cashback card may be better. However, HDFC Millennia (1% offline cashback) and some co-branded cards also offer offline benefits. Consider switching more purchases online to maximize shopping card value.' },
        ],
        filterFn: (card: any) => {
            const type = (card.type || '').toLowerCase();
            const name = (card.name || '').toLowerCase();
            const bestFor = (card.best_for || '').toLowerCase();
            return type === 'shopping' || name.includes('shopping') || name.includes('shop') ||
                   bestFor.includes('shopping') || bestFor.includes('online') || name.includes('amazon') || name.includes('flipkart');
        },
    },

    fuel: {
        title: 'Best Fuel Credit Cards in India',
        metaTitle: `Best Fuel Credit Cards in India (${new Date().getFullYear()}) - Fuel Surcharge Waiver & Cashback | InvestingPro`,
        metaDescription: `Compare the best fuel credit cards in India with 1% fuel surcharge waiver, cashback on petrol/diesel, HPCL/BPCL/IndianOil rewards. Save ₹2,000-₹10,000 annually on fuel.`,
        heading: 'Best Fuel Credit Cards',
        subheading: 'Save ₹2,000-₹10,000 annually on petrol and diesel',
        icon: Fuel,
        comparisonColumns: ['Card Name', 'Fuel Surcharge Waiver', 'Fuel Cashback', 'Annual Fee', 'Best For'],
        introContent: `
            <h3>How Fuel Credit Cards Save You Money</h3>
            <p>Every time you pay for fuel with a regular credit card, you lose money to <strong>fuel surcharge</strong> — typically 1% of the transaction + GST (effectively 1.18%). On ₹5,000 monthly fuel spending, that is ₹708 wasted per year. Fuel credit cards waive this surcharge entirely, and many offer additional cashback of 2-5% on fuel purchases.</p>

            <h3>Understanding Fuel Surcharge Waiver</h3>
            <p>Fuel surcharge waiver means the bank absorbs the 1% + GST surcharge that petrol pumps charge on credit card transactions. Most fuel cards waive surcharge on transactions between ₹400 and ₹5,000 per transaction. For maximum savings, always ensure your fuel transaction falls within this range — split larger fills if needed.</p>

            <h3>Co-Branded Fuel Cards vs General Cards</h3>
            <p>India has two types of fuel-beneficial cards:</p>
            <ul>
                <li><strong>Co-branded fuel cards</strong> (like HPCL Kotak, BPCL SBI, IndianOil Citi) — offer 4-6% value-back at the specific fuel brand's pumps but limited benefits elsewhere.</li>
                <li><strong>General cards with fuel benefits</strong> (like Axis Ace, HDFC Regalia) — offer 1% fuel surcharge waiver across all pumps plus good rewards on other spending.</li>
            </ul>
            <p>If you consistently fill up at one brand's pumps, co-branded cards give higher savings. For flexibility, general cards with fuel waivers are better.</p>

            <h3>Calculating Your Annual Fuel Savings</h3>
            <p>At ₹100/liter petrol and a monthly fuel budget of ₹5,000-₹15,000:</p>
            <ul>
                <li><strong>₹5,000/month</strong>: Surcharge waiver saves ₹708/year; 2% cashback adds ₹1,200 = total ₹1,908 savings.</li>
                <li><strong>₹10,000/month</strong>: Surcharge waiver saves ₹1,416/year; 2% cashback adds ₹2,400 = total ₹3,816 savings.</li>
                <li><strong>₹15,000/month</strong>: Surcharge waiver saves ₹2,124/year; 2% cashback adds ₹3,600 = total ₹5,724 savings.</li>
            </ul>

            <h3>Tips for Maximizing Fuel Card Value</h3>
            <ul>
                <li>Keep fuel transactions between ₹400-₹5,000 to stay within the surcharge waiver range.</li>
                <li>Use the fuel card exclusively at pumps — don't use it for in-pump store purchases (those usually don't get fuel surcharge waiver).</li>
                <li>Combine with fuel company loyalty programs (HPCL HP Pay, BPCL SmartDrive) for additional 0.5-1% savings.</li>
                <li>Some cards earn accelerated reward points on fuel — redeem these for further value.</li>
            </ul>
        `,
        faqs: [
            { question: 'Which credit card is best for fuel in India?', answer: 'HPCL Kotak Platinum offers the highest fuel savings at 5% value-back at HPCL pumps. For all-pump usage, Axis Ace (1% surcharge waiver + 2% cashback on fuel) and HDFC Indian Oil (5% at IndianOil) are excellent. RBL ShopRite is good for combined fuel + grocery benefits.' },
            { question: 'What is fuel surcharge waiver on credit cards?', answer: 'Fuel surcharge is a 1% + GST (1.18%) fee charged by petrol pumps on credit card transactions. A fuel surcharge waiver means the bank absorbs this fee, saving you ~1.18% on every fuel purchase. It applies to transactions between ₹400-₹5,000 on most cards.' },
            { question: 'Do all credit cards waive fuel surcharge?', answer: 'No, only select cards offer fuel surcharge waiver. Premium and mid-premium cards (HDFC Regalia, SBI Prime, Axis Privilege) include it as a standard benefit. Entry-level cards may not offer it. Co-branded fuel cards always include it for their specific fuel brand.' },
            { question: 'Is it better to pay for fuel with credit card or cash?', answer: 'With a fuel credit card, paying by card is always better — you save the surcharge (waived) and earn additional cashback/rewards. Without a fuel card, UPI payments may be marginally better as they avoid the 1% surcharge. Cash offers no benefits at all.' },
            { question: 'How much can I save with a fuel credit card annually?', answer: 'Savings depend on your fuel spending. At ₹8,000/month fuel expense, expect ₹2,000-₹5,000 annual savings from surcharge waiver + cashback combined. High fuel spenders (₹15,000+/month) can save ₹5,000-₹10,000+ with the right card.' },
        ],
        filterFn: (card: any) => {
            const type = (card.type || '').toLowerCase();
            const name = (card.name || '').toLowerCase();
            const bestFor = (card.best_for || '').toLowerCase();
            return type === 'fuel' || name.includes('fuel') || name.includes('petrol') || name.includes('indian oil') ||
                   name.includes('hpcl') || name.includes('bpcl') || bestFor.includes('fuel');
        },
    },

    'lifetime-free': {
        title: 'Best Lifetime Free (LTF) Credit Cards in India',
        metaTitle: `Best Lifetime Free Credit Cards in India (${new Date().getFullYear()}) - Zero Annual Fee | InvestingPro`,
        metaDescription: `Compare the best Lifetime Free (LTF) credit cards in India with zero joining and annual fees. Get cashback, rewards, and benefits without paying any fees. Apply now.`,
        heading: 'Best Lifetime Free Credit Cards',
        subheading: 'Zero annual fee, zero joining fee, forever',
        icon: CreditCard,
        comparisonColumns: ['Card Name', 'Key Benefit', 'Cashback/Rewards', 'Network', 'Best For'],
        introContent: `
            <h3>What Are Lifetime Free Credit Cards?</h3>
            <p>Lifetime Free (LTF) credit cards charge <strong>absolutely zero joining fee and zero annual fee — forever</strong>. You never have to worry about meeting spend thresholds for fee waivers or calling the bank to reverse charges. In India, some of the best credit cards are actually Lifetime Free, making them the smartest choice for cost-conscious consumers.</p>

            <h3>Are LTF Cards As Good As Paid Cards?</h3>
            <p>Many people assume LTF cards offer inferior benefits, but that is no longer true. Cards like Amazon Pay ICICI (5% on Amazon), Flipkart Axis (5% on Flipkart), and IDFC First Classic (3x reward points) offer excellent rewards without any fees. However, LTF cards typically don't include premium benefits like lounge access, golf, or concierge services.</p>

            <h3>Best LTF Cards by Spending Pattern</h3>
            <p>Choose your LTF card based on where you spend the most:</p>
            <ul>
                <li><strong>Amazon shoppers</strong> — Amazon Pay ICICI (5% on Amazon, 2% on Amazon Pay partner merchants, 1% on all other spends).</li>
                <li><strong>Flipkart/Myntra shoppers</strong> — Flipkart Axis Bank (5% on Flipkart/Myntra/Cleartrip, 4% on preferred merchants, 1.5% elsewhere).</li>
                <li><strong>General online shopping</strong> — IDFC First Classic (3x reward points on online spends, 1x on offline).</li>
                <li><strong>UPI and bill payments</strong> — Axis Ace (2% cashback on bill payments, 4% on select categories).</li>
                <li><strong>Movie and dining lovers</strong> — AU Small Finance LIT (choose 3 categories for 3.5% cashback each).</li>
            </ul>

            <h3>How Banks Make Money on LTF Cards</h3>
            <p>Banks earn from LTF cards through: merchant discount rate (MDR) — typically 1.5-2.5% charged to merchants on every transaction, interest on revolving credit (36-42% APR if you don't pay the full bill), forex markup on international transactions (3.5%), and interchange fees. This is why they can offer zero fees — they earn enough from usage.</p>

            <h3>Tips for Choosing the Right LTF Card</h3>
            <ul>
                <li><strong>Match to your spending</strong> — the best LTF card is the one aligned with your highest spending category.</li>
                <li><strong>Check cashback caps</strong> — LTF cards often have lower monthly cashback caps than paid cards.</li>
                <li><strong>Consider having 2-3 LTF cards</strong> — since there is no cost, use multiple cards for different categories.</li>
                <li><strong>Don't revolve credit</strong> — the interest charges on unpaid balances will far exceed any rewards earned.</li>
            </ul>
        `,
        faqs: [
            { question: 'What is the best Lifetime Free credit card in India?', answer: 'Amazon Pay ICICI is the most popular LTF card with 5% Amazon cashback. Flipkart Axis Bank is excellent for Flipkart shoppers. IDFC First Classic offers great general rewards. The "best" depends on your primary spending platform.' },
            { question: 'Do Lifetime Free cards really charge nothing forever?', answer: 'Yes, genuine LTF cards never charge joining or annual fees. However, standard transaction charges still apply: forex markup (3.5%), late payment fees, over-limit charges, and interest on revolving credit. Always pay the full bill on time to truly pay zero fees.' },
            { question: 'Can I get a Lifetime Free card with airport lounge access?', answer: 'It is rare but possible. IDFC First Select (LTF with ₹4L annual spend) and some AU Small Finance cards offer limited lounge access. Most lounge-offering cards have annual fees. If lounge access is important, consider a paid card that offers enough lounges to justify the fee.' },
            { question: 'How to convert a paid credit card to Lifetime Free?', answer: 'Call your bank\'s customer service and request a fee waiver or downgrade to an LTF variant. Banks often agree if you threaten to close the card, especially if you have good usage history. Some banks have dedicated retention offers including fee waivers for 1-2 years.' },
            { question: 'Should I choose an LTF card or a paid card with better rewards?', answer: 'If your monthly spend is under ₹30,000, LTF cards almost always offer better net value (rewards minus zero fees). Above ₹50,000/month, paid cards with higher reward rates can outperform LTF cards. Calculate: (expected annual rewards from paid card) minus (annual fee) vs (expected rewards from LTF card).' },
        ],
        filterFn: (card: any) => {
            const fee = Number(card.annual_fee) || 0;
            const joiningFee = Number(card.joining_fee) || 0;
            return fee === 0 && joiningFee === 0;
        },
    },

    'airport-lounge': {
        title: 'Best Airport Lounge Credit Cards in India',
        metaTitle: `Best Airport Lounge Credit Cards in India (${new Date().getFullYear()}) - Priority Pass & Domestic | InvestingPro`,
        metaDescription: `Compare credit cards with airport lounge access in India. Find cards with Priority Pass, domestic lounge access, DreamFolks, and complimentary lounge visits. Apply now.`,
        heading: 'Best Airport Lounge Credit Cards',
        subheading: 'Complimentary domestic and international lounge access',
        icon: DoorOpen,
        comparisonColumns: ['Card Name', 'Domestic Lounges', 'International Lounges', 'Annual Fee', 'Lounge Program'],
        introContent: `
            <h3>Airport Lounge Access: A Premium Travel Perk</h3>
            <p>Airport lounge access is one of the most valued credit card benefits in India, and for good reason. A single domestic lounge visit is worth <strong>₹800-₹1,500</strong>, while international lounges can cost <strong>₹2,000-₹5,000</strong> per visit. A card offering 8-12 complimentary visits effectively provides ₹6,400-₹60,000 in annual value — often exceeding the card's annual fee several times over.</p>

            <h3>Lounge Access Programs in India</h3>
            <p>Indian credit cards provide lounge access through several programs:</p>
            <ul>
                <li><strong>DreamFolks</strong> — India's largest domestic lounge network with 50+ lounges. Most domestic lounge visits go through DreamFolks. Simply show your card + boarding pass at the lounge entrance.</li>
                <li><strong>Priority Pass</strong> — global network of 1,300+ lounges in 600+ cities. Required for international lounge access. Premium cards include Priority Pass membership bundled with the card.</li>
                <li><strong>Mastercard Lounge Key</strong> — alternate international lounge program available with Mastercard premium cards.</li>
                <li><strong>Visa Airport Companion</strong> — Visa's lounge program for Signature and Infinite cardholders.</li>
            </ul>

            <h3>How Many Lounge Visits Do You Actually Need?</h3>
            <p>Calculate based on your travel frequency: if you fly 6 times a year (domestic), you need 6 domestic lounge visits. For 2 international trips, you need 4 visits (departure + arrival). Most mid-premium cards offer 8-12 visits — sufficient for occasional travelers. Frequent flyers should look for unlimited access cards.</p>

            <h3>Domestic vs International Lounge Access</h3>
            <p>Key differences to understand:</p>
            <ul>
                <li><strong>Domestic lounges</strong> — smaller, food + beverages + WiFi, accessed via DreamFolks or bank-specific programs. Available at most Indian airports including Tier 2 cities.</li>
                <li><strong>International lounges</strong> — larger, better amenities (showers, sleeping pods, bars), accessed via Priority Pass. Available at international terminals and foreign airports.</li>
                <li><strong>Companion access</strong> — some cards allow 1-2 guests per visit; others charge ₹800-₹2,000 per guest. Always check guest policies before bringing companions.</li>
            </ul>

            <h3>Cards by Lounge Access Level</h3>
            <ul>
                <li><strong>4-6 visits/year</strong> — Entry point. Cards like ICICI Sapphiro, SBI Prime offer limited but useful access.</li>
                <li><strong>8-12 visits/year</strong> — Sweet spot. HDFC Regalia (12 visits), Axis Privilege (8 visits) cover most travelers.</li>
                <li><strong>Unlimited visits</strong> — For frequent flyers. HDFC Infinia, Axis Magnus, Amex Platinum offer unlimited domestic + international lounge access.</li>
            </ul>
        `,
        faqs: [
            { question: 'Which credit card gives the most airport lounge visits?', answer: 'HDFC Infinia and Axis Magnus offer unlimited domestic and international lounge visits. For mid-range, HDFC Regalia offers 12 visits/year. For zero annual fee, IDFC First Select (with ₹4L annual spend) offers limited domestic lounge access.' },
            { question: 'How do I access airport lounges with my credit card?', answer: 'Go to the lounge, show your credit card, boarding pass, and photo ID. The lounge staff will verify your card\'s lounge access eligibility (via DreamFolks, Priority Pass, etc.). If eligible, you\'ll be allowed entry. No prior registration is needed for most programs.' },
            { question: 'Can I bring guests to the airport lounge?', answer: 'It depends on the card. Some cards allow 1-2 complimentary guests, others charge ₹800-₹2,000 per guest, and some don\'t allow guests at all. Cards like HDFC Infinia allow guests at no charge. Always check your card\'s specific guest policy.' },
            { question: 'Do credit card lounge visits work at international airports?', answer: 'Only if your card includes Priority Pass or an equivalent international lounge program. Domestic lounge access (DreamFolks) only works at Indian airports. Premium cards (HDFC Infinia, Axis Magnus, Amex Platinum) include international lounge access; mid-range cards often don\'t.' },
            { question: 'What amenities are available in airport lounges?', answer: 'Domestic lounges offer: buffet food, beverages (non-alcoholic), WiFi, comfortable seating, charging points, TV, and newspapers. Premium international lounges add: alcoholic beverages, shower facilities, sleeping pods, business centers, and sometimes spa services.' },
        ],
        filterFn: (card: any) => {
            const features = JSON.stringify(card.features || {}).toLowerCase();
            const description = (card.description || '').toLowerCase();
            const type = (card.type || '').toLowerCase();
            return features.includes('lounge') || description.includes('lounge') ||
                   type === 'travel' || type === 'premium';
        },
    },
};

// ─── Static Params ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
    return Object.keys(CATEGORY_CONFIGS).map((type) => ({ type }));
}

// ─── Metadata ───────────────────────────────────────────────────────────────────

interface PageProps {
    params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { type } = await params;
    const config = CATEGORY_CONFIGS[type];
    if (!config) return { title: 'Credit Cards by Category | InvestingPro' };

    return {
        title: config.metaTitle,
        description: config.metaDescription,
        openGraph: {
            title: config.metaTitle,
            description: config.metaDescription,
            url: `https://investingpro.in/credit-cards/category/${type}`,
            type: 'website',
            siteName: 'InvestingPro.in',
        },
        twitter: {
            card: 'summary_large_image',
            title: config.metaTitle,
            description: config.metaDescription,
        },
        alternates: {
            canonical: `https://investingpro.in/credit-cards/category/${type}`,
        },
    };
}

// ─── Helper: Map DB rows to RichProduct ─────────────────────────────────────────

function mapCardToRichProduct(card: any) {
    return {
        id: card.id || card.slug || 'unknown',
        slug: card.slug,
        name: card.name,
        category: 'credit_card' as const,
        provider: card.bank,
        provider_name: card.bank,
        image_url: card.image_url,
        description: card.description || '',
        rating: {
            overall: Number(card.rating) || 4.5,
            trust_score: 85,
            breakdown: {},
        },
        reviewsCount: 0,
        applyLink: card.apply_link || card.source_url || '#',
        bestFor: card.best_for,
        specs: {
            network: card.metadata?.network || 'Visa',
            type: card.type || 'Credit',
        },
        features: card.features || {},
        key_features: card.pros
            ? card.pros.map((p: string) => ({ label: 'Pro', value: p })).slice(0, 3)
            : [],
        pros: card.pros || [],
        cons: card.cons || [],
        is_verified: true,
        updated_at: card.updated_at,
        official_link: card.official_link,
        affiliate_link: card.apply_link,
    };
}

// ─── Comparison Table Component ─────────────────────────────────────────────────

function ComparisonTable({ cards, columns, categoryType }: { cards: any[]; columns: string[]; categoryType: string }) {
    const top5 = cards.slice(0, 5);
    if (top5.length === 0) return null;

    function getCellValue(card: any, column: string): string {
        switch (column) {
            case 'Card Name':
                return card.name || 'N/A';
            case 'Annual Fee':
                const fee = Number(card.annual_fee) || 0;
                return fee === 0 ? 'Lifetime Free' : `₹${fee.toLocaleString('en-IN')}`;
            case 'Cashback Rate':
            case 'Shopping Cashback':
            case 'Fuel Cashback':
                return card.features?.cashback_rate || card.features?.reward_rate || 'Check details';
            case 'Reward Rate':
            case 'Cashback/Rewards':
                return card.features?.reward_rate || card.features?.cashback_rate || 'Check details';
            case 'Best For':
                return card.best_for || card.type || 'General';
            case 'Rating':
                return `${Number(card.rating) || 4.5}/5`;
            case 'Lounge Access':
            case 'Domestic Lounges':
                return card.features?.lounge_access || card.features?.domestic_lounges || 'Check details';
            case 'International Lounges':
                return card.features?.international_lounges || 'Check details';
            case 'Miles/Points':
                return card.features?.miles_rate || card.features?.reward_rate || 'Check details';
            case 'Forex Markup':
                return card.features?.forex_markup || '3.5%';
            case 'Welcome Bonus':
                return card.features?.welcome_bonus || 'Check details';
            case 'Min Income':
                return card.features?.min_income || 'Check details';
            case 'Key Benefit':
                return card.best_for || (card.pros && card.pros[0]) || 'Multiple benefits';
            case 'Partner Brands':
                return card.features?.partner_brands || 'Multiple';
            case 'Fuel Surcharge Waiver':
                return card.features?.fuel_surcharge || '1% waiver';
            case 'Network':
                return card.metadata?.network || card.features?.network || 'Visa/Mastercard';
            case 'Lounge Program':
                return card.features?.lounge_program || 'DreamFolks';
            case 'Lounge Visits':
                return card.features?.lounge_visits || 'Check details';
            default:
                return 'Check details';
        }
    }

    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                Top 5 {CATEGORY_CONFIGS[categoryType]?.heading || 'Credit Cards'} — Quick Comparison
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Side-by-side comparison of the top-rated cards in this category
            </p>
            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="text-left py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                                >
                                    {col}
                                </th>
                            ))}
                            <th className="text-left py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {top5.map((card, idx) => (
                            <tr
                                key={card.id || idx}
                                className={cn(
                                    'border-b border-slate-100 dark:border-slate-800 transition-colors',
                                    idx === 0 && 'bg-primary-50/30 dark:bg-primary-950/10'
                                )}
                            >
                                {columns.map((col) => (
                                    <td key={col} className="py-3 px-3 text-slate-700 dark:text-slate-300">
                                        {col === 'Card Name' ? (
                                            <div className="flex items-center gap-2">
                                                {idx === 0 && (
                                                    <Badge variant="default" className="text-[10px] bg-amber-500 text-white shrink-0">
                                                        #1
                                                    </Badge>
                                                )}
                                                <Link
                                                    href={`/credit-cards/${card.slug}`}
                                                    className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                                                >
                                                    {getCellValue(card, col)}
                                                </Link>
                                            </div>
                                        ) : col === 'Annual Fee' ? (
                                            <span className={cn(
                                                'font-medium',
                                                getCellValue(card, col) === 'Lifetime Free' && 'text-green-600 dark:text-green-400'
                                            )}>
                                                {getCellValue(card, col)}
                                            </span>
                                        ) : (
                                            getCellValue(card, col)
                                        )}
                                    </td>
                                ))}
                                <td className="py-3 px-3">
                                    <Link href={`/credit-cards/${card.slug}`}>
                                        <Button size="sm" variant="outline" className="text-xs whitespace-nowrap">
                                            View Details
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <AffiliateDisclosure variant="button" hasAffiliateLink={true} />
            </div>
        </section>
    );
}

// ─── Page Component ─────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: PageProps) {
    const { type } = await params;
    const config = CATEGORY_CONFIGS[type];

    if (!config) {
        notFound();
    }

    // Fetch credit cards from Supabase
    let allCards: any[] = [];
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from('credit_cards')
            .select('*')
            .order('rating', { ascending: false });

        if (error) {
            console.error(`[CategoryPage] DB error for category "${type}":`, error);
        } else {
            allCards = (data || []).filter(config.filterFn);
        }
    } catch (error) {
        console.error(`[CategoryPage] CRITICAL: Failed to load cards for "${type}":`, error);
        allCards = [];
    }

    const assets = allCards.map(mapCardToRichProduct);
    const IconComponent = config.icon;

    // Build JSON-LD structured data
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://investingpro.in' },
            { '@type': 'ListItem', position: 2, name: 'Credit Cards', item: 'https://investingpro.in/credit-cards' },
            { '@type': 'ListItem', position: 3, name: config.title, item: `https://investingpro.in/credit-cards/category/${type}` },
        ],
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Breadcrumbs */}
            <div className="bg-slate-50 dark:bg-slate-950 pt-24 pb-2">
                <div className="container mx-auto px-4">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Link href="/" className="text-slate-600 hover:text-primary-600 transition-colors" aria-label="Home">
                                    <Home className="w-4 h-4" />
                                </Link>
                            </li>
                            <li className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                <Link href="/credit-cards" className="text-slate-600 hover:text-primary-600 transition-colors">
                                    Credit Cards
                                </Link>
                            </li>
                            <li className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-900 dark:text-white font-medium" aria-current="page">
                                    {config.heading}
                                </span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-slate-50 dark:bg-slate-950 pb-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center py-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 mb-6">
                            <IconComponent className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                                Category: {config.heading.replace('Best ', '')}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            {config.heading}
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
                            {config.subheading}
                        </p>
                        <Badge variant="outline" className="text-xs">
                            {assets.length} cards found &bull; Updated {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </Badge>
                    </div>

                    {/* Affiliate Disclosure */}
                    <div className="max-w-xl mx-auto mb-6">
                        <AffiliateDisclosure variant="inline" hasAffiliateLink={true} className="rounded-xl border border-primary-200/50" />
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="container mx-auto px-4 mb-8">
                <ComparisonTable cards={allCards} columns={config.comparisonColumns} categoryType={type} />
            </div>

            {/* Full Card Listings */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-12">
                {assets.length > 0 ? (
                    <CreditCardsClient initialAssets={assets as any} />
                ) : (
                    <div className="text-center py-16">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            No cards found in this category. Check back soon or explore
                            <Link href="/credit-cards" className="text-primary-600 hover:text-primary-700 ml-1 underline">
                                all credit cards
                            </Link>.
                        </p>
                    </div>
                )}
            </div>

            {/* SEO Content + FAQ + Browse + Disclaimer */}
            <div className="container mx-auto px-4 pb-8 space-y-12">
                {/* Intro Content */}
                <SEOContentBlock title={config.title} content={config.introContent} />

                {/* FAQ Section */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {config.faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group border border-slate-200 dark:border-slate-700 rounded-lg"
                            >
                                <summary className="flex items-center justify-between cursor-pointer p-4 text-left font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                                    <span>{faq.question}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Browse Other Categories */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                        Browse Credit Cards by Category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(CATEGORY_CONFIGS).map(([key, cfg]) => (
                            <Link
                                key={key}
                                href={`/credit-cards/category/${key}`}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
                                    key === type
                                        ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 hover:text-primary-600'
                                )}
                            >
                                <cfg.icon className="w-4 h-4 shrink-0" />
                                <span className="truncate">{cfg.heading.replace('Best ', '')}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Also browse by salary */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                        Browse Credit Cards by Salary Range
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { bracket: '15000-25000', label: '₹15K - ₹25K' },
                            { bracket: '25000-40000', label: '₹25K - ₹40K' },
                            { bracket: '40000-60000', label: '₹40K - ₹60K' },
                            { bracket: '60000-100000', label: '₹60K - ₹1L' },
                            { bracket: 'above-100000', label: 'Above ₹1L' },
                            { bracket: 'students', label: 'Students' },
                            { bracket: 'self-employed', label: 'Self-Employed' },
                            { bracket: 'women', label: 'Women' },
                        ].map(({ bracket, label }) => (
                            <Link
                                key={bracket}
                                href={`/credit-cards/salary/${bracket}`}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary-300 hover:text-primary-600 transition-colors"
                            >
                                <IndianRupee className="w-4 h-4 shrink-0" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Related Pages — Internal Linking */}
                <RelatedPages
                    currentSlug={`category-${params.type}`}
                    category={params.type}
                    maxLinks={6}
                />

                {/* Compliance */}
                <ComplianceDisclaimer variant="compact" />
            </div>
        </div>
    );
}
