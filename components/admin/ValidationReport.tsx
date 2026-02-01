"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, AlertTriangle, RefreshCw, Shield, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ValidationReportProps {
    articleId: string;
    title?: string;
    content?: string;
    category?: string;
}

interface FactCheckError {
    type: string;
    field: string;
    message: string;
    severity: 'critical' | 'warning';
    suggestedFix?: string;
}

interface FactCheckWarning {
    type: string;
    message: string;
    field?: string;
}

interface ComplianceViolation {
    type: string;
    severity: 'critical' | 'warning';
    rule: string;
    message: string;
    location?: string;
    suggestedFix: string;
}

interface ValidationResult {
    factCheck?: {
        isValid: boolean;
        confidence: number;
        errors: FactCheckError[];
        warnings: FactCheckWarning[];
        validatedFacts: any[];
    };
    compliance?: {
        isCompliant: boolean;
        complianceScore: number;
        violations: ComplianceViolation[];
        warnings: ComplianceWarning[];
        recommendations: string[];
    };
}

interface ComplianceWarning {
    type: string;
    message: string;
    field?: string;
}

/**
 * Validation Report Component
 * 
 * Shows fact-check and compliance validation results:
 * - Fact-check errors and warnings
 * - Compliance violations
 * - Validated facts
 * - Recommendations
 */
export default function ValidationReport({
    articleId,
    title,
    content,
    category
}: ValidationReportProps) {
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [validating, setValidating] = useState(false);
    const [lastValidated, setLastValidated] = useState<string | null>(null);

    const runValidation = async () => {
        if (!content) {
            toast.warning('No content to validate');
            return;
        }

        setValidating(true);
        try {
            // Run fact-check
            const factCheckResponse = await fetch('/api/admin/articles/validate/fact-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    title,
                    category
                })
            });

            // Run compliance check
            const complianceResponse = await fetch('/api/admin/articles/validate/compliance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    category
                })
            });

            const factCheckData = factCheckResponse.ok ? await factCheckResponse.json() : null;
            const complianceData = complianceResponse.ok ? await complianceResponse.json() : null;

            setValidationResult({
                factCheck: factCheckData,
                compliance: complianceData
            });

            setLastValidated(new Date().toISOString());

            // Show summary toast
            const factErrors = factCheckData?.errors?.filter((e: FactCheckError) => e.severity === 'critical').length || 0;
            const complianceViolations = complianceData?.violations?.filter((v: ComplianceViolation) => v.severity === 'critical').length || 0;

            if (factErrors === 0 && complianceViolations === 0) {
                toast.success('Validation passed! No critical issues found.');
            } else {
                toast.warning(`Found ${factErrors + complianceViolations} critical issue(s) that need attention.`);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to validate content');
        } finally {
            setValidating(false);
        }
    };

    const factCheck = validationResult?.factCheck;
    const compliance = validationResult?.compliance;

    const criticalFactErrors = factCheck?.errors?.filter(e => e.severity === 'critical') || [];
    const criticalViolations = compliance?.violations?.filter(v => v.severity === 'critical') || [];
    const hasCriticalIssues = criticalFactErrors.length > 0 || criticalViolations.length > 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-wt-text-muted dark:text-wt-text-muted uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Content Validation
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={runValidation}
                    disabled={validating || !content}
                    className="h-7 text-xs"
                >
                    <RefreshCw className={`w-3 h-3 mr-1 ${validating ? 'animate-spin' : ''}`} />
                    Validate
                </Button>
            </div>

            {lastValidated && (
                <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted dark:text-wt-text-muted">
                    Last validated: {new Date(lastValidated).toLocaleString('en-IN')}
                </p>
            )}

            {!validationResult && (
                <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted dark:text-wt-text-muted">
                    Click "Validate" to check content for fact-check and compliance issues.
                </p>
            )}

            {validationResult && (
                <div className="space-y-4">
                    {/* Summary */}
                    {!hasCriticalIssues ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                                    Content Validated Successfully
                                </p>
                            </div>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                                No critical fact-check or compliance issues found. Content is ready for review.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                                    Critical Issues Found
                                </p>
                            </div>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                                {criticalFactErrors.length + criticalViolations.length} critical issue(s) must be fixed before publishing.
                            </p>
                        </div>
                    )}

                    {/* Fact-Check Results */}
                    {factCheck && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold text-wt-text dark:text-wt-text/80 dark:text-wt-text/80 flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" />
                                    Fact-Check
                                </h4>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                            factCheck.isValid
                                                ? 'border-green-300 text-green-700'
                                                : 'border-red-300 text-red-700'
                                        }`}
                                    >
                                        {factCheck.confidence}% confidence
                                    </Badge>
                                    {!factCheck.isValid && (
                                        <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                                            {criticalFactErrors.length} critical
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {factCheck.errors && factCheck.errors.length > 0 && (
                                <div className="space-y-2">
                                    {factCheck.errors.map((error, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border ${
                                                error.severity === 'critical'
                                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                                    : 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800'
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {error.severity === 'critical' ? (
                                                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-warning-600 dark:text-warning-400 mt-0.5" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${
                                                                error.severity === 'critical'
                                                                    ? 'border-red-300 text-red-700'
                                                                    : 'border-warning-300 text-warning-700'
                                                            }`}
                                                        >
                                                            {error.type.replace('_', ' ')}
                                                        </Badge>
                                                        {error.field && (
                                                            <span className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted dark:text-wt-text-muted">
                                                                Field: {error.field}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-semibold text-wt-text dark:text-wt-text/95 dark:text-wt-text/95">
                                                        {error.message}
                                                    </p>
                                                    {error.suggestedFix && (
                                                        <p className="text-xs text-wt-gold dark:text-wt-gold mt-1">
                                                            💡 {error.suggestedFix}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {factCheck.warnings && factCheck.warnings.length > 0 && (
                                <div className="space-y-1">
                                    {factCheck.warnings.map((warning, index) => (
                                        <div
                                            key={index}
                                            className="p-2 rounded bg-wt-surface-hover dark:bg-wt-card dark:bg-wt-card border border-wt-border dark:border-wt-border dark:border-wt-border"
                                        >
                                            <p className="text-xs text-wt-text-muted/50 dark:text-wt-text-muted/50 dark:text-wt-text-muted dark:text-wt-text-muted">
                                                ⚠️ {warning.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Compliance Results */}
                    {compliance && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold text-wt-text dark:text-wt-text/80 dark:text-wt-text/80 flex items-center gap-2">
                                    <Shield className="w-3.5 h-3.5" />
                                    Regulatory Compliance
                                </h4>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                            compliance.isCompliant
                                                ? 'border-green-300 text-green-700'
                                                : 'border-red-300 text-red-700'
                                        }`}
                                    >
                                        {compliance.complianceScore}% compliant
                                    </Badge>
                                    {!compliance.isCompliant && (
                                        <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                                            {criticalViolations.length} critical
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {compliance.violations && compliance.violations.length > 0 && (
                                <div className="space-y-2">
                                    {compliance.violations.map((violation, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border ${
                                                violation.severity === 'critical'
                                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                                    : 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800'
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {violation.severity === 'critical' ? (
                                                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-warning-600 dark:text-warning-400 mt-0.5" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs uppercase ${
                                                                violation.severity === 'critical'
                                                                    ? 'border-red-300 text-red-700'
                                                                    : 'border-warning-300 text-warning-700'
                                                            }`}
                                                        >
                                                            {violation.type}
                                                        </Badge>
                                                        <span className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted dark:text-wt-text-muted">
                                                            Rule: {violation.rule}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-wt-text dark:text-wt-text/95 dark:text-wt-text/95">
                                                        {violation.message}
                                                    </p>
                                                    {violation.location && (
                                                        <p className="text-xs text-wt-text-muted/70 dark:text-wt-text-muted/70 dark:text-wt-text-muted dark:text-wt-text-muted mt-1">
                                                            Location: {violation.location}
                                                        </p>
                                                    )}
                                                    {violation.suggestedFix && (
                                                        <p className="text-xs text-wt-gold dark:text-wt-gold mt-1">
                                                            💡 {violation.suggestedFix}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {compliance.recommendations && compliance.recommendations.length > 0 && (
                                <div className="p-3 rounded-lg bg-wt-gold-subtle bg-wt-gold-subtle border border-wt-border-light border-wt-border">
                                    <p className="text-xs font-semibold text-wt-text text-wt-text mb-2">
                                        Recommendations:
                                    </p>
                                    <ul className="space-y-1">
                                        {compliance.recommendations.map((rec, index) => (
                                            <li key={index} className="text-xs text-wt-gold text-wt-text-muted">
                                                • {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {factCheck?.validatedFacts && factCheck.validatedFacts.length > 0 && (
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-2">
                                Validated Facts ({factCheck.validatedFacts.length}):
                            </p>
                            <ul className="space-y-1">
                                {factCheck.validatedFacts.slice(0, 3).map((fact: any, index) => (
                                    <li key={index} className="text-xs text-green-700 dark:text-green-300">
                                        ✓ {fact.fact}
                                        {fact.source && (
                                            <span className="text-green-600 dark:text-green-400 ml-1">
                                                ({fact.source})
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
