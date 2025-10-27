# PointsUp - Leaderboard Loyalty Mini App

A Farcaster mini app built on Base that gamifies user engagement with a points-based loyalty system, leaderboards, and rewards marketplace.

## 🚀 Features

### Dashboard
- **User Stats** - View personal points, rank, weekly earnings, and streak
- **Progress Tracking** - Visual progress bars toward next milestone (every 100 points)
- **Quick Navigation** - Easy access to leaderboard, activities, and rewards

### Leaderboard
- **All-Time Rankings** - Global competition based on total points
- **Weekly Rankings** - Fresh competition each week
- **Medals** - Gold 🥇, Silver 🥈, Bronze 🥉 for top 3 users
- **Your Position** - See where you stand at a glance

### Earn Points (Activities)
Complete various activities to earn points:
- **Daily Login** - 10 pts
- **Share Profile** - 50 pts
- **Refer Friend** - 100 pts per referral
- **Complete Tasks** - 25 pts
- **7-Day Streak** - 200 pts bonus
- **Top 10 Rank** - 150 pts achievement

### Rewards Store
Redeem points for exclusive rewards:

**Bronze Tier** (100-200 pts)
- 5% Discount codes
- Early access to features

**Silver Tier** (250-300 pts)
- Exclusive NFTs
- VIP badges

**Gold Tier** (500-1000 pts)
- 100 USDC on Base
- Premium lifetime membership

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Blockchain**: Farcaster MiniKit + OnchainKit (Base network)
- **Styling**: CSS Modules with modern gradients & glassmorphism
- **State Management**: React hooks + API integration
- **Authentication**: Farcaster MiniKit with auto-connect

## 📁 Project Structure

```
app/
├── page.tsx                 # Dashboard home
├── page.module.css          # Dashboard styles
├── leaderboard/
│   ├── page.tsx            # Leaderboard page
│   └── leaderboard.module.css
├── activities/
│   ├── page.tsx            # Activities/earn page
│   └── activities.module.css
├── rewards/
│   ├── page.tsx            # Rewards marketplace
│   └── rewards.module.css
├── api/
│   ├── users/[fid]/        # User stats endpoint
│   ├── leaderboard/        # Leaderboard data
│   ├── activities/[fid]/   # Activities for user
│   ├── claim-points/       # Claim activity rewards
│   ├── rewards/            # List all rewards
│   └── redeem-reward/      # Redeem points for rewards
├── rootProvider.tsx        # OnchainKit provider setup
└── globals.css             # Global styles

minikit.config.ts          # Mini app configuration
package.json               # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ and npm 9+
- Farcaster account
- Base network wallet (for production rewards)

### Installation

1. **Install dependencies**
```bash
cd /workspaces/base_app
npm install
```

2. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_URL=http://localhost:3000
```

3. **Run development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📝 API Endpoints

### User Stats
```
GET /api/users/[fid]
POST /api/users/[fid]  # Update user stats
```

### Leaderboard
```
GET /api/leaderboard?period=all-time|weekly
```

### Activities
```
GET /api/activities/[fid]  # Get user's activities
POST /api/claim-points     # Claim points for activity
```

### Rewards
```
GET /api/rewards           # Get all rewards
POST /api/redeem-reward    # Redeem points for reward
```

## 🎨 Design Features

- **Base Blue Gradient** - Professional gradient (0052FF → 0652BA)
- **Golden Accents** - Points and achievements in gold/orange
- **Glassmorphism UI** - Frosted glass effect cards with backdrop blur
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Hover effects and transitions

## 🔄 User Flow

1. User loads mini app → Auto-connects with Farcaster
2. Dashboard shows personal stats and ranking
3. Navigate to Activities to earn points
4. Check Leaderboard for competition
5. Redeem points at Rewards store

## 📊 Mock Data

The app comes with pre-populated mock data for testing:
- 8 sample users with varying points
- Activity system with mock claim logic
- Reward marketplace with 6 items
- All-time and weekly leaderboards

For production, replace mock endpoints with:
- Real database (PostgreSQL, MongoDB, etc.)
- Transaction verification on Base blockchain
- Email confirmations for rewards
- NFT minting integration

## 🔐 Security Considerations

- Verify FID signatures with Farcaster
- Validate points claims server-side
- Rate-limit activity claims per user
- Secure reward distribution logic
- Validate blockchain transactions

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Connect your Git repo to Vercel
# Set environment variables in Vercel dashboard
vercel
```

### Configure for Base Mini App

1. Update `minikit.config.ts` with production URLs
2. Add official app icons (3 sizes: 192px, 512px, avatar)
3. Register app with Farcaster Mini App registry
4. Set up webhook for user events

## 📈 Future Enhancements

- [ ] NFT rewards with automatic minting
- [ ] Blockchain transactions for rewards
- [ ] Real database backend
- [ ] Referral link system
- [ ] Social sharing integration
- [ ] Push notifications
- [ ] Custom achievement badges
- [ ] Point expiration/decay
- [ ] Seasonal competitions
- [ ] User badges & titles

## 💡 Tips for Customization

1. **Colors**: Update gradient in page.module.css
2. **Points Values**: Edit `/api/activities/[fid]/route.ts`
3. **Rewards**: Modify `/api/rewards/route.ts`
4. **Mini App Name**: Change in `minikit.config.ts`
5. **Activities**: Add new activities in activities data

## 🤝 Contributing

To improve the app:
1. Test all API endpoints
2. Verify mobile responsiveness
3. Check accessibility (WCAG 2.1)
4. Test with real Farcaster accounts
5. Benchmark performance

## 📄 License

MIT

## 🙋 Support

For issues or questions:
1. Check API responses in browser dev tools
2. Review console logs for errors
3. Verify FID context is available
4. Test with Farcaster debugger tools

---

**Built with ❤️ on Base using Farcaster MiniKit**  

---
