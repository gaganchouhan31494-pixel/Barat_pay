import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building, 
  Sparkles,
  Zap,
  Volume2
} from 'lucide-react';
import { Language } from '../types';
import { soundService } from '../utils/audio';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, paymentMode: string) => void;
  language: Language;
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const PAYMENT_MODES = [
  { id: 'phonepe', name: 'PhonePe UPI', icon: '🟣', badge: 'Instant 0s' },
  { id: 'paytm', name: 'Paytm UPI / Bank', icon: '🔵', badge: 'Fast' },
  { id: 'gpay', name: 'Google Pay (GPay)', icon: '🟢', badge: 'Secure' },
  { id: 'sbi_netbanking', name: 'SBI NetBanking (••8492)', icon: '🏛️', badge: 'Auto' },
  { id: 'debit_card', name: 'RuPay / Visa Debit Card', icon: '💳', badge: '0% Surcharge' }
];

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [selectedMode, setSelectedMode] = useState<string>('phonepe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [successData, setSuccessData] = useState<{ amount: number; txnId: string; mode: string } | null>(null);

  if (!isOpen) return null;

  const t = {
    title: 'Load Money to Wallet',
    subtitle: 'Add funds instantly to your BharatPay wallet via secure UPI or NetBanking',
    enterAmount: 'Enter Amount to Load',
    popular: 'Quick Select:',
    paymentSource: 'Select Payment Source:',
    loadBtn: 'Load Instantly ₹',
    processing: 'Connecting to Bank...',
    step1: 'Establishing encrypted connection with Bank...',
    step2: 'Verifying NPCI & UPI authorization...',
    step3: 'Crediting funds to your BharatPay Wallet...',
    successTitle: 'Wallet Loaded Successfully!',
    successSubtitle: 'Funds are credited and available immediately for payments and transfers',
    txnId: 'Transaction ID',
    viewPassbook: 'Done / View Passbook'
  };

  const handleStartLoading = async () => {
    if (!amount || amount <= 0) return;

    soundService.playClick();
    setIsProcessing(true);
    setLoadingStep(t.step1);

    // Realistic step 1
    setTimeout(() => {
      setLoadingStep(t.step2);
    }, 1100);

    // Realistic step 2
    setTimeout(() => {
      setLoadingStep(t.step3);
    }, 2200);

    // Final success
    setTimeout(() => {
      const generatedTxnId = `TXN-LOAD-${Math.floor(100000 + Math.random() * 900000)}`;
      const modeName = PAYMENT_MODES.find(m => m.id === selectedMode)?.name || 'UPI';

      setIsProcessing(false);
      setSuccessData({
        amount,
        txnId: generatedTxnId,
        mode: modeName
      });

      // Voice announcement / Soundbox
      soundService.announcePayment(amount, 'ADD', language);
      onSuccess(amount, modeName);
    }, 3300);
  };

  const handleClose = () => {
    setSuccessData(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E6ECFA] bg-[#F7F9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center">
              <Zap className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#151A2D]">{t.title}</h3>
              <p className="text-xs text-[#697086]">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-1 rounded-lg text-[#9AA2B3] hover:text-[#151A2D] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5">
          {successData ? (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">{t.successTitle}</h4>
                <p className="text-xs text-slate-500 mt-1">{t.successSubtitle}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
                <div className="text-xs text-slate-500">Credited to BharatPay Wallet</div>
                <div className="text-3xl font-black text-emerald-600 font-mono mt-1">
                  ₹{successData.amount.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>{t.txnId}:</span>
                  <span className="font-mono text-blue-700 font-semibold">{successData.txnId}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                  <span>Source:</span>
                  <span className="text-slate-800 font-medium">{successData.mode}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#2447E8] bg-[#EEF3FF] py-2 px-3 rounded-lg max-w-sm mx-auto border border-[#E6ECFA] font-medium">
                <Volume2 className="w-4 h-4 text-[#2447E8] animate-pulse" />
                <span>Voice payment confirmation played</span>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                {t.viewPassbook}
              </button>
            </div>
          ) : isProcessing ? (
            /* Multi-step Loading Animation (Loading Simulation) */
            <div className="py-10 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping" />
                <div className="w-20 h-20 rounded-full border-4 border-t-emerald-500 border-blue-600 animate-spin flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-700 font-mono">₹</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  {t.processing}
                </h4>
                <p className="text-xs text-blue-700 font-medium animate-pulse px-4">
                  {loadingStep}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl max-w-xs mx-auto text-xs text-slate-600 border border-slate-200">
                Amount: <strong className="text-slate-900">₹{amount.toLocaleString('en-IN')}</strong> via{' '}
                <strong className="text-blue-700">{PAYMENT_MODES.find(m => m.id === selectedMode)?.name}</strong>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>{t.enterAmount}</span>
                  <span className="text-emerald-600 text-[11px] font-medium">0% Convenience Fee</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="500"
                    className="w-full pl-10 pr-4 py-3 bg-[#F7F9FF] border border-[#E6ECFA] rounded-xl text-2xl font-mono font-bold text-[#151A2D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2447E8] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Preset Chips */}
              <div className="space-y-1.5">
                <div className="text-xs text-[#697086]">{t.popular}</div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setAmount(amt);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        amount === amt
                          ? 'bg-[#2447E8] text-white shadow-xs'
                          : 'bg-[#F7F9FF] text-[#697086] hover:text-[#151A2D] hover:bg-[#EEF3FF] border border-[#E6ECFA]'
                      }`}
                    >
                      +₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-2 pt-2 border-t border-[#E6ECFA]">
                <div className="text-xs font-semibold text-[#151A2D]">{t.paymentSource}</div>
                <div className="space-y-2">
                  {PAYMENT_MODES.map((mode) => (
                    <label
                      key={mode.id}
                      onClick={() => soundService.playClick()}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedMode === mode.id
                          ? 'bg-[#EEF3FF] border-[#2447E8] text-[#151A2D] shadow-xs'
                          : 'bg-white border-[#E6ECFA] text-[#697086] hover:bg-[#F7F9FF]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{mode.icon}</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#151A2D]">{mode.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#2447E8] border border-[#E6ECFA]">
                          {mode.badge}
                        </span>
                        <input
                          type="radio"
                          name="payment_mode"
                          checked={selectedMode === mode.id}
                          onChange={() => setSelectedMode(mode.id)}
                          className="text-[#2447E8] focus:ring-[#2447E8] h-4 w-4 border-[#E6ECFA]"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleStartLoading}
                disabled={!amount || amount <= 0}
                className="w-full py-3.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <span>{t.loadBtn}{amount ? amount.toLocaleString('en-IN') : '0'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#697086] text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#20B486]" />
                <span>256-bit Bank Grade Security • End-to-End Encrypted Transfers</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
