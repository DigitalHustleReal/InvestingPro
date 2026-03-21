# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (main) | ✅ |
| Older branches | ❌ |

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

To report a security vulnerability, please email:

**security@investingpro.in**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

You will receive an acknowledgement within **48 hours** and a full response within **7 days**.

## Security Scope

### In Scope
- Authentication / authorization bypass
- SQL injection or Supabase RLS policy bypass
- XSS vulnerabilities in user-generated content
- Exposed secrets or credentials
- Privilege escalation (accessing admin routes as a regular user)
- SSRF vulnerabilities in scraper or image upload endpoints

### Out of Scope
- Issues requiring physical access to servers
- Social engineering attacks
- Denial of service (rate limiting is already in place)
- Issues in third-party services (Supabase, Vercel, Cloudinary) — report directly to them

## Security Architecture

- **Authentication:** Supabase Auth (email/password + OAuth)
- **Authorization:** RBAC with 4 roles: `admin`, `editor`, `author`, `viewer`
- **Database:** Row-Level Security (RLS) policies on all tables
- **API protection:** `requireAdminApi()` guard on all `/api/admin/*` routes
- **Rate limiting:** Upstash Redis with fail-closed fallback
- **Content sanitization:** `isomorphic-dompurify` for HTML input
- **Secret management:** Environment variables only — never committed to git

## Known Security Configuration Notes

- `ADMIN_BYPASS_KEY` is only valid in `NODE_ENV=development` — it must NOT be set in production
- Service role key is used server-side only for admin operations that must bypass RLS
- All admin routes require both middleware-level AND API-level authentication checks

## Responsible Disclosure

We ask that you:
1. Give us reasonable time to fix the issue before public disclosure
2. Avoid accessing or modifying user data beyond what is needed to demonstrate the vulnerability
3. Not disrupt service availability
