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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E6ECFA] shadow-2xl p-6 space-y-5 text-[#151A2D]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6ECFA]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] border border-[#2447E8]/20 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#151A2D]">Transaction Limits</h3>
              <p className="text-xs text-[#697086]">NPCI UPI 2.0 &amp; Wallet Security Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#9AA2B3] hover:text-[#151A2D] hover:bg-[#F7F9FF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Limits Display */}
        <div className="p-4 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#697086]">Daily UPI Limit</div>
            <div className="text-2xl font-black text-[#2447E8] font-mono">₹{dailyLimit.toLocaleString('en-IN')}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#697086]">Available Today</div>
            <div className="text-sm font-bold text-[#20B486] font-mono">₹{(dailyLimit - 12450).toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-[#151A2D] mb-1.5">
              <span>Daily Transfer Limit</span>
              <span className="font-mono text-[#2447E8]">₹{dailyLimit.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full accent-[#2447E8] cursor-pointer h-2 bg-[#E6ECFA] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#9AA2B3] mt-1 font-mono">
              <span>₹10,000</span>
              <span>₹2,00,000 (Max Limit)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-[#151A2D] mb-1.5">
              <span>Per Transaction Limit</span>
              <span className="font-mono text-[#2447E8]">₹{perTxnLimit.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="2000"
              value={perTxnLimit}
              onChange={(e) => setPerTxnLimit(Number(e.target.value))}
              className="w-full accent-[#2447E8] cursor-pointer h-2 bg-[#E6ECFA] rounded-lg"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA]">
            <div>
              <div className="text-xs font-bold text-[#151A2D]">Biometric &amp; Device Lock</div>
              <div className="text-[11px] text-[#697086]">Require biometric confirmation above ₹5,000</div>
            </div>
            <button
              type="button"
              onClick={() => setBiometricEnabled(!biometricEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                biometricEnabled ? 'bg-[#2447E8]' : 'bg-[#CBD5E1]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                  biometricEnabled ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 text-xs text-[#697086]">
          <ShieldCheck className="w-4 h-4 text-[#20B486]" />
          <span>Protected with 256-bit encryption &amp; Two-Factor Authentication</span>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
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
