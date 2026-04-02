import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, IndianRupee, Users, GraduationCap, Briefcase, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { createServiceClient } from '@/lib/supabase/service';
import AffiliateDisclosure from '@/components/common/AffiliateDisclosure';
import ComplianceDisclaimer from '@/components/common/ComplianceDisclaimer';
import SEOContentBlock from '@/components/common/SEOContentBlock';
import RelatedPages from '@/components/common/RelatedPages';
import CreditCardsClient from '../../CreditCardsClient';

export const revalidate = 3600; // ISR: Revalidate every hour
export const dynamic = 'force-static';

// ─── Bracket Configuration ─────────────────────────────────────────────────────

interface BracketConfig {
    title: string;
    metaTitle: string;
    metaDescription: string;
    heading: string;
    subheading: string;
    icon: typeof IndianRupee;
    salaryRange: string;
    introContent: string;
    faqs: Array<{ question: string; answer: string }>;
    filterFn: (card: any) => boolean;
}

const BRACKET_CONFIGS: Record<string, BracketConfig> = {
    '15000-25000': {
        title: 'Best Credit Cards for Salary ₹15,000 - ₹25,000',
        metaTitle: `Best Credit Cards for ₹15,000-₹25,000 Salary (${new Date().getFullYear()}) | InvestingPro`,
        metaDescription: `Compare the best credit cards for salary between ₹15,000 to ₹25,000 per month. Find entry-level cards with low fees, cashback rewards, and easy approval. Apply online instantly.`,
        heading: 'Best Credit Cards for ₹15,000 - ₹25,000 Salary',
        subheading: 'Entry-level cards with low fees and great starter benefits',
        icon: IndianRupee,
        salaryRange: '₹15,000 - ₹25,000',
        introContent: `
            <h3>Finding the Right Credit Card on a ₹15,000-₹25,000 Salary</h3>
            <p>If you earn between ₹15,000 and ₹25,000 per month, getting your first credit card is an excellent step towards building a strong credit history. Many banks in India now offer entry-level credit cards specifically designed for this income bracket, with minimal fees and practical everyday benefits.</p>

            <h3>What to Look For</h3>
            <p>At this salary range, prioritize cards with <strong>low or zero annual fees</strong> and basic cashback on everyday spending like groceries, fuel, and online purchases. Avoid premium cards with high fees that eat into your savings. Lifetime Free (LTF) cards are ideal — they charge no joining or annual fee ever.</p>

            <h3>Building Your Credit Score</h3>
            <p>Your first credit card is your gateway to a strong CIBIL score. Use it responsibly — spend no more than 30% of your credit limit, always pay the full bill on time, and avoid cash withdrawals. Within 6-12 months of responsible usage, you can see your score climb above 750, unlocking better cards and loan offers.</p>

            <h3>Top Tips for This Income Range</h3>
            <ul>
                <li><strong>Start with secured cards</strong> if you have no credit history — these are backed by a Fixed Deposit and have near-guaranteed approval.</li>
                <li><strong>Look for fuel surcharge waivers</strong> — even small savings of 1% on petrol add up significantly over the year.</li>
                <li><strong>Choose cashback over reward points</strong> — at lower spending levels, flat cashback gives you more tangible value than complex reward programs.</li>
                <li><strong>Set up auto-pay</strong> for at least the minimum due amount to never miss a payment deadline.</li>
            </ul>
        `,
        faqs: [
            { question: 'What is the best credit card for a salary of ₹15,000 per month?', answer: 'For a ₹15,000 monthly salary, the best options are Lifetime Free (LTF) cards like Amazon Pay ICICI, IDFC First Millennia, or secured cards against Fixed Deposits. These have no annual fees and offer basic cashback benefits.' },
            { question: 'Can I get a credit card with a ₹20,000 salary?', answer: 'Yes, many banks approve credit cards for a ₹20,000 salary. HDFC MoneyBack+, Axis Neo, and SBI SimplyCLICK are popular choices. You may also consider secured credit cards for guaranteed approval.' },
            { question: 'What is the minimum CIBIL score needed for entry-level credit cards?', answer: 'Most entry-level cards require a CIBIL score of 700+. If you have no credit history, secured cards against FD don\'t require a CIBIL score. Some fintech cards also accept scores as low as 650.' },
            { question: 'Should I pay the annual fee or get a Lifetime Free card?', answer: 'At this salary range, always prefer Lifetime Free cards. Annual fees of even ₹500 can negate the small cashback earnings. Switch to premium cards only when your salary and spending increase.' },
            { question: 'How can I increase my credit card limit on a ₹15,000-₹25,000 salary?', answer: 'Use the card regularly (but stay under 30% utilization), pay full bills on time for 6 months, then request a limit increase. Many banks auto-increase limits after consistent usage. You can also add an FD as collateral for a higher limit.' },
        ],
        filterFn: (card: any) => {
            const fee = Number(card.annual_fee) || 0;
            return fee <= 500; // Low-fee cards suitable for this bracket
        },
    },

    '25000-40000': {
        title: 'Best Credit Cards for Salary ₹25,000 - ₹40,000',
        metaTitle: `Best Credit Cards for ₹25,000-₹40,000 Salary (${new Date().getFullYear()}) | InvestingPro`,
        metaDescription: `Compare the best credit cards for salary between ₹25,000 to ₹40,000 per month. Find cards with cashback, rewards, fuel surcharge waivers, and more. Apply instantly.`,
        heading: 'Best Credit Cards for ₹25,000 - ₹40,000 Salary',
        subheading: 'Mid-range cards with excellent cashback and rewards',
        icon: IndianRupee,
        salaryRange: '₹25,000 - ₹40,000',
        introContent: `
            <h3>Credit Cards for the ₹25,000-₹40,000 Income Range</h3>
            <p>With a monthly salary of ₹25,000 to ₹40,000, you are in the sweet spot for some of India's most popular credit cards. This income bracket opens the door to cards with meaningful cashback, reward programs, and lifestyle benefits that can save you thousands of rupees annually.</p>

            <h3>Best Categories for Your Spending</h3>
            <p>At this salary level, your major expenses are likely <strong>groceries, fuel, utility bills, and online shopping</strong>. Choose a card that offers accelerated rewards in these categories. For example, cards that give 5% cashback on Amazon or Flipkart shopping, or 1% fuel surcharge waiver, can deliver ₹3,000-₹5,000 in annual savings.</p>

            <h3>Stepping Up from Entry-Level</h3>
            <p>If you already have a basic credit card and a good CIBIL score (750+), consider upgrading to a mid-tier card. These offer better reward rates, occasional lounge access, and higher credit limits. Banks like HDFC, SBI, and Axis frequently upgrade existing customers at no additional cost.</p>

            <h3>Key Selection Criteria</h3>
            <ul>
                <li><strong>Annual fee vs. rewards balance</strong> — a card charging ₹499/year but giving ₹2,000+ in rewards is worth it.</li>
                <li><strong>Complimentary insurance</strong> — many cards in this range include free personal accident cover up to ₹2-5 Lakhs.</li>
                <li><strong>EMI conversion</strong> — look for cards offering easy EMI conversion on large purchases at 12-14% interest rates.</li>
                <li><strong>Welcome benefits</strong> — some cards offer 500-1000 bonus reward points on activation or first transaction.</li>
            </ul>
        `,
        faqs: [
            { question: 'What are the best credit cards for a ₹30,000 monthly salary?', answer: 'Popular options include SBI SimplyCLICK (great for online shopping), HDFC MoneyBack+ (versatile rewards), Axis Ace (2% cashback on bill payments), and Amazon Pay ICICI (5% Amazon cashback). These offer the best value for this income range.' },
            { question: 'Can I get a travel credit card with ₹35,000 salary?', answer: 'Basic travel cards are available at this salary level, though premium travel cards usually require ₹50,000+. Consider cards like HDFC Regalia First or Axis Miles & More that offer introductory travel benefits at moderate fees.' },
            { question: 'How much credit limit will I get on a ₹30,000 salary?', answer: 'Banks typically offer 2-3x your monthly salary as credit limit. So with ₹30,000 salary, expect ₹60,000-₹90,000 initial limit. This can increase to ₹1.5-2 Lakhs with good usage history over 6-12 months.' },
            { question: 'Is it better to have one card or multiple cards at this salary?', answer: 'Start with one primary card and add a second complementary card after 6 months. For example, use SBI SimplyCLICK for online shopping and Axis Ace for utility bills. More than 2-3 cards at this salary level is unnecessary and hard to manage.' },
            { question: 'What hidden charges should I watch out for?', answer: 'Watch for late payment fees (₹500-₹1,000), over-limit charges (2.5% of excess), forex markup (3.5%), cash advance fees (2.5%), and GST on all charges (18%). Always pay the full bill by the due date to avoid the 36-42% annual interest rate on revolving credit.' },
        ],
        filterFn: (card: any) => {
            const fee = Number(card.annual_fee) || 0;
            return fee <= 1000;
        },
    },

    '40000-60000': {
        title: 'Best Credit Cards for Salary ₹40,000 - ₹60,000',
        metaTitle: `Best Credit Cards for ₹40,000-₹60,000 Salary (${new Date().getFullYear()}) | InvestingPro`,
        metaDescription: `Compare the best credit cards for salary between ₹40,000 to ₹60,000 per month. Find mid-premium cards with airport lounge access, travel benefits, and high cashback. Apply now.`,
        heading: 'Best Credit Cards for ₹40,000 - ₹60,000 Salary',
        subheading: 'Mid-premium cards with lounge access and elevated rewards',
        icon: IndianRupee,
        salaryRange: '₹40,000 - ₹60,000',
        introContent: `
            <h3>Unlocking Mid-Premium Credit Cards</h3>
            <p>A salary between ₹40,000 and ₹60,000 per month places you in the mid-premium credit card segment. This is where cards get genuinely exciting — think domestic airport lounge access, accelerated reward rates of 3-5%, complimentary golf rounds, and milestone benefits that reward your spending handsomely.</p>

            <h3>The Sweet Spot for Value</h3>
            <p>Cards in this range often offer the <strong>best rewards-to-fee ratio</strong> in the Indian market. A card charging ₹1,500-₹3,000 annual fee but delivering ₹8,000-₹15,000 in annual value (through lounge visits, milestone rewards, and cashback) is a no-brainer. The key is matching the card to your specific spending pattern.</p>

            <h3>Airport Lounge Access at This Level</h3>
            <p>Many cards at this income level offer 4-8 domestic lounge visits per year through the Mastercard/Visa lounge program or Priority Pass. If you fly even 2-3 times a year, this alone can save ₹4,000-₹6,000 — more than covering the annual fee.</p>

            <h3>Maximizing Your Card Benefits</h3>
            <ul>
                <li><strong>Stack multiple reward categories</strong> — use one card for travel and another for everyday spending to maximize returns.</li>
                <li><strong>Hit milestone spends</strong> — many cards offer bonus rewards at ₹1L, ₹2L, ₹3L annual spend thresholds. Track your spending to hit these targets.</li>
                <li><strong>Use the complimentary insurance</strong> — cards at this level often include ₹5-10L personal accident cover and purchase protection.</li>
                <li><strong>Negotiate fee waivers</strong> — after a year of heavy usage, call your bank to request annual fee reversal.</li>
            </ul>
        `,
        faqs: [
            { question: 'What credit cards can I get with a ₹50,000 salary?', answer: 'With ₹50,000 salary, you can access mid-premium cards like HDFC Regalia, SBI Prime, Axis Privilege, and YES Preferred. These offer domestic lounge access, 2-4x reward points on preferred categories, and milestone benefits.' },
            { question: 'Is HDFC Regalia worth it for a ₹50,000 salary?', answer: 'Yes, HDFC Regalia is excellent at this salary level. It offers 4 reward points per ₹150 spent, 12 complimentary lounge visits/year, milestone benefits up to 25,000 bonus points, and ₹2,500 annual fee that is easily recouped through benefits.' },
            { question: 'How many airport lounge visits do mid-premium cards offer?', answer: 'Typically 4-12 domestic lounge visits per year. For example, HDFC Regalia offers 12 visits, SBI Prime offers 8, and Axis Privilege offers 8 visits. International lounge access usually starts with premium/super-premium cards at higher salary levels.' },
            { question: 'Should I get a co-branded card or a bank card at this salary?', answer: 'It depends on your spending pattern. If you spend heavily on one platform (Amazon, Flipkart, Swiggy), co-branded cards offer 3-5% cashback there. Bank cards like HDFC Regalia offer broader benefits across all categories. Ideally, have one of each.' },
            { question: 'Can I get a forex-friendly card at this salary level?', answer: 'Yes, cards like HDFC Regalia (2% forex markup), Axis Atlas (no forex markup on international spends), and SBI Elite (1.99% forex) are available. If you travel internationally or shop on foreign websites, low forex markup can save you thousands.' },
        ],
        filterFn: (card: any) => {
            const fee = Number(card.annual_fee) || 0;
            return fee <= 3000;
        },
    },

    '60000-100000': {
        title: 'Best Credit Cards for Salary ₹60,000 - ₹1,00,000',
        metaTitle: `Best Credit Cards for ₹60,000-₹1,00,000 Salary (${new Date().getFullYear()}) | InvestingPro`,
        metaDescription: `Compare premium credit cards for salary ₹60,000 to ₹1,00,000 per month. Access airport lounges, international travel benefits, golf privileges, and premium rewards. Apply now.`,
        heading: 'Best Credit Cards for ₹60,000 - ₹1,00,000 Salary',
        subheading: 'Premium cards with international lounge access and elite rewards',
        icon: IndianRupee,
        salaryRange: '₹60,000 - ₹1,00,000',
        introContent: `
            <h3>Premium Credit Cards for High Earners</h3>
            <p>With a monthly salary between ₹60,000 and ₹1,00,000, you qualify for some of India's finest premium credit cards. These cards are designed for professionals and executives who value <strong>international travel perks, Priority Pass lounge access, premium concierge services, and accelerated reward earning</strong>.</p>

            <h3>What Premium Cards Offer</h3>
            <p>Premium credit cards at this level typically include: unlimited domestic lounge access, 6-12 international lounge visits via Priority Pass, complimentary golf sessions, 1% fuel surcharge waiver, movie ticket offers (Buy 1 Get 1), and milestone rewards that can be worth ₹15,000-₹30,000 annually.</p>

            <h3>Maximizing Premium Card Value</h3>
            <p>The annual fees for premium cards range from ₹2,500 to ₹5,000, but the benefits easily exceed ₹20,000+ per year if utilized properly. The key is to <strong>consolidate all spending on 1-2 premium cards</strong> to hit milestone thresholds and earn bonus reward points. Many premium cards also offer spend-based fee waivers.</p>

            <h3>International Travel Benefits</h3>
            <ul>
                <li><strong>Low forex markup</strong> (1.5-2%) saves significantly on international transactions.</li>
                <li><strong>Emergency card replacement</strong> and cash advance available worldwide.</li>
                <li><strong>Travel insurance</strong> up to ₹50L covering trip cancellation, baggage loss, and medical emergencies abroad.</li>
                <li><strong>Complimentary travel concierge</strong> for hotel bookings, restaurant reservations, and event tickets.</li>
            </ul>
        `,
        faqs: [
            { question: 'What are the best premium credit cards for ₹75,000 salary?', answer: 'Top choices include HDFC Regalia Gold (excellent reward rate), Axis Magnus (best for travel), SBI Elite (great lounge program), and Amex Membership Rewards (superior international acceptance). These all offer premium benefits suited for this income level.' },
            { question: 'Is the HDFC Infinia available at ₹80,000 salary?', answer: 'HDFC Infinia typically requires ₹1.5L+ monthly income or an existing relationship with significant NRV. At ₹80,000 salary, HDFC Regalia Gold is the recommended alternative, which offers similar benefits at a lower threshold.' },
            { question: 'How do I maximize Priority Pass lounge visits?', answer: 'Premium cards typically offer 6-12 Priority Pass visits/year. Use them strategically on domestic flights (₹800-₹1,200 per visit saved) and international layovers. Some cards like Axis Magnus offer unlimited lounge visits with a minimum monthly spend.' },
            { question: 'Are premium card annual fees worth paying?', answer: 'Almost always yes at this income level. A ₹5,000 annual fee card that gives ₹20,000+ in lounge visits, milestone rewards, and cashback delivers 4x ROI. Calculate your expected benefits before applying, and choose cards with spend-based fee waivers for added security.' },
            { question: 'Can I get a metal credit card at this salary?', answer: 'Yes, several metal cards are available including Axis Magnus (metal), HDFC Regalia Gold, and OneCard (metal by default). Metal cards at this level usually charge ₹3,000-₹10,000 annual fee and offer premium aesthetics alongside strong reward programs.' },
        ],
        filterFn: (card: any) => {
            const fee = Number(card.annual_fee) || 0;
            return fee <= 5000;
        },
    },

    'above-100000': {
        title: 'Best Credit Cards for Salary Above ₹1,00,000',
        metaTitle: `Best Credit Cards for Salary Above ₹1 Lakh/Month (${new Date().getFullYear()}) | InvestingPro`,
        metaDescription: `Compare super-premium and luxury credit cards for high-income earners above ₹1 Lakh/month. Access unlimited lounges, concierge, golf, premium travel insurance, and elite rewards.`,
        heading: 'Best Credit Cards for Salary Above ₹1,00,000',
        subheading: 'Super-premium and luxury cards for high-income professionals',
        icon: IndianRupee,
        salaryRange: 'Above ₹1,00,000',
        introContent: `
            <h3>Luxury Credit Cards for India's Top Earners</h3>
            <p>Earning above ₹1,00,000 per month unlocks the most exclusive credit cards in India. These super-premium and luxury cards offer <strong>unlimited lounge access worldwide, dedicated relationship managers, invitation-only events, premium concierge services, and reward rates that can return 5-10% value</strong> on your spending.</p>

            <h3>Super-Premium vs Ultra-Premium</h3>
            <p>At this income level, you have access to two tiers: <strong>super-premium</strong> cards (₹5,000-₹15,000 annual fee) like HDFC Infinia and Axis Magnus, and <strong>ultra-premium/invitation-only</strong> cards like HDFC Diners Club Black and Amex Platinum that deliver unparalleled luxury experiences. The right choice depends on whether you value travel rewards or lifestyle benefits more.</p>

            <h3>What Sets These Cards Apart</h3>
            <p>Beyond standard rewards, these cards offer experiences money cannot easily buy: access to sold-out events, complimentary stays at 5-star hotels, dedicated airport meet-and-greet services, and invitation to exclusive culinary and cultural events. The annual fees (₹5,000-₹50,000) are offset many times over by the experiential benefits.</p>

            <h3>Maximizing Value at the Top</h3>
            <ul>
                <li><strong>Consolidate spending</strong> — route all expenses through 1-2 super-premium cards to hit annual spend milestones for massive bonus rewards.</li>
                <li><strong>Leverage complimentary memberships</strong> — golf club access, spa memberships, and hotel loyalty status that come free with these cards.</li>
                <li><strong>International travel benefits</strong> — zero forex markup, comprehensive travel insurance up to ₹1 Crore, and global emergency assistance.</li>
                <li><strong>Tax-efficient rewards</strong> — reward points and cashback are not taxable, making high-reward cards an efficient way to save.</li>
            </ul>
        `,
        faqs: [
            { question: 'What is the best credit card for salary above ₹1 Lakh in India?', answer: 'The HDFC Infinia is widely considered the best overall, offering 3.3% reward rate, unlimited lounge access, and premium travel benefits. Axis Magnus is best for travel-focused users, while Amex Platinum offers the most luxurious lifestyle benefits.' },
            { question: 'How do I get an invitation-only credit card?', answer: 'Invitation-only cards like HDFC Diners Club Black require a relationship with the bank. Maintain a high NRV (₹10L+ in savings/FD), spend ₹3-5L+ annually on existing premium cards, and request an upgrade. Some banks also offer these based on salary credited to their account.' },
            { question: 'Is it worth paying ₹10,000+ annual fee for a credit card?', answer: 'At ₹1L+ monthly income with corresponding spending, absolutely. A card like HDFC Infinia with ₹10,000 fee easily delivers ₹50,000+ in annual value through 3.3% reward rate, unlimited lounges (₹800-₹1,200 per visit), milestone bonuses, and complimentary memberships.' },
            { question: 'What credit limit can I expect at ₹1 Lakh+ salary?', answer: 'Banks typically offer ₹3-10 Lakhs initial credit limit at this salary. With good usage and relationship building, limits can go up to ₹15-25 Lakhs. Some super-premium cards offer customized limits based on your overall banking relationship.' },
            { question: 'Should I go for cashback or reward points at this income level?', answer: 'Reward points are usually better at high spending levels because premium cards offer 2-5x multipliers on specific categories. With ₹5L+ annual spend, reward points on HDFC Infinia or Axis Magnus can yield ₹15,000-₹25,000 in value vs ₹5,000-₹8,000 from flat cashback cards.' },
        ],
        filterFn: (card: any) => {
            const type = (card.type || '').toLowerCase();
            return type === 'premium' || type === 'super premium' || type === 'luxury';
        },
    },

    'students': {
        title: 'Best Credit Cards for Students in India',
        metaTitle: `Best Credit Cards for Students in India (${new Date().getFullYear()}) | InvestingPro`,
        metaDescription: `Compare the best credit cards for students in India. Find zero annual fee student cards, secured cards against FD, and cards with no income proof requirement. Apply now.`,
        heading: 'Best Credit Cards for Students',
        subheading: 'Zero fee cards to start building your credit history',
        icon: GraduationCap,
        salaryRange: 'Students',
        introContent: `
            <h3>Getting Your First Credit Card as a Student</h3>
            <p>Building a credit history early is one of the smartest financial moves a student can make. In India, several banks offer <strong>student-friendly credit cards with zero annual fees, low credit limits, and easy approval</strong> — perfect for learning responsible credit usage before entering the workforce.</p>

            <h3>Types of Student Credit Cards</h3>
            <p>There are three main options for students: <strong>Secured credit cards</strong> (backed by a Fixed Deposit — guaranteed approval, no income proof needed), <strong>add-on cards</strong> (linked to a parent's primary card), and <strong>student-specific cards</strong> (offered by banks like SBI, ICICI, and Axis with minimal documentation). Each has its advantages depending on your situation.</p>

            <h3>How to Get Approved Without Income</h3>
            <p>Most student cards don't require income proof. Instead, you can use a Fixed Deposit (as low as ₹5,000-₹15,000) as collateral for a secured card. Your credit limit will be 80-90% of the FD amount. This is the safest and most reliable path to your first credit card.</p>

            <h3>Building Credit History Early</h3>
            <ul>
                <li><strong>Start with a ₹10,000 limit</strong> — small enough to prevent overspending but sufficient for building credit.</li>
                <li><strong>Use for subscriptions</strong> — set up recurring payments (Netflix, Spotify, cloud storage) for consistent, manageable usage.</li>
                <li><strong>Pay in full every month</strong> — never revolve credit or pay just the minimum due.</li>
                <li><strong>Keep utilization under 30%</strong> — on a ₹10,000 limit, never have more than ₹3,000 outstanding at any time.</li>
            </ul>
        `,
        faqs: [
            { question: 'Can a student get a credit card in India without income?', answer: 'Yes, students can get secured credit cards against a Fixed Deposit without showing any income proof. Options include IDFC First WOW, Kotak 811 secured card, and SBI Unnati. You just need a valid ID, address proof, and a small FD (₹5,000-₹15,000).' },
            { question: 'What is the best credit card for college students?', answer: 'The IDFC First WOW (secured) and SBI Unnati cards are the best for college students. Both have zero annual fees, require no income proof, and offer basic cashback. The IDFC First WOW card also offers attractive rewards on online spending.' },
            { question: 'How much FD do I need for a secured credit card?', answer: 'Most banks require a minimum FD of ₹5,000 to ₹25,000. Your credit limit will be 75-90% of the FD amount. For example, a ₹15,000 FD gets you approximately ₹12,000-₹13,500 credit limit.' },
            { question: 'Will a student credit card help build my CIBIL score?', answer: 'Absolutely! Using a credit card responsibly (paying full bills on time, keeping low utilization) is one of the fastest ways to build a CIBIL score. After 6-12 months of usage, you\'ll have a credit score of 700+, which helps when applying for loans or cards after graduation.' },
            { question: 'Should I get an add-on card or my own student card?', answer: 'Get your own card if possible. An add-on card on your parent\'s account doesn\'t independently build your credit history. Having your own card — even a small secured card — starts building your personal CIBIL score from day one.' },
        ],
        filterFn: (card: any) => {
            const fee = Number(card.annual_fee) || 0;
            return fee === 0;
        },
    },

    'self-employed': {
        title: 'Best Credit Cards for Self-Employed in India',
        metaTitle: `Best Credit Cards for Self-Employed & Freelancers (${new Date().getFullYear()}) | InvestingPro`,
        metaDescription: `Compare credit cards for self-employed professionals, freelancers, and business owners in India. Find cards with flexible income proof, business expense tracking, and high limits.`,
        heading: 'Best Credit Cards for Self-Employed & Freelancers',
        subheading: 'Flexible income proof requirements for entrepreneurs and freelancers',
        icon: Briefcase,
        salaryRange: 'Self-Employed',
        introContent: `
            <h3>Credit Cards for the Self-Employed</h3>
            <p>Being self-employed — whether you are a freelancer, consultant, small business owner, or gig worker — should not prevent you from accessing quality credit cards. Many Indian banks now have <strong>flexible income documentation processes</strong> for self-employed applicants, accepting ITR, bank statements, and GST returns as proof of income.</p>

            <h3>Documentation You Will Need</h3>
            <p>Unlike salaried applicants who simply show salary slips, self-employed individuals need to provide: <strong>last 2 years' ITR (Income Tax Returns)</strong>, 6-12 months' bank statements showing regular income, business registration documents (GST, MSME, or Company PAN), and KYC documents. The higher your declared income in ITR, the better your card options.</p>

            <h3>Best Card Types for Self-Employed</h3>
            <p>Business credit cards are often the best choice, as they offer higher limits, expense categorization, GST input credits on fees, and employee add-on cards. However, if your personal income qualifies, premium personal cards can offer better rewards. Some top options include Amex Business cards, HDFC Business Regalia, and SBI Business Advantage.</p>

            <h3>Tips for Self-Employed Applicants</h3>
            <ul>
                <li><strong>File ITR on time</strong> — banks heavily rely on ITR for self-employed credit assessment. Higher declared income = better cards.</li>
                <li><strong>Maintain a healthy bank balance</strong> — average quarterly balance of ₹1-2L improves approval chances significantly.</li>
                <li><strong>Start with a secured card</strong> if you have low ITR or irregular income — build credit first, upgrade later.</li>
                <li><strong>Consider business cards</strong> — they separate personal and business expenses, simplify GST filing, and offer business-specific rewards.</li>
            </ul>
        `,
        faqs: [
            { question: 'Can self-employed people get credit cards in India?', answer: 'Yes, most major banks offer credit cards to self-employed individuals. You need to provide ITR (last 2 years), bank statements (6-12 months), and business registration documents. Many banks also offer secured cards that don\'t require income proof.' },
            { question: 'What documents do freelancers need for a credit card?', answer: 'Freelancers typically need: PAN card, Aadhaar, last 2 years\' ITR, 6 months\' bank statements showing freelance income, and any business registration (GST, if applicable). Some banks also accept client contracts or invoice records as supplementary proof.' },
            { question: 'What is the best business credit card for self-employed?', answer: 'HDFC Business Regalia (great rewards + lounge access), Amex Business Gold (best international acceptance), and SBI Business Advantage (low fees + fuel benefits) are top choices. Choice depends on your spending pattern and whether you travel frequently.' },
            { question: 'Is it harder to get a credit card if you are self-employed?', answer: 'It can be slightly more complex documentation-wise, but approval rates are similar if you have good ITR and banking history. Key factors: declared income in ITR, CIBIL score (750+), regular bank account activity, and at least 2 years of business vintage.' },
            { question: 'Can I get a premium credit card as a freelancer?', answer: 'Yes, if your declared annual income (per ITR) is ₹6L+, you can qualify for mid-premium cards. At ₹12L+, premium cards like HDFC Regalia become accessible. The key is having proper documentation — banks don\'t discriminate by employment type, only by provable income.' },
        ],
        filterFn: () => true, // Show all cards for self-employed
    },

    'women': {
        title: 'Best Credit Cards for Women in India',
        metaTitle: `Best Credit Cards for Women in India (${new Date().getFullYear()}) | InvestingPro`,
        metaDescription: `Compare the best credit cards designed for women in India. Find cards with shopping rewards, lifestyle benefits, travel perks, dining cashback, and exclusive offers for women.`,
        heading: 'Best Credit Cards for Women',
        subheading: 'Cards with shopping rewards, lifestyle benefits, and exclusive perks',
        icon: Heart,
        salaryRange: 'Women',
        introContent: `
            <h3>Credit Cards Designed for Women</h3>
            <p>Several Indian banks offer credit cards with benefits tailored specifically for women, including <strong>enhanced rewards on shopping, dining, and wellness categories, lower annual fees, and exclusive lifestyle offers</strong>. Beyond women-specific cards, many mainstream cards also offer excellent value for women's typical spending patterns.</p>

            <h3>Best Spending Categories to Target</h3>
            <p>Cards with accelerated rewards on <strong>fashion and lifestyle shopping (Myntra, Nykaa, Ajio), dining and food delivery (Swiggy, Zomato), grocery and essentials, and wellness (spa, fitness, health)</strong> tend to offer the highest value. Cards like HDFC She card and Axis My Zone offer 2-5x rewards in these categories.</p>

            <h3>Women-Specific Card Benefits</h3>
            <p>Several banks offer exclusive benefits for women cardholders: lower fuel surcharge, enhanced cashback on select merchants, complimentary spa and salon vouchers, reduced joining fees, and special EMI offers on jewelry and electronics. Some cards also offer complimentary personal accident insurance designed for women professionals.</p>

            <h3>Building Financial Independence</h3>
            <ul>
                <li><strong>Get your own card</strong> — avoid add-on cards on a spouse's or family member's account. Build your independent credit history.</li>
                <li><strong>Use rewards strategically</strong> — channel regular expenses (grocery, utility bills, subscriptions) through the card to accumulate meaningful rewards.</li>
                <li><strong>Consider lifestyle benefits</strong> — cards with BookMyShow, Swiggy, and shopping portal cashback can deliver ₹5,000-₹10,000 in annual savings.</li>
                <li><strong>Leverage welcome offers</strong> — many women-focused cards offer enhanced welcome bonuses worth ₹1,000-₹2,000.</li>
            </ul>
        `,
        faqs: [
            { question: 'What are the best credit cards for women in India?', answer: 'Top options include HDFC Solitaire (designed for women with enhanced dining/shopping rewards), Axis My Zone (lifestyle benefits), SBI Her Card (women-specific perks), and Amazon Pay ICICI (great for online shopping). Choice depends on your spending pattern and income level.' },
            { question: 'Do women get special rates or benefits on credit cards?', answer: 'Yes, several banks offer women-specific benefits including lower annual fees, enhanced rewards on fashion/beauty/dining categories, complimentary spa/salon vouchers, and special EMI offers. Some banks also offer lower interest rates for women applicants with good credit scores.' },
            { question: 'Can a homemaker apply for a credit card?', answer: 'Yes, homemakers can apply for secured credit cards against Fixed Deposits without income proof. Some banks also consider household income or spouse\'s income for card eligibility. Add-on cards are another option, though they don\'t build independent credit history.' },
            { question: 'What is the best Lifetime Free credit card for women?', answer: 'Amazon Pay ICICI (5% Amazon cashback), IDFC First Classic (no annual fee + good rewards), and Flipkart Axis Bank (cashback on Flipkart) are excellent LTF options. These offer great value for online shopping without any annual fee burden.' },
            { question: 'Is it important for women to have their own credit card?', answer: 'Absolutely. Having your own credit card builds your independent CIBIL score, which is crucial for financial independence — whether for loans, renting property, or future credit applications. Start with a simple card and upgrade as your income grows.' },
        ],
        filterFn: (card: any) => {
            const type = (card.type || '').toLowerCase();
            const name = (card.name || '').toLowerCase();
            const bestFor = (card.best_for || '').toLowerCase();
            return type === 'shopping' || type === 'lifestyle' || type === 'cashback' ||
                   name.includes('she') || name.includes('her') || name.includes('woman') || name.includes('solitaire') ||
                   bestFor.includes('shopping') || bestFor.includes('lifestyle');
        },
    },
};

// ─── Static Params ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
    return Object.keys(BRACKET_CONFIGS).map((bracket) => ({ bracket }));
}

// ─── Metadata ───────────────────────────────────────────────────────────────────

interface PageProps {
    params: Promise<{ bracket: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { bracket } = await params;
    const config = BRACKET_CONFIGS[bracket];
    if (!config) return { title: 'Credit Cards by Salary | InvestingPro' };

    return {
        title: config.metaTitle,
        description: config.metaDescription,
        openGraph: {
            title: config.metaTitle,
            description: config.metaDescription,
            url: `https://investingpro.in/credit-cards/salary/${bracket}`,
            type: 'website',
            siteName: 'InvestingPro.in',
        },
        twitter: {
            card: 'summary_large_image',
            title: config.metaTitle,
            description: config.metaDescription,
        },
        alternates: {
            canonical: `https://investingpro.in/credit-cards/salary/${bracket}`,
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

// ─── Page Component ─────────────────────────────────────────────────────────────

export default async function SalaryBracketPage({ params }: PageProps) {
    const { bracket } = await params;
    const config = BRACKET_CONFIGS[bracket];

    if (!config) {
        notFound();
    }

    // Fetch credit cards from Supabase
    let cards: any[] = [];
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from('credit_cards')
            .select('*')
            .order('rating', { ascending: false });

        if (error) {
            console.error(`[SalaryBracketPage] DB error for bracket "${bracket}":`, error);
        } else {
            // Apply bracket-specific filter
            cards = (data || []).filter(config.filterFn);
        }
    } catch (error) {
        console.error(`[SalaryBracketPage] CRITICAL: Failed to load cards for "${bracket}":`, error);
        cards = [];
    }

    const assets = cards.map(mapCardToRichProduct);
    const IconComponent = config.icon;

    // Build JSON-LD structured data
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://investingpro.in' },
            { '@type': 'ListItem', position: 2, name: 'Credit Cards', item: 'https://investingpro.in/credit-cards' },
            { '@type': 'ListItem', position: 3, name: config.title, item: `https://investingpro.in/credit-cards/salary/${bracket}` },
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
                                    {config.salaryRange}
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
                                Salary Range: {config.salaryRange}
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

            {/* Card Listings */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-12">
                {assets.length > 0 ? (
                    <CreditCardsClient initialAssets={assets as any} />
                ) : (
                    <div className="text-center py-16">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            No cards found for this salary range. Check back soon or explore
                            <Link href="/credit-cards" className="text-primary-600 hover:text-primary-700 ml-1 underline">
                                all credit cards
                            </Link>.
                        </p>
                    </div>
                )}
            </div>

            {/* SEO Content + FAQ + Disclaimer */}
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

                {/* Browse Other Salary Ranges */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                        Browse Credit Cards by Salary Range
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(BRACKET_CONFIGS).map(([key, cfg]) => (
                            <Link
                                key={key}
                                href={`/credit-cards/salary/${key}`}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors',
                                    key === bracket
                                        ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 hover:text-primary-600'
                                )}
                            >
                                <cfg.icon className="w-4 h-4 shrink-0" />
                                <span className="truncate">{cfg.salaryRange}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Related Pages — Internal Linking */}
                <RelatedPages
                    currentSlug={`salary-${bracket}`}
                    category="credit-cards"
                    maxLinks={6}
                />

                {/* Compliance */}
                <ComplianceDisclaimer variant="compact" />
            </div>
        </div>
    );
}
