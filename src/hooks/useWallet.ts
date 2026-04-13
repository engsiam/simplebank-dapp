import { useEffect, useCallback } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { getAccount, getChainId } from '@/lib/ethers';
import { SEPOLIA_CHAIN_ID } from '@/constants/config';

declare global {
  interface Window {
    ethereum?: {
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export function useWallet() {
  const { address, isConnected, isConnecting, chainId, isCorrectNetwork, setAddress, setIsConnecting, setChainId, setIsCorrectNetwork, reset } = useWalletStore();

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      setIsConnecting(true);
      const account = await getAccount();
      setAddress(account);
      
      const currentChainId = await getChainId();
      setChainId(currentChainId);
      setIsCorrectNetwork(currentChainId === SEPOLIA_CHAIN_ID);
    } catch (error) {
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [setAddress, setIsConnecting, setChainId, setIsCorrectNetwork]);

  const disconnect = useCallback(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return;
    }

    const handleAccountsChanged = (accounts: unknown) => {
      const typedAccounts = accounts as string[];
      if (typedAccounts.length === 0) {
        reset();
      } else {
        setAddress(typedAccounts[0]);
      }
    };

    const handleChainChanged = (chainId: unknown) => {
      const typedChainId = chainId as string;
      setChainId(typedChainId);
      setIsCorrectNetwork(typedChainId === SEPOLIA_CHAIN_ID);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [setAddress, setChainId, setIsCorrectNetwork, reset]);

  return {
    address,
    isConnected,
    isConnecting,
    chainId,
    isCorrectNetwork,
    connect,
    disconnect,
  };
}