# AI Drafting Constraints Implementation

## Overview

Comprehensive AI constraint system implemented to ensure all AI-generated content follows strict rules: no recommendations, no rankings, no subjective language. All AI outputs include data sources, confidence levels, and change logs.

## Implementation Status

✅ **Fully Implemented**

## Core Constraints

### AI MAY:
1. **Summarize factual data** - From verified sources only
2. **Explain formulas** - Educational explanations of calculations
3. **Generate FAQs** - From existing content
4. **Generate metadata** - SEO titles, descriptions, tags

### AI MAY NOT:
1. **Recommend products** - No "we recommend", "you should", etc.
2. **Rank products** - No "best", "worst", "top pick", etc.
3. **Use subjective language** - No opinions, predictions, or advice
4. **Provide financial advice** - No buy/sell/hold recommendations

## Files Created/Modified

### Core Constraint System
- **`lib/ai/constraints.ts`** - Main constraint definitions
  - `ALLOWED_AI_OPERATIONS` - List of permitted operations
  - `FORBIDDEN_AI_OPERATIONS` - List of prohibited operations
  - `FORBIDDEN_PHRASES` - Phrases that must never appear
  - `ALLOWED_PHRASES` - Preferred informational phrases
  - `validateAIContent()` - Strict validation function
  - `calculateConfidence()` - Confidence scoring from data sources
  - `createChangeLog()` - Change log generation
  - `generateSystemPrompt()` - System prompt with constraints

### AI Operations Helpers
- **`lib/ai/operations.ts`** - Wrapper functions for allowed operations
  - `summarizeFactualData()` - Summarize verified data
  - `explainFormula()` - Explain financial formulas
  - `generateFAQs()` - Generate FAQs from content
  - `generateMetadata()` - Generate SEO metadata

### API Integration
- **`lib/api.ts`** - Updated `InvokeLLM` function
  - Operation validation (checks both allowed and forbidden)
  - Content validation (detects forbidden phrases)
  - Automatic metadata generation (data sources, confidence, change log)
  - Error handling with fallback metadata

### Python Integration
- **`lib/scraper/sentiment_analyzer.py`** - Updated with constraints
  - Sentiment analysis with metadata
  - Product summary with data sources and confidence
  - Change log tracking

## Validation System

### Operation Validation
```typescript
// Checks if operation is forbidden
if (FORBIDDEN_AI_OPERATIONS.includes(operation)) {
    throw new Error("Operation forbidden");
}

// Checks if operation is in allowed list
if (!ALLOWED_AI_OPERATIONS.includes(operation) && operation !== 'general') {
    throw new Error("Operation not allowed");
}
```

### Content Validation
```typescript
const validation = validateAIContent(content, operation);
// Returns:
// - valid: boolean
// - forbidden_phrases_found: string[]
// - errors: string[]
// - warnings: string[]
```

### Forbidden Phrase Detection
- Checks for phrases like "we recommend", "you should", "best option", etc.
- Detects subjective language patterns
- Marks content as requiring revision if violations found

## Metadata Structure

Every AI output includes:

### Data Sources
```typescript
{
    source_type: 'supabase' | 'rbi' | 'sebi' | 'amfi' | 'official_site' | 'scraped',
    source_name: string,
    source_url?: string,
    last_verified: string,
    confidence: number // 0.0 - 1.0
}
```

### Confidence Levels
```typescript
{
    overall: number,        // 0.0 - 1.0
    data_quality: number,  // Quality of source data
    factual_accuracy: number, // Confidence in factual claims
    completeness: number,  // How complete the data is
    recency: number        // How recent the data is
}
```

### Change Log
```typescript
{
    timestamp: string,
    change_type: 'created' | 'updated' | 'reviewed' | 'published',
    changed_by?: string, // User email or 'ai'
    changes: string[]
}
```

### Complete AI Metadata
```typescript
{
    data_sources: AIDataSource[],
    confidence: AIConfidence,
    change_log: AIChangeLog[],
    generated_at: string,
    generated_by: 'ai',
    requires_review: boolean,
    review_status: 'pending' | 'approved' | 'rejected' | 'needs_revision',
    forbidden_phrases_found: string[],
    allowed_operations: string[]
}
```

## Usage Examples

### Summarize Factual Data
```typescript
import { summarizeFactualData } from '@/lib/ai/operations';

const result = await summarizeFactualData({
    data: productData,
    dataSources: [
        {
            source_type: 'supabase',
            source_name: 'Product Database',
            last_verified: new Date().toISOString(),
            confidence: 0.9
        }
    ],
    context: 'Product comparison'
});

// Result includes:
// - summary: string
// - ai_metadata: AIContentMetadata (with data sources, confidence, change log)
```

### Explain Formula
```typescript
import { explainFormula } from '@/lib/ai/operations';

const result = await explainFormula({
    formula: 'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)',
    formulaName: 'EMI Calculator',
    example: { principal: 1000000, rate: 8.5, tenure: 20 },
    dataSources: [...]
});
```

### Generate FAQs
```typescript
import { generateFAQs } from '@/lib/ai/operations';

const result = await generateFAQs({
    content: articleContent,
    topic: 'SIP Investment',
    dataSources: [...]
});

// Returns: { faqs: Array<{question, answer}>, ai_metadata }
```

### Generate Metadata
```typescript
import { generateMetadata } from '@/lib/ai/operations';

const result = await generateMetadata({
    content: articleContent,
    topic: 'Credit Cards',
    dataSources: [...]
});

// Returns: { seo_title, seo_description, tags, ai_metadata }
```

## Direct API Usage

```typescript
import { api } from '@/lib/api';

const result = await api.integrations.Core.InvokeLLM({
    prompt: "Summarize this product data...",
    operation: 'summarize_factual_data', // Must be in ALLOWED_AI_OPERATIONS
    contextData: productData,
    dataSources: [...],
    citations: ['https://source1.com', 'https://source2.com']
});

// Result automatically includes:
// - ai_metadata with data sources, confidence, change log
// - Validation results
// - Forbidden phrases detected (if any)
```

## Python Integration

### Sentiment Analysis
```python
from lib.scraper.sentiment_analyzer import ReviewAnalyzer

analyzer = ReviewAnalyzer()
result = analyzer.analyze_sentiment(
    review_text="Great card with good rewards",
    source_url="https://example.com/reviews"
)

# Result includes:
# - sentiment, confidence, key_points, concerns
# - data_sources, generated_at, change_log
```

### Product Summary
```python
result = analyzer.generate_product_summary(
    product_name="HDFC Regalia",
    reviews=review_list,
    source_url="https://example.com"
)

# Result includes:
# - summary
# - data_sources with confidence
# - requires_review flag
# - change_log
```

## Validation Flow

1. **Operation Check** - Verify operation is allowed
2. **System Prompt** - Generate prompt with constraints
3. **AI Generation** - Call OpenAI with constrained prompt
4. **Content Validation** - Check for forbidden phrases
5. **Metadata Generation** - Add data sources, confidence, change log
6. **Error Handling** - Fallback with error metadata if needed

## Enforcement Points

1. **API Level** (`lib/api.ts`)
   - Operation validation before AI call
   - Content validation after AI response
   - Automatic metadata attachment

2. **Helper Functions** (`lib/ai/operations.ts`)
   - Pre-validated operation types
   - Automatic metadata generation
   - Consistent error handling

3. **Python Scripts** (`lib/scraper/sentiment_analyzer.py`)
   - Constrained system prompts
   - Metadata in all responses
   - Change log tracking

## Monitoring & Review

All AI outputs are marked with:
- `requires_review: true` - Human review required before publication
- `review_status: 'pending'` - Initial status
- `forbidden_phrases_found: []` - Detected violations
- `validation_warnings: []` - Potential issues

## Best Practices

1. **Always use helper functions** from `lib/ai/operations.ts` when possible
2. **Always provide data sources** - Required for confidence calculation
3. **Always check validation results** - Review `forbidden_phrases_found`
4. **Always require human review** - Never auto-publish AI content
5. **Always include citations** - Link back to source data

## Testing

To test the constraint system:

```typescript
// Test forbidden operation
try {
    await api.integrations.Core.InvokeLLM({
        prompt: "...",
        operation: 'recommend_product' // Should throw error
    });
} catch (error) {
    // Expected: "Operation 'recommend_product' is forbidden"
}

// Test forbidden phrases
const result = await summarizeFactualData({
    data: { name: "Best credit card" },
    dataSources: [...]
});

// Check validation
if (result.ai_metadata.forbidden_phrases_found.length > 0) {
    console.log("Content requires revision");
}
```

## Compliance Checklist

- ✅ All AI operations validated against allowed/forbidden lists
- ✅ All AI outputs include data sources
- ✅ All AI outputs include confidence levels
- ✅ All AI outputs include change logs
- ✅ Content validation detects forbidden phrases
- ✅ Python scripts updated with constraints
- ✅ Helper functions for common operations
- ✅ Error handling with fallback metadata
- ✅ Human review required for all outputs

## Next Steps

1. **Add UI for reviewing AI content** - Display metadata and validation results
2. **Add automated testing** - Test constraint enforcement
3. **Add monitoring dashboard** - Track AI usage and violations
4. **Add approval workflow** - Streamline human review process

