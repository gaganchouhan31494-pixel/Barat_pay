import React, { useState } from 'react';
import { X, ShieldCheck, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundService } from '../utils/audio';

interface TransactionLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionLimitsModal: React.FC<TransactionLimitsModalProps> = ({ isOpen, onClose }) => {
  const [dailyLimit, setDailyLimit] = useState<number>(100000);
  const [perTxnLimit, setPerTxnLimit] = useState<number>(50000);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundService.playSuccess();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl p-6 space-y-5 text-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Transaction Limits</h3>
              <p className="text-xs text-slate-500">NPCI UPI 2.0 & Wallet Security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Limits Display */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-600">Daily UPI Limit</div>
            <div className="text-2xl font-black text-blue-700 font-mono">₹{dailyLimit.toLocaleString('en-IN')}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-500">Available Today</div>
            <div className="text-sm font-bold text-emerald-600 font-mono">₹{(dailyLimit - 12450).toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Daily Transfer Limit</span>
              <span className="font-mono text-blue-600">₹{dailyLimit.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹10,000</span>
              <span>₹2,00,000 (Max Limit)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Per Transaction Limit</span>
              <span className="font-mono text-blue-600">₹{perTxnLimit.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="2000"
              value={perTxnLimit}
              onChange={(e) => setPerTxnLimit(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-800">Biometric &amp; Device Lock</div>
              <div className="text-[11px] text-slate-500">Require fingerprint/FaceID above ₹5,000</div>
            </div>
            <button
              type="button"
              onClick={() => setBiometricEnabled(!biometricEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                biometricEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 ${
                  biometricEnabled ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Protected under RBI Fair Practices &amp; 2FA Mandate</span>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Limits Updated Successfully!</span>
            </>
          ) : (
            <>
              <span>Save Changes</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
