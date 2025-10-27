"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import styles from "./page.module.css";

interface UserStats {
  fid: number;
  displayName: string;
  points: number;
  rank: number;
  streak: number;
  weeklyPoints: number;
  totalReferrals: number;
}

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextMilestone, setNextMilestone] = useState(0);

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Fetch user stats
  useEffect(() => {
    // Use mock FID for development if context not available
    const fid = context?.user?.fid || 1;

    const fetchUserStats = async () => {
      try {
        const response = await fetch(`/api/users/${fid}`);
        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
          // Calculate next milestone (every 100 points)
          const next = Math.ceil((data.points + 1) / 100) * 100;
          setNextMilestone(next);
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [context?.user?.fid]);

  const progressPercentage = userStats
    ? ((userStats.points % 100) / 100) * 100
    : 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>Loading your stats...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>PointsUp</h1>
        <p className={styles.subtitle}>Earn. Compete. Reward.</p>
      </div>

      {/* User Stats Card */}
      <div className={styles.statsCard}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {context?.user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className={styles.userDetails}>
            <h2>{context?.user?.displayName || "User"}</h2>
            <p className={styles.rank}>Rank #{userStats?.rank || "N/A"}</p>
          </div>
        </div>

        <div className={styles.pointsDisplay}>
          <div className={styles.pointsValue}>{userStats?.points || 0}</div>
          <div className={styles.pointsLabel}>Total Points</div>
        </div>

        <div className={styles.weeklyStats}>
          <div className={styles.stat}>
            <span className={styles.label}>Weekly</span>
            <span className={styles.value}>{userStats?.weeklyPoints || 0} pts</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Streak</span>
            <span className={styles.value}>{userStats?.streak || 0} 🔥</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Referrals</span>
            <span className={styles.value}>{userStats?.totalReferrals || 0}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            Next Milestone: {nextMilestone} pts
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {userStats?.points || 0} / {nextMilestone}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className={styles.navigation}>
        <Link href="/leaderboard" className={styles.navButton}>
          <span className={styles.icon}>🏆</span>
          <span>Leaderboard</span>
        </Link>
        <Link href="/activities" className={styles.navButton}>
          <span className={styles.icon}>⚡</span>
          <span>Earn Points</span>
        </Link>
        <Link href="/rewards" className={styles.navButton}>
          <span className={styles.icon}>🎁</span>
          <span>Rewards</span>
        </Link>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <h3>How It Works</h3>
        <ul>
          <li>Complete activities to earn points</li>
          <li>Climb the leaderboard weekly</li>
          <li>Redeem points for exclusive rewards</li>
          <li>Maintain your streak for bonus multipliers</li>
        </ul>
      </div>
    </div>
  );
}
