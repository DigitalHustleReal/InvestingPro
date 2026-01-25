
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  shortBio: string;
  fullBio: string;
  story: string; // "My Story" section
  expertise: string[];
  education: string[];
  experience: string[];
  location: string;
  social: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  quote: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'rahul-kapoor',
    name: 'Rahul Kapoor',
    role: 'Editor-in-Chief',
    image: '/images/team/rahul-kapoor.png',
    location: 'New Delhi',
    shortBio: '18+ years in financial journalism, formerly with The Economic Times and Mint. Expert in macroeconomics, RBI policy, and banking regulations.',
    fullBio: 'Rahul Kapoor is the Editor-in-Chief of InvestingPro India, where he oversees the editorial standards and strategic direction of the platform. With nearly two decades of experience in financial journalism, Rahul has covered everything from the 2008 global recession to India\'s 2016 demonetization and the post-COVID market boom. Before joining InvestingPro, he served as a Senior Editor at a leading national business daily, where his column on RBI policy was widely read by industry insiders.',
    story: 'I started my career as a junior reporter covering the bond market in Mumbai. I quickly realized that while institutional investors had access to Bloomberg terminals and sophisticated data, the average Indian investor was making decisions based on tips from uncles or shady SMS alerts. I founded the editorial mission of InvestingPro on a simple premise: "Democratize high-quality financial intelligence." I believe that when you give people the right data, they make the right decisions. My goal is to build a platform that respects the user\'s intelligence and values their time.',
    expertise: ['Macroeconomics', 'RBI Policy', 'Banking Regulations', 'Debt Markets'],
    education: [
      'Masters in Economics, Delhi School of Economics',
      'PG Diploma in Journalism, Asian College of Journalism'
    ],
    experience: [
      'Senior Editor, National Business Daily (2018-2024)',
      'Banking Correspondent, Leading Financial Wire (2012-2018)'
    ],
    social: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'rahul.k@investingpro.in'
    },
    quote: "In a world of noise, clarity is the most expensive asset. We provide it for free."
  },
  {
    id: 'priya-subramaniam',
    name: 'Priya Subramaniam',
    role: 'Lead Investment Analyst',
    image: '/images/team/priya-subramaniam.png',
    location: 'Bengaluru',
    shortBio: 'CFA Charterholder and former Fund Manager with 12 years of experience managing equity portfolios. Priya specializes in decoding Mutual Fund strategies.',
    fullBio: 'Priya Subramaniam leads the Investment Analysis team at InvestingPro. A CFA Charterholder, she brings institutional-grade rigor to retail mutual fund analysis. She spent over a decade on the buy-side, managing mid-cap portfolios for a boutique wealth management firm in Chennai. Priya is known for her deep-dives into fund manager styles and her ability to spot "closet indexers"—funds that charge high fees but just copy the benchmark.',
    story: 'My "Aha!" moment came when I saw my own aunt being sold a terrible ULIP product by a bank relationship manager she had trusted for 20 years. It made me furious. I realized that mis-selling in India isn\'t an accident; it\'s a business model. I left active fund management to write for InvestingPro because leverage matters. As a fund manager, I helped 50 wealthy families get richer. Here, I can help 50 million Indian families stop getting fleeced.',
    expertise: ['Mutual Funds', 'Equity Research', 'Portfolio Construction', 'SIP Strategies'],
    education: [
      'CFA Charterholder, CFA Institute',
      'MBA in Finance, IIM Bangalore'
    ],
    experience: [
      'Portfolio Manager, Zenith Wealth (2016-2024)',
      'Equity Analyst, Southern Cap (2012-2016)'
    ],
    social: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'priya.s@investingpro.in'
    },
    quote: "Don't confuse luck with skill. A bull market makes everyone look like a genius."
  },
  {
    id: 'aditya-gokhale',
    name: 'Aditya Gokhale',
    role: 'Senior Credit Strategist',
    image: '/images/team/aditya-gokhale.png',
    location: 'Mumbai',
    shortBio: 'Ex-HDFC Bank Product Manager who knows the credit card industry from the inside out. Aditya decodes the fine print and reward points.',
    fullBio: 'Aditya Gokhale is the guy banks are afraid of. As a former Product Manager at one of India\'s largest private banks, he designed the very credit card reward structures he now deconstructs for our readers. He understands the math behind "Interchange Fees," "MDR," and "No Cost EMI"—and he explains exactly who is paying for it (hint: usually you).',
    story: 'I spent 8 years building credit card products. We used to have meetings about "breakage"—banking jargon for points that expire unused. That\'s free money for the bank. I switched sides because I got tired of optimizing for the bank\'s P&L instead of the customer\'s wallet. Now, I use my insider knowledge to find loopholes, maximize reward points, and help you fly Business Class for free using just your grocery spend.',
    expertise: ['Credit Cards', 'Rewards Optimization', 'Travel Hacking', 'Credit Score Repair'],
    education: [
      'MBA in Marketing, JBIMS Mumbai',
      'B.Tech, COEP Pune'
    ],
    experience: [
      'Product Manager (Cards), Top Private Bank (2017-2024)',
      'Business Analyst, Fintech Startup (2014-2017)'
    ],
    social: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'aditya.g@investingpro.in'
    },
    quote: "A credit card is a sharp tool. It can build you a house or cut your hand. I teach you how to handle the handle."
  },
  {
    id: 'zoya-khan',
    name: 'Zoya Khan',
    role: 'Consumer Finance Lead',
    image: '/images/team/zoya-khan.png',
    location: 'Gurugram',
    shortBio: 'Personal Finance Strategist helping millennials save smarter. Expert in deals, loans, and savings account arbitrage.',
    fullBio: 'Zoya Khan represents the new generation of Indian investors. She doesn\'t believe in starving yourself today to be rich at 60. She focuses on "Lifestyle Optimization"—getting the best value for every rupee spent. From negotiating lower interest rates on personal loans to finding the best neo-bank for foreign travel, Zoya covers the practical, day-to-day money decisions that impact millennials.',
    story: 'I graduated with a student loan and zero financial knowledge. I made every mistake in the book—maxed out credit cards, bought endowment plans, kept money in a 2.5% savings account. It took me 3 years to dig myself out. I write for the 22-year-old me. I want to make finance feel like lifestyle content—accessible, aesthetic, and immediately useful. No jargon, just "Do this, save ₹5000 right now."',
    expertise: ['Personal Loans', 'Student Finance', 'E-commerce Deals', 'Travel Insurance'],
    education: [
      'B.Com (Hons), SRCC Delhi',
      'Certified Financial Planner (CFP)'
    ],
    experience: [
      'Editor, Lifestyle & Money Blog (2020-2024)',
      'Content Strategist, EdTech Unicorn (2018-2020)'
    ],
    social: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'zoya.k@investingpro.in'
    },
    quote: "Frugality isn't about being cheap. It's about spending extravagantly on what you love and ruthlessly cutting costs on what you don't."
  },
  {
    id: 'vikram-singh',
    name: 'Vikram Singh',
    role: 'Head of Banking & Loans',
    image: '/images/team/vikram-singh.png',
    location: 'Chandigarh',
    shortBio: '20-year retail banking veteran. The authority on Home Loans, Property Finance, and MSME lending.',
    fullBio: 'Vikram Singh has seen it all. He started as a branch manager in Ludhiana and rose to lead Mortgage Sales for North India at a PSU Bank. He understands the paperwork, the bureaucracy, and the "unwritten rules" of getting a loan sanctioned in India. Vikram heads our Banking & Loans vertical, ensuring our advice works not just in Mumbai offices but in Tier-2 bank branches across the country.',
    story: 'Banking in India is a relationship game. I\'ve seen valid loan applications rejected because a file was thin, and borderline ones approved because the applicant knew how to present their case. Retiring early gave me a chance to share this "street smarts" with a wider audience. I write for the small business owner in Jalandhar and the first-time home buyer in Noida who feels intimidated by bank managers.',
    expertise: ['Home Loans', 'MSME Finance', 'Property Legal', 'Loan Restructuring'],
    education: [
      'MA in History, Panjab University',
      'CAIIB (Certified Associate of Indian Institute of Bankers)'
    ],
    experience: [
      'Zonal Head (Mortgages), PSU Bank (2010-2022)',
      'Branch Manager, Retail Banking (2002-2010)'
    ],
    social: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'vikram.s@investingpro.in'
    },
    quote: "The bank needs you more than you need the bank. Once you understand that negotiation leverage, you win."
  },
  {
    id: 'anjali-das',
    name: 'CA Anjali Das',
    role: 'Tax & Insurance Expert',
    image: '/images/team/anjali-das.png',
    location: 'Kolkata',
    shortBio: 'Practicing Chartered Accountant making tax compliance simple. Expert in Income Tax, GST, and Claim Settlement.',
    fullBio: 'Anjali Das is a practicing Chartered Accountant based in Kolkata with a specialization in personal taxation and insurance claims. Unlike typical CAs who speak in section numbers, Anjali speaks in plain English. She heads our Compliance & Protection vertical, covering everything from filing ITR-1 to fighting rejected health insurance claims.',
    story: 'My father had a heart attack when I was 19. The insurance company rejected the claim on a technicality—a pre-existing condition clause hidden on page 42. We lost our savings fighting that. That experience defined my career. I became a CA not just to file taxes, but to read the fine print that destroys families. My mission is to ensure no InvestingPro reader ever gets a claim rejected.',
    expertise: ['Income Tax Filing', 'GST for Freelancers', 'Health Insurance Claims', 'Term Life Policy'],
    education: [
      'Chartered Accountant (ICAI)',
      'B.Com, St. Xavier\'s College Kolkata'
    ],
    experience: [
      'Partner, Das & Associates (2018-Present)',
      'Senior Auditor, Big 4 Firm (2015-2018)'
    ],
    social: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'anjali.d@investingpro.in'
    },
    quote: "Tax planning is legal. Tax evasion is a crime. The difference is a good CA."
  },
  {
    id: 'david-sangma',
    name: 'David Sangma',
    role: 'Fintech & Tech Lead',
    image: '/images/team/david-sangma.png',
    location: 'Shillong / Remote',
    shortBio: 'Tech-native covering the future of money. Tracks UPI, Crypto, Rupee CBDC, and the Digital India stack.',
    fullBio: 'David Sangma represents the borderless, digital-first future of finance. A self-taught coder and blockchain enthusiast from Shillong, David has been mining crypto since 2016 and using UPI since beta. He leads our coverage on Fintech apps, Digital Payments, and Emerging Assets. If there\'s a new app that claims to automate your savings, David has already tested it, broken it, and reviewed it.',
    story: 'I grew up in the North East where access to physical bank branches was always a hassle. Digital India didn\'t just "improve" banking for us; it invented it. I believed that code is the ultimate equalizer. I write to bridge the gap between "Tech Twitter" and the average user. Whether it\'s understanding how safe your UPI app is or what "Blockchain" actually means, I\'m here to translate the geek speak.',
    expertise: ['UPI & Digital Payments', 'Cryptocurrency', 'Neo-Banks', 'Algorithmic Trading'],
    education: [
      'B.Tech in Computer Science, NIT Silchar'
    ],
    experience: [
      'Tech Reviewer, Major Tech Blog (2021-2024)',
      'Blockchain Developer, DeFi Project (2019-2021)'
    ],
    social: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      email: 'david.s@investingpro.in'
    },
    quote: "Money is just data now. If you can control your data, you control your wealth."
  }
];
