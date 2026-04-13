import { create } from 'zustand';
import { WalletStore } from '@/types';

export const useWalletStore = create<WalletStore>((set) => ({
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,
  isCorrectNetwork: false,

  setAddress: (address) =>
    set({ address, isConnected: !!address }),

  setIsConnecting: (isConnecting) => set({ isConnecting }),

  setChainId: (chainId) => set({ chainId }),

  setIsCorrectNetwork: (isCorrectNetwork) => set({ isCorrectNetwork }),

  reset: () =>
    set({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      isCorrectNetwork: false,
    }),
}));