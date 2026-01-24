# Migration Rollback Guide

> [!IMPORTANT]
> This guide outlines the standard operating procedures for rolling back database migrations and code deployments for the InvestingPro platform. Use this when a deployment introduces critical failures.

## 1. Database Rollback Strategy

We use **Supabase** for database management. Rollbacks involve reverting schema changes using the CLI or SQL migrations.

### A. Automatic Rollback (Supabase CLI)
If you have local access and the migration history is intact:

1.  **List Migrations**:
    ```bash
    npx supabase migration list
    ```
2.  **Repair Migration History** (if needed):
    If the migration failed halfway, ensure the `supabase_migrations.schema_migrations` table matches the actual state.
3.  **Revert Last Migration**:
    Supabase CLI does not have a direct `down` command for all scenarios, but you can target a specific version if you have `down.sql` files.
    
    *Recommended approach*: Create a **new migration** that inverses the changes.
    ```bash
    npx supabase migration new revert_feature_name
    ```
    Paste the inverse SQL into the generated file (e.g., `DROP TABLE xyz;`) and push.
    ```bash
    npx supabase db push
    ```

### B. Manual Rollback (SQL)
If CLI is unavailable, execute SQL directly via Supabase Dashboard SQL Editor:

1.  **Identify Changes**: Review the `up.sql` of the problematic migration.
2.  **Execute Inverse SQL**: Run the `down` logic (e.g., `ALTER TABLE users DROP COLUMN new_col;`).
3.  **Update Migration History**:
    ```sql
    DELETE FROM supabase_migrations.schema_migrations WHERE version = '20240101000000';
    ```

## 2. Code Rollback Strategy

We use **Git** for version control.

### A. Reverting a Merge Commit (Main Branch)
If bad code was merged to `main`:
1.  **Checkout Main**: `git checkout main && git pull`
2.  **Revert Commit**:
    ```bash
    git revert -m 1 <merge-commit-hash>
    ```
3.  **Push**: `git push origin main`

### B. Redeploying Previous Version
If using Vercel/Netlify:
1.  **Go to the Deployment Dashboard**.
2.  **Find the last stable deployment**.
3.  Click **"Redeploy"** (or "Rollback to this deployment").

## 3. Data Integrity Verification

After rollback, verify system health:

*   [ ] **Check Database Consistency**: Ensure tables/columns removed match expectation.
*   [ ] **Run Sanity Tests**: `npm test __tests__/sanity.test.ts`
*   [ ] **Verify Critical Flows**: Login, Article View, Admin Dashboard.
*   [ ] **Check Error Logs**: Monitor Sentry/Datadog for anomalies.

## 4. Emergency Contacts

*   **CTO**: [Contact Info]
*   **DevOps Lead**: [Contact Info]
