export type SubscriptionTier = 'free' | 'plantly_plus';

export interface EntitlementConfig {
  maxPlants: number;
  monthlyAiScans: number;
  unlimitedCarePlans: boolean;
  exportDataEnabled: boolean;
  priorityAiSupport: boolean;
}

export const TIER_CONFIGS: Record<SubscriptionTier, EntitlementConfig> = {
  free: {
    maxPlants: 5,
    monthlyAiScans: 10,
    unlimitedCarePlans: false,
    exportDataEnabled: true,
    priorityAiSupport: false,
  },
  plantly_plus: {
    maxPlants: Infinity,
    monthlyAiScans: 250,
    unlimitedCarePlans: true,
    exportDataEnabled: true,
    priorityAiSupport: true,
  },
};

export function canAddPlant(currentPlantCount: number, tier: SubscriptionTier): { allowed: boolean; limit: number; remaining: number } {
  const config = TIER_CONFIGS[tier];
  const limit = config.maxPlants;
  const remaining = Math.max(0, limit - currentPlantCount);
  return {
    allowed: currentPlantCount < limit,
    limit,
    remaining,
  };
}

export function canPerformAiScan(scansUsed: number, tier: SubscriptionTier): { allowed: boolean; limit: number; remaining: number } {
  const config = TIER_CONFIGS[tier];
  const limit = config.monthlyAiScans;
  const remaining = Math.max(0, limit - scansUsed);
  return {
    allowed: scansUsed < limit,
    limit,
    remaining,
  };
}
