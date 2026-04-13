import { Contract, parseEther, formatEther } from 'ethers';
import { getSigner } from './ethers';
import { CONTRACT_ADDRESS } from '@/constants/config';

const ABI = [
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function balances(address) view returns (uint256)',
  'function getContractBalance() view returns (uint256)',
  'event Deposit(address indexed user, uint256 amount)',
  'event Withdrawal(address indexed user, uint256 amount)'
] as const;

let contractInstance: Contract | null = null;

export async function getContract(): Promise<Contract> {
  if (contractInstance) {
    return contractInstance;
  }

  const signer = await getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
  
  contractInstance = contract;
  return contract;
}

export async function deposit(amount: string): Promise<void> {
  const contract = await getContract();
  const value = parseEther(amount);
  const tx = await contract.deposit({ value });
  await tx.wait();
}

export async function withdraw(amount: string): Promise<void> {
  const contract = await getContract();
  const value = parseEther(amount);
  const tx = await contract.withdraw(value);
  await tx.wait();
}

export async function getUserBalance(userAddress: string): Promise<string> {
  const contract = await getContract();
  const balance = await contract.balances(userAddress);
  return formatEther(balance);
}

export async function getContractBalance(): Promise<string> {
  const contract = await getContract();
  const balance = await contract.getContractBalance();
  return formatEther(balance);
}

export type { ABI };