import { NextResponse } from "next/server";

const mockRewards = [
  {
    id: "discount-5",
    title: "5% Discount",
    description: "5% off on next purchase",
    cost: 100,
    icon: "🏷️",
    tier: "bronze" as const,
    available: true,
  },
  {
    id: "nft-drop",
    title: "Exclusive NFT",
    description: "Limited edition NFT collectible",
    cost: 250,
    icon: "🖼️",
    tier: "silver" as const,
    available: true,
  },
  {
    id: "base-usdc",
    title: "100 USDC",
    description: "Crypto reward on Base",
    cost: 500,
    icon: "💰",
    tier: "gold" as const,
    available: true,
  },
  {
    id: "vip-badge",
    title: "VIP Badge",
    description: "Exclusive VIP status",
    cost: 300,
    icon: "⭐",
    tier: "silver" as const,
    available: true,
  },
  {
    id: "early-access",
    title: "Early Access",
    description: "First access to new features",
    cost: 200,
    icon: "🚀",
    tier: "bronze" as const,
    available: false,
  },
  {
    id: "premium-badge",
    title: "Premium Member",
    description: "Lifetime premium status",
    cost: 1000,
    icon: "👑",
    tier: "gold" as const,
    available: true,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      rewards: mockRewards,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json(
      { error: "Failed to fetch rewards" },
      { status: 500 }
    );
  }
}
