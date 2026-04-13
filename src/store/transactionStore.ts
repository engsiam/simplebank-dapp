import { create } from 'zustand';
import { Transaction, TransactionFilters, PaginationState, FilterType } from '@/types/transaction';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilters;
  pagination: PaginationState;
}

interface TransactionActions {
  setTransactions: (transactions: Transaction[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilterType: (type: FilterType) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  reset: () => void;
}

type TransactionStore = TransactionState & TransactionActions;

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  filters: {
    type: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  ...initialState,

  setTransactions: (transactions) => set({ transactions }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setFilterType: (type) =>
    set((state) => ({
      filters: { ...state.filters, type },
      pagination: { ...state.pagination, page: 1 },
    })),

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
      pagination: { ...state.pagination, page: 1 },
    })),

  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, page },
    })),

  setLimit: (limit) =>
    set((state) => ({
      pagination: { ...state.pagination, limit, page: 1 },
    })),

  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),

  reset: () => set(initialState),
}));