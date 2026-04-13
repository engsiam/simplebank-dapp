'use client';

import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/Button';

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletInfo() {
  const { address, isConnected, isCorrectNetwork, disconnect } = useWallet();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {!isCorrectNetwork && (
        <div className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
          Wrong Network (Sepolia Required)
        </div>
      )}
      <div className="px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-sm font-mono">
        {shortenAddress(address)}
      </div>
      <Button
        onClick={disconnect}
        className="!py-2 !px-4 !text-sm !bg-gray-700 hover:!bg-gray-600"
      >
        Disconnect
      </Button>
    </div>
  );
}