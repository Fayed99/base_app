import { NextRequest, NextResponse } from "next/server";
import { addPointsToUser } from "@/lib/db";

// Activity points mapping
const activityPoints: Record<string, number> = {
  "daily-login": 10,
  "share-profile": 50,
  "refer-friend": 100,
  "complete-task": 25,
  "streak-bonus": 200,
  "leaderboard-top10": 150,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, activityId } = body;

    if (!fid || !activityId) {
      return NextResponse.json(
        { error: "Missing required fields: fid, activityId" },
        { status: 400 }
      );
    }

    const points = activityPoints[activityId];
    if (!points) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    // Add points to user in database
    await addPointsToUser(fid, points, activityId);

    return NextResponse.json({
      success: true,
      message: `Claimed ${points} points for activity ${activityId}`,
      pointsAwarded: points,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error claiming points:", error);
    return NextResponse.json(
      { error: "Failed to claim points" },
      { status: 500 }
    );
  }
}
