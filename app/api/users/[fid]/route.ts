import { NextRequest, NextResponse } from "next/server";
import { getUserStats, addPointsToUser } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const fid = parseInt(params.fid, 10);
    if (isNaN(fid)) {
      return NextResponse.json(
        { error: "Invalid FID" },
        { status: 400 }
      );
    }

    const stats = await getUserStats(fid);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const fid = parseInt(params.fid, 10);
    const body = await request.json();
    const { points, activityType } = body;

    if (isNaN(fid) || !points || !activityType) {
      return NextResponse.json(
        { error: "Invalid FID, points, or activityType" },
        { status: 400 }
      );
    }

    const stats = await addPointsToUser(fid, points, activityType);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error updating user stats:", error);
    return NextResponse.json(
      { error: "Failed to update user stats" },
      { status: 500 }
    );
  }
}
