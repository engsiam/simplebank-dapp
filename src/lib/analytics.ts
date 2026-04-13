import { Contract } from 'ethers';
import { getSigner } from './ethers';
import { CONTRACT_ADDRESS } from '@/constants/config';
import { TransactionData } from '@/types/analytics';

const ABI = [
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function balances(address) view returns (uint256)',
  'function getContractBalance() view returns (uint256)',
  'event Deposit(address indexed user, uint256 amount, uint256 timestamp)',
  'event Withdrawal(address indexed user, uint256 amount, uint256 timestamp)'
] as const;

let contractInstance: Contract | null = null;

export async function getContract(): Promise<Contract> {
  if (contractInstance) return contractInstance;
  
  const signer = await getSigner();
  contractInstance = new Contract(CONTRACT_ADDRESS, ABI, signer);
  return contractInstance;
}

export async function getContractBalance(): Promise<string> {
  const contract = await getContract();
  const balance = await contract.getContractBalance();
  return balance.toString();
}

export async function getUserBalance(userAddress: string): Promise<string> {
  const contract = await getContract();
  const balance = await contract.balances(userAddress);
  return balance.toString();
}

export async function getDepositEvents(userAddress?: string): Promise<TransactionData[]> {
  const contract = await getContract();
  const filter = contract.filters.Deposit(userAddress);
  const events = await contract.queryFilter(filter, 0, 'latest');
  
  return events
    .filter((e): e is typeof e & { args: { user: string; amount: bigint; timestamp: bigint } } => 'args' in e)
    .map((event) => {
      const { amount, timestamp } = event.args;
      return {
        hash: event.transactionHash,
        amount: amount.toString(),
        timestamp: Number(timestamp) * 1000,
        date: new Date(Number(timestamp) * 1000).toLocaleDateString(),
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

export async function getWithdrawalEvents(userAddress?: string): Promise<TransactionData[]> {
  const contract = await getContract();
  const filter = contract.filters.Withdrawal(userAddress);
  const events = await contract.queryFilter(filter, 0, 'latest');
  
  return events
    .filter((e): e is typeof e & { args: { user: string; amount: bigint; timestamp: bigint } } => 'args' in e)
    .map((event) => {
      const { amount, timestamp } = event.args;
      return {
        hash: event.transactionHash,
        amount: amount.toString(),
        timestamp: Number(timestamp) * 1000,
        date: new Date(Number(timestamp) * 1000).toLocaleDateString(),
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function calculateTotalDeposited(transactions: TransactionData[]): string {
  return transactions.reduce((sum, tx) => sum + BigInt(tx.amount), BigInt(0)).toString();
}

export function calculateTotalWithdrawn(transactions: TransactionData[]): string {
  return transactions.reduce((sum, tx) => sum + BigInt(tx.amount), BigInt(0)).toString();
}

export function formatEth(wei: string): string {
  if (!wei || wei === '0') return '0';
  try {
    return (Number(BigInt(wei)) / 1e18).toFixed(6);
  } catch {
    return '0';
  }
}