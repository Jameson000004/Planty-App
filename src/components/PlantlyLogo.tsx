import React from 'react';

interface PlantlyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export const PlantlyLogo: React.FC<PlantlyLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl sm:text-5xl',
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-1.5">
        {/* Botanical P with custom leaf embellishment */}
        <div className="relative flex items-center justify-center">
          <span
            className={`font-serif font-bold tracking-tight text-[#0F2A1D] dark:text-[#F5F2E9] ${sizeClasses[size]}`}
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Plantly
          </span>
          {/* Subtle botanical sprout accent dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9F36A] ml-0.5 inline-block -translate-y-1 shadow-sm" />
        </div>
      </div>
      {showTagline && (
        <span className="text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium text-[#5D6E61] dark:text-[#C1CEBE] mt-1 font-sans">
          Your plants, understood.
        </span>
      )}
    </div>
  );
};
