# 🏗️ Platform Architecture Documentation

**Date:** January 13, 2026  
**Version:** 1.0  
**Status:** Initial Documentation  
**Purpose:** Comprehensive architecture documentation for InvestingPro.in platform

---

## 📋 Table of Contents

1. [System Overview](#1-system-overview)
2. [Application Architecture](#2-application-architecture)
3. [Data Architecture](#3-data-architecture)
4. [API Architecture](#4-api-architecture)
5. [CMS Architecture](#5-cms-architecture)
6. [Automation Architecture](#6-automation-architecture)
7. [Infrastructure Architecture](#7-infrastructure-architecture)
8. [Security Architecture](#8-security-architecture)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Monitoring & Observability](#10-monitoring--observability)

---

## 1. System Overview

### 1.1 Platform Vision

**InvestingPro.in** is India's premier personal finance platform - the "NerdWallet of India" - built with:
- **New Technology**: Modern tech stack (Next.js 14, TypeScript, React)
- **Better UI/UX**: Superior user experience
- **Trust**: Building credibility and trust signals
- **Living, Breathing CMS**: Dynamic, self-improving content system
- **100% Automation**: Full automation of content processes

### 1.2 Architecture Pattern

**Current Pattern:** Monolithic Next.js Full-Stack Application

```
┌─────────────────────────────────────────────────┐
│           Next.js Application                   │
│  ┌──────────────┐        ┌──────────────┐     │
│  │  App Router  │        │   API Routes │     │
│  │ (SSR/SSG)    │        │  (Serverless)│     │
│  └──────────────┘        └──────────────┘     │
│         │                        │             │
│         └────────────┬───────────┘             │
│                      │                         │
│         ┌────────────▼──────────┐             │
│         │   lib/ (Business Logic)│            │
│         └────────────┬───────────┘             │
└──────────────────────│─────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Supabase      │
              │  (PostgreSQL +  │
              │   Auth + Storage)│
              └─────────────────┘
```

### 1.3 Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)

**Backend:**
- Next.js API Routes (Serverless)
- Supabase (PostgreSQL + Auth + Storage)
- Node.js Runtime

**Infrastructure:**
- Vercel (Deployment)
- Supabase Cloud (Database)
- Vercel Edge Network (CDN)

---

## 2. Application Architecture

### 2.1 Directory Structure

```
app/                    # Routes & Pages (Server Components)
  ├── layout.tsx        # Root layout
  ├── page.tsx          # Homepage
  ├── [category]/       # Dynamic routes
  └── api/              # API routes (Serverless)

components/             # React Components
  ├── layout/           # Layout components
  ├── common/           # Shared components
  ├── [category]/       # Feature components
  └── ui/               # UI primitives

lib/                    # Business Logic
  ├── api.ts            # API client
  ├── navigation/       # Navigation logic
  ├── supabase/         # Database clients
  ├── cms/              # Content management
  ├── agents/           # AI agents (20+)
  ├── automation/       # Automation systems
  └── ...               # Other utilities
```

### 2.2 Component Architecture

**Component Types:**
- **Layout Components**: Navbar, Footer, Page layouts
- **Page Components**: Category pages, Detail pages
- **Feature Components**: Calculators, Comparisons, Filters
- **UI Components**: Buttons, Cards, Forms
- **Shared Components**: Common utilities, error boundaries

**Pattern:** Hierarchical Component Structure

### 2.3 Data Flow

**Data Flow Pattern:**
```
Server Components (SSR/SSG)
  ↓
API Routes (Next.js API)
  ↓
External APIs / Database
  ↓
Client Components (React Query)
```

**State Management:**
- **Local State**: `useState`, `useReducer` (component-level)
- **Shared State**: Context API (NavigationContext, SearchProvider)
- **Server State**: React Query (`@tanstack/react-query`)
- **URL State**: Query params, pathname (navigation state)
- **Server State**: Server Components (no client-side state)

---

## 3. Data Architecture

### 3.1 Database Architecture

**Database:** Supabase PostgreSQL

**Database Schema:**
- **Articles**: Content management
- **Products**: Credit cards, loans, insurance, mutual funds
- **Authors**: Author management
- **Categories**: Content categorization
- **Reviews**: User reviews
- **Portfolios**: User portfolios
- **Affiliate Products**: Monetization
- **Content Performance**: Analytics

**Data Access Pattern:**
```
Components/API Routes
    ↓
lib/supabase/client.ts  (Browser)
lib/supabase/server.ts  (Server)
    ↓
Supabase PostgreSQL
```

**Security:**
- Row Level Security (RLS) enabled
- Service role for admin operations
- Anon key for public access

### 3.2 Data Access Patterns

**Current Patterns:**
1. **Direct Supabase Access**: `supabase.from('table').select()`
2. **Via API Client**: `api.entities.Article.list()`
3. **Via Service**: `articleService.list()`

**Recommendation:** Standardize on service layer pattern

---

## 4. API Architecture

### 4.1 API Structure

**API Routes:**
```
app/api/
  ├── admin/            # Admin endpoints
  ├── analytics/        # Analytics endpoints
  ├── products/         # Product endpoints
  ├── articles/         # Article endpoints
  ├── cron/             # Scheduled jobs
  └── ...               # Other endpoints
```

**API Pattern:** REST-style (implicit)

**Authentication:** Supabase Auth (JWT)

**Current State:**
- ⚠️ No API versioning
- ⚠️ No API documentation
- ⚠️ Inconsistent error handling
- ⚠️ No rate limiting

**Recommendations:**
1. Implement API versioning (v1, v2)
2. Add API documentation (OpenAPI/Swagger)
3. Standardize error handling
4. Add request/response validation (Zod)
5. Implement rate limiting

---

## 5. CMS Architecture

### 5.1 Agentic CMS System

**Architecture:** Multi-Agent System with Orchestrator

**Agent System (20+ Agents):**

**Research & Strategy Agents:**
- `TrendAgent` - Trend detection
- `KeywordAgent` - Keyword research
- `StrategyAgent` - Content strategy
- `EconomicIntelligenceAgent` - Economic data

**Content Creation Agents:**
- `ContentAgent` - Article generation
- `ImageAgent` - Image generation
- `QualityAgent` - Quality assessment
- `BulkGenerationAgent` - Batch generation

**Optimization Agents:**
- `AffiliateAgent` - Affiliate optimization
- `RepurposeAgent` - Content repurposing
- `SocialAgent` - Social media generation
- `ScraperAgent` - Data collection

**Publishing & Tracking Agents:**
- `PublishAgent` - Publishing automation
- `TrackingAgent` - Performance tracking
- `HealthMonitorAgent` - System health

**Learning & Control Agents:**
- `FeedbackLoopAgent` - Performance learning
- `BudgetGovernorAgent` - Cost control
- `RiskComplianceAgent` - Compliance checking

**Orchestrator:** `CMSOrchestrator` coordinates all agents

### 5.2 Content Generation Pipeline

**Pipeline Stages:**
1. **Research**: Keyword research, SERP analysis
2. **Generation**: AI content generation
3. **Quality Assurance**: Quality scoring, plagiarism check
4. **Optimization**: SEO optimization, internal linking
5. **Publishing**: Save to database, schedule publishing

**Implementation:**
- `lib/automation/content-pipeline.ts`
- `lib/automation/content-orchestrator.ts`
- `lib/automation/article-generator.ts`

### 5.3 Content Management

**CMS Features:**
- Article CRUD operations
- Status lifecycle (draft → review → published → archived)
- Category and tag management
- Author management
- SEO metadata management
- Media library integration

**Implementation:**
- `lib/cms/article-service.ts`
- Supabase PostgreSQL (articles table)

---

## 6. Automation Architecture

### 6.1 Automation Coverage

**Fully Automated (~70-80%):**
- Content research
- Content generation
- Image generation
- SEO optimization
- Quality scoring
- Publishing
- Performance tracking
- Social media repurposing

**Semi-Automated:**
- Content approval (quality gate ≥ 80)
- Affiliate link placement
- Content strategy

**Manual:**
- Content editing
- High-level strategy
- Product data curation

### 6.2 Workflow Automation

**Automated Workflows:**
1. Content Generation: Research → Generate → Quality → Optimize → Publish
2. Content Repurposing: Article → Extract → Repurpose → Social → Schedule
3. Content Optimization: Content → Analyze → Optimize → Update → Republish
4. Performance Tracking: Content → Track → Analyze → Report → Learn

### 6.3 Error Handling

**Current State:**
- ✅ Agent-level error handling
- ✅ Retry mechanisms
- ✅ Circuit breakers (AI provider fallbacks)
- ✅ Logging
- ⚠️ Workflow-level error handling needs improvement
- ⚠️ Recovery strategies need evaluation

---

## 7. Infrastructure Architecture

### 7.1 Deployment

**Platform:** Vercel

**Deployment Type:** Serverless

**Features:**
- Automatic scaling
- Edge network (CDN)
- Serverless functions (API routes)
- Automatic HTTPS

### 7.2 Database

**Platform:** Supabase Cloud

**Type:** PostgreSQL

**Features:**
- Managed PostgreSQL
- Row Level Security (RLS)
- Real-time subscriptions
- Storage (file storage)

### 7.3 Caching

**Current Caching:**
- Next.js Cache (SSR/SSG)
- React Query Cache (client-side, 5 minutes)
- Redis available (`lib/cache/redis-service.ts`) but usage unclear
- Vercel Edge Network (CDN)

**Recommendations:**
1. Document caching strategy
2. Implement Redis caching for frequently accessed data
3. Add cache invalidation patterns
4. Configure CDN strategy

---

## 8. Security Architecture

### 8.1 Authentication

**Provider:** Supabase Auth

**Method:** JWT tokens

**Storage:** HTTP-only cookies (Supabase SSR)

**Session Management:** Supabase handles

### 8.2 Authorization

**Database Level:** RLS (Row Level Security)

**Application Level:** Role-based (admin role)

**API Level:** JWT validation

**Implementation:**
- `middleware.ts` - Route protection
- RLS policies in database
- Role-based access control

### 8.3 Data Security

**Encryption:** Supabase handles (in-transit, at-rest)

**Access Control:** RLS policies

**Data Protection:** Supabase infrastructure

**Recommendations:**
1. Document security architecture
2. Implement PII handling guidelines
3. Create data retention policy
4. Document backup strategy

---

## 9. Deployment Architecture

### 9.1 Deployment Process

**Platform:** Vercel

**Process:**
1. Git push to repository
2. Vercel detects changes
3. Build process (Next.js build)
4. Deploy to production
5. Automatic rollback on failure

### 9.2 Environments

**Current State:**
- ⚠️ No clear staging environment
- ⚠️ Environment management unclear

**Recommendations:**
1. Implement staging environment
2. Document environment management
3. Add deployment monitoring
4. Create rollback strategy

---

## 10. Monitoring & Observability

### 10.1 Current Monitoring

**Error Tracking:**
- Sentry available (`@sentry/nextjs`)
- Configuration files exist (`sentry.client.config.ts`, `sentry.server.config.ts`)

**Analytics:**
- PostHog available (`posthog-js`)
- Analytics service exists (`lib/analytics/service.ts`)

**Logging:**
- Logger available (`lib/logger.ts`)

**Current State:**
- ⚠️ Sentry configuration unclear
- ⚠️ PostHog configuration unclear
- ⚠️ No performance monitoring
- ⚠️ No uptime monitoring
- ⚠️ No application metrics

### 10.2 Recommendations

**Immediate:**
1. Configure Sentry properly
2. Configure PostHog properly
3. Add performance monitoring
4. Add uptime monitoring
5. Implement application metrics

**Monitoring Stack:**
- **Error Tracking**: Sentry
- **Analytics**: PostHog
- **Performance**: Lighthouse CI, Core Web Vitals
- **Uptime**: Uptime monitoring service
- **Logs**: Log aggregation service

---

## 📊 Architecture Decisions

### Decision 1: Monolithic Architecture
- **Decision**: Use Next.js monolith (full-stack)
- **Rationale**: Appropriate for current scale, faster development
- **Trade-offs**: Easier to develop, may need refactoring at scale
- **Status**: ✅ Appropriate for current stage

### Decision 2: Supabase for Backend
- **Decision**: Use Supabase (PostgreSQL + Auth + Storage)
- **Rationale**: Managed service, reduces infrastructure complexity
- **Trade-offs**: Less control, vendor lock-in, but faster development
- **Status**: ✅ Good choice for current stage

### Decision 3: Server Components + Client Components
- **Decision**: Next.js App Router pattern
- **Rationale**: Best performance, SEO, user experience
- **Trade-offs**: Learning curve, but significant benefits
- **Status**: ✅ Excellent choice

### Decision 4: React Query for Server State
- **Decision**: Use React Query for server state
- **Rationale**: Excellent caching, error handling, loading states
- **Trade-offs**: Additional dependency, but significant benefits
- **Status**: ✅ Excellent choice

### Decision 5: Agentic CMS Architecture
- **Decision**: Multi-agent system with orchestrator
- **Rationale**: Enables 100% automation, self-improving system
- **Trade-offs**: Complexity, but enables vision
- **Status**: ✅ Aligned with vision

---

## 🎯 Next Steps

1. ✅ Document architecture (this document)
2. ⏳ Implement monitoring (Sentry, PostHog, performance)
3. ⏳ Security review
4. ⏳ Performance optimization
5. ⏳ Testing strategy
6. ⏳ CI/CD pipeline

---

*Architecture Documentation Created: January 13, 2026*
