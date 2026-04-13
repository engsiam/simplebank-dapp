import { Contract, EventLog } from 'ethers';
import { getSigner } from './ethers';
import { CONTRACT_ADDRESS } from '@/constants/config';
import { Transaction } from '@/types/transaction';

const ABI = [
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function balances(address) view returns (uint256)',
  'function getContractBalance() view returns (uint256)',
  'event Deposit(address indexed user, uint256 amount, uint256 timestamp)',
  'event Withdrawal(address indexed user, uint256 amount, uint256 timestamp)'
] as const;

async function getContract(): Promise<Contract> {
  const signer = await getSigner();
  return new Contract(CONTRACT_ADDRESS, ABI, signer);
}

export async function fetchTransactionEvents(): Promise<Transaction[]> {
  const contract = await getContract();
  
  const [depositFilter, withdrawalFilter] = await Promise.all([
    contract.filters.Deposit(),
    contract.filters.Withdrawal(),
  ]);

  const [depositEvents, withdrawalEvents] = await Promise.all([
    contract.queryFilter(depositFilter, 0, 'latest'),
    contract.queryFilter(withdrawalFilter, 0, 'latest'),
  ]);

  const transactions: Transaction[] = [];

  for (const event of depositEvents) {
    if (!(event instanceof EventLog)) continue;
    const args = event.args as unknown as { user: string; amount: bigint; timestamp: bigint };
    transactions.push({
      hash: event.transactionHash,
      type: 'deposit',
      from: args.user,
      to: CONTRACT_ADDRESS,
      amount: args.amount.toString(),
      timestamp: Number(args.timestamp) * 1000,
      status: 'success',
      blockNumber: event.blockNumber,
    });
  }

  for (const event of withdrawalEvents) {
    if (!(event instanceof EventLog)) continue;
    const args = event.args as unknown as { user: string; amount: bigint; timestamp: bigint };
    transactions.push({
      hash: event.transactionHash,
      type: 'withdrawal',
      from: CONTRACT_ADDRESS,
      to: args.user,
      amount: args.amount.toString(),
      timestamp: Number(args.timestamp) * 1000,
      status: 'success',
      blockNumber: event.blockNumber,
    });
  }

  return transactions.sort((a, b) => b.timestamp - a.timestamp);
}

export function filterTransactions(
  transactions: Transaction[],
  type: 'all' | 'deposit' | 'withdrawal',
  search: string
): Transaction[] {
  let filtered = transactions;

  if (type !== 'all') {
    filtered = filtered.filter((tx) => tx.type === type);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (tx) =>
        tx.hash.toLowerCase().includes(searchLower) ||
        tx.from.toLowerCase().includes(searchLower) ||
        tx.to.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export function formatAmount(wei: string): string {
  if (!wei || wei === '0') return '0';
  try {
    return (Number(BigInt(wei)) / 1e18).toFixed(6);
  } catch {
    return '0';
  }
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getEtherscanUrl(hash: string, network: string = 'sepolia'): string {
  return `https://${network}.etherscan.io/tx/${hash}`;
}