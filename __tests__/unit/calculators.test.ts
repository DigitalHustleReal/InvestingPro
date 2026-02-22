/**
 * Unit Tests: Financial Calculator Math
 *
 * These tests validate the pure math functions in lib/calculators/math.ts.
 * No React, no DOM, no network — pure JS arithmetic.
 */

import {
  calculateSIP,
  calculateEMI,
  calculatePPF,
  calculateFD,
} from '@/lib/calculators/math';

// ─── SIP ────────────────────────────────────────────────────────────────────

describe('calculateSIP', () => {
  it('returns correct maturity value for standard inputs', () => {
    // ₹5,000/month × 12% p.a. × 10 years ≈ ₹11,61,695
    const result = calculateSIP(5000, 12, 10);
    expect(result.futureValue).toBeGreaterThan(11_00_000);
    expect(result.futureValue).toBeLessThan(12_00_000);
  });

  it('totalInvested = monthlyInvestment × months', () => {
    const result = calculateSIP(10_000, 12, 5);
    expect(result.totalInvested).toBe(10_000 * 5 * 12); // 6,00,000
  });

  it('returns > invested for positive returns', () => {
    const result = calculateSIP(5000, 12, 10);
    expect(result.futureValue).toBeGreaterThan(result.totalInvested);
    expect(result.returns).toBeGreaterThan(0);
  });

  it('returns === futureValue - totalInvested', () => {
    const result = calculateSIP(5000, 12, 10);
    // Allow ±1 for rounding
    expect(Math.abs(result.returns - (result.futureValue - result.totalInvested))).toBeLessThanOrEqual(1);
  });

  it('higher return rate gives higher future value', () => {
    const low  = calculateSIP(5000, 8,  10);
    const high = calculateSIP(5000, 15, 10);
    expect(high.futureValue).toBeGreaterThan(low.futureValue);
  });

  it('longer duration gives higher future value', () => {
    const short = calculateSIP(5000, 12, 5);
    const long  = calculateSIP(5000, 12, 20);
    expect(long.futureValue).toBeGreaterThan(short.futureValue);
  });

  it('handles minimum investment of ₹500', () => {
    const result = calculateSIP(500, 12, 1);
    expect(result.futureValue).toBeGreaterThan(0);
    expect(result.totalInvested).toBe(6000);
  });
});

// ─── EMI ────────────────────────────────────────────────────────────────────

describe('calculateEMI', () => {
  it('returns correct EMI for a ₹10L loan at 10% for 5 years', () => {
    // Standard PMT check: ≈ ₹21,247
    const { emi } = calculateEMI(10_00_000, 10, 60);
    expect(emi).toBeGreaterThan(21_000);
    expect(emi).toBeLessThan(22_000);
  });

  it('totalPayment = emi × tenure', () => {
    const result = calculateEMI(10_00_000, 10, 60);
    expect(Math.abs(result.totalPayment - result.emi * 60)).toBeLessThanOrEqual(60); // rounding
  });

  it('totalInterest > 0 for non-zero rate', () => {
    const result = calculateEMI(5_00_000, 12, 36);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('totalInterest = totalPayment - principal', () => {
    const result = calculateEMI(5_00_000, 12, 36);
    expect(Math.abs(result.totalInterest - (result.totalPayment - 5_00_000))).toBeLessThanOrEqual(1);
  });

  it('higher rate → higher EMI', () => {
    const low  = calculateEMI(10_00_000, 8,  60);
    const high = calculateEMI(10_00_000, 14, 60);
    expect(high.emi).toBeGreaterThan(low.emi);
  });

  it('longer tenure → lower EMI but more total interest', () => {
    const short = calculateEMI(10_00_000, 10, 36);
    const long  = calculateEMI(10_00_000, 10, 120);
    expect(long.emi).toBeLessThan(short.emi);
    expect(long.totalInterest).toBeGreaterThan(short.totalInterest);
  });
});

// ─── PPF ────────────────────────────────────────────────────────────────────

describe('calculatePPF', () => {
  it('returns correct maturity for ₹1.5L/year at 7.1% for 15 years', () => {
    // Known result: ≈ ₹40.7 L
    const result = calculatePPF(1_50_000, 7.1, 15);
    expect(result.maturityAmount).toBeGreaterThan(40_00_000);
    expect(result.maturityAmount).toBeLessThan(42_00_000);
  });

  it('totalInvested = annualInvestment × years', () => {
    const result = calculatePPF(1_00_000, 7.1, 15);
    expect(result.totalInvested).toBe(15_00_000);
  });

  it('maturityAmount > totalInvested', () => {
    const result = calculatePPF(1_50_000, 7.1, 15);
    expect(result.maturityAmount).toBeGreaterThan(result.totalInvested);
  });

  it('totalInterest = maturityAmount - totalInvested', () => {
    const result = calculatePPF(1_50_000, 7.1, 15);
    expect(Math.abs(result.totalInterest - (result.maturityAmount - result.totalInvested))).toBeLessThanOrEqual(1);
  });

  it('extended tenure gives higher corpus', () => {
    const base    = calculatePPF(1_50_000, 7.1, 15);
    const extended = calculatePPF(1_50_000, 7.1, 20);
    expect(extended.maturityAmount).toBeGreaterThan(base.maturityAmount);
  });
});

// ─── FD ─────────────────────────────────────────────────────────────────────

describe('calculateFD', () => {
  it('returns correct maturity for ₹1L at 7% for 5 years (quarterly)', () => {
    // A = 1L × (1 + 0.07/4)^20 ≈ ₹1,41,478
    const result = calculateFD(1_00_000, 7, 5);
    expect(result.maturityAmount).toBeGreaterThan(1_40_000);
    expect(result.maturityAmount).toBeLessThan(1_43_000);
  });

  it('totalInterest = maturityAmount - principal', () => {
    const result = calculateFD(1_00_000, 7, 5);
    expect(Math.abs(result.totalInterest - (result.maturityAmount - 1_00_000))).toBeLessThanOrEqual(1);
  });

  it('higher rate yields higher maturity', () => {
    const low  = calculateFD(1_00_000, 5, 5);
    const high = calculateFD(1_00_000, 9, 5);
    expect(high.maturityAmount).toBeGreaterThan(low.maturityAmount);
  });

  it('longer tenure yields higher maturity', () => {
    const short = calculateFD(1_00_000, 7, 1);
    const long  = calculateFD(1_00_000, 7, 10);
    expect(long.maturityAmount).toBeGreaterThan(short.maturityAmount);
  });
});
