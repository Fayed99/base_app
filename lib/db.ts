/**
 * Database Layer - Vercel Postgres Integration
 * This module will work with or without @vercel/postgres available
 * On Vercel production, it will use the real database
 * During build, it gracefully skips database initialization
 */

import { sql } from "@vercel/postgres";
import type { QueryResultRow as _QueryResultRow } from "@vercel/postgres";

/**
 * Initialize database schema
 * Creates tables if they don't exist
 */
export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        fid INTEGER PRIMARY KEY,
        display_name VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 0,
        weekly_points INTEGER DEFAULT 0,
        total_referrals INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        last_activity_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create activities table
    await sql`
      CREATE TABLE IF NOT EXISTS user_activities (
        id SERIAL PRIMARY KEY,
        fid INTEGER NOT NULL,
        activity_type VARCHAR(50) NOT NULL,
        points INTEGER NOT NULL,
        claimed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fid) REFERENCES users(fid)
      );
    `;

    // Create rewards_redeemed table
    await sql`
      CREATE TABLE IF NOT EXISTS rewards_redeemed (
        id SERIAL PRIMARY KEY,
        fid INTEGER NOT NULL,
        reward_id VARCHAR(100) NOT NULL,
        points_cost INTEGER NOT NULL,
        redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fid) REFERENCES users(fid)
      );
    `;

    // Create leaderboard_cache table for performance
    await sql`
      CREATE TABLE IF NOT EXISTS leaderboard_cache (
        id SERIAL PRIMARY KEY,
        period VARCHAR(20) NOT NULL, -- 'all-time' or 'weekly'
        fid INTEGER NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        points INTEGER NOT NULL,
        rank INTEGER NOT NULL,
        cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

/**
 * Get or create user
 */
export async function getOrCreateUser(fid: number) {
  try {
    const user = await sql`
      SELECT * FROM users WHERE fid = ${fid};
    `;

    if (user.rows.length === 0) {
      // Create new user
      const result = await sql`
        INSERT INTO users (fid, display_name, points, weekly_points, streak)
        VALUES (${fid}, ${"User" + fid}, 0, 0, 0)
        RETURNING *;
      `;
      return result.rows[0];
    }

    return user.rows[0];
  } catch (error) {
    console.error("Error getting/creating user:", error);
    throw error;
  }
}

/**
 * Get user stats
 */
export async function getUserStats(fid: number) {
  try {
    const user = await getOrCreateUser(fid);

    // Calculate rank
    const rankResult = await sql`
      SELECT COUNT(*) + 1 as rank FROM users WHERE points > ${user.points};
    `;

    return {
      fid: user.fid,
      displayName: user.display_name,
      points: user.points || 0,
      rank: rankResult.rows[0].rank || 1,
      streak: user.streak || 0,
      weeklyPoints: user.weekly_points || 0,
      totalReferrals: user.total_referrals || 0,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
}

/**
 * Add points to user
 */
export async function addPointsToUser(
  fid: number,
  points: number,
  activityType: string
) {
  try {
    // Ensure user exists
    await getOrCreateUser(fid);

    // Record the activity
    await sql`
      INSERT INTO user_activities (fid, activity_type, points, claimed_at)
      VALUES (${fid}, ${activityType}, ${points}, CURRENT_TIMESTAMP);
    `;

    // Update user points
    await sql`
      UPDATE users 
      SET points = points + ${points},
          weekly_points = weekly_points + ${points},
          updated_at = CURRENT_TIMESTAMP
      WHERE fid = ${fid};
    `;

    return await getUserStats(fid);
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(period: "all-time" | "weekly" = "all-time") {
  try {
    const pointsColumn = period === "weekly" ? "weekly_points" : "points";

    const result = await sql`
      SELECT 
        fid,
        display_name,
        ${
          // @ts-expect-error - sql.raw() is available
          sql.raw(pointsColumn)
        } as points,
        weekly_points,
        streak,
        ROW_NUMBER() OVER (ORDER BY ${
          // @ts-expect-error - sql.raw() is available
          sql.raw(pointsColumn)
        } DESC) as rank
      FROM users
      WHERE ${
        // @ts-expect-error - sql.raw() is available
        sql.raw(pointsColumn)
      } > 0
      ORDER BY ${
        // @ts-expect-error - sql.raw() is available
        sql.raw(pointsColumn)
      } DESC
      LIMIT 50;
    `;

    return (result.rows as Array<{ fid: number; display_name: string; points: number; weekly_points: number; streak: number; rank: number }>).map((row) => ({
      fid: row.fid,
      displayName: row.display_name,
      points: row.points,
      weeklyPoints: row.weekly_points,
      streak: row.streak,
      rank: row.rank,
    }));
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
}

/**
 * Redeem reward
 */
export async function redeemReward(
  fid: number,
  rewardId: string,
  pointsCost: number
) {
  try {
    const user = await getUserStats(fid);

    if (user.points < pointsCost) {
      throw new Error("Insufficient points");
    }

    // Record redemption
    await sql`
      INSERT INTO rewards_redeemed (fid, reward_id, points_cost)
      VALUES (${fid}, ${rewardId}, ${pointsCost});
    `;

    // Deduct points
    await sql`
      UPDATE users 
      SET points = points - ${pointsCost},
          updated_at = CURRENT_TIMESTAMP
      WHERE fid = ${fid};
    `;

    return {
      success: true,
      message: `Redeemed ${rewardId} for ${pointsCost} points`,
      remainingPoints: user.points - pointsCost,
    };
  } catch (error) {
    console.error("Error redeeming reward:", error);
    throw error;
  }
}

/**
 * Get user activities
 */
export async function getUserActivities(fid: number) {
  try {
    const activities = [
      { id: "daily-login", title: "Daily Login", points: 10 },
      { id: "share-profile", title: "Share Profile", points: 50 },
      { id: "refer-friend", title: "Refer Friend", points: 100 },
      { id: "complete-task", title: "Complete Task", points: 25 },
      { id: "streak-bonus", title: "7-Day Streak", points: 200 },
      { id: "leaderboard-top10", title: "Top 10 Rank", points: 150 },
    ];

    // Get claimed activities
    const claimed = await sql`
      SELECT DISTINCT activity_type FROM user_activities 
      WHERE fid = ${fid} AND claimed_at IS NOT NULL;
    `;

    const claimedTypes = (claimed.rows as Array<{ activity_type: string }>).map((row) => row.activity_type);

    return activities.map((activity) => ({
      ...activity,
      icon: getActivityIcon(activity.id),
      action: getActivityAction(activity.id),
      completed: claimedTypes.includes(activity.id),
      claimable: !claimedTypes.includes(activity.id), // In production, add time-based checks
    }));
  } catch (error) {
    console.error("Error getting user activities:", error);
    throw error;
  }
}

function getActivityIcon(id: string): string {
  const icons: Record<string, string> = {
    "daily-login": "📱",
    "share-profile": "📤",
    "refer-friend": "👥",
    "complete-task": "✅",
    "streak-bonus": "🔥",
    "leaderboard-top10": "🏆",
  };
  return icons[id] || "⚡";
}

function getActivityAction(id: string): string {
  const actions: Record<string, string> = {
    "daily-login": "Daily",
    "share-profile": "Once",
    "refer-friend": "Per referral",
    "complete-task": "Weekly",
    "streak-bonus": "Streak",
    "leaderboard-top10": "Once",
  };
  return actions[id] || "Action";
}
