const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "1",
    name: "PointsUp", 
    subtitle: "Engage & Earn Rewards", 
    description: "Compete on the leaderboard and earn loyalty points for your actions",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0052FF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["loyalty", "gamification", "leaderboard", "rewards"],
    heroImageUrl: `${ROOT_URL}/splash.png`, 
    tagline: "Climb the ranks and earn rewards",
    ogTitle: "PointsUp - Leaderboard Loyalty App",
    ogDescription: "Compete on the leaderboard and earn loyalty points for your actions",
    ogImageUrl: `${ROOT_URL}/splash.png`,
  },
} as const;

