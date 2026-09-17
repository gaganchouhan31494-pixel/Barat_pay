import React from 'react';
import { Palette, Check, Sparkles, X, Sun, Moon } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <span>थीम चुनें (Choose Theme)</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </h3>
              <p className="text-[11px] text-slate-500">सभी थीम स्वच्छ व आधुनिक लाइट मोड में हैं</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
                    ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Swatch Pill */}
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden border border-slate-200"
                    style={{ backgroundColor: theme.previewColor }}
                  >
                    <Sun className="w-5 h-5 text-white drop-shadow" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {theme.hindiName}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                          सक्रिय (Active)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {theme.tagline}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border border-slate-300 group-hover:border-slate-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          थीम तुरंत लागू होगी और आपकी प्राथमिकता सुरक्षित रहेगी।
        </div>
      </div>
    </div>
  );
};
