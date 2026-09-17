import React, { useState, useEffect } from 'react';
import { 
  UserWallet, 
  Transaction, 
  Loan, 
  Language, 
  QuickContact,
  ThemeMode
} from './types';
import { 
  getStoredWallet, 
  saveWallet, 
  getStoredTransactions, 
  saveTransactions, 
  getStoredLoans, 
  saveLoans,
  quickContacts 
} from './utils/storage';
import { soundService } from './utils/audio';
import { themeConfigs, getStoredTheme } from './utils/theme';

// Components
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { WalletPage } from './components/WalletPage';
import { ProfilePage } from './components/ProfilePage';
import { RewardsPage } from './components/RewardsPage';
import { ThreeScreensShowcase } from './components/ThreeScreensShowcase';
import { LoansSection } from './components/LoansSection';
import { RechargeServices } from './components/RechargeServices';
import { WebsiteFooter } from './components/WebsiteFooter';
import { BottomNavBar, BottomNavTab } from './components/BottomNavBar';

// Modals
import { AddMoneyModal } from './components/AddMoneyModal';
import { SendMoneyModal } from './components/SendMoneyModal';
import { ScanPayModal } from './components/ScanPayModal';
import { ReceiveQRModal } from './components/ReceiveQRModal';
import { SoundboxModal } from './components/SoundboxModal';
import { UpiPinModal } from './components/UpiPinModal';
import { TransactionLimitsModal } from './components/TransactionLimitsModal';
import { LinkedAccountsModal } from './components/LinkedAccountsModal';
import { LinkedCardsModal } from './components/LinkedCardsModal';
import { AuthModal } from './components/AuthModal';
import { NotificationsModal, NotificationItem } from './components/NotificationsModal';

import { 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Volume2,
  MapPin,
  Sparkles,
  Smartphone,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [wallet, setWallet] = useState<UserWallet>(() => getStoredWallet());
  const [transactions, setTransactions] = useState<Transaction[]>(() => getStoredTransactions());
  const [loans, setLoans] = useState<Loan[]>(() => getStoredLoans());
  const [language, setLanguage] = useState<Language>('hi');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active page state ('home' | 'wallet' | 'loans' | 'rewards' | 'profile' | 'showcase')
  const [activePage, setActivePage] = useState<'home' | 'wallet' | 'loans' | 'rewards' | 'profile' | 'showcase'>('home');

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Notifications state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Credit Alert: Mandi Advance',
      message: '₹35,000.00 credited to wallet via SBI 6MLD Gharsana for Narma Cotton Advance.',
      time: '12 Sep, 11:30 AM',
      type: 'CREDIT',
      read: false
    },
    {
      id: 'n2',
      title: 'Security Alert: Biometrics Active',
      message: 'UPI 2.0 biometric fingerprint authentication is successfully linked to your wallet.',
      time: '14 Sep, 02:15 PM',
      type: 'SECURITY',
      read: false
    },
    {
      id: 'n3',
      title: 'Instant Gold Loan Eligibility',
      message: '75% LTV instant credit pre-approved against MCX gold at 0.79% interest rate.',
      time: 'Yesterday',
      type: 'LOAN',
      read: true
    }
  ]);

  // Modals state
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState<boolean>(false);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState<boolean>(false);
  const [isScanPayOpen, setIsScanPayOpen] = useState<boolean>(false);
  const [isMyQrOpen, setIsMyQrOpen] = useState<boolean>(false);
  const [isSoundboxOpen, setIsSoundboxOpen] = useState<boolean>(false);
  const [isLimitsOpen, setIsLimitsOpen] = useState<boolean>(false);
  const [isLinkedAccountsOpen, setIsLinkedAccountsOpen] = useState<boolean>(false);
  const [isLinkedCardsOpen, setIsLinkedCardsOpen] = useState<boolean>(false);

  // UPI PIN Modal State
  const [isUpiPinOpen, setIsUpiPinOpen] = useState<boolean>(false);
  const [upiPinAction, setUpiPinAction] = useState<'CHECK_BALANCE' | 'CONFIRM_SEND'>('CHECK_BALANCE');
  const [bankBalanceVisible, setBankBalanceVisible] = useState<boolean>(false);

  // Live Push Notification Banner
  const [pushNotice, setPushNotice] = useState<{ title: string; subtitle: string; amount?: number } | null>(null);

  // Sync with persistent storage
  useEffect(() => {
    saveWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveLoans(loans);
  }, [loans]);

  // Push notification helper
  const triggerNotification = (title: string, subtitle: string, amount?: number) => {
    setPushNotice({ title, subtitle, amount });
    setTimeout(() => {
      setPushNotice(null);
    }, 6000);
  };

  // Handle Load Money / Add Money Success
  const handleAddMoneySuccess = (amount: number, paymentMode: string) => {
    const updatedWallet = {
      ...wallet,
      balance: wallet.balance + amount
    };
    setWallet(updatedWallet);

    const newTxn: Transaction = {
      id: `TXN-LOAD-${Date.now().toString().slice(-6)}`,
      type: 'ADD_MONEY',
      amount,
      title: 'Wallet Loaded (पैसे जोड़े गए)',
      subtitle: `Via ${paymentMode} • SBI 6MLD Gharsana`,
      date: 'Just Now',
      timestamp: Date.now(),
      status: 'SUCCESS',
      referenceId: `REF${Date.now().toString().slice(-8)}`
    };
    setTransactions([newTxn, ...transactions]);

    triggerNotification(
      'Wallet Loaded Successfully! 💰',
      `₹${amount.toLocaleString('en-IN')} added to BharatPay Wallet`,
      amount
    );
  };

  // Handle Send Money Success
  const handleSendMoneySuccess = (amount: number, recipient: string, upiId: string, note?: string) => {
    const updatedWallet = {
      ...wallet,
      balance: Math.max(0, wallet.balance - amount)
    };
    setWallet(updatedWallet);

    const newTxn: Transaction = {
      id: `TXN-SEND-${Date.now().toString().slice(-6)}`,
      type: 'SEND_MONEY',
      amount,
      title: `Sent to ${recipient}`,
      subtitle: `${upiId} ${note ? `• ${note}` : ''}`,
      date: 'Just Now',
      timestamp: Date.now(),
      status: 'SUCCESS',
      referenceId: `UPI${Date.now().toString().slice(-10)}`,
      beneficiary: recipient
    };
    setTransactions([newTxn, ...transactions]);

    triggerNotification(
      'Payment Successful! 💸',
      `₹${amount.toLocaleString('en-IN')} transferred to ${recipient}`,
      amount
    );
  };

  // Handle Scan & Pay Success
  const handleScanPaySuccess = (amount: number, merchantName: string, upiId: string) => {
    const updatedWallet = {
      ...wallet,
      balance: Math.max(0, wallet.balance - amount)
    };
    setWallet(updatedWallet);

    const newTxn: Transaction = {
      id: `TXN-SCAN-${Date.now().toString().slice(-6)}`,
      type: 'SEND_MONEY',
      amount,
      title: merchantName,
      subtitle: `QR Scan Pay • ${upiId}`,
      date: 'Just Now',
      timestamp: Date.now(),
      status: 'SUCCESS',
      referenceId: `NPCI${Date.now().toString().slice(-10)}`,
      beneficiary: merchantName
    };
    setTransactions([newTxn, ...transactions]);

    triggerNotification(
      'Merchant QR Paid! 📱',
      `₹${amount.toLocaleString('en-IN')} paid to ${merchantName}`,
      amount
    );
  };

  // Handle Bill / Recharge Payment
  const handleRechargeSuccess = (amount: number, serviceName: string, detail: string) => {
    const updatedWallet = {
      ...wallet,
      balance: Math.max(0, wallet.balance - amount)
    };
    setWallet(updatedWallet);

    const newTxn: Transaction = {
      id: `TXN-BILL-${Date.now().toString().slice(-6)}`,
      type: 'RECHARGE',
      amount,
      title: serviceName,
      subtitle: `${detail} • BBPS Bharat Connect`,
      date: 'Just Now',
      timestamp: Date.now(),
      status: 'SUCCESS',
      referenceId: `BBPS${Date.now().toString().slice(-8)}`
    };
    setTransactions([newTxn, ...transactions]);

    triggerNotification(
      'Bill Payment Successful! ⚡',
      `₹${amount.toLocaleString('en-IN')} paid for ${serviceName}`,
      amount
    );
  };

  // Handle Gold / Silver Loan Sanction
  const handleSanctionLoan = (newLoan: Loan) => {
    const updatedWallet = {
      ...wallet,
      balance: wallet.balance + newLoan.principalAmount
    };
    setWallet(updatedWallet);
    setLoans([newLoan, ...loans]);

    const newTxn: Transaction = {
      id: `TXN-LOAN-${Date.now().toString().slice(-6)}`,
      type: newLoan.loanType === 'GOLD' ? 'GOLD_LOAN' : 'SILVER_LOAN',
      amount: newLoan.principalAmount,
      title: `${newLoan?.title || 'Loan'} Disbursed`,
      subtitle: `75% LTV Disbursed to Wallet • ${newLoan?.tenureMonths || 12}M EMI`,
      date: 'Just Now',
      timestamp: Date.now(),
      status: 'SUCCESS',
      referenceId: `LN${newLoan?.id || Date.now()}`
    };
    setTransactions([newTxn, ...transactions]);

    triggerNotification(
      'Gold Loan Sanctioned & Disbursed! 🏆',
      `₹${(newLoan?.principalAmount || 0).toLocaleString('en-IN')} credited to your wallet balance`,
      newLoan?.principalAmount
    );
  };

  // Handle Loan EMI Payment
  const handlePayEmi = (loanId: string, emiAmount: number): boolean => {
    if (wallet.balance < emiAmount) {
      soundService.playError();
      alert('अपर्याप्त वॉलेट बैलेंस (Insufficient Wallet Balance)! कृपया पहले वॉलेट में पैसे जोड़ें।');
      setIsAddMoneyOpen(true);
      return false;
    }

    const updatedWallet = {
      ...wallet,
      balance: wallet.balance - emiAmount
    };
    setWallet(updatedWallet);

    const updatedLoans = loans.map((loan) => {
      if (loan.id === loanId) {
        const remaining = Math.max(0, loan.remainingAmount - emiAmount);
        return {
          ...loan,
          remainingAmount: remaining,
          status: (remaining === 0 ? 'CLOSED' : 'ACTIVE') as 'ACTIVE' | 'CLOSED'
        };
      }
      return loan;
    });
    setLoans(updatedLoans);

    const newTxn: Transaction = {
      id: `TXN-EMI-${Date.now().toString().slice(-6)}`,
      type: 'EMI_PAYMENT',
      amount: emiAmount,
      title: 'Loan EMI Repayment (किस्त जमा)',
      subtitle: `Loan #${loanId} • SBI Escrow Account`,
      date: 'Just Now',
      timestamp: Date.now(),
      status: 'SUCCESS',
      referenceId: `EMI${Date.now().toString().slice(-8)}`
    };
    setTransactions([newTxn, ...transactions]);

    triggerNotification(
      'EMI Payment Successful! ✅',
      `₹${emiAmount.toLocaleString('en-IN')} EMI repaid for Loan #${loanId}`,
      emiAmount
    );
    return true;
  };

  // Add Cashback from Scratch Cards
  const handleAddCashback = (amount: number) => {
    const updatedWallet = {
      ...wallet,
      balance: wallet.balance + amount
    };
    setWallet(updatedWallet);

    const newTxn: Transaction = {
      id: `TXN-REWARD-${Date.now().toString().slice(-6)}`,
      type: 'ADD_MONEY',
      amount,
      title: 'Cashback Reward (कैशबैक ईनाम)',
      subtitle: 'BharatPay Scratch Card Bonus',
      date: 'Just Now',
      timestamp: Date.now(),
      status: 'SUCCESS',
      referenceId: `RWD${Date.now().toString().slice(-8)}`
    };
    setTransactions([newTxn, ...transactions]);

    triggerNotification(
      'Cashback Credited! 🎁',
      `₹${amount.toLocaleString('en-IN')} added to your wallet`,
      amount
    );
  };

  const handleVerifyUpiPin = (enteredPin: string) => {
    if (enteredPin === '1234') {
      soundService.playSuccess();
      setIsUpiPinOpen(false);
      if (upiPinAction === 'CHECK_BALANCE') {
        setBankBalanceVisible(true);
        triggerNotification('SBI खाता बैलेंस सत्यापित', `उपलब्ध शेष: ₹${wallet.bankAccount.balance.toLocaleString('en-IN')}`);
      }
    } else {
      soundService.playError();
      alert('गलत UPI PIN! कृपया सही 4-अंकों का पिन दर्ज करें (डिफ़ॉल्ट: 1234)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white transition-colors relative">
      {/* Institutional Navigation Header */}
      <Navbar
        wallet={wallet}
        language={language}
        onLanguageChange={setLanguage}
        onOpenScan={() => setIsScanPayOpen(true)}
        onOpenMyQr={() => setIsMyQrOpen(true)}
        onOpenSoundbox={() => setIsSoundboxOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeTab={activePage}
        onSelectTab={(page) => setActivePage(page)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={notificationsList.filter(n => !n.read).length}
        onOpenAuth={() => setIsAuthOpen(true)}
        isAuthenticated={isAuthenticated}
      />

      {/* Push Notification Pill */}
      {pushNotice && pushNotice.title && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-slide-in-down p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-start gap-3 text-slate-900">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold text-slate-900">{pushNotice.title}</h5>
            <p className="text-[11px] text-slate-600 mt-0.5">{pushNotice.subtitle || ''}</p>
          </div>
          <button
            onClick={() => setPushNotice(null)}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area: Responsive & Page-Based */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 lg:pb-8 relative z-10">
        {/* Desktop View Switcher Pills */}
        <div className="hidden lg:flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Current Section:</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xs uppercase tracking-wide">
              {activePage === 'home' && '1. Dashboard'}
              {activePage === 'wallet' && '2. Wallet & Passbook'}
              {activePage === 'loans' && '3. Gold & Silver Lending'}
              {activePage === 'rewards' && '4. Rewards & Offers'}
              {activePage === 'profile' && '5. Profile & Settings'}
              {activePage === 'showcase' && '3-Screen Applet Mockup'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundService.playClick();
                setActivePage(activePage === 'showcase' ? 'home' : 'showcase');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePage === 'showcase'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{activePage === 'showcase' ? 'Return to Standard Dashboard' : 'View Mobile Showcase Mockup'}</span>
            </button>
          </div>
        </div>

        {/* Page Routing */}
        {activePage === 'showcase' ? (
          /* Live 3 Screens Mockup matching reference image */
          <ThreeScreensShowcase
            wallet={wallet}
            transactions={transactions}
            language={language}
            onLanguageChange={setLanguage}
            onOpenAddMoney={() => setIsAddMoneyOpen(true)}
            onOpenSendMoney={() => setIsSendMoneyOpen(true)}
            onOpenScan={() => setIsScanPayOpen(true)}
            onOpenMyQr={() => setIsMyQrOpen(true)}
            onOpenLoans={() => setActivePage('loans')}
            onOpenBills={() => setActivePage('home')}
            onOpenLimits={() => setIsLimitsOpen(true)}
            onOpenLinkedAccounts={() => setIsLinkedAccountsOpen(true)}
            onOpenLinkedCards={() => setIsLinkedCardsOpen(true)}
            onCheckBankBalance={() => {
              setUpiPinAction('CHECK_BALANCE');
              setIsUpiPinOpen(true);
            }}
            onOpenSoundbox={() => setIsSoundboxOpen(true)}
            onSelectTab={(tab) => setActivePage(tab)}
          />
        ) : (
          <div className="w-full">
            {/* Page 1: Home Screen */}
            {activePage === 'home' && (
              <HomePage
                wallet={wallet}
                transactions={transactions}
                language={language}
                onOpenAddMoney={() => setIsAddMoneyOpen(true)}
                onOpenSendMoney={() => setIsSendMoneyOpen(true)}
                onOpenScan={() => setIsScanPayOpen(true)}
                onOpenMyQr={() => setIsMyQrOpen(true)}
                onOpenLoans={() => setActivePage('loans')}
                onOpenBills={() => {
                  const el = document.getElementById('bbps-recharge-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onSelectTab={(tab) => setActivePage(tab)}
              />
            )}

            {/* Page 2: Wallet Screen */}
            {activePage === 'wallet' && (
              <WalletPage
                wallet={wallet}
                transactions={transactions}
                language={language}
                onOpenAddMoney={() => setIsAddMoneyOpen(true)}
                onOpenSendMoney={() => setIsSendMoneyOpen(true)}
                onOpenLimits={() => setIsLimitsOpen(true)}
                onOpenLinkedAccounts={() => setIsLinkedAccountsOpen(true)}
                onOpenLinkedCards={() => setIsLinkedCardsOpen(true)}
                onCheckBankBalance={() => {
                  setUpiPinAction('CHECK_BALANCE');
                  setIsUpiPinOpen(true);
                }}
              />
            )}

            {/* Page 3: Loans & Gold Vault Screen */}
            {activePage === 'loans' && (
              <div className="w-full">
                <LoansSection
                  wallet={wallet}
                  loans={loans}
                  language={language}
                  onSanctionLoan={handleSanctionLoan}
                  onPayEmi={handlePayEmi}
                />
              </div>
            )}

            {/* Page 4: Rewards Screen */}
            {activePage === 'rewards' && (
              <RewardsPage onAddCashbackToWallet={handleAddCashback} />
            )}

            {/* Page 5: Profile Screen */}
            {activePage === 'profile' && (
              <ProfilePage
                wallet={wallet}
                language={language}
                onLanguageChange={setLanguage}
                onOpenMyQr={() => setIsMyQrOpen(true)}
                onOpenSoundbox={() => setIsSoundboxOpen(true)}
                onOpenLimits={() => setIsLimitsOpen(true)}
                onOpenLinkedAccounts={() => setIsLinkedAccountsOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}
          </div>
        )}

        {/* BBPS Quick Recharge Section anchor when clicked from home */}
        {activePage === 'home' && (
          <div id="bbps-recharge-section" className="mt-8 w-full max-w-4xl mx-auto">
            <RechargeServices
              wallet={wallet}
              language={language}
              onSuccess={handleRechargeSuccess}
            />
          </div>
        )}
      </main>

      {/* Website Institutional Footer */}
      <WebsiteFooter />

      {/* Fixed Bottom Navigation Bar for Mobile Viewports */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNavBar
          activeTab={activePage === 'showcase' ? 'home' : activePage}
          onSelectTab={(tab: BottomNavTab) => {
            setActivePage(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenScan={() => setIsScanPayOpen(true)}
        />
      </div>

      {/* ALL INTERACTIVE MODALS */}
      <AddMoneyModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
        onSuccess={handleAddMoneySuccess}
        currentBalance={wallet.balance}
      />

      <SendMoneyModal
        isOpen={isSendMoneyOpen}
        onClose={() => setIsSendMoneyOpen(false)}
        onSuccess={handleSendMoneySuccess}
        currentBalance={wallet.balance}
        contacts={quickContacts}
      />

      <ScanPayModal
        isOpen={isScanPayOpen}
        onClose={() => setIsScanPayOpen(false)}
        onSuccess={handleScanPaySuccess}
        currentBalance={wallet.balance}
      />

      <ReceiveQRModal
        isOpen={isMyQrOpen}
        onClose={() => setIsMyQrOpen(false)}
        wallet={wallet}
      />

      <SoundboxModal
        isOpen={isSoundboxOpen}
        onClose={() => setIsSoundboxOpen(false)}
        merchantName={wallet.name}
      />

      <TransactionLimitsModal
        isOpen={isLimitsOpen}
        onClose={() => setIsLimitsOpen(false)}
      />

      <LinkedAccountsModal
        isOpen={isLinkedAccountsOpen}
        onClose={() => setIsLinkedAccountsOpen(false)}
        onCheckBalance={() => {
          setUpiPinAction('CHECK_BALANCE');
          setIsUpiPinOpen(true);
        }}
      />

      <LinkedCardsModal
        isOpen={isLinkedCardsOpen}
        onClose={() => setIsLinkedCardsOpen(false)}
      />

      <UpiPinModal
        isOpen={isUpiPinOpen}
        onClose={() => setIsUpiPinOpen(false)}
        onSuccess={handleVerifyUpiPin}
        actionTitle={upiPinAction === 'CHECK_BALANCE' ? 'बैंक बैलेंस जांचें (Check Balance)' : 'भुगतान सत्यापित करें'}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(name, phone) => {
          setIsAuthenticated(true);
          setIsAuthOpen(false);
          setWallet(prev => ({ ...prev, name }));
          triggerNotification('Welcome Back! 🛡️', `Logged in successfully as ${name}`);
        }}
      />

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notificationsList}
        onClearAll={() => setNotificationsList([])}
        onMarkAllAsRead={() => {
          setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
        }}
      />
    </div>
  );
}
