import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  Radio, 
  Play, 
  Sparkles, 
  Languages 
} from 'lucide-react';
import { soundService } from '../utils/audio';
import { Language } from '../types';

interface SoundboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SoundboxModal: React.FC<SoundboxModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const testAnnounce = (amount: number, type: 'RECEIVE' | 'ADD' | 'LOAN' = 'RECEIVE') => {
    soundService.playClick();
    setIsPlaying(true);
    soundService.announcePayment(amount, type, language);
    setTimeout(() => setIsPlaying(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white border border-[#E6ECFA] shadow-2xl p-6 text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#697086] hover:text-[#151A2D] hover:bg-[#F7F9FF] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#2447E8]" /> BharatPay Smart Soundbox 4G
          </div>
          <h3 className="text-base font-bold text-[#151A2D] mt-2">Instant Audio Payment Verification</h3>
          <p className="text-xs text-[#697086]">Clear audio announcements for every merchant &amp; wallet transaction</p>
        </div>

        {/* Soundbox Device Visual Representation */}
        <div className="relative w-40 h-44 mx-auto bg-gradient-to-b from-[#EEF3FF] to-[#F7F9FF] rounded-2xl border-2 border-[#E6ECFA] p-3 shadow-md flex flex-col items-center justify-between">
          {/* LED Ring / Indicator */}
          <div className="flex items-center justify-between w-full px-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#20B486] animate-ping' : 'bg-[#2447E8]'}`} />
            <span className="text-[9px] font-mono font-bold text-[#697086]">4G SIM CONNECTED</span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#20B486]" />
          </div>

          {/* Speaker Mesh Holes Pattern */}
          <div className="w-24 h-24 rounded-full bg-white border-2 border-[#E6ECFA] flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="grid grid-cols-5 gap-1.5 p-3 opacity-60">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#20B486] animate-pulse' : 'bg-[#CBD5E1]'}`} />
              ))}
            </div>
            <Volume2 className={`w-8 h-8 absolute text-[#2447E8] ${isPlaying ? 'scale-125 animate-bounce text-[#20B486]' : 'opacity-80'}`} />
          </div>

          {/* Device Brand */}
          <div className="text-[10px] font-extrabold text-[#2447E8] tracking-widest uppercase">
            BharatPay
          </div>
        </div>

        {/* Voice Language Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <Languages className="w-4 h-4 text-[#697086]" />
          <span className="text-[#697086] font-medium">Audio Language:</span>
          <span className="font-bold text-[#151A2D] bg-[#EEF3FF] px-2.5 py-0.5 rounded-lg border border-[#E6ECFA]">
            English (Universal)
          </span>
        </div>

        {/* Quick Test Voice Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#697086]">
            Test Audio Announcements:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => testAnnounce(100, 'RECEIVE')}
              className="py-2 px-3 rounded-xl bg-[#F7F9FF] hover:bg-[#EEF3FF] border border-[#E6ECFA] text-xs font-bold text-[#151A2D] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#20B486] fill-[#20B486]" />
              <span>₹100 Received</span>
            </button>
            <button
              type="button"
              onClick={() => testAnnounce(500, 'RECEIVE')}
              className="py-2 px-3 rounded-xl bg-[#F7F9FF] hover:bg-[#EEF3FF] border border-[#E6ECFA] text-xs font-bold text-[#151A2D] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#20B486] fill-[#20B486]" />
              <span>₹500 Received</span>
            </button>
            <button
              type="button"
              onClick={() => testAnnounce(2000, 'ADD')}
              className="py-2 px-3 rounded-xl bg-[#EEF3FF] hover:bg-[#2447E8] hover:text-white border border-[#E6ECFA] text-xs font-bold text-[#2447E8] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer group"
            >
              <Play className="w-3 h-3 text-[#2447E8] group-hover:text-white fill-current" />
              <span>Wallet Load</span>
            </button>
            <button
              type="button"
              onClick={() => testAnnounce(50000, 'LOAN')}
              className="py-2 px-3 rounded-xl bg-[#EEF3FF] hover:bg-[#2447E8] hover:text-white border border-[#E6ECFA] text-xs font-bold text-[#2447E8] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer group"
            >
              <Sparkles className="w-3 h-3 text-[#F4B740]" />
              <span>Loan Disbursal</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-xs font-bold text-white transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
