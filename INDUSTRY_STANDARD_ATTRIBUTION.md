# Industry-Standard Author/Editor Attribution System

**Research:** NerdWallet, Investopedia, The Balance, Bankrate  
**Created:** January 3, 2026, 9:35 PM IST

---

## 🔍 **HOW TOP PLATFORMS DO IT**

### **INVESTOPEDIA (The Gold Standard)**

#### **Glossary/Definition Pages:**
```
Annual Percentage Rate (APR)

[Content here...]

✅ Reviewed by: Chip Stapleton
    Senior Advisor, CFP®
    Updated: Nov 15, 2023
```

**Pattern:**
- ❌ NO author listed
- ✅ Reviewed by expert (name + credentials)
- ✅ "Updated by" date
- ✅ "Fact-checked by" (optional)

#### **Articles/Guides:**
```
How to Choose a Credit Card

Written by: Amy Fontinelle
             Financial Writer, 10+ Years

Reviewed by: Julius Mansa, CFP®
             Subject Matter Expert

Edited by: Robert C. Kelly
           Senior Editor

Fact-checked by: Katrina Munichiello
                 Data Verification Specialist
```

**Pattern:**
- ✅ Written by: Author (with brief credentials)
- ✅ Reviewed by: Subject Matter Expert (SME) with credentials
- ✅ Edited by: Editorial oversight (optional)
- ✅ Fact-checked by: Data specialist (optional)

---

### **NERDWALLET**

#### **Comparison Pages:**
```
Best Credit Cards of 2026

By: Spencer Tierney
    Writer | NerdWallet

[Content...]

Editorial Disclosure: [Standard disclaimer]
```

**Pattern:**
- ✅ Simple "By: [Author]" at top
- ✅ Brief title only
- ❌ No editor shown (implied editorial oversight)

#### **Guides/Articles:**
```
How Does APR Work?

By: Lauren Schwahn
    Writer | NerdWallet

Edited by: Sara Rathner
           Senior Editor | NerdWallet

[Content...]
```

**Pattern:**
- ✅ Author shown
- ✅ Editor shown for major pieces
- ✅ Company affiliation
- ✅ Simple, clean attribution

---

### **THE BALANCE (Dotdash Meredith)**

#### **Glossary Terms:**
```
What Is a Credit Score?

[Content...]

Reviewed by: Eric Estevez, CFP®, CLU, ChFC
             Chartered Financial Consultant
             Updated: Dec 01, 2023
```

**Pattern:**
- ❌ No author
- ✅ "Reviewed by" expert with full credentials
- ✅ Update date prominent

#### **Full Articles:**
```
How to Build Credit from Scratch

Written by: Beverly Harzog
            Credit Card Expert

Reviewed by: Marguerita Cheng, CFP®, CRPC®, CSRIC®
             Financial Advisor

Updated: January 2, 2024
```

---

### **BANKRATE**

#### **Simple Pattern:**
```
Best Personal Loans 2026

Written by: Dori Zinn
Edited by: Jill Cornfield

[Content...]
```

**Very straightforward, less emphasis on credentials in byline.**

---

## 📋 **INDUSTRY STANDARD ATTRIBUTION RULES**

### **1. GLOSSARY/DICTIONARY TERMS**
✅ **Show:** "Reviewed by [Expert Name, Credentials]"  
❌ **Don't Show:** Author/Writer  
✅ **Include:** Last updated date  
✅ **Optional:** "Fact-checked by"  

**Why:** Glossary terms are considered "reference content" owned by the publication, not individual authors.

---

### **2. HOW-TO GUIDES & ARTICLES**
✅ **Show:** "Written by [Author Name]"  
✅ **Show:** "Reviewed by [Expert Name, Credentials]" or "Edited by [Editor]"  
✅ **Include:** Publication date  
✅ **Optional:** "Updated by"  

**Why:** Original content deserves author credit + editorial oversight validation.

---

### **3. COMPARISON/REVIEW PAGES**
✅ **Show:** "By [Author Name]" (simple)  
✅ **Optional:** Editor credit  
✅ **Include:** Last updated date  
❌ **Keep it minimal** - Focus on content, not bylines  

**Why:** These are data-driven, frequently updated. Less about authorship, more about currency.

---

### **4. NEWS/BLOG POSTS**
✅ **Show:** "By [Author Name]"  
✅ **Include:** Date & time  
❌ **Skip editor** (implied)  

**Why:** News attribution is standard journalism practice.

---

## 🎯 **INTELLIGENT ATTRIBUTION SYSTEM**

### **Content Type Detection:**

```typescript
export function getAttributionStyle(contentType: string): AttributionStyle {
  switch(contentType) {
    case 'glossary_term':
    case 'definition':
      return {
        showAuthor: false,
        showReviewer: true,
        reviewerLabel: 'Reviewed by',
        showEditor: false,
        showUpdatedDate: true,
        showPublishedDate: false,
        emphasizeCredentials: true
      };
      
    case 'blog_post':
    case 'guide':
    case 'how_to':
      return {
        showAuthor: true,
        authorLabel: 'Written by',
        showReviewer: true,
        reviewerLabel: 'Reviewed by',
        showEditor: false, // Optional for major pieces
        showPublishedDate: true,
        showUpdatedDate: true,
        emphasizeCredentials: true
      };
      
    case 'comparison':
    case 'review':
    case 'list':
      return {
        showAuthor: true,
        authorLabel: 'By',
        showReviewer: false,
        showEditor: false,
        showPublishedDate: false,
        showUpdatedDate: true,
        emphasizeCredentials: false, // Keep it simple
        minimal: true
      };
      
    case 'news':
      return {
        showAuthor: true,
        authorLabel: 'By',
        showReviewer: false,
        showEditor: false,
        showPublishedDate: true,
        showUpdatedDate: false,
        minimal: true
      };
      
    default:
      return {
        showAuthor: true,
        showReviewer: false,
        showEditor: false,
        showPublishedDate: true
      };
  }
}
```

---

## 💡 **SMART ROLE ASSIGNMENT**

### **Writers (8 people):**
- Can write for ANY category (not restricted)
- Byline shows: "Written by [Name]" or "By [Name]"
- Minimal credentials in byline
- Link to author profile

### **Editors (8 people) - Two Tier System:**

#### **Tier 1: Subject Matter Experts (SMEs)**
*For glossary terms, technical content*
- Show as: "Reviewed by [Name, CFA/CA/PhD]"
- Full credentials displayed
- Specialized knowledge validated
- Examples:
  - Dr. Meera Iyer (Economics) - Reviews investing terms
  - Deepika Singh, CA - Reviews tax terms
  - Harpreet Kaur, FII - Reviews insurance terms

#### **Tier 2: Content Editors**
*For articles, guides*
- Show as: "Edited by [Name]" or "Reviewed by [Name]"
- Title shown (e.g., "Senior Editor")
- Less emphasis on credentials
- Examples:
  - Rajesh Mehta - Edits general content
  - Thomas Fernandes - Edits banking content

---

## 🎨 **VISUAL IMPLEMENTATION**

### **1. Glossary Term Page:**

```html
<!-- Top of page - MINIMAL -->
<div class="content-meta">
  <span class="category-tag">Credit Cards</span>
  <span class="last-updated">Updated: Jan 3, 2026</span>
</div>

<h1>Annual Percentage Rate (APR)</h1>

<p class="definition">
  [Content here...]
</p>

<!-- Bottom of page - EXPERT VALIDATION -->
<div class="expert-review">
  <div class="reviewer-badge">
    <svg>✓</svg>
    <div>
      <strong>Reviewed for Accuracy</strong>
      <p>Karthik Menon, CIBIL Certified Credit Counselor</p>
      <span class="review-date">Last reviewed: January 3, 2026</span>
    </div>
  </div>
</div>

<!-- NO AUTHOR SHOWN -->
```

---

### **2. Blog Post / Article:**

```html
<!-- Top of page - FULL ATTRIBUTION -->
<article>
  <header>
    <div class="category-breadcrumb">
      <a href="/credit-cards">Credit Cards</a> › Guides
    </div>
    
    <h1>How to Choose the Best Credit Card in India</h1>
    
    <div class="article-meta">
      <!-- Author -->
      <div class="author-byline">
        <img src="/images/authors/priya-menon.jpg" alt="Priya Menon" />
        <div>
          <span class="label">Written by</span>
          <a href="/author/priya-menon" class="author-name">Priya Menon</a>
          <span class="author-title">Loans & Finance Expert</span>
        </div>
      </div>
      
      <!-- Expert Reviewer -->
      <div class="reviewer-byline">
        <span class="label">Reviewed by</span>
        <strong>Karthik Menon</strong>
        <span class="credentials">Credit Products Editor | CIBIL Certified</span>
      </div>
      
      <!-- Dates -->
      <div class="dates">
        <span>Published: Jan 3, 2026</span>
        <span>Updated: Jan 3, 2026</span>
      </div>
    </div>
  </header>
  
  <!-- Article content -->
  
  <footer class="article-footer">
    <!-- Full author bio card -->
    <div class="about-author">
      <h3>About the Author</h3>
      <AuthorBioCard author={priya} />
    </div>
    
    <!-- Editorial standards -->
    <div class="editorial-standards">
      <h4>Our Editorial Process</h4>
      <p>All articles are reviewed by subject matter experts...</p>
    </div>
  </footer>
</article>
```

---

### **3. Comparison Page (Minimal):**

```html
<div class="comparison-header">
  <h1>Best Credit Cards in India 2026</h1>
  
  <div class="simple-byline">
    <span>By <a href="/author/arjun-sharma">Arjun Sharma</a></span>
    <span>Last updated: Jan 3, 2026</span>
  </div>
</div>

<!-- NO EDITOR SHOWN - IMPLIED -->
```

---

## 🔄 **AUTO-ASSIGNMENT LOGIC (Updated)**

```typescript
export async function assignContentRoles(content: {
  type: 'glossary' | 'article' | 'comparison' | 'news';
  category: string;
}) {
  let author = null;
  let reviewer = null;
  
  switch(content.type) {
    case 'glossary':
      // NO AUTHOR - Just expert reviewer
      reviewer = await getExpertReviewer(content.category);
      break;
      
    case 'article':
    case 'guide':
      // BOTH: Any writer + specialist reviewer
      author = await getAvailableWriter();
      reviewer = await getExpertReviewer(content.category);
      break;
      
    case 'comparison':
    case 'list':
      // JUST AUTHOR - Writer who knows the category well
      author = await getWriterForCategory(content.category);
      reviewer = null; // Editorial oversight implied
      break;
      
    case 'news':
      // JUST AUTHOR
      author = await getAvailableWriter();
      reviewer = null;
      break;
  }
  
  return { author, reviewer };
}

// Get expert reviewer based on category
async function getExpertReviewer(category: string) {
  const expertMap = {
    'credit-cards': 'karthik-menon', // Credit specialist
    'loans': 'karthik-menon',
    'investing': 'meera-iyer', // Economics PhD
    'ipo': 'amit-desai', // CFA
    'insurance': 'harpreet-kaur', // IRDAI certified
    'banking': 'thomas-fernandes', // Former RBI
    'taxes': 'deepika-singh', // CA
    'small-business': 'rajesh-mehta' // General expert
  };
  
  const slug = expertMap[category] || 'rajesh-mehta';
  return await authorsService.getAuthorBySlug(slug);
}

// Get any available writer (round-robin)
async function getAvailableWriter() {
  const writers = await authorsService.getAllAuthors({ 
    role: 'author',
    active: true 
  });
  
  // Return writer with least content (load balancing)
  return writers.sort((a, b) => 
    a.totalArticles - b.totalArticles
  )[0];
}
```

---

## 📊 **EDITOR SPECIALIZATIONS**

### **Subject Matter Experts (for "Reviewed by"):**

| Category | Expert Reviewer | Credentials |
|----------|----------------|-------------|
| **Credit Cards** | Karthik Menon | CIBIL Certified Credit Counselor |
| **Loans** | Karthik Menon | Retail Banking Expert, 10+ Years |
| **Investing** | Dr. Meera Iyer | PhD Economics, Former IIT Professor |
| **IPO** | Amit Desai | CFA, Former Investment Banker |
| **Insurance** | Harpreet Kaur | FII, IRDAI Approved Surveyor |
| **Banking** | Thomas Fernandes | Former RBI Officer, CAIIB |
| **Taxes** | Deepika Singh | CA, Tax Consultant, 11+ Years |
| **Small Business** | Rajesh Mehta | CFA, 12+ Years Publishing |

### **General Content Editors (for "Edited by"):**
- Rajesh Mehta - Chief Editor (everything)
- Nandini Reddy - Compliance review (SEBI content)
- Thomas Fernandes - Banking/regulatory

---

## 🎯 **UPDATED DATABASE SCHEMA**

```sql
-- Add content_type to determine attribution
ALTER TABLE public.glossary_terms 
    ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'glossary_term',
    ADD COLUMN IF NOT EXISTS reviewer_role TEXT DEFAULT 'subject_matter_expert';

ALTER TABLE public.blog_posts 
    ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'article',
    ADD COLUMN IF NOT EXISTS reviewer_role TEXT DEFAULT 'editor';

-- Update authors table with role specializations
ALTER TABLE public.authors
    ADD COLUMN IF NOT EXISTS sme_categories TEXT[], -- Subject matter expert for these
    ADD COLUMN IF NOT EXISTS editor_type TEXT; -- 'sme' or 'content_editor'

-- Update editors with specializations
UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['credit-cards', 'loans', 'banking']
WHERE slug = 'karthik-menon';

UPDATE public.authors 
SET 
    editor_type = 'subject_matter_expert',
    sme_categories = ARRAY['investing', 'banking']
WHERE slug = 'meera-iyer';

-- Etc for all editors
```

---

## ✅ **FINAL RECOMMENDATION**

### **For Glossary Terms:**
```
[Content]

✓ Reviewed by: Karthik Menon, CIBIL Certified
  Last reviewed: Jan 3, 2026
```

### **For Articles:**
```
Written by: Priya Menon
            Loans Expert

Reviewed by: Karthik Menon
             Credit Products Editor | CIBIL Certified

Published: Jan 3, 2026
```

### **For Comparisons:**
```
By: Arjun Sharma
Updated: Jan 3, 2026
```

---

**This matches industry standards perfectly!** ✅

*Created: January 3, 2026*  
*Attribution System: ALIGNED WITH INDUSTRY BEST PRACTICES*
