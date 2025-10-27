"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import styles from "./rewards.module.css";

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  tier: "bronze" | "silver" | "gold";
  available: boolean;
}

export default function Rewards() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    // Use mock FID for development if context not available
    const fid = context?.user?.fid || 1;

    const fetchRewardsData = async () => {
      try {
        const [userRes, rewardsRes] = await Promise.all([
          fetch(`/api/users/${fid}`),
          fetch("/api/rewards"),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserPoints(userData.points);
        }

        if (rewardsRes.ok) {
          const rewardsData = await rewardsRes.json();
          setRewards(rewardsData.rewards || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsData();
  }, [context?.user?.fid]);

  const handleRedeemReward = async (reward: Reward) => {
    if (userPoints < reward.cost) {
      alert("Not enough points!");
      return;
    }

    try {
      const response = await fetch("/api/redeem-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: context?.user?.fid,
          rewardId: reward.id,
        }),
      });

      if (response.ok) {
        alert("Reward redeemed! Check your email for details.");
        setUserPoints((prev) => prev - reward.cost);
      }
    } catch (error) {
      console.error("Failed to redeem reward:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>Loading rewards...</div>
      </div>
    );
  }

  const bronzeRewards = rewards.filter((r) => r.tier === "bronze");
  const silverRewards = rewards.filter((r) => r.tier === "silver");
  const goldRewards = rewards.filter((r) => r.tier === "gold");

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back
        </Link>
        <h1 className={styles.title}>🎁 Rewards Store</h1>
        <p className={styles.subtitle}>Redeem your hard-earned points</p>
      </div>

      {/* Points Balance */}
      <div className={styles.pointsBalance}>
        <div className={styles.balanceLabel}>Available Points</div>
        <div className={styles.balanceValue}>{userPoints}</div>
      </div>

      {/* Rewards Sections */}
      {bronzeRewards.length > 0 && (
        <RewardsSection
          tier="bronze"
          title="🥉 Bronze Rewards"
          rewards={bronzeRewards}
          userPoints={userPoints}
          onRedeem={handleRedeemReward}
        />
      )}

      {silverRewards.length > 0 && (
        <RewardsSection
          tier="silver"
          title="🥈 Silver Rewards"
          rewards={silverRewards}
          userPoints={userPoints}
          onRedeem={handleRedeemReward}
        />
      )}

      {goldRewards.length > 0 && (
        <RewardsSection
          tier="gold"
          title="🥇 Gold Rewards"
          rewards={goldRewards}
          userPoints={userPoints}
          onRedeem={handleRedeemReward}
        />
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/activities" className={styles.navLink}>
          Earn More
        </Link>
      </div>
    </div>
  );
}

function RewardsSection({
  tier,
  title,
  rewards,
  userPoints,
  onRedeem,
}: {
  tier: "bronze" | "silver" | "gold";
  title: string;
  rewards: Reward[];
  userPoints: number;
  onRedeem: (reward: Reward) => void;
}) {
  return (
    <div className={styles[`section_${tier}`]}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.rewardsGrid}>
        {rewards.map((reward) => {
          const canRedeem = userPoints >= reward.cost && reward.available;

          return (
            <div key={reward.id} className={styles.rewardCard}>
              <div className={styles.rewardIcon}>{reward.icon}</div>
              <h3 className={styles.rewardTitle}>{reward.title}</h3>
              <p className={styles.rewardDescription}>{reward.description}</p>

              <div className={styles.rewardCost}>
                <span className={styles.costValue}>{reward.cost}</span>
                <span className={styles.costLabel}>pts</span>
              </div>

              <button
                className={`${styles.redeemButton} ${
                  !canRedeem ? styles.disabled : ""
                }`}
                onClick={() => onRedeem(reward)}
                disabled={!canRedeem}
              >
                {!reward.available
                  ? "Coming Soon"
                  : userPoints < reward.cost
                  ? "Not Enough"
                  : "Redeem"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
