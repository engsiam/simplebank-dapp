'use client';

import { memo } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
  data: Array<{ date: string; netBalance: number }>;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg px-3 py-2">
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-green-400 text-sm font-semibold">{payload[0].value.toFixed(6)} ETH</p>
      </div>
    );
  }
  return null;
};

function AreaChartComponent({ data }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="netBalanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v.toFixed(2)} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="netBalance" stroke="#22c55e" strokeWidth={2} fill="url(#netBalanceGradient)" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export const AreaChart = memo(AreaChartComponent);