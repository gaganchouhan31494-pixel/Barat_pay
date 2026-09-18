import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Building2, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  ArrowUp
} from 'lucide-react';
import { soundService } from '../utils/audio';

export const WebsiteFooter: React.FC = () => {
  const scrollToTop = () => {
    soundService.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-12 border-t border-[#E6ECFA] bg-white text-[#697086] transition-colors pb-20 lg:pb-0">
      {/* Upper certification & trust strip */}
      <div className="border-b border-[#E6ECFA] bg-[#F7F9FF] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#151A2D]">NPCI UPI 2.0 Compliant</h5>
              <p className="text-[11px] text-[#697086]">100% Secure digital payment gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4B740]/15 text-[#F4B740] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#151A2D]">75% Gold Loan LTV</h5>
              <p className="text-[11px] text-[#697086]">Insured security vaults &amp; low interest</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#20B486]/10 text-[#20B486] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#151A2D]">Nodal Bank: SBI</h5>
              <p className="text-[11px] text-[#697086]">State Bank of India linked account</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#151A2D]">256-Bit SSL Encryption</h5>
              <p className="text-[11px] text-[#697086]">Bank-grade digital financial protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2447E8] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                ₹
              </div>
              <span className="text-xl font-black text-[#151A2D] tracking-tight">
                Bharat<span className="text-[#2447E8]">Pay</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EEF3FF] text-[#2447E8] text-[10px] font-bold border border-[#E6ECFA]">
                Sri Ganganagar
              </span>
            </div>

            <p className="text-xs text-[#697086] leading-relaxed max-w-sm">
              BharatPay is a premier Indian digital payments and collateral credit platform based in 6MLD Gharsana (Sri Ganganagar, Rajasthan). We empower merchants, farmers, Mandi traders, and local enterprises with lightning-fast UPI payments, digital credit, and automated voice confirmations.
            </p>

            <div className="space-y-1.5 text-xs text-[#697086]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2447E8] shrink-0" />
                <span>Branch: Village 6MLD, Tehsil Gharsana, Dist. Sri Ganganagar, Rajasthan 335711</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#20B486] shrink-0" />
                <span>Helpline: 1800-200-6MLD / +91 98765-43210 (24x7 Support)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#2447E8] shrink-0" />
                <span>Email: support@bharatpay-fintech.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Banking Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A2D]">Payment Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#wallet" className="hover:text-[#2447E8] transition-colors">BharatPay Digital Wallet</a></li>
              <li><a href="#wallet" className="hover:text-[#2447E8] transition-colors">SBI Linked Account</a></li>
              <li><a href="#wallet" className="hover:text-[#2447E8] transition-colors">UPI 2.0 Mobile Transfer</a></li>
              <li><a href="#recharge-services" className="hover:text-[#2447E8] transition-colors">Utility &amp; Mobile Recharges</a></li>
              <li><a href="#passbook" className="hover:text-[#2447E8] transition-colors">Digital Passbook &amp; Ledger</a></li>
            </ul>
          </div>

          {/* Col 3: Loan Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A2D]">Credit Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#loans-section" className="hover:text-[#2447E8] transition-colors">Gold Collateral Credit</a></li>
              <li><a href="#loans-section" className="hover:text-[#2447E8] transition-colors">Silver Articles Credit</a></li>
              <li><a href="#loans-section" className="hover:text-[#2447E8] transition-colors">Mandi Produce Advance</a></li>
              <li><a href="#loans-section" className="hover:text-[#2447E8] transition-colors">Instant Wallet Disbursal</a></li>
              <li><a href="#loans-section" className="hover:text-[#2447E8] transition-colors">Live MCX Bullion Rates</a></li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A2D]">Trust &amp; Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> Digital e-KYC Verification</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> UPI PIN Security Standard</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> Grievance Redressal</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> Privacy Policy</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> Terms &amp; Conditions</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-[#E6ECFA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#697086]">
          <div>
            &copy; {new Date().getFullYear()} BharatPay Fintech Services. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>Primary User: <strong className="text-[#151A2D]">Gagan Chauhan (6MLD)</strong></span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#F7F9FF] border border-[#E6ECFA] hover:bg-[#EEF3FF] text-[#151A2D] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
