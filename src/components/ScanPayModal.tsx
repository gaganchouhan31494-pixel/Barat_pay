import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  QrCode, 
  Camera, 
  ArrowRight,
  Flashlight,
  FlashlightOff,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Store,
  Coffee,
  Fuel,
  Pill,
  Wheat
} from 'lucide-react';
import { Language } from '../types';
import { soundService } from '../utils/audio';

interface ScanPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMerchant: (merchantName: string, upiId: string, defaultAmount?: number) => void;
  language: Language;
}

const SAMPLE_MERCHANTS = [
  {
    name: 'Chouhan Kirana Store (6MLD Gharsana)',
    upiId: 'chouhan.kirana.6mld@bharatpay',
    category: 'Grocery & Ration',
    icon: Store,
    suggestedAmount: 450
  },
  {
    name: 'Marwar Highway Dhaba & Chai (Gharsana)',
    upiId: 'marwardhaba@okaxis',
    category: 'Food & Tea',
    icon: Coffee,
    suggestedAmount: 140
  },
  {
    name: 'Gharsana Anaj Mandi Trader',
    upiId: 'ramesh.mandi@sbi',
    category: 'Agri Produce & Mandi',
    icon: Wheat,
    suggestedAmount: 1850
  },
  {
    name: 'Bharat Petroleum Pump (Gharsana Bypass)',
    upiId: 'gharsanabpc@bharatpe',
    category: 'Petrol & Diesel Fuel',
    icon: Fuel,
    suggestedAmount: 500
  },
  {
    name: 'Sharma Medical Hall 6MLD',
    upiId: 'sharmamedical@ybl',
    category: 'Pharmacy & Healthcare',
    icon: Pill,
    suggestedAmount: 260
  }
];

export const ScanPayModal: React.FC<ScanPayModalProps> = ({
  isOpen,
  onClose,
  onSelectMerchant,
  language
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedFeedback, setScannedFeedback] = useState<string | null>(null);

  // Initialize camera stream when modal opens
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (isOpen) {
      setCameraError(null);
      setScannedFeedback(null);
      
      // Try to acquire camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        .then((s) => {
          activeStream = s;
          setStream(s);
          setCameraActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.log('Camera permission or availability notice:', err.message);
          setCameraActive(false);
          setCameraError('कैमरा सिमुलेटर मोड सक्रिय (Camera preview fallback active)');
        });
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
      setStream(null);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePickMerchant = (m: typeof SAMPLE_MERCHANTS[0]) => {
    soundService.playClick();
    setScannedFeedback(`QR Scanned: ${m.name}`);
    setTimeout(() => {
      onSelectMerchant(m.name, m.upiId, m.suggestedAmount);
      onClose();
    }, 400);
  };

  const handleSimulateGalleryUpload = () => {
    soundService.playClick();
    const randomMerchant = SAMPLE_MERCHANTS[Math.floor(Math.random() * SAMPLE_MERCHANTS.length)];
    setScannedFeedback(`QR Decoded: ${randomMerchant.name}`);
    setTimeout(() => {
      onSelectMerchant(randomMerchant.name, randomMerchant.upiId, randomMerchant.suggestedAmount);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E6ECFA] bg-[#F7F9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#2447E8] flex items-center justify-center border border-[#E6ECFA]">
              <QrCode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#151A2D] flex items-center gap-1.5">
                <span>Scan &amp; Pay</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#20B486]/10 text-[#20B486] font-semibold border border-[#20B486]/20">
                  LIVE QR
                </span>
              </h3>
              <p className="text-[11px] text-[#697086]">
                PhonePe, Paytm, Google Pay, BharatPe QR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#9AA2B3] hover:text-[#151A2D] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder with Camera Video or Real Scanning Simulation */}
        <div className="p-4 bg-slate-50 flex flex-col items-center">
          <div className="relative w-full max-w-[280px] h-64 rounded-3xl bg-slate-900 border-2 border-blue-500/60 flex items-center justify-center overflow-hidden shadow-xl">
            {/* Real Live Video feed if permitted */}
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950/30 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
                <Camera className="w-10 h-10 text-blue-400/50 mb-2 animate-pulse" />
                <p className="text-xs text-slate-200 font-medium">
                  QR कोड को कैमरे के सामने लाएं
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  (Live camera scanner or pick verified local merchant below)
                </p>
              </div>
            )}

            {/* Corner Framing Brackets */}
            <div className="absolute top-3 left-3 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-3 right-3 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-xl pointer-events-none" />

            {/* Laser scanning beam */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400/80 animate-[bounce_2.4s_ease-in-out_infinite] pointer-events-none" />

            {/* Scanned popup feedback */}
            {scannedFeedback && (
              <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center p-3 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
                <p className="text-xs font-bold text-white text-center">{scannedFeedback}</p>
              </div>
            )}
          </div>

          {/* Quick Camera Controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => setTorchOn(!torchOn)}
              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {torchOn ? (
                <>
                  <Flashlight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Flash On</span>
                </>
              ) : (
                <>
                  <FlashlightOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Flashlight</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSimulateGalleryUpload}
              className="px-3 py-1.5 rounded-full bg-[#EEF3FF] border border-[#E6ECFA] hover:bg-[#2447E8] hover:text-white text-[#2447E8] text-xs flex items-center gap-1.5 transition-colors font-semibold cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Gallery QR Upload</span>
            </button>
          </div>
        </div>

        {/* Quick Merchant Selection for Gharsana & Mandi */}
        <div className="p-4 bg-white border-t border-[#E6ECFA] overflow-y-auto flex-1">
          <div className="text-xs font-semibold text-[#151A2D] flex items-center justify-between mb-2">
            <span>स्थानीय मर्चेंट्स (6MLD घड़साना):</span>
            <span className="text-[10px] text-[#20B486] font-bold bg-[#20B486]/10 px-2 py-0.5 rounded border border-[#20B486]/20">1-TAP SCAN</span>
          </div>

          <div className="space-y-1.5">
            {SAMPLE_MERCHANTS.map((m, idx) => {
              const Icon = m.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePickMerchant(m)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9FF] hover:bg-[#EEF3FF] border border-[#E6ECFA] hover:border-[#2447E8]/30 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#E6ECFA] flex items-center justify-center text-[#2447E8] group-hover:scale-105 transition-transform shrink-0 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#151A2D] group-hover:text-[#2447E8] transition-colors">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-[#697086] font-mono">
                        {m.upiId}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-white font-bold bg-[#2447E8] px-2.5 py-1.5 rounded-lg group-hover:bg-[#1738C8] transition-all shadow-xs">
                    <span>पे ₹{m.suggestedAmount}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
