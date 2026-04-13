'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/Button';
import { useMounted } from '@/hooks/useMounted';
import { MetaMaskBanner } from '@/components/wallet/MetaMaskBanner';

export function WalletButton() {
  const { connect, isConnected } = useWallet();
  const mounted = useMounted();

  const [showMetaMaskBanner, setShowMetaMaskBanner] = useState(false);

  const handleConnect = async () => {
    const res = await connect();

    // ✅ HANDLE ERROR CLEANLY
    if (!res?.success) {
      if (res?.error === 'METAMASK_NOT_INSTALLED') {
        setShowMetaMaskBanner(true);
      }
    }
  };

  if (!mounted) return null;
  if (isConnected) return null;

  return (
    <>
      <Button onClick={handleConnect}>
        Connect Wallet
      </Button>

      {/* ✅ MODAL */}
      {showMetaMaskBanner && (
        <MetaMaskBanner
          onClose={() => setShowMetaMaskBanner(false)}
        />
      )}
    </>
  );
}