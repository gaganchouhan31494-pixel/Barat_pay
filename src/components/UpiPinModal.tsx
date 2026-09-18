import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Delete, 
  Check, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { soundService } from '../utils/audio';

interface UpiPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  subtitle?: string;
  amount?: number;
  bankAccountEnding?: string;
}

export const UpiPinModal: React.FC<UpiPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  subtitle = 'State Bank of India (••8492)',
  amount
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setIsVerifying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4) return;
    soundService.playClick();
    const newPin = pin + num;
    setPin(newPin);
    setError(null);

    // Auto submit on 4 digits
    if (newPin.length === 4) {
      submitPin(newPin);
    }
  };

  const handleDelete = () => {
    soundService.playClick();
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  const submitPin = (pinToVerify: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      // Allow any 4-digit PIN for demo testing
      if (pinToVerify.length === 4) {
        soundService.playSuccessChime();
        onSuccess();
        onClose();
      } else {
        soundService.playError();
        setError('Incorrect UPI PIN. Please try again.');
        setPin('');
        setIsVerifying(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-[#E6ECFA] shadow-2xl overflow-hidden flex flex-col justify-between min-h-[500px]">
        {/* Top bar with NPCI / Bank Identity */}
        <div className="p-4 border-b border-[#E6ECFA] bg-[#F7F9FF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2447E8] flex items-center justify-center text-white font-black text-xs">
              UPI
            </div>
            <div>
              <div className="text-xs font-bold text-[#151A2D] tracking-wide">BHIM UPI Verification</div>
              <div className="text-[10px] text-[#697086]">NPCI 256-Bit SSL Encrypted</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#697086] hover:text-[#151A2D] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Summary */}
        <div className="p-5 text-center space-y-2">
          <div className="text-xs font-medium text-[#697086]">{title}</div>
          {amount !== undefined && (
            <div className="text-3xl font-black text-[#151A2D] font-mono tracking-tight">
              ₹{amount.toLocaleString('en-IN')}
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3FF] border border-[#E6ECFA] text-[11px] text-[#2447E8] font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{subtitle}</span>
          </div>

          <div className="pt-3">
            <p className="text-xs text-[#151A2D] font-semibold tracking-wider">ENTER 4-DIGIT UPI PIN</p>
            
            {/* PIN Dots Display */}
            <div className="flex items-center justify-center gap-4 my-3">
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-150 ${
                      filled
                        ? 'bg-[#2447E8] scale-125 shadow-md shadow-[#2447E8]/40 ring-4 ring-[#EEF3FF]'
                        : 'border-2 border-[#CBD5E1] bg-transparent'
                    }`}
                  />
                );
              })}
            </div>

            {error ? (
              <div className="text-xs text-[#E05252] font-medium flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : isVerifying ? (
              <div className="text-xs text-[#2447E8] animate-pulse font-medium">
                Verifying UPI PIN authorization...
              </div>
            ) : (
              <div className="text-[11px] text-[#697086] flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-[#9AA2B3]" />
                <span>Enter any 4-digit PIN (e.g. 1234) to confirm</span>
              </div>
            )}
          </div>
        </div>

        {/* Authentic Numeric Keypad */}
        <div className="p-4 bg-[#F7F9FF] border-t border-[#E6ECFA]">
          <div className="grid grid-cols-3 gap-2 text-center max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                disabled={isVerifying}
                className="h-14 rounded-2xl bg-white hover:bg-[#EEF3FF] active:bg-[#2447E8] active:text-white border border-[#E6ECFA] text-xl font-bold text-[#151A2D] font-mono transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handleDelete}
              disabled={isVerifying}
              className="h-14 rounded-2xl bg-white hover:bg-[#EEF3FF] text-[#697086] hover:text-[#151A2D] border border-[#E6ECFA] transition-all flex items-center justify-center cursor-pointer"
            >
              <Delete className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={isVerifying}
              className="h-14 rounded-2xl bg-white hover:bg-[#EEF3FF] active:bg-[#2447E8] active:text-white border border-[#E6ECFA] text-xl font-bold text-[#151A2D] font-mono transition-all flex items-center justify-center cursor-pointer shadow-xs"
            >
              0
            </button>

            <button
              type="button"
              onClick={() => {
                if (pin.length === 4) submitPin(pin);
              }}
              disabled={pin.length !== 4 || isVerifying}
              className={`h-14 rounded-2xl transition-all flex items-center justify-center font-bold text-white cursor-pointer ${
                pin.length === 4 && !isVerifying
                  ? 'bg-[#20B486] hover:bg-[#1ca077] shadow-xs'
                  : 'bg-[#CBD5E1] text-white/60 cursor-not-allowed'
              }`}
            >
              <Check className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
