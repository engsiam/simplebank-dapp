'use client';

import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/Button';
import { useMounted } from '@/hooks/useMounted';

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletStatus() {
  const { address, chainId, isConnected, disconnect } = useWallet();
  const mounted = useMounted();

  if (!mounted || !isConnected || !address) {
    return null;
  }

  const isCorrectNetwork = chainId === '0xaa36a7';

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
        <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span className="text-white text-sm font-mono">{shortenAddress(address)}</span>
      </div>
      <Button
        onClick={disconnect}
        className="!py-2 !px-3 !text-xs !bg-gray-700/50 !text-gray-300 hover:!bg-gray-600/50"
      >
        Disconnect
      </Button>
    </div>
  );
}