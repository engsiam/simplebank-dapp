'use client';

import { ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function DashboardCard({ children, className = '', title }: DashboardCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}