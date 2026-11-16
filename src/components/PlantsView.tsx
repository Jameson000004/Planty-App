import React, { useState } from 'react';
import { Plant, CareTask } from '../types';
import { getDueBadgeText } from '../lib/care-logic';
import { PlantImage } from './PlantImage';
import { Search, Plus, Sparkles, Filter, X } from 'lucide-react';

interface PlantsViewProps {
  plants: Plant[];
  tasks: CareTask[];
  onSelectPlant: (plant: Plant) => void;
  onOpenAddModal: () => void;
  onOpenScan: () => void;
}

export const PlantsView: React.FC<PlantsViewProps> = ({
  plants,
  tasks,
  onSelectPlant,
  onOpenAddModal,
  onOpenScan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'needs_attention' | string>('all');

  // Compute unique rooms
  const rooms = Array.from(new Set(plants.map((p) => p.locationLabel).filter(Boolean)));

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.locationLabel.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'needs_attention') {
      // Plant has overdue task or name matches snake plant with symptom
      const hasOverdue = tasks.some(
        (t) => t.plantId === plant.id && t.status === 'due' && new Date(t.dueAt) < new Date()
      );
      return hasOverdue || plant.id === 'plant-snake';
    }
    return plant.locationLabel === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-[#FBFBF7] dark:bg-[#10231A] text-[#0F2A1D] dark:text-[#F5F2E9] pb-24 transition-colors duration-200">
      {/* Top Header */}
      <header className="px-5 pt-7 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2A1D] dark:text-[#F5F2E9]">
            My Plants
          </h1>
          <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-0.5 font-sans">
            {plants.length} {plants.length === 1 ? 'plant' : 'plants'} in your care
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="h-10 px-3.5 rounded-full bg-[#0F2A1D] text-[#D9F36A] dark:bg-[#D9F36A] dark:text-[#0F2A1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Plant</span>
          </button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="px-5 space-y-3 mb-5">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5D6E61] dark:text-[#C1CEBE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search plants or rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] text-xs text-[#0F2A1D] dark:text-[#F5F2E9] placeholder-[#5D6E61]/60 focus:outline-none focus:ring-2 focus:ring-[#D9F36A] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D6E61] hover:text-[#0F2A1D] dark:text-[#C1CEBE]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#0F2A1D] text-[#D9F36A] dark:bg-[#D9F36A] dark:text-[#0F2A1D]'
                : 'bg-[#EEF0E4] dark:bg-[#1C3226] text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D]'
            }`}
          >
            All Plants
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('needs_attention')}
            className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'needs_attention'
                ? 'bg-[#FF7A59] text-white'
                : 'bg-[#EEF0E4] dark:bg-[#1C3226] text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#FF7A59]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A59]" />
            Needs Attention
          </button>
        </div>
      </div>

      {/* Plants Grid */}
      <main className="px-5">
        {filteredPlants.length === 0 ? (
          <div className="bg-[#EEF0E4]/60 dark:bg-[#1C3226]/50 rounded-3xl p-8 text-center border border-[#E2E6D5] dark:border-[#34483B] mt-4">
            <p className="font-serif font-bold text-base text-[#0F2A1D] dark:text-[#F5F2E9]">
              No plants found
            </p>
            <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-1.5">
              {searchQuery
                ? 'Try adjusting your search keywords.'
                : 'Add your first plant to begin tracking its personalized care routine.'}
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#D9F36A] text-[#0F2A1D] font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add a plant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredPlants.map((plant) => {
              const nextTask = tasks.find((t) => t.plantId === plant.id && t.status === 'due');
              const isNeedsAttention = plant.id === 'plant-snake';

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
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 dark:bg-[#10231A]/95 backdrop-blur-xs text-[10px] font-medium flex items-center gap-1 shadow-xs">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isNeedsAttention ? 'bg-[#FF7A59]' : 'bg-[#10B981]'
                          }`}
                        />
                        <span className={isNeedsAttention ? 'text-[#FF7A59] font-semibold' : 'text-[#0F2A1D] dark:text-[#F5F2E9]'}>
                          {isNeedsAttention ? 'Needs attention' : 'Healthy'}
                        </span>
                      </div>
                    }
                  />

                  <div>
                    <h2 className="font-serif font-bold text-sm text-[#0F2A1D] dark:text-[#F5F2E9] truncate">
                      {plant.name}
                    </h2>
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
        )}
      </main>
    </div>
  );
};
