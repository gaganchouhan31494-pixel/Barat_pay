import React, { useState } from 'react';
import { X, Building2, CheckCircle2, Plus, ShieldCheck, CreditCard } from 'lucide-react';
import { soundService } from '../utils/audio';

interface LinkedAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckBalance: () => void;
}

export const LinkedAccountsModal: React.FC<LinkedAccountsModalProps> = ({
  isOpen,
  onClose,
  onCheckBalance
}) => {
  const [accounts, setAccounts] = useState([
    {
      id: 'sbi',
      bankName: 'State Bank of India',
      branch: 'City Main Branch',
      accountNumber: '•••• •••• 4519',
      ifsc: 'SBIN0031548',
      balance: 48250,
      isPrimary: true
    },
    {
      id: 'pnb',
      bankName: 'Punjab National Bank',
      branch: 'Commercial Hub Branch',
      accountNumber: '•••• •••• 9231',
      ifsc: 'PUNB0182400',
      balance: 14600,
      isPrimary: false
    },
    {
      id: 'hdfc',
      bankName: 'HDFC Bank',
      branch: 'Metro Branch',
      accountNumber: '•••• •••• 7712',
      ifsc: 'HDFC0001890',
      balance: 62900,
      isPrimary: false
    }
  ]);

  if (!isOpen) return null;

  const setPrimary = (id: string) => {
    soundService.playClick();
    setAccounts(accounts.map(acc => ({ ...acc, isPrimary: acc.id === id })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl p-6 space-y-4 text-slate-900">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Linked Bank Accounts</h3>
              <p className="text-xs text-slate-500">3 Verified Accounts for UPI 2.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`p-4 rounded-2xl border transition-all ${
                acc.isPrimary
                  ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{acc.bankName}</span>
                    {acc.isPrimary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">{acc.accountNumber} • {acc.ifsc}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{acc.branch}</div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onCheckBalance();
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer active:scale-95 transition-all"
                >
                  Check Balance
                </button>
              </div>

              {!acc.isPrimary && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setPrimary(acc.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600 cursor-pointer"
                  >
                    Set as Primary Account &rarr;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              soundService.playClick();
              alert('Redirecting to secure NPCI bank search list...');
            }}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/30 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Link Another Bank Account</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 text-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accounts verified with 256-Bit NPCI tokenization</span>
        </div>
      </div>
    </div>
  );
};
