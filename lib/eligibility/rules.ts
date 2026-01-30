// Eligibility rules for credit cards and loans
// Rule-based logic for instant eligibility checks

export interface EligibilityInput {
  income: number;
  creditScore: number;
  age: number;
  employmentType: 'salaried' | 'self-employed' | 'student' | 'retired';
  existingCards?: number;
}

export interface EligibilityResult {
  eligible: boolean;
  confidence: 'high' | 'medium' | 'low';
  message: string;
  reasons: string[];
  recommendations?: string[];
}

// Credit Card Eligibility Rules
export const checkCreditCardEligibility = (
  input: EligibilityInput,
  cardType: 'premium' | 'standard' | 'entry' = 'standard'
): EligibilityResult => {
  const reasons: string[] = [];
  const recommendations: string[] = [];
  let eligible = true;
  let confidence: 'high' | 'medium' | 'low' = 'high';

  // Age check
  if (input.age < 21) {
    eligible = false;
    reasons.push('Minimum age requirement is 21 years');
    recommendations.push('Consider applying when you turn 21');
  } else if (input.age > 65) {
    confidence = 'medium';
    reasons.push('Age above 65 may require additional documentation');
  }

  // Income requirements based on card type
  const incomeRequirements = {
    premium: 500000, // 5 lakhs
    standard: 300000, // 3 lakhs
    entry: 180000     // 1.8 lakhs
  };

  const requiredIncome = incomeRequirements[cardType];
  
  if (input.income < requiredIncome) {
    eligible = false;
    reasons.push(`Minimum income requirement is ₹${(requiredIncome / 100000).toFixed(1)} lakhs/year`);
    
    if (cardType === 'premium') {
      recommendations.push('Consider applying for a standard credit card instead');
    } else if (cardType === 'standard') {
      recommendations.push('Consider entry-level cards or secured credit cards');
    }
  } else if (input.income >= requiredIncome * 1.5) {
    reasons.push('Income meets requirements comfortably');
  }

  // Credit score check
  if (input.creditScore < 650) {
    eligible = false;
    reasons.push('Credit score below minimum requirement (650)');
    recommendations.push('Work on improving your credit score before applying');
    recommendations.push('Consider secured credit cards to build credit');
  } else if (input.creditScore < 700) {
    confidence = 'medium';
    reasons.push('Credit score is acceptable but could be better');
    recommendations.push('Approval chances improve significantly above 700');
  } else if (input.creditScore >= 750) {
    reasons.push('Excellent credit score - high approval chances');
  }

  // Employment type check
  if (input.employmentType === 'student') {
    if (cardType !== 'entry') {
      eligible = false;
      reasons.push('Students typically qualify only for entry-level cards');
      recommendations.push('Consider student credit cards');
    }
  } else if (input.employmentType === 'retired') {
    confidence = 'medium';
    reasons.push('Retired applicants may need pension/investment proof');
  }

  // Existing cards check
  if (input.existingCards && input.existingCards > 5) {
    confidence = 'low';
    reasons.push('Having 5+ credit cards may affect approval');
    recommendations.push('Consider closing unused cards before applying');
  }

  // Generate message
  let message = '';
  if (eligible) {
    if (confidence === 'high') {
      message = '✅ You have high chances of approval!';
    } else if (confidence === 'medium') {
      message = '⚠️ You may be eligible, but approval is not guaranteed';
    } else {
      message = '⚠️ Eligibility uncertain - consider improving your profile';
    }
  } else {
    message = '❌ You may not meet the eligibility criteria';
  }

  return {
    eligible,
    confidence,
    message,
    reasons,
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
};

// Loan Eligibility Rules
export const checkLoanEligibility = (
  input: EligibilityInput,
  loanAmount: number,
  loanType: 'personal' | 'home' | 'car' = 'personal'
): EligibilityResult => {
  const reasons: string[] = [];
  const recommendations: string[] = [];
  let eligible = true;
  let confidence: 'high' | 'medium' | 'low' = 'high';

  // Age check
  if (input.age < 21 || input.age > 60) {
    eligible = false;
    reasons.push('Age must be between 21 and 60 years');
  }

  // Income to EMI ratio (should not exceed 50%)
  const maxLoanAmount = input.income * 5; // Rough estimate: 5x annual income
  
  if (loanAmount > maxLoanAmount) {
    eligible = false;
    reasons.push(`Loan amount exceeds eligibility (max ~₹${(maxLoanAmount / 100000).toFixed(1)} lakhs)`);
    recommendations.push('Consider a lower loan amount or increase your income');
  }

  // Credit score check
  if (input.creditScore < 700) {
    if (loanType === 'home') {
      eligible = false;
      reasons.push('Home loans typically require credit score of 700+');
    } else {
      confidence = 'medium';
      reasons.push('Credit score below ideal range (700+)');
      recommendations.push('You may get approved but at higher interest rates');
    }
  } else if (input.creditScore >= 750) {
    reasons.push('Excellent credit score - expect best interest rates');
  }

  // Employment type
  if (input.employmentType === 'self-employed') {
    confidence = 'medium';
    reasons.push('Self-employed applicants need 2-3 years ITR');
  } else if (input.employmentType === 'student' || input.employmentType === 'retired') {
    eligible = false;
    reasons.push('Stable employment required for loan approval');
  }

  // Generate message
  let message = '';
  if (eligible) {
    if (confidence === 'high') {
      message = '✅ You are likely eligible for this loan!';
    } else {
      message = '⚠️ You may be eligible with additional documentation';
    }
  } else {
    message = '❌ You may not meet the eligibility criteria';
  }

  return {
    eligible,
    confidence,
    message,
    reasons,
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
};
