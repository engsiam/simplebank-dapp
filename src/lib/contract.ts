import { Contract, parseEther, formatEther } from 'ethers';
import { getSigner } from './ethers';
import { CONTRACT_ADDRESS } from '@/constants/config';
import { parseEthersError } from './errorHandler';

const ABI = [
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function balances(address) view returns (uint256)',
  'function getContractBalance() view returns (uint256)',
  'event Deposit(address indexed user, uint256 amount)',
  'event Withdrawal(address indexed user, uint256 amount)'
] as const;

let contractInstance: Contract | null = null;

// ✅ Get Contract Instance (cached)
export async function getContract(): Promise<Contract> {
  if (contractInstance) return contractInstance;

  const signer = await getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

  contractInstance = contract;
  return contract;
}

// ✅ Deposit ETH
export async function deposit(amount: string): Promise<void> {
  try {
    if (!amount || Number(amount) <= 0) {
      throw new Error('Invalid amount');
    }

    const contract = await getContract();
    const value = parseEther(amount);

    const tx = await contract.deposit({ value });
    await tx.wait();

  } catch (error: unknown) {
    throw new Error(parseEthersError(error));
  }
}

// ✅ Withdraw ETH
export async function withdraw(amount: string): Promise<void> {
  try {
    if (!amount || Number(amount) <= 0) {
      throw new Error('Invalid amount');
    }

    const contract = await getContract();
    const value = parseEther(amount);

    const tx = await contract.withdraw(value);
    await tx.wait();

  } catch (error: unknown) {
    throw new Error(parseEthersError(error));
  }
}

// ✅ Get User Balance
export async function getUserBalance(userAddress: string): Promise<string> {
  try {
    if (!userAddress) return '0';

    const contract = await getContract();
    const balance = await contract.balances(userAddress);

    return formatEther(balance);

  } catch (error) {
    console.error('getUserBalance error:', error);
    return '0';
  }
}

// ✅ Get Contract Balance
export async function getContractBalance(): Promise<string> {
  try {
    const contract = await getContract();
    const balance = await contract.getContractBalance();

    return formatEther(balance);

  } catch (error) {
    console.error('getContractBalance error:', error);
    return '0';
  }
}

export type { ABI };