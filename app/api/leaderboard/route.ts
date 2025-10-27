import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const period = (request.nextUrl.searchParams.get("period") as "all-time" | "weekly") || "all-time";

    const entries = await getLeaderboard(period);

    return NextResponse.json({
      entries,
      period,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
