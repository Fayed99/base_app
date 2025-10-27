# 🚀 Vercel Setup Guide: Complete Steps 1-5

## What You Need to Do

You're setting up 2 things from Vercel:
1. **Postgres Database** (for storing points, users, leaderboard data)
2. **Edge Config** (optional - for global configuration management)

---

## STEP 1: Pull Environment Variables

### Why?
Your Vercel project has database credentials that your local app needs to connect to Postgres.

### How to Do It:

#### Option A: Using Vercel CLI (Recommended)
```bash
cd /workspaces/base_app
vercel env pull
```

This command:
- Connects to your Vercel account
- Downloads your environment variables
- Populates `.env.local` file automatically

#### Option B: Manual Setup
If `vercel env pull` doesn't work:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find these variables:
   - `POSTGRES_URLDB`
   - `POSTGRES_URL_NON_POOLING`
   - Copy the values
3. Edit `.env.local` in your project and paste them:
```
POSTGRES_URLDB=postgresql://user:password@host/database
POSTGRES_URL_NON_POOLING=postgresql://user:password@host/database
```

✅ **Result:** Your app can now connect to the Postgres database!

---

## STEP 2: Install Edge Config Package

Edge Config lets you manage global settings without redeploying.

### Commands:
```bash
npm install @vercel/edge-config
```

✅ **Already done!** Added to package.json

---

## STEP 3: Create Edge Config (Optional but Recommended)

### Why?
To store things like:
- Reward prices
- Activity point values
- Feature flags
- Server-wide settings

### How to Create:

1. Go to **Vercel Dashboard** → **Storage** tab
2. Click **Create** → Select **Edge Config**
3. Name it `"base-app-config"`
4. Click **Create**
5. You'll get a **Connection String**, copy it

### In Your `.env.local`:
```
EDGE_CONFIG=<paste-your-connection-string-here>
```

---

## STEP 4: Use in Code (Example)

Here's how to use Edge Config in your app:

```typescript
// middleware.ts - Global config access
import { get } from '@vercel/edge-config';

export async function middleware(request: Request) {
  try {
    const config = await get('rewards');
    // Now you can use config globally
  } catch (error) {
    console.log('Edge Config not available');
  }
}
```

Or in API routes:

```typescript
// app/api/rewards/route.ts
import { get } from '@vercel/edge-config';

export async function GET() {
  const rewards = await get('rewards');
  return Response.json(rewards);
}
```

---

## STEP 5: Verify Everything Works

### Test Locally:
```bash
npm run dev
```

Then:
1. Open http://localhost:3000
2. Click through pages
3. **Claim activity** → Should see points increase
4. **Refresh page** → Points should persist (means DB is working!)
5. **Redeem reward** → Should deduct points

### Test on Vercel:
1. Push code to GitHub: `git push origin main`
2. Vercel auto-deploys
3. Visit your live app
4. Same tests - should all work!

---

## 📋 Checklist

- [ ] Step 1: Run `vercel env pull` and get environment variables
- [ ] Step 2: `npm install @vercel/edge-config` (already in package.json)
- [ ] Step 3: Create Edge Config in Vercel Dashboard
- [ ] Step 4: Add `EDGE_CONFIG` to `.env.local`
- [ ] Step 5: Test locally and on live site

---

## 🆘 Troubleshooting

### `vercel env pull` doesn't work
- Install Vercel CLI: `npm install -g vercel`
- Login: `vercel login`
- Link project: `vercel link`
- Then run: `vercel env pull`

### "Cannot connect to database"
- Check `POSTGRES_URLDB` is in `.env.local`
- Verify it's not empty
- Restart dev server: `npm run dev`

### "Edge Config not found"
- You haven't created Edge Config yet (it's optional)
- Or `EDGE_CONFIG` variable is missing from `.env.local`

---

## 🎯 Summary

After these 5 steps:
- ✅ Your app connects to Vercel Postgres
- ✅ All data persists
- ✅ Points system works
- ✅ Leaderboard updates
- ✅ You can manage config globally with Edge Config
- ✅ App is production-ready!

**Next:** Push to GitHub, verify deployment works! 🚀
