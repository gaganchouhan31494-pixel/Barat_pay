import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Gift, 
  Share2, 
  CheckCircle2, 
  Coins, 
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../utils/audio';

interface RewardsPageProps {
  onAddCashbackToWallet: (amount: number) => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({ onAddCashbackToWallet }) => {
  const [scratchCards, setScratchCards] = useState([
    { id: 1, amount: 75, merchant: 'Gharsana Anaj Mandi UPI Bonus', isRevealed: false },
    { id: 2, amount: 50, merchant: 'Electricity Bill Cashback', isRevealed: false },
    { id: 3, amount: 150, merchant: 'Gold Loan Approval Reward', isRevealed: true },
    { id: 4, amount: 25, merchant: 'Mobile Recharge Discount', isRevealed: true }
  ]);
  const [totalEarned, setTotalEarned] = useState<number>(300);

  const handleReveal = (id: number, amount: number) => {
    soundService.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }

    setScratchCards(scratchCards.map(c => c.id === id ? { ...c, isRevealed: true } : c));
    setTotalEarned(prev => prev + amount);
    onAddCashbackToWallet(amount);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in text-[#151A2D] pb-8">
      {/* Top Banner (Centralized Fintech Blue Gradient) */}
      <div className="fintech-gradient-card p-6 sm:p-7 text-center relative">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#1738C8]/40 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2">
            <Trophy className="w-6 h-6 stroke-[2.2]" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Rewards &amp; Cashback Portal
          </h1>
          <p className="text-xs text-white/80 max-w-md mx-auto">
            Earn instant guaranteed cashback directly credited to your BharatPay wallet on every transaction.
          </p>

          {/* Total cashback stat */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 max-w-xs mx-auto">
            <div className="text-[11px] text-white/80 font-medium">Total Cashback Credited</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-0.5">
              ₹{totalEarned.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Scratch cards container */}
      <div className="fintech-white-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center">
              <Gift className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#151A2D] uppercase tracking-wider">
                Active Scratch Cards
              </h2>
              <p className="text-xs text-[#697086]">Tap unrevealed cards to claim instant wallet credit</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#20B486] bg-[#20B486]/10 px-2.5 py-1 rounded-full">
            Guaranteed Cash
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scratchCards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                if (!card.isRevealed) handleReveal(card.id, card.amount);
              }}
              className={`rounded-2xl border transition-all p-4 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px] cursor-pointer ${
                card.isRevealed
                  ? 'bg-[#F7F9FF] border-[#E6ECFA]'
                  : 'fintech-gradient-card hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {card.isRevealed ? (
                <div className="space-y-2 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-[#20B486]/10 text-[#20B486] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#151A2D]">
                    ₹{card.amount}
                  </div>
                  <p className="text-[11px] font-semibold text-[#697086] line-clamp-2">
                    {card.merchant}
                  </p>
                  <span className="text-[10px] font-bold text-[#20B486] bg-[#20B486]/10 px-2 py-0.5 rounded-full inline-block">
                    Credited to Wallet
                  </span>
                </div>
              ) : (
                <div className="space-y-2 text-white">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-sm">Tap to Reveal</div>
                  <p className="text-[11px] text-white/80">Up to ₹500 Cashback</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Referral Program Card */}
      <div className="fintech-white-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center shrink-0">
            <Share2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#151A2D]">
              Refer a Friend or Merchant in 6MLD
            </h3>
            <p className="text-xs text-[#697086]">
              Earn ₹100 instant bonus when your referral completes their first UPI payment or scans a QR.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            if (navigator.share) {
              navigator.share({
                title: 'BharatPay Fintech App',
                text: 'Join BharatPay for instant 0% UPI payments and gold loans in 6MLD Gharsana!',
                url: window.location.href
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Referral link copied to clipboard!');
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
        >
          Share Referral Link
        </button>
      </div>
    </div>
  );
};
