'use client';

import { DashboardCard } from '@/components/layout/DashboardCard';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { AreaChart } from './AreaChart';

interface ChartsProps {
  data: Array<{
    date: string;
    deposits: number;
    withdrawals: number;
    netBalance: number;
  }>;
  isLoading?: boolean;
}

function ChartSkeleton() {
  return <div className="h-[300px] w-full bg-gray-800/30 animate-pulse rounded-xl" />;
}

export function Charts({ data, isLoading }: ChartsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Deposits Over Time"><ChartSkeleton /></DashboardCard>
        <DashboardCard title="Withdrawals Over Time"><ChartSkeleton /></DashboardCard>
        <DashboardCard title="Net Balance Growth" className="lg:col-span-2"><ChartSkeleton /></DashboardCard>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Deposits Over Time">
          <div className="h-[300px] flex items-center justify-center text-gray-500">No deposit data</div>
        </DashboardCard>
        <DashboardCard title="Withdrawals Over Time">
          <div className="h-[300px] flex items-center justify-center text-gray-500">No withdrawal data</div>
        </DashboardCard>
        <DashboardCard title="Net Balance Growth" className="lg:col-span-2">
          <div className="h-[300px] flex items-center justify-center text-gray-500">No balance data</div>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DashboardCard title="Deposits Over Time">
        <LineChart data={data} />
      </DashboardCard>
      <DashboardCard title="Withdrawals Over Time">
        <BarChart data={data} />
      </DashboardCard>
      <DashboardCard title="Net Balance Growth" className="lg:col-span-2">
        <AreaChart data={data} />
      </DashboardCard>
    </div>
  );
}