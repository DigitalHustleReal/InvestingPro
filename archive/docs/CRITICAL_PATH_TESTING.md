# Critical Path Testing Checklist

**Date:** Now  
**Status:** In Progress

---

## ✅ Test 1: Homepage Loads

### Test Steps:
1. Navigate to `/`
2. Verify page loads without errors
3. Check all sections render:
   - Hero section
   - Trust strip
   - Category grid
   - Featured tools
   - Newsletter section

### Expected Result:
- ✅ Page loads in < 3 seconds
- ✅ No console errors
- ✅ All images load
- ✅ Navigation visible

### Status: ⏳ To Test

---

## ✅ Test 2: Navigation Works (All Menus)

### Test Steps:
1. Test main navigation menu
2. Test footer links
3. Test mobile menu (if applicable)
4. Verify all category links work:
   - Credit Cards
   - Loans
   - Banking
   - Investing
   - Insurance
   - Calculators

### Expected Result:
- ✅ All navigation links work
- ✅ No broken links
- ✅ Mobile menu functional
- ✅ Footer links accessible

### Status: ⏳ To Test

---

## ✅ Test 3: Calculator Pages Work (All 11)

### Calculator List:
1. SIP Calculator (`/calculators/sip`)
2. SWP Calculator (`/calculators/swp`)
3. Lumpsum Calculator (`/calculators/lumpsum`)
4. FD Calculator (`/calculators/fd`)
5. EMI Calculator (`/calculators/emi`)
6. Tax Calculator (`/calculators/tax`)
7. Retirement Calculator (`/calculators/retirement`)
8. Inflation Adjusted Returns (`/calculators/inflation-adjusted-returns`)
9. PPF Calculator (`/calculators/ppf`)
10. NPS Calculator (`/calculators/nps`)
11. Goal Planning Calculator (`/calculators/goal-planning`)

### Test Steps for Each:
1. Navigate to calculator page
2. Verify calculator component loads
3. Enter test values
4. Verify calculation works
5. Check results display correctly

### Expected Result:
- ✅ All 11 calculators accessible
- ✅ All calculators functional
- ✅ Results calculate correctly
- ✅ No JavaScript errors

### Status: ⏳ To Test

---

## ✅ Test 4: User Can Sign Up/Login

### Test Steps:
1. Navigate to sign up page (if exists)
2. Test sign up flow
3. Test login flow
4. Verify authentication works
5. Test logout

### Expected Result:
- ✅ Sign up works
- ✅ Login works
- ✅ Authentication persists
- ✅ Logout works

### Status: ⏳ To Test (Requires Supabase setup)

---

## ✅ Test 5: User Can View Products

### Test Steps:
1. Navigate to `/credit-cards`
2. Navigate to `/loans`
3. Navigate to `/mutual-funds`
4. Verify product listings load
5. Click on individual product
6. Verify product detail page loads

### Expected Result:
- ✅ Product pages load
- ✅ Product listings display
- ✅ Product detail pages work
- ✅ No broken product links

### Status: ⏳ To Test

---

## ✅ Test 6: User Can Submit Review

### Test Steps:
1. Navigate to product detail page
2. Find review section
3. Submit a test review
4. Verify review appears

### Expected Result:
- ✅ Review form accessible
- ✅ Review submission works
- ✅ Review displays after submission

### Status: ⏳ To Test (Requires database)

---

## ✅ Test 7: Stripe Checkout Flow (Test Mode)

### Test Steps:
1. Navigate to checkout/upgrade page
2. Initiate checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete payment flow
5. Verify success page

### Expected Result:
- ✅ Checkout initiates
- ✅ Stripe test payment works
- ✅ Success page displays
- ✅ Webhook processes correctly

### Status: ⏳ To Test (Requires Stripe keys)

---

## ✅ Test 8: API Routes Respond Correctly

### API Routes to Test:
1. `/api/health` - Health check
2. `/api/products/[type]/[slug]` - Product data
3. `/api/rankings/calculate` - Ranking calculation
4. `/api/stripe/create-checkout-session` - Stripe checkout
5. `/api/stripe/webhook` - Stripe webhook

### Test Steps:
1. Test each API endpoint
2. Verify correct response format
3. Check error handling
4. Verify authentication (if required)

### Expected Result:
- ✅ All API routes respond
- ✅ Correct response format
- ✅ Error handling works
- ✅ Authentication enforced

### Status: ⏳ To Test

---

## 📊 Testing Summary

### Automated Checks (Can Verify Now):
- [x] Build passes ✅
- [x] All pages compile ✅
- [x] No TypeScript errors ✅
- [x] No console errors in build ✅

### Manual Testing Required:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Calculators work (11 total)
- [ ] Product pages load
- [ ] API routes respond

### Requires Environment Setup:
- [ ] User sign up/login (needs Supabase)
- [ ] Review submission (needs database)
- [ ] Stripe checkout (needs Stripe keys)

---

## 🎯 Quick Verification Script

Run these commands to verify basic functionality:

```bash
# Check all calculator routes exist
npm run build | grep calculators

# Verify API routes exist
ls app/api/

# Check for broken imports
npm run build
```

---

**Next Steps:**
1. Set up environment variables
2. Run manual testing
3. Fix any issues found
4. Proceed to deployment

