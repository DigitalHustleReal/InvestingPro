# Contributing to InvestingPro

Thank you for your interest in contributing! This document covers the development workflow, coding standards, and how to get started.

## Getting Started

### Prerequisites
- Node.js (see `.nvmrc` for version)
- npm
- Supabase account (for local database)

### Setup
```bash
git clone https://github.com/DigitalHustleReal/InvestingPro.git
cd InvestingPro
npm install
cp env.template .env.local
# Fill in your environment variables in .env.local
npm run dev
```

### Environment Variables
See `env.template` for all required variables. At minimum for local development:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Development Workflow

### Branch Naming
- Features: `feature/short-description`
- Bug fixes: `fix/short-description`
- Hotfixes: `hotfix/short-description`

### Code Standards

**TypeScript**
- Strict mode is enabled — no `any` unless absolutely necessary
- All new files must be fully typed

**Styling**
- Use Tailwind CSS utility classes
- Use semantic color tokens (e.g. `text-foreground`, `bg-card`) — avoid hardcoded hex values
- Prefer semantic tokens over legacy `wt-*` aliases in new code (see migration guide in `app/globals.css`)

**Components**
- Place reusable components in `components/`
- Admin-only components go in `components/admin/`
- Use `'use client'` directive only when client-side interactivity is needed

**API Routes**
- All routes under `/api/admin/*` MUST call `requireAdminApi()` at the start
- Validate all request bodies with Zod schemas
- Use `logger` from `@/lib/logger` for all logging — never `console.log` in production code

### Running Checks
```bash
npm run type-check    # TypeScript validation
npm run lint          # ESLint
npm run test          # Unit tests
npm run test:a11y     # Accessibility audit
npm run lighthouse    # Lighthouse CI
```

All checks must pass before a PR can be merged.

## Database Changes

- All schema changes go in `supabase/migrations/`
- Name files: `YYYYMMDD_description.sql`
- Include RLS policies for any new tables
- Test migrations on a branch before merging

## Content & CMS

- Article state machine: `draft → review → published → archived`
- Never bypass the review queue for AI-generated content
- Always assign an `author_id` when creating articles via the admin panel

## Accessibility

- All interactive elements must have accessible labels (`aria-label`, `aria-labelledby`, or visible text)
- Minimum touch target size: 44×44px
- Test with `npm run test:a11y` before submitting UI PRs

## Pull Requests

1. Ensure all checks pass: `npm run validate`
2. Write a clear PR description explaining the change and why
3. Link any related issues
4. Request review from at least one team member
5. Squash commits before merging

## Security

See [SECURITY.md](./SECURITY.md) for how to report vulnerabilities. Never commit secrets, API keys, or credentials.
