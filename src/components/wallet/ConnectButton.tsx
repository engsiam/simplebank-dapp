'use client';

import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/Button';

export function ConnectButton() {
  const { connect, isConnecting, isConnected } = useWallet();

  if (isConnected) {
    return null;
  }

  return (
    <Button onClick={connect} isLoading={isConnecting}>
      Connect Wallet
    </Button>
  );
}