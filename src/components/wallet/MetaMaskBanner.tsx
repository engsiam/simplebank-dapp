'use client';

import { Button } from '@/components/ui/Button';

interface MetaMaskBannerProps {
  onClose?: () => void;
}

export function MetaMaskBanner({ onClose }: MetaMaskBannerProps) {
  const isMobile =
    typeof window !== 'undefined' &&
    /iPhone|Android/i.test(navigator.userAgent);

  const handleInstall = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  const handleOpenMetaMask = () => {
    window.location.href = 'metamask://';
    setTimeout(() => {
      handleInstall();
    }, 1000);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-md w-full p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-orange-500/20 flex items-center justify-center">
          🦊
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">
          MetaMask Required
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-6">
          {isMobile
            ? 'Open this page in MetaMask browser or install the app.'
            : 'Install MetaMask extension to use this dApp securely.'}
        </p>

        {/* Actions */}
        {isMobile ? (
          <Button onClick={handleOpenMetaMask} className="w-full">
            Open in MetaMask
          </Button>
        ) : (
          <div className="space-y-3">
            <Button onClick={handleInstall} className="w-full">
              Install MetaMask
            </Button>

            <Button onClick={handleReload} className="w-full">
              Reload Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}