import { BrowserProvider, JsonRpcSigner, Eip1193Provider } from 'ethers';

export async function getProvider(): Promise<BrowserProvider> {
  if (typeof window === 'undefined') {
    throw new Error('Window is undefined');
  }
  
  const ethereum = window.ethereum as Eip1193Provider | undefined;

  if (!ethereum) {
    throw new Error('MetaMask not installed');
  }
  
  return new BrowserProvider(ethereum);
}

export async function getSigner(): Promise<JsonRpcSigner> {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  return signer;
}

export async function getAccount(): Promise<string> {
  const provider = await getProvider();
  const accounts = await provider.send('eth_requestAccounts', []);
  
  if (accounts.length === 0) {
    throw new Error('No accounts found');
  }
  
  return accounts[0];
}

export async function getChainId(): Promise<string> {
  const provider = await getProvider();
  const network = await provider.getNetwork();
  return '0x' + network.chainId.toString(16);
}