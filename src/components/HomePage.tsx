import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  ArrowDownRight,
  Smartphone, 
  Building2, 
  Grid, 
  Lightbulb, 
  Tv, 
  Wifi, 
  Flame, 
  ChevronRight,
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  QrCode, 
  CreditCard, 
  ArrowRight, 
  Send, 
  Clock, 
  FileText,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';
import { UserWallet, Transaction, Language } from '../types';
import { soundService } from '../utils/audio';

interface HomePageProps {
  wallet: UserWallet;
  transactions: Transaction[];
  language: Language;
  onOpenAddMoney: () => void;
  onOpenSendMoney: () => void;
  onOpenScan: () => void;
  onOpenMyQr: () => void;
  onOpenLoans: () => void;
  onOpenBills: () => void;
  onSelectTab?: (tab: 'home' | 'wallet' | 'loans' | 'rewards' | 'profile') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  wallet,
  transactions,
  language,
  onOpenAddMoney,
  onOpenSendMoney,
  onOpenScan,
  onOpenMyQr,
  onOpenLoans,
  onOpenBills,
  onSelectTab
}) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [activeRecentTab, setActiveRecentTab] = useState<'all' | 'credits' | 'debits'>('all');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [selectedTxnForReceipt, setSelectedTxnForReceipt] = useState<Transaction | null>(null);

  // Live bullion rates
  const goldRate = 7240;
  const silverRate = 89;

  // Split balance for clean decimals
  const balanceInt = Math.floor(wallet.balance).toLocaleString('en-IN');
  const balanceDec = (wallet.balance % 1).toFixed(2).substring(1);

  // Quick contacts
  const frequentBeneficiaries = [
    { name: 'Aarav Patel', upi: 'aarav@sbi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', bank: 'SBI' },
    { name: 'Mandi Trader', upi: 'kisan@pnb', initial: 'MT', bank: 'PNB' },
    { name: 'Rahul Sharma', upi: 'rahul@kotak', initial: 'RS', bank: 'Kotak' },
    { name: 'Pooja Verma', upi: 'pooja@icici', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', bank: 'ICICI' },
    { name: 'Krishi Seva', upi: 'krishi@union', initial: 'KS', bank: 'Union' }
  ];

  // Quick actions list
  const quickActions = [
    { id: 'send', label: 'Send Money', icon: Send, action: onOpenSendMoney },
    { id: 'recharge', label: 'Mobile Recharge', icon: Smartphone, action: onOpenBills },
    { id: 'bank', label: 'Bank Transfer', icon: Building2, action: onOpenSendMoney },
    { id: 'scan', label: 'Scan & Pay', icon: QrCode, action: onOpenScan },
    { id: 'receive', label: 'Receive / QR', icon: ArrowDownLeft, action: onOpenMyQr },
    { id: 'bills', label: 'Pay Bills', icon: Zap, action: onOpenBills }
  ];

  // Utility services list
  const utilityServices = [
    { id: 'mobile', label: 'Mobile', desc: 'Prepaid & Postpaid', icon: Smartphone },
    { id: 'electricity', label: 'Electricity', desc: 'Discom & Boards', icon: Lightbulb },
    { id: 'dth', label: 'DTH Cable', desc: 'Tata Play, DishTV', icon: Tv },
    { id: 'gas', label: 'LPG Gas', desc: 'Indane, HP, Bharat', icon: Flame },
    { id: 'fastag', label: 'FASTag', desc: 'NHAI & Tolls', icon: Zap },
    { id: 'broadband', label: 'Broadband', desc: 'Fiber & Internet', icon: Wifi }
  ];

  // Recent 5 transactions
  const displayTransactions = (transactions || []).filter(t => {
    if (!t) return false;
    if (activeRecentTab === 'credits') return t.type === 'ADD_MONEY' || t.type === 'RECEIVE_MONEY';
    if (activeRecentTab === 'debits') return t.type === 'SEND_MONEY' || t.type === 'RECHARGE' || t.type === 'EMI_PAYMENT';
    return true;
  }).slice(0, 5);

  const handleCopyUpi = () => {
    soundService.playClick();
    navigator.clipboard.writeText(wallet.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in text-[#151A2D] pb-8">
      {/* Desktop / Tablet Grid System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Financial Operations (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Greeting Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AvatarIcon size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg sm:text-xl font-bold text-[#151A2D]">
                    Hello, {wallet.name.split(' ')[0]} 👋
                  </h1>
                  <CheckCircle2 className="w-4 h-4 text-[#20B486]" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#697086]">
                  <span className="font-mono">{wallet.upiId}</span>
                  <button 
                    onClick={handleCopyUpi} 
                    className="p-1 hover:text-[#2447E8] text-[#9AA2B3] transition-colors cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-[#20B486]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Citizen</span>
              </span>
            </div>
          </div>

          {/* PRIMARY BLUE GRADIENT BALANCE CARD */}
          <div className="fintech-gradient-card p-6 sm:p-7 relative">
            {/* Subtle decorative blue shapes / glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute right-10 bottom-0 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-[#1738C8]/40 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Card Top Strip: Label & Eye Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    Total Wallet Balance
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setShowBalance(!showBalance);
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title={showBalance ? "Hide Balance" : "Show Balance"}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-medium backdrop-blur-sm">
                  <span>SBI Primary Account</span>
                </div>
              </div>

              {/* Balance Large Display */}
              <div>
                {showBalance ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-light text-white/90">₹</span>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono text-white">
                      {balanceInt}
                    </span>
                    <span className="text-lg sm:text-xl font-medium text-white/80 font-mono">
                      {balanceDec}
                    </span>
                  </div>
                ) : (
                  <div className="text-3xl sm:text-4xl font-mono tracking-widest text-white/90 py-1">
                    ••••••••
                  </div>
                )}
                <p className="text-xs text-white/70 mt-1">
                  Active nodal UPI limits: ₹1,00,000 / day
                </p>
              </div>

              {/* Action Buttons: Add Money & Withdraw */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    onOpenAddMoney();
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white hover:bg-[#F7F9FF] text-[#2447E8] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    onOpenSendMoney();
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold border border-white/25 backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  <span>Withdraw / Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS GRID */}
          <div className="fintech-white-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#151A2D] uppercase tracking-wider">
                Quick Actions
              </h2>
              <span className="text-xs text-[#697086]">Instant NPCI Rails</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      action.action();
                    }}
                    className="flex flex-col items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F7F9FF] transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center group-hover:bg-[#2447E8] group-hover:text-white group-hover:shadow-md transition-all">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-semibold text-[#151A2D] text-center leading-tight">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FREQUENT BENEFICIARIES (1-TAP TRANSFER) */}
          <div className="fintech-white-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#151A2D] uppercase tracking-wider">
                  Quick Transfers
                </h2>
                <span className="text-xs text-[#697086]">Frequent Contacts</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onOpenSendMoney();
                }}
                className="text-xs font-bold text-[#2447E8] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {/* Add New Contact Shortcut */}
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onOpenSendMoney();
                }}
                className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#2447E8]/40 hover:border-[#2447E8] flex items-center justify-center text-[#2447E8] bg-[#EEF3FF]/50 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-[#151A2D]">New</span>
              </button>

              {frequentBeneficiaries.map((beneficiary, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    onOpenSendMoney();
                  }}
                  className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
                >
                  <div className="relative">
                    {beneficiary.avatar ? (
                      <img
                        src={beneficiary.avatar}
                        alt={beneficiary.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E6ECFA] group-hover:ring-[#2447E8] transition-all"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#2447E8] text-white font-bold flex items-center justify-center text-sm ring-2 ring-[#E6ECFA] group-hover:ring-[#2447E8] transition-all">
                        {beneficiary.initial}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded text-[9px] font-bold bg-white text-[#151A2D] shadow-xs border border-[#E6ECFA]">
                      {beneficiary.bank}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#151A2D] max-w-[64px] truncate">
                    {beneficiary.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* BILLS & RECHARGE SERVICES */}
          <div className="fintech-white-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#151A2D] uppercase tracking-wider">
                  Bills &amp; Utility Services
                </h2>
                <p className="text-xs text-[#697086]">BBPS Authorized Instant Payment Center</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onOpenBills();
                }}
                className="text-xs font-bold text-[#2447E8] hover:underline cursor-pointer"
              >
                All Bills
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {utilityServices.map((srv) => {
                const Icon = srv.icon;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      onOpenBills();
                    }}
                    className="p-3 rounded-2xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] hover:border-[#2447E8]/30 transition-all flex items-center gap-3 text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center shrink-0 group-hover:bg-[#2447E8] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#151A2D] truncate group-hover:text-[#2447E8]">
                        {srv.label}
                      </h4>
                      <p className="text-[10px] text-[#697086] truncate">
                        {srv.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Bullion Lending, KYC & Recent Activity (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* GOLD & SILVER LENDING WIDGET */}
          <div className="fintech-white-card p-5 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F4B740]/15 text-[#F4B740] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#151A2D] uppercase tracking-wider">
                    Gold Loan Vault
                  </h3>
                  <p className="text-[10px] text-[#697086]">Instant 75% LTV Credit</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#20B486]/10 text-[#20B486]">
                0.79% / mo
              </span>
            </div>

            {/* Live Tickers */}
            <div className="grid grid-cols-2 gap-2 bg-[#F7F9FF] p-3 rounded-2xl border border-[#E6ECFA]">
              <div>
                <span className="text-[10px] text-[#697086] block">24K MCX Gold</span>
                <span className="text-sm font-bold font-mono text-[#151A2D]">
                  ₹{goldRate.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-[#697086]">/g</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#697086] block">999 Silver</span>
                <span className="text-sm font-bold font-mono text-[#151A2D]">
                  ₹{silverRate.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-[#697086]">/g</span>
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-[#697086]">
              <div className="flex items-center justify-between">
                <span>Pre-approved Limit:</span>
                <strong className="text-[#151A2D] font-mono">₹5,00,000</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Physical Custody:</span>
                <span className="text-[#20B486] font-semibold">SBI Safe Vault</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onOpenLoans();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Explore Gold Loans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* RECENT TRANSACTIONS */}
          <div className="fintech-white-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#151A2D] uppercase tracking-wider">
                Recent Activity
              </h3>
              <div className="flex items-center gap-1 bg-[#F7F9FF] p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveRecentTab('all')}
                  className={`px-2 py-0.5 rounded ${activeRecentTab === 'all' ? 'bg-[#2447E8] text-white' : 'text-[#697086]'}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRecentTab('credits')}
                  className={`px-2 py-0.5 rounded ${activeRecentTab === 'credits' ? 'bg-[#2447E8] text-white' : 'text-[#697086]'}`}
                >
                  In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRecentTab('debits')}
                  className={`px-2 py-0.5 rounded ${activeRecentTab === 'debits' ? 'bg-[#2447E8] text-white' : 'text-[#697086]'}`}
                >
                  Out
                </button>
              </div>
            </div>

            <div className="divide-y divide-[#E6ECFA]">
              {displayTransactions.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#697086]">
                  No recent transactions in this category.
                </div>
              ) : (
                displayTransactions.map((txn) => {
                  const isCredit = txn.type === 'ADD_MONEY' || txn.type === 'RECEIVE_MONEY';
                  return (
                    <div
                      key={txn.id}
                      onClick={() => setSelectedTxnForReceipt(txn)}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-[#F7F9FF] -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCredit ? 'bg-[#20B486]/10 text-[#20B486]' : 'bg-[#EEF3FF] text-[#2447E8]'
                        }`}>
                          {isCredit ? <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" /> : <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#151A2D] truncate">
                            {txn.title}
                          </h4>
                          <span className="text-[10px] text-[#697086] block truncate">
                            {txn.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-bold font-mono ${
                          isCredit ? 'text-[#20B486]' : 'text-[#151A2D]'
                        }`}>
                          {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-[#697086] block">
                          UPI Success
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                if (onSelectTab) onSelectTab('wallet');
              }}
              className="w-full py-2 rounded-xl border border-[#E6ECFA] hover:bg-[#F7F9FF] text-xs font-semibold text-[#2447E8] text-center transition-colors cursor-pointer"
            >
              View Full Passbook
            </button>
          </div>

        </div>

      </div>

      {/* TRANSACTION RECEIPT MODAL */}
      {selectedTxnForReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E6ECFA] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6ECFA] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#20B486]" />
                <h3 className="text-sm font-bold text-[#151A2D]">Payment Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedTxnForReceipt(null)}
                className="p-1 rounded-lg hover:bg-[#F7F9FF] text-[#697086]"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-[#697086]">Amount</span>
              <div className="text-3xl font-extrabold font-mono text-[#151A2D]">
                ₹{selectedTxnForReceipt.amount.toLocaleString('en-IN')}
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#20B486]/10 text-[#20B486]">
                NPCI Verified Complete
              </span>
            </div>

            <div className="bg-[#F7F9FF] p-3 rounded-xl border border-[#E6ECFA] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#697086]">Transaction ID:</span>
                <span className="font-mono text-[#151A2D] truncate max-w-[160px]">{selectedTxnForReceipt.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697086]">Date &amp; Time:</span>
                <span className="text-[#151A2D]">{selectedTxnForReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697086]">Payment Type:</span>
                <span className="text-[#151A2D]">{selectedTxnForReceipt.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697086]">From / To:</span>
                <span className="text-[#151A2D]">{selectedTxnForReceipt.subtitle || wallet.upiId}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxnForReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
