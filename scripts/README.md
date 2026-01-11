# 🤖 AI Content Generation Scripts
## Quick Reference for Week 1

### Setup Checklist

**Before running scripts:**
- [ ] OpenAI API key added to `.env.local`
- [ ] `npm install openai` completed
- [ ] Credits added to OpenAI account ($10 minimum)
- [ ] Supabase credentials in `.env.local`

---

### Available Scripts

#### 1. Test OpenAI Connection
```bash
npx ts-node scripts/test-openai.ts
```
**Purpose:** Verify API key works  
**Time:** 2-3 seconds  
**Cost:** ~₹0.001

---

#### 2. Generate Single Description (Test)
```bash
npx ts-node scripts/generate-single-description.ts
```
**Purpose:** Test quality of AI-generated content  
**Time:** 2-3 seconds  
**Cost:** ~₹0.15  
**Output:** Sample credit card description

---

#### 3. Bulk Generate Credit Cards
```bash
# Generate 50 descriptions (default)
npx ts-node scripts/generate-credit-cards-bulk.ts

# Generate custom amount
npx ts-node scripts/generate-credit-cards-bulk.ts 100
```
**Purpose:** Generate descriptions for all cards without descriptions  
**Time:** ~2-3 seconds per card  
**Cost:** ~₹0.15 per description  
**Example:** 50 cards = 2-3 minutes, ₹7.50

---

### Expected Output

**Successful generation:**
```
🚀 Starting bulk generation for 50 credit cards...
📊 Found 50 cards without descriptions

[1/50] Processing: HDFC Regalia Credit Card...
  ✅ Generated & saved (187 words)
[2/50] Processing: SBI Elite Credit Card...
  ✅ Generated & saved (195 words)
...

═══════════════════════════════════════════
📈 BULK GENERATION COMPLETE
═══════════════════════════════════════════
✅ Successful: 50
❌ Failed: 0
💰 Total cost: ~₹7.50
⏱️  Average: ~2.5 seconds per description
🎯 Completion rate: 100.0%
```

---

### Troubleshooting

**Error: "Invalid API key"**
- Check `.env.local` has correct key
- Key should start with `sk-proj-`
- Restart dev server after adding key

**Error: "Insufficient credits"**
- Add more credits at platform.openai.com/billing
- Minimum $10 recommended

**Error: "No cards found"**
- All cards already have descriptions! ✅
- Check Supabase to verify

**Error: "Rate limit exceeded"**
- Slow down requests (script has 1s delay)
- Upgrade OpenAI tier if needed

---

### Cost Calculator

| Descriptions | Time | Cost (₹) | Cost ($) |
|--------------|------|----------|----------|
| 10 | 30s | 1.50 | 0.02 |
| 50 | 2.5min | 7.50 | 0.09 |
| 100 | 5min | 15.00 | 0.18 |
| 500 | 25min | 75.00 | 0.90 |
| 1000 | 50min | 150.00 | 1.80 |

**Week 1 Goal (660 descriptions):** ~₹100 (~$1.20)

---

### Quality Guidelines

**Good description:**
- 150-200 words ✓
- 2-3 paragraphs ✓
- Mentions ideal user ✓
- Factual, not salesy ✓
- Indian English ✓

**Review first 10 manually, then trust the process!**

---

### Next Steps After Generation

1. **Verify in Supabase:** Check descriptions are saved
2. **Spot check quality:** Review 5-10 random ones
3. **Refine prompts:** If quality issues, adjust prompt
4. **Deploy:** Descriptions appear automatically on frontend
5. **Move to next category:** Loans, insurance, mutual funds

---

### Week 1 Schedule

**Monday:** 10 test descriptions  
**Tuesday:** 50 credit cards  
**Wednesday:** 100 mixed (loans, insurance)  
**Thursday:** 200 mixed  
**Friday:** 300 mixed  
**TOTAL:** 660 descriptions 🎉

---

**Questions? Check the setup guide or ask me!** 🚀
