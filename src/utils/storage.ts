import { UserWallet, Transaction, Loan, MarketRates, QuickContact } from '../types';

const WALLET_STORAGE_KEY = 'bharatpay_wallet_v2';
const TRANSACTIONS_STORAGE_KEY = 'bharatpay_transactions_v2';
const LOANS_STORAGE_KEY = 'bharatpay_loans_v2';

export const initialWallet: UserWallet = {
  name: 'Aarav Sharma',
  phone: '9876543210',
  upiId: 'aaravsharma@okaxis',
  accountNumber: '389104928492',
  ifsc: 'SBIN0031849',
  balance: 24850,
  creditScore: 785,
  village: 'Central District, New Delhi',
  panNumber: 'ABCDE1234F',
  aadhaarNumber: '•••• •••• 8842',
  bankAccount: {
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 8492',
    ifsc: 'SBIN0031849',
    branch: 'City Main Branch',
    balance: 86450,
    upiPinSet: true,
    isPrimary: true
  }
};

export const initialMarketRates: MarketRates = {
  gold24k: {
    rate: 8855,
    change24h: 42,
    high24h: 8890,
    low24h: 8810,
    updatedAt: 'Live (MCX India)'
  },
  gold22k: {
    rate: 8145,
    change24h: 38,
    high24h: 8175,
    low24h: 8105,
    updatedAt: 'Live (IBJA)'
  },
  gold18k: {
    rate: 6685,
    change24h: 31,
    high24h: 6710,
    low24h: 6650,
    updatedAt: 'Live'
  },
  silver: {
    rate: 98.6,
    change24h: 1.2,
    high24h: 99.4,
    low24h: 97.2,
    updatedAt: 'Live (MCX)'
  }
};

export const quickContacts: QuickContact[] = [
  {
    id: 'qc-1',
    name: 'Rahul Verma (Agri Store)',
    upiId: 'rahul.verma@okaxis',
    phone: '9414289012',
    avatar: '🌾',
    recentAmount: 1850,
    role: 'Wholesale Mandi'
  },
  {
    id: 'qc-2',
    name: 'Vikram Singh',
    upiId: 'vikram.singh@sbi',
    phone: '9829145678',
    avatar: '🚜',
    recentAmount: 500,
    role: 'Equipment & Spares'
  },
  {
    id: 'qc-3',
    name: 'Gupta General Store',
    upiId: 'guptastore@paytm',
    phone: '9460234123',
    avatar: '🛒',
    recentAmount: 420,
    role: 'Daily Provisions'
  },
  {
    id: 'qc-4',
    name: 'City Care Pharmacy',
    upiId: 'citypharmacy@ybl',
    phone: '9782190845',
    avatar: '💊',
    recentAmount: 310,
    role: 'Medical & Healthcare'
  },
  {
    id: 'qc-5',
    name: 'Metro Highway Café',
    upiId: 'metrocafe@icici',
    phone: '9928109341',
    avatar: '☕',
    recentAmount: 160,
    role: 'Food & Beverages'
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'TXN-90231',
    type: 'ADD_MONEY',
    amount: 5000,
    title: 'Wallet Loaded',
    subtitle: 'Via State Bank of India (••8492)',
    date: 'Today, 11:20 AM',
    timestamp: Date.now() - 3600000 * 2,
    status: 'SUCCESS',
    referenceId: 'UPI/928374910283/SBIN',
    mode: 'UPI Instant Debit'
  },
  {
    id: 'TXN-87412',
    type: 'GOLD_LOAN',
    amount: 55000,
    title: 'Gold Loan Disbursed',
    subtitle: '10g (22K) Gold Sanctioned • 0.79% p.m.',
    date: 'Yesterday, 04:15 PM',
    timestamp: Date.now() - 3600000 * 24,
    status: 'SUCCESS',
    referenceId: 'LOAN-GL-772184',
    mode: 'Instant Wallet Credit'
  },
  {
    id: 'TXN-86301',
    type: 'SEND_MONEY',
    amount: 1200,
    title: 'Paid to Rahul Sharma',
    subtitle: 'UPI ID: rahulsharma@okhdfcbank',
    date: '15 Sep, 02:30 PM',
    timestamp: Date.now() - 3600000 * 48,
    status: 'SUCCESS',
    referenceId: 'UPI/817293849102',
    mode: 'BharatPay Wallet',
    beneficiary: 'Rahul Sharma'
  },
  {
    id: 'TXN-85112',
    type: 'RECHARGE',
    amount: 299,
    title: 'Jio Mobile Recharge',
    subtitle: '9876543210 (1.5GB/Day - 28 Days)',
    date: '14 Sep, 10:15 AM',
    timestamp: Date.now() - 3600000 * 72,
    status: 'SUCCESS',
    referenceId: 'JIO-RC-491023',
    mode: 'BharatPay Wallet'
  }
];

export const initialLoans: Loan[] = [
  {
    id: 'LN-GL-8491',
    loanType: 'GOLD',
    title: 'Gold Loan (22K Gold Jewelry)',
    principalAmount: 55000,
    remainingAmount: 55000,
    interestRate: 0.79,
    tenureMonths: 12,
    monthlyEmi: 4980,
    collateralDetails: {
      weightGrams: 10,
      purity: '22K (91.6% Hallmark)',
      itemType: 'Gold Chain & Ring',
      valuationAmount: 81450,
      hallmarkVerified: true
    },
    startDate: '15 Sep 2026',
    nextEmiDate: '15 Oct 2026',
    status: 'ACTIVE'
  }
];

export function getStoredWallet(): UserWallet {
  try {
    const data = localStorage.getItem(WALLET_STORAGE_KEY);
    return data ? JSON.parse(data) : initialWallet;
  } catch {
    return initialWallet;
  }
}

export function saveWallet(wallet: UserWallet) {
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  } catch {
    // ignore
  }
}

export function getStoredTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!data) return initialTransactions;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return initialTransactions;
    return parsed
      .filter((item): item is Transaction => Boolean(item && typeof item === 'object'))
      .map((item, idx) => ({
        ...item,
        id: item.id || `TXN-${idx}`,
        type: item.type || 'SEND_MONEY',
        amount: typeof item.amount === 'number' ? item.amount : 0,
        title: item.title || 'UPI Transaction',
        subtitle: item.subtitle || '',
        date: item.date || 'Recent',
        status: item.status || 'SUCCESS',
        referenceId: item.referenceId || `REF${Date.now()}`
      }));
  } catch {
    return initialTransactions;
  }
}

export function saveTransactions(transactions: Transaction[]) {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // ignore
  }
}

export function getStoredLoans(): Loan[] {
  try {
    const data = localStorage.getItem(LOANS_STORAGE_KEY);
    if (!data) return initialLoans;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return initialLoans;
    return parsed
      .filter((item): item is Loan => Boolean(item && typeof item === 'object'))
      .map((item, idx) => ({
        ...item,
        id: item.id || `LN-${idx}`,
        loanType: item.loanType || 'GOLD',
        title: item.title || 'Gold Loan',
        principalAmount: typeof item.principalAmount === 'number' ? item.principalAmount : 0,
        remainingAmount: typeof item.remainingAmount === 'number' ? item.remainingAmount : 0,
        interestRate: typeof item.interestRate === 'number' ? item.interestRate : 0.79,
        tenureMonths: typeof item.tenureMonths === 'number' ? item.tenureMonths : 12,
        monthlyEmi: typeof item.monthlyEmi === 'number' ? item.monthlyEmi : 0,
        startDate: item.startDate || 'Active',
        nextEmiDate: item.nextEmiDate || '15th',
        status: item.status || 'ACTIVE'
      }));
  } catch {
    return initialLoans;
  }
}

export function saveLoans(loans: Loan[]) {
  try {
    localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(loans));
  } catch {
    // ignore
  }
}

