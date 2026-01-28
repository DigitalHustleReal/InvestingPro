# Data Accuracy Spot-Check Procedure

**Owner**: Data Quality Team  
**Frequency**: Monthly  
**Last Updated**: 2026-01-28

---

## Purpose

Validate the platform's 98%+ data accuracy claim through systematic manual verification of product data against authoritative sources.

---

## Sampling Methodology

### Stratified Random Sampling

**Sample Size**: 100 products minimum  
**Distribution**: 25 products per category

| Category | Sample Size | Source |
|----------|-------------|--------|
| Credit Cards | 25 | Bank websites, BankBazaar |
| Mutual Funds | 25 | AMFI India |
| Loans | 25 | Bank websites |
| Insurance | 25 | Company websites, PolicyBazaar |

### Randomization

Products are randomly selected from the database using the `spot-check-sampler.ts` script to avoid selection bias.

---

## Verification Steps

### 1. Generate Sample (10 minutes)

```bash
cd scripts/data-quality
npx tsx spot-check-sampler.ts
```

**Output**: `spot-check-sample.csv` with 100 products

---

### 2. Manual Verification (2-3 days)

For each product in the CSV:

1. **Open source URL** in browser
2. **Locate product** on source website
3. **Compare key fields**:
   - Mutual Funds: NAV, scheme code, fund house
   - Credit Cards: Annual fee, interest rate, rewards rate
   - Loans: Interest rate, processing fee, max amount
   - Insurance: Premium, sum assured, coverage type
4. **Mark verification status**:
   - `correct` - All key fields match
   - `incorrect` - One or more fields don't match
   - `not_found` - Product not found on source
5. **Add notes** for discrepancies

**Example**:
```csv
id,category,name,source_url,key_fields,verification_status,notes
123,mutual_funds,"HDFC Equity Fund",https://amfi...,"{nav:45.2}",correct,
456,credit_cards,"SBI SimplyCLICK",https://sbi...,"{fee:499}",incorrect,"Fee is 599 not 499"
```

---

### 3. Calculate Accuracy (5 minutes)

```bash
npx tsx accuracy-calculator.ts spot-check-sample.csv
```

**Output**: Accuracy report with overall and per-category rates

---

## Accuracy Calculation

### Formula

```
Accuracy = (Correct Products / Total Verified) × 100
```

### Exclusions

- Products marked `not_found` are excluded (may be discontinued)
- Only products with complete key fields are included

### Thresholds

- **Target**: ≥98% accuracy
- **Warning**: 95-98% accuracy (investigate discrepancies)
- **Critical**: <95% accuracy (scraper review required)

---

## Error Classification

### Minor Errors (Acceptable)
- Formatting differences (e.g., "5.5%" vs "5.50%")
- Rounding differences (e.g., 45.23 vs 45.2)
- Date format variations

### Major Errors (Unacceptable)
- Incorrect numerical values (e.g., fee 499 vs 599)
- Wrong product details (e.g., wrong fund house)
- Outdated data (>7 days old for daily updates)

---

## Reporting

### Monthly Report Template

```markdown
# Data Accuracy Report - [Month Year]

**Date**: [Date]  
**Verified By**: [Name]

## Summary
- **Total Verified**: 100 products
- **Correct**: XX products
- **Incorrect**: XX products
- **Not Found**: XX products
- **Overall Accuracy**: XX.X%

## Per-Category Accuracy
- Credit Cards: XX.X%
- Mutual Funds: XX.X%
- Loans: XX.X%
- Insurance: XX.X%

## Discrepancies Found
1. [Product Name] - [Issue Description]
2. ...

## Action Items
- [ ] Fix scraper for [Category]
- [ ] Update validation rules
- [ ] Re-verify affected products
```

---

## Escalation

### If Accuracy <98%

1. **Immediate**:
   - Document all discrepancies
   - Identify affected scrapers
   - Notify CTO and Data Team

2. **Within 24 hours**:
   - Analyze root causes
   - Create fix plan
   - Estimate resolution time

3. **Within 1 week**:
   - Implement fixes
   - Re-run spot-check on affected category
   - Validate accuracy improvement

---

## Schedule

| Activity | Frequency | Due Date |
|----------|-----------|----------|
| Generate sample | Monthly | 1st of month |
| Manual verification | Monthly | 1st-3rd of month |
| Calculate accuracy | Monthly | 3rd of month |
| Generate report | Monthly | 5th of month |
| Review with team | Monthly | 10th of month |

---

## Tools

- **Sampler**: `scripts/data-quality/spot-check-sampler.ts`
- **Calculator**: `scripts/data-quality/accuracy-calculator.ts`
- **Spreadsheet**: Google Sheets or Excel for verification
- **Source URLs**: Listed in sample CSV

---

## Ground Truth Sources

### Authoritative Sources

| Category | Primary Source | Backup Source |
|----------|----------------|---------------|
| Mutual Funds | AMFI India | Fund house websites |
| Credit Cards | Bank websites | BankBazaar |
| Loans | Bank websites | BankBazaar |
| Insurance | Company websites | PolicyBazaar |
| Interest Rates | RBI | Bank websites |

### Source Reliability

- **Tier 1** (Authoritative): AMFI, RBI - 100% reliable
- **Tier 2** (Official): Bank/company websites - 95% reliable
- **Tier 3** (Aggregator): BankBazaar, PolicyBazaar - 90% reliable

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-28 | Initial procedure |

---

**Status**: ✅ **DOCUMENTED** - Ready for first spot-check
