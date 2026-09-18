import React, { useState } from 'react';
import { 
  Wallet, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Copy,
  Check,
  Lock,
  Volume2,
  Phone,
  Smartphone,
  Coins,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { UserWallet, Language, QuickContact } from '../types';
import { soundService } from '../utils/audio';
import { ThemeConfig } from '../utils/theme';

interface WalletCardProps {
  wallet: UserWallet;
  language?: Language;
  contacts: QuickContact[];
  onOpenAddMoney: () => void;
  onOpenSendMoney: () => void;
  onOpenMyQr: () => void;
  onOpenLoans: () => void;
  onQuickPayContact: (contact: QuickContact) => void;
  onCheckBankBalance: () => void;
  onSimulateIncoming: () => void;
  bankBalanceVisible: boolean;
  theme?: ThemeConfig;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  contacts,
  onOpenAddMoney,
  onOpenSendMoney,
  onOpenMyQr,
  onOpenLoans,
  onQuickPayContact,
  onCheckBankBalance,
  onSimulateIncoming,
  bankBalanceVisible
}) => {
  const [showWalletBalance, setShowWalletBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    soundService.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wallet.upiId).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#E6ECFA] bg-white shadow-xs p-4 sm:p-6 space-y-5">
      {/* Top row: Profile & Verified KYC Badge & UPI ID */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E6ECFA]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-[#2447E8] flex items-center justify-center font-bold text-white text-base shadow-xs">
              GC
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#20B486] border-2 border-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#151A2D] tracking-tight">
                {wallet.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/20">
                <CheckCircle2 className="w-3 h-3" /> Full KYC Verified
              </span>
            </div>
            <div className="text-xs text-[#697086] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#9AA2B3]" />
              <span>Branch: City Main Branch, New Delhi</span>
            </div>
          </div>
        </div>

        {/* UPI ID Pill with Copy button */}
        <button
          onClick={handleCopyUpi}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E6ECFA] bg-[#F7F9FF] hover:bg-[#EEF3FF] text-xs font-medium transition-all active:scale-95 cursor-pointer"
          title="Copy UPI ID"
        >
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EEF3FF] text-[#2447E8] font-mono">
            UPI VPA
          </span>
          <span className="font-mono text-xs font-semibold text-[#151A2D]">{wallet.upiId}</span>
          {copied ? <Check className="w-3.5 h-3.5 text-[#20B486]" /> : <Copy className="w-3.5 h-3.5 text-[#9AA2B3]" />}
        </button>
      </div>

      {/* Two Account Cards in Grid: (1) Primary Bank Account & (2) BharatPay Digital Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: State Bank of India linked account */}
        <div className="rounded-xl p-4 sm:p-5 flex flex-col justify-between border border-[#E6ECFA] bg-[#F7F9FF] transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#151A2D]">
                    {wallet.bankAccount.bankName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EEF3FF] text-[#2447E8] font-semibold border border-[#E6ECFA]">
                    Primary Account
                  </span>
                </div>
                <div className="text-xs text-[#697086] font-mono mt-0.5">
                  Account: {wallet.bankAccount.accountNumber} • IFSC: {wallet.bankAccount.ifsc}
                </div>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#20B486]" />
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#E6ECFA] flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-semibold text-[#697086]">
                Available Bank Balance
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-[#151A2D] mt-0.5">
                {bankBalanceVisible ? `₹${wallet.bankAccount.balance.toLocaleString('en-IN')}` : '••••••••'}
              </div>
            </div>

            <button
              type="button"
              onClick={onCheckBankBalance}
              className="px-3.5 py-2 rounded-lg bg-[#2447E8] hover:bg-[#1738C8] active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{bankBalanceVisible ? 'Refresh' : 'Check Balance'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: BharatPay Digital Wallet */}
        <div className="rounded-xl p-4 sm:p-5 flex flex-col justify-between border border-[#2447E8]/20 bg-[#EEF3FF]/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white text-[#20B486] border border-[#E6ECFA] flex items-center justify-center shadow-xs">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#151A2D]">
                    BharatPay Wallet Balance
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#20B486]/10 text-[#20B486] font-semibold flex items-center gap-1 border border-[#20B486]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20B486] animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="text-xs text-[#697086] mt-0.5">
                  Instant P2P • 0-Second Settlement
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                setShowWalletBalance(!showWalletBalance);
              }}
              className="p-1.5 rounded-md text-[#697086] hover:text-[#151A2D] transition-colors cursor-pointer"
              title={showWalletBalance ? 'Hide Balance' : 'Show Balance'}
            >
              {showWalletBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#E6ECFA] flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase font-semibold text-[#697086]">
                Total Wallet Balance
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#20B486] tracking-tight mt-0.5">
                {showWalletBalance ? `₹${wallet.balance.toLocaleString('en-IN')}` : '••••••••'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onOpenAddMoney();
              }}
              className="px-3.5 py-2 rounded-lg bg-[#20B486] hover:bg-[#1ca077] active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Money</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8-Icon Grid: Quick Banking & Payment Actions */}
      <div className="pt-2">
        <div className="text-xs font-bold text-[#697086] uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Quick Banking Services</span>
          <span className="text-[11px] text-[#2447E8] font-semibold flex items-center gap-1">
            24x7 Instant Transfer
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {/* 1. To Mobile / Send */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenSendMoney();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] text-center transition-all cursor-pointer active:scale-95 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#151A2D] leading-tight">
              To Mobile
            </span>
            <span className="text-[10px] text-[#697086]">Mobile Pay</span>
          </button>

          {/* 2. To Bank / Account */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenSendMoney();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] text-center transition-all cursor-pointer active:scale-95 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#151A2D] leading-tight">
              To Bank A/c
            </span>
            <span className="text-[10px] text-[#697086]">IMPS / NEFT</span>
          </button>

          {/* 3. My QR / Receive */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenMyQr();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] text-center transition-all cursor-pointer active:scale-95 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#151A2D] leading-tight">
              Receive QR
            </span>
            <span className="text-[10px] text-[#697086]">All-in-One</span>
          </button>

          {/* 4. Check Balance */}
          <button
            onClick={onCheckBankBalance}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] text-center transition-all cursor-pointer active:scale-95 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#151A2D] leading-tight">
              Check Balance
            </span>
            <span className="text-[10px] text-[#697086]">UPI PIN</span>
          </button>

          {/* 5. Gold Loan */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenLoans();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#F4B740]/40 bg-[#F4B740]/5 text-center transition-all cursor-pointer active:scale-95 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F4B740]/15 text-[#F4B740] border border-[#F4B740]/30 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#151A2D] leading-tight">
              Gold Loan
            </span>
            <span className="text-[10px] text-[#697086]">0.79% p.m.</span>
          </button>

          {/* 6. Silver Loan */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenLoans();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E6ECFA] bg-[#F7F9FF] text-center transition-all cursor-pointer active:scale-95 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#697086] border border-[#E6ECFA] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#151A2D] leading-tight">
              Silver Loan
            </span>
            <span className="text-[10px] text-[#697086]">Instant Approval</span>
          </button>

          {/* 7. Mobile Recharge */}
          <button
            onClick={() => {
              soundService.playClick();
              const el = document.getElementById('recharge-services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] text-center transition-all cursor-pointer active:scale-95 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#151A2D] leading-tight">
              Recharge &amp; Bills
            </span>
            <span className="text-[10px] text-[#697086]">BBPS Direct</span>
          </button>

          {/* 8. Soundbox Test Payment */}
          <button
            onClick={() => {
              soundService.playClick();
              onSimulateIncoming();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#20B486]/30 bg-[#20B486]/5 text-center transition-all cursor-pointer active:scale-95 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#20B486]/15 text-[#20B486] border border-[#20B486]/30 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#151A2D] leading-tight">
              Soundbox Audio
            </span>
            <span className="text-[10px] text-[#20B486] font-semibold">Test Alert</span>
          </button>
        </div>
      </div>

      {/* Quick Pay Contacts - Beneficiary Cards */}
      <div className="pt-2">
        <div className="text-xs font-bold text-[#697086] uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Recent Beneficiaries</span>
          <span className="text-[11px] text-[#2447E8] font-semibold">1-Tap Instant Transfer</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => onQuickPayContact(c)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] text-left shrink-0 transition-all active:scale-95 group cursor-pointer shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EEF3FF] border border-[#E6ECFA] flex items-center justify-center text-sm font-bold text-[#2447E8]">
                {c.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-[#151A2D] group-hover:text-[#2447E8] transition-colors flex items-center gap-1">
                  <span>{c.name}</span>
                  <CheckCircle2 className="w-3 h-3 text-[#20B486]" />
                </div>
                <div className="text-[11px] text-[#697086] font-mono">
                  {c.recentAmount ? `Last paid: ₹${c.recentAmount}` : 'Transfer'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
