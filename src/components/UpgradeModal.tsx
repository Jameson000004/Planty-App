import React, { useState } from 'react';
import { Check, Sparkles, X, ShieldCheck } from 'lucide-react';
import { PlantlyLogo } from './PlantlyLogo';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isUpgraded: boolean;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  isUpgraded,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#FBFBF7] dark:bg-[#1C3226] border border-[#E2E6D5] dark:border-[#34483B] rounded-3xl p-6 shadow-2xl relative text-[#0F2A1D] dark:text-[#F5F2E9] space-y-4">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close upgrade dialog"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#5D6E61] dark:text-[#C1CEBE] hover:text-[#0F2A1D] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <PlantlyLogo size="lg" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9F36A] text-[#0F2A1D] text-xs font-bold mt-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plantly Plus</span>
          </div>
          <p className="text-xs text-[#5D6E61] dark:text-[#C1CEBE] mt-2">
            Elevate your plant parenting with unlimited care intelligence.
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white dark:bg-[#10231A] rounded-2xl p-4 border border-[#E2E6D5] dark:border-[#34483B] space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E6D5] dark:border-[#34483B]">
            <span className="font-medium text-[#5D6E61] dark:text-[#C1CEBE]">Plant Collection</span>
            <span className="font-bold text-[#0F2A1D] dark:text-[#D9F36A]">Unlimited (vs 5)</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E6D5] dark:border-[#34483B]">
            <span className="font-medium text-[#5D6E61] dark:text-[#C1CEBE]">AI Identification & Health</span>
            <span className="font-bold text-[#0F2A1D] dark:text-[#D9F36A]">250 scans / mo</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E6D5] dark:border-[#34483B]">
            <span className="font-medium text-[#5D6E61] dark:text-[#C1CEBE]">Care History & Logs</span>
            <span className="font-bold text-[#0F2A1D] dark:text-[#D9F36A]">Full lifetime</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#5D6E61] dark:text-[#C1CEBE]">Priority Botanical Chat</span>
            <span className="font-bold text-[#0F2A1D] dark:text-[#D9F36A]">Included</span>
          </div>
        </div>

        {/* Billing Selector */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setBillingPeriod('annual')}
            className={`p-3 rounded-2xl text-left border transition-all ${
              billingPeriod === 'annual'
                ? 'border-[#0F2A1D] dark:border-[#D9F36A] bg-[#EEF0E4]/80 dark:bg-[#253E31]'
                : 'border-[#E2E6D5] dark:border-[#34483B] bg-white dark:bg-[#10231A]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold">Annual</span>
              <span className="px-1.5 py-0.5 rounded-sm bg-[#D9F36A] text-[#0F2A1D] text-[9px] font-bold">
                Save 38%
              </span>
            </div>
            <p className="font-bold text-sm">$29.99/yr</p>
            <span className="text-[10px] text-[#5D6E61] dark:text-[#C1CEBE]">$2.50/month</span>
          </button>

          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            className={`p-3 rounded-2xl text-left border transition-all ${
              billingPeriod === 'monthly'
                ? 'border-[#0F2A1D] dark:border-[#D9F36A] bg-[#EEF0E4]/80 dark:bg-[#253E31]'
                : 'border-[#E2E6D5] dark:border-[#34483B] bg-white dark:bg-[#10231A]'
            }`}
          >
            <div className="font-bold mb-1">Monthly</div>
            <p className="font-bold text-sm">$3.99/mo</p>
            <span className="text-[10px] text-[#5D6E61] dark:text-[#C1CEBE]">Billed monthly</span>
          </button>
        </div>

        {/* Call to action */}
        <button
          type="button"
          onClick={() => {
            onUpgrade();
            onClose();
          }}
          className="w-full py-3.5 px-4 rounded-full bg-[#D9F36A] text-[#0F2A1D] font-bold text-sm shadow-md hover:bg-[#cbf046] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isUpgraded ? 'Manage Subscription' : 'Start 7-Day Free Trial'}</span>
        </button>

        <div className="flex items-center justify-between text-[10px] text-[#5D6E61] dark:text-[#C1CEBE] pt-1">
          <button
            type="button"
            onClick={() => {
              onUpgrade();
              onClose();
            }}
            className="hover:underline"
          >
            Restore purchases
          </button>
          <span>Cancel anytime in App Store</span>
        </div>
      </div>
    </div>
  );
};
