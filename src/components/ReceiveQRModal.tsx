import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  ShieldCheck, 
  Sparkles,
  Building2
} from 'lucide-react';
import { UserWallet, Language } from '../types';
import { soundService } from '../utils/audio';

interface ReceiveQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  language: Language;
}

export const ReceiveQRModal: React.FC<ReceiveQRModalProps> = ({
  isOpen,
  onClose,
  wallet,
  language
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    soundService.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wallet.upiId).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    soundService.playClick();
    setDownloadNotice('QR कोड डिवाइस में सहेज लिया गया है');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 text-center space-y-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3FF] text-[#2447E8] border border-[#E6ECFA] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> BharatPay All-in-One UPI QR
          </div>
          <h3 className="text-lg font-bold text-[#151A2D]">{wallet.name}</h3>
          <p className="text-xs text-[#2447E8] font-semibold bg-[#EEF3FF] py-1 px-3 rounded-full inline-block border border-[#E6ECFA]">
            गाँव: 6MLD, घड़साना (श्रीगंगानगर)
          </p>
        </div>

        {/* QR Code Canvas Representation */}
        <div className="p-4 rounded-2xl bg-[#F7F9FF] border border-[#E6ECFA] shadow-xs max-w-[240px] mx-auto space-y-2">
          {/* Stylized QR Code SVG */}
          <div className="aspect-square w-full relative flex items-center justify-center bg-white rounded-xl p-3 border border-[#E6ECFA] shadow-xs">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#151A2D]">
              {/* Top-Left Corner Box */}
              <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" rx="3" />
              <rect x="12" y="12" width="14" height="14" fill="currentColor" rx="2" />

              {/* Top-Right Corner Box */}
              <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" rx="3" />
              <rect x="74" y="12" width="14" height="14" fill="currentColor" rx="2" />

              {/* Bottom-Left Corner Box */}
              <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" rx="3" />
              <rect x="12" y="74" width="14" height="14" fill="currentColor" rx="2" />

              {/* Pattern Blocks */}
              <rect x="38" y="8" width="6" height="6" fill="currentColor" />
              <rect x="48" y="8" width="6" height="6" fill="currentColor" />
              <rect x="38" y="18" width="6" height="12" fill="currentColor" />
              <rect x="48" y="24" width="6" height="6" fill="currentColor" />
              <rect x="58" y="12" width="4" height="16" fill="currentColor" />

              <rect x="8" y="38" width="6" height="10" fill="currentColor" />
              <rect x="18" y="44" width="8" height="6" fill="currentColor" />
              <rect x="28" y="38" width="6" height="12" fill="currentColor" />

              {/* Center Logo Cutout */}
              <rect x="36" y="36" width="28" height="28" fill="#2447E8" rx="6" />
              <text x="50" y="55" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">₹</text>

              {/* Lower Right Patterns */}
              <rect x="68" y="38" width="8" height="6" fill="currentColor" />
              <rect x="80" y="44" width="12" height="6" fill="currentColor" />
              <rect x="72" y="54" width="8" height="8" fill="currentColor" />

              <rect x="38" y="68" width="6" height="14" fill="currentColor" />
              <rect x="48" y="68" width="14" height="6" fill="currentColor" />
              <rect x="54" y="78" width="8" height="14" fill="currentColor" />
              <rect x="68" y="74" width="8" height="6" fill="currentColor" />
              <rect x="80" y="68" width="6" height="16" fill="currentColor" />
              <rect x="80" y="88" width="12" height="6" fill="currentColor" />
            </svg>
          </div>

          <div className="text-[10px] font-bold text-[#697086] tracking-wider">
            BHARATPE • PHONEPE • GPAY • PAYTM
          </div>
        </div>

        {/* UPI ID display & copy */}
        <div className="space-y-1.5">
          <div className="text-xs text-[#697086] font-medium">आपकी अधिकृत UPI आईडी:</div>
          <button
            onClick={handleCopy}
            className="w-full py-2 px-3 rounded-xl bg-[#F7F9FF] border border-[#E6ECFA] hover:bg-[#EEF3FF] text-xs font-mono text-[#2447E8] font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>{wallet.upiId}</span>
            {copied ? (
              <span className="flex items-center gap-1 text-[#20B486] font-sans font-semibold">
                <Check className="w-3.5 h-3.5" /> कॉपी हुआ
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#9AA2B3]" />
            )}
          </button>
        </div>

        <div className="text-[11px] text-[#697086] flex items-center justify-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#2447E8]" />
          <span>सीधे लिंक्ड बैंक खाता: SBI (••8492) में जमा होगा</span>
        </div>

        {downloadNotice && (
          <div className="p-2 rounded-lg bg-[#20B486]/10 border border-[#20B486]/20 text-[#20B486] text-xs font-semibold text-center animate-fade-in flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadQR}
            className="flex-1 py-2.5 rounded-xl bg-[#F7F9FF] hover:bg-[#EEF3FF] text-xs font-bold text-[#151A2D] flex items-center justify-center gap-1.5 border border-[#E6ECFA] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>QR डाउनलोड</span>
          </button>
          <button
            onClick={() => {
              soundService.playClick();
              if (navigator.share) {
                navigator.share({
                  title: 'Pay Gagan Chouhan via UPI',
                  text: `Send money to Gagan Chouhan (6MLD Gharsana) via UPI ID: ${wallet.upiId}`
                }).catch(() => {});
              } else {
                handleCopy();
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#2447E8] hover:bg-[#1738C8] text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>QR शेयर करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
