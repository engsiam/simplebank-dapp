'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface Web3LayoutProps {
  children: ReactNode;
  navbarActions?: ReactNode;
}

export function Web3Layout({ children, navbarActions }: Web3LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[#0b1120]" />
      
      <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[120px] translate-x-1/3 translate-y-1/3" />
      
      <div className="fixed inset-0 -z-10 grid-pattern opacity-20" />
      
      <Navbar>
        {navbarActions}
      </Navbar>
      
      <main className="flex-1 pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}