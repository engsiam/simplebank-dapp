import { useState, useCallback } from 'react';
import { deposit as depositEth, withdraw as withdrawEth, getUserBalance, getContractBalance } from '@/lib/contract';

export interface ContractState {
  contractBalance: string;
  userBalance: string;
  isLoading: boolean;
  error: string | null;
}

export function useContract(userAddress: string | null) {
  const [state, setState] = useState<ContractState>({
    contractBalance: '0',
    userBalance: '0',
    isLoading: false,
    error: null,
  });

  const fetchBalances = useCallback(async () => {
    if (!userAddress) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const [contractBal, userBal] = await Promise.all([
        getContractBalance(),
        getUserBalance(userAddress),
      ]);
      
      setState(prev => ({
        ...prev,
        contractBalance: contractBal,
        userBalance: userBal,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balances';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, [userAddress]);

  const deposit = useCallback(async (amount: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await depositEth(amount);
      await fetchBalances();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Deposit failed';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchBalances]);

  const withdraw = useCallback(async (amount: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await withdrawEth(amount);
      await fetchBalances();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Withdraw failed';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [fetchBalances]);

  return {
    ...state,
    fetchBalances,
    deposit,
    withdraw,
  };
}