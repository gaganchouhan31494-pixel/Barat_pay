import React from 'react';
import { 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  QrCode, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Building2, 
  MapPin
} from 'lucide-react';
import { soundService } from '../utils/audio';

interface WebsiteHeroProps {
  onOpenScan: () => void;
  onOpenMyQr: () => void;
  onOpenAddMoney: () => void;
  onOpenLoans: () => void;
  onOpenSoundbox: () => void;
  walletBalance: number;
  bankBalance: number;
}

export const WebsiteHero: React.FC<WebsiteHeroProps> = ({
  onOpenScan,
  onOpenMyQr,
  onOpenAddMoney,
  onOpenLoans,
  onOpenSoundbox,
  walletBalance,
  bankBalance
}) => {
  return (
    <section className="space-y-6">
      {/* Top Banner / Hero Canvas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1738C8] via-[#2447E8] to-[#315BFF] text-white shadow-xl">
        {/* Geometric subtle overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_50%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-12 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#20B486] animate-pulse" />
              <MapPin className="w-3.5 h-3.5" />
              <span>National Financial Network • Secure Gateway</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Next-Gen Indian Fintech, <br className="hidden sm:inline" />
              <span className="text-[#F4B740]">Instant Credit</span> &amp; UPI Wallet
            </h1>

            <p className="text-sm sm:text-base text-white/90 max-w-xl font-normal leading-relaxed">
              Tailored digital payment solutions for merchants, enterprises, and modern retail — instant gold &amp; silver collateral loans, zero-second UPI transfers, and smart voice soundbox confirmations.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black font-mono text-[#F4B740]">75%</div>
                <div className="text-[11px] text-white/90 font-medium">Gold Loan LTV</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black font-mono text-[#20B486]">0.79%</div>
                <div className="text-[11px] text-white/90 font-medium">Monthly Interest</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black font-mono text-white">0s</div>
                <div className="text-[11px] text-white/90 font-medium">Instant Disbursal</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onOpenLoans();
                }}
                className="px-5 py-3 rounded-xl bg-[#F4B740] hover:bg-[#e0a430] text-[#151A2D] font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#151A2D]" />
                <span>Apply for Gold Loan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onOpenScan();
                }}
                className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm flex items-center gap-2 backdrop-blur-md active:scale-95 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan &amp; Pay QR</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onOpenAddMoney();
                }}
                className="px-4 py-3 rounded-xl bg-[#20B486] hover:bg-[#1ca077] text-white font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Add Money</span>
              </button>
            </div>
          </div>

          {/* Right Image Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white group">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80" 
                alt="BharatPay Digital Banking & UPI Payments" 
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Floating Badge Over Image */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#20B486] text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Full KYC Verified</span>
              </div>

              {/* Floating Account Summary over Image */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-md text-[#151A2D] border border-[#E6ECFA] shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-[#E6ECFA] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#2447E8] text-white flex items-center justify-center font-bold text-[10px]">
                      SBI
                    </div>
                    <div>
                      <span className="font-bold">State Bank of India (••8492)</span>
                      <span className="text-[10px] text-[#697086] block">City Main Branch</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#2447E8]">₹{bankBalance.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#20B486] text-white flex items-center justify-center font-bold text-[10px]">
                      ₹
                    </div>
                    <span className="font-semibold text-[#151A2D]">BharatPay Digital Wallet</span>
                  </div>
                  <span className="font-mono font-black text-[#20B486] text-sm">₹{walletBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Micro security callout */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#20B486]" />
              <span>NPCI UPI 2.0 &amp; 256-Bit Bank Grade SSL Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Visual Image Cards (Gold, Agriculture, Soundbox, Instant QR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gold & Silver Loans */}
        <div 
          onClick={() => {
            soundService.playClick();
            onOpenLoans();
          }}
          className="rounded-2xl border border-[#E6ECFA] bg-white hover:border-[#2447E8]/40 shadow-xs hover:shadow-md transition-all p-3.5 space-y-3 cursor-pointer group flex flex-col justify-between"
        >
          <div className="relative rounded-xl overflow-hidden h-36 bg-[#F7F9FF]">
            <img 
              src="https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80" 
              alt="Gold & Silver Bullion Vault" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#F4B740] text-[#151A2D] text-[10px] font-bold shadow-xs">
              75% LTV Instant
            </span>
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-[#F4B740] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#151A2D] group-hover:text-[#2447E8] transition-colors">
              Gold &amp; Silver Collateral Credit
            </h3>
            <p className="text-xs text-[#697086] mt-1 leading-relaxed">
              Instant loan against hallmarked jewellery at 0.79% monthly interest rate credited directly to wallet.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E6ECFA] flex items-center justify-between text-xs font-semibold text-[#2447E8]">
            <span>Open Calculator</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Agriculture & Mandi Produce */}
        <div 
          onClick={() => {
            soundService.playClick();
            onOpenLoans();
          }}
          className="rounded-2xl border border-[#E6ECFA] bg-white hover:border-[#2447E8]/40 shadow-xs hover:shadow-md transition-all p-3.5 space-y-3 cursor-pointer group flex flex-col justify-between"
        >
          <div className="relative rounded-xl overflow-hidden h-36 bg-[#F7F9FF]">
            <img 
              src="https://images.unsplash.com/photo-1595085610896-fb31c7e94633?auto=format&fit=crop&w=600&q=80" 
              alt="Agriculture & Farm Credit" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#20B486] text-white text-[10px] font-bold shadow-xs">
              Mandi &amp; Agri Credit
            </span>
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-[#20B486] flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#151A2D] group-hover:text-[#2447E8] transition-colors">
              Agri &amp; Trade Working Capital
            </h3>
            <p className="text-xs text-[#697086] mt-1 leading-relaxed">
              Seamless financing for farmers, Mandi traders, agricultural implements, and retail inventory.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E6ECFA] flex items-center justify-between text-xs font-semibold text-[#2447E8]">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Smart Voice Soundbox */}
        <div 
          onClick={() => {
            soundService.playClick();
            onOpenSoundbox();
          }}
          className="rounded-2xl border border-[#E6ECFA] bg-white hover:border-[#2447E8]/40 shadow-xs hover:shadow-md transition-all p-3.5 space-y-3 cursor-pointer group flex flex-col justify-between"
        >
          <div className="relative rounded-xl overflow-hidden h-36 bg-[#F7F9FF]">
            <img 
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80" 
              alt="Smart Voice Soundbox" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#2447E8] text-white text-[10px] font-bold shadow-xs">
              Instant Audio Alert
            </span>
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-[#2447E8] flex items-center justify-center shadow-xs">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#151A2D] group-hover:text-[#2447E8] transition-colors">
              Smart Merchant Soundbox
            </h3>
            <p className="text-xs text-[#697086] mt-1 leading-relaxed">
              Loud, clear voice payment confirmations for retail stores, grocery shops, and busy counters.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E6ECFA] flex items-center justify-between text-xs font-semibold text-[#2447E8]">
            <span>Test Soundbox</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Instant UPI 2.0 & QR */}
        <div 
          onClick={() => {
            soundService.playClick();
            onOpenMyQr();
          }}
          className="rounded-2xl border border-[#E6ECFA] bg-white hover:border-[#2447E8]/40 shadow-xs hover:shadow-md transition-all p-3.5 space-y-3 cursor-pointer group flex flex-col justify-between"
        >
          <div className="relative rounded-xl overflow-hidden h-36 bg-[#F7F9FF]">
            <img 
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80" 
              alt="Instant QR Code Payment" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#20B486] text-white text-[10px] font-bold shadow-xs">
              Zero Merchant Fee
            </span>
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-[#2447E8] flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#151A2D] group-hover:text-[#2447E8] transition-colors">
              All-in-One UPI QR Standee
            </h3>
            <p className="text-xs text-[#697086] mt-1 leading-relaxed">
              Accept payments seamlessly from PhonePe, Google Pay, Paytm, and all banking UPI apps directly.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E6ECFA] flex items-center justify-between text-xs font-semibold text-[#2447E8]">
            <span>View My QR</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};
