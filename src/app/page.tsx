'use client';

import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useContract } from '@/hooks/useContract';
import { WalletButton } from '@/components/wallet/WalletButton';
import { WalletStatus } from '@/components/wallet/WalletStatus';
import { DepositForm } from '@/components/bank/DepositForm';
import { WithdrawForm } from '@/components/bank/WithdrawForm';
import { BalanceCard } from '@/components/bank/BalanceCard';
import { Web3Layout } from '@/components/layout/Web3Layout';
import { DashboardCard } from '@/components/layout/DashboardCard';
import { useMounted } from '@/hooks/useMounted';
import toast from 'react-hot-toast';

export default function Home() {
  const { address, isConnected, chainId } = useWallet();
  const isCorrectNetwork = chainId === '0xaa36a7';
  const { contractBalance, userBalance, isLoading, fetchBalances, deposit, withdraw } = useContract(address);
  const mounted = useMounted();

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      fetchBalances();
    }
  }, [isConnected, isCorrectNetwork, address, fetchBalances]);

  const handleDeposit = async (amount: string) => {
    try {
      await deposit(amount);
      toast.success(`Successfully deposited ${amount} ETH`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Deposit failed';
      toast.error(message);
      throw error;
    }
  };

  const handleWithdraw = async (amount: string) => {
    try {
      await withdraw(amount);
      toast.success(`Successfully withdrew ${amount} ETH`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Withdraw failed';
      toast.error(message);
      throw error;
    }
  };

  if (!mounted) {
    return (
      <Web3Layout navbarActions={null}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your ETH deposits and withdrawals</p>
        </div>
      </Web3Layout>
    );
  }

  return (
    <Web3Layout navbarActions={<><WalletButton /><WalletStatus /></>}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage your ETH deposits and withdrawals</p>
      </div>

      {!isConnected ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <DashboardCard className="max-w-md mx-auto text-center p-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">Welcome to SimpleBank</h2>
            <p className="text-gray-400 mb-6">
              Connect your MetaMask wallet to deposit and withdraw ETH on the Sepolia testnet.
            </p>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </DashboardCard>
        </div>
      ) : !isCorrectNetwork ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <DashboardCard className="max-w-md mx-auto text-center p-10 border-red-500/30">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-400 mb-3">Wrong Network</h2>
            <p className="text-gray-400">
              Please switch to Sepolia testnet to use SimpleBank.
            </p>
          </DashboardCard>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardCard title="Your Balances" className="md:col-span-2">
            <BalanceCard
              contractBalance={contractBalance}
              userBalance={userBalance}
              isLoading={isLoading}
            />
          </DashboardCard>
          <DashboardCard title="Deposit ETH">
            <DepositForm onDeposit={handleDeposit} isLoading={isLoading} />
          </DashboardCard>
          <DashboardCard title="Withdraw ETH">
            <WithdrawForm
              onWithdraw={handleWithdraw}
              isLoading={isLoading}
              userBalance={userBalance}
            />
          </DashboardCard>
        </div>
      )}
    </Web3Layout>
  );
}