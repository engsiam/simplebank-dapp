export interface TransactionData {
  hash: string;
  amount: string;
  timestamp: number;
  date: string;
}

export interface AnalyticsState {
  totalDeposited: string;
  totalWithdrawn: string;
  contractBalance: string;
  userBalance: string;
  depositHistory: TransactionData[];
  withdrawalHistory: TransactionData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface AnalyticsActions {
  setTotalDeposited: (amount: string) => void;
  setTotalWithdrawn: (amount: string) => void;
  setContractBalance: (amount: string) => void;
  setUserBalance: (amount: string) => void;
  setDepositHistory: (history: TransactionData[]) => void;
  setWithdrawalHistory: (history: TransactionData[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type AnalyticsStore = AnalyticsState & AnalyticsActions;