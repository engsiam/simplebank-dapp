'use client';

interface BalanceCardProps {
  contractBalance: string;
  userBalance: string;
  isLoading: boolean;
}

function formatBalance(value: string): string {
  if (!value) return '0';

  if(value.includes('.')) {
     return Number(value).toFixed(4);
  }

  try {
    const wei = BigInt(value);
    const eth = Number(wei) / 1e18;
    return eth.toFixed(6);
  } catch {
    return '0';
  }
}

export function BalanceCard({ contractBalance, userBalance, isLoading }: BalanceCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-sm text-gray-400 mb-1">Your Balance</p>
        <p className="text-2xl font-bold text-white">
          {isLoading ? (
            <span className="text-gray-500">Loading...</span>
          ) : (
            `${formatBalance(userBalance)} ETH`
          )}
        </p>
      </div>
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-sm text-gray-400 mb-1">Contract Balance</p>
        <p className="text-2xl font-bold text-white">
          {isLoading ? (
            <span className="text-gray-500">Loading...</span>
          ) : (
            `${formatBalance(contractBalance)} ETH`
          )}
        </p>
      </div>
    </div>
  );
}