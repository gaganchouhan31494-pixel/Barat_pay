import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  CreditCard, 
  RefreshCw, 
  ChevronRight, 
  ShieldCheck, 
  Search, 
  Sliders, 
  Wallet as WalletIcon,
  Check,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { UserWallet, Transaction, Language } from '../types';
import { soundService } from '../utils/audio';

interface WalletPageProps {
  wallet: UserWallet;
  transactions: Transaction[];
  language: Language;
  onOpenAddMoney: () => void;
  onOpenSendMoney: () => void;
  onOpenLimits: () => void;
  onOpenLinkedAccounts: () => void;
  onOpenLinkedCards: () => void;
  onCheckBankBalance: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  wallet,
  transactions,
  language,
  onOpenAddMoney,
  onOpenSendMoney,
  onOpenLimits,
  onOpenLinkedAccounts,
  onOpenLinkedCards,
  onCheckBankBalance
}) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [autoTopUp, setAutoTopUp] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [selectedTxnForReceipt, setSelectedTxnForReceipt] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = (transactions || []).filter(txn => {
    if (!txn) return false;
    const title = txn.title || '';
    const subtitle = txn.subtitle || '';
    const ref = txn.referenceId || '';
    const query = searchQuery ? searchQuery.toLowerCase() : '';
    const matchesSearch = !query || 
                          title.toLowerCase().includes(query) ||
                          subtitle.toLowerCase().includes(query) ||
                          ref.toLowerCase().includes(query);
    if (!matchesSearch) return false;
    if (selectedFilter === 'CREDIT') return txn.type === 'ADD_MONEY' || txn.type === 'RECEIVE_MONEY';
    if (selectedFilter === 'DEBIT') return txn.type === 'SEND_MONEY' || txn.type === 'RECHARGE' || txn.type === 'EMI_PAYMENT';
    return true;
  });

  const balanceInt = Math.floor(wallet.balance).toLocaleString('en-IN');
  const balanceDec = (wallet.balance % 1).toFixed(2).substring(1);

  // Wallet management actions list
  const managementRows = [
    {
      id: 'limits',
      icon: Sliders,
      title: 'Transaction Limits',
      subtitle: 'Daily ₹1,00,000 / Per Txn ₹25,000',
      action: onOpenLimits
    },
    {
      id: 'banks',
      icon: Building2,
      title: 'Linked Bank Accounts',
      subtitle: `${wallet.bankAccount?.bankName || 'State Bank of India'} •••• ${wallet.bankAccount?.accountNumber?.slice(-4) || '4821'} (Primary)`,
      action: onOpenLinkedAccounts
    },
    {
      id: 'cards',
      icon: CreditCard,
      title: 'Linked Cards',
      subtitle: 'RuPay Platinum Debit Card (•••• 9012)',
      action: onOpenLinkedCards
    },
    {
      id: 'autotopup',
      icon: RefreshCw,
      title: 'Auto Top-up & Mandates',
      subtitle: autoTopUp ? 'Active: Auto reload ₹1,000 when below ₹500' : 'Inactive: Tap to configure auto reload',
      isToggle: true,
      toggleState: autoTopUp,
      action: () => {
        soundService.playClick();
        setAutoTopUp(!autoTopUp);
      }
    }
  ];

  return (
    <div className="w-full space-y-6 animate-fade-in text-[#151A2D] pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#E6ECFA]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#151A2D]">
            Wallet &amp; Passbook
          </h1>
          <p className="text-xs text-[#697086]">
            Manage balances, accounts, limits, and full transaction history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RBI / NPCI Registered</span>
          </span>
        </div>
      </div>

      {/* Grid: Balance & Settings on Top/Left, History on Bottom/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Balance Card & Row Actions (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* WALLET BALANCE CARD (Consistent Blue Gradient) */}
          <div className="fintech-gradient-card p-6 relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-[#1738C8]/40 blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    Wallet Balance
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setShowBalance(!showBalance);
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] font-medium bg-white/15 px-2 py-0.5 rounded-full text-white">
                  Instant Access
                </span>
              </div>

              <div>
                {showBalance ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-light text-white/90">₹</span>
                    <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
                      {balanceInt}
                    </span>
                    <span className="text-lg font-medium text-white/80 font-mono">
                      {balanceDec}
                    </span>
                  </div>
                ) : (
                  <div className="text-3xl font-mono tracking-widest text-white/90 py-1">
                    ••••••••
                  </div>
                )}
                <p className="text-xs text-white/70 mt-1">
                  Bank A/c: {wallet.bankAccount?.bankName} (•••• {wallet.bankAccount?.accountNumber?.slice(-4) || '4821'})
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    onOpenAddMoney();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-[#F7F9FF] text-[#2447E8] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
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
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/25 backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>

          {/* WALLET MANAGEMENT ROWS */}
          <div className="fintech-white-card p-4 sm:p-5 space-y-3">
            <h2 className="text-xs font-bold text-[#151A2D] uppercase tracking-wider px-1">
              Wallet Settings &amp; Limits
            </h2>

            <div className="space-y-2">
              {managementRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.id}
                    onClick={() => {
                      if (!row.isToggle) soundService.playClick();
                      row.action();
                    }}
                    className="p-3.5 rounded-2xl border border-[#E6ECFA] hover:border-[#2447E8]/30 hover:bg-[#F7F9FF] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center shrink-0 group-hover:bg-[#2447E8] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#151A2D] group-hover:text-[#2447E8] truncate">
                          {row.title}
                        </h4>
                        <p className="text-[11px] text-[#697086] truncate">
                          {row.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {row.isToggle ? (
                        <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                          row.toggleState ? 'bg-[#2447E8]' : 'bg-[#E6ECFA]'
                        }`}>
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            row.toggleState ? 'translate-x-5' : 'translate-x-0'
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

            {/* Check Bank Balance Button */}
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                onCheckBankBalance();
              }}
              className="w-full mt-2 py-2.5 px-3 rounded-xl border border-[#2447E8]/20 bg-[#EEF3FF] hover:bg-[#2447E8]/15 text-[#2447E8] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Check Bank Balance via UPI PIN</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Transaction Passbook / History (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="fintech-white-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#151A2D] uppercase tracking-wider">
                  Passbook &amp; History
                </h2>
                <p className="text-xs text-[#697086]">Verified records synced with NPCI</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#F7F9FF] p-1 rounded-xl border border-[#E6ECFA] text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setSelectedFilter('ALL');
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedFilter === 'ALL'
                      ? 'bg-[#2447E8] text-white shadow-xs'
                      : 'text-[#697086] hover:text-[#151A2D]'
                  }`}
                >
                  All ({transactions.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setSelectedFilter('CREDIT');
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedFilter === 'CREDIT'
                      ? 'bg-[#20B486] text-white shadow-xs'
                      : 'text-[#697086] hover:text-[#151A2D]'
                  }`}
                >
                  Credits
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setSelectedFilter('DEBIT');
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedFilter === 'DEBIT'
                      ? 'bg-[#151A2D] text-white shadow-xs'
                      : 'text-[#697086] hover:text-[#151A2D]'
                  }`}
                >
                  Debits
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#9AA2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions by name, remark, or ref ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] focus:bg-white focus:outline-none focus:border-[#2447E8] text-[#151A2D] placeholder-[#9AA2B3] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9AA2B3] hover:text-[#151A2D]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* History List */}
            <div className="divide-y divide-[#E6ECFA]">
              {filteredTransactions.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-[#151A2D]">No transactions found</p>
                  <p className="text-[11px] text-[#697086]">Try adjusting your search query or filter.</p>
                </div>
              ) : (
                filteredTransactions.map((txn) => {
                  const isCredit = txn.type === 'ADD_MONEY' || txn.type === 'RECEIVE_MONEY';
                  return (
                    <div
                      key={txn.id}
                      onClick={() => {
                        soundService.playClick();
                        setSelectedTxnForReceipt(txn);
                      }}
                      className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#F7F9FF] -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isCredit ? 'bg-[#20B486]/10 text-[#20B486]' : 'bg-[#EEF3FF] text-[#2447E8]'
                        }`}>
                          {isCredit ? <ArrowDownLeft className="w-5 h-5 stroke-[2.2]" /> : <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#151A2D] group-hover:text-[#2447E8] truncate">
                            {txn.title}
                          </h4>
                          <p className="text-[11px] text-[#697086] truncate">
                            {txn.subtitle || txn.referenceId}
                          </p>
                          <span className="text-[10px] text-[#9AA2B3] block">
                            {txn.date}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`text-sm font-bold font-mono ${
                          isCredit ? 'text-[#20B486]' : 'text-[#151A2D]'
                        }`}>
                          {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#20B486] bg-[#20B486]/10 px-1.5 py-0.2 rounded-full mt-0.5">
                          Success
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

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
                <h3 className="text-sm font-bold text-[#151A2D]">Passbook Entry</h3>
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
                NPCI Ref: {selectedTxnForReceipt.referenceId}
              </span>
            </div>

            <div className="bg-[#F7F9FF] p-3.5 rounded-xl border border-[#E6ECFA] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#697086]">Title:</span>
                <span className="font-semibold text-[#151A2D]">{selectedTxnForReceipt.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697086]">Date &amp; Time:</span>
                <span className="text-[#151A2D]">{selectedTxnForReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697086]">Category:</span>
                <span className="text-[#151A2D]">{selectedTxnForReceipt.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#697086]">Status:</span>
                <span className="text-[#20B486] font-bold">100% Settled</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxnForReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
