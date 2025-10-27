"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import styles from "./activities.module.css";

interface Activity {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
  claimable: boolean;
  action: string;
}

export default function Activities() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    // Use mock FID for development if context not available
    const fid = context?.user?.fid || 1;

    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/activities/${fid}`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities || []);
          setTotalEarned(data.totalEarned || 0);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [context?.user?.fid]);

  const handleClaimPoints = async (activityId: string, points: number) => {
    if (!context?.user?.fid) return;

    setClaimingId(activityId);
    try {
      const response = await fetch("/api/claim-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: context.user.fid,
          activityId,
          points,
        }),
      });

      if (response.ok) {
        // Update activity as claimed
        setActivities((prev) =>
          prev.map((act) =>
            act.id === activityId
              ? { ...act, completed: true, claimable: false }
              : act
          )
        );
        setTotalEarned((prev) => prev + points);
      }
    } catch (error) {
      console.error("Failed to claim points:", error);
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>Loading activities...</div>
      </div>
    );
  }

  const completedCount = activities.filter((a) => a.completed).length;
  const claimableCount = activities.filter((a) => a.claimable).length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back
        </Link>
        <h1 className={styles.title}>⚡ Earn Points</h1>
        <p className={styles.subtitle}>Complete activities to climb the leaderboard</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalEarned}</div>
          <div className={styles.statLabel}>Earned Today</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{completedCount}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{claimableCount}</div>
          <div className={styles.statLabel}>Claimable</div>
        </div>
      </div>

      {/* Activities List */}
      <div className={styles.activitiesList}>
        {activities.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No activities available yet.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`${styles.activityCard} ${
                activity.completed ? styles.completed : ""
              }`}
            >
              <div className={styles.activityIcon}>{activity.icon}</div>

              <div className={styles.activityContent}>
                <h3 className={styles.activityTitle}>{activity.title}</h3>
                <p className={styles.activityDescription}>
                  {activity.description}
                </p>
                <div className={styles.activityMeta}>
                  <span className={styles.action}>{activity.action}</span>
                </div>
              </div>

              <div className={styles.activityRight}>
                <div className={styles.points}>
                  <span className={styles.pointsValue}>+{activity.points}</span>
                  <span className={styles.pointsLabel}>pts</span>
                </div>

                {activity.claimable ? (
                  <button
                    className={styles.claimButton}
                    onClick={() =>
                      handleClaimPoints(activity.id, activity.points)
                    }
                    disabled={claimingId === activity.id}
                  >
                    {claimingId === activity.id ? "Claiming..." : "Claim"}
                  </button>
                ) : activity.completed ? (
                  <div className={styles.completedBadge}>✓ Claimed</div>
                ) : (
                  <div className={styles.lockedBadge}>🔒 Locked</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips Section */}
      <div className={styles.tipsBox}>
        <h3>💡 Pro Tips</h3>
        <ul>
          <li>Complete multiple activities daily for bonus multipliers</li>
          <li>Refer friends to earn bonus points</li>
          <li>Share your progress to unlock special rewards</li>
          <li>Maintain a streak for 2x point multiplier</li>
        </ul>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/leaderboard" className={styles.navLink}>
          Leaderboard
        </Link>
      </div>
    </div>
  );
}
