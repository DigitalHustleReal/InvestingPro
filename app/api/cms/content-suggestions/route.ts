/**
 * Content Suggestions API
 * 
 * Returns event-based content suggestions for the CMS.
 */

import { NextResponse } from 'next/server';
import { eventCalendar, ContentSuggestion } from '@/lib/cms/event-calendar';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || undefined;
        const urgencyFilter = searchParams.get('urgency'); // publish_now, prepare, upcoming, future
        const limit = parseInt(searchParams.get('limit') || '20');

        // Get content suggestions
        let suggestions = eventCalendar.getContentSuggestions(category);

        // Filter by urgency if specified
        if (urgencyFilter) {
            suggestions = suggestions.filter(s => s.urgency === urgencyFilter);
        }

        // Limit results
        suggestions = suggestions.slice(0, limit);

        // Get current theme
        const theme = eventCalendar.getCurrentTheme();

        // Get critical deadlines
        const criticalDeadlines = eventCalendar.getCriticalDeadlines().slice(0, 5);

        // Get weekly plan
        const weeklyPlan = eventCalendar.getWeeklyContentPlan();

        return NextResponse.json({
            success: true,
            data: {
                currentTheme: theme,
                criticalDeadlines,
                suggestions,
                weeklyPlan: weeklyPlan.map(day => ({
                    date: day.day.toISOString(),
                    dayName: day.day.toLocaleDateString('en-IN', { weekday: 'short' }),
                    suggestionsCount: day.suggestions.length,
                    suggestions: day.suggestions.slice(0, 3) // Top 3 per day
                })),
                upcomingEvents: eventCalendar.getUpcomingEvents(60).map(e => ({
                    id: e.id,
                    name: e.name,
                    date: e.date.toISOString(),
                    category: e.category,
                    priority: e.contentPriority,
                    daysBeforeToPublish: e.daysBeforeToPublish
                }))
            }
        });
    } catch (error) {
        console.error('Content suggestions error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get content suggestions' },
            { status: 500 }
        );
    }
}
