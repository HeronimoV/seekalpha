"use client";

import { FC, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getBalance } from "@/lib/program";
import dynamic from "next/dynamic";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export const Navbar: FC = () => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (publicKey && connected) {
      getBalance(publicKey).then(setBalance).catch(() => setBalance(null));
      const interval = setInterval(() => {
        getBalance(publicKey).then(setBalance).catch(() => setBalance(null));
      }, 15000);
      return () => clearInterval(interval);
    } else {
      setBalance(null);
    }
  }, [publicKey, connected]);

  return (
    <nav className="border-b border-seek-border sticky top-0 bg-seek-dark/95 backdrop-blur-sm z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.jpg" alt="SeekAlpha" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-seek-purple to-seek-teal bg-clip-text text-transparent">
            SeekAlpha
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-seek-purple/20 text-seek-purple border border-seek-purple/30 hidden sm:inline">
            DEVNET
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm text-gray-400 hover:text-white transition">
            Markets
          </a>
          <a href="/portfolio" className="text-sm text-gray-400 hover:text-white transition">
            Portfolio
          </a>
          <a href="/leaderboard" className="text-sm text-gray-400 hover:text-white transition">
            Leaderboard
          </a>
          <a href="/propose" className="text-sm text-gray-400 hover:text-white transition">
            Propose
          </a>
          <a href="/about" className="text-sm text-gray-400 hover:text-white transition">
            About
          </a>
          {connected && balance !== null && (
            <span className="text-sm text-seek-teal font-medium">
              {balance.toFixed(2)} SOL
            </span>
          )}
          <WalletMultiButton className="!bg-seek-purple hover:!bg-seek-purple/80 !rounded-lg !h-9 !text-sm" />
        </div>

        {/* Mobile: balance + wallet + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {connected && balance !== null && (
            <span className="text-xs text-seek-teal font-medium">
              {balance.toFixed(2)} SOL
            </span>
          )}
          <WalletMultiButton className="!bg-seek-purple hover:!bg-seek-purple/80 !rounded-lg !h-8 !text-xs !px-3" />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-seek-border px-4 py-3 space-y-1 bg-seek-dark">
          <a href="/" className="block py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
            🔮 Markets
          </a>
          <a href="/portfolio" className="block py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
            📊 Portfolio
          </a>
          <a href="/leaderboard" className="block py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
            🏆 Leaderboard
          </a>
          <a href="/propose" className="block py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
            💡 Propose Market
          </a>
          <a href="/about" className="block py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
            ℹ️ About
          </a>
          <a href="/faq" className="block py-2 text-sm text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>
            ❓ FAQ
          </a>
        </div>
      )}
    </nav>
  );
};
