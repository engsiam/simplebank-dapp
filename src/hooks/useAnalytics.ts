import { useCallback, useMemo } from 'react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useWalletStore } from '@/store/useWalletStore';
import {
  getContractBalance,
  getUserBalance,
  getDepositEvents,
  getWithdrawalEvents,
  calculateTotalDeposited,
  calculateTotalWithdrawn,
} from '@/lib/analytics';

const CACHE_DURATION = 30000;

export function useAnalytics() {
  const { address } = useWalletStore();
  const {
    totalDeposited,
    totalWithdrawn,
    contractBalance,
    userBalance,
    depositHistory,
    withdrawalHistory,
    isLoading,
    error,
    lastUpdated,
    setTotalDeposited,
    setTotalWithdrawn,
    setContractBalance,
    setUserBalance,
    setDepositHistory,
    setWithdrawalHistory,
    setIsLoading,
    setError,
  } = useAnalyticsStore();

  const isCacheValid = useMemo(() => {
    if (!lastUpdated) return false;
    return Date.now() - lastUpdated < CACHE_DURATION;
  }, [lastUpdated]);

  const fetchAnalytics = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValid) return;

    try {
      setIsLoading(true);
      setError(null);

      const [contractBal, userBal, deposits, withdrawals] = await Promise.all([
        getContractBalance(),
        address ? getUserBalance(address) : Promise.resolve('0'),
        getDepositEvents(address ?? undefined),
        getWithdrawalEvents(address ?? undefined),
      ]);

      setContractBalance(contractBal);
      setUserBalance(userBal);
      setDepositHistory(deposits);
      setWithdrawalHistory(withdrawals);
      setTotalDeposited(calculateTotalDeposited(deposits));
      setTotalWithdrawn(calculateTotalWithdrawn(withdrawals));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [address, isCacheValid, setIsLoading, setError, setContractBalance, setUserBalance, setDepositHistory, setWithdrawalHistory, setTotalDeposited, setTotalWithdrawn]);

  const formatBalance = useCallback((wei: string): string => {
    if (!wei || wei === '0') return '0';
    try {
      return (Number(BigInt(wei)) / 1e18).toFixed(6);
    } catch {
      return '0';
    }
  }, []);

  const chartData = useMemo(() => {
    const allDates = new Set<string>();
    depositHistory.forEach(d => allDates.add(d.date));
    withdrawalHistory.forEach(w => allDates.add(w.date));
    
    const sortedDates = Array.from(allDates).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );

    let cumulativeDeposits = 0;
    let cumulativeWithdrawals = 0;

    return sortedDates.map(date => {
      const dayDeposits = depositHistory
        .filter(d => d.date === date)
        .reduce((sum, d) => sum + Number(BigInt(d.amount)), 0);
      
      const dayWithdrawals = withdrawalHistory
        .filter(w => w.date === date)
        .reduce((sum, w) => sum + Number(BigInt(w.amount)), 0);

      cumulativeDeposits += dayDeposits;
      cumulativeWithdrawals += dayWithdrawals;

      return {
        date,
        deposits: cumulativeDeposits / 1e18,
        withdrawals: cumulativeWithdrawals / 1e18,
        netBalance: (cumulativeDeposits - cumulativeWithdrawals) / 1e18,
      };
    });
  }, [depositHistory, withdrawalHistory]);

  return {
    totalDeposited,
    totalWithdrawn,
    contractBalance,
    userBalance,
    depositHistory,
    withdrawalHistory,
    isLoading,
    error,
    chartData,
    fetchAnalytics,
    formatBalance,
  };
}