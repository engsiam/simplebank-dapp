'use client';

import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useTransactions } from '@/hooks/useTransactions';
import { useMounted } from '@/hooks/useMounted';
import { Web3Layout } from '@/components/layout/Web3Layout';
import { WalletButton } from '@/components/wallet/WalletButton';
import { WalletStatus } from '@/components/wallet/WalletStatus';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { FilterBar } from '@/components/transactions/FilterBar';
import { Pagination } from '@/components/transactions/Pagination';

export default function TransactionsPage() {
  const { isConnected } = useWallet();
  const isMounted = useMounted();
  const {
    transactions,
    totalTransactions,
    isLoading,
    error,
    filters,
    pagination,
    totalPages,
    fetchTransactions,
    handleFilterChange,
    handleSearchChange,
    handlePageChange,
    formatAmount,
    formatRelativeTime,
  } = useTransactions();

  useEffect(() => {
    if (isConnected && isMounted) {
      fetchTransactions();
    }
  }, [isConnected, isMounted, fetchTransactions]);

  if (!isMounted) {
    return (
      <Web3Layout navbarActions={<><WalletButton /><WalletStatus /></>}>
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-800/30 rounded-xl" />
          <div className="h-96 bg-gray-800/30 rounded-xl" />
        </div>
      </Web3Layout>
    );
  }

  if (!isConnected) {
    return (
      <Web3Layout navbarActions={<><WalletButton /><WalletStatus /></>}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Transactions</h2>
            <p className="text-gray-400 mb-6">Connect your wallet to view transaction history.</p>
            <WalletButton />
          </div>
        </div>
      </Web3Layout>
    );
  }

  return (
    <Web3Layout navbarActions={<><WalletButton /><WalletStatus /></>}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <p className="text-gray-400 mt-1">Your deposit and withdrawal history</p>
          </div>
          <button
            onClick={() => fetchTransactions(true)}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <FilterBar
          searchValue=""
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          currentFilter={filters.type as 'all' | 'deposit' | 'withdrawal'}
          totalResults={totalTransactions}
        />

        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {isLoading && transactions.length === 0 ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-800/20 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchTransactions(true)}
                className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <TransactionTable
                transactions={transactions}
                formatAmountFn={formatAmount}
                formatRelativeTime={formatRelativeTime}
              />
              <Pagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </Web3Layout>
  );
}