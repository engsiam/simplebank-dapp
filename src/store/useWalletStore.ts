import { create } from 'zustand';

const STORAGE_KEY = 'wallet_connected';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: string | null;
}

interface WalletActions {
  setAddress: (address: string | null) => void;
  setChainId: (chainId: string | null) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
  disconnect: () => void;
}

type WalletStore = WalletState & WalletActions;

function saveToStorage(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    localStorage.setItem(STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const useWalletStore = create<WalletStore>((set) => ({
  address: null,
  isConnected: false,
  isConnecting: false,
  chainId: null,

  setAddress: (address) => set({ address, isConnected: !!address }),

  setChainId: (chainId) => set({ chainId }),

  setIsConnecting: (isConnecting) => set({ isConnecting }),

  setIsConnected: (isConnected) => set({ isConnected }),

  disconnect: () => {
    saveToStorage(false);
    set({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
    });
  },
}));