import React from 'react';
import { 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  QrCode, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Building2, 
  TrendingUp,
  MapPin,
  Clock,
  PhoneCall
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white shadow-xl">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-12 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-blue-100 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>गाँव 6MLD घड़साना (श्रीगंगानगर) आधिकारिक डिजिटल पोर्टल</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              आधुनिक डिजिटल बैंकिंग, <br className="hidden sm:inline" />
              <span className="text-amber-300">गोल्ड लोन</span> व UPI वॉलेट
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 max-w-xl font-normal leading-relaxed">
              6MLD घड़साना और अनूपगढ़-घड़साना अनाज मंडी के व्यापारियों और किसानों के लिए सुरक्षित वित्तीय समाधान — बिना किसी कागजी देरी के तुरंत गोल्ड लोन, 0-सेकंड UPI भुगतान व साउंडबॉक्स सेवा।
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">75%</div>
                <div className="text-[11px] text-blue-100 font-medium">गोल्ड LTV लोन</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300">0.79%</div>
                <div className="text-[11px] text-blue-100 font-medium">मासिक ब्याज दर</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black font-mono text-white">0 सेकंड</div>
                <div className="text-[11px] text-blue-100 font-medium">तत्काल डिस्बर्सल</div>
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
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>गोल्ड लोन अप्लाई करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onOpenScan();
                }}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm flex items-center gap-2 backdrop-blur-md active:scale-95 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>QR स्कैन व पे</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onOpenAddMoney();
                }}
                className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>पैसे जोड़ें</span>
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
              
              {/* Floating Badge Over Image */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>पूर्ण KYC सत्यापित</span>
              </div>

              {/* Floating Account Summary over Image */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                      SBI
                    </div>
                    <div>
                      <span className="font-bold">स्टेट बैंक ऑफ इंडिया (••8492)</span>
                      <span className="text-[10px] text-slate-500 block">6MLD घड़साना शाखा</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-blue-700">₹{bankBalance.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                      ₹
                    </div>
                    <span className="font-semibold text-slate-700">BharatPay डिजिटल वॉलेट</span>
                  </div>
                  <span className="font-mono font-black text-emerald-600 text-sm">₹{walletBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Micro security callout */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-blue-100/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NPCI UPI 2.0 व RBI डिजिटल लेंडिंग सुरक्षा से सुरक्षित</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Visual Image Cards (Gold, Mandi, Soundbox, Instant QR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gold & Silver Loans */}
        <div 
          onClick={() => {
            soundService.playClick();
            onOpenLoans();
          }}
          className="rounded-2xl border border-amber-200/80 bg-white hover:border-amber-400 shadow-sm hover:shadow-md transition-all p-3.5 space-y-3 cursor-pointer group flex flex-col justify-between"
        >
          <div className="relative rounded-xl overflow-hidden h-36 bg-amber-50">
            <img 
              src="https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80" 
              alt="Gold & Silver Bullion Vault" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-bold shadow-sm">
              75% LTV तुरंत
            </span>
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-amber-700 flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              गोल्ड व सिल्वर लोन (Bullion)
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              सोने के हार, कंगन व चांदी पर 0.79% मासिक ब्याज दर से तुरंत वॉलेट में पैसा।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>कैलकुलेटर खोलें</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Kisan & Mandi Produce */}
        <div 
          onClick={() => {
            soundService.playClick();
            onOpenLoans();
          }}
          className="rounded-2xl border border-emerald-200/80 bg-white hover:border-emerald-400 shadow-sm hover:shadow-md transition-all p-3.5 space-y-3 cursor-pointer group flex flex-col justify-between"
        >
          <div className="relative rounded-xl overflow-hidden h-36 bg-emerald-50">
            <img 
              src="https://images.unsplash.com/photo-1595085610896-fb31c7e94633?auto=format&fit=crop&w=600&q=80" 
              alt="Kisan Mandi Agriculture" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
              मंडी व कृषि क्रेडिट
            </span>
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-emerald-700 flex items-center justify-center shadow">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              किसान व मंडी प्रोड्यूस लोन
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              6MLD व घड़साना अनाज मंडी फसल विक्रय, खाद-बीज और कृषि यंत्रों पर आसान ऋण।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>विवरण देखें</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Smart Voice Soundbox */}
        <div 
          onClick={() => {
            soundService.playClick();
            onOpenSoundbox();
          }}
          className="rounded-2xl border border-blue-200/80 bg-white hover:border-blue-400 shadow-sm hover:shadow-md transition-all p-3.5 space-y-3 cursor-pointer group flex flex-col justify-between"
        >
          <div className="relative rounded-xl overflow-hidden h-36 bg-blue-50">
            <img 
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80" 
              alt="Smart Voice Soundbox" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-sm">
              हिंदी व बागड़ी आवाज
            </span>
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-blue-700 flex items-center justify-center shadow">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
              स्मार्ट वॉइस साउंडबॉक्स
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              किराना, मेडिकल व मंडी आढ़तियों के लिए पेमेंट प्राप्त होते ही तुरंत तेज आवाज में घोषणा।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
            <span>आवाज टेस्ट करें</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Instant UPI 2.0 & QR */}
        <div 
          onClick={() => {
            soundService.playClick();
            onOpenMyQr();
          }}
          className="rounded-2xl border border-purple-200/80 bg-white hover:border-purple-400 shadow-sm hover:shadow-md transition-all p-3.5 space-y-3 cursor-pointer group flex flex-col justify-between"
        >
          <div className="relative rounded-xl overflow-hidden h-36 bg-purple-50">
            <img 
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80" 
              alt="Instant QR Code Payment" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold shadow-sm">
              0% मर्चेंट शुल्क
            </span>
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-purple-700 flex items-center justify-center shadow">
              <QrCode className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-800 transition-colors">
              दुकानदार QR व VPA पेमेंट
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              PhonePe, Google Pay, Paytm व सभी UPI ऐप्स से सेकंडों में पैसा सीधे खाते में प्राप्त करें।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
            <span>मेरा QR देखें</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};
