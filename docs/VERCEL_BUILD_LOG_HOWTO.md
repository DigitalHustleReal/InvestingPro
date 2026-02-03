# How to get the build error from Vercel

If the deployment still **fails**, Vercel shows "Deployment failed with error" but the **reason** is in the **Build Logs**.

## What to copy and share

1. Open the failed deployment in Vercel.
2. Go to the **Logs** tab (Build Logs).
3. **Scroll to the bottom** of the log (after "Running \"install\" command" and after the build step starts).
4. Copy the **last 40–60 lines** — that’s where you’ll see lines like:
   - `Error: ...`
   - `Build error occurred`
   - `Module not found: ...`
   - `Command "npm run build" exited with 1`
   - Any red/highlighted error lines

Paste those lines (or a screenshot) so we can see the **exact** error and fix it.

## What’s already correct

- **Commit:** fc740ae (`next build --webpack`)
- **Build Command:** `npm run build` → runs `next build --webpack`
- **Install Command:** `npm install`
- **Env vars:** You’ve set Supabase, OpenAI, Gemini, etc.

The remaining failure is something that only the **end of the build log** will show.
