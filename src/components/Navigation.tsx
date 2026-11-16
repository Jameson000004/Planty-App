import React from 'react';
import { Home, Sprout, Camera, MessageCircle, User } from 'lucide-react';

export type NavTab = 'home' | 'plants' | 'scan' | 'assistant' | 'profile' | 'planner';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingTasksCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount = 0,
}) => {
  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-safe pointer-events-none"
    >
      <div className="pointer-events-auto bg-[#FBFBF7]/90 dark:bg-[#1C3226]/90 backdrop-blur-md border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl shadow-xl px-2 py-2 mb-3 flex items-center justify-around transition-colors duration-200">
        {/* 1. Home */}
        <button
          type="button"
          aria-label="Home screen"
          aria-current={activeTab === 'home' ? 'page' : undefined}
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 ${
            activeTab === 'home'
              ? 'text-[#0F2A1D] dark:text-[#F5F2E9] font-semibold'
              : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] dark:hover:text-[#F5F2E9]'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5 stroke-[1.75]" />
            {pendingTasksCount > 0 && activeTab !== 'home' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D9F36A] ring-2 ring-[#FBFBF7] dark:ring-[#1C3226]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </button>

        {/* 2. My Plants */}
        <button
          type="button"
          aria-label="My Plants collection"
          aria-current={activeTab === 'plants' ? 'page' : undefined}
          onClick={() => onSelectTab('plants')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 ${
            activeTab === 'plants'
              ? 'text-[#0F2A1D] dark:text-[#F5F2E9] font-semibold'
              : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] dark:hover:text-[#F5F2E9]'
          }`}
        >
          <Sprout className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] tracking-tight mt-1">My Plants</span>
        </button>

        {/* 3. Center Prominent Scan Button */}
        <div className="flex-1 flex justify-center -translate-y-3">
          <button
            type="button"
            aria-label="Scan or Identify plant"
            onClick={() => onSelectTab('scan')}
            className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 duration-200 ${
              activeTab === 'scan'
                ? 'bg-[#D9F36A] text-[#0F2A1D] ring-4 ring-[#0F2A1D]/15 dark:ring-[#D9F36A]/20 scale-105'
                : 'bg-[#0F2A1D] text-[#D9F36A] dark:bg-[#D9F36A] dark:text-[#0F2A1D] hover:scale-105'
            }`}
          >
            <Camera className="w-6 h-6 stroke-[2]" />
          </button>
        </div>

        {/* 4. Ask Plantly */}
        <button
          type="button"
          aria-label="Ask Plantly AI companion"
          aria-current={activeTab === 'assistant' ? 'page' : undefined}
          onClick={() => onSelectTab('assistant')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 ${
            activeTab === 'assistant'
              ? 'text-[#0F2A1D] dark:text-[#F5F2E9] font-semibold'
              : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] dark:hover:text-[#F5F2E9]'
          }`}
        >
          <MessageCircle className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] tracking-tight mt-1">Ask Plantly</span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          aria-label="Profile and settings"
          aria-current={activeTab === 'profile' ? 'page' : undefined}
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 ${
            activeTab === 'profile'
              ? 'text-[#0F2A1D] dark:text-[#F5F2E9] font-semibold'
              : 'text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] dark:hover:text-[#F5F2E9]'
          }`}
        >
          <User className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] tracking-tight mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
