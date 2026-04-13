'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface DepositFormProps {
  onDeposit: (amount: string) => Promise<void>;
  isLoading: boolean;
}

export function DepositForm({ onDeposit, isLoading }: DepositFormProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    await onDeposit(amount);
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        step="0.01"
        min="0"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        label="Amount"
      />
      <Button type="submit" isLoading={isLoading} disabled={!amount || parseFloat(amount) <= 0} className="w-full">
        Deposit
      </Button>
    </form>
  );
}