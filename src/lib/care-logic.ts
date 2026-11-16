export type TaskUrgency = 'overdue' | 'today' | 'tomorrow' | 'this_week' | 'upcoming' | 'completed';

export interface CareSchedule {
  id: string;
  plantId: string;
  taskType: 'water' | 'soil_check' | 'light' | 'fertilize' | 'mist' | 'rotate' | 'prune' | 'inspect';
  intervalDays: number;
  localTime: string; // e.g. "09:00"
  enabled: boolean;
  minIntervalDays?: number;
  maxIntervalDays?: number;
}

export interface CareTask {
  id: string;
  plantId: string;
  scheduleId?: string;
  taskType: CareSchedule['taskType'];
  title: string;
  instructions: string;
  dueAt: string; // ISO 8601 string
  status: 'due' | 'completed' | 'snoozed' | 'skipped';
  completedAt?: string;
  snoozedUntil?: string;
  notes?: string;
}

export interface CareLog {
  id: string;
  plantId: string;
  taskId?: string;
  actionType: CareSchedule['taskType'];
  notes?: string;
  observedAt: string;
}

/**
 * Calculates the next due date based on the completion date, interval in days,
 * and preferred local time (HH:mm). Avoids DST drift by computing calendar dates.
 */
export function calculateNextDueDate(
  completedAt: Date | string,
  intervalDays: number,
  localTime: string = '09:00'
): string {
  const baseDate = new Date(completedAt);
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + Math.max(1, intervalDays));

  const [hours, minutes] = localTime.split(':').map((num) => parseInt(num, 10) || 0);
  nextDate.setHours(hours, minutes, 0, 0);

  return nextDate.toISOString();
}

/**
 * Categorizes a task's due date relative to a reference date (defaults to now).
 */
export function getTaskUrgency(dueAtIso: string, referenceDate: Date = new Date()): TaskUrgency {
  const due = new Date(dueAtIso);
  const ref = new Date(referenceDate);

  // Normalize to calendar day boundary for fair comparison
  const refDay = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffTime = dueDay.getTime() - refDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays <= 7) return 'this_week';
  return 'upcoming';
}

/**
 * Formats a friendly interval label
 */
export function formatCareInterval(
  intervalDays: number,
  minDays?: number,
  maxDays?: number
): string {
  if (minDays && maxDays && minDays !== maxDays) {
    return `Every ${minDays}-${maxDays} days`;
  }
  if (intervalDays === 1) return 'Every day';
  if (intervalDays === 7) return 'Weekly';
  if (intervalDays === 14) return 'Every 2 weeks';
  if (intervalDays === 21) return 'Every 3 weeks';
  if (intervalDays === 28 || intervalDays === 30) return 'Monthly';
  if (intervalDays > 30 && intervalDays <= 45) return 'Every 4-6 weeks';
  return `Every ${intervalDays} days`;
}

/**
 * Returns a human-friendly due label (e.g. "Today", "Tomorrow", "In 3 days", "Overdue by 2 days")
 */
export function getDueBadgeText(dueAtIso: string, referenceDate: Date = new Date()): string {
  const urgency = getTaskUrgency(dueAtIso, referenceDate);
  const due = new Date(dueAtIso);
  const ref = new Date(referenceDate);

  const refDay = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round((dueDay.getTime() - refDay.getTime()) / (1000 * 60 * 60 * 24));

  switch (urgency) {
    case 'overdue':
      return Math.abs(diffDays) === 1 ? 'Overdue (1 day)' : `Overdue (${Math.abs(diffDays)} days)`;
    case 'today':
      return 'Today';
    case 'tomorrow':
      return 'Tomorrow';
    case 'this_week': {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return weekdays[due.getDay()];
    }
    case 'upcoming': {
      return due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    default:
      return 'Done';
  }
}

/**
 * Completes a care task and produces the new CareLog and the next generated CareTask instance.
 */
export function completeCareTask(
  task: CareTask,
  schedule?: CareSchedule,
  completedAt: Date = new Date(),
  userNotes?: string
): { completedTask: CareTask; newLog: CareLog; nextTask?: CareTask } {
  const completedIso = completedAt.toISOString();

  const completedTask: CareTask = {
    ...task,
    status: 'completed',
    completedAt: completedIso,
    notes: userNotes || task.notes,
  };

  const newLog: CareLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    plantId: task.plantId,
    taskId: task.id,
    actionType: task.taskType,
    notes: userNotes || `Completed ${task.title}`,
    observedAt: completedIso,
  };

  let nextTask: CareTask | undefined;
  if (schedule && schedule.enabled) {
    const nextDue = calculateNextDueDate(completedAt, schedule.intervalDays, schedule.localTime);
    nextTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      plantId: task.plantId,
      scheduleId: schedule.id,
      taskType: schedule.taskType,
      title: task.title,
      instructions: task.instructions,
      dueAt: nextDue,
      status: 'due',
    };
  }

  return { completedTask, newLog, nextTask };
}

/**
 * Snoozes a care task by N days (default 1)
 */
export function snoozeCareTask(task: CareTask, snoozeDays: number = 1): CareTask {
  const originalDue = new Date(task.dueAt);
  originalDue.setDate(originalDue.getDate() + Math.max(1, snoozeDays));
  return {
    ...task,
    status: 'snoozed',
    snoozedUntil: originalDue.toISOString(),
    dueAt: originalDue.toISOString(),
  };
}

/**
 * Determines a plant's health status based on task urgency and overdue checks
 */
export function evaluatePlantHealth(
  plantId: string,
  tasks: CareTask[]
): 'healthy' | 'good' | 'needs_attention' {
  const plantTasks = tasks.filter((t) => t.plantId === plantId && t.status === 'due');
  const overdueCount = plantTasks.filter((t) => getTaskUrgency(t.dueAt) === 'overdue').length;

  if (overdueCount >= 2) return 'needs_attention';
  if (overdueCount === 1) return 'good';
  return 'healthy';
}
