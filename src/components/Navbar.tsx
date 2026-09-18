import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Wallet, 
  Trophy, 
  User, 
  Volume2, 
  VolumeX, 
  QrCode, 
  CheckCircle2, 
  PhoneCall,
  Smartphone,
  Bell,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LogOut,
  LogIn,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { Language, UserWallet } from '../types';
import { soundService } from '../utils/audio';
import { AvatarIcon } from './AvatarIcon';

interface NavbarProps {
  wallet: UserWallet;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenScan: () => void;
  onOpenMyQr: () => void;
  onOpenSoundbox: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeTab: 'home' | 'wallet' | 'loans' | 'rewards' | 'profile' | 'showcase';
  onSelectTab: (tab: 'home' | 'wallet' | 'loans' | 'rewards' | 'profile' | 'showcase') => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenAuth: () => void;
  isAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  language,
  onLanguageChange,
  onOpenScan,
  onOpenMyQr,
  onOpenSoundbox,
  soundEnabled,
  onToggleSound,
  activeTab,
  onSelectTab,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenAuth,
  isAuthenticated = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  const navItems: Array<{ 
    id: 'home' | 'wallet' | 'loans' | 'rewards' | 'profile' | 'showcase'; 
    label: string; 
    shortLabel: string;
    badge?: string; 
    icon: React.ComponentType<{ className?: string }> 
  }> = [
    { id: 'home', label: 'Dashboard', shortLabel: 'Home', icon: Building2 },
    { id: 'wallet', label: 'Wallet & Passbook', shortLabel: 'Wallet', icon: Wallet },
    { id: 'loans', label: 'Gold & Silver Loans', shortLabel: 'Gold Loan', badge: '75% LTV', icon: Sparkles },
    { id: 'rewards', label: 'Rewards & Offers', shortLabel: 'Rewards', badge: '₹2,450', icon: Trophy },
    { id: 'profile', label: 'Account & KYC', shortLabel: 'Profile', icon: User },
    { id: 'showcase', label: 'Mobile Mockup', shortLabel: 'Mockup', icon: Smartphone }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E6ECFA] transition-colors">
      {/* Top Security & Financial Verification Strip */}
      <div className="bg-[#F7F9FF] border-b border-[#E6ECFA] text-[#697086] px-3 sm:px-6 lg:px-8 py-1 text-[11px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: NPCI certification pill */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#20B486] ring-2 ring-[#20B486]/20 animate-pulse shrink-0" />
            <span className="font-semibold text-[#151A2D] text-[10px] sm:text-[11px] truncate">
              NPCI UPI 2.0 Platform
            </span>
            <span className="hidden sm:inline text-[#E6ECFA]">|</span>
            <span className="hidden md:inline text-[#697086] text-[11px]">
              Branch: <strong className="text-[#151A2D] font-medium">6MLD Gharsana (Sri Ganganagar)</strong>
            </span>
            <span className="hidden lg:inline text-[#E6ECFA]">|</span>
            <span className="hidden lg:inline text-[#697086] text-[11px]">
              Nodal: <strong className="text-[#151A2D] font-medium">SBI Gateway</strong>
            </span>
          </div>

          {/* Right: Language switch & Helpline */}
          <div className="flex items-center gap-2 sm:gap-3 text-[#697086] shrink-0">
            {/* Language Selector */}
            <div className="flex items-center gap-0.5 bg-[#EEF3FF] p-0.5 rounded-lg text-[10px] font-bold">
              {(['en', 'hi', 'bg'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    language === lang 
                      ? 'bg-[#2447E8] text-white shadow-xs' 
                      : 'text-[#697086] hover:text-[#151A2D]'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'HI' : 'REG'}
                </button>
              ))}
            </div>

            <a 
              href="tel:18002006653" 
              className="hidden sm:flex items-center gap-1 text-[10px] sm:text-[11px] text-[#697086] hover:text-[#2447E8] transition-colors font-medium"
            >
              <PhoneCall className="w-3 h-3 text-[#20B486] shrink-0" />
              <span className="hidden md:inline">24x7 Helpline: 1800-200-6MLD</span>
              <span className="md:hidden">1800-200-6MLD</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Crest */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button 
            type="button"
            onClick={() => {
              soundService.playClick();
              onSelectTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#2447E8] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1738C8] transition-colors font-bold text-base sm:text-lg shrink-0">
              ₹
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#151A2D]">
                  Bharat<span className="text-[#2447E8]">Pay</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#EEF3FF] text-[#2447E8] border border-[#2447E8]/15 shrink-0">
                  Fintech
                </span>
              </div>
              <p className="text-[10px] text-[#697086] leading-none hidden sm:block">
                Digital Payments &amp; Gold Loans
              </p>
            </div>
          </button>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F7F9FF] p-1 rounded-xl border border-[#E6ECFA] text-xs font-semibold">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onSelectTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#2447E8] shadow-xs font-bold'
                    : 'text-[#697086] hover:text-[#151A2D] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.id === 'loans' ? 'text-[#F4B740]' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#EEF3FF] text-[#2447E8]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Soundbox Voice Speaker Button */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenSoundbox();
            }}
            title="Instant Audio Notification Speaker"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#F4B740]/30 bg-[#F4B740]/10 text-[#151A2D] text-xs font-semibold hover:bg-[#F4B740]/15 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#F4B740]" />
            <span className="text-[11px] font-medium">Soundbox</span>
          </button>

          {/* Audio FX Toggle */}
          <button
            onClick={() => {
              soundService.playClick();
              onToggleSound();
            }}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#EEF3FF] border-[#E6ECFA] text-[#2447E8] hover:bg-[#2447E8]/10'
                : 'bg-[#F7F9FF] border-[#E6ECFA] text-[#9AA2B3] hover:bg-[#EEF3FF]'
            }`}
            title={soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenNotifications();
            }}
            className="relative p-1.5 sm:p-2 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] text-[#151A2D] transition-colors cursor-pointer"
            title="Notifications & Activity"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2447E8] text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Scan & Pay QR Button (Desktop & Tablet only) */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenScan();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Scan any UPI QR"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>

          {/* User Account / Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                soundService.playClick();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="flex items-center gap-1.5 p-1 sm:pl-1.5 sm:pr-2.5 sm:py-1 rounded-xl border border-[#E6ECFA] bg-white hover:border-[#2447E8]/30 transition-all cursor-pointer text-left"
              title="Account Options"
            >
              <AvatarIcon size="sm" />
              <div className="hidden md:block leading-none">
                <div className="text-xs font-bold text-[#151A2D] flex items-center gap-1">
                  <span>{wallet.name.split(' ')[0]}</span>
                  <CheckCircle2 className="w-3 h-3 text-[#20B486]" />
                </div>
                <span className="text-[10px] text-[#697086] font-mono">₹{Math.floor(wallet.balance).toLocaleString('en-IN')}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#9AA2B3] hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white border border-[#E6ECFA] shadow-xl p-2 z-50 animate-fade-in text-xs">
                <div className="p-2.5 border-b border-[#E6ECFA] mb-1">
                  <div className="font-bold text-[#151A2D]">{wallet.name}</div>
                  <div className="text-[11px] text-[#697086] truncate font-mono">{wallet.upiId}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#20B486]/10 text-[#20B486] font-semibold text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> KYC Verified
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onSelectTab('profile');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-[#F7F9FF] text-[#151A2D] font-medium text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#697086]" />
                  <span>Profile &amp; Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenMyQr();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-[#F7F9FF] text-[#151A2D] font-medium text-left cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#697086]" />
                  <span>My QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onSelectTab('wallet');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-[#F7F9FF] text-[#151A2D] font-medium text-left cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#697086]" />
                  <span>Wallet &amp; Statements</span>
                </button>

                <div className="border-t border-[#E6ECFA] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-[#E05252]/10 text-[#E05252] font-semibold text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out / Switch</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl border border-[#E6ECFA] text-[#151A2D] hover:bg-[#F7F9FF] transition-colors cursor-pointer"
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#2447E8]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E6ECFA] bg-white px-4 py-4 space-y-4 shadow-xl animate-fade-in max-h-[85vh] overflow-y-auto">
          {/* User Account Quick Banner */}
          <div className="p-3 rounded-2xl bg-[#F7F9FF] border border-[#E6ECFA] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <AvatarIcon size="sm" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#151A2D] truncate">{wallet.name}</div>
                <div className="text-[10px] text-[#697086] font-mono truncate">{wallet.upiId}</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-bold font-mono text-[#151A2D]">
                ₹{Math.floor(wallet.balance).toLocaleString('en-IN')}
              </div>
              <span className="text-[9px] font-bold text-[#20B486] bg-[#20B486]/10 px-1.5 py-0.2 rounded-full">
                Active
              </span>
            </div>
          </div>

          {/* Section Navigation Tiles */}
          <div>
            <div className="text-[11px] font-bold text-[#697086] uppercase tracking-wider mb-2">
              Menu Sections
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      onSelectTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#EEF3FF] border-[#2447E8]/30 text-[#2447E8] shadow-xs'
                        : 'bg-white border-[#E6ECFA] text-[#151A2D] hover:bg-[#F7F9FF]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-[#2447E8] text-white' : 'bg-[#EEF3FF] text-[#2447E8]'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="truncate block">{tab.shortLabel}</span>
                      {tab.badge && (
                        <span className="text-[9px] font-semibold text-[#2447E8] leading-none">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="pt-2 border-t border-[#E6ECFA] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundService.playClick();
                  onOpenSoundbox();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#151A2D] bg-[#F7F9FF] hover:bg-[#EEF3FF] p-2.5 rounded-2xl border border-[#E6ECFA] transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#F4B740] shrink-0" />
                <span className="truncate">Voice Soundbox</span>
              </button>

              <button
                onClick={() => {
                  soundService.playClick();
                  onOpenMyQr();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#2447E8] bg-[#EEF3FF] hover:bg-[#2447E8]/15 p-2.5 rounded-2xl border border-[#2447E8]/20 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#2447E8] shrink-0" />
                <span className="truncate">My Receive QR</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="tel:18002006653"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#697086] hover:text-[#2447E8]"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#20B486]" />
                <span>Helpline: 1800-200-6MLD</span>
              </a>

              <button
                onClick={() => {
                  soundService.playClick();
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1 text-xs font-bold text-[#E05252] hover:underline cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
