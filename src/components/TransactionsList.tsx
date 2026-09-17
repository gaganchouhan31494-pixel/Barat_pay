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
  language: Language;
  theme?: ThemeConfig;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  language,
  theme
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
        return <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'SEND_MONEY':
        return <ArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'GOLD_LOAN':
        return <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'SILVER_LOAN':
        return <Coins className="w-4 h-4 text-slate-600 dark:text-slate-300" />;
      case 'PERSONAL_LOAN':
        return <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'RECHARGE':
        return <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'EMI_PAYMENT':
        return <ArrowUpRight className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
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
    setCopyStatus('रसीद विवरण कॉपी हो गया!');
    setTimeout(() => setCopyStatus(null), 3000);
  };

  const handleDownloadReceipt = () => {
    if (!selectedTxn) return;
    soundService.playClick();
    setCopyStatus(`रसीद #${selectedTxn.referenceId} सुरक्षित रिकॉर्ड में दर्ज की गई`);
    setTimeout(() => setCopyStatus(null), 3500);
  };

  return (
    <div id="passbook" className={`rounded-2xl border p-4 sm:p-5 space-y-4 transition-all ${
      theme?.isLight
        ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
        : 'bg-slate-900 border-slate-800 text-white'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 flex items-center justify-center border border-blue-200/80 dark:border-blue-900">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-base font-bold tracking-tight ${theme?.isLight ? 'text-slate-900' : 'text-white'}`}>
              Account Passbook &amp; Statement
            </h3>
            <p className="text-[11px] text-slate-500">
              खाता बही • समस्त डिजिटल लेन-देन व आधिकारिक UTR रिकॉर्ड
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="खोजें (नाम, तारीख, UTR)..."
            className={`w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-lg text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-blue-600 ${
              theme?.isLight
                ? 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'
                : 'bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        {[
          { id: 'ALL', label: 'सभी (All)' },
          { id: 'LOAD', label: 'वॉलेट लोडिंग (Credits)' },
          { id: 'SENT', label: 'भुगतान (Debits)' },
          { id: 'LOAN', label: 'लोन डिस्बर्सल' }
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
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : theme?.isLight
                  ? 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs">
            कोई लेन-देन नहीं मिला।
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
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                  theme?.isLight
                    ? 'bg-slate-50/60 hover:bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'
                    : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    credit 
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                      : 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                  }`}>
                    {getTxnIcon(txn.type)}
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                      theme?.isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-indigo-300'
                    }`}>
                      {txn.title || 'UPI Transaction'}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {txn.subtitle}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {txn.date} • <span className="text-slate-500">UTR: {txn.referenceId}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-sm sm:text-base font-extrabold font-mono tracking-tight ${
                    credit 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : theme?.isLight ? 'text-slate-900' : 'text-slate-200'
                  }`}>
                    {credit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> सफल
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-sm overflow-hidden rounded-2xl border shadow-2xl p-5 space-y-4 ${
            theme?.isLight
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-slate-900 border-slate-700 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold">आधिकारिक डिजिटल रसीद</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                भुगतान सफल (Payment Successful)
              </div>
              <div className="text-2xl font-black font-mono">
                ₹{selectedTxn.amount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 font-medium">{selectedTxn.title}</p>
            </div>

            <div className={`space-y-2 p-3.5 rounded-xl border text-xs ${
              theme?.isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-800/80 border-slate-700/80'
            }`}>
              <div className="flex justify-between text-slate-500">
                <span>समय व दिनांक:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>लेन-देन प्रकार:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTxn.mode || 'BharatPay Wallet'}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>विवरण:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{selectedTxn.subtitle}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-slate-500">
                <span>UTR / Ref ID:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-indigo-300">{selectedTxn.referenceId}</span>
              </div>
            </div>

            {copyStatus && (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold text-center animate-fade-in flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{copyStatus}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  theme?.isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>डाउनलोड</span>
              </button>
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>शेयर / कॉपी</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
