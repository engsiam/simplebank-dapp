import { isEthersError } from '@/types/index';

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