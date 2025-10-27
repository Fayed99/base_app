/**
 * Edge Config Utilities
 * 
 * Helper functions to easily access Edge Config values
 * throughout your application
 */

// @ts-expect-error - Available at runtime on Vercel
import { get } from '@vercel/edge-config';

/**
 * Get feature flags from Edge Config
 * Example: await getFeatureFlags() => { maintenanceMode: false, newUI: true }
 */
export async function getFeatureFlags() {
  try {
    const flags = await get('featureFlags');
    return flags || {};
  } catch {
    console.log('Feature flags not available');
    return {};
  }
}

/**
 * Get reward configuration from Edge Config
 * Example: await getRewardConfig() => { maxRedeemPerDay: 5, ... }
 */
export async function getRewardConfig() {
  try {
    const config = await get('rewardConfig');
    return config || {};
  } catch {
    console.log('Reward config not available');
    return {};
  }
}

/**
 * Get activity configuration from Edge Config
 * Example: await getActivityConfig() => { dailyLoginPoints: 10, ... }
 */
export async function getActivityConfig() {
  try {
    const config = await get('activityConfig');
    return config || {};
  } catch {
    console.log('Activity config not available');
    return {};
  }
}

/**
 * Check if a feature is enabled
 */
export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  try {
    const flags = await getFeatureFlags();
    return (flags as Record<string, boolean>)[featureName] ?? false;
  } catch {
    return false;
  }
}
