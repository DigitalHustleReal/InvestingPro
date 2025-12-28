# Strict Content System

## Overview

This is a **strict, template-based content system** with NO free-form writing. All content must follow rigid schemas and templates.

## Content Types

### 1. Pillar Pages (Category-level)
**Purpose:** Comprehensive category overview pages (e.g., "Credit Cards in India")

**Required Sections:**
- Hero (headline, subheadline, CTA)
- Overview (content, key statistics)
- Key Features (3-6 features)
- How It Works (3-7 steps)
- Types/Variants (2-8 variants)
- Pros & Cons (3-8 pros, 2-6 cons)
- FAQ (5-10 questions)
- CTA (headline, description, CTA)

**SEO Rules:**
- Title: Max 60 chars, must include primary keyword
- Description: Max 160 chars, must include primary keyword + CTA
- Keywords: 5-10 keywords, primary first
- H1: Max 60 chars, must match title intent

**Internal Linking:**
- Minimum: 8 links
- Maximum: 15 links
- Must include: subcategory pages, explainer articles, glossary terms

### 2. Subcategory Pages
**Purpose:** Specific subcategory pages (e.g., "Rewards Credit Cards")

**Required Sections:**
- Hero
- Overview
- Key Features (2-5 features)
- FAQ (3-8 questions)
- CTA

**Optional Sections:**
- Comparison Table
- Use Cases
- Eligibility Criteria
- Fees & Charges

**SEO Rules:**
- Title: Max 60 chars, must include primary keyword
- Description: Max 160 chars, must include primary keyword + CTA
- Keywords: 3-8 keywords

**Internal Linking:**
- Minimum: 5 links
- Maximum: 10 links
- Must include: parent pillar page, explainer articles, products

### 3. Explainer Articles
**Purpose:** Educational articles explaining concepts (e.g., "How SIP Works")

**Required Sections:**
- Definition (term, definition, simple explanation)
- Detailed Explanation (content, subsections)
- Examples (2-4 examples)
- Related Terms (2-6 terms)

**Optional Sections:**
- Formula
- Common Mistakes
- Best Practices

**SEO Rules:**
- Title: Format "How/What/Why | primary_keyword | Works/Guide"
- Description: Max 160 chars, must include primary keyword
- Keywords: 3-6 keywords

**Internal Linking:**
- Minimum: 4 links
- Maximum: 8 links
- Must include: glossary terms, pillar page

### 4. Glossary Pages
**Purpose:** Term definitions (e.g., "SIP", "NAV", "APR")

**Required Sections:**
- Definition (term, full form if acronym, definition, pronunciation)
- Detailed Explanation
- Examples (1-3 examples)
- Related Terms (2-5 terms)

**Optional Sections:**
- Formula

**SEO Rules:**
- Title: Format "term | Definition/Meaning | brand"
- Description: Max 160 chars
- Keywords: 2-5 keywords

**Internal Linking:**
- Minimum: 3 links
- Maximum: 6 links
- Must include: explainer articles, pillar page

### 5. Calculator Explainers
**Purpose:** Explain how calculators work (e.g., "SIP Calculator Guide")

**Required Sections:**
- Calculator Intro (headline, description, use case)
- Input Fields (2-8 fields with descriptions)
- Output Explanation (1-5 outputs with interpretation)
- Interpretation Guide (2-4 scenarios)
- Use Cases (2-4 use cases)

**SEO Rules:**
- Title: Format "Calculator Name | Calculate/Estimate | brand"
- Description: Max 160 chars, must include CTA
- Keywords: 3-6 keywords

**Internal Linking:**
- Minimum: 3 links
- Maximum: 6 links
- Must include: explainer articles, glossary terms

## Schema Validation

All content must pass validation before publication:

```typescript
import { validateContent } from '@/lib/content/validation';

const result = validateContent(content);
if (!result.valid) {
    // Handle errors
    console.error(result.errors);
}
```

## SEO Metadata Rules

### Title Rules
- **Pillar/Subcategory:** `primary_keyword | secondary_info | brand`
- **Explainer:** `How/What/Why | primary_keyword | Works/Guide`
- **Glossary:** `term | Definition/Meaning | brand`
- **Calculator:** `Calculator Name | Calculate/Estimate | brand`

### Description Rules
- Must include primary keyword
- Must be 120-160 characters
- Include CTA for pillar/subcategory/calculator pages

### Keywords Rules
- Primary keyword must be first
- Max 10 keywords (varies by type)
- Must be relevant to content

## Internal Linking Rules

### Anchor Text Rules
- **Forbidden:** "click here", "read more", "learn more", "here", "this"
- **Max words:** 5 words
- **Min length:** 3 characters
- **Max length:** 60 characters

### Link Type Requirements
- **Pillar Pages:** Must link to subcategories, explainers, glossary
- **Subcategory Pages:** Must link back to pillar, explainers, products
- **Explainer Articles:** Must link to glossary, pillar
- **Glossary Pages:** Must link to explainers, pillar
- **Calculator Explainers:** Must link to explainers, glossary

### Link Count Requirements
- **Pillar:** 8-15 links
- **Subcategory:** 5-10 links
- **Explainer:** 4-8 links
- **Glossary:** 3-6 links
- **Calculator:** 3-6 links

## Usage Examples

### Creating a Pillar Page

```typescript
import { PillarPageSchema } from '@/lib/content/schemas';
import PillarPageTemplate from '@/components/content/templates/PillarPageTemplate';

const content: PillarPageSchema = {
    type: 'pillar_page',
    category: 'credit-cards',
    primary_keyword: 'credit cards',
    secondary_keywords: ['best credit cards', 'credit card comparison'],
    seo: {
        title: 'Credit Cards in India | Complete Guide | InvestingPro',
        description: 'Compare credit cards in India. Find the best credit cards with rewards, cashback, and travel benefits. Apply now.',
        keywords: ['credit cards', 'best credit cards', 'credit card comparison'],
        canonical_url: 'https://investingpro.in/credit-cards',
        structured_data: { /* ... */ },
        h1: 'Credit Cards in India',
    },
    sections: {
        hero: {
            headline: 'Credit Cards in India',
            subheadline: 'Compare and choose the best credit card for your needs',
        },
        // ... all required sections
    },
    internal_links: [
        { text: 'Rewards Credit Cards', url: '/credit-cards/rewards', link_type: 'subcategory', context: 'types_variants', is_required: true },
        // ... more links
    ],
    linking_rules: {
        min_links: 8,
        max_links: 15,
        required_link_types: ['subcategory', 'explainer', 'glossary'],
        anchor_text_rules: {
            max_words: 5,
            must_include_keyword: false,
            avoid_generic: ['click here', 'read more'],
        },
    },
};

// Validate before rendering
import { validatePillarPage } from '@/lib/content/validation';
const validation = validatePillarPage(content);
if (validation.valid) {
    return <PillarPageTemplate content={content} />;
}
```

## Template Components

All templates are available in `components/content/templates/`:
- `PillarPageTemplate.tsx`
- `SubcategoryPageTemplate.tsx` (to be created)
- `ExplainerArticleTemplate.tsx` (to be created)
- `GlossaryPageTemplate.tsx`
- `CalculatorExplainerTemplate.tsx` (to be created)

## Validation

Use validation functions before rendering:

```typescript
import {
    validatePillarPage,
    validateSubcategoryPage,
    validateExplainerArticle,
    validateGlossaryPage,
    validateCalculatorExplainer,
    validateContent, // Generic validator
} from '@/lib/content/validation';
```

## Best Practices

1. **Always validate** content before rendering
2. **Follow schemas strictly** - no free-form sections
3. **Include required internal links** - check linking rules
4. **Optimize SEO metadata** - use helper functions
5. **Test templates** - ensure all sections render correctly
6. **Review anchor text** - avoid generic phrases
7. **Check word counts** - stay within limits
8. **Verify required sections** - all must be present

## File Structure

```
lib/content/
├── schemas.ts          # Type definitions and schemas
├── validation.ts       # Validation functions
├── linking-rules.ts   # Internal linking rules
├── seo-rules.ts       # SEO metadata rules
└── README.md          # This file

components/content/templates/
├── PillarPageTemplate.tsx
├── SubcategoryPageTemplate.tsx
├── ExplainerArticleTemplate.tsx
├── GlossaryPageTemplate.tsx
└── CalculatorExplainerTemplate.tsx
```
## Enforcement

This system is **strict** - content that doesn't follow schemas will:
1. Fail validation
2. Not render correctly
3. Have SEO issues
4. Break internal linking

**NO EXCEPTIONS. Use templates only.**


