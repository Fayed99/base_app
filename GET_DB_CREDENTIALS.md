# 📋 Quick Setup: Get Your Database Connection String

You already created a Postgres database in Vercel! Now you need to add the connection string to your local `.env.local` file.

## 🎯 Step-by-Step:

### 1️⃣ Go to Vercel Dashboard
- Visit [vercel.com/dashboard](https://vercel.com/dashboard)
- Find your Base app project
- Click on it

### 2️⃣ Open Storage Tab
- Click the **"Storage"** tab at the top
- You should see your Postgres database listed

### 3️⃣ Get Connection Strings
- Click on your **Postgres database**
- Look for the **".env.local"** tab (or similar)
- You'll see these environment variables:
  ```
  POSTGRES_URLDB=postgresql://...
  POSTGRES_URL_NON_POOLING=postgresql://...
  POSTGRES_HOST=...
  POSTGRES_USER=...
  POSTGRES_PASSWORD=...
  POSTGRES_DATABASE=...
  ```

### 4️⃣ Copy to Your Project
- Open `.env.local` in this project
- Find the empty lines for:
  ```
  POSTGRES_URLDB=
  POSTGRES_URL_NON_POOLING=
  ```
- Paste the values from Vercel

### 5️⃣ Save & Test
```bash
npm run dev
```

Your app will:
- ✅ Connect to the Postgres database
- ✅ Auto-create tables on first request
- ✅ Store real data (points, users, leaderboard)
- ✅ Data persists across refreshes!

---

## 🧪 Test It:

1. Open http://localhost:3000
2. Navigate to **Activities** page
3. Click **"Claim"** on any activity
4. **Refresh the page** (Ctrl+R)
5. ✅ Points should still be there!

If points persist after refresh → **Database is working!** 🎉

---

## 🆘 Troubleshooting

### "Connection refused"
- Double-check you copied the `POSTGRES_URLDB` correctly
- Make sure there are no extra spaces

### "No such table: users"
- This is normal on first run
- The app will auto-create all tables
- Refresh the page

### "Cannot find POSTGRES_URLDB"
- Make sure `.env.local` is in the project root: `/workspaces/base_app/.env.local`
- Restart your dev server after editing `.env.local`

---

## Next Steps After Testing:

1. ✅ Test locally with real database
2. ✅ Push changes to GitHub: `git push origin main`
3. ✅ Vercel auto-deploys with database connected
4. ✅ Your live app uses the same database!

---

**Ready?** Get your connection strings from Vercel and paste them into `.env.local` → Then run `npm run dev` → Test by claiming points! 🚀
