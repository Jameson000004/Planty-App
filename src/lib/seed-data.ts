import { Plant, CareSchedule, CareTask, CareLog, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_default',
  displayName: 'Alex',
  email: 'alex@example.com',
  timezone: 'America/Los_Angeles',
  preferredUnits: 'metric',
  theme: 'system',
  subscriptionTier: 'free',
  scansUsedThisMonth: 3,
  notificationsEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
};

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plant-monstera',
    name: 'Monstera deliciosa',
    commonName: 'Swiss Cheese Plant',
    scientificName: 'Monstera deliciosa',
    identificationStatus: 'confirmed',
    identificationConfidence: 94,
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    locationLabel: 'Living Room (East window)',
    lightLevel: 'bright_indirect',
    humidityNeeds: '40-60%',
    potType: 'Terracotta with drainage hole',
    soilType: 'Chunky aroid mix (perlite, orchid bark, peat)',
    notes: 'Produces beautiful fenestrations when given morning sunlight. Clean leaves monthly.',
    acquiredAt: '2026-03-15T00:00:00Z',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-10-23T14:30:00Z',
  },
  {
    id: 'plant-pothos',
    name: 'Pothos',
    commonName: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    identificationStatus: 'confirmed',
    identificationConfidence: 96,
    imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
    locationLabel: 'Home Office Bookshelf',
    lightLevel: 'medium',
    humidityNeeds: '40-50%',
    potType: 'Glazed Ceramic with saucer',
    soilType: 'Standard potting mix with pumice',
    notes: 'Fast trailing vine. Cuttings root quickly in water.',
    acquiredAt: '2026-04-10T00:00:00Z',
    createdAt: '2026-04-10T12:00:00Z',
    updatedAt: '2026-10-22T09:15:00Z',
  },
  {
    id: 'plant-zz',
    name: 'ZZ Plant',
    commonName: 'Zanzibar Gem',
    scientificName: 'Zamioculcas zamiifolia',
    identificationStatus: 'confirmed',
    identificationConfidence: 98,
    imageUrl: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800&q=80',
    locationLabel: 'Bedroom Corner',
    lightLevel: 'low',
    humidityNeeds: '30-50%',
    potType: 'Matte Clay',
    soilType: 'Cactus/succulent blend with coarse sand',
    notes: 'Very drought tolerant rhizome plant. Thrives on minimal care.',
    acquiredAt: '2026-05-02T00:00:00Z',
    createdAt: '2026-05-02T16:00:00Z',
    updatedAt: '2026-10-20T11:00:00Z',
  },
  {
    id: 'plant-snake',
    name: 'Snake Plant',
    commonName: 'Mother-in-law’s Tongue',
    scientificName: 'Dracaena trifasciata',
    identificationStatus: 'confirmed',
    identificationConfidence: 97,
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
    locationLabel: 'Hallway Entryway',
    lightLevel: 'low',
    humidityNeeds: '30-40%',
    potType: 'Modern Cylinder Planter',
    soilType: 'Gritty porous succulent soil',
    notes: 'Yellow edges noticed recently; moving closer to diffuse natural light.',
    acquiredAt: '2026-01-20T00:00:00Z',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-10-23T18:00:00Z',
  },
];

export const INITIAL_SCHEDULES: CareSchedule[] = [
  // Monstera
  {
    id: 'sched-m-water',
    plantId: 'plant-monstera',
    taskType: 'water',
    intervalDays: 8,
    minIntervalDays: 7,
    maxIntervalDays: 10,
    localTime: '09:00',
    enabled: true,
    description: 'Every 7-10 days',
  },
  {
    id: 'sched-m-light',
    plantId: 'plant-monstera',
    taskType: 'light',
    intervalDays: 14,
    localTime: '10:00',
    enabled: true,
    description: 'Bright, indirect',
  },
  {
    id: 'sched-m-mist',
    plantId: 'plant-monstera',
    taskType: 'mist',
    intervalDays: 3,
    localTime: '09:00',
    enabled: true,
    description: '40-60% humidity',
  },
  {
    id: 'sched-m-fertilize',
    plantId: 'plant-monstera',
    taskType: 'fertilize',
    intervalDays: 30,
    minIntervalDays: 28,
    maxIntervalDays: 42,
    localTime: '11:00',
    enabled: true,
    description: 'Every 4-6 weeks',
  },
  // Pothos
  {
    id: 'sched-p-soil',
    plantId: 'plant-pothos',
    taskType: 'soil_check',
    intervalDays: 5,
    localTime: '09:00',
    enabled: true,
    description: 'Check soil moisture',
  },
  {
    id: 'sched-p-water',
    plantId: 'plant-pothos',
    taskType: 'water',
    intervalDays: 7,
    localTime: '09:00',
    enabled: true,
    description: 'Weekly watering',
  },
  // ZZ
  {
    id: 'sched-z-water',
    plantId: 'plant-zz',
    taskType: 'water',
    intervalDays: 21,
    localTime: '09:00',
    enabled: true,
    description: 'Every 3 weeks',
  },
  {
    id: 'sched-z-fertilize',
    plantId: 'plant-zz',
    taskType: 'fertilize',
    intervalDays: 35,
    localTime: '10:00',
    enabled: true,
    description: 'Every 4-6 weeks',
  },
  // Snake
  {
    id: 'sched-s-light',
    plantId: 'plant-snake',
    taskType: 'light',
    intervalDays: 14,
    localTime: '10:00',
    enabled: true,
    description: 'Light check every 2 weeks',
  },
];

// Current date anchor matching the design showcase
const today = new Date();
const todayIso = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0).toISOString();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowIso = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0, 0).toISOString();

const in3Days = new Date(today);
in3Days.setDate(in3Days.getDate() + 3);
const in3DaysIso = new Date(in3Days.getFullYear(), in3Days.getMonth(), in3Days.getDate(), 10, 0, 0).toISOString();

const in5Days = new Date(today);
in5Days.setDate(in5Days.getDate() + 5);
const in5DaysIso = new Date(in5Days.getFullYear(), in5Days.getMonth(), in5Days.getDate(), 11, 0, 0).toISOString();

export const INITIAL_TASKS: CareTask[] = [
  {
    id: 'task-1',
    plantId: 'plant-monstera',
    scheduleId: 'sched-m-water',
    taskType: 'water',
    title: 'Water Monstera deliciosa',
    instructions: 'Check soil first with finger or moisture meter. If top 2 inches feel dry, water thoroughly until liquid drains.',
    dueAt: todayIso,
    status: 'due',
  },
  {
    id: 'task-2',
    plantId: 'plant-pothos',
    scheduleId: 'sched-p-soil',
    taskType: 'soil_check',
    title: 'Check soil Pothos',
    instructions: 'Touch soil surface. Pothos prefers soil to slightly dry out between waterings to prevent root rot.',
    dueAt: tomorrowIso,
    status: 'due',
  },
  {
    id: 'task-3',
    plantId: 'plant-snake',
    scheduleId: 'sched-s-light',
    taskType: 'light',
    title: 'Light check Snake Plant',
    instructions: 'Inspect foliage for color fading or stretching. Rotate pot 90 degrees for even light exposure.',
    dueAt: in3DaysIso,
    status: 'due',
  },
  {
    id: 'task-4',
    plantId: 'plant-zz',
    scheduleId: 'sched-z-fertilize',
    taskType: 'fertilize',
    title: 'Fertilize ZZ Plant',
    instructions: 'Apply gentle, balanced liquid houseplant fertilizer diluted to half strength on moist soil.',
    dueAt: in5DaysIso,
    status: 'due',
  },
];

export const INITIAL_LOGS: CareLog[] = [
  {
    id: 'log-1',
    plantId: 'plant-monstera',
    actionType: 'mist',
    notes: 'Misted aerial roots and cleaned leaves with damp microfiber cloth.',
    observedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-2',
    plantId: 'plant-pothos',
    actionType: 'water',
    notes: 'Watered with room temperature filtered water.',
    observedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-3',
    plantId: 'plant-zz',
    actionType: 'rotate',
    notes: 'Quarter turn towards east light window.',
    observedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
  },
];
