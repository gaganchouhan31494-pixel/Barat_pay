import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Copy,
  Check,
  Send,
  Lock,
  Volume2,
  Phone,
  Smartphone,
  Coins,
  CreditCard,
  Wifi,
  MapPin,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { UserWallet, Language, QuickContact } from '../types';
import { soundService } from '../utils/audio';
import { ThemeConfig } from '../utils/theme';

interface WalletCardProps {
  wallet: UserWallet;
  language: Language;
  contacts: QuickContact[];
  onOpenAddMoney: () => void;
  onOpenSendMoney: () => void;
  onOpenMyQr: () => void;
  onOpenLoans: () => void;
  onQuickPayContact: (contact: QuickContact) => void;
  onCheckBankBalance: () => void;
  onSimulateIncoming: () => void;
  bankBalanceVisible: boolean;
  theme: ThemeConfig;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  language,
  contacts,
  onOpenAddMoney,
  onOpenSendMoney,
  onOpenMyQr,
  onOpenLoans,
  onQuickPayContact,
  onCheckBankBalance,
  onSimulateIncoming,
  bankBalanceVisible,
  theme
}) => {
  const [showWalletBalance, setShowWalletBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    soundService.playClick();
    navigator.clipboard?.writeText(wallet.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border shadow-sm p-4 sm:p-6 space-y-5 transition-all ${
      theme.isLight 
        ? 'bg-white border-slate-200 text-slate-900' 
        : `${theme.cardBg} ${theme.cardBorder} text-slate-100`
    }`}>
      {/* Top row: Profile & 6MLD Gharsana Location & UPI ID */}
      <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
        theme.isLight ? 'border-slate-100' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
              GC
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">
                {wallet.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> पूर्ण KYC सत्यापित
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>शाखा {wallet.village}, श्रीगंगानगर (राज.)</span>
            </div>
          </div>
        </div>

        {/* UPI ID Pill with Copy button */}
        <button
          onClick={handleCopyUpi}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
            theme.isLight 
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' 
              : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300'
          }`}
          title="UPI ID कॉपी करें"
        >
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-mono">
            VPA
          </span>
          <span className="font-mono text-xs font-semibold">{wallet.upiId}</span>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>

      {/* Two Account Cards in Grid: (1) Primary Bank Account & (2) BharatPay Digital Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: State Bank of India linked account */}
        <div className={`rounded-xl p-4 sm:p-5 flex flex-col justify-between border transition-all ${
          theme.isLight 
            ? 'bg-slate-50/80 border-slate-200/90 shadow-sm' 
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">
                    {wallet.bankAccount.bankName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-semibold">
                    नोडल खाता
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  खाता: {wallet.bankAccount.accountNumber} • IFSC: {wallet.bankAccount.ifsc}
                </div>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                उपलब्ध बैंक शेष (Bank Balance)
              </div>
              <div className="text-2xl font-black font-mono tracking-tight mt-0.5">
                {bankBalanceVisible ? `₹${wallet.bankAccount.balance.toLocaleString('en-IN')}` : '••••••••'}
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckBankBalance}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{bankBalanceVisible ? 'अपडेट करें' : 'UPI पिन से देखें'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: BharatPay Digital Wallet */}
        <div className={`rounded-xl p-4 sm:p-5 flex flex-col justify-between border transition-all ${
          theme.isLight 
            ? 'bg-blue-50/40 border-blue-200/80 shadow-sm' 
            : 'bg-slate-900/90 border-blue-900/40'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">
                    BharatPay वॉलेट बैलेंस
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    सक्रिय
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  तत्काल भुगतान • 0 सेकंड सेटलमेंट
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                setShowWalletBalance(!showWalletBalance);
              }}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title={showWalletBalance ? 'बैलेंस छुपाएं' : 'बैलेंस देखें'}
            >
              {showWalletBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-5 pt-3.5 border-t border-blue-200/50 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                कुल वॉलेट शेष (Wallet Balance)
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
                {showWalletBalance ? `₹${wallet.balance.toLocaleString('en-IN')}` : '••••••••'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onOpenAddMoney();
              }}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>पैसे जोड़ें (+ लोड)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8-Icon Grid (Corporate PhonePe / GPay style Quick Actions) */}
      <div className="pt-2">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>त्वरित बैंकिंग सेवाएं (Banking Services):</span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
            24x7 तत्काल सक्रिय
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {/* 1. To Mobile / Send */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenSendMoney();
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer active:scale-95 group ${
              theme.isLight 
                ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              मोबाइल पे
            </span>
            <span className="text-[10px] text-slate-400">To Phone</span>
          </button>

          {/* 2. To Bank / Account */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenSendMoney();
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer active:scale-95 group ${
              theme.isLight 
                ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              बैंक ट्रांसफर
            </span>
            <span className="text-[10px] text-slate-400">To A/C</span>
          </button>

          {/* 3. My QR / Receive */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenMyQr();
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer active:scale-95 group ${
              theme.isLight 
                ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              मेरा QR
            </span>
            <span className="text-[10px] text-slate-400">Receive QR</span>
          </button>

          {/* 4. Check Balance */}
          <button
            onClick={onCheckBankBalance}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer active:scale-95 group ${
              theme.isLight 
                ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              बैलेंस जांचें
            </span>
            <span className="text-[10px] text-slate-400">UPI PIN</span>
          </button>

          {/* 5. Gold Loan */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenLoans();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 text-center transition-all cursor-pointer active:scale-95 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200 leading-tight">
              गोल्ड लोन
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400">0.79% ब्याज</span>
          </button>

          {/* 6. Silver Loan */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenLoans();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/60 text-center transition-all cursor-pointer active:scale-95 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              सिल्वर लोन
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">चांदी गहने</span>
          </button>

          {/* 7. Mobile Recharge */}
          <button
            onClick={() => {
              soundService.playClick();
              const el = document.getElementById('recharge-services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer active:scale-95 group ${
              theme.isLight 
                ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">
              बिल व रिचार्ज
            </span>
            <span className="text-[10px] text-slate-400">BBPS</span>
          </button>

          {/* 8. Soundbox Test Payment */}
          <button
            onClick={() => {
              soundService.playClick();
              onSimulateIncoming();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-center transition-all cursor-pointer active:scale-95 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 leading-tight">
              साउंडबॉक्स टेस्ट
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">आवाज जांचें</span>
          </button>
        </div>
      </div>

      {/* Quick Pay to Gharsana Contacts - Professional Beneficiary Cards */}
      <div className="pt-2">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>हालिया लाभार्थी व संपर्क (Beneficiaries):</span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">1-टैप ट्रांसफर</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => onQuickPayContact(c)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all active:scale-95 group cursor-pointer ${
                theme.isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-200">
                {c.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>{c.name}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {c.recentAmount ? `अंतिम भुगतान: ₹${c.recentAmount}` : 'भेजें'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
