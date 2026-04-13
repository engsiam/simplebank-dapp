export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: string | null;
  isCorrectNetwork: boolean;
}

export interface WalletActions {
  setAddress: (address: string | null) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setChainId: (chainId: string | null) => void;
  setIsCorrectNetwork: (isCorrect: boolean) => void;
  reset: () => void;
}

export type WalletStore = WalletState & WalletActions;

export interface ContractState {
  contractBalance: string;
  userBalance: string;
  isLoading: boolean;
}

export interface ContractActions {
  setContractBalance: (balance: string) => void;
  setUserBalance: (balance: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export type ContractStore = ContractState & ContractActions;