import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Radio, 
  Play, 
  CheckCircle2, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-600" /> BharatPay Smart Soundbox 4G
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-2">पेटीएम व फोनपे स्टाइल साउंडबॉक्स</h3>
          <p className="text-xs text-slate-500">हर लेन-देन पर तेज आवाज में लाइव पेमेंट घोषणा</p>
        </div>

        {/* Soundbox Device Visual Representation */}
        <div className="relative w-40 h-44 mx-auto bg-gradient-to-b from-blue-50 to-blue-100/60 rounded-2xl border-4 border-blue-200 p-3 shadow-md flex flex-col items-center justify-between">
          {/* LED Ring / Indicator */}
          <div className="flex items-center justify-between w-full px-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-blue-600'}`} />
            <span className="text-[9px] font-mono font-bold text-slate-600">4G SIM ACTIVE</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>

          {/* Speaker Mesh Holes Pattern */}
          <div className="w-24 h-24 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="grid grid-cols-5 gap-1.5 p-3 opacity-60">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
              ))}
            </div>
            <Volume2 className={`w-8 h-8 absolute text-blue-600 ${isPlaying ? 'scale-125 animate-bounce text-amber-500' : 'opacity-80'}`} />
          </div>

          {/* Device Brand */}
          <div className="text-[10px] font-bold text-blue-700 tracking-widest uppercase">
            BharatPay
          </div>
        </div>

        {/* Voice Language Selector */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <Languages className="w-4 h-4 text-slate-500" />
          <span className="text-slate-700 font-medium">आवाज भाषा:</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English</option>
            <option value="bg">बागड़ी / मारवाड़ी</option>
          </select>
        </div>

        {/* Quick Test Voice Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-600">
            टेस्ट करने के लिए बटन दबाएं:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => testAnnounce(100, 'RECEIVE')}
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>₹100 प्राप्त हुए</span>
            </button>
            <button
              type="button"
              onClick={() => testAnnounce(500, 'RECEIVE')}
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>₹500 प्राप्त हुए</span>
            </button>
            <button
              type="button"
              onClick={() => testAnnounce(2000, 'ADD')}
              className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
              <span>वॉलेट लोड आवाज</span>
            </button>
            <button
              type="button"
              onClick={() => testAnnounce(50000, 'LOAN')}
              className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>लोन स्वीकृति आवाज</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          ठीक है, बंद करें
        </button>
      </div>
    </div>
  );
};
