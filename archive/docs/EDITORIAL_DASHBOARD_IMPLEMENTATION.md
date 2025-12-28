# Editorial Approval Dashboard Implementation

## Overview

Fully functional editorial approval dashboard designed for efficient review of AI-generated content. Optimized for <90 minutes/week human review time.

## Features Implemented

### ✅ Draft Queue
- Lists all AI-generated drafts awaiting review
- Auto-refreshes every 30 seconds
- Shows pending count and risk distribution

### ✅ Batch Approve/Reject
- Select multiple drafts with checkboxes
- "Select All" functionality
- Batch approve/reject with one click
- Confirmation dialogs for safety

### ✅ Diff View
- Modal dialog with three tabs:
  - **Diff View**: Shows content with risk indicators
  - **Preview**: Rendered preview of the article
  - **Sources & Metadata**: Data sources, confidence scores, change log

### ✅ Source List
- Displays all data sources used in AI generation
- Shows source type, name, URL, confidence
- Highlights missing sources as risk indicator

### ✅ Risk Flag (Low/Medium/High)
- Automatic risk calculation based on:
  - Forbidden phrases detected
  - Confidence levels
  - Number of data sources
  - Data quality scores
- Color-coded badges (red/amber/green)
- Risk-based sorting (high risk first)

### ✅ Efficient Filtering
- Search by title, excerpt, category
- Filter by risk level (all/high/medium/low)
- Filter by category
- Real-time filtering

### ✅ One-Click Approval
- Approve button on each draft card
- Updates status to "published"
- Marks as human-reviewed
- Updates change log
- Invalidates cache for immediate UI update

## Files Created

### Main Dashboard
- **`app/editorial/page.tsx`** - Main editorial dashboard page
  - Draft queue display
  - Batch selection and actions
  - Filtering and search
  - Risk calculation
  - Stats display

### Components
- **`components/editorial/EditorialDraftCard.tsx`** - Individual draft card
  - Risk badge display
  - Data sources preview
  - Confidence indicators
  - Quick actions (approve/reject/view diff)
  - Forbidden phrases warning

- **`components/editorial/DiffView.tsx`** - Diff view modal
  - Three-tab interface (Diff/Preview/Sources)
  - Confidence scores display
  - Data sources list
  - Change log viewer

### UI Components
- **`components/ui/checkbox.tsx`** - Checkbox component for selection

## Workflow

1. **AI Drafts Content**
   - AI generates content via `AIContentGenerator`
   - Content saved with `status: 'draft'`
   - `ai_generated: true`
   - `ai_metadata` includes data sources, confidence, change log

2. **Status = "pending"**
   - Content appears in editorial dashboard
   - Risk level calculated automatically
   - Shown in draft queue

3. **Editor Reviews**
   - Views draft in queue
   - Checks risk level and sources
   - Opens diff view if needed
   - Reviews content and metadata

4. **One-Click Approval**
   - Click "Approve" button
   - Status updated to "published"
   - `human_reviewed: true`
   - `reviewed_at` timestamp set
   - Change log updated
   - Content immediately available

5. **Batch Processing**
   - Select multiple low-risk drafts
   - Batch approve for efficiency
   - Saves time on routine approvals

## Risk Calculation

Risk level is calculated based on:

### High Risk
- Forbidden phrases detected
- Confidence < 0.6
- Few data sources (< 2) + low confidence

### Medium Risk
- Confidence 0.6-0.8
- Validation warnings
- Few data sources

### Low Risk
- Confidence ≥ 0.8
- Multiple data sources
- No forbidden phrases
- No warnings

## Efficiency Features

### Time-Saving Design
1. **Risk-Based Sorting** - High risk items appear first
2. **Quick Actions** - One-click approve/reject
3. **Batch Operations** - Process multiple items at once
4. **Smart Filtering** - Focus on specific risk levels or categories
5. **Visual Indicators** - Color-coded risk badges for quick scanning
6. **Source Preview** - See data sources without opening full view
7. **Auto-Refresh** - Queue updates automatically

### Estimated Review Time
- **Low Risk**: ~30 seconds per draft (quick scan + approve)
- **Medium Risk**: ~2 minutes per draft (review sources + approve)
- **High Risk**: ~5 minutes per draft (full review + diff view)

For 20 drafts/week:
- 10 low risk: 5 minutes
- 7 medium risk: 14 minutes
- 3 high risk: 15 minutes
- **Total: ~34 minutes/week** (well under 90 minutes)

## API Integration

### Mutations
- `batchApproveMutation` - Approve multiple drafts
- `batchRejectMutation` - Reject multiple drafts
- Individual approve/reject via `EditorialDraftCard`

### Queries
- `editorial-drafts` - Fetches pending AI-generated drafts
- Auto-refreshes every 30 seconds
- Filters for `ai_generated: true` and `status: 'draft'`

## Data Structure

### Draft Article
```typescript
{
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    category: string;
    status: 'draft';
    ai_generated: true;
    ai_metadata: {
        data_sources: Array<{
            source_type: string;
            source_name: string;
            source_url?: string;
            confidence: number;
            last_verified: string;
        }>;
        confidence: {
            overall: number;
            data_quality: number;
            factual_accuracy: number;
            completeness: number;
            recency: number;
        };
        forbidden_phrases_found: string[];
        change_log: Array<{
            timestamp: string;
            change_type: string;
            changed_by: string;
            changes: string[];
        }>;
        review_status: 'pending' | 'approved' | 'rejected';
    };
    created_at: string;
    updated_at: string;
}
```

## Usage

### Access Dashboard
Navigate to `/editorial` (admin access required)

### Review Process
1. View draft queue
2. Check risk level (color-coded badge)
3. Review data sources preview
4. Click "View Diff" for detailed review if needed
5. Click "Approve" or "Reject"

### Batch Processing
1. Select drafts using checkboxes
2. Use "Select All" for all visible drafts
3. Click "Approve All" or "Reject All"
4. Confirm action

### Filtering
- Use search box to find specific drafts
- Filter by risk level (high/medium/low)
- Filter by category
- Filters work together (AND logic)

## Security

- Admin-only access (via RLS policies)
- Confirmation dialogs for batch actions
- Change log tracks all approvals/rejections
- Human review required before publishing

## Future Enhancements

1. **Keyboard Shortcuts** - Quick approve/reject with keys
2. **Bulk Edit** - Edit multiple drafts at once
3. **AI Suggestions** - AI-powered risk assessment improvements
4. **Review Templates** - Pre-filled rejection reasons
5. **Analytics** - Track review times and patterns
6. **Notifications** - Alert when high-risk drafts arrive

## Build Status

✅ **Build Successful**
- All TypeScript errors resolved
- All components functional
- Ready for production use

