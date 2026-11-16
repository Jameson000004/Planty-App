import React from 'react';
import { PlantlyLogo } from './PlantlyLogo';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeViewProps {
  onStart: (isGuest?: boolean) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#FBFBF7] dark:bg-[#10231A] text-[#0F2A1D] dark:text-[#F5F2E9] flex flex-col justify-between px-6 py-10 max-w-md mx-auto transition-colors duration-200">
      {/* Top Header */}
      <header className="flex flex-col items-center pt-4 text-center">
        <PlantlyLogo size="xl" showTagline={true} />
      </header>

      {/* Hero Visual Area */}
      <div className="relative my-auto py-4 flex flex-col items-center justify-center">
        <div className="relative w-64 h-72 sm:w-72 sm:h-80 flex items-center justify-center">
          {/* Subtle soft backdrop glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#EEF0E4] to-[#E6EADA] dark:from-[#1C3226] dark:to-[#10231A] rounded-full blur-2xl opacity-70 -z-10" />

          {/* Plant Photography Showcase */}
          <img
            src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"
            alt="Potted Fiddle Leaf Fig botanical hero"
            className="w-full h-full object-contain filter drop-shadow-xl select-none"
            loading="eager"
          />
        </div>

        <div className="text-center mt-3 px-4">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#0F2A1D] dark:text-[#F5F2E9]">
            Plant care, finally clear.
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6E61] dark:text-[#C1CEBE] mt-1.5 leading-relaxed font-sans">
            Identify species, understand symptoms without false certainty, and cultivate healthy routines.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-4">
        {/* Primary Get Started Button */}
        <button
          type="button"
          onClick={() => onStart(true)}
          className="w-full py-4 px-6 rounded-full bg-[#D9F36A] hover:bg-[#cbf046] active:scale-[0.98] text-[#0F2A1D] font-semibold text-base shadow-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Continue with Apple */}
        <button
          type="button"
          onClick={() => onStart(false)}
          className="w-full py-3.5 px-6 rounded-full bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] hover:bg-[#EEF0E4]/50 dark:hover:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.88-.9.04-1.98.6-2.61 1.34-.56.63-1.05 1.68-.92 2.73 1 .08 2-.45 2.61-1.19z" />
          </svg>
          <span>Continue with Apple</span>
        </button>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={() => onStart(false)}
          className="w-full py-3.5 px-6 rounded-full bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] hover:bg-[#EEF0E4]/50 dark:hover:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer text */}
        <p className="text-center text-[11px] text-[#5D6E61] dark:text-[#C1CEBE] pt-2">
          By continuing, you agree to Plantly&apos;s Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};
