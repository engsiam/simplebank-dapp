'use client';

import { ReactNode } from 'react';

interface NavbarProps {
  children?: ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">SimpleBank</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Transactions</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics</a>
          </div>

          <div className="flex items-center gap-4">
            {children}
          </div>
        </div>
      </div>
    </nav>
  );
}