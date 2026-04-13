'use client';

export function Footer() {
  return (
    <footer className="w-full py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">Powered by</span>
            <span className="text-sm font-semibold text-white">Ethereum</span>
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-400">Sepolia Testnet</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="hover:text-white transition-colors">Docs</span>
            <span className="hover:text-white transition-colors">Support</span>
            <span className="hover:text-white transition-colors">Terms</span>
          </div>

          <div className="text-sm text-gray-500">
            © 2026 SimpleBank
          </div>
        </div>
      </div>
    </footer>
  );
}