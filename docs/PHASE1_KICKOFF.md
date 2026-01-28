# Phase 1 Kickoff — Pre-Launch Critical Audits

**Started:** 2025-01-27  
**Status:** 🟡 IN PROGRESS  
**Goal:** Complete Audits 1–7 before launch (Weeks 1–8)

---

## Phase 1 Audits (Overview)

| Week | Audit | Owner | Status |
|------|-------|-------|--------|
| 1–4 | **1. Platform Engineering** | CTO | 🟡 In Progress |
| 3–5 | 2. CMS Capability | Product Manager | ⬜ Not Started |
| 5–6 | 3. Data Pipeline & Accuracy | Data Engineer | ⬜ Not Started |
| 5–8 | 4. Main Pages UI/UX | UX Designer | ⬜ Not Started |
| 7–8 | 5. Conversion Rate Optimization | Growth Marketer | ⬜ Not Started |
| 8 | 6. Accessibility | Frontend Dev | ⬜ Not Started |
| 7–8 | 7. Financial Compliance | Legal Counsel | ⬜ Not Started |

---

## Audit 1: Platform Engineering — Week 1 Actions

**Owner:** CTO / Senior Engineer  
**Reference:** [AUDIT_FINAL.md](../AUDIT_FINAL.md) (Deployment Recovery Plan)

### Immediate: Green Build (Do First)

1. **Clean house**
   - [ ] Move 100+ root `.md`/`.txt` status/temp files to `archive/reports/`
   - [ ] Keep only: `README.md`, `PLATFORM_BIBLE.md`, `AUDIT_FINAL.md`, `docs/`

2. **Fix Admin build (BLOCKER-1)**
   - [ ] File: `app/admin/articles/[id]/edit-refactored/page.tsx`
   - [ ] Move `revalidatePath` (and any Server-only logic) to `actions.ts` with `"use server"`
   - [ ] Import and call from the client component

3. **Verify build**
   - [ ] Run `npm run build` until it passes
   - [ ] Run `npm run test` and document current pass/fail

4. **Schema**
   - [ ] Apply pending migrations
   - [ ] Freeze schema changes for 1 week (per AUDIT_FINAL)

### Audit 1 Deliverables (Weeks 1–4)

- [ ] Architecture diagram with bottlenecks
- [ ] Production blocker list (prioritized)
- [ ] Security vulnerability report
- [ ] Performance benchmark (Core Web Vitals)
- [ ] Test coverage report (target: 75%+)
- [ ] Disaster recovery plan
- [ ] Week 2–4 action plan

### Critical Blockers (from Master Checklist)

- [ ] Test coverage ≥75%
- [ ] Migration rollback procedure
- [ ] Rate limiting fail-closed
- [ ] Env vars validated at runtime
- [ ] SEBI disclaimers on MF pages
- [ ] Prominent affiliate disclosure

---

## Files to Freeze (Do Not Modify During Stabilization)

| Path | Reason |
|------|--------|
| `lib/env.ts` | Security safety net |
| `PLATFORM_BIBLE.md` | Product/design source of truth |
| `app/calculators/**` | Stable, high-value asset |
| `lib/ai-service.ts` | Working circuit-breaker logic |
| `tailwind.config.ts` | Design system base |

---

## When to Start Other Phase 1 Audits

- **Audit 2 (CMS):** Week 3 — after build is green and Admin is stable  
- **Audit 3 (Data Pipeline):** Week 5  
- **Audit 4 (UI/UX):** Week 5, in parallel with Data  
- **Audits 5, 6, 7:** Weeks 7–8

---

## Quick Links

- [Master Audit Checklist](master_audit_checklist.md) — full 12-audit list  
- [AUDIT_FINAL.md](../AUDIT_FINAL.md) — platform status and recovery plan  
- [PLATFORM_BIBLE.md](../PLATFORM_BIBLE.md) — product spec and design
