import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Plus, Wifi, CheckCircle2 } from 'lucide-react';
import { soundService } from '../utils/audio';

interface LinkedCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedCardsModal: React.FC<LinkedCardsModalProps> = ({ isOpen, onClose }) => {
  const [cards] = useState([
    {
      id: 'c1',
      issuer: 'State Bank of India',
      network: 'RuPay Platinum',
      last4: '8821',
      expiry: '09/29',
      holder: 'GAGAN CHOUHAN',
      type: 'Debit Card',
      gradient: 'from-[#1e3c72] via-[#2a5298] to-[#0f2027]'
    },
    {
      id: 'c2',
      issuer: 'HDFC Bank',
      network: 'VISA Signature',
      last4: '4190',
      expiry: '12/28',
      holder: 'GAGAN CHOUHAN',
      type: 'Credit Card',
      gradient: 'from-[#000046] via-[#1cb5e0] to-[#000046]'
    }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl p-6 space-y-4 text-slate-900">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Linked Cards</h3>
              <p className="text-xs text-slate-500">2 Active RBI Tokenized Cards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card visual previews */}
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`p-5 rounded-2xl bg-gradient-to-r ${card.gradient} text-white shadow-md relative overflow-hidden`}
            >
              {/* Card glossy effect */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-bold tracking-wider uppercase opacity-90">{card.issuer}</div>
                  <div className="text-[10px] opacity-75">{card.type}</div>
                </div>
                <Wifi className="w-5 h-5 rotate-90 opacity-80" />
              </div>

              {/* EMV Chip */}
              <div className="w-9 h-7 rounded-md bg-amber-400/90 border border-amber-300 shadow-inner mb-3 flex items-center justify-center">
                <div className="w-6 h-4 border border-amber-600/40 rounded-sm" />
              </div>

              <div className="font-mono text-base sm:text-lg tracking-widest font-semibold mb-3">
                •••• •••• •••• {card.last4}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/20">
                <div>
                  <div className="text-[9px] uppercase tracking-wider opacity-70">Cardholder</div>
                  <div className="font-semibold tracking-wide">{card.holder}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-wider opacity-70">Expires</div>
                  <div className="font-mono font-semibold">{card.expiry}</div>
                </div>
                <div className="font-black italic text-sm">{card.network}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            soundService.playClick();
            alert('RBI Tokenization flow: Enter card details in secure iframe.');
          }}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/30 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Debit or Credit Card</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>CVV is never stored. 100% tokenized as per RBI norm.</span>
        </div>
      </div>
    </div>
  );
};
