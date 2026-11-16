import React, { useState } from 'react';
import { UserProfile, Plant, CareTask, CareLog } from '../types';
import {
  User,
  Sparkles,
  Moon,
  Sun,
  Laptop,
  Bell,
  Clock,
  Download,
  RotateCcw,
  Check,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  plants: Plant[];
  tasks: CareTask[];
  logs: CareLog[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenUpgradeModal: () => void;
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  plants,
  tasks,
  logs,
  onUpdateUser,
  onOpenUpgradeModal,
  onResetData,
}) => {
  const [copiedExport, setCopiedExport] = useState(false);

  const handleExportData = () => {
    const dataToExport = {
      user,
      plants,
      tasks,
      logs,
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0-mvp',
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plantly-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const isPlus = user.subscriptionTier === 'plantly_plus';

  return (
    <div className="min-h-screen bg-[#FBFBF7] dark:bg-[#10231A] text-[#0F2A1D] dark:text-[#F5F2E9] pb-24 transition-colors duration-200">
      {/* Top Header */}
      <header className="px-5 pt-7 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2A1D] dark:text-[#F5F2E9]">
          Profile & Settings
        </h1>
        <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5 font-sans">
          Manage preferences, care routines and account.
        </p>
      </header>

      <main className="px-5 space-y-5">
        {/* User Card */}
        <div className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] border border-[#E2E6D5] dark:border-[#34483B] flex items-center justify-center text-[#0F2A1D] dark:text-[#D9F36A] font-serif font-bold text-lg">
              {user.displayName.charAt(0)}
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#0F2A1D] dark:text-[#F5F2E9]">
                {user.displayName}
              </h2>
              <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE]">
                {user.email}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isPlus
                ? 'bg-[#D9F36A] text-[#0F2A1D]'
                : 'bg-[#EEF0E4] dark:bg-[#253E31] text-[#5D6E61] dark:text-[#C1CEBE]'
            }`}
          >
            {isPlus ? 'Plantly Plus' : 'Free Tier'}
          </span>
        </div>

        {/* Subscription / Freemium Entitlement Banner */}
        <div className="bg-gradient-to-br from-[#EEF0E4] to-[#E6EADA] dark:from-[#1C3226] dark:to-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl p-4.5 space-y-3 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2A1D] dark:text-[#D9F36A]">
                <Sparkles className="w-4 h-4" />
                <span>{isPlus ? 'Plantly Plus Member' : 'Plantly Free Plan'}</span>
              </div>
              <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-1 leading-relaxed">
                {isPlus
                  ? 'Unlimited plant collection and 250 AI botanical scans active.'
                  : `Using ${plants.length}/5 plants • ${user.scansUsedThisMonth}/10 AI scans this month.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenUpgradeModal}
            className="w-full py-2.5 px-4 rounded-full bg-[#0F2A1D] text-[#D9F36A] dark:bg-[#D9F36A] dark:text-[#0F2A1D] text-xs font-bold flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPlus ? 'Manage Membership' : 'Upgrade to Plantly Plus'}</span>
          </button>
        </div>

        {/* SECTION 1: APPEARANCE & THEME */}
        <section className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl p-4 space-y-3 shadow-xs">
          <h3 className="font-serif font-bold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
            Theme & Appearance
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onUpdateUser({ theme: 'light' })}
              className={`py-2 px-3 rounded-2xl flex flex-col items-center gap-1 text-xs font-medium border transition-all cursor-pointer ${
                user.theme === 'light'
                  ? 'bg-[#EEF0E4] border-[#0F2A1D] text-[#0F2A1D] font-bold shadow-xs'
                  : 'border-[#E2E6D5] dark:border-[#34483B] text-[#5D6E61] dark:text-[#C1CEBE]'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateUser({ theme: 'dark' })}
              className={`py-2 px-3 rounded-2xl flex flex-col items-center gap-1 text-xs font-medium border transition-all cursor-pointer ${
                user.theme === 'dark'
                  ? 'bg-[#253E31] border-[#D9F36A] text-[#D9F36A] font-bold shadow-xs'
                  : 'border-[#E2E6D5] dark:border-[#34483B] text-[#5D6E61] dark:text-[#C1CEBE]'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateUser({ theme: 'system' })}
              className={`py-2 px-3 rounded-2xl flex flex-col items-center gap-1 text-xs font-medium border transition-all cursor-pointer ${
                user.theme === 'system'
                  ? 'bg-[#EEF0E4] dark:bg-[#253E31] border-[#0F2A1D] dark:border-[#D9F36A] font-bold shadow-xs'
                  : 'border-[#E2E6D5] dark:border-[#34483B] text-[#5D6E61] dark:text-[#C1CEBE]'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>System</span>
            </button>
          </div>
        </section>

        {/* SECTION 2: PREFERENCES */}
        <section className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl p-4 space-y-3 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
            Care Preferences
          </h3>

          {/* Unit System */}
          <div className="flex items-center justify-between py-1 border-b border-[#E2E6D5] dark:border-[#34483B]">
            <div>
              <span className="font-semibold block text-[#0F2A1D] dark:text-[#F5F2E9]">
                Measurement Units
              </span>
              <span className="text-[11px] text-[#5D6E61] dark:text-[#C1CEBE]">
                Used for water volume and soil depth
              </span>
            </div>
            <div className="flex bg-[#EEF0E4] dark:bg-[#10231A] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => onUpdateUser({ preferredUnits: 'metric' })}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  user.preferredUnits === 'metric'
                    ? 'bg-white dark:bg-[#253E31] shadow-xs text-[#0F2A1D] dark:text-[#F5F2E9]'
                    : 'text-[#5D6E61]'
                }`}
              >
                Metric (ml/cm)
              </button>
              <button
                type="button"
                onClick={() => onUpdateUser({ preferredUnits: 'imperial' })}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  user.preferredUnits === 'imperial'
                    ? 'bg-white dark:bg-[#253E31] shadow-xs text-[#0F2A1D] dark:text-[#F5F2E9]'
                    : 'text-[#5D6E61]'
                }`}
              >
                Imperial (oz/in)
              </button>
            </div>
          </div>

          {/* Timezone */}
          <div className="flex items-center justify-between py-1 border-b border-[#E2E6D5] dark:border-[#34483B]">
            <div>
              <span className="font-semibold block text-[#0F2A1D] dark:text-[#F5F2E9]">
                Reminder Timezone
              </span>
              <span className="text-[11px] text-[#5D6E61] dark:text-[#C1CEBE]">
                {user.timezone}
              </span>
            </div>
            <span className="text-xs font-mono text-[#5D6E61] dark:text-[#C1CEBE]">
              Local time
            </span>
          </div>

          {/* Quiet hours */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="font-semibold block text-[#0F2A1D] dark:text-[#F5F2E9]">
                Quiet Hours
              </span>
              <span className="text-[11px] text-[#5D6E61] dark:text-[#C1CEBE]">
                No check-in chimes between {user.quietHoursStart} - {user.quietHoursEnd}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#EEF0E4] dark:bg-[#10231A] text-[11px] font-medium">
              Enabled
            </span>
          </div>
        </section>

        {/* SECTION 3: PRIVACY & DATA CONTROLS */}
        <section className="bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl p-4 space-y-3 shadow-xs text-xs">
          <h3 className="font-serif font-bold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
            Privacy & Account Data
          </h3>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-2.5 px-3 rounded-2xl bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] font-medium flex items-center justify-between hover:bg-[#E2E6D5] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#5D6E61] dark:text-[#C1CEBE]" />
                <span>Export My Plants & History (JSON)</span>
              </div>
              {copiedExport ? (
                <span className="text-[10px] text-[#10B981] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Downloaded
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#5D6E61]" />
              )}
            </button>

            <button
              type="button"
              onClick={onResetData}
              className="w-full py-2.5 px-3 rounded-2xl bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#FF7A59] font-medium flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Showcase Demo Data</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-[#5D6E61] dark:text-[#C1CEBE] pt-1 leading-relaxed">
            Plantly strips EXIF location coordinates from all uploaded plant images and does not use personal photos for AI training without consent.
          </p>
        </section>
      </main>
    </div>
  );
};
