import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Coins, 
  Banknote, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  Flame, 
  Award, 
  Download, 
  FileText, 
  FileCheck,
  Check,
  X,
  Camera,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Building,
  Lock
} from 'lucide-react';
import { Loan, Language, UserWallet, MarketRates } from '../types';
import { initialMarketRates } from '../utils/storage';
import { soundService } from '../utils/audio';
import { ThemeConfig } from '../utils/theme';

interface LoansSectionProps {
  wallet: UserWallet;
  loans: Loan[];
  language: Language;
  onSanctionLoan: (loan: Loan) => void;
  onPayEmi: (loanId: string, emiAmount: number) => boolean;
  theme?: ThemeConfig;
}

export const LoansSection: React.FC<LoansSectionProps> = ({
  wallet,
  loans,
  language,
  onSanctionLoan,
  onPayEmi,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'GOLD' | 'SILVER' | 'PERSONAL' | 'ACTIVE'>('GOLD');

  // Dynamic Live Market Rates that fluctuate realistically
  const [marketRates, setMarketRates] = useState<MarketRates>(initialMarketRates);
  const [lastRateChange, setLastRateChange] = useState<'up' | 'down'>('up');
  const [tickerFlash, setTickerFlash] = useState(false);

  // Gold Loan Form State
  const [goldWeight, setGoldWeight] = useState<number>(20); // total weight in grams
  const [stoneWeight, setStoneWeight] = useState<number>(1.5); // stone/bead weight
  const [goldPurity, setGoldPurity] = useState<'24K' | '22K' | '18K'>('22K');
  const [goldItemType, setGoldItemType] = useState<string>('Gold Chain & Ring (चेन व अंगूठी)');
  const [goldTenure, setGoldTenure] = useState<number>(12); // months
  const [hasHallmark, setHasHallmark] = useState<boolean>(true);

  // Silver Loan Form State
  const [silverWeight, setSilverWeight] = useState<number>(650); // grams
  const [silverItemType, setSilverItemType] = useState<string>('Silver Anklets & Utensils (पायल व बर्तन)');
  const [silverTenure, setSilverTenure] = useState<number>(12);

  // Personal Loan Form State
  const [personalAmount, setPersonalAmount] = useState<number>(75000);
  const [personalTenure, setPersonalTenure] = useState<number>(12);
  const [loanPurpose, setLoanPurpose] = useState<string>('Agriculture & Mandi Crop Input (खेती व बीज)');

  // Interactive Sanction & e-Sign Modal State
  const [sanctionModalLoan, setSanctionModalLoan] = useState<Loan | null>(null);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signedSuccess, setSignedSuccess] = useState<boolean>(false);
  const [aadhaarOtp, setAadhaarOtp] = useState<string>('849201');
  const [otpSent, setOtpSent] = useState<boolean>(false);

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
  const goldMaxLoan = Math.round(goldMarketValue * (hasHallmark ? 0.75 : 0.68)); // 75% LTV for BIS Hallmark
  const goldInterestRate = 0.79; // % per month
  const goldMonthlyEmi = Math.round((goldMaxLoan / goldTenure) + (goldMaxLoan * (goldInterestRate / 100)));

  // Silver Calculations
  const silverMarketValue = Math.round(silverWeight * marketRates.silver.rate);
  const silverMaxLoan = Math.round(silverMarketValue * 0.70);
  const silverInterestRate = 0.89; // % per month
  const silverMonthlyEmi = Math.round((silverMaxLoan / silverTenure) + (silverMaxLoan * (silverInterestRate / 100)));

  // Personal Loan Calculations
  const personalInterestRate = 1.05; // % per month
  const personalMonthlyEmi = Math.round((personalAmount / personalTenure) + (personalAmount * (personalInterestRate / 100)));

  // Prepare Sanction Workflow
  const openSanctionWorkflow = (type: 'GOLD' | 'SILVER' | 'PERSONAL') => {
    soundService.playClick();
    let preparedLoan: Loan;

    if (type === 'GOLD') {
      preparedLoan = {
        id: `LN-GL-${Math.floor(1000 + Math.random() * 9000)}`,
        loanType: 'GOLD',
        title: `Gold Loan (${netGoldWeight}g ${goldPurity} Hallmark)`,
        principalAmount: goldMaxLoan,
        remainingAmount: goldMaxLoan,
        interestRate: goldInterestRate,
        tenureMonths: goldTenure,
        monthlyEmi: goldMonthlyEmi,
        collateralDetails: {
          weightGrams: netGoldWeight,
          purity: `${goldPurity} (916 BIS Hallmark)`,
          itemType: goldItemType,
          valuationAmount: goldMarketValue,
          hallmarkVerified: hasHallmark
        },
        startDate: 'Today',
        nextEmiDate: 'Next Month (17th)',
        status: 'ACTIVE'
      };
    } else if (type === 'SILVER') {
      preparedLoan = {
        id: `LN-SL-${Math.floor(1000 + Math.random() * 9000)}`,
        loanType: 'SILVER',
        title: `Silver Loan (${silverWeight}g)`,
        principalAmount: silverMaxLoan,
        remainingAmount: silverMaxLoan,
        interestRate: silverInterestRate,
        tenureMonths: silverTenure,
        monthlyEmi: silverMonthlyEmi,
        collateralDetails: {
          weightGrams: silverWeight,
          itemType: silverItemType,
          valuationAmount: silverMarketValue
        },
        startDate: 'Today',
        nextEmiDate: 'Next Month (17th)',
        status: 'ACTIVE'
      };
    } else {
      preparedLoan = {
        id: `LN-PL-${Math.floor(1000 + Math.random() * 9000)}`,
        loanType: 'PERSONAL',
        title: `Kisan & Mandi Personal Loan`,
        principalAmount: personalAmount,
        remainingAmount: personalAmount,
        interestRate: personalInterestRate,
        tenureMonths: personalTenure,
        monthlyEmi: personalMonthlyEmi,
        startDate: 'Today',
        nextEmiDate: 'Next Month (17th)',
        status: 'ACTIVE'
      };
    }

    setSanctionModalLoan(preparedLoan);
    setSignedSuccess(false);
    setIsSigning(false);
    setOtpSent(false);
  };

  // Complete e-Sign & Disbursal to Wallet
  const handleConfirmDisbursal = () => {
    if (!sanctionModalLoan) return;

    soundService.playClick();
    setIsSigning(true);

    setTimeout(() => {
      setIsSigning(false);
      setSignedSuccess(true);
      
      // Perform Actual Disbursal
      onSanctionLoan(sanctionModalLoan);

      // Soundbox Voice announcement + Confetti!
      soundService.announcePayment(sanctionModalLoan.principalAmount, 'LOAN', language);

      setTimeout(() => {
        setSanctionModalLoan(null);
        setSuccessMessage(`बधाई गगन जी! ₹${sanctionModalLoan.principalAmount.toLocaleString('en-IN')} का लोन आपके भारत पे वॉलेट में तुरंत जुड़ गया है!`);
        setActiveTab('ACTIVE');
        setTimeout(() => setSuccessMessage(null), 6000);
      }, 1500);
    }, 1600);
  };

  // Repay EMI Handler
  const handleEmiPayment = (loan: Loan) => {
    soundService.playClick();
    if (wallet.balance < loan.monthlyEmi) {
      soundService.playError();
      setEmiFeedback({
        id: loan.id,
        msg: 'वॉलेट में बैलेंस कम है! कृपया पहले "पैसे लोड करें (+ Add)" से वॉलेट रिचार्ज करें।',
        isError: true
      });
      setTimeout(() => setEmiFeedback(null), 4000);
      return;
    }

    const success = onPayEmi(loan.id, loan.monthlyEmi);
    if (success) {
      soundService.announcePayment(loan.monthlyEmi, 'SEND', language);
      setEmiFeedback({
        id: loan.id,
        msg: `₹${loan.monthlyEmi.toLocaleString('en-IN')} की किश्त (EMI) वॉलेट से सफलतापूर्वक भर दी गई!`
      });
      setTimeout(() => setEmiFeedback(null), 4000);
    }
  };

  return (
    <div id="loans-section" className="fintech-white-card p-4 sm:p-6 space-y-5 sm:space-y-6 text-[#151A2D] transition-all">
      {/* Top Banner with Dynamic Live Metal Ticker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6ECFA]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#F4B740]/20 text-[#F4B740] border border-[#F4B740]/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-[#151A2D]">
                <span>BharatPay Gold &amp; Silver Loans</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#20B486]/10 text-[#20B486] border border-[#20B486]/20 font-semibold">
                  RBI Regulated
                </span>
              </h3>
              <p className="text-xs text-[#697086]">
                सोने-चांदी के गहनों पर तुरंत 75% तक कर्ज • सीधा वॉलेट में 0 सेकंड ट्रांसफर
              </p>
            </div>
          </div>
        </div>

        {/* Live MCX Market Rates Ticker with Real-Time Blink */}
        <div className={`flex items-center gap-3 p-2.5 px-3.5 rounded-2xl border transition-all duration-300 ${
          theme?.isLight
            ? tickerFlash
              ? lastRateChange === 'up'
                ? 'border-emerald-500 shadow-md bg-emerald-50 text-slate-800'
                : 'border-rose-500 shadow-md bg-rose-50 text-slate-800'
              : 'bg-slate-50 border-slate-200 text-slate-800'
            : tickerFlash 
              ? lastRateChange === 'up' 
                ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-emerald-950/30' 
                : 'border-rose-500 shadow-lg shadow-rose-500/20 bg-rose-950/30'
              : 'bg-slate-950 border-slate-800 text-white'
        }`}>
          <div>
            <div className={`text-[10px] font-bold uppercase flex items-center gap-1 ${theme?.isLight ? 'text-amber-700' : 'text-amber-400'}`}>
              <Flame className={`w-3 h-3 animate-pulse ${theme?.isLight ? 'text-amber-600' : 'text-amber-400'}`} />
              <span>24K Gold</span>
              {lastRateChange === 'up' ? (
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-500" />
              )}
            </div>
            <div className={`font-mono font-black text-xs sm:text-sm ${theme?.isLight ? 'text-slate-900' : 'text-white'}`}>
              ₹{marketRates.gold24k.rate}/g
            </div>
          </div>

          <div className={`h-6 w-px ${theme?.isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          <div>
            <div className={`text-[10px] font-bold uppercase flex items-center gap-1 ${theme?.isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              <span>22K Hallmark</span>
            </div>
            <div className={`font-mono font-bold text-xs sm:text-sm ${theme?.isLight ? 'text-amber-700' : 'text-amber-300'}`}>
              ₹{marketRates.gold22k.rate}/g
            </div>
          </div>

          <div className={`h-6 w-px ${theme?.isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

          <div>
            <div className={`text-[10px] font-bold uppercase ${theme?.isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Silver (चांदी)
            </div>
            <div className={`font-mono font-bold text-xs sm:text-sm ${theme?.isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              ₹{marketRates.silver.rate}/g
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400 animate-bounce" />
            <div className="text-xs sm:text-sm font-bold">{successMessage}</div>
          </div>
          <button 
            onClick={() => setActiveTab('ACTIVE')}
            className="text-xs px-3 py-1.5 bg-emerald-500 text-slate-950 font-black rounded-xl hover:bg-emerald-400 transition-colors shrink-0"
          >
            पासबुक देखें &rarr;
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
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'GOLD'
              ? 'bg-[#2447E8] text-white shadow-xs'
              : 'text-[#697086] hover:text-[#151A2D] hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>गोल्ड लोन (Gold)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('SILVER');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'SILVER'
              ? 'bg-[#2447E8] text-white shadow-xs'
              : 'text-[#697086] hover:text-[#151A2D] hover:bg-white/60'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>सिल्वर लोन (Silver)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('PERSONAL');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'PERSONAL'
              ? 'bg-[#2447E8] text-white shadow-xs'
              : 'text-[#697086] hover:text-[#151A2D] hover:bg-white/60'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>किसान पर्सनल लोन</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setActiveTab('ACTIVE');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'ACTIVE'
              ? 'bg-[#2447E8] text-white shadow-xs'
              : 'text-[#697086] hover:text-[#151A2D] hover:bg-white/60'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>सक्रिय लोन ({loans.length})</span>
        </button>
      </div>

      {/* TAB 1: GOLD LOAN CALCULATOR & DISBURSAL */}
      {activeTab === 'GOLD' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-amber-300">
                सोना लोन विशेष योजना: 0.79% मासिक ब्याज • 75% LTV अप्रूवल
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                गगन चौहान जी (6MLD घड़साना), आपके CIBIL स्कोर (785) के आधार पर शून्य प्रोसेसिंग फीस पर तुरंत वॉलेट में पैसे मिलेंगे।
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Inputs */}
            <div className="lg:col-span-7 space-y-4">
              {/* Total Weight Slider */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    कुल सोने का वजन (Gross Gold Weight):
                  </label>
                  <span className="text-base font-black text-amber-400 font-mono">
                    {goldWeight} ग्राम (g)
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={goldWeight}
                  onChange={(e) => setGoldWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>5g (कम से कम)</span>
                  <span>30g</span>
                  <span>60g</span>
                  <span>120g (अधिकतम)</span>
                </div>
              </div>

              {/* Stone/Bead Weight Deduction */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">नग/मोती वजन (Stones):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={stoneWeight}
                      onChange={(e) => setStoneWeight(Number(e.target.value))}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono font-bold text-white focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">g</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">शुद्ध सोना वजन (Net Weight):</label>
                  <div className="text-lg font-black font-mono text-emerald-400 pt-1">
                    {netGoldWeight} ग्राम
                  </div>
                </div>
              </div>

              {/* Purity Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  सोने की शुद्धता (Purity):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { purity: '24K', title: '24K (99.9%)', rate: marketRates.gold24k.rate },
                    { purity: '22K', title: '22K (91.6% BIS)', rate: marketRates.gold22k.rate },
                    { purity: '18K', title: '18K (75.0%)', rate: marketRates.gold18k.rate }
                  ].map((p) => (
                    <button
                      key={p.purity}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setGoldPurity(p.purity as '24K' | '22K' | '18K');
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        goldPurity === p.purity
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.title}</div>
                      <div className="text-[11px] font-mono mt-1 text-slate-300">₹{p.rate}/g</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ornament Description & BIS Hallmark toggle */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  आभूषण विवरण (Ornaments):
                </label>
                <select
                  value={goldItemType}
                  onChange={(e) => setGoldItemType(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Gold Chain & Ring (चेन व अंगूठी)">सोने की चेन और अंगूठी (Chain & Ring)</option>
                  <option value="Gold Bangles (कंगन / चूड़ी)">सोने के कंगन व चूड़ियां (Bangles)</option>
                  <option value="Gold Necklace (गले का हार)">गले का कंठी / हार (Necklace)</option>
                  <option value="Gold Mangalsutra (मंगलसूत्र)">पारंपरिक मंगलसूत्र (Mangalsutra)</option>
                  <option value="Gold Coins / Bars (सिक्के)">सोने के सिक्के / बिस्कुट (Coins / Bars)</option>
                </select>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>BIS 916 हॉलमार्क प्रमाणित जेवर (अधिकतम 75% लोन)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasHallmark}
                    onChange={(e) => setHasHallmark(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Tenure Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  लोन अवधि (Tenure Months):
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
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {m} माह
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Sanction Summary Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    मूल्यांकन व स्वीकृति पत्र
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    PRE-APPROVED
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>बाजार मूल्य (Market Value):</span>
                    <span className="font-mono font-bold text-white">
                      ₹{goldMarketValue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-300">
                    <span>मंजूर लोन राशि (75% LTV):</span>
                    <span className="font-mono font-extrabold text-amber-400 text-lg">
                      ₹{goldMaxLoan.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-300">
                    <span>मासिक ब्याज दर:</span>
                    <span className="font-semibold text-emerald-400">
                      0.79% प्रति माह
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-300">
                    <span>अनुमानित मासिक EMI:</span>
                    <span className="font-mono font-bold text-white">
                      ₹{goldMonthlyEmi.toLocaleString('en-IN')}/माह
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>गोल्ड सुरक्षा: SBI घड़साना लॉकर तिजोरी</span>
                    </div>
                    <div>आभूषण 100% बीमाकृत सुरक्षित लॉकर में रखे जाएंगे।</div>
                  </div>
                </div>
              </div>

              {/* Sanction CTA Button */}
              <button
                type="button"
                onClick={() => openSanctionWorkflow('GOLD')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>₹{goldMaxLoan.toLocaleString('en-IN')} वॉलेट में ट्रांसफर करें</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SILVER LOAN */}
      {activeTab === 'SILVER' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-start gap-3">
            <Coins className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-200">
                चांदी लोन: पायल, थाली, सिक्के या बर्तनों पर तुरंत 70% लोन
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                चांदी की लाइव बाजार दर ₹{marketRates.silver.rate}/ग्राम के हिसाब से तुरंत नकदी आपके भारत पे वॉलेट में।
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    चांदी का वजन (Silver Weight):
                  </label>
                  <span className="text-base font-bold text-slate-200 font-mono">
                    {silverWeight} ग्राम ({Number((silverWeight / 1000).toFixed(2))} कि.ग्रा.)
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={silverWeight}
                  onChange={(e) => setSilverWeight(Number(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>100g</span>
                  <span>1,000g (1 Kg)</span>
                  <span>2,000g</span>
                  <span>3,000g</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  चांदी वस्तु प्रकार (Silver Item Type):
                </label>
                <select
                  value={silverItemType}
                  onChange={(e) => setSilverItemType(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-200 focus:outline-none"
                >
                  <option value="Silver Anklets & Utensils (पायल व बर्तन)">चांदी की पायल व बर्तन (Anklets &amp; Utensils)</option>
                  <option value="Silver Pooja Thali & Idol (पूजा थाली व मूर्ति)">पूजा थाली, कलश व मूर्ति (Pooja Items)</option>
                  <option value="Silver Coins & Bars (सिक्के)">चांदी के सिक्के व सिल्ली (Coins &amp; Bars)</option>
                  <option value="Silver Ornaments (कड़े व जेवर)">चांदी के कड़े व पारंपरिक जेवर (Ornaments)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  लोन अवधि (Tenure):
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
                          ? 'bg-slate-300 text-slate-950 font-black'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      {m} माह
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800">
                  सिल्वर लोन स्वीकृति सारांश
                </div>
                <div className="py-4 space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>चांदी बाजार मूल्य:</span>
                    <span className="font-mono font-bold text-white">₹{silverMarketValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>स्वीकृत लोन (70% LTV):</span>
                    <span className="font-mono font-extrabold text-slate-200 text-lg">
                      ₹{silverMaxLoan.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>मासिक ब्याज दर:</span>
                    <span className="font-semibold text-emerald-400">0.89%/माह</span>
                  </div>
                  <div className="flex justify-between">
                    <span>मासिक EMI:</span>
                    <span className="font-mono font-bold text-white">₹{silverMonthlyEmi.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openSanctionWorkflow('SILVER')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-400 hover:from-white hover:to-slate-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                <span>₹{silverMaxLoan.toLocaleString('en-IN')} चांदी लोन प्राप्त करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERSONAL / MANDI LOAN */}
      {activeTab === 'PERSONAL' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
            <Banknote className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-indigo-300">
                घड़साना किसान व मंडी पर्सनल लोन (बिना किसी गारंटी के)
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                CIBIL 785 व आधार प्रमाणीकरण पर ₹50,000 से ₹3,00,000 तक तुरंत स्वीकृत।
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">लोन राशि चुनें:</label>
                  <span className="text-xl font-black font-mono text-indigo-400">
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
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>₹25,000</span>
                  <span>₹1,00,000</span>
                  <span>₹2,00,000</span>
                  <span>₹3,00,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">लोन उद्देश्य (Purpose):</label>
                <select
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-200 focus:outline-none"
                >
                  <option value="Agriculture & Mandi Crop Input (खेती व बीज)">खेती, खाद-बीज व डीजल खर्च (Agri Input)</option>
                  <option value="Tractor / Equipment Repair (ट्रैक्टर रिपेयर)">ट्रैक्टर व कृषि उपकरण रिपेयर (Tractor &amp; Tools)</option>
                  <option value="Shop / Business Stock (दुकान का सामान)">दुकान / व्यापार का माल भरना (Business Stock)</option>
                  <option value="Family / Medical Need (पारिवारिक जरूरत)">पारिवारिक व मेडिकल खर्च (Family Medical)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">अवधि (Months):</label>
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
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      {m} माह
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800">
                  पर्सनल लोन सारांश
                </div>
                <div className="py-4 space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>लोन राशि:</span>
                    <span className="font-mono font-extrabold text-indigo-300 text-lg">
                      ₹{personalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>मासिक ब्याज दर:</span>
                    <span className="font-semibold text-emerald-400">1.05%/माह</span>
                  </div>
                  <div className="flex justify-between">
                    <span>मासिक किश्त (EMI):</span>
                    <span className="font-mono font-bold text-white">₹{personalMonthlyEmi.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>प्रोसेसिंग फीस:</span>
                    <span className="text-emerald-400 font-bold">₹0 (शून्य)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openSanctionWorkflow('PERSONAL')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-lg shadow-indigo-600/25"
              >
                <span>₹{personalAmount.toLocaleString('en-IN')} तुरंत वॉलेट में लें</span>
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
            <div className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              emiFeedback.isError 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{emiFeedback.msg}</span>
            </div>
          )}

          {loans.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Coins className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm">वर्तमान में कोई सक्रिय लोन नहीं है।</p>
              <button
                onClick={() => setActiveTab('GOLD')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                गोल्ड लोन के लिए आवेदन करें
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {(loans || []).map((loan) => {
                if (!loan) return null;
                const loanTitle = loan.title || 'Gold Loan';
                return (
                <div 
                  key={loan.id || Math.random()}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {loan.loanType === 'GOLD' ? '🥇' : loan.loanType === 'SILVER' ? '🥈' : '💵'}
                        </span>
                        <h4 className="text-sm font-bold text-white">{loanTitle}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          loan.status === 'ACTIVE' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        लोन खाता: {loan.id} • ब्याज: {loan.interestRate}%/माह
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">बकाया मूलधन</div>
                      <div className="text-base font-black text-amber-400 font-mono">
                        ₹{loan.remainingAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {loan.collateralDetails && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                      <span>बंधक सामान (Collateral): {loan.collateralDetails.itemType} ({loan.collateralDetails.weightGrams}g)</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" /> सुरक्षित लॉकर #8492
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="text-xs text-slate-400">
                      मासिक किश्त: <strong className="text-white font-mono">₹{loan.monthlyEmi.toLocaleString('en-IN')}</strong>
                      <span className="text-[10px] text-indigo-400 ml-2">(देय: {loan.nextEmiDate})</span>
                    </div>

                    {loan.status === 'ACTIVE' && (
                      <button
                        type="button"
                        onClick={() => handleEmiPayment(loan)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        वॉलेट से EMI भरें (₹{loan.monthlyEmi})
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

      {/* INTERACTIVE SANCTION LETTER & AADHAAR E-SIGN MODAL */}
      {sanctionModalLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Sanction Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">डिजिटल लोन मंजूरी पत्र (Sanction Letter)</h3>
                  <p className="text-[10px] text-slate-400">NBFC Registration: RBI/NBFC/2026/RJ-8491</p>
                </div>
              </div>
              <button
                onClick={() => setSanctionModalLoan(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Sanction Letter Paper Layout */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="font-bold text-amber-400 text-sm">BHARAT LENDING &amp; FINANCE</div>
                  <div className="text-[10px] text-slate-400 font-mono">Date: {new Date().toLocaleDateString('en-IN')}</div>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">उधारकर्ता (Borrower):</span>
                    <strong className="text-white">{wallet.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">स्थान (Village):</span>
                    <span>{wallet.village}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">आधार संख्या (UIDAI):</span>
                    <span className="font-mono">{wallet.aadhaarNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">पैन कार्ड (PAN):</span>
                    <span className="font-mono">{wallet.panNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">स्वीकृत राशि (Sanctioned):</span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      ₹{sanctionModalLoan.principalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">मासिक ब्याज दर:</span>
                    <span className="text-amber-300">{sanctionModalLoan.interestRate}% प्रति माह</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">जमा होने वाला खाता:</span>
                    <span className="text-indigo-400 font-semibold">BharatPay Digital Wallet</span>
                  </div>
                </div>
              </div>

              {/* Aadhaar OTP & e-Sign Section */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>आधार ई-साइन ऑथेंटिकेशन (Instant e-Sign)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  आपके आधार से जुड़े मोबाइल नंबर (••••••3210) पर OTP भेजा गया है।
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value)}
                    className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-center text-sm font-bold text-white tracking-widest w-36"
                    placeholder="849201"
                  />
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    ✓ OTP सत्यापित (Auto-Filled)
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 italic">
                  "मैं, गगन चौहान (6MLD घड़साना), इस लोन समझौते के सभी नियमों को स्वीकार करता हूँ।"
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSanctionModalLoan(null)}
                disabled={isSigning}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                रद्द करें
              </button>

              <button
                type="button"
                onClick={handleConfirmDisbursal}
                disabled={isSigning}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
              >
                {isSigning ? (
                  <span>प्रमाणित हो रहा है... (Signing...)</span>
                ) : signedSuccess ? (
                  <span>सफल! वॉलेट में जमा हुआ ✓</span>
                ) : (
                  <>
                    <span>ई-साइन करें व राशि तुरंत प्राप्त करें</span>
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
