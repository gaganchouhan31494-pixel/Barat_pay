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
              <h5 className="text-xs font-bold text-[#151A2D]">NPCI UPI 2.0 अधिकृत</h5>
              <p className="text-[11px] text-[#697086]">100% सुरक्षित डिजिटल पेमेंट गेटवे</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#151A2D]">75% गोल्ड लोन सुरक्षा</h5>
              <p className="text-[11px] text-[#697086]">बीमित सुरक्षित वॉल्ट व न्यूनतम ब्याज</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#20B486]/10 text-[#20B486] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#151A2D]">नोडल बैंक: SBI</h5>
              <p className="text-[11px] text-[#697086]">स्टेट बैंक ऑफ इंडिया लिंक्ड खाता</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#151A2D]">256-बिट SSL एन्क्रिप्शन</h5>
              <p className="text-[11px] text-[#697086]">RBI डिजिटल लेंडिंग दिशा-निर्देशित</p>
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
                6MLD घड़साना
              </span>
            </div>

            <p className="text-xs text-[#697086] leading-relaxed max-w-sm">
              भारतपे 6MLD घड़साना (श्रीगंगानगर, राजस्थान) का प्रमुख डिजिटल बैंकिंग, गोल्ड व सिल्वर लोन पोर्टल है। हम किसानों, मंडी आढ़तियों, किराना स्टोर और आम नागरिकों को सरल, सुरक्षित व बिना कागजी परेशानी के डिजिटल बैंकिंग सेवाएं प्रदान करते हैं।
            </p>

            <div className="space-y-1.5 text-xs text-[#697086]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2447E8] shrink-0" />
                <span>शाखा: गाँव 6MLD, तहसील घड़साना, जिला श्रीगंगानगर (राज.) 335711</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#20B486] shrink-0" />
                <span>हेल्पलाइन: 1800-200-6MLD / +91 98765-43210 (24x7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#2447E8] shrink-0" />
                <span>ईमेल: support@bharatpay-gharsana.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Banking Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A2D]">बैंकिंग सेवाएं</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#wallet" className="hover:text-[#2447E8] transition-colors">BharatPay वॉलेट</a></li>
              <li><a href="#wallet" className="hover:text-[#2447E8] transition-colors">SBI नोडल बैंक खाता</a></li>
              <li><a href="#wallet" className="hover:text-[#2447E8] transition-colors">UPI 2.0 मोबाइल पेमेंट</a></li>
              <li><a href="#recharge-services" className="hover:text-[#2447E8] transition-colors">बिजली, पानी व मोबाइल बिल</a></li>
              <li><a href="#passbook" className="hover:text-[#2447E8] transition-colors">डिजिटल पासबुक व रसीदें</a></li>
            </ul>
          </div>

          {/* Col 3: Loan Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A2D]">लोन उत्पाद</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#loans-section" className="hover:text-amber-700 transition-colors">गोल्ड लोन (सोने पर लोन)</a></li>
              <li><a href="#loans-section" className="hover:text-[#151A2D] transition-colors">सिल्वर लोन (चांदी के गहने)</a></li>
              <li><a href="#loans-section" className="hover:text-[#2447E8] transition-colors">किसान व मंडी फसल अग्रिम</a></li>
              <li><a href="#loans-section" className="hover:text-[#2447E8] transition-colors">EMI भुगतान व ब्याज छूट</a></li>
              <li><a href="#loans-section" className="hover:text-[#2447E8] transition-colors">MCX लाइव बुलियन दरें</a></li>
            </ul>
          </div>

          {/* Col 4: Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151A2D]">सुरक्षा व सहायता</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> आधार e-KYC गाइड</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> UPI पिन सुरक्षा नियम</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> RBI शिकायत निवारण</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> गोपनीयता नीति (Privacy)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#20B486]" /> नियम व शर्तें (Terms)</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-[#E6ECFA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#697086]">
          <div>
            &copy; {new Date().getFullYear()} BharatPay Digital Banking Portal (गाँव 6MLD घड़साना). सर्वाधिकार सुरक्षित।
          </div>

          <div className="flex items-center gap-4">
            <span>खाताधारक: <strong>गगन चौहान (6MLD)</strong></span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#F7F9FF] border border-[#E6ECFA] hover:bg-[#EEF3FF] text-[#151A2D] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <span>ऊपर जाएं</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
