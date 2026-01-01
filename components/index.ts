/**
 * InvestingPro - Master Component Exports
 * 
 * Central export point for commonly used components.
 * Import from here for convenience.
 */

// ============================================
// ENGAGEMENT COMPONENTS
// ============================================
export { 
    default as NewsletterWidget 
} from './engagement/NewsletterWidget';

export { 
    default as BookmarkButton 
} from './engagement/BookmarkButton';

export { 
    default as NotificationBell 
} from './engagement/NotificationBell';

// ============================================
// MONETIZATION COMPONENTS
// ============================================
export { 
    default as SmartCTA,
    ApplyNowCTA,
    CompareNowCTA,
    LearnMoreCTA
} from './monetization/SmartCTA';

export { 
    default as AdSlot,
    PromotionCard,
    ComparisonWidget
} from './monetization/AdSlot';

export { 
    default as ContextualCTA 
} from './monetization/ContextualCTA';

// ============================================
// SEARCH COMPONENTS
// ============================================
export { 
    default as CommandPalette 
} from './search/CommandPalette';

export { 
    SearchProvider, 
    useSearch 
} from './search/SearchProvider';

// ============================================
// ARTICLE COMPONENTS
// ============================================
export { 
    default as RelatedArticles 
} from './articles/RelatedArticles';

// ============================================
// ADMIN COMPONENTS
// ============================================
export { 
    default as AnalyticsDashboard 
} from './admin/AnalyticsDashboard';

export { 
    default as SEOHealthWidget 
} from './admin/SEOHealthWidget';
