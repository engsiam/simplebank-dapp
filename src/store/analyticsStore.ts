import { create } from 'zustand';
import { AnalyticsStore } from '@/types/analytics';

const initialState = {
  totalDeposited: '0',
  totalWithdrawn: '0',
  contractBalance: '0',
  userBalance: '0',
  depositHistory: [],
  withdrawalHistory: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  ...initialState,

  setTotalDeposited: (amount) => set({ totalDeposited: amount }),
  setTotalWithdrawn: (amount) => set({ totalWithdrawn: amount }),
  setContractBalance: (amount) => set({ contractBalance: amount }),
  setUserBalance: (amount) => set({ userBalance: amount }),
  setDepositHistory: (history) => set({ depositHistory: history }),
  setWithdrawalHistory: (history) => set({ withdrawalHistory: history }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));