import { NextResponse } from "next/server";
import { getUserActivities } from "@/lib/db";

export async function GET(
  _request: unknown,
  { params }: { params: Promise<{ fid: string }> }
) {
  try {
    const { fid: fidStr } = await params;
    const fid = parseInt(fidStr, 10);
    if (isNaN(fid)) {
      return NextResponse.json({ error: "Invalid FID" }, { status: 400 });
    }

    const activities = await getUserActivities(fid);

    return NextResponse.json({
      activities,
      fid,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
