# AI Drafting Constraints System

## Overview

InvestingPro.in implements strict constraints for AI-generated content to ensure correctness, transparency, and trust. All AI outputs must comply with regulatory requirements and platform guidelines.

## AI Permissions

### AI MAY:
- ✅ **Summarize factual data** from verified sources (Supabase, RBI, SEBI, AMFI, official sites)
- ✅ **Explain formulas** and calculations (e.g., SIP, EMI, tax calculations)
- ✅ **Generate FAQs** from existing content and documentation
- ✅ **Generate metadata** (titles, descriptions, tags, excerpts)

### AI MAY NOT:
- ❌ **Recommend products** (no "best", "top pick", "recommended")
- ❌ **Rank products** (no subjective comparisons)
- ❌ **Use subjective language** (no opinions, preferences, or judgments)
- ❌ **Make financial predictions** (no return forecasts, market predictions)
- ❌ **Provide buy/sell/hold recommendations** (no investment advice)

## Required Metadata

Every AI output MUST include:

### 1. Data Sources
```typescript
interface AIDataSource {
    source_type: 'supabase' | 'rbi' | 'sebi' | 'amfi' | 'official_site' | 'scraped';
    source_url?: string;
    source_name: string;
    last_verified: string;
    confidence: number; // 0.0 - 1.0
}
```

### 2. Confidence Level
```typescript
interface AIConfidence {
    overall: number; // 0.0 - 1.0
    data_quality: number; // Quality of source data
    factual_accuracy: number; // Confidence in factual claims
    completeness: number; // How complete the data is
    recency: number; // How recent the data is
}
```

### 3. Change Log
```typescript
interface AIChangeLog {
    timestamp: string;
    change_type: 'created' | 'updated' | 'reviewed' | 'published';
    changed_by?: string; // User email or 'ai'
    changes: string[];
    previous_version?: string;
}
```

## Forbidden Phrases

AI must NEVER use these phrases:
- "we recommend"
- "you should"
- "you must"
- "best option"
- "guaranteed returns"
- "risk-free"
- "safe investment"
- "must buy"
- "must sell"
- "should invest"
- "should avoid"
- "top pick"
- "best choice"
- "worst choice"
- "avoid this"
- "buy now"
- "sell now"
- "hold this"
- "financial advice"
- "investment advice"
- "trading advice"
- "we advise"
- "our recommendation"
- "expert recommendation"
- "professional advice"

## Allowed Phrases

Use these informational phrases instead:
- "this product offers..."
- "according to the data..."
- "users may consider..."
- "information shows..."
- "data indicates..."
- "based on available information..."
- "the product features..."
- "this product includes..."
- "as per the documentation..."
- "the data suggests..."
- "available information indicates..."

## Allowed Operations

AI can perform these operations:
- `summarize_factual_data` - Summarize verified data
- `explain_formula` - Explain calculation formulas
- `generate_faqs` - Generate FAQs from content
- `generate_metadata` - Generate titles, descriptions, tags
- `extract_key_points` - Extract key points from content
- `categorize_content` - Categorize content
- `sentiment_analysis` - Analyze sentiment (for reviews)
- `pros_cons_extraction` - Extract pros and cons (factual only)

## Forbidden Operations

AI CANNOT perform these operations:
- `recommend_product` - Recommend products
- `rank_product` - Rank products
- `compare_products_subjectively` - Subjective comparisons
- `predict_returns` - Predict financial returns
- `predict_performance` - Predict performance
- `provide_financial_advice` - Provide financial advice
- `suggest_investment_strategy` - Suggest strategies
- `evaluate_risk_subjectively` - Subjective risk evaluation

## Implementation

### API Layer (`lib/api.ts`)

The `InvokeLLM` function enforces constraints:

```typescript
await api.integrations.Core.InvokeLLM({
    prompt: prompt,
    operation: 'summarize_factual_data', // Must be in ALLOWED_AI_OPERATIONS
    dataSources: [
        {
            source_type: 'supabase',
            source_name: 'Supabase Database',
            last_verified: new Date().toISOString(),
            confidence: 0.8
        }
    ]
});
```

### Constraints System (`lib/ai/constraints.ts`)

- `validateAIContent()` - Validates content against constraints
- `calculateConfidence()` - Calculates confidence from data sources
- `createChangeLog()` - Creates change log entries
- `generateSystemPrompt()` - Generates system prompt with constraints

### UI Component (`components/admin/AIContentGenerator.tsx`)

Displays:
- Data sources used
- Confidence level (with visual indicator)
- Change log
- Forbidden phrases warnings
- Review status

## Review Process

All AI-generated content:
1. **Must be marked as draft** (`is_draft: true`)
2. **Requires human review** (`requires_review: true`)
3. **Cannot be published** until approved by human reviewer
4. **Must include citations** for all factual claims
5. **Must list data sources** used

## Example Output

```json
{
  "title": "Understanding SIP Investments",
  "content": "Systematic Investment Plans (SIPs) allow investors to invest fixed amounts regularly...",
  "ai_metadata": {
    "data_sources": [
      {
        "source_type": "amfi",
        "source_name": "AMFI Official Website",
        "last_verified": "2024-01-15T10:00:00Z",
        "confidence": 0.95
      }
    ],
    "confidence": {
      "overall": 0.92,
      "data_quality": 0.95,
      "factual_accuracy": 0.90,
      "completeness": 0.85,
      "recency": 0.95
    },
    "change_log": [
      {
        "timestamp": "2024-01-15T10:00:00Z",
        "change_type": "created",
        "changed_by": "ai",
        "changes": ["Initial draft created", "Operation: summarize_factual_data"]
      }
    ],
    "generated_at": "2024-01-15T10:00:00Z",
    "generated_by": "ai",
    "requires_review": true,
    "review_status": "pending",
    "forbidden_phrases_found": [],
    "allowed_operations": ["summarize_factual_data"]
  }
}
```

## Compliance

This system ensures:
- ✅ No financial advice is provided
- ✅ All claims are backed by verified sources
- ✅ Transparency in data sources and confidence
- ✅ Human review before publication
- ✅ Regulatory compliance (not SEBI registered, not a financial advisor)
- ✅ Platform positioning (research, education, discovery only)

## Testing

To test the constraints system:

1. Generate content via `AIContentGenerator` component
2. Verify metadata is included
3. Check for forbidden phrases
4. Validate confidence scores
5. Review change log
6. Ensure draft status and review requirement

## Maintenance

- Update `FORBIDDEN_PHRASES` as needed
- Add new allowed operations to `ALLOWED_AI_OPERATIONS`
- Review and update confidence calculation logic
- Monitor AI outputs for compliance violations

