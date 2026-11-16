import React, { useState } from 'react';
import { Plant, CareTask, UserProfile } from '../types';
import { getDueBadgeText, getTaskUrgency } from '../lib/care-logic';
import { PlantImage } from './PlantImage';
import { Check, CheckCircle2, Clock, ChevronRight, User, Plus, Droplets, Sun, Sparkles } from 'lucide-react';

interface HomeViewProps {
  user: UserProfile;
  plants: Plant[];
  tasks: CareTask[];
  onCompleteTask: (task: CareTask) => void;
  onSnoozeTask: (task: CareTask) => void;
  onSelectPlant: (plant: Plant) => void;
  onNavigateToPlants: () => void;
  onNavigateToPlanner: () => void;
  onNavigateToProfile: () => void;
  onOpenScan: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  plants,
  tasks,
  onCompleteTask,
  onSnoozeTask,
  onSelectPlant,
  onNavigateToPlants,
  onNavigateToPlanner,
  onNavigateToProfile,
  onOpenScan,
}) => {
  const [completedAnimationId, setCompletedAnimationId] = useState<string | null>(null);

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Active pending tasks sorted by due urgency
  const pendingTasks = tasks.filter((t) => t.status === 'due');
  const previewTasks = pendingTasks.slice(0, 3);

  const handleCheckTask = (task: CareTask) => {
    setCompletedAnimationId(task.id);
    setTimeout(() => {
      onCompleteTask(task);
      setCompletedAnimationId(null);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF7] dark:bg-[#10231A] text-[#0F2A1D] dark:text-[#F5F2E9] pb-24 transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="px-5 pt-7 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2A1D] dark:text-[#F5F2E9]">
            {greeting}, {user.displayName}
          </h1>
          <p className="text-xs sm:text-sm text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5 font-sans">
            {pendingTasks.length > 0
              ? 'Your plants are doing well.'
              : 'All caught up on plant care today.'}
          </p>
        </div>
        <button
          type="button"
          aria-label="Open profile settings"
          onClick={onNavigateToProfile}
          className="w-10 h-10 rounded-full bg-[#EEF0E4] dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] flex items-center justify-center text-[#0F2A1D] dark:text-[#F5F2E9] hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          <User className="w-5 h-5 stroke-[1.75]" />
        </button>
      </header>

      {/* Main Content Sections */}
      <main className="px-5 space-y-6">
        {/* SECTION 1: Next Care Tasks */}
        <section aria-labelledby="tasks-heading">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 id="tasks-heading" className="font-serif text-lg font-bold text-[#0F2A1D] dark:text-[#F5F2E9]">
                Next care tasks
              </h2>
              <span className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
                {pendingTasks.length} {pendingTasks.length === 1 ? 'task' : 'tasks'} due this week
              </span>
            </div>
            {pendingTasks.length > 0 && (
              <button
                type="button"
                onClick={onNavigateToPlanner}
                className="text-xs font-semibold text-[#0F2A1D] dark:text-[#D9F36A] hover:underline flex items-center gap-0.5 cursor-pointer py-1"
              >
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {pendingTasks.length === 0 ? (
            <div className="bg-[#EEF0E4]/60 dark:bg-[#1C3226]/50 rounded-2xl p-5 text-center border border-[#E2E6D5] dark:border-[#34483B]">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#D9F36A]/20 flex items-center justify-center text-[#0F2A1D] dark:text-[#D9F36A] mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="font-serif font-semibold text-sm">No tasks due right now</p>
              <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-1">
                Your routine is up to date. Feel free to check in whenever needed.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {previewTasks.map((task) => {
                const plant = plants.find((p) => p.id === task.plantId);
                const urgency = getTaskUrgency(task.dueAt);
                const isDueToday = urgency === 'today';
                const isOverdue = urgency === 'overdue';
                const isAnimating = completedAnimationId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-all duration-300 ${
                      isAnimating ? 'opacity-40 scale-95 translate-x-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Task icon badge */}
                      <div className="w-9 h-9 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] flex items-center justify-center text-[#0F2A1D] dark:text-[#D9F36A] shrink-0">
                        {task.taskType === 'water' ? (
                          <Droplets className="w-4 h-4" />
                        ) : task.taskType === 'light' ? (
                          <Sun className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </div>

                      {/* Task details */}
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate text-[#0F2A1D] dark:text-[#F5F2E9]">
                            {task.title}
                          </p>
                        </div>
                        <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`font-medium ${
                              isOverdue
                                ? 'text-[#FF7A59]'
                                : isDueToday
                                ? 'text-[#0F2A1D] dark:text-[#D9F36A] font-semibold'
                                : ''
                            }`}
                          >
                            {getDueBadgeText(task.dueAt)}
                          </span>
                          {plant && (
                            <>
                              <span>•</span>
                              <span className="truncate">{plant.locationLabel}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Quick completion & snooze actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        aria-label={`Snooze ${task.title} by 1 day`}
                        onClick={() => onSnoozeTask(task)}
                        title="Snooze 1 day"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6E61] hover:text-[#0F2A1D] dark:text-[#C1CEBE] dark:hover:text-[#F5F2E9] hover:bg-[#EEF0E4] dark:hover:bg-[#253E31] transition-colors cursor-pointer"
                      >
                        <Clock className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        aria-label={`Mark complete: ${task.title}`}
                        onClick={() => handleCheckTask(task)}
                        className="w-8 h-8 rounded-full border-2 border-[#5D6E61]/40 dark:border-[#C1CEBE]/40 hover:border-[#D9F36A] hover:bg-[#D9F36A] dark:hover:bg-[#D9F36A] hover:text-[#0F2A1D] flex items-center justify-center text-transparent transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 2: My Plants Collection Preview */}
        <section aria-labelledby="plants-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="plants-heading" className="font-serif text-lg font-bold text-[#0F2A1D] dark:text-[#F5F2E9]">
              My plants
            </h2>
            <button
              type="button"
              onClick={onNavigateToPlants}
              className="text-xs font-semibold text-[#0F2A1D] dark:text-[#D9F36A] hover:underline flex items-center gap-0.5 cursor-pointer py-1"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {plants.slice(0, 4).map((plant) => {
              // Find next task for this plant
              const nextTask = tasks.find((t) => t.plantId === plant.id && t.status === 'due');

              return (
                <div
                  key={plant.id}
                  onClick={() => onSelectPlant(plant)}
                  className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <PlantImage
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full aspect-square rounded-2xl mb-2.5"
                    badge={
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#10231A]/90 backdrop-blur-xs text-[10px] font-medium flex items-center gap-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span className="text-[#0F2A1D] dark:text-[#F5F2E9]">Healthy</span>
                      </div>
                    }
                  />

                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#0F2A1D] dark:text-[#F5F2E9] truncate">
                      {plant.name}
                    </h3>
                    <p className="text-[11px] text-[#5D6E61] dark:text-[#C1CEBE] truncate mt-0.5">
                      {nextTask
                        ? `Next: ${nextTask.taskType.charAt(0).toUpperCase() + nextTask.taskType.slice(1)} · ${getDueBadgeText(nextTask.dueAt)}`
                        : 'Routine healthy'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Contextual Botanical Care Tip */}
        <section className="bg-gradient-to-br from-[#EEF0E4] to-[#E6EADA] dark:from-[#1C3226] dark:to-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D9F36A] text-[#0F2A1D] flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-0.5">
              Tip
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
                Check before watering
              </h4>
              <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-1 leading-relaxed">
                Rather than sticking strictly to a calendar, feel the soil 2 inches deep. If it feels cool and damp, delay watering by another day or two.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
