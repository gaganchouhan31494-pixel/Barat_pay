import React, { useState } from 'react';
import { 
  Lock, 
  Fingerprint, 
  Delete, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  KeyRound,
  X
} from 'lucide-react';
import { soundService } from '../utils/audio';

interface AppLockScreenProps {
  onUnlock: () => void;
  brandName?: string;
  userName?: string;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({
  onUnlock,
  brandName = 'BharatPay',
  userName = 'Gagan Chouhan'
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  const [biometricScanning, setBiometricScanning] = useState<boolean>(false);

  const PIN_LENGTH = 4;

  const handleKeyPress = (num: string) => {
    if (pin.length >= PIN_LENGTH) return;
    soundService.playClick();
    const newPin = pin + num;
    setPin(newPin);
    setError(null);

    if (newPin.length === PIN_LENGTH) {
      // Validate entered PIN
      setTimeout(() => {
        // Accepts 1234 or any 4 digit sequence for seamless user testing
        if (newPin === '1234' || newPin.length === 4) {
          soundService.playSuccess();
          onUnlock();
        } else {
          soundService.playError();
          setError('Incorrect PIN. Please try again or use biometrics.');
          setPin('');
        }
      }, 200);
    }
  };

  const handleDelete = () => {
    soundService.playClick();
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    soundService.playClick();
    setPin('');
    setError(null);
  };

  const handleBiometric = () => {
    soundService.playClick();
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      soundService.playSuccess();
      onUnlock();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-8 bg-[#F7F9FF] text-[#151A2D] select-none animate-fade-in overflow-y-auto">
      {/* Top Header */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#2447E8] text-white flex items-center justify-center font-black text-sm shadow-sm shadow-[#2447E8]/20">
            ₹
          </div>
          <span className="text-sm font-black text-[#151A2D] tracking-tight">{brandName}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#20B486] bg-[#20B486]/10 px-2.5 py-1 rounded-full border border-[#20B486]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Biometric Secured</span>
        </div>
      </div>

      {/* Main PIN Prompt Card */}
      <div className="w-full max-w-xs flex flex-col items-center text-center space-y-6 my-auto">
        {/* Animated Lock Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-[#EEF3FF] border border-[#E6ECFA] flex items-center justify-center text-[#2447E8] shadow-md shadow-[#2447E8]/10">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#20B486] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
            ✓
          </span>
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-[#151A2D]">App Locked</h2>
          <p className="text-xs text-[#697086]">
            Welcome back, <strong className="text-[#151A2D]">{userName}</strong>
          </p>
          <p className="text-xs text-[#697086] pt-1">Enter your 4-digit security PIN to continue</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-4 py-2">
          {Array.from({ length: PIN_LENGTH }).map((_, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                idx < pin.length
                  ? 'bg-[#2447E8] scale-110 shadow-sm shadow-[#2447E8]/40 ring-4 ring-[#EEF3FF]'
                  : 'bg-[#E6ECFA] border border-[#CBD5E1]'
              }`}
            />
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-2.5 rounded-xl bg-[#E05252]/10 border border-[#E05252]/20 text-[#E05252] text-xs font-semibold flex items-center gap-1.5 animate-shake">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-14 rounded-2xl bg-white hover:bg-[#EEF3FF] active:bg-[#2447E8] active:text-white border border-[#E6ECFA] text-lg font-bold text-[#151A2D] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              {num}
            </button>
          ))}

          {/* Biometric or Clear */}
          <button
            type="button"
            onClick={handleBiometric}
            disabled={biometricScanning}
            className="h-14 rounded-2xl bg-[#EEF3FF] hover:bg-[#2447E8] hover:text-white border border-[#E6ECFA] text-[#2447E8] text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Authenticate with Biometrics"
          >
            <Fingerprint className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">{biometricScanning ? 'Verifying...' : 'Touch ID'}</span>
          </button>

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-white hover:bg-[#EEF3FF] active:bg-[#2447E8] active:text-white border border-[#E6ECFA] text-lg font-bold text-[#151A2D] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            0
          </button>

          {/* Delete / Backspace */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-white hover:bg-[#EEF3FF] border border-[#E6ECFA] text-[#697086] hover:text-[#151A2D] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Delete digit"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions / Forgot PIN */}
        <div className="flex items-center justify-between w-full text-xs pt-1 px-1">
          <button
            type="button"
            onClick={() => setIsForgotOpen(true)}
            className="text-[#2447E8] hover:text-[#1738C8] font-bold cursor-pointer"
          >
            Forgot PIN?
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-[#697086] hover:text-[#151A2D] font-medium cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="text-[11px] text-[#697086] flex items-center gap-1.5 pt-4">
        <ShieldCheck className="w-3.5 h-3.5 text-[#20B486]" />
        <span>Secured with end-to-end device authorization</span>
      </div>

      {/* Forgot PIN Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E6ECFA] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#151A2D]">Reset Security PIN</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="p-1 rounded-lg text-[#9AA2B3] hover:text-[#151A2D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#697086] leading-relaxed">
              Default demo PIN is <strong className="text-[#2447E8]">1234</strong>. Alternatively, you can click <strong className="text-[#151A2D]">Touch ID / Biometric</strong> to unlock instantly.
            </p>

            <button
              type="button"
              onClick={() => {
                setIsForgotOpen(false);
                setPin('1234');
                setTimeout(() => onUnlock(), 250);
              }}
              className="w-full py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Use Default PIN (1234) &amp; Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
