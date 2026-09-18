import React, { useState } from 'react';
import { 
  LogOut, 
  Building2, 
  User, 
  FileCheck2, 
  CreditCard, 
  HelpCircle, 
  Settings, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Volume2, 
  MapPin, 
  QrCode, 
  Lock, 
  Smartphone, 
  Copy, 
  Check,
  Shield,
  Headphones,
  Bell,
  Fingerprint,
  Mail,
  Phone,
  Sliders,
  Sparkles
} from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';
import { UserWallet, Language } from '../types';
import { soundService } from '../utils/audio';

interface ProfilePageProps {
  wallet: UserWallet;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenMyQr: () => void;
  onOpenSoundbox: () => void;
  onOpenLimits: () => void;
  onOpenLinkedAccounts: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  wallet,
  language,
  onLanguageChange,
  onOpenMyQr,
  onOpenSoundbox,
  onOpenLimits,
  onOpenLinkedAccounts,
  onOpenAuth,
  onLogout
}) => {
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(true);
  const [soundboxEnabled, setSoundboxEnabled] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<'PERSONAL' | 'KYC' | 'PAYMENT' | 'SUPPORT' | 'SETTINGS' | null>(null);

  const handleCopyUpi = () => {
    soundService.playClick();
    navigator.clipboard.writeText(wallet.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Masked values
  const maskedPhone = wallet.phone ? `+91 ${wallet.phone.slice(0, 5)} •••••` : '+91 98765 •••••';
  const emailAddress = 'gagan.6mld@fintech.bharat';
  const maskedAadhaar = '•••• •••• ' + (wallet.aadhaarNumber?.slice(-4) || '8912');
  const maskedPan = (wallet.panNumber ? wallet.panNumber.slice(0, 5) + '••••' + wallet.panNumber.slice(-1) : 'ABCDE••••F');

  // Menu items list
  const profileMenuItems = [
    {
      id: 'personal',
      icon: User,
      title: 'Personal Details',
      subtitle: `${wallet.name} • ${wallet.village || '6MLD Gharsana'}`,
      action: () => setActiveModal('PERSONAL')
    },
    {
      id: 'kyc',
      icon: FileCheck2,
      title: 'KYC & Identification Details',
      subtitle: `Aadhaar ${maskedAadhaar} • PAN ${maskedPan}`,
      badge: 'Verified',
      badgeColor: 'bg-[#20B486]/10 text-[#20B486]',
      action: () => setActiveModal('KYC')
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Payment Methods & UPI',
      subtitle: `${wallet.bankAccount?.bankName || 'SBI'} A/c • ${wallet.upiId}`,
      action: onOpenLinkedAccounts
    },
    {
      id: 'limits',
      icon: Sliders,
      title: 'Transaction Limits',
      subtitle: 'Daily ₹1,00,000 / Per Txn ₹25,000',
      action: onOpenLimits
    },
    {
      id: 'security',
      icon: Lock,
      title: 'Security & Biometric Lock',
      subtitle: biometricsEnabled ? 'Biometrics active (Fingerprint/Face)' : 'Biometrics disabled',
      isToggle: true,
      toggleState: biometricsEnabled,
      action: () => {
        soundService.playClick();
        setBiometricsEnabled(!biometricsEnabled);
      }
    },
    {
      id: 'soundbox',
      icon: Volume2,
      title: 'Voice Soundbox Alerts',
      subtitle: 'Instant audio payment announcements',
      action: onOpenSoundbox
    },
    {
      id: 'support',
      icon: Headphones,
      title: 'Help & 24x7 Nodal Support',
      subtitle: 'Toll-free 1800-200-6MLD • 6MLD Gharsana Helpdesk',
      action: () => setActiveModal('SUPPORT')
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Application Preferences',
      subtitle: `Language: ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Regional'}`,
      action: () => setActiveModal('SETTINGS')
    }
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in text-[#151A2D] pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#E6ECFA]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#151A2D]">
            Profile &amp; Settings
          </h1>
          <p className="text-xs text-[#697086]">
            Manage personal identity, verification credentials, and payment preferences
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            if (onOpenAuth) onOpenAuth();
          }}
          className="px-4 py-2 rounded-xl border border-[#E05252]/20 bg-[#E05252]/10 hover:bg-[#E05252]/15 text-[#E05252] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Profile Header & KYC Card (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Profile Overview Card */}
          <div className="fintech-white-card p-6 text-center space-y-4 relative overflow-hidden">
            <div className="flex flex-col items-center">
              <div className="relative">
                <AvatarIcon size="lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#20B486] border-2 border-white flex items-center justify-center text-white" title="Active">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-[#151A2D] mt-3">
                {wallet.name}
              </h2>

              <div className="flex items-center gap-1.5 text-xs text-[#697086] mt-0.5">
                <Phone className="w-3.5 h-3.5 text-[#9AA2B3]" />
                <span>{maskedPhone}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#697086] mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#9AA2B3]" />
                <span>{emailAddress}</span>
              </div>

              <div className="mt-3 flex items-center gap-2 bg-[#F7F9FF] border border-[#E6ECFA] px-3 py-1.5 rounded-xl text-xs font-mono text-[#151A2D]">
                <span>{wallet.upiId}</span>
                <button
                  onClick={handleCopyUpi}
                  className="p-1 hover:text-[#2447E8] text-[#9AA2B3] transition-colors cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#20B486]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E6ECFA] flex items-center justify-around text-xs">
              <div>
                <span className="text-[#697086] block text-[11px]">Primary Bank</span>
                <strong className="text-[#151A2D]">{wallet.bankAccount?.bankName || 'SBI'}</strong>
              </div>
              <div className="w-px h-6 bg-[#E6ECFA]" />
              <div>
                <span className="text-[#697086] block text-[11px]">Village / Region</span>
                <strong className="text-[#151A2D]">{wallet.village || '6MLD Gharsana'}</strong>
              </div>
            </div>
          </div>

          {/* KYC VERIFICATION CARD (Same blue gradient as balance card) */}
          <div className="fintech-gradient-card p-6 relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-[#1738C8]/40 blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Full KYC Verified
                    </h3>
                    <p className="text-[11px] text-white/80">Level-3 Enterprise Grade KYC Verified</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#2447E8]">
                  Active
                </span>
              </div>

              <div className="space-y-2 bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/15 text-xs text-white">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Aadhaar UIDAI:</span>
                  <span className="font-mono font-bold">{maskedAadhaar}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Income Tax PAN:</span>
                  <span className="font-mono font-bold">{maskedPan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Monthly Limit:</span>
                  <span className="font-mono font-bold">₹5,00,000</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#20B486]" />
                <span>Biometric fingerprint token active on this device</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Settings Rows & Details (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="fintech-white-card p-5 sm:p-6 space-y-3">
            <h2 className="text-xs font-bold text-[#151A2D] uppercase tracking-wider px-1">
              Account Management &amp; Settings
            </h2>

            <div className="space-y-2">
              {profileMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.isToggle) soundService.playClick();
                      item.action();
                    }}
                    className="p-3.5 rounded-2xl border border-[#E6ECFA] hover:border-[#2447E8]/30 hover:bg-[#F7F9FF] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center shrink-0 group-hover:bg-[#2447E8] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#151A2D] group-hover:text-[#2447E8] truncate">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-[#EEF3FF] text-[#2447E8]'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#697086] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {item.isToggle ? (
                        <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                          item.toggleState ? 'bg-[#2447E8]' : 'bg-[#E6ECFA]'
                        }`}>
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            item.toggleState ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </div>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#9AA2B3] group-hover:text-[#2447E8] transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Logout Option */}
            <div className="pt-3 border-t border-[#E6ECFA]">
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  if (onLogout) {
                    onLogout();
                  } else if (onOpenAuth) {
                    onOpenAuth();
                  }
                }}
                className="w-full py-3 px-4 rounded-xl border border-[#E05252]/30 hover:bg-[#E05252]/10 text-[#E05252] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of BharatPay</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* DETAIL MODALS (Personal, KYC, Support, Settings) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E6ECFA] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6ECFA] pb-3">
              <h3 className="text-sm font-bold text-[#151A2D]">
                {activeModal === 'PERSONAL' && 'Personal Information'}
                {activeModal === 'KYC' && 'KYC & Identity Records'}
                {activeModal === 'SUPPORT' && 'Helpdesk & Nodal Helpline'}
                {activeModal === 'SETTINGS' && 'App Preferences'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-[#F7F9FF] text-[#697086]"
              >
                ✕
              </button>
            </div>

            {activeModal === 'PERSONAL' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F7F9FF] rounded-xl border border-[#E6ECFA] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#697086]">Full Legal Name:</span>
                    <strong className="text-[#151A2D]">{wallet.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697086]">Mobile Number:</span>
                    <strong className="text-[#151A2D]">{wallet.phone || '+91 9876543210'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697086]">Email Address:</span>
                    <strong className="text-[#151A2D]">{emailAddress}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697086]">Village / Ward:</span>
                    <strong className="text-[#151A2D]">{wallet.village || '6MLD Gharsana'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697086]">District &amp; State:</span>
                    <strong className="text-[#151A2D]">Sri Ganganagar, Rajasthan - 335021</strong>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'KYC' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F7F9FF] rounded-xl border border-[#E6ECFA] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#697086]">Aadhaar Number:</span>
                    <strong className="font-mono text-[#151A2D]">{maskedAadhaar}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697086]">PAN Number:</span>
                    <strong className="font-mono text-[#151A2D]">{maskedPan}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697086]">Verification Status:</span>
                    <span className="text-[#20B486] font-bold">100% Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697086]">Re-KYC Due Date:</span>
                    <span className="text-[#151A2D]">12 December 2028</span>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'SUPPORT' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F7F9FF] rounded-xl border border-[#E6ECFA] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#697086]">Toll-Free Helpline:</span>
                    <a href="tel:18002006653" className="text-[#2447E8] font-bold">1800-200-6MLD</a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#697086]">Support Email:</span>
                    <span className="font-mono text-[#151A2D]">support@fintech.bharat</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#697086]">Branch Address:</span>
                    <span className="text-[#151A2D]">Near SBI Branch, 6MLD Gharsana</span>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'SETTINGS' && (
              <div className="space-y-3 text-xs">
                <p className="text-[#697086]">Select your preferred interface language:</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['en', 'hi', 'bg'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        soundService.playClick();
                        onLanguageChange(lang);
                      }}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                        language === lang
                          ? 'bg-[#2447E8] text-white border-[#2447E8]'
                          : 'bg-[#F7F9FF] text-[#151A2D] border-[#E6ECFA] hover:bg-white'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Regional'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
