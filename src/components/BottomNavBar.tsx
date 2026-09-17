import React from 'react';
import { Home, Wallet, QrCode, Trophy, User } from 'lucide-react';
import { soundService } from '../utils/audio';

export type BottomNavTab = 'home' | 'wallet' | 'loans' | 'rewards' | 'profile' | 'showcase';

interface BottomNavBarProps {
  activeTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  onOpenScan: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenScan
}) => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="w-full bg-white/95 backdrop-blur-md border-t border-[#E6ECFA] shadow-[0_-4px_20px_rgba(21,26,45,0.05)] px-2 py-1.5 transition-all"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Tab 1: Home Dashboard */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onSelectTab('home');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[46px] ${
            activeTab === 'home'
              ? 'text-[#2447E8] font-bold'
              : 'text-[#697086] hover:text-[#151A2D]'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2447E8] mt-0.5" />
          )}
        </button>

        {/* Tab 2: Wallet & Passbook */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onSelectTab('wallet');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[46px] ${
            activeTab === 'wallet'
              ? 'text-[#2447E8] font-bold'
              : 'text-[#697086] hover:text-[#151A2D]'
          }`}
        >
          <Wallet className={`w-5 h-5 ${activeTab === 'wallet' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Wallet</span>
          {activeTab === 'wallet' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2447E8] mt-0.5" />
          )}
        </button>

        {/* Center Floating Action Button: Scan & Pay QR */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-5 relative z-10">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onOpenScan();
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1738C8] via-[#2447E8] to-[#315BFF] p-0.5 shadow-lg shadow-[#2447E8]/35 flex items-center justify-center active:scale-95 transition-all group cursor-pointer ring-4 ring-white"
            title="Scan & Pay any QR"
            aria-label="Scan & Pay QR"
          >
            <div className="w-full h-full rounded-full flex items-center justify-center text-white">
              <QrCode className="w-6 h-6 stroke-[2.2]" />
            </div>
          </button>
          <span className="text-[9px] font-bold text-[#151A2D] mt-0.5 tracking-tight">Scan &amp; Pay</span>
        </div>

        {/* Tab 4: Rewards & Offers */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onSelectTab('rewards');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[46px] ${
            activeTab === 'rewards'
              ? 'text-[#2447E8] font-bold'
              : 'text-[#697086] hover:text-[#151A2D]'
          }`}
        >
          <Trophy className={`w-5 h-5 ${activeTab === 'rewards' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Rewards</span>
          {activeTab === 'rewards' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2447E8] mt-0.5" />
          )}
        </button>

        {/* Tab 5: Account / Profile */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            onSelectTab('profile');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer min-h-[46px] ${
            activeTab === 'profile'
              ? 'text-[#2447E8] font-bold'
              : 'text-[#697086] hover:text-[#151A2D]'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Profile</span>
          {activeTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#2447E8] mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
