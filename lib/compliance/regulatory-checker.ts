/**
 * Regulatory Compliance Checker
 * 
 * Validates content against SEBI, IRDA, and other financial regulations
 * Prevents publishing non-compliant financial advice
 */

import { logger } from '@/lib/logger';

export interface ComplianceCheckResult {
    isCompliant: boolean;
    complianceScore: number; // 0-100
    violations: ComplianceViolation[];
    warnings: ComplianceWarning[];
    recommendations: string[];
}

export interface ComplianceViolation {
    type: 'sebi' | 'irda' | 'rbi' | 'advertising' | 'disclosure';
    severity: 'critical' | 'warning';
    rule: string;
    message: string;
    location?: string; // Field or section where violation occurs
    suggestedFix: string;
}

export interface ComplianceWarning {
    type: 'unsourced_claim' | 'missing_disclosure' | 'promotional_language' | 'outdated_regulation';
    message: string;
    field?: string;
}

/**
 * Regulatory rules and guidelines
 */
const COMPLIANCE_RULES = {
    sebi: {
        forbiddenPhrases: [
            /guaranteed returns/i,
            /risk-free/i,
            /100% safe/i,
            /cannot lose money/i,
            /government backed.*guarantee/i,
        ],
        requiredDisclosures: [
            /mutual fund.*risk/i,
            /market.*risk/i,
            /past performance.*not guarantee/i,
        ],
    },
    irda: {
        forbiddenPhrases: [
            /guaranteed.*premium/i,
            /no medical check/i,
            /instant approval.*insurance/i,
        ],
        requiredDisclosures: [
            /terms and conditions/i,
            /policy document/i,
            /exclusions.*apply/i,
        ],
    },
    rbi: {
        forbiddenPhrases: [
            /guaranteed.*interest/i,
            /no risk.*deposit/i,
        ],
        requiredDisclosures: [
            /as per rbi guidelines/i,
            /rbi.*regulated/i,
        ],
    },
    advertising: {
        forbiddenPhrases: [
            /best.*guaranteed/i,
            /number one/i,
            /top.*without verification/i,
        ],
        requiredDisclosures: [
            /terms.*apply/i,
            /subject to approval/i,
            /as per.*terms/i,
        ],
    },
};

/**
 * Check content compliance with financial regulations
 */
export async function checkCompliance(
    content: string,
    metadata?: {
        category?: string;
        title?: string;
        isPromotional?: boolean;
        targetAudience?: string;
    }
): Promise<ComplianceCheckResult> {
    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceWarning[] = [];
    const recommendations: string[] = [];

    try {
        // 1. Check SEBI compliance (for investment-related content)
        if (metadata?.category === 'mutual-funds' || metadata?.category === 'stocks') {
            const sebiCheck = checkSEBICompliance(content);
            violations.push(...sebiCheck.violations);
            warnings.push(...sebiCheck.warnings);
            recommendations.push(...sebiCheck.recommendations);
        }

        // 2. Check IRDA compliance (for insurance-related content)
        if (metadata?.category === 'insurance') {
            const irdaCheck = checkIRDACompliance(content);
            violations.push(...irdaCheck.violations);
            warnings.push(...irdaCheck.warnings);
            recommendations.push(...irdaCheck.recommendations);
        }

        // 3. Check RBI compliance (for banking/credit-related content)
        if (metadata?.category === 'credit-cards' || metadata?.category === 'loans') {
            const rbiCheck = checkRBICompliance(content);
            violations.push(...rbiCheck.violations);
            warnings.push(...rbiCheck.warnings);
            recommendations.push(...rbiCheck.recommendations);
        }

        // 4. Check advertising compliance (for all promotional content)
        if (metadata?.isPromotional || content.toLowerCase().includes('apply now')) {
            const adCheck = checkAdvertisingCompliance(content);
            violations.push(...adCheck.violations);
            warnings.push(...adCheck.warnings);
            recommendations.push(...adCheck.recommendations);
        }

        // 5. Check for required disclosures
        const disclosureCheck = checkRequiredDisclosures(content, metadata?.category);
        violations.push(...disclosureCheck.violations);
        warnings.push(...disclosureCheck.warnings);

        // 6. Check for unsourced claims
        const claimCheck = checkUnsourcedClaims(content);
        warnings.push(...claimCheck.warnings);

        // 7. AI-Powered Regulatory Scan (Nuance detection)
        const aiScan = await aiRegulatoryScan(content, metadata?.category, metadata?.title);
        violations.push(...aiScan.violations);
        warnings.push(...aiScan.warnings);
        recommendations.push(...aiScan.recommendations);

        // Calculate compliance score
        const criticalViolations = violations.filter(v => v.severity === 'critical').length;
        const warningViolations = violations.filter(v => v.severity === 'warning').length;
        
        let complianceScore = 100;
        complianceScore -= criticalViolations * 30; // -30 per critical violation
        complianceScore -= warningViolations * 10; // -10 per warning violation
        complianceScore -= warnings.length * 5; // -5 per warning
        complianceScore = Math.max(0, Math.min(100, complianceScore));

        const isCompliant = criticalViolations === 0 && complianceScore >= 70;

        return {
            isCompliant,
            complianceScore,
            violations,
            warnings,
            recommendations
        };

    } catch (error) {
        logger.error('Compliance check failed', error as Error);
        // Fail safe: return non-compliant if check fails
        return {
            isCompliant: false,
            complianceScore: 0,
            violations: [{
                type: 'sebi',
                severity: 'critical',
                rule: 'system_error',
                message: 'Compliance checking system error - manual review required',
                suggestedFix: 'Review content manually for compliance'
            }],
            warnings: [],
            recommendations: []
        };
    }
}

/**
 * Check SEBI compliance (mutual funds, stocks)
 */
function checkSEBICompliance(content: string): {
    violations: ComplianceViolation[];
    warnings: ComplianceWarning[];
    recommendations: string[];
} {
    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceWarning[] = [];
    const recommendations: string[] = [];

    const rules = COMPLIANCE_RULES.sebi;

    // Check for forbidden phrases
    rules.forbiddenPhrases.forEach(pattern => {
        if (pattern.test(content)) {
            violations.push({
                type: 'sebi',
                severity: 'critical',
                rule: 'forbidden_phrase',
                message: `Content contains forbidden phrase: "${content.match(pattern)?.[0]}". SEBI prohibits guarantees and misleading claims.`,
                suggestedFix: 'Remove guarantee language or replace with "historical performance" or "potential returns"'
            });
        }
    });

    // Check for required disclosures
    const hasRiskDisclosure = /risk|market risk|investment risk/i.test(content);
    if (!hasRiskDisclosure && /mutual fund|stock|investment/i.test(content)) {
        violations.push({
            type: 'sebi',
            severity: 'warning',
            rule: 'missing_risk_disclosure',
            message: 'SEBI requires risk disclosures for investment-related content',
            suggestedFix: 'Add disclaimer: "Mutual fund investments are subject to market risks. Past performance does not guarantee future returns."'
        });
    }

    // Check for past performance disclaimer
    if (/returns|performance|yield/i.test(content) && !/past performance.*not guarantee/i.test(content)) {
        warnings.push({
            type: 'missing_disclosure',
            message: 'Consider adding disclaimer about past performance not guaranteeing future returns'
        });
        recommendations.push('Add SEBI-mandated disclaimer about past performance');
    }

    return { violations, warnings, recommendations };
}

/**
 * Check IRDA compliance (insurance)
 */
function checkIRDACompliance(content: string): {
    violations: ComplianceViolation[];
    warnings: ComplianceWarning[];
    recommendations: string[];
} {
    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceWarning[] = [];
    const recommendations: string[] = [];

    const rules = COMPLIANCE_RULES.irda;

    // Check for forbidden phrases
    rules.forbiddenPhrases.forEach(pattern => {
        if (pattern.test(content)) {
            violations.push({
                type: 'irda',
                severity: 'critical',
                rule: 'forbidden_phrase',
                message: `Content contains forbidden phrase: "${content.match(pattern)?.[0]}". IRDA prohibits misleading insurance claims.`,
                suggestedFix: 'Remove misleading language and ensure accuracy of claims'
            });
        }
    });

    // Check for terms and conditions disclosure
    if (/insurance|policy|premium/i.test(content) && !/terms|conditions|policy document/i.test(content)) {
        warnings.push({
            type: 'missing_disclosure',
            message: 'Consider mentioning that terms and conditions apply as per policy document'
        });
    }

    return { violations, warnings, recommendations };
}

/**
 * Check RBI compliance (banking, credit)
 */
function checkRBICompliance(content: string): {
    violations: ComplianceViolation[];
    warnings: ComplianceWarning[];
    recommendations: string[];
} {
    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceWarning[] = [];
    const recommendations: string[] = [];

    const rules = COMPLIANCE_RULES.rbi;

    // Check for forbidden phrases
    rules.forbiddenPhrases.forEach(pattern => {
        if (pattern.test(content)) {
            violations.push({
                type: 'rbi',
                severity: 'critical',
                rule: 'forbidden_phrase',
                message: `Content contains forbidden phrase: "${content.match(pattern)?.[0]}". RBI prohibits misleading banking claims.`,
                suggestedFix: 'Remove guarantee language and ensure compliance with RBI guidelines'
            });
        }
    });

    return { violations, warnings, recommendations };
}

/**
 * Check advertising compliance (all promotional content)
 */
function checkAdvertisingCompliance(content: string): {
    violations: ComplianceViolation[];
    warnings: ComplianceWarning[];
    recommendations: string[];
} {
    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceWarning[] = [];
    const recommendations: string[] = [];

    const rules = COMPLIANCE_RULES.advertising;

    // Check for superlatives without substantiation
    if (/best|number one|top/i.test(content) && !/based on|according to|as per/i.test(content)) {
        warnings.push({
            type: 'unsourced_claim',
            message: 'Superlative claims should be substantiated with data or sources'
        });
    }

    // Check for required disclosures
    if (/apply|click|sign up/i.test(content) && !/terms.*apply|subject to|conditions/i.test(content)) {
        warnings.push({
            type: 'missing_disclosure',
            message: 'Promotional content should mention that terms and conditions apply'
        });
    }

    return { violations, warnings, recommendations };
}

/**
 * Check for required disclosures based on content type
 */
function checkRequiredDisclosures(
    content: string,
    category?: string
): { violations: ComplianceViolation[]; warnings: ComplianceWarning[] } {
    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceWarning[] = [];

    // Affiliate disclosure (required when affiliate links present)
    if (/apply now|click here|affiliate/i.test(content.toLowerCase()) && !/disclosure|affiliate|commission/i.test(content.toLowerCase())) {
        violations.push({
            type: 'disclosure',
            severity: 'critical',
            rule: 'affiliate_disclosure',
            message: 'Content contains affiliate links but no disclosure. FTC/SEBI requires clear disclosure of affiliate relationships.',
            suggestedFix: 'Add disclosure: "We may receive a commission if you apply through our links. This does not affect our recommendations."'
        });
    }

    // Risk disclosure for investments
    if (category === 'mutual-funds' && !/risk|market risk/i.test(content)) {
        warnings.push({
            type: 'missing_disclosure',
            message: 'Investment content should include risk disclosure'
        });
    }

    return { violations, warnings };
}

/**
 * Check for unsourced claims
 */
function checkUnsourcedClaims(content: string): { warnings: ComplianceWarning[] } {
    const warnings: ComplianceWarning[] = [];

    // Check for claims without sources
    const claimsPatterns = [
        /studies show/i,
        /research indicates/i,
        /according to experts/i,
        /industry data/i,
    ];

    claimsPatterns.forEach(pattern => {
        if (pattern.test(content) && !/source|citation|reference|link/i.test(content)) {
            warnings.push({
                type: 'unsourced_claim',
                message: `Claim "${content.match(pattern)?.[0]}" should be supported with a source or citation`
            });
        }
    });

    return { warnings };
}

/**
 * AI-Powered Regulatory Scan (GPT-4o)
 * 
 * Scans content for subtle compliance violations, aggressive marketing, 
 * or implicit guarantees that rules might miss.
 */
async function aiRegulatoryScan(
    content: string,
    category?: string,
    title?: string
): Promise<{ violations: ComplianceViolation[]; warnings: ComplianceWarning[]; recommendations: string[] }> {
    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceWarning[] = [];
    const recommendations: string[] = [];

    try {
        const { api } = await import('@/lib/api');
        
        const prompt = `You are a professional Financial Compliance Officer in India. 
        Your task is to scan the following content for violations of SEBI, RBI, IRDA, and Advertising Standards Council of India (ASCI) guidelines.

        CONTENT OVERVIEW:
        Title: ${title || 'N/A'}
        Category: ${category || 'General Finance'}
        
        CONTENT TO SCAN:
        """
        ${content.substring(0, 5000)}
        """

        SPECIFIC CHECKS:
        1. SEBI: Are there guaranteed returns? Is there a risk disclosure?
        2. RBI: Is it clear that deposits/loans are subject to terms?
        3. ASCI: Is the language overly aggressive (e.g., "Best in class", "India's highest") without substantiation?
        4. Disclosures: Are affiliate links disclosed? Are disclaimers visible?

        FORMAT YOUR RESPONSE AS JSON:
        {
          "violations": [
            { "type": "sebi" | "rbi" | "irda" | "advertising" | "disclosure", "severity": "critical" | "warning", "rule": "string", "message": "string", "suggestedFix": "string" }
          ],
          "warnings": [
            { "type": "promotional_language" | "missing_disclosure" | "unsourced_claim", "message": "string" }
          ],
          "recommendations": ["string"]
        }`;

        const result = await api.integrations.Core.InvokeLLM({
            prompt,
            operation: 'regulatory_compliance_scan',
            contextData: { category, title }
        });

        const { extractJSON } = await import('@/lib/utils/json');
        const parsed = extractJSON(result.content);

        if (parsed) {
            if (parsed.violations && Array.isArray(parsed.violations)) {
                violations.push(...parsed.violations);
            }
            if (parsed.warnings && Array.isArray(parsed.warnings)) {
                warnings.push(...parsed.warnings);
            }
            if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
                recommendations.push(...parsed.recommendations);
            }
        }
    } catch (error) {
        logger.warn('AI regulatory scan failed', error as Error);
    }

    return { violations, warnings, recommendations };
}

/**
 * Format compliance result for display
 */
export function formatComplianceResult(result: ComplianceCheckResult): string {
    if (result.isCompliant && result.violations.length === 0) {
        return `✅ Compliance check passed (Score: ${result.complianceScore}/100)`;
    }

    const criticalViolations = result.violations.filter(v => v.severity === 'critical');
    const warnings = result.warnings.length;

    if (criticalViolations.length > 0) {
        return `❌ Compliance check failed: ${criticalViolations.length} critical violation(s), ${warnings} warning(s)`;
    }

    return `⚠️ Compliance check passed with warnings: ${warnings} warning(s) (Score: ${result.complianceScore}/100)`;
}
