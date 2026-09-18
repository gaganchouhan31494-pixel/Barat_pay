import React, { useState } from 'react';
import { 
  X, 
  ArrowUpRight, 
  Smartphone, 
  AtSign, 
  Building2, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  Delete
} from 'lucide-react';
import { Language, UserWallet } from '../types';
import { soundService } from '../utils/audio';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  language: Language;
  onSuccess: (amount: number, recipient: string, note?: string) => void;
}

const RECENT_CONTACTS = [
  { name: 'Rahul Sharma', phone: '9829012345', upi: 'rahulsharma@okhdfcbank', avatar: 'R' },
  { name: 'Amit Kumar', phone: '9414054321', upi: 'amit.kumar@paytm', avatar: 'A' },
  { name: 'Priya Singh', phone: '9783067890', upi: 'priyasingh@ybl', avatar: 'P' },
  { name: 'Vikram Verma', phone: '9672089012', upi: 'vikram.verma@icici', avatar: 'V' }
];

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  wallet,
  language,
  onSuccess
}) => {
  const [sendType, setSendType] = useState<'mobile' | 'upi' | 'bank'>('mobile');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<number>(500);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // UPI PIN keypad step
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{ amount: number; recipient: string; txnId: string } | null>(null);

  if (!isOpen) return null;

  const t = {
    title: 'Send Money',
    subtitle: 'Transfer funds instantly from BharatPay Wallet to any UPI ID or Mobile',
    toMobile: 'To Mobile',
    toUpi: 'To UPI ID',
    toBank: 'To Bank A/c',
    recent: 'Recent Contacts:',
    amount: 'Transfer Amount (₹)',
    note: 'Note / Remarks (Optional)',
    payFrom: 'Pay From:',
    payBtn: 'Pay ₹',
    balance: 'Available Balance',
    lowBalance: 'Insufficient Wallet balance! Please load money first.',
    enterPin: 'Enter 4-Digit UPI PIN',
    pinSubtitle: 'State Bank of India Security Verification',
    processing: 'Processing Payment...',
    successTitle: 'Payment Successful!',
    successSubtitle: 'Funds transferred directly to recipient account'
  };

  const handleProceedToPay = () => {
    soundService.playClick();
    if (!recipient.trim()) {
      setError('Please enter recipient mobile number or UPI ID');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    if (amount > wallet.balance) {
      setError(t.lowBalance);
      return;
    }

    setError(null);
    setEnteredPin('');
    setShowPinModal(true);
  };

  const handlePinKey = (digit: string) => {
    soundService.playClick();
    if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);

      // Auto submit when 4 digits reached
      if (newPin.length === 4) {
        processPayment();
      }
    }
  };

  const handleBackspace = () => {
    soundService.playClick();
    setEnteredPin(prev => prev.slice(0, -1));
  };

  const processPayment = () => {
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      setShowPinModal(false);
      const generatedTxnId = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      setSuccessData({
        amount,
        recipient,
        txnId: generatedTxnId
      });

      soundService.announcePayment(amount, 'SEND', language);
      onSuccess(amount, recipient, note);
    }, 1800);
  };

  const handleClose = () => {
    setSuccessData(null);
    setShowPinModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E6ECFA] bg-[#F7F9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#151A2D]">{t.title}</h3>
              <p className="text-xs text-[#697086]">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-[#9AA2B3] hover:text-[#151A2D] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {successData ? (
            /* Success Receipt */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">{t.successTitle}</h4>
                <p className="text-xs text-slate-500 mt-1">{t.successSubtitle}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto space-y-2">
                <div className="text-3xl font-black text-emerald-600 font-mono">
                  ₹{successData.amount.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-700">
                  Paid to: <strong className="text-slate-900">{successData.recipient}</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex justify-between">
                  <span>UTR / Ref ID:</span>
                  <span className="font-mono text-blue-700 font-semibold">{successData.txnId}</span>
                </div>
                <div className="text-[11px] text-slate-600 flex justify-between">
                  <span>Debited from:</span>
                  <span className="text-slate-900 font-semibold">BharatPay Wallet</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-sm shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                Done / View Passbook
              </button>
            </div>
          ) : showPinModal ? (
            /* Authentic UPI 4-Digit PIN Keypad Screen */
            <div className="py-4 space-y-6">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#151A2D]">{t.enterPin}</h4>
                <p className="text-xs text-[#697086]">{t.pinSubtitle}</p>
                <div className="text-sm font-semibold text-[#20B486] mt-1">
                  Payment Amount: ₹{amount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Masked PIN dots */}
              <div className="flex justify-center gap-4 py-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all ${
                      enteredPin.length > index
                        ? 'bg-blue-600 scale-125 shadow-md shadow-blue-500/50'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {isTransferring ? (
                <div className="py-6 text-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">{t.processing}</p>
                </div>
              ) : (
                /* Numeric Keypad */
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, i) => {
                    if (key === '') {
                      return <div key={i} />;
                    }
                    if (key === 'del') {
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={handleBackspace}
                          className="p-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Delete className="w-5 h-5" />
                        </button>
                      );
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePinKey(key)}
                        className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-lg font-mono transition-colors active:scale-95 cursor-pointer"
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Primary Form */
            <>
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-2 bg-[#F7F9FF] p-1 rounded-xl border border-[#E6ECFA]">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setSendType('mobile');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sendType === 'mobile'
                      ? 'bg-white text-[#2447E8] shadow-xs font-bold'
                      : 'text-[#697086] hover:text-[#151A2D]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{t.toMobile}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setSendType('upi');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sendType === 'upi'
                      ? 'bg-white text-[#2447E8] shadow-xs font-bold'
                      : 'text-[#697086] hover:text-[#151A2D]'
                  }`}
                >
                  <AtSign className="w-3.5 h-3.5" />
                  <span>{t.toUpi}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setSendType('bank');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sendType === 'bank'
                      ? 'bg-white text-[#2447E8] shadow-xs font-bold'
                      : 'text-[#697086] hover:text-[#151A2D]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t.toBank}</span>
                </button>
              </div>

              {/* Recipient Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#151A2D]">
                  {sendType === 'mobile' ? 'Mobile Number' : sendType === 'upi' ? 'UPI ID (e.g. name@upi)' : 'Account Number & IFSC Code'}
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setError(null);
                  }}
                  placeholder={sendType === 'mobile' ? '10-digit mobile number' : sendType === 'upi' ? 'username@okhdfcbank' : 'Account Number + IFSC'}
                  className="w-full px-3.5 py-2.5 bg-[#F7F9FF] border border-[#E6ECFA] rounded-xl text-sm text-[#151A2D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2447E8]"
                />
              </div>

              {/* Recent Contacts quick tap */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-[#697086]">{t.recent}</div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {RECENT_CONTACTS.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setRecipient(sendType === 'upi' ? c.upi : c.phone);
                      }}
                      className="shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#F7F9FF] hover:bg-[#EEF3FF] border border-[#E6ECFA] text-xs transition-colors cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#EEF3FF] text-[#2447E8] font-bold flex items-center justify-center text-[10px]">
                        {c.avatar}
                      </div>
                      <span className="text-[#151A2D] font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-[#151A2D]">{t.amount}</label>
                  <span className="text-[#697086]">
                    {t.balance}: <strong className="text-[#20B486] font-mono">₹{wallet.balance.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-bold text-[#697086]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={amount || ''}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setError(null);
                    }}
                    placeholder="500"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F7F9FF] border border-[#E6ECFA] rounded-xl text-xl font-mono font-bold text-[#151A2D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2447E8]"
                  />
                </div>
              </div>

              {/* Note / Remarks */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#151A2D]">{t.note}</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Rent, dinner, invoice..."
                  className="w-full px-3.5 py-2 bg-[#F7F9FF] border border-[#E6ECFA] rounded-xl text-xs text-[#151A2D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2447E8]"
                />
              </div>

              {/* Error warning */}
              {error && (
                <div className="p-2.5 rounded-lg bg-[#E05252]/10 border border-[#E05252]/20 text-[#E05252] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleProceedToPay}
                className="w-full py-3.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <span>{t.payBtn}{amount ? amount.toLocaleString('en-IN') : '0'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#697086]">
                <ShieldCheck className="w-3 h-3 text-[#20B486]" />
                <span>Protected by NPCI UPI 2.0 &amp; BharatPay Safe Shield</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
