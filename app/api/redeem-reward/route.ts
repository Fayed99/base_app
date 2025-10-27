import { NextRequest, NextResponse } from "next/server";
import { redeemReward, getUserStats } from "@/lib/db";

// Reward definitions with costs
const rewards: Record<
  string,
  { title: string; cost: number; tier: string }
> = {
  "5-usdc": { title: "$5 USDC", cost: 500, tier: "bronze" },
  "coffee-coupon": { title: "Coffee Coupon", cost: 300, tier: "bronze" },
  "10-usdc": { title: "$10 USDC", cost: 1000, tier: "silver" },
  "nft-pass": { title: "NFT Pass", cost: 750, tier: "silver" },
  "100-usdc": { title: "$100 USDC", cost: 5000, tier: "gold" },
  "exclusive-nft": { title: "Exclusive NFT", cost: 2000, tier: "gold" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, rewardId } = body;

    if (!fid || !rewardId) {
      return NextResponse.json(
        { error: "Missing required fields: fid, rewardId" },
        { status: 400 }
      );
    }

    const reward = rewards[rewardId];
    if (!reward) {
      return NextResponse.json(
        { error: "Invalid reward ID" },
        { status: 400 }
      );
    }

    // Check user has enough points
    const userStats = await getUserStats(fid);
    if (userStats.points < reward.cost) {
      return NextResponse.json(
        {
          error: "Insufficient points",
          required: reward.cost,
          available: userStats.points,
        },
        { status: 400 }
      );
    }

    // Deduct points and record redemption
    await redeemReward(fid, rewardId, reward.cost);

    return NextResponse.json({
      success: true,
      message: `Reward ${reward.title} redeemed successfully`,
      rewardId,
      pointsDeducted: reward.cost,
      rewardTitle: reward.title,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return NextResponse.json(
      { error: "Failed to redeem reward" },
      { status: 500 }
    );
  }
}
