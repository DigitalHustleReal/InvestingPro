/**
 * Event Calendar System
 * 
 * Makes the CMS event-aware for seasonal content planning.
 * Tracks Indian financial calendar events, festivals, and content opportunities.
 */

export type EventCategory = 
    | 'tax' 
    | 'festival' 
    | 'market' 
    | 'banking' 
    | 'insurance' 
    | 'investment'
    | 'regulatory';

export type ContentPriority = 'critical' | 'high' | 'medium' | 'low';

export interface CalendarEvent {
    id: string;
    name: string;
    date: Date;
    endDate?: Date; // For multi-day events
    category: EventCategory;
    contentPriority: ContentPriority;
    description: string;
    suggestedTopics: string[];
    articleCategories: string[]; // Which article categories this relates to
    daysBeforeToPublish: number; // How many days before event to publish content
    isRecurring: boolean;
    recurringPattern?: 'yearly' | 'quarterly' | 'monthly';
}

export interface ContentSuggestion {
    event: CalendarEvent;
    suggestedTitle: string;
    urgency: 'publish_now' | 'prepare' | 'upcoming' | 'future';
    daysUntilEvent: number;
    daysUntilPublishDeadline: number;
    articleCategories: string[];
    searchIntent: 'informational' | 'commercial' | 'transactional';
}

// Indian Financial Calendar Events (2026)
const CALENDAR_EVENTS: Omit<CalendarEvent, 'date' | 'endDate'>[] = [
    // TAX EVENTS
    {
        id: 'advance-tax-q1',
        name: 'Advance Tax Q1 Deadline',
        category: 'tax',
        contentPriority: 'critical',
        description: 'First installment of advance tax due',
        suggestedTopics: [
            'How to calculate advance tax',
            'Advance tax payment guide',
            'Penalties for missing advance tax',
            'Advance tax calculator 2026'
        ],
        articleCategories: ['taxes', 'personal-finance'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'quarterly'
    },
    {
        id: 'advance-tax-q2',
        name: 'Advance Tax Q2 Deadline',
        category: 'tax',
        contentPriority: 'critical',
        description: 'Second installment of advance tax due',
        suggestedTopics: [
            'Advance tax second installment guide',
            'How to pay advance tax online',
            'Advance tax vs TDS'
        ],
        articleCategories: ['taxes', 'personal-finance'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'quarterly'
    },
    {
        id: 'advance-tax-q3',
        name: 'Advance Tax Q3 Deadline',
        category: 'tax',
        contentPriority: 'critical',
        description: 'Third installment of advance tax due',
        suggestedTopics: [
            'Advance tax third installment',
            'Year-end tax planning',
            'Tax saving before March'
        ],
        articleCategories: ['taxes', 'personal-finance'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'quarterly'
    },
    {
        id: 'advance-tax-q4',
        name: 'Advance Tax Final Deadline',
        category: 'tax',
        contentPriority: 'critical',
        description: 'Final installment of advance tax due',
        suggestedTopics: [
            'Last chance for advance tax',
            'Advance tax final payment',
            'March 15 tax deadline'
        ],
        articleCategories: ['taxes', 'personal-finance'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'quarterly'
    },
    {
        id: 'itr-deadline',
        name: 'ITR Filing Deadline',
        category: 'tax',
        contentPriority: 'critical',
        description: 'Income Tax Return filing deadline for individuals',
        suggestedTopics: [
            'How to file ITR 2026',
            'ITR filing step by step guide',
            'Documents required for ITR',
            'ITR form selection guide',
            'ITR filing mistakes to avoid',
            'Tax saving sections 80C to 80U'
        ],
        articleCategories: ['taxes', 'personal-finance'],
        daysBeforeToPublish: 30,
        isRecurring: true,
        recurringPattern: 'yearly'
    },
    {
        id: 'tax-saving-deadline',
        name: 'Tax Saving Investment Deadline',
        category: 'tax',
        contentPriority: 'critical',
        description: 'Last date to make tax-saving investments for FY',
        suggestedTopics: [
            'Best ELSS funds 2026',
            'Section 80C investment options',
            'Tax saving fixed deposits',
            'PPF vs ELSS comparison',
            'Last minute tax saving tips'
        ],
        articleCategories: ['taxes', 'mutual-funds', 'investing'],
        daysBeforeToPublish: 45,
        isRecurring: true,
        recurringPattern: 'yearly'
    },

    // FESTIVALS
    {
        id: 'diwali',
        name: 'Diwali',
        category: 'festival',
        contentPriority: 'high',
        description: 'Festival of lights - major spending season',
        suggestedTopics: [
            'Diwali shopping credit cards',
            'Gold buying during Diwali',
            'Diwali credit card offers',
            'Best cashback for Diwali shopping',
            'Dhanteras gold investment'
        ],
        articleCategories: ['credit-cards', 'personal-finance', 'investing'],
        daysBeforeToPublish: 21,
        isRecurring: true,
        recurringPattern: 'yearly'
    },
    {
        id: 'akshaya-tritiya',
        name: 'Akshaya Tritiya',
        category: 'festival',
        contentPriority: 'high',
        description: 'Auspicious day for gold buying',
        suggestedTopics: [
            'Should you buy gold on Akshaya Tritiya',
            'Digital gold vs physical gold',
            'Gold ETF investment guide',
            'Sovereign Gold Bonds 2026'
        ],
        articleCategories: ['investing', 'personal-finance'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'yearly'
    },
    {
        id: 'navratri',
        name: 'Navratri',
        category: 'festival',
        contentPriority: 'medium',
        description: 'Nine nights festival - vehicle buying season',
        suggestedTopics: [
            'Best car loans during Navratri',
            'Navratri vehicle buying guide',
            'Auto loan interest rates comparison'
        ],
        articleCategories: ['loans', 'credit-cards'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'yearly'
    },

    // BANKING/RBI EVENTS
    {
        id: 'rbi-mpc-meeting',
        name: 'RBI MPC Meeting',
        category: 'banking',
        contentPriority: 'high',
        description: 'Monetary Policy Committee meeting - interest rate decision',
        suggestedTopics: [
            'RBI repo rate decision impact',
            'How repo rate affects home loans',
            'Fixed deposit rates after RBI meeting',
            'Loan EMI changes prediction'
        ],
        articleCategories: ['loans', 'banking', 'investing'],
        daysBeforeToPublish: 7,
        isRecurring: true,
        recurringPattern: 'quarterly'
    },
    {
        id: 'bank-fd-rate-revision',
        name: 'Bank FD Rate Revision',
        category: 'banking',
        contentPriority: 'medium',
        description: 'Banks typically revise FD rates quarterly',
        suggestedTopics: [
            'Best FD rates comparison',
            'Highest FD interest rates 2026',
            'Senior citizen FD rates',
            'Tax saver FD vs ELSS'
        ],
        articleCategories: ['banking', 'investing'],
        daysBeforeToPublish: 7,
        isRecurring: true,
        recurringPattern: 'quarterly'
    },

    // INSURANCE EVENTS
    {
        id: 'health-insurance-renewal',
        name: 'Health Insurance Renewal Season',
        category: 'insurance',
        contentPriority: 'medium',
        description: 'Peak time for health insurance renewals',
        suggestedTopics: [
            'Health insurance renewal tips',
            'Should you port health insurance',
            'Best health insurance plans 2026',
            'Family floater vs individual plans'
        ],
        articleCategories: ['insurance', 'personal-finance'],
        daysBeforeToPublish: 30,
        isRecurring: true,
        recurringPattern: 'yearly'
    },

    // MARKET EVENTS
    {
        id: 'budget-announcement',
        name: 'Union Budget',
        category: 'regulatory',
        contentPriority: 'critical',
        description: 'Annual Union Budget presentation',
        suggestedTopics: [
            'Budget expectations 2026',
            'Budget impact on markets',
            'Tax changes in budget',
            'Budget impact on mutual funds',
            'Stocks to buy before budget'
        ],
        articleCategories: ['investing', 'taxes', 'stocks', 'mutual-funds'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'yearly'
    },
    {
        id: 'quarterly-results',
        name: 'Corporate Quarterly Results',
        category: 'market',
        contentPriority: 'medium',
        description: 'Earnings season for listed companies',
        suggestedTopics: [
            'Quarterly results to watch',
            'How to analyze quarterly results',
            'Stocks with strong earnings growth',
            'Sectoral performance analysis'
        ],
        articleCategories: ['stocks', 'investing'],
        daysBeforeToPublish: 7,
        isRecurring: true,
        recurringPattern: 'quarterly'
    },

    // CREDIT CARD EVENTS
    {
        id: 'amazon-sale',
        name: 'Amazon Great Indian Festival',
        category: 'festival',
        contentPriority: 'high',
        description: 'Major e-commerce sale event',
        suggestedTopics: [
            'Best credit cards for Amazon sale',
            'Amazon Pay ICICI benefits',
            'Cashback credit cards for online shopping',
            'No cost EMI options explained'
        ],
        articleCategories: ['credit-cards', 'personal-finance'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'yearly'
    },
    {
        id: 'flipkart-bbdays',
        name: 'Flipkart Big Billion Days',
        category: 'festival',
        contentPriority: 'high',
        description: 'Major e-commerce sale event',
        suggestedTopics: [
            'Best credit cards for Flipkart sale',
            'Flipkart Axis card benefits',
            'Bank offers during BBD',
            'How to maximize sale discounts'
        ],
        articleCategories: ['credit-cards', 'personal-finance'],
        daysBeforeToPublish: 14,
        isRecurring: true,
        recurringPattern: 'yearly'
    },
];

// Generate dates for 2026
function getEventDates2026(eventId: string): { date: Date; endDate?: Date } {
    const dates: Record<string, { date: Date; endDate?: Date }> = {
        'advance-tax-q1': { date: new Date('2026-06-15') },
        'advance-tax-q2': { date: new Date('2026-09-15') },
        'advance-tax-q3': { date: new Date('2026-12-15') },
        'advance-tax-q4': { date: new Date('2027-03-15') },
        'itr-deadline': { date: new Date('2026-07-31') },
        'tax-saving-deadline': { date: new Date('2026-03-31') },
        'diwali': { date: new Date('2026-11-08'), endDate: new Date('2026-11-12') },
        'akshaya-tritiya': { date: new Date('2026-05-01') },
        'navratri': { date: new Date('2026-10-07'), endDate: new Date('2026-10-15') },
        'rbi-mpc-meeting': { date: new Date('2026-02-05') }, // First meeting of year
        'bank-fd-rate-revision': { date: new Date('2026-04-01') },
        'health-insurance-renewal': { date: new Date('2026-03-01'), endDate: new Date('2026-03-31') },
        'budget-announcement': { date: new Date('2026-02-01') },
        'quarterly-results': { date: new Date('2026-04-15') },
        'amazon-sale': { date: new Date('2026-10-01'), endDate: new Date('2026-10-05') },
        'flipkart-bbdays': { date: new Date('2026-10-01'), endDate: new Date('2026-10-06') },
    };
    return dates[eventId] || { date: new Date() };
}

/**
 * Event Calendar Service
 */
export class EventCalendarService {
    private static instance: EventCalendarService;
    private events: CalendarEvent[] = [];

    private constructor() {
        this.initializeEvents();
    }

    static getInstance(): EventCalendarService {
        if (!EventCalendarService.instance) {
            EventCalendarService.instance = new EventCalendarService();
        }
        return EventCalendarService.instance;
    }

    private initializeEvents() {
        this.events = CALENDAR_EVENTS.map(event => ({
            ...event,
            ...getEventDates2026(event.id)
        }));
    }

    /**
     * Get all events
     */
    getAllEvents(): CalendarEvent[] {
        return this.events.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    /**
     * Get upcoming events (next N days)
     */
    getUpcomingEvents(days: number = 30): CalendarEvent[] {
        const now = new Date();
        const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        
        return this.events
            .filter(e => e.date >= now && e.date <= cutoff)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    /**
     * Get events by category
     */
    getEventsByCategory(category: EventCategory): CalendarEvent[] {
        return this.events.filter(e => e.category === category);
    }

    /**
     * Get events relevant to article category
     */
    getEventsForArticleCategory(articleCategory: string): CalendarEvent[] {
        return this.events.filter(e => 
            e.articleCategories.includes(articleCategory)
        );
    }

    /**
     * Get content suggestions based on current date
     */
    getContentSuggestions(forCategory?: string): ContentSuggestion[] {
        const now = new Date();
        const suggestions: ContentSuggestion[] = [];

        for (const event of this.events) {
            // Skip if category filter doesn't match
            if (forCategory && !event.articleCategories.includes(forCategory)) {
                continue;
            }

            const daysUntilEvent = Math.ceil(
                (event.date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
            );
            const daysUntilPublishDeadline = daysUntilEvent - event.daysBeforeToPublish;

            // Skip past events
            if (daysUntilEvent < -7) continue;

            // Determine urgency
            let urgency: ContentSuggestion['urgency'];
            if (daysUntilPublishDeadline <= 0) {
                urgency = 'publish_now';
            } else if (daysUntilPublishDeadline <= 7) {
                urgency = 'prepare';
            } else if (daysUntilPublishDeadline <= 30) {
                urgency = 'upcoming';
            } else {
                urgency = 'future';
            }

            // Group by topic to avoid duplicates
            for (const topic of event.suggestedTopics) {
                const relevantCategories = event.articleCategories.filter(cat => 
                    !forCategory || cat === forCategory
                );

                if (relevantCategories.length === 0) continue;

                suggestions.push({
                    event,
                    suggestedTitle: topic,
                    urgency,
                    daysUntilEvent,
                    daysUntilPublishDeadline,
                    articleCategories: relevantCategories,
                    searchIntent: this.determineSearchIntent(topic)
                });
            }
        }

        // Sort by urgency then by days until deadline
        const urgencyOrder = { publish_now: 0, prepare: 1, upcoming: 2, future: 3 };
        return suggestions.sort((a, b) => {
            if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
                return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
            }
            return a.daysUntilPublishDeadline - b.daysUntilPublishDeadline;
        });
    }

    /**
     * Get critical deadlines (events needing immediate content)
     */
    getCriticalDeadlines(): ContentSuggestion[] {
        return this.getContentSuggestions()
            .filter(s => s.urgency === 'publish_now' || s.urgency === 'prepare');
    }

    /**
     * Get current season/theme for homepage
     */
    getCurrentTheme(): {
        theme: string;
        events: CalendarEvent[];
        suggestedFocus: string[];
    } {
        const now = new Date();
        const month = now.getMonth();

        // Determine theme based on month
        let theme: string;
        let suggestedFocus: string[];

        if (month >= 0 && month <= 2) {
            // Jan-Mar: Tax Season
            theme = 'Tax Planning Season';
            suggestedFocus = ['tax-saving', 'ITR-filing', 'ELSS-funds'];
        } else if (month >= 3 && month <= 5) {
            // Apr-Jun: New Financial Year
            theme = 'New Financial Year';
            suggestedFocus = ['SIP-start', 'portfolio-review', 'budget-planning'];
        } else if (month >= 6 && month <= 8) {
            // Jul-Sep: Monsoon/Mid-Year
            theme = 'Mid-Year Review';
            suggestedFocus = ['portfolio-rebalancing', 'monsoon-insurance', 'loan-refinancing'];
        } else {
            // Oct-Dec: Festival Season
            theme = 'Festival & Shopping Season';
            suggestedFocus = ['credit-card-offers', 'gold-investment', 'year-end-planning'];
        }

        const relevantEvents = this.getUpcomingEvents(60);

        return { theme, events: relevantEvents, suggestedFocus };
    }

    /**
     * Determine search intent from topic
     */
    private determineSearchIntent(topic: string): 'informational' | 'commercial' | 'transactional' {
        const lower = topic.toLowerCase();
        
        if (lower.includes('best') || lower.includes('top') || lower.includes('compare')) {
            return 'commercial';
        }
        if (lower.includes('how to') || lower.includes('guide') || lower.includes('what is')) {
            return 'informational';
        }
        if (lower.includes('apply') || lower.includes('buy') || lower.includes('calculator')) {
            return 'transactional';
        }
        
        return 'informational';
    }

    /**
     * Get event-based content schedule for a week
     */
    getWeeklyContentPlan(startDate: Date = new Date()): {
        day: Date;
        suggestions: ContentSuggestion[];
    }[] {
        const plan: { day: Date; suggestions: ContentSuggestion[] }[] = [];
        const allSuggestions = this.getContentSuggestions();

        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);

            // Get suggestions that should be published on or before this day
            const daySuggestions = allSuggestions.filter(s => {
                const publishBy = new Date(s.event.date);
                publishBy.setDate(publishBy.getDate() - s.event.daysBeforeToPublish);
                return publishBy.toDateString() === day.toDateString();
            });

            plan.push({ day, suggestions: daySuggestions });
        }

        return plan;
    }
}

// Export singleton
export const eventCalendar = EventCalendarService.getInstance();
