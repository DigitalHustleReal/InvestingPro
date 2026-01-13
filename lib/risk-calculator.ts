
export interface Answer {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
}

export interface RiskProfile {
  label: string;
  description: string;
  minScore: number;
  maxScore: number;
  allocation: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
  recommendations: string[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'age',
    question: "What is your current age group?",
    answers: [
      { text: "Above 60 years", score: 1 },
      { text: "45 - 60 years", score: 3 },
      { text: "30 - 45 years", score: 6 },
      { text: "Under 30 years", score: 10 }
    ]
  },
  {
    id: 'goal_horizon',
    question: "When do you expect to need this money?",
    answers: [
      { text: "In less than 3 years", score: 1 },
      { text: "3 - 5 years", score: 3 },
      { text: "5 - 10 years", score: 6 },
      { text: "More than 10 years", score: 10 }
    ]
  },
  {
    id: 'knowledge',
    question: "How would you describe your knowledge of investments?",
    answers: [
      { text: "None / Very Basic", score: 1 },
      { text: "Basic (I understand FDs/PPF)", score: 3 },
      { text: "Moderate (I understand Stocks/Mutual Funds)", score: 6 },
      { text: "Expert (I trade actively)", score: 10 }
    ]
  },
  {
    id: 'reaction_drop',
    question: "If your portfolio drops by 20% in a month, what would you do?",
    answers: [
      { text: "Sell everything immediately to prevent further loss", score: 1 },
      { text: "Sell some portion to be safe", score: 3 },
      { text: "Do nothing and wait for recovery", score: 6 },
      { text: "Invest more (Buy the dip)", score: 10 }
    ]
  },
  {
    id: 'income_stability',
    question: "How stable is your current sources of income?",
    answers: [
      { text: "Unstable / Variable", score: 2 },
      { text: "Somewhat Stable", score: 5 },
      { text: "Very Stable", score: 8 }
    ]
  }
];

export const RISK_PROFILES: RiskProfile[] = [
  {
    label: "Conservative",
    description: "You prioritize capital protection over returns. You are not comfortable with volatility.",
    minScore: 0,
    maxScore: 15,
    allocation: { equity: 10, debt: 80, gold: 5, cash: 5 },
    recommendations: ["Fixed Deposits", "Liquid Funds", "PPF", "NSC"]
  },
  {
    label: "Moderately Conservative",
    description: "You want steady growth with minimal risk. You can tolerate small fluctuations.",
    minScore: 16,
    maxScore: 25,
    allocation: { equity: 30, debt: 60, gold: 5, cash: 5 },
    recommendations: ["Debt Mutual Funds", "Conservative Hybrid Funds", "Corporate Bonds"]
  },
  {
    label: "Balanced",
    description: "You seek a balance between risk and return. You can handle moderate volatility for better long-term growth.",
    minScore: 26,
    maxScore: 35,
    allocation: { equity: 50, debt: 40, gold: 5, cash: 5 },
    recommendations: ["Balanced Advantage Funds", "Aggressive Hybrid Funds", "Large Cap Funds"]
  },
  {
    label: "Moderately Aggressive",
    description: "You aim for high growth and can tolerate significant market fluctuations.",
    minScore: 36,
    maxScore: 42,
    allocation: { equity: 70, debt: 20, gold: 5, cash: 5 },
    recommendations: ["Flexi Cap Funds", "Mid Cap Funds", "Index Funds"]
  },
  {
    label: "Aggressive",
    description: "You want maximum growth and are comfortable with high risk and volatility.",
    minScore: 43,
    maxScore: 100,
    allocation: { equity: 85, debt: 5, gold: 5, cash: 5 },
    recommendations: ["Small Cap Funds", "Direct Equity", "Sector Funds", "Mid & Small Cap Funds"]
  }
];

export function calculateRiskScore(answers: Record<string, number>): number {
  return Object.values(answers).reduce((sum, score) => sum + score, 0);
}

export function getRiskProfile(score: number): RiskProfile {
  return RISK_PROFILES.find(p => score >= p.minScore && score <= p.maxScore) || RISK_PROFILES[0];
}
