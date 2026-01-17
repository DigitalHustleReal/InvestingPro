# Which Report to Follow - Decision Guide

**Date:** 2026-01-17  
**Status:** Active Guidance Document

---

## 🎯 Primary Action Document

### **Follow: PENDING_ACTIONS_TODO.md** ⭐ **START HERE**

This is your **single source of truth** for all actionable items. It consolidates 105+ tasks from ALL audit reports, organized by priority.

**Use this for:**
- ✅ Daily task execution
- ✅ Priority-based work planning
- ✅ Tracking progress on fixes
- ✅ Understanding what needs to be done

**Location:** Root level - `PENDING_ACTIONS_TODO.md`

---

## 📋 Strategic Roadmap

### **Reference: docs/plans/CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md**

This is your **strategic implementation plan** with phased approach (3-4 weeks).

**Use this for:**
- ✅ Understanding the big picture
- ✅ Phased implementation strategy
- ✅ Timeline planning
- ✅ Understanding dependencies between tasks

**When to use:**
- Planning sprint/sprint work
- Understanding how tasks relate to each other
- Getting detailed implementation guidance

**Location:** `docs/plans/CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md`

---

## 📚 Audit Reports (Reference Only)

These are **master reference documents** - use for context and deep understanding, NOT as primary action lists.

### 1. **FULL_LIFECYCLE_OPERATIONAL_AUDIT.md**
**Purpose:** Understand the complete content lifecycle automation gaps  
**When to reference:**
- Understanding why certain automation tasks exist
- Understanding revenue impact of missing features
- Deep dive into lifecycle bottlenecks

**Location:** `docs/audits/FULL_LIFECYCLE_OPERATIONAL_AUDIT.md`

### 2. **CMS_OPERATIONAL_AUDIT_REPORT.md**
**Purpose:** CMS-specific operational issues and fixes  
**When to reference:**
- Understanding build/runtime issues
- Understanding data integrity requirements
- Understanding security vulnerabilities
- Understanding performance bottlenecks

**Location:** `docs/audits/CMS_OPERATIONAL_AUDIT_REPORT.md`

### 3. **CMS_UI_UX_AUDIT_REPORT.md**
**Purpose:** UI/UX evaluation and improvements  
**When to reference:**
- Understanding UI/UX issues
- Planning accessibility improvements
- Mobile responsiveness fixes
- User experience enhancements

**Location:** `docs/audits/CMS_UI_UX_AUDIT_REPORT.md`

### 4. **HOME_PAGE_AUDIT_REPORT.md**
**Purpose:** Home page specific issues and optimizations  
**When to reference:**
- Fixing home page issues
- SEO optimization for homepage
- Performance optimization
- Accessibility fixes for homepage

**Location:** `docs/audits/HOME_PAGE_AUDIT_REPORT.md`

### 5. **COMPREHENSIVE_THEME_AUDIT_REPORT.md**
**Purpose:** Theme and styling issues (3000+ issues)  
**When to reference:**
- Dark mode fixes
- Hardcoded color issues
- Styling consistency
- Component theme fixes

**Location:** `docs/audits/COMPREHENSIVE_THEME_AUDIT_REPORT.md`

### 6. **FULL_PLATFORM_AUDIT_REPORT.md**
**Purpose:** Platform-wide audit (150+ pages)  
**When to reference:**
- Understanding theme issues across all pages
- Category page fixes
- Calculator page fixes
- Widget fixes

**Location:** `docs/audits/FULL_PLATFORM_AUDIT_REPORT.md`

---

## 🗺️ Recommended Workflow

### **Step 1: Start with PENDING_ACTIONS_TODO.md**
```
1. Open PENDING_ACTIONS_TODO.md
2. Focus on 🔴 CRITICAL PRIORITY section
3. Pick the first task (usually build fixes)
4. Start implementing
```

### **Step 2: For Strategic Context**
```
If you need to understand:
- Why this task exists → Check the audit report mentioned in parentheses
- How to implement → Check CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md
- What's the impact → Check FULL_LIFECYCLE_OPERATIONAL_AUDIT.md (revenue impact)
```

### **Step 3: For Detailed Implementation**
```
For specific tasks:
- Build errors → CMS_OPERATIONAL_AUDIT_REPORT.md + BUILD_AUDIT (archived)
- UI/UX fixes → CMS_UI_UX_AUDIT_REPORT.md
- Home page → HOME_PAGE_AUDIT_REPORT.md
- Theme/styling → COMPREHENSIVE_THEME_AUDIT_REPORT.md or FULL_PLATFORM_AUDIT_REPORT.md
- Automation → FULL_LIFECYCLE_OPERATIONAL_AUDIT.md
```

---

## 🎯 Priority-Based Recommendation

### **If You Want to Fix Build Issues First:**
1. Follow: **PENDING_ACTIONS_TODO.md** → Critical Priority → Build & Runtime
2. Reference: **CMS_OPERATIONAL_AUDIT_REPORT.md** → Section 1 (Build & Runtime)
3. Check: **docs/plans/CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md** → Phase 1 → Task 1.1.1

### **If You Want to Focus on CMS Automation:**
1. Follow: **PENDING_ACTIONS_TODO.md** → Critical Priority → Automation items
2. Reference: **FULL_LIFECYCLE_OPERATIONAL_AUDIT.md** → Priority Recommendations
3. Check: **docs/plans/CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md** → All phases

### **If You Want to Fix Home Page:**
1. Follow: **PENDING_ACTIONS_TODO.md** → Critical Priority → Home Page section
2. Reference: **HOME_PAGE_AUDIT_REPORT.md** → Priority Recommendations
3. Implement fixes in order (Critical → High → Medium → Low)

### **If You Want to Fix UI/UX:**
1. Follow: **PENDING_ACTIONS_TODO.md** → High Priority → UI/UX section
2. Reference: **CMS_UI_UX_AUDIT_REPORT.md** → Priority Recommendations Summary
3. Implement critical fixes first

### **If You Want to Fix Theme Issues:**
1. Follow: **FULL_PLATFORM_AUDIT_REPORT.md** → Implementation Plan section
2. Reference: **COMPREHENSIVE_THEME_AUDIT_REPORT.md** for detailed issues
3. Work through Phase 1 (Critical & High Priority) first

---

## 📊 Decision Matrix

| Your Goal | Primary Document | Supporting Documents |
|-----------|-----------------|---------------------|
| **Execute tasks** | PENDING_ACTIONS_TODO.md | CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md |
| **Plan sprint** | CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md | PENDING_ACTIONS_TODO.md |
| **Understand why** | Audit reports (as referenced in TODO) | - |
| **Fix build errors** | PENDING_ACTIONS_TODO.md | CMS_OPERATIONAL_AUDIT_REPORT.md |
| **Fix home page** | PENDING_ACTIONS_TODO.md | HOME_PAGE_AUDIT_REPORT.md |
| **CMS automation** | PENDING_ACTIONS_TODO.md | FULL_LIFECYCLE_OPERATIONAL_AUDIT.md |
| **UI/UX fixes** | PENDING_ACTIONS_TODO.md | CMS_UI_UX_AUDIT_REPORT.md |
| **Theme fixes** | FULL_PLATFORM_AUDIT_REPORT.md | COMPREHENSIVE_THEME_AUDIT_REPORT.md |

---

## ✅ Recommended Starting Point

### **Start Here: PENDING_ACTIONS_TODO.md → Critical Priority**

**First 5 Tasks to Tackle:**
1. Fix TypeScript syntax error (1-2 hours)
2. Fix server-only import violations (2-4 hours)
3. Add dark mode variant to home page main element (5 min) ⚡ Quick win
4. Fix structured data type on home page (1 hour) ⚡ Quick win
5. Implement lazy loading for home page (2 hours)

**Why this order?**
- Tasks 1-2: Blocking production deployment
- Tasks 3-4: Quick wins (build confidence)
- Task 5: Performance improvement (user experience)

---

## 📝 Summary

**Primary Action Document:** `PENDING_ACTIONS_TODO.md` ⭐  
**Strategic Roadmap:** `docs/plans/CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md`  
**Reference Documents:** All audit reports in `docs/audits/`

**Rule of Thumb:**
- ✅ **TODO list** = What to do
- ✅ **Implementation Plan** = How to do it (strategically)
- ✅ **Audit Reports** = Why to do it (context & impact)

---

**Last Updated:** 2026-01-17
