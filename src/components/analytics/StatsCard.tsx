'use client';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}

export function StatsCard({ title, value, icon, trend, isLoading }: StatsCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-700/50 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold text-white">{value}</p>
          )}
          {trend && (
            <p className={`text-xs mt-1 ${trendColors[trend]}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-xl" />
    </div>
  );
}