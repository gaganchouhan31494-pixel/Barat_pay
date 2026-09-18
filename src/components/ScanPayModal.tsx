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
  language?: Language;
}

const SAMPLE_MERCHANTS = [
  {
    name: 'Chouhan General Store',
    upiId: 'chouhan.store@bharatpay',
    category: 'Grocery & Essentials',
    icon: Store,
    suggestedAmount: 450
  },
  {
    name: 'Highway Express Cafe',
    upiId: 'expresscafe@okaxis',
    category: 'Food & Beverages',
    icon: Coffee,
    suggestedAmount: 140
  },
  {
    name: 'Agri Produce & Grain Trader',
    upiId: 'agritrader@sbi',
    category: 'Agricultural Exchange',
    icon: Wheat,
    suggestedAmount: 1850
  },
  {
    name: 'Bypass Fuel Station',
    upiId: 'bypassfuel@bharatpe',
    category: 'Fuel & Automobile',
    icon: Fuel,
    suggestedAmount: 500
  },
  {
    name: 'Apex Pharmacy & Healthcare',
    upiId: 'apexmedical@ybl',
    category: 'Healthcare & Medicines',
    icon: Pill,
    suggestedAmount: 260
  }
];

export const ScanPayModal: React.FC<ScanPayModalProps> = ({
  isOpen,
  onClose,
  onSelectMerchant
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [, setCameraError] = useState<string | null>(null);
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
        .catch(() => {
          setCameraActive(false);
          setCameraError('Camera preview fallback active');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-[#E6ECFA] shadow-2xl flex flex-col max-h-[92vh]">
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
                  LIVE SCAN
                </span>
              </h3>
              <p className="text-[11px] text-[#697086]">
                Scan any UPI QR code instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#697086] hover:text-[#151A2D] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder with Camera Video or Real Scanning Simulation */}
        <div className="p-4 bg-[#F7F9FF] flex flex-col items-center">
          <div className="relative w-full max-w-[280px] h-64 rounded-3xl bg-[#151A2D] border-2 border-[#2447E8]/60 flex items-center justify-center overflow-hidden shadow-xl">
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
              <div className="absolute inset-0 bg-gradient-to-b from-[#151A2D] via-[#1738C8]/40 to-[#151A2D] flex flex-col items-center justify-center p-4 text-center">
                <Camera className="w-10 h-10 text-white/50 mb-2 animate-pulse" />
                <p className="text-xs text-white font-medium">
                  Align QR code within the camera frame
                </p>
                <p className="text-[10px] text-white/70 mt-1">
                  Or select a verified merchant below
                </p>
              </div>
            )}

            {/* Corner Framing Brackets */}
            <div className="absolute top-3 left-3 w-7 h-7 border-t-4 border-l-4 border-[#20B486] rounded-tl-xl pointer-events-none" />
            <div className="absolute top-3 right-3 w-7 h-7 border-t-4 border-r-4 border-[#20B486] rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-7 h-7 border-b-4 border-l-4 border-[#20B486] rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-7 h-7 border-b-4 border-r-4 border-[#20B486] rounded-br-xl pointer-events-none" />

            {/* Laser scanning beam */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#20B486] to-transparent shadow-lg shadow-[#20B486]/80 animate-[bounce_2.4s_ease-in-out_infinite] pointer-events-none" />

            {/* Scanned popup feedback */}
            {scannedFeedback && (
              <div className="absolute inset-0 bg-[#151A2D]/90 flex flex-col items-center justify-center p-3 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-[#20B486] mb-2 animate-bounce" />
                <p className="text-xs font-bold text-white text-center">{scannedFeedback}</p>
              </div>
            )}
          </div>

          {/* Quick Camera Controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => setTorchOn(!torchOn)}
              className="px-3 py-1.5 rounded-full bg-white border border-[#E6ECFA] hover:bg-[#EEF3FF] text-[#151A2D] text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              {torchOn ? (
                <>
                  <Flashlight className="w-3.5 h-3.5 text-[#F4B740]" />
                  <span>Flash On</span>
                </>
              ) : (
                <>
                  <FlashlightOff className="w-3.5 h-3.5 text-[#697086]" />
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
              <span>Upload from Gallery</span>
            </button>
          </div>
        </div>

        {/* Quick Merchant Selection */}
        <div className="p-4 bg-white border-t border-[#E6ECFA] overflow-y-auto flex-1">
          <div className="text-xs font-semibold text-[#151A2D] flex items-center justify-between mb-2">
            <span>Verified Nearby Merchants:</span>
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
                    <span>Pay ₹{m.suggestedAmount}</span>
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
