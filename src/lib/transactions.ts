'use client';

import {
  Contract,
  EventLog,
  formatEther,
  BrowserProvider,
} from 'ethers';
import { getSigner } from './ethers';
import { CONTRACT_ADDRESS } from '@/constants/config';
import { Transaction } from '@/types/transaction';

const ABI = [
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function balances(address) view returns (uint256)',
  'function getContractBalance() view returns (uint256)',

  // ✅ MUST MATCH
  'event Deposit(address indexed user, uint256 amount, uint256 timestamp)',
  'event Withdrawal(address indexed user, uint256 amount, uint256 timestamp)',
] as const;

//
// ✅ Get Contract (Signer for write)
//
async function getContract(): Promise<Contract> {
  const signer = await getSigner();
  return new Contract(CONTRACT_ADDRESS, ABI, signer);
}

//
// 🔥 FETCH TRANSACTIONS
//
export async function fetchTransactionEvents(
  userAddress?: string
): Promise<Transaction[]> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('No window.ethereum');
      return [];
    }

    const contract = await getContract();

    // ✅ ethers v6 FIX (NO contract.provider)
    const provider = new BrowserProvider(window.ethereum);

    const latestBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(latestBlock - 100000, 0);
    console.log('Fetching from block', fromBlock, 'to', latestBlock);

    const depositFilter = contract.filters.Deposit();
    const withdrawalFilter = contract.filters.Withdrawal();

    console.log('Querying events...');
    const [depositEvents, withdrawalEvents] = await Promise.all([
      contract.queryFilter(depositFilter, fromBlock, latestBlock),
      contract.queryFilter(withdrawalFilter, fromBlock, latestBlock),
    ]);
    console.log('depositEvents:', depositEvents.length, 'withdrawalEvents:', withdrawalEvents.length);
    const transactions: Transaction[] = [];

    //
    // ✅ Process Deposits
    //
    for (const event of depositEvents) {
      if (!(event instanceof EventLog)) continue;

      const args = event.args as unknown as {
        user: string;
        amount: bigint;
      };

      const block = await event.getBlock();

      transactions.push({
        hash: event.transactionHash,
        type: 'deposit',
        from: args.user,
        to: CONTRACT_ADDRESS,
        amount: args.amount.toString(),
        timestamp: block.timestamp * 1000,
        status: 'success',
        blockNumber: event.blockNumber ?? 0,
      });
    }

    //
    // ✅ Process Withdrawals
    //
    for (const event of withdrawalEvents) {
      if (!(event instanceof EventLog)) continue;

      const args = event.args as unknown as {
        user: string;
        amount: bigint;
      };

      const block = await event.getBlock();

      transactions.push({
        hash: event.transactionHash,
        type: 'withdrawal',
        from: CONTRACT_ADDRESS,
        to: args.user,
        amount: args.amount.toString(),
        timestamp: block.timestamp * 1000,
        status: 'success',
        blockNumber: event.blockNumber ?? 0,
      });
    }

    //
    // ✅ SORT (FIXED TYPE ERROR)
    //
    const sorted = transactions.sort(
      (a, b) => (b.blockNumber ?? 0) - (a.blockNumber ?? 0)
    );

    //
    // ✅ FILTER USER (IMPORTANT)
    //
    if (userAddress) {
      return sorted.filter(
        (tx) =>
          tx.from.toLowerCase() === userAddress.toLowerCase() ||
          tx.to.toLowerCase() === userAddress.toLowerCase()
      );
    }

    return sorted;
  } catch (error) {
    console.error('fetchTransactionEvents error:', error);
    return [];
  }
}

//
// 🔍 FILTER FUNCTION
//
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

//
// 💰 FORMAT AMOUNT (SAFE)
//
export function formatAmount(wei: string): string {
  try {
    return Number(formatEther(wei)).toFixed(6);
  } catch {
    return '0';
  }
}

//
// 🧾 FORMAT ADDRESS
//
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

//
// 🔗 ETHERSCAN LINK
//
export function getEtherscanUrl(
  hash: string,
  network: string = 'sepolia'
): string {
  return `https://${network}.etherscan.io/tx/${hash}`;
}