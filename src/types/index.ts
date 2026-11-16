export type IdentificationStatus = 'manual' | 'suggested' | 'confirmed' | 'unverified';
export type ConfidenceTier = 'high' | 'medium' | 'low';
export type PlantHealthStatus = 'healthy' | 'good' | 'needs_attention';

export interface Plant {
  id: string;
  name: string; // User-facing chosen nickname/name
  commonName: string;
  scientificName: string;
  identificationStatus: IdentificationStatus;
  identificationConfidence?: number; // 0 - 100
  imageUrl: string;
  locationLabel: string; // e.g. "Living Room", "East Window", "Balcony"
  lightLevel: 'low' | 'bright_indirect' | 'direct' | 'medium';
  humidityNeeds?: string; // e.g. "40-60%"
  potType?: string; // e.g. "Terracotta with drainage", "Ceramic"
  soilType?: string; // e.g. "Aroid mix / well-draining"
  notes?: string;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CareTaskType =
  | 'water'
  | 'soil_check'
  | 'light'
  | 'fertilize'
  | 'mist'
  | 'rotate'
  | 'prune'
  | 'inspect';

export interface CareSchedule {
  id: string;
  plantId: string;
  taskType: CareTaskType;
  intervalDays: number;
  localTime: string;
  enabled: boolean;
  minIntervalDays?: number;
  maxIntervalDays?: number;
  description?: string;
}

export interface CareTask {
  id: string;
  plantId: string;
  scheduleId?: string;
  taskType: CareTaskType;
  title: string;
  instructions: string;
  dueAt: string;
  status: 'due' | 'completed' | 'snoozed' | 'skipped';
  completedAt?: string;
  snoozedUntil?: string;
  notes?: string;
}

export interface CareLog {
  id: string;
  plantId: string;
  taskId?: string;
  actionType: CareTaskType;
  notes?: string;
  observedAt: string;
}

export interface AiIdentificationCandidate {
  commonName: string;
  scientificName: string;
  confidenceTier: ConfidenceTier;
  confidenceScore: number; // e.g. 92
  basis: string;
  careBasics: {
    watering: string;
    light: string;
    humidity: string;
    intervalDays: number;
  };
}

export interface AiAssessmentResult {
  id: string;
  kind: 'identification' | 'symptom_analysis';
  status: 'identified' | 'candidate_list' | 'needs_more_information' | 'unsupported';
  imageUrl?: string;
  plantId?: string;
  candidates?: AiIdentificationCandidate[];
  observations?: string[];
  possibleCauses?: {
    cause: string;
    confidenceTier: ConfidenceTier;
    explanation: string;
  }[];
  followUpQuestions?: string[];
  safeNextSteps?: string[];
  safetyNote?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  plantContextId?: string;
  actionableSteps?: string[];
  timestamp: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  timezone: string;
  preferredUnits: 'metric' | 'imperial';
  theme: 'system' | 'light' | 'dark';
  subscriptionTier: 'free' | 'plantly_plus';
  scansUsedThisMonth: number;
  notificationsEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}
