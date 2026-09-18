import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  brandName?: string;
  tagline?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  brandName = 'BharatPay',
  tagline = 'Simple. Secure. Digital Payments.'
}) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 300);
    const timer2 = setTimeout(() => setProgress(80), 700);
    const timer3 = setTimeout(() => setProgress(100), 1200);
    const timer4 = setTimeout(() => onComplete(), 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-gradient-to-br from-[#1738C8] via-[#2447E8] to-[#315BFF] text-white select-none animate-fade-in overflow-hidden">
      {/* Subtle Geometric Ambient Background Orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#315BFF]/30 blur-3xl pointer-events-none" />

      {/* Top Bar / Skip Button */}
      <div className="w-full max-w-md flex justify-end relative z-10">
        <button
          type="button"
          onClick={onComplete}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center space-y-6 relative z-10 max-w-md">
        {/* Animated Brand Emblem */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl bg-white/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white text-[#2447E8] shadow-2xl shadow-[#1738C8]/60 flex items-center justify-center p-2 ring-4 ring-white/30 transform transition-transform hover:scale-105">
            {/* Custom Modern Fintech Monogram */}
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#F7F9FF] to-[#EEF3FF] border border-[#E6ECFA] flex items-center justify-center font-black text-4xl sm:text-5xl text-[#2447E8] tracking-tighter">
              ₹
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#20B486] text-white border-2 border-white flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Title and Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {brandName}
          </h1>
          <p className="text-sm sm:text-base font-medium text-white/85 max-w-xs mx-auto leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Subtle Animated Progress Bar */}
        <div className="w-48 sm:w-56 space-y-2 pt-4">
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden p-0.5 backdrop-blur-sm">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/75 font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20B486] animate-ping" />
            <span>Connecting secure payment gateway...</span>
          </div>
        </div>
      </div>

      {/* Footer Security Badge */}
      <div className="relative z-10 flex items-center justify-center gap-2 text-xs font-semibold text-white/80 bg-black/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        <ShieldCheck className="w-4 h-4 text-[#20B486]" />
        <span>Protected with 256-bit encryption</span>
      </div>
    </div>
  );
};
