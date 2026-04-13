'use client';

import { useEffect, useState, useMemo } from 'react';
import { useWallet } from '@/hooks/useWallet';
import {
  fetchTransactionEvents,
  filterTransactions,
  formatAmount,
} from '@/lib/transactions';

import { Transaction, FilterType } from '@/types/transaction';

import { FilterBar } from './FilterBar';
import { Pagination } from './Pagination';
import { TransactionTable } from './TransactionTable';

export default function TransactionsPage() {
  const { address } = useWallet();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // 🔥 FETCH TRANSACTIONS
  useEffect(() => {
    if (!address) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchTransactionEvents(address);

        console.log('Fetched TX:', data); // DEBUG

        setTransactions(data);
      } catch (err) {
        console.error('TX fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [address]);

  // 🔍 FILTER + SEARCH
  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filterType, search);
  }, [transactions, filterType, search]);

  // 📄 PAGINATION
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 🔍 FILTER BAR */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        onFilterChange={(type) => {
          setFilterType(type);
          setPage(1); // reset page
        }}
        currentFilter={filterType}
        totalResults={filteredTransactions.length}
      />

      {/* 📊 TABLE */}
      <TransactionTable
        transactions={paginatedTransactions}
        formatAmountFn={formatAmount}
        formatRelativeTime={(ts) =>
          new Date(ts).toLocaleString()
        }
      />

      {/* 📄 PAGINATION */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}