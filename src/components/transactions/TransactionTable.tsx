'use client';

import { useState, useCallback, useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { formatAddress, getEtherscanUrl } from '@/lib/transactions';

interface TransactionTableProps {
  transactions: Transaction[];
  formatAmountFn: (wei: string) => string;
  formatRelativeTime: (timestamp: number) => string;
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

export function TransactionTable({ transactions, formatAmountFn, formatRelativeTime }: TransactionTableProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const handleCopy = useCallback((hash: string) => {
    copyToClipboard(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  }, []);

  const handleRowClick = useCallback((hash: string) => {
    window.open(getEtherscanUrl(hash), '_blank');
  }, []);

  const dateGroups = useMemo(() => {
    const groups: Record<string, { deposits: number; withdrawals: number; txs: Transaction[] }> = {};
    
    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = { deposits: 0, withdrawals: 0, txs: [] };
      }
      
      groups[date].txs.push(tx);
      if (tx.type === 'deposit') {
        groups[date].deposits++;
      } else {
        groups[date].withdrawals++;
      }
    });
    
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [transactions]);

  const uniqueDates = useMemo(() => {
    return ['all', ...dateGroups.map(([date]) => date)];
  }, [dateGroups]);

  const filteredData = useMemo(() => {
    if (selectedDate === 'all') {
      return dateGroups;
    }
    return dateGroups.filter(([date]) => date === selectedDate);
  }, [dateGroups, selectedDate]);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Filter by date:</span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Dates ({transactions.length} transactions)</option>
            {dateGroups.map(([date, data]) => (
              <option key={date} value={date}>
                {date} ({data.txs.length} transactions)
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-400">
          Total: <span className="text-white font-medium">{transactions.length}</span> transactions
        </div>
      </div>

      {filteredData.map(([date, data]) => (
        <div key={date} className="space-y-2">
          <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">{date}</span>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {data.deposits} Deposits
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  {data.withdrawals} Withdrawals
                </span>
              </div>
            </div>
            <span className="text-gray-400 text-sm">{data.txs.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Tx Hash</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">From</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">To</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Time</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.txs.map((tx) => (
                  <tr
                    key={tx.hash}
                    onClick={() => handleRowClick(tx.hash)}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 group">
                        <span 
                          className="text-purple-400 font-mono text-sm hover:text-purple-300 transition-colors"
                          title={tx.hash}
                        >
                          {formatAddress(tx.hash)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(tx.hash);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                          title={copiedHash === tx.hash ? 'Copied!' : 'Copy'}
                        >
                          {copiedHash === tx.hash ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          tx.type === 'deposit'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {tx.type === 'deposit' ? (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        )}
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-mono text-sm">{formatAddress(tx.from)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-mono text-sm">{formatAddress(tx.to)}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold ${tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatAmountFn(tx.amount)} ETH
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-gray-400 text-sm">{formatRelativeTime(tx.timestamp)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'success'
                            ? 'bg-green-500/20 text-green-400'
                            : tx.status === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {tx.status === 'success' ? (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : tx.status === 'failed' ? (
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}