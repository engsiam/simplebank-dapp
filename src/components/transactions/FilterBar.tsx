'use client';

import { useState, useCallback } from 'react';
import { FilterType } from '@/types/transaction';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (type: FilterType) => void;
  currentFilter: FilterType;
  totalResults: number;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdrawal', label: 'Withdrawals' },
];

export function FilterBar({
  searchValue,
  onSearchChange,
  onFilterChange,
  currentFilter,
  totalResults,
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    onSearchChange(value);
  }, [onSearchChange]);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentFilter === filter.value
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-nowrap">
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search by address or tx hash..."
            className="w-full sm:w-64 pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        {totalResults} result{totalResults !== 1 ? 's' : ''}
      </div>
    </div>
  );
}