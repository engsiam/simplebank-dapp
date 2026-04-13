'use client';

import { useEffect, useCallback } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { getAccount, getChainId } from '@/lib/ethers';
import { SEPOLIA_CHAIN_ID } from '@/constants/config';
import toast from 'react-hot-toast';
import { parseWalletError } from '@/lib/errorHandler';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const STORAGE_KEY = 'wallet_connected';

function getStoredFlag(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

function setStoredFlag(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    localStorage.setItem(STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function useWallet() {
  const {
    address,
    isConnected,
    isConnecting,
    chainId,
    setAddress,
    setChainId,
    setIsConnecting,
    setIsConnected,
    disconnect: storeDisconnect,
  } = useWalletStore();

  // ✅ FIXED CONNECT FUNCTION
  const connect = useCallback(async () => {
    // 🔥 NO THROW — RETURN OBJECT
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('MetaMask not installed');

      return {
        success: false,
        error: 'METAMASK_NOT_INSTALLED',
      };
    }

    try {
      setIsConnecting(true);

      const account = await getAccount();
      const currentChainId = await getChainId();

      setAddress(account);
      setChainId(currentChainId);
      setIsConnected(true);
      setStoredFlag(true);

      // ✅ Network check
      if (currentChainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });

          setChainId(SEPOLIA_CHAIN_ID);
          toast.success('Switched to Sepolia');
        } catch {
          toast.error('Please switch to Sepolia network');
        }
      } else {
        toast.success('Wallet connected');
      }

      return { success: true };

    } catch (error) {
      const parsed = parseWalletError(error);

      if (parsed.code === 4001) {
        toast.error('Connection rejected');
      } else {
        toast.error(parsed.message);
      }

      return {
        success: false,
        error: parsed.message,
      };
    } finally {
      setIsConnecting(false);
    }
  }, [setAddress, setChainId, setIsConnected, setIsConnecting]);

  // ✅ DISCONNECT
  const disconnect = useCallback(() => {
    storeDisconnect();
    setStoredFlag(false);
    toast.success('Wallet disconnected');
  }, [storeDisconnect]);

  // ✅ ACCOUNT CHANGE
  const handleAccountsChanged = useCallback((accounts: unknown) => {
    const typedAccounts = accounts as string[];

    if (typedAccounts.length === 0) {
      storeDisconnect();
      setStoredFlag(false);
    } else {
      setAddress(typedAccounts[0]);
    }
  }, [setAddress, storeDisconnect]);

  // ✅ CHAIN CHANGE
  const handleChainChanged = useCallback((newChainId: unknown) => {
    const typedChainId = newChainId as string;
    setChainId(typedChainId);

    // optional: reload or just update UI
    window.location.reload();
  }, [setChainId]);

  // ✅ LISTENERS
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [handleAccountsChanged, handleChainChanged]);

  // ✅ AUTO RECONNECT
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    if (isConnected) return;
    if (!getStoredFlag()) return;

    const attemptReconnect = async () => {
      try {
        const accounts = await window.ethereum!.request({
          method: 'eth_accounts',
        }) as string[];

        if (accounts.length > 0) {
          const account = accounts[0];
          const currentChainId = await getChainId();

          setAddress(account);
          setChainId(currentChainId);
          setIsConnected(true);
        }
      } catch {
        // silent fail
      }
    };

    attemptReconnect();
  }, [isConnected, setAddress, setChainId, setIsConnected]);

  return {
    address,
    isConnecting,
    isConnected,
    chainId,
    connect,
    disconnect,
  };
}