// Expert opinions for products (E-E-A-T content)
// These provide authoritative insights to boost trust and SEO

export interface ExpertOpinionData {
  productSlug: string;
  opinion: string;
  expertName?: string;
  expertTitle?: string;
}

// Credit Card Expert Opinions
export const CREDIT_CARD_EXPERT_OPINIONS: Record<string, string> = {
  'hdfc-regalia': "The HDFC Regalia is a powerhouse for frequent travelers and premium shoppers. With 4 reward points per ₹150 spent and complimentary lounge access, it's ideal for those who can meet the ₹15,000 monthly spend to waive the annual fee. The welcome bonus alone can offset the first year's fee.",
  
  'sbi-simplysave': "SBI SimplySAVE is perfect for everyday spenders who shop online and dine out frequently. The 10x rewards on dining and groceries make it exceptional value, especially considering it's a lifetime free card. It's my top recommendation for young professionals starting their credit journey.",
  
  'axis-magnus': "Axis Magnus is the ultimate premium card for high spenders. The 12 reward points per ₹200 spent, combined with milestone benefits, can deliver returns of 6-8% on travel bookings. However, the ₹10,000 annual fee means you need to spend ₹3+ lakhs annually to justify it.",
  
  'icici-amazon-pay': "For Amazon Prime members, this is a no-brainer. 5% cashback on Amazon and 1% elsewhere, with zero annual fee, makes it one of the highest-return cards available. The instant 5% savings on every Amazon purchase adds up significantly over a year.",
  
  'default': "This card offers a balanced mix of rewards and benefits. Consider your spending patterns carefully - if you spend heavily in the card's bonus categories, it can deliver excellent value. Always compare with alternatives before applying."
};

// Loan Expert Opinions
export const LOAN_EXPERT_OPINIONS: Record<string, string> = {
  'hdfc-personal-loan': "HDFC's personal loan stands out for its competitive interest rates starting at 10.5% and quick disbursal. The flexible tenure options (12-60 months) allow you to balance EMI affordability with total interest cost. Pre-approved customers can get instant approval.",
  
  'sbi-home-loan': "SBI Home Loans offer some of the lowest rates in the market (8.5% onwards) and the longest tenures (up to 30 years). The processing fee waiver for women applicants is a nice touch. However, documentation requirements are stringent, so keep all papers ready.",
  
  'default': "This loan product offers competitive rates for eligible borrowers. Always compare the APR (not just interest rate) across lenders, and factor in processing fees and prepayment charges. A 0.5% rate difference can save lakhs over a 20-year tenure."
};

// Insurance Expert Opinions
export const INSURANCE_EXPERT_OPINIONS: Record<string, string> = {
  'hdfc-life-click2protect': "HDFC Click2Protect is one of the most affordable pure term plans available online. The 3% premium discount for online purchase and flexible payout options (lump sum, monthly income, or both) make it highly customizable. Claim settlement ratio of 98%+ inspires confidence.",
  
  'max-life-health': "Max Life's health insurance offers comprehensive coverage with a strong network of 4000+ hospitals. The no-claim bonus of up to 50% is industry-leading. However, read the exclusions carefully - pre-existing disease coverage kicks in after 2-4 years.",
  
  'default': "This insurance product provides solid coverage for its category. Always read the policy document carefully, especially exclusions and claim procedures. The cheapest premium isn't always the best value - focus on claim settlement ratio and coverage breadth."
};

// Helper function to get expert opinion
export const getExpertOpinion = (productSlug: string, category: string): string => {
  let opinions: Record<string, string>;
  
  switch (category.toLowerCase()) {
    case 'credit_card':
    case 'credit-cards':
      opinions = CREDIT_CARD_EXPERT_OPINIONS;
      break;
    case 'loan':
    case 'loans':
      opinions = LOAN_EXPERT_OPINIONS;
      break;
    case 'insurance':
      opinions = INSURANCE_EXPERT_OPINIONS;
      break;
    default:
      return CREDIT_CARD_EXPERT_OPINIONS.default;
  }
  
  return opinions[productSlug] || opinions.default;
};
