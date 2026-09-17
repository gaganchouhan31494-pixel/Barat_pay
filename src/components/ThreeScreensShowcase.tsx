import React, { useState } from 'react';
import { HomePage } from './HomePage';
import { WalletPage } from './WalletPage';
import { ProfilePage } from './ProfilePage';
import { UserWallet, Transaction, Language } from '../types';
import { Wifi, Battery, Sparkles, Smartphone, Volume2, PlusCircle, Send, QrCode, Sliders, Check } from 'lucide-react';
import { soundService } from '../utils/audio';

interface ThreeScreensShowcaseProps {
  wallet: UserWallet;
  transactions: Transaction[];
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAddMoney: () => void;
  onOpenSendMoney: () => void;
  onOpenScan: () => void;
  onOpenMyQr: () => void;
  onOpenLoans: () => void;
  onOpenBills: () => void;
  onOpenLimits: () => void;
  onOpenLinkedAccounts: () => void;
  onOpenLinkedCards: () => void;
  onCheckBankBalance: () => void;
  onOpenSoundbox: () => void;
  onSelectTab: (tab: 'home' | 'wallet' | 'loans' | 'rewards' | 'profile') => void;
}

// Mini Bottom Nav Bar for inside-phone realism
const PhoneMiniNavBar: React.FC<{
  active: 'home' | 'wallet' | 'rewards' | 'profile';
  onScan: () => void;
  onTab: (tab: 'home' | 'wallet' | 'loans' | 'rewards' | 'profile') => void;
}> = ({ active, onScan, onTab }) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-[#E6ECFA] px-4 py-2 flex items-center justify-between text-[10px] shrink-0 z-20">
      <button 
        type="button"
        onClick={() => onTab('home')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${active === 'home' ? 'text-[#2447E8] font-bold' : 'text-[#697086]'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active === 'home' ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Home</span>
      </button>

      <button 
        type="button"
        onClick={() => onTab('wallet')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${active === 'wallet' ? 'text-[#2447E8] font-bold' : 'text-[#697086]'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active === 'wallet' ? 2.5 : 2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span>Wallet</span>
      </button>

      {/* Floating Center Scan button */}
      <button 
        type="button"
        onClick={onScan}
        className="w-10 h-10 -mt-4 rounded-full bg-[#2447E8] text-white flex items-center justify-center shadow-md shadow-[#2447E8]/30 ring-2 ring-white cursor-pointer active:scale-95"
      >
        <QrCode className="w-5 h-5 stroke-[2.2]" />
      </button>

      <button 
        type="button"
        onClick={() => onTab('rewards')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${active === 'rewards' ? 'text-[#2447E8] font-bold' : 'text-[#697086]'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active === 'rewards' ? 2.5 : 2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
        <span>Rewards</span>
      </button>

      <button 
        type="button"
        onClick={() => onTab('profile')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer ${active === 'profile' ? 'text-[#2447E8] font-bold' : 'text-[#697086]'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active === 'profile' ? 2.5 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Profile</span>
      </button>
    </div>
  );
};

export const ThreeScreensShowcase: React.FC<ThreeScreensShowcaseProps> = (props) => {
  const [activeScreenFilter, setActiveScreenFilter] = useState<'all' | 'home' | 'wallet' | 'profile'>('all');
  const [zoomScale, setZoomScale] = useState<'fit' | '100' | '90' | '80'>('fit');

  const scaleClass = {
    fit: 'scale-100',
    '100': 'scale-100',
    '90': 'scale-90 origin-top',
    '80': 'scale-[0.82] origin-top'
  }[zoomScale];

  return (
    <div className="w-full py-2 px-1 sm:px-3">
      {/* Top Header Badge & Screen Switcher */}
      <div className="text-center mb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200/90 text-blue-900 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span className="text-xs font-black tracking-wide uppercase">
            3-स्क्रीन लाइव शोकेस • Side-by-Side Reference Design
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          होम, वॉलेट व प्रोफाइल — लाइव 3D इंटरैक्टिव फोन
        </h2>

        <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
          तीनों स्क्रीन्स असली स्मार्टफोन में लाइव काम कर रही हैं। किसी भी बटन पर क्लिक करके पैसे जोड़ें, UPI ट्रांसफर करें, या सीमाएं जांचें।
        </p>

        {/* Segmented Screen Selector (Crucial for mobile and focused screen inspection!) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <div className="bg-white p-1 rounded-2xl border border-[#E6ECFA] shadow-xs flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setActiveScreenFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeScreenFilter === 'all'
                  ? 'bg-[#2447E8] text-white shadow-xs'
                  : 'text-[#697086] hover:text-[#151A2D] hover:bg-[#F7F9FF]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>तीनों स्क्रीन्स (3 Phones)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setActiveScreenFilter('home');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeScreenFilter === 'home'
                  ? 'bg-[#2447E8] text-white shadow-xs'
                  : 'text-[#697086] hover:text-[#151A2D] hover:bg-[#F7F9FF]'
              }`}
            >
              <span>1. Home (होम)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setActiveScreenFilter('wallet');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeScreenFilter === 'wallet'
                  ? 'bg-[#2447E8] text-white shadow-xs'
                  : 'text-[#697086] hover:text-[#151A2D] hover:bg-[#F7F9FF]'
              }`}
            >
              <span>2. Wallet (वॉलेट)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setActiveScreenFilter('profile');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeScreenFilter === 'profile'
                  ? 'bg-[#2447E8] text-white shadow-xs'
                  : 'text-[#697086] hover:text-[#151A2D] hover:bg-[#F7F9FF]'
              }`}
            >
              <span>3. Profile (प्रोफाइल)</span>
            </button>
          </div>

          {/* Zoom controls for large screens */}
          {activeScreenFilter === 'all' && (
            <div className="hidden xl:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-indigo-200/80 shadow-xs text-xs font-bold">
              <span className="text-slate-400 px-2 text-[11px]">ज़ूम:</span>
              {(['100', '90', '80'] as const).map(z => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoomScale(z)}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    zoomScale === z ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Simulator Action Buttons */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              props.onOpenAddMoney();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Quick Add Money</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              props.onOpenSendMoney();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transfer UPI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              props.onOpenScan();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan &amp; Pay</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              props.onOpenSoundbox();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>साउंडबॉक्स वॉयस</span>
          </button>
        </div>
      </div>

      {/* 3 Phones Side-by-Side Container (Matching the reference design image) */}
      <div className={`transition-transform duration-300 ${scaleClass}`}>
        <div className={`grid gap-6 xl:gap-8 mx-auto items-start ${
          activeScreenFilter === 'all' 
            ? 'grid-cols-1 lg:grid-cols-3 max-w-[1300px]' 
            : 'grid-cols-1 max-w-[420px]'
        }`}>
          
          {/* ========================================================= */}
          {/* PHONE 1: HOME SCREEN                                     */}
          {/* ========================================================= */}
          {(activeScreenFilter === 'all' || activeScreenFilter === 'home') && (
            <div className="flex flex-col items-center">
              <div className="mb-2.5 text-center">
                <span className="text-xs font-black px-3.5 py-1 rounded-full bg-blue-600 text-white shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Screen 1 • Home (होम स्क्रीन)
                </span>
              </div>

              {/* Realistic iPhone Titanium Frame */}
              <div className="w-full max-w-[390px] bg-slate-950 rounded-[50px] p-2.5 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 transition-all hover:shadow-[0_30px_80px_-15px_rgba(37,99,235,0.35)]">
                <div className="w-full bg-slate-50 rounded-[42px] overflow-hidden flex flex-col relative border border-slate-200/50">
                  {/* Status bar with Dynamic Island */}
                  <div className="h-10 px-6 bg-[#2546e8] text-white flex items-center justify-between text-[11px] font-bold shrink-0 relative z-30">
                    <span>9:41</span>
                    {/* Dynamic Island Pill */}
                    <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]/80" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span>5G</span>
                      <Wifi className="w-3.5 h-3.5" />
                      <Battery className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  {/* Inner Screen Scroll Container */}
                  <div className="p-3 sm:p-3.5 overflow-y-auto max-h-[720px] bg-slate-50/70">
                    <HomePage
                      wallet={props.wallet}
                      transactions={props.transactions}
                      language={props.language}
                      onOpenAddMoney={props.onOpenAddMoney}
                      onOpenSendMoney={props.onOpenSendMoney}
                      onOpenScan={props.onOpenScan}
                      onOpenMyQr={props.onOpenMyQr}
                      onOpenLoans={props.onOpenLoans}
                      onOpenBills={props.onOpenBills}
                      onSelectTab={props.onSelectTab}
                    />
                  </div>

                  {/* Docked Mini Bottom Navigation */}
                  <PhoneMiniNavBar
                    active="home"
                    onScan={props.onOpenScan}
                    onTab={props.onSelectTab}
                  />

                  {/* iOS Home Indicator Bar */}
                  <div className="h-4 bg-white flex items-center justify-center shrink-0">
                    <div className="w-28 h-1 bg-slate-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHONE 2: WALLET SCREEN                                   */}
          {/* ========================================================= */}
          {(activeScreenFilter === 'all' || activeScreenFilter === 'wallet') && (
            <div className="flex flex-col items-center">
              <div className="mb-2.5 text-center">
                <span className="text-xs font-black px-3.5 py-1 rounded-full bg-indigo-600 text-white shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Screen 2 • Wallet (वॉलेट व सीमाएं)
                </span>
              </div>

              {/* Realistic iPhone Titanium Frame */}
              <div className="w-full max-w-[390px] bg-slate-950 rounded-[50px] p-2.5 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 transition-all hover:shadow-[0_30px_80px_-15px_rgba(99,102,241,0.35)]">
                <div className="w-full bg-slate-50 rounded-[42px] overflow-hidden flex flex-col relative border border-slate-200/50">
                  {/* Status bar with Dynamic Island */}
                  <div className="h-10 px-6 bg-white text-slate-800 flex items-center justify-between text-[11px] font-bold shrink-0 border-b border-slate-100 relative z-30">
                    <span>9:41</span>
                    {/* Dynamic Island Pill */}
                    <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]/80" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span>5G</span>
                      <Wifi className="w-3.5 h-3.5" />
                      <Battery className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>

                  {/* Inner Screen Scroll Container */}
                  <div className="p-3 sm:p-3.5 overflow-y-auto max-h-[720px] bg-slate-50/70">
                    <WalletPage
                      wallet={props.wallet}
                      transactions={props.transactions}
                      language={props.language}
                      onOpenAddMoney={props.onOpenAddMoney}
                      onOpenSendMoney={props.onOpenSendMoney}
                      onOpenLimits={props.onOpenLimits}
                      onOpenLinkedAccounts={props.onOpenLinkedAccounts}
                      onOpenLinkedCards={props.onOpenLinkedCards}
                      onCheckBankBalance={props.onCheckBankBalance}
                    />
                  </div>

                  {/* Docked Mini Bottom Navigation */}
                  <PhoneMiniNavBar
                    active="wallet"
                    onScan={props.onOpenScan}
                    onTab={props.onSelectTab}
                  />

                  {/* iOS Home Indicator Bar */}
                  <div className="h-4 bg-white flex items-center justify-center shrink-0">
                    <div className="w-28 h-1 bg-slate-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHONE 3: PROFILE SCREEN                                  */}
          {/* ========================================================= */}
          {(activeScreenFilter === 'all' || activeScreenFilter === 'profile') && (
            <div className="flex flex-col items-center">
              <div className="mb-2.5 text-center">
                <span className="text-xs font-black px-3.5 py-1 rounded-full bg-purple-600 text-white shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Screen 3 • Profile (प्रोफाइल व सेटिंग्स)
                </span>
              </div>

              {/* Realistic iPhone Titanium Frame */}
              <div className="w-full max-w-[390px] bg-slate-950 rounded-[50px] p-2.5 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 transition-all hover:shadow-[0_30px_80px_-15px_rgba(168,85,247,0.35)]">
                <div className="w-full bg-slate-50 rounded-[42px] overflow-hidden flex flex-col relative border border-slate-200/50">
                  {/* Status bar with Dynamic Island */}
                  <div className="h-10 px-6 bg-[#2546e8] text-white flex items-center justify-between text-[11px] font-bold shrink-0 relative z-30">
                    <span>9:41</span>
                    {/* Dynamic Island Pill */}
                    <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]/80" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span>5G</span>
                      <Wifi className="w-3.5 h-3.5" />
                      <Battery className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  {/* Inner Screen Scroll Container */}
                  <div className="p-3 sm:p-3.5 overflow-y-auto max-h-[720px] bg-slate-50/70">
                    <ProfilePage
                      wallet={props.wallet}
                      language={props.language}
                      onLanguageChange={props.onLanguageChange}
                      onOpenMyQr={props.onOpenMyQr}
                      onOpenSoundbox={props.onOpenSoundbox}
                      onOpenLimits={props.onOpenLimits}
                      onOpenLinkedAccounts={props.onOpenLinkedAccounts}
                    />
                  </div>

                  {/* Docked Mini Bottom Navigation */}
                  <PhoneMiniNavBar
                    active="profile"
                    onScan={props.onOpenScan}
                    onTab={props.onSelectTab}
                  />

                  {/* iOS Home Indicator Bar */}
                  <div className="h-4 bg-white flex items-center justify-center shrink-0">
                    <div className="w-28 h-1 bg-slate-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
