/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plant, CareSchedule, CareTask, CareLog, UserProfile } from './types';
import {
  INITIAL_USER,
  INITIAL_PLANTS,
  INITIAL_SCHEDULES,
  INITIAL_TASKS,
  INITIAL_LOGS,
} from './lib/seed-data';
import { completeCareTask, snoozeCareTask, calculateNextDueDate } from './lib/care-logic';
import { Navigation, NavTab } from './components/Navigation';
import { WelcomeView } from './components/WelcomeView';
import { HomeView } from './components/HomeView';
import { PlantsView } from './components/PlantsView';
import { PlantDetailView } from './components/PlantDetailView';
import { ScanView } from './components/ScanView';
import { CarePlannerView } from './components/CarePlannerView';
import { AssistantView } from './components/AssistantView';
import { ProfileView } from './components/ProfileView';
import { AddPlantModal } from './components/AddPlantModal';
import { UpgradeModal } from './components/UpgradeModal';

export default function App() {
  // Check autostart query parameter (per ultra-mode guidelines: ?autostart=1 skips intro)
  const queryParams = new URLSearchParams(window.location.search);
  const autostart = queryParams.get('autostart') === '1';

  // Persistence keys
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    if (autostart) return true;
    return localStorage.getItem('plantly_onboarded') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('plantly_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [plants, setPlants] = useState<Plant[]>(() => {
    const saved = localStorage.getItem('plantly_plants');
    return saved ? JSON.parse(saved) : INITIAL_PLANTS;
  });

  const [schedules, setSchedules] = useState<CareSchedule[]>(() => {
    const saved = localStorage.getItem('plantly_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [tasks, setTasks] = useState<CareTask[]>(() => {
    const saved = localStorage.getItem('plantly_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [logs, setLogs] = useState<CareLog[]>(() => {
    const saved = localStorage.getItem('plantly_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Navigation and active screen state
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('plantly_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('plantly_plants', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem('plantly_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('plantly_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('plantly_logs', JSON.stringify(logs));
  }, [logs]);

  // Handle Theme switching (System, Light, Dark)
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      user.theme === 'dark' ||
      (user.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user.theme]);

  // 1. Task Completion Handler
  const handleCompleteTask = (task: CareTask) => {
    const schedule = schedules.find((s) => s.id === task.scheduleId);
    const { completedTask, newLog, nextTask } = completeCareTask(task, schedule);

    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === task.id ? completedTask : t));
      return nextTask ? [...updated, nextTask] : updated;
    });

    setLogs((prev) => [newLog, ...prev]);
  };

  // 2. Task Snooze Handler
  const handleSnoozeTask = (task: CareTask) => {
    const snoozed = snoozeCareTask(task, 1);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? snoozed : t)));
  };

  // 3. Log Care Action for a Plant
  const handleLogCare = (plantId: string, actionType: CareSchedule['taskType'], userNotes?: string) => {
    const newLog: CareLog = {
      id: `log-${Date.now()}`,
      plantId,
      actionType,
      notes: userNotes,
      observedAt: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev]);

    // Advance or complete any matching due tasks
    const matchingDueTask = tasks.find(
      (t) => t.plantId === plantId && t.taskType === actionType && t.status === 'due'
    );
    if (matchingDueTask) {
      handleCompleteTask(matchingDueTask);
    }
  };

  // 4. Save Plant from Photo Scan or Manual Entry
  const handleSavePlant = (
    newPlantData: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>,
    suggestedSchedules: Omit<CareSchedule, 'id'>[]
  ) => {
    const plantId = `plant-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const createdPlant: Plant = {
      ...newPlantData,
      id: plantId,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const createdSchedules: CareSchedule[] = suggestedSchedules.map((s, index) => ({
      ...s,
      id: `sched-${Date.now()}-${index}`,
      plantId,
    }));

    // Generate initial care task
    const initialTasks: CareTask[] = createdSchedules.map((s, index) => ({
      id: `task-${Date.now()}-${index}`,
      plantId,
      scheduleId: s.id,
      taskType: s.taskType,
      title: `${s.taskType.charAt(0).toUpperCase() + s.taskType.slice(1)} ${createdPlant.name}`,
      instructions: `Check soil moisture and condition for ${createdPlant.name}.`,
      dueAt: calculateNextDueDate(new Date(), s.intervalDays, s.localTime),
      status: 'due',
    }));

    setPlants((prev) => [...prev, createdPlant]);
    setSchedules((prev) => [...prev, ...createdSchedules]);
    setTasks((prev) => [...prev, ...initialTasks]);

    // Increment scan usage count
    setUser((prev) => ({
      ...prev,
      scansUsedThisMonth: prev.scansUsedThisMonth + 1,
    }));
  };

  // 5. Delete Plant
  const handleDeletePlant = (plantId: string) => {
    setPlants((prev) => prev.filter((p) => p.id !== plantId));
    setSchedules((prev) => prev.filter((s) => s.plantId !== plantId));
    setTasks((prev) => prev.filter((t) => t.plantId !== plantId));
    if (selectedPlant?.id === plantId) {
      setSelectedPlant(null);
    }
  };

  // 6. Reset Data to showcase demo state
  const handleResetData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setPlants(INITIAL_PLANTS);
    setSchedules(INITIAL_SCHEDULES);
    setTasks(INITIAL_TASKS);
    setLogs(INITIAL_LOGS);
    setSelectedPlant(null);
    setActiveTab('home');
  };

  // Pending tasks counter for badge indicator
  const pendingTasksCount = tasks.filter((t) => t.status === 'due').length;

  // Onboarding / Welcome gate
  const isDarkMode =
    user.theme === 'dark' ||
    (user.theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (!hasCompletedOnboarding) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <WelcomeView
          onStart={() => {
            localStorage.setItem('plantly_onboarded', 'true');
            setHasCompletedOnboarding(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen bg-[#FBFBF7] dark:bg-[#10231A] text-[#0F2A1D] dark:text-[#F5F2E9] font-sans antialiased ${isDarkMode ? 'dark' : ''}`}>
      {/* View router */}
      {selectedPlant ? (
        <PlantDetailView
          plant={selectedPlant}
          schedules={schedules}
          tasks={tasks}
          logs={logs}
          onBack={() => setSelectedPlant(null)}
          onLogCare={handleLogCare}
          onAnalyzeSymptoms={(plant) => {
            setSelectedPlant(null);
            setShowScanModal(true);
          }}
          onDeletePlant={handleDeletePlant}
        />
      ) : activeTab === 'home' ? (
        <HomeView
          user={user}
          plants={plants}
          tasks={tasks}
          onCompleteTask={handleCompleteTask}
          onSnoozeTask={handleSnoozeTask}
          onSelectPlant={(plant) => setSelectedPlant(plant)}
          onNavigateToPlants={() => setActiveTab('plants')}
          onNavigateToPlanner={() => setActiveTab('planner')}
          onNavigateToProfile={() => setActiveTab('profile')}
          onOpenScan={() => setShowScanModal(true)}
        />
      ) : activeTab === 'plants' ? (
        <PlantsView
          plants={plants}
          tasks={tasks}
          onSelectPlant={(plant) => setSelectedPlant(plant)}
          onOpenAddModal={() => setShowAddPlantModal(true)}
          onOpenScan={() => setShowScanModal(true)}
        />
      ) : activeTab === 'planner' ? (
        <CarePlannerView
          tasks={tasks}
          plants={plants}
          onCompleteTask={handleCompleteTask}
          onSnoozeTask={handleSnoozeTask}
          onBack={() => setActiveTab('home')}
        />
      ) : activeTab === 'assistant' ? (
        <AssistantView
          plants={plants}
          onOpenScan={() => setShowScanModal(true)}
        />
      ) : (
        <ProfileView
          user={user}
          plants={plants}
          tasks={tasks}
          logs={logs}
          onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          onResetData={handleResetData}
        />
      )}

      {/* Persistent Bottom Mobile Navigation Bar */}
      {!selectedPlant && (
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'scan') {
              setShowScanModal(true);
            } else {
              setActiveTab(tab);
            }
          }}
          pendingTasksCount={pendingTasksCount}
        />
      )}

      {/* MODALS */}
      {/* 1. Camera / Photo Scan Viewfinder Modal */}
      {showScanModal && (
        <ScanView
          onSaveIdentifiedPlant={handleSavePlant}
          onClose={() => setShowScanModal(false)}
        />
      )}

      {/* 2. Add Plant Modal (Photo or Manual entry) */}
      <AddPlantModal
        isOpen={showAddPlantModal}
        onClose={() => setShowAddPlantModal(false)}
        onSavePlant={handleSavePlant}
        onOpenScan={() => setShowScanModal(true)}
      />

      {/* 3. Plantly Plus Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setUser((prev) => ({ ...prev, subscriptionTier: 'plantly_plus' }));
        }}
        isUpgraded={user.subscriptionTier === 'plantly_plus'}
      />
    </div>
  );
}
