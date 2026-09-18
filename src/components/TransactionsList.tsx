import React, { useState } from 'react';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle, 
  Sparkles, 
  Coins, 
  Smartphone, 
  CheckCircle2, 
  Search, 
  FileText, 
  X, 
  Share2, 
  Download, 
  Building2, 
  Check 
} from 'lucide-react';
import { Transaction, Language } from '../types';
import { soundService } from '../utils/audio';
import { ThemeConfig } from '../utils/theme';

interface TransactionsListProps {
  transactions: Transaction[];
  language?: Language;
  theme?: ThemeConfig;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions
}) => {
  const [filter, setFilter] = useState<'ALL' | 'LOAD' | 'SENT' | 'LOAN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const filteredTransactions = (transactions || []).filter((t) => {
    if (!t) return false;
    const title = t.title || '';
    const subtitle = t.subtitle || '';
    const refId = t.referenceId || '';
    const query = searchQuery ? searchQuery.toLowerCase() : '';
    const matchesSearch = !query ||
      title.toLowerCase().includes(query) ||
      subtitle.toLowerCase().includes(query) ||
      refId.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (filter === 'LOAD') return t.type === 'ADD_MONEY';
    if (filter === 'SENT') return t.type === 'SEND_MONEY' || t.type === 'RECHARGE' || t.type === 'EMI_PAYMENT';
    if (filter === 'LOAN') return t.type === 'GOLD_LOAN' || t.type === 'SILVER_LOAN' || t.type === 'PERSONAL_LOAN';
    return true;
  });

  const getTxnIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'ADD_MONEY':
        return <PlusCircle className="w-4 h-4 text-[#20B486]" />;
      case 'SEND_MONEY':
        return <ArrowUpRight className="w-4 h-4 text-[#E05252]" />;
      case 'GOLD_LOAN':
        return <Sparkles className="w-4 h-4 text-[#F4B740]" />;
      case 'SILVER_LOAN':
        return <Coins className="w-4 h-4 text-[#697086]" />;
      case 'PERSONAL_LOAN':
        return <Building2 className="w-4 h-4 text-[#2447E8]" />;
      case 'RECHARGE':
        return <Smartphone className="w-4 h-4 text-[#2447E8]" />;
      case 'EMI_PAYMENT':
        return <ArrowUpRight className="w-4 h-4 text-[#F4B740]" />;
      default:
        return <ArrowDownLeft className="w-4 h-4 text-[#20B486]" />;
    }
  };

  const isCredit = (type: Transaction['type']) => {
    return (
      type === 'ADD_MONEY' || 
      type === 'GOLD_LOAN' || 
      type === 'SILVER_LOAN' || 
      type === 'PERSONAL_LOAN' || 
      type === 'RECEIVE_MONEY'
    );
  };

  const handleCopyReceipt = () => {
    if (!selectedTxn) return;
    soundService.playClick();
    const text = `BharatPay Digital Receipt\nAmount: ₹${selectedTxn.amount}\nRef: ${selectedTxn.referenceId}\nDate: ${selectedTxn.date}\nType: ${selectedTxn.title}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopyStatus('Receipt details copied to clipboard!');
    setTimeout(() => setCopyStatus(null), 3000);
  };

  const handleDownloadReceipt = () => {
    if (!selectedTxn) return;
    soundService.playClick();
    setCopyStatus(`Receipt #${selectedTxn.referenceId} saved successfully`);
    setTimeout(() => setCopyStatus(null), 3500);
  };

  return (
    <div id="passbook" className="rounded-2xl border border-[#E6ECFA] bg-white shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6ECFA]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center border border-[#E6ECFA]">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-[#151A2D]">
              Account Statement &amp; Passbook
            </h3>
            <p className="text-[11px] text-[#697086]">
              Real-time digital ledger and official NPCI reference logs
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#9AA2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, date or UTR..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-lg text-xs bg-[#F7F9FF] border border-[#E6ECFA] text-[#151A2D] placeholder-[#9AA2B3] transition-colors focus:bg-white focus:outline-none focus:border-[#2447E8]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        {[
          { id: 'ALL', label: 'All Transactions' },
          { id: 'LOAD', label: 'Credits (+)' },
          { id: 'SENT', label: 'Debits (-)' },
          { id: 'LOAN', label: 'Loan Disbursals' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              soundService.playClick();
              setFilter(tab.id as typeof filter);
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-[#2447E8] text-white shadow-xs font-bold'
                : 'bg-[#F7F9FF] text-[#697086] hover:text-[#151A2D] hover:bg-[#EEF3FF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="py-10 text-center text-[#9AA2B3] text-xs">
            No transactions found matching your criteria.
          </div>
        ) : (
          filteredTransactions.map((txn) => {
            const credit = isCredit(txn.type);
            return (
              <div
                key={txn.id}
                onClick={() => {
                  soundService.playClick();
                  setSelectedTxn(txn);
                }}
                className="flex items-center justify-between p-3 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    credit 
                      ? 'bg-[#20B486]/10 border-[#20B486]/20'
                      : 'bg-[#F7F9FF] border-[#E6ECFA]'
                  }`}>
                    {getTxnIcon(txn.type)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight text-[#151A2D] group-hover:text-[#2447E8] transition-colors">
                      {txn.title || 'UPI Transaction'}
                    </h4>
                    <p className="text-[11px] text-[#697086] line-clamp-1">
                      {txn.subtitle}
                    </p>
                    <div className="text-[10px] text-[#9AA2B3] font-mono mt-0.5">
                      {txn.date} • <span className="text-[#697086]">UTR: {txn.referenceId}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-sm sm:text-base font-extrabold font-mono tracking-tight ${
                    credit ? 'text-[#20B486]' : 'text-[#151A2D]'
                  }`}>
                    {credit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#20B486]">
                    <CheckCircle2 className="w-3 h-3" /> Successful
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#E6ECFA] shadow-2xl p-5 space-y-4 bg-white text-[#151A2D]">
            <div className="flex items-center justify-between border-b border-[#E6ECFA] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2447E8]" />
                <h4 className="text-sm font-bold">Transaction Receipt</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="p-1 text-[#9AA2B3] hover:text-[#151A2D] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="w-12 h-12 rounded-full bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="text-[11px] text-[#20B486] font-bold uppercase tracking-wider">
                Payment Successful
              </div>
              <div className="text-2xl font-black font-mono text-[#151A2D]">
                ₹{selectedTxn.amount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-[#697086] font-medium">{selectedTxn.title}</p>
            </div>

            <div className="space-y-2 p-3.5 rounded-xl border border-[#E6ECFA] bg-[#F7F9FF] text-xs">
              <div className="flex justify-between text-[#697086]">
                <span>Date &amp; Time:</span>
                <span className="font-semibold text-[#151A2D]">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between text-[#697086]">
                <span>Payment Mode:</span>
                <span className="font-semibold text-[#151A2D]">{selectedTxn.mode || 'BharatPay Wallet'}</span>
              </div>
              <div className="flex justify-between text-[#697086]">
                <span>Remarks:</span>
                <span className="font-semibold text-[#151A2D] line-clamp-1">{selectedTxn.subtitle}</span>
              </div>
              <div className="pt-2 border-t border-[#E6ECFA] flex justify-between text-[#697086]">
                <span>UTR / Reference:</span>
                <span className="font-mono font-bold text-[#2447E8]">{selectedTxn.referenceId}</span>
              </div>
            </div>

            {copyStatus && (
              <div className="p-2 rounded-lg bg-[#20B486]/10 border border-[#20B486]/20 text-[#20B486] text-xs font-semibold text-center animate-fade-in flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{copyStatus}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="flex-1 py-2.5 rounded-xl border border-[#E6ECFA] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-[#F7F9FF] hover:bg-[#EEF3FF] text-[#151A2D]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="flex-1 py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
