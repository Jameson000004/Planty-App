import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNextDueDate,
  getTaskUrgency,
  formatCareInterval,
  getDueBadgeText,
  completeCareTask,
  snoozeCareTask,
  evaluatePlantHealth,
  type CareTask,
  type CareSchedule,
} from './care-logic';

test('calculateNextDueDate correctly increments days with specified local time', () => {
  const base = new Date('2026-10-24T12:00:00Z');
  const result = calculateNextDueDate(base, 7, '09:00');
  const nextDate = new Date(result);

  assert.equal(nextDate.getDate(), base.getDate() + 7);
  assert.equal(nextDate.getHours(), 9);
  assert.equal(nextDate.getMinutes(), 0);
});

test('getTaskUrgency identifies overdue, today, tomorrow and upcoming correctly', () => {
  const ref = new Date('2026-10-24T10:00:00Z');

  const todayIso = new Date('2026-10-24T15:00:00Z').toISOString();
  assert.equal(getTaskUrgency(todayIso, ref), 'today');

  const tomorrowIso = new Date('2026-10-25T09:00:00Z').toISOString();
  assert.equal(getTaskUrgency(tomorrowIso, ref), 'tomorrow');

  const overdueIso = new Date('2026-10-22T09:00:00Z').toISOString();
  assert.equal(getTaskUrgency(overdueIso, ref), 'overdue');

  const upcomingIso = new Date('2026-11-15T09:00:00Z').toISOString();
  assert.equal(getTaskUrgency(upcomingIso, ref), 'upcoming');
});

test('formatCareInterval formats standard ranges and discrete intervals', () => {
  assert.equal(formatCareInterval(7), 'Weekly');
  assert.equal(formatCareInterval(14), 'Every 2 weeks');
  assert.equal(formatCareInterval(10, 7, 10), 'Every 7-10 days');
  assert.equal(formatCareInterval(35, 28, 42), 'Every 28-42 days');
});

test('getDueBadgeText produces clean labels', () => {
  const ref = new Date('2026-10-24T10:00:00Z');
  assert.equal(getDueBadgeText('2026-10-24T12:00:00Z', ref), 'Today');
  assert.equal(getDueBadgeText('2026-10-25T12:00:00Z', ref), 'Tomorrow');
});

test('completeCareTask generates valid care log and advances task schedule', () => {
  const task: CareTask = {
    id: 'task-1',
    plantId: 'plant-monstera',
    scheduleId: 'sched-1',
    taskType: 'water',
    title: 'Water Monstera deliciosa',
    instructions: 'Check if top 2 inches of soil are dry.',
    dueAt: '2026-10-24T09:00:00Z',
    status: 'due',
  };

  const schedule: CareSchedule = {
    id: 'sched-1',
    plantId: 'plant-monstera',
    taskType: 'water',
    intervalDays: 7,
    localTime: '09:00',
    enabled: true,
  };

  const now = new Date('2026-10-24T10:30:00Z');
  const result = completeCareTask(task, schedule, now, 'Soil was completely dry, gave 500ml filtered water');

  assert.equal(result.completedTask.status, 'completed');
  assert.equal(result.completedTask.completedAt, now.toISOString());
  assert.equal(result.newLog.plantId, 'plant-monstera');
  assert.equal(result.newLog.actionType, 'water');
  assert.ok(result.nextTask);
  assert.equal(result.nextTask.status, 'due');
  assert.equal(result.nextTask.plantId, 'plant-monstera');
});

test('snoozeCareTask postpones task by designated days', () => {
  const task: CareTask = {
    id: 'task-2',
    plantId: 'plant-pothos',
    taskType: 'soil_check',
    title: 'Check soil Pothos',
    instructions: 'Check soil moisture.',
    dueAt: '2026-10-24T09:00:00Z',
    status: 'due',
  };

  const snoozed = snoozeCareTask(task, 2);
  assert.equal(snoozed.status, 'snoozed');
  const due = new Date(snoozed.dueAt);
  assert.equal(due.getDate(), 26);
});

test('evaluatePlantHealth classifies based on overdue count', () => {
  const tasks: CareTask[] = [
    {
      id: 't1',
      plantId: 'p1',
      taskType: 'water',
      title: 'Water',
      instructions: '',
      dueAt: '2026-10-10T00:00:00Z', // overdue
      status: 'due',
    },
    {
      id: 't2',
      plantId: 'p1',
      taskType: 'inspect',
      title: 'Inspect',
      instructions: '',
      dueAt: '2026-10-11T00:00:00Z', // overdue
      status: 'due',
    },
  ];

  assert.equal(evaluatePlantHealth('p1', tasks), 'needs_attention');
  assert.equal(evaluatePlantHealth('p2', []), 'healthy');
});
