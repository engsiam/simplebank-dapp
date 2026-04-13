import { useCallback, useRef, useState } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { fetchTransactionEvents, filterTransactions as filterTxns } from '@/lib/transactions';
import { FilterType, Transaction } from '@/types/transaction';

const DEBOUNCE_MS = 300;
const CACHE_DURATION = 30000;

export function useTransactions() {
  const {
    transactions,
    isLoading,
    error,
    filters,
    pagination,
    setTransactions,
    setIsLoading,
    setError,
    setFilterType,
    setSearch,
    setPage,
    setPagination,
  } = useTransactionStore();

  const [searchValue, setSearchValue] = useState(filters.search);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  const fetchTransactions = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && now - lastFetchRef.current < CACHE_DURATION && transactions.length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      lastFetchRef.current = now;

      const events = await fetchTransactionEvents();
      setTransactions(events);
      setPagination({ total: events.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, [setTransactions, setIsLoading, setError, setPagination, transactions.length]);

  const filteredTransactions = useCallback((): Transaction[] => {
    return filterTxns(transactions, filters.type as 'all' | 'deposit' | 'withdrawal', filters.search);
  }, [transactions, filters.type, filters.search]);

  const paginatedTransactions = useCallback((): Transaction[] => {
    const filtered = filteredTransactions();
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filtered.slice(start, end);
  }, [filteredTransactions, pagination.page, pagination.limit]);

  const totalPages = Math.ceil(filteredTransactions().length / pagination.limit);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, DEBOUNCE_MS);
  }, [setSearch]);

  const handleFilterChange = useCallback((type: FilterType) => {
    setFilterType(type);
  }, [setFilterType]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, [setPage]);

  const formatAmount = useCallback((wei: string): string => {
    if (!wei || wei === '0') return '0';
    try {
      return (Number(BigInt(wei)) / 1e18).toFixed(6);
    } catch {
      return '0';
    }
  }, []);

  const formatRelativeTime = useCallback((timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds > 0) return `${seconds}s ago`;
    return 'Just now';
  }, []);

  return {
    transactions: paginatedTransactions(),
    totalTransactions: filteredTransactions().length,
    isLoading,
    error,
    filters,
    pagination,
    totalPages,
    fetchTransactions,
    handleFilterChange,
    handleSearchChange,
    handlePageChange,
    formatAmount,
    formatRelativeTime,
    searchValue,
  };
}