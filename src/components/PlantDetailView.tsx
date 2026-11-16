import React, { useState } from 'react';
import { Plant, CareSchedule, CareTask, CareLog } from '../types';
import { formatCareInterval, getDueBadgeText } from '../lib/care-logic';
import {
  ChevronLeft,
  Droplets,
  Sun,
  Wind,
  Sparkles,
  Camera,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit3,
  Clock,
  RotateCw,
  Plus,
} from 'lucide-react';

interface PlantDetailViewProps {
  plant: Plant;
  schedules: CareSchedule[];
  tasks: CareTask[];
  logs: CareLog[];
  onBack: () => void;
  onLogCare: (plantId: string, actionType: CareSchedule['taskType'], notes?: string) => void;
  onAnalyzeSymptoms: (plant: Plant) => void;
  onDeletePlant: (plantId: string) => void;
}

export const PlantDetailView: React.FC<PlantDetailViewProps> = ({
  plant,
  schedules,
  tasks,
  logs,
  onBack,
  onLogCare,
  onAnalyzeSymptoms,
  onDeletePlant,
}) => {
  const [activeTab, setActiveTab] = useState<'care' | 'details' | 'history'>('care');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<CareSchedule['taskType']>('water');
  const [logNotes, setLogNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter schedules and logs for this plant
  const plantSchedules = schedules.filter((s) => s.plantId === plant.id);
  const plantTasks = tasks.filter((t) => t.plantId === plant.id && t.status === 'due');
  const plantLogs = logs.filter((l) => l.plantId === plant.id);

  const handleSaveCareLog = () => {
    onLogCare(plant.id, selectedActionType, logNotes.trim() || undefined);
    setLogNotes('');
    setShowLogModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF7] dark:bg-[#10231A] text-[#0F2A1D] dark:text-[#F5F2E9] pb-24 transition-colors duration-200">
      {/* Top Header with Back Arrow and Actions */}
      <header className="fixed top-0 left-0 right-0 z-30 max-w-md mx-auto px-4 py-3 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          aria-label="Back to plants list"
          onClick={onBack}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 dark:bg-[#1C3226]/90 backdrop-blur-md border border-[#E2E6D5] dark:border-[#34483B] flex items-center justify-center text-[#0F2A1D] dark:text-[#F5F2E9] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          type="button"
          aria-label="Delete plant"
          onClick={() => setShowDeleteConfirm(true)}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 dark:bg-[#1C3226]/90 backdrop-blur-md border border-[#E2E6D5] dark:border-[#34483B] flex items-center justify-center text-[#5D6E61] hover:text-[#FF7A59] dark:text-[#C1CEBE] dark:hover:text-[#FF7A59] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </header>

      {/* Hero Plant Image */}
      <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-[#EEF0E4] dark:bg-[#1C3226]">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBFBF7] dark:from-[#10231A] via-transparent to-black/20" />
      </div>

      {/* Plant Title & Status */}
      <div className="px-5 -mt-6 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] text-[11px] font-medium flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-[#0F2A1D] dark:text-[#F5F2E9]">Healthy</span>
          </div>
          <span className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
            {plant.locationLabel}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2A1D] dark:text-[#F5F2E9]">
          {plant.name}
        </h1>
        <p className="text-xs italic text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5">
          {plant.scientificName}
        </p>

        {/* Navigation Tabs (Care | Details | History) */}
        <div className="flex border-b border-[#E2E6D5] dark:border-[#34483B] mt-5 mb-5 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('care')}
            className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer relative ${
              activeTab === 'care'
                ? 'text-[#0F2A1D] dark:text-[#D9F36A] font-bold'
                : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D]'
            }`}
          >
            Care
            {activeTab === 'care' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A1D] dark:bg-[#D9F36A] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer relative ${
              activeTab === 'details'
                ? 'text-[#0F2A1D] dark:text-[#D9F36A] font-bold'
                : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D]'
            }`}
          >
            Details
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A1D] dark:bg-[#D9F36A] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer relative ${
              activeTab === 'history'
                ? 'text-[#0F2A1D] dark:text-[#D9F36A] font-bold'
                : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D]'
            }`}
          >
            History
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F2A1D] dark:bg-[#D9F36A] rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: CARE SCHEDULE & ACTIONS */}
        {activeTab === 'care' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-serif font-bold text-base text-[#0F2A1D] dark:text-[#F5F2E9]">
                  Care schedule
                </h2>
                <span className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
                  Flexible guidance
                </span>
              </div>

              {/* Showcase 4 Care Cards */}
              <div className="space-y-2.5">
                {/* 1. Water */}
                <div className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#D9F36A] flex items-center justify-center">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F2A1D] dark:text-[#F5F2E9]">
                        Water
                      </h3>
                      <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
                        Every 7–10 days
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#D9F36A] text-[#0F2A1D] text-xs font-semibold">
                    Today
                  </span>
                </div>

                {/* 2. Light */}
                <div className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#D9F36A] flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F2A1D] dark:text-[#F5F2E9]">
                        Light
                      </h3>
                      <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
                        Bright, indirect
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] text-xs font-medium">
                    Optimal
                  </span>
                </div>

                {/* 3. Humidity */}
                <div className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#D9F36A] flex items-center justify-center">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F2A1D] dark:text-[#F5F2E9]">
                        Humidity
                      </h3>
                      <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
                        40–60%
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] text-xs font-medium">
                    Good
                  </span>
                </div>

                {/* 4. Fertilizer */}
                <div className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#D9F36A] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F2A1D] dark:text-[#F5F2E9]">
                        Fertilizer
                      </h3>
                      <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
                        Every 4–6 weeks
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] text-xs font-medium">
                    Next: Apr 26
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Button: Log Care */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => setShowLogModal(true)}
                className="w-full py-4 px-6 rounded-full bg-[#D9F36A] hover:bg-[#cbf046] active:scale-[0.98] text-[#0F2A1D] font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Log care</span>
              </button>

              <button
                type="button"
                onClick={() => onAnalyzeSymptoms(plant)}
                className="w-full py-3.5 px-6 rounded-full bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] hover:bg-[#EEF0E4]/60 dark:hover:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Camera className="w-4 h-4 text-[#5D6E61] dark:text-[#C1CEBE]" />
                <span>Analyze symptoms with photo</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-4 text-xs">
            <div className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-4 space-y-3">
              <div>
                <span className="text-[#5D6E61] dark:text-[#C1CEBE] block mb-0.5">Location</span>
                <p className="font-semibold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
                  {plant.locationLabel}
                </p>
              </div>
              <div className="border-t border-[#E2E6D5] dark:border-[#34483B] pt-3">
                <span className="text-[#5D6E61] dark:text-[#C1CEBE] block mb-0.5">Pot & Drainage</span>
                <p className="font-semibold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
                  {plant.potType || 'Terracotta planter with drainage hole'}
                </p>
              </div>
              <div className="border-t border-[#E2E6D5] dark:border-[#34483B] pt-3">
                <span className="text-[#5D6E61] dark:text-[#C1CEBE] block mb-0.5">Soil Medium</span>
                <p className="font-semibold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
                  {plant.soilType || 'Chunky aroid mix (orchid bark, perlite, pumice)'}
                </p>
              </div>
              {plant.notes && (
                <div className="border-t border-[#E2E6D5] dark:border-[#34483B] pt-3">
                  <span className="text-[#5D6E61] dark:text-[#C1CEBE] block mb-0.5">Care Notes</span>
                  <p className="text-sm text-[#0F2A1D] dark:text-[#F5F2E9] leading-relaxed">
                    {plant.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {plantLogs.length === 0 ? (
              <div className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-5 text-center text-xs text-[#5D6E61]">
                No care logged yet. Click &quot;Log care&quot; above to record your first action.
              </div>
            ) : (
              plantLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-2xl p-3.5 flex items-start gap-3 shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#D9F36A] flex items-center justify-center shrink-0 mt-0.5">
                    {log.actionType === 'water' ? (
                      <Droplets className="w-4 h-4" />
                    ) : log.actionType === 'rotate' ? (
                      <RotateCw className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm capitalize text-[#0F2A1D] dark:text-[#F5F2E9]">
                        {log.actionType}
                      </p>
                      <span className="text-[11px] text-[#5D6E61] dark:text-[#C1CEBE]">
                        {new Date(log.observedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5 leading-relaxed">
                        {log.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* LOG CARE MODAL BOTTOM SHEET */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#FBFBF7] dark:bg-[#1C3226] rounded-t-[34px] sm:rounded-3xl p-6 shadow-2xl space-y-4 border-t border-[#E2E6D5] dark:border-[#34483B]">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-serif font-bold text-lg text-[#0F2A1D] dark:text-[#F5F2E9]">
                Log care for {plant.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-xs text-[#5D6E61] hover:text-[#0F2A1D] p-1 font-medium"
              >
                Cancel
              </button>
            </div>

            {/* Action Type Selection */}
            <div>
              <label className="text-xs font-semibold text-[#5D6E61] dark:text-[#C1CEBE] block mb-2">
                What action did you take?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['water', 'soil_check', 'fertilize', 'mist'] as CareSchedule['taskType'][]).map(
                  (action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => setSelectedActionType(action)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-xs font-medium transition-all ${
                        selectedActionType === action
                          ? 'bg-[#D9F36A] text-[#0F2A1D] font-bold shadow-xs'
                          : 'bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] text-[#5D6E61] dark:text-[#C1CEBE]'
                      }`}
                    >
                      {action === 'water' && <Droplets className="w-4 h-4" />}
                      {action === 'soil_check' && <CheckCircle2 className="w-4 h-4" />}
                      {action === 'fertilize' && <Sparkles className="w-4 h-4" />}
                      {action === 'mist' && <Wind className="w-4 h-4" />}
                      <span className="capitalize text-[11px]">{action.replace('_', ' ')}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Note text field */}
            <div>
              <label className="text-xs font-semibold text-[#5D6E61] dark:text-[#C1CEBE] block mb-1.5">
                Observation or notes (optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Soil was completely dry, gave 400ml filtered water..."
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] text-xs text-[#0F2A1D] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#D9F36A]"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveCareLog}
              className="w-full py-3.5 rounded-full bg-[#0F2A1D] text-[#D9F36A] dark:bg-[#D9F36A] dark:text-[#0F2A1D] font-semibold text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Save Care Record
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#FBFBF7] dark:bg-[#1C3226] rounded-3xl p-6 shadow-2xl border border-[#E2E6D5] dark:border-[#34483B] text-center space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0F2A1D] dark:text-[#F5F2E9]">
              Remove {plant.name}?
            </h3>
            <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
              This will remove this plant from your collection and cancel its care schedule.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] text-xs font-semibold text-[#0F2A1D] dark:text-[#F5F2E9]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeletePlant(plant.id);
                  onBack();
                }}
                className="flex-1 py-2.5 rounded-full bg-[#FF7A59] text-white text-xs font-semibold hover:bg-[#e86646]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
