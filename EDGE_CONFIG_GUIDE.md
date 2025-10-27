# 🎯 Edge Config Setup & Usage Guide

Edge Config allows you to manage global configuration without redeploying your app. Perfect for:
- Feature flags (enable/disable features)
- Reward prices
- Activity point values
- Server-wide settings

---

## Step 1: Create Edge Config in Vercel Dashboard

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Storage"** tab
3. Click **"Create"** → Select **"Edge Config"**
4. Name it `"base-app-config"`
5. Click **"Create"**
6. You'll see a **"Connection String"**, copy it

---

## Step 2: Add to .env.local

Paste your connection string:

```bash
EDGE_CONFIG=https://edge-config.vercel.com/xxxxxx?token=xxxxx
```

---

## Step 3: Create Your Configuration Data

In Vercel Dashboard → Storage → Your Edge Config → **"Items"** tab:

Click **"Edit"** and add this JSON:

```json
{
  "featureFlags": {
    "maintenanceMode": false,
    "newLeaderboard": true,
    "enableRewards": true
  },
  "rewardConfig": {
    "maxRedeemPerDay": 5,
    "minPointsForReward": 100
  },
  "activityConfig": {
    "dailyLoginPoints": 10,
    "referralPoints": 100,
    "taskPoints": 25
  }
}
```

---

## Step 4: Use in Your Code

### Option A: In Middleware (Global)

Already set up in `middleware.ts`:

```typescript
import { get } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  const featureFlags = await get('featureFlags');
  // Use globally across all requests
}
```

---

### Option B: In API Routes

```typescript
// app/api/claim-points/route.ts
import { getActivityConfig } from '@/lib/edgeConfig';

export async function POST(request: NextRequest) {
  const config = await getActivityConfig();
  const points = config.dailyLoginPoints || 10;
  
  // Use points in your logic
}
```

---

### Option C: In Page Components

```typescript
// app/activities/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { isFeatureEnabled } from '@/lib/edgeConfig';

export default function ActivitiesPage() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    isFeatureEnabled('enableRewards').then(setIsEnabled);
  }, []);

  if (!isEnabled) {
    return <div>Rewards coming soon!</div>;
  }

  return <div>Your rewards page</div>;
}
```

---

## Real-World Examples

### Example 1: Feature Flag for Maintenance

```typescript
// middleware.ts
const flags = await get('featureFlags');
if (flags.maintenanceMode) {
  return NextResponse.json(
    { error: 'App is in maintenance mode' },
    { status: 503 }
  );
}
```

### Example 2: Dynamic Point Values

```typescript
// lib/edgeConfig.ts
export async function getPointsForActivity(activityId: string) {
  const config = await getActivityConfig();
  const points = config[`${activityId}Points`] || 0;
  return points;
}

// app/api/claim-points/route.ts
const points = await getPointsForActivity('daily-login');
```

### Example 3: Rate Limiting with Edge Config

```typescript
// app/api/redeem-reward/route.ts
const config = await getRewardConfig();
const userRedeems = await getUserRedeemCount(fid);

if (userRedeems >= config.maxRedeemPerDay) {
  return NextResponse.json(
    { error: 'Daily redeem limit reached' },
    { status: 429 }
  );
}
```

---

## 📋 Checklist

- [ ] Create Edge Config in Vercel Dashboard
- [ ] Copy connection string to `.env.local` as `EDGE_CONFIG`
- [ ] Add JSON configuration in Edge Config items
- [ ] Test locally: `npm run dev`
- [ ] Check middleware and API routes work
- [ ] Deploy to Vercel (should auto-update)

---

## 🧪 Test Locally

```bash
# Make sure you have EDGE_CONFIG in .env.local
npm run dev

# Visit your app - should work normally
# If Edge Config isn't available, app still works (graceful fallback)
```

---

## 🚀 Deploy Changes

Any changes you make to Edge Config Items take effect **immediately** across all your deployments - no redeploy needed!

---

## 🆘 Troubleshooting

### "Edge Config not found"
- Verify `EDGE_CONFIG` is in `.env.local`
- Make sure connection string is correct
- Run `vercel env pull` to update

### "Cannot read property of undefined"
- Wrap config access in try-catch (already done in `lib/edgeConfig.ts`)
- App will gracefully fall back to defaults

### Changes not appearing
- Clear browser cache
- Restart dev server
- Wait 30 seconds for Edge Config to propagate

---

## 💡 Best Practices

1. **Always have defaults** - If Edge Config fails, use sensible defaults
2. **Use helper functions** - Keep config access centralized in `lib/edgeConfig.ts`
3. **Test fallbacks** - Verify app works even if Edge Config is unavailable
4. **Document your config** - Keep track of what keys you're using
5. **Version your changes** - Use semantic versioning in your config

---

## Next Steps

After setting up Edge Config:
1. ✅ Test locally with `npm run dev`
2. ✅ Push to GitHub
3. ✅ Vercel auto-deploys
4. ✅ Update Edge Config items in dashboard
5. ✅ Changes take effect instantly!
