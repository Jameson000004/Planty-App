import React, { useState } from 'react';
import { Plant, CareSchedule } from '../types';
import { Camera, X, Plus, Sprout, Sparkles } from 'lucide-react';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlant: (
    newPlant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>,
    suggestedSchedules: Omit<CareSchedule, 'id'>[]
  ) => void;
  onOpenScan: () => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onSavePlant,
  onOpenScan,
}) => {
  const [mode, setMode] = useState<'choose' | 'manual'>('choose');
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [locationLabel, setLocationLabel] = useState('Living Room');
  const [waterInterval, setWaterInterval] = useState(7);
  const [lightLevel, setLightLevel] = useState<Plant['lightLevel']>('bright_indirect');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for your plant.');
      return;
    }

    onSavePlant(
      {
        name: name.trim(),
        commonName: name.trim(),
        scientificName: scientificName.trim() || name.trim(),
        identificationStatus: 'manual',
        imageUrl,
        locationLabel,
        lightLevel,
        humidityNeeds: '40–60%',
        potType: 'Planter with drainage',
        soilType: 'Standard indoor potting mix',
        notes: 'Manually added plant.',
      },
      [
        {
          plantId: '',
          taskType: 'water',
          intervalDays: Number(waterInterval) || 7,
          localTime: '09:00',
          enabled: true,
          description: `Every ${waterInterval} days`,
        },
        {
          plantId: '',
          taskType: 'soil_check',
          intervalDays: 4,
          localTime: '09:00',
          enabled: true,
          description: 'Check soil moisture',
        },
      ]
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#FBFBF7] dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl p-6 shadow-2xl relative text-[#0F2A1D] dark:text-[#F5F2E9] space-y-4">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-1">
          <h2 className="font-serif font-bold text-xl text-[#0F2A1D] dark:text-[#F5F2E9]">
            Add a plant
          </h2>
          <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-1 font-sans">
            How would you like to add your plant?
          </p>
        </div>

        {mode === 'choose' ? (
          <div className="space-y-3 pt-2">
            {/* Option 1: Photo Identification */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenScan();
              }}
              className="w-full p-4 rounded-2xl bg-[#EEF0E4] dark:bg-[#253E31] hover:bg-[#E2E6D5] dark:hover:bg-[#2d4b3c] border border-[#E2E6D5] dark:border-[#34483B] text-left flex items-center gap-3.5 transition-all cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-full bg-[#D9F36A] text-[#0F2A1D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Camera className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
                  Photo identification
                </p>
                <p className="text-[11px] text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5">
                  Point camera or choose photo to identify species & get initial care plan
                </p>
              </div>
            </button>

            {/* Option 2: Manual entry */}
            <button
              type="button"
              onClick={() => setMode('manual')}
              className="w-full p-4 rounded-2xl bg-white dark:bg-[#10231A] hover:bg-[#EEF0E4]/50 dark:hover:bg-[#253E31]/50 border border-[#E2E6D5] dark:border-[#34483B] text-left flex items-center gap-3.5 transition-all cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-full bg-[#EEF0E4] dark:bg-[#253E31] text-[#0F2A1D] dark:text-[#F5F2E9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Sprout className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-[#0F2A1D] dark:text-[#F5F2E9]">
                  Manual entry
                </p>
                <p className="text-[11px] text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5">
                  Type your plant&apos;s name and choose your preferred watering schedule
                </p>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitManual} className="space-y-3 pt-1 text-xs">
            {error && (
              <p className="p-2 rounded-xl bg-[#FF7A59]/15 text-[#FF7A59] font-medium text-[11px]">
                {error}
              </p>
            )}

            <div>
              <label className="font-semibold block mb-1 text-[#0F2A1D] dark:text-[#F5F2E9]">
                Plant Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Fiddle Leaf Fig"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] text-[#0F2A1D] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#D9F36A]"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-[#0F2A1D] dark:text-[#F5F2E9]">
                Room / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Living Room, Bedroom"
                value={locationLabel}
                onChange={(e) => setLocationLabel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] text-[#0F2A1D] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#D9F36A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1 text-[#0F2A1D] dark:text-[#F5F2E9]">
                  Watering (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={waterInterval}
                  onChange={(e) => setWaterInterval(parseInt(e.target.value, 10) || 7)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] text-[#0F2A1D] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#D9F36A]"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-[#0F2A1D] dark:text-[#F5F2E9]">
                  Light Need
                </label>
                <select
                  value={lightLevel}
                  onChange={(e) => setLightLevel(e.target.value as Plant['lightLevel'])}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] text-[#0F2A1D] dark:text-[#F5F2E9] focus:outline-none focus:ring-2 focus:ring-[#D9F36A]"
                >
                  <option value="bright_indirect">Bright, indirect</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low light</option>
                  <option value="direct">Direct sun</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="flex-1 py-3 rounded-full bg-white dark:bg-[#10231A] border border-[#E2E6D5] dark:border-[#34483B] font-semibold text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-full bg-[#D9F36A] text-[#0F2A1D] font-bold text-xs hover:bg-[#cbf046] shadow-sm cursor-pointer"
              >
                Save Plant
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
