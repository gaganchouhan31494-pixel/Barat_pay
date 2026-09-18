import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Lock, 
  ArrowRight, 
  Fingerprint, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Send, 
  RefreshCw,
  X
} from 'lucide-react';
import { soundService } from '../utils/audio';

interface LoginPageProps {
  onLoginSuccess: (name: string, identifier: string, village: string) => void;
  onNavigateToRegister?: () => void;
  brandName?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  brandName = 'BharatPay'
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [identifier, setIdentifier] = useState('9876543210');
  const [fullName, setFullName] = useState('');
  const [village, setVillage] = useState('');
  const [password, setPassword] = useState('••••');
  const [actualPassword, setActualPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [biometricPrompt, setBiometricPrompt] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your mobile number or email address.');
      return;
    }

    soundService.playClick();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      soundService.playSuccess();
      onLoginSuccess(fullName.trim() || 'User', identifier, village.trim() || 'New Delhi, India');
    }, 800);
  };

  const handleBiometricLogin = () => {
    soundService.playClick();
    setBiometricPrompt(true);
    setTimeout(() => {
      setBiometricPrompt(false);
      soundService.playSuccess();
      onLoginSuccess(fullName.trim() || 'User', '9876543210', village.trim() || 'New Delhi, India');
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    soundService.playClick();
    setForgotSent(true);
    setTimeout(() => {
      setIsForgotOpen(false);
      setForgotSent(false);
      setForgotInput('');
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F9FF] text-[#151A2D] flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Container with two-column layout on desktop and single-column on mobile */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left / Primary Column: Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6ECFA] p-6 sm:p-10 shadow-[0_8px_30px_rgb(36,71,232,0.06)] relative overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1738C8] via-[#2447E8] to-[#315BFF]" />

          {/* Brand Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1738C8] to-[#2447E8] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-[#2447E8]/20">
                ₹
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#151A2D] tracking-tight">
                  {brandName}
                </span>
                <span className="block text-[11px] font-semibold text-[#697086] uppercase tracking-wider">
                  Digital Payments
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3FF] border border-[#E6ECFA] text-xs font-semibold text-[#2447E8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20B486]" />
              <span>256-Bit SSL</span>
            </div>
          </div>

          {/* Form Title */}
          <div className="space-y-1 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#151A2D] tracking-tight">
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs sm:text-sm text-[#697086]">
              {isRegisterMode 
                ? 'Sign up to start instant money transfers & digital wallet' 
                : 'Sign in to continue to your account'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#E05252]/10 border border-[#E05252]/20 text-[#E05252] text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E05252] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#151A2D]">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] focus:bg-white focus:border-[#2447E8] focus:ring-2 focus:ring-[#2447E8]/15 text-sm font-medium text-[#151A2D] placeholder:text-[#9AA2B3] outline-none transition-all"
              />
            </div>

            {/* City / Village / Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#151A2D]">
                City / Village / Location
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Gharsana, Sri Ganganagar"
                className="w-full px-4 py-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] focus:bg-white focus:border-[#2447E8] focus:ring-2 focus:ring-[#2447E8]/15 text-sm font-medium text-[#151A2D] placeholder:text-[#9AA2B3] outline-none transition-all"
              />
            </div>

            {/* Mobile / Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#151A2D]">
                Mobile Number or Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-bold text-[#697086]">
                  <Smartphone className="w-4 h-4 text-[#2447E8]" />
                  <span>+91</span>
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError(null);
                  }}
                  placeholder="10-digit mobile number"
                  className="w-full pl-16 pr-4 py-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] focus:bg-white focus:border-[#2447E8] focus:ring-2 focus:ring-[#2447E8]/15 text-sm font-medium text-[#151A2D] placeholder:text-[#9AA2B3] outline-none transition-all"
                />
              </div>
            </div>

            {/* Password / PIN Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#151A2D]">
                  {isRegisterMode ? 'Create Security PIN / Password' : 'Password or 4-Digit PIN'}
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(true)}
                    className="text-xs font-semibold text-[#2447E8] hover:text-[#1738C8] cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697086]">
                  <Lock className="w-4 h-4 text-[#2447E8]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={actualPassword}
                  onChange={(e) => setActualPassword(e.target.value)}
                  placeholder="Enter PIN / password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] focus:bg-white focus:border-[#2447E8] focus:ring-2 focus:ring-[#2447E8]/15 text-sm font-medium text-[#151A2D] placeholder:text-[#9AA2B3] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA2B3] hover:text-[#151A2D] p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2447E8] border-[#E6ECFA] focus:ring-[#2447E8] cursor-pointer"
                />
                <span className="text-xs font-medium text-[#697086]">Remember Me</span>
              </label>

              <span className="text-[11px] text-[#697086]">
                Encrypted Session
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-sm shadow-md shadow-[#2447E8]/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{isRegisterMode ? 'Create Account' : 'Login to Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Optional Biometric Login Button */}
            <button
              type="button"
              onClick={handleBiometricLogin}
              disabled={isLoading || biometricPrompt}
              className="w-full py-3 px-4 rounded-xl bg-[#EEF3FF] hover:bg-[#2447E8] hover:text-white border border-[#E6ECFA] text-[#2447E8] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{biometricPrompt ? 'Scanning Biometrics...' : 'Use Biometric Login (Face ID / Fingerprint)'}</span>
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-6 pt-5 border-t border-[#E6ECFA] text-center">
            <p className="text-xs text-[#697086]">
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setIsRegisterMode(!isRegisterMode);
                  setError(null);
                }}
                className="font-bold text-[#2447E8] hover:text-[#1738C8] cursor-pointer ml-1 underline underline-offset-2"
              >
                {isRegisterMode ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>

        {/* Right Column: Premium Fintech Illustration & Feature Highlights */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          {/* Main Visual Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1738C8] via-[#2447E8] to-[#315BFF] text-white shadow-2xl shadow-[#2447E8]/30 relative overflow-hidden">
            {/* Background Graphic Rings */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#20B486]" />
                <span>Next-Gen Indian Fintech</span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight leading-tight">
                  Seamless &amp; Secure Digital Payments
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Send money instantly, scan any merchant QR code, manage your wallet balance, and track transactions with zero hassle.
                </p>
              </div>

              {/* Stylized Payment Flow Card Illustration */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80 font-medium">Instant Wallet Transfer</span>
                  <span className="text-[#20B486] font-bold bg-[#20B486]/20 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white text-[#2447E8] flex items-center justify-center font-bold text-xs">
                      ₹
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Rahul Sharma</div>
                      <div className="text-[10px] text-white/70">UPI 2.0 Direct Transfer</div>
                    </div>
                  </div>
                  <div className="text-sm font-mono font-bold text-white">
                    +₹1,500.00
                  </div>
                </div>
              </div>

              {/* Bullet Highlights */}
              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#20B486] shrink-0" />
                  <span>Instant zero-fee wallet to bank transfers</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#20B486] shrink-0" />
                  <span>All-in-one QR scan with instant confirmation</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#20B486] shrink-0" />
                  <span>24x7 automated fraud monitoring shield</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Strip */}
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#697086] py-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#20B486]" />
              Safe &amp; Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#2447E8]" />
              Multi-Bank Linked
            </span>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E6ECFA] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#151A2D]">Reset Password</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="p-1 rounded-lg text-[#9AA2B3] hover:text-[#151A2D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-[#20B486]/10 border border-[#20B486]/20 text-[#20B486] text-xs text-center font-medium space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-[#20B486]" />
                <p className="font-bold">Recovery link sent!</p>
                <p className="text-[#697086]">Check your mobile messages or email for the password reset instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-[#697086]">
                  Enter your registered mobile number or email address to receive a secure password reset link.
                </p>
                <input
                  type="text"
                  required
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="9876543210 or name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] text-xs text-[#151A2D] outline-none focus:border-[#2447E8]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
