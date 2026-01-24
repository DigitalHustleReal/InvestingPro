/**
 * Unit Test: Revenue Service
 * 
 * Verifies revenue calculations, aggregations, and trends using mocked Supabase client.
 * Tests RevenueService class in isolation.
 */

import { RevenueService } from '@/lib/services/revenue-service';

// Mock Supabase client builder
const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    then: jest.fn(), // For await support
};

const mockSupabase = {
    from: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('RevenueService', () => {
    let service: RevenueService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new RevenueService(mockSupabase);
        
        // Default happy path for queries
        // We need to mock the promise resolution for the chain
        mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: [], error: null }));
    });

    it('should calculate total revenue limits correctly', async () => {
        // Setup specific mocks for sequential calls
        // 1. Current Month Revenue
        const currentRevData = [{ commission_earned: 100 }, { commission_earned: 200 }];
        // 2. Previous Month Revenue
        const prevRevData = [{ commission_earned: 100 }];
        // 3. Category Data
        const categoryData = [{ product_type: 'credit_card', commission_earned: 100 }];
        // 4. Conversion Data
        const conversionData = [{ converted: true }];
        // 5. Daily Data (30 calls)
        const dailyData = [{ commission_earned: 10 }];
        // 6. Weekly Data (12 calls)
        const weeklyData = [{ commission_earned: 70 }];
        // 7. Monthly Data (12 calls)
        const monthlyData = [{ commission_earned: 300 }];

        // Helper to mock sequential returns
        let callCount = 0;
        mockQueryBuilder.then.mockImplementation((resolve) => {
            callCount++;
            if (callCount === 1) resolve({ data: currentRevData, error: null });
            else if (callCount === 2) resolve({ data: prevRevData, error: null });
            else if (callCount === 3) resolve({ data: categoryData, error: null });
            else if (callCount === 4) resolve({ data: conversionData, error: null });
            else if (callCount <= 34) resolve({ data: dailyData, error: null }); // Daily loop
            else if (callCount <= 46) resolve({ data: weeklyData, error: null }); // Weekly loop
            else resolve({ data: monthlyData, error: null }); // Monthly loop
        });

        const metrics = await service.getDashboardMetrics();

        expect(metrics.totalRevenue.current).toBe(300); // 100 + 200
        expect(metrics.totalRevenue.previous).toBe(100);
        expect(metrics.totalRevenue.growth).toBe(200); // (300-100)/100 * 100
        expect(metrics.revenueByCategory.creditCards).toBe(100);
    });

    it('should zero out metrics when data is missing', async () => {
        // All calls return null/empty
        mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: null, error: null }));

        const metrics = await service.getDashboardMetrics();

        expect(metrics.totalRevenue.current).toBe(0);
        expect(metrics.totalRevenue.previous).toBe(0);
        expect(metrics.totalRevenue.growth).toBe(0);
        expect(metrics.conversionRates.overall).toBe(0);
    });
});
