# 30-Day Sprint - Quick Reference Guide
**Your Daily Command Center**

---

## 🚀 Daily Workflow

### Morning Routine (Start of Day)
```bash
# 1. Check current metrics
npx tsx scripts/check-article-count.ts

# 2. Start dev server
npm run dev

# 3. Check for errors
npm run lint
```

### Content Generation Commands
```bash
# Generate 50 articles (mixed categories)
npx tsx scripts/master-content-generation.ts --count 50 --mixed

# Generate by category
npx tsx scripts/master-content-generation.ts --category mutual-funds --count 20
npx tsx scripts/master-content-generation.ts --category credit-cards --count 20
npx tsx scripts/master-content-generation.ts --category loans --count 20
npx tsx scripts/master-content-generation.ts --category investing-basics --count 20

# Automated generation (once set up)
npx tsx scripts/automated-content-scheduler.ts --count 20
```

### Widget Creation Template
```bash
# 1. Create widget component
# File: components/widgets/[WidgetName].tsx

# 2. Create widget page
# File: app/widgets/[widget-name]/page.tsx

# 3. Add to navigation
# File: components/layout/Navbar.tsx
```

### Quality Checks
```bash
# Check article quality
npx tsx scripts/test-quality-scorer.ts

# Check for plagiarism
npx tsx scripts/test-plagiarism-checker.ts

# Audit content
npx tsx scripts/audit-current-content.ts
```

---

## 📊 Daily Targets

| Day | Articles | Widgets | Focus |
|-----|----------|---------|-------|
| 1 | 0 | 0 | Setup & Assessment |
| 2 | 50 | 0 | Content Sprint |
| 3 | 50 | 0 | Content Sprint |
| 4 | 0 | 5 | Widget Sprint |
| 5 | 25 | 3 | Mixed |
| 6 | 0 | 0 | Automation |
| 7 | 100 | 0 | Content Scale |
| 8 | 0 | 5 | Widget Sprint |
| 9 | 50 | 0 | Content + Auto |
| 10 | 0 | 5 | Widget Sprint |
| 11-15 | 150 | 7 | Intensive Sprint |
| 16-20 | 75 | 5 | Widget + Auto |
| 21-25 | 0 | 0 | Polish |
| 26-30 | 50 | 5 | Final Push |

**Total Target:** 500+ articles, 30+ widgets

---

## 🎯 Widget Checklist (30 Widgets)

### Financial Calculators
- [ ] Investment Goal Calculator
- [ ] SIP vs Lumpsum Calculator
- [ ] Tax Savings Calculator
- [ ] Emergency Fund Calculator
- [ ] Education Planning Calculator
- [ ] Home Loan Prepayment Calculator
- [ ] Budget Planner
- [ ] Savings Goal Tracker
- [ ] Financial Goal Planner
- [ ] Investment Returns Calculator

### Loan Tools
- [ ] Loan Eligibility Calculator
- [ ] Loan Comparison Tool
- [ ] Loan Amortization Calculator
- [ ] Car Loan Calculator
- [ ] Debt-to-Income Calculator

### Investment Tools
- [ ] Portfolio Analyzer
- [ ] Mutual Fund Screener
- [ ] Asset Allocation Tool
- [ ] Stock Portfolio Tracker
- [ ] Investment Risk Analyzer

### Credit & Cards
- [ ] Credit Score Simulator
- [ ] Credit Card Rewards Optimizer
- [ ] Credit Card Comparison Tool

### Insurance
- [ ] Insurance Needs Calculator
- [ ] Health Insurance Calculator

### Analysis
- [ ] Financial Health Score
- [ ] (Existing: SIP, EMI, Tax, Retirement, etc.)

---

## 📝 Article Categories & Topics

### Mutual Funds (Target: 100+ articles)
- Best SIP funds
- Tax-saving funds
- Index funds
- Large cap funds
- Mid cap funds
- Small cap funds
- Debt funds
- Hybrid funds
- ELSS funds
- Sector funds

### Credit Cards (Target: 80+ articles)
- Best travel cards
- Best cashback cards
- Best premium cards
- Best for students
- Best for online shopping
- Credit card comparison
- How to choose credit card
- Credit card benefits
- Credit card fees
- Credit card rewards

### Loans (Target: 80+ articles)
- Home loans
- Personal loans
- Car loans
- Education loans
- Loan comparison
- Loan eligibility
- Interest rates
- EMI calculation
- Prepayment benefits
- Loan refinancing

### Investing Basics (Target: 100+ articles)
- SIP explained
- Mutual funds explained
- Stock market basics
- Investment strategies
- Risk management
- Portfolio building
- Tax planning
- Retirement planning
- Financial planning
- Wealth building

### Tax Planning (Target: 60+ articles)
- Section 80C
- Section 80D
- HRA benefits
- Tax-saving investments
- Income tax calculation
- Tax deductions
- Tax exemptions
- Capital gains tax
- Tax planning strategies

### Retirement (Target: 50+ articles)
- Retirement planning
- NPS explained
- PPF explained
- Retirement corpus
- Pension plans
- Retirement strategies

### Insurance (Target: 50+ articles)
- Life insurance
- Health insurance
- Term insurance
- ULIP explained
- Insurance comparison
- Insurance needs

### Stocks (Target: 50+ articles)
- Stock investing basics
- Stock analysis
- Stock selection
- Portfolio management
- Market analysis

---

## 🛠️ Common Tasks

### Create New Widget
1. Create component: `components/widgets/[Name].tsx`
2. Create page: `app/widgets/[slug]/page.tsx`
3. Add route to navigation
4. Add to calculators page
5. Test functionality
6. Add SEO metadata

### Generate Article Batch
1. Choose category
2. Generate 20-50 articles
3. Review sample articles
4. Publish approved articles
5. Update metrics

### Fix Bug
1. Identify bug
2. Reproduce issue
3. Fix code
4. Test fix
5. Deploy

### Add Feature
1. Plan feature
2. Create component/page
3. Implement logic
4. Test feature
5. Deploy

---

## 📊 Metrics to Track Daily

### Content Metrics
- Total articles: [Count]
- Published articles: [Count]
- Draft articles: [Count]
- Articles by category: [Breakdown]
- Daily generation rate: [Count/day]

### Widget Metrics
- Total widgets: [Count]
- Widgets by category: [Breakdown]
- Widget usage: [If tracked]

### Automation Metrics
- Automation level: [%]
- Auto-generated articles: [Count]
- Manual review needed: [Count]
- Error rate: [%]

### Quality Metrics
- Average quality score: [Score]
- Articles passing QA: [%]
- Plagiarism issues: [Count]

---

## 🚨 Troubleshooting

### Content Generation Failing
```bash
# Check API keys
echo $OPENAI_API_KEY
echo $GROQ_API_KEY

# Test connection
npx tsx scripts/test-automation.ts

# Check database
npx tsx scripts/check-database-status.ts
```

### Widget Not Working
1. Check console for errors
2. Check component imports
3. Check API calls
4. Check database queries
5. Test in isolation

### Automation Not Running
1. Check cron job configuration
2. Check Vercel cron setup
3. Check API route
4. Check logs
5. Test manually

---

## 🎯 Daily Success Criteria

### Must Complete Each Day
- [ ] Generate target articles OR build target widgets
- [ ] Review and publish content
- [ ] Update metrics dashboard
- [ ] Fix any critical bugs
- [ ] Test new features

### Weekly Goals
- [ ] Meet article target
- [ ] Meet widget target
- [ ] Improve automation
- [ ] Fix all bugs
- [ ] Update documentation

---

## 💡 Pro Tips

1. **Batch Everything**: Generate articles in batches, build widgets in batches
2. **Automate Early**: Set up automation on Day 6, use it from Day 7
3. **Quality First**: Review before publishing, maintain quality
4. **Track Everything**: Update metrics daily, track progress
5. **Iterate Fast**: Ship fast, fix fast, improve fast
6. **Reuse Code**: Use existing components, don't reinvent
7. **Test Often**: Test after each major change
8. **Document**: Document widgets and features as you build

---

## 📞 Quick Commands Cheat Sheet

```bash
# Content
npx tsx scripts/master-content-generation.ts --count 50
npx tsx scripts/check-article-count.ts
npx tsx scripts/audit-current-content.ts

# Quality
npx tsx scripts/test-quality-scorer.ts
npx tsx scripts/test-plagiarism-checker.ts

# Database
npx tsx scripts/check-database-status.ts

# Development
npm run dev
npm run lint
npm run build
npm run type-check

# Widget Creation
# 1. Create component
# 2. Create page
# 3. Add to nav
```

---

**Keep this open during your sprint! 🚀**
