'use client';

import { memo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: Array<{ date: string; deposits: number }>;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg px-3 py-2">
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-purple-400 text-sm font-semibold">{payload[0].value.toFixed(6)} ETH</p>
      </div>
    );
  }
  return null;
};

function LineChartComponent({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => v.toFixed(2)} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="deposits" stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#a855f7' }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export const LineChart = memo(LineChartComponent);