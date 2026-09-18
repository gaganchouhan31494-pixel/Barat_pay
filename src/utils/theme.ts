import { ThemeMode } from '../types';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
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
    name: 'BharatPay Fintech Blue',
    tagline: 'Modern Indian digital payment interface',
    previewColor: '#2447E8',
    accentColor: 'blue',
    bgCanvas: 'bg-[#F7F9FF]',
    textPrimary: 'text-[#151A2D]',
    textSecondary: 'text-[#697086]',
    cardBg: 'bg-white',
    cardBorder: 'border-[#E6ECFA] shadow-xs',
    headerBg: 'bg-white/95',
    buttonGradient: 'bg-[#2447E8] hover:bg-[#1738C8] text-white shadow-xs',
    badgeBg: 'bg-[#EEF3FF] text-[#2447E8] border-[#E6ECFA]',
    isLight: true
  },
  phonepe: {
    id: 'phonepe',
    name: 'Royal Blue Classic',
    tagline: 'High contrast UPI fintech system',
    previewColor: '#2447E8',
    accentColor: 'blue',
    bgCanvas: 'bg-[#F7F9FF]',
    textPrimary: 'text-[#151A2D]',
    textSecondary: 'text-[#697086]',
    cardBg: 'bg-white',
    cardBorder: 'border-[#E6ECFA] shadow-xs',
    headerBg: 'bg-white/95',
    buttonGradient: 'bg-[#2447E8] hover:bg-[#1738C8] text-white shadow-xs',
    badgeBg: 'bg-[#EEF3FF] text-[#2447E8] border-[#E6ECFA]',
    isLight: true
  },
  emerald: {
    id: 'emerald',
    name: 'Verified Merchant Surface',
    tagline: 'Clean verified banking scheme',
    previewColor: '#20B486',
    accentColor: 'emerald',
    bgCanvas: 'bg-[#F7F9FF]',
    textPrimary: 'text-[#151A2D]',
    textSecondary: 'text-[#697086]',
    cardBg: 'bg-white',
    cardBorder: 'border-[#E6ECFA] shadow-xs',
    headerBg: 'bg-white/95',
    buttonGradient: 'bg-[#2447E8] hover:bg-[#1738C8] text-white shadow-xs',
    badgeBg: 'bg-[#EEF3FF] text-[#2447E8] border-[#E6ECFA]',
    isLight: true
  },
  gold: {
    id: 'gold',
    name: 'Bullion & Gold Lending',
    tagline: 'Specialized gold collateral theme',
    previewColor: '#2447E8',
    accentColor: 'amber',
    bgCanvas: 'bg-[#F7F9FF]',
    textPrimary: 'text-[#151A2D]',
    textSecondary: 'text-[#697086]',
    cardBg: 'bg-white',
    cardBorder: 'border-[#E6ECFA] shadow-xs',
    headerBg: 'bg-white/95',
    buttonGradient: 'bg-[#2447E8] hover:bg-[#1738C8] text-white shadow-xs',
    badgeBg: 'bg-[#EEF3FF] text-[#2447E8] border-[#E6ECFA]',
    isLight: true
  }
};

const THEME_STORAGE_KEY = 'bharatpay_theme_mode_v2';

export function getStoredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && ['phonepe', 'emerald', 'gold', 'light'].includes(saved)) {
      return saved as ThemeMode;
    }
  } catch {
    // ignore
  }
  return 'light';
}

export function saveTheme(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}
