"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import styles from "./leaderboard.module.css";

interface LeaderboardEntry {
  fid: number;
  displayName: string;
  points: number;
  rank: number;
  weeklyPoints: number;
  streak: number;
}

export default function Leaderboard() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all-time" | "weekly">("all-time");

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard?period=${filter}`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data.entries || []);
          
          // Find current user in leaderboard
          if (context?.user?.fid) {
            const user = data.entries?.find(
              (entry: LeaderboardEntry) => entry.fid === context.user.fid
            );
            setUserRank(user || null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [context?.user?.fid, filter]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FFD700"; // Gold
    if (rank === 2) return "#C0C0C0"; // Silver
    if (rank === 3) return "#CD7F32"; // Bronze
    return "rgba(255, 255, 255, 0.7)";
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back
        </Link>
        <h1 className={styles.title}>🏆 Leaderboard</h1>
        <p className={styles.subtitle}>Top Performers This {filter === "weekly" ? "Week" : "Season"}</p>
      </div>

      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterBtn} ${filter === "all-time" ? styles.active : ""}`}
          onClick={() => setFilter("all-time")}
        >
          All Time
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "weekly" ? styles.active : ""}`}
          onClick={() => setFilter("weekly")}
        >
          This Week
        </button>
      </div>

      {/* User's Current Rank */}
      {userRank && (
        <div className={styles.userRankCard}>
          <p className={styles.yourRankLabel}>YOUR POSITION</p>
          <div className={styles.userRankContent}>
            <div className={styles.userRankRank}>#{userRank.rank}</div>
            <div className={styles.userRankInfo}>
              <h3>{userRank.displayName}</h3>
              <p>{userRank.points} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className={styles.leaderboardList}>
        {leaderboard.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No leaderboard data available yet.</p>
            <p className={styles.emptySubtext}>Be the first to earn points!</p>
          </div>
        ) : (
          leaderboard.map((entry) => {
            const isCurrentUser = entry.fid === context?.user?.fid;
            const medal = getMedalEmoji(entry.rank);
            const medalColor = getRankColor(entry.rank);

            return (
              <div
                key={entry.fid}
                className={`${styles.entry} ${isCurrentUser ? styles.currentUser : ""}`}
              >
                <div className={styles.rank} style={{ color: medalColor }}>
                  {medal ? (
                    <span className={styles.medal}>{medal}</span>
                  ) : (
                    <span>#{entry.rank}</span>
                  )}
                </div>

                <div className={styles.entryInfo}>
                  <div className={styles.avatar}>
                    {entry.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.details}>
                    <h3 className={styles.name}>
                      {entry.displayName}
                      {isCurrentUser && <span className={styles.badge}>You</span>}
                    </h3>
                    <div className={styles.stats}>
                      <span>{entry.points} pts</span>
                      {entry.streak > 0 && <span>🔥 {entry.streak}</span>}
                    </div>
                  </div>
                </div>

                <div className={styles.entryPoints}>
                  <div className={styles.pointsValue}>{entry.points}</div>
                  <div className={styles.pointsLabel}>pts</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Navigation */}
      <div className={styles.footer}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/activities" className={styles.navLink}>
          Earn Points
        </Link>
      </div>
    </div>
  );
}
