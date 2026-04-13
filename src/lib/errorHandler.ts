import { isEthersError, WalletErrorCode } from '@/types/index';

export function parseEthersError(error: unknown): string {
  if (!isEthersError(error)) {
    return 'Unknown error occurred';
  }

  if (error.code === 4001) {
    return 'Transaction cancelled by user';
  }

  if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'Not enough ETH for gas fee';
  }

  if (error.reason) {
    return error.reason;
  }

  if (error.shortMessage) {
    return error.shortMessage;
  }

  if (error.data?.message) {
    return error.data.message;
  }

  return 'Transaction failed. Please try again.';
}

export function parseWalletError(error: unknown): { code: WalletErrorCode; message: string } {
  if (!isEthersError(error)) {
    return { code: 'UNKNOWN', message: 'Something went wrong' };
  }

  const code = error.code;

  if (code === 4001) {
    return { code: 4001, message: 'Transaction cancelled by user' };
  }

  if (code === 'INSUFFICIENT_FUNDS') {
    return { code: 'INSUFFICIENT_FUNDS', message: 'Not enough ETH' };
  }

  if (code === -32603 || code === 'NETWORK_ERROR') {
    return { code: 'NETWORK_ERROR', message: 'Network error. Please check your connection.' };
  }

  if (code === 'TIMEOUT' || code === -32603) {
    return { code: 'TIMEOUT', message: 'Request timed out. Please try again.' };
  }

  if (error.shortMessage) {
    const shortMsg = error.shortMessage.toLowerCase();
    
    if (shortMsg.includes('user rejected')) {
      return { code: 4001, message: 'Transaction cancelled by user' };
    }
    
    if (shortMsg.includes('insufficient funds')) {
      return { code: 'INSUFFICIENT_FUNDS', message: 'Not enough ETH' };
    }

    return { code: 'UNKNOWN', message: error.shortMessage };
  }

  if (error.reason) {
    return { code: 'UNKNOWN', message: error.reason };
  }

  return { code: 'UNKNOWN', message: 'Something went wrong' };
}