export type Language = 'en' | 'hi' | 'bg';
export type ThemeMode = 'phonepe' | 'emerald' | 'gold' | 'light';

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  balance: number;
  upiPinSet: boolean;
  isPrimary: boolean;
}

export interface UserWallet {
  name: string;
  phone: string;
  upiId: string;
  accountNumber: string;
  ifsc: string;
  balance: number;
  creditScore: number;
  village: string;
  panNumber: string;
  aadhaarNumber: string;
  bankAccount: BankAccount;
}

export type TransactionType = 
  | 'ADD_MONEY' 
  | 'SEND_MONEY' 
  | 'GOLD_LOAN' 
  | 'SILVER_LOAN' 
  | 'PERSONAL_LOAN' 
  | 'RECHARGE' 
  | 'EMI_PAYMENT' 
  | 'RECEIVE_MONEY';

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  title: string;
  subtitle: string;
  date: string;
  timestamp: number;
  status: TransactionStatus;
  referenceId: string;
  mode?: string;
  beneficiary?: string;
  sender?: string;
  notes?: string;
}

export type LoanType = 'GOLD' | 'SILVER' | 'PERSONAL';

export interface Loan {
  id: string;
  loanType: LoanType;
  title: string;
  principalAmount: number;
  remainingAmount: number;
  interestRate: number; // monthly % e.g. 0.79%
  tenureMonths: number;
  monthlyEmi: number;
  collateralDetails?: {
    weightGrams: number;
    purity?: string;
    itemType?: string;
    valuationAmount: number;
    hallmarkVerified?: boolean;
    ornamentImage?: string;
  };
  startDate: string;
  nextEmiDate: string;
  status: 'ACTIVE' | 'CLOSED';
}

export interface LiveRateItem {
  rate: number;
  change24h: number;
  high24h: number;
  low24h: number;
  updatedAt: string;
}

export interface MarketRates {
  gold24k: LiveRateItem;
  gold22k: LiveRateItem;
  gold18k: LiveRateItem;
  silver: LiveRateItem;
}

export interface QuickContact {
  id: string;
  name: string;
  upiId: string;
  phone: string;
  avatar: string;
  recentAmount?: number;
  role?: string;
}

