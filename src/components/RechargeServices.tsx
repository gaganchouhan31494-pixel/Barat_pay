import React, { useState } from 'react';
import { 
  Smartphone, 
  Zap, 
  Tv, 
  Car, 
  Flame, 
  Droplets, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Building,
  ShieldCheck
} from 'lucide-react';
import { Language, UserWallet } from '../types';
import { soundService } from '../utils/audio';

interface RechargeServicesProps {
  wallet: UserWallet;
  language: Language;
  onSuccess: (amount: number, serviceName: string, detail: string) => void;
}

const SERVICES = [
  { id: 'mobile', name: 'Mobile Recharge', icon: Smartphone, popular: 'Jio / Airtel / Vi' },
  { id: 'electricity', name: 'Electricity Bill', icon: Zap, popular: 'JVVNL / Discoms' },
  { id: 'dth', name: 'DTH / Cable TV', icon: Tv, popular: 'Tata Play / Airtel DTH' },
  { id: 'fastag', name: 'FASTag Recharge', icon: Car, popular: 'NHAI / SBI / ICICI' },
  { id: 'gas', name: 'Book LPG Cylinder', icon: Flame, popular: 'Indane / Bharat Gas' },
  { id: 'water', name: 'Water Utility Bill', icon: Droplets, popular: 'Municipal Water Board' }
];

export const RechargeServices: React.FC<RechargeServicesProps> = ({
  wallet,
  language,
  onSuccess
}) => {
  const [activeModalService, setActiveModalService] = useState<typeof SERVICES[0] | null>(null);
  const [accountNumber, setAccountNumber] = useState('9876543210');
  const [operator, setOperator] = useState('Jio Prepaid');
  const [billAmount, setBillAmount] = useState<number>(299);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleOpenService = (service: typeof SERVICES[0]) => {
    soundService.playClick();
    setActiveModalService(service);
    setError(null);
    setIsDone(false);

    if (service.id === 'mobile') {
      setAccountNumber(wallet.phone);
      setOperator('Jio Prepaid - National Circle');
      setBillAmount(299);
    } else if (service.id === 'electricity') {
      setAccountNumber('K-NO-1902847120');
      setOperator('State Power Distribution (North Zone)');
      setBillAmount(1420);
    } else if (service.id === 'dth') {
      setAccountNumber('1092837461');
      setOperator('Tata Play DTH');
      setBillAmount(450);
    } else if (service.id === 'fastag') {
      setAccountNumber('DL-01-AB-4021');
      setOperator('SBI FASTag National Highway');
      setBillAmount(500);
    } else if (service.id === 'gas') {
      setAccountNumber('LPG-908234');
      setOperator('National Gas Agency');
      setBillAmount(903);
    } else {
      setAccountNumber('PHED-CITY-041');
      setOperator('Municipal Water Board');
      setBillAmount(220);
    }
  };

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalService) return;

    if (billAmount <= 0) {
      setError('Please enter a valid bill amount.');
      return;
    }

    if (wallet.balance < billAmount) {
      setError(`Insufficient wallet balance! Your available balance is ₹${wallet.balance.toLocaleString('en-IN')}, while the bill is ₹${billAmount.toLocaleString('en-IN')}. Please add funds to your wallet.`);
      return;
    }

    onSuccess(billAmount, activeModalService.name, `${operator} (${accountNumber})`);
    soundService.playSuccess();
    setIsDone(true);
  };

  return (
    <div className="fintech-white-card p-4 sm:p-5 space-y-4 text-[#151A2D]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#151A2D] uppercase tracking-wider">
            Bills &amp; Recharge Center
          </h3>
          <p className="text-xs text-[#697086]">
            Bharat BillPay (BBPS) Authorized Instant Gateway
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#20B486]/10 text-[#20B486]">
          0% Convenience Fee
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleOpenService(s)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-[#E6ECFA] bg-white hover:bg-[#F7F9FF] hover:border-[#2447E8]/30 transition-all text-center group cursor-pointer active:scale-95"
            >
              <div className="w-11 h-11 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center group-hover:bg-[#2447E8] group-hover:text-white transition-colors mb-2">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-[#151A2D] group-hover:text-[#2447E8] line-clamp-1">
                {s.name}
              </span>
              <span className="text-[10px] text-[#697086] line-clamp-1 mt-0.5">
                {s.popular}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Payment Modal for Chosen Service */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white border border-[#E6ECFA] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6ECFA] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center">
                  <activeModalService.icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#151A2D]">{activeModalService.name}</h4>
                  <p className="text-[11px] text-[#697086]">BBPS Verified Direct Biller</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="p-1 text-[#9AA2B3] hover:text-[#151A2D] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isDone ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#20B486]/10 text-[#20B486] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>
                <h5 className="text-base font-bold text-[#151A2D]">Bill Paid Successfully!</h5>
                <p className="text-xs text-[#697086]">
                  ₹{billAmount} was paid to <strong className="text-[#151A2D]">{operator}</strong> from your BharatPay wallet.
                </p>
                <div className="p-3 bg-[#F7F9FF] rounded-xl text-xs font-mono text-[#151A2D] border border-[#E6ECFA]">
                  A/c: {accountNumber} • NPCI Instant Ref ID
                </div>
                <button
                  onClick={() => setActiveModalService(null)}
                  className="w-full py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            ) : (
              <form onSubmit={handlePayBill} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 rounded-xl bg-[#E05252]/10 border border-[#E05252]/20 text-[#E05252] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-[#151A2D] block">
                    {activeModalService.id === 'mobile' ? 'Mobile Number (10 Digits)' : 'Customer ID / K-Number / Account Number'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] focus:bg-white focus:outline-none focus:border-[#2447E8] font-mono text-sm font-semibold text-[#151A2D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#151A2D] block">Service Provider / Operator</label>
                  <input 
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] focus:bg-white focus:outline-none focus:border-[#2447E8] text-xs text-[#151A2D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#151A2D] block">Payable Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#697086] text-sm">₹</span>
                    <input 
                      type="number"
                      required
                      min={1}
                      max={50000}
                      value={billAmount}
                      onChange={(e) => setBillAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] focus:bg-white focus:outline-none focus:border-[#2447E8] font-mono text-base font-bold text-[#151A2D]"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#697086] pt-1">
                    <span>Available Wallet Balance:</span>
                    <strong className="text-[#151A2D] font-mono">₹{wallet.balance.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E6ECFA]">
                  <button
                    type="button"
                    onClick={() => setActiveModalService(null)}
                    className="px-4 py-2 rounded-xl border border-[#E6ECFA] text-[#697086] hover:bg-[#F7F9FF] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Pay ₹{billAmount}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
