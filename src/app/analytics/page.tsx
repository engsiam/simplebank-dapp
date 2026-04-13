'use client';

import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useAnalytics } from '@/hooks/useAnalytics';
import { StatsCard } from '@/components/analytics/StatsCard';
import { Charts } from '@/components/analytics/Charts';
import { Web3Layout } from '@/components/layout/Web3Layout';
import { WalletButton } from '@/components/wallet/WalletButton';
import { WalletStatus } from '@/components/wallet/WalletStatus';

function DepositIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function WithdrawIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );
}

function ContractIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

export default function AnalyticsPage() {
  const { isConnected } = useWallet();
  const { totalDeposited, totalWithdrawn, contractBalance, userBalance, isLoading, error, chartData, fetchAnalytics, formatBalance } = useAnalytics();

  useEffect(() => {
    if (isConnected) {
      fetchAnalytics();
    }
  }, [isConnected, fetchAnalytics]);

  if (!isConnected) {
    return (
      <Web3Layout navbarActions={<><WalletButton /><WalletStatus /></>}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Analytics Dashboard</h2>
            <p className="text-gray-400 mb-6">Connect your wallet to view analytics.</p>
            <WalletButton />
          </div>
        </div>
      </Web3Layout>
    );
  }

  return (
    <Web3Layout navbarActions={<><WalletButton /><WalletStatus /></>}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Track your deposits and withdrawals</p>
          </div>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">{error}</div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Deposited" value={`${formatBalance(totalDeposited)} ETH`} icon={<DepositIcon />} isLoading={isLoading} />
          <StatsCard title="Total Withdrawn" value={`${formatBalance(totalWithdrawn)} ETH`} icon={<WithdrawIcon />} isLoading={isLoading} />
          <StatsCard title="Contract Balance" value={`${formatBalance(contractBalance)} ETH`} icon={<ContractIcon />} isLoading={isLoading} />
          <StatsCard title="Your Balance" value={`${formatBalance(userBalance)} ETH`} icon={<WalletIcon />} isLoading={isLoading} />
        </div>

        <Charts data={chartData} isLoading={isLoading} />
      </div>
    </Web3Layout>
  );
}