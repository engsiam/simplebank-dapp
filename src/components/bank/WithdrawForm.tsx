'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface WithdrawFormProps {
  onWithdraw: (amount: string) => Promise<void>;
  isLoading: boolean;
  userBalance: string;
}

export function WithdrawForm({ onWithdraw, isLoading, userBalance }: WithdrawFormProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const maxAmount = userBalance || '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount) {
      setError('Enter amount');
      return;
    }

    const value = Number(amount);
    const max = Number(maxAmount);

    if (value <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (value > max) {
      setError('Insufficient balance');
      return;
    }

    try {
      await onWithdraw(amount);
      setAmount('');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Withdraw failed';
      setError(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        step="0.0001"
        min="0"
        max={maxAmount}
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        label="Amount"
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      <button
        type="button"
        onClick={() => setAmount(maxAmount)}
        className="text-xs text-blue-400 hover:underline"
      >
        Use Max ({maxAmount} ETH)
      </button>
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!amount || isLoading}
        className="w-full"
      >
        Withdraw
      </Button>
    </form>
  );
}