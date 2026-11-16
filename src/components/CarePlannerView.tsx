import React, { useState } from 'react';
import { CareTask, Plant } from '../types';
import { getDueBadgeText, getTaskUrgency } from '../lib/care-logic';
import { Check, Clock, Droplets, Sun, Sparkles, ChevronLeft } from 'lucide-react';

interface CarePlannerViewProps {
  tasks: CareTask[];
  plants: Plant[];
  onCompleteTask: (task: CareTask) => void;
  onSnoozeTask: (task: CareTask) => void;
  onBack: () => void;
}

export const CarePlannerView: React.FC<CarePlannerViewProps> = ({
  tasks,
  plants,
  onCompleteTask,
  onSnoozeTask,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'this_week' | 'all'>('this_week');
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Mid-week active day like the showcase (Wed 23)

  // Generate 7-day strip based on current week
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    // Align around current date
    d.setDate(today.getDate() - 2 + i);
    return {
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      dayNumber: d.getDate(),
      fullDate: d,
    };
  });

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'this_week') {
      const urgency = getTaskUrgency(t.dueAt);
      return urgency === 'today' || urgency === 'tomorrow' || urgency === 'this_week' || urgency === 'overdue';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FBFBF7] dark:bg-[#10231A] text-[#0F2A1D] dark:text-[#F5F2E9] pb-24 transition-colors duration-200">
      {/* Top Header */}
      <header className="px-5 pt-7 pb-3 flex items-center gap-3">
        <button
          type="button"
          aria-label="Back to home"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] flex items-center justify-center text-[#0F2A1D] dark:text-[#F5F2E9] shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0F2A1D] dark:text-[#F5F2E9]">
            Care Planner
          </h1>
          <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
            A personalized plan for healthy plants.
          </p>
        </div>
      </header>

      {/* Tabs: This week vs All tasks */}
      <div className="px-5 mt-2 mb-4">
        <div className="flex border-b border-[#E2E6D5] dark:border-[#34483B] text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('this_week')}
            className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer relative ${
              activeTab === 'this_week'
                ? 'text-[#0F2A1D] dark:text-[#D9F36A] font-bold'
                : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D]'
            }`}
          >
            This week
            {activeTab === 'this_week' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A1D] dark:bg-[#D9F36A] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer relative ${
              activeTab === 'all'
                ? 'text-[#0F2A1D] dark:text-[#D9F36A] font-bold'
                : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D]'
            }`}
          >
            All tasks
            {activeTab === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A1D] dark:bg-[#D9F36A] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Week Calendar Day Strip (Matching Showcase layout) */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-2.5 shadow-xs">
          {weekDays.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            return (
              <button
                key={day.dayName + day.dayNumber}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-[#D9F36A] text-[#0F2A1D] font-bold shadow-xs scale-105'
                    : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:bg-[#EEF0E4]/60 dark:hover:bg-[#253E31]'
                }`}
              >
                <span className="text-[10px] tracking-tight">{day.dayName}</span>
                <span className="text-sm font-semibold mt-0.5">{day.dayNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List Items matching the showcase */}
      <main className="px-5 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#EEF0E4]/60 dark:bg-[#1C3226]/50 rounded-2xl p-6 text-center text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
            No care tasks scheduled for this period.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const urgency = getTaskUrgency(task.dueAt);

            return (
              <div
                key={task.id}
                className={`bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all ${
                  isCompleted ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Task category icon */}
                  <div className="w-10 h-10 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#D9F36A] flex items-center justify-center shrink-0">
                    {task.taskType === 'water' ? (
                      <Droplets className="w-4 h-4" />
                    ) : task.taskType === 'light' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0 pr-2">
                    <h3
                      className={`text-sm font-semibold truncate text-[#0F2A1D] dark:text-[#F5F2E9] ${
                        isCompleted ? 'line-through' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5">
                      {isCompleted
                        ? 'Completed'
                        : `${getDueBadgeText(task.dueAt)} · ${
                            task.taskType === 'water' ? 'Every 7–10 days' : 'Flexible check-in'
                          }`}
                    </p>
                  </div>
                </div>

                {/* Actions: Snooze & Complete */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isCompleted && (
                    <button
                      type="button"
                      aria-label="Snooze task 1 day"
                      onClick={() => onSnoozeTask(task)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#5D6E61] hover:text-[#0F2A1D] dark:text-[#C1CEBE] hover:bg-[#EEF0E4] dark:hover:bg-[#253E31] transition-colors cursor-pointer"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    aria-label={`Mark task ${task.title}`}
                    onClick={() => onCompleteTask(task)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-[#10B981] border-[#10B981] text-white'
                        : 'border-[#5D6E61]/40 hover:border-[#D9F36A] hover:bg-[#D9F36A] hover:text-[#0F2A1D] text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};
