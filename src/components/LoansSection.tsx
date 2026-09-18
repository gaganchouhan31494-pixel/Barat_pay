import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Coins, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Check, 
  X, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Lock,
  FileCheck
} from 'lucide-react';
import { Loan, Language, UserWallet, MarketRates } from '../types';
import { initialMarketRates } from '../utils/storage';
import { soundService } from '../utils/audio';
import { ThemeConfig } from '../utils/theme';

interface LoansSectionProps {
  wallet: UserWallet;
  loans: Loan[];
  language?: Language;
  onSanctionLoan: (loan: Loan) => void;
  onPayEmi: (loanId: string, emiAmount: number) => boolean;
  theme?: ThemeConfig;
}

export const LoansSection: React.FC<LoansSectionProps> = ({
  wallet,
  loans,
  onSanctionLoan,
  onPayEmi
}) => {
  const [activeTab, setActiveTab] = useState<'GOLD' | 'SILVER' | 'PERSONAL' | 'ACTIVE'>('GOLD');

  // Dynamic Live Market Rates that fluctuate realistically
  const [marketRates, setMarketRates] = useState<MarketRates>(initialMarketRates);
  const [lastRateChange, setLastRateChange] = useState<'up' | 'down'>('up');
  const [tickerFlash, setTickerFlash] = useState(false);

  // Gold Loan Form State
  const [goldWeight, setGoldWeight] = useState<number>(20);
  const [stoneWeight, setStoneWeight] = useState<number>(1.5);
  const [goldPurity, setGoldPurity] = useState<'24K' | '22K' | '18K'>('22K');
  const [goldItemType, setGoldItemType] = useState<string>('Gold Chain & Ring');
  const [goldTenure, setGoldTenure] = useState<number>(12);
  const [hasHallmark, setHasHallmark] = useState<boolean>(true);

  // Silver Loan Form State
  const [silverWeight, setSilverWeight] = useState<number>(650);
  const [silverItemType, setSilverItemType] = useState<string>('Silver Anklets & Utensils');
  const [silverTenure, setSilverTenure] = useState<number>(12);

  // Personal Loan Form State
  const [personalAmount, setPersonalAmount] = useState<number>(75000);
  const [personalTenure, setPersonalTenure] = useState<number>(12);
  const [loanPurpose, setLoanPurpose] = useState<string>('Agriculture & Mandi Input');

  // Interactive Sanction & e-Sign Modal State
  const [sanctionModalLoan, setSanctionModalLoan] = useState<Loan | null>(null);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signedSuccess, setSignedSuccess] = useState<boolean>(false);
  const [aadhaarOtp, setAadhaarOtp] = useState<string>('849201');

  // Feedback states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emiFeedback, setEmiFeedback] = useState<{ id: string; msg: string; isError?: boolean } | null>(null);

  // Dynamic Live Price Fluctuation Simulation (Real-time MCX Gold/Silver updates)
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 16;
      const isUp = delta >= 0;
      setLastRateChange(isUp ? 'up' : 'down');
      setTickerFlash(true);

      setMarketRates(prev => {
        const new24k = Math.max(8500, Math.round(prev.gold24k.rate + delta));
        const new22k = Math.round(new24k * 0.916);
        const new18k = Math.round(new24k * 0.75);
        const silverDelta = (Math.random() - 0.48) * 0.35;
        const newSilver = Number((prev.silver.rate + silverDelta).toFixed(1));

        return {
          gold24k: { ...prev.gold24k, rate: new24k, change24h: prev.gold24k.change24h + (isUp ? 2 : -2) },
          gold22k: { ...prev.gold22k, rate: new22k },
          gold18k: { ...prev.gold18k, rate: new18k },
          silver: { ...prev.silver, rate: newSilver }
        };
      });

      setTimeout(() => setTickerFlash(false), 900);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Gold Calculations
  const netGoldWeight = Math.max(1, Number((goldWeight - stoneWeight).toFixed(1)));
  const currentGoldRatePerGram = goldPurity === '24K' 
    ? marketRates.gold24k.rate 
    : goldPurity === '22K' 
    ? marketRates.gold22k.rate 
    : marketRates.gold18k.rate;

  const goldMarketValue = Math.round(netGoldWeight * currentGoldRatePerGram);
  const goldMaxLoan = Math.round(goldMarketValue * (hasHallmark ? 0.75 : 0.65));
  const goldMonthlyInterestRate = 0.79; // 0.79% per month
  const goldMonthlyEmi = Math.round((goldMaxLoan / goldTenure) + (goldMaxLoan * (goldMonthlyInterestRate / 100)));

  // Silver Calculations
  const silverMarketValue = Math.round(silverWeight * marketRates.silver.rate);
  const silverMaxLoan = Math.round(silverMarketValue * 0.70);
  const silverMonthlyInterestRate = 0.89;
  const silverMonthlyEmi = Math.round((silverMaxLoan / silverTenure) + (silverMaxLoan * (silverMonthlyInterestRate / 100)));

  // Personal Loan Calculations
  const personalInterestRate = 1.05;
  const personalMonthlyEmi = Math.round((personalAmount / personalTenure) + (personalAmount * (personalInterestRate / 100)));

  // Open the Sanction Workflow Modal
  const openSanctionWorkflow = (type: 'GOLD' | 'SILVER' | 'PERSONAL') => {
    soundService.playClick();
    let newLoan: Loan;
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (type === 'GOLD') {
      newLoan = {
        id: `GL-${Date.now().toString().slice(-6)}`,
        loanType: 'GOLD',
        title: `Gold Loan (${netGoldWeight}g ${goldPurity})`,
        principalAmount: goldMaxLoan,
        remainingAmount: goldMaxLoan,
        interestRate: goldMonthlyInterestRate,
        tenureMonths: goldTenure,
        monthlyEmi: goldMonthlyEmi,
        startDate: today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        nextEmiDate: nextMonth.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        collateralDetails: {
          itemType: goldItemType,
          weightGrams: netGoldWeight,
          purity: goldPurity,
          valuationAmount: goldMarketValue,
          hallmarkVerified: hasHallmark
        },
        status: 'ACTIVE'
      };
    } else if (type === 'SILVER') {
      newLoan = {
        id: `SL-${Date.now().toString().slice(-6)}`,
        loanType: 'SILVER',
        title: `Silver Loan (${silverWeight}g)`,
        principalAmount: silverMaxLoan,
        remainingAmount: silverMaxLoan,
        interestRate: silverMonthlyInterestRate,
        tenureMonths: silverTenure,
        monthlyEmi: silverMonthlyEmi,
        startDate: today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        nextEmiDate: nextMonth.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        collateralDetails: {
          itemType: silverItemType,
          weightGrams: silverWeight,
          purity: 'Silver 99.9%',
          valuationAmount: silverMarketValue,
          hallmarkVerified: true
        },
        status: 'ACTIVE'
      };
    } else {
      newLoan = {
        id: `PL-${Date.now().toString().slice(-6)}`,
        loanType: 'PERSONAL',
        title: `Personal & Agri Loan`,
        principalAmount: personalAmount,
        remainingAmount: personalAmount,
        interestRate: personalInterestRate,
        tenureMonths: personalTenure,
        monthlyEmi: personalMonthlyEmi,
        startDate: today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        nextEmiDate: nextMonth.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'ACTIVE'
      };
    }

    setSanctionModalLoan(newLoan);
    setIsSigning(false);
    setSignedSuccess(false);
  };

  // Confirm Disbursal with e-Sign simulation
  const handleConfirmDisbursal = () => {
    if (!sanctionModalLoan) return;
    setIsSigning(true);
    soundService.playClick();

    setTimeout(() => {
      setIsSigning(false);
      setSignedSuccess(true);
      soundService.playSuccess();
      onSanctionLoan(sanctionModalLoan);

      setSuccessMessage(`Congratulations! ₹${sanctionModalLoan.principalAmount.toLocaleString('en-IN')} has been instantly credited to your BharatPay wallet.`);
      setTimeout(() => {
        setSanctionModalLoan(null);
        setActiveTab('ACTIVE');
        setTimeout(() => setSuccessMessage(null), 6000);
      }, 1200);
    }, 1800);
  };

  // Pay monthly EMI using wallet
  const handleEmiPayment = (loan: Loan) => {
    soundService.playClick();
    if (wallet.balance < loan.monthlyEmi) {
      soundService.playError();
      setEmiFeedback({
        id: loan.id,
        msg: 'Insufficient wallet balance. Please add money to your wallet first.',
        isError: true
      });
      setTimeout(() => setEmiFeedback(null), 4000);
      return;
    }

    const success = onPayEmi(loan.id, loan.monthlyEmi);
    if (success) {
      soundService.playSuccess();
      setEmiFeedback({
        id: loan.id,
        msg: `Monthly EMI of ₹${loan.monthlyEmi.toLocaleString('en-IN')} paid successfully from wallet!`,
        isError: false
      });
      setTimeout(() => setEmiFeedback(null), 4000);
    }
  };

  return (
    <div id="loans-section" className="rounded-2xl border border-[#E6ECFA] bg-white shadow-xs p-4 sm:p-6 space-y-5 sm:space-y-6 text-[#151A2D] transition-all">
      {/* Top Banner with Dynamic Live Metal Ticker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6ECFA]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#F4B740]/15 text-[#F4B740] border border-[#F4B740]/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-[#151A2D]">
                <span>BharatPay Gold &amp; Silver Collateral Credit</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/20 font-semibold">
                  Instant Disbursal
                </span>
              </h3>
              <p className="text-xs text-[#697086]">
                Get up to 75% loan against gold &amp; silver ornaments with 0-second wallet credit
              </p>
            </div>
          </div>
        </div>

        {/* Live MCX Market Rates Ticker with Real-Time Blink */}
        <div className={`flex items-center gap-3 p-2.5 px-3.5 rounded-2xl border transition-all duration-300 ${
          tickerFlash
            ? lastRateChange === 'up'
              ? 'border-[#20B486] bg-[#20B486]/10'
              : 'border-[#E05252] bg-[#E05252]/10'
            : 'bg-[#F7F9FF] border-[#E6ECFA]'
        }`}>
          <div>
            <div className="text-[10px] font-bold uppercase flex items-center gap-1 text-[#F4B740]">
              <Flame className="w-3 h-3 animate-pulse text-[#F4B740]" />
              <span>24K Gold</span>
              {lastRateChange === 'up' ? (
                <TrendingUp className="w-3 h-3 text-[#20B486]" />
              ) : (
                <TrendingDown className="w-3 h-3 text-[#E05252]" />
              )}
            </div>
            <div className="font-mono font-black text-xs sm:text-sm text-[#151A2D]">
              ₹{marketRates.gold24k.rate}/g
            </div>
          </div>

          <div className="h-6 w-px bg-[#E6ECFA]" />

          <div>
            <div className="text-[10px] font-bold uppercase flex items-center gap-1 text-[#697086]">
              <span>22K Hallmark</span>
            </div>
            <div className="font-mono font-bold text-xs sm:text-sm text-[#151A2D]">
              ₹{marketRates.gold22k.rate}/g
            </div>
          </div>

          <div className="h-6 w-px bg-[#E6ECFA]" />

          <div>
            <div className="text-[10px] font-bold uppercase text-[#697086]">
              Silver 99.9%
            </div>
            <div className="font-mono font-bold text-xs sm:text-sm text-[#151A2D]">
              ₹{marketRates.silver.rate}/g
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#20B486]/10 border border-[#20B486]/20 text-[#20B486] flex items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-[#20B486]" />
            <div className="text-xs sm:text-sm font-bold">{successMessage}</div>
          </div>
          <button 
            onClick={() => setActiveTab('ACTIVE')}
            className="text-xs px-3 py-1.5 bg-[#20B486] text-white font-bold rounded-lg hover:bg-[#1ca077] transition-colors shrink-0 cursor-pointer"
          >
            View Active Loans &rarr;
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 rounded-xl border bg-[#F7F9FF] border-[#E6ECFA]">
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('GOLD');
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'GOLD'
              ? 'bg-white text-[#2447E8] shadow-xs'
              : 'text-[#697086] hover:text-[#151A2D]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#F4B740]" />
          <span>Gold Loan</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('SILVER');
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'SILVER'
              ? 'bg-white text-[#2447E8] shadow-xs'
              : 'text-[#697086] hover:text-[#151A2D]'
          }`}
        >
          <Coins className="w-4 h-4 text-[#697086]" />
          <span>Silver Loan</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('PERSONAL');
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'PERSONAL'
              ? 'bg-white text-[#2447E8] shadow-xs'
              : 'text-[#697086] hover:text-[#151A2D]'
          }`}
        >
          <Banknote className="w-4 h-4 text-[#2447E8]" />
          <span>Personal Loan</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('ACTIVE');
          }}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'ACTIVE'
              ? 'bg-white text-[#2447E8] shadow-xs'
              : 'text-[#697086] hover:text-[#151A2D]'
          }`}
        >
          <Lock className="w-4 h-4 text-[#20B486]" />
          <span>Active Loans ({loans.length})</span>
        </button>
      </div>

      {/* TAB 1: GOLD LOAN CALCULATOR & APPLICATION */}
      {activeTab === 'GOLD' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-[#EEF3FF] border border-[#2447E8]/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#2447E8] shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-[#151A2D]">
                Gold Collateral Loan: 0.79% Monthly Interest • 75% LTV Disbursal
              </div>
              <div className="text-xs text-[#697086] mt-0.5">
                Eligible under credit score 785. Zero processing fees with immediate wallet settlement.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              {/* Gross Weight Range Slider */}
              <div className="space-y-2 p-4 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#697086]">
                    Total Gold Weight (Gross):
                  </label>
                  <span className="text-base font-bold text-[#151A2D] font-mono">
                    {goldWeight} grams
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="0.5"
                  value={goldWeight}
                  onChange={(e) => setGoldWeight(Number(e.target.value))}
                  className="w-full accent-[#2447E8] cursor-pointer h-2 bg-[#E6ECFA] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-[#9AA2B3] font-mono">
                  <span>5g (Min)</span>
                  <span>30g</span>
                  <span>60g</span>
                  <span>120g (Max)</span>
                </div>
              </div>

              {/* Stone/Beads deduction & Net Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] space-y-1">
                  <label className="text-xs text-[#697086] font-semibold">Stone Weight:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={goldWeight - 1}
                      value={stoneWeight}
                      onChange={(e) => setStoneWeight(Math.max(0, Number(e.target.value)))}
                      className="w-full p-2 bg-white border border-[#E6ECFA] rounded-lg text-xs font-mono font-bold text-[#151A2D] focus:border-[#2447E8] focus:outline-none"
                    />
                    <span className="text-xs text-[#697086]">g</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] space-y-1">
                  <label className="text-xs text-[#697086] font-semibold">Net Gold Weight:</label>
                  <div className="text-base font-black text-[#20B486] font-mono pt-1">
                    {netGoldWeight} grams
                  </div>
                </div>
              </div>

              {/* Purity selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#697086]">
                  Gold Purity Standard:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['24K', '22K', '18K'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setGoldPurity(p);
                      }}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        goldPurity === p
                          ? 'bg-[#2447E8] border-[#2447E8] text-white shadow-xs'
                          : 'bg-[#F7F9FF] border-[#E6ECFA] text-[#697086] hover:bg-[#EEF3FF]'
                      }`}
                    >
                      {p} Gold
                    </button>
                  ))}
                </div>
              </div>

              {/* Ornament Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#697086]">
                  Ornament Category:
                </label>
                <select
                  value={goldItemType}
                  onChange={(e) => setGoldItemType(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E6ECFA] rounded-xl text-xs sm:text-sm text-[#151A2D] focus:outline-none focus:border-[#2447E8]"
                >
                  <option value="Gold Chain & Ring">Gold Chain &amp; Ring</option>
                  <option value="Gold Bangles">Gold Bangles &amp; Kadas</option>
                  <option value="Gold Necklace">Gold Necklace &amp; Choker</option>
                  <option value="Gold Mangalsutra">Traditional Gold Mangalsutra</option>
                  <option value="Gold Coins / Bars">Gold Coins &amp; Bars (24K/22K)</option>
                </select>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA]">
                  <div className="flex items-center gap-2 text-xs text-[#151A2D]">
                    <ShieldCheck className="w-4 h-4 text-[#20B486]" />
                    <span>BIS 916 Hallmarked Jewellery (Up to 75% LTV)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasHallmark}
                    onChange={(e) => setHasHallmark(e.target.checked)}
                    className="w-4 h-4 accent-[#2447E8] cursor-pointer"
                  />
                </div>
              </div>

              {/* Tenure Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#697086]">
                  Tenure Duration:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 24, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setGoldTenure(m);
                      }}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        goldTenure === m
                          ? 'bg-[#2447E8] border-[#2447E8] text-white shadow-xs'
                          : 'bg-[#F7F9FF] border-[#E6ECFA] text-[#697086] hover:bg-[#EEF3FF]'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Sanction Summary Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-[#F7F9FF] border border-[#2447E8]/30 shadow-xs space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E6ECFA]">
                  <span className="text-xs font-bold text-[#2447E8] uppercase tracking-wider">
                    Sanction Summary
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#20B486]/10 text-[#20B486] font-bold border border-[#20B486]/20">
                    PRE-APPROVED
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="flex justify-between text-xs text-[#697086]">
                    <span>Current Market Value:</span>
                    <span className="font-mono font-bold text-[#151A2D]">
                      ₹{goldMarketValue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-[#697086]">
                    <span>Approved Loan (75% LTV):</span>
                    <span className="font-mono font-extrabold text-[#2447E8] text-lg">
                      ₹{goldMaxLoan.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-[#697086]">
                    <span>Monthly Interest Rate:</span>
                    <span className="font-semibold text-[#20B486]">
                      0.79% per month
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-[#697086]">
                    <span>Estimated Monthly EMI:</span>
                    <span className="font-mono font-bold text-[#151A2D]">
                      ₹{goldMonthlyEmi.toLocaleString('en-IN')}/mo
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#E6ECFA] text-[11px] text-[#697086] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#151A2D] font-semibold">
                      <Lock className="w-3.5 h-3.5 text-[#2447E8]" />
                      <span>Security: Insured Bank Vault Locker</span>
                    </div>
                    <div>Ornaments remain 100% insured in tamper-evident safety vaults.</div>
                  </div>
                </div>
              </div>

              {/* Sanction CTA Button */}
              <button
                type="button"
                onClick={() => openSanctionWorkflow('GOLD')}
                className="w-full py-3.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Disburse ₹{goldMaxLoan.toLocaleString('en-IN')} to Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SILVER LOAN */}
      {activeTab === 'SILVER' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-[#EEF3FF] border border-[#2447E8]/20 flex items-start gap-3">
            <Coins className="w-5 h-5 text-[#2447E8] shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-[#151A2D]">
                Silver Collateral Loan: 70% LTV Instant Cash
              </div>
              <div className="text-xs text-[#697086] mt-0.5">
                Live silver market rate at ₹{marketRates.silver.rate}/g. Immediate disbursement into your wallet.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2 p-4 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#697086]">
                    Silver Weight:
                  </label>
                  <span className="text-base font-bold text-[#151A2D] font-mono">
                    {silverWeight} grams ({Number((silverWeight / 1000).toFixed(2))} kg)
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={silverWeight}
                  onChange={(e) => setSilverWeight(Number(e.target.value))}
                  className="w-full accent-[#2447E8] cursor-pointer h-2 bg-[#E6ECFA] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-[#9AA2B3] font-mono">
                  <span>100g</span>
                  <span>1,000g (1 Kg)</span>
                  <span>2,000g</span>
                  <span>3,000g</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#697086]">
                  Silver Article Type:
                </label>
                <select
                  value={silverItemType}
                  onChange={(e) => setSilverItemType(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E6ECFA] rounded-xl text-xs sm:text-sm text-[#151A2D] focus:outline-none focus:border-[#2447E8]"
                >
                  <option value="Silver Anklets & Utensils">Silver Anklets &amp; Utensils</option>
                  <option value="Silver Pooja Thali & Idol">Pooja Thali, Kalash &amp; Idols</option>
                  <option value="Silver Coins & Bars">Silver Coins &amp; Bullion Bars</option>
                  <option value="Silver Ornaments">Silver Bangles &amp; Traditional Ornaments</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#697086]">
                  Tenure:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 18, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setSilverTenure(m);
                      }}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        silverTenure === m
                          ? 'bg-[#2447E8] text-white border-[#2447E8]'
                          : 'bg-[#F7F9FF] border-[#E6ECFA] text-[#697086]'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#F7F9FF] border border-[#E6ECFA] flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-[#697086] uppercase tracking-wider pb-3 border-b border-[#E6ECFA]">
                  Silver Sanction Summary
                </div>
                <div className="py-4 space-y-3 text-xs text-[#697086]">
                  <div className="flex justify-between">
                    <span>Silver Market Value:</span>
                    <span className="font-mono font-bold text-[#151A2D]">₹{silverMarketValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved Loan (70% LTV):</span>
                    <span className="font-mono font-extrabold text-[#2447E8] text-lg">
                      ₹{silverMaxLoan.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Interest:</span>
                    <span className="font-semibold text-[#20B486]">0.89%/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly EMI:</span>
                    <span className="font-mono font-bold text-[#151A2D]">₹{silverMonthlyEmi.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openSanctionWorkflow('SILVER')}
                className="w-full py-3.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <span>Disburse ₹{silverMaxLoan.toLocaleString('en-IN')} to Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERSONAL / MANDI LOAN */}
      {activeTab === 'PERSONAL' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-[#EEF3FF] border border-[#2447E8]/20 flex items-start gap-3">
            <Banknote className="w-5 h-5 text-[#2447E8] shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-[#151A2D]">
                Pre-Approved Instant Personal Loan
              </div>
              <div className="text-xs text-[#697086] mt-0.5">
                Instant credit up to ₹3,00,000 based on your high credit rating (785) with zero processing fees.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2 p-4 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#697086]">Select Loan Amount:</label>
                  <span className="text-xl font-black font-mono text-[#2447E8]">
                    ₹{personalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="300000"
                  step="5000"
                  value={personalAmount}
                  onChange={(e) => setPersonalAmount(Number(e.target.value))}
                  className="w-full accent-[#2447E8] cursor-pointer h-2 bg-[#E6ECFA] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-[#9AA2B3] font-mono">
                  <span>₹25,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                  <span>₹3,00,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#697086]">Purpose of Loan:</label>
                <select
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E6ECFA] rounded-xl text-xs sm:text-sm text-[#151A2D] focus:outline-none focus:border-[#2447E8]"
                >
                  <option value="Agriculture & Mandi Input">Agriculture, Fertilizer &amp; Mandi Input</option>
                  <option value="Equipment & Repair">Tractor &amp; Farm Machinery Maintenance</option>
                  <option value="Business Inventory">Shop / Trade Working Capital</option>
                  <option value="Personal / Medical">Family &amp; Health Emergency</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#697086]">Tenure (Months):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[6, 12, 18, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setPersonalTenure(m);
                      }}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        personalTenure === m
                          ? 'bg-[#2447E8] border-[#2447E8] text-white'
                          : 'bg-[#F7F9FF] border-[#E6ECFA] text-[#697086]'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#F7F9FF] border border-[#E6ECFA] flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-[#697086] uppercase tracking-wider pb-3 border-b border-[#E6ECFA]">
                  Personal Loan Summary
                </div>
                <div className="py-4 space-y-3 text-xs text-[#697086]">
                  <div className="flex justify-between">
                    <span>Principal Amount:</span>
                    <span className="font-mono font-extrabold text-[#2447E8] text-lg">
                      ₹{personalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Interest:</span>
                    <span className="font-semibold text-[#20B486]">1.05%/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Installment (EMI):</span>
                    <span className="font-mono font-bold text-[#151A2D]">₹{personalMonthlyEmi.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span className="text-[#20B486] font-bold">₹0 (Waived)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openSanctionWorkflow('PERSONAL')}
                className="w-full py-3.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <span>Disburse ₹{personalAmount.toLocaleString('en-IN')} to Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVE LOANS & REPAY EMI */}
      {activeTab === 'ACTIVE' && (
        <div className="space-y-4 animate-fade-in">
          {emiFeedback && (
            <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              emiFeedback.isError 
                ? 'bg-[#E05252]/10 border-[#E05252]/30 text-[#E05252]' 
                : 'bg-[#20B486]/10 border-[#20B486]/30 text-[#20B486]'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{emiFeedback.msg}</span>
            </div>
          )}

          {loans.length === 0 ? (
            <div className="text-center py-12 text-[#9AA2B3] space-y-3">
              <Coins className="w-12 h-12 mx-auto text-[#697086]" />
              <p className="text-sm font-medium text-[#697086]">No active loans currently.</p>
              <button
                onClick={() => setActiveTab('GOLD')}
                className="px-4 py-2 rounded-xl bg-[#2447E8] text-white font-bold text-xs cursor-pointer hover:bg-[#1738C8] transition-colors"
              >
                Apply for Gold Loan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {(loans || []).map((loan) => {
                if (!loan) return null;
                const loanTitle = loan.title || 'Collateral Credit';
                return (
                <div 
                  key={loan.id || Math.random()}
                  className="p-4 rounded-xl bg-white border border-[#E6ECFA] space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {loan.loanType === 'GOLD' ? '🥇' : loan.loanType === 'SILVER' ? '🥈' : '💵'}
                        </span>
                        <h4 className="text-sm font-bold text-[#151A2D]">{loanTitle}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          loan.status === 'ACTIVE' 
                            ? 'bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/20' 
                            : 'bg-[#F7F9FF] text-[#697086]'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#697086] font-mono mt-0.5">
                        Account: {loan.id} • Rate: {loan.interestRate}%/mo
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-[#697086]">Remaining Principal</div>
                      <div className="text-base font-black text-[#2447E8] font-mono">
                        ₹{loan.remainingAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {loan.collateralDetails && (
                    <div className="p-2.5 rounded-lg bg-[#F7F9FF] border border-[#E6ECFA] text-[11px] text-[#697086] flex items-center justify-between">
                      <span>Collateral: {loan.collateralDetails.itemType} ({loan.collateralDetails.weightGrams}g)</span>
                      <span className="text-[#20B486] font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Secure Vault #8492
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#E6ECFA]">
                    <div className="text-xs text-[#697086]">
                      Monthly EMI: <strong className="text-[#151A2D] font-mono">₹{loan.monthlyEmi.toLocaleString('en-IN')}</strong>
                      <span className="text-[10px] text-[#2447E8] ml-2">(Due: {loan.nextEmiDate})</span>
                    </div>

                    {loan.status === 'ACTIVE' && (
                      <button
                        type="button"
                        onClick={() => handleEmiPayment(loan)}
                        className="px-4 py-1.5 rounded-lg bg-[#20B486] hover:bg-[#1ca077] active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Pay EMI (₹{loan.monthlyEmi})
                      </button>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* INTERACTIVE SANCTION LETTER & E-SIGN MODAL */}
      {sanctionModalLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E6ECFA] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#151A2D]">
            {/* Sanction Header */}
            <div className="p-4 border-b border-[#E6ECFA] bg-[#F7F9FF] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#151A2D]">Digital Loan Sanction Letter</h3>
                  <p className="text-[10px] text-[#697086]">Fintech Credit Agreement #BP-2026-8491</p>
                </div>
              </div>
              <button
                onClick={() => setSanctionModalLoan(null)}
                className="p-1 rounded-full text-[#9AA2B3] hover:text-[#151A2D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Sanction Letter Paper Layout */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E6ECFA] pb-2">
                  <div className="font-bold text-[#2447E8] text-sm">BHARATPAY DIGITAL CREDIT</div>
                  <div className="text-[10px] text-[#697086] font-mono">Date: {new Date().toLocaleDateString('en-IN')}</div>
                </div>

                <div className="space-y-1.5 text-[#697086]">
                  <div className="flex justify-between">
                    <span>Borrower:</span>
                    <strong className="text-[#151A2D]">{wallet.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Branch:</span>
                    <span>{wallet.village}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UIDAI Reference:</span>
                    <span className="font-mono">{wallet.aadhaarNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAN Number:</span>
                    <span className="font-mono">{wallet.panNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sanctioned Principal:</span>
                    <strong className="text-[#20B486] font-mono text-sm">
                      ₹{sanctionModalLoan.principalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Interest Rate:</span>
                    <span className="text-[#2447E8] font-semibold">{sanctionModalLoan.interestRate}% per month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination Account:</span>
                    <span className="text-[#151A2D] font-semibold">BharatPay Digital Wallet</span>
                  </div>
                </div>
              </div>

              {/* OTP & e-Sign Section */}
              <div className="p-4 rounded-xl bg-[#EEF3FF] border border-[#2447E8]/20 space-y-3">
                <div className="text-xs font-bold text-[#2447E8] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#20B486]" />
                  <span>Instant e-Sign Authentication</span>
                </div>
                <p className="text-[11px] text-[#697086]">
                  A 6-digit one-time passcode has been sent to your registered mobile (••••••3210).
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value)}
                    className="p-2.5 bg-white border border-[#E6ECFA] rounded-xl font-mono text-center text-sm font-bold text-[#151A2D] tracking-widest w-36 focus:border-[#2447E8] focus:outline-none"
                    placeholder="849201"
                  />
                  <div className="text-[11px] text-[#20B486] font-semibold">
                    ✓ OTP Verified (Auto-Filled)
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#E6ECFA] text-[11px] text-[#697086] italic">
                  "I, {wallet.name}, agree to all terms and conditions of this digital credit agreement."
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-[#E6ECFA] bg-[#F7F9FF] flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSanctionModalLoan(null)}
                disabled={isSigning}
                className="py-2.5 px-4 rounded-xl border border-[#E6ECFA] bg-white hover:bg-[#EEF3FF] text-[#697086] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDisbursal}
                disabled={isSigning}
                className="flex-1 py-3 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {isSigning ? (
                  <span>Signing Agreement...</span>
                ) : signedSuccess ? (
                  <span>Success! Disbursed to Wallet ✓</span>
                ) : (
                  <>
                    <span>e-Sign &amp; Receive Funds Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
