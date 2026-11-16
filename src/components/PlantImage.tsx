import React, { useState } from 'react';
import { Sprout } from 'lucide-react';

interface PlantImageProps {
  src: string;
  alt: string;
  className?: string;
  badge?: React.ReactNode;
}

export const PlantImage: React.FC<PlantImageProps> = ({
  src,
  alt,
  className = '',
  badge,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#EEF0E4] dark:bg-[#1C3226] ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#EEF0E4] to-[#E6EADA] dark:from-[#1C3226] dark:to-[#10231A]">
          <div className="w-10 h-10 rounded-full bg-[#D9F36A]/30 text-[#0F2A1D] dark:text-[#D9F36A] flex items-center justify-center mb-1">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-serif font-bold text-[#0F2A1D] dark:text-[#F5F2E9] truncate max-w-[90%]">
            {alt}
          </span>
        </div>
      )}
      {badge}
    </div>
  );
};
