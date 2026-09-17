import { ThemeMode } from '../types';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  hindiName: string;
  tagline: string;
  previewColor: string;
  accentColor: string;
  bgCanvas: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  buttonGradient: string;
  badgeBg: string;
  isLight: boolean;
}

export const themeConfigs: Record<ThemeMode, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'BharatPay Corporate Banking',
    hindiName: 'कॉर्पोरेट बैंकिंग (Light)',
    tagline: 'साफ, पारदर्शी व आधुनिक बैंकिंग रूप',
    previewColor: '#2563eb',
    accentColor: 'blue',
    bgCanvas: 'bg-slate-50',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200 shadow-sm',
    headerBg: 'bg-white/95',
    buttonGradient: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    isLight: true
  },
  phonepe: {
    id: 'phonepe',
    name: 'BharatPay Blue Clean',
    hindiName: 'रॉयल ब्लू लाइट',
    tagline: 'क्लासिक यूपीआई फिनटेक लुक',
    previewColor: '#1d4ed8',
    accentColor: 'blue',
    bgCanvas: 'bg-slate-50',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    cardBg: 'bg-white',
    cardBorder: 'border-blue-100 shadow-sm',
    headerBg: 'bg-white/95',
    buttonGradient: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    isLight: true
  },
  emerald: {
    id: 'emerald',
    name: 'Kisan Agro Banking Clean',
    hindiName: 'किसान एग्रो लाइट',
    tagline: 'मंडी व कृषि समृद्ध ग्रीन थीम',
    previewColor: '#059669',
    accentColor: 'emerald',
    bgCanvas: 'bg-emerald-50/30',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-200 shadow-sm',
    headerBg: 'bg-white/95',
    buttonGradient: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    isLight: true
  },
  gold: {
    id: 'gold',
    name: 'Royal Bullion Vault Clean',
    hindiName: 'रॉयल गोल्ड लाइट',
    tagline: 'सोना-चांदी विशेष लाइट थीम',
    previewColor: '#d97706',
    accentColor: 'amber',
    bgCanvas: 'bg-amber-50/30',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-200 shadow-sm',
    headerBg: 'bg-white/95',
    buttonGradient: 'bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    isLight: true
  }
};

export const getStoredTheme = (): ThemeMode => {
  return 'light';
};

export const saveTheme = (_theme: ThemeMode) => {
  try {
    localStorage.setItem('bharatpay_theme', 'light');
  } catch (e) {
    console.error('Error saving theme to storage', e);
  }
};

