import React from 'react';
import { Palette, Check, Sparkles, X, Sun } from 'lucide-react';
import { ThemeMode } from '../types';
import { themeConfigs } from '../utils/theme';
import { soundService } from '../utils/audio';

interface ThemeSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#E6ECFA] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#F7F9FF] border-b border-[#E6ECFA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#151A2D] flex items-center gap-2">
                <span>Display Theme</span>
                <Sparkles className="w-3.5 h-3.5 text-[#2447E8]" />
              </h3>
              <p className="text-[11px] text-[#697086]">Tailored for high contrast Indian fintech readability</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-[#697086] hover:text-[#151A2D] hover:bg-[#EEF3FF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme List */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {Object.values(themeConfigs).map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer group active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#2447E8] bg-[#EEF3FF]/70 shadow-xs'
                    : 'border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Swatch Pill */}
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs relative overflow-hidden border border-[#E6ECFA]"
                    style={{ backgroundColor: theme.previewColor }}
                  >
                    <Sun className="w-5 h-5 text-white drop-shadow" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#151A2D] group-hover:text-[#2447E8] transition-colors">
                        {theme.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/20">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#697086] mt-0.5">
                      {theme.tagline}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-[#2447E8] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border border-[#CBD5E1] group-hover:border-[#9AA2B3]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F7F9FF] border-t border-[#E6ECFA] text-center text-[11px] text-[#697086]">
          Theme preference is saved across your digital banking sessions.
        </div>
      </div>
    </div>
  );
};
