/**
 * Fact Checker for Financial Content
 * Validates tax rates, calculations, and regulatory information
 */

export interface FactCheckResult {
    passed: boolean;
    confidence: number;
    issues: FactCheckIssue[];
    validations: FactCheckValidation[];
    suggestions: string[];
}

export interface FactCheckIssue {
    type: 'error' | 'warning' | 'info';
    category: 'tax_rate' | 'calculation' | 'regulatory' | 'date' | 'amount';
    message: string;
    location?: string;
}

export interface FactCheckValidation {
    check: string;
    passed: boolean;
    details: string;
}

/**
 * Fact-check article content
 */
export async function factCheckArticle(article: {
    title: string;
    content: string;
    category: string;
}): Promise<FactCheckResult> {
    const issues: FactCheckIssue[] = [];
    const validations: FactCheckValidation[] = [];
    
    // Tax-specific fact-checking
    if (article.category === 'tax-planning' || article.title.toLowerCase().includes('tax')) {
        const taxChecks = await validateTaxInformation(article.content);
        validations.push(...taxChecks.validations);
        issues.push(...taxChecks.issues);
    }
    
    // Financial calculation verification
    const calcChecks = await verifyCalculations(article.content);
    validations.push(...calcChecks.validations);
    issues.push(...calcChecks.issues);
    
    // Date validation
    const dateChecks = validateDates(article.content);
    validations.push(...dateChecks.validations);
    issues.push(...dateChecks.issues);
    
    // Amount validation
    const amountChecks = validateAmounts(article.content);
    validations.push(...amountChecks.validations);
    issues.push(...amountChecks.issues);
    
    // Calculate confidence
    const passed = issues.filter(i => i.type === 'error').length === 0;
    const confidence = calculateConfidence(validations, issues);
    
    // Generate suggestions
    const suggestions = generateFactCheckSuggestions(issues, validations);
    
    return {
        passed,
        confidence,
        issues,
        validations,
        suggestions
    };
}

/**
 * Validate tax information
 */
async function validateTaxInformation(content: string): Promise<{
    validations: FactCheckValidation[];
    issues: FactCheckIssue[];
}> {
    const validations: FactCheckValidation[] = [];
    const issues: FactCheckIssue[] = [];
    
    // FY 2025-26 Tax Slabs (New Regime)
    const newRegimeSlabs = [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 700000, rate: 5 },
        { min: 700000, max: 1000000, rate: 10 },
        { min: 1000000, max: 1200000, rate: 15 },
        { min: 1200000, max: 1500000, rate: 20 },
        { min: 1500000, max: Infinity, rate: 30 }
    ];
    
    // FY 2025-26 Tax Slabs (Old Regime)
    const oldRegimeSlabs = [
        { min: 0, max: 250000, rate: 0 },
        { min: 250000, max: 500000, rate: 5 },
        { min: 500000, max: 1000000, rate: 20 },
        { min: 1000000, max: Infinity, rate: 30 }
    ];
    
    // Check for tax rate mentions
    const taxRatePattern = /(\d+)%\s*tax/gi;
    const matches = content.matchAll(taxRatePattern);
    
    for (const match of matches) {
        const rate = parseInt(match[1]);
        const validRates = [0, 5, 10, 15, 20, 30];
        
        if (validRates.includes(rate)) {
            validations.push({
                check: `Tax rate ${rate}% validation`,
                passed: true,
                details: `${rate}% is a valid tax rate`
            });
        } else {
            issues.push({
                type: 'warning',
                category: 'tax_rate',
                message: `Unusual tax rate: ${rate}%. Verify this is correct.`,
                location: match[0]
            });
        }
    }
    
    // Check for standard deduction
    if (content.includes('standard deduction')) {
        const sdPattern = /₹\s*(\d+,?\d*)\s*standard deduction/i;
        const sdMatch = content.match(sdPattern);
        
        if (sdMatch) {
            const amount = parseInt(sdMatch[1].replace(/,/g, ''));
            const correctSD = 75000; // FY 2025-26 new regime
            const oldSD = 50000; // Old regime
            
            if (amount === correctSD || amount === oldSD) {
                validations.push({
                    check: 'Standard deduction amount',
                    passed: true,
                    details: `₹${amount.toLocaleString()} is correct`
                });
            } else {
                issues.push({
                    type: 'error',
                    category: 'amount',
                    message: `Incorrect standard deduction: ₹${amount.toLocaleString()}. Should be ₹75,000 (new) or ₹50,000 (old)`,
                    location: sdMatch[0]
                });
            }
        }
    }
    
    // Check for 80C limit
    if (content.includes('80C') || content.includes('80c')) {
        const limit80C = 150000;
        const pattern80C = /₹\s*(\d+,?\d*)\s*(?:under|u\/s)?\s*(?:section\s*)?80C/i;
        const match80C = content.match(pattern80C);
        
        if (match80C) {
            const amount = parseInt(match80C[1].replace(/,/g, ''));
            
            if (amount === limit80C) {
                validations.push({
                    check: 'Section 80C limit',
                    passed: true,
                    details: `₹${amount.toLocaleString()} is correct`
                });
            } else {
                issues.push({
                    type: 'error',
                    category: 'amount',
                    message: `Incorrect 80C limit: ₹${amount.toLocaleString()}. Should be ₹1,50,000`,
                    location: match80C[0]
                });
            }
        }
    }
    
    return { validations, issues };
}

/**
 * Verify calculations
 */
async function verifyCalculations(content: string): Promise<{
    validations: FactCheckValidation[];
    issues: FactCheckIssue[];
}> {
    const validations: FactCheckValidation[] = [];
    const issues: FactCheckIssue[] = [];
    
    // Look for simple arithmetic in tables or text
    const calcPattern = /(\d+,?\d*)\s*[-+×x*]\s*(\d+,?\d*)\s*=\s*(\d+,?\d*)/g;
    const matches = content.matchAll(calcPattern);
    
    for (const match of matches) {
        const num1 = parseInt(match[1].replace(/,/g, ''));
        const operator = match[2];
        const num2 = parseInt(match[3].replace(/,/g, ''));
        const result = parseInt(match[4].replace(/,/g, ''));
        
        let expected = 0;
        if (operator === '+') expected = num1 + num2;
        else if (operator === '-') expected = num1 - num2;
        else if (operator === '×' || operator === 'x' || operator === '*') expected = num1 * num2;
        
        if (Math.abs(expected - result) < 10) { // Allow small rounding differences
            validations.push({
                check: `Calculation: ${match[0]}`,
                passed: true,
                details: 'Calculation is correct'
            });
        } else {
            issues.push({
                type: 'error',
                category: 'calculation',
                message: `Incorrect calculation: ${match[0]}. Expected ${expected}`,
                location: match[0]
            });
        }
    }
    
    return { validations, issues };
}

/**
 * Validate dates
 */
function validateDates(content: string): {
    validations: FactCheckValidation[];
    issues: FactCheckIssue[];
} {
    const validations: FactCheckValidation[] = [];
    const issues: FactCheckIssue[] = [];
    
    const currentYear = new Date().getFullYear();
    
    // Check for outdated years
    const yearPattern = /\b(20\d{2})\b/g;
    const years = content.matchAll(yearPattern);
    
    for (const match of years) {
        const year = parseInt(match[1]);
        
        if (year < currentYear - 2) {
            issues.push({
                type: 'warning',
                category: 'date',
                message: `Content mentions ${year}, which may be outdated`,
                location: match[0]
            });
        } else if (year >= currentYear && year <= currentYear + 1) {
            validations.push({
                check: `Year ${year} validation`,
                passed: true,
                details: 'Date is current'
            });
        }
    }
    
    return { validations, issues };
}

/**
 * Validate amounts
 */
function validateAmounts(content: string): {
    validations: FactCheckValidation[];
    issues: FactCheckIssue[];
} {
    const validations: FactCheckValidation[] = [];
    const issues: FactCheckIssue[] = [];
    
    // Check for unrealistic amounts
    const amountPattern = /₹\s*(\d+,?\d*(?:\.\d+)?)\s*(lakh|crore|thousand)?/gi;
    const amounts = content.matchAll(amountPattern);
    
    for (const match of amounts) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        const unit = match[2]?.toLowerCase();
        
        let actualAmount = amount;
        if (unit === 'lakh') actualAmount = amount * 100000;
        else if (unit === 'crore') actualAmount = amount * 10000000;
        else if (unit === 'thousand') actualAmount = amount * 1000;
        
        // Flag unrealistic amounts
        if (actualAmount > 100000000000) { // > 1000 crore
            issues.push({
                type: 'warning',
                category: 'amount',
                message: `Very large amount: ₹${amount} ${unit || ''}. Verify this is correct.`,
                location: match[0]
            });
        }
        
        validations.push({
            check: `Amount validation: ${match[0]}`,
            passed: true,
            details: 'Amount format is valid'
        });
    }
    
    return { validations, issues };
}

/**
 * Calculate confidence score
 */
function calculateConfidence(validations: FactCheckValidation[], issues: FactCheckIssue[]): number {
    const totalChecks = validations.length;
    const passedChecks = validations.filter(v => v.passed).length;
    const errors = issues.filter(i => i.type === 'error').length;
    const warnings = issues.filter(i => i.type === 'warning').length;
    
    if (totalChecks === 0) return 50; // No checks performed
    
    let confidence = (passedChecks / totalChecks) * 100;
    
    // Reduce confidence for issues
    confidence -= errors * 15;
    confidence -= warnings * 5;
    
    return Math.max(0, Math.min(100, confidence));
}

/**
 * Generate suggestions
 */
function generateFactCheckSuggestions(issues: FactCheckIssue[], validations: FactCheckValidation[]): string[] {
    const suggestions: string[] = [];
    
    const errors = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');
    
    if (errors.length > 0) {
        suggestions.push(`Fix ${errors.length} critical error(s) before publishing`);
    }
    
    if (warnings.length > 0) {
        suggestions.push(`Review ${warnings.length} warning(s) for accuracy`);
    }
    
    if (errors.length === 0 && warnings.length === 0) {
        suggestions.push('✅ All fact-checks passed! Content appears accurate.');
    }
    
    // Specific suggestions
    const taxIssues = issues.filter(i => i.category === 'tax_rate');
    if (taxIssues.length > 0) {
        suggestions.push('Verify tax rates against latest Income Tax Act');
    }
    
    const calcIssues = issues.filter(i => i.category === 'calculation');
    if (calcIssues.length > 0) {
        suggestions.push('Double-check all calculations for accuracy');
    }
    
    return suggestions;
}
